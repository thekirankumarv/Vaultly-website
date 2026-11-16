'use client';

import { ArrowLeft, ArrowRight, Download, Menu, Moon, Plus, Sun, X } from 'lucide-react';
import { AnimatePresence, motion, MotionConfig, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { createContext, use, useCallback, useEffect, useState, type ReactNode } from 'react';
import { asset, FAQ, GROUPS, hasDark, RELEASES, shot, SHOTS, type Theme } from './data';

export const ease = [0.22, 1, 0.36, 1] as const;
// Damping above critical: settles without overshoot.
export const glide = { type: 'spring', stiffness: 260, damping: 40 } as const;

type Release = { url: string; version: string; size: string };
const FALLBACK: Release = { url: RELEASES, version: 'v1.0.0', size: '25 MB' };
let pending: Promise<Release> | undefined;

const loadRelease = () =>
  (pending ??= fetch('https://api.github.com/repos/thekirankumarv/Vaultly-releases/releases/latest')
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((j: { tag_name: string; assets?: { name: string; size: number; browser_download_url: string }[] }) => {
      const apk = j.assets?.find((a) => a.name.endsWith('.apk'));
      return apk ? { url: apk.browser_download_url, version: j.tag_name, size: `${Math.round(apk.size / 1048576)} MB` } : FALLBACK;
    })
    .catch(() => FALLBACK));

export function useRelease() {
  const [rel, setRel] = useState(FALLBACK);
  useEffect(() => void loadRelease().then(setRel), []);
  return rel;
}

const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({ theme: 'dark', setTheme: () => {} });
export const useShots = () => use(ThemeCtx);

export function MotionRoot({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  return (
    <MotionConfig reducedMotion="user">
      <ThemeCtx value={{ theme, setTheme }}>{children}</ThemeCtx>
    </MotionConfig>
  );
}

export function ThemeSwitch({ compact }: { compact?: boolean }) {
  const { theme, setTheme } = useShots();
  return (
    <div className={`tswitch${compact ? ' tswitch-compact' : ''}`} role="group" aria-label="App theme in screenshots">
      {(['dark', 'light'] as const).map((t) => (
        <button key={t} onClick={() => setTheme(t)} aria-pressed={theme === t} aria-label={t === 'dark' ? 'Dark' : 'Light'} className={theme === t ? 'on' : ''}>
          {theme === t && <motion.span layoutId={compact ? 'ts-pill-c' : 'ts-pill'} className="tswitch-pill" transition={glide} />}
          {t === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
          {!compact && <span>{t === 'dark' ? 'Dark' : 'Light'}</span>}
        </button>
      ))}
    </div>
  );
}

export function AndroidIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2.5 18.5a9.5 9.5 0 0 1 19 0z" />
      <path d="M6.2 6.6 4.6 4.1M17.8 6.6l1.6-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="14" r="1.2" fill="var(--btn-ink)" />
      <circle cx="16" cy="14" r="1.2" fill="var(--btn-ink)" />
    </svg>
  );
}

export function DownloadButton({ big, label = 'Download for Android' }: { big?: boolean; label?: string }) {
  const { url, version, size } = useRelease();
  return (
    <Magnetic>
      <a href={url} className={`btn btn-primary${big ? ' btn-big' : ''}`}>
        <span className="btn-shine" aria-hidden />
        <AndroidIcon size={big ? 24 : 18} />
        <span className="btn-text">
          <span>{label}</span>
          {big && (
            <small>
              {version} · {size} · Free
            </small>
          )}
        </span>
        <Download size={big ? 20 : 16} className="btn-arrow" />
      </a>
    </Magnetic>
  );
}

export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const [p, setP] = useState({ x: 0, y: 0 });
  return (
    <motion.span
      className="magnetic"
      animate={p}
      transition={glide}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        setP({ x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength });
      }}
      onPointerLeave={() => setP({ x: 0, y: 0 })}
    >
      {children}
    </motion.span>
  );
}

export function Phone({ id, alt, className = '', priority, theme }: { id: string; alt?: string; className?: string; priority?: boolean; theme?: Theme }) {
  const ctx = useShots().theme;
  const t = theme ?? ctx;
  const src = shot(id, t);
  return (
    <div className={`phone ${className}`}>
      <AnimatePresence initial={false}>
        <motion.img
          key={src}
          src={src}
          alt={alt ?? ''}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: hasDark(id) ? 0.5 : 0, ease }}
        />
      </AnimatePresence>
    </div>
  );
}

export function Reveal({ children, delay = 0, y = 28, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Words({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <motion.span className={className} aria-label={text} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -8% 0px' }}>
      {text.split(' ').map((w, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <span className="word" aria-hidden>
            <motion.span variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.9, ease, delay: delay + i * 0.06 } } }}>{w}</motion.span>
          </span>
        </span>
      ))}
    </motion.span>
  );
}

export function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  return <motion.div className="scrollbar" style={{ scaleX }} />;
}

export function CursorGlow() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !matchMedia('(pointer: fine)').matches) return;
    const el = document.querySelector<HTMLElement>('.cursor-glow');
    if (!el) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${e.clientX - 300}px, ${e.clientY - 300}px, 0)`;
        el.style.opacity = '1';
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduce]);
  return <div className="cursor-glow" aria-hidden />;
}

const LINKS = [
  ['Features', '#features'],
  ['Security', '#security'],
  ['Screens', '#screens'],
  ['Install', '#install'],
  ['FAQ', '#faq'],
] as const;

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`nav${solid || open ? ' nav-solid' : ''}`}>
      <div className="wrap nav-row">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <img src={asset('icon.webp')} alt="" width={32} height={32} />
          Vaultly
        </a>
        <nav className="nav-links">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h}>
              {l}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <ThemeSwitch compact />
          <DownloadButton label="Download" />
        </div>
        <button className="nav-menu" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav className="nav-sheet" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease }}>
            {LINKS.map(([l, h]) => (
              <a key={h} href={h} onClick={() => setOpen(false)}>
                {l}
              </a>
            ))}
            <div className="sheet-row">
              <span>Screenshots</span>
              <ThemeSwitch />
            </div>
            <DownloadButton />
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Gallery() {
  const [group, setGroup] = useState<string>('All');
  const [open, setOpen] = useState<number>();
  const { theme } = useShots();
  const groups = GROUPS.filter((g) => SHOTS.some((s) => s.group === g && (theme === 'light' || hasDark(s.id))));
  const list = SHOTS.filter((s) => (group === 'All' || s.group === group) && (theme === 'light' || hasDark(s.id)));
  useEffect(() => {
    if (group !== 'All' && !groups.includes(group as never)) setGroup('All');
  }, [group, groups]);
  const [rail, setRail] = useState<HTMLDivElement | null>(null);

  const step = useCallback((d: number) => setOpen((o) => (o === undefined ? o : (o + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    if (open === undefined) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(undefined);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', key);
    };
  }, [open, step]);

  const scroll = (d: number) => rail?.scrollBy({ left: d * rail.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <>
      <div className="gallery-bar">
        <div className="filters">
          {['All', ...groups].map((g) => (
            <button
              key={g}
              className={`filter${g === group ? ' filter-on' : ''}`}
              onClick={() => {
                setGroup(g);
                rail?.scrollTo({ left: 0, behavior: 'smooth' });
              }}
            >
              {g === group && <motion.span layoutId="filter-pill" className="filter-pill" transition={glide} />}
              <span>{g}</span>
            </button>
          ))}
        </div>
        <ThemeSwitch />
      </div>
      <div className="rail-wrap">
        <button className="rail-arrow rail-prev" onClick={() => scroll(-1)} aria-label="Scroll left">
          <ArrowLeft size={20} />
        </button>
        <div className="rail" ref={setRail}>
          <AnimatePresence mode="popLayout">
            {list.map((s, n) => (
              <motion.button
                layout
                key={s.id}
                className="tile"
                onClick={() => setOpen(n)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease }}
                aria-label={`Open ${s.title}`}
              >
                <Phone id={s.id} alt={s.title} />
                <span className="tile-cap">
                  <small>{s.group}</small>
                  {s.title}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        <button className="rail-arrow rail-next" onClick={() => scroll(1)} aria-label="Scroll right">
          <ArrowRight size={20} />
        </button>
      </div>
      <AnimatePresence>
        {open !== undefined && list[open] && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(undefined)}
            role="dialog"
            aria-modal
            aria-label={list[open].title}
          >
            <button className="lb-close" onClick={() => setOpen(undefined)} aria-label="Close">
              <X size={22} />
            </button>
            <button className="lb-nav lb-prev" onClick={(e) => (e.stopPropagation(), step(-1))} aria-label="Previous">
              <ArrowLeft size={22} />
            </button>
            <motion.figure
              key={list[open].id}
              className="lb-figure"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(_, i) => Math.abs(i.offset.x) > 80 && step(i.offset.x < 0 ? 1 : -1)}
            >
              <Phone id={list[open].id} alt={list[open].title} priority />
              <figcaption>
                <small>
                  {list[open].group} · {open + 1}/{list.length}
                </small>
                {list[open].title}
              </figcaption>
            </motion.figure>
            <button className="lb-nav lb-next" onClick={(e) => (e.stopPropagation(), step(1))} aria-label="Next">
              <ArrowRight size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | undefined>(0);
  return (
    <div className="faq">
      {FAQ.map((f, n) => (
        <Reveal key={f.q} delay={n * 0.03} y={16}>
          <div className={`qa${open === n ? ' qa-on' : ''}`}>
            <button className="qa-q" onClick={() => setOpen(open === n ? undefined : n)} aria-expanded={open === n}>
              <span>{f.q}</span>
              <motion.span animate={{ rotate: open === n ? 45 : 0 }} transition={{ duration: 0.3, ease }} className="qa-icon">
                <Plus size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === n && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="qa-a">
                  <p>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function Spotlight({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`spot ${className}`}
      style={style}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}
