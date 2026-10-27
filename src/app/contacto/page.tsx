import type { Metadata } from 'next';
import { SITE, waLink } from '@/lib/site';
export const metadata: Metadata = { title: 'Contacto' };
export default function Page() {
  return (
    <div className="container-va pb-24 pt-32">
      <p className="eyebrow">Contacto</p>
      <h1 className="h-display mt-3 text-5xl md:text-7xl">Hablemos de tu <span className="text-gold">próximo paso.</span></h1>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <a href={waLink('Hola León, te escribo desde VA HOME.')} target="_blank" rel="noopener" className="card p-6 transition hover:border-gold"><p className="eyebrow">WhatsApp</p><p className="mt-3 font-display text-3xl">{SITE.whatsappDisplay}</p></a>
        <a href={`mailto:${SITE.email}`} className="card p-6 transition hover:border-gold"><p className="eyebrow">Correo</p><p className="mt-3 break-all font-display text-2xl">{SITE.email}</p></a>
        <div className="card p-6"><p className="eyebrow">Empresa</p><p className="mt-3 text-sm text-ivory/80">{SITE.company}<br />RUT {SITE.rut}<br />Marca: VA HOME by VibraAlto</p></div>
      </div>
    </div>
  );
}
