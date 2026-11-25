'use client';

// Prototype question: does unrestricted element placement make the desired artistic
// menus approachable? All elements/uploads/history stay local to this browser page.
import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { imageService } from '@/lib/services/imageService';
import { canvasBackgrounds,canvasFonts,canvasFormats,canvasIconGroups,canvasLocalIllustrations,canvasVectorIllustrations,canvasShapeGroups,canvasTemplates,makeCanvas,makeNode,type CanvasDocument,type CanvasNode,type CanvasIcon,type CanvasTemplateId } from './canvasData';
import { CanvasVectorVisual } from './CanvasVectorVisual';
import { makeSample } from './compositionData';
import s from './canvas.module.css';

const iconPaths:Record<CanvasIcon,React.ReactNode>={
  coffee:<><path d="M20 38h53l-6 37q-22 15-41 0Z M73 43q26-6 17 14-4 10-20 10 M15 85q35 12 68-1 M35 28q-10-8 0-20m15 20q-10-8 0-20m15 20q-10-8 0-20"/><path d="M34 53v4m23-4v4m-20 9q8 8 16 0"/></>,
  tea:<><path d="M18 42h57l-7 38q-21 13-42 0Z M75 48q22-5 16 13-3 9-18 8 M28 35q18-11 37 0M42 25q-8-8 0-16m13 16q-8-8 0-16"/><path d="M30 91h46"/></>,
  matcha:<><path d="M18 48h64l-8 35q-23 17-48 0Z M29 42q20-12 42 0"/><path d="M41 26q-9-13 2-21m14 21q-8-13 3-21"/><path d="M39 61q12-12 24 0-12 14-24 0Z"/></>,
  sun:<><circle cx="50" cy="50" r="27"/>{Array.from({length:12},(_,i)=><path key={i} d="M50 5v9" transform={`rotate(${i*30} 50 50)`}/>)}<path d="M39 44v5m22-5v5m-17 9q6 6 12 0"/></>,
  flower:<><path d="M50 28C22-8 2 29 28 49 0 73 30 102 50 74c25 28 51-4 24-25C102 25 70-5 50 28Z"/><circle cx="50" cy="50" r="12"/></>,
  leaf:<><path d="M18 83C-2 35 37 9 86 15c7 50-19 79-59 60 M18 83l54-54m-31 31-9-22m21 10 19 3"/></>,
  herb:<><path d="M18 84 79 21M34 67q-15-4-19-19 18-1 25 11M48 51q-15-5-17-21 18 0 24 13M63 35q-5-17 8-27 8 16-1 29M55 45q16-3 27 8-15 10-29 1"/></>,
  olive:<><path d="M20 80Q42 44 82 19M33 61q-5-18-22-19 1 18 17 24m24-23q-2-17 13-24 7 17-5 29m-17 31q8-17 26-15-3 19-22 21"/><circle cx="44" cy="56" r="4"/><circle cx="65" cy="34" r="4"/></>,
  star:<path d="m50 6 12 29 32 3-24 22 7 32-27-17-28 17 8-32L6 38l32-3Z"/>,
  fork:<path d="M27 10v34m-9-34v23q0 12 9 12t9-12V10M27 45v45M70 10q-19 24-13 47h13m0-47v80"/>,
  knife:<><path d="M31 10q28 5 29 41H31Z M31 51v39M58 51h12v39H58"/></>,
  spoon:<><path d="M51 10q25 0 25 23T51 58 26 33 51 10ZM51 58v33"/></>,
  plate:<><circle cx="50" cy="50" r="39"/><circle cx="50" cy="50" r="29"/><path d="M11 29q-6 21 0 42m78-42q6 21 0 42"/></>,
  cloche:<><path d="M13 71h74M20 68a30 30 0 0 1 60 0M50 37V23m-7 0h14M19 83h62"/></>,
  heart:<path d="M50 85C-13 47 15-11 50 25c37-36 63 22 0 60Z"/>,
  sparkle:<><path d="M50 5q4 40 40 45-36 5-40 45Q46 55 10 50 46 45 50 5Z"/><path d="m82 11 2 8 8 2-8 3-2 8-3-8-8-3 8-2Z"/></>,
  arrow:<><path d="M10 70q28-38 72-34M62 17l24 19-23 21"/></>,
  pizza:<><path d="M50 9 7 83q42 18 86 0Z M14 72q35 15 71 0"/><circle cx="42" cy="43" r="6"/><circle cx="63" cy="60" r="6"/><circle cx="31" cy="65" r="4"/></>,
  croissant:<><path d="M10 66Q10 16 50 20q41-3 41 46L71 52 61 66 40 66 30 52Z M30 52l8-29m23 1 10 28M40 66l3-42m15 0 3 42"/></>,
  bread:<><path d="M13 75V47q0-29 37-29t37 29v28q-37 18-74 0Z M33 34l-7 16m27-16-7 16m27-16-7 16"/></>,
  baguette:<><path d="M13 72q-8-10 2-21l39-39q11-9 22 1t1 22L38 75q-14 9-25-3Z M29 51l10 10m6-27 10 10m7-26 9 10"/></>,
  donut:<><path d="M50 12C20 10 7 29 12 50s20 38 39 38 37-16 38-37S76 13 50 12Z"/><ellipse cx="50" cy="49" rx="14" ry="12"/><path d="M18 32q10 10 18 4m30-8 13 7m-5 38 10 4"/></>,
  cupcake:<><path d="M26 50q-13-21 7-25 0-22 20-11 12-10 20 5 17 5 8 22 12 6 3 17l-8 29H28l-8-29q-3-10 6-8Z M30 60h41M35 77h32"/></>,
  cake:<><path d="M15 53h70v33H15zM15 53q10-14 20 0t20 0 20 0 20 0M34 52V31h32v21M50 31V12m0 0q-13 8 0 14 13-6 0-14Z"/></>,
  cookie:<><circle cx="50" cy="50" r="38"/><circle cx="35" cy="36" r="4"/><circle cx="63" cy="32" r="4"/><circle cx="67" cy="58" r="5"/><circle cx="38" cy="66" r="4"/><circle cx="51" cy="48" r="3"/></>,
  burger:<><path d="M16 42q3-28 34-28t34 28ZM12 48h76v10H12zM16 64h68q-6 23-34 23T16 64Z"/><path d="M16 61q10-8 20 0t20 0 20 0 12 0"/></>,
  fries:<><path d="m24 39 5-25m12 25 2-31m13 31 1-27m13 27 7-22M18 39h64l-8 48H27Z"/><path d="M32 58h36"/></>,
  pasta:<><path d="M14 52q36-34 72 0l-8 28H22Z M21 50q-4-27 12-30m-1 34q-5-28 10-36m0 35q-1-27 14-36m-2 37q6-29 22-32"/></>,
  bowl:<><path d="M12 47h76q-5 36-38 42-33-6-38-42Z M23 43q5-31 26-20 18-19 29 4 4 8 4 16"/><path d="M29 62h42"/></>,
  salad:<><path d="M12 54q38-26 76 0l-9 27q-29 14-58 0Z M32 52Q9 28 26 17q18 8 16 30m12 1q3-35 27-32 7 22-19 36M40 53q-2-24 15-26"/><circle cx="37" cy="63" r="4"/><circle cx="61" cy="68" r="5"/></>,
  fish:<><path d="M12 50q33-38 68 0-35 38-68 0Z M80 50l10-15v30ZM35 43h1"/><circle cx="34" cy="43" r="3"/><path d="M51 36q10 14 0 28"/></>,
  shrimp:<><path d="M78 23q-24-16-47 4-20 18-3 37 18 20 42 5 17-12 12-29-4-14-18-13-12 2-10 13 2 9 10 8m-31 3-12 10m21-2-5 14m17-15 4 14m9-22 15 4"/><circle cx="58" cy="30" r="2"/></>,
  chicken:<><path d="M17 48q3-26 31-27 26 2 31 30 2 27-25 33-32 5-37-36Z M75 53l11-8q12 4 2 13l-9 9M28 62l-10 9q-9-1-4-9l8-8"/></>,
  cheese:<><path d="M12 40 76 17l12 13v52H12Z M12 40h76M38 52a7 7 0 1 0 0 14m25-20a5 5 0 1 0 0 10m7 23a7 7 0 1 0 0-14"/></>,
  mushroom:<><path d="M13 48q5-35 37-35t37 35q-15 12-37 5-22 7-37-5ZM39 51h22l-3 35H42Z"/><path d="M29 33q5-7 11 0m17-4q5-7 10 0"/></>,
  tomato:<><path d="M50 28q-28-16-37 11-8 29 16 45 23 12 42-1 22-18 7-43-12-19-28-12Z M50 29q-7-18-22-17 2 16 15 21m7-4q5-18 22-17-2 16-16 21m-6-4 1-12"/></>,
  pepper:<><path d="M44 28q-8-18 8-23 17 9 4 25 18-9 30 4 7 21-20 48-25 26-46 4-20-22-4-44 9-13 28-14Z M49 28q-10-7-18 2m20 0q16-8 26 1"/></>,
  chili:<><path d="M16 67q34 26 60-3 17-18 8-36-12 8-27 3-32-10-43 19-4 10 2 17Z M73 34q3-20 19-22"/></>,
  lemon:<><path d="M16 50q34-38 68 0-34 38-68 0Z M20 50h60M35 35l30 30m0-30L35 65"/><path d="M50 13q8-12 19-6-3 13-16 12"/></>,
  glass:<><path d="M22 13h56L71 57q-10 13-21 13T29 57Z M50 70v19m-19 0h38M31 40h38"/></>,
  wine:<><path d="M24 13h52v21q0 28-26 28T24 34ZM50 62v27m-19 0h38M25 38q25 12 50 0"/></>,
  cocktail:<><path d="M14 17h72L51 54v28m-18 7h36M22 17q9 13 18 0t18 0 18 0"/><path d="m67 31 16-17"/></>,
  location:<><path d="M50 91Q14 51 20 32 24 10 50 9t30 23q7 20-30 59Z"/><circle cx="50" cy="34" r="10"/></>,
  clock:<><circle cx="50" cy="50" r="39"/><path d="M50 25v28l19 11"/></>,
  badge:<><path d="m50 8 12 8 15-2 5 14 11 10-7 14 1 15-15 6-9 13-14-7-15 2-6-14-12-10 7-14-1-15 15-6Z"/><path d="M32 51h36M50 32v38"/></>,
  check:<path d="m15 53 23 23 48-53"/>,
  menu:<><path d="M18 26h64M18 50h64M18 74h64"/><circle cx="8" cy="26" r="1"/><circle cx="8" cy="50" r="1"/><circle cx="8" cy="74" r="1"/></>,
  flame:<><path d="M53 8q17 24 5 40 15-4 21-20 22 36 4 56-13 15-34 10-24-5-27-27-2-20 16-38 1 17 14 22 10-16 1-43Z"/><path d="M50 54q13 12 4 27-11 6-15-5-3-10 11-22Z"/></>,
};
function Icon({name}:{name:CanvasIcon}){return <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>;}
function Shape3D({node}:{node:CanvasNode}){
  const id=node.id.replace(/[^a-zA-Z0-9_-]/g,'');
  const top=`${id}-top`,side=`${id}-side`,sphere=`${id}-sphere`;
  return <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className={s.shape3d}>
    <defs><linearGradient id={top} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".72"/><stop offset="1" stopColor={node.fill} stopOpacity=".92"/></linearGradient><linearGradient id={side} x1="0" y1="0" x2="1" y2=".5"><stop stopColor={node.fill}/><stop offset="1" stopColor="#160e08" stopOpacity=".72"/></linearGradient><radialGradient id={sphere} cx="30%" cy="24%" r="78%"><stop stopColor="#fff" stopOpacity=".95"/><stop offset=".24" stopColor={node.fill}/><stop offset="1" stopColor="#140d09"/></radialGradient></defs>
    {node.shape==='cube'&&<><path d="M50 9 88 29 50 50 12 29Z" fill={`url(#${top})`} stroke={node.border}/><path d="M12 29 50 50v42L12 70Z" fill={node.fill} fillOpacity=".8" stroke={node.border}/><path d="M50 50 88 29v41L50 92Z" fill={`url(#${side})`} stroke={node.border}/></>}
    {node.shape==='sphere'&&<><ellipse cx="50" cy="86" rx="31" ry="7" fill="#24190f" opacity=".2"/><circle cx="50" cy="48" r="38" fill={`url(#${sphere})`} stroke={node.border}/><ellipse cx="36" cy="30" rx="10" ry="5" fill="#fff" opacity=".35" transform="rotate(-28 36 30)"/></>}
    {node.shape==='cylinder'&&<><path d="M13 26v49q0 15 37 15t37-15V26" fill={`url(#${side})`} stroke={node.border}/><ellipse cx="50" cy="26" rx="37" ry="15" fill={`url(#${top})`} stroke={node.border}/><path d="M13 74q0 15 37 15t37-15" fill="none" stroke={node.border}/></>}
    {node.shape==='cone'&&<><ellipse cx="50" cy="80" rx="38" ry="12" fill={`url(#${top})`} stroke={node.border}/><path d="M50 12 12 80q38 18 76 0Z" fill={`url(#${side})`} stroke={node.border}/><path d="M50 12 50 87" stroke="#fff" strokeOpacity=".38"/></>}
    {node.shape==='pyramid'&&<><path d="M50 8 8 82h84Z" fill={`url(#${top})`} stroke={node.border}/><path d="M50 8 50 82h42Z" fill={`url(#${side})`} stroke={node.border}/><path d="M50 8 26 82" stroke="#fff" strokeOpacity=".46"/></>}
    {node.shape==='ring'&&<><ellipse cx="50" cy="50" rx="38" ry="23" fill="none" stroke={`url(#${top})`} strokeWidth="22"/><ellipse cx="50" cy="50" rx="38" ry="23" fill="none" stroke={node.border} strokeWidth="1.5"/></>}
  </svg>;
}
function NodeVisual({node,doc}:{node:CanvasNode;doc:CanvasDocument}){
  if(node.kind==='icon')return <Icon name={node.icon||'star'}/>;
  if(node.kind==='vector'){
    const asset=canvasVectorIllustrations.find(value=>value.id===node.vectorId);
    if(!asset)return null;
    return <CanvasVectorVisual src={asset.src} sourceColors={asset.colors} colors={node.vectorColors||[...asset.colors]} label={node.name}/>;
  }
  if(node.kind==='shape'){
    if(['cube','sphere','cylinder','cone','pyramid','ring'].includes(node.shape||''))return <Shape3D node={node}/>;
    if(node.shape==='wave')return <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H68C22 25 98 48 59 76Q37 88 70 100H0Z" fill={node.fill}/></svg>;
    if(node.shape==='burst'){const points=Array.from({length:32},(_,i)=>{const angle=i*Math.PI/16,r=i%2?40:49;return `${50+Math.sin(angle)*r},${50+Math.cos(angle)*r}`;}).join(' ');return <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points={points} fill={node.fill} stroke={node.border} strokeWidth={node.borderWidth}/></svg>;}
    return <div className={s.shapeVisual} style={{background:node.fill,border:`${node.borderWidth}px solid ${node.border}`,borderRadius:node.shape==='ellipse'?'50%':node.radius}}/>;
  }
  if(node.kind==='image'){
    if(node.src)return <img src={node.src} alt={node.name} draggable={false} style={{borderRadius:node.radius,objectFit:node.backgroundLayer?'fill':'contain'}}/>;
    if(node.crop){const [x,y,w,h]=node.crop.box;return <svg viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={node.name}><image href={`/prototypes/menu-composer/reference-${node.crop.reference}.png`} width={node.crop.reference===5?736:1199} height={node.crop.reference===5?1104:1696}/></svg>;}
  }
  if(node.kind==='dish'){
    const item=doc.items.find(value=>value.id===node.dishId);if(!item)return null;
    return <div className={`${s.dishVisual} ${node.feature?s.featureDish:''}`}><div className={s.dishHeading}><strong>{item.name}</strong><b>{item.price}<small> MAD</small></b></div><p>{item.description}</p></div>;
  }
  return <div className={s.textVisual}>{node.text}</div>;
}
interface Gesture {type:'move'|'resize'|'rotate';sx:number;sy:number;node:CanvasNode;before:CanvasDocument;next:CanvasDocument;moved:boolean}
const tabs=[['templates','▦','Templates'],['text','T','Text'],['fonts','Aa','Fonts'],['elements','✳','Elements'],['illustrations','❀','Illustrations'],['media','▧','Uploads'],['menu','≡','Menu data'],['background','◩','Background']] as const;
type LibraryTab=typeof tabs[number][0];
const bound=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));

export function MenuCanvasPrototype(){
  const [history,setHistory]=useState<CanvasDocument[][]>(()=>[[makeCanvas('cafe-forest')]]);const [cursor,setCursor]=useState(0);const [activePage,setActivePage]=useState(0);const [live,setLive]=useState<CanvasDocument|null>(null);
  const pages=history[cursor]||history[0];const pageIndex=bound(activePage,0,pages.length-1);
  const doc=live||pages[pageIndex];
  const [selection,setSelection]=useState<string|null>('cafe-forest-2');const selected=doc.elements.find(node=>node.id===selection);
  const [tab,setTab]=useState<LibraryTab>('elements');const [zoom,setZoom]=useState('fit');const [preview,setPreview]=useState(false);const [snap,setSnap]=useState(true);const [iconQuery,setIconQuery]=useState('');const [assetQuery,setAssetQuery]=useState('');const [assetGroup,setAssetGroup]=useState('All');const [assetLimit,setAssetLimit]=useState(48);
  const [panel,setPanel]=useState<'library'|'properties'|null>(null);const [uploads,setUploads]=useState<{name:string;src:string}[]>([]);const [uploadError,setUploadError]=useState('');const [showState,setShowState]=useState(false);
  const viewport=useRef<HTMLDivElement>(null),paper=useRef<HTMLDivElement>(null),textEditor=useRef<HTMLTextAreaElement>(null);const gesture=useRef<Gesture|null>(null);const clipboard=useRef<CanvasNode|null>(null);
  const [available,setAvailable]=useState({w:900,h:800});
  const scale=zoom==='fit'?Math.max(.1,Math.min((available.w-80)/doc.w,(available.h-80)/doc.h,1)):Number(zoom);
  const [guides,setGuides]=useState({x:false,y:false});
  const commitPages=(next:CanvasDocument[],nextActive=pageIndex)=>{setHistory(values=>[...values.slice(0,cursor+1),next]);setCursor(cursor+1);setActivePage(nextActive);setLive(null);};
  const commit=(next:CanvasDocument)=>{const nextPages=[...pages];nextPages[pageIndex]=next;commitPages(nextPages,pageIndex);};
  const patch=(change:Partial<CanvasDocument>)=>commit({...doc,...change});
  const changeNode=(change:Partial<CanvasNode>)=>{if(!selected)return;patch({elements:doc.elements.map(node=>node.id===selected.id?{...node,...change}:node)});};
  const undo=()=>{gesture.current=null;setLive(null);setCursor(value=>Math.max(0,value-1));};const redo=()=>{gesture.current=null;setLive(null);setCursor(value=>Math.min(history.length-1,value+1));};
  const add=(kind:CanvasNode['kind'],change:Partial<CanvasNode>={})=>{const node=makeNode(kind,{x:doc.w*.32,y:doc.h*.3,...change});patch({elements:[...doc.elements,node]});setSelection(node.id);setPanel(null);};
  const setBackgroundLayer=(src:string,name:string,removeId?:string)=>{const source=doc.elements.find(node=>node.id===removeId);const background=makeNode('image',{...(source||{}),id:crypto.randomUUID(),name:`${name} · background`,src,x:0,y:0,w:doc.w,h:doc.h,rotation:0,opacity:100,radius:0,locked:false,hidden:false,backgroundLayer:true});patch({pattern:'plain',backgroundImage:undefined,elements:[background,...doc.elements.filter(node=>!node.backgroundLayer&&node.id!==removeId)]});setSelection(background.id);setPanel(null);};
  const setPattern=(pattern:CanvasDocument['pattern'])=>patch({pattern,backgroundImage:undefined,elements:doc.elements.filter(node=>!node.backgroundLayer)});
  const remove=()=>{if(!selected||selected.locked)return;patch({elements:doc.elements.filter(node=>node.id!==selected.id)});setSelection(null);};
  const duplicate=()=>{if(!selected)return;const node={...selected,id:crypto.randomUUID(),x:selected.x+20,y:selected.y+20,locked:false,name:`${selected.name} copy`};patch({elements:[...doc.elements,node]});setSelection(node.id);};
  const reorder=(step:number)=>{if(!selected)return;const elements=[...doc.elements],index=elements.findIndex(node=>node.id===selected.id),target=bound(index+step,0,elements.length-1);if(index===target)return;[elements[index],elements[target]]=[elements[target],elements[index]];patch({elements});};
  const changeFormat=(index:number)=>{const next=canvasFormats[index],ratio=Math.min(next.w/doc.w,next.h/doc.h),ox=(next.w-doc.w*ratio)/2,oy=(next.h-doc.h*ratio)/2;patch({w:next.w,h:next.h,elements:doc.elements.map(node=>({...node,x:node.x*ratio+ox,y:node.y*ratio+oy,w:node.w*ratio,h:node.h*ratio,fontSize:node.fontSize*ratio}))});setZoom('fit');};
  const addPageAfter=(index:number)=>{const source=pages[index]||doc;const next={...source,elements:[],backgroundImage:undefined};commitPages([...pages.slice(0,index+1),next,...pages.slice(index+1)],index+1);setSelection(null);setPanel(null);setZoom('fit');};
  const duplicatePage=()=>{const itemIds=new Map(doc.items.map(item=>[item.id,crypto.randomUUID()]));const copy:CanvasDocument={...doc,backgroundImage:doc.backgroundImage,elements:doc.elements.map(node=>({...node,id:crypto.randomUUID(),dishId:node.dishId?itemIds.get(node.dishId):undefined})),items:doc.items.map(item=>({...item,id:itemIds.get(item.id)!}))};commitPages([...pages,copy],pages.length);setSelection(null);setPanel(null);setZoom('fit');};
  const deletePage=()=>{if(pages.length<2)return;const next=pages.filter((_,index)=>index!==pageIndex),nextIndex=Math.max(0,pageIndex-1);commitPages(next,nextIndex);setSelection(null);setPanel(null);setZoom('fit');};
  const selectPage=(index:number)=>{gesture.current=null;setLive(null);setActivePage(index);setSelection(null);setPanel(null);setGuides({x:false,y:false});};
  const applyTemplate=(id:CanvasTemplateId|'blank')=>{const next=makeCanvas(id),ratio=Math.min(doc.w/next.w,doc.h/next.h),ox=(doc.w-next.w*ratio)/2,oy=(doc.h-next.h*ratio)/2;commit({...next,title:doc.title,w:doc.w,h:doc.h,items:doc.items.map(item=>({...item})),elements:next.elements.map(node=>({...node,x:node.x*ratio+ox,y:node.y*ratio+oy,w:node.w*ratio,h:node.h*ratio,fontSize:node.fontSize*ratio}))});setSelection(null);setPanel(null);setZoom('fit');};
  useEffect(()=>{const observer=new ResizeObserver(entries=>setAvailable({w:entries[0].contentRect.width,h:entries[0].contentRect.height}));if(viewport.current)observer.observe(viewport.current);return()=>observer.disconnect();},[]);
  useEffect(()=>{const key=(event:KeyboardEvent)=>{
    if(event.target instanceof HTMLElement&&event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    const command=event.metaKey||event.ctrlKey;
    if(command&&event.key.toLowerCase()==='z'){event.preventDefault();if(event.shiftKey)redo();else undo();return;}
    if(command&&event.key.toLowerCase()==='d'){event.preventDefault();duplicate();return;}
    if(command&&event.key.toLowerCase()==='c'&&selected){clipboard.current=selected;return;}
    if(command&&event.key.toLowerCase()==='v'&&clipboard.current){event.preventDefault();add(clipboard.current.kind,{...clipboard.current,id:crypto.randomUUID(),x:clipboard.current.x+24,y:clipboard.current.y+24});return;}
    if(event.key==='Escape'){gesture.current=null;setLive(null);setSelection(null);setPanel(null);setGuides({x:false,y:false});return;}
    if(!selected||selected.locked||preview)return;
    if(event.key==='Delete'||event.key==='Backspace'){event.preventDefault();remove();return;}
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();const step=event.shiftKey?10:1;changeNode({x:selected.x+(event.key==='ArrowLeft'?-step:event.key==='ArrowRight'?step:0),y:selected.y+(event.key==='ArrowUp'?-step:event.key==='ArrowDown'?step:0)});}
  };window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);});
  const point=(event:React.PointerEvent)=>{const rect=paper.current!.getBoundingClientRect();return {x:(event.clientX-rect.left)/scale,y:(event.clientY-rect.top)/scale};};
  const start=(event:React.PointerEvent,node:CanvasNode,type:Gesture['type'])=>{
    if(preview||event.button!==0)return;event.stopPropagation();event.preventDefault();setSelection(node.id);if(node.locked)return;
    const p=point(event);gesture.current={type,sx:p.x,sy:p.y,node,before:doc,next:doc,moved:false};event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move=(event:React.PointerEvent)=>{
    const g=gesture.current;if(!g)return;const p=point(event),dx=p.x-g.sx,dy=p.y-g.sy;if(Math.abs(dx)+Math.abs(dy)<.5&&!g.moved)return;
    let change:Partial<CanvasNode>;let gx=false,gy=false;
    if(g.type==='move'){
      let x=g.node.x+dx,y=g.node.y+dy;
      if(snap&&!event.altKey){if(Math.abs(x+g.node.w/2-doc.w/2)<7){x=(doc.w-g.node.w)/2;gx=true;}if(Math.abs(y+g.node.h/2-doc.h/2)<7){y=(doc.h-g.node.h)/2;gy=true;}if(Math.abs(x)<7)x=0;if(Math.abs(y)<7)y=0;}
      change={x,y};
    }else if(g.type==='resize'){
      const angle=-g.node.rotation*Math.PI/180,localX=dx*Math.cos(angle)-dy*Math.sin(angle),localY=dx*Math.sin(angle)+dy*Math.cos(angle);
      let w=Math.max(20,g.node.w+localX),h=Math.max(15,g.node.h+localY);if(event.shiftKey)h=w*g.node.h/g.node.w;change={w,h};
    }else{
      const cx=g.node.x+g.node.w/2,cy=g.node.y+g.node.h/2,from=Math.atan2(g.sy-cy,g.sx-cx),to=Math.atan2(p.y-cy,p.x-cx);let rotation=g.node.rotation+(to-from)*180/Math.PI;if(event.shiftKey)rotation=Math.round(rotation/15)*15;change={rotation:Math.round(rotation)};
    }
    g.next={...g.before,elements:g.before.elements.map(node=>node.id===g.node.id?{...node,...change}:node)};g.moved=true;setLive(g.next);setGuides({x:gx,y:gy});
  };
  const end=()=>{const g=gesture.current;if(!g)return;gesture.current=null;setGuides({x:false,y:false});if(g.moved)commit(g.next);else setLive(null);};
  const upload=async(event:React.ChangeEvent<HTMLInputElement>)=>{
    const files=Array.from(event.target.files||[]);setUploadError('');const added:{name:string;src:string}[]=[];
    for(const file of files){const result=await imageService.uploadImage(file);if(result.success)added.push({name:file.name,src:result.url});else setUploadError(result.error||'This image could not load.');}
    setUploads(values=>[...values,...added]);event.target.value='';
  };
  const updateDish=(change:Partial<CanvasDocument['items'][number]>)=>patch({items:doc.items.map(item=>item.id===selected?.dishId?{...item,...change}:item)});
  const item=doc.items.find(value=>value.id===selected?.dishId);
  const matchingAssets=canvasLocalIllustrations.filter(asset=>(assetGroup==='All'||asset.group===assetGroup)&&`${asset.name} ${asset.tags}`.toLowerCase().includes(assetQuery.trim().toLowerCase()));
  const matchingVectors=canvasVectorIllustrations.filter(asset=>`${asset.name} ${asset.group}`.toLowerCase().includes(assetQuery.trim().toLowerCase()));
  const addVectorAsset=(asset:typeof canvasVectorIllustrations[number])=>{
    const sourceId='sourceId' in asset?asset.sourceId:undefined;
    add('vector',{name:asset.name,vectorId:asset.id,vectorColors:[...asset.colors],color:'#a8402c',w:230,h:190,creator:asset.creator,sourceName:asset.creator,...(sourceId?{sourceUrl:`https://openclipart.org/detail/${sourceId}`,licenseUrl:'https://openclipart.org/faq'}:{}),license:'license' in asset?asset.license:'Public domain · CC0'});
  };
  const visibleAssets=matchingAssets.slice(0,assetLimit);
  const assetGroups=['All',...Array.from(new Set(canvasLocalIllustrations.map(asset=>asset.group)))];
  const fields=(['x','y','w','h','rotation'] as const).map((field,index)=><label key={field}>{['X','Y','Width','Height','Rotation °'][index]}<input type="number" step="1" value={Math.round(selected?.[field]||0)} disabled={selected?.locked} onChange={event=>changeNode({[field]:field==='w'||field==='h'?Math.max(15,Number(event.target.value)):Number(event.target.value)})}/></label>);
  return <div className={`${s.studio} ${preview?s.previewMode:''}`}>
    <header className={s.header}><a href="/builder" className={s.brand}>MenuCraft<span>✳</span></a><span className={s.labPill}>CANVAS LAB</span><span className={s.divider}/><input className={s.docTitle} aria-label="Design name" value={doc.title} onChange={event=>patch({title:event.target.value})}/><div className={s.headerRight}><span>Prototype · session only</span><button aria-label="Undo canvas change" disabled={cursor===0} onClick={undo}>↶</button><button aria-label="Redo canvas change" disabled={cursor===history.length-1} onClick={redo}>↷</button><a href="/prototype/menu-composition?variant=tiles">Guided layouts ↗</a><button className={s.previewButton} aria-pressed={preview} onClick={()=>{setPreview(value=>!value);setPanel(null);}}>◉ {preview?'Edit design':'Preview'}</button></div></header>
    <div className={s.topbar}><div><b>A little more creative freedom.</b><span>Start with a design, or make something entirely yours.</span></div><div><button className={s.mobileButton} onClick={()=>setPanel(panel==='library'?null:'library')}>＋ Library</button><select aria-label="Canvas format" value={Math.max(0,canvasFormats.findIndex(format=>format.w===doc.w&&format.h===doc.h))} onChange={event=>changeFormat(Number(event.target.value))}>{canvasFormats.map((format,index)=><option key={format.name} value={index}>{format.name}</option>)}</select><button className={s.mobileButton} onClick={()=>setPanel(panel==='properties'?null:'properties')}>Properties</button></div></div>
    <main className={s.workspace}>
      <nav className={s.rail} aria-label="Element libraries">{tabs.map(([id,glyph,label])=><button key={id} aria-label={`Open ${label} library`} aria-pressed={tab===id} onClick={()=>{setTab(id);setPanel('library');}}><b>{glyph}</b><span>{label}</span></button>)}</nav>
      <aside className={`${s.library} ${panel==='library'?s.openPanel:''}`}><div className={s.panelHeading}><div><span>YOUR DESIGN TOOLBOX</span><h2>{tabs.find(value=>value[0]===tab)?.[2]}</h2><select className={s.mobileLibrarySelect} aria-label="Library category" value={tab} onChange={event=>setTab(event.target.value as LibraryTab)}>{tabs.map(([id,,name])=><option key={id} value={id}>{name}</option>)}</select></div><button className={s.mobileButton} aria-label="Close library" onClick={()=>setPanel(null)}>×</button></div><div className={s.libraryContent}>
        {tab==='templates'&&<><p className={s.hint}>Thirteen editable menu designs, including three submarine sandwich versions and a coffee clipboard. Every part stays movable.</p>{canvasTemplates.map(template=><button key={template.id} className={s.starter} onClick={()=>applyTemplate(template.id)}><span className={`${s.starterArt} ${s[`family-${template.family}`]}`} style={{'--template-paper':template.paper,'--template-ink':template.ink,'--template-accent':template.accent} as CSSProperties}><b>{template.family==='poster'?'THE MENU':template.family==='editorial'?'TODAY':'MENU'}</b><i>{template.theme}</i><span className={s.templateSample}><span/><span/><span/></span><span className={s.templateSwatches}><i style={{background:template.paper}}/><i style={{background:template.ink}}/><i style={{background:template.accent}}/></span></span><strong>{template.name}</strong><small>{template.theme} · apply to this page ↗</small></button>)}<button className={s.blankStarter} onClick={()=>applyTemplate('blank')}><span>＋</span><b>Blank canvas</b><small>Start with an empty page</small></button></>}
        {tab==='text'&&<><p className={s.hint}>Add your words. Pick the type, the size and the place.</p><button className={s.addHeading} onClick={()=>add('text',{name:'Heading',text:'Your heading',font:'Canvas Condensed',fontSize:66,w:420,h:100})}>Add a heading <span>＋</span></button><button className={s.addSubheading} onClick={()=>add('text',{name:'Subheading',text:'Something worth tasting',fontSize:28,w:400,h:70})}>Add a subheading <span>＋</span></button><button className={s.addBody} onClick={()=>add('text',{name:'Body text',text:'A little story about your kitchen.',fontSize:17,w:330,h:90})}>Add body text <span>＋</span></button><div className={s.smallLabel}>TYPE PAIRINGS</div><button className={s.typePair} onClick={()=>add('text',{name:'Display lettering',text:'Made with love',font:'Canvas Display',fontSize:46,w:450,h:100,color:'#e96b27'})}><b>Made with love</b><span>Shrikhand · expressive display</span></button><button className={s.handPair} onClick={()=>add('text',{name:'Hand lettering',text:'Fresh every day',font:'Canvas Hand',fontSize:57,w:350,h:90})}>Fresh every day<span>Amatic SC · hand lettering</span></button></>}
        {tab==='fonts'&&<><p className={s.hint}>{selected?.kind==='text'||selected?.kind==='dish'?'Choose a font for the selected text.':'Choose a font to add a new text element.'}</p>{canvasFonts.map(font=><button key={font.name} className={s.fontCard} aria-label={`Use ${font.name} font`} onClick={()=>selected&&(selected.kind==='text'||selected.kind==='dish')?changeNode({font:font.family}):add('text',{name:`${font.name} text`,text:font.sample,font:font.family,fontSize:46,w:430,h:100})}><small>{font.name}</small><b style={{fontFamily:font.family}}>{font.sample}</b></button>)}</>}
        {tab==='elements'&&<><p className={s.hint}>Frames, dimensional objects and menu illustrations. Tap to add, then style and place them freely.</p>{canvasShapeGroups.map(group=><React.Fragment key={group.name}><div className={s.smallLabel}>{group.name}</div><div className={s.shapeGrid}>{group.shapes.map(shape=><button key={shape} aria-label={`Add ${shape} shape`} onClick={()=>add('shape',{name:`${shape} shape`,shape,fill:'#e96b27',w:shape==='line'?300:shape==='ring'?210:180,h:shape==='line'?4:shape==='ring'?130:180,radius:shape==='rect'?18:0})}><span className={`${s.shapeThumb} ${s[shape]||''}`}>{['cube','sphere','cylinder','cone','pyramid','ring'].includes(shape)&&<span className={`${s.shapeThumb3d} ${s[`shape3d-${shape}`]}`}/>}</span><small>{{rect:'Rectangle',ellipse:'Circle / oval',line:'Line',burst:'Burst',wave:'Wave',cube:'Cube',sphere:'Sphere',cylinder:'Cylinder',cone:'Cone',pyramid:'Pyramid',ring:'Ring'}[shape]}</small></button>)}</div></React.Fragment>)}<div className={s.smallLabel}>ICON LIBRARY · 48 DRAWINGS</div><input className={s.iconSearch} type="search" aria-label="Search icon library" placeholder="Search food, coffee, marks…" value={iconQuery} onChange={event=>setIconQuery(event.target.value)}/>{canvasIconGroups.map(group=>{const icons=group.icons.filter(icon=>icon.includes(iconQuery.trim().toLowerCase()));return icons.length?<React.Fragment key={group.name}><div className={s.iconGroupLabel}>{group.name}</div><div className={s.iconGrid}>{icons.map(icon=><button key={icon} aria-label={`Add ${icon} icon`} onClick={()=>add('icon',{name:`${icon} icon`,icon,w:150,h:150,color:'#144f3d'})}><Icon name={icon}/><small>{icon}</small></button>)}</div></React.Fragment>:null;})}<div className={s.tip}>✳ Make an icon oversized. Tuck it behind a dish. Rotate a stamp. There’s no prescribed position.</div></>}
        {tab==='illustrations'&&<>
          <p className={s.hint}>Local food art plus editable SVG drawings. Add an image, or choose a vector to change its key colors on the page.</p>
          <input className={s.iconSearch} type="search" aria-label="Search local PNG library" placeholder="Search tomato, coffee, sandwich…" value={assetQuery} onChange={event=>{setAssetQuery(event.target.value);setAssetLimit(48);}}/>
          <div className={s.assetFilters} aria-label="Filter PNG library">{assetGroups.map(group=><button key={group} type="button" aria-pressed={assetGroup===group} onClick={()=>{setAssetGroup(group);setAssetLimit(48);}}>{group}</button>)}</div>
          <div className={s.assetCount}>{matchingAssets.length} PNG assets · {matchingVectors.length} editable vectors</div>
          <div className={s.illustrationGrid}>{visibleAssets.map(asset=><button key={asset.id} aria-label={`Add ${asset.name} PNG`} onClick={()=>add('image',{name:asset.name,src:asset.src,w:210,h:190,creator:asset.creator,sourceName:asset.creator,sourceUrl:asset.sourceUrl,license:asset.license,licenseUrl:asset.licenseUrl})}><img src={asset.src} alt={asset.name} loading="lazy"/><small>{asset.name}</small></button>)}</div>
          {matchingAssets.length===0&&<p className={s.emptySearch}>No PNG assets match “{assetQuery}”.</p>}
          {visibleAssets.length<matchingAssets.length&&<button className={s.loadMoreAssets} onClick={()=>setAssetLimit(limit=>limit+48)}>Show more · {matchingAssets.length-visibleAssets.length} left</button>}
          <div className={s.vectorLibraryHeading}><span>RECOLORABLE VECTOR ART</span><small>SVG · resize without blur · change up to four colors after adding</small></div>
          <div className={s.illustrationGrid}>{matchingVectors.map(asset=><button key={asset.id} aria-label={`Add editable ${asset.name}`} onClick={()=>addVectorAsset(asset)}><img src={asset.src} alt="" loading="lazy"/><small>{asset.name} · SVG</small></button>)}</div>
          <p className={s.assetLicenseNote}>PNG artwork stays raster. Editable vector drawings use locally bundled Public Domain / CC0 Openclipart originals; source details are shown for each added layer.</p>
        </>}
        {tab==='media'&&<><p className={s.hint}>Upload your own photography, logos and illustrations. Local artwork remains available offline.</p><label className={s.uploadBox}><b>↑</b><strong>Upload your media</strong><span>PNG, JPG, WebP, SVG · up to 2 MB</span><input aria-label="Upload canvas media" type="file" accept="image/*" multiple onChange={upload}/></label>{uploadError&&<p role="alert" className={s.error}>{uploadError}</p>}<div className={s.mediaGrid}>{uploads.map((media,index)=><button key={index} aria-label={`Add uploaded ${media.name}`} onClick={()=>add('image',{name:media.name,src:media.src,w:300,h:240})}><img src={media.src} alt={media.name}/><span>{media.name}</span></button>)}</div><div className={s.smallLabel}>SAMPLE PHOTO SLOTS</div><div className={s.mediaGrid}>{makeSample('coffee').slice(0,6).map(item=><button key={item.id} aria-label={`Add ${item.name} photo`} onClick={()=>add('image',{name:item.name,crop:item.photo,w:210,h:230})}><NodeVisual node={makeNode('image',{id:item.id,crop:item.photo,name:item.name})} doc={doc}/><span>{item.name}</span></button>)}</div></>}
        {tab==='menu'&&<><div className={s.menuNote}>↗ LINKED TO SAMPLE MENU<p>Move and style these blocks freely. Their names, descriptions and prices stay connected to one menu source.</p></div>{doc.items.map(item=><button key={item.id} className={s.dishLibrary} onClick={()=>add('dish',{name:item.name,dishId:item.id,w:330,h:95,fontSize:21})}><strong>{item.name}</strong><span>{item.price} MAD <b>＋</b></span></button>)}<p className={s.hint}>Duplicate a linked block, then edit its price: both copies update.</p></>}
        {tab==='background'&&<><label className={s.colorField}>Paper color<input aria-label="Canvas background color" type="color" value={doc.paper} onInput={event=>patch({paper:event.currentTarget.value})}/></label><div className={s.smallLabel}>TEXTURES & PATTERNS</div><div className={s.backgroundGrid}>{(['plain','grid','dots','stripes','checker'] as const).map(value=><button key={value} aria-label={`Use ${value} background`} aria-pressed={doc.pattern===value} onClick={()=>setPattern(value)}><span className={s[value]}/><small>{value}</small></button>)}</div><label className={s.colorField}>Pattern ink<input type="color" value={doc.patternColor} onInput={event=>patch({patternColor:event.currentTarget.value})}/></label><div className={s.smallLabel}>LOCAL DECORATIVE BACKGROUNDS</div><p className={s.hint}>Choose an image to add it as a full-page layer. Select it on the canvas or in Layers to move and resize it.</p><div className={s.backgroundGrid}>{canvasBackgrounds.map(background=><button key={background.name} aria-label={`Add ${background.name} as a movable background layer`} aria-pressed={doc.elements.some(node=>node.backgroundLayer&&node.src===background.src)} onClick={()=>setBackgroundLayer(background.src,background.name)}><span style={{backgroundColor:background.swatch,backgroundImage:`url(${background.src})`,backgroundSize:'cover'}}/><small>{background.name}</small></button>)}</div><div className={s.smallLabel}>COLOR STORIES</div>{[['Paper & forest','#ece6cf','#144f3d'],['Cobalt & cream','#f3eddf','#103e89'],['Warm terracotta','#f6e4d6','#c44b32'],['The night menu','#173d35','#e2d7b6']].map(([name,paperColor,ink])=><button key={name} className={s.palette} onClick={()=>patch({paper:paperColor,patternColor:ink})}><i style={{background:paperColor}}/><i style={{background:ink}}/>{name}</button>)}{(doc.backgroundImage||doc.elements.some(node=>node.backgroundLayer))&&<button className={s.plainButton} onClick={()=>patch({backgroundImage:undefined,elements:doc.elements.filter(node=>!node.backgroundLayer)})}>Remove background image</button>}</>}
      </div><div className={s.libraryFooter}>FREEFORM PROTOTYPE<br/><span>Elements are independent. Nothing publishes.</span></div></aside>
      <section className={s.stageColumn}>
        <div className={s.selectionBar}>{selected&&!preview?<><span>{selected.kind==='dish'?'↗ Linked menu block':selected.name}</span><button onClick={duplicate} aria-label="Duplicate selected element">⧉ Duplicate</button><button onClick={()=>changeNode({locked:!selected.locked})}>{selected.locked?'Unlock':'Lock'}</button><button onClick={remove} disabled={selected.locked} aria-label="Delete selected element">⌫</button><button className={s.mobileButton} onClick={()=>setPanel('properties')}>Edit</button></>:<span>{preview?'PREVIEW · Your composition, without the editor.':'Click to select · drag to move · corner to resize · top handle to rotate'}</span>}<label><input type="checkbox" checked={snap} onChange={event=>setSnap(event.target.checked)}/> Snap guides</label></div>
        <div className={s.stage} ref={viewport} onPointerDown={event=>{if(event.target===event.currentTarget){setSelection(null);setPanel(null);}}}>
          <div className={s.pageStack}>
            {pages.map((page,index)=>{
              const isActive=index===pageIndex;
              const pageDoc=isActive?doc:page;
              const pagePattern=pageDoc.pattern==='grid'?`linear-gradient(${pageDoc.patternColor}20 1px,transparent 1px),linear-gradient(90deg,${pageDoc.patternColor}20 1px,transparent 1px)`:pageDoc.pattern==='dots'?`radial-gradient(${pageDoc.patternColor}45 1px,transparent 1px)`:pageDoc.pattern==='stripes'?`repeating-linear-gradient(135deg,${pageDoc.patternColor}15 0 7px,transparent 7px 25px)`:pageDoc.pattern==='checker'?`conic-gradient(${pageDoc.patternColor}12 25%,transparent 0 50%,${pageDoc.patternColor}12 0 75%,transparent 0)`:'none';
              return <div key={`page-${index}`} className={`${s.pageEntry} ${isActive?s.activePageEntry:''}`} onPointerDown={!isActive?()=>selectPage(index):undefined}>
                <div className={s.paperWrap} style={{width:pageDoc.w*scale,height:pageDoc.h*scale,margin:'20px auto 12px'}}>
                  <div className={s.paperLabel}><span>{String(index+1).padStart(2,'0')} — {pageDoc.title}</span><span>{pageDoc.w} × {pageDoc.h}</span></div>
                  <div className={`${s.paper} ${!isActive||preview?s.pageReadOnly:''}`} ref={isActive?paper:null} data-canvas-paper="true" style={{width:pageDoc.w,height:pageDoc.h,transform:`scale(${scale})`,transformOrigin:'top left',backgroundColor:pageDoc.paper,backgroundImage:pageDoc.backgroundImage?`url("${pageDoc.backgroundImage}")`:pagePattern,backgroundSize:pageDoc.backgroundImage?(canvasBackgrounds.find(value=>value.src===pageDoc.backgroundImage)?.size||'220px 220px'):pageDoc.pattern==='stripes'?'auto':pageDoc.pattern==='checker'?'48px 48px':'24px 24px',backgroundRepeat:pageDoc.backgroundImage?'no-repeat':'repeat','--canvas-scale':scale} as CSSProperties} onPointerDown={event=>{if(event.target===event.currentTarget&&isActive)setSelection(null);}}>
                    {pageDoc.elements.filter(node=>!node.hidden).map(node=>{
                      const editable=isActive&&!preview;
                      return <div key={node.id} data-canvas-element={node.id} role={editable?'button':undefined} tabIndex={editable?0:-1} aria-label={editable?`Select ${node.name}`:undefined} className={`${s.node} ${selection===node.id&&editable?s.selected:''} ${node.locked?s.locked:''} ${!editable?s.nodePreview:''}`} style={{left:node.x,top:node.y,width:node.w,height:node.h,transform:`rotate(${node.rotation}deg)`,opacity:node.opacity/100,color:node.color,fontFamily:node.font,fontSize:node.fontSize,fontWeight:node.bold?700:400,fontStyle:node.italic?'italic':'normal',textAlign:node.align,letterSpacing:node.tracking,borderRadius:node.radius}} onFocus={()=>{if(editable)setSelection(node.id);}} onPointerDown={editable?event=>start(event,node,'move'):undefined} onPointerMove={editable?move:undefined} onPointerUp={editable?end:undefined} onPointerCancel={editable?()=>{gesture.current=null;setLive(null);setGuides({x:false,y:false});}:undefined} onDoubleClick={editable?()=>{if(node.kind==='text'){setPanel('properties');requestAnimationFrame(()=>textEditor.current?.focus());}}:undefined}>
                        <NodeVisual node={node} doc={pageDoc}/>
                        {selection===node.id&&editable&&!node.locked&&<><span className={s.rotationStem}/><button className={s.rotateHandle} aria-label="Rotate selected element" onPointerDown={event=>start(event,node,'rotate')} onPointerMove={move} onPointerUp={end}/><button className={s.resizeHandle} aria-label="Resize selected element" onPointerDown={event=>start(event,node,'resize')} onPointerMove={move} onPointerUp={end}/><span className={s.positionLabel}>{Math.round(node.w)} × {Math.round(node.h)}</span></>}
                      </div>;
                    })}
                    {isActive&&guides.x&&<div className={s.guideX}/>} {isActive&&guides.y&&<div className={s.guideY}/>}
                  </div>
                </div>
                {!preview&&<button className={s.inlineAddPage} style={{width:Math.min(pageDoc.w*scale,340)}} onPointerDown={event=>event.stopPropagation()} onClick={()=>addPageAfter(index)}><span aria-hidden="true">＋</span><strong>Add a page</strong></button>}
              </div>;
            })}
          </div>
        </div>
        {!preview&&<nav className={s.pageStrip} aria-label="Pages in this design">{pages.map((page,index)=><button key={index} className={`${s.pageCard} ${pageIndex===index?s.activePage:''}`} aria-current={pageIndex===index?'page':undefined} aria-label={`Open page ${index+1}`} onClick={()=>selectPage(index)}><span className={s.pageThumb} style={{backgroundColor:page.paper}}><i style={{background:page.patternColor}}/><i style={{background:page.elements.find(node=>node.kind==='shape'&&node.fill!=='transparent')?.fill||page.patternColor}}/></span><span><b>Page {index+1}</b><small>{page.elements.length} elements</small></span></button>)}<div className={s.pageActions}><button aria-label="Duplicate current page" onClick={duplicatePage}>⧉ Duplicate</button><button aria-label="Delete current page" disabled={pages.length<2} onClick={deletePage}>⌫</button></div></nav>}
        <footer className={s.stageFooter}><button onClick={()=>setShowState(value=>!value)}>{showState?'Hide':'Inspect'} design state</button><span>{pageIndex+1}/{pages.length} pages · {doc.elements.length} elements · {selected?.locked?'Locked selection':preview?'Preview':'Drag anywhere'}</span><select aria-label="Canvas zoom" value={zoom} onChange={event=>setZoom(event.target.value)}><option value="fit">Fit page · {Math.round(scale*100)}%</option>{[.25,.5,.75,1,1.5].map(value=><option key={value} value={value}>{value*100}%</option>)}</select></footer>
        {showState&&<pre className={s.state}>{JSON.stringify({...doc,elements:doc.elements.map(node=>({...node,src:node.src?'[local uploaded image]':undefined})),backgroundImage:doc.backgroundImage?'[local image]':undefined},null,2)}</pre>}
      </section>
      <aside className={`${s.inspector} ${panel==='properties'?s.openPanel:''}`}><div className={s.panelHeading}><div><span>MAKE IT YOURS</span><h2>{selected?selected.kind==='dish'?'Menu block':'Element':'Page'}</h2></div><button className={s.mobileButton} aria-label="Close properties" onClick={()=>setPanel(null)}>×</button></div><div className={s.propertyContent}>
        {selected?<><div className={s.selectionName}>{selected.name}<small>{selected.kind==='dish'?'CONNECTED CONTENT':selected.kind.toUpperCase()}</small></div>{(selected.kind==='image'||selected.kind==='vector')&&selected.sourceUrl&&<div className={s.sourceCredit}><span>ASSET CREDIT</span><a href={selected.sourceUrl} target="_blank" rel="noreferrer">{selected.creator||selected.sourceName||'View source'}</a>{selected.licenseUrl&&<a href={selected.licenseUrl} target="_blank" rel="noreferrer">{selected.license?.toUpperCase()} license ↗</a>}</div>}<div className={s.geometry}>{fields}</div>
          {(selected.kind==='text'||selected.kind==='dish')&&<><div className={s.smallLabel}>TYPOGRAPHY</div><select aria-label="Selected element font" value={selected.font} onChange={event=>changeNode({font:event.target.value})}>{canvasFonts.map(font=><option key={font.name} value={font.family}>{font.name}</option>)}</select><div className={s.typeControls}><label>Size<input aria-label="Font size" type="number" min="6" max="500" value={Math.round(selected.fontSize)} onChange={event=>changeNode({fontSize:bound(Number(event.target.value),6,500)})}/></label><label>Tracking<input type="number" value={selected.tracking} onChange={event=>changeNode({tracking:Number(event.target.value)})}/></label></div><div className={s.formatting}><button aria-label="Bold text" aria-pressed={!!selected.bold} onClick={()=>changeNode({bold:!selected.bold})}><b>B</b></button><button aria-label="Italic text" aria-pressed={!!selected.italic} onClick={()=>changeNode({italic:!selected.italic})}><i>I</i></button>{(['left','center','right'] as const).map((align,index)=><button key={align} aria-label={`Align ${align}`} aria-pressed={selected.align===align} onClick={()=>changeNode({align})}>{['☰','≡','☰'][index]}</button>)}</div></>}
          {selected.kind==='text'&&<label className={s.field}>Text content<textarea ref={textEditor} aria-label="Text content" value={selected.text||''} onChange={event=>changeNode({text:event.target.value})}/></label>}
          {selected.kind==='dish'&&item&&<><label className={s.field}>Dish name<input value={item.name} onChange={event=>updateDish({name:event.target.value})}/></label><label className={s.field}>Price · MAD<input type="number" min="0" value={item.price} onChange={event=>updateDish({price:Math.max(0,Number(event.target.value))})}/></label><label className={s.field}>Description<textarea value={item.description} onChange={event=>updateDish({description:event.target.value})}/></label><label className={s.check}><input type="checkbox" checked={!!selected.feature} onChange={event=>changeNode({feature:event.target.checked})}/> Feature treatment</label><p className={s.hint}>Content changes update every block linked to this dish.</p></>}
          {selected.kind==='vector'&&<><div className={s.smallLabel}>VECTOR COLOR PALETTE</div><p className={s.hint}>Each swatch recolors one group in the original drawing.</p>{(selected.vectorColors||[]).map((color,index)=><label key={`${selected.id}-color-${index}`} className={s.colorField}>Color {index+1}<input aria-label={`Vector color ${index+1}`} type="color" value={color} onInput={event=>changeNode({vectorColors:(selected.vectorColors||[]).map((value,slot)=>slot===index?event.currentTarget.value:value)})}/></label>)}</>}
          {selected.kind!=='image'&&selected.kind!=='vector'&&<label className={s.colorField}>{selected.kind==='shape'?'Fill':'Color'}<input aria-label="Element color" type="color" value={selected.kind==='shape'&&selected.fill!=='transparent'?selected.fill:selected.color} onInput={event=>changeNode(selected.kind==='shape'?{fill:event.currentTarget.value}:{color:event.currentTarget.value})}/></label>}
          {(selected.kind==='shape'||selected.kind==='image')&&<label className={s.field}>Corner radius<input type="range" min="0" max="120" value={selected.radius} onChange={event=>changeNode({radius:Number(event.target.value)})}/></label>}
          {selected.kind==='shape'&&<div className={s.typeControls}><label>Border width<input type="number" min="0" max="30" value={selected.borderWidth} onChange={event=>changeNode({borderWidth:bound(Number(event.target.value),0,30)})}/></label><label>Border color<input aria-label="Border color" type="color" value={selected.border} onInput={event=>changeNode({border:event.currentTarget.value})}/></label></div>}
          <label className={s.field}>Opacity · {selected.opacity}%<input type="range" min="5" max="100" value={selected.opacity} onChange={event=>changeNode({opacity:Number(event.target.value)})}/></label>
          <div className={s.arrange}><button aria-label="Send selected element backward" onClick={()=>reorder(-1)}>↓ Backward</button><button aria-label="Bring selected element forward" onClick={()=>reorder(1)}>↑ Forward</button></div>
          {selected.kind==='image'&&selected.src&&!selected.backgroundLayer&&<button className={s.plainButton} onClick={()=>setBackgroundLayer(selected.src!,selected.name,selected.id)}>Use image as movable background</button>}
        </>:<><p className={s.hint}>Click an element to edit it. Or pick something from the library to start composing.</p><label className={s.colorField}>Page color<input type="color" value={doc.paper} onInput={event=>patch({paper:event.currentTarget.value})}/></label><div className={s.shortcutNote}>THE CANVAS IS YOURS<br/><span>Drag to move<br/>Corner handle to resize<br/>Top handle to rotate<br/>Arrow keys to nudge<br/>Shift for larger nudges<br/>⌘ / Ctrl D to duplicate<br/>⌘ / Ctrl Z to undo</span></div></>}
      </div><div className={s.layersHeader}><h3>Layers <span>{doc.elements.length}</span></h3><span>FRONT → BACK</span></div><div className={s.layers}>{[...doc.elements].reverse().map(node=><div key={node.id} className={`${s.layer} ${node.id===selection?s.activeLayer:''}`}><button aria-label={`Select layer ${node.name}`} onClick={()=>{setSelection(node.id);setPanel('properties');}}><i>{node.kind==='text'?'T':node.kind==='image'?'▧':node.kind==='vector'?'◇':node.kind==='dish'?'↗':node.kind==='icon'?'✳':'□'}</i><span>{node.name}</span></button><button aria-label={`${node.hidden?'Show':'Hide'} layer ${node.name}`} onClick={()=>patch({elements:doc.elements.map(value=>value.id===node.id?{...value,hidden:!value.hidden}:value)})}>{node.hidden?'○':'◉'}</button><button aria-label={`${node.locked?'Unlock':'Lock'} layer ${node.name}`} onClick={()=>patch({elements:doc.elements.map(value=>value.id===node.id?{...value,locked:!value.locked}:value)})}>{node.locked?'▣':'·'}</button></div>)}</div></aside>
    </main>
  </div>;
}
