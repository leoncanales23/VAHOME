'use client';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/data/properties';
import { useSaved } from '@/lib/saved';

export default function Favorites() {
  const { list, clear } = useSaved('favoritos');
  const items = list.map((s) => properties.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => !!p);
  if (items.length === 0) {
    return (
      <div className="card mt-10 p-8 text-ivory/80">
        <p>Aún no guardas propiedades. Toca <span className="text-gold">♡ Guardar</span> en cualquier tarjeta para verla aquí.</p>
        <Link href="/propiedades/" className="btn-gold mt-6">Ver propiedades</Link>
      </div>
    );
  }
  return (
    <>
      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-steel" aria-live="polite">{items.length} guardada{items.length !== 1 ? 's' : ''} en este dispositivo</p>
        <button type="button" onClick={clear} className="text-sm text-ivory/70 underline hover:text-gold">Vaciar lista</button>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <PropertyCard key={p.slug} p={p} />)}</div>
    </>
  );
}
