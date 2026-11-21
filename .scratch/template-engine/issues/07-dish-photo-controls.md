# 07: Control dish photos

**Status:** resolved

**Blocked by:** 02: Create the outline-and-detail editing workspace

**What to build:** A Restaurant Owner uploads, replaces, removes, and crops a dish photo, chooses an image placement supported by the template, and sees the same presentation after saving.

## Acceptance criteria

- [x] Expose dish-photo controls in the focused editor with upload feedback and the existing file-type/size validation; failed uploads preserve the current picture.
- [x] Offer supported thumbnail, card-top, or text-side placement choices through the template's declared capabilities, with a clear default for existing menus.
- [x] Store crop/focal-position settings separately from the source photo so presentation changes do not destructively replace the uploaded image.
- [x] Render the chosen crop and placement consistently in preview and publication, with a deliberate layout when the image is absent, removed, disabled, or fails to load.
- [x] Keep photo and presentation changes in Editor History and persist them through save/reload without changing the dish's identity.
- [x] Make the image-slot and crop controls reusable for the later restaurant-header and section-photo tickets while retaining the current storage approach.

## Demonstration

Add a photo to a dish, change its crop and supported placement, replace it, undo, save, and compare the public menu. Verify a failed upload retains the previous photo.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.

## Answer

Completed 2026-11-18. Reusable ImageSlotEditor supports validated upload/replace/remove, independent visibility, fit and focal-position crop. Source image stays separate from presentation. Atlas declares three supported placements; legacy renderers retain their declared fixed placement until migration. Server validates bounded focal values; hidden images and failed loads collapse safely. 23 workspace tests (including upload rejection/source preservation and undo), TypeScript/build passed. Desktop/mobile evidence: [desktop](../evidence/07-dish-photo-desktop.jpg), [mobile](../evidence/07-dish-photo-mobile.jpg). Review validation/hero crop issues fixed.
