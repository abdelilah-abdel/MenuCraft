# 13: Switch templates while preserving the menu

**Status:** resolved

**Blocked by:** 12: Arrange blocks within supported layouts

**What to build:** A Restaurant Owner changes templates without losing menu content, grouping, order, images, or Availability and can understand which design settings carry across.

## Acceptance criteria

- [x] Switch the selected template while preserving menu/entry identities, content, order, image sources, visibility, Availability, and the stable public URL.
- [x] Carry compatible menu-wide, Component Style, image, and layout choices across by their meaning rather than copying incompatible placement coordinates.
- [x] Explain unsupported design choices instead of silently deleting them; make any reset explicit and preserve a recoverable prior state through Editor History.
- [x] Allow undo/redo of template selection and resets without clearing earlier in-session edits.
- [x] Keep switching separate from loading sample menu content; template selection alone never inserts example dishes or replaces the owner's menu.
- [x] Handle configurations and legacy adapters consistently during migration, expose unsupported controls clearly, and preserve the published state until save.

## Demonstration

Customize a menu with photos and multiple sections, switch between structurally different templates, undo the switch, then save/reload while verifying content and the public URL remain intact.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.


## Answer

Completed 2026-11-18. Switching remains one history action that changes only the template ID. Registry-based compatibility notices in Templates and Customize explain retained but unsupported Component Styles, layout and photo placements. Compatible choices apply by meaning; other choices stay saved and recover when returning to a compatible design. An explicit style/layout reset preserves appearance, content and photos and can be undone. Existing image fit/focal/visibility and the public URL remain intact; sample replacement remains a separate confirmed action.

TypeScript/build and 30 workspace tests passed, including switching with photos, unavailable dishes, earlier edits, save, reset and Undo/Redo. Browser keyboard-selected Minimal, saved/reloaded without losing the menu, then restored Atlas through Undo/Redo and saved at the same public link. Desktop/mobile notices and zero mobile horizontal overflow checked. Evidence: [desktop](../evidence/13-switching-desktop.jpg), [mobile](../evidence/13-switching-mobile.jpg). Standards review found no hard violations and one optional maintenance concern about duplicated capability checks; spec review found no static gaps. Full batch HTTP/public verification follows with ticket 14. Print/PDF and Arabic typography remain unqualified.

Batch completion with ticket 14: TypeScript/build and all 41 tests passed. HTTP storage checks preserve content/design/public IDs across all eight registered presets. Actual saved Atlas Market publication retained the customized menu at the same link on desktop/mobile.
