'use client';
import { useSearchParams } from 'next/navigation';
import { MenuCanvasPrototype } from './MenuCanvasPrototype';
import { MenuCompositionPrototype } from './MenuCompositionPrototype';
export function MenuPrototypeEntry(){
  return useSearchParams().get('mode')==='canvas'?<MenuCanvasPrototype/>:<MenuCompositionPrototype/>;
}
