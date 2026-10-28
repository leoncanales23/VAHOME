import type { Metadata } from 'next';
import Favorites from './Favorites';

export const metadata: Metadata = { title: 'Mis favoritos', robots: { index: false } };

export default function Page() {
  return (
    <div className="container-va pb-24 pt-28">
      <p className="eyebrow">Tu selección</p>
      <h1 className="h-display mt-3 text-5xl md:text-6xl">Mis favoritos</h1>
      <p className="mt-3 max-w-2xl text-ivory/70">Se guardan solo en este navegador. No necesitas crear una cuenta.</p>
      <Favorites />
    </div>
  );
}
