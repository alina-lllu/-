import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIResponseState } from './types';

interface AiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GameState {
  // Scene progress
  sceneId: string;
  lineId: string;

  // Affection per character
  affection: Record<string, number>;

  // Story flags
  flags: Record<string, boolean>;

  // AI conversation history per character (keyed by characterId)
  aiHistory: Record<string, AiMessage[]>;

  // AI response UI state
  aiResponseState: AIResponseState;
  aiResponseText: string;
  aiResponseEmotion: string;

  // Stats
  aiDialogueCount: number;
  scenesCompleted: number;

  // Actions
  setScene: (sceneId: string, lineId: string) => void;
  setLineId: (lineId: string) => void;
  addAffection: (characterId: string, delta: number) => void;
  setFlag: (key: string, value: boolean) => void;
  pushAiMessage: (characterId: string, message: AiMessage) => void;
  clearAiHistory: (characterId: string) => void;
  setAiResponseState: (state: AIResponseState) => void;
  setAiResponseText: (text: string) => void;
  setAiResponseEmotion: (emotion: string) => void;
  incrementAiDialogueCount: () => void;
  markSceneCompleted: () => void;
  getAffection: (characterId: string) => number;
  reset: () => void;
}

const DEFAULT_STATE = {
  sceneId: 'ch1_scene01',
  lineId: 's01_intro',
  affection: {},
  flags: {},
  aiHistory: {},
  aiResponseState: 'idle' as AIResponseState,
  aiResponseText: '',
  aiResponseEmotion: 'neutral',
  aiDialogueCount: 0,
  scenesCompleted: 0,
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

      pushAiMessage: (characterId, message) =>
        set((s) => {
          const history = s.aiHistory[characterId] ?? [];
          // Sliding window: keep system prompt + last 10 turns (20 messages)
          const nonSystem = history.filter((m) => m.role !== 'system');
          const systemMsgs = history.filter((m) => m.role === 'system');
          const trimmed = nonSystem.slice(-19);
          return {
            aiHistory: {
              ...s.aiHistory,
              [characterId]: [...systemMsgs, ...trimmed, message],
            },
          };
        }),

      clearAiHistory: (characterId) =>
        set((s) => ({
          aiHistory: { ...s.aiHistory, [characterId]: [] },
        })),

      setAiResponseState: (state) => set({ aiResponseState: state }),

      setAiResponseText: (text) => set({ aiResponseText: text }),

      setAiResponseEmotion: (emotion) => set({ aiResponseEmotion: emotion }),

      incrementAiDialogueCount: () =>
        set((s) => ({ aiDialogueCount: s.aiDialogueCount + 1 })),

      markSceneCompleted: () =>
        set((s) => ({ scenesCompleted: s.scenesCompleted + 1 })),

      getAffection: (characterId) => get().affection[characterId] ?? 0,

      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'otome-game-state',
      // Don't persist transient UI state
      partialize: (s) => ({
        sceneId: s.sceneId,
        lineId: s.lineId,
        affection: s.affection,
        flags: s.flags,
        aiHistory: s.aiHistory,
        aiDialogueCount: s.aiDialogueCount,
        scenesCompleted: s.scenesCompleted,
      }),
    }
  )
);
