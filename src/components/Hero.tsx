'use client';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Portrait from './Portrait';
import QuickSearch from './QuickSearch';

const line = { hidden: { y: '110%' }, show: (i: number) => ({ y: 0, transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] } }) };

export default function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 80]);
  const lines = ['NO ES SOLO', 'UNA PROPIEDAD.', 'ES TU PRÓXIMO PASO.'];
  return (
    <section className="relative overflow-hidden pt-16 md:pt-20">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 75% 30%, rgba(200,169,107,.14), transparent 70%)' }} />
      <div className="container-va relative grid min-h-[calc(100svh-5rem)] items-center gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.p className="eyebrow" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            VA HOME · Real Estate · Chile
          </motion.p>
          <h1 className="h-display mt-5 text-[13vw] sm:text-7xl xl:text-8xl">
            {lines.map((l, i) => (
              <span key={l} className="-mt-3 block overflow-hidden pb-1 pt-3">
                <motion.span className={`block ${i === 2 ? 'text-gold' : ''}`} variants={line} custom={i} initial={reduce ? false : 'hidden'} animate="show">{l}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="mt-6 max-w-xl text-lg text-ivory/75" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            Casas, departamentos y locales comerciales. Encontramos el espacio que necesitas y te acompañamos durante el proceso.
          </motion.p>
          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
            <Link href="/propiedades/" className="btn-gold">Explorar propiedades</Link>
            <Link href="/propietarios/" className="btn-ghost">Quiero arrendar mi propiedad</Link>
          </motion.div>
          <motion.div className="mt-10" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <QuickSearch />
          </motion.div>
        </div>
        <motion.div style={{ y }} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <motion.div initial={reduce ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-gold/30">
            <Portrait />
          </motion.div>
          <div className="absolute -bottom-5 left-6 right-6 rounded-xl border border-gold/40 bg-obsidian/90 px-5 py-4 backdrop-blur">
            <p className="font-display text-2xl tracking-wide">LEÓN CANALES</p>
            <p className="text-[10px] uppercase tracking-brand text-gold">VA HOME | Real Estate</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
