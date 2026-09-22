import { memorandos } from '#contenido';
import { ORGANIZACION, urlAbsoluta } from '@/lib/seo';

/** RSS de los memorandos (B.9). Solo lo publicado. */

export const dynamic = 'force-static';

function escapar(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function GET(): Response {
  const publicados = [...memorandos]
    .filter((memorando) => memorando.estado === 'publicado')
    .sort((uno, otro) => otro.fecha.localeCompare(uno.fecha));

  const entradas = publicados
    .map((memorando) => {
      const url = urlAbsoluta(`/memorandos/${memorando.slug}`);

      return `    <item>
      <title>${escapar(memorando.titulo)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapar(memorando.resumen)}</description>
      <pubDate>${new Date(memorando.fecha).toUTCString()}</pubDate>
      <author>${escapar(ORGANIZACION.correo)} (${escapar(ORGANIZACION.fundador)})</author>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Memorandos · ${escapar(ORGANIZACION.nombre)}</title>
    <link>${urlAbsoluta('/memorandos')}</link>
    <description>Memorandos de ${escapar(ORGANIZACION.razonSocial)}</description>
    <language>es-CO</language>
    <atom:link href="${urlAbsoluta('/rss.xml')}" rel="self" type="application/rss+xml" />
${entradas}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
