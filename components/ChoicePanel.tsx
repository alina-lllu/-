'use client';

import { motion } from 'framer-motion';
import type { ChoiceOption, SkillId } from '@/lib/types';

interface ChoicePanelProps {
  prompt?: string;
  options: ChoiceOption[];
  onSelect: (option: ChoiceOption) => void;
  // 当前角色技能等级，用于过滤 requiredSkill 选项
  skillLevels?: Partial<Record<SkillId, number>>;
}

function isOptionVisible(
  opt: ChoiceOption,
  skillLevels: Partial<Record<SkillId, number>>
): boolean {
  if (!opt.requiredSkill) return true;
  const have = skillLevels[opt.requiredSkill.id] ?? 0;
  return have >= opt.requiredSkill.level;
}

export function ChoicePanel({ prompt, options, onSelect, skillLevels = {} }: ChoicePanelProps) {
  const visible = options.filter((o) => isOptionVisible(o, skillLevels));

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-end pb-12 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-lg space-y-3">
        {prompt && (
          <p className="text-center text-sm text-[#F5ECD7]/70 mb-4 font-serif italic">
            {prompt}
          </p>
        )}

        {visible.map((opt, i) => (
          <motion.button
            key={opt.id}
            className="w-full px-6 py-3 text-left text-[#F5ECD7] text-sm font-serif
              bg-[#2D1B26]/80 border border-[#C9506A]/40 rounded
              hover:bg-[#C9506A]/20 hover:border-[#C9506A]/80
              transition-colors duration-150
              flex items-baseline gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSelect(opt)}
          >
            {opt.label && (
              <span className="text-[11px] tracking-wider text-[#C9506A] font-sans shrink-0">
                {opt.label}
              </span>
            )}
            <span className="flex-1">{opt.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
