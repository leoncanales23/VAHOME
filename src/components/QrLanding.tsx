'use client';
// Landing para quien escanea el QR de un cartel: celular primero, León al frente y contacto a un toque.
// /hola/ es la versión general; /hola/<ref>/ agrega la propiedad del cartel.
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';
import PropertyVideo from './PropertyVideo';
import { services } from './Hero';
import { SITE, clp, propertyWa, waLink } from '@/lib/site';
import { areaOf, fmtM, typeLabel, type Property } from '@/data/properties';

const PHOTO = '/leon/leon-canales-costanera-v13.jpg';

const waIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z" /></svg>
);
const phoneIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" /></svg>
);
const cardIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2.2" /><path d="M5.5 16.5c.8-1.6 2-2.3 3.5-2.3s2.7.7 3.5 2.3M15 10h3.5M15 13.5h3.5" /></svg>
);

const steps = [
  { t: 'Me escribes', d: 'Por WhatsApp o llamada. Te respondo yo, no un bot.' },
  { t: 'Visitamos', d: 'Coordinamos el día y te muestro la propiedad en persona.' },
  { t: 'Firmamos', d: 'Te acompaño con contrato, garantías y entrega de llaves.' },
];

export default function QrLanding({ property }: { property?: Property }) {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] } } as const);
  const wa = property
    ? propertyWa(property.ref, property.title, property.slug, 'vi el cartel y me gustaría coordinar una visita')
    : waLink('Hola León, escaneé tu cartel y quiero conversar.');
  const area = property && areaOf(property);
  const facts = property
    ? [
        area ? ['Superficie', `${fmtM(area)} m²`] : null,
        property.dimensions ? ['Medidas', `${fmtM(property.dimensions.widthM)} × ${fmtM(property.dimensions.lengthM)} m`] : null,
        ...(property.extraCosts ?? []).map((c) => [c.label, clp(c.amount)]),
        property.bedrooms ? ['Dormitorios', String(property.bedrooms)] : null,
        property.bathrooms ? ['Baños', String(property.bathrooms)] : null,
      ].filter(Boolean).slice(0, 4) as string[][]
    : [];

  return (
    <div className="pb-24 md:pb-0">
      {/* 1 · León al frente: lo primero que se ve al escanear */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-obsidian">
        <motion.img src={PHOTO} alt={`${SITE.advisor}, ${SITE.role.toLowerCase()}`} initial={reduce ? false : { scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[60%_8%] md:left-auto md:right-0 md:w-[55%] md:[mask-image:linear-gradient(to_right,transparent_0%,#000_30%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian via-obsidian/55 to-transparent md:bg-gradient-to-r md:from-obsidian md:via-obsidian/70" />

        <div className="container-va pb-10 pt-28 md:pb-24">
          <motion.p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-brand text-gold" {...fade(0.2)}>
            <span className="h-px w-10 bg-gold" />{property ? 'Escaneaste el cartel de esta propiedad' : 'Hola, soy León'}
          </motion.p>
          <motion.h1 className="h-display mt-5 max-w-2xl text-[11vw] sm:text-6xl xl:text-7xl" {...fade(0.35)}>
            Más que propiedades,<br /><span className="text-gold-grad">son oportunidades.</span>
          </motion.h1>
          <motion.p className="mt-5 max-w-md text-lg text-ivory/85" {...fade(0.5)}>
            Soy <strong className="font-semibold text-ivory">{SITE.advisor}</strong>, {SITE.role.toLowerCase()}. Te acompaño en persona desde la primera visita hasta la entrega de llaves.
          </motion.p>
          <motion.p className="mt-4 -rotate-3 font-script text-3xl text-gold md:text-4xl" {...fade(0.65)}>{SITE.signature}</motion.p>
          <motion.div className="mt-8 grid gap-3 sm:flex" {...fade(0.8)}>
            <a href={wa} target="_blank" rel="noopener" className="btn-gold text-base">{waIcon}{property ? 'Quiero visitarla' : 'Escríbeme por WhatsApp'}</a>
            <a href={`tel:${SITE.phone}`} className="btn-ghost">{phoneIcon}Llamar a León</a>
          </motion.div>
        </div>
      </section>

      {/* 2 · La propiedad del cartel */}
      {property && (
        <section className="border-y border-white/10 bg-charcoal">
          <div className="container-va grid gap-8 py-16 lg:grid-cols-2 lg:items-center">
            <Reveal className="relative">
              {property.video ? (
                <PropertyVideo video={property.video} title={property.title} />
              ) : (
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img src={property.images[0]} alt={property.title} className="h-full w-full object-cover" />
                </div>
              )}
              <span className="absolute left-4 top-4 rounded-full bg-gold px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-obsidian lg:left-[calc(50%-10rem)]">{property.availability === 'disponible' ? 'Disponible' : property.availability}</span>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="eyebrow">{typeLabel[property.type]} en {property.operation} · {property.commune} · {property.ref}</p>
              <h2 className="h-display mt-3 text-4xl md:text-5xl">{property.title}</h2>
              <p className="mt-3 text-ivory/75">{property.headline}. {property.addressPublic}.</p>
              <p className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="font-display text-4xl text-gold">{clp(property.price)}</span>
                {property.operation === 'arriendo' && <span className="text-ivory/60">/ mes</span>}
                {property.priceBefore && <span className="text-ivory/50 line-through">{clp(property.priceBefore)}</span>}
              </p>
              {facts.length > 0 && (
                <dl className="mt-6 grid grid-cols-2 gap-3">
                  {facts.map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-white/10 bg-obsidian/60 px-4 py-3">
                      <dt className="text-[11px] uppercase tracking-wider text-ivory/55">{k}</dt>
                      <dd className="mt-1 font-display text-xl">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="mt-8 grid gap-3 sm:flex">
                <a href={wa} target="_blank" rel="noopener" className="btn-gold">{waIcon}Coordinar visita</a>
                <Link href={`/propiedades/${property.slug}/`} className="btn-ghost">Ver ficha completa</Link>
              </div>
            </Reveal>
          </div>
          {property.images.length > 1 && (
            <div className="container-va pb-16">
              <p className="eyebrow">Fotos del local · desliza</p>
              <ul className="-mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 md:mx-0 md:px-0">
                {property.images.map((src, i) => (
                  <li key={src} className="w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]">
                    <img src={src} alt={`${property.title} — foto ${i + 1}`} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* 3 · Confianza */}
      <section className="container-va py-20">
        <Reveal>
          <p className="eyebrow">Experiencia · Confianza · Resultados</p>
          <h2 className="h-display mt-4 max-w-3xl text-4xl md:text-5xl">Detrás de cada buen acuerdo, <span className="text-gold-grad">hay una persona que da la cara.</span></h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.08}>
              <div className="card h-full p-6">
                <span className="font-display text-4xl text-gold">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-3 text-lg font-semibold">{s.t}</p>
                <p className="mt-1 text-sm text-ivory/70">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-8 text-sm text-ivory/60">Operación respaldada por {SITE.company} · RUT {SITE.rut} · {SITE.name}</p>
        </Reveal>
      </section>

      {/* 4 · Servicios */}
      <section className="border-t border-white/10 bg-charcoal">
        <div className="container-va py-16">
          <Reveal><p className="eyebrow">¿Buscas otra cosa? También puedo ayudarte con</p></Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <Link href={s.href} className="group block">
                  <span className="inline-block text-gold transition group-hover:scale-110">{s.icon}</span>
                  <span className="mt-3 block text-[11px] font-semibold uppercase tracking-wider">{s.title}</span>
                  <span className="mt-1 block text-xs text-ivory/65">{s.text}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 5 · Cierre */}
      <section className="container-va py-20 text-center">
        <Reveal>
          <h2 className="h-display mx-auto max-w-2xl text-4xl md:text-6xl">Tu próximo paso empieza <span className="text-gold-grad">con una conversación.</span></h2>
          <div className="mx-auto mt-8 grid max-w-md gap-3">
            <a href={wa} target="_blank" rel="noopener" className="btn-gold">{waIcon}WhatsApp {SITE.whatsappDisplay}</a>
            <a href="/leon-canales.vcf" download className="btn-ghost">{cardIcon}Guardar mi contacto</a>
            <Link href="/propiedades/" className="mt-2 text-sm text-ivory/70 underline-offset-4 hover:text-gold hover:underline">Ver todas las propiedades</Link>
          </div>
        </Reveal>
      </section>

      {/* Barra fija en celular: contacto siempre a un toque */}
      <nav aria-label="Contacto rápido" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-white/10 bg-obsidian/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <a href={wa} target="_blank" rel="noopener" className="flex flex-col items-center gap-1 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#25D366]">{waIcon}WhatsApp</a>
        <a href={`tel:${SITE.phone}`} className="flex flex-col items-center gap-1 border-x border-white/10 py-3 text-[11px] font-semibold uppercase tracking-wider text-gold">{phoneIcon}Llamar</a>
        <a href="/leon-canales.vcf" download className="flex flex-col items-center gap-1 py-3 text-[11px] font-semibold uppercase tracking-wider text-ivory/85">{cardIcon}Contacto</a>
      </nav>
    </div>
  );
}
