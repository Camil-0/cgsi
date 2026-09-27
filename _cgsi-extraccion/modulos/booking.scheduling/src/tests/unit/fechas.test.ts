import { describe, expect, it } from 'vitest';
import { expiraEn, fechaCortaCot, fechaYHoraCot } from '@/lib/fechas';

/** Fechas en hora de Colombia y conservación de 24 meses (B.10 y B.16). */

describe('formato en hora de Colombia', () => {
  it('pasa de UTC a COT, que son cinco horas menos', () => {
    // 01.10.2026 a las 15:00 UTC son las 10:00 en Bogotá.
    const fecha = new Date('2026-10-01T15:00:00.000Z');

    expect(fechaYHoraCot(fecha)).toBe('01.10.2026 · 10:00');
    expect(fechaCortaCot(fecha)).toBe('01.10 10:00');
  });

  it('cruza el día hacia atrás cuando corresponde', () => {
    // 02.10.2026 a las 02:00 UTC son todavía el 1 en Bogotá.
    const fecha = new Date('2026-10-02T02:00:00.000Z');

    expect(fechaYHoraCot(fecha)).toBe('01.10.2026 · 21:00');
  });

  it('usa reloj de 24 horas', () => {
    const fecha = new Date('2026-10-01T23:30:00.000Z');

    expect(fechaYHoraCot(fecha)).toBe('01.10.2026 · 18:30');
  });
});

describe('conservación de 24 meses', () => {
  it('suma dos años al último contacto', () => {
    const contacto = new Date('2026-09-22T12:00:00.000Z');

    expect(expiraEn(contacto).toISOString()).toBe('2028-09-22T12:00:00.000Z');
  });

  it('no altera la fecha que recibe', () => {
    const contacto = new Date('2026-09-22T12:00:00.000Z');
    expiraEn(contacto);

    expect(contacto.toISOString()).toBe('2026-09-22T12:00:00.000Z');
  });

  it('maneja el 29 de febrero sin inventar un día', () => {
    const bisiesto = new Date('2028-02-29T12:00:00.000Z');
    const vence = expiraEn(bisiesto);

    // 2030 no es bisiesto: el 29 de febrero se corre al 1 de marzo.
    expect(vence.toISOString().slice(0, 10)).toBe('2030-03-01');
  });
});
