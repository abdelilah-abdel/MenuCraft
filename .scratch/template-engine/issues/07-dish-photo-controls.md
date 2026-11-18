# 07: Control dish photos

**Status:** ready-for-agent

**Blocked by:** 02: Create the outline-and-detail editing workspace

**What to build:** A Restaurant Owner uploads, replaces, removes, and crops a dish photo, chooses an image placement supported by the template, and sees the same presentation after saving.

## Acceptance criteria

- [ ] Expose dish-photo controls in the focused editor with upload feedback and the existing file-type/size validation; failed uploads preserve the current picture.
- [ ] Offer supported thumbnail, card-top, or text-side placement choices through the template's declared capabilities, with a clear default for existing menus.
- [ ] Store crop/focal-position settings separately from the source photo so presentation changes do not destructively replace the uploaded image.
- [ ] Render the chosen crop and placement consistently in preview and publication, with a deliberate layout when the image is absent, removed, disabled, or fails to load.
- [ ] Keep photo and presentation changes in Editor History and persist them through save/reload without changing the dish's identity.
- [ ] Make the image-slot and crop controls reusable for the later restaurant-header and section-photo tickets while retaining the current storage approach.

## Demonstration

Add a photo to a dish, change its crop and supported placement, replace it, undo, save, and compare the public menu. Verify a failed upload retains the previous photo.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
