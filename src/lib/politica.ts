import { legal } from '#contenido';

export const RUTA_POLITICA = 'politica-de-datos';

export function politica() {
  return legal.find((documento) => documento.slug === RUTA_POLITICA);
}

/**
 * Versión publicada de la política.
 *
 * El consentimiento se guarda contra ella: si la política cambia de versión, la
 * decisión anterior deja de valer y se vuelve a preguntar. Por eso la versión
 * sale del propio documento y no de una constante suelta que se pueda olvidar.
 */
export function versionPolitica(): string {
  return politica()?.version ?? '0';
}
