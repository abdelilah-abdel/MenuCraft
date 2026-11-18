# 03: Connect preview selection to editing

**Status:** ready-for-agent

**Blocked by:** 02: Create the outline-and-detail editing workspace

**What to build:** A Restaurant Owner can select a visible dish, heading, or image in the Live Preview and immediately reach the corresponding editing controls.

## Acceptance criteria

- [ ] Map rendered blocks to stable menu identities and their editing targets rather than displayed labels or array positions.
- [ ] Selecting a dish, section heading, restaurant heading, or available image slot opens the matching controls and visibly identifies the selection.
- [ ] Keep selection coherent after rename and reorder; clear or move it safely when an entry is removed.
- [ ] Expose equivalent keyboard editing actions with visible focus and meaningful labels, without hijacking ordinary form typing.
- [ ] Keep selection markers and editing controls out of the Published Menu. Preview selection alone does not alter saved menu data or Editor History.

## Demonstration

Select two identically named dishes in different sections and verify each opens its own form. Rename and reorder one, then repeat using keyboard actions.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
