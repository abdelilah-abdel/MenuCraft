# 04: Add, duplicate, hide, and remove menu entries

**Status:** ready-for-agent

**Blocked by:** 02: Create the outline-and-detail editing workspace

**What to build:** A Restaurant Owner manages sections, subsections, and dishes from the outline using simple actions while retaining content, recoverability, and predictable publication.

## Acceptance criteria

- [ ] Provide add, duplicate, hide/show, and remove actions for sections, subsections, and dishes where each operation is meaningful for that entry type.
- [ ] Generate unique identities when duplicating nested content and remap subsection references correctly; preserve the copied entry's pictures and supported design settings.
- [ ] Model hidden content separately from Availability. Hidden entries remain editable and are omitted from rendered output, while unavailable visible dishes remain present with a sold-out label.
- [ ] Treat absent visibility fields in existing menus as visible and retain hidden content through save/reload and template changes.
- [ ] Make add, duplicate, visibility, and removal actions reversible through the existing Editor History, including restoration of nested entries and their associations.
- [ ] A hidden or empty group does not leave orphan headings in preview or public rendering; surface the appropriate empty state if nothing is visible.

## Demonstration

Duplicate a section containing subsections and photos, hide one copy, mark a visible dish sold out, and undo a deletion. Save/reload and compare the outline, preview, and public menu.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
