/** Throwaway canvas model. No production menu or publishing APIs are used. */
import { makeSample, type Crop, type ProofItem } from './compositionData';
export const canvasFonts = [
  {name:'Anton',family:'Canvas Condensed',sample:'BOLD & TALL'},
  {name:'Shrikhand',family:'Canvas Display',sample:'A little character'},
  {name:'Amatic SC',family:'Canvas Hand',sample:'Made by hand'},
  {name:'Bricolage',family:'Bricolage Grotesque',sample:'Fresh every day'},
  {name:'Georgia',family:'Georgia',sample:'The editorial choice'},
  {name:'Arial',family:'Arial',sample:'Simple & familiar'},
  {name:'Courier',family:'Courier New',sample:'BAKED DAILY'},
];
export const canvasFormats = [
  {name:'A4 · Portrait',w:794,h:1123},{name:'A4 · Landscape',w:1123,h:794},
  {name:'Square',w:1080,h:1080},{name:'Social · Portrait',w:1080,h:1350},{name:'Story',w:1080,h:1920},
];
export const canvasIcons = ['coffee','sun','flower','leaf','star','fork','heart','sparkle','arrow','pizza','wave','croissant'] as const;
export type CanvasIcon = typeof canvasIcons[number];
export interface CanvasNode {
  id:string; kind:'text'|'image'|'icon'|'shape'|'dish'; name:string;
  x:number;y:number;w:number;h:number;rotation:number;opacity:number;
  text?:string;font:string;fontSize:number;bold?:boolean;italic?:boolean;align:'left'|'center'|'right';tracking:number;
  color:string;fill:string;border:string;borderWidth:number;radius:number;
  shape?:'rect'|'ellipse'|'line'|'wave'|'burst';icon?:CanvasIcon;src?:string;crop?:Crop;dishId?:string;
  hidden?:boolean;locked?:boolean;feature?:boolean;
}
export interface CanvasDocument {
  title:string;w:number;h:number;paper:string;pattern:'plain'|'grid'|'dots'|'stripes'|'checker';patternColor:string;backgroundImage?:string;
  elements:CanvasNode[];items:ProofItem[];
}
export function makeNode(kind:CanvasNode['kind'],change:Partial<CanvasNode>={}):CanvasNode {
  return {id:crypto.randomUUID(),kind,name:kind,x:250,y:300,w:240,h:90,rotation:0,opacity:100,font:'Bricolage Grotesque',fontSize:30,align:'left',tracking:0,color:'#114c3d',fill:'transparent',border:'#114c3d',borderWidth:0,radius:0,...change};
}
export function makeCanvas(starter:'retro'|'poster'|'blank'):CanvasDocument {
  const green='#124f3c',orange='#e96b27',paper='#ece6cf';
  const doc:CanvasDocument={title:'Maison Atlas — menu study',w:794,h:1123,paper,pattern:'grid',patternColor:'#667558',elements:[],items:makeSample('food')};
  if(starter==='blank') return {...doc,pattern:'plain',elements:[]};
  const add=(kind:CanvasNode['kind'],change:Partial<CanvasNode>)=>doc.elements.push(makeNode(kind,{id:`${starter}-${doc.elements.length}`,...change}));
  if(starter==='poster') {
    doc.paper='#f3eddf';doc.pattern='plain';
    const ink='#103e89';
    add('shape',{name:'Title background',x:0,y:0,w:265,h:374,fill:ink});
    add('text',{name:'Menu title',text:'MENU',x:18,y:47,w:230,h:250,font:'Canvas Condensed',fontSize:128,color:doc.paper});
    add('text',{name:'Restaurant',text:'MAISON ATLAS',x:20,y:18,w:220,h:25,fontSize:11,color:doc.paper,tracking:2});
    for(let i=0;i<5;i++) {
      const slot=i+1,col=slot%3,row=Math.floor(slot/3),x=col*265,y=row*374,dark=slot%2===0;
      add('shape',{name:`Tile ${i+1}`,x,y,w:265,h:374,fill:dark?ink:doc.paper});
      add('image',{name:doc.items[i].name,x,y:y+168,w:265,h:206,crop:doc.items[i].photo});
      add('dish',{name:doc.items[i].name,x:x+18,y:y+20,w:230,h:140,dishId:doc.items[i].id,font:'Canvas Condensed',fontSize:30,color:dark?doc.paper:ink});
    }
    add('text',{name:'Footer',text:'FRESH FOOD.\nGOOD COMPANY.',x:35,y:845,w:500,h:140,font:'Canvas Condensed',fontSize:60,color:ink});
    add('icon',{name:'Sun stamp',icon:'sun',x:605,y:850,w:120,h:120,color:ink});
    add('text',{name:'Address',text:'CASABLANCA · EVERY DAY, 8 AM—11 PM',x:35,y:1050,w:720,h:35,fontSize:17,color:ink});
    return doc;
  }
  add('shape',{name:'Brand seal',shape:'ellipse',x:38,y:35,w:145,h:145,fill:green,borderWidth:3,border:orange});
  add('text',{name:'Brand',text:'MAISON\nATLAS',x:51,y:72,w:120,h:72,fontSize:25,bold:true,align:'center',color:paper});
  add('text',{name:'Menu title',text:'MENU',x:233,y:30,w:345,h:145,font:'Canvas Condensed',fontSize:131,color:orange});
  add('text',{name:'Tagline',text:'Fresh flavours & slow moments',x:220,y:174,w:360,h:38,font:'Georgia',italic:true,fontSize:20,color:green});
  add('text',{name:'Opening hours',text:'Open daily\n8 am — 11 pm',x:611,y:70,w:155,h:110,font:'Canvas Hand',fontSize:35,bold:true,align:'center',color:green,rotation:-6});
  add('shape',{name:'Header rule',shape:'line',x:33,y:225,w:728,h:5,fill:orange});
  add('shape',{name:'Small plates label',x:37,y:267,w:330,h:54,fill:paper,border:green,borderWidth:1.5,radius:30});
  add('text',{name:'Section title',text:'SMALL PLATES',x:51,y:274,w:304,h:40,font:'Canvas Condensed',fontSize:29,align:'center',color:orange});
  for(let i=0;i<3;i++) add('dish',{name:doc.items[i].name,dishId:doc.items[i].id,x:43,y:347+i*99,w:320,h:84,fontSize:18,color:green});
  add('icon',{name:'Coffee illustration',icon:'coffee',x:92,y:659,w:225,h:205,color:orange,rotation:-9});
  add('shape',{name:'Specials panel',x:419,y:267,w:338,h:691,fill:orange,border:green,borderWidth:8,radius:43});
  add('text',{name:'Specials title',text:'Kitchen\nSELECTION',x:450,y:313,w:275,h:136,font:'Canvas Condensed',fontSize:48,align:'center',color:paper});
  add('dish',{name:'First special',dishId:doc.items[3].id,x:455,y:499,w:266,h:157,fontSize:29,align:'center',color:green,feature:true});
  add('dish',{name:'Second special',dishId:doc.items[6].id,x:455,y:731,w:266,h:157,fontSize:29,align:'center',color:green,feature:true});
  add('icon',{name:'Flower accent',icon:'flower',x:320,y:921,w:95,h:95,color:orange,rotation:12});
  add('text',{name:'Little note',text:'GOOD FOOD.\nGOOD COMPANY.',x:47,y:930,w:245,h:64,font:'Canvas Condensed',fontSize:26,color:green});
  add('shape',{name:'Footer background',x:32,y:1042,w:730,h:55,fill:green});
  add('text',{name:'Footer',text:'CASABLANCA   /   EVERY DAY, 8 AM—11 PM',x:48,y:1061,w:690,h:26,fontSize:12,color:paper,tracking:1});
  return doc;
}
