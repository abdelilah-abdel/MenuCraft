# 14: Build gallery previews and new templates from these blocks

**Status:** ready-for-agent

**Blocked by:** 13: Switch templates while preserving the menu

**What to build:** A Restaurant Owner browses accurate previews of reusable template presets, while a template author can compose another design from the same blocks and styles used by the editor.

## Acceptance criteria

- [ ] Generate gallery previews through the actual template renderer with separate representative example content, rather than unrelated hand-drawn mockups.
- [ ] Register a new fixture preset by composing existing blocks, styles, regions, image slots, and customization capabilities without adding a page-wide rendering component or duplicate allowlists.
- [ ] Keep gallery metadata and verified format capabilities in the registry; distinguish planned outputs from tested supported formats.
- [ ] Choosing a design preserves owner content; loading sample content is a separate explicit action with replacement confirmation when needed and undo support.
- [ ] Provide suitable preview/example content for Atlas Simple and preserve the existing Moroccan sample-menu flows.
- [ ] Verify keyboard selection, loading/error states, and mobile gallery use, with rendering fidelity maintained between gallery examples, Live Preview, and publication.

## Demonstration

Add a preset composed from existing blocks, see it appear in the gallery, preview it, apply it to an existing menu, and separately load/undo its example content.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
