'use client';
import { useEffect, useState } from 'react';
export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight') setI((v) => (v + 1) % images.length);
      if (e.key === 'ArrowLeft') setI((v) => (v - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [open, images.length]);
  if (!images.length) return <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-charcoal text-steel">Fotografías pendientes</div>;
  return (
    <div>
      <button onClick={() => setOpen(true)} className="block w-full overflow-hidden rounded-2xl" aria-label="Ampliar galería">
        <img src={images[i]} alt={`${title} — foto ${i + 1}`} className="aspect-[16/10] w-full object-cover" />
      </button>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {images.map((s, k) => (
          <button key={s} onClick={() => setI(k)} aria-label={`Ver foto ${k + 1}`} className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${k === i ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}>
            <img src={s} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Galería" className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4" onClick={() => setOpen(false)}>
          <img src={images[i]} alt={`${title} — foto ${i + 1}`} className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-5 top-5 text-3xl text-ivory" aria-label="Cerrar">×</button>
          <button className="absolute left-3 top-1/2 text-4xl text-ivory" aria-label="Anterior" onClick={(e) => { e.stopPropagation(); setI((i - 1 + images.length) % images.length); }}>‹</button>
          <button className="absolute right-3 top-1/2 text-4xl text-ivory" aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); setI((i + 1) % images.length); }}>›</button>
        </div>
      )}
    </div>
  );
}
