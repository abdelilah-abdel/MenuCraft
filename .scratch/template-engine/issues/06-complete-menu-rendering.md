# 06: Render complete menu content consistently

**Status:** ready-for-agent

**Blocked by:** 01: Build Atlas Simple from reusable menu blocks

**What to build:** The shared renderer presents the same complete menu content in Live Preview and the Published Menu, including exceptional content and visibility states.

## Acceptance criteria

- [ ] Render restaurant, section, subsection, and item names/descriptions plus item tags, prices, grouping, order, and Availability without omitting supported content.
- [ ] Honor existing price, description, and image visibility settings consistently, and keep unavailable dishes visible with the localized sold-out label.
- [ ] Preserve items with missing or obsolete subsection references in a deterministic ungrouped presentation rather than dropping them.
- [ ] Handle empty menus, empty groups, absent or failed images, very long text, and large menus without exceptions or horizontal clipping.
- [ ] Preserve existing Original Language, lang/dir behavior, and supplied text across English, French, and Arabic fixtures; do not claim full Arabic font/typography qualification.
- [ ] Use the same content rendering behavior for preview and publication, with a truthful empty state for each context and no invented menu facts.

## Demonstration

Render a fixture with subsection descriptions, tags, sold-out dishes, missing images, and long names in preview and public view; toggle visibility settings, then repeat with an empty menu.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
