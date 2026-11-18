# 10: Customize the menu's overall appearance

**Status:** ready-for-agent

**Blocked by:** 02: Create the outline-and-detail editing workspace

**What to build:** A Restaurant Owner uses a simple Customize panel to change the whole menu's colors, background, typography, and text sizing while retaining the selected template's character.

## Acceptance criteria

- [ ] Expose supported primary/secondary colors, background, typography, and text-size choices with immediate Live Preview updates.
- [ ] Define predictable inheritance between template defaults and explicit menu-wide overrides, leaving room for the later reusable Component Styles.
- [ ] Preserve explicit settings on existing menus; selecting a preset or opening the editor does not silently overwrite owner choices.
- [ ] Reset appearance to the selected template's defaults through an explicit undoable action without resetting menu content.
- [ ] Validate persisted design values and supported font/style choices; owner inputs cannot introduce arbitrary executable markup or styles outside the supported controls.
- [ ] Save/reload retains appearance and public output matches the preview. Restaurant-facing typography and palette remain independent of application chrome.

## Demonstration

Change Atlas Simple's colors and typography, save/reload, reset to defaults, and undo the reset while retaining all dishes and photos.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
