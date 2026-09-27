import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  esquemaWebhook,
  importa,
  respuestasPlanas,
  textoDeRespuesta,
  verificarFirma,
} from '@/lib/cal';

/** Webhook de Cal.com (B.10 y B.16). */

const SECRETO = 'secreto-de-prueba';

const cuerpo = JSON.stringify({
  triggerEvent: 'BOOKING_CREATED',
  payload: {
    uid: 'abc123',
    startTime: '2026-10-01T15:00:00.000Z',
    endTime: '2026-10-01T15:30:00.000Z',
    attendees: [{ name: 'Ana Ruiz', email: 'ana@ejemplo.com', phoneNumber: '573001112233' }],
    responses: {
      '¿A qué se dedica tu empresa?': { value: 'Floristería' },
      '¿Tienen presupuesto aprobado para este proyecto?': 'En evaluación',
    },
  },
});

function firmar(texto: string, secreto = SECRETO): string {
  return createHmac('sha256', secreto).update(texto).digest('hex');
}

describe('verificación de la firma', () => {
  it('acepta una firma válida', () => {
    expect(verificarFirma(cuerpo, firmar(cuerpo), SECRETO)).toBe(true);
  });

  it('rechaza una firma inválida', () => {
    expect(verificarFirma(cuerpo, firmar(cuerpo, 'otro-secreto'), SECRETO)).toBe(false);
  });

  it('rechaza un cuerpo alterado con la firma original', () => {
    const alterado = cuerpo.replace('Ana Ruiz', 'Otra Persona');

    expect(verificarFirma(alterado, firmar(cuerpo), SECRETO)).toBe(false);
  });

  it('rechaza una firma vacía o sin secreto', () => {
    expect(verificarFirma(cuerpo, '', SECRETO)).toBe(false);
    expect(verificarFirma(cuerpo, firmar(cuerpo), '')).toBe(false);
  });

  it('rechaza una firma de largo distinto sin reventar', () => {
    expect(verificarFirma(cuerpo, 'abc', SECRETO)).toBe(false);
  });

  it('no distingue mayúsculas en la firma recibida', () => {
    expect(verificarFirma(cuerpo, firmar(cuerpo).toUpperCase(), SECRETO)).toBe(true);
  });
});

describe('esquema del webhook', () => {
  it('acepta una reserva completa', () => {
    const resultado = esquemaWebhook.safeParse(JSON.parse(cuerpo));

    expect(resultado.success).toBe(true);
  });

  it('rechaza una reserva sin uid', () => {
    const sinUid = JSON.parse(cuerpo);
    delete sinUid.payload.uid;

    expect(esquemaWebhook.safeParse(sinUid).success).toBe(false);
  });

  it('rechaza una reserva sin asistentes', () => {
    const sinAsistentes = JSON.parse(cuerpo);
    sinAsistentes.payload.attendees = [];

    expect(esquemaWebhook.safeParse(sinAsistentes).success).toBe(false);
  });

  it('rechaza un correo que no es correo', () => {
    const malCorreo = JSON.parse(cuerpo);
    malCorreo.payload.attendees[0].email = 'no-es-un-correo';

    expect(esquemaWebhook.safeParse(malCorreo).success).toBe(false);
  });
});

describe('eventos que importan', () => {
  it('reconoce los tres que cambian el estado de un prospecto', () => {
    expect(importa('BOOKING_CREATED')).toBe(true);
    expect(importa('BOOKING_RESCHEDULED')).toBe(true);
    expect(importa('BOOKING_CANCELLED')).toBe(true);
  });

  it('ignora el resto', () => {
    expect(importa('MEETING_ENDED')).toBe(false);
    expect(importa('BOOKING_PAID')).toBe(false);
  });
});

describe('respuestas del formulario', () => {
  it('lee texto suelto y objetos con value', () => {
    expect(textoDeRespuesta('Floristería')).toBe('Floristería');
    expect(textoDeRespuesta({ value: 'Sí' })).toBe('Sí');
    expect(textoDeRespuesta({ value: { value: 'anidado' } })).toBe('anidado');
    expect(textoDeRespuesta(undefined)).toBeUndefined();
  });

  it('aplana las respuestas y descarta lo vacío', () => {
    const planas = respuestasPlanas({
      empresa: { value: 'Floristería' },
      presupuesto: 'En evaluación',
      vacio: '',
      nulo: null,
    });

    expect(planas).toEqual({ empresa: 'Floristería', presupuesto: 'En evaluación' });
  });
});
