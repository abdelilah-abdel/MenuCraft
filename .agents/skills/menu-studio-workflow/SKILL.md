---
name: menu-studio-workflow
description: Project-specific product, architecture, implementation-priority, and handoff rules for MenuCraft. Read before planning or implementing product work in this repository.
---

# MenuCraft project workflow

## Required context before product work

Read these files before proposing or implementing a product feature:

1. [`idea.md`](../../../idea.md) — product vision and full feature scope.
2. [`docs/IMPLEMENTATION_ROADMAP.md`](../../../docs/IMPLEMENTATION_ROADMAP.md) — accepted decisions and dependency-ordered phases.
3. [`PROJECT_STATUS.md`](../../../PROJECT_STATUS.md) — current branch, completed work, checks, risks, and next step.
4. Relevant code/docs for the feature.

If these disagree, treat `idea.md` as the product vision, the implementation roadmap as the accepted delivery sequence, and PROJECT_STATUS as the latest execution state. Do not silently make open product decisions; ask the user when a choice changes scope, architecture, budget, or deployment assumptions.

## Product rules

- MenuCraft is a Morocco-first **menu creation/design/publishing studio**, not just a QR-menu generator.
- A restaurant's structured content is the source of truth. Keep content, design configuration, and output rendering separate so the same menu can power print, responsive web, TV, touchscreen, and QR.
- QR is an optional publishing channel. It is not the product definition.
- Design quality beats raw template count. Templates need art direction, intended customer/use, example data, and output/responsive QA.
- The chosen **The Wall / Direction B** look applies to MenuCraft's application chrome. Do not force its type/palette onto restaurant-facing templates; output designs must keep their own identity.
- Morocco-first means MAD defaults and real French/Arabic/English support. Do not claim Arabic/RTL support until font licensing, typography, mixed-script content, numbers, layouts, and output rendering have been verified. Bricolage Grotesque is Latin-only and is not the Arabic face.
- Never fabricate ingredients, allergens, dietary claims, popularity, or other restaurant facts.
- AI import/translation/description/enhancement remains deferred until the owner explicitly approves provider and budget. Do not wire paid calls or imply fake AI functionality.

## Architecture and compatibility rules

- New templates should be structured configurations rendered by shared constrained components whenever possible; do not publish arbitrary AI-generated HTML/CSS.
- Preserve existing template IDs and saved-menu behavior while migrating. Convert one template at a time and compare it to its existing implementation.
- A template registry is the source of truth for IDs, metadata, renderer selection, and allowed output formats. Avoid duplicate hardcoded template allowlists in API/server validation.
- Keep specialized renderer hooks where a genuine art-directed difference needs them; do not contort configuration to remove all custom code.
- Phase-1 PDF target is Playwright against the shared renderer. Test pagination/overflow and font/image fidelity; do not claim a PDF is print-ready just because it downloads.
- Phase-2 persistence target is Prisma + SQLite, with repository boundaries that permit migration to Postgres before multi-instance deployment.
- Translation model is field-level, not independent duplicated menus per language. Preserve source language and expose incomplete translations.
- Ordering/payment, multi-branch/team, advanced analytics, native TV apps, and custom domains must follow the roadmap dependencies, not jump ahead opportunistically.

## Agreed order of work

1. Harden config-driven template engine and convert the six existing templates with parity checks.
2. Expand the quality-reviewed library for Moroccan restaurant types/styles.
3. Verify/fix existing drag-and-drop/history (do not rebuild without testing it first).
4. Playwright PDF export: A4/A5 first, then pagination and additional formats.
5. Prisma + SQLite before versions/history/analytics.
6. Menu version/history and field-level FR/AR/EN localization with real RTL QA.
7. Harden public web/QR; then TV mode and scheduling.
8. AI and business-platform phases only as described in the roadmap and after required decisions/infra.

## Validation and working style

- Make the smallest coherent change; preserve user work and inspect `git status` before staging.
- Run `npx tsc --noEmit`, `npm run build`, and focused tests/smoke tests relevant to the change.
- For rendering changes, check mobile and desktop, reduced motion, no console/runtime errors, and supported output formats. For template changes, verify old IDs and content persistence.
- Report what was actually tested. Do not claim an output format, locale, or integration works without testing it.
- Do not commit or push unless the user asks. If asked for a new branch, create it from the intended base and include the branch name in the handoff.

## Mandatory status handoff

Before finishing any product task, update [`PROJECT_STATUS.md`](../../../PROJECT_STATUS.md) with:

- date and current branch;
- what changed (including relevant docs/decisions);
- checks run and their actual results;
- known limitations, unresolved decisions, or risks;
- the next concrete, dependency-correct step.

This is the durable handoff document. Update it in the same change as the work; do not leave a stale branch or “next” section.
