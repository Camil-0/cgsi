import type { SeccionDocumento } from '#contenido';

/**
 * El documento son siete secciones numeradas I–VII, más portada y pie
 * (Parte A §3). La estructura vive en `content/es/documento/*.mdx`.
 */

export const TOTAL_SECCIONES = 7;

export function porTipo(
  piezas: readonly SeccionDocumento[],
  tipo: SeccionDocumento['tipo'],
): SeccionDocumento[] {
  return piezas.filter((pieza) => pieza.tipo === tipo).sort((uno, otro) => uno.orden - otro.orden);
}
