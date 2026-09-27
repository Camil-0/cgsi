import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { aclaraciones, primerParrafo, recortar } from '@/lib/extraer';
import { PAPEL_OG } from '@/components/seo/LienzoOg';
import {
  entradaDeBlog,
  migas,
  ORGANIZACION,
  organizacion,
  preguntasFrecuentes,
  sitioWeb,
  urlAbsoluta,
} from '@/lib/seo';

/** Datos estructurados y metadata (B.9). */

const raiz = fileURLToPath(new URL('../..', import.meta.url));

beforeAll(() => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://cgsi.example';
  process.env.NEXT_PUBLIC_APP_VERSION = '0.1.0';
  process.env.NEXT_PUBLIC_BUILD_DATE = '2026-09-22T00:00:00.000Z';
});

function leerContenido(ruta: string): string {
  return readFileSync(join(raiz, 'content/es', ruta), 'utf8');
}

describe('Organization', () => {
  it('lleva razón social, NIT y ciudad', () => {
    const datos = organizacion();

    expect(datos['@type']).toBe('Organization');
    expect(datos.legalName).toBe('CG Software Integration S.A.S.');
    expect(datos.taxID).toBe('901.983.287');
    expect(datos.address).toMatchObject({ addressLocality: 'Bogotá', addressCountry: 'CO' });
  });

  it('**no publica la dirección de la calle** (B.9)', () => {
    const serializado = JSON.stringify(organizacion());

    expect(serializado).not.toContain('streetAddress');
    expect(serializado).not.toContain('Transversal');
    expect(serializado).not.toContain('43-94');
  });

  it('no inventa datos que el brief no da', () => {
    const datos = organizacion();

    expect(datos).not.toHaveProperty('numberOfEmployees');
    expect(datos).not.toHaveProperty('aggregateRating');
    expect(datos).not.toHaveProperty('foundingDate');
  });
});

describe('WebSite', () => {
  it('apunta a la organización y declara el idioma', () => {
    const datos = sitioWeb();

    expect(datos['@type']).toBe('WebSite');
    expect(datos.inLanguage).toBe('es-CO');
    expect(datos.publisher).toEqual({ '@id': urlAbsoluta('/#organizacion') });
  });
});

describe('BlogPosting', () => {
  const memorando = {
    slug: 'cuando-pasar-de-whatsapp',
    titulo: 'Cuándo pasar de WhatsApp Business a un sistema de pedidos',
    resumen: 'Tres señales de que el chat ya no alcanza.',
    fecha: '2026-10-01',
  };

  it('lleva autor como Person, como pide B.9', () => {
    const datos = entradaDeBlog(memorando);

    expect(datos['@type']).toBe('BlogPosting');
    expect(datos.author).toEqual({ '@type': 'Person', name: ORGANIZACION.fundador });
  });

  it('tiene los campos que exige el validador: titular, fecha y página', () => {
    const datos = entradaDeBlog(memorando);

    expect(datos.headline).toBe(memorando.titulo);
    expect(datos.datePublished).toBe(memorando.fecha);
    expect(datos.mainEntityOfPage).toBe(urlAbsoluta(`/memorandos/${memorando.slug}`));
  });
});

describe('BreadcrumbList', () => {
  it('numera los pasos desde 1 y usa URLs absolutas', () => {
    const datos = migas([
      { nombre: 'Documento', ruta: '/' },
      { nombre: 'Memorandos', ruta: '/memorandos' },
    ]);

    expect(datos.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Documento', item: 'https://cgsi.example/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Memorandos',
        item: 'https://cgsi.example/memorandos',
      },
    ]);
  });
});

describe('FAQPage con las aclaraciones reales', () => {
  const crudo = leerContenido('documento/07-proximos-pasos.mdx');

  it('saca las siete aclaraciones del propio MDX, sin copiarlas a otro lado', () => {
    const lista = aclaraciones(crudo);

    expect(lista).toHaveLength(7);
    expect(lista[0]?.pregunta).toBe('¿Cuánto cuesta un proyecto?');
    expect(lista[0]?.respuesta).toContain('Depende del alcance');
    expect(lista.at(-1)?.pregunta).toBe('¿En cuánto tiempo responden?');
  });

  it('cada pregunta tiene su respuesta, que es lo que el validador exige', () => {
    const datos = preguntasFrecuentes(aclaraciones(crudo)) as {
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
    };

    for (const pregunta of datos.mainEntity) {
      expect(pregunta.name.length).toBeGreaterThan(0);
      expect(pregunta.acceptedAnswer.text.length).toBeGreaterThan(0);
    }
  });
});

describe('descripción de la portada', () => {
  it('es el subtítulo del brief, no una frase nueva', () => {
    const descripcion = primerParrafo(leerContenido('documento/00-portada.mdx'));

    expect(descripcion).toBe(
      'Construimos el sistema que la ordena: pedidos, despachos, clientes y reportes en un solo lugar.',
    );
  });

  it('nunca pasa de 160 caracteres (B.9)', () => {
    const largo = 'a'.repeat(200);

    expect(recortar(largo).length).toBeLessThanOrEqual(160);
    expect(recortar('corta')).toBe('corta');
  });

  it('recorta por palabra, no a mitad de una', () => {
    const texto = `${'palabra '.repeat(30)}final`;

    expect(recortar(texto, 40)).not.toMatch(/pal…$/);
    expect(recortar(texto, 40).endsWith('…')).toBe(true);
  });
});

describe('imagen OG', () => {
  it('usa los mismos colores que tokens.css', () => {
    const tokens = readFileSync(join(raiz, 'src/styles/tokens.css'), 'utf8');
    const bloque = tokens.slice(0, tokens.indexOf('}'));

    const esperados: Array<[string, string]> = [
      ['--papel', PAPEL_OG.fondo],
      ['--tinta', PAPEL_OG.tinta],
      ['--lapiz', PAPEL_OG.lapiz],
      ['--carbon', PAPEL_OG.carbon],
      ['--firma', PAPEL_OG.firma],
    ];

    for (const [token, usado] of esperados) {
      expect(bloque).toContain(`${token}: ${usado.toLowerCase()};`);
    }
  });
});
