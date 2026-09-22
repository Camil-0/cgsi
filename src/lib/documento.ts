/**
 * Estructura del documento: siete secciones numeradas I–VII (Parte A §3).
 * Los títulos viven en `messages/es.json`; aquí solo la estructura y los anclajes.
 */

export const SECCIONES = [
  { numeral: 'I', ancla: 'punto-de-partida' },
  { numeral: 'II', ancla: 'alcance' },
  { numeral: 'III', ancla: 'como-trabajamos' },
  { numeral: 'IV', ancla: 'expedientes' },
  { numeral: 'V', ancla: 'inversion' },
  { numeral: 'VI', ancla: 'lo-que-firmamos' },
  { numeral: 'VII', ancla: 'proximos-pasos' },
] as const;

export type Seccion = (typeof SECCIONES)[number];
export type Ancla = Seccion['ancla'];

export const TOTAL_SECCIONES = SECCIONES.length;
