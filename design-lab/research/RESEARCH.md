# MenuCraft Design Lab — Step 1: Layout Research

> **Adaptation note.** The brief was written for a Barragán tribute using the **Mobbin MCP**.
> This environment has no Mobbin MCP server (checked: no `search_sections` tool, no MCP
> resources). Substitutes, in order of preference:
> 1. Mobbin's public explore pages, opened and captured in the in-app browser (3 captures).
> 2. Web search against Mobbin + layout libraries for concrete, describable layouts (8 queries).
> 3. Live sites visited and captured for visual DNA (2 captures).
> The desktop window stopped being visible part-way through, so captures 4–6 are text
> references instead of images. Every query below describes one concrete layout, never a
> style word.

## The 8 queries

### Q1 — "one huge name filling the screen with a small caption in the corner" (opening)
- **Came back:** Mobbin hero-section explore gallery — Titan (split hero: headline left,
  engraving right, pill nav), ToDesktop, Runway, "David" (food/typography), Touchy Coffee,
  Oatly (food/light/bold typography).
- **Chosen:** the gallery capture (`ref-01-mobbin-hero-titan.jpeg`) + Oatly.
- **Principle taken:** *one idea per screen — either type fills the frame or an image does,
  never both fighting; the nav is a thin instrument, not a banner.*

### Q2 — "a huge serif statement alone on an empty wall above one work image" (introduction)
- **Came back:** Ragged Edge homepage — a single serif sentence at ~64px occupying the top
  third of an otherwise empty screen, then a full-bleed case image below it.
- **Chosen:** captured (`ref-03-raggededge-statement.jpeg`).
- **Principle taken:** *the statement gets an empty wall; the product shot arrives only after
  the sentence has landed.*

### Q3 — "a split screen: form on one side, live result on the other" (the workbench section)
- **Came back:** Levenium "Preview Panel" (sticky edit pane, preview pins, container-query
  split at panel width not viewport), MkDocs Split View, Hyvä Liveview, Buildorado,
  DatoCMS visual editing, DevDojo Designer (three resizable panes).
- **Chosen:** Levenium's sticky/fill model + DatoCMS side-by-side.
- **Principle taken:** *edit and result live side by side; the preview pins while the form
  scrolls past it, and the split collapses to tabs before either pane gets cramped.*

### Q4 — "prices as rows joined to numbers by dotted leaders, like a printed menu" (rates)
- **Came back:** uiCookies editorial price list (dotted leaders, 2px rule, tabular prices),
  viberdy "Service Price Ledger" (leader sits on the baseline, photo plate follows the
  hovered row), CodeFronts editorial two-column pricing, ReactFrame price list with sliding
  pill tabs, Phox Price List (connector lines), Divi Torque restaurant menu.
- **Chosen:** the printed-menu rate card with dot leaders + two-column editorial split.
- **Principle taken:** *a price list is a menu — name, leader, number; cards are for
  software, leaders are for food.*

### Q5 — "a horizontal shelf you drag sideways through the range" (templates)
- **Came back:** Parable Drag Scroll Gallery (inertia, rubber-band ends, snap), enrichr
  horizontal scroll gallery with parallax artwork + progress bar, Salon horizontal grid,
  purrfect-ui inertia gallery (morphs list↔slider), nordwerk scroll-carousel.
- **Chosen:** drag rail with a progress bar underneath.
- **Principle taken:** *the shelf moves as one track with a visible progress cue; keyboard
  and reduced-motion fall back to plain scroll-snap.*

### Q6 — "the whole page changes colour as a new scene arrives" (scene changes)
- **Came back:** GSAP background-change-on-pinned CodePen (akapowl), Animorio colour
  chapters (sticky panel, brush marks written and erased, four chapter colours), GSAP Vault
  Colour Chapter Showcase, Loopspeed scroll-driven palette in Oklab, and **02UI's
  background-colour page** (read in full — see below).
- **Chosen:** section-owned tints on one shared fixed layer, 2–3 shifts per page.
- **Principle taken:** *paint the tint on one layer behind everything; a shift marks a change
  of scene, and two or three of them on a long page is a rhythm — more is a strobe.*

### Q7 — "a footer that closes on one oversized word" (closing)
- **Came back:** shadcn Giant Wordmark (slim nav row over a wordmark spanning the
  container), staaarter oversized wordmark cropped and bleeding off the bottom edge,
  Design Lounge "giant wordmark reveal" (letters rise out of the floor, letter by letter,
  ~360px type cropped by the page edge), Nory "No profit lost." band.
- **Chosen:** the rising-letter wordmark cropped by the page edge.
- **Principle taken:** *the last thing seen is the name itself, so large it does not fit —
  and it arrives as the page's final gesture.*

### Q8 — "words arriving one at a time as you scroll" (scroll storytelling)
- **Came back:** motion.dev word-by-word scroll reveal, fullPage.js CSS line/word reveals
  (`animation-timeline: view()`), Good Fella Lab SplitText patterns (line mask
  `yPercent:110`, word stagger, scrubbed text with `scrub:1`), and **02UI's text-reveal
  page** (read in full).
- **Chosen:** SplitText line-mask reveal for statements, word stagger for the intro
  sentence, scrub only where the reader controls the pace.
- **Principle taken:** *reveal the line, not the paragraph — body copy is for reading.*

## The 6 references (downloaded / captured)

| # | File or source | What it is | One-line principle |
|---|---|---|---|
| R1 | `research/ref-01-mobbin-hero-titan.jpeg` | Mobbin hero gallery, Titan split hero | One idea per screen; nav as a thin instrument |
| R2 | `research/ref-02-oatly-hero.jpeg` | Oatly homepage hero | Type can *be* the image: condensed caps filling the frame over a photo |
| R3 | `research/ref-03-raggededge-statement.jpeg` | Ragged Edge statement + case image | Statement gets an empty wall; product shot follows |
| R4 | Mobbin/M-Saans design system breakdowns (fudge.design, aibranding, getdesign) | Measured type system: 80/56/32px display at weight **652**, body at 456/400, 80px section rhythm, no shadows on cards, one accent used sparingly | Hierarchy from weight and scale inside **one** family — never from a second font |
| R5 | Vitsœ (vitsoe.com/rw) — page loaded, capture blocked by desktop window | Product rows: ruled product blocks, big left headline + photo right, "start small, add to it" copy | Quiet craft grid: rules and order do the work, nothing decorative |
| R6 | Levenium Preview Panel + DatoCMS visual editing (text refs) | Sticky split edit/preview, container-query collapse | Edit and result side by side; pin the result, scroll the form |

## What this means for MenuCraft

The current site (cream/gold/charcoal, Georgia serif, ornament dividers) reads as
"restaurant tablecloth". The user wants **a craft garage for menus** — a workshop where
menus get built. The research points at: workshop-instrument nav, one idea per screen,
statement type on an empty wall, printed-menu price leaders, a drag shelf for templates,
2–3 scene colour shifts, and a wordmark finale.
