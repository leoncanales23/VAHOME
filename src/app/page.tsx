import Link from 'next/link';
import Hero from '@/components/Hero';
import QuickSearch from '@/components/QuickSearch';
import Reveal from '@/components/Reveal';
import PropertyCard from '@/components/PropertyCard';
import Portrait from '@/components/Portrait';
import PropertyVideo from '@/components/PropertyVideo';
import { properties } from '@/data/properties';
import { SITE, clp, propertyWa, waLink } from '@/lib/site';

export default function Home() {
  const featured = properties.find((p) => p.featured && p.verified)!;
  const listed = [...properties].sort((a, b) => Number(b.verified) - Number(a.verified)).slice(0, 3);
  return (
    <>
      <Hero />
      <div className="container-va relative z-10 -mt-8"><QuickSearch /></div>

      {/* Propiedad destacada */}
      <section className="relative mt-16 border-y border-white/10 bg-charcoal">
        <div className="container-va grid gap-10 py-20 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img src={featured.images[0]} alt={featured.title} className="h-full w-full object-cover" />
              <span className="absolute left-4 top-4 rounded-full bg-gold px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-obsidian">Oportunidad destacada</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">{featured.commune} · {featured.ref}</p>
            <h2 className="h-display mt-4 text-5xl md:text-6xl">El local correcto puede cambiar tu negocio.</h2>
            <p className="mt-5 text-ivory/75">{featured.title}. {featured.headline}.</p>
            <dl className="mt-8 grid grid-cols-2 gap-4">
              <div className="card p-5">
                <dt className="text-xs uppercase tracking-wider text-steel">Arriendo mensual</dt>
                <dd className="mt-1 font-display text-3xl text-gold">{clp(featured.price)}</dd>
                {featured.priceBefore && <dd className="text-sm text-steel line-through">{clp(featured.priceBefore)}</dd>}
              </div>
              {featured.extraCosts?.slice(0, 1).map((c) => (
                <div className="card p-5" key={c.label}>
                  <dt className="text-xs uppercase tracking-wider text-steel">{c.label}</dt>
                  <dd className="mt-1 font-display text-3xl text-gold">{clp(c.amount)}</dd>
                  {c.before && <dd className="text-sm text-steel line-through">{clp(c.before)}</dd>}
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/propiedades/${featured.slug}/`} className="btn-gold">Ver propiedad</Link>
              <a href={propertyWa(featured.ref, featured.title, featured.slug)} target="_blank" rel="noopener" className="btn-ghost">Coordinar visita</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Catálogo */}
      <section className="container-va py-24">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Propiedades</p>
            <h2 className="h-display mt-3 text-5xl md:text-6xl">Arrendar bien empieza<br />por elegir bien.</h2>
          </div>
          <Link href="/propiedades/" className="btn-ghost self-start md:self-auto">Ver todas</Link>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listed.map((p, i) => <Reveal key={p.slug} delay={i * 0.08}><PropertyCard p={p} /></Reveal>)}
        </div>
      </section>

      {/* Propietarios */}
      <section className="relative overflow-hidden border-y border-white/10">
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(120deg,#0B0D10 40%,#171B20)' }} />
        <div className="container-va relative grid gap-12 py-24 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Para propietarios</p>
            <h2 className="h-display mt-3 text-5xl md:text-6xl">Tu propiedad vale más con una buena estrategia.</h2>
            <p className="mt-5 max-w-lg text-ivory/75">Publicación, presentación comercial, coordinación de visitas y acompañamiento durante el proceso de arriendo.</p>
            <Link href="/propietarios/" className="btn-gold mt-8">Publicar mi propiedad</Link>
          </Reveal>
          <Reveal delay={0.1}>
            <ol className="space-y-4">
              {['Evaluamos la propiedad.', 'Preparamos su presentación.', 'Publicamos y promocionamos.', 'Coordinamos interesados y visitas.', 'Apoyamos la revisión de antecedentes.', 'Acompañamos la formalización del contrato.'].map((s, i) => (
                <li key={s} className="flex items-center gap-5 border-b border-white/10 pb-4">
                  <span className="font-display text-3xl text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-lg">{s}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* León */}
      <section className="container-va grid gap-12 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        {/* El rostro de León ya está en la portada; aquí va el recorrido en video de la propiedad destacada */}
        <Reveal>
          {featured.video ? (
            <figure>
              <PropertyVideo video={featured.video} title={featured.title} />
              <figcaption className="mt-4 text-center text-sm text-ivory/70">
                Recorrido: {featured.title} ·{' '}
                <Link href={`/propiedades/${featured.slug}/`} className="text-gold underline-offset-4 hover:underline">ver ficha</Link>
              </figcaption>
            </figure>
          ) : (
            <div className="aspect-[4/5] overflow-hidden rounded-[28px] border border-gold/30"><Portrait /></div>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">León Canales</p>
          <p className="mt-3 font-display text-3xl uppercase text-gold md:text-4xl">{SITE.catchphrase}</p>
          <h2 className="h-display mt-6 text-4xl md:text-5xl">Detrás de cada buen acuerdo, hay una conversación.</h2>
          <p className="mt-5 max-w-xl text-ivory/75">León lidera las relaciones comerciales de VA HOME: atiende personalmente a propietarios y arrendatarios, presenta cada propiedad y acompaña la negociación hasta el contrato.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={waLink('Hola León, quiero conversar contigo sobre una propiedad.')} target="_blank" rel="noopener" className="btn-gold">Hablar con León</a>
            <Link href="/leon-canales/" className="btn-ghost">Conocer más</Link>
          </div>
        </Reveal>
      </section>

      {/* Cierre */}
      <section className="border-t border-white/10 bg-charcoal">
        <div className="container-va py-24 text-center">
          <Reveal>
            <h2 className="h-display text-6xl md:text-8xl">León Canales.<br /><span className="text-gold">Tu próxima llave.</span></h2>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/propiedades/" className="btn-gold">Explorar propiedades</Link>
              <Link href="/contacto/" className="btn-ghost">Contacto</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
