# 14: Build gallery previews and new templates from these blocks

**Status:** resolved

**Blocked by:** 13: Switch templates while preserving the menu

**What to build:** A Restaurant Owner browses accurate previews of reusable template presets, while a template author can compose another design from the same blocks and styles used by the editor.

## Acceptance criteria

- [x] Generate gallery previews through the actual template renderer with separate representative example content, rather than unrelated hand-drawn mockups.
- [x] Register a new fixture preset by composing existing blocks, styles, regions, image slots, and customization capabilities without adding a page-wide rendering component or duplicate allowlists.
- [x] Keep gallery metadata and verified format capabilities in the registry; distinguish planned outputs from tested supported formats.
- [x] Choosing a design preserves owner content; loading sample content is a separate explicit action with replacement confirmation when needed and undo support.
- [x] Provide suitable preview/example content for Atlas Simple and preserve the existing Moroccan sample-menu flows.
- [x] Verify keyboard selection, loading/error states, and mobile gallery use, with rendering fidelity maintained between gallery examples, Live Preview, and publication.

## Demonstration

Add a preset composed from existing blocks, see it appear in the gallery, preview it, apply it to an existing menu, and separately load/undo its example content.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.


## Answer

Completed 2026-11-18. Gallery thumbnails load an isolated example route using the actual MenuTemplate renderer, with loading/error/retry feedback and named keyboard actions/full-example links. No owner data is read by the example route. Example content sources and verified formats are validated registry metadata; planned formats are labeled separately. Empty verified-format lists are allowed while an author qualifies a new preset.

Atlas Market demonstrates a second configuration-only preset: the existing header/section/dish blocks, two default section columns, photo cards, aligned prices, quiet headings and the same bounded customization capabilities. Registry registration supplies discovery, rendering, example loading and API acceptance without new allowlists. Atlas Simple now has representative editable examples; existing Moroccan examples/localization remain intact. Example replacement retains restaurant settings, requires confirmation for existing sections, prunes stale placements and remains one undoable action. Authoring steps are documented in docs/TEMPLATE_AUTHORING.md.

Verification: TypeScript, production build and all 41 tests passed (31 workspace, 8 renderer, 2 HTTP integration). Checks cover separate example data, new preset rendering, API persistence across all eight IDs, unknown preview 404s, gallery loading/failure/retry, sample confirmation/cancel/undo and preservation of owner content. Desktop gallery had eight real previews without error states. Chrome verified mobile gallery keyboard selection at 390px with eight loaded previews and no horizontal overflow. Atlas Market's full example rendered two desktop columns and one mobile column; its saved owner publication retained eight dishes, branding and the stable link with no editor markers or page overflow.

Evidence: [gallery desktop](../evidence/14-gallery-desktop.jpg), [gallery mobile](../evidence/14-gallery-mobile.jpg), [example desktop](../evidence/14-market-example-desktop.jpg), [example mobile](../evidence/14-market-example-mobile.jpg), [published mobile](../evidence/14-market-public-mobile.jpg). Native confirmation automation stalled the embedded browser, so Chrome completed mobile gallery verification; confirmation/cancel/replacement/undo behavior is covered by the DOM test rather than a completed native-dialog browser sequence. Standards review found no hard violations and an optional shared-capability extraction; spec review found no static gaps. Existing build notices and a legacy Medina SSR key warning remain; print/PDF, TV and Arabic typography are not qualified.

Next: ticket 15, migrate Classic while preserving its identity and visual parity.
