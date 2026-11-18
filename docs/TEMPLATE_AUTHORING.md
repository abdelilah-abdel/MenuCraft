# Composing a template preset

`lib/templates/config.ts` is the registry for discovery, save validation, renderer selection, examples, capabilities and output declarations. Atlas Simple and Atlas Market are working examples of configurable presets. New presets do not need a page-wide component, gallery entry or API allowlist.

1. Add a definition with a unique stable ID and `renderer: 'configurable'`.
2. Compose `restaurant-header` and `menu-sections` in the intended order. Choose the theme and layout, including default section columns, heading rules, price leaders and corner radius.
3. Declare permitted Component Styles, section regions/columns/spacing/alignment and image placements. The first dish/section photo placement is the default when the owner has no explicit supported choice. The restaurant header remains full width.
4. Set `example.source` to an existing structured content collection from `sampleContent.ts`, with a representative restaurant name and description. Add a curated collection there only when the existing examples are unsuitable. This is content data, not a template ID allowlist. Keep examples clearly marked and separate from owner state.
5. List intended `formats`. Start `verifiedFormats` empty. Add a format only after checking its actual output; current WEB/MOBILE entries mean browser rendering checks, not PDF, Arabic typography, TV or print qualification. The gallery labels remaining formats as planned.
6. Check `/templates/<id>/preview` at desktop/mobile sizes, long/missing content, photos and no-photo cases, then apply it to an existing owner menu. Check unsaved preview, explicit save, public output, compatibility notices and Undo/Redo. Run TypeScript, build and relevant tests. Record evidence and limits in `PROJECT_STATUS.md`.

Gallery thumbnails load the real example route at an 800px viewport and show its top portion. “View full example” opens the complete responsive rendering. The iframe has loading/error/retry feedback and is removed from keyboard navigation; named links and buttons provide the gallery actions.

Using a design changes only the template ID. Loading its example is a separate replacement action, retaining restaurant information and design choices, with confirmation for existing sections and one history step. Unsupported saved design choices remain recoverable; sample replacement prunes placements that reference replaced sections.

Legacy designs retain their adapters until individually migrated. Preserve their IDs, content and visual behavior; do not replace them as a side effect of adding a preset.
