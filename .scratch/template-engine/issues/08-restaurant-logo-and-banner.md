# 08: Control the restaurant logo and banner

**Status:** resolved

**Blocked by:** 07: Control dish photos

**What to build:** A Restaurant Owner manages a restaurant logo and an optional banner as distinct image slots, each with appropriate placement, crop, and visibility controls.

## Acceptance criteria

- [x] Keep logo and banner content independent, retaining existing saved logo data without requiring re-upload.
- [x] Reuse the validated image and crop controls for upload, replace, remove, and focal-position editing.
- [x] Offer only header placements supported by the template, with logo sizing/contain behavior and banner cropping suited to their different roles.
- [x] Retain a deliberate readable header when either image is absent, hidden, or fails to load; headings and controls remain usable on mobile.
- [x] Keep current dish-image settings from unintentionally removing the restaurant's logo; expose the intended slot visibility explicitly.
- [x] Support undo/redo and save/reload, with equivalent header output in Live Preview and the Published Menu.

## Demonstration

Place a logo and banner in a menu header, adjust them independently, hide/remove either, and save/reload without losing the other.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.

## Answer

Completed 2026-11-18. Logo and banner have independent sources, crop/fit/visibility controls, validated persistence and history. Logo default sizes/alignment retained per template; explicit size override is available. Banner supports declared above/below heading placements without text overlays. Both slots are independent of dish-image visibility. TypeScript/build and 24 workspace tests passed. Browser uploaded logo/banner independently and saved; focus reached banner control. [Desktop](../evidence/08-header-images-desktop.jpg), [mobile](../evidence/08-header-images-mobile.jpg). Review logo compatibility finding fixed.
