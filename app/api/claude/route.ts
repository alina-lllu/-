import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

// Simple in-memory rate limiter (resets on cold start — fine for MVP)
const rateLimit = new Map<string, number[]>();
const MAX_RPM = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const times = (rateLimit.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (times.length >= MAX_RPM) return false;
  rateLimit.set(ip, [...times, now]);
  return true;
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[claude] ANTHROPIC_API_KEY not set');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = await req.json();
  const { messages, systemPrompt, contextNote } = body as {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    systemPrompt: string;
    contextNote?: string;
  };

  if (!messages || !systemPrompt) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Sanitize user messages: truncate to 500 chars each to prevent abuse
  const sanitized = messages.map((m) => ({
    ...m,
    content: m.content.slice(0, 500),
  }));

  const fullSystem = contextNote
    ? `${systemPrompt}\n\n[当前场景：${contextNote}]`
    : systemPrompt;

  try {
    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: fullSystem,
      messages: sanitized,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`
                )
              );
            }
          }
          const finalMsg = await stream.finalMessage();
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, stopReason: finalMsg.stop_reason })}\n\n`
            )
          );
        } catch (err) {
          console.error('[claude] stream error:', err);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: true })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('[claude] API error:', err);
    return NextResponse.json({ error: 'Claude API failed' }, { status: 500 });
  }
}
