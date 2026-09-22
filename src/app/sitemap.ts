import { memorandos } from '#contenido';
import { urlAbsoluta } from '@/lib/seo';

import type { MetadataRoute } from 'next';

/**
 * Mapa del sitio (B.9). **Solo lo publicado**: un memorando en borrador no
 * aparece aquí, igual que no aparece en el listado ni en el RSS.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const publicados = memorandos.filter((memorando) => memorando.estado === 'publicado');

  const ultimoMemorando = publicados
    .map((memorando) => memorando.fecha)
    .sort()
    .at(-1);

  return [
    {
      url: urlAbsoluta('/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: urlAbsoluta('/memorandos'),
      lastModified: ultimoMemorando ? new Date(ultimoMemorando) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: urlAbsoluta('/politica-de-datos'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...publicados.map((memorando) => ({
      url: urlAbsoluta(`/memorandos/${memorando.slug}`),
      lastModified: new Date(memorando.fecha),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ];
}
