'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { SITE, waLink } from '@/lib/site';

// Foto de portada: public/leon/leon-canales-2026-10.jpg. Para una foto horizontal con fondo propio
// (ciudad, cordillera, propiedad) basta subir el archivo con un nombre nuevo y cambiar esta ruta.
// El nombre lleva fecha: las imágenes se cachean un año (immutable), así que una foto nueva necesita un nombre nuevo.
const HERO_IMG = '/leon/leon-canales-2026-10.jpg';

const line = { hidden: { y: '110%' }, show: (i: number) => ({ y: 0, transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] } }) };

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const services = [
  { href: '/propiedades/?op=arriendo', title: 'Arriendos', text: 'Casas, departamentos y locales.',
    icon: <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" {...stroke}><circle cx="11" cy="11" r="5.5" /><path d="M15 15 L27 27 M22 22 l3 -3 M19 19 l3 -3" /></svg> },
  { href: '/propiedades/?op=venta', title: 'Ventas', text: 'Tu próximo hogar te espera.',
    icon: <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" {...stroke}><path d="M4 15 L16 5 L28 15 M7 13 V27 H25 V13 M13 27 V19 H19 V27" /></svg> },
  { href: '/propietarios/', title: 'Propietarios', text: 'Publica y arrienda con respaldo.',
    icon: <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" {...stroke}><path d="M5 12 L7 6 H25 L27 12 M5 12 V26 H27 V12 M5 12 H27 M13 26 V18 H19 V26" /></svg> },
  { href: '/contacto/', title: 'Asesoría', text: 'Te acompaño hasta la firma.',
    icon: <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" {...stroke}><path d="M5 7 H27 V21 H15 L9 27 V21 H5 Z M10 12 H22 M10 16 H18" /></svg> },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const lines = ['NO ES SOLO', 'UNA PROPIEDAD.', 'ES TU PRÓXIMO PASO.'];
  const fade = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.7 } } as const);
  return (
    <section className="relative isolate overflow-hidden bg-obsidian pt-16 md:pt-20">
      {/* Foto: arriba en móvil; a la derecha y fundida con el fondo en escritorio (sin recortar el rostro) */}
      <div aria-hidden className="relative h-[58svh] w-full lg:absolute lg:bottom-0 lg:right-0 lg:top-20 lg:h-auto lg:w-[66%]">
        <motion.img src={HERO_IMG} alt="" initial={reduce ? false : { scale: 1.04, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover object-[50%_12%] lg:ml-auto lg:block lg:w-auto"
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 40%)', maskImage: 'linear-gradient(to right, transparent 0%, #000 40%)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent lg:via-transparent" />
      </div>

      <div className="container-va relative -mt-24 flex flex-col justify-center pb-12 lg:mt-0 lg:min-h-[calc(100svh-5rem)] lg:py-12">
        <motion.p className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-brand text-ivory/80" {...fade(0.1)}>
          <span className="h-px w-12 bg-gold" />{SITE.tagline}
        </motion.p>
        <h1 className="h-display mt-6 max-w-3xl text-[13vw] sm:text-7xl xl:text-8xl">
          {lines.map((l, i) => (
            <span key={l} className="-mt-3 block overflow-hidden pb-1 pt-3">
              <motion.span className={`block ${i === 2 ? 'text-gold' : ''}`} variants={line} custom={i} initial={reduce ? false : 'hidden'} animate="show">{l}</motion.span>
            </span>
          ))}
        </h1>
        <motion.p className="mt-6 max-w-lg text-lg text-ivory/80" {...fade(0.7)}>
          Casas, departamentos y locales comerciales. Te acompaño en cada paso para que encuentres el espacio que necesitas.
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
        <motion.div className="pointer-events-none absolute bottom-16 right-6 hidden max-w-[17rem] lg:block xl:right-0" {...fade(1.2)}>
          <p className="-rotate-6 font-script text-4xl leading-tight text-gold drop-shadow-[0_2px_12px_rgba(0,0,0,.6)]">{SITE.catchphrase}</p>
          <div className="mt-8 border border-white/10 bg-obsidian/70 px-5 py-4 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-brand text-ivory/85">Cercanía<br />Claridad<br />Acompañamiento</p>
            <span className="mt-3 block h-px w-24 bg-gold" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
