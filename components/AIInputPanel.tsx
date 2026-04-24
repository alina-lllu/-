'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { AIResponseState } from '@/lib/types';

interface AIInputPanelProps {
  placeholder?: string;
  aiState: AIResponseState;
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export function AIInputPanel({
  placeholder = '说点什么……',
  aiState,
  onSubmit,
  disabled = false,
}: AIInputPanelProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isActive = aiState === 'idle' || aiState === 'complete' || aiState === 'error';
  const canSubmit = isActive && text.trim().length > 0 && !disabled;

  function handleSubmit() {
    if (!canSubmit) return;
    const value = text.trim();
    setText('');
    onSubmit(value);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-6 pt-4
        bg-gradient-to-t from-[#1a0f12] to-transparent"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-end gap-3 max-w-2xl mx-auto">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={!isActive || disabled}
          rows={2}
          className="flex-1 resize-none rounded border border-[#C9506A]/30 bg-[#2D1B26]/80
            px-4 py-3 text-sm text-[#F5ECD7] placeholder:text-[#F5ECD7]/30
            focus:outline-none focus:border-[#C9506A]/70
            disabled:opacity-40 font-serif"
        />
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="shrink-0 px-5 py-3 rounded bg-[#C9506A] text-white text-sm
            hover:bg-[#b8405a] disabled:opacity-30 disabled:cursor-not-allowed
            transition-colors duration-150"
        >
          发送
        </button>
      </div>
      <p className="mt-1.5 text-center text-xs text-[#F5ECD7]/30">
        Enter 发送 · Shift+Enter 换行
      </p>
    </motion.div>
  );
}
