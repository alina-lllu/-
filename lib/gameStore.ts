import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SkillId, SkillUsage } from './types';

// 技能升级阈值。MVP 1-3 级，对应 docs/skill-system-todo.md 第 125 行
//   Level 1：解锁基础技能选项
//   Level 2：提高正向回应概率或解锁一条隐藏台词
//   Level 3：影响章节结尾或角色记忆
const SKILL_LEVEL_THRESHOLDS = [0, 5, 12, 25] as const;
const MAX_SKILL_LEVEL = 3;

export function levelFromExp(exp: number): number {
  let lvl = 0;
  for (let i = 1; i <= MAX_SKILL_LEVEL; i++) {
    if (exp >= SKILL_LEVEL_THRESHOLDS[i]) lvl = i;
  }
  return lvl;
}

export interface SkillUsageRecord {
  skillId: SkillId;
  sceneId: string;
  lineId: string;
  timestamp: string;
}

interface GameState {
  // Scene progress
  sceneId: string;
  lineId: string;

  // Affection per character
  affection: Record<string, number>;

  // Story flags
  flags: Record<string, boolean>;

  // Stats
  scenesCompleted: number;

  // Skills
  skills: Partial<Record<SkillId, number>>;        // level
  skillExp: Partial<Record<SkillId, number>>;      // accumulated exp
  unlockedSkills: SkillId[];
  skillUsageHistory: SkillUsageRecord[];
  // 最近一次使用的技能。GameLayout 在调用 AI route 时把它注入到 system prompt
  lastSkillUsed: SkillId | null;

  // Actions
  setScene: (sceneId: string, lineId: string) => void;
  setLineId: (lineId: string) => void;
  addAffection: (characterId: string, delta: number) => void;
  setFlag: (key: string, value: boolean) => void;
  markSceneCompleted: () => void;
  getAffection: (characterId: string) => number;
  useSkill: (usage: SkillUsage) => void;
  getSkillLevel: (id: SkillId) => number;
  consumeLastSkillUsed: () => SkillId | null;
  reset: () => void;
}

const DEFAULT_STATE = {
  sceneId: 'ch1_scene01',
  lineId: 's01_intro',
  affection: {},
  flags: {},
  scenesCompleted: 0,
  skills: {},
  skillExp: {},
  unlockedSkills: [] as SkillId[],
  skillUsageHistory: [] as SkillUsageRecord[],
  lastSkillUsed: null as SkillId | null,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      setScene: (sceneId, lineId) => set({ sceneId, lineId }),

      setLineId: (lineId) => set({ lineId }),

      addAffection: (characterId, delta) =>
        set((s) => ({
          affection: {
            ...s.affection,
            [characterId]: Math.max(0, Math.min(100, (s.affection[characterId] ?? 0) + delta)),
          },
        })),

      setFlag: (key, value) =>
        set((s) => ({ flags: { ...s.flags, [key]: value } })),

      markSceneCompleted: () =>
        set((s) => ({ scenesCompleted: s.scenesCompleted + 1 })),

      getAffection: (characterId) => get().affection[characterId] ?? 0,

      useSkill: (usage) => {
        const { id, expGain = 1 } = usage;
        const s = get();
        const prevExp = s.skillExp[id] ?? 0;
        const newExp = prevExp + expGain;
        const newLevel = levelFromExp(newExp);

        const unlocked = newLevel >= 1 && !s.unlockedSkills.includes(id)
          ? [...s.unlockedSkills, id]
          : s.unlockedSkills;

        const record: SkillUsageRecord = {
          skillId: id,
          sceneId: s.sceneId,
          lineId: s.lineId,
          timestamp: new Date().toISOString(),
        };

        set({
          skillExp: { ...s.skillExp, [id]: newExp },
          skills: { ...s.skills, [id]: newLevel },
          unlockedSkills: unlocked,
          skillUsageHistory: [...s.skillUsageHistory, record],
          lastSkillUsed: id,
        });
      },

      getSkillLevel: (id) => get().skills[id] ?? 0,

      // 取出 lastSkillUsed 并清空。AI 路由调用方一次性消费，避免下一次普通对话被错误注入
      consumeLastSkillUsed: () => {
        const v = get().lastSkillUsed;
        if (v !== null) set({ lastSkillUsed: null });
        return v;
      },

      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'otome-game-state',
      // Don't persist transient UI state. lastSkillUsed 故意不持久化：
      // 它只对「这次玩家选择→下次 AI 调用」的窗口有意义，重启游戏后应清空。
      partialize: (s) => ({
        sceneId: s.sceneId,
        lineId: s.lineId,
        affection: s.affection,
        flags: s.flags,
        scenesCompleted: s.scenesCompleted,
        skills: s.skills,
        skillExp: s.skillExp,
        unlockedSkills: s.unlockedSkills,
        skillUsageHistory: s.skillUsageHistory,
      }),
    }
  )
);
