import { entornoServidor } from '@/lib/env';
import { esquemaWebhook, importa, respuestasPlanas, verificarFirma } from '@/lib/cal';
import { fechaCortaCot } from '@/lib/fechas';
import { hayFirestore } from '@/lib/firebase-admin';
import { avisar, textoDeAviso } from '@/lib/mensajeria';
import { guardarProspecto } from '@/lib/prospectos';

/**
 * `POST /api/cal/webhook` (B.10). Runtime Node: hace falta `crypto` para el HMAC.
 *
 * 1. Cuerpo crudo, máximo 64 KB.
 * 2. HMAC-SHA256 con `timingSafeEqual` contra `x-cal-signature-256`. Si no: 401.
 * 3. Zod. Si no: 400.
 * 4. Idempotencia por `payload.uid`.
 * 5. Aviso interno con tope de 3 s, sin bloquear la respuesta.
 * 6. 200 en menos de 2 s.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LIMITE_BYTES = 64 * 1024;

export async function POST(peticion: Request): Promise<Response> {
  const secreto = entornoServidor().CAL_WEBHOOK_SECRET;
  if (!secreto) {
    console.error('[cal] CAL_WEBHOOK_SECRET sin configurar. Ver TODO.md, punto 3.');
    return new Response('sin configurar', { status: 503 });
  }

  const cuerpo = await peticion.text();
  if (Buffer.byteLength(cuerpo, 'utf8') > LIMITE_BYTES) {
    return new Response('cuerpo demasiado grande', { status: 413 });
  }

  const firma = peticion.headers.get('x-cal-signature-256') ?? '';
  if (!verificarFirma(cuerpo, firma, secreto)) {
    return new Response('firma inválida', { status: 401 });
  }

  const analizado = esquemaWebhook.safeParse(JSON.parse(cuerpo || '{}'));
  if (!analizado.success) {
    return new Response('cuerpo inválido', { status: 400 });
  }

  const webhook = analizado.data;
  if (!importa(webhook.triggerEvent)) {
    return new Response(null, { status: 200 });
  }

  if (hayFirestore()) {
    try {
      await guardarProspecto(webhook);
    } catch (error) {
      console.error('[cal] no se pudo guardar el prospecto', error);
      // 500 para que Cal.com reintente: perder una cita es peor que un reintento.
      return new Response('no se pudo guardar', { status: 500 });
    }
  } else {
    console.warn('[cal] Firestore sin configurar; la cita no se guardó. Ver TODO.md, punto 4.');
  }

  if (webhook.triggerEvent === 'BOOKING_CREATED') {
    const respuestas = respuestasPlanas(webhook.payload.responses);
    const presupuesto =
      Object.entries(respuestas).find(([clave]) => /presupuesto|budget/i.test(clave))?.[1] ??
      'sin responder';

    const texto = textoDeAviso({
      nombre: webhook.payload.attendees[0]?.name ?? '',
      empresa: Object.entries(respuestas).find(([clave]) => /empresa|dedica/i.test(clave))?.[1] ?? '',
      cuando: fechaCortaCot(
        webhook.payload.startTime ? new Date(webhook.payload.startTime) : new Date(),
      ),
      presupuesto,
    });

    // Sin `await`: la respuesta no espera al aviso (B.10.6).
    void avisar(texto).then((resultado) => {
      if (!resultado.ok) console.warn('[cal] aviso interno no enviado:', resultado.error);
    });
  }

  return new Response(null, { status: 200 });
}
