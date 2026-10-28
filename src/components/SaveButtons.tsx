'use client';
import { COMPARE_MAX, useSaved } from '@/lib/saved';

export default function SaveButtons({ slug, title, className = '' }: { slug: string; title: string; className?: string }) {
  const fav = useSaved('favoritos');
  const cmp = useSaved('comparar');
  const isFav = fav.has(slug);
  const isCmp = cmp.has(slug);
  const full = !isCmp && cmp.list.length >= COMPARE_MAX;
  const base = 'flex h-9 items-center justify-center rounded-full bg-obsidian/80 px-3 text-[11px] font-semibold uppercase tracking-wider backdrop-blur transition hover:bg-obsidian focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold';
  return (
    <div className={`flex gap-2 ${className}`}>
      <button type="button" onClick={() => fav.toggle(slug)} aria-pressed={isFav} aria-label={`${isFav ? 'Quitar de' : 'Guardar en'} favoritos: ${title}`}
        className={`${base} ${isFav ? 'text-gold' : 'text-ivory'}`}>{isFav ? '♥ Guardada' : '♡ Guardar'}</button>
      <button type="button" onClick={() => cmp.toggle(slug)} aria-pressed={isCmp} disabled={full}
        title={full ? `Máximo ${COMPARE_MAX} propiedades` : undefined} aria-label={`${isCmp ? 'Quitar de' : 'Agregar a'} comparar: ${title}`}
        className={`${base} ${isCmp ? 'text-gold' : 'text-ivory'} disabled:opacity-40`}>{isCmp ? '✓ Comparando' : '⇄ Comparar'}</button>
    </div>
  );
}
