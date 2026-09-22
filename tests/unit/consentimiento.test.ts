import { describe, expect, it } from 'vitest';
import {
  CATEGORIAS,
  construir,
  interpretar,
  normalizar,
  OBLIGATORIAS,
  permite,
  TODO_NO,
  TODO_SI,
  vencio,
  VIGENCIA_MESES,
} from '@/lib/consentimiento';

/**
 * Consentimiento por categoría (Parte A §7.5 y §12 de la política).
 *
 * Lo que se cuida aquí es que el «no» valga tanto como el «sí»: que una decisión
 * ilegible, vencida o de otra versión de la política no se interprete como
 * permiso, y que las categorías apagadas sigan apagadas.
 */

const VERSION = '1.0';
const AHORA = new Date('2026-09-22T12:00:00.000Z');

function guardado(parcial: Record<string, unknown>): string {
  return JSON.stringify(parcial);
}

describe('categorías', () => {
  it('son las cuatro de la política, y solo «necesarias» es obligatoria', () => {
    expect([...CATEGORIAS]).toEqual(['necesarias', 'preferencias', 'analitica', 'grabacion']);
    expect([...OBLIGATORIAS]).toEqual(['necesarias']);
  });

  it('el valor por defecto es no autorizar nada opcional', () => {
    expect(TODO_NO).toEqual({
      necesarias: true,
      preferencias: false,
      analitica: false,
      grabacion: false,
    });
  });
});

describe('normalizar', () => {
  it('completa las categorías que falten con «no»', () => {
    expect(normalizar({ analitica: true })).toEqual({
      necesarias: true,
      preferencias: false,
      analitica: true,
      grabacion: false,
    });
  });

  it('no deja apagar las obligatorias, ni siquiera a propósito', () => {
    expect(normalizar({ necesarias: false }).necesarias).toBe(true);
  });
});

describe('interpretar lo guardado', () => {
  it('lee una decisión válida', () => {
    const crudo = guardado({
      version: VERSION,
      fecha: '2026-09-01T00:00:00.000Z',
      decision: TODO_SI,
    });

    expect(interpretar(crudo, VERSION, AHORA)?.decision).toEqual(TODO_SI);
  });

  it('no hay decisión si nunca se respondió', () => {
    expect(interpretar(null, VERSION, AHORA)).toBeNull();
  });

  it('descarta lo que no se puede leer, en vez de asumir que dijo que sí', () => {
    expect(interpretar('esto no es json', VERSION, AHORA)).toBeNull();
    expect(interpretar('null', VERSION, AHORA)).toBeNull();
    expect(interpretar(guardado({ decision: TODO_SI }), VERSION, AHORA)).toBeNull();
  });

  it('descarta la decisión tomada sobre otra versión de la política', () => {
    const crudo = guardado({
      version: '0.9',
      fecha: '2026-09-01T00:00:00.000Z',
      decision: TODO_SI,
    });

    expect(interpretar(crudo, VERSION, AHORA)).toBeNull();
  });

  it('descarta una decisión vencida', () => {
    const crudo = guardado({
      version: VERSION,
      fecha: '2025-09-01T00:00:00.000Z',
      decision: TODO_SI,
    });

    expect(interpretar(crudo, VERSION, AHORA)).toBeNull();
  });

  it('descarta una fecha que no es fecha', () => {
    const crudo = guardado({ version: VERSION, fecha: 'ayer', decision: TODO_SI });

    expect(interpretar(crudo, VERSION, AHORA)).toBeNull();
  });

  it('una decisión a medias mantiene apagado lo que no se autorizó', () => {
    const crudo = guardado({
      version: VERSION,
      fecha: '2026-09-01T00:00:00.000Z',
      decision: { analitica: true },
    });

    expect(interpretar(crudo, VERSION, AHORA)?.decision).toEqual({
      necesarias: true,
      preferencias: false,
      analitica: true,
      grabacion: false,
    });
  });
});

describe('vigencia', () => {
  it(`vence a los ${VIGENCIA_MESES} meses exactos`, () => {
    const justo = construir(TODO_SI, VERSION, new Date('2025-09-22T12:00:00.000Z'));

    expect(vencio(justo, AHORA)).toBe(true);
  });

  it('sigue vigente un día antes', () => {
    const casi = construir(TODO_SI, VERSION, new Date('2025-09-23T12:00:00.000Z'));

    expect(vencio(casi, AHORA)).toBe(false);
  });
});

describe('permite', () => {
  it('sin decisión, solo pasan las necesarias', () => {
    expect(permite(null, 'necesarias')).toBe(true);
    expect(permite(null, 'analitica')).toBe(false);
    expect(permite(null, 'grabacion')).toBe(false);
    expect(permite(null, 'preferencias')).toBe(false);
  });

  it('respeta cada categoría por separado', () => {
    const decision = construir({ analitica: true }, VERSION, AHORA);

    expect(permite(decision, 'analitica')).toBe(true);
    expect(permite(decision, 'grabacion')).toBe(false);
    expect(permite(decision, 'preferencias')).toBe(false);
  });
});

describe('construir', () => {
  it('deja constancia de la versión y la fecha, que es lo que la hace prueba', () => {
    const decision = construir(TODO_SI, VERSION, AHORA);

    expect(decision.version).toBe(VERSION);
    expect(decision.fecha).toBe(AHORA.toISOString());
    expect(decision.decision).toEqual(TODO_SI);
  });
});
