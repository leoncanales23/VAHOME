import type { Metadata } from 'next';
import Admin from './Admin';
export const metadata: Metadata = { title: 'Administración', robots: { index: false, follow: false } };
export default function Page() {
  return <Admin />;
}
