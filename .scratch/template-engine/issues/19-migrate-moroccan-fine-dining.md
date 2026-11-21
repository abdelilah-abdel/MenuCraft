# 19: Migrate Moroccan Fine Dining

**Status:** ready-for-agent

**Blocked by:** 06: Render complete menu content consistently; 08: Control the restaurant logo and banner; 13: Switch templates while preserving the menu

**What to build:** A Restaurant Owner's existing Moroccan Fine Dining menu uses the shared template engine and supported editing controls while retaining its recognizable design, saved content, and identity.

## Acceptance criteria

- [ ] Express Moroccan Fine Dining as a validated preset of shared blocks and Component Styles, preserving its framed header, photography, restrained typography, section treatments, and responsive item cards.
- [ ] Keep its existing template ID, saved menu data, explicit customization, stable entry identities, and public URL compatible without requiring owners to rebuild their menus.
- [ ] Use the shared content, selection, and supported customization behavior. Controls accurately reflect the preset's allowed styles, slots, and layouts.
- [ ] Compare representative old and new output on desktop and mobile, including long content, subsections/descriptions, tags, sold-out items, missing images, and existing visibility settings.
- [ ] Exercise supported picture controls, template switching, undo/redo, save/reload, Live Preview, and public rendering without data loss.
- [ ] Preserve existing language/direction behavior and record remaining Arabic font/typography limitations; make output-format claims only for specifically checked formats.
- [ ] Use a narrowly scoped specialized renderer hook only for a documented design difference that shared configuration cannot express cleanly. Do not retain the entire old renderer as a nominal migration.
- [ ] Record visual comparison evidence and remaining differences. Leave unused legacy component removal to the final cleanup ticket.

## Demonstration

Open a saved Moroccan Fine Dining menu in the shared editor, compare its old/new desktop and mobile appearance, edit a supported style and photo, save/reload, and verify its original public URL.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
