import Link from 'next/link';
import { Property, typeLabel } from '@/data/properties';
import { clp, propertyWa } from '@/lib/site';

export default function PropertyCard({ p }: { p: Property }) {
  const url = `/propiedades/${p.slug}/`;
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:border-gold/50">
      <Link href={url} className="relative block aspect-[4/3] overflow-hidden bg-obsidian">
        {p.images[0] ? (
          <img src={p.images[0]} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-brand text-steel">Foto pendiente</div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {!p.verified && <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Demo</span>}
          {p.featured && p.verified && <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-obsidian">Destacada</span>}
          <span className="rounded-full bg-obsidian/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ivory">{p.availability}</span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">{typeLabel[p.type]} · {p.commune}</p>
        <h3 className="mt-2 font-display text-2xl uppercase leading-tight">{p.title}</h3>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-3xl text-gold">{clp(p.price)}</span>
          <span className="text-xs text-steel">{p.operation === 'arriendo' ? '/ mes' : ''}</span>
          {p.priceBefore && <span className="text-sm text-steel line-through">{clp(p.priceBefore)}</span>}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ivory/70">
          {p.bedrooms != null && <li>{p.bedrooms} dorm.</li>}
          {p.bathrooms != null && <li>{p.bathrooms} baño{p.bathrooms > 1 ? 's' : ''}</li>}
          {p.parking != null && <li>{p.parking} estac.</li>}
          <li>{p.areaM2 ? `${p.areaM2} m²` : 'm² por confirmar'}</li>
        </ul>
        <div className="mt-auto flex gap-2 pt-5">
          <Link href={url} className="btn-ghost flex-1 px-4 py-3 text-xs">Ver detalle</Link>
          {p.verified && (
            <a href={propertyWa(p.ref, p.title, p.slug, 'quiero más información')} target="_blank" rel="noopener" className="btn-gold px-4 py-3 text-xs">WhatsApp</a>
          )}
        </div>
      </div>
    </article>
  );
}
