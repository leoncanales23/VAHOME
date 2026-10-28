'use client';
import Link from 'next/link';
import { areaOf, fmtM, properties, typeLabel } from '@/data/properties';
import { COMPARE_MAX, useSaved } from '@/lib/saved';
import { clp, propertyWa } from '@/lib/site';

const dash = '—';

export default function Compare() {
  const { list, toggle, clear } = useSaved('comparar');
  const items = list.map((s) => properties.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => !!p);
  if (items.length < 2) {
    return (
      <div className="card mt-10 p-8 text-ivory/80">
        <p>Elige al menos 2 propiedades (hasta {COMPARE_MAX}) con <span className="text-gold">⇄ Comparar</span> para verlas lado a lado.{items.length === 1 && ' Llevas 1.'}</p>
        <Link href="/propiedades/" className="btn-gold mt-6">Ver propiedades</Link>
      </div>
    );
  }
  const rows: { label: string; get: (p: (typeof items)[number]) => string }[] = [
    { label: 'Operación', get: (p) => (p.operation === 'arriendo' ? 'Arriendo' : 'Venta') },
    { label: 'Tipo', get: (p) => typeLabel[p.type] },
    { label: 'Comuna', get: (p) => p.commune },
    { label: 'Precio', get: (p) => clp(p.price) + (p.operation === 'arriendo' ? ' / mes' : '') },
    { label: 'Superficie', get: (p) => (areaOf(p) ? `${fmtM(areaOf(p)!)} m²` : 'Por confirmar') },
    { label: 'Medidas', get: (p) => (p.dimensions ? `${fmtM(p.dimensions.widthM)} × ${fmtM(p.dimensions.lengthM)} m` + (p.dimensions.heightM ? ` · alto ${fmtM(p.dimensions.heightM)} m` : '') : dash) },
    { label: 'Dormitorios', get: (p) => (p.bedrooms != null ? String(p.bedrooms) : dash) },
    { label: 'Baños', get: (p) => (p.bathrooms != null ? String(p.bathrooms) : dash) },
    { label: 'Estacionamientos', get: (p) => (p.parking != null ? String(p.parking) : dash) },
    { label: 'Costos adicionales', get: (p) => (p.extraCosts?.length ? p.extraCosts.map((c) => `${c.label}: ${clp(c.amount)}`).join(' · ') : dash) },
    { label: 'Estado', get: (p) => p.availability },
  ];
  return (
    <>
      <div className="mt-8 flex justify-end"><button type="button" onClick={clear} className="text-sm text-ivory/70 underline hover:text-gold">Vaciar comparador</button></div>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 align-bottom">
              <th scope="col" className="w-40 p-4"><span className="sr-only">Característica</span></th>
              {items.map((p) => (
                <th key={p.slug} scope="col" className="p-4 align-top font-normal">
                  <Link href={`/propiedades/${p.slug}/`} className="font-display text-xl uppercase leading-tight hover:text-gold">{p.title}</Link>
                  <p className="mt-1 text-xs text-steel">{p.ref}{!p.verified && ' · DEMO'}</p>
                  <button type="button" onClick={() => toggle(p.slug)} className="mt-2 text-xs text-ivory/60 underline hover:text-gold">Quitar</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-white/5 last:border-0">
                <th scope="row" className="p-4 text-xs font-semibold uppercase tracking-wider text-steel">{r.label}</th>
                {items.map((p) => <td key={p.slug} className="p-4 text-ivory/90">{r.get(p)}</td>)}
              </tr>
            ))}
            <tr>
              <th scope="row" className="p-4"><span className="sr-only">Contacto</span></th>
              {items.map((p) => (
                <td key={p.slug} className="p-4">
                  {p.verified
                    ? <a href={propertyWa(p.ref, p.title, p.slug)} target="_blank" rel="noopener" className="btn-gold px-5 py-3 text-xs">Coordinar visita</a>
                    : <span className="text-xs text-steel">Ficha demo</span>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
