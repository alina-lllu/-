'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Background } from './Background';
import { CharacterSprite } from './CharacterSprite';
import { DialogueBox } from './DialogueBox';
import { ChoicePanel } from './ChoicePanel';
import { AIInputPanel } from './AIInputPanel';
import { useGameStore } from '@/lib/gameStore';
import {
  loadScene, buildLineIndex, buildSequentialNextMap,
  getNextLineId, detectEmotion,
} from '@/lib/gameEngine';
import type { Scene, ScriptLine, ChoiceOption, AiDialogueLine, Emotion } from '@/lib/types';

// Hydration boundary: prevents Zustand persist from causing SSR/CSR mismatch.
// The game is purely client-side, so we render nothing until mounted.
function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function GameLayout() {
  const hydrated = useHydrated();
  const store = useGameStore();
  const [scene, setScene] = useState<Scene | null>(null);
  const [lineIndex, setLineIndex] = useState<Map<string, ScriptLine>>(new Map());
  const [seqNext, setSeqNext] = useState<Map<string, string>>(new Map());
  const [currentLine, setCurrentLine] = useState<ScriptLine | null>(null);
  const [characterVisible, setCharacterVisible] = useState(false);
  const [characterEmotion, setCharacterEmotion] = useState<Emotion>('neutral');
  const [characterSrc, setCharacterSrc] = useState('');
  const [bgSrc, setBgSrc] = useState('');
  const charDataRef = useRef<Record<string, any>>({});

  // Stores the last user text so 'error' state can retry without re-typing
  const lastUserTextRef = useRef('');
  // Pending AI text from inline ChoicePanel expand
  const pendingAiTextRef = useRef('');
  // Tracks whether early emotion detection fired this response
  const emotionDetectedRef = useRef(false);

  // ── scene loader ──────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const s = await loadScene(store.sceneId);
        if (!isMounted) return;
        const idx = buildLineIndex(s);
        const seq = buildSequentialNextMap(s);
        setScene(s);
        setLineIndex(idx);
        setSeqNext(seq);
        setBgSrc(s.background);
        if (s.initialEmotion) setCharacterEmotion(s.initialEmotion as Emotion);

        // Preload all characters referenced in this scene
        const cids = new Set<string>();
        for (const line of s.lines) {
          if ('character' in line) cids.add((line as any).character);
          if ('speaker' in line) cids.add((line as any).speaker);
        }
        await Promise.all(
          Array.from(cids).map(async (cid) => {
            if (charDataRef.current[cid]) return;
            try {
              const r = await fetch(`/script/characters/${cid}.json`);
              if (r.ok) charDataRef.current[cid] = await r.json();
            } catch {}
          })
        );
        if (!isMounted) return;

        const startLine = idx.get(store.lineId) ?? idx.values().next().value;
        if (startLine) setCurrentLine(startLine);
      } catch (e) {
        console.error('[GameLayout] failed to load scene:', e);
      }
    }
    init();
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.sceneId]);

  // ── auto-submit pending AI text when we land on an ai_dialogue line ───────
  useEffect(() => {
    if (
      currentLine?.type === 'ai_dialogue' &&
      pendingAiTextRef.current &&
      store.aiResponseState === 'idle'
    ) {
      const text = pendingAiTextRef.current;
      pendingAiTextRef.current = '';
      handleAiSubmit(text);
    }
  // handleAiSubmit is stable (useCallback); currentLine changes are the trigger
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLine]);

  // ── navigate to a line id ─────────────────────────────────────────────────
  const goToLine = useCallback((id: string) => {
    if (!lineIndex.has(id) && id.includes('_scene')) {
      store.setScene(id, '');
      return;
    }

    const line = lineIndex.get(id);
    if (!line) return;

    if (line.type === 'character_enter') {
      const cd = charDataRef.current[line.character];
      if (cd) {
        setCharacterSrc(cd.sprites?.[line.emotion] ?? cd.sprites?.['neutral'] ?? '');
        setCharacterEmotion(line.emotion as Emotion);
      }
      setCharacterVisible(true);
      store.setLineId(line.id);
      const next = getNextLineId(line, store.affection) ?? seqNext.get(line.id);
      if (next) goToLine(next);
      return;
    }

    if (line.type === 'affection_branch') {
      const next = getNextLineId(line, store.affection);
      if (next) goToLine(next);
      return;
    }

    store.setLineId(line.id);
    setCurrentLine(line);

    if (line.type === 'dialogue') {
      const cd = charDataRef.current[line.speaker];
      if (cd) {
        setCharacterSrc(cd.sprites?.[line.emotion] ?? cd.sprites?.['neutral'] ?? '');
        setCharacterEmotion(line.emotion as Emotion);
      }
      setCharacterVisible(true);
    }

    if (line.type === 'narration') {
      setCharacterVisible(false);
    }

    // Show 'thinking' emotion when entering AI dialogue (player is about to type)
    if (line.type === 'ai_dialogue') {
      const cd = charDataRef.current[(line as AiDialogueLine).character];
      if (cd?.sprites?.['thinking']) {
        setCharacterSrc(cd.sprites['thinking']);
        setCharacterEmotion('thinking' as Emotion);
      }
      setCharacterVisible(true);
    }
  }, [lineIndex, seqNext, store]);

  // ── advance on click ──────────────────────────────────────────────────────
  const handleAdvance = useCallback(() => {
    if (!currentLine) return;
    if (
      store.aiResponseState === 'loading' ||
      store.aiResponseState === 'streaming'
    ) return;

    const next =
      getNextLineId(currentLine, store.affection) ??
      seqNext.get(currentLine.id);
    if (next) goToLine(next);
  }, [currentLine, store.affection, store.aiResponseState, seqNext, goToLine]);

  // ── choice selection ──────────────────────────────────────────────────────
  const handleChoiceSelect = useCallback((opt: ChoiceOption) => {
    if (opt.affectionDelta) store.addAffection('kai', opt.affectionDelta);
    goToLine(opt.next);
  }, [store, goToLine]);

  // ── inline AI select from ChoicePanel ────────────────────────────────────
  const handleChoiceAiSelect = useCallback((text: string, opt: ChoiceOption) => {
    pendingAiTextRef.current = text;
    if (opt.affectionDelta) store.addAffection('kai', opt.affectionDelta);
    goToLine(opt.next);
  }, [store, goToLine]);

  // ── AI dialogue submission ────────────────────────────────────────────────
  const handleAiSubmit = useCallback(async (userText: string) => {
    if (!currentLine || currentLine.type !== 'ai_dialogue') return;
    const line = currentLine as AiDialogueLine;
    const cd = charDataRef.current[line.character];
    if (!cd) return;

    const text = userText.trim().slice(0, 500);
    if (!text) return;

    lastUserTextRef.current = text;
    emotionDetectedRef.current = false;
    store.setAiResponseState('loading');
    store.setAiResponseText('');

    // Show 'thinking' emotion while loading
    if (cd.sprites?.['thinking']) {
      setCharacterSrc(cd.sprites['thinking']);
      setCharacterEmotion('thinking' as Emotion);
    }

    const history = (store.aiHistory[line.character] ?? []).filter(
      (m) => m.role !== 'system'
    );
    store.pushAiMessage(line.character, { role: 'user', content: text });

    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, { role: 'user', content: text }],
          systemPrompt: cd.systemPrompt.content,
          contextNote: line.contextNote,
        }),
      });

      if (!res.ok) throw new Error(`API ${res.status}`);
      if (!res.body) throw new Error('No response body');

      store.setAiResponseState('streaming');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const rawChunks = decoder.decode(value).split('\n\n').filter(Boolean);
        for (const raw of rawChunks) {
          if (!raw.startsWith('data: ')) continue;
          let parsed: any;
          try {
            parsed = JSON.parse(raw.slice(6));
          } catch {
            continue; // skip malformed chunk
          }
          if (parsed.text) {
            fullText += parsed.text;
            store.setAiResponseText(fullText);

            // Early emotion detection on first 20 chars
            if (fullText.length >= 20 && !emotionDetectedRef.current) {
              const earlyEmotion = detectEmotion(fullText, cd.emotionKeywords) as Emotion;
              setCharacterEmotion(earlyEmotion);
              setCharacterSrc(cd.sprites?.[earlyEmotion] ?? cd.sprites?.['neutral'] ?? '');
              emotionDetectedRef.current = true;
            }
          }
          if (parsed.done) store.setAiResponseState('complete');
          if (parsed.error) throw new Error('stream error');
        }
      }

      // Final emotion refinement on full text
      const finalEmotion = detectEmotion(fullText, cd.emotionKeywords) as Emotion;
      setCharacterEmotion(finalEmotion);
      setCharacterSrc(cd.sprites?.[finalEmotion] ?? cd.sprites?.['neutral'] ?? '');

      store.pushAiMessage(line.character, { role: 'assistant', content: fullText });
      store.incrementAiDialogueCount();
      store.setAiResponseState('complete');

      const pos = ['谢谢', '喜欢', '有趣', '好', '记得', '在意'];
      const neg = ['走', '烦', '随便', '无所谓', '不想'];
      if (pos.some((w) => fullText.includes(w)))
        store.addAffection(line.character, line.affectionOnPositive);
      else if (neg.some((w) => fullText.includes(w)))
        store.addAffection(line.character, line.affectionOnNegative);
      else
        store.addAffection(line.character, line.affectionOnNeutral);

    } catch (err) {
      console.error('[AI] error:', err);
      // Set 'error' state so the UI can show retry/fallback buttons
      store.setAiResponseState('error');
    }
  }, [currentLine, store]);

  // ── retry after error ─────────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    if (lastUserTextRef.current) {
      handleAiSubmit(lastUserTextRef.current);
    }
  }, [handleAiSubmit]);

  // ── use fallback line after error ─────────────────────────────────────────
  const handleFallback = useCallback(() => {
    if (!currentLine || currentLine.type !== 'ai_dialogue') return;
    const line = currentLine as AiDialogueLine;
    const cd = charDataRef.current[line.character];
    const fb = cd?.fallbackLines?.generic ?? ['……'];
    store.setAiResponseText(fb[Math.floor(Math.random() * fb.length)]);
    store.setAiResponseState('fallback');
  }, [currentLine, store]);

  // ── advance after AI response complete/fallback ───────────────────────────
  const handleAiAdvance = useCallback(() => {
    if (
      store.aiResponseState !== 'complete' &&
      store.aiResponseState !== 'fallback'
    ) return;
    store.setAiResponseState('idle');
    store.setAiResponseText('');
    if (!currentLine) return;
    const next =
      getNextLineId(currentLine, store.affection) ??
      seqNext.get(currentLine.id);
    if (next) goToLine(next);
  }, [currentLine, store, seqNext, goToLine]);

  // ── render ────────────────────────────────────────────────────────────────
  if (!hydrated || !scene || !currentLine) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#2D1B26]">
        <div className="text-[#F5ECD7]/40 text-sm tracking-widest">加载中……</div>
      </div>
    );
  }

  const isAiDialogue = currentLine.type === 'ai_dialogue';
  const isChoice = currentLine.type === 'choice';
  const isNarration = currentLine.type === 'narration';
  const aiState = store.aiResponseState;

  const dialogueSpeaker = (() => {
    if (currentLine.type === 'dialogue') return currentLine.speaker;
    if (isAiDialogue) return (currentLine as AiDialogueLine).character;
    return undefined;
  })();

  const dialogueText = (() => {
    if (isAiDialogue) {
      if (aiState === 'idle') return '……';
      if (aiState === 'error') return '……';
      return store.aiResponseText || '……';
    }
    if (currentLine.type === 'dialogue') return currentLine.text;
    if (currentLine.type === 'narration') return currentLine.text;
    if (currentLine.type === 'chapter_end') return currentLine.title;
    return '';
  })();

  const showAiInput =
    isAiDialogue && (aiState === 'idle');

  const showErrorPanel =
    isAiDialogue && aiState === 'error';

  const showAiResponse =
    isAiDialogue &&
    (aiState === 'loading' || aiState === 'streaming' ||
     aiState === 'complete' || aiState === 'fallback');

  // Character is visible unless narration; stays visible during choices
  const spriteVisible = characterVisible && !isNarration;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#2D1B26]">
      <Background src={bgSrc} />

      <CharacterSprite
        src={characterSrc}
        emotion={characterEmotion}
        visible={spriteVisible}
        position="center"
      />

      <AnimatePresence mode="wait">
        {isChoice ? (
          <ChoicePanel
            key="choice"
            prompt={(currentLine as any).prompt ?? undefined}
            options={(currentLine as any).options}
            onSelect={handleChoiceSelect}
            onAiSelect={handleChoiceAiSelect}
          />
        ) : showAiInput ? (
          <AIInputPanel
            key="ai-input"
            aiState={aiState}
            onSubmit={handleAiSubmit}
          />
        ) : showErrorPanel ? (
          // Error state D: narrative wrapper with retry/fallback
          <div
            key="ai-error"
            className="absolute bottom-0 left-0 right-0 z-30 p-4 pb-8"
          >
            <div className="max-w-2xl mx-auto bg-[#2D1B26]/90 border border-[#C9506A]/30 rounded-lg p-5 space-y-3">
              <p className="text-[#F5ECD7]/60 text-xs font-serif italic text-center">
                凯恒沉默了一会儿，似乎在整理思绪。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 py-2 text-sm font-serif text-[#F5ECD7]
                    border border-[#C9506A]/60 rounded
                    hover:bg-[#C9506A]/20 transition-colors"
                >
                  重试
                </button>
                <button
                  onClick={handleFallback}
                  className="flex-1 py-2 text-sm font-serif text-[#F5ECD7]/70
                    border border-[#F5ECD7]/20 rounded
                    hover:bg-white/5 transition-colors"
                >
                  换个话题
                </button>
              </div>
            </div>
          </div>
        ) : showAiResponse ? (
          <DialogueBox
            key="ai-response"
            speaker={dialogueSpeaker}
            text={dialogueText}
            aiState={aiState}
            isNarration={false}
            onAdvance={
              aiState === 'complete' || aiState === 'fallback'
                ? handleAiAdvance
                : undefined
            }
          />
        ) : (
          <DialogueBox
            key={currentLine.id}
            speaker={dialogueSpeaker}
            text={dialogueText}
            aiState="idle"
            isNarration={isNarration}
            onAdvance={handleAdvance}
          />
        )}
      </AnimatePresence>

      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 z-50 text-[10px] text-white/30 font-mono pointer-events-none">
          {currentLine.id} · aff:{store.affection['kai'] ?? 0} · {aiState}
        </div>
      )}
    </div>
  );
}
