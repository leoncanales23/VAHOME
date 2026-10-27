// Monograma VA: la V forma el umbral de una puerta; la A es el marco con dintel; el punto es la llave.
export default function Monogram({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <rect x="1.5" y="1.5" width="61" height="61" rx="6" stroke="#C8A96B" strokeWidth="2" />
      <path d="M12 16 L24 48 L32 26" stroke="#F5F1E9" strokeWidth="3.5" strokeLinejoin="miter" />
      <path d="M32 26 L40 48 M52 48 L40 16 L32 26" stroke="#C8A96B" strokeWidth="3.5" strokeLinejoin="miter" />
      <path d="M36 38 H45" stroke="#C8A96B" strokeWidth="3" />
      <circle cx="46" cy="22" r="2.4" fill="#C8A96B" />
    </svg>
  );
}
