'use client';
import Link from 'next/link';
import { useState } from 'react';
import { SITE, waLink } from '@/lib/site';
import { useSaved } from '@/lib/saved';

const nav = [
  { href: '/propiedades/', label: 'Propiedades' },
  { href: '/favoritos/', label: 'Favoritos' },
  { href: '/comparar/', label: 'Comparar' },
  { href: '/propietarios/', label: 'Propietarios' },
  { href: '/leon-canales/', label: 'León Canales' },
  { href: '/contacto/', label: 'Contacto' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const fav = useSaved('favoritos').list.length;
  const cmp = useSaved('comparar').list.length;
  const count = (href: string) => (href === '/favoritos/' ? fav : href === '/comparar/' ? cmp : 0);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-obsidian/80 backdrop-blur-md">
      <div className="container-va flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.advisor}, ${SITE.role} · VA HOME inicio`}>
          <svg viewBox="0 0 32 32" width="38" height="38" aria-hidden="true" className="text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4 15 L16 5 L28 15 M7 12.5 V27 H25 V12.5 M22 7 V10.5" /></svg>
          <span className="leading-none">
            <span className="block font-display text-base uppercase tracking-[0.22em] md:text-lg">{SITE.advisor}</span>
            <span className="mt-1 block text-[9px] uppercase tracking-[0.32em] text-ivory/70">{SITE.role}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex lg:gap-8" aria-label="Principal">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-ivory/80 transition hover:text-gold">{n.label}{count(n.href) > 0 && <span className="ml-1.5 rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold text-obsidian">{count(n.href)}</span>}</Link>
          ))}
          <a href={waLink('Hola León, te escribo desde VA HOME.')} target="_blank" rel="noopener" className="rounded-full border border-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory transition hover:bg-gold hover:text-obsidian">
            Contáctame →
          </a>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu-movil" aria-label="Abrir menú">
          <span className="block h-0.5 w-6 bg-ivory" /><span className="mt-1.5 block h-0.5 w-6 bg-ivory" /><span className="mt-1.5 block h-0.5 w-4 bg-gold" />
        </button>
      </div>
      {open && (
        <nav id="menu-movil" className="border-t border-white/10 bg-obsidian md:hidden" aria-label="Móvil">
          <div className="container-va flex flex-col py-4">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-3 font-display text-2xl uppercase">{n.label}{count(n.href) > 0 && <span className="ml-2 text-gold">({count(n.href)})</span>}</Link>
            ))}
            <a href={waLink('Hola León, te escribo desde VA HOME.')} className="btn-gold mt-4">WhatsApp {SITE.whatsappDisplay}</a>
          </div>
        </nav>
      )}
    </header>
  );
}
