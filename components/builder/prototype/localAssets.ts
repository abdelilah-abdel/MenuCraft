import culinaryCatalog from '../../../public/library/culinary/catalog.json';

const culinaryGroups: Record<string, string> = {
  ingredients: 'Ingredients',
  produce: 'Produce & fruit',
  staples: 'Pantry',
  utensils: 'Utensils',
  cookware: 'Cookware',
  appliances: 'Kitchen gear',
};

const culinaryAssets = culinaryCatalog.map((asset) => ({
  id: `culinary-${asset.id}`,
  name: asset.alt.en,
  group: culinaryGroups[asset.category] || 'Kitchen',
  src: `/library/culinary/png/${asset.id}.png`,
  tags: `${asset.id.replaceAll('_', ' ')} ${asset.category}`,
  creator: 'Cosmin Trică',
  sourceUrl: 'https://github.com/cosmintrica/culinary-assets',
  license: 'CC0-1.0',
  licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
}));

const openclipartEntries = [
  ['sandwich-spot', 'Sandwich · vintage spot drawing', 'Sandwiches', 'johnny_automatic', '8723'],
  ['sandwich-color', 'Sandwich · deli illustration', 'Sandwiches', 'gnokii', '150769'],
  ['tramezzino', 'Tramezzino · layered sandwich', 'Sandwiches', 'pnijjar', '194414'],
  ['sandwich-and-drink', 'Sandwich and orange drink', 'Sandwiches', 'j4p4n', '297570'],
  ['triple-sandwich', 'Triple sandwich', 'Sandwiches', 'jonathan357', '306500'],
  ['sandwich-friends', 'Four sandwich friends', 'Sandwiches', 'j4p4n', '355295'],
  ['sandwich-ink', 'Sandwich · black ink', 'Sandwiches', 'johnny_automatic', '261932'],
  ['fruit-repeat', 'Seamless fruit pattern', 'Patterns', 'GDJ', '236670'],
  ['sandwich-one', 'Sandwich · colored drawing', 'Sandwiches', 'jean_victor_balin', '17052'],
  ['hamburger-exploded', 'Exploded hamburger', 'Burgers', 'j4p4n', '309325'],
  ['hamburger-simple', 'Hamburger · simple drawing', 'Burgers', 'rdevries', '219732'],
  ['hamburger-spot', 'Hamburger · vintage spot drawing', 'Burgers', 'johnny_automatic', '8713'],
  ['cheeseburger', 'Cheeseburger', 'Burgers', 'cwleonard', '196148'],
  ['hamburger-pieces', 'Hamburger pieces', 'Burgers', 'studio_hades', '158191'],
  ['hamburger-cartoon', 'Hamburger · cartoon', 'Burgers', 'Machovka', '2567'],
  ['hamburger-ready', 'Hamburger · assembled', 'Burgers', 'j4p4n', '309327'],
  ['hamburger-2014', 'Hamburger · vintage drawing', 'Burgers', 'agomjo', '191700'],
  ['hamburger-garden', 'Hamburger with vegetables', 'Burgers', 'ChihuahuaDesign', '293545'],
  ['cafe-line-art', 'Café line art collection', 'Café & bakery', 'Modanung', '351319'],
  ['food-repeat', 'Seamless food pattern', 'Patterns', 'liftarn', '331226'],
] as const;

const openclipartAssets = openclipartEntries.map(([id, name, group, creator, sourceId]) => ({
  id: `openclipart-${id}`,
  name,
  group,
  src: `/library/openclipart/${id}.png`,
  tags: `${name} ${group} illustration drawing` .toLowerCase(),
  creator,
  sourceUrl: `https://openclipart.org/detail/${sourceId}`,
  license: 'Public domain · CC0',
  licenseUrl: 'https://openclipart.org/faq',
}));

const sandwichPreviewAssets = [
  { id: 'sandwich-print-png', name: 'Submarine sandwich · textured print', group: 'Sandwich illustrations', src: '/library/submarine/sandwich-print.png', tags: 'submarine sandwich baguette exploded ingredient textured print', creator: 'Generated for MenuCraft from the user reference', sourceUrl: '', licenseUrl: '', license: 'Project-generated artwork' },
  { id: 'sandwich-flat-png', name: 'Submarine sandwich · flat vector preview', group: 'Sandwich illustrations', src: '/library/submarine/sandwich-flat.png', tags: 'submarine sandwich baguette exploded ingredient flat vector', creator: 'Generated for MenuCraft from the user reference', sourceUrl: '', licenseUrl: '', license: 'Project-generated artwork' },
  { id: 'sandwich-sticker-png', name: 'Submarine sandwich · sticker preview', group: 'Sandwich illustrations', src: '/library/submarine/sandwich-sticker.png', tags: 'submarine sandwich baguette exploded ingredient sticker', creator: 'Generated for MenuCraft from the user reference', sourceUrl: '', licenseUrl: '', license: 'Project-generated artwork' },
];
const submarinePrintLayerNames = [
  ['top-baguette', 'Submarine · top baguette · print'],
  ['lettuce', 'Submarine · lettuce · print'],
  ['paprika', 'Submarine · paprika · print'],
  ['cucumber', 'Submarine · cucumber · print'],
  ['salami', 'Submarine · salami · print'],
  ['ham', 'Submarine · ham · print'],
  ['cheese', 'Submarine · cheese · print'],
  ['sauce', 'Submarine · sauce · print'],
  ['bottom-baguette', 'Submarine · bottom baguette · print'],
].map(([id, name]) => ({
  id: `submarine-print-${id}`,
  name,
  group: 'Sandwich illustrations',
  src: `/library/submarine/print-layers/${id}.png`,
  tags: `${name.replaceAll(' · ', ' ')} separate textured ingredient`,
  creator: 'Generated for MenuCraft from the user reference',
  sourceUrl: '',
  licenseUrl: '',
  license: 'Project-generated artwork',
}));
export const canvasLocalIllustrations = [...culinaryAssets, ...openclipartAssets, ...sandwichPreviewAssets, ...submarinePrintLayerNames];

export const canvasVectorIllustrations = [
  { id: 'vector-coffee-cup', name: 'Coffee cup · vintage ink', group: 'Coffee & café', src: '/library/vectors/coffee-cup.svg', colors: ['#414a41', '#535e53', '#616b61', '#6a736a'], creator: 'barrettward', sourceId: '193527' },
  { id: 'vector-coffee-steam', name: 'Coffee cup · steam sketch', group: 'Coffee & café', src: '/library/vectors/coffee-steam.svg', colors: ['#666666', '#ffffff', '#f5f5f5', '#f2f2f2'], creator: 'sl4yerPL', sourceId: '10763' },
  { id: 'vector-pizza-slice', name: 'Pizza slice · hand drawn', group: 'Pizza & mains', src: '/library/vectors/pizza-slice.svg', colors: ['#782121', '#501616', '#fbddad', '#c77c41'], creator: 'gnokii', sourceId: '150637' },
  { id: 'vector-cocktail-glass', name: 'Cocktail glass · colored', group: 'Drinks & bar', src: '/library/vectors/cocktail-glass.svg', colors: ['#ffffff', '#d7d7d7', '#b3b3b3', '#fe3600'], creator: 'obitwo', sourceId: '242783' },
  { id: 'vector-croissant', name: 'Croissant · outline', group: 'Bakery & sweets', src: '/library/vectors/croissant.svg', colors: ['#ffffff', '#666666', '#dfbf88', '#eddab9'], creator: 'j4p4n', sourceId: '296490' },
  { id: 'vector-ice-cream', name: 'Chocolate ice cream', group: 'Bakery & sweets', src: '/library/vectors/ice-cream.svg', colors: ['#000000', '#f4d181', '#d8ab4b', '#502d16'], creator: 'gnokii', sourceId: '149545' },
  { id: 'vector-burger-exploded', name: 'Exploded burger · layers', group: 'Sandwiches & burgers', src: '/library/vectors/burger-exploded.svg', colors: ['#ffffff', '#666666', '#000000', '#e6e6e6'], creator: 'j4p4n', sourceId: '309325' },
  { id: 'vector-burger-assembled', name: 'Burger · assembled', group: 'Sandwiches & burgers', src: '/library/vectors/burger-assembled.svg', colors: ['#ffffff', '#666666', '#cccccc', '#c66f19'], creator: 'j4p4n', sourceId: '309327' },
  { id: 'vector-sandwich-color', name: 'Sandwich · deli style', group: 'Sandwiches & burgers', src: '/library/vectors/sandwich-color.svg', colors: ['#f9a429', '#fdedc0', '#efbb61', '#ffeeaa'], creator: 'gnokii', sourceId: '150769' },
  { id: 'vector-cafe-line-art', name: 'Café · tableware collection', group: 'Coffee & café', src: '/library/vectors/cafe-line-art.svg', colors: ['#505050', '#eeeeee', '#000000'], creator: 'Modanung', sourceId: '351319' },
  { id: 'vector-croissant-sketch', name: 'Croissant · contour sketch', group: 'Bakery & sweets', src: '/library/vectors/croissant-sketch.svg', colors: ['#ce5c00'], creator: 'hextrust', sourceId: '48187' },
  { id: 'vector-croissant-golden', name: 'Croissant · golden sticker', group: 'Bakery & sweets', src: '/library/vectors/croissant-golden.svg', colors: ['#aa310c', '#e46e24', '#eeac3c', '#da5f1e'], creator: 'oksmith', sourceId: '297778' },
  { id: 'vector-icecream-outline', name: 'Ice cream · line illustration', group: 'Bakery & sweets', src: '/library/vectors/icecream-outline.svg', colors: ['#666666', '#ffffff', '#000000'], creator: 'jean_victor_balin', sourceId: '17008' },
  { id: 'vector-burger-exploded-cartoon', name: 'Exploded burger · colorful layers', group: 'Sandwiches & burgers', src: '/library/vectors/burger-exploded-cartoon.svg', colors: ['#a4240a', '#981709', '#b7160c', '#e2451a'], creator: 'Schade', sourceId: '327478' },
  { id: 'vector-sandwich-layers', name: 'Layered sandwich · editable drawing', group: 'Sandwiches & burgers', src: '/library/vectors/sandwich-layers.svg', colors: ['#666666', '#ffffff', '#ffbf00', '#ffe79e'], creator: 'pnijjar', sourceId: '194414' },
  { id: 'vector-sandwich-ink', name: 'Sandwich · black ink', group: 'Sandwiches & burgers', src: '/library/vectors/sandwich-ink.svg', colors: ['#666666', '#ffffff', '#000000'], creator: 'jean_victor_balin', sourceId: '17053' },
  { id: 'submarine-flat-vector', name: 'Submarine sandwich · recolorable SVG', group: 'Sandwich illustrations', src: '/library/submarine/submarine-sandwich.svg', colors: ['#fff0df', '#b43825', '#e7b995', '#e2a73d'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated vector artwork' },
  { id: 'submarine-part-top-baguette', name: 'Submarine · top baguette layer', group: 'Sandwich illustrations', src: '/library/submarine/vector-layers/top-baguette.svg', colors: ['#fff0df', '#b43825', '#e7b995'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated vector artwork' },
  { id: 'submarine-part-lettuce', name: 'Submarine · lettuce layer', group: 'Sandwich illustrations', src: '/library/submarine/vector-layers/lettuce.svg', colors: ['#496849', '#b43825', '#fff0df', '#e7b995'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated vector artwork' },
  { id: 'submarine-part-paprika', name: 'Submarine · paprika layer', group: 'Sandwich illustrations', src: '/library/submarine/vector-layers/paprika.svg', colors: ['#b43825', '#e2a73d', '#fff0df'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated vector artwork' },
  { id: 'submarine-part-cucumber', name: 'Submarine · cucumber layer', group: 'Sandwich illustrations', src: '/library/submarine/vector-layers/cucumber.svg', colors: ['#496849', '#b43825', '#fff0df', '#e2a73d'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated vector artwork' },
  { id: 'submarine-part-salami', name: 'Submarine · salami layer', group: 'Sandwich illustrations', src: '/library/submarine/vector-layers/salami.svg', colors: ['#b43825', '#8d2a1b', '#fff0df'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated vector artwork' },
  { id: 'submarine-part-ham', name: 'Submarine · ham layer', group: 'Sandwich illustrations', src: '/library/submarine/vector-layers/ham.svg', colors: ['#fff0df', '#b43825', '#e7b995'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated vector artwork' },
  { id: 'submarine-part-cheese', name: 'Submarine · cheese layer', group: 'Sandwich illustrations', src: '/library/submarine/vector-layers/cheese.svg', colors: ['#e2a73d', '#b43825', '#fff0df'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated vector artwork' },
  { id: 'submarine-part-sauce', name: 'Submarine · sauce layer', group: 'Sandwich illustrations', src: '/library/submarine/vector-layers/sauce.svg', colors: ['#b43825', '#e25a37'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated vector artwork' },
  { id: 'submarine-part-bottom-baguette', name: 'Submarine · bottom baguette layer', group: 'Sandwich illustrations', src: '/library/submarine/vector-layers/bottom-baguette.svg', colors: ['#fff0df', '#b43825', '#e7b995', '#e2a73d'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated vector artwork' },
  { id: 'darinol-black-coffee', name: 'Darinol · hot coffee cup', group: 'Coffee & café', src: '/library/darinol/black-coffee.svg', colors: ['#4b2e23'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated SVG artwork' },
  { id: 'darinol-milk-coffee', name: 'Darinol · iced coffee cup', group: 'Coffee & café', src: '/library/darinol/milk-coffee.svg', colors: ['#4b2e23'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated SVG artwork' },
  { id: 'darinol-non-coffee', name: 'Darinol · ceramic cup', group: 'Coffee & café', src: '/library/darinol/non-coffee.svg', colors: ['#4b2e23'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated SVG artwork' },
  { id: 'darinol-footer-flourish', name: 'Darinol · footer flourish', group: 'Coffee & café', src: '/library/darinol/footer-flourish.svg', colors: ['#4b2e23'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated SVG artwork' },
  { id: 'darinol-instagram', name: 'Darinol · Instagram mark', group: 'Coffee & café', src: '/library/darinol/instagram.svg', colors: ['#4b2e23'], creator: 'Generated for MenuCraft from the user reference', license: 'Project-generated SVG artwork' },
] as const;
export const canvasIllustrationGroups = [
  'Ingredients', 'Produce & fruit', 'Pantry', 'Sandwiches', 'Burgers',
  'Café & bakery', 'Sandwich illustrations', 'Patterns', 'Utensils', 'Cookware', 'Kitchen gear',
] as const;

export const canvasBackgrounds = [
  { name: 'Garden checkerboard', src: '/library/backgrounds/garden-checker.png', swatch: '#214c3d', size: 'cover' },
  { name: 'Cherry checkerboard', src: '/library/backgrounds/cherry-checker.png', swatch: '#a90028', size: 'cover' },
  { name: 'Navy & orange waves', src: '/library/backgrounds/navy-orange-waves.png', swatch: '#164a67', size: 'cover' },
  { name: 'Chili stripes', src: '/library/backgrounds/chili-stripes.png', swatch: '#1c8a68', size: 'cover' },
  { name: 'Pepper grid', src: '/library/backgrounds/pepper-grid.png', swatch: '#70701a', size: 'cover' },
  { name: 'Lemon cobalt checker', src: '/library/backgrounds/lemon-cobalt-checker.png', swatch: '#104975', size: 'cover' },
  { name: 'Tomato gingham', src: '/library/backgrounds/tomato-gingham.png', swatch: '#9b2423', size: 'cover' },
  { name: 'Submarine menu paper', src: '/library/backgrounds/submarine-paper.png', swatch: '#f9ead5', size: 'cover' },
  { name: 'Darinol clipboard paper', src: '/library/darinol/clipboard-board.png', swatch: '#eee4d0', size: 'cover' },
  { name: 'Food pattern', src: '/library/openclipart/food-repeat.png', swatch: '#f5eedf', size: 'cover' },
] as const;
