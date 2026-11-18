import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MenuPrototypeEntry } from '@/components/builder/prototype/MenuPrototypeEntry';

// Review entry for sample data only. The real builder keeps its existing authentication.
export default function CompositionProofPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <Suspense fallback={<p className="p-8">Opening the composition lab…</p>}><MenuPrototypeEntry/></Suspense>;
}
