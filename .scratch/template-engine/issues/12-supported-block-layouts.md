# 12: Arrange blocks within supported layouts

**Status:** ready-for-agent

**Blocked by:** 11: Customize reusable Component Styles

**What to build:** A Restaurant Owner arranges menu blocks within a template's permitted regions and adjusts supported columns, spacing, and alignment without having to position elements by pixel.

## Acceptance criteria

- [ ] Declare permitted regions, block placements, column counts, spacing, and alignment as constrained design capabilities rather than arbitrary coordinates.
- [ ] Offer one-, two-, or three-column arrangements only when supported by the template; preserve full-width header or other required regions.
- [ ] Allow moving a section between permitted regions while keeping structured content and canonical item order separate from design placement.
- [ ] Keep content identities and associated images intact; reject invalid region assignments and handle deleted references safely.
- [ ] Collapse layouts intentionally on small screens and exercise long text and missing/large images without hidden or clipped content.
- [ ] Store layout settings through save/reload and undo/redo. Record print-related constraints for the later PDF milestone without claiming PDF or print qualification.

## Demonstration

Move a section from one permitted column to another, adjust spacing/alignment, save/reload, and show the same menu collapsing cleanly to a mobile layout.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
