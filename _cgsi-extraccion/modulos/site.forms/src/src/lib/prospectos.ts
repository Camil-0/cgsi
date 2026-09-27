import 'server-only';

import { entornoServidor } from './env';
import { expiraEn } from './fechas';
import { firestore } from './firebase-admin';
import { respuestasPlanas } from './cal';

import type { Webhook } from './cal';

/**
 * Registro de prospectos (B.10). El documento es `prospectos/{uid}`: el id es el
 * `uid` de la reserva, y eso es lo que hace idempotente al webhook.
 *
 * Cada cambio de estado agrega un registro en `prospectos/{uid}/eventos`.
 * Esos registros solo se agregan, nunca se editan.
 */

export const COLECCION = 'prospectos';

export type EstadoProspecto =
  | 'nuevo'
  | 'contactado'
  | 'propuesta'
  | 'ganado'
  | 'perdido'
  | 'cancelado';

export type Prospecto = {
  nombre: string;
  empresa?: string;
  correo: string;
  telefono?: string;
  respuestas: Record<string, string>;
  estado: EstadoProspecto;
  cita: { inicio?: string; fin?: string; zona: 'America/Bogota' };
  consentimiento: {
    aceptado: true;
    versionPolitica: string;
    fecha: string;
    medio: 'cal.com';
  };
  creadoEn: string;
  ultimoContacto: string;
  /** `ultimoContacto` + 24 meses. Es el campo sobre el que corre el TTL. */
  expiraEn: Date;
};

/** La pregunta por la empresa es la primera del formulario (Parte A §6). */
function empresaDe(respuestas: Record<string, string>): string | undefined {
  const clave = Object.keys(respuestas).find((nombre) =>
    /empresa|company|dedica/i.test(nombre),
  );

  return clave ? respuestas[clave] : undefined;
}

export function prospectoDesdeWebhook(webhook: Webhook, ahora: Date): Prospecto {
  const asistente = webhook.payload.attendees[0];
  const respuestas = respuestasPlanas(webhook.payload.responses);
  const momento = ahora.toISOString();

  return {
    nombre: asistente?.name ?? '',
    empresa: empresaDe(respuestas),
    correo: asistente?.email ?? '',
    telefono: asistente?.phoneNumber,
    respuestas,
    estado: 'nuevo',
    cita: {
      inicio: webhook.payload.startTime,
      fin: webhook.payload.endTime,
      zona: 'America/Bogota',
    },
    consentimiento: {
      aceptado: true,
      versionPolitica: entornoServidor().POLITICA_VERSION,
      fecha: momento,
      medio: 'cal.com',
    },
    creadoEn: momento,
    ultimoContacto: momento,
    expiraEn: expiraEn(ahora),
  };
}

type Registro = {
  evento: Webhook['triggerEvent'];
  fecha: string;
};

/**
 * Crea el prospecto si no existe, o actualiza su estado si ya estaba.
 * La idempotencia sale de usar `uid` como id del documento (B.10.4).
 */
export async function guardarProspecto(webhook: Webhook, ahora = new Date()): Promise<void> {
  const db = firestore();
  const documento = db.collection(COLECCION).doc(webhook.payload.uid);
  const registro: Registro = { evento: webhook.triggerEvent, fecha: ahora.toISOString() };

  if (webhook.triggerEvent === 'BOOKING_CREATED') {
    await documento.set(prospectoDesdeWebhook(webhook, ahora), { merge: true });
  } else {
    await documento.set(
      {
        estado: webhook.triggerEvent === 'BOOKING_CANCELLED' ? 'cancelado' : 'nuevo',
        cita: {
          inicio: webhook.payload.startTime,
          fin: webhook.payload.endTime,
          zona: 'America/Bogota',
        },
        ultimoContacto: ahora.toISOString(),
        expiraEn: expiraEn(ahora),
      },
      { merge: true },
    );
  }

  await documento.collection('eventos').add(registro);
}
