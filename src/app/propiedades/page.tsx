import type { Metadata } from 'next';
import { Suspense } from 'react';
import Catalog from './Catalog';
export const metadata: Metadata = { title: 'Propiedades', description: 'Casas, departamentos y locales comerciales en arriendo.' };
export default function Page() {
  return (
    <div className="container-va pb-24 pt-32">
      <p className="eyebrow">Catálogo</p>
      <h1 className="h-display mt-3 text-5xl md:text-7xl">No busques más.<br /><span className="text-gold">Encuentra tu lugar.</span></h1>
      <Suspense fallback={<p className="mt-10 text-steel">Cargando…</p>}><Catalog /></Suspense>
    </div>
  );
}
