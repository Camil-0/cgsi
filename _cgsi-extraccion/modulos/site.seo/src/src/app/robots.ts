import { urlAbsoluta } from '@/lib/seo';

import type { MetadataRoute } from 'next';

/**
 * Robots (B.9). Se deja fuera lo que no es contenido: las rutas de API no
 * tienen nada que indexar y el webhook no debería ni visitarse.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: urlAbsoluta('/sitemap.xml'),
  };
}
