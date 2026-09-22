import { entornoPublico } from './env';

/**
 * Cajetín vivo (Parte A §4.1): la revisión es la versión semántica de `package.json`
 * y la fecha es la del build. `next.config.ts` inyecta las dos.
 *
 * El formateo es manual y en UTC a propósito: `toLocaleDateString` da resultados
 * distintos en el servidor y en el navegador, y eso rompe la hidratación.
 */

export function revision(): string {
  return entornoPublico().NEXT_PUBLIC_APP_VERSION;
}

export function fechaBuild(): string {
  const fecha = new Date(entornoPublico().NEXT_PUBLIC_BUILD_DATE);
  const dia = String(fecha.getUTCDate()).padStart(2, '0');
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');

  return `${dia}.${mes}.${fecha.getUTCFullYear()}`;
}
