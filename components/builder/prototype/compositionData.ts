/** Throwaway visual proof: reference crops are demo imagery, not a production asset library. */
export const directions = [
  { id: 'merchant', name: 'The neighbourhood bakery', family: 'editorial', ref: 1, ink: '#2c3d8b', paper: '#f3e8d5', note: 'Framed masthead · dense lists · stamps' },
  { id: 'diner', name: 'The all-day diner', family: 'editorial', ref: 2, ink: '#f4f0db', paper: '#22483b', note: 'Oversized type · two columns · boxed specials' },
  { id: 'feature', name: 'The street-food poster', family: 'feature', ref: 3, ink: '#e73c22', paper: '#eae5cf', note: 'Alternating photos · outlined rows · playful type' },
  { id: 'wave', name: 'The flowing photo menu', family: 'feature', ref: 4, ink: '#ca160c', paper: '#fff0dd', note: 'Two-tone wave · staggered plates · open composition' },
  { id: 'tiles', name: 'The bold market grid', family: 'tiles', ref: 5, ink: '#063887', paper: '#f3eddf', note: 'Poster tiles · alternating colors · edge-to-edge photos' },
  { id: 'retro', name: 'The illustrated café', family: 'editorial', ref: 6, ink: '#07513d', paper: '#e9e4ca', note: 'Display labels · illustration · special column' },
  { id: 'coffee', name: 'The coffee catalogue', family: 'coffee', ref: 7, ink: '#231f1b', paper: '#e8d7c5', note: 'Mixed-width cells · fine rules · product photography' },
] as const;
export type DirectionId = typeof directions[number]['id'];
export interface Crop { reference: 5 | 7; box: [number, number, number, number] }
export interface ProofItem { id: string; name: string; description: string; price: number; group: string; hidden?: boolean; photo: Crop }
export interface ProofGroup { id: string; name: string }
export interface ProofState {
  direction: DirectionId; name: string; title: string; subtitle: string; footer: string;
  items: ProofItem[]; groups: ProofGroup[]; accent?: string; paper?: string;
  images: boolean; descriptions: boolean; prices: boolean; badges: boolean; compact: boolean;
}
const foodCrops: Crop['box'][] = [[250,153,240,150],[495,181,240,122],[0,453,245,139],[247,452,245,140],[557,451,178,96],[0,750,245,120],[247,751,245,119],[553,751,182,115],[0,992,245,111],[250,1000,180,102]];
const coffeeCrops: Crop['box'][] = [[155,200,200,205],[605,200,180,205],[940,180,225,220],[310,475,230,215],[900,470,245,220],[320,785,220,212],[900,775,250,220],[320,1060,220,220],[900,1060,250,220],[320,1360,220,220],[900,1360,250,220]];
const foodNames = ['Market Caesar','Roasted aubergine','Cheese & grapes','Mushroom soup','Beetroot soup','Steak & herbs','Creamy pasta','Salmon & greens','Berry cheesecake','Butter croissant'];
const foodDescriptions = ['Crisp greens, golden croutons','Warm, rich and comforting','A little something to share','Made for a slow afternoon','A house lunch favourite','From the grill, to your table','A generous plate of comfort','Fresh from the kitchen','A sweet finish','Baked for your morning'];
const coffeeNames = ['Espresso double','Affogato','Cortado double','Iced americano','Iced latte','Ambrosia','Coffee tonic','Matcha latte','Triple-layer latte','Cold brew','Milk cold brew'];
const coffeeDescriptions = ['2 SHOTS / OVER ICE','2 SHOTS / ICE CREAM','2 SHOTS / MILK / ICE','2 SHOTS / WATER / ICE','1 SHOT / MILK / ICE','ESPRESSO / MILK / ORANGE','2 SHOTS / TONIC / ICE','MATCHA / MILK / ICE','ESPRESSO / MILK / FOAM','SLOW BREW / OVER ICE','SLOW BREW / MILK / ICE'];
export function makeSample(kind: 'food' | 'coffee') {
  return (kind === 'food' ? foodNames : coffeeNames).map((name,index): ProofItem => ({
    id: `proof-${kind}-${index}`, name, description: (kind === 'food' ? foodDescriptions : coffeeDescriptions)[index],
    price: (kind === 'food' ? [65,70,95,55,60,145,90,135,45,25] : [24,36,28,30,34,38,36,40,42,32,36])[index],
    group: index < 3 ? 'first' : index < 7 ? 'second' : 'third',
    photo: { reference: kind === 'food' ? 5 : 7, box: (kind === 'food' ? foodCrops : coffeeCrops)[index] },
  }));
}
export const initialProof: ProofState = {
  direction: 'tiles', name: 'MAISON ATLAS', title: 'MENU', subtitle: 'FRESH FOOD. GOOD COMPANY.', footer: 'CASABLANCA · EVERY DAY, 8 AM—11 PM',
  items: makeSample('food'), groups: [{id:'first',name:'Small plates'},{id:'second',name:'Kitchen favourites'},{id:'third',name:'Sweet & slow'}],
  images: true, descriptions: true, prices: true, badges: true, compact: false,
};
