# MenuCraft Design Lab — Step 2: Study / Design DNA

> **Adaptation note.** The brief calls for `hallmark study` in image mode. Hallmark is not
> installed here, so the vision pass was done by hand (each capture was opened and read)
> and pixel measurements were taken with `browser.evaluate` — `getComputedStyle` on the live
> pages — which replaces the `round-4/tools/study.py` measurement script.

## R1 — Mobbin hero gallery / Titan (capture `ref-01-mobbin-hero-titan.jpeg`)

**Vision pass.** White page, black type. The result card is a *site inside a site*: a thin
top bar with logo + pill nav, then a 50/50 split — headline stack left ("Wealth managed from
the palm of your hand", ~40px, 4 lines, tight leading), engraved illustration right. A tiny
orange "NEW" chip and a small caps link sit *above* the headline, not below. Everything is
hairline-ruled; no shadows, no gradients.

**Measured / documented (M-Saans system, from Fudge + AIBranding + getdesign breakdowns):**

| Token | Size | Weight | Leading | Tracking |
|---|---|---|---|---|
| display | 80px | 652 | 1.00 | −0.88px (−0.011em) |
| heading-1 | 56px | 652 | 1.00 | −0.39px |
| heading-2 | 44px | 652 | 1.13 | — |
| heading-4 | 24px | 652 | 1.25 | — |
| body-lg (hero sub) | 20px | 300 | 1.38 | 0 |
| body | 16px | 456 | 1.38 | 0 |
| caption | 12px | 456 | 1.33 | +0.17px |

Rhythm: 8px base, **80px section gap**, 120px between homepage acts, max-width 1280px.
Rules: no shadows on cards (1px borders only), one accent used sparingly, no second family,
**no font-weight 700/800 — the ceiling is 652**.

**DNA:** hierarchy is *weight contrast inside one family* (652 vs 300 at the same step) plus
scale; whitespace is the grouping device; rules not shadows.

## R2 — Oatly (capture `ref-02-oatly-hero.jpeg`)

**Vision pass.** A ruled frame wraps the whole viewport like a printed sheet. Nav is a
two-row instrument strip: icon row, then five uppercase labels spread edge to edge. The
hero is a photograph with **giant condensed uppercase type in white laid straight over it**
(visual measurement ≈ 180–200px, leading ≈ 0.9, filling four lines edge to edge). A status
bar runs along the bottom ("FUTURE OF TASTE REPORT VOL. 2" left, pink tag right).

**Measured:** body 16px, ink `#000`/`#222` on white; H1 in Margo Pro; the display type is
treated as *image material* — it overlaps the photo and is allowed to touch both margins.

**DNA:** type as material; the page is a printed object with ruled borders and a status line;
one loud gesture per screen, everything else tiny.

## R3 — Ragged Edge (capture `ref-03-raggededge-statement.jpeg`)

**Vision pass.** Top third: one serif sentence on an empty white wall — no button, no
image. Two-thirds below: a full-bleed case image with its own oversized type inside it.
Nav is a row of translucent pills sitting *on* the image, bottom-anchored, not a header bar.

**Measured (live):**

| Element | Size | Weight | Leading | Tracking | Colour |
|---|---|---|---|---|---|
| H1 statement | 64px | 700 (Diatype Expanded-Bold) | 70.4px (1.10) | −0.64px (−0.01em) | `#181F1F` on `#FFFFFF` |
| H2 section | 44px | 700 | 50.6px (1.15) | −0.44px | `#181F1F` |
| H2 small | 18px | 700 | 21.6px (1.20) | −0.18px | `#181F1F` |
| body | 16px | 400 | — | — | `#181F1F` |

Type scale steps: **64 / 44 / 18 / 16 / 12** — only five sizes, big jumps between them.
Family: one expanded grotesque used at every role.

**DNA:** empty wall for the statement; five-step scale with violent jumps; expanded single
family; ink `#181F1F` never pure black.

## R4 — Vitsœ 606 page (text reference, capture blocked)

**Vision pass (page loaded in tab; capture refused — desktop window hidden).** From the
loaded DOM and prior knowledge of the page: a ruled product block — big left headline
("606 Universal Shelving System"), short body copy under it, one photo right, hairline
rules dividing products, link with an arrow. Quiet, ordered, nothing decorative.

**DNA:** rules and order carry the structure; product = name + one sentence + one photo.

## R5 — Mobbin M-Saans design system (text reference)

Covered under R1 (same source). Key transferable rules: fractional weights for voice,
80px section rhythm, borders not shadows, one accent.

## R6 — Levenium Preview Panel / DatoCMS split (text reference)

**Principle:** two slots — edit and preview. The preview pins (sticky) while the edit form
scrolls; the split collapses to a tab switch at a **container** width (not viewport), so the
panel never squeezes either pane below readability.

**DNA:** for the workbench section — form scrolls, result pins, tabs before cramping.

---

## Synthesis — what all six agree on

1. **One family.** Every strong reference builds hierarchy from size, weight, case and
   space inside a single typeface. (This validates Bricolage Grotesque as the only family.)
2. **Five-ish type steps with big jumps.** 64/44/18/16/12 (Ragged Edge), 80/56/44/24/16/12
   (Mobbin). No in-between sizes cluttering the scale.
3. **Rules, not shadows.** Hairline borders and ruled frames (R1, R2, R4).
4. **Empty wall before product shot.** Statement first, image second (R2, R3).
5. **Type as material.** Display type can fill the frame and overlap imagery (R2).
6. **Quiet instrument chrome.** Nav is thin, pill-shaped or a ruled strip — never a heavy
   header (R1, R3).
