import type { SkillDefinition, SkillId } from './types';

interface SkillDefinitionsFile {
  version: number;
  notes?: string;
  skills: (SkillDefinition & {
    icon?: { path: string; status: string; prompt?: string; description?: string };
  })[];
}

let cache: Map<SkillId, SkillDefinition> | null = null;
let inflight: Promise<Map<SkillId, SkillDefinition>> | null = null;

const SKILL_LABEL_FALLBACK: Record<SkillId, string> = {
  observe: '观察',
  empathy: '共情',
  probe: '追问',
  boundary: '边界感',
  direct: '直球',
};

// 一次性加载技能定义。后续调用走内存缓存。
export async function loadSkillDefinitions(): Promise<Map<SkillId, SkillDefinition>> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const res = await fetch('/script/skills/definitions.json');
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = (await res.json()) as SkillDefinitionsFile;
      const map = new Map<SkillId, SkillDefinition>();
      for (const s of data.skills) {
        map.set(s.id, s);
      }
      cache = map;
      return map;
    } catch (e) {
      console.warn('[skillRegistry] fallback to empty defs:', e);
      cache = new Map();
      return cache;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export function getSkillDefinition(id: SkillId): SkillDefinition | undefined {
  return cache?.get(id);
}

export function getSkillName(id: SkillId): string {
  return cache?.get(id)?.name ?? SKILL_LABEL_FALLBACK[id] ?? id;
}

export function getSkillPromptFragment(id: SkillId): string {
  return cache?.get(id)?.promptFragment ?? '';
}
