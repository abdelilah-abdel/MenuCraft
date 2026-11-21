# 11: Customize reusable Component Styles

**Status:** resolved

**Blocked by:** 10: Customize the menu's overall appearance

**What to build:** A Restaurant Owner chooses a reusable treatment for all components of a type, such as section headings, dish rows/cards, or price labels, instead of styling every dish separately.

## Acceptance criteria

- [x] Offer bounded reusable choices for section headings, dish rows/cards, and price labels, including ruled/plain headings and aligned/dotted-leader prices where supported.
- [x] Apply each Component Style consistently to all instances of its type and to entries added later.
- [x] Resolve Component Styles predictably with template defaults and menu-wide appearance overrides.
- [x] Preserve content, tags, Availability, and visibility behavior when changing component presentation.
- [x] Expose only supported choices, with a clear selected state and explicit reset; retain settings through save/reload and undo/redo.
- [x] Verify the same Component Styles appear in Live Preview and the Published Menu with readable desktop/mobile output.

## Demonstration

Change every section heading to a ruled treatment and every price to an aligned treatment, then add another section/dish and verify the styles apply automatically.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.

## Answer

Completed 2026-11-18. Atlas declares reusable ruled/plain section headings, plain/outlined dish treatments and aligned/dotted-leader prices. Shared resolution applies to every current/new entry, preserving content, hidden/Availability/tags/photos. Styles resolve independently from appearance and reset explicitly with history. Legacy templates expose their signature choices until migrations.

TypeScript/build and 34 focused tests passed. Browser confirmed eight outlined/aligned dishes and three ruled headings, saved state and mobile controls without overflow. [Desktop](../evidence/11-component-styles-desktop.jpg), [mobile](../evidence/11-component-styles-mobile.jpg). Preserved existing card typography after review. Full batch public/save-reload checks continue with ticket 12.

Batch completion with ticket 12: all 38 tests, TypeScript and the production build passed. Saved/reloaded combined settings rendered eight outlined dishes with aligned prices in both preview and actual public desktop/mobile output.
