/** Throwaway canvas model. No production menu or publishing APIs are used. */
import { makeSample, type Crop, type ProofItem } from './compositionData';
export { canvasBackgrounds, canvasIllustrationGroups, canvasLocalIllustrations, canvasVectorIllustrations } from './localAssets';
import { canvasVectorIllustrations } from './localAssets';

export const canvasFonts = [
  { name: 'Anton', family: 'Canvas Condensed', sample: 'BOLD & TALL' },
  { name: 'Shrikhand', family: 'Canvas Display', sample: 'A little character' },
  { name: 'Amatic SC', family: 'Canvas Hand', sample: 'Made by hand' },
  { name: 'Bricolage', family: 'Bricolage Grotesque', sample: 'Fresh every day' },
  { name: 'Georgia', family: 'Georgia', sample: 'The editorial choice' },
  { name: 'Palatino', family: 'Palatino Linotype, Palatino, serif', sample: 'An elegant menu' },
  { name: 'Times', family: 'Times New Roman, serif', sample: 'A classic serif' },
  { name: 'Arial', family: 'Arial, sans-serif', sample: 'Simple & familiar' },
  { name: 'Trebuchet', family: 'Trebuchet MS, sans-serif', sample: 'Warm & welcoming' },
  { name: 'Verdana', family: 'Verdana, sans-serif', sample: 'Clear at a glance' },
  { name: 'Impact', family: 'Impact, sans-serif', sample: 'TODAY’S SPECIAL' },
  { name: 'Courier', family: 'Courier New, monospace', sample: 'BAKED DAILY' },
];

export const canvasFormats = [
  { name: 'A4 · Portrait', w: 794, h: 1123 }, { name: 'A4 · Landscape', w: 1123, h: 794 },
  { name: 'A5 · Portrait', w: 559, h: 794 }, { name: 'Square', w: 1080, h: 1080 },
  { name: 'Social · Portrait', w: 1080, h: 1350 }, { name: 'Story', w: 1080, h: 1920 },
];

export const canvasIcons = [
  'coffee', 'tea', 'matcha', 'sun', 'flower', 'leaf', 'herb', 'olive', 'star', 'fork', 'knife', 'spoon',
  'plate', 'cloche', 'heart', 'sparkle', 'arrow', 'pizza', 'croissant', 'bread', 'baguette', 'donut',
  'cupcake', 'cake', 'cookie', 'burger', 'fries', 'pasta', 'bowl', 'salad', 'fish', 'shrimp', 'chicken',
  'cheese', 'mushroom', 'tomato', 'pepper', 'chili', 'lemon', 'glass', 'wine', 'cocktail', 'location',
  'clock', 'badge', 'check', 'menu', 'flame',
] as const;
export type CanvasIcon = typeof canvasIcons[number];

export const canvasIconGroups: { name: string; icons: readonly CanvasIcon[] }[] = [
  { name: 'Food', icons: ['pizza', 'croissant', 'bread', 'baguette', 'donut', 'cupcake', 'cake', 'cookie', 'burger', 'fries', 'pasta', 'bowl', 'salad', 'fish', 'shrimp', 'chicken', 'cheese', 'mushroom', 'tomato', 'pepper', 'chili', 'lemon'] },
  { name: 'Coffee & bar', icons: ['coffee', 'tea', 'matcha', 'glass', 'wine', 'cocktail'] },
  { name: 'Herbs & garnish', icons: ['leaf', 'herb', 'olive', 'flower', 'sun'] },
  { name: 'Menu marks', icons: ['fork', 'knife', 'spoon', 'plate', 'cloche', 'star', 'heart', 'sparkle', 'arrow', 'location', 'clock', 'badge', 'check', 'menu', 'flame'] },
];

export const canvasShapeGroups = [
  { name: 'Frames & flourishes', shapes: ['rect', 'ellipse', 'line', 'burst', 'wave'] as const },
  { name: '3D objects', shapes: ['cube', 'sphere', 'cylinder', 'cone', 'pyramid', 'ring'] as const },
];
export type CanvasShape = typeof canvasShapeGroups[number]['shapes'][number];

export const canvasTemplates = [
  { id: 'cafe-forest', name: 'Market café', family: 'cafe', theme: 'Forest & citrus', layout: 'cafe', paper: '#ece6cf', ink: '#124f3c', accent: '#e96b27', pattern: '#667558' },
  { id: 'cafe-rose', name: 'Sunday bakery', family: 'cafe', theme: 'Cherry & cream', layout: 'cafe', paper: '#f5e7dc', ink: '#792e2b', accent: '#e55e41', pattern: '#bb7969' },
  { id: 'poster-cobalt', name: 'Cobalt tiles', family: 'poster', theme: 'Cobalt & cream', layout: 'poster', paper: '#f3eddf', ink: '#103e89', accent: '#e56a2f', pattern: '#456da3' },
  { id: 'poster-tomato', name: 'Tomato special', family: 'poster', theme: 'Tomato & butter', layout: 'poster', paper: '#f6e8ce', ink: '#bb321f', accent: '#e55332', pattern: '#d17a5c' },
  { id: 'editorial-olive', name: 'The daily list', family: 'editorial', theme: 'Olive & parchment', layout: 'editorial', paper: '#f5f0df', ink: '#253d30', accent: '#bd6935', pattern: '#98a077' },
  { id: 'editorial-night', name: 'After hours', family: 'editorial', theme: 'Midnight & gold', layout: 'editorial', paper: '#183d37', ink: '#f0e7ca', accent: '#eca553', pattern: '#d3c9a6' },
  { id: 'pasta-poster', name: 'Pasta club', family: 'poster', theme: 'Olive, tomato & paper', layout: 'pasta', paper: '#eee0c3', ink: '#424627', accent: '#ba4e28', pattern: '#d68a4b' },
  { id: 'sandwich-studio', name: 'Sandwich studio', family: 'editorial', theme: 'Handwritten deli board', layout: 'sandwich', paper: '#fbf4e8', ink: '#201f1c', accent: '#b9472e', pattern: '#d3aa78' },
  { id: 'burger-house', name: 'Burger house', family: 'cafe', theme: 'Tomato red & cream', layout: 'burger', paper: '#f3e6d0', ink: '#174e89', accent: '#bb321f', pattern: '#f5bd6a' },
  { id: 'submarine-print', name: 'Submarine · print PNG', family: 'poster', theme: 'Paper & stipple art', layout: 'submarine-print', paper: '#f9ead5', ink: '#b43825', accent: '#e2a73d', pattern: '#e7b995' },
  { id: 'submarine-flat', name: 'Submarine · recolorable SVG', family: 'poster', theme: 'Paper & clean vector', layout: 'submarine-flat', paper: '#f9ead5', ink: '#b43825', accent: '#e2a73d', pattern: '#e7b995' },
  { id: 'submarine-layers', name: 'Submarine · print ingredient layers', family: 'poster', theme: 'Paper & separate print pieces', layout: 'submarine-layers', paper: '#f9ead5', ink: '#b43825', accent: '#e2a73d', pattern: '#e7b995' },
  { id: 'darinol-clipboard', name: 'Darinol · clipboard café', family: 'cafe', theme: 'Coffee & warm paper', layout: 'clipboard-cafe', paper: '#f1e7d5', ink: '#4b2e23', accent: '#9c6d48', pattern: '#c6ab82' },
] as const;
export type CanvasTemplateId = typeof canvasTemplates[number]['id'];

export const canvasFormatsLabel = (w: number, h: number) => `${w} × ${h}`;
export const canvasFormatsOptions = canvasFormats;

export interface CanvasNode {
  id: string; kind: 'text' | 'image' | 'icon' | 'shape' | 'dish' | 'vector'; name: string;
  x: number; y: number; w: number; h: number; rotation: number; opacity: number;
  text?: string; font: string; fontSize: number; bold?: boolean; italic?: boolean; align: 'left' | 'center' | 'right'; tracking: number;
  color: string; fill: string; border: string; borderWidth: number; radius: number;
  shape?: CanvasShape; icon?: CanvasIcon; src?: string; crop?: Crop; dishId?: string; vectorId?: string; vectorColors?: string[];
  backgroundLayer?: boolean;
  sourceUrl?: string; sourceName?: string; creator?: string; license?: string; licenseUrl?: string;
  hidden?: boolean; locked?: boolean; feature?: boolean;
}
export interface CanvasDocument {
  title: string; w: number; h: number; paper: string; pattern: 'plain' | 'grid' | 'dots' | 'stripes' | 'checker'; patternColor: string; backgroundImage?: string;
  elements: CanvasNode[]; items: ProofItem[];
}

export function makeNode(kind: CanvasNode['kind'], change: Partial<CanvasNode> = {}): CanvasNode {
  return { id: crypto.randomUUID(), kind, name: kind, x: 250, y: 300, w: 240, h: 90, rotation: 0, opacity: 100, font: 'Bricolage Grotesque', fontSize: 30, align: 'left', tracking: 0, color: '#114c3d', fill: 'transparent', border: '#114c3d', borderWidth: 0, radius: 0, ...change };
}

export function makeCanvas(starter: CanvasTemplateId | 'blank'): CanvasDocument {
  const template = canvasTemplates.find(value => value.id === starter) || canvasTemplates[0];
  const { ink, accent, paper } = template;
  const doc: CanvasDocument = { title: 'Maison Atlas — menu study', w: 794, h: 1123, paper, pattern: template.layout === 'cafe' ? 'grid' : 'plain', patternColor: template.pattern, elements: [], items: makeSample('food') };
  if (starter === 'blank') return { ...doc, pattern: 'plain', elements: [] };

  const add = (kind: CanvasNode['kind'], change: Partial<CanvasNode>) => {
    const vector = kind === 'vector' ? canvasVectorIllustrations.find(asset => asset.id === change.vectorId) : undefined;
    const vectorSource = vector && 'sourceId' in vector ? vector.sourceId : undefined;
    doc.elements.push(makeNode(kind, {
      id: `${starter}-${doc.elements.length}`,
      ...(vector ? { creator: vector.creator, sourceName: vector.creator, ...(vectorSource ? { sourceUrl: `https://openclipart.org/detail/${vectorSource}`, licenseUrl: 'https://openclipart.org/faq' } : {}), license: 'license' in vector ? vector.license : 'Public domain · CC0' } : {}),
      ...change,
    }));
  };
  if (template.layout === 'clipboard-cafe') {
    const ink = '#4b2e23';
    doc.pattern = 'plain';
    add('image', { name: 'Clipboard board background', x: 0, y: 0, w: doc.w, h: doc.h, src: '/library/darinol/clipboard-board.png', backgroundLayer: true, creator: 'Generated for MenuCraft from the user reference', sourceName: 'Text-free clipboard background', license: 'Project-generated artwork' });
    add('text', { name: 'Coffee brand', text: 'DARINOL COFFEE', x: 252, y: 111, w: 290, h: 30, font: 'Arial', fontSize: 20, bold: true, align: 'center', color: ink, tracking: 2.5 });
    add('shape', { name: 'Brand dash · left', shape: 'line', x: 230, y: 135, w: 26, h: 2, fill: ink, rotation: -8 });
    add('shape', { name: 'Brand dash · right', shape: 'line', x: 538, y: 135, w: 26, h: 2, fill: ink, rotation: 8 });
    add('text', { name: 'Menu title', text: 'MENU', x: 235, y: 148, w: 324, h: 72, font: 'Georgia', fontSize: 58, bold: true, align: 'center', color: ink, tracking: 4 });
    add('shape', { name: 'Double header rule · top', shape: 'line', x: 70, y: 238, w: 654, h: 3, fill: ink });
    add('shape', { name: 'Double header rule · bottom', shape: 'line', x: 70, y: 246, w: 654, h: 2, fill: ink });

    const addVector = (vectorId: string, name: string, x: number, y: number, w: number, h: number) => {
      const asset = canvasVectorIllustrations.find(value => value.id === vectorId)!;
      add('vector', { name, vectorId, vectorColors: [...asset.colors], x, y, w, h });
    };
    const addSection = (title: string, iconId: string, y: number, items: [string, string][], rowStart: number, step: number) => {
      addVector(iconId, `${title} cup illustration`, title === 'BLACK COFFEE' ? 94 : title === 'MILK BASE COFFEE' ? 100 : 97, y - 17, 66, 71);
      add('text', { name: `${title} section heading`, text: title, x: 181, y, w: 490, h: 39, font: 'Georgia', fontSize: 27, bold: true, color: ink, tracking: .4 });
      add('shape', { name: `${title} section rule`, shape: 'line', x: 153, y: y + 43, w: 540, h: 1.5, fill: ink });
      items.forEach(([name, price], index) => {
        const rowY = rowStart + index * step;
        add('text', { name: `${title} · ${name}`, text: name, x: 145, y: rowY, w: 430, h: 30, font: 'Courier New', fontSize: 23, color: ink, tracking: .45 });
        add('text', { name: `${title} · ${name} · price`, text: price, x: 576, y: rowY, w: 48, h: 30, font: 'Courier New', fontSize: 23, color: ink, align: 'right' });
      });
    };
    addSection('BLACK COFFEE', 'darinol-black-coffee', 269, [
      ['AMERICANO', '15k'], ['V60', '20k'], ['JAPANESE', '20k'],
    ], 328, 35);
    addSection('MILK BASE COFFEE', 'darinol-milk-coffee', 463, [
      ['LATTE', '17k'], ['PISTACHIO LATTE', '23k'], ['STRAWBERRY LATTE', '25k'],
      ['KOPI SUSU GULA AREN', '20k'], ['ENGLISHMAN IN NEW YORK', '23k'], ['MOCCACHINO', '25k'],
    ], 523, 35);
    addSection('NON COFFEE', 'darinol-non-coffee', 751, [
      ['MATCHA', '25k'], ['CHOCOLATE', '23k'], ['PISTACHIO MILK', '17k'],
      ['STRAWBERRY MILK', '20k'], ['AREN MILK', '15k'],
    ], 811, 35);
    addVector('darinol-footer-flourish', 'Footer flourish', 317, 982, 160, 40);
    addVector('darinol-instagram', 'Instagram icon', 281, 1020, 26, 26);
    add('text', { name: 'Instagram handle', text: 'darinolcoffeeroasters', x: 314, y: 1023, w: 263, h: 25, font: 'Arial', fontSize: 14, color: ink, tracking: .35 });
    return doc;
  }
  if (template.layout.startsWith('submarine-')) {
    doc.pattern = 'plain';
    add('image', { name: 'Submarine paper background', x: 0, y: 0, w: doc.w, h: doc.h, src: '/library/backgrounds/submarine-paper.png', backgroundLayer: true });
    add('text', { name: 'Menu title', text: 'SUBMARINE\nSANDWICH', x: 68, y: 54, w: 300, h: 79, font: 'Arial', fontSize: 25, bold: true, color: ink, tracking: .3 });
    add('text', { name: 'Recipe heading', text: 'RECIPE:', x: 71, y: 145, w: 175, h: 31, font: 'Arial', fontSize: 18, bold: true, color: ink });
    add('text', { name: 'Recipe ingredients', text: '· Baguette\n· Sliced lettuce\n· Sliced paprika\n· Sliced cucumber\n· Salami\n· Sliced ham\n· Sliced cheese\n· Sauce', x: 71, y: 179, w: 154, h: 166, font: 'Georgia', fontSize: 12, color: '#94513c', tracking: .1 });
    const callouts: [string, number][] = [
      ['Baguette', 384], ['Sliced lettuce', 463], ['Sliced paprika', 529], ['Sliced cucumber', 595],
      ['Salami', 662], ['Sliced ham', 730], ['Sliced cheese', 800], ['Sauce', 871], ['Baguette', 956],
    ];
    for (const [label, y] of callouts) {
      add('text', { name: `${label} label`, text: label, x: 53, y: Number(y), w: 145, h: 23, font: 'Arial', fontSize: 12, bold: true, color: ink });
      add('shape', { name: `${label} leader`, shape: 'line', x: 154, y: Number(y) + 11, w: 94, h: 2, fill: ink });
    }
    if (template.layout === 'submarine-print') {
      add('image', { name: 'Exploded sandwich · textured PNG', x: 239, y: 284, w: 520, h: 652, src: '/library/submarine/sandwich-print.png', radius: 0, creator: 'Generated for MenuCraft from the user reference', sourceName: 'MenuCraft generated art', license: 'Project-generated artwork' });
    } else if (template.layout === 'submarine-flat') {
      const asset = canvasVectorIllustrations.find(value => value.id === 'submarine-flat-vector')!;
      add('vector', { name: 'Exploded sandwich · recolorable SVG', vectorId: asset.id, vectorColors: [...asset.colors], x: 292, y: 195, w: 450, h: 855 });
    } else {
      const placements: [string, string, number, number][] = [
        ['top-baguette', 'Top baguette · print', 395, 235], ['lettuce', 'Lettuce · print', 474, 219],
        ['paprika', 'Paprika · print', 540, 204], ['cucumber', 'Cucumber · print', 606, 199],
        ['salami', 'Salami · print', 673, 210], ['ham', 'Ham · print', 741, 182],
        ['cheese', 'Cheese · print', 811, 233], ['sauce', 'Sauce · print', 882, 166],
        ['bottom-baguette', 'Bottom baguette · print', 967, 217],
      ];
      for (const [partId, name, centerY, h] of placements) {
        add('image', {
          name,
          x: 282,
          y: centerY - h / 2,
          w: 430,
          h,
          src: `/library/submarine/print-layers/${partId}.png`,
          creator: 'Generated for MenuCraft from the user reference',
          sourceName: 'MenuCraft generated print ingredient',
          license: 'Project-generated artwork',
        });
      }
    }
    add('text', { name: 'Footer note', text: 'BAKED FRESH  ·  MADE TO ORDER', x: 63, y: 1063, w: 335, h: 24, font: 'Courier New', fontSize: 11, color: ink, tracking: .6 });
    return doc;
  }
  if (template.layout === 'pasta') {
    doc.pattern = 'plain';
    add('shape', { name: 'Olive pasta field', x: 0, y: 0, w: 794, h: 365, fill: ink });
    add('text', { name: 'Good food note', text: 'GOOD FOOD  /  GOOD MOOD', x: 535, y: 36, w: 225, h: 78, font: 'Canvas Condensed', fontSize: 25, align: 'right', color: paper, tracking: 1 });
    add('text', { name: 'Pasta title', text: 'PASTA', x: 37, y: 28, w: 550, h: 205, font: 'Canvas Condensed', fontSize: 154, color: accent });
    add('shape', { name: 'Al dente badge', shape: 'burst', x: 45, y: 235, w: 135, h: 120, fill: accent, rotation: -8 });
    add('text', { name: 'Al dente lettering', text: 'AL DENTE\nBABY', x: 55, y: 265, w: 115, h: 56, font: 'Canvas Condensed', fontSize: 24, bold: true, align: 'center', color: paper, rotation: -8 });
    add('dish', { name: 'Featured pasta', dishId: doc.items[4].id, x: 235, y: 240, w: 515, h: 100, font: 'Georgia', fontSize: 25, color: paper, feature: true });
    add('shape', { name: 'Tomato ribbon', shape: 'wave', x: 0, y: 395, w: 794, h: 65, fill: accent, opacity: 72 });
    add('image', { name: 'Pasta photograph', x: 75, y: 485, w: 645, h: 390, crop: doc.items[4].photo, radius: 150 });
    add('text', { name: 'Pasta story', text: 'SLOW SAUCE.\nGOOD COMPANY.', x: 64, y: 875, w: 400, h: 120, font: 'Canvas Condensed', fontSize: 50, color: ink });
    add('dish', { name: 'Pasta description', dishId: doc.items[4].id, x: 475, y: 887, w: 265, h: 95, fontSize: 16, color: ink });
    add('shape', { name: 'Checker detail', shape: 'rect', x: 60, y: 1012, w: 120, h: 70, fill: accent, border: ink, borderWidth: 2, radius: 6 });
    add('text', { name: 'Restaurant footer', text: 'MAISON ATLAS  ·  CASABLANCA', x: 205, y: 1030, w: 520, h: 40, font: 'Courier New', fontSize: 15, color: ink, tracking: 1 });
    return doc;
  }
  if (template.layout === 'sandwich') {
    doc.pattern = 'plain';
    add('text', { name: 'Deli name', text: 'MAISON ATLAS', x: 44, y: 35, w: 330, h: 35, font: 'Canvas Hand', fontSize: 31, color: ink, rotation: -2 });
    add('text', { name: 'Menu title', text: 'Our\nSignature', x: 40, y: 103, w: 310, h: 210, font: 'Canvas Hand', fontSize: 83, color: ink, rotation: -2 });
    add('shape', { name: 'Title underline', shape: 'line', x: 45, y: 326, w: 315, h: 4, fill: accent });
    add('vector', { name: 'Deli sandwich illustration', vectorId: 'vector-sandwich-color', vectorColors: ['#ae4029', '#e6a747'], x: 322, y: 160, w: 410, h: 260, color: accent });
    for (let i = 0; i < 4; i++) {
      const item = doc.items[i + 1];
      add('dish', { name: item.name, dishId: item.id, x: 57, y: 392 + i * 137, w: 660, h: 105, font: 'Georgia', fontSize: 21, color: ink, feature: i === 0 });
      if (i < 3) add('shape', { name: `Deli divider ${i + 1}`, shape: 'line', x: 57, y: 515 + i * 137, w: 657, h: 1, fill: '#d7b998' });
    }
    add('text', { name: 'Deli note', text: 'HAND CUT  ·  BUILT TO ORDER', x: 54, y: 969, w: 670, h: 32, font: 'Courier New', fontSize: 15, color: accent, tracking: 1 });
    add('text', { name: 'Deli footer', text: 'FRESH BREAD, EVERY MORNING   /   CASABLANCA', x: 54, y: 1036, w: 683, h: 36, font: 'Canvas Hand', fontSize: 23, color: ink });
    return doc;
  }
  if (template.layout === 'burger') {
    doc.pattern = 'plain';
    doc.paper = accent;
    add('shape', { name: 'Cream menu card', x: 80, y: 75, w: 634, h: 978, fill: paper, border: '#e0c8a4', borderWidth: 2, radius: 12 });
    add('vector', { name: 'Burger house mascot', vectorId: 'vector-burger-assembled', vectorColors: ['#a63822', '#efb958'], x: 490, y: 88, w: 168, h: 148, color: ink });
    add('text', { name: 'Burger brand', text: 'LARDY’S', x: 118, y: 103, w: 360, h: 96, font: 'Canvas Display', fontSize: 73, color: accent, rotation: -2 });
    add('text', { name: 'Brand subtitle', text: 'BURGER HOUSE  /  HOUSE FRIES', x: 126, y: 200, w: 420, h: 31, font: 'Canvas Condensed', fontSize: 23, color: ink, tracking: 1 });
    add('shape', { name: 'Burger title rule', shape: 'line', x: 121, y: 257, w: 550, h: 3, fill: accent });
    add('text', { name: 'Menu heading', text: 'BURGER MENU', x: 125, y: 278, w: 510, h: 64, font: 'Canvas Condensed', fontSize: 47, color: accent });
    for (let i = 0; i < 5; i++) {
      const item = doc.items[i];
      add('dish', { name: item.name, dishId: item.id, x: 128, y: 365 + i * 105, w: 530, h: 91, font: 'Canvas Condensed', fontSize: 25, color: ink, feature: i === 0 });
    }
    add('text', { name: 'Add-ons', text: 'ADD A PATTY  +  0.99     ·     EXTRA BACON  +  0.50', x: 128, y: 908, w: 530, h: 46, font: 'Canvas Condensed', fontSize: 20, bold: true, color: accent });
    add('vector', { name: 'Exploded burger detail', vectorId: 'vector-burger-exploded', vectorColors: ['#a63822', '#efb958'], x: 525, y: 944, w: 130, h: 95, color: accent, opacity: 83 });
    add('text', { name: 'Burger footer', text: 'FRESH OFF THE GRILL  ·  CASABLANCA', x: 123, y: 1009, w: 420, h: 25, font: 'Courier New', fontSize: 11, color: ink, tracking: 1 });
    return doc;
  }
  if (template.layout === 'poster') {
    add('shape', { name: 'Title background', x: 0, y: 0, w: 265, h: 374, fill: ink });
    add('text', { name: 'Menu title', text: 'MENU', x: 18, y: 65, w: 230, h: 180, font: 'Canvas Condensed', fontSize: 96, color: paper });
    add('text', { name: 'Restaurant', text: 'MAISON ATLAS', x: 20, y: 18, w: 220, h: 25, fontSize: 11, color: paper, tracking: 2 });
    for (let i = 0; i < 5; i++) {
      const slot = i + 1, col = slot % 3, row = Math.floor(slot / 3), x = col * 265, y = row * 374, dark = slot % 2 === 0;
      add('shape', { name: `Tile ${i + 1}`, x, y, w: 265, h: 374, fill: dark ? ink : paper });
      add('image', { name: doc.items[i].name, x, y: y + 168, w: 265, h: 206, crop: doc.items[i].photo });
      add('dish', { name: doc.items[i].name, x: x + 18, y: y + 20, w: 230, h: 140, dishId: doc.items[i].id, font: 'Canvas Condensed', fontSize: 30, color: dark ? paper : ink });
    }
    add('text', { name: 'Footer', text: 'FRESH FOOD.\nGOOD COMPANY.', x: 35, y: 845, w: 500, h: 140, font: 'Canvas Condensed', fontSize: 60, color: ink });
    add('icon', { name: 'Sun stamp', icon: 'sun', x: 605, y: 850, w: 120, h: 120, color: accent });
    add('text', { name: 'Address', text: 'CASABLANCA · EVERY DAY, 8 AM—11 PM', x: 35, y: 1050, w: 720, h: 35, fontSize: 17, color: ink });
    return doc;
  }

  if (template.layout === 'editorial') {
    add('text', { name: 'Brand', text: 'MAISON ATLAS', x: 40, y: 33, w: 300, h: 35, fontSize: 18, bold: true, color: ink, tracking: 2 });
    add('text', { name: 'Menu title', text: 'A GOOD\nMENU', x: 38, y: 105, w: 500, h: 205, font: 'Canvas Display', fontSize: 92, color: ink });
    add('text', { name: 'Opening hours', text: 'OPEN DAILY\n8 AM — 11 PM', x: 570, y: 116, w: 180, h: 80, font: 'Courier New', fontSize: 16, align: 'right', color: ink });
    add('shape', { name: 'Title rule', shape: 'line', x: 40, y: 335, w: 714, h: 3, fill: accent });
    add('text', { name: 'Section title', text: 'FROM THE KITCHEN', x: 44, y: 365, w: 350, h: 47, font: 'Canvas Condensed', fontSize: 33, color: accent });
    add('icon', { name: 'Decorative olive branch', icon: 'herb', x: 618, y: 350, w: 92, h: 76, color: accent, rotation: -9 });
    for (let i = 0; i < 6; i++) {
      const item = doc.items[i];
      add('dish', { name: item.name, dishId: item.id, x: 44, y: 435 + i * 83, w: 704, h: 72, font: 'Georgia', fontSize: 20, color: ink });
      if (i < 5) add('shape', { name: `Divider ${i + 1}`, shape: 'line', x: 44, y: 513 + i * 83, w: 704, h: 1, fill: template.pattern });
    }
    add('shape', { name: 'Special panel', x: 45, y: 968, w: 704, h: 80, fill: accent, border: ink, borderWidth: 1, radius: 6 });
    add('text', { name: 'Special note', text: 'A LITTLE SOMETHING EXTRA  ·  MADE FRESH TODAY', x: 62, y: 988, w: 665, h: 42, font: 'Canvas Condensed', fontSize: 25, align: 'center', color: paper });
    add('text', { name: 'Address', text: 'CASABLANCA   /   COME AS YOU ARE', x: 42, y: 1071, w: 710, h: 27, font: 'Courier New', fontSize: 12, color: ink, tracking: 1 });
    return doc;
  }

  add('shape', { name: 'Brand seal', shape: 'ellipse', x: 38, y: 35, w: 145, h: 145, fill: ink, borderWidth: 3, border: accent });
  add('text', { name: 'Brand', text: 'MAISON\nATLAS', x: 51, y: 72, w: 120, h: 72, fontSize: 25, bold: true, align: 'center', color: paper });
  add('text', { name: 'Menu title', text: 'MENU', x: 233, y: 30, w: 345, h: 145, font: 'Canvas Condensed', fontSize: 131, color: accent });
  add('text', { name: 'Tagline', text: 'Fresh flavours & slow moments', x: 220, y: 174, w: 360, h: 38, font: 'Georgia', italic: true, fontSize: 20, color: ink });
  add('text', { name: 'Opening hours', text: 'Open daily\n8 am — 11 pm', x: 611, y: 70, w: 155, h: 110, font: 'Canvas Hand', fontSize: 35, bold: true, align: 'center', color: ink, rotation: -6 });
  add('shape', { name: 'Header rule', shape: 'line', x: 33, y: 225, w: 728, h: 5, fill: accent });
  add('shape', { name: 'Small plates label', x: 37, y: 267, w: 330, h: 54, fill: paper, border: ink, borderWidth: 1.5, radius: 30 });
  add('text', { name: 'Section title', text: 'SMALL PLATES', x: 51, y: 274, w: 304, h: 40, font: 'Canvas Condensed', fontSize: 29, align: 'center', color: accent });
  for (let i = 0; i < 3; i++) add('dish', { name: doc.items[i].name, dishId: doc.items[i].id, x: 43, y: 347 + i * 99, w: 320, h: 84, fontSize: 18, color: ink });
  add('icon', { name: 'Coffee illustration', icon: 'coffee', x: 92, y: 659, w: 225, h: 205, color: accent, rotation: -9 });
  add('shape', { name: 'Specials panel', x: 419, y: 267, w: 338, h: 691, fill: accent, border: ink, borderWidth: 8, radius: 43 });
  add('text', { name: 'Specials title', text: 'Kitchen\nSELECTION', x: 450, y: 313, w: 275, h: 136, font: 'Canvas Condensed', fontSize: 48, align: 'center', color: paper });
  add('dish', { name: 'First special', dishId: doc.items[3].id, x: 455, y: 499, w: 266, h: 157, fontSize: 29, align: 'center', color: ink, feature: true });
  add('dish', { name: 'Second special', dishId: doc.items[6].id, x: 455, y: 731, w: 266, h: 157, fontSize: 29, align: 'center', color: ink, feature: true });
  add('icon', { name: 'Flower accent', icon: 'flower', x: 320, y: 921, w: 95, h: 95, color: accent, rotation: 12 });
  add('text', { name: 'Little note', text: 'GOOD FOOD.\nGOOD COMPANY.', x: 47, y: 930, w: 245, h: 64, font: 'Canvas Condensed', fontSize: 26, color: ink });
  add('shape', { name: 'Footer background', x: 32, y: 1042, w: 730, h: 55, fill: ink });
  add('text', { name: 'Footer', text: 'CASABLANCA   /   EVERY DAY, 8 AM—11 PM', x: 48, y: 1061, w: 690, h: 26, fontSize: 12, color: paper, tracking: 1 });
  return doc;
}
