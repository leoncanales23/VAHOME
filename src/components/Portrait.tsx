import Monogram from './Monogram';
// Retrato de León (public/leon/leon-canales-retrato-v13.jpg, 4:5). Pasa src={''} para ver el marcador provisorio.
export default function Portrait({ src = '/leon/leon-canales-retrato-v13.jpg', className = '' }: { src?: string; className?: string }) {
  if (src) return <img src={src} alt="León Canales, asesor inmobiliario de VA HOME" className={`h-full w-full object-cover ${className}`} />;
  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-charcoal ${className}`}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(217,178,106,.12) 0 1px, transparent 1px 72px), repeating-linear-gradient(0deg, rgba(217,178,106,.08) 0 1px, transparent 1px 72px)' }} />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian to-transparent" />
      <div className="relative text-center">
        <span className="h-display block text-[9rem] leading-none text-gold/90 md:text-[12rem]">LC</span>
        <Monogram size={56} className="mx-auto mt-2" />
        <p className="mt-4 text-[10px] uppercase tracking-brand text-steel">Retrato provisorio · foto oficial pendiente</p>
      </div>
    </div>
  );
}
