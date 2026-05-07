'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SkillId } from '@/lib/types';

interface SkillToastProps {
  skill: SkillId;
  text: string;
  // 显示完成后调用，用于 GameLayout auto-advance 到下一行
  onDone: () => void;
  // 总显示时间（毫秒）。默认 2200ms：0.4s 淡入 + 1.4s 停留 + 0.4s 淡出
  durationMs?: number;
}

const SKILL_LABEL: Record<SkillId, string> = {
  observe: '观察',
  empathy: '共情',
  probe: '追问',
  boundary: '边界感',
  direct: '直球',
};

// 沉浸式技能反馈。文案来自剧本里的 skill_toast.text，比如：
//   「你看见了他没说出来的那一秒。」
// 故意不显示 +EXP / 等级，避免破坏沉浸感（呼应 docs/skill-system-todo.md 第 92-94 行）。
export function SkillToast({ skill, text, onDone, durationMs = 2200 }: SkillToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, durationMs);
    return () => clearTimeout(t);
  }, [onDone, durationMs]);

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center px-8 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

      <motion.div
        className="relative max-w-md text-center"
        initial={{ y: 6 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-[10px] tracking-[0.4em] text-[#C9506A] mb-3 font-sans uppercase">
          {SKILL_LABEL[skill]}
        </p>
        <p className="text-[#F5ECD7] text-base font-serif italic leading-relaxed">
          {text}
        </p>
      </motion.div>
    </motion.div>
  );
}
