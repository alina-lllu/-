'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Background } from './Background';
import { CharacterSprite } from './CharacterSprite';
import { DialogueBox } from './DialogueBox';
import { ChoicePanel } from './ChoicePanel';
import { SkillToast } from './SkillToast';
import { EndingScreen } from './screens/EndingScreen';
import { useGameStore } from '@/lib/gameStore';
import {
  loadScene, buildLineIndex, buildSequentialNextMap,
  getNextLineId,
} from '@/lib/gameEngine';
import { loadSkillDefinitions } from '@/lib/skillRegistry';
import type {
  Scene, ScriptLine, ChoiceOption, Emotion, ImagePlaceholder,
} from '@/lib/types';

// Hydration boundary: prevents Zustand persist from causing SSR/CSR mismatch.
// The game is purely client-side, so we render nothing until mounted.
function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function GameLayout() {
  const hydrated = useHydrated();
  const store = useGameStore();
  const [scene, setScene] = useState<Scene | null>(null);
  const [lineIndex, setLineIndex] = useState<Map<string, ScriptLine>>(new Map());
  const [seqNext, setSeqNext] = useState<Map<string, string>>(new Map());
  const [currentLine, setCurrentLine] = useState<ScriptLine | null>(null);
  const [characterVisible, setCharacterVisible] = useState(false);
  const [characterEmotion, setCharacterEmotion] = useState<Emotion>('neutral');
  const [characterSrc, setCharacterSrc] = useState('');
  const [bgSrc, setBgSrc] = useState('');
  // 当前 line 上的 image 占位。仅 status === 'ready' 时叠加渲染
  const [readyImage, setReadyImage] = useState<ImagePlaceholder | null>(null);
  const charDataRef = useRef<Record<string, any>>({});

  // ── one-time skill defs preload ───────────────────────────────────────────
  useEffect(() => {
    loadSkillDefinitions();
  }, []);

  // ── scene loader ──────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const s = await loadScene(store.sceneId);
        if (!isMounted) return;
        const idx = buildLineIndex(s);
        const seq = buildSequentialNextMap(s);
        setScene(s);
        setLineIndex(idx);
        setSeqNext(seq);
        setBgSrc(s.background);
        if (s.initialEmotion) setCharacterEmotion(s.initialEmotion as Emotion);

        // Preload all characters referenced in this scene
        const cids = new Set<string>();
        for (const line of s.lines) {
          if ('character' in line) cids.add((line as any).character);
          if ('speaker' in line) cids.add((line as any).speaker);
        }
        await Promise.all(
          Array.from(cids).map(async (cid) => {
            if (charDataRef.current[cid]) return;
            try {
              const r = await fetch(`/script/characters/${cid}.json`);
              if (r.ok) charDataRef.current[cid] = await r.json();
            } catch {}
          })
        );
        if (!isMounted) return;

        const startLine = idx.get(store.lineId) ?? idx.values().next().value;
        if (startLine) setCurrentLine(startLine);
      } catch (e) {
        console.error('[GameLayout] failed to load scene:', e);
      }
    }
    init();
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.sceneId]);

  // ── navigate to a line id ─────────────────────────────────────────────────
  const goToLine = useCallback((id: string) => {
    if (!lineIndex.has(id) && id.includes('_scene')) {
      store.setScene(id, '');
      return;
    }

    const line = lineIndex.get(id);
    if (!line) return;

    if (line.type === 'character_enter') {
      const cd = charDataRef.current[line.character];
      if (cd) {
        setCharacterSrc(cd.sprites?.[line.emotion] ?? cd.sprites?.['neutral'] ?? '');
        setCharacterEmotion(line.emotion as Emotion);
      }
      setCharacterVisible(true);
      store.setLineId(line.id);
      const next = getNextLineId(line, store.affection, store.flags) ?? seqNext.get(line.id);
      if (next) goToLine(next);
      return;
    }

    if (line.type === 'affection_branch') {
      const next = getNextLineId(line, store.affection, store.flags);
      if (next) goToLine(next);
      return;
    }

    store.setLineId(line.id);
    setCurrentLine(line);

    // 仅 ready 状态的 image 才叠加显示，pending 时 readyImage 置空
    const img = (line as { image?: ImagePlaceholder }).image;
    setReadyImage(img && img.status === 'ready' ? img : null);

    if (line.type === 'dialogue') {
      const cd = charDataRef.current[line.speaker];
      if (cd) {
        setCharacterSrc(cd.sprites?.[line.emotion] ?? cd.sprites?.['neutral'] ?? '');
        setCharacterEmotion(line.emotion as Emotion);
      }
      setCharacterVisible(true);
    }

    if (line.type === 'narration') {
      setCharacterVisible(false);
    }

    // skill_toast 不显示对话框，由 SkillToast 自己 auto-advance
    // 这里不主动跳，等 SkillToast 触发 onDone

  }, [lineIndex, seqNext, store]);

  // ── advance on click ──────────────────────────────────────────────────────
  const handleAdvance = useCallback(() => {
    if (!currentLine) return;
    // skill_toast 通过 onDone 推进，点击对话框无效
    if (currentLine.type === 'skill_toast') return;

    const next =
      getNextLineId(currentLine, store.affection, store.flags) ??
      seqNext.get(currentLine.id);
    if (next) goToLine(next);
  }, [currentLine, store.affection, store.flags, seqNext, goToLine]);

  // ── choice selection ──────────────────────────────────────────────────────
  const handleChoiceSelect = useCallback((opt: ChoiceOption) => {
    if (opt.affectionDelta) store.addAffection('kai', opt.affectionDelta);
    if (opt.skillUsed) store.useSkill(opt.skillUsed);
    if (opt.setFlag) store.setFlag(opt.setFlag.key, opt.setFlag.value);
    goToLine(opt.next);
  }, [store, goToLine]);

  // ── render ────────────────────────────────────────────────────────────────
  if (!hydrated || !scene || !currentLine) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#2D1B26]">
        <div className="text-[#F5ECD7]/40 text-sm tracking-widest">加载中……</div>
      </div>
    );
  }

  const isChoice = currentLine.type === 'choice';
  const isNarration = currentLine.type === 'narration';
  const isSkillToast = currentLine.type === 'skill_toast';
  const isChapterEnd = currentLine.type === 'chapter_end';

  const dialogueSpeaker = (() => {
    if (currentLine.type === 'dialogue') return currentLine.speaker;
    return undefined;
  })();

  const dialogueText = (() => {
    if (currentLine.type === 'dialogue') return currentLine.text;
    if (currentLine.type === 'narration') return currentLine.text;
    if (currentLine.type === 'chapter_end') return currentLine.title;
    return '';
  })();

  // Character is visible unless narration / skill_toast / chapter_end; stays visible during choices
  const spriteVisible = characterVisible && !isNarration && !isSkillToast && !isChapterEnd;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#2D1B26]">
      <Background src={bgSrc} />

      <CharacterSprite
        src={characterSrc}
        emotion={characterEmotion}
        visible={spriteVisible}
        position="center"
      />

      {readyImage && (
        <motion.div
          key={readyImage.path}
          className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={`/${readyImage.path}`}
            alt={readyImage.description ?? ''}
            className="max-h-[80%] max-w-[80%] object-contain rounded shadow-2xl"
          />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isChapterEnd ? (
          <EndingScreen
            key={currentLine.id}
            line={currentLine}
            affection={store.affection}
            flags={store.flags}
            skillUsageHistory={store.skillUsageHistory}
            scenesCompleted={store.scenesCompleted}
            onAdvance={() => {
              store.markSceneCompleted();
              if (currentLine.next_chapter) {
                store.setScene(currentLine.next_chapter, '');
              }
            }}
          />
        ) : isSkillToast ? (
          <SkillToast
            key={currentLine.id}
            skill={currentLine.skill}
            text={currentLine.text}
            onDone={() => {
              const next =
                getNextLineId(currentLine, store.affection, store.flags) ??
                seqNext.get(currentLine.id);
              if (next) goToLine(next);
            }}
          />
        ) : isChoice ? (
          <ChoicePanel
            key="choice"
            prompt={(currentLine as any).prompt ?? undefined}
            options={(currentLine as any).options}
            onSelect={handleChoiceSelect}
            skillLevels={store.skills}
          />
        ) : (
          <DialogueBox
            key={currentLine.id}
            speaker={dialogueSpeaker}
            text={dialogueText}
            isNarration={isNarration}
            onAdvance={handleAdvance}
          />
        )}
      </AnimatePresence>

      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 z-50 text-[10px] text-white/30 font-mono pointer-events-none">
          {currentLine.id} · aff:{store.affection['kai'] ?? 0}
          {Object.entries(store.skills).filter(([, v]) => (v ?? 0) > 0).length > 0 && (
            <span> · skills:{
              Object.entries(store.skills)
                .filter(([, v]) => (v ?? 0) > 0)
                .map(([k, v]) => `${k}${v}`)
                .join(',')
            }</span>
          )}
          {Object.keys(store.flags).length > 0 && (
            <span> · flags:{Object.keys(store.flags).filter((k) => store.flags[k]).join(',')}</span>
          )}
        </div>
      )}
    </div>
  );
}
