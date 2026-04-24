'use client';

import { motion } from 'framer-motion';
import type { Emotion } from '@/lib/types';

interface KaiCharacterProps {
  emotion: Emotion;
}

const P = {
  skin:    '#F2C8A4',
  skinSh:  '#DDA882',
  skinHi:  '#FAE0CC',
  hair:    '#160E06',
  hairHi:  '#2A180A',
  eye:     '#3C1E0C',
  pupil:   '#0C0804',
  lash:    '#1A0D05',
  jacket:  '#1B2338',
  jacketD: '#111828',
  shirt:   '#EDECE8',
  mouth:   '#B86850',
};

interface EC {
  lBrow: string;
  rBrow: string;
  eyeScaleY: number;
  lid: string;
  lidShadow: string;
  mouth: string;
}

function mkE(lBrow: string, rBrow: string, eyeSY: number, lid: string, mouth: string): EC {
  return { lBrow, rBrow, eyeScaleY: eyeSY, lid, lidShadow: `${lid} L 21,-13 L -21,-13 Z`, mouth };
}

const EM: Record<Emotion, EC> = {
  neutral:     mkE('M 82,194 Q 107,188 132,193', 'M 168,193 Q 193,188 218,194', 0.71, 'M -21,0 Q 0,-11 21,0',   'M 130,273 Q 150,276 170,273'),
  thinking:    mkE('M 82,196 Q 107,190 132,194', 'M 168,194 Q 193,190 218,196', 0.57, 'M -21,1 Q 0,-8 21,1',    'M 130,274 Q 150,277 170,274'),
  attentive:   mkE('M 82,190 Q 107,183 132,190', 'M 168,190 Q 193,183 218,190', 0.86, 'M -21,-1 Q 0,-13 21,-1', 'M 130,272 Q 150,275 170,272'),
  slight_smile:mkE('M 82,190 Q 107,183 132,190', 'M 168,190 Q 193,183 218,190', 0.71, 'M -21,0 Q 0,-10 21,0',   'M 130,270 Q 150,263 170,270'),
  distant:     mkE('M 82,198 Q 107,193 132,197', 'M 168,197 Q 193,193 218,198', 0.50, 'M -21,2 Q 0,-6 21,2',    'M 130,275 Q 150,278 170,275'),
  caught:      mkE('M 82,186 Q 107,178 132,186', 'M 168,186 Q 193,178 218,186', 0.93, 'M -21,-2 Q 0,-14 21,-2', 'M 130,272 Q 150,275 170,272'),
  warm:        mkE('M 82,192 Q 107,185 132,192', 'M 168,192 Q 193,185 218,192', 0.64, 'M -21,0 Q 0,-10 21,0',   'M 130,270 Q 150,262 170,270'),
};

function EyeGroup({ cx, cy, em, flip = false }: { cx: number; cy: number; em: EC; flip?: boolean }) {
  return (
    <g transform={`translate(${cx},${cy})${flip ? ' scale(-1,1)' : ''}`}>
      {/* white */}
      <ellipse rx={21} ry={11} fill="white" />
      {/* iris */}
      <motion.circle
        r={14}
        fill={P.eye}
        animate={{ scaleY: em.eyeScaleY }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ transformOrigin: '0px 0px' }}
      />
      {/* pupil */}
      <motion.circle
        r={8}
        fill={P.pupil}
        animate={{ scaleY: em.eyeScaleY * 0.9 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ transformOrigin: '0px 0px' }}
      />
      {/* iris highlights */}
      <circle cx={5} cy={-3} r={3} fill="white" opacity={0.88} />
      <circle cx={-7} cy={3} r={1.5} fill="white" opacity={0.42} />
      {/* upper lid shadow */}
      <motion.path
        animate={{ d: em.lidShadow }}
        transition={{ duration: 0.45 }}
        fill={P.lash}
        opacity={0.22}
      />
      {/* upper lid stroke */}
      <motion.path
        animate={{ d: em.lid }}
        transition={{ duration: 0.45 }}
        stroke={P.lash}
        strokeWidth={3.2}
        fill="none"
        strokeLinecap="round"
      />
      {/* lower lash hint */}
      <path d="M -18,4 Q 0,8 18,4" stroke="#8C5040" strokeWidth={0.9} fill="none" opacity={0.48} />
    </g>
  );
}

export function KaiCharacter({ emotion }: KaiCharacterProps) {
  const em = EM[emotion] ?? EM.neutral;

  return (
    <motion.svg
      viewBox="0 0 300 860"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-auto"
      style={{ filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.55))' }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
    >
      <defs>
        <linearGradient id="kSkinG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P.skinHi} />
          <stop offset="100%" stopColor={P.skin} />
        </linearGradient>
        <linearGradient id="kHairG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P.hairHi} />
          <stop offset="55%" stopColor={P.hair} />
        </linearGradient>
        <linearGradient id="kJacketG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P.jacket} />
          <stop offset="100%" stopColor={P.jacketD} />
        </linearGradient>
        <radialGradient id="kFaceHi" cx="42%" cy="32%" r="55%">
          <stop offset="0%" stopColor={P.skinHi} stopOpacity="0.55" />
          <stop offset="100%" stopColor={P.skinHi} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="kCheekL" cx="25%" cy="72%" r="20%">
          <stop offset="0%" stopColor="#E8906080" />
          <stop offset="100%" stopColor="#E8906000" />
        </radialGradient>
      </defs>

      {/* ── JACKET ── */}
      <path
        d="M 0,860 L 0,400 C 5,372 20,355 42,350
           L 90,344 C 106,344 122,404 129,414 L 150,432
           L 171,414 C 178,404 194,344 210,344
           L 258,350 C 280,355 295,372 300,400 L 300,860 Z"
        fill="url(#kJacketG)"
      />
      {/* lapel shades */}
      <path
        d="M 0,860 L 0,400 C 5,372 20,355 42,350 L 90,344
           L 129,414 L 150,432 L 148,458 Z"
        fill={P.jacketD} opacity={0.55}
      />
      <path
        d="M 300,860 L 300,400 C 295,372 280,355 258,350 L 210,344
           L 171,414 L 150,432 L 152,458 Z"
        fill={P.jacketD} opacity={0.55}
      />
      {/* shirt V */}
      <path
        d="M 90,344 L 210,344 L 171,414 L 150,432 L 129,414 Z"
        fill={P.shirt}
      />
      {/* collar left */}
      <path d="M 90,344 L 148,330 L 148,346 Z" fill={P.shirt} />
      {/* collar right */}
      <path d="M 210,344 L 152,330 L 152,346 Z" fill={P.shirt} />
      {/* collar shadow edge */}
      <path d="M 148,330 L 150,432 L 152,330" stroke="#D4D2CC" strokeWidth={1} fill="none" opacity={0.5} />
      {/* button seam */}
      <line x1={150} y1={434} x2={150} y2={860} stroke="#253050" strokeWidth={1.5} opacity={0.45} />
      {[490, 548, 606].map((y) => (
        <circle key={y} cx={150} cy={y} r={3.5} fill="#233060" />
      ))}

      {/* ── NECK ── */}
      <rect x={128} y={324} width={44} height={28} rx={5} fill="url(#kSkinG)" />
      <line x1={136} y1={327} x2={136} y2={350} stroke={P.skinSh} strokeWidth={1} opacity={0.28} />
      <line x1={164} y1={327} x2={164} y2={350} stroke={P.skinSh} strokeWidth={1} opacity={0.28} />

      {/* ── HEAD ── */}
      <ellipse cx={150} cy={228} rx={78} ry={90} fill="url(#kSkinG)" />
      <ellipse cx={150} cy={228} rx={78} ry={90} fill="url(#kFaceHi)" />
      {/* chin shadow */}
      <ellipse cx={150} cy={312} rx={52} ry={16} fill={P.skinSh} opacity={0.16} />
      {/* cheek blush (warm emotions only — always render but adjust opacity) */}
      <ellipse cx={93} cy={248} rx={28} ry={18} fill="url(#kCheekL)" opacity={emotion === 'warm' || emotion === 'slight_smile' ? 0.7 : 0.15} />
      <ellipse cx={207} cy={248} rx={28} ry={18} fill="url(#kCheekL)" opacity={emotion === 'warm' || emotion === 'slight_smile' ? 0.7 : 0.15} />
      {/* ears */}
      <ellipse cx={73} cy={228} rx={10} ry={14} fill={P.skin} />
      <ellipse cx={73} cy={228} rx={7} ry={10} fill={P.skinSh} opacity={0.18} />
      <ellipse cx={227} cy={228} rx={10} ry={14} fill={P.skin} />
      <ellipse cx={227} cy={228} rx={7} ry={10} fill={P.skinSh} opacity={0.18} />

      {/* ── HAIR ── */}
      <path
        d="M 74,242 C 70,206 77,162 96,140
           C 113,120 133,110 152,108
           C 173,110 196,118 215,140
           C 233,162 231,206 227,242"
        fill="url(#kHairG)"
      />
      {/* forehead hairline */}
      <path
        d="M 92,182 Q 112,154 137,146 Q 152,142 167,148 Q 190,156 210,180"
        stroke={P.hairHi} strokeWidth={2.5} fill="none" opacity={0.38}
      />
      {/* hair part shine */}
      <path
        d="M 148,108 Q 153,118 158,138"
        stroke="#2C1A0C" strokeWidth={3} fill="none" opacity={0.45}
      />
      {/* side strands */}
      <path d="M 74,242 Q 67,262 73,284" stroke={P.hair} strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d="M 227,242 Q 234,262 228,284" stroke={P.hair} strokeWidth={11} fill="none" strokeLinecap="round" />

      {/* ── EYEBROWS ── */}
      <motion.path
        animate={{ d: em.lBrow }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        stroke={P.hair}
        strokeWidth={4.5}
        fill="none"
        strokeLinecap="round"
      />
      <motion.path
        animate={{ d: em.rBrow }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        stroke={P.hair}
        strokeWidth={4.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* ── EYES ── */}
      <EyeGroup cx={107} cy={215} em={em} />
      <EyeGroup cx={193} cy={215} em={em} flip />

      {/* ── NOSE ── */}
      <path d="M 143,252 C 141,256 143,260 145,259" stroke={P.skinSh} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <path d="M 157,252 C 159,256 157,260 155,259" stroke={P.skinSh} strokeWidth={1.5} fill="none" strokeLinecap="round" />

      {/* ── MOUTH ── */}
      <path d="M 136,268 Q 150,266 164,268" stroke={P.skinSh} strokeWidth={1} fill="none" opacity={0.45} />
      <motion.path
        animate={{ d: em.mouth }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        stroke={P.mouth}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
