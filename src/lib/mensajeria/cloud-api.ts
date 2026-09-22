import type { Mensajeria, Resultado } from './index';

/**
 * Meta Cloud API (B.10). **Queda implementado pero inactivo**: es la ruta para
 * automatizar el número comercial más adelante, por la vía oficial y
 * preferiblemente en coexistencia con la app.
 *
 * Fuera de la ventana de 24 horas solo se pueden enviar plantillas aprobadas,
 * así que este envío de texto libre sirve para responder, no para iniciar.
 */
const VERSION = 'v21.0';

export function cloudApi(): Mensajeria {
  return {
    async enviarTexto(destino, texto): Promise<Resultado> {
      const telefono = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const token = process.env.WHATSAPP_TOKEN;

      if (!telefono || !token) {
        return { ok: false, error: 'Cloud API sin configurar' };
      }

      try {
        const respuesta = await fetch(
          `https://graph.facebook.com/${VERSION}/${telefono}/messages`,
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: destino,
              type: 'text',
              text: { body: texto },
            }),
          },
        );

        if (!respuesta.ok) {
          return { ok: false, error: `Cloud API respondió ${respuesta.status}` };
        }

        const cuerpo = (await respuesta.json().catch(() => null)) as {
          messages?: Array<{ id?: string }>;
        } | null;

        return { ok: true, id: cuerpo?.messages?.[0]?.id };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : 'fallo de red' };
      }
    },
  };
}
