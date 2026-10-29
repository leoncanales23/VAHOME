'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logEvent } from '@/lib/firebase';

// Mide contactos reales sin cookies ni datos personales: clics en WhatsApp, llamadas,
// tarjeta de contacto y llegadas desde el QR de los carteles (/hola/).
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/hola')) logEvent('qr', pathname.split('/')[2]?.toUpperCase() ?? '');
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (window.location.pathname.startsWith('/admin')) return;
      const a = (e.target as Element | null)?.closest?.('a');
      const href = a?.getAttribute('href') ?? '';
      if (href.startsWith('https://wa.me/')) logEvent('whatsapp');
      else if (href.startsWith('tel:')) logEvent('llamada');
      else if (href.endsWith('.vcf')) logEvent('contacto_guardado');
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
