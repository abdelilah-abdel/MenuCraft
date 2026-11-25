# Local illustration and background library

The canvas uses locally bundled media. Nothing in these collections is fetched from a remote image API at runtime.

## Raster artwork

- `culinary/png/`: 200 transparent culinary PNGs from [Culinary Assets v0.5.0](https://github.com/cosmintrica/culinary-assets/tree/v0.5.0). Includes produce, ingredients, pantry items, utensils, cookware and kitchen equipment. The source project dedicates its artwork and asset metadata under CC0 1.0; its notice records that the illustrations were generated with AI.
- `openclipart/`: 20 PNGs from individual Openclipart artwork IDs. Openclipart releases the submitted artwork into the public domain; creator and source pages are cataloged in `components/builder/prototype/localAssets.ts`.

## Editable vector illustrations

`vectors/*.svg` contains the original Openclipart SVG files. Their source artwork is public domain / CC0 under the [Openclipart FAQ](https://openclipart.org/faq). The in-editor renderer strips active content, external links and unsafe references before rendering. The inspector can recolor up to four source color groups while retaining the paths, line work, shading and cutouts. Asset source pages:

- Coffee cups: [193527](https://openclipart.org/detail/193527), [10763](https://openclipart.org/detail/10763)
- Pizza: [150637](https://openclipart.org/detail/150637)
- Cocktail: [242783](https://openclipart.org/detail/242783)
- Croissants: [296490](https://openclipart.org/detail/296490), [48187](https://openclipart.org/detail/48187), [297778](https://openclipart.org/detail/297778)
- Ice cream: [149545](https://openclipart.org/detail/149545), [17008](https://openclipart.org/detail/17008)
- Burgers: [309325](https://openclipart.org/detail/309325), [309327](https://openclipart.org/detail/309327), [327478](https://openclipart.org/detail/327478)
- Sandwiches: [150769](https://openclipart.org/detail/150769), [194414](https://openclipart.org/detail/194414), [17053](https://openclipart.org/detail/17053)
- Café line art: [351319](https://openclipart.org/detail/351319)

## Backgrounds

- `backgrounds/garden-checker.png` and `backgrounds/cherry-checker.png` were supplied by the user in an earlier turn.
- `backgrounds/navy-orange-waves.png`, `chili-stripes.png`, `pepper-grid.png`, `lemon-cobalt-checker.png`, and `tomato-gingham.png` are the user's supplied image files copied as-is.
- `backgrounds/submarine-paper.png` is a project-generated warm cream paper texture made to match the new submarine menu study.
- `openclipart/food-repeat.png` is a public-domain pattern available both as a decorative asset and a page background.

## Submarine sandwich proof set

`submarine/` contains three alternatives built from the user's exploded sandwich reference and surfaced as three complete MenuCraft starters:

- `sandwich-print.png`, `sandwich-flat.png`, and `sandwich-sticker.png` are transparent PNG previews. The print version is used by **Submarine · print PNG**.
- `submarine-sandwich.svg` is a locally authored, recolorable vector composition used by **Submarine · recolorable SVG**. Its ingredient groups are preserved in the SVG source.
- `print-layers/*.png` contains nine separate transparent print-style ingredient cutouts (top and bottom baguette, lettuce, paprika, cucumber, salami, ham, cheese, sauce). **Submarine · print ingredient layers** places each as its own canvas layer, so users can move and resize the parts while keeping the stipple and ink texture. These raster pieces preserve the print look and are not individually recolorable.
- `vector-layers/*.svg` remains available in the illustration library for users who prefer individually recolorable vector parts.

All three starters use the same independently editable menu title, recipe list, labels and leader lines with the generated paper texture. The print, flat and sticker previews and nine print ingredient cutouts are listed in the local PNG artwork collection; the SVG artwork and vector ingredient parts are in the editable vector collection.

The Pasta Club, Sandwich Studio and Burger House starters are editable compositions built from menu text, dish data, shapes, images and SVG layers. The submarine sandwich starters are editable compositions built from this user's reference. They do not flatten the supplied menu reference images into the designs. Canva screenshots in the user references serve as visual direction; no Canva premium assets were copied.

## Darinol clipboard café

`darinol/clipboard-board.png` is a generated, text-free clipboard and warm paper background derived from the user's reference. The Darinol café starter rebuilds the brand name, menu title, section headings, each menu item, every price, rules, footer mark and social handle as individual canvas elements. Three simple coffee cup drawings, the flourish and Instagram mark are independent recolorable SVG layers in `darinol/`.

The older hand-drawn demo SVG illustrations were removed. The new vector artwork is sourced original media, not traced or hand-redrawn copies.
