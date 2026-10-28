import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'VA HOME | Tu espacio. Tu próximo paso.', template: '%s | VA HOME' },
  description: 'Arriendo de casas, departamentos y locales comerciales en Chile. Asesoría personalizada de León Canales.',
  openGraph: { siteName: 'VA HOME', locale: 'es_CL', type: 'website', images: ['/og.jpg'] },
  icons: { icon: '/favicon.svg' },
};
export const viewport: Viewport = { themeColor: '#0B0D10' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-obsidian">Saltar al contenido</a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
