# MenuCraft — Project Status

> **Always update this file before finishing a development task.** Record the active branch, what changed, checks run, decisions/risks, and the next concrete step. Keep `idea.md` as the product vision; this file is the execution log and handoff.

**Last updated:** 2026-11-18
**Current branch:** `feat/template-engine-roadmap`  
**Product source of truth:** [`idea.md`](./idea.md)  
**Build order and accepted decisions:** [`docs/IMPLEMENTATION_ROADMAP.md`](./docs/IMPLEMENTATION_ROADMAP.md)  
**Chosen app chrome design:** Direction B — The Wall ([design notes](./design-lab/NOTES.md))

## Current state

- Owner authentication, one-menu workspaces, persistent server-side JSON storage, and public web menus are implemented.
- Six hand-built menu templates exist: Classic, Modern, Minimal, Medina Café, Moroccan Fine Dining, and Modern Moroccan Garden.
- Builder supports menu content editing, sample menus, undo/redo, image upload, preview, public links, QR codes, and a description-suggestion endpoint. AI suggestions require an API key; no AI budget/provider is currently selected.
- Direction B — The Wall — has been ported to the app chrome: self-hosted Bricolage Grotesque, paper/ink/stamp tokens, landing-page motion, and restyled builder/auth UI.
- Phase 1, Step 1 is in progress. Ticket 01 is complete: Atlas Simple uses a validated composition of reusable header, section/subsection, and dish blocks. The six legacy templates retain their existing renderers for compatibility.
- Ticket 02 is complete: the owner workspace has a collapsible outline, focused detail forms, persistent desktop Live Preview with independent scrolling and view-only fit/zoom, mobile edit/preview switching, and explicit save/failure status.
- Ticket 03 is complete: visible restaurant, section/subsection, dish, logo, dish photo, and dish-sourced hero areas in all seven Live Preview designs open ID-matched editor controls. Selection has keyboard actions and visible markers while Published Menus remain clean.
- Tickets 04–09 are complete: nested lifecycle and visibility, movement into groups, complete content rendering, reusable photo controls, independent logo/banner, and section photo slots. Screenshots were captured for every ticket.
- Server menu validation now uses the template registry as its allowlist, so registered config-only templates can be saved.
- Persistence is still file-backed JSON and intended for one durable app instance. No relational database migration has been done.

## Latest changes

### Ticket 10 — overall appearance completed — 2026-11-18

- Added design.appearance overrides with template/legacy inheritance, constrained colors/fonts/text scale, and explicit undoable reset. Preserves old saved values and content; Atlas now honors owner appearance. Scoped legacy output keeps design structure.
- TypeScript/build and 33 focused workspace/renderer checks passed. Browser Atlas edits/save/reset/undo and 390px controls passed; screenshots `10-appearance-desktop.jpg` / `10-appearance-mobile.jpg`. Review findings on legacy validation, CSS specificity, relative sizing and Modern reset corrected. Next: ticket 11 Component Styles. Print/Arabic qualification remains deferred.

### Ticket 09 and requested 04–09 sequence completed — 2026-11-18

- Added optional section photo content/presentation with registry-declared banner/heading-side layouts across all seven templates. Reused image validation, upload feedback, replace/remove, fit/focal/visibility and existing history/persistence. Stable sections carry photo metadata through duplication/reorder/hiding. Custom registries pass active capabilities to the photo component.
- Fixed an existing unlayered `img { height: auto }` default that overrode intended photo dimensions; image sizing now follows template utilities, including deliberate crop boxes. Refreshed the ticket 07 desktop screenshot after correcting the capture viewport.
- Final verification: `npx tsc --noEmit`, `npm run build`, and `npm test` all passed, with **34 tests** (26 workspace, 6 renderer, 2 HTTP integration). Integration checks preserve section/dish photos, hidden content, logo/banner settings across all seven saved IDs and reject invalid focal/placement values. The suite also covers duplicate IDs/remapping, sold out vs hidden, grouped movement/no-op history, photo failure/source preservation, independent header slots, custom registry photos and section-photo history.
- Browser used isolated disposable data. Saved independent logo/banner and two section images; checked desktop and mobile editor previews after each ticket. Actual public output at 390px showed the section photo/heading without horizontal overflow or editor markers; no browser errors were reported in the final pages. Evidence: [04 desktop](.scratch/template-engine/evidence/04-lifecycle-desktop.jpg), [05 desktop](.scratch/template-engine/evidence/05-movement-desktop.jpg), [06 desktop](.scratch/template-engine/evidence/06-content-desktop.jpg), [07 desktop](.scratch/template-engine/evidence/07-dish-photo-desktop.jpg), [08 desktop](.scratch/template-engine/evidence/08-header-images-desktop.jpg), [09 desktop](.scratch/template-engine/evidence/09-section-photo-desktop.jpg), [09 public mobile](.scratch/template-engine/evidence/09-public-mobile.jpg). Matching mobile images for all six tickets are in the same evidence directory.
- Standards/spec reviews ran for every ticket. Findings about subsection removal, no-op drops, truthful empty states/template facts, hero crops, validation, logo compatibility and active photo capabilities were fixed. Photo uploads remain the existing base64/JSON storage with a 2MB per-file limit; large aggregate menu payloads remain a constraint of this architecture. Legacy dish placement stays fixed until individual migrations; Atlas offers all three choices. Arabic typography and print/PDF are not qualified. Existing non-blocking build notices remain.
- Next: ticket 10 overall appearance, followed by 11–14 and the individually blocked legacy migrations. Tickets 01–09 are resolved. Normal-data dev server is restored on port 3000 after verification.


### Ticket 08 — logo and banner completed — 2026-11-18

- Added independent restaurant image slots with reusable controls, explicit visibility, logo sizing/contain defaults and above/below banners. Existing logo defaults and each template alignment retained; dish image visibility does not hide either header slot.
- TypeScript/build and 24 workspace tests passed; browser uploaded separate logo/banner, saved both and confirmed banner focus. Screenshots `08-header-images-desktop.jpg` / `08-header-images-mobile.jpg`. Review compatibility finding fixed. Next: ticket 09 section photos.

### Ticket 07 — dish photo controls completed — 2026-11-18

- Added reusable validated photo slot editor, source-independent focal/fit/visibility settings, remove/replace, inline errors and upload feedback. Atlas exposes thumbnail/text-side/card-top; legacy designs keep their declared fixed placement. All dish-sourced hero images honor focal/fit and visibility.
- TypeScript/build and 23 workspace tests passed; invalid uploads preserve source and photo edits undo. Desktop/mobile focal and placement checked; `07-dish-photo-desktop.jpg` / `07-dish-photo-mobile.jpg` saved. Fixed mobile control width/page scroll and review validation/hero findings. Next: ticket 08 logo/banner.

### Ticket 06 — content rendering completed — 2026-11-18

- Filled Atlas tags/subsection descriptions, made description settings consistent across seven designs, and added shared long-text wrapping. Orphan dishes remain ungrouped; hidden/empty groups render empty states.
- TypeScript/build and 6 renderer checks passed, including supplied EN/FR/AR direction and hidden empty groups. Desktop/mobile screenshots: `06-content-desktop.jpg` and `06-content-mobile.jpg`. Full Arabic typography, print/PDF remain unqualified. Next: ticket 07 photos.

### Ticket 05 — movement completed — 2026-11-18

- Reused existing history and drag operations; added explicit section/subsection destination selector and empty subsection drop areas. Group reordering sorts stored order, invalid groups and self drops are ignored, and photo/data IDs stay attached.
- TypeScript, build and 22 workspace tests passed. Desktop/mobile group destination change verified and screenshots `05-movement-desktop.jpg` / `05-movement-mobile.jpg` captured. Next: ticket 06 content fidelity.

### Ticket 04 — lifecycle completed — 2026-11-18

- Added nested duplication with fresh IDs, independent hidden state, and reversible outline actions. Subsection removal preserves dishes ungrouped. Shared visibility filtering also excludes hidden hero source photos.
- TypeScript, build and focused workspace checks passed. Desktop and 390px mobile duplicate/hide/save checked with isolated data; screenshots `04-lifecycle-desktop.jpg` and `04-lifecycle-mobile.jpg` are in `.scratch/template-engine/evidence/`. Review consistency issue fixed.
- Next: ticket 05 movement, followed by requested 06–09. Print/Arabic qualification remains deferred.

### Ticket 03 — preview selection to editing completed — 2026-11-18

- Resolved [ticket 03](.scratch/template-engine/issues/03-preview-selection-to-editing.md) on `feat/template-engine-roadmap`.
- Added preview-only targets backed by restaurant/section/subsection/item IDs across Atlas Simple and all six legacy renderers. Selecting a heading, dish, logo, dish photo, or dish-sourced hero photo opens the matching focused form; image selection focuses its upload control. The selected target is visibly outlined. Selection follows rename and reorder, and deletion clears it safely. Preview selection alone creates no history step or publication.
- Kept real heading semantics with separately named edit buttons and Enter/Space actions. Published templates render without editor attributes or controls. The structured Menu JSON, save API, and design settings did not change; existing saved menus need no migration.
- Focused tests cover duplicate dish names, rename/reorder with keyboard re-selection, deletion, headings and photos, hero photos in three designs, all seven templates, and the public rendering boundary. `npx tsc --noEmit`, `npm run build`, and full `npm test` (26/26) passed. The first full-suite attempt could not acquire Next's dev lock while the normal port 3000 server was running; stopping it for the test and restoring it afterward produced a clean full pass.
- Browser checks with isolated disposable data passed desktop and 390px mobile preview-to-editor selection, semantic heading actions, hero-photo selection and image focus. Image focus scrolled the editor while page scroll stayed at zero; no horizontal page overflow or browser alerts were observed. The public route had zero preview targets/buttons. Evidence: [desktop selection](.scratch/template-engine/evidence/03-desktop-selection.jpg), [mobile selection](.scratch/template-engine/evidence/03-mobile-selection.jpg), [hero photo selection](.scratch/template-engine/evidence/03-hero-photo-selection.jpg).
- Standards/spec review findings about heading semantics and unselectable hero photos were fixed and re-reviewed without blockers. Current photo lookup uses source item object identity within each render; this works in all seven present renderers but would need an explicit ID handoff if a future renderer clones items. Print/PDF and full Arabic typography remain unqualified.
- Next unblocked tickets: 04, 05, 06, 07, and 10. Ticket 04 adds the entry lifecycle controls using the focused workspace.

### Ticket 02 — outline and focused editing completed — 2026-11-18

- Resolved [ticket 02](.scratch/template-engine/issues/02-outline-and-detail-workspace.md) on `feat/template-engine-roadmap`.
- Separated authenticated loading from the persistent MenuWorkspace. Content and Customize keep the selected entry, unsaved menu, and Editor History; Done returns to the outline and restores keyboard focus. The outline shows restaurant information, sections, subsections, dish summaries, and existing add/move actions.
- Added bounded independently scrolling editor/preview panes, fit width and 50/75/100/125% display zoom, and an accessible mobile edit/preview switch. Zoom affects only the view. Kept template choice, sample menus, export, Daily Special, sharing/QR, image uploads, and existing AI-draft controls available.
- Added content-based publication state with unsaved/saving/saved/failure feedback and retry. Saving a submitted version does not overwrite edits made while it is in flight. Server menu identity is reconciled across history snapshots, preserving the public URL through undo.
- Added jsdom as a development dependency and 7 DOM interaction/regression tests. Full suite: 13 tests passed (7 workspace, 4 registry/render, 2 HTTP integration); `npx tsc --noEmit` and `npm run build` passed.
- Browser checks with isolated disposable data passed desktop and 390px mobile editing, tab retention, Done/reopen, undo/redo, fit/zoom, preview switching, save/reload, and stable public access. Public prices changed only after explicit saves. Independent scrolling and zero fit/page horizontal overflow were measured; 125% panning stayed inside the preview. No browser errors were recorded.
- Evidence: [desktop outline](.scratch/template-engine/evidence/02-outline-desktop.jpg), [desktop detail](.scratch/template-engine/evidence/02-detail-desktop.jpg), [mobile outline](.scratch/template-engine/evidence/02-outline-mobile.jpg), [mobile detail](.scratch/template-engine/evidence/02-detail-mobile.jpg).
- Standards/spec review found mobile-link, grouped-movement, and deletion/move-focus regressions; all were fixed and re-reviewed without remaining blockers. The large retained MenuBuilder form/action bundle remains an optional maintenance extraction. Existing build notices remain unchanged; print/PDF and full Arabic typography are not qualified.
- Next frontier: tickets 03, 04, 05, 06, 07, and 10. Ticket 03 is the next interaction step: selecting a preview element to edit it. None of those tickets has been claimed.

### Ticket 01 — reusable Atlas blocks completed — 2026-11-18

- Resolved [ticket 01](.scratch/template-engine/issues/01-atlas-reusable-menu-blocks.md) on `feat/template-engine-roadmap`.
- Added validated template definitions with explicit legacy-renderer or block-composition references. Shared allowed-value lists supply runtime validation and TypeScript types.
- Derived template IDs, gallery discovery/metadata, renderer dispatch, and server save validation from one registry. New configurable presets need no additional gallery/rendering allowlists; sample availability follows the existing sample-data catalog.
- Extracted reusable restaurant-header, section/subsection-heading, section-list, and dish-row components. Composition binds to the existing structured Menu; persisted menu data and all six legacy rendering components remain unchanged.
- Unknown template IDs now fail explicitly rather than falling back to Classic. Invalid save attempts are rejected before writing and preserve the existing publication.
- Verification passed: `npx tsc --noEmit`, `npm run build`, and the full `npm test` suite (6 tests: 4 registry/render checks, 2 HTTP integration checks). New checks cover definition-only fixture registration, composition ordering, invalid definitions/references, all seven IDs, compatibility, and rejected-save publication preservation.
- Browser verification with an isolated disposable owner/data directory passed gallery selection, Live Preview, save, builder reload, and public rendering. Checked the public renderer at 1440×900 and 390×844 and the mobile builder preview; no runtime errors or horizontal overflow. Evidence: [desktop](.scratch/template-engine/evidence/01-atlas-desktop.jpg), [mobile](.scratch/template-engine/evidence/01-atlas-mobile.jpg).
- Standards/spec reviews found no blockers. Fixed the optional duplicated-enumeration maintenance finding. Existing non-blocking baseline-mapping/module-format build notices and a smooth-scroll browser warning remain outside this change.
- Limits: this completes the composition/registration slice. Existing Atlas theme-override and broader content-fidelity work remains in later tickets; print/PDF and full Arabic typography are not qualified by these checks.
- Next frontier: [02 — outline-and-detail workspace](.scratch/template-engine/issues/02-outline-and-detail-workspace.md) and [06 — complete menu rendering](.scratch/template-engine/issues/06-complete-menu-rendering.md). Neither has been claimed.

### Template-engine plan approved and published — 2026-11-17

- The user supplied two CV-builder screenshots to clarify the intended menu workflow: a collapsible content outline and focused editing beside a persistent live preview, simple add/move/visibility controls, and templates composed from the same reusable building blocks. Personal CV content and AI controls in the screenshots are reference material, not requested menu features.
- The owner approved the revised 21-ticket proposal with its scope and blocking edges. It supersedes the earlier unpublished 12-ticket breakdown.
- Published the [approved specification and ticket index](.scratch/template-engine/spec.md) and 21 separate numbered issues under `.scratch/template-engine/issues/`, each with acceptance criteria, a demonstration, explicit blockers, and Status: ready-for-agent.
- Approved slices cover Atlas Simple as a validated block composition with one registry; outline/focused editing and preview selection; content lifecycle and movement; rendering fidelity; dish, restaurant-header, and section image slots; global and reusable component styles; constrained layouts; safe template switching; gallery/preset authoring; six individual legacy migrations; and final cleanup.
- The approved architecture keeps structured menu content, template composition, and owner design overrides separate. Templates are presets of the same components exposed by the editor. Picture controls use explicit slots with crop/focal-position settings, and layout movement uses permitted regions rather than arbitrary coordinates.
- Dependencies preserve the reviewed graph: the Atlas composition first; editor and shared behaviors next; photo controls shared across slots; Component Styles before layout controls and safe switching; individual template migrations after their own prerequisites. Cleanup waits for every remaining editor/gallery slice and migration.
- No engine/editor implementation has started. PDF export remains its later roadmap milestone; the reference workflow does not change AI/provider, database, or deployment decisions.
- Checks for this publication task: document/source inspection and tracker consistency checks for ticket count, numbering, status, links, and dependency order. TypeScript, build, and application tests were not rerun; the implementation results below are from the previous development task.
- Next action: claim and implement [ticket 01 — Build Atlas Simple from reusable menu blocks](.scratch/template-engine/issues/01-atlas-reusable-menu-blocks.md), the sole initially unblocked ticket.

### Branch: `feat/template-engine-roadmap`

- Added typed output-format, theme, layout, and template config definitions in `lib/templates/config.ts`.
- Added `lib/templates/TemplateFromConfig.tsx`, a renderer for config-only templates.
- Added `atlas-simple` as the first data-only template while preserving all six legacy template components.
- Derived gallery metadata from template config and added Atlas Simple to the Moroccan gallery. Existing example-menu loading remains limited to templates with sample data.
- Replaced the server's hardcoded template ID check with the template config registry.
- Added this project status, implementation roadmap, and the `menu-studio-workflow` skill.
- Linked `idea.md`, the roadmap, status, and skill from `docs/README.md`.

### Previous completed change

- `4e8643e feat(ui): port The Wall design across the app` — Direction B app chrome, local font and GSAP assets, builder/auth restyling, and `design-lab/` research/prototypes/notes.

## Decisions and constraints

- Product is a **menu creation and multi-format publishing studio**, not merely a QR-menu product. QR is one optional publishing channel.
- One structured menu content source must support multiple renderers. Keep content, design configuration, and output rendering independent.
- Template quality matters more than raw template count. Build and review templates deliberately; do not generate arbitrary HTML/CSS for publication.
- First market is Morocco. MAD is the default; French, Arabic, and English matter. Arabic requires a suitable Arabic font and tested RTL behavior; Latin-only Bricolage is not an Arabic font.
- PDF rendering target is Playwright using the same web renderer, with real pagination and print-size checks.
- Phase 2 database choice: Prisma + SQLite first (low setup), with an intentional path to Postgres before multi-instance deployment.
- Field-level translations are preferred: names/descriptions per language, rather than duplicating whole menus by language.
- AI import/translation/enhancement is deferred until a provider and budget are explicitly available. Never invent ingredients, allergens, dietary claims, or menu facts.
- Preserve current template IDs and saved-menu compatibility when migrating templates to configuration.
- App visual chrome follows **The Wall**. Restaurant-facing menu templates remain individually art-directed; the app shell's font/palette must not flatten restaurant output.

## Checks for latest implementation

- `npx tsc --noEmit` — passed.
- `npm run build` — passed.
- `npm test` — all 34 tests passed, including lifecycle/movement/image DOM cases, rendering and temporary isolated HTTP storage.
- Browser: desktop and 390px mobile selection, hero photo and editor focus, and published route separation — passed with no browser alerts or horizontal page overflow. Browser fixtures used an isolated directory outside the owner's data.
- Review: standards/spec findings fixed and re-reviewed without remaining blockers. Passing source items directly to photo targets instead of looking them up by object identity is an optional future maintenance improvement.

## Next

1. Tickets 01–09 are resolved. Continue with [10 — overall appearance](.scratch/template-engine/issues/10-menu-wide-appearance.md) in the [approved 21-ticket plan](.scratch/template-engine/spec.md); 11–14 and individual migrations follow their blockers.
2. Complete the approved shared editor/engine behaviors and convert the six legacy templates individually when their blockers are complete, preserving IDs and visual/behavior parity. Keep specialized hooks only where configuration cannot express the design cleanly.
3. Grow the template library in quality-reviewed batches, starting with Morocco-relevant restaurant types and styles.
4. Build Playwright PDF export from the shared renderer (A4/A5 first, then pagination and multi-page output).
5. Before Phase 2 persistence features, migrate JSON storage to Prisma + SQLite; then add menu versions/history and field-level translations/RTL.

## Open questions (do not silently decide)

- Which 20–30 template categories/styles are validated with Moroccan restaurant owners, and who art-directs/signs off on them?
- Which Arabic font/license and copy-review workflow will be used?
- Which print requirements are in the first PDF release (bleed, crop marks, custom dimensions, fold layouts)?
- What deployment/storage target justifies moving SQLite to managed Postgres?
- What AI provider/budget, if any, will be approved?
