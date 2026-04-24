'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChoiceOption } from '@/lib/types';

interface ChoicePanelProps {
  prompt?: string;
  options: ChoiceOption[];
  onSelect: (option: ChoiceOption) => void;
  // Called when the player uses the inline AI input (ai_input option)
  onAiSelect?: (text: string, option: ChoiceOption) => void;
}

export function ChoicePanel({ prompt, options, onSelect, onAiSelect }: ChoicePanelProps) {
  const [aiExpanded, setAiExpanded] = useState(false);
  const [aiOpt, setAiOpt] = useState<ChoiceOption | null>(null);
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const regularOptions = options.filter((o) => o.text !== 'ai_input');
  const aiOption = options.find((o) => o.text === 'ai_input');

  function handleAiExpand() {
    if (!aiOption) return;
    setAiOpt(aiOption);
    setAiExpanded(true);
    setTimeout(() => textareaRef.current?.focus(), 80);
  }

  function handleAiSubmit() {
    const text = inputText.trim();
    if (!text || !aiOpt) return;
    onAiSelect?.(text, aiOpt);
    setInputText('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAiSubmit();
    }
  }

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

        {/* Preset options — hidden when AI textarea is expanded */}
        <AnimatePresence>
          {!aiExpanded &&
            regularOptions.map((opt, i) => (
              <motion.button
                key={opt.id}
                className="w-full px-6 py-3 text-left text-[#F5ECD7] text-sm font-serif
                  bg-[#2D1B26]/80 border border-[#C9506A]/40 rounded
                  hover:bg-[#C9506A]/20 hover:border-[#C9506A]/80
                  transition-colors duration-150"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => onSelect(opt)}
              >
                {opt.label ?? opt.text}
              </motion.button>
            ))}
        </AnimatePresence>

        {/* AI input option button */}
        <AnimatePresence>
          {aiOption && !aiExpanded && (
            <motion.button
              key="ai-btn"
              className="w-full px-6 py-3 text-left text-[#F5ECD7] text-sm font-serif
                bg-[#C9506A]/10 border border-[#C9506A]/60 rounded
                hover:bg-[#C9506A]/25 hover:border-[#C9506A]
                transition-colors duration-150"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ delay: regularOptions.length * 0.08 }}
              onClick={handleAiExpand}
            >
              ✨ {aiOption.label ?? '说说你真正想说的…'}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Inline AI textarea (expands in place of option list) */}
        <AnimatePresence>
          {aiExpanded && (
            <motion.div
              key="ai-expand"
              className="space-y-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-center text-xs text-[#C9506A]/80 font-serif italic">
                凯恒在等着听你说…
              </p>
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="说点什么……"
                rows={3}
                className="w-full px-4 py-3 rounded text-sm font-serif text-[#F5ECD7]
                  bg-[#2D1B26]/90 border border-[#C9506A]/60
                  focus:outline-none focus:border-[#C9506A] resize-none
                  placeholder:text-[#F5ECD7]/30"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setAiExpanded(false); setInputText(''); }}
                  className="flex-1 py-2 text-xs text-[#F5ECD7]/50 border border-[#F5ECD7]/20
                    rounded hover:border-[#F5ECD7]/40 transition-colors font-serif"
                >
                  ← 返回选项
                </button>
                <button
                  onClick={handleAiSubmit}
                  disabled={!inputText.trim()}
                  className="flex-1 py-2 text-xs text-[#F5ECD7] bg-[#C9506A]/70
                    rounded hover:bg-[#C9506A]/90 disabled:opacity-40
                    transition-colors font-serif"
                >
                  发送
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
