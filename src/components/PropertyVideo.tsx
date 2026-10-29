// Recorrido vertical (9:16) de una propiedad. Solo descarga el video cuando la persona le da play.
export default function PropertyVideo({ video, title, className = '' }: { video: { src: string; poster: string }; title: string; className?: string }) {
  return (
    <div className={`relative mx-auto aspect-[9/16] w-full max-w-[22rem] overflow-hidden rounded-[28px] border border-gold/30 bg-black shadow-2xl shadow-black/60 ${className}`}>
      <video src={video.src} poster={video.poster} controls playsInline preload="none" aria-label={`Recorrido en video: ${title}`} className="h-full w-full object-cover" />
    </div>
  );
}
