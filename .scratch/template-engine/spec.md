# Template engine and menu editor

Status: approved
Approved: 2026-11-17
Branch at approval: feat/template-engine-roadmap
Tracker: local Markdown; one numbered file per implementation ticket.

## Goal

Let a Restaurant Owner create, arrange, and customize a menu through a simple content outline and focused forms beside a persistent Live Preview. Build restaurant-facing templates from the same reusable menu blocks, image slots, Component Styles, and layout constraints that the owner can customize.

The owner approved the revised 21-ticket proposal in chat after providing two editor screenshots. This plan supersedes the earlier unpublished 12-ticket proposal. The screenshots establish the editing workflow and simplicity target; their personal CV content, visual branding, and AI controls are not menu requirements.

## Sources and precedence

- [Product vision](../../idea.md) defines the studio's product scope.
- [Agreed implementation roadmap](../../docs/IMPLEMENTATION_ROADMAP.md) defines the broader phase order and accepted technology decisions.
- [Project status](../../PROJECT_STATUS.md) records the actual implementation state and this approved handoff.
- The approved conversation expands the immediate template-engine effort to include the editing interactions below. Reuse existing drag-and-drop, history, persistence, and publishing behavior while integrating the engine.

## Starting point

- Owner authentication, one menu per owner, server-side JSON persistence, public menu pages, and QR generation already exist.
- The builder already supports content editing, grouping, images, movement, undo/redo, template selection, and Live Preview.
- Six hand-built template renderers remain: Classic, Modern, Minimal, Medina Café, Moroccan Fine Dining, and Modern Moroccan Garden.
- Atlas Simple is the first configuration-only template. A typed configuration foundation exists, but composition, customization, discovery, and rendering still need the approved work.
- This is an approved plan and ticket publication, not a claim that the new editor or engine has been implemented.

## Agreed user workflow

1. Open Content to see restaurant information, collapsible sections/subsections, and compact dish summaries.
2. Select an entry to edit it in a focused form while the Live Preview stays visible on desktop.
3. Use Done to return to the outline. Done does not publish or discard edits.
4. Add, duplicate, hide, remove, or reorder entries; move dishes between supported groups with dragging or accessible alternatives.
5. Select a visible preview element to reach its corresponding controls. Selection is transient editor state.
6. Open Customize to change menu-wide appearance, reusable Component Styles, image presentation, and supported layout choices.
7. Switch templates while keeping menu content and compatible presentation choices. Loading sample content remains a separate explicit action.
8. Save explicitly to update the Published Menu at its stable URL. Failed saves retain the working edits.

The preview supports independent scrolling, fit-to-width, and zoom without changing the underlying design. Mobile provides an edit/preview switch that preserves working state. Reuse the existing Editor History across views and saves; it remains in-session history rather than durable menu versions.

## Content, templates, and presentation

- Keep structured restaurant, section, subsection, and dish content independent from template composition and owner design overrides.
- A template is a validated preset of reusable header, section/subsection, dish, and image components plus Component Styles and permitted layout regions. It binds to menu content instead of copying that content into a second document tree.
- One registry supplies IDs, metadata, renderer selection, customization capabilities, and supported output declarations. Avoid parallel hardcoded discovery and validation lists.
- Begin with a minimal complete Atlas Simple composition. Expand capabilities in the individual tickets rather than attempting every future studio feature upfront.
- Keep current renderers beside the new form until each migration lands. Preserve existing template IDs, explicit settings, and saved menus through additive normalization and defaults.
- Narrow specialized hooks are allowed to protect a documented art-directed difference. An entire copied legacy renderer is not a completed migration.
- Establish predictable default/override rules: template defaults, explicit menu-wide choices, and reusable component treatments have documented precedence and reset behavior.
- Hidden content remains editable and stored. Availability is distinct: a visible unavailable dish stays on the menu with a sold-out label.
- Content movement preserves canonical grouping/order and stable identities. Region placement belongs to presentation and must not duplicate or lose structured content.

## Images and layout

- Provide distinct dish-photo, restaurant-logo, restaurant-banner, and section-photo slots.
- Store crop/focal-position metadata independently from the source image. Reuse validated upload and crop controls across slots.
- Expose only positions appropriate to a slot and allowed by the selected template: for example dish thumbnails/card-top/text-side, section banner/heading-side, and header logo/banner placements.
- Preserve a deliberate layout with absent, disabled, or failed images. Keep images associated with their stable entry through movement and editing.
- Constrain columns, spacing, alignment, and region placement through template capabilities. Support one/two/three columns only where declared and verified, with intentional mobile collapse.
- Keep print-related layout constraints explicit for the next PDF milestone. Format declarations alone do not prove PDF, A4/A5, TV, or other output readiness.

## Compatibility and boundaries

- Retain one saved menu per owner, owner isolation, stable public menu IDs/URLs, and the current storage deployment assumptions.
- Preserve menu content, grouping, order, pictures, visibility, and Availability during template switches. Explain unsupported design choices and keep the prior state recoverable through undo rather than silently deleting it.
- Keep the application chrome's The Wall direction separate from restaurant template typography and palettes; the screenshots supply workflow inspiration.
- Preserve existing English/French/Arabic source content and direction behavior. Full Arabic font licensing, mixed-script typography, and export qualification remain subject to the roadmap's explicit checks.
- PDF generation/pagination, new library design batches, durable menu versions, database migration, field-level translations, AI/provider work, TV, ordering, and business-platform expansion remain their later milestones.
- Do not fabricate ingredients, allergens, popularity, or other restaurant facts. Use representative example menus separately from owner content.

## Completion requirements

Each ticket is a complete demonstrable behavior and includes the model, API/persistence, rendering, and controls it needs. Apply safe defaults for old data and update project status with actual results and limitations.

- Run focused behavior checks, TypeScript, and build for implementation changes.
- Check affected desktop/mobile layouts, accessible keyboard alternatives, focus, empty/error states, long content, and appropriate reduced-motion behavior.
- Verify Live Preview versus publication, save/reload, and Editor History for affected editing actions.
- For each template migration, compare representative old/new desktop and mobile output and preserve saved template identity and content.
- Claim an output format or language capability only after its specific checks. Publish the truthful remaining limitations.

## Approved ticket index

All tickets begin with Status: ready-for-agent. A ticket can start only once all of its listed blockers are complete; that status does not override blocking edges. During work, record the claim before editing and record the eventual completion/verification in the ticket and project handoff.

| Ticket | Delivery | Blocked by |
|---|---|---|
| [01](issues/01-atlas-reusable-menu-blocks.md) | Build Atlas Simple from reusable menu blocks | None |
| [02](issues/02-outline-and-detail-workspace.md) | Create the outline-and-detail editing workspace | 01 |
| [03](issues/03-preview-selection-to-editing.md) | Connect preview selection to editing | 02 |
| [04](issues/04-menu-entry-lifecycle.md) | Add, duplicate, hide, and remove menu entries | 02 |
| [05](issues/05-move-sections-and-dishes.md) | Move sections and dishes without losing their settings | 02 |
| [06](issues/06-complete-menu-rendering.md) | Render complete menu content consistently | 01 |
| [07](issues/07-dish-photo-controls.md) | Control dish photos | 02 |
| [08](issues/08-restaurant-logo-and-banner.md) | Control the restaurant logo and banner | 07 |
| [09](issues/09-section-photo-slots.md) | Add section photos | 07 |
| [10](issues/10-menu-wide-appearance.md) | Customize the menu's overall appearance | 02 |
| [11](issues/11-reusable-component-styles.md) | Customize reusable Component Styles | 10 |
| [12](issues/12-supported-block-layouts.md) | Arrange blocks within supported layouts | 11 |
| [13](issues/13-safe-template-switching.md) | Switch templates while preserving the menu | 12 |
| [14](issues/14-gallery-and-template-presets.md) | Build gallery previews and new templates from these blocks | 13 |
| [15](issues/15-migrate-classic.md) | Migrate Classic | 06, 07, 13 |
| [16](issues/16-migrate-minimal.md) | Migrate Minimal | 06, 07, 13 |
| [17](issues/17-migrate-modern.md) | Migrate Modern | 06, 07, 13 |
| [18](issues/18-migrate-medina-cafe.md) | Migrate Medina Café | 06, 08, 13 |
| [19](issues/19-migrate-moroccan-fine-dining.md) | Migrate Moroccan Fine Dining | 06, 08, 13 |
| [20](issues/20-migrate-modern-moroccan-garden.md) | Migrate Modern Moroccan Garden | 06, 08, 13 |
| [21](issues/21-retire-legacy-rendering.md) | Retire legacy rendering and document template creation | 03, 04, 05, 09, 14, 15, 16, 17, 18, 19, 20 |

## First frontier and later concurrency

Ticket 01 is the only initial frontier ticket. Once it is complete, 02 and 06 are unblocked. The six template migrations do not block one another and can be selected individually when their own shared-behavior prerequisites are complete. The final cleanup depends on every remaining editor/gallery slice and migration; it is not permission to remove legacy paths early.

## Approval and publication

The owner approved the exact revised titles, scope, and blocking edges with “okay i agree” on 2026-11-17. This approval authorizes publication to the configured local Markdown tracker. It does not mark implementation complete or request commits, pushes, or deployment.
