import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Criterio de salida de F2 (B.17): **el copy es idéntico al brief**.
 *
 * Esta prueba compara cada frase del contenido contra su fuente:
 * - `content/es/documento` y `content/es/expedientes` → `docs/brief.md`, Parte A §3.
 * - `content/es/legal` → `docs/politica-de-datos.md`.
 *
 * Si alguien inventa una frase, la agrega o la retoca, la prueba falla y dice cuál.
 */

const raiz = fileURLToPath(new URL('../..', import.meta.url));

/** Deja una línea comparable: sin marcas de markdown, sin enlaces y sin espacios de más. */
function normalizar(texto: string): string {
  return texto
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // [texto](url) → texto
    .replace(/[*_`>]/g, '')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Lo que va al margen se compara aparte de su párrafo, como en el brief. */
const AL_MARGEN = /<(Nota|AlMargen)[^>]*>([\s\S]*?)<\/\1>/g;

/** Cadenas dentro de atributos o arreglos JSX: son copy, aunque no sean prosa. */
const CADENA = /(['"])([^'"]{8,}?)\1/g;

/** Descarta lo que es código y no texto, p. ej. fragmentos entre dos literales. */
function esTexto(valor: string): boolean {
  return (
    valor.includes(' ') &&
    !/[{}[\]=]/.test(valor) &&
    !valor.startsWith('/') &&
    !valor.startsWith('#') &&
    !valor.includes(': ')
  );
}

function frases(mdx: string): string[] {
  const cuerpo = mdx.replace(/^---[\s\S]*?\n---\n/, '');
  const lineas: string[] = [];

  for (const [, , texto] of cuerpo.matchAll(AL_MARGEN)) {
    lineas.push(normalizar(texto as string));
  }

  for (const [, , texto] of cuerpo.matchAll(CADENA)) {
    const valor = texto as string;
    if (esTexto(valor)) lineas.push(normalizar(valor));
  }

  const prosa = cuerpo
    .replace(AL_MARGEN, '')
    .replace(/<[^>]+>/g, '') // etiquetas JSX; el texto entre ellas se conserva
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .split('\n')
    .map(normalizar)
    .filter((linea) => linea.length > 0 && !/^-+$/.test(linea));

  return [...lineas, ...prosa].filter(
    (linea) => linea.length > 3 && !linea.includes('PENDIENTE') && !/^\{.*\}$/.test(linea),
  );
}

function leerFuente(ruta: string): string {
  return normalizar(readFileSync(join(raiz, ruta), 'utf8'));
}

/**
 * El brief escribe el correo como marcador porque el dominio propio es un pendiente
 * de lanzamiento (Parte A §11); el sitio usa, mientras tanto, el correo real que la
 * política ya publica. La página y la revisión del pie las pone el cajetín.
 */
const brief = leerFuente('docs/brief.md')
  .replace('{correo del dominio}', 'cgsoftwareintegrations@gmail.com')
  .replace(' · Página N de VII · Rev. {versión}', '')
  // La nota 12 remite a la sección 9 del brief, que no existe en el sitio.
  // Camilo pidió recortarla el 22.09.2026.
  .replace('Anexo de seguridad del contrato tipo; ver sección 9.', 'Anexo de seguridad del contrato tipo.');

// `normalizar` ya quitó los guiones bajos del marcador de fecha.
const politica = leerFuente('docs/politica-de-datos.md').replace(/\{FECHA_?DE_?PUBLICACION\}/g, '');

function archivosDe(carpeta: string): Array<{ nombre: string; contenido: string }> {
  const directorio = join(raiz, 'content/es', carpeta);
  return readdirSync(directorio)
    .filter((nombre) => nombre.endsWith('.mdx'))
    .map((nombre) => ({ nombre, contenido: readFileSync(join(directorio, nombre), 'utf8') }));
}

describe('el documento dice exactamente lo que dice el brief', () => {
  for (const carpeta of ['documento', 'expedientes']) {
    for (const { nombre, contenido } of archivosDe(carpeta)) {
      it(`${carpeta}/${nombre}`, () => {
        const inventadas = frases(contenido).filter((frase) => !brief.includes(frase));

        expect(inventadas).toEqual([]);
      });
    }
  }
});

describe('la política dice exactamente lo que dice su fuente', () => {
  for (const { nombre, contenido } of archivosDe('legal')) {
    it(`legal/${nombre}`, () => {
      const inventadas = frases(contenido).filter((frase) => !politica.includes(frase));

      expect(inventadas).toEqual([]);
    });
  }
});

describe('no falta ninguna sección del documento', () => {
  const archivos = archivosDe('documento');

  it('están la portada, las siete secciones y el pie', () => {
    expect(archivos).toHaveLength(9);
  });

  it('los numerales van de I a VII, en orden', () => {
    const numerales = archivos
      .map(({ contenido }) => /numeral: (\S+)/.exec(contenido)?.[1])
      .filter((numeral) => numeral && numeral !== "''");

    expect(numerales).toEqual(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']);
  });
});
