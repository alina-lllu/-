import type {
  Scene, ScriptLine, AffectionBranchLine, AffectionBranch,
} from './types';

// Evaluate a condition string like "affection >= 50" or "affection < 30"
export function evalCondition(
  condition: string,
  affection: Record<string, number>,
  characterId: string
): boolean {
  const val = affection[characterId] ?? 0;
  const m = condition.match(/affection\s*(>=|<=|>|<|==|!=)\s*(\d+)/);
  if (!m) return false;
  const [, op, rhs] = m;
  const n = parseInt(rhs, 10);
  switch (op) {
    case '>=': return val >= n;
    case '<=': return val <= n;
    case '>':  return val > n;
    case '<':  return val < n;
    case '==': return val === n;
    case '!=': return val !== n;
    default:   return false;
  }
}

// Resolve affection_branch → next line id
export function resolveAffectionBranch(
  line: AffectionBranchLine,
  affection: Record<string, number>
): string {
  for (const branch of line.branches) {
    if (evalCondition(branch.condition, affection, line.character)) {
      return branch.next;
    }
  }
  // Fallback: last branch
  return line.branches[line.branches.length - 1].next;
}

// Build an id→line lookup for O(1) access
export function buildLineIndex(scene: Scene): Map<string, ScriptLine> {
  const map = new Map<string, ScriptLine>();
  for (const line of scene.lines) {
    map.set(line.id, line);
  }
  return map;
}

// Build a fallback map: for lines with no explicit next, point to the next line in the array
export function buildSequentialNextMap(scene: Scene): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < scene.lines.length - 1; i++) {
    const line = scene.lines[i];
    const hasNext =
      ('next' in line) && (line as { next?: string }).next !== undefined;
    if (!hasNext) {
      map.set(line.id, scene.lines[i + 1].id);
    }
  }
  return map;
}

// Given current line, return the id of the next line (or null at end)
export function getNextLineId(
  line: ScriptLine,
  affection: Record<string, number>
): string | null {
  switch (line.type) {
    case 'narration':
      return line.next;
    case 'dialogue':
      return line.next ?? null;
    case 'character_enter':
      return line.next;
    case 'ai_dialogue':
      return line.next;
    case 'affection_branch':
      return resolveAffectionBranch(line, affection);
    case 'choice':
      // choices are resolved externally by ChoicePanel
      return null;
    case 'chapter_end':
      return line.next_chapter ?? null;
    default:
      return null;
  }
}

// Detect emotion from AI response text using keyword matching
export function detectEmotion(
  text: string,
  emotionKeywords: Record<string, string[]>
): string {
  const lower = text.toLowerCase();
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return emotion;
    }
  }
  return 'neutral';
}

const sceneCache = new Map<string, Scene>();

// Load a scene JSON by sceneId (client-side fetch with in-memory cache)
export async function loadScene(sceneId: string): Promise<Scene> {
  if (sceneCache.has(sceneId)) return sceneCache.get(sceneId)!;
  // sceneId format: ch1_scene01 → /script/ch1/scene01.json
  const [chapter, scene] = sceneId.split('_');
  const res = await fetch(`/script/${chapter}/${scene}.json`);
  if (!res.ok) throw new Error(`Failed to load scene: ${sceneId}`);
  const data = (await res.json()) as Scene;
  sceneCache.set(sceneId, data);
  return data;
}
