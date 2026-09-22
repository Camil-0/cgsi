import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

/**
 * Webhook de Cal.com (B.10).
 *
 * La firma se calcula sobre el **cuerpo crudo**, nunca sobre el JSON reserializado:
 * cualquier diferencia de espacios o de orden de claves cambiaría el HMAC.
 */

/** Cal.com no firma una marca de tiempo, así que un mensaje capturado se podría
 *  reenviar. Lo que neutraliza el duplicado es la idempotencia por `uid` (B.10.4). */
export function verificarFirma(cuerpoCrudo: string, firma: string, secreto: string): boolean {
  if (!firma || !secreto) return false;

  const esperada = createHmac('sha256', secreto).update(cuerpoCrudo).digest('hex');
  const recibida = firma.trim().toLowerCase();

  if (recibida.length !== esperada.length) return false;

  return timingSafeEqual(Buffer.from(esperada, 'hex'), Buffer.from(recibida, 'hex'));
}

const asistente = z.object({
  name: z.string().min(1),
  email: z.email(),
  phoneNumber: z.string().optional(),
  timeZone: z.string().optional(),
});

export const esquemaWebhook = z.object({
  triggerEvent: z.enum([
    'BOOKING_CREATED',
    'BOOKING_RESCHEDULED',
    'BOOKING_CANCELLED',
    'BOOKING_REQUESTED',
    'BOOKING_REJECTED',
    'BOOKING_PAID',
    'MEETING_ENDED',
  ]),
  payload: z.object({
    uid: z.string().min(1),
    startTime: z.iso.datetime({ offset: true }).optional(),
    endTime: z.iso.datetime({ offset: true }).optional(),
    attendees: z.array(asistente).min(1),
    responses: z.record(z.string(), z.unknown()).optional(),
  }),
});

export type Webhook = z.infer<typeof esquemaWebhook>;

/** Los eventos que cambian el estado de un prospecto. El resto se responde 200 sin hacer nada. */
export const EVENTOS_QUE_IMPORTAN = [
  'BOOKING_CREATED',
  'BOOKING_RESCHEDULED',
  'BOOKING_CANCELLED',
] as const;

export type EventoQueImporta = (typeof EVENTOS_QUE_IMPORTAN)[number];

export function importa(evento: Webhook['triggerEvent']): evento is EventoQueImporta {
  return (EVENTOS_QUE_IMPORTAN as readonly string[]).includes(evento);
}

/** Las respuestas del formulario llegan como texto suelto o como `{ value }`. */
export function textoDeRespuesta(valor: unknown): string | undefined {
  if (typeof valor === 'string') return valor;
  if (typeof valor === 'number' || typeof valor === 'boolean') return String(valor);

  if (valor && typeof valor === 'object' && 'value' in valor) {
    return textoDeRespuesta((valor as { value: unknown }).value);
  }

  return undefined;
}

export function respuestasPlanas(
  responses: Record<string, unknown> | undefined,
): Record<string, string> {
  if (!responses) return {};

  return Object.fromEntries(
    Object.entries(responses)
      .map(([clave, valor]) => [clave, textoDeRespuesta(valor)])
      .filter((par): par is [string, string] => typeof par[1] === 'string' && par[1].length > 0),
  );
}
