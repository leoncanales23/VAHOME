import { waLink } from '@/lib/site';
export default function WhatsAppFloat() {
  return (
    <a href={waLink('Hola León, te escribo desde VA HOME.')} target="_blank" rel="noopener"
      className="fixed bottom-5 right-5 z-40 flex h-14 items-center justify-center gap-3 rounded-full bg-[#25D366] px-3.5 shadow-lg shadow-black/40 transition hover:scale-105 md:px-5"
      aria-label="Escribir a León por WhatsApp">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z"/></svg>
      <span className="hidden text-sm font-semibold text-white md:inline">Habla con León</span>
    </a>
  );
}
