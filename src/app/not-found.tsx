import Link from 'next/link';
export default function NotFound() {
  return (<div className="container-va pb-24 pt-40 text-center"><p className="h-display text-8xl text-gold">404</p><p className="mt-4">Esta dirección no existe. Pero la tuya sí puede.</p><Link href="/propiedades/" className="btn-gold mt-8">Ver propiedades</Link></div>);
}
