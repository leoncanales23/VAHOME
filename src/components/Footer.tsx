import Link from 'next/link';
import Monogram from './Monogram';
import { SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-obsidian">
      <div className="container-va grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3"><Monogram size={44} /><span className="font-display text-2xl">VA HOME</span></div>
          <p className="mt-4 max-w-sm text-sm text-steel">Corretaje de propiedades. Arriendo de casas, departamentos y locales comerciales.</p>
          <p className="mt-6 h-display text-3xl text-gold">{SITE.tagline}</p>
        </div>
        <div>
          <p className="eyebrow">Contacto</p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li>{SITE.advisor}</li>
            <li><a className="hover:text-gold" href={`https://wa.me/${SITE.whatsapp}`}>WhatsApp {SITE.whatsappDisplay}</a></li>
            <li><a className="hover:text-gold" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Legal</p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li><Link className="hover:text-gold" href="/legal/terminos/">Términos de servicio</Link></li>
            <li><Link className="hover:text-gold" href="/legal/privacidad/">Política de privacidad</Link></li>
            <li><Link className="hover:text-gold" href="/legal/corretaje/">Condiciones de corretaje</Link></li>
            <li><Link className="hover:text-gold" href="/legal/comisiones/">Comisiones</Link></li>
            <li><Link className="hover:text-gold" href="/legal/empresa/">Identificación de la empresa</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-steel">
        © {new Date().getFullYear()} {SITE.company} · RUT {SITE.rut} · VA HOME by VibraAlto
      </div>
    </footer>
  );
}
