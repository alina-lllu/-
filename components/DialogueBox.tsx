'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LoadingDots } from './LoadingDots';
import type { AIResponseState } from '@/lib/types';

interface DialogueBoxProps {
  speaker?: string;
  text: string;
  aiState?: AIResponseState;
  isNarration?: boolean;
  onAdvance?: () => void;
}

export function DialogueBox({
  speaker,
  text,
  aiState = 'idle',
  isNarration = false,
  onAdvance,
}: DialogueBoxProps) {
  const isLoading = aiState === 'loading';
  const isStreaming = aiState === 'streaming';
  const isComplete = aiState === 'complete' || aiState === 'idle';
  const isError = aiState === 'error' || aiState === 'fallback';

  return (
    <motion.div
      className={`absolute bottom-0 left-0 right-0 z-20 min-h-[160px] px-8 py-6
        bg-[#1a0f12]/85 backdrop-blur-sm border-t border-[#C9506A]/20
        ${isNarration ? 'text-center italic' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={isComplete ? onAdvance : undefined}
      style={{ cursor: isComplete && onAdvance ? 'pointer' : 'default' }}
    >
      {speaker && !isNarration && (
        <p className="mb-2 text-sm font-semibold tracking-widest text-[#C9506A] uppercase">
          {speaker}
        </p>
      )}

      <div className="text-[#F5ECD7] text-base leading-relaxed font-serif min-h-[3em]">
        {isLoading ? (
          <LoadingDots />
        ) : isError ? (
          <span className="opacity-60 text-sm">……</span>
        ) : (
          <AnimatePresence mode="wait">
            <motion.span
              key={text}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {text}
              {isStreaming && <LoadingDots />}
            </motion.span>
          </AnimatePresence>
        )}
      </div>

      {isComplete && onAdvance && (
        <motion.div
          className="absolute bottom-4 right-6 text-[#C9506A] text-xs"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ▼
        </motion.div>
      )}
    </motion.div>
  );
}
