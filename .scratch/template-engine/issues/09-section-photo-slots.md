# 09: Add section photos

**Status:** resolved

**Blocked by:** 07: Control dish photos

**What to build:** A Restaurant Owner adds an optional photograph to a menu section and presents it as a banner or heading-side image where the selected template supports that slot.

## Acceptance criteria

- [x] Add optional section-photo content and presentation settings with safe defaults for menus that have no section photos.
- [x] Reuse upload/replace/remove, validation, and crop/focal-position controls from the dish-photo foundation.
- [x] Expose banner or heading-side choices according to template capabilities, with a coherent no-photo layout.
- [x] Keep the photo attached to the section's stable identity across reorder, duplication, hiding, and undo/redo as those actions become available.
- [x] Persist section-photo data through save/reload and render the same placement in preview and publication.
- [x] Avoid broken-image gaps, unreadable text overlays, and mobile overflow.

## Demonstration

Add different photos to two sections, change their placement/crop, reorder the sections, save, and verify the photos follow the correct sections on the public page.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.

## Answer

Completed 2026-11-18. Sections have optional photo content and independent presentation settings. Reused validated upload/replace/remove/focal/fit controls; all seven templates declare banner/heading-side capabilities. Stable IDs and immutable edits keep pictures through duplicate/reorder/hide/history; API retains metadata on save/reload. Fixed shared image CSS defaults so template dimensions/crop apply. Custom registry capability overrides are honored.

Verification: full suite 34/34 passed (26 workspace, 6 renderer, 2 HTTP integration), TypeScript and production build passed. HTTP checks save/reload photo and hidden metadata across all seven template IDs and reject malformed crop data. Browser saved two distinct section images, checked desktop/390px editor plus actual public390px layout (96x96 heading-side image, zero horizontal overflow and no edit markers). [Desktop](../evidence/09-section-photo-desktop.jpg), [mobile editor](../evidence/09-section-photo-mobile.jpg), [public mobile](../evidence/09-public-mobile.jpg). Standards/spec review findings fixed; Arabic typography and print/PDF remain unqualified.
