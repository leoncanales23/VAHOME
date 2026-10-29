'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Property } from '@/data/properties';
import { propertyWa } from '@/lib/site';

// «¿Qué puede ser este local?»: el mismo espacio imaginado para distintos rubros.
// Con `property.uses` se muestran simulaciones con IA del local real (siempre rotuladas); si no, esquemas SVG.
// Cada «Me interesa» abre WhatsApp con el rubro y lleva data-rubro para medir qué negocios busca la gente.

type Rubro = { id: string; title: string; text: string; href?: string; cta?: string };

const RUBROS: Rubro[] = [
  { id: 'cafe', title: 'Café para llevar de especialidad', text: 'Barra, máquina de espresso y vitrina de pastelería. Kaldi Coffee lo entrega instalado, llave en mano.', href: '/kaldi/', cta: 'Ver Kaldi llave en mano' },
  { id: 'joyeria', title: 'Joyería', text: 'Vitrinas iluminadas en la esquina, en la misma galería de joyerías. El flujo de público ya es el correcto.' },
  { id: 'barberia', title: 'Barbería', text: 'Uno o dos sillones, espejo y lavapelo; la vitrina en esquina hace de letrero.' },
  { id: 'jugueteria', title: 'Juguetería', text: 'Estanterías a la vista desde el pasillo y un mostrador pequeño junto a la entrada.' },
  { id: 'floreria', title: 'Florería', text: 'Flores frescas a la vista desde el pasillo y un mesón para armar ramos; la esquina se convierte en vitrina de color.' },
  { id: 'celulares', title: 'Accesorios y servicio técnico de celulares', text: 'Muro de carcasas, cargadores y audífonos, más un mesón de reparación y soporte tecnológico a la vista del cliente.' },
  { id: 'cajeros', title: 'Zona de cajeros automáticos', text: 'Espacio para que un banco instale cajeros en un punto de alto flujo peatonal. La imagen usa un banco ficticio («Banco X»).' },
  { id: 'defensa', title: 'Defensa personal', text: 'Exhibidor de pared y mostrador cerrado. La venta de cada producto queda sujeta a la normativa vigente y sus permisos.' },
];

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

// Marco común: vitrina en esquina con doble frente, cortina metálica arriba y luz LED.
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 240 160" className="h-auto w-full text-gold" role="img" aria-hidden="true">
      <rect x="0" y="0" width="240" height="160" fill="#0B0D10" />
      <g {...stroke} strokeWidth={1.5} opacity={0.5}>
        <path d="M20 30 H140 L220 46 V150 H20 Z" />
        <path d="M140 30 V150" />
        <path d="M20 38 H140 L220 54" strokeDasharray="3 4" />
      </g>
      <g {...stroke} opacity={0.35}><path d="M30 34 H130" strokeWidth={3} /></g>
      {children}
      <path d="M10 150 H230" stroke="currentColor" strokeWidth={1} opacity={0.4} />
    </svg>
  );
}

export function RubroDrawing({ id }: { id: string }) {
  switch (id) {
    case 'cafe':
      return <Frame><g {...stroke}><path d="M34 150 V110 H126 V150" /><path d="M34 118 H126" /><rect x="48" y="90" width="26" height="20" rx="3" /><path d="M56 90 V84 M66 90 V84" /><path d="M150 150 V100 H206 V150" /><path d="M150 116 H206 M150 132 H206" /><circle cx="164" cy="110" r="3" /><circle cx="178" cy="110" r="3" /><circle cx="192" cy="110" r="3" /><path d="M90 96 h14 l-2 14 h-10 z M104 100 h4 a3 3 0 0 1 0 6 h-3" /><rect x="40" y="50" width="80" height="26" rx="2" strokeWidth={1.5} /><path d="M48 58 H86 M48 66 H100" strokeWidth={1.2} /></g></Frame>;
    case 'joyeria':
      return <Frame><g {...stroke}><rect x="34" y="104" width="44" height="46" /><rect x="88" y="104" width="44" height="46" /><path d="M34 118 H78 M88 118 H132" /><path d="M150 150 V96 L206 106 V150" /><path d="M150 112 L206 122" /><circle cx="56" cy="112" r="3" /><circle cx="110" cy="112" r="3" /><path d="M168 104 l4 -6 l4 6 l-4 4 z M188 108 l4 -6 l4 6 l-4 4 z" /><path d="M40 60 l6 -10 l6 10 l-6 6 z" strokeWidth={1.5} /><path d="M38 44 V40 M46 40 V34 M54 44 V40" strokeWidth={1.2} /></g></Frame>;
    case 'barberia':
      return <Frame><g {...stroke}><rect x="40" y="56" width="40" height="46" rx="4" /><path d="M48 150 V138 H72 V150 M44 138 H76 V122 H44 Z M50 122 V112 H70 V122" /><rect x="100" y="56" width="40" height="46" rx="4" /><path d="M108 150 V138 H132 V150 M104 138 H136 V122 H104 Z M110 122 V112 H130 V122" /><rect x="180" y="62" width="10" height="70" rx="5" /><path d="M180 72 L190 82 M180 90 L190 100 M180 108 L190 118" strokeWidth={1.5} /><path d="M185 132 V150" /></g></Frame>;
    case 'jugueteria':
      return <Frame><g {...stroke}><path d="M30 150 V58 H130 V150 M30 88 H130 M30 118 H130" /><rect x="40" y="70" width="14" height="18" /><circle cx="70" cy="80" r="8" /><path d="M90 88 l10 -18 l10 18 z" /><rect x="44" y="100" width="22" height="18" /><path d="M78 118 v-12 h20 v12 M84 106 v-6 h8 v6" /><circle cx="112" cy="110" r="7" /><path d="M156 150 V120 H206 V150" /><path d="M166 120 l6 -14 h14 l6 14" /><circle cx="176" cy="100" r="5" /></g></Frame>;
    case 'defensa':
      return <Frame><g {...stroke}><rect x="34" y="54" width="96" height="60" rx="2" /><path d="M34 74 H130 M34 94 H130" strokeWidth={1.2} /><rect x="44" y="60" width="8" height="12" rx="2" /><rect x="60" y="60" width="8" height="12" rx="2" /><rect x="76" y="60" width="8" height="12" rx="2" /><path d="M96 66 h24 M100 82 h20 M46 82 h30" /><path d="M48 100 l8 8 l14 -14" /><path d="M150 150 V112 H206 V150" /><path d="M150 124 H206" /><path d="M178 92 l14 6 v10 c0 8 -6 12 -14 16 c-8 -4 -14 -8 -14 -16 v-10 z" /></g></Frame>;
    default:
      return null;
  }
}

// Carrusel: una simulación grande con su texto y botones; debajo, miniaturas difuminadas de los otros rubros
// que se aclaran al pasar el cursor o al elegirlas. Flechas, teclado y deslizar con el dedo.
export default function UsosLocal({ title = '¿Qué puede ser este local?', property }: { title?: string; property: Pick<Property, 'ref' | 'title' | 'slug' | 'uses'> }) {
  const sims = property.uses ?? {};
  const hasSims = Object.keys(sims).length > 0;
  const [i, setI] = useState(0);
  const touch = useRef<number | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const n = RUBROS.length;
  const go = (k: number) => setI(((k % n) + n) % n);
  const r = RUBROS[i];
  const img = sims[r.id];
  const label = r.id === 'cafe' ? 'café' : r.title.toLowerCase();
  const wa = propertyWa(property.ref, property.title, property.slug, `me interesa para ${r.title.toLowerCase()}`);

  // Mantiene la miniatura activa a la vista dentro de la tira.
  // Solo desplaza la tira en horizontal (scrollIntoView movería también la página).
  useEffect(() => {
    const box = strip.current, el = box?.querySelector<HTMLElement>(`[data-i="${i}"]`);
    if (box && el) box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.clientWidth) / 2, behavior: 'smooth' });
  }, [i]);

  return (
    <section className="mt-10 min-w-0" aria-roledescription="carrusel" aria-label={title}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl uppercase">{title}</h2>
        <p className="shrink-0 text-sm text-ivory/60" aria-live="polite">{i + 1} / {n}</p>
      </div>
      <p className="mt-2 text-sm text-ivory/70">
        El mismo espacio, distintos negocios. {hasSims ? 'Simulaciones generadas con IA a partir de una foto real del local: muestran una posibilidad, no el estado actual.' : 'Esquemas referenciales para imaginar el local.'} Cada rubro requiere sus propios permisos municipales.
      </p>

      <div
        className="group relative mt-6 overflow-hidden rounded-2xl border border-gold/40 bg-obsidian outline-none focus-visible:ring-2 focus-visible:ring-gold"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); }}
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => { if (touch.current === null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); touch.current = null; }}
      >
        <div className="relative">
          <div key={r.id} className="animate-[fadeIn_.5s_ease]">
            {img ? <img src={img} alt={`Simulación del ${property.title} como ${label}`} width={1024} height={768} className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]" />
              : <div className="aspect-[4/3] sm:aspect-[16/10]"><RubroDrawing id={r.id} /></div>}
          </div>
          {img && <span className="absolute left-4 top-4 rounded-full bg-obsidian/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ivory">Simulación con IA</span>}
          <button type="button" onClick={() => go(i - 1)} aria-label="Rubro anterior" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-obsidian/70 text-xl text-ivory backdrop-blur transition hover:border-gold hover:text-gold sm:top-[38%]">‹</button>
          <button type="button" onClick={() => go(i + 1)} aria-label="Rubro siguiente" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-obsidian/70 text-xl text-ivory backdrop-blur transition hover:border-gold hover:text-gold sm:top-[38%]">›</button>
        </div>
        {/* En celular el texto va bajo la foto; desde sm se superpone con degradado */}
        <div className="px-5 pb-5 pt-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-gradient-to-t sm:from-obsidian sm:via-obsidian/85 sm:to-transparent sm:px-7 sm:pt-20">
          <p className="font-display text-2xl sm:text-3xl">{r.title}</p>
          <p className="mt-1 max-w-xl text-sm text-ivory/80">{r.text}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {r.href && <Link href={r.href} className="btn-gold py-3">{r.cta} →</Link>}
            <a href={wa} target="_blank" rel="noopener" data-rubro={r.id} className={r.href ? 'btn-ghost py-3' : 'btn-gold py-3'}>Me interesa para {label} →</a>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs uppercase tracking-brand text-gold">¿Y si fuera…? Elige otro rubro</p>
      <div ref={strip} className="-mx-1 mt-3 flex snap-x gap-3 overflow-x-auto px-1 pb-2" role="tablist" aria-label="Otros rubros">
        {RUBROS.map((x, k) => {
          const t = sims[x.id], on = k === i;
          return (
            <button key={x.id} type="button" data-i={k} role="tab" aria-selected={on} onClick={() => go(k)}
              className={`group/t relative aspect-square w-28 shrink-0 snap-start overflow-hidden rounded-xl border-2 transition sm:w-32 ${on ? 'border-gold' : 'border-transparent'}`}>
              {t ? <img src={t} alt="" loading="lazy" className={`h-full w-full scale-110 object-cover transition duration-500 ${on ? 'blur-0' : 'blur-[3px] brightness-50 group-hover/t:blur-0 group-hover/t:brightness-90'}`} />
                : <span className={`block h-full w-full ${on ? '' : 'opacity-40'}`}><RubroDrawing id={x.id} /></span>}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian to-transparent px-2 pb-2 pt-6 text-left text-[11px] font-semibold leading-tight text-ivory">{x.title}</span>
            </button>
          );
        })}
      </div>
      {/* Precarga la siguiente imagen para que el cambio sea instantáneo */}
      {sims[RUBROS[(i + 1) % n].id] && <link rel="preload" as="image" href={sims[RUBROS[(i + 1) % n].id]} />}
    </section>
  );
}
