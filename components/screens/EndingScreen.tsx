'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ChapterEndLine, SkillId } from '@/lib/types';
import type { SkillUsageRecord } from '@/lib/gameStore';
import { evalCondition } from '@/lib/gameEngine';
import { getSkillName } from '@/lib/skillRegistry';

interface EndingScreenProps {
  line: ChapterEndLine;
  affection: Record<string, number>;
  flags: Record<string, boolean>;
  skillUsageHistory: SkillUsageRecord[];
  scenesCompleted: number;
  onAdvance: () => void;
}

// 把当前章节的 skill 使用记录折成一句叙事化文案
//   "这一章里，你更常选择「保持边界」。"
// 不显示数值，只显示主倾向（呼应 docs/skill-system-todo.md 第 96 行）。
function deriveTendencyText(
  history: SkillUsageRecord[],
  chapterId: string
): { skill: SkillId; text: string } | null {
  // 用 chapterId 前缀做粗筛：sceneId "ch1_scene01" 以 "ch1_" 开头
  const prefix = chapterId + '_';
  const inChapter = history.filter((r) => r.sceneId.startsWith(prefix));
  if (inChapter.length === 0) return null;

  const counter = new Map<SkillId, number>();
  for (const r of inChapter) {
    counter.set(r.skillId, (counter.get(r.skillId) ?? 0) + 1);
  }
  let top: SkillId | null = null;
  let topN = -1;
  counter.forEach((v, k) => {
    if (v > topN) { top = k; topN = v; }
  });
  if (!top) return null;

  // 各技能对应的"叙事化"短句
  const TENDENCY_LINE: Record<SkillId, string> = {
    observe:  '这一章里，你更常先去「看见」，再开口。',
    empathy:  '这一章里，你更常选择「先接住，再回应」。',
    probe:    '这一章里，你更常选择「往前问一步」。',
    boundary: '这一章里，你更常选择「保持边界」。',
    direct:   '这一章里，你更常选择「直接说出口」。',
  };
  return { skill: top, text: TENDENCY_LINE[top] };
}

export function EndingScreen({
  line, affection, flags, skillUsageHistory, scenesCompleted, onAdvance,
}: EndingScreenProps) {
  const tendency = useMemo(
    () => deriveTendencyText(skillUsageHistory, line.chapterId),
    [skillUsageHistory, line.chapterId]
  );

  const memoryUnlocked = useMemo(() => {
    if (!line.unlock_memory) return false;
    return evalCondition(line.unlock_memory.condition, affection, 'kai', flags);
  }, [line.unlock_memory, affection, flags]);

  const showStats = line.stats?.show ?? false;
  const fields = line.stats?.fields ?? [];

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center px-8 bg-[#2D1B26]/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-center max-w-xl space-y-6"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div>
          <p className="text-[10px] tracking-[0.5em] text-[#C9506A]/80 mb-3 font-sans uppercase">
            chapter end
          </p>
          <h1 className="text-3xl text-[#F5ECD7] font-serif tracking-wider">
            {line.title}
          </h1>
          {line.subtitle && (
            <p className="mt-3 text-sm text-[#F5ECD7]/60 font-serif italic">
              {line.subtitle}
            </p>
          )}
        </div>

        {tendency && (
          <motion.div
            className="border-t border-b border-[#C9506A]/20 py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-[10px] tracking-[0.4em] text-[#C9506A] mb-2 font-sans uppercase">
              {getSkillName(tendency.skill)}
            </p>
            <p className="text-[#F5ECD7] text-base font-serif italic leading-relaxed">
              {tendency.text}
            </p>
          </motion.div>
        )}

        {showStats && (
          <motion.div
            className="text-xs text-[#F5ECD7]/60 font-sans space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            {fields.includes('affection') && (
              <p>好感度 · {affection['kai'] ?? 0}</p>
            )}
            {fields.includes('scenes_completed') && (
              <p>已完成场景 · {scenesCompleted}</p>
            )}
          </motion.div>
        )}

        {memoryUnlocked && line.unlock_memory && (
          <motion.div
            className="border border-[#C9506A]/30 rounded p-5 bg-[#1a0f12]/60 text-left"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <p className="text-[10px] tracking-[0.4em] text-[#C9506A] mb-2 font-sans uppercase">
              memory unlocked
            </p>
            <p className="text-[#F5ECD7] text-sm font-serif mb-2">
              {line.unlock_memory.memoryTitle}
            </p>
            <p className="text-[#F5ECD7]/70 text-xs font-serif italic leading-relaxed whitespace-pre-line">
              {line.unlock_memory.memoryText}
            </p>
          </motion.div>
        )}

        <motion.button
          className="mt-6 px-8 py-3 text-sm font-serif text-[#F5ECD7]
            bg-[#C9506A]/20 border border-[#C9506A]/60 rounded
            hover:bg-[#C9506A]/40 hover:border-[#C9506A]
            transition-colors duration-150"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          onClick={onAdvance}
        >
          {line.next_chapter ? '进入下一章 ▶' : '回到标题'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
