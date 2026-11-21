# 06: Render complete menu content consistently

**Status:** resolved

**Blocked by:** 01: Build Atlas Simple from reusable menu blocks

**What to build:** The shared renderer presents the same complete menu content in Live Preview and the Published Menu, including exceptional content and visibility states.

## Acceptance criteria

- [x] Render restaurant, section, subsection, and item names/descriptions plus item tags, prices, grouping, order, and Availability without omitting supported content.
- [x] Honor existing price, description, and image visibility settings consistently, and keep unavailable dishes visible with the localized sold-out label.
- [x] Preserve items with missing or obsolete subsection references in a deterministic ungrouped presentation rather than dropping them.
- [x] Handle empty menus, empty groups, absent or failed images, very long text, and large menus without exceptions or horizontal clipping.
- [x] Preserve existing Original Language, lang/dir behavior, and supplied text across English, French, and Arabic fixtures; do not claim full Arabic font/typography qualification.
- [x] Use the same content rendering behavior for preview and publication, with a truthful empty state for each context and no invented menu facts.

## Demonstration

Render a fixture with subsection descriptions, tags, sold-out dishes, missing images, and long names in preview and public view; toggle visibility settings, then repeat with an empty menu.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.

## Answer

Completed 2026-11-18. Atlas now renders tags and subsection descriptions. All seven designs honor description visibility for restaurant/section/subsection/item text and share hidden/orphan grouping behavior. Shared content sizing/wrapping handles long owner text. TypeScript/build and 6 renderer tests passed, including English/French/Arabic direction and empty hidden groups. Desktop/mobile screenshots: [desktop](../evidence/06-content-desktop.jpg), [mobile](../evidence/06-content-mobile.jpg). Arabic typography and print remain unqualified.
