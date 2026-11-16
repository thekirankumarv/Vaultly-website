'use client';

import { Check, ChevronRight, Cloud, Copy, FileText, Fingerprint, FolderLock, HardDrive, Lock, ScanLine, Share2, ShieldCheck, Smartphone, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { asset, ASKS, STORY } from './data';
import { ease, glide, Phone, Reveal, useShots } from './ui';

type Skin = 'nova' | 'orbit' | 'aurora' | 'ember';
const SKIN: Record<Skin, string> = {
  nova: 'linear-gradient(120deg, #19B4D8 0%, #2F7BE8 45%, #2C3FA8 80%, #3A2C78 100%)',
  orbit: 'linear-gradient(135deg, #2A2B33 0%, #0E0F13 45%, #24252D 75%, #111217 100%)',
  aurora: 'linear-gradient(120deg, #6C4CF5 0%, #9B6BFF 40%, #6FA2F7 75%, #2BD4EE 100%)',
  ember: 'linear-gradient(120deg, #FF7A59 0%, #F2405F 55%, #B8245C 100%)',
};

export interface CardData {
  skin: Skin;
  bank: string;
  variant?: string;
  type: 'CREDIT' | 'DEBIT';
  last4: string;
  full?: string;
  name: string;
  thru: string;
  network: 'visa' | 'mc';
  metal?: boolean;
}

export const NOVA: CardData = { skin: 'nova', bank: 'Nova Bank', variant: 'Platinum', type: 'CREDIT', last4: '1111', full: '4111 1111 1111 1111', name: 'AARAV MEHTA', thru: '08/29', network: 'visa' };
export const ORBIT: CardData = { skin: 'orbit', bank: 'Orbit Bank', type: 'DEBIT', last4: '4444', full: '5555 5555 5555 4444', name: 'AARAV MEHTA', thru: '11/28', network: 'mc', metal: true };
const AURORA: CardData = { skin: 'aurora', bank: 'Lumen Bank', variant: 'Signature', type: 'CREDIT', last4: '0005', name: 'AARAV MEHTA', thru: '02/30', network: 'visa' };
const EMBER: CardData = { skin: 'ember', bank: 'Crest Bank', type: 'DEBIT', last4: '2207', name: 'AARAV MEHTA', thru: '05/27', network: 'mc' };

function Chip() {
  return (
    <svg className="pc-chip" viewBox="0 0 50 38" aria-hidden>
      <defs>
        <linearGradient id="chipg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F3D98B" />
          <stop offset="0.5" stopColor="#C9A24A" />
          <stop offset="1" stopColor="#E9C870" />
        </linearGradient>
      </defs>
      <rect width="50" height="38" rx="7" fill="url(#chipg)" />
      <path d="M0 13h16M0 25h16M34 13h16M34 25h16M16 0v38M34 0v38M16 19h18" stroke="#8E6E2A" strokeWidth="1.4" fill="none" opacity="0.7" />
    </svg>
  );
}

function Network({ n }: { n: CardData['network'] }) {
  if (n === 'visa') return <span className="pc-visa">VISA</span>;
  return (
    <span className="pc-mc" aria-label="Mastercard">
      <i />
      <i />
    </span>
  );
}

export function CardFace({ c, number }: { c: CardData; number?: string }) {
  return (
    <div className="pc-box">
      <div className={`pc${c.metal ? ' pc-metal' : ''}`} style={{ '--g': SKIN[c.skin] } as CSSProperties}>
        <div className="pc-arc" />
        <div className="pc-top">
          <div>
            <b>{c.bank}</b>
            {c.variant && <small>{c.variant}</small>}
          </div>
          <span className="pc-type">{c.type}</span>
        </div>
        <div className="pc-mid">
          <Chip />
          <svg className="pc-nfc" viewBox="0 0 24 24" aria-hidden>
            <path d="M8 8.5a5 5 0 0 1 0 7M11.5 6a8.5 8.5 0 0 1 0 12M15 3.5a12 12 0 0 1 0 17" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <div className="pc-num">{number ?? `•••• •••• •••• ${c.last4}`}</div>
        <div className="pc-bot">
          <div>
            <small>CARD HOLDER</small>
            <b>{c.name}</b>
          </div>
          <div>
            <small>VALID THRU</small>
            <b>{c.thru}</b>
          </div>
          <Network n={c.network} />
        </div>
        <div className="pc-sheen" />
      </div>
    </div>
  );
}

export function CardBack({ c }: { c: CardData }) {
  return (
    <div className="pc-box">
      <div className={`pc pc-back${c.metal ? ' pc-metal' : ''}`} style={{ '--g': SKIN[c.skin] } as CSSProperties}>
        <div className="pc-stripe" />
        <div className="pc-sig">
          <span />
          <b>•••</b>
        </div>
        <small className="pc-cvv">
          CVV · {c.bank} <Lock size={10} />
        </small>
        <div className="pc-back-net">
          <Network n={c.network} />
        </div>
        <div className="pc-sheen" />
      </div>
    </div>
  );
}

export function TiltCard({ children, className, max = 14, style }: { children: ReactNode; className?: string; max?: number; style?: CSSProperties }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useMotionValue(50);
  const sy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 160, damping: 26 });
  const sry = useSpring(ry, { stiffness: 160, damping: 26 });
  const sheenX = useMotionTemplate`${sx}%`;
  const sheenY = useMotionTemplate`${sy}%`;
  return (
    <motion.div
      className={`tilt ${className ?? ''}`}
      style={{ rotateX: srx, rotateY: sry, '--sx': sheenX, '--sy': sheenY, ...style } as never}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set((0.5 - py) * max * 2);
        sx.set(px * 100);
        sy.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        sx.set(50);
        sy.set(50);
      }}
    >
      {children}
    </motion.div>
  );
}

function Float({
  children,
  className,
  mx,
  my,
  depth,
  delay,
  from,
}: {
  children: ReactNode;
  className: string;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  delay: number;
  from: { x: number; y: number; rotate: number };
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div className={`float ${className}`} style={{ x, y }}>
      <motion.div initial={{ opacity: 0, ...from }} animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }} transition={{ delay, duration: 1.2, ease }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HeroStage() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 20 });
  const sy = useSpring(my, { stiffness: 70, damping: 20 });
  const rotY = useTransform(sx, (v) => v * 8);
  const rotX = useTransform(sy, (v) => v * -6);

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduce, mx, my]);

  return (
    <div className="stage">
      <div className="stage-halo" aria-hidden />
      <div className="stage-rings" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <motion.div className="stage-phone" style={{ rotateX: rotX, rotateY: rotY }} initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease, delay: 0.1 }}>
        <Phone id="12-home" alt="Vaultly home screen" priority />
      </motion.div>
      <Float className="f-nova" mx={sx} my={sy} depth={-28} delay={0.55} from={{ x: 160, y: 40, rotate: 12 }}>
        <div className="f-card" style={{ transform: 'rotate(-11deg)' }}>
          <TiltCard>
            <CardFace c={NOVA} />
          </TiltCard>
        </div>
      </Float>
      <Float className="f-orbit" mx={sx} my={sy} depth={24} delay={0.7} from={{ x: -160, y: 60, rotate: -12 }}>
        <div className="f-card" style={{ transform: 'rotate(9deg)' }}>
          <TiltCard>
            <CardFace c={ORBIT} />
          </TiltCard>
        </div>
      </Float>
      <Float className="f-dl" mx={sx} my={sy} depth={-14} delay={0.85} from={{ x: -120, y: -60, rotate: -8 }}>
        <div className="f-id" style={{ transform: 'rotate(-6deg)' }}>
          <img src={asset('samples/dl-front.webp')} alt="" draggable={false} />
        </div>
      </Float>
      <Float className="f-chip f-chip-a" mx={sx} my={sy} depth={34} delay={1.1} from={{ x: 0, y: 20, rotate: 0 }}>
        <div className="pill-chip">
          <span style={{ background: '#2EE59D' }}>
            <ShieldCheck size={15} />
          </span>
          <div>
            <b>Read on this phone</b>
            <small>Nothing uploaded</small>
          </div>
        </div>
      </Float>
      <Float className="f-chip f-chip-b" mx={sx} my={sy} depth={-30} delay={1.25} from={{ x: 0, y: 20, rotate: 0 }}>
        <div className="pill-chip">
          <span style={{ background: '#8B7CFF' }}>
            <Lock size={15} />
          </span>
          <div>
            <b>AES-256 sealed</b>
            <small>Fingerprint to reveal</small>
          </div>
        </div>
      </Float>
    </div>
  );
}

export function WalletFan() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const s = useSpring(p, { stiffness: 120, damping: 30 });
  const cards = [EMBER, AURORA, NOVA, ORBIT];
  const flip = useTransform(s, [0.72, 0.9], [0, 180]);
  const caption = useTransform(s, (v) => (v < 0.3 ? 0 : v < 0.7 ? 1 : 2));
  const [cap, setCap] = useState(0);
  useEffect(() => caption.on('change', (v) => setCap(v)), [caption]);
  const steps = ['Stacked, with every bank in view.', 'Pull down to fan them out.', 'Swipe to flip. The CVV stays sealed.'];

  return (
    <div ref={ref} className="fan" style={{ height: reduce ? 'auto' : '260vh' }}>
      <div className="fan-sticky">
        <div className="fan-copy">
          <span className="kicker">The wallet</span>
          <h2>
            Your cards, the way <span className="grad">a wallet should feel.</span>
          </h2>
          <div className="fan-steps">
            {steps.map((t, i) => (
              <motion.p key={t} animate={{ opacity: cap === i ? 1 : 0.32, x: cap === i ? 0 : -6 }} transition={{ duration: 0.4, ease }}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {t}
              </motion.p>
            ))}
          </div>
          <p className="fan-note">12 designs in glass, matte or metal. Card photos are only used to read the details, then deleted.</p>
        </div>
        <div className="fan-stage">
          {cards.map((c, i) => (
            <FanCard key={c.bank} c={c} i={i} n={cards.length} p={s} flip={i === cards.length - 1 ? flip : undefined} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FanCard({ c, i, n, p, flip }: { c: CardData; i: number; n: number; p: MotionValue<number>; flip?: MotionValue<number> }) {
  const peek = 19;
  const gap = 34;
  const y = useTransform(p, [0, 0.3, 0.6], [`${i * peek}%`, `${i * peek}%`, `${i * gap - (n - 1) * 9}%`]);
  const rotate = useTransform(p, [0.3, 0.6], [0, (i - (n - 1) / 2) * -2.5]);
  const scale = useTransform(p, [0, 0.3, 0.6], [1 - (n - 1 - i) * 0.0, 1, 1]);
  const ry = flip ?? 0;
  const backOpacity = useTransform(flip ?? p, (v) => (flip && v > 90 ? 1 : 0));
  const frontOpacity = useTransform(backOpacity, (v) => 1 - v);
  return (
    <motion.div className="fan-card" style={{ y, rotate, scale, zIndex: i }}>
      <motion.div className="flip" style={{ rotateY: ry }}>
        <motion.div className="flip-face" style={{ opacity: frontOpacity }}>
          <CardFace c={c} />
        </motion.div>
        <motion.div className="flip-face flip-back" style={{ opacity: backOpacity }}>
          <CardBack c={c} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const FIELDS = {
  front: [
    ['Licence No', 'KA01 •••• ••••', true],
    ['Name', 'AARAV MEHTA', false],
    ['Date of birth', '14-03-1994', false],
    ['Valid till', '13 Mar 2034', false],
  ],
  back: [
    ['Address', '42, Lake View Road, Indiranagar', false],
    ['Blood group', 'B+', false],
    ['Class of vehicle', 'LMV, MCWG', false],
    ['Emergency contact', '+91 98765 43210', false],
  ],
} as const;

export function ScanDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-20% 0px' });
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [phase, setPhase] = useState<'scan' | 'done'>('scan');
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduce) return setPhase('done');
    const t = setTimeout(
      () => {
        if (phase === 'scan') setPhase('done');
        else {
          setSide((s) => (s === 'front' ? 'back' : 'front'));
          setPhase('scan');
        }
      },
      phase === 'scan' ? 2200 : 4200,
    );
    return () => clearTimeout(t);
  }, [inView, phase, reduce]);

  return (
    <div ref={ref} className="scan">
      <div className="scan-visual">
        <div className="scan-frame">
          <i className="sc sc-tl" />
          <i className="sc sc-tr" />
          <i className="sc sc-bl" />
          <i className="sc sc-br" />
          <AnimatePresence mode="wait">
            <motion.img
              key={side}
              src={asset(`samples/dl-${side}.webp`)}
              alt={`Sample driving licence, ${side}`}
              initial={{ opacity: 0, rotateY: side === 'back' ? -90 : 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: side === 'back' ? 90 : -90 }}
              transition={{ duration: 0.5, ease }}
              draggable={false}
            />
          </AnimatePresence>
          {phase === 'scan' && !reduce && (
            <motion.div className="laser" initial={{ top: '4%' }} animate={{ top: '92%' }} transition={{ duration: 1.1, ease: 'easeInOut', repeat: 1, repeatType: 'reverse' }} />
          )}
          <div className="scan-badge">
            {phase === 'scan' ? (
              <>
                <Sparkles size={14} /> Finding text…
              </>
            ) : (
              <>
                <Check size={14} /> {FIELDS[side].length} details found
              </>
            )}
          </div>
        </div>
        <div className="scan-sides">
          {(['front', 'back'] as const).map((s) => (
            <button key={s} className={side === s ? 'on' : ''} onClick={() => (setSide(s), setPhase('scan'))}>
              {s === 'front' ? 'Front side' : 'Back side'}
            </button>
          ))}
        </div>
      </div>
      <div className="scan-fields">
        <div className="scan-head">
          <span>
            DETAILS · {phase === 'done' ? FIELDS[side].length : 0}/{FIELDS[side].length}
          </span>
          <small>
            <Smartphone size={13} /> on-device
          </small>
        </div>
        {FIELDS[side].map(([k, v, secret], i) => (
          <motion.div
            key={side + k}
            className="field"
            initial={false}
            animate={phase === 'done' ? { opacity: 1, y: 0 } : { opacity: 0.18, y: 8 }}
            transition={{ duration: 0.5, ease, delay: phase === 'done' ? i * 0.12 : 0 }}
          >
            <span className="field-tick">
              <Check size={13} strokeWidth={3} />
            </span>
            <div>
              <small>{k}</small>
              <b>{phase === 'done' ? v : '— — —'}</b>
            </div>
            {secret ? <Lock size={16} className="field-lock" /> : <Copy size={15} className="field-copy" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const GLYPHS = '0123456789•#*';

export function RevealDemo() {
  const reduce = useReducedMotion();
  const [state, setState] = useState<'locked' | 'holding' | 'open'>('locked');
  const [text, setText] = useState('•••• •••• •••• 4444');
  const timers = useRef<number[]>([]);
  const target = ORBIT.full!;

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const scramble = (to: string, done?: () => void) => {
    const steps = reduce ? 1 : 14;
    for (let k = 1; k <= steps; k++) {
      timers.current.push(
        window.setTimeout(() => {
          setText(
            to
              .split('')
              .map((ch, i) => (ch === ' ' || k === steps || i < (k / steps) * to.length ? ch : GLYPHS[(i * 7 + k * 3) % GLYPHS.length]))
              .join(''),
          );
          if (k === steps) done?.();
        }, k * 45),
      );
    }
  };

  const start = () => {
    if (state !== 'locked') return;
    clear();
    setState('holding');
    timers.current.push(
      window.setTimeout(
        () => {
          setState('open');
          scramble(target, () =>
            timers.current.push(
              window.setTimeout(() => {
                scramble('•••• •••• •••• 4444');
                setState('locked');
              }, 3200),
            ),
          );
        },
        reduce ? 0 : 900,
      ),
    );
  };
  const cancel = () => {
    if (state === 'holding') {
      clear();
      setState('locked');
    }
  };

  return (
    <div className="reveal">
      <TiltCard className="reveal-card" max={8}>
        <CardFace c={ORBIT} number={text} />
      </TiltCard>
      <div className="reveal-ui">
        <button
          className={`fp fp-${state}`}
          onPointerDown={start}
          onPointerUp={cancel}
          onPointerLeave={cancel}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && start()}
          aria-label="Hold to reveal the card number"
        >
          <svg className="fp-ring" viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r="46" />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              className="fp-progress"
              initial={false}
              animate={{ pathLength: state === 'locked' ? 0 : 1 }}
              transition={{ duration: state === 'holding' ? 0.9 : 0.3, ease: 'linear' }}
            />
          </svg>
          <Fingerprint size={38} strokeWidth={1.5} />
        </button>
        <div>
          <b>{state === 'open' ? 'Unlocked for this moment' : state === 'holding' ? 'Checking it’s you…' : 'Press and hold to reveal'}</b>
          <small>{state === 'open' ? 'It locks itself again in a few seconds.' : 'In the app, this is your fingerprint or screen lock.'}</small>
        </div>
      </div>
    </div>
  );
}

function Typed({ text, onDone }: { text: string; onDone: () => void }) {
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      setN(text.length);
      onDone();
      return;
    }
    if (n >= text.length) {
      const t = setTimeout(onDone, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN(n + 1), 55);
    return () => clearTimeout(t);
  }, [n, text, onDone, reduce]);
  return (
    <>
      {text.slice(0, n)}
      <span className="caret" />
    </>
  );
}

function Answer({ kind }: { kind: (typeof ASKS)[number]['kind'] }) {
  if (kind === 'card')
    return (
      <div className="ans">
        <div className="ans-row">
          <div className="ans-mini">
            <CardFace c={NOVA} />
          </div>
          <div>
            <b>Nova Bank Platinum</b>
            <small>•••• 1111 · 08/29</small>
          </div>
        </div>
        <div className="ans-btns">
          <span>
            <Copy size={13} /> Number
          </span>
          <span>
            <Copy size={13} /> Expiry
          </span>
          <span>
            <Share2 size={13} /> Share
          </span>
        </div>
      </div>
    );
  if (kind === 'id')
    return (
      <div className="ans">
        <div className="ans-row">
          <div className="ans-thumb">
            <span>ID</span>
          </div>
          <div>
            <b>ID Card</b>
            <small>Government ID · Sunita</small>
          </div>
          <ChevronRight size={18} className="ans-go" />
        </div>
        <div className="ans-secret">
          <small>ID NUMBER</small>
          <span>
            •••• tap to copy <Copy size={14} />
          </span>
        </div>
      </div>
    );
  return (
    <div className="ans">
      <div className="ans-row">
        <div className="ans-thumb ans-pdf">
          <FileText size={18} />
        </div>
        <div>
          <b>Rental Agreement</b>
          <small>Property</small>
        </div>
        <span className="ans-due">34 days left</span>
      </div>
    </div>
  );
}

export function AskDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const [k, setK] = useState(0);
  const [typed, setTyped] = useState(false);
  const [log, setLog] = useState<number[]>([]);

  useEffect(() => {
    if (!inView || !typed) return;
    const t = setTimeout(() => {
      setLog((l) => [...l, k].slice(-2));
      setTyped(false);
      setK((n) => (n + 1) % ASKS.length);
    }, 2600);
    return () => clearTimeout(t);
  }, [inView, typed, k]);

  return (
    <div ref={ref} className="ask">
      <div className="ask-head">
        <span className="orb-sm" />
        <div>
          <b>Ask Vaultly</b>
          <small>Find any card or document instantly</small>
        </div>
      </div>
      <div className="ask-log">
        <AnimatePresence initial={false} mode="popLayout">
          {log.map((n, i) => (
            <motion.div
              key={`${n}-${i}-${log.length}`}
              layout
              className="ask-turn"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease }}
            >
              <div className="bubble">{ASKS[n].q}</div>
              <p>{ASKS[n].a}</p>
              <Answer kind={ASKS[n].kind} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="ask-input">
        <span>{inView ? <Typed key={k} text={ASKS[k].q} onDone={() => setTyped(true)} /> : 'Ask about any card or document'}</span>
        <i>↑</i>
      </div>
    </div>
  );
}

const PEOPLE = [
  {
    id: 'me',
    name: 'You',
    rel: 'Me',
    color: '#8B7CFF',
    items: [
      ['Driving Licence', 'Government ID'],
      ['Nova Bank Platinum', 'Credit card'],
      ['Orbit Bank', 'Debit card'],
      ['Rental Agreement', 'Property'],
    ],
  },
  {
    id: 'mom',
    name: 'Sunita',
    rel: 'Mother',
    color: '#FF5D7A',
    items: [
      ['ID Card', 'Government ID'],
      ['Health Insurance', 'Insurance'],
    ],
  },
  {
    id: 'dad',
    name: 'Rajesh',
    rel: 'Father',
    color: '#2EE59D',
    items: [
      ['PAN Card', 'Government ID'],
      ['Pension Statement', 'Bills'],
    ],
  },
  {
    id: 'kid',
    name: 'Anya',
    rel: 'Daughter',
    color: '#FFB547',
    items: [
      ['School ID', 'Education'],
      ['Vaccination Record', 'Health'],
    ],
  },
] as const;

export function FamilyDemo() {
  const [who, setWho] = useState(0);
  const p = PEOPLE[who];
  return (
    <div className="family">
      <div className="fam-people">
        {PEOPLE.map((x, i) => (
          <button key={x.id} className={i === who ? 'on' : ''} onClick={() => setWho(i)} style={{ '--c': x.color } as CSSProperties}>
            {i === who && <motion.span layoutId="fam-pill" className="fam-pill" transition={glide} />}
            <span className="fam-av">{x.name[0]}</span>
            <span>
              {x.name}
              <small>{x.rel}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="fam-list">
        <AnimatePresence mode="popLayout" initial={false}>
          {p.items.map(([t, s], i) => (
            <motion.div
              key={p.id + t}
              className="fam-item"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4, ease, delay: i * 0.05 }}
              style={{ '--c': p.color } as CSSProperties}
            >
              <span className="fam-ic">{s.includes('card') ? <Lock size={16} /> : <FileText size={16} />}</span>
              <div>
                <b>{t}</b>
                <small>
                  {s} · {p.name === 'You' ? 'Yours' : p.name}
                </small>
              </div>
              <ChevronRight size={16} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ThemeCompare() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-25% 0px' });
  const x = useMotionValue(50);
  const clip = useMotionTemplate`inset(0 0 0 ${x}%)`;
  const left = useMotionTemplate`${x}%`;
  const [screen, setScreen] = useState('13-wallet');
  const dragging = useRef(false);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 2400);
      if (dragging.current) return;
      x.set(50 + Math.sin(k * Math.PI * 2) * 32);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, x]);

  const set = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  };

  return (
    <div className="compare-wrap">
      <div
        ref={ref}
        className="compare"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          set(e);
        }}
        onPointerMove={(e) => dragging.current && set(e)}
        onPointerUp={() => (dragging.current = false)}
        role="slider"
        aria-label="Compare light and dark theme"
        aria-valuenow={Math.round(x.get())}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') x.set(Math.max(0, x.get() - 5));
          if (e.key === 'ArrowRight') x.set(Math.min(100, x.get() + 5));
        }}
      >
        <Phone id={screen} theme="light" alt="Light theme" />
        <motion.div className="compare-top" style={{ clipPath: clip }}>
          <Phone id={screen} theme="dark" alt="Dark theme" />
        </motion.div>
        <motion.div className="compare-handle" style={{ left }}>
          <span>⟷</span>
        </motion.div>
        <span className="compare-tag tag-l">Light</span>
        <span className="compare-tag tag-r">Dark</span>
      </div>
      <div className="compare-pick">
        {[
          ['13-wallet', 'Wallet'],
          ['12-home', 'Home'],
          ['18-id-card', 'ID card'],
          ['22-ask-answers', 'Ask'],
        ].map(([id, l]) => (
          <button key={id} className={screen === id ? 'on' : ''} onClick={() => setScreen(id)}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BackupFlow() {
  const nodes = [
    { icon: FolderLock, t: 'Backup folder', s: 'After every change · 7 days kept', y: 18 },
    { icon: Cloud, t: 'Google Drive', s: 'Hidden, encrypted · optional', y: 50 },
    { icon: HardDrive, t: 'Android backup', s: 'Your vault data, by Google', y: 82 },
  ];
  return (
    <div className="flow">
      <svg className="flow-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {nodes.map((n) => (
          <g key={n.t}>
            <path d={`M22 50 C 45 50, 45 ${n.y}, 66 ${n.y}`} className="flow-path" />
            <path d={`M22 50 C 45 50, 45 ${n.y}, 66 ${n.y}`} className="flow-dash" />
          </g>
        ))}
      </svg>
      <div className="flow-src">
        <span className="flow-phone">
          <Smartphone size={30} strokeWidth={1.5} />
        </span>
        <b>Your phone</b>
        <small>
          <Lock size={11} /> Encrypted with your passphrase
        </small>
      </div>
      <div className="flow-dsts">
        {nodes.map((n, i) => (
          <Reveal key={n.t} delay={0.15 * i} className="flow-node">
            <span>
              <n.icon size={20} />
            </span>
            <div>
              <b>{n.t}</b>
              <small>{n.s}</small>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function Story() {
  const [active, setActive] = useState(0);
  const { theme } = useShots();
  return (
    <div className="story">
      <div className="story-list">
        {STORY.map((s, n) => (
          <motion.article key={s.shot} className={`chapter${n === active ? ' chapter-on' : ''}`} onViewportEnter={() => setActive(n)} viewport={{ margin: '-45% 0px -45% 0px' }}>
            <Reveal>
              <span className="kicker">{s.kicker}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </Reveal>
            <Reveal className="chapter-phone">
              <Phone id={s.shot} alt={s.title} />
            </Reveal>
          </motion.article>
        ))}
      </div>
      <div className="story-stage">
        <div className="story-sticky">
          <div className="story-glow" aria-hidden />
          <div className="story-steps" aria-hidden>
            {STORY.map((s, n) => (
              <span key={s.shot} className={n === active ? 'on' : n < active ? 'past' : ''}>
                {n === active ? <ScanLine size={14} /> : n < active ? <Check size={14} /> : n + 1}
              </span>
            ))}
          </div>
          <div className="phone phone-lg">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={STORY[active].shot + theme}
                src={asset(`shots/${theme}/${STORY[active].shot}.webp`)}
                alt={STORY[active].title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.55, ease }}
                draggable={false}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
