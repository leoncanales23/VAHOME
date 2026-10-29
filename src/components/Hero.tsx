'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { SITE, waLink } from '@/lib/site';

// Foto de portada: public/leon/leon-canales-costanera-v2.jpg (con la Gran Torre Costanera). Para una foto horizontal con fondo propio
// (ciudad, cordillera, propiedad) basta subir el archivo con un nombre nuevo y cambiar esta ruta.
// El nombre lleva fecha: las imágenes se cachean un año (immutable), así que una foto nueva necesita un nombre nuevo.
const HERO_IMG = '/leon/leon-canales-costanera-v2.jpg';

const line = { hidden: { y: '110%' }, show: (i: number) => ({ y: 0, transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] } }) };

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
export const services = [
  { href: '/propiedades/?op=venta', title: 'Venta de propiedades', text: 'Tu próximo hogar te espera.',
    icon: <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true" {...stroke}><path d="M4 15 L16 5 L28 15 M7 13 V27 H25 V13 M13 27 V19 H19 V27 M22 6 V10" /></svg> },
  { href: '/propiedades/?op=arriendo', title: 'Arriendos', text: 'Flexibilidad y tranquilidad.',
    icon: <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true" {...stroke}><circle cx="11" cy="11" r="5.5" /><path d="M15 15 L27 27 M22 22 l3 -3 M19 19 l3 -3" /></svg> },
  { href: '/contacto/', title: 'Inversiones', text: 'Bienes raíces que generan valor.',
    icon: <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true" {...stroke}><path d="M5 27 H28 M8 27 V20 H12 V27 M14 27 V16 H18 V27 M20 27 V12 H24 V27 M6 15 L13 9 L18 12 L27 4 M22 4 H27 V9" /></svg> },
  { href: '/contacto/', title: 'Asesoría personalizada', text: 'Tu interés, mi prioridad.',
    icon: <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true" {...stroke}><path d="M3 13 L8 8 L13 10 L17 8 L22 8 L29 14 M3 13 L9 20 M29 14 L23 21 M13 10 L10 14 Q12 16 15 13 L17 12 L23 18 Q24 20 22 21 L20 19 M22 21 Q22 23 20 23 L18 21 M20 23 Q19 25 17 24 L15 22 M17 24 Q16 26 14 25 L9 20" /></svg> },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const lines = ['Más que propiedades,', 'son oportunidades.'];
  const fade = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.7 } } as const);
  return (
    <section className="relative isolate overflow-hidden bg-obsidian pt-16 md:pt-20">
      {/* Foto: arriba en móvil; a la derecha y fundida con el fondo en escritorio (sin recortar el rostro) */}
      <div aria-hidden className="relative h-[58svh] w-full lg:absolute lg:bottom-0 lg:right-0 lg:top-20 lg:h-auto lg:w-[66%]">
        <motion.img src={HERO_IMG} alt="" initial={reduce ? false : { scale: 1.04, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover object-[60%_12%] lg:ml-auto lg:block lg:w-auto"
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 40%)', maskImage: 'linear-gradient(to right, transparent 0%, #000 40%)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent lg:via-transparent" />
      </div>

      <div className="container-va relative -mt-24 flex flex-col justify-center pb-12 lg:mt-0 lg:min-h-[calc(100svh-5rem)] lg:py-12">
        <motion.p className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-brand text-ivory/80" {...fade(0.1)}>
          <span className="h-px w-12 bg-gold" />Tu proyecto, mi compromiso
        </motion.p>
        <h1 className="h-display mt-6 max-w-3xl text-[9.2vw] sm:text-6xl xl:text-7xl">
          {lines.map((l, i) => (
            <span key={l} className="-mt-3 block overflow-hidden pb-2 pt-3">
              <motion.span className={`block ${i === lines.length - 1 ? 'text-gold-grad' : ''}`} variants={line} custom={i} initial={reduce ? false : 'hidden'} animate="show">{l}</motion.span>
            </span>
          ))}
        </h1>
        <motion.p className="mt-6 max-w-lg text-lg text-ivory/85 md:text-xl" {...fade(0.7)}>
          Te acompaño en cada paso para que encuentres el espacio ideal, ya sea para vivir, invertir o hacer crecer tu negocio.
        </motion.p>

        <motion.ul className="mt-10 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-x-0" {...fade(0.85)}>
          {services.map((s) => (
            <li key={s.title} className="sm:border-l sm:border-white/15 sm:px-5 sm:first:border-l-0 sm:first:pl-0">
              <Link href={s.href} className="group block">
                <span className="text-gold transition group-hover:scale-110 inline-block">{s.icon}</span>
                <span className="mt-3 block text-[11px] font-semibold uppercase tracking-wider">{s.title}</span>
                <span className="mt-1 block text-xs text-ivory/65">{s.text}</span>
              </Link>
            </li>
          ))}
        </motion.ul>

        <motion.div className="mt-10 flex flex-col gap-3 sm:flex-row" {...fade(1)}>
          <a href={waLink('Hola León, quiero conversar sobre mi proyecto.')} target="_blank" rel="noopener" className="btn-gold">Hablemos de tu proyecto →</a>
          <Link href="/propiedades/" className="btn-ghost">Explorar propiedades</Link>
        </motion.div>

        <p className="mt-12 flex items-center gap-4 text-[11px] uppercase tracking-brand text-ivory/60">Santiago · Chile<span className="hidden h-px w-40 bg-white/20 sm:block" /></p>

        {/* Firma del personaje, solo en pantallas grandes para no tapar el rostro */}
        <motion.div className="pointer-events-none absolute bottom-16 right-6 hidden max-w-[17rem] xl:right-0 xl:block" {...fade(1.2)}>
          <p className="-rotate-12 font-script text-4xl leading-tight text-gold drop-shadow-[0_2px_12px_rgba(0,0,0,.6)]">{SITE.signature}</p>
          <svg viewBox="0 0 200 30" className="-mt-1 ml-16 w-40 -rotate-12 text-gold" aria-hidden="true"><path d="M4 26 C60 18 120 10 196 4 M70 24 C110 18 150 12 180 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <div className="mt-8 flex items-center gap-5 border border-white/10 bg-obsidian/75 px-6 py-5 backdrop-blur">
            <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true" className="shrink-0 text-gold" {...stroke}><path d="M4 15 L16 5 L28 15 M7 13 V27 H25 V13 M13 27 V19 H19 V27" /></svg>
            <div>
              <p className="text-[11px] font-semibold uppercase leading-relaxed tracking-brand text-ivory/85">Experiencia<br />Confianza<br />Resultados</p>
              <span className="mt-3 block h-px w-24 bg-gold" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
