# 02: Create the outline-and-detail editing workspace

**Status:** resolved

**Blocked by:** 01: Build Atlas Simple from reusable menu blocks

**What to build:** A Restaurant Owner works from a collapsible menu outline beside a persistent Live Preview. Selecting an entry opens a focused form, and Done returns to the outline without losing edits.

## Acceptance criteria

- [x] Show restaurant information, Menu Sections, Menu Subsections, and compact Menu Item summaries in a navigable outline, retaining existing add/edit/save capabilities.
- [x] Open the selected entry's focused form and return to the outline with Done. Preserve selection and unsaved state when switching between Content and Customize.
- [x] Keep the Live Preview visible beside the editor on desktop, with usable independent scrolling, fit-to-width, and zoom that scales the view without changing the menu design.
- [x] Provide an accessible edit/preview switch on small screens without squeezing the desktop split layout or losing the selected entry.
- [x] Reuse Editor History and existing menu operations. Done changes the editing view; only an explicit successful save changes the Published Menu.
- [x] Show unsaved, saving, saved, and failed-save states truthfully. A failed save keeps the owner's edits available.

## Demonstration

Expand a section, open a dish, edit its price, use Done, and reopen it while the preview stays current. Verify the public page changes only after saving, and repeat on mobile.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
- Claimed on 2026-11-18 through `/implement`; dependency 01 is resolved. Verification follows the approved editor and save/publication boundaries, including focused editing/Done, Content/Customize retention, history, failed or in-flight saves, and desktop/mobile preview behavior.
- Resolved on 2026-11-18. Added a persistent workspace with a collapsible outline, focused restaurant/section/subsection/dish forms, Content/Customize retention, independent desktop scroll areas, fit/zoom, mobile edit/preview switching, and a persistent save control. Existing fields, uploads, AI-draft controls, sample loading, export, sharing, and history were retained.
- Saving now compares current content with the last successful publication. A failure retains edits and offers retry; an in-flight response preserves newer edits and reconciles canonical server identity across undo snapshots. Done and zoom do not publish.
- Verification passed: TypeScript, production build, and the full 13-test suite (7 DOM workspace tests, 4 template tests, 2 HTTP integration tests). Added jsdom as a development-only dependency for real component interaction checks. Failing-first checks covered the new workspace and a late-save identity regression; focused checks were run during implementation.
- Browser demonstration with disposable data passed desktop and 390px mobile flows: expand a section, edit a dish price, switch Content/Customize, use Done/reopen, undo/redo, toggle mobile preview, save, and reopen the menu. Public price stayed at 80 while editing 88, changed to 88 only on Save, then stayed at 88 while editing 89 on mobile and changed only on the next Save. Public identity remained stable.
- Browser geometry verified independent editor/preview scrolling, no horizontal overflow in Fit width or the page, and deliberate contained panning at 125% zoom. Desktop/mobile browser logs contained no errors. Screenshots are retained with this effort's evidence.
- Review fixes: restored the mobile public-menu link; movement now follows displayed subsection neighbors; grouped drops update membership/order in one undoable change; focus follows moved dishes and falls back to a surviving outline target after deletion. Added regression checks and both review axes confirmed no remaining blockers.
- Maintenance note: the retained MenuBuilder mutation/form bundle remains large; further focused-form/action extraction is an optional follow-up. Preview remains a web composition, with print pagination, richer image controls, and preview-to-editor selection reserved for their approved tickets.
