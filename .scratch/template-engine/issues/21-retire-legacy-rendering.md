# 21: Retire legacy rendering and document template creation

**Status:** ready-for-agent

**Blocked by:** 03: Connect preview selection to editing; 04: Add, duplicate, hide, and remove menu entries; 05: Move sections and dishes without losing their settings; 09: Add section photos; 14: Build gallery previews and new templates from these blocks; 15: Migrate Classic; 16: Migrate Minimal; 17: Migrate Modern; 18: Migrate Medina Café; 19: Migrate Moroccan Fine Dining; 20: Migrate Modern Moroccan Garden

**What to build:** All seven existing templates use the shared engine and approved specialized hooks. Template authors have a clear recipe for adding another preset, and owners retain a coherent editing and publishing workflow.

## Acceptance criteria

- [ ] Confirm all six migration tickets are complete before removing unused legacy components, dispatch paths, and compatibility-only duplication; retain any documented specialized hooks still needed.
- [ ] Verify all seven template IDs and representative previously saved menus through gallery selection, focused editing, supported customization, save/reload, and their existing public URLs.
- [ ] Check the complete owner workflow: add/duplicate/hide, sold-out state, moving grouped content, photo slots/crops, preview selection, Component Styles, layout changes, template switching, and undo/redo.
- [ ] Demonstrate registering one additional fixture preset using existing blocks, styles, slots, and constraints without a new page-wide renderer or hardcoded discovery list.
- [ ] Document template composition, default/override rules, image slots, supported controls/formats, validation, visual review, and the criteria for a specialized hook.
- [ ] Run the complete relevant engine/editor checks plus TypeScript and build, and record actual desktop/mobile rendering evidence and remaining locale/output limitations.
- [ ] Update project status and hand off print-layout constraints and any unresolved design questions to the later PDF milestone without implementing PDF export here.

## Demonstration

Complete an end-to-end menu editing and publishing session across the seven templates, then add a fixture preset following the authoring recipe and show it in the gallery.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
