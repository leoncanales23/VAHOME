export const SITE = {
  name: 'VA HOME',
  url: 'https://vahome.vibraalto.cl',
  tagline: 'TU ESPACIO. TU PRÓXIMO PASO.',
  catchphrase: '¿Necesitas un lugar? Habla con León.',
  signature: 'Tu próximo capítulo comienza aquí.',
  role: 'Corredor de propiedades',
  advisor: 'León Canales',
  company: 'Vibra SpA',
  rut: '77.122.967-0',
  representative: 'Carlos Canales Zúñiga',
  whatsapp: '56971747072',
  whatsappDisplay: '+56 9 7174 7072',
  email: 'contacto@vibraalto.cl',
};

export const clp = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

export const waLink = (text: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const propertyWa = (ref: string, title: string, slug: string, intent = 'me gustaría coordinar una visita') =>
  waLink(`Hola León, vi esta propiedad en VA HOME y ${intent}.\n\n${title} (${ref})\n${SITE.url}/propiedades/${slug}/`);
