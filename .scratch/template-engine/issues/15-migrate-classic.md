# 15: Migrate Classic

**Status:** ready-for-agent

**Blocked by:** 06: Render complete menu content consistently; 07: Control dish photos; 13: Switch templates while preserving the menu

**What to build:** A Restaurant Owner's existing Classic menu uses the shared template engine and supported editing controls while retaining its recognizable design, saved content, and identity.

## Acceptance criteria

- [ ] Express Classic as a validated preset of shared blocks and Component Styles, preserving its centered restaurant header, section hierarchy, thumbnails, typography, and customization.
- [ ] Keep its existing template ID, saved menu data, explicit customization, stable entry identities, and public URL compatible without requiring owners to rebuild their menus.
- [ ] Use the shared content, selection, and supported customization behavior. Controls accurately reflect the preset's allowed styles, slots, and layouts.
- [ ] Compare representative old and new output on desktop and mobile, including long content, subsections/descriptions, tags, sold-out items, missing images, and existing visibility settings.
- [ ] Exercise supported picture controls, template switching, undo/redo, save/reload, Live Preview, and public rendering without data loss.
- [ ] Preserve existing language/direction behavior and record remaining Arabic font/typography limitations; make output-format claims only for specifically checked formats.
- [ ] Use a narrowly scoped specialized renderer hook only for a documented design difference that shared configuration cannot express cleanly. Do not retain the entire old renderer as a nominal migration.
- [ ] Record visual comparison evidence and remaining differences. Leave unused legacy component removal to the final cleanup ticket.

## Demonstration

Open a saved Classic menu in the shared editor, compare its old/new desktop and mobile appearance, edit a supported style and photo, save/reload, and verify its original public URL.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.

- 2026-11-18 context: before starting this migration, the owner requested a visual proof based on seven newly supplied references. Captured on branch `codex/menu-composition-proof` (base `bc11dae`), review route `/prototype/menu-composition?variant=tiles`, source `components/builder/prototype/`, and comparison screenshots in `../evidence/composition-proof/`. It demonstrates four composition families with independent editable sample content. The owner's visual verdict and any proposed engine/ticket revision are pending; this ticket's approved scope/dependencies/status have not changed.

- 2026-11-18 follow-up: owner requested freeform canvas authoring after the initial visual proof. The same prototype branch now contains `/prototype/menu-composition?mode=canvas`, source `components/builder/prototype/MenuCanvasPrototype.tsx`, and evidence under `../evidence/canvas-proof/`. It tests fonts/icons/shapes/uploads, independent transforms/layers and shared sample dish bindings. Saving/publishing and the production schema remain undecided; no Classic migration is included.

- 2026-11-19 iteration: owner asked for Add Page, more icons and 3D shapes, a larger library, and more template designs/themes. Canvas proof now has page add/duplicate/delete/switch with undoable page history; six menu starters across three composition families with two palettes each; 48 searchable illustrations; six 3D objects; twelve fonts; and six format choices. Applying a starter to a page preserves its current menu content and format. Browser/TypeScript/build review and evidence are recorded in `PROJECT_STATUS.md` and `../evidence/canvas-proof/05-pages-mobile.jpg`, `06-library-mobile.jpg`, `07-pages-editor.jpg`. This stays exploratory and in-memory; the approved migration's scope and dependencies/status have not changed.

- 2026-11-19 follow-up: owner asked to include illustrations in the library. Added a separate searchable library with 12 hand-drawn SVG assets across café/bakery, plates/treats, and botanical groups, distinct from the 48 small icons. Inserted illustrations are editable canvas nodes and use the existing position, size, rotation, color, opacity, ordering, and layer controls. Browser review searched for and placed a lemon branch, then adjusted its position and size. TypeScript and `npx next build --webpack` passed; default Turbopack build was blocked by sandbox process restrictions. This remains a visual prototype; ticket 15 status, scope, and dependencies are unchanged.
