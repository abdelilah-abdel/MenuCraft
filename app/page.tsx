'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MenuService } from '@/lib/services/menuService';
import { Menu } from '@/lib/types/menu';
import { Button } from '@/components/ui/Button';
import LandingMotion from '@/components/landing/LandingMotion';

/* The six templates on the shelf — name, use, and the rows the hover plate shows */
const SHELF = [
  { id: 'classic', name: 'Classic', use: 'Fine dining · centred serif', rows: [['Bruschetta', '8'], ['Tagliatelle', '16'], ['Tiramisù', '7']] },
  { id: 'modern', name: 'Modern', use: 'Bars · dark, bold', rows: [['Smash burger', '12'], ['Loaded fries', '7'], ['Stout', '6']] },
  { id: 'minimal', name: 'Minimal', use: 'Cafés · content first', rows: [['Filter', '3'], ['Toast', '5'], ['Cake', '4']] },
  { id: 'medina-cafe', name: 'Medina Café', use: 'Moroccan cafés · warm plaster', rows: [['Mint tea', '20'], ['Chebakia', '15'], ['Msemen', '25']] },
  { id: 'moroccan-fine-dining', name: 'Moroccan Fine Dining', use: 'Riads · ruled, restrained', rows: [['Mechoui', '140'], ['Tagine kefta', '95'], ['Orange blossom', '40']] },
  { id: 'modern-moroccan-garden', name: 'Moroccan Garden', use: 'Courtyards · leafy, seasonal', rows: [['Courgette salad', '65'], ['Lamb, preserved lemon', '120'], ['Mint sorbet', '45']] },
] as const;

const DIFFER = [
  { title: 'Physical menu aesthetic', body: 'Menus are set like print — rules, leaders, stock — so they land on the table looking like they belong there.' },
  { title: 'Workbench simplicity', body: 'Sections, items, prices, colours. The form is the whole learning curve; no design skills required.' },
  { title: 'Generous free tier', body: 'One menu, unlimited items, QR codes and public links — free forever, no contract, ever.' },
  { title: 'Hand-crafted templates', body: 'Six designs drawn for food, not for blogs: Classic, Modern, Minimal, Medina Café, Moroccan Fine Dining, Moroccan Garden.' },
];

const WORDMARK = 'MENUCRAFT'.split('');

export default function Home() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [owner, setOwner] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOwnerWorkspace() {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });
        const result = await response.json() as { owner?: { id: string; email: string } | null };
        if (!isMounted || !response.ok || !result.owner) return;

        setOwner(result.owner);
        const menu = await MenuService.loadOwnerMenu(result.owner.id);
        if (isMounted) setMenus(menu ? [menu] : []);
      } catch {
        // Keep the public landing page available when session lookup fails.
      }
    }

    void loadOwnerWorkspace();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setOwner(null);
    setMenus([]);
  };

  return (
    <div className="min-h-screen bg-menu-paper-200">
      <LandingMotion />
      <div className="progress fixed top-0 left-0 h-[3px] w-full bg-menu-stamp-500 origin-left scale-x-0 z-[100]" aria-hidden="true"></div>

      {/* ============ NAV — a thin index, not a banner ============ */}
      <nav className="sticky top-0 z-50 bg-menu-paper-200 border-b-menu border-menu-ink-900">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-1 group">
              <span className="text-xl font-extrabold tracking-[-0.03em] text-menu-ink-900">MenuCraft</span>
              <span className="text-menu-stamp-500 text-sm">∗</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#bench" className="text-sm font-semibold text-menu-ink-700 hover:text-menu-stamp-600 transition-colors">
                The bench
              </a>
              <a href="#templates" className="text-sm font-semibold text-menu-ink-700 hover:text-menu-stamp-600 transition-colors">
                Templates
              </a>
              <a href="#why" className="text-sm font-semibold text-menu-ink-700 hover:text-menu-stamp-600 transition-colors">
                Why
              </a>
              {owner ? (
                <>
                  <span className="text-xs text-menu-ink-500">{owner.email}</span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-sm font-semibold text-menu-ink-700 hover:text-menu-stamp-600 transition-colors"
                  >
                    Sign out
                  </button>
                  <Link href="/builder">
                    <Button variant="stamp-solid" size="sm">Manage menu</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className="text-sm font-semibold text-menu-ink-700 hover:text-menu-stamp-600 transition-colors">
                    Sign in
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="primary" size="sm">Create account</Button>
                  </Link>
                </>
              )}
            </div>

            <Link href={owner ? '/builder' : '/sign-up'} className="md:hidden">
              <Button variant="primary" size="sm">
                {owner ? 'Your menu' : 'Get started'}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ============ OPENING — the statement ============ */}
      <section className="bg-menu-paper-200 px-6 lg:px-12 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="kicker mb-8">Menu workbench · est. 2025</p>

          <h1
            id="hero-title"
            data-cinematic
            className="font-extrabold text-[clamp(52px,9.5vw,138px)] leading-[0.92] tracking-[-0.045em] text-menu-ink-900 max-w-[14ch] text-balance"
          >
            A menu is a <span className="font-light">printed</span> thing — until it{' '}
            <span className="text-menu-stamp-500">isn’t.</span>
          </h1>

          <div className="mt-12 md:mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <p className="text-lg md:text-xl text-menu-ink-700 max-w-[42ch] leading-snug">
              MenuCraft is the wall where a restaurant’s menu gets set, proofed and pinned —
              five minutes from blank page to a QR on every table.
            </p>

            <div className="md:text-right">
              <p className="text-[clamp(22px,3vw,34px)] font-bold tracking-[-0.02em] leading-none">
                From <span id="morph" className="text-menu-stamp-500 inline-block min-w-[7ch] text-left">printed</span> to your table.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 md:justify-end">
                <Link href={owner ? '/builder' : '/sign-up'}>
                  <Button variant="primary" size="lg">
                    {owner ? 'Maintain your menu' : 'Open the workbench'}
                  </Button>
                </Link>
                <a href="#templates">
                  <Button variant="secondary" size="lg">See the six templates</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ INK BAND — parallax statement ============ */}
      <div className="inkband bg-menu-ink-900 text-menu-paper-200 px-6 lg:px-12 py-20 md:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <p
            id="band-big"
            className="font-extrabold text-[clamp(44px,8vw,120px)] leading-[0.94] tracking-[-0.04em] max-w-[16ch] will-change-transform"
          >
            Set it like <span className="text-menu-stamp-400">paper.</span>
            <br />
            Update it like <span className="text-menu-stamp-400">code.</span>
          </p>
          <div className="mt-10 flex flex-wrap justify-between gap-4 text-xs uppercase tracking-[0.16em] text-menu-paper-500">
            <span>MenuCraft — digital menus, made simple</span>
            <span>Free to start</span>
          </div>
        </div>
      </div>

      {/* ============ INTRODUCTION — the problem, on an empty wall ============ */}
      <section id="why" className="bg-menu-paper-200 px-6 lg:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <p className="kicker mb-8">Why this exists</p>

          <h2
            id="intro-statement"
            data-cinematic
            className="font-extrabold text-[clamp(32px,4.6vw,62px)] leading-[1.05] tracking-[-0.03em] max-w-[22ch] text-menu-ink-900"
          >
            Restaurants pay $500–$2,000 a redesign, or $50–$200 a month on a contract.
            MenuCraft takes five minutes and costs nothing to start.
          </h2>

          <div className="mt-14 md:mt-20 border-t-[1.5px] border-menu-ink-900 md:grid md:grid-cols-2">
            {DIFFER.map((row) => (
              <div
                key={row.title}
                data-reveal
                className="py-6 md:py-7 border-b border-menu-ink-200 md:odd:border-r md:odd:border-menu-ink-200 md:odd:pr-10 md:even:pl-10"
              >
                <h3 className="text-xl md:text-2xl font-extrabold tracking-[-0.02em] text-menu-ink-900 uppercase">
                  {row.title}
                </h3>
                <p className="mt-2.5 text-menu-ink-500 max-w-[46ch]">{row.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ THE BENCH — one menu, three homes (the moment) ============ */}
      <section id="bench" className="bg-menu-paper-200 px-6 lg:px-12 py-20 md:py-28 border-t border-menu-ink-200">
        <div className="max-w-6xl mx-auto">
          <p className="kicker mb-8">The bench — one menu, three homes</p>
          <h2 className="font-extrabold text-[clamp(32px,4.6vw,62px)] leading-[1] tracking-[-0.03em] max-w-[16ch] text-menu-ink-900">
            Set it once. It fits every frame.
          </h2>

          <div id="flip-stage" className="flip-stage mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-[clamp(16px,3vw,40px)]">
            {[
              { id: 'zone-1', ghost: 'Slot A — the phone in the customer’s hand', caption: 'On the phone' },
              { id: 'zone-2', ghost: 'Slot B — the sheet by the pass', caption: 'On the paper' },
              { id: 'zone-3', ghost: 'Slot C — the code on the table tent', caption: 'On the code' },
            ].map((zone) => (
              <figure
                key={zone.id}
                id={zone.id}
                className="relative border-[1.5px] border-menu-ink-900 min-h-[280px] md:min-h-[420px]"
              >
                <span className="absolute inset-x-4 top-4 bottom-14 flex items-center justify-center text-center text-sm text-menu-ink-500 opacity-70">
                  {zone.ghost}
                </span>
                <figcaption className="absolute bottom-0 inset-x-0 px-4 py-3 border-t-[1.5px] border-menu-ink-900 bg-menu-paper-200 text-xs font-bold uppercase tracking-[0.16em] text-menu-ink-900">
                  {zone.caption}
                </figcaption>
              </figure>
            ))}

            {/* The actor — one document travelling between three frames */}
            <div
              id="flip-card"
              className="flip-card bg-menu-paper-50 border-[1.5px] border-menu-ink-900 p-4 md:p-5 shadow-[6px_6px_0_rgba(11,9,6,0.14)]"
            >
              <div className="font-extrabold uppercase text-base tracking-[-0.01em] text-menu-ink-900">Casa Medina</div>
              <div className="text-xs text-menu-ink-500 mb-3">Moroccan kitchen, open fire, since 1998</div>
              <div className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-menu-stamp-600 border-b border-menu-ink-900 pb-1.5">Starters</div>
              <div className="flex items-baseline gap-2 text-sm py-1.5">
                <span className="font-semibold">Harira soup</span>
                <i className="flex-1 border-b-2 border-dotted border-menu-ink-300 translate-y-[-4px] not-italic"></i>
                <b className="font-extrabold tabular-nums">45</b>
              </div>
              <div className="flex items-baseline gap-2 text-sm py-1.5">
                <span className="font-semibold">Zaalouk</span>
                <i className="flex-1 border-b-2 border-dotted border-menu-ink-300 translate-y-[-4px] not-italic"></i>
                <b className="font-extrabold tabular-nums">55</b>
              </div>
              <div className="flex items-baseline gap-2 text-sm py-1.5">
                <span className="font-semibold">Pastilla</span>
                <i className="flex-1 border-b-2 border-dotted border-menu-ink-300 translate-y-[-4px] not-italic"></i>
                <b className="font-extrabold tabular-nums">85</b>
              </div>
              <div className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-menu-stamp-600 border-b border-menu-ink-900 pb-1.5 mt-3">Mains</div>
              <div className="flex items-baseline gap-2 text-sm py-1.5">
                <span className="font-semibold">Tagine kefta</span>
                <i className="flex-1 border-b-2 border-dotted border-menu-ink-300 translate-y-[-4px] not-italic"></i>
                <b className="font-extrabold tabular-nums">95</b>
              </div>
              <div className="flex items-baseline gap-2 text-sm py-1.5">
                <span className="font-semibold">Mechoui</span>
                <i className="flex-1 border-b-2 border-dotted border-menu-ink-300 translate-y-[-4px] not-italic"></i>
                <b className="font-extrabold tabular-nums">140</b>
              </div>
            </div>
          </div>

          <p className="mt-8 text-menu-ink-500 max-w-[54ch]">
            One document, three resting states: the phone, the sheet, the code. Keep scrolling —
            the same menu travels between them.
          </p>
        </div>
      </section>

      {/* ============ THE SHELF — six templates as a hoverable list ============ */}
      <section id="templates" className="bg-menu-ink-900 text-menu-paper-200 px-6 lg:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <p className="kicker kicker-on-ink mb-8">The shelf — six templates</p>
          <h2 className="font-extrabold text-[clamp(32px,4.6vw,62px)] leading-[1.02] tracking-[-0.03em] max-w-[18ch]">
            Six designs, <span className="text-menu-stamp-400">drawn for food.</span> Hover one to see it set.
          </h2>

          <div id="tlist" className="mt-12 md:mt-16 border-t border-menu-paper-500/40">
            {SHELF.map((t) => (
              <a
                key={t.id}
                href="/sign-up"
                className="trow group grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_auto] items-baseline gap-2 md:gap-8 py-5 md:py-7 border-b border-menu-paper-500/40"
                data-name={t.name}
                data-tp={JSON.stringify(t.rows)}
              >
                <h3 className="text-[clamp(28px,4.4vw,58px)] font-extrabold leading-none tracking-[-0.03em] transition-all duration-300 group-hover:text-menu-stamp-400 group-hover:translate-x-4">
                  {t.name}
                </h3>
                <span className="hidden md:inline text-xs uppercase tracking-[0.16em] text-menu-paper-500">
                  {t.use}
                </span>
                <span className="text-[clamp(20px,2.6vw,34px)] font-light text-menu-paper-500 opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:text-menu-stamp-400 group-hover:translate-x-0 -translate-x-2">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Hover plate — follows the pointer, shows the template set */}
      <div id="tpreview" aria-hidden="true">
        <div id="tp-title" className="font-extrabold uppercase text-sm tracking-[0.06em] mb-2 text-menu-ink-900">Classic</div>
        <div id="tp-rows" className="text-menu-ink-700"></div>
      </div>

      {/* ============ YOUR MENU (signed in) ============ */}
      {owner && menus.length > 0 && (
        <section id="your-menu" className="bg-menu-paper-100 px-6 lg:px-12 py-20 border-t border-menu-ink-200">
          <div className="max-w-6xl mx-auto">
            <p className="kicker mb-6">On your wall</p>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-menu-ink-900">Your menu</h2>
                <p className="mt-2 text-menu-ink-500">One restaurant workspace, one menu to maintain.</p>
              </div>
              <Link href="/builder">
                <Button variant="primary">Open the workbench</Button>
              </Link>
            </div>

            {menus.slice(0, 1).map((menu) => (
              <div key={menu.id} className="menu-card p-6 md:p-8 max-w-2xl">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-2xl font-extrabold tracking-[-0.02em] text-menu-ink-900">
                    {menu.restaurantName}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.14em] text-menu-ink-500">
                    {menu.sections.length} sections • {menu.template}
                  </span>
                </div>
                <p className="mt-3 text-menu-ink-500">
                  {menu.description || 'No description yet — open the workbench and set it.'}
                </p>
                <div className="mt-6 flex gap-3">
                  <Link href={`/menu/${menu.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">View</Button>
                  </Link>
                  <Link href={`/builder?id=${menu.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">Edit</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============ CLOSING ============ */}
      <section className="bg-menu-paper-200 px-6 lg:px-12 pt-20 md:pt-28 pb-10 border-t border-menu-ink-200">
        <div className="max-w-6xl mx-auto">
          <p className="kicker mb-8">Closing</p>
          <h2 className="font-extrabold text-[clamp(44px,8vw,116px)] leading-[0.94] tracking-[-0.045em] max-w-[13ch] text-menu-ink-900">
            Build it tonight. Scan it tomorrow.
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={owner ? '/builder' : '/sign-up'}>
              <Button variant="stamp-solid" size="lg">
                {owner ? 'Open the workbench' : 'Start on the free tier'}
              </Button>
            </Link>
            <a href="#templates">
              <Button variant="secondary" size="lg">Walk the shelf</Button>
            </a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER + GIANT WORDMARK ============ */}
      <footer className="bg-menu-paper-200 px-6 lg:px-12 pb-0">
        <div className="max-w-6xl mx-auto">
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 py-5 border-t-[1.5px] border-menu-ink-900 text-xs font-bold uppercase tracking-[0.14em] text-menu-ink-700" aria-label="Footer">
            <a href="#bench" className="hover:text-menu-stamp-600">The bench</a>
            <a href="#templates" className="hover:text-menu-stamp-600">Templates</a>
            <a href="#why" className="hover:text-menu-stamp-600">Why</a>
            <Link href="/sign-in" className="hover:text-menu-stamp-600">Sign in</Link>
            <span className="ml-auto text-menu-ink-500 font-medium normal-case tracking-normal text-[13px]">
              © 2025 MenuCraft · MIT licence · digital menus made simple
            </span>
          </nav>

          <div id="wordmark" className="overflow-hidden leading-[0.74] pt-2 select-none" aria-hidden="true">
            <span className="text-[clamp(64px,16.2vw,270px)] font-extrabold tracking-[-0.05em] text-menu-ink-900">
              {WORDMARK.map((letter, i) => (
                <span key={i} className={`wm-letter inline-block ${i % 3 === 2 ? 'text-menu-stamp-500' : ''}`}>
                  {letter}
                </span>
              ))}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
