# 08: Control the restaurant logo and banner

**Status:** ready-for-agent

**Blocked by:** 07: Control dish photos

**What to build:** A Restaurant Owner manages a restaurant logo and an optional banner as distinct image slots, each with appropriate placement, crop, and visibility controls.

## Acceptance criteria

- [ ] Keep logo and banner content independent, retaining existing saved logo data without requiring re-upload.
- [ ] Reuse the validated image and crop controls for upload, replace, remove, and focal-position editing.
- [ ] Offer only header placements supported by the template, with logo sizing/contain behavior and banner cropping suited to their different roles.
- [ ] Retain a deliberate readable header when either image is absent, hidden, or fails to load; headings and controls remain usable on mobile.
- [ ] Keep current dish-image settings from unintentionally removing the restaurant's logo; expose the intended slot visibility explicitly.
- [ ] Support undo/redo and save/reload, with equivalent header output in Live Preview and the Published Menu.

## Demonstration

Place a logo and banner in a menu header, adjust them independently, hide/remove either, and save/reload without losing the other.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
