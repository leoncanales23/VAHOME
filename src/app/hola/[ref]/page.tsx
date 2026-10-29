import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import QrLanding from '@/components/QrLanding';
import { properties } from '@/data/properties';
import { SITE, clp } from '@/lib/site';

// URL corta para el QR del cartel de cada propiedad verificada: /hola/vah-001/
const byRef = (ref: string) => properties.find((p) => p.verified && p.ref.toLowerCase() === ref);

export const generateStaticParams = () => properties.filter((p) => p.verified).map((p) => ({ ref: p.ref.toLowerCase() }));

export function generateMetadata({ params }: { params: { ref: string } }): Metadata {
  const p = byRef(params.ref);
  if (!p) return {};
  return {
    title: `${p.title} · ${SITE.advisor}`,
    description: `${p.headline}. ${clp(p.price)}${p.operation === 'arriendo' ? '/mes' : ''}. Coordina tu visita con ${SITE.advisor}.`,
    openGraph: { images: [p.images[0] ?? '/leon/leon-canales-costanera-v6.jpg'] },
  };
}

export default function Page({ params }: { params: { ref: string } }) {
  const p = byRef(params.ref);
  if (!p) notFound();
  return <QrLanding property={p} />;
}
