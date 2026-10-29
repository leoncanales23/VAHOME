import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Gallery from './Gallery';
import PropertyVideo from '@/components/PropertyVideo';
import SaveButtons from '@/components/SaveButtons';
import VisitForm from '@/components/VisitForm';
import UsosLocal from '@/components/UsosLocal';
import PropertyCard from '@/components/PropertyCard';
import { areaOf, fmtM, getProperty, properties, typeLabel } from '@/data/properties';
import { SITE, clp, propertyWa } from '@/lib/site';

export const generateStaticParams = () => properties.map((p) => ({ slug: p.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProperty(params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: `${typeLabel[p.type]} en ${p.operation} · ${p.commune} · ${clp(p.price)}${p.operation === 'arriendo' ? '/mes' : ''}`,
    robots: p.verified ? undefined : { index: false },
    openGraph: { title: `${p.title} | VA HOME`, images: p.images.slice(0, 1) },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const p = getProperty(params.slug);
  if (!p) notFound();
  const similar = properties.filter((x) => x.slug !== p.slug && (x.type === p.type || x.commune === p.commune)).slice(0, 3);
  const area = areaOf(p);
  const jsonLd = p.verified ? {
    '@context': 'https://schema.org', '@type': 'Offer', name: p.title, price: p.price, priceCurrency: 'CLP',
    availability: 'https://schema.org/InStock', url: `${SITE.url}/propiedades/${p.slug}/`,
    itemOffered: { '@type': 'Place', name: p.title, ...(area && { floorSize: { '@type': 'QuantitativeValue', value: area, unitCode: 'MTK' } }), address: { '@type': 'PostalAddress', streetAddress: p.addressPublic, addressLocality: p.commune, addressRegion: p.region, addressCountry: 'CL' } },
  } : null;
  return (
    <div className="container-va pb-24 pt-28">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <nav className="text-sm text-steel" aria-label="Ruta"><Link href="/propiedades/" className="hover:text-gold">Propiedades</Link> / {p.ref}</nav>
      {!p.verified && <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">Ficha de demostración. No corresponde a una propiedad disponible.</p>}
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Gallery images={p.images} title={p.title} />
          {p.video && (
            <section className="mt-10">
              <h2 className="font-display text-3xl uppercase">Recorrido en video</h2>
              <PropertyVideo video={p.video} title={p.title} className="mt-5 md:mx-0" />
            </section>
          )}
          <section className="mt-10">
            <p className="eyebrow">{typeLabel[p.type]} en {p.operation} · {p.commune}</p>
            <h1 className="h-display mt-3 text-5xl md:text-6xl">{p.title}</h1>
            <p className="mt-3 text-xl text-gold">{p.headline}</p>
            <p className="mt-6 leading-relaxed text-ivory/80">{p.description}</p>
          </section>
          {p.dimensions && (
            <section className="mt-10">
              <h2 className="font-display text-3xl uppercase">Medidas</h2>
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['Ancho', `${fmtM(p.dimensions.widthM)} m`],
                  ['Largo', `${fmtM(p.dimensions.lengthM)} m`],
                  ...(p.dimensions.heightM ? [['Alto', `${fmtM(p.dimensions.heightM)} m`]] : []),
                  ...(area ? [['Superficie', `${fmtM(area)} m²`]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="card px-4 py-4">
                    <dt className="text-[11px] uppercase tracking-wider text-steel">{k}</dt>
                    <dd className="mt-1 font-display text-3xl text-gold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-steel">Medidas informadas por el propietario; la superficie es ancho × largo. Se confirman en la visita.</p>
            </section>
          )}
          <section className="mt-10">
            <h2 className="font-display text-3xl uppercase">Características</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {p.features.map((f) => <li key={f} className="card flex items-center gap-3 px-4 py-3 text-sm"><span className="text-gold">◆</span>{f}</li>)}
            </ul>
          </section>
          {p.type === 'local' && p.verified && <UsosLocal property={p} />}
          <section className="mt-10">
            <h2 className="font-display text-3xl uppercase">Ubicación</h2>
            <p className="mt-2 text-ivory/80">{p.addressPublic}, {p.commune}, {p.region}</p>
            {p.mapQuery && (
              <iframe title={`Mapa de ${p.title}`} className="mt-4 h-80 w-full rounded-2xl border border-white/10" loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(p.mapQuery)}&output=embed`} />
            )}
          </section>
          <section className="mt-10">
            <h2 className="font-display text-3xl uppercase">Documentación habitual</h2>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ivory/80">
              <li>Cédula de identidad o documento de identificación vigente.</li>
              <li>Acreditación de ingresos o de la actividad comercial.</li>
              <li>Para empresas: escritura, RUT y poderes del representante.</li>
            </ul>
            <p className="mt-2 text-xs text-steel">Los antecedentes se solicitan solo después de la visita y con tu autorización.</p>
          </section>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-wider text-steel">{p.operation === 'arriendo' ? 'Arriendo mensual' : 'Precio'}</p>
            <p className="font-display text-5xl text-gold">{clp(p.price)}</p>
            {p.priceBefore && <p className="text-steel line-through">{clp(p.priceBefore)}</p>}
            {p.extraCosts && (
              <dl className="mt-5 space-y-3 border-t border-white/10 pt-5">
                {p.extraCosts.map((c) => (
                  <div key={c.label} className="flex items-baseline justify-between gap-3">
                    <dt className="text-sm text-ivory/80">{c.label}</dt>
                    <dd className="text-right"><span className="font-semibold">{clp(c.amount)}</span>{c.before && <span className="ml-2 text-xs text-steel line-through">{clp(c.before)}</span>}</dd>
                  </div>
                ))}
              </dl>
            )}
            <ul className="mt-5 space-y-2 border-t border-white/10 pt-5 text-sm text-ivory/80">
              {p.conditions.map((c) => <li key={c}>· {c}</li>)}
            </ul>
            {p.verified ? (
              <div className="mt-6 flex flex-col gap-3">
                <a href={propertyWa(p.ref, p.title, p.slug, 'tengo una consulta')} target="_blank" rel="noopener" className="btn-ghost">Consultar por WhatsApp</a>
                <p className="text-center text-xs text-steel">Te responde {SITE.advisor} · {SITE.whatsappDisplay}</p>
              </div>
            ) : <p className="mt-6 text-sm text-steel">Contacto deshabilitado en fichas demo.</p>}
            <SaveButtons slug={p.slug} title={p.title} className="mt-4" />
            {p.verified && <VisitForm slug={p.slug} propRef={p.ref} title={p.title} />}
          </div>
        </aside>
      </div>
      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="h-display text-4xl">Propiedades similares</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map((s) => <PropertyCard key={s.slug} p={s} />)}</div>
        </section>
      )}
    </div>
  );
}
