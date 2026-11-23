/** Throwaway canvas model. No production menu or publishing APIs are used. */
import { makeSample, type Crop, type ProofItem } from './compositionData';

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

export const canvasIllustrations = [
  { id: 'espresso-cup', name: 'Espresso cup', group: 'Café & bakery' },
  { id: 'croissant', name: 'Butter croissant', group: 'Café & bakery' },
  { id: 'bread-loaf', name: 'Country loaf', group: 'Café & bakery' },
  { id: 'chef-hat', name: 'Chef hat', group: 'Café & bakery' },
  { id: 'taco', name: 'Taco plate', group: 'Plates & treats' },
  { id: 'pasta-bowl', name: 'Pasta bowl', group: 'Plates & treats' },
  { id: 'donut', name: 'Iced donut', group: 'Plates & treats' },
  { id: 'cupcake', name: 'Cupcake', group: 'Plates & treats' },
  { id: 'sundae', name: 'Ice cream sundae', group: 'Plates & treats' },
  { id: 'lemon-branch', name: 'Lemon branch', group: 'Botanical accents' },
  { id: 'olive-branch', name: 'Olive branch', group: 'Botanical accents' },
  { id: 'flower-vase', name: 'Flowers in a vase', group: 'Botanical accents' },
] as const;
export type CanvasIllustrationId = typeof canvasIllustrations[number]['id'];
export const canvasIllustrationGroups = ['Café & bakery', 'Plates & treats', 'Botanical accents'] as const;

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
] as const;
export type CanvasTemplateId = typeof canvasTemplates[number]['id'];

export const canvasFormatsLabel = (w: number, h: number) => `${w} × ${h}`;
export const canvasFormatsOptions = canvasFormats;

export interface CanvasNode {
  id: string; kind: 'text' | 'image' | 'icon' | 'illustration' | 'shape' | 'dish'; name: string;
  x: number; y: number; w: number; h: number; rotation: number; opacity: number;
  text?: string; font: string; fontSize: number; bold?: boolean; italic?: boolean; align: 'left' | 'center' | 'right'; tracking: number;
  color: string; fill: string; border: string; borderWidth: number; radius: number;
  shape?: CanvasShape; icon?: CanvasIcon; illustration?: CanvasIllustrationId; src?: string; crop?: Crop; dishId?: string;
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

  const add = (kind: CanvasNode['kind'], change: Partial<CanvasNode>) => doc.elements.push(makeNode(kind, { id: `${starter}-${doc.elements.length}`, ...change }));
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
  add('text', { name: 'Tagline', text: 'Fresh flavours & slow moments', x: 220, y: 195, w: 360, h: 26, font: 'Georgia', italic: true, fontSize: 20, color: ink });
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
