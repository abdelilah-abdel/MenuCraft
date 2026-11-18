# 13: Switch templates while preserving the menu

**Status:** ready-for-agent

**Blocked by:** 12: Arrange blocks within supported layouts

**What to build:** A Restaurant Owner changes templates without losing menu content, grouping, order, images, or Availability and can understand which design settings carry across.

## Acceptance criteria

- [ ] Switch the selected template while preserving menu/entry identities, content, order, image sources, visibility, Availability, and the stable public URL.
- [ ] Carry compatible menu-wide, Component Style, image, and layout choices across by their meaning rather than copying incompatible placement coordinates.
- [ ] Explain unsupported design choices instead of silently deleting them; make any reset explicit and preserve a recoverable prior state through Editor History.
- [ ] Allow undo/redo of template selection and resets without clearing earlier in-session edits.
- [ ] Keep switching separate from loading sample menu content; template selection alone never inserts example dishes or replaces the owner's menu.
- [ ] Handle configurations and legacy adapters consistently during migration, expose unsupported controls clearly, and preserve the published state until save.

## Demonstration

Customize a menu with photos and multiple sections, switch between structurally different templates, undo the switch, then save/reload while verifying content and the public URL remain intact.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
