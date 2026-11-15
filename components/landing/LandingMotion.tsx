'use client';

import { useEffect } from 'react';

/**
 * Direction B — "The Wall" landing motion.
 *
 * Renders nothing; wires the vendored official GSAP (public/vendor/gsap) after
 * mount. The pre-hydration `motion-ok` class (see layout.tsx) hides the two
 * cinematic reveals until the tweens own their start state, so there is no
 * flash. If the scripts fail or the visitor prefers reduced motion, the class
 * is removed and every element rests in its final state.
 *
 * Animations (design-lab/b-wall, NOTES.md §5):
 * progress hairline · cinematic hero lines · word morph · ink-band parallax ·
 * character appear · element reveals · flip zone scrub · background colour ·
 * wordmark rise. The template-list preview plate is plain pointer JS.
 */

/* Minimal structural types for the vendored UMD globals (gsap is vendored,
   not installed, so its bundled .d.ts is unavailable offline). */
interface GsapTimeline {
  to(target: unknown, vars: Record<string, unknown>): GsapTimeline;
}
interface GsapGlobal {
  registerPlugin(...plugins: unknown[]): void;
  to(target: unknown, vars: Record<string, unknown>): unknown;
  from(target: unknown, vars: Record<string, unknown>): unknown;
  fromTo(target: unknown, fromVars: Record<string, unknown>, toVars: Record<string, unknown>): unknown;
  set(target: unknown, vars: Record<string, unknown>): unknown;
  getProperty(target: unknown, property: string): unknown;
  timeline(vars?: Record<string, unknown>): GsapTimeline;
  utils: { toArray<T>(selector: unknown): T[] };
}
interface ScrollTriggerGlobal {
  create(vars: Record<string, unknown>): unknown;
  refresh(): void;
}
interface SplitTextGlobal {
  create(element: Element, vars: Record<string, unknown>): { lines: Element[]; chars: Element[] };
}

declare global {
  interface Window {
    gsap?: GsapGlobal;
    ScrollTrigger?: ScrollTriggerGlobal;
    SplitText?: SplitTextGlobal;
  }
}

const SCRIPTS = [
  '/vendor/gsap/gsap.min.js',
  '/vendor/gsap/ScrollTrigger.min.js',
  '/vendor/gsap/SplitText.min.js',
];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(src)));
      if ((existing as HTMLScriptElement).dataset.loaded === 'true') resolve();
      return;
    }
    const el = document.createElement('script');
    el.src = src;
    el.async = false;
    el.onload = () => { el.dataset.loaded = 'true'; resolve(); };
    el.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(el);
  });
}

interface MorphWord {
  el: HTMLElement;
}

export default function LandingMotion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    if (reduce) {
      root.classList.remove('motion-ok');
      return;
    }

    let cancelled = false;
    const cleanups: Array<() => void> = [];
    const reveal = () => root.classList.remove('motion-ok');

    (async () => {
      try {
        for (const src of SCRIPTS) {
          if (cancelled) return;
          await loadScript(src);
        }
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;
        const SplitText = window.SplitText;
        if (!gsap || !ScrollTrigger || !SplitText || cancelled) {
          reveal();
          return;
        }
        gsap.registerPlugin(ScrollTrigger, SplitText);
        await document.fonts.ready;
        if (cancelled) return;

        /* --- 1 · progress hairline ------------------------------------ */
        gsap.to('.progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
        });

        /* --- 2 · cinematic hero lines (the opening) -------------------- */
        const hero = document.querySelector<HTMLElement>('#hero-title');
        if (hero) {
          const split = SplitText.create(hero, { type: 'lines', mask: 'lines' });
          gsap.set(hero, { opacity: 1 });            // take ownership from CSS
          gsap.from(split.lines, {
            yPercent: 112,
            duration: 1.3,
            stagger: 0.14,
            ease: 'expo.out',
            delay: 0.1,
          });
        }
        reveal(); // tweens now own their start state — safe to unhide

        /* --- 3 · word morph: printed → live → scanned ------------------- */
        const morphEl = document.querySelector<HTMLElement>('#morph');
        if (morphEl) {
          const words = ['printed', 'live', 'scanned'];
          const glyphs = 'abcdefghijklmnopqrstuvwxyz#*';
          let index = 0;
          const morphTo = (next: string) =>
            new Promise<void>((resolve) => {
              const steps = 7;
              let frame = 0;
              const timer = window.setInterval(() => {
                if (cancelled) { window.clearInterval(timer); resolve(); return; }
                frame += 1;
                morphEl.textContent = next
                  .split('')
                  .map((c, i) => (frame > i + 3 ? c : glyphs[Math.floor(Math.random() * glyphs.length)]))
                  .join('');
                if (frame >= steps + 3) {
                  window.clearInterval(timer);
                  morphEl.textContent = next;
                  resolve();
                }
              }, 55);
            });
          const cycle = async () => {
            while (!cancelled) {
              await new Promise((r) => setTimeout(r, 3200));
              if (cancelled) return;
              index = (index + 1) % words.length;
              await morphTo(words[index]);
            }
          };
          void cycle();
          cleanups.push(() => { cancelled = true; });
        }

        /* --- 4 · ink band parallax ------------------------------------- */
        const band = document.querySelector('#band-big');
        if (band) {
          gsap.fromTo(band, { yPercent: 16 }, {
            yPercent: -12,
            ease: 'none',
            scrollTrigger: { trigger: '.inkband', start: 'top bottom', end: 'bottom top', scrub: true },
          });
        }

        /* --- 5 · character appear on the problem statement -------------- */
        const intro = document.querySelector<HTMLElement>('#intro-statement');
        if (intro) {
          const split = SplitText.create(intro, { type: 'chars' });
          gsap.from(split.chars, {
            autoAlpha: 0,
            y: 14,
            duration: 0.5,
            stagger: { each: 0.008, from: 'random' },
            ease: 'power2.out',
            scrollTrigger: { trigger: intro, start: 'top 78%', once: true },
          });
        }

        /* --- 6 · element reveals (rows arrive as units) ------------------ */
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 28,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

        /* --- 7 · FLIP ZONE: one menu, three homes (the moment) ---------- */
        const card = document.querySelector<HTMLElement>('#flip-card');
        const zones = ['zone-1', 'zone-2', 'zone-3'].map((id) => document.getElementById(id));
        if (card && zones.every(Boolean)) {
          let deltas: Array<{ x: number; y: number }> = [];
          const measure = () => {
            if (window.innerWidth <= 900) { deltas = []; return; }
            const prev = { x: gsap.getProperty(card, 'x'), y: gsap.getProperty(card, 'y') };
            gsap.set(card, { x: 0, y: 0 });
            const base = card.getBoundingClientRect();
            deltas = zones.map((z) => {
              const r = z!.getBoundingClientRect();
              const pad = Math.min(30, window.innerWidth * 0.02);
              return { x: (r.left + pad) - base.left, y: (r.top + pad) - base.top };
            });
            gsap.set(card, { x: prev.x as number, y: prev.y as number });
          };
          measure();
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: '#flip-stage',
              start: 'top 62%',
              end: 'bottom 45%',
              scrub: 0.6,
              invalidateOnRefresh: true,
              onRefresh: measure,
            },
          });
          tl.to(card, {
            x: () => (deltas[1] ? deltas[1].x : 0),
            y: () => (deltas[1] ? deltas[1].y : 0),
            duration: 1,
            ease: 'power2.inOut',
          }).to(card, {
            x: () => (deltas[2] ? deltas[2].x : 0),
            y: () => (deltas[2] ? deltas[2].y : 0),
            duration: 1,
            ease: 'power2.inOut',
          });
        }

        /* --- 8 · background colour: paper → ink → paper ----------------- */
        const templates = document.getElementById('templates');
        if (templates) {
          const toInk = () => gsap.to('body', { backgroundColor: '#17140F', duration: 0.6, overwrite: 'auto' });
          const toPaper = () => gsap.to('body', { backgroundColor: '#F2ECDF', duration: 0.6, overwrite: 'auto' });
          ScrollTrigger.create({
            trigger: templates,
            start: 'top 55%',
            end: 'bottom 45%',
            onEnter: toInk,
            onEnterBack: toInk,
            onLeave: toPaper,
            onLeaveBack: toPaper,
          });
        }

        /* --- 9 · wordmark rise, letter by letter ------------------------ */
        const letters = gsap.utils.toArray<HTMLElement>('.wm-letter');
        if (letters.length) {
          gsap.from(letters, {
            yPercent: 110,
            duration: 0.75,
            stagger: 0.06,
            ease: 'expo.out',
            scrollTrigger: { trigger: '#wordmark', start: 'top 94%', once: true },
          });
        }

        ScrollTrigger.refresh();
      } catch {
        reveal(); // scripts failed — show everything in its final state
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      reveal();
    };
  }, []);

  /* --- template list: the preview plate follows the pointer ------------ */
  useEffect(() => {
    const plate = document.getElementById('tpreview');
    const list = document.getElementById('tlist');
    if (!plate || !list) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const move = (e: PointerEvent) => {
      const x = Math.min(e.clientX + 28, window.innerWidth - 270);
      const y = Math.min(Math.max(e.clientY - 60, 8), window.innerHeight - 240);
      plate.style.transform = `translate(${x}px, ${y}px)`;
    };
    const show = (rows: Array<[string, string]>, title: string) => {
      plate.querySelector<HTMLElement>('#tp-title')!.textContent = title;
      plate.querySelector<HTMLElement>('#tp-rows')!.innerHTML = rows
        .map(([n, p]) => `<div class="flex gap-2 items-baseline text-sm py-1"><span>${n}</span><i class="flex-1 border-b border-dotted border-menu-ink-400 translate-y-[-4px] not-italic"></i><b class="font-bold tabular-nums">${p}</b></div>`)
        .join('');
      plate.style.opacity = '1';
      plate.style.visibility = 'visible';
    };
    const hide = () => {
      plate.style.opacity = '0';
      plate.style.visibility = 'hidden';
    };

    const rows = Array.from(list.querySelectorAll<HTMLElement>('.trow'));
    const onEnter = (e: Event) => {
      const row = (e.currentTarget as HTMLElement).dataset;
      if (row?.tp && row?.name) show(JSON.parse(row.tp), row.name);
    };
    rows.forEach((r) => {
      r.addEventListener('pointerenter', onEnter);
      r.addEventListener('pointermove', move);
      r.addEventListener('pointerleave', hide);
    });
    return () => {
      rows.forEach((r) => {
        r.removeEventListener('pointerenter', onEnter);
        r.removeEventListener('pointermove', move);
        r.removeEventListener('pointerleave', hide);
      });
    };
  }, []);

  return null;
}
