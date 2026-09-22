import { entornoPublico } from './env';

/**
 * Constructores de JSON-LD (B.9).
 *
 * Reglas que no se negocian:
 * - **No se publica la dirección de la calle en el marcado** (B.9). Solo ciudad y país.
 *   La dirección completa vive en la política, que es donde la ley la exige.
 * - Ninguna cifra ni afirmación que no esté en el brief.
 */

export const ORGANIZACION = {
  nombre: 'CG Software Integration',
  razonSocial: 'CG Software Integration S.A.S.',
  nit: '901.983.287',
  ciudad: 'Bogotá',
  pais: 'CO',
  correo: 'cgsoftwareintegrations@gmail.com',
  telefono: '+573238134588',
  fundador: 'Camilo Charris C.',
} as const;

function sitio(): string {
  return entornoPublico().NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
}

export function urlAbsoluta(ruta: string): string {
  return `${sitio()}${ruta.startsWith('/') ? ruta : `/${ruta}`}`;
}

type Json = Record<string, unknown>;

/**
 * Canónica y `hreflang` de una ruta.
 *
 * Next fusiona la metadata por clave de primer nivel: si una página declara
 * `alternates`, **reemplaza entero** el del layout. Por eso las alternativas de
 * idioma se arman aquí y cada página usa este ayudante, en vez de confiar en
 * que se hereden. Esto ya se olvidó una vez y lo cazó una prueba.
 */
export function alternativas(ruta: string): {
  canonical: string;
  languages: Record<string, string>;
} {
  return {
    canonical: ruta,
    // Listo para cuando exista otro idioma (B.7): se agrega su código en routing.ts.
    languages: { 'es-CO': ruta },
  };
}

export function organizacion(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': urlAbsoluta('/#organizacion'),
    name: ORGANIZACION.nombre,
    legalName: ORGANIZACION.razonSocial,
    taxID: ORGANIZACION.nit,
    url: sitio(),
    email: ORGANIZACION.correo,
    telephone: ORGANIZACION.telefono,
    address: {
      '@type': 'PostalAddress',
      addressLocality: ORGANIZACION.ciudad,
      addressCountry: ORGANIZACION.pais,
    },
    founder: {
      '@type': 'Person',
      name: ORGANIZACION.fundador,
    },
  };
}

export function sitioWeb(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': urlAbsoluta('/#sitio'),
    name: ORGANIZACION.nombre,
    url: sitio(),
    inLanguage: 'es-CO',
    publisher: { '@id': urlAbsoluta('/#organizacion') },
  };
}

export type DatosMemorando = {
  slug: string;
  titulo: string;
  resumen: string;
  fecha: string;
};

export function entradaDeBlog(memorando: DatosMemorando): Json {
  const url = urlAbsoluta(`/memorandos/${memorando.slug}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url,
    headline: memorando.titulo,
    description: memorando.resumen,
    datePublished: memorando.fecha,
    dateModified: memorando.fecha,
    inLanguage: 'es-CO',
    mainEntityOfPage: url,
    author: {
      '@type': 'Person',
      name: ORGANIZACION.fundador,
    },
    publisher: { '@id': urlAbsoluta('/#organizacion') },
  };
}

export type Miga = { nombre: string; ruta: string };

export function migas(pasos: Miga[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: pasos.map((paso, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: paso.nombre,
      item: urlAbsoluta(paso.ruta),
    })),
  };
}

export type Aclaracion = { pregunta: string; respuesta: string };

/**
 * `FAQPage` para «Aclaraciones frecuentes» (B.9). Sirve como estructura aunque
 * no garantice resultado enriquecido.
 */
export function preguntasFrecuentes(aclaraciones: Aclaracion[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: aclaraciones.map((aclaracion) => ({
      '@type': 'Question',
      name: aclaracion.pregunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: aclaracion.respuesta,
      },
    })),
  };
}
