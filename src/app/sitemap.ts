import type { MetadataRoute } from 'next';
import { properties } from '@/data/properties';
import { SITE } from '@/lib/site';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/propiedades/', '/propietarios/', '/leon-canales/', '/contacto/'].map((p) => ({ url: `${SITE.url}${p || '/'}` }))
    .concat(properties.filter((p) => p.verified).map((p) => ({ url: `${SITE.url}/propiedades/${p.slug}/` })));
}
