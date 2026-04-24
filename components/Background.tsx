'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SceneBackground, detectSceneVariant } from './SceneBackground';

interface BackgroundProps {
  src: string;
}

export function Background({ src }: BackgroundProps) {
  const variant = detectSceneVariant(src);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={src}
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        {variant ? (
          <SceneBackground variant={variant} />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${src})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </motion.div>
    </AnimatePresence>
  );
}
