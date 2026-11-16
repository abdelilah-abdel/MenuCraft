# MenuCraft — Project Status

> **Always update this file before finishing a development task.** Record the active branch, what changed, checks run, decisions/risks, and the next concrete step. Keep `idea.md` as the product vision; this file is the execution log and handoff.

**Last updated:** 2026-11-16  
**Current branch:** `feat/template-engine-roadmap`  
**Product source of truth:** [`idea.md`](./idea.md)  
**Build order and accepted decisions:** [`docs/IMPLEMENTATION_ROADMAP.md`](./docs/IMPLEMENTATION_ROADMAP.md)  
**Chosen app chrome design:** Direction B — The Wall ([design notes](./design-lab/NOTES.md))

## Current state

- Owner authentication, one-menu workspaces, persistent server-side JSON storage, and public web menus are implemented.
- Six hand-built menu templates exist: Classic, Modern, Minimal, Medina Café, Moroccan Fine Dining, and Modern Moroccan Garden.
- Builder supports menu content editing, sample menus, undo/redo, image upload, preview, public links, QR codes, and a description-suggestion endpoint. AI suggestions require an API key; no AI budget/provider is currently selected.
- Direction B — The Wall — has been ported to the app chrome: self-hosted Bricolage Grotesque, paper/ink/stamp tokens, landing-page motion, and restyled builder/auth UI.
- Phase 1, Step 1 has started: a structured template configuration registry and reusable `TemplateFromConfig` renderer are added. The six legacy templates remain on their existing renderers for compatibility; `atlas-simple` is the first configuration-only template.
- Server menu validation now uses the template registry as its allowlist, so registered config-only templates can be saved.
- Persistence is still file-backed JSON and intended for one durable app instance. No relational database migration has been done.

## Latest changes

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
- Integration parity smoke test: registered an owner, saved and publicly rendered each of the six legacy template IDs plus `atlas-simple` using the actual returned public menu ID. All showed the restaurant, dish, and price; no browser exceptions.
- Smoke-test fixtures were written to local `.menucraft-data/`, which is gitignored.
- `idea.md` is included in this branch's history from the previous design commit; the roadmap and status link back to it rather than forking the product vision.

## Next

1. Review the config schema/renderer against actual print, web, and mobile needs; fix gaps before converting templates.
2. Convert the six legacy templates to config incrementally, with visual/behavior parity checks after each conversion. Keep specialized renderer hooks only where configuration cannot express the design cleanly.
3. Grow the template library in quality-reviewed batches, starting with Morocco-relevant restaurant types and styles.
4. Build Playwright PDF export from the shared renderer (A4/A5 first, then pagination and multi-page output).
5. Before Phase 2 persistence features, migrate JSON storage to Prisma + SQLite; then add menu versions/history and field-level translations/RTL.

## Open questions (do not silently decide)

- Which 20–30 template categories/styles are validated with Moroccan restaurant owners, and who art-directs/signs off on them?
- Which Arabic font/license and copy-review workflow will be used?
- Which print requirements are in the first PDF release (bleed, crop marks, custom dimensions, fold layouts)?
- What deployment/storage target justifies moving SQLite to managed Postgres?
- What AI provider/budget, if any, will be approved?
