# 01: Build Atlas Simple from reusable menu blocks

**Status:** resolved

**Blocked by:** None (can start immediately).

**What to build:** A Restaurant Owner can select Atlas Simple, preview their menu, save it, and view it at its existing public URL using a composition of reusable menu blocks. One validated template definition supplies the composition and registration while the other six templates retain their current renderers.

## Acceptance criteria

- [x] Represent the restaurant header, sections/subsections, and dish rows as reusable components bound to structured Menu data; the composition does not contain a duplicate copy of dishes or prices.
- [x] Use one template registry to determine available IDs, gallery discovery, renderer selection, and server-side save validation. Registering a configuration-only preset does not require another hardcoded gallery or rendering allowlist.
- [x] Validate template definitions and references. Invalid definitions and unknown IDs produce clear failures without silently publishing another design or overwriting an existing menu.
- [x] Demonstrate Atlas Simple through selection, Live Preview, save, reload, and public rendering with the same restaurant, section, dish, and price.
- [x] Keep all seven existing template IDs valid. Existing saved menus, explicit customization values, owner associations, and public URLs remain readable and unchanged.
- [x] Introduce optional design fields additively with safe defaults; retain the six legacy rendering paths until their individual migration tickets land.

## Demonstration

Open an existing menu, choose Atlas Simple, save it, and open its public URL. Register a temporary fixture preset through the definition alone and verify discovery and rendering; an invalid ID must not replace the saved design.

## Delivery requirements

- Include the model, API/persistence, renderer, and editing changes needed for this delivery; use additive defaults for existing JSON-backed menus.
- Preserve structured content independently from design settings. Live Preview reflects unsaved edits; only a successful explicit save updates the Published Menu.
- Run focused behavior checks, TypeScript, and the build. Check affected desktop/mobile rendering and record actual outcomes and limitations in the project handoff.

## Comments

- Approved by the owner on 2026-11-17 as part of the revised 21-ticket template-engine and editor plan. Implementation has not started.
- Claimed on 2026-11-17 through `/implement`. Agreed verification boundaries are template registration/rendering and authenticated menu save/reload/public access, as specified by this ticket's acceptance criteria and demonstration.
- Resolved on 2026-11-18. Atlas Simple now declares a validated composition of reusable blocks; the same registry drives template types, gallery discovery, renderer dispatch, and server save validation. The six legacy rendering components were preserved unchanged, and the saved Menu shape did not change.
- Verification: four registry/rendering checks plus two HTTP integration checks pass in the full six-test suite; TypeScript and production build pass. Invalid definitions/references and unknown IDs are rejected, including attempts to replace an existing published menu with an unknown design.
- Browser demonstration used a disposable owner and isolated data directory: selected Atlas Simple, edited a restaurant/section/dish/price, saved, reloaded the builder, and checked the public menu. Public rendering at 1440×900 and 390×844 and mobile builder preview passed without runtime errors or horizontal overflow. Desktop/mobile screenshots are retained with this effort's evidence.
- Standards and spec reviews found no blocking issues. Addressed the optional standards finding by deriving runtime allowed-value checks and TypeScript unions from shared constant lists.
- Remaining milestones: the outline/detail editor and complete content rendering are tickets 02 and 06, now unblocked. Atlas theme overrides, broader content fidelity, PDF/print qualification, and full Arabic typography remain their approved later work.
