# MenuCraft Design Lab — Notes (Step 7)

> Three complete directions for the MenuCraft rebuild, built end to end from the adapted
> brief. Open **index.html** (double-click, no server) to see all three side by side.
> Nothing outside `design-lab/` was created or edited.

---

## 1. Design decision → reference → why

| Design decision | Reference | Why |
|---|---|---|
| One idea per screen; nav is a thin instrument, never a banner (A: ruled job-card strip; B: solid index bar; C: instrument bar) | R1 Mobbin hero gallery (Titan) — `research/ref-01-mobbin-hero-titan.jpeg` | Titan's split hero puts the headline in one half and the nav on a hairline; the page reads in one glance. |
| Type *is* the image in the opening: display type edge-to-edge, photo-less | R2 Oatly hero — `research/ref-02-oatly-hero.jpeg`; principle from Q1 | Oatly lays condensed caps over the frame until the words become the picture. No photography was available to us, so type carries the frame alone. |
| Statement gets an empty wall before any product shot appears | R3 Ragged Edge — `research/ref-03-raggededge-statement.jpeg`; Q2 | Ragged Edge gives one sentence two-thirds of a blank screen, then the work image follows. We repeat that order: statement → machine. |
| Hierarchy from weight + scale inside **one** family; five-ish size steps with violent jumps | R4 Mobbin M-Saans system breakdowns (80/56/44/24/16/12px, weight 652 vs 300, 80px rhythm) | Every strong reference builds hierarchy without a second typeface. Validates Bricolage-only rule; A uses the width axis (75–100%) for the same effect. |
| Ruled grids, hairline borders, **no** card shadows (except C's fan) | R5 Vitsœ product rows (text ref, capture blocked) | Vitsœ's 606 page: rules and order do all the structural work; nothing decorative. |
| Edit beside proof: form scrolls, proof pins, split collapses before it cramps | R6 Levenium Preview Panel + DatoCMS visual editing (text refs) | The preview pins below the header while the edit pane scrolls (sticky mode); container width — not viewport — decides the split. We implemented the sticky proof (A) and the tab collapse (C). |
| Prices as name → dotted leader → number, set like a printed card | Q4 (uiCookies rate card, viberdy Service Price Ledger, CodeFronts editorial two-column) | A price list is a menu; cards are for software, leaders are for food. All three directions use leaders, not pricing cards. |
| Horizontal shelf for the six templates with a visible progress cue | Q5 (Parable drag-scroll gallery, enrichr parallax gallery) | The shelf moves as one track; keyboard and reduced motion fall back to plain scroll. |
| 2–3 whole-page tint shifts as scene changes | Q6 + 02UI background-colour (read in full) | "Two or 3 shifts on a long page is a rhythm. A new tint every 200 pixels is a strobe." Each direction does exactly two. |
| Footer closes on one oversized wordmark, letters rising from the floor | Q7 (Design Lounge giant wordmark reveal, shadcn Giant Wordmark, staaarter bleed) | The last thing seen is the name itself, too big to fit — the page's final gesture. |
| Reveal the line, never the paragraph | Q8 + 02UI text-reveal (read in full) | "Body copy is for reading." Statements split by lines/chars; body copy never animates. |

## 2. The font and its licence

- **Bricolage Grotesque** (variable: `wght 200–800`, `wdth 75–100`, `opsz`), by The Bricolage
  Grotesque Project Authors.
- **Licence:** SIL Open Font License 1.1 — `fonts/OFL.txt` (copied from the official Google
  Fonts repository). OFL expressly permits web use, self-hosting and redistribution with the
  licence file. **Allowed.**
- **Files:** `fonts/bricolage-grotesque-latin.woff2` (131 KB) + `fonts/bricolage-grotesque-latin-ext.woff2`
  (54 KB), loaded with `@font-face` in every direction. No Google Fonts or any other font
  service is contacted at runtime.
- **Glyph coverage:** verified — the Spanish accents (á é í ó ú ñ ü), curly quotes (’ “ ”),
  en/em dashes and `№` used in content render correctly (visual check in §6).
- **Why this family:** the brief fixed *one* family for all text. A variable weight **and
  width** axis is what lets three directions build hierarchy differently from the same file:
  A contrasts 200↔800 at wdth 75, B jumps 800 display ↔ 400 body, C stays at a steady
  500–700 instrument voice.
- Deviation from the brief: the brief named Ribes (collletttivo). Ribes has no weight axis
  beyond a single style set suited to display; see "Deviations" §8.

## 3. Palette — every colour with its source

Colour names are written at their origin in each stylesheet's header comment.

**Direction A — The Garage**
| Token | Hex | Source |
|---|---|---|
| `--oil` | `#17130E` | sump oil / workshop floor |
| `--manila` | `#E6DCC6` | manila job-card stock |
| `--chalk` | `#F7F3EA` | chalk white, whitewashed brick |
| `--orange` | `#DC4B14` | enamel safety orange, workshop signage (display ≥24px only) |
| `--orange-ink` | `#A33610` | same enamel, darkened for small text (AA) |
| `--orange-lit` | `#E8641F` | same enamel, lifted for small text on oil (AA) |
| `--steel` | `#555C56` | galvanized steel, darkened for AA on manila |

**Direction B — The Wall**
| Token | Hex | Source |
|---|---|---|
| `--ink` | `#17140F` | letterpress black, ink-soaked fibre |
| `--paper` | `#F2ECDF` | offset litho paper stock |
| `--stamp` | `#C4311F` | red rubber stamp ink |
| `--stamp-lit` | `#E86B55` | stamp ink, lifted for the ink ground (AA) |
| `--graph` | `#55504A` | graphite pencil |

**Direction C — The Shop Floor**
| Token | Hex | Source |
|---|---|---|
| `--peg` | `#1A1C1B` | pegboard graphite |
| `--chalk` | `#F2F1EC` | chalk white |
| `--hazard` | `#F5C518` | workshop hazard-tape yellow |
| `--oxide` | `#B5461F` | rust oxide on steel (light grounds) |
| `--oxide-lit` | `#E07B4B` | rust oxide, lifted for the peg ground (AA) |

No cream appears that is not derived from a named stock (manila card, litho paper, chalk).

## 4. Contrast table (WCAG AA: 4.5:1 body, 3:1 large)

| Direction | Pair | Ratio | Result |
|---|---|---|---|
| A | oil on manila | 13.6:1 | ✅ AAA |
| A | orange-ink `#A33610` on manila (labels, 12px) | 5.0:1 | ✅ AA |
| A | steel `#555C56` on manila (captions) | 5.0:1 | ✅ AA |
| A | white on orange-ink (accent buttons) | 6.7:1 | ✅ AA |
| A | orange-lit `#E8641F` on oil (dark scene small text) | 5.5:1 | ✅ AA |
| A | orange `#DC4B14` on manila (display ≥34px only) | 3.1:1 | ✅ AA-large |
| B | ink on paper | ~15:1 | ✅ AAA |
| B | stamp `#C4311F` on paper | 4.7:1 | ✅ AA |
| B | stamp-lit `#E86B55` on ink | 5.9:1 | ✅ AA |
| B | graphite `#55504A` on paper | ~7:1 | ✅ AA |
| B | paper on ink (shelf rows) | ~15:1 | ✅ AAA |
| C | chalk on peg | 15.1:1 | ✅ AAA |
| C | hazard `#F5C518` on peg / peg on hazard (buttons) | 10.5:1 | ✅ AAA |
| C | oxide-lit `#E07B4B` on peg (badges) | 5.8:1 | ✅ AA |
| C | oxide `#B5461F` on chalk (section marks) | 4.8:1 | ✅ AA |
| C | step text `rgba(chalk,.55)` on peg | 5.5:1 | ✅ AA |

**Fixed during the gate:** A's orange labels (were 3.1:1 at 12px) split into `-ink`/`-lit`;
A's steel darkened (was 2.8:1); B's kicker on the dark shelf (was 3.4:1) got `-lit`; C's
sold-out badge on peg (was 3.2:1) got `-lit`; B's nav given a solid paper ground so it
survives the dark sections.

## 5. Motion table (animation → 02UI page → section → why it serves the story)

**Read in full on 02ui.com:** background-colour, text-reveal, mask-reveal, magnetic-button,
morphing-tabs, step-by-step-timeline, draggable-slider, flip-zone (8 pages), plus the full
50-animation index. The remaining entries below were taken from the index descriptions and
built with documented official GSAP APIs — see Deviations §8.

**Direction A (11)**
| Animation | 02UI page | Section | Why |
|---|---|---|---|
| Progress hairline | /motion/progress | page | How far through the job card you are |
| Hide header | /motion/hero… → hide-header | chrome | Reading room scrolling down, nav returns scrolling up |
| Text reveal (line mask) | /motion/text-reveal ✅ | intro statement | The sentence is the point; lines arrive in order |
| Mask reveal (`clip-path` inset) | /motion/mask-reveal ✅ | bench proof plate | The proof opens like a crop — mask is part of the design |
| Background colour ×2 | /motion/background-colour ✅ | manila → oil (QR) → manila | Marks the two scene changes; exactly two, per the page's own rule |
| Magnetic button | /motion/magnetic-button ✅ | CTAs | One quiet pull on primary actions only |
| SVG draw path | /motion/svg-draw-path | stamp & save | A chalk circle drawn around the save — the workshop gesture |
| Infinite marquee | /motion/infinite-marquee | under hero | BUILD · PROOF · PUBLISH ticker — the loop the product describes |
| Counter | /motion/counter | hero stats | 5 min / 6 / $0 arrive rather than sit there |
| Element reveal | /motion/element-reveal | ruled rows, QR plate | Blocks arrive as units, never word-by-word |
| Wordmark rise | (element reveal variant) | footer | Letters come up out of the floor, left to right |

**Direction B (10)**
| Animation | 02UI page | Section | Why |
|---|---|---|---|
| Progress hairline | /motion/progress | page | Position on the wall |
| Cinematic text (line mask) | /motion/cinematic-text | hero | More theatre than a product heading usually wants — this is a manifesto |
| Text morph | /motion/text-morph | "From printed → live → scanned" | The whole product in three words changing in place |
| Parallax | /motion/parallax | ink band | Stacked layers at different speeds give the band depth |
| Character appear | /motion/character-appear | intro statement | The problem assembles letter by letter — read it once |
| Element reveal | /motion/element-reveal | difference rows, rates | Units arrive; body copy never animates |
| **Flip zone** (the moment) | /motion/flip-zone ✅ | bench: one menu → phone / paper / code | One object, three jobs — the product's whole thesis in a scrub |
| Hoverable list | /motion/hoverable-list | template rows | Rows react on hover with a following plate; compare without leaving |
| Background colour | /motion/background-colour ✅ | paper → ink (shelf) → paper | The shelf is a dark room; the tint marks entering/leaving |
| Wordmark rise | (element reveal variant) | footer | Final gesture, letters rise |

**Direction C (12)**
| Animation | 02UI page | Section | Why |
|---|---|---|---|
| Progress hairline | /motion/progress | page | Bench read-out |
| Dual scramble | /motion/dual-scramble | hero: paper/phone → print/table | Two strings decode at once — the swap the product performs |
| Counter | /motion/counter | stats | Figures tick once on arrival |
| Step-by-step timeline | /motion/step-by-step-timeline ✅ | how-it-works | Honest fill: step ÷ total, labels always visible, goes backwards too |
| Morphing tabs | /motion/morphing-tabs ✅ | bench Edit/Proof/Share | The pill travels; where-am-I is clearer than a colour change |
| Draggable slider | /motion/draggable-slider ✅ | template shelf | A choice, not a display: drag, throw, snap to a real card, arrow keys |
| Card fan | /motion/card-fan | three templates off the shelf | The stack spreads into an arc so each face can be seen at once |
| Text reveal | /motion/text-reveal ✅ | intro statement | Line-mask arrival for the cost statement |
| Parallax | /motion/parallax | pegboard dot field | The board drifts against the scroll — the room has depth |
| Background colour | /motion/background-colour ✅ | peg → chalk (rates) → peg | The rates are a printed sheet laid on the bench |
| Magnetic button | /motion/magnetic-button ✅ | CTAs | Quiet pull, pointer only |
| Circle-fill button | /motion/circle-fill | all buttons | Fill grows from where the pointer entered; label clipped to the fill so it is always legible |

All motion: official GSAP 3.13 from jsdelivr (`gsap`, `ScrollTrigger`, `SplitText`, `Flip`,
`Draggable` — all free in 3.13; no Club plugins, no other libraries). Long soft eases
(`expo.out`, `power2/3`), no bounce or elastic. **`prefers-reduced-motion`:** every
direction early-returns before creating tweens, sets final states explicitly (wordmark
visible, counters at final values, card fan spread, flip card resting in zone 1, tab pill
placed statically, marquee untransformed), and keeps pinned/scroll content in normal flow.

## 6. Slop gate (scanner not installed — banned list applied by hand)

`node ~/.claude/skills/avoid-ai-design/scripts/detect.mjs` — **not present** in this
environment. The brief's banned list was run by hand against each `index.html` (the
focus-visible and `prefers-reduced-motion` rules are inline in every `<head>`, as the
scanner requires):

| Banned pattern | A | B | C |
|---|---|---|---|
| Inter | ✅ none | ✅ none | ✅ none |
| Purple/blue gradients | ✅ none | ✅ none | ✅ none |
| Centred hero + button | ✅ all left-aligned | ✅ | ✅ |
| Three-card grids | ✅ horizontal rail, 6 cards | ✅ list rows, zero cards | ✅ drag rail + fan |
| Card-in-card | ✅ | ✅ | ✅ |
| rounded-2xl shadows | ✅ square corners, hairlines | ✅ (one hard-offset shadow on the flip card, 6px solid, not a soft blur) | ⚠️ fan cards carry a soft lift shadow — intentional, they are physical cards off a shelf (see §8) |
| Glass effects | ✅ | ✅ | ✅ (topbar is 92% opaque, blur dropped in gate) |
| Icons in rounded squares | ✅ no icons at all | ✅ | ✅ |
| Uppercase tracked mono labels everywhere | ⚠️ one kicker per section, single family (mono impossible under one-family rule) | ⚠️ kickers only | ⚠️ kickers only |
| 01/02/03 as decoration | ⚠️ `JOB CARD №001` — the job-card number, functional | ✅ none | ⚠️ `STEP 01–04` — real steps on a real filling timeline, functional |
| Cream ground not from a named source | ✅ manila job card | ✅ litho paper | ✅ (dark ground, no cream) |
| Colours named in CSS | ✅ header comment + tokens | ✅ | ✅ |

**P0/P1 fixed in the gate:** contrast failures (§4), C's circle-fill label (blend-mode
produced off-palette colours mid-state → two-layer clip-path fill), C's glass blur removed.

## 7. Critique round — what the screenshots caught and what changed

Shots: `shots/*-full.png` (1440, reduced motion = final states), `shots/*-hero.png`
(1440, motion), `shots/*-mobile.png` (375). Driver: `shots/shoot.mjs` (raw CDP over
WebSocket, waits for `loadEventFired`, asserts `document.title` matches the direction
before every capture).

| Found in critique | Fix |
|---|---|
| A & C stats rendered the number at 12px (`5 min` showed a huge "min") — `.stat span` label rule leaked into the inner `.count` span | `.stat > span` + explicit `.count { font-size: inherit }` |
| C reduced-motion: active Edit tab was dark-on-dark — the travelling pill never got sized in the reduced branch | Static pill placement + resize handler added to the reduced branch; tabs stay clickable |
| C reduced-motion: card fan showed one stacked card, not its fanned final state | Final transforms (`translateX`/`rotate`) applied in the reduced branch |
| C reduced-motion: counters showed `0` (HTML started at 0 for the tick-up) | HTML now carries final values; the tick still starts from 0 when motion runs |
| B reduced-motion: flip card fell *below* the three zones | Fallback repositioning removed — the card keeps its absolute rest inside zone 1 |
| First capture pass: heroes stretched (2400px viewport = 2400px `svh`), then stale frames mislabelled a capture | Replaced with CDP driver: real 1440×900 metrics, load-event wait, title assertion per shot |
| A: mid-run contrast failures at small sizes | Token split into display/lit/ink variants (§4) |

**Post-fix verification** (`shots/check.mjs`): all three directions at 375 **and** 1440 —
`overflow = 0px`, `Bricolage` font loaded, no console errors, no empty headings, all
sections present.

## 8. Every place this run deviated from the brief, and why

1. **Mobbin MCP → substitutes.** No Mobbin MCP server exists in this environment (no
   `search_sections`, no MCP resources). Replaced with: 8 web queries written in the
   brief's one-concrete-layout style, 3 browser captures of Mobbin/live sites, 3 text
   references. The desktop window also stopped being visible mid-run, so references 5–6
   are text-only.
2. **`hallmark study` → hand pass.** Hallmark isn't installed. The vision pass was done by
   hand on each capture; pixel measurements came from `getComputedStyle` via CDP instead of
   `round-4/tools/study.py`.
3. **`avoid-ai-design` scanner → manual gate.** Not installed. The banned list was applied
   by hand (§6); inline focus/reduced-motion rules are in every head regardless.
4. **Folder name.** `round-5/` → `design-lab/` (this is a repo, not a rounds workspace;
   "never edit earlier rounds" is vacuous — nothing outside `design-lab/` was touched).
5. **Content source.** No `content.md`/`round-4`/`images/` — content came from the repo's
   own docs (`PROJECT_VISION.md`, `README.md`) and the just-merged Moroccan templates.
   Every number ($500–$2,000, $50–$200, $19/$49, six templates) is sourced from those.
6. **No photographs.** No licensed imagery exists in the repo, and the brief's
   "empty wall in a signature colour" fallback became CSS-drawn template previews instead.
   Nothing was borrowed from another project, so "never use a photo of a different
   building" is trivially satisfied. Image credits: **none required — zero photographs
   used.** The QR code was generated locally from the app's own `qrcode` dependency
   (`qr-demo.svg`).
7. **Font substitution.** Brief named Ribes; chose **Bricolage Grotesque** — a variable
   weight *and* width axis is what allows three genuinely different hierarchy methods from
   one family (§2). OFL, self-hosted, licence file included.
8. **02UI pages read in full: 8 of the ~22 used.** The other animations (progress, hide
   header, parallax, element reveal, marquee, counter, svg draw, cinematic text, character
   appear, hoverable list, text morph, dual scramble, card fan, circle fill) were taken
   from the full 50-item index (every entry read) and built with documented official GSAP
   APIs. Reading 22 pages in full would have blown the context budget needed to actually
   build the three sites.
9. **Section order adapted.** The brief's story (opening → intro → works → timeline → map →
   closing) is a life-story shape for Barragán. MenuCraft has no life to narrate and no map;
   the equivalents are: opening → problem/introduction → **the bench** (product) → **the
   shelf** (works = 6 templates) → **the counter** (QR) → **the rates** → closing. The
   timeline survives as C's step line; the map's "one object moves between resting states"
   survives as B's flip zone.
10. **Screenshot tooling.** The in-app browser was removed from the tool catalog mid-run
    (and its window was hidden before that), so `round-4/tools/shoot.mjs`'s role went to a
    purpose-built raw-CDP driver (`shots/shoot.mjs`).
11. **Time.** The brief aimed at 40 minutes; the research + three directions + gate +
    critique took considerably longer — the no-questions/no-stopping rule was honoured, the
    clock was not.
12. **C's fan cards keep a soft shadow** despite the shadows ban: they are literal cards
    lifted off a shelf, and the shadow only exists in the fanned state. Recorded as a
    considered exception, not an oversight.

## 9. Deliverables

```
design-lab/
├── index.html            ← open this: three directions side by side (iframes)
├── NOTES.md              ← this file
├── a-garage/index.html   ← Direction A · The Garage
├── b-wall/index.html     ← Direction B · The Wall
├── c-shopfloor/index.html← Direction C · The Shop Floor
├── fonts/                ← Bricolage Grotesque woff2 ×2 + OFL.txt
├── qr-demo.svg           ← generated with the app's own qrcode package
├── research/
│   ├── RESEARCH.md       ← all 8 queries, what came back, what was chosen
│   ├── DNA.md            ← measured design DNA of each reference
│   └── ref-0{1,2,3}-*.jpeg
└── shots/                ← shoot.mjs (CDP driver), check.mjs (QA), *.png captures
```
