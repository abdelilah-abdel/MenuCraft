---
name: menu-template-from-reference
description: Build an editable restaurant menu template from a user-provided visual reference, preserving its art direction while separating content and artwork into useful canvas layers.
---

# Build a menu template from a reference

Use this skill when the user gives a menu image or design and wants a similar editable menu/template. Treat the image as visual direction and source material, not as a finished page to place unchanged in the canvas.

## Workflow

1. **Inspect the reference.** Identify page size and orientation, background or paper texture, palette, type styles, hierarchy, artwork, captions, labels, and alignment. Separate information that should remain editable (titles, dish names, descriptions, prices, callouts) from decorative artwork.
2. **Choose an asset treatment that matches the art.** Keep painterly, stippled, photographic, or print-textured artwork raster when that preserves its look. Use transparent PNG layers for subjects that need to move independently. Use SVG when the source is clean line art or flat color and recoloring is useful. Do not simplify textured artwork into crude SVG shapes just to call it editable. If the user requests multiple output types, make alternatives and let them choose.
3. **Separate the artwork.** Preserve each meaningful subject as its own file and canvas element. Name layers so users can identify them (for example, “Top baguette · print”, “Lettuce · print”). Prefer extracting/cutting out the actual subject when the supplied image allows it; if reconstruction is needed, use the reference for style and proportions. Keep transparent edges clean and inspect cutouts against a contrasting background to catch halos or leftover matte.
4. **Rebuild the page around editable content.** Recreate the background, colors, typography, headings, descriptions, prices, labels, and leader lines as separate elements. Place and scale artwork in a named, ordered layer stack that matches the reference’s visual rhythm. Keep margins and page dimensions suited to the intended print or screen format.
5. **Add assets and template to the project.** Follow the repository’s existing canvas model, asset catalog, file naming, and licensing/source metadata. Keep user-provided references in their original form; do not overwrite them. Record generated, user-provided, or externally sourced artwork accurately. Do not fetch or copy third-party assets unless the user asked for that.
6. **Open the result in the running canvas when available.** Apply the new template and review its visual composition at a useful zoom. Confirm that the separate pieces appear in the layer list and can be selected independently. If using PNG cutouts, explain that they can move and resize independently but do not have editable vector fills. Make reasonable visual fixes before handing it back.

## Decisions to preserve

- Follow the user’s stated priority when print fidelity and recoloring conflict. For a textured-print preference, use separate textured PNG cutouts rather than a flattened whole-menu image or simplified SVG approximations.
- Keep text and labels editable even when the illustration itself is raster.
- Use a vector format only when its appearance remains faithful and its parts can be meaningfully edited.
- Do not promise exact subject-level color changes for raster images. If recoloring is requested, offer or build a suitable vector alternative while preserving the raster version as the print-faithful option.
- Keep the template’s actual copy and visual features derived from the reference separate from any new sample menu data. Ask only when a missing choice would materially change the result; otherwise make a sensible, reversible choice and state it.

## Hand-off

Briefly state what template was added, which parts are separate and editable, and any format limitation that affects customization. Link the main template/code and asset directory using the project’s normal path conventions. Mention whether the canvas preview was opened and visually reviewed.
