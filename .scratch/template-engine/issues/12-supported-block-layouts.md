# 12: Arrange blocks within supported layouts

**Status:** resolved

**Blocked by:** 11: Customize reusable Component Styles

**What to build:** A Restaurant Owner arranges menu blocks within a template's permitted regions and adjusts supported columns, spacing, and alignment without having to position elements by pixel.

## Acceptance criteria

- [x] Declare permitted regions, block placements, column counts, spacing, and alignment as constrained design capabilities rather than arbitrary coordinates.
- [x] Offer one-, two-, or three-column arrangements only when supported by the template; preserve full-width header or other required regions.
- [x] Allow moving a section between permitted regions while keeping structured content and canonical item order separate from design placement.
- [x] Keep content identities and associated images intact; reject invalid region assignments and handle deleted references safely.
- [x] Collapse layouts intentionally on small screens and exercise long text and missing/large images without hidden or clipped content.
- [x] Store layout settings through save/reload and undo/redo. Record print-related constraints for the later PDF milestone without claiming PDF or print qualification.

## Demonstration

Move a section from one permitted column to another, adjust spacing/alignment, save/reload, and show the same menu collapsing cleanly to a mobile layout.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.

## Answer

Completed 2026-11-18. Atlas declares one/two/three columns, permitted section regions, compact/comfortable/airy spacing and start/center alignment. Its header stays full width. Placement lives in design.layout; canonical content, identities and images remain independent. Deleting sections prunes assignments within the same history step; duplication copies an explicit region to the new identity. Invalid/dangling assignments and arbitrary positioning values are rejected before persistence. Legacy templates retain their signature layouts until migration.

Columns stack in region order below 768px; three columns become two at tablet widths. Automatic A,B,C,D placement into two columns stacks A,C,B,D on mobile, deliberately preserving whole columns rather than changing canonical content order. The roadmap records print pagination constraints separately.

TypeScript, production build and all 38 tests passed (29 workspace, 7 renderer, 2 HTTP integration). Tests cover content preservation, reference pruning/undo, photo and photo-free rendering, saved design settings across all seven IDs, and rejected invalid payloads. Browser saved/reloaded appearance, Component Styles and three assigned regions; actual public desktop/mobile output matched. A 190-character unbroken heading wrapped at 1440px and 390px without heading/page overflow. Wide banner, section and dish images stayed inside their regions; no browser errors were recorded. Standards and spec reviews found no remaining blockers after the recorded browser checks.

Evidence: [desktop editor](../evidence/12-layout-desktop.jpg), [mobile editor](../evidence/12-layout-mobile.jpg), [public desktop](../evidence/12-layout-public-desktop.jpg), [public mobile](../evidence/12-layout-public-mobile.jpg). Print/PDF and full Arabic typography remain unqualified. Next: ticket 13, safe template switching.
