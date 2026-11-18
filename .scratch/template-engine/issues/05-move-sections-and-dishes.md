# 05: Move sections and dishes without losing their settings

**Status:** ready-for-agent

**Blocked by:** 02: Create the outline-and-detail editing workspace

**What to build:** A Restaurant Owner reorders sections and subsections and moves dishes within or between groups, with immediate preview updates and stable picture and design associations.

## Acceptance criteria

- [ ] Reuse and adapt the existing movement and history operations instead of replacing working behavior without evidence.
- [ ] Support reordering sections/subsections and moving dishes within a group, between subsections, and between sections, including an empty destination.
- [ ] Keep identities, dish data, pictures, crop metadata, and supported design associations attached to moved entries; update or clear subsection references intentionally at the destination.
- [ ] Provide visible drop targets and accessible non-drag alternatives usable with keyboard and touch.
- [ ] Cancelled, invalid, and no-op moves leave data unchanged. Successful moves are undoable/redoable and preserve canonical order after save/reload.
- [ ] Rendered order matches the owner's chosen grouping and order without dropped or duplicated items.

## Demonstration

Move a photographed dish into another section's subsection, move it into an empty section, undo/redo, then save/reload. Demonstrate the same outcomes with non-drag controls.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
