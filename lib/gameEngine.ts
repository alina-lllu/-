import type {
  Scene, ScriptLine, AffectionBranchLine,
} from './types';

// Evaluate a condition string. Supported forms:
//   "affection >= 50"           → 数值比较
//   "flag.kai_promise_made"     → 仅当 flag 为 true 时通过
//   "!flag.kai_promise_made"    → flag 为 false / 未设置 时通过
export function evalCondition(
  condition: string,
  affection: Record<string, number>,
  characterId: string,
  flags: Record<string, boolean> = {}
): boolean {
  const trimmed = condition.trim();

  const flagMatch = trimmed.match(/^(!)?\s*flag\.([A-Za-z_][\w]*)\s*$/);
  if (flagMatch) {
    const [, neg, key] = flagMatch;
    const v = !!flags[key];
    return neg ? !v : v;
  }

  const val = affection[characterId] ?? 0;
  const m = trimmed.match(/^affection\s*(>=|<=|>|<|==|!=)\s*(\d+)$/);
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
  affection: Record<string, number>,
  flags: Record<string, boolean> = {}
): string {
  for (const branch of line.branches) {
    if (evalCondition(branch.condition, affection, line.character, flags)) {
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
  affection: Record<string, number>,
  flags: Record<string, boolean> = {}
): string | null {
  switch (line.type) {
    case 'narration':
      return line.next;
    case 'dialogue':
      return line.next ?? null;
    case 'character_enter':
      return line.next;
    case 'affection_branch':
      return resolveAffectionBranch(line, affection, flags);
    case 'choice':
      // choices are resolved externally by ChoicePanel
      return null;
    case 'chapter_end':
      return line.next_chapter ?? null;
    case 'skill_toast':
      return line.next;
    default:
      return null;
  }
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
