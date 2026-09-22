import type { Aclaracion } from './seo';

/**
 * Sacar datos del MDX sin compilar, para que el mismo texto no viva en dos
 * sitios: la descripción de la página y el `FAQPage` del JSON-LD salen del
 * mismo contenido que se lee en pantalla (B.9).
 */

/** Quita marcas de markdown y deja una línea limpia. */
function limpiar(texto: string): string {
  return texto
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Primer párrafo de prosa: se salta el frontmatter, las etiquetas y los títulos. */
export function primerParrafo(crudo: string): string {
  const cuerpo = crudo.replace(/^---[\s\S]*?\n---\n/, '');

  for (const bloque of cuerpo.split(/\n{2,}/)) {
    const linea = bloque.trim();
    if (!linea || linea.startsWith('<') || linea.startsWith('#') || linea.startsWith('|')) continue;

    return limpiar(linea);
  }

  return '';
}

/** Las «Aclaraciones frecuentes» de la sección VII, tal como están escritas. */
export function aclaraciones(crudo: string): Aclaracion[] {
  const dentro = crudo.split('<Faq>')[1]?.split('</Faq>')[0];
  if (!dentro) return [];

  return dentro
    .split(/^#### /m)
    .slice(1)
    .map((bloque) => {
      const [pregunta = '', ...resto] = bloque.split('\n');

      return { pregunta: limpiar(pregunta), respuesta: limpiar(resto.join(' ')) };
    })
    .filter((aclaracion) => aclaracion.pregunta.length > 0 && aclaracion.respuesta.length > 0);
}

/** Descripción para `generateMetadata`: nunca más de 160 caracteres (B.9). */
export function recortar(texto: string, maximo = 160): string {
  if (texto.length <= maximo) return texto;

  const corte = texto.slice(0, maximo - 1);
  const ultimoEspacio = corte.lastIndexOf(' ');

  return `${corte.slice(0, ultimoEspacio > 0 ? ultimoEspacio : corte.length)}…`;
}
