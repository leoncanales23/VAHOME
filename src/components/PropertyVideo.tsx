import { STREAM_HOST, SITE } from '@/lib/site';

// Recorrido vertical (9:16) de una propiedad. Con Cloudflare Stream la calidad se adapta a la conexión;
// en ambos casos el video solo se descarga cuando la persona le da play.
export default function PropertyVideo({ video, title, className = '' }: { video: { stream?: string; src?: string; poster: string }; title: string; className?: string }) {
  const poster = `${SITE.url}${video.poster}`;
  return (
    <div className={`relative mx-auto aspect-[9/16] w-full max-w-[22rem] overflow-hidden rounded-[28px] border border-gold/30 bg-black shadow-2xl shadow-black/60 ${className}`}>
      {video.stream ? (
        <iframe src={`${STREAM_HOST}/${video.stream}/iframe?preload=none&poster=${encodeURIComponent(poster)}`} title={`Recorrido en video: ${title}`}
          loading="lazy" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full border-0" />
      ) : (
        <video src={video.src} poster={video.poster} controls playsInline preload="none" aria-label={`Recorrido en video: ${title}`} className="h-full w-full object-cover" />
      )}
    </div>
  );
}
