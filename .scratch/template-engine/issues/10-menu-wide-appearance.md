# 10: Customize the menu's overall appearance

**Status:** resolved

**Blocked by:** 02: Create the outline-and-detail editing workspace

**What to build:** A Restaurant Owner uses a simple Customize panel to change the whole menu's colors, background, typography, and text sizing while retaining the selected template's character.

## Acceptance criteria

- [x] Expose supported primary/secondary colors, background, typography, and text-size choices with immediate Live Preview updates.
- [x] Define predictable inheritance between template defaults and explicit menu-wide overrides, leaving room for the later reusable Component Styles.
- [x] Preserve explicit settings on existing menus; selecting a preset or opening the editor does not silently overwrite owner choices.
- [x] Reset appearance to the selected template's defaults through an explicit undoable action without resetting menu content.
- [x] Validate persisted design values and supported font/style choices; owner inputs cannot introduce arbitrary executable markup or styles outside the supported controls.
- [x] Save/reload retains appearance and public output matches the preview. Restaurant-facing typography and palette remain independent of application chrome.

## Demonstration

Change Atlas Simple's colors and typography, save/reload, reset to defaults, and undo the reset while retaining all dishes and photos.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.

## Answer

Completed 2026-11-18. Shared appearance resolution: explicit new overrides > legacy saved owner choices > selected template defaults after explicit reset. Bounded solid colors, typography and relative text-size controls update preview, persist under design.appearance, and reset through existing history without touching content/photos. Safe legacy font/color strings remain readable; new design payloads reject unsupported values. Atlas resolves the same theme as its editor; legacy output uses scoped overrides without forcing app chrome.

TypeScript/build and 33 focused tests passed. Browser changed/saved Atlas colors and font/size, reset and undid reset, with no mobile horizontal overflow. [Desktop](../evidence/10-appearance-desktop.jpg), [mobile](../evidence/10-appearance-mobile.jpg). Review compatibility, cascade and type-scaling findings corrected. Full batch HTTP/public checks follow with tickets 11–12. Print/PDF and Arabic typography remain unqualified.

Batch completion with ticket 12: all 38 tests, TypeScript and the production build passed. Combined appearance/styles/layout survived save/reload; actual public desktop/mobile output retained the chosen colors, Georgia typography and text scale without horizontal overflow.
