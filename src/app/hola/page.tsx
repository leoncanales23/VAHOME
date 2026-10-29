import type { Metadata } from 'next';
import QrLanding from '@/components/QrLanding';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: `${SITE.advisor} · ${SITE.role}`,
  description: 'Más que propiedades, son oportunidades. Escríbeme por WhatsApp o llámame: te acompaño desde la visita hasta la entrega de llaves.',
  openGraph: { images: ['/leon/leon-canales-2026-10-skyline.jpg'] },
};

export default function Page() {
  return <QrLanding />;
}
