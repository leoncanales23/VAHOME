import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { SITE, waLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kaldi Coffee llave en mano',
  description: 'Cafetería de especialidad para llevar, instalada llave en mano por $10.000.000: vitrinas, mobiliario y máquina en comodato. Tú solo compras el café y los insumos.',
};

// Precio informado por Kaldi Coffee; las condiciones finales se fijan en el contrato.
const PRECIO = '$10.000.000';
const wa = waLink('Hola León, quiero información de Kaldi Coffee llave en mano.');

const incluye = [
  { t: 'Sistema completo de venta de café', d: 'Todo lo necesario para preparar y vender café para llevar desde el primer día.' },
  { t: 'Vitrinas', d: 'Exhibición para café en grano, pastelería y productos de la marca.' },
  { t: 'Mobiliario', d: 'Barra, mueblería y estanterías del local.' },
  { t: 'Máquina en comodato', d: 'La máquina de café se entrega en préstamo de uso mientras dure el contrato.' },
  { t: 'Instalación llave en mano', d: 'Recibes el local armado: llegar y trabajar.' },
];

const pasos = [
  { t: 'Conversamos', d: 'Te contamos el modelo y resolvemos tus dudas por WhatsApp o en persona.' },
  { t: 'Elegimos el local', d: 'Si aún no lo tienes, VA HOME te ayuda a encontrarlo.' },
  { t: 'Instalamos', d: 'Kaldi Coffee arma el local completo, llave en mano.' },
  { t: 'Abres', d: 'Compras el café y los insumos a Kaldi Coffee y comienzas a vender.' },
];

const faq = [
  { q: '¿Qué es el comodato de la máquina?', a: 'Es un préstamo de uso: la máquina sigue siendo de Kaldi Coffee y tú la usas mientras esté vigente el contrato.' },
  { q: '¿Qué compro yo?', a: 'El café y los insumos, directamente a Kaldi Coffee.' },
  { q: '¿El precio incluye el arriendo del local?', a: 'No. El arriendo se acuerda con el propietario del local; en VA HOME te mostramos locales disponibles.' },
];

export default function Page() {
  return (
    <div className="bg-[#0C1A15]">
      <section className="relative overflow-hidden pb-20 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_20%,rgba(217,178,106,.14),transparent)]" />
        <div className="container-va relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow">Kaldi Coffee · franquicia llave en mano</p>
            <h1 className="h-display mt-5 text-5xl md:text-7xl">Tu cafetería de especialidad, <span className="text-gold-grad">lista para abrir.</span></h1>
            <p className="mt-6 max-w-xl text-lg text-ivory/85">Recibes el sistema completo de venta de café: vitrinas, mobiliario y máquina en comodato, todo instalado. Tú solo compras el café y los insumos.</p>
            <div className="mt-8 flex items-end gap-4">
              <p className="font-display text-5xl text-gold md:text-6xl">{PRECIO}</p>
              <p className="pb-2 text-sm text-ivory/70">CLP · todo instalado</p>
            </div>
            <div className="mt-8 grid gap-3 sm:flex">
              <a href={wa} target="_blank" rel="noopener" className="btn-gold">Quiero mi Kaldi llave en mano</a>
              <Link href="/propiedades/local-170-galeria-los-joyeros/" className="btn-ghost">Ver un local disponible</Link>
            </div>
          </div>
          <Reveal>
            <figure className="overflow-hidden rounded-[28px] border border-gold/30">
              <img src="/propiedades/local-170-galeria-los-joyeros/rubros/cafe-v1.webp" alt="Simulación del Local 170 de la Galería Los Joyeros como café Kaldi" width={1024} height={768} className="aspect-[4/3] w-full object-cover" />
              <figcaption className="bg-obsidian/60 px-5 py-3 text-xs text-ivory/60">Simulación con IA del Local 170 (Galería Los Joyeros, disponible) convertido en café para llevar. No representa su estado actual.</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-obsidian/40">
        <div className="container-va py-20">
          <Reveal><p className="eyebrow">Qué incluye</p><h2 className="h-display mt-3 text-4xl md:text-5xl">Todo para vender café desde el primer día.</h2></Reveal>
          <div role="list" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {incluye.map((x, i) => (
              <Reveal key={x.t} delay={i * 0.05}><div role="listitem" className="card h-full p-6"><span className="font-display text-3xl text-gold">{String(i + 1).padStart(2, '0')}</span><p className="mt-3 text-lg font-semibold">{x.t}</p><p className="mt-1 text-sm text-ivory/70">{x.d}</p></div></Reveal>
            ))}
            <Reveal delay={0.25}><div role="listitem" className="card h-full border-gold/50 p-6"><p className="eyebrow">Lo que pones tú</p><p className="mt-3 text-lg font-semibold">El café y los insumos</p><p className="mt-1 text-sm text-ivory/70">Se compran a Kaldi Coffee. Llegar y trabajar.</p></div></Reveal>
          </div>
        </div>
      </section>

      <section className="container-va py-20">
        <Reveal><p className="eyebrow">Cómo funciona</p><h2 className="h-display mt-3 text-4xl md:text-5xl">De la conversación a la primera taza.</h2></Reveal>
        <div role="list" className="mt-10 grid gap-4 md:grid-cols-4">
          {pasos.map((x, i) => (
            <Reveal key={x.t} delay={i * 0.06}><div role="listitem" className="card h-full p-6"><span className="font-display text-4xl text-gold">{i + 1}</span><p className="mt-3 text-lg font-semibold">{x.t}</p><p className="mt-1 text-sm text-ivory/70">{x.d}</p></div></Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-obsidian/40">
        <div className="container-va grid gap-10 py-20 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Preguntas frecuentes</p>
            <dl className="mt-6 grid gap-5">
              {faq.map((x) => <div key={x.q}><dt className="font-semibold">{x.q}</dt><dd className="mt-1 text-sm text-ivory/75">{x.a}</dd></div>)}
            </dl>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card p-8 text-center">
              <h2 className="h-display text-3xl md:text-4xl">¿Conversamos?</h2>
              <p className="mt-3 text-ivory/75">Te acompaña {SITE.advisor}, {SITE.role.toLowerCase()}.</p>
              <a href={wa} target="_blank" rel="noopener" className="btn-gold mt-6">WhatsApp {SITE.whatsappDisplay}</a>
              <p className="mt-6 text-xs text-steel">Ilustraciones referenciales. Precio y condiciones finales según contrato con Kaldi Coffee.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
