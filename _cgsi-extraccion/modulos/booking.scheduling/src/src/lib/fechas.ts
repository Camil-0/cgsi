/**
 * Fechas en hora de Colombia (B.5 y B.10). Colombia no tiene horario de verano,
 * así que `America/Bogota` es siempre UTC−5, pero el formateo se hace con
 * `Intl` y zona explícita para no depender de la del servidor.
 */

export const ZONA = 'America/Bogota';

const FORMATO = new Intl.DateTimeFormat('es-CO', {
  timeZone: ZONA,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/** `dd.mm.aaaa · hh:mm`, como lo pide el sello «Recibido» (B.5). */
export function fechaYHoraCot(fecha: Date): string {
  const partes = Object.fromEntries(
    FORMATO.formatToParts(fecha).map((parte) => [parte.type, parte.value]),
  );

  return `${partes.day}.${partes.month}.${partes.year} · ${partes.hour}:${partes.minute}`;
}

/** `dd.mm hh:mm`, como lo pide el aviso interno al fundador (B.10). */
export function fechaCortaCot(fecha: Date): string {
  const partes = Object.fromEntries(
    FORMATO.formatToParts(fecha).map((parte) => [parte.type, parte.value]),
  );

  return `${partes.day}.${partes.month} ${partes.hour}:${partes.minute}`;
}

/** Conservación de 24 meses desde el último contacto (Parte A §7.3.1). */
export function expiraEn(ultimoContacto: Date): Date {
  const fecha = new Date(ultimoContacto.getTime());
  fecha.setUTCMonth(fecha.getUTCMonth() + 24);

  return fecha;
}
