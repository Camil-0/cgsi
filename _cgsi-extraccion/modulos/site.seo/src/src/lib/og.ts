/**
 * Fuentes para las imágenes OG (B.9).
 *
 * `next/og` compone con satori, que necesita el archivo de la fuente en TTF u
 * OTF: no le sirve el CSS de `next/font`. Se pide a Google Fonts en el build y
 * se cachea en memoria.
 *
 * Si la descarga falla, se devuelve `null` y la imagen se compone con la fuente
 * que trae `next/og`. Una imagen OG con otra tipografía es un detalle; un build
 * roto por una red caída, no.
 */

const cache = new Map<string, ArrayBuffer | null>();

export async function fuenteDeGoogle(familia: string, peso = 400): Promise<ArrayBuffer | null> {
  const clave = `${familia}:${peso}`;
  const guardada = cache.get(clave);
  if (guardada !== undefined) return guardada;

  let fuente: ArrayBuffer | null = null;

  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(familia)}:wght@${peso}`,
      // Sin `User-Agent` moderno, Google responde con TTF, que es lo que satori lee.
      { headers: { 'user-agent': 'CGSI-build' } },
    ).then((respuesta) => respuesta.text());

    const url = /src:\s*url\((https:\/\/[^)]+)\)/.exec(css)?.[1];
    if (url) fuente = await fetch(url).then((respuesta) => respuesta.arrayBuffer());
  } catch {
    fuente = null;
  }

  cache.set(clave, fuente);

  return fuente;
}
