'use client';

// Visual question: can four composition families express the seven supplied references
// while the owner edits one independent menu? In-memory only; never publishes.
import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { directions, initialProof, makeSample, type ProofState, type ProofItem, type DirectionId } from './compositionData';
import s from './composition.module.css';

function Photo({ item, className = '' }: { item: ProofItem; className?: string }) {
  const [x,y,width,height] = item.photo.box;
  const dimensions = item.photo.reference === 5 ? [736,1104] : [1199,1696];
  return <svg className={`${s.photo} ${className}`} viewBox={`${x} ${y} ${width} ${height}`} role="img" aria-label={`Illustrative ${item.name} photo`} preserveAspectRatio="xMidYMid slice">
    <image href={`/prototypes/menu-composer/reference-${item.photo.reference}.png`} width={dimensions[0]} height={dimensions[1]} />
  </svg>;
}
function Illustration({ kind = 'cup' }: { kind?: 'cup' | 'sun' }) {
  return <svg viewBox="0 0 180 180" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className={s.illustration}>
    {kind === 'cup' ? <><path d="M35 65h96l-10 64q-38 27-76 0Z M131 74q45-8 24 33-9 12-28 8 M24 145q67 28 133-2 M65 49q-15-12 1-25 M92 49q-15-12 1-25 M116 49q-15-12 1-25"/><path d="M58 87q20 26 48 0 M71 79v6m24-6v6"/></> : <><circle cx="90" cy="90" r="47"/><path d="M90 18V2m0 176v-16M18 90H2m176 0h-16M39 39 27 27m126 126-12-12M39 141l-12 12M153 27l-12 12 M64 82v7m52-7v7m-41 15q15 16 30 0"/></>}
  </svg>;
}
function Price({ item, state }: {item: ProofItem; state: ProofState}) { return state.prices ? <span className={s.price}>{item.price}<small> MAD</small></span> : null; }
function ItemText({ item, state }: {item: ProofItem; state: ProofState}) {
  return <><div className={s.namePrice}><h3>{item.name}</h3><Price item={item} state={state}/></div>{state.descriptions && <p className={s.description}>{item.description}</p>}</>;
}
interface CompositionProps { state: ProofState; onSelect: (item: ProofItem) => void; selected: string | null }
function ItemButton({item,state,onSelect,selected,children,className=''}:CompositionProps & {item:ProofItem;children:React.ReactNode;className?:string}) {
  return <button type="button" className={`${s.menuItem} ${className} ${selected===item.id?s.selectedItem:''}`} aria-label={`Edit ${item.name}`} onClick={()=>onSelect(item)}>{children}</button>;
}
export function EditorialComposition(props: CompositionProps) {
  const {state}=props;
  return <>
    <header className={s.editorialHeader}><div><span>{state.name}</span><h1>{state.direction==='merchant'?state.name:state.title}</h1><p>{state.subtitle}</p></div>{state.badges&&<div className={s.openStamp}>GOOD<br/>FOOD<br/><small>ALL DAY</small></div>}</header>
    <div className={s.editorialColumns}>{state.groups.map((group,index)=><section key={group.id} className={index===2?s.specialSection:''}>
      <h2>{group.name}</h2>{state.items.filter(item=>item.group===group.id&&!item.hidden).map(item=><ItemButton key={item.id} {...props} item={item}><ItemText item={item} state={state}/></ItemButton>)}
      {state.badges && state.direction==='retro' && index===0 && <Illustration/>}
      {state.badges && state.direction==='merchant' && <div className={s.bakeryStamp}>Made with care<br/><em>Every single day.</em></div>}
    </section>)}</div><footer className={s.menuFooter}>{state.footer}</footer>
  </>;
}
export function FeatureComposition(props: CompositionProps) {
  const {state}=props; const items=state.groups.flatMap(group=>state.items.filter(item=>item.group===group.id&&!item.hidden));
  return <><header className={s.featureHeader}><span>{state.name}</span><h1>{state.title}</h1><p>{state.subtitle}</p></header><div className={s.featureList}>{items.map((item,index)=><ItemButton key={item.id} {...props} item={item} className={s.featureItem}>
    {state.images&&<Photo item={item}/>}<div className={s.featureCopy}><ItemText item={item} state={state}/></div>{state.badges && index===0&&<span className={s.burst}>TRY<br/>SOMETHING<br/>GOOD</span>}
  </ItemButton>)}</div><footer className={s.menuFooter}>{state.footer}</footer></>;
}
export function TileComposition(props: CompositionProps) {
  const {state}=props;
  return <div className={s.tileGrid}><header className={s.tileHero}><span>{state.name}</span><h1 style={{fontSize:Math.min(240,960/Math.max(1,state.title.length))}}>{state.title}</h1><p>{state.subtitle}</p>{state.badges&&<i>ONLY<br/><b>THE GOOD<br/>STUFF</b></i>}</header>
    {state.groups.flatMap(group=>state.items.filter(item=>item.group===group.id&&!item.hidden)).map((item,index)=><ItemButton key={item.id} {...props} item={item} className={s.tileItem}>
      <div className={s.tileCopy}><span className={s.eyebrow}>{state.groups.find(group=>group.id===item.group)?.name}</span><h3>{item.name}</h3><Price item={item} state={state}/></div>
      {state.images&&<Photo item={item}/>} {state.badges&&index===4&&<span className={s.tileBadge}>DAILY<br/>INSPIRATION</span>}
    </ItemButton>)}<footer className={s.tileFooter}><span>GOOD FOOD<br/>GOOD MOOD</span><Illustration kind="sun"/><strong>{state.name}</strong><p>{state.footer}</p></footer></div>;
}
export function CoffeeComposition(props: CompositionProps) {
  const {state}=props;
  return <><header className={s.coffeeHeader}><h1>{state.name}</h1><span>{state.title==='MENU'?'CAFÉ / CARTE':state.title}</span></header><div className={s.coffeeGrid}>
    {state.groups.flatMap(group=>state.items.filter(item=>item.group===group.id&&!item.hidden)).map(item=><ItemButton key={item.id} {...props} item={item} className={s.coffeeItem}>
      <div className={s.coffeeCopy}><h3>{item.name}</h3><Price item={item} state={state}/></div>{state.images&&<Photo item={item}/>} {state.descriptions&&<p>{item.description}</p>}
    </ItemButton>)}
  </div><footer className={s.menuFooter}><strong>{state.subtitle}</strong><span>{state.footer}</span></footer></>;
}
const compositions = { editorial:EditorialComposition,feature:FeatureComposition,tiles:TileComposition,coffee:CoffeeComposition };

export function MenuCompositionPrototype() {
  const router=useRouter(); const params=useSearchParams();
  const requested=directions.find(direction=>direction.id===params.get('variant'))?.id || 'tiles';
  const [history,setHistory]=useState<ProofState[]>([{...initialProof,direction:requested,...(requested==='coffee'?{items:makeSample('coffee'),groups:[{id:'first',name:'Espresso bar'},{id:'second',name:'Over ice'},{id:'third',name:'Slow favourites'}]}: {})}]); const [cursor,setCursor]=useState(0);
  const state=history[cursor]; const direction=directions.find(value=>value.id===state.direction)!;
  const [tab,setTab]=useState<'design'|'content'|'blocks'>('design'); const [selected,setSelected]=useState<string|null>(null);
  const [compare,setCompare]=useState(false); const [mobile,setMobile]=useState(false); const [pane,setPane]=useState<'edit'|'preview'>('preview');
  const [width,setWidth]=useState(800); const viewport=useRef<HTMLDivElement>(null); const canvas=useRef<HTMLDivElement>(null); const [height,setHeight]=useState(1100);
  const [showState,setShowState]=useState(false);
  const update=(change:(value:ProofState)=>ProofState)=>{setHistory(values=>[...values.slice(0,cursor+1),change(state)]);setCursor(cursor+1);};
  const patch=(change:Partial<ProofState>)=>update(value=>({...value,...change}));
  const choose=(id:DirectionId)=>{if(id===state.direction)return;patch({direction:id});};
  useEffect(()=>{const query=new URLSearchParams(params.toString());query.set('variant',state.direction);router.replace(`?${query}`,{scroll:false});},[state.direction]); // prototype URL follows history too
  useEffect(()=>{const observer=new ResizeObserver(entries=>setWidth(entries[0].contentRect.width));if(viewport.current)observer.observe(viewport.current);return()=>observer.disconnect();},[]);
  useEffect(()=>{const observer=new ResizeObserver(entries=>setHeight(entries[0].contentRect.height));if(canvas.current)observer.observe(canvas.current);return()=>observer.disconnect();},[]);
  useEffect(()=>{const listener=(event:KeyboardEvent)=>{if(event.target instanceof HTMLElement&&(event.target.closest('input,textarea,select,[contenteditable="true"]')))return;if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const index=directions.findIndex(value=>value.id===state.direction);choose(directions[(index+(event.key==='ArrowRight'?1:6))%7].id);};window.addEventListener('keydown',listener);return()=>window.removeEventListener('keydown',listener);});
  const changeSample=(kind:'food'|'coffee')=>{patch({items:makeSample(kind),groups:kind==='food'?initialProof.groups:[{id:'first',name:'Espresso bar'},{id:'second',name:'Over ice'},{id:'third',name:'Slow favourites'}]});setSelected(null);};
  const editItem=(item:ProofItem)=>{setSelected(item.id);setTab('content');setPane('edit');};
  const item=state.items.find(value=>value.id===selected);
  const changeItem=(change:Partial<ProofItem>)=>patch({items:state.items.map(value=>value.id===selected?{...value,...change}:value)});
  const pageWidth=mobile?390:760; const scale=Math.min(1,(width-(compare?32:0))/(compare?2:1)/pageWidth);
  const Composition=compositions[direction.family];
  const style={'--proof-ink':state.accent||direction.ink,'--proof-paper':state.paper||direction.paper} as CSSProperties;
  return <div className={s.studio}>
    <header className={s.studioHeader}><a href="/builder" className={s.brand}>MenuCraft<span>✳</span></a><span className={s.labLabel}>COMPOSITION LAB <b>VISUAL PROOF</b></span><div className={s.headerActions}><span>Sample menu · not published</span><button onClick={()=>setCursor(value=>value-1)} disabled={cursor===0} aria-label="Undo prototype change">↶</button><button onClick={()=>setCursor(value=>value+1)} disabled={cursor===history.length-1} aria-label="Redo prototype change">↷</button><a href="/prototype/menu-composition?mode=canvas">Try the freeform canvas ↗</a><a href="/builder">Back to builder ↗</a></div></header>
    <div className={s.intro}><div><span className={s.kicker}>YOUR REFERENCES, REBUILT AS EDITABLE COMPOSITIONS</span><h1>A menu with some character.</h1></div><p>Choose a direction. Make it yours.<br/>The content stays; the composition changes.</p></div>
    <div className={s.mobileTabs}><button aria-pressed={pane==='edit'} onClick={()=>setPane('edit')}>Edit menu</button><button aria-pressed={pane==='preview'} onClick={()=>setPane('preview')}>Live preview</button></div>
    <div className={s.workspace}>
      <aside className={`${s.sidebar} ${pane==='preview'?s.hideMobile:''}`}><nav className={s.tabs}>{(['design','content','blocks'] as const).map(value=><button key={value} aria-pressed={tab===value} onClick={()=>setTab(value)}>{value}</button>)}</nav>
        <div className={s.controls}>
          {tab==='design'&&<><div className={s.controlHeading}><span>01 / ART DIRECTION</span><h2>Start with a point of view.</h2></div><div className={s.directionList}>{directions.map(value=><button key={value.id} onClick={()=>choose(value.id)} aria-label={`Choose ${value.name}`} aria-pressed={value.id===state.direction} className={s.directionButton}><span className={s.swatch} style={{background:value.paper,color:value.ink}}>{String(value.ref).padStart(2,'0')}<b>{value.family==='coffee'?'Aa':value.family==='tiles'?'▦':value.family==='feature'?'◒':'≡'}</b></span><span><strong>{value.name}</strong><small>{value.note}</small></span><span>{value.id===state.direction?'●':'↗'}</span></button>)}</div>
          <div className={s.controlHeading}><span>02 / MAKE IT YOURS</span></div><div className={s.colors}><label>Ink<input type="color" value={state.accent||direction.ink} onChange={event=>patch({accent:event.target.value})}/></label><label>Paper<input type="color" value={state.paper||direction.paper} onChange={event=>patch({paper:event.target.value})}/></label><button onClick={()=>patch({accent:undefined,paper:undefined})}>Reset colors ↺</button></div>
          {direction.family!=='editorial'?<label className={s.toggle}><input type="checkbox" checked={state.images} onChange={event=>patch({images:event.target.checked})}/> Show photography</label>:<p className={s.finePrint}>This composition focuses on typography. Your photos stay attached for other layouts.</p>}{direction.family!=='coffee'&&state.direction!=='wave'&&<label className={s.toggle}><input type="checkbox" checked={state.badges} onChange={event=>patch({badges:event.target.checked})}/> Decorative stamps & badges</label>}<label className={s.toggle}><input type="checkbox" checked={state.compact} onChange={event=>patch({compact:event.target.checked})}/> Compact spacing</label></>}
          {tab==='content'&&<><div className={s.controlHeading}><span>THE SAME MENU IN EVERY DESIGN</span><h2>{item?'Edit a menu item':'Words worth reading.'}</h2></div>{item?<><button className={s.backButton} onClick={()=>setSelected(null)}>← All content</button><label>Dish name<input value={item.name} onChange={event=>changeItem({name:event.target.value})}/></label><label>Description<textarea value={item.description} onChange={event=>changeItem({description:event.target.value})}/></label><label>Price · MAD<input type="number" min="0" value={item.price} onChange={event=>changeItem({price:Math.max(0,Number(event.target.value))})}/></label><label>Section<select value={item.group} onChange={event=>changeItem({group:event.target.value})}>{state.groups.map(group=><option key={group.id} value={group.id}>{group.name}</option>)}</select></label><label className={s.toggle}><input type="checkbox" checked={!item.hidden} onChange={event=>changeItem({hidden:!event.target.checked})}/> Show this dish</label><label>Photo example<select value={item.photo.reference===7?'coffee':'food'} onChange={event=>changeItem({photo:makeSample(event.target.value as 'food'|'coffee')[0].photo})}><option value="food">Food photography</option><option value="coffee">Coffee photography</option></select></label><p className={s.finePrint}>Demo photos are display crops from your supplied references. They are separate image slots; production asset upload and cutouts are a later step.</p></>:<><label>Restaurant name<input value={state.name} onChange={event=>patch({name:event.target.value})}/></label><label>Menu title<input value={state.title} onChange={event=>patch({title:event.target.value})}/></label><label>Tagline<input value={state.subtitle} onChange={event=>patch({subtitle:event.target.value})}/></label><label>Footer<input value={state.footer} onChange={event=>patch({footer:event.target.value})}/></label><div className={s.sampleButtons}><button onClick={()=>changeSample('food')}>Load food example</button><button onClick={()=>changeSample('coffee')}>Load café example</button></div>{state.items.map(value=><button key={value.id} className={s.contentRow} onClick={()=>editItem(value)}><span>{value.name}{value.hidden?' · Hidden':''}</span><b>{value.price} ↗</b></button>)}<button className={s.addButton} onClick={()=>patch({items:[...state.items,{...state.items[0],id:`new-${Date.now()}`,name:'New menu item',price:35,group:state.groups[0].id}]})}>＋ Add a menu item</button></>}</>}
          {tab==='blocks'&&<><div className={s.controlHeading}><span>CONTENT & COMPOSITION</span><h2>Arrange, without fuss.</h2></div><p className={s.finePrint}>Sections flow through the chosen composition. Reordering them keeps every dish and photo attached.</p>{state.groups.map((group,index)=><div key={group.id} className={s.groupRow}><input aria-label={`Section ${index+1} name`} value={group.name} onChange={event=>patch({groups:state.groups.map(value=>value.id===group.id?{...value,name:event.target.value}:value)})}/><button disabled={index===0} aria-label={`Move ${group.name} up`} onClick={()=>{const groups=[...state.groups];[groups[index-1],groups[index]]=[groups[index],groups[index-1]];patch({groups});}}>↑</button><button disabled={index===state.groups.length-1} aria-label={`Move ${group.name} down`} onClick={()=>{const groups=[...state.groups];[groups[index+1],groups[index]]=[groups[index],groups[index+1]];patch({groups});}}>↓</button></div>)}<label className={s.toggle}><input type="checkbox" checked={state.prices} onChange={event=>patch({prices:event.target.checked})}/> Show prices</label><label className={s.toggle}><input type="checkbox" checked={state.descriptions} onChange={event=>patch({descriptions:event.target.checked})}/> Show descriptions where supported</label><div className={s.structure}><span>THIS COMPOSITION</span><strong>{direction.family==='tiles'?'Title tile → dish tiles → brand tile':direction.family==='coffee'?'Masthead → mixed-width product cells → footer':direction.family==='feature'?'Display title → alternating photo features → footer':'Masthead → section columns → specials → footer'}</strong></div></>}
          <button className={s.stateToggle} onClick={()=>setShowState(value=>!value)}>{showState?'− Hide':'＋ Inspect'} prototype state</button>{showState&&<pre className={s.state}>{JSON.stringify(state,null,2)}</pre>}
        </div><div className={s.prototypeNote}>PROTOTYPE · Changes stay in this page.<br/>No effect on your saved or published menu.</div>
      </aside>
      <section className={`${s.previewPane} ${pane==='edit'?s.hideMobile:''}`} aria-label="Composition preview"><div className={s.previewToolbar}><span><i/> LIVE COMPOSITION <small>{state.items.filter(value=>!value.hidden).length} dishes</small></span><div><button aria-pressed={!mobile} onClick={()=>setMobile(false)}>Poster</button><button aria-pressed={mobile} onClick={()=>setMobile(true)}>Mobile</button><button aria-pressed={compare} onClick={()=>setCompare(value=>!value)}>Compare reference ↗</button></div></div>
        <div className={s.canvasScroll}><div className={s.canvasViewport} ref={viewport}><div className={s.canvasPair}>
          <div className={s.paperColumn}><div className={s.paperLabel}>EDITABLE PROOF <span>{direction.name}</span></div><div style={{width:pageWidth*scale,height:height*scale}} className={s.canvasSpace}><div ref={canvas} className={`${s.canvas} ${s[direction.id]} ${state.compact?s.compact:''}`} data-mobile={mobile} style={{...style,width:pageWidth,transform:`scale(${scale})`,transformOrigin:'top left'}}><Composition state={state} onSelect={editItem} selected={selected}/></div></div></div>
          {compare&&<div className={s.paperColumn}><div className={s.paperLabel}>YOUR REFERENCE <span>{String(direction.ref).padStart(2,'0')}</span></div><img className={s.reference} src={`/prototypes/menu-composer/reference-${direction.ref}.png`} alt={`Supplied reference ${direction.ref}`} style={{width:pageWidth*scale}}/></div>}
        </div></div><p className={s.previewFootnote}>A working composition study. Sample content and reference imagery; not a finished publishing template.</p></div>
      </section>
    </div>
    <div className={s.switcher}><button aria-label="Previous composition" onClick={()=>choose(directions[(direction.ref+5)%7].id)}>←</button><span><b>{String(direction.ref).padStart(2,'0')} / 07</b> {direction.name}</span><button aria-label="Next composition" onClick={()=>choose(directions[direction.ref%7].id)}>→</button></div>
  </div>;
}
