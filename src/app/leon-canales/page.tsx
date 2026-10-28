import type { Metadata } from 'next';
import Portrait from '@/components/Portrait';
import { SITE, waLink } from '@/lib/site';
export const metadata: Metadata = { title: 'León Canales', description: 'León Canales, asesor inmobiliario de VA HOME.' };
export default function Page() {
  return (
    <div className="container-va grid gap-12 pb-24 pt-32 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
      <div className="aspect-[4/5] overflow-hidden rounded-[28px] border border-gold/30"><Portrait /></div>
      <div>
        <p className="eyebrow">Real Estate Advisor &amp; Business Development</p>
        <h1 className="h-display mt-3 text-6xl md:text-8xl">León<br /><span className="text-gold">Canales</span></h1>
        <p className="mt-6 font-display text-3xl uppercase text-gold md:text-4xl">{SITE.catchphrase}</p>
        <p className="mt-4 text-xl">Detrás de cada buen acuerdo, hay una conversación.</p>
        <p className="mt-4 max-w-xl text-ivory/75">León es la persona responsable de las relaciones comerciales de VA HOME. Atiende a propietarios y arrendatarios, presenta cada propiedad y acompaña la negociación hasta la firma.</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {['Atención personalizada', 'Negociación comercial', 'Presentación de propiedades', 'Marketing digital', 'Gestión apoyada en tecnología', 'Relación con propietarios y arrendatarios'].map((x) => (
            <li key={x} className="card px-4 py-3 text-sm"><span className="mr-2 text-gold">◆</span>{x}</li>
          ))}
        </ul>
        <a href={waLink('Hola León, quiero conversar contigo.')} target="_blank" rel="noopener" className="btn-gold mt-8">WhatsApp {SITE.whatsappDisplay}</a>
      </div>
    </div>
  );
}
