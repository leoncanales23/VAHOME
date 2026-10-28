import type { Metadata } from 'next';
import Compare from './Compare';

export const metadata: Metadata = { title: 'Comparar propiedades', robots: { index: false } };

export default function Page() {
  return (
    <div className="container-va pb-24 pt-28">
      <p className="eyebrow">Lado a lado</p>
      <h1 className="h-display mt-3 text-5xl md:text-6xl">Comparar</h1>
      <Compare />
    </div>
  );
}
