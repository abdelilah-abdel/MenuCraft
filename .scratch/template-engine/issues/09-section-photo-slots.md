# 09: Add section photos

**Status:** ready-for-agent

**Blocked by:** 07: Control dish photos

**What to build:** A Restaurant Owner adds an optional photograph to a menu section and presents it as a banner or heading-side image where the selected template supports that slot.

## Acceptance criteria

- [ ] Add optional section-photo content and presentation settings with safe defaults for menus that have no section photos.
- [ ] Reuse upload/replace/remove, validation, and crop/focal-position controls from the dish-photo foundation.
- [ ] Expose banner or heading-side choices according to template capabilities, with a coherent no-photo layout.
- [ ] Keep the photo attached to the section's stable identity across reorder, duplication, hiding, and undo/redo as those actions become available.
- [ ] Persist section-photo data through save/reload and render the same placement in preview and publication.
- [ ] Avoid broken-image gaps, unreadable text overlays, and mobile overflow.

## Demonstration

Add different photos to two sections, change their placement/crop, reorder the sections, save, and verify the photos follow the correct sections on the public page.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
