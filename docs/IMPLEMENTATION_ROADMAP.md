# MenuCraft — Agreed Implementation Roadmap

This roadmap turns [`idea.md`](../idea.md)'s product vision into a dependency-ordered build plan. The vision document remains authoritative for product scope; [`PROJECT_STATUS.md`](../PROJECT_STATUS.md) records the current branch and execution handoff.

## Product definition

MenuCraft is a Morocco-first **menu creation, design, and publishing studio**. A restaurant maintains structured content and a reusable brand profile, chooses a professionally art-directed design, then publishes that content to the formats it needs. Printed PDF, responsive web, TV, touchscreen, and QR are outputs/channels; QR is not the whole product.

Core architecture rule:

> One source of menu content; separate design configuration; format-specific renderers that share the same data and design system where appropriate.

## Agreed technical/product decisions

| Area | Decision |
|---|---|
| Design library | Config-driven engine first; port the six current templates without changing their IDs or breaking saved menus; add templates in reviewed batches. |
| Template renderer | Structured configuration and constrained reusable components. Avoid arbitrary generated HTML/CSS. Keep an explicit escape hatch for genuinely bespoke art direction. |
| Library expansion | Quality before count. Morocco-relevant types/styles first; validate the initial 20–30 concepts with restaurant owners/designers rather than manufacturing token combinations. |
| PDF | Playwright rendering the same template implementation as the web preview. Start with A4/A5 and real overflow/pagination behavior; add A3/booklets/folds/bleed as measured requirements. |
| Database | Prisma + SQLite for the first relational migration; design repository boundaries so Postgres can replace it before multi-instance production. |
| Languages | Field-level translations for restaurant/section/subsection/item text, with French, Arabic, and English as initial Morocco languages. Do not model each language as an unrelated duplicate menu. |
| RTL | Arabic needs a licensed Arabic-capable font and actual bidirectional testing of text, numerals, prices, mixed-script typography, and output. The current Latin Bricolage font does not satisfy this. |
| AI | Defer AI import/translation/enhancement until provider and budget are explicitly approved. Any later AI output must be reviewable and must not invent ingredients, allergens, or dietary claims. |
| Current UI | Direction B — The Wall — is the chosen **application chrome**. Restaurant output designs may and should have different palettes and typography. |

## Build sequence

### Phase 1 — Close the core menu studio

**1. Finish and harden the template engine (in progress)**

- Validate that config captures the design primitives needed by current templates: hierarchy, section/subsection layouts, item/pricing patterns, image treatments, visibility, output compatibility, and responsive/print constraints.
- Convert one existing template at a time. Preserve its ID and compare visual output and menu behavior against the old renderer.
- Add tests for config validation, unknown IDs, visibility flags, unavailable items, subsections, missing images, and supported output declarations.
- Keep configuration simple and constrained; add a custom renderer hook only where it protects a meaningful design difference.

**2. Establish the initial art-directed template set**

- Use the six existing designs as the compatibility baseline.
- Add Moroccan café, traditional/modern restaurant, fine dining/riad, street food/snack, bakery/pastry, and hotel use cases before broad international categories.
- Each template must have clear intended restaurant/use, supported formats, example content, and desktop/mobile/print review.
- Do not treat `20–30` as a quota that overrides design quality or customer validation.

**3. Verify editing fundamentals**

- The PR already added item/section drag-and-drop/history work; test it and fix gaps instead of rebuilding it.
- Confirm that changing templates preserves content, sample-menu actions are explicit, and unsaved edits are not silently lost.
- Keep the structured form approachable while improving the preview/editor relationship incrementally.

**4. Deliver reliable first PDF output**

- Use Playwright against the shared web renderer and self-hosted fonts.
- Begin with A4 and A5, portrait/landscape only where templates support it.
- Define print CSS, page breaks, image resolution, embedded fonts, and overflow behavior.
- Make long menus paginate while keeping sections/items together where possible. Compare output visually with browser preview; PDFs must not silently clip content.
- Add tests for empty menu, short menu, long menu, unavailable item, images, and supported languages.

### Phase 2 — Durable content and publishing formats

**5. Move persistence to Prisma + SQLite**

- Define repository interfaces and migrate owner/menu data from JSON with a tested backup/rollback path.
- Add schema/migration tests and keep public menu IDs stable.
- Revisit managed Postgres before multiple app instances, high write concurrency, or production deployment requirements demand it.

**6. Add versions/history, then field-level localization**

- Menu versions should support duplicate/restore/compare; content and design selection remain distinct.
- Add translation fields for restaurant metadata, sections/subsections, and item names/descriptions. Preserve original-language text and make missing translations visible.
- Add Arabic font licensing, locale formatting, `lang`/`dir`, mixed-script typography, keyboard/navigation behavior, and RTL preview/export tests before claiming full Arabic support.

**7. Harden web publishing and QR**

- Stable public slugs/URLs, responsive public pages, explicit cache/update behavior, and current QR persistence.
- Add QR frame/logo/vector exports only after scannability, contrast, quiet zone, and print checks are covered.

**8. Add digital display outputs**

- TV landscape/portrait renderer, fullscreen/recovery behavior, multi-screen assignments, and menu refresh.
- Add schedules and event-based switching after versioning and publishing semantics exist; allow manual override.

### Phase 3 — Intelligence (only when budget/provider is approved)

- AI menu import with human confirmation before saving extracted data.
- Translation and description suggestions with review and safe factual boundaries.
- Image enhancement using deterministic image processing first; generated imagery must never masquerade as a real dish photo.
- Layout assistance, then lightweight analytics that distinguish views/scans from purchases.

### Phase 4 — Business platform

- Multiple locations, teams/roles, audit trail, and branch-specific menu/pricing/availability.
- Interactive touchscreen catalogue; ordering/payment remain a separate product phase.
- Custom domains, POS/ordering integrations, and Android TV only after customer demand validates them.

## Definition of done for each feature

1. Fits `idea.md` and the current phase; status/decision is recorded in `PROJECT_STATUS.md`.
2. Content stays independent from design and output-specific rendering.
3. Existing saved menus/template IDs continue to work or a migration is included.
4. TypeScript, build, and relevant tests pass.
5. Desktop/mobile and all affected output formats are checked; Arabic/print claims require specific tests, not assumptions.
6. Accessibility, reduced motion, contrast, empty/error states, and security boundaries are considered.
7. `PROJECT_STATUS.md` is updated with branch, outcome, checks, caveats, and next work before the task is handed off.

## Explicitly deferred

- AI features without approved provider/budget.
- POS/order/payment integration during the core studio phases.
- Native Android TV application before web-based TV mode proves demand.
- Custom domains, analytics, multi-branch/team complexity before the underlying persistence and publishing model is ready.
- “Hundreds of templates” generated from arbitrary combinations without design QA.

## Web layout constraints delivered in ticket 12

Atlas Simple supports one/two/three section-column regions with compact/comfortable/airy spacing and start/center alignment. Its restaurant header stays full width. Whole-section placement is separate from canonical section/item content order. Columns stack in region order below 768px; three columns become two between 768px and 1099px. Hidden/empty sections create no headings. Legacy templates retain their own layouts until migration.

These are web layout controls, not PDF pagination rules. Before qualifying print, define how regions flow across physical pages, column and section breaks, image dimensions, widows/orphans, and A4/A5 margins; compare long menus and large photos in the real PDF renderer. No print/PDF qualification is implied.
