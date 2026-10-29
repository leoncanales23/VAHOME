import Link from 'next/link';
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

export default function UsosLocal({ title = '¿Qué puede ser este local?', property }: { title?: string; property: Pick<Property, 'ref' | 'title' | 'slug' | 'uses'> }) {
  const sims = property.uses ?? {};
  const hasSims = Object.keys(sims).length > 0;
  return (
    <section className="mt-10">
      <h2 className="font-display text-3xl uppercase">{title}</h2>
      <p className="mt-2 text-sm text-ivory/70">
        El mismo espacio, distintos negocios. {hasSims ? 'Simulaciones generadas con IA a partir de una foto real del local: muestran una posibilidad, no el estado actual.' : 'Esquemas referenciales para imaginar el local.'} Cada rubro requiere sus propios permisos municipales.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {RUBROS.map((r) => {
          const img = sims[r.id];
          const wa = propertyWa(property.ref, property.title, property.slug, `me interesa para ${r.title.toLowerCase()}`);
          return (
            <li key={r.id} className={`card overflow-hidden ${r.href ? 'border-gold/50 sm:col-span-2' : ''}`}>
              <div className={r.href ? 'grid sm:grid-cols-2' : ''}>
                {img ? (
                  <figure className="relative">
                    <img src={img} alt={`Simulación del ${property.title} como ${r.title.toLowerCase()}`} loading="lazy" width={1024} height={768} className="aspect-[4/3] h-full w-full object-cover" />
                    <figcaption className="absolute left-3 top-3 rounded-full bg-obsidian/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ivory">Simulación con IA</figcaption>
                  </figure>
                ) : <RubroDrawing id={r.id} />}
                <div className="p-5">
                  <p className="font-display text-xl">{r.title}</p>
                  <p className="mt-2 text-sm text-ivory/75">{r.text}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {r.href && <Link href={r.href} className="btn-gold">{r.cta} →</Link>}
                    <a href={wa} target="_blank" rel="noopener" data-rubro={r.id} className={r.href ? 'btn-ghost' : 'text-sm font-semibold text-gold underline-offset-4 hover:underline'}>Me interesa para {r.id === 'cafe' ? 'café' : r.title.toLowerCase()} →</a>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
