// 剧情脚本类型定义

export type Emotion =
  | 'neutral' | 'thinking' | 'attentive'
  | 'slight_smile' | 'distant' | 'caught' | 'warm';

export type LineType =
  | 'narration' | 'dialogue' | 'choice'
  | 'character_enter'
  | 'affection_branch' | 'chapter_end'
  | 'skill_toast';

export type SkillId =
  | 'observe' | 'empathy' | 'probe' | 'boundary' | 'direct';

export interface SkillRequirement {
  id: SkillId;
  level: number;
}

export interface SkillUsage {
  id: SkillId;
  expGain?: number;
}

export interface SkillEmotionMapping {
  primary: Emotion;
  secondary?: Emotion;
}

export interface SkillDefinition {
  id: SkillId;
  name: string;
  description: string;
  maxLevel: number;
  tags: string[];
  promptFragment: string;
  emotionMapping: SkillEmotionMapping;
}

// 图片资源占位符。pending 状态下 UI 不渲染，等人工生图后把图放到 path
// 并把 status 改为 ready 即可，不用动代码。
export interface ImagePlaceholder {
  path: string;
  status: 'pending' | 'ready';
  prompt?: string;
  description?: string;
}

export interface NarrationLine {
  id: string;
  type: 'narration';
  text: string;
  next: string;
  image?: ImagePlaceholder;
}

export interface DialogueLine {
  id: string;
  type: 'dialogue';
  speaker: string;
  emotion: Emotion;
  text: string;
  next?: string;
  image?: ImagePlaceholder;
}

export interface ChoiceOption {
  id: string;
  text: string;
  label?: string;         // 可选的显示文案
  affectionDelta?: number;
  emotion?: string;
  next: string;
  // 选这个选项时记录哪个技能在使用，用于经验累计与 AI prompt 注入
  skillUsed?: SkillUsage;
  // 这个选项需要某技能等级才显示。未满足时整条选项隐藏（不灰显）
  requiredSkill?: SkillRequirement;
  // 选这个选项时设置的剧情 flag，影响后续分支
  setFlag?: { key: string; value: boolean };
}

export interface ChoiceLine {
  id: string;
  type: 'choice';
  prompt?: string;
  affectionNote?: string;
  options: ChoiceOption[];
  image?: ImagePlaceholder;
}

export interface CharacterEnterLine {
  id: string;
  type: 'character_enter';
  character: string;
  emotion: Emotion;
  animation: string;
  next: string;
  image?: ImagePlaceholder;
}

export interface AffectionBranch {
  condition: string;      // e.g. "affection >= 50" or "flag.kai_promise_made"
  next: string;
}

export interface AffectionBranchLine {
  id: string;
  type: 'affection_branch';
  character: string;
  branches: AffectionBranch[];
}

// 沉浸式技能反馈。文案示例："你注意到了他没说完的那句话。"
// 不显示具体经验数值，只做叙事化提示。
export interface SkillToastLine {
  id: string;
  type: 'skill_toast';
  skill: SkillId;
  text: string;
  next: string;
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
  | CharacterEnterLine
  | AffectionBranchLine | ChapterEndLine
  | SkillToastLine;

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
}

// 游戏存档结构
export interface SaveSlot {
  slotId: number;
  timestamp: string;
  sceneId: string;
  lineId: string;
  affection: Record<string, number>;
  flags: Record<string, boolean>;
  // 技能等级与经验。MVP 只做 1-3 级，未出现的技能视为 0 级
  skills?: Partial<Record<SkillId, number>>;
  skillExp?: Partial<Record<SkillId, number>>;
  unlockedSkills?: SkillId[];
  // 用于章节结算时统计本章倾向
  skillUsageHistory?: Array<{
    skillId: SkillId;
    sceneId: string;
    lineId: string;
    timestamp: string;
  }>;
  thumbnail?: string;     // 场景截图 base64（可选）
}
