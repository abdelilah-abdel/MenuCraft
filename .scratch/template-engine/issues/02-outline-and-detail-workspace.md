# 02: Create the outline-and-detail editing workspace

**Status:** ready-for-agent

**Blocked by:** 01: Build Atlas Simple from reusable menu blocks

**What to build:** A Restaurant Owner works from a collapsible menu outline beside a persistent Live Preview. Selecting an entry opens a focused form, and Done returns to the outline without losing edits.

## Acceptance criteria

- [ ] Show restaurant information, Menu Sections, Menu Subsections, and compact Menu Item summaries in a navigable outline, retaining existing add/edit/save capabilities.
- [ ] Open the selected entry's focused form and return to the outline with Done. Preserve selection and unsaved state when switching between Content and Customize.
- [ ] Keep the Live Preview visible beside the editor on desktop, with usable independent scrolling, fit-to-width, and zoom that scales the view without changing the menu design.
- [ ] Provide an accessible edit/preview switch on small screens without squeezing the desktop split layout or losing the selected entry.
- [ ] Reuse Editor History and existing menu operations. Done changes the editing view; only an explicit successful save changes the Published Menu.
- [ ] Show unsaved, saving, saved, and failed-save states truthfully. A failed save keeps the owner's edits available.

## Demonstration

Expand a section, open a dish, edit its price, use Done, and reopen it while the preview stays current. Verify the public page changes only after saving, and repeat on mobile.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
