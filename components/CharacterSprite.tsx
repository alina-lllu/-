'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Emotion } from '@/lib/types';
import { KaiCharacter } from './KaiCharacter';

interface CharacterSpriteProps {
  src: string;
  emotion: Emotion;
  visible: boolean;
  position?: 'left' | 'center' | 'right';
}

const POSITION_CLASSES = {
  left: 'left-[5%]',
  center: 'left-1/2 -translate-x-1/2',
  right: 'right-[5%]',
};

function isKaiSprite(src: string) {
  return src.includes('kai') || src.includes('assets/sprites/kai');
}

export function CharacterSprite({
  src,
  emotion,
  visible,
  position = 'center',
}: CharacterSpriteProps) {
  const useKai = isKaiSprite(src);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`${src}-${useKai ? emotion : 'img'}`}
          className={`absolute bottom-[160px] ${POSITION_CLASSES[position]} z-10 h-[75vh] select-none`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {useKai ? (
            <KaiCharacter emotion={emotion} />
          ) : (
            <img
              src={src}
              alt=""
              className="h-full w-auto object-contain drop-shadow-2xl"
              draggable={false}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
