import { defineRouting } from 'next-intl/routing';

/**
 * Andamiaje multilenguaje (B.7). El español vive en la raíz y no lleva prefijo.
 *
 * Agregar un idioma = agregar su código aquí, crear `messages/<código>.json`
 * y `content/<código>/`. No se toca ningún componente.
 */
export const routing = defineRouting({
  locales: ['es'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
});

export type Idioma = (typeof routing.locales)[number];

/** Etiqueta BCP 47 para el atributo `lang` del documento (B.4). */
export const etiquetaIdioma: Record<Idioma, string> = {
  es: 'es-CO',
};
