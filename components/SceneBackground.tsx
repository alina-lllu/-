'use client';

import { motion } from 'framer-motion';

export type SceneVariant = 'afternoon' | 'rainy' | 'evening';

// ── SHARED ──────────────────────────────────────────────────────────────────

const BOKEH_AFTERNOON = [
  { cx: 108, cy: 148, r: 38, delay: 0 },
  { cx: 315, cy: 210, r: 26, delay: 1.1 },
  { cx: 580, cy: 135, r: 42, delay: 0.5 },
  { cx: 690, cy: 290, r: 22, delay: 1.8 },
  { cx: 205, cy: 340, r: 30, delay: 2.3 },
  { cx: 460, cy: 170, r: 18, delay: 0.9 },
  { cx: 730, cy: 180, r: 34, delay: 1.6 },
];

const STARS = [
  { cx: 80,  cy: 48,  delay: 0 },
  { cx: 230, cy: 28,  delay: 0.4 },
  { cx: 390, cy: 65,  delay: 0.9 },
  { cx: 510, cy: 35,  delay: 1.5 },
  { cx: 660, cy: 55,  delay: 0.7 },
  { cx: 760, cy: 20,  delay: 1.2 },
  { cx: 140, cy: 18,  delay: 1.8 },
  { cx: 340, cy: 15,  delay: 2.1 },
  { cx: 590, cy: 25,  delay: 0.3 },
  { cx: 720, cy: 78,  delay: 1.0 },
  { cx: 430, cy: 90,  delay: 2.4 },
  { cx: 55,  cy: 88,  delay: 1.7 },
];

// ── AFTERNOON ────────────────────────────────────────────────────────────────

function AfternoonScene() {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="afBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FFF8E8" />
          <stop offset="55%"  stopColor="#FFE8A8" />
          <stop offset="100%" stopColor="#E8C868" />
        </linearGradient>
        <linearGradient id="afFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#9A6838" />
          <stop offset="100%" stopColor="#5A3818" />
        </linearGradient>
        <radialGradient id="afWin" cx="50%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#FFFCE0" />
          <stop offset="100%" stopColor="#FFE888" />
        </radialGradient>
        <radialGradient id="afBokeh" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFE060" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFE060" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="afBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FFE090" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#FFE090" stopOpacity="0" />
        </linearGradient>
        <filter id="afBlur">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* background wall */}
      <rect width={800} height={600} fill="url(#afBg)" />

      {/* subtle wall texture lines */}
      {[80, 180, 280, 380, 480].map((y) => (
        <line key={y} x1={0} y1={y} x2={800} y2={y} stroke="#F0D888" strokeWidth={0.5} opacity={0.4} />
      ))}

      {/* window left — light beam */}
      <polygon points="68,420 278,420 340,600 10,600" fill="url(#afBeam)" />
      {/* window right — light beam */}
      <polygon points="390,420 600,420 660,600 330,600" fill="url(#afBeam)" />

      {/* window frames */}
      {/* left window */}
      <rect x={58} y={78} width={228} height={340} rx={4} fill="#7A4E2C" />
      <rect x={68} y={88} width={208} height={320} rx={2} fill="url(#afWin)" />
      {/* cross bars */}
      <rect x={58} y={232} width={228} height={8} fill="#7A4E2C" />
      <rect x={168} y={78} width={8} height={340} fill="#7A4E2C" />

      {/* right window */}
      <rect x={382} y={78} width={228} height={340} rx={4} fill="#7A4E2C" />
      <rect x={392} y={88} width={208} height={320} rx={2} fill="url(#afWin)" />
      <rect x={382} y={232} width={228} height={8} fill="#7A4E2C" />
      <rect x={492} y={78} width={8} height={340} fill="#7A4E2C" />

      {/* bookshelf between windows */}
      <rect x={630} y={160} width={150} height={240} rx={3} fill="#8B6030" opacity={0.6} />
      {[185, 218, 252, 278, 312, 345].map((y) => (
        <rect key={y} x={635} y={y} width={140} height={8} rx={1} fill="#6A4820" opacity={0.8} />
      ))}
      {/* book spines */}
      {[
        { x: 640, w: 14, c: '#C84848' }, { x: 656, w: 10, c: '#4878C8' },
        { x: 668, w: 16, c: '#48A868' }, { x: 686, w: 12, c: '#C8A848' },
        { x: 700, w: 10, c: '#8848C8' }, { x: 712, w: 14, c: '#C87048' },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={188} width={b.w} height={22} rx={1} fill={b.c} opacity={0.75} />
      ))}

      {/* floor */}
      <rect y={420} width={800} height={180} fill="url(#afFloor)" />
      {/* floor plank lines */}
      {[440, 460, 480, 500].map((y) => (
        <line key={y} x1={0} y1={y} x2={800} y2={y} stroke="#4A2A10" strokeWidth={1} opacity={0.35} />
      ))}
      {[100, 200, 300, 500, 600, 700].map((x) => (
        <line key={x} x1={x} y1={420} x2={x} y2={600} stroke="#4A2A10" strokeWidth={0.8} opacity={0.25} />
      ))}

      {/* table edges at foreground */}
      <rect x={-10} y={388} width={210} height={38} rx={4} fill="#8B5E30" />
      <rect x={620} y={388} width={200} height={38} rx={4} fill="#8B5E30" />

      {/* animated bokeh */}
      {BOKEH_AFTERNOON.map((b, i) => (
        <motion.circle
          key={i}
          cx={b.cx}
          cy={b.cy}
          r={b.r}
          fill="url(#afBokeh)"
          filter="url(#afBlur)"
          animate={{ y: [-4, -16, -4], opacity: [0.6, 0.28, 0.6] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, delay: b.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* dust motes */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.circle
          key={i}
          cx={60 + i * 58}
          cy={120 + (i % 3) * 80}
          r={1.5}
          fill="#FFD060"
          opacity={0.7}
          animate={{ y: [0, -30, 0], x: [0, 8, 0], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 5 + i * 0.4, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

// ── RAINY ────────────────────────────────────────────────────────────────────

function RainyScene() {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="rnBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6A7E96" />
          <stop offset="60%"  stopColor="#506080" />
          <stop offset="100%" stopColor="#384860" />
        </linearGradient>
        <linearGradient id="rnFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7A6050" />
          <stop offset="100%" stopColor="#483828" />
        </linearGradient>
        <radialGradient id="rnWin" cx="50%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#A8C8E0" />
          <stop offset="100%" stopColor="#6888A8" />
        </radialGradient>
        <radialGradient id="rnWarm" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#FFD890" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFD890" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rnLamp" cx="50%" cy="0%" r="80%">
          <stop offset="0%"   stopColor="#FFE8A0" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFE8A0" stopOpacity="0" />
        </radialGradient>
        <filter id="rnBlur"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>

      {/* background */}
      <rect width={800} height={600} fill="url(#rnBg)" />

      {/* interior warm glow overlay */}
      <ellipse cx={400} cy={300} rx={380} ry={280} fill="url(#rnWarm)" />

      {/* wall lamp glow */}
      <ellipse cx={700} cy={180} rx={90} ry={90} fill="url(#rnLamp)" filter="url(#rnBlur)" />
      <rect x={690} y={145} width={18} height={40} rx={3} fill="#9A8060" />
      <ellipse cx={699} cy={148} rx={22} ry={12} fill="#C8A848" opacity={0.8} />

      {/* window left */}
      <rect x={58} y={78} width={228} height={340} rx={4} fill="#5A6878" />
      <rect x={68} y={88} width={208} height={320} rx={2} fill="url(#rnWin)" />
      <rect x={58} y={232} width={228} height={8} fill="#5A6878" />
      <rect x={168} y={78} width={8} height={340} fill="#5A6878" />

      {/* window right */}
      <rect x={382} y={78} width={228} height={340} rx={4} fill="#5A6878" />
      <rect x={392} y={88} width={208} height={320} rx={2} fill="url(#rnWin)" />
      <rect x={382} y={232} width={228} height={8} fill="#5A6878" />
      <rect x={492} y={78} width={8} height={340} fill="#5A6878" />

      {/* window condensation droplets */}
      {[
        { x: 95,  y: 110 }, { x: 138, y: 148 }, { x: 82,  y: 195 },
        { x: 198, y: 120 }, { x: 155, y: 220 }, { x: 240, y: 160 },
        { x: 420, y: 110 }, { x: 465, y: 160 }, { x: 510, y: 130 },
        { x: 555, y: 200 }, { x: 440, y: 240 }, { x: 590, y: 105 },
      ].map((d, i) => (
        <motion.ellipse
          key={i}
          cx={d.x} cy={d.y}
          rx={2} ry={3}
          fill="#B8D0E8" opacity={0.5}
          animate={{ cy: [d.y, d.y + 12, d.y + 12] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.6, ease: 'easeIn' }}
        />
      ))}

      {/* floor */}
      <rect y={420} width={800} height={180} fill="url(#rnFloor)" />
      {[440, 460, 480, 500].map((y) => (
        <line key={y} x1={0} y1={y} x2={800} y2={y} stroke="#382818" strokeWidth={1} opacity={0.3} />
      ))}

      {/* table edges */}
      <rect x={-10} y={388} width={210} height={38} rx={4} fill="#705040" />
      <rect x={620} y={388} width={200} height={38} rx={4} fill="#705040" />

      {/* animated rain */}
      {Array.from({ length: 22 }, (_, i) => {
        const x = (i * 38 + 5) % 820;
        const dur = 0.65 + (i % 5) * 0.08;
        const delay = (i * 0.09) % dur;
        return (
          <motion.line
            key={i}
            x1={x} y1={-70}
            x2={x - 14} y2={-40}
            stroke="#90B0D0"
            strokeWidth={1}
            strokeOpacity={0.55}
            animate={{ y: [0, 680] }}
            transition={{ duration: dur, repeat: Infinity, delay, ease: 'linear' }}
          />
        );
      })}

      {/* misty overlay at bottom */}
      <rect y={480} width={800} height={120} fill="#6A7E96" opacity={0.25} />
    </svg>
  );
}

// ── EVENING ──────────────────────────────────────────────────────────────────

function EveningScene() {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="evBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#180828" />
          <stop offset="50%"  stopColor="#100618" />
          <stop offset="100%" stopColor="#200C30" />
        </linearGradient>
        <linearGradient id="evStreet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#282038" />
          <stop offset="100%" stopColor="#181028" />
        </linearGradient>
        <radialGradient id="evLamp" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFD060" stopOpacity="0.90" />
          <stop offset="40%"  stopColor="#FF9820" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FF9820" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="evGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFB040" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFB040" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="evCafeWin" cx="50%" cy="50%" r="60%">
          <stop offset="0%"   stopColor="#FFD890" />
          <stop offset="100%" stopColor="#E8A840" />
        </radialGradient>
        <linearGradient id="evReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FFD060" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFD060" stopOpacity="0" />
        </linearGradient>
        <filter id="evBlur"><feGaussianBlur stdDeviation="16" /></filter>
        <filter id="evBlur2"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>

      {/* night sky */}
      <rect width={800} height={600} fill="url(#evBg)" />

      {/* distant city glow at horizon */}
      <ellipse cx={400} cy={340} rx={500} ry={80} fill="#300848" opacity={0.6} />

      {/* cafe building in background */}
      <rect x={480} y={120} width={280} height={300} rx={4} fill="#1A1028" />
      {/* cafe windows (warm light) */}
      {[
        { x: 510, y: 148, w: 68, h: 80 },
        { x: 598, y: 148, w: 68, h: 80 },
        { x: 510, y: 250, w: 68, h: 80 },
        { x: 598, y: 250, w: 68, h: 80 },
      ].map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={3} fill="url(#evCafeWin)" opacity={0.75} />
          <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={3} fill="url(#evGlow)" filter="url(#evBlur2)" />
        </g>
      ))}

      {/* stars */}
      {STARS.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={1.5 + (i % 3) * 0.5}
          fill="white"
          animate={{ opacity: [0.28, 0.95, 0.28] }}
          transition={{ duration: 2.2 + i * 0.25, repeat: Infinity, delay: s.delay }}
        />
      ))}

      {/* lamp post */}
      <rect x={195} y={85} width={10} height={340} rx={3} fill="#302838" />
      {/* lamp arm */}
      <path d="M 200,90 Q 220,85 230,100" stroke="#302838" strokeWidth={8} fill="none" strokeLinecap="round" />
      {/* lamp head */}
      <ellipse cx={230} cy={104} rx={22} ry={10} fill="#403848" />
      <ellipse cx={230} cy={100} rx={18} ry={7} fill="#FFE880" opacity={0.9} />

      {/* lamp glow circles */}
      <motion.ellipse
        cx={230} cy={160}
        rx={130} ry={130}
        fill="url(#evLamp)"
        filter="url(#evBlur)"
        animate={{ opacity: [0.8, 1, 0.85, 1, 0.8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <ellipse cx={230} cy={220} rx={80} ry={60} fill="url(#evGlow)" filter="url(#evBlur)" opacity={0.5} />

      {/* street / pavement */}
      <rect y={418} width={800} height={182} fill="url(#evStreet)" />
      {/* pavement tile lines */}
      {[440, 464, 488, 512].map((y) => (
        <line key={y} x1={0} y1={y} x2={800} y2={y} stroke="#282040" strokeWidth={1} opacity={0.5} />
      ))}
      {[80, 160, 240, 320, 400, 480, 560, 640, 720].map((x) => (
        <line key={x} x1={x} y1={418} x2={x} y2={600} stroke="#282040" strokeWidth={0.8} opacity={0.4} />
      ))}

      {/* lamp reflection on wet pavement */}
      <ellipse cx={230} cy={500} rx={60} ry={40} fill="url(#evReflect)" opacity={0.6} />
      <ellipse cx={230} cy={520} rx={30} ry={16} fill="#FFD060" opacity={0.2} />

      {/* cafe window reflections */}
      {[{ cx: 544, cy: 480 }, { cx: 632, cy: 480 }].map((r, i) => (
        <ellipse key={i} cx={r.cx} cy={r.cy} rx={24} ry={12} fill="#FFD890" opacity={0.18} />
      ))}

      {/* pavement edge / kerb */}
      <rect y={415} width={800} height={8} rx={2} fill="#2A2240" />
    </svg>
  );
}

// ── EXPORT ───────────────────────────────────────────────────────────────────

const SCENES: Record<SceneVariant, React.FC> = {
  afternoon: AfternoonScene,
  rainy: RainyScene,
  evening: EveningScene,
};

export function SceneBackground({ variant }: { variant: SceneVariant }) {
  const Scene = SCENES[variant];
  return <Scene />;
}

export function detectSceneVariant(src: string): SceneVariant | null {
  if (src.includes('afternoon')) return 'afternoon';
  if (src.includes('rainy') || src.includes('rain')) return 'rainy';
  if (src.includes('evening') || src.includes('exit')) return 'evening';
  return null;
}
