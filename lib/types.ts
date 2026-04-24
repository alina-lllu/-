// 剧情脚本类型定义

export type Emotion =
  | 'neutral' | 'thinking' | 'attentive'
  | 'slight_smile' | 'distant' | 'caught' | 'warm';

export type LineType =
  | 'narration' | 'dialogue' | 'choice'
  | 'ai_dialogue' | 'character_enter'
  | 'affection_branch' | 'chapter_end';

export interface NarrationLine {
  id: string;
  type: 'narration';
  text: string;
  next: string;
}

export interface DialogueLine {
  id: string;
  type: 'dialogue';
  speaker: string;
  emotion: Emotion;
  text: string;
  next?: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
  label?: string;         // 显示给玩家的文字（AI选项用）
  affectionDelta?: number;
  emotion?: string;
  next: string;
}

export interface ChoiceLine {
  id: string;
  type: 'choice';
  prompt?: string;
  affectionNote?: string;
  options: ChoiceOption[];
}

export interface AiDialogueLine {
  id: string;
  type: 'ai_dialogue';
  character: string;
  contextNote: string;    // 给 Claude 的额外场景说明
  emotion_on_response: Emotion;
  fallbackKey: string;
  affectionOnPositive: number;
  affectionOnNeutral: number;
  affectionOnNegative: number;
  next: string;
}

export interface CharacterEnterLine {
  id: string;
  type: 'character_enter';
  character: string;
  emotion: Emotion;
  animation: string;
  next: string;
}

export interface AffectionBranch {
  condition: string;      // e.g. "affection >= 50"
  next: string;
}

export interface AffectionBranchLine {
  id: string;
  type: 'affection_branch';
  character: string;
  branches: AffectionBranch[];
}

export interface ChapterEndLine {
  id: string;
  type: 'chapter_end';
  chapterId: string;
  title: string;
  subtitle: string;
  stats: { show: boolean; fields: string[] };
  next_chapter: string;
  unlock_memory?: {
    condition: string;
    memoryId: string;
    memoryTitle: string;
    memoryText: string;
  };
}

export type ScriptLine =
  | NarrationLine | DialogueLine | ChoiceLine
  | AiDialogueLine | CharacterEnterLine
  | AffectionBranchLine | ChapterEndLine;

export interface Scene {
  sceneId: string;
  title: string;
  background: string;
  bgm?: string;
  initialCharacter?: string;
  initialEmotion?: Emotion;
  lines: ScriptLine[];
}

export interface CharacterData {
  id: string;
  name: string;
  sprites: Record<Emotion, string>;
  systemPrompt: { version: string; content: string };
  fallbackLines: Record<string, string[]>;
  emotionKeywords: Record<Emotion, string[]>;
}

// 游戏存档结构
export interface SaveSlot {
  slotId: number;
  timestamp: string;
  sceneId: string;
  lineId: string;
  affection: Record<string, number>;
  flags: Record<string, boolean>;
  aiHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  thumbnail?: string;     // 场景截图 base64（可选）
}

// AI 响应状态
export type AIResponseState =
  | 'idle' | 'loading' | 'streaming' | 'complete' | 'error' | 'fallback';
