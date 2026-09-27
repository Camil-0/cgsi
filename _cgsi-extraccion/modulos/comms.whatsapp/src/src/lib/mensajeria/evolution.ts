import { entornoServidor } from '../env';

import type { Mensajeria, Resultado } from './index';

/**
 * Evolution API v2 (B.10).
 *
 * **Solo** para avisos internos al fundador, desde un número secundario.
 * El número comercial nunca se conecta por esta vía.
 *
 * La ruta `POST /message/sendText/{instancia}` hay que verificarla contra la
 * versión desplegada; el brief lo advierte y el error se registra tal cual.
 */
export function evolution(): Mensajeria {
  return {
    async enviarTexto(destino, texto): Promise<Resultado> {
      const env = entornoServidor();
      const { EVOLUTION_API_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCIA } = env;

      if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCIA) {
        return { ok: false, error: 'Evolution sin configurar' };
      }

      const url = `${EVOLUTION_API_URL.replace(/\/$/, '')}/message/sendText/${EVOLUTION_INSTANCIA}`;

      try {
        const respuesta = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json', apikey: EVOLUTION_API_KEY },
          body: JSON.stringify({ number: destino, text: texto }),
        });

        if (!respuesta.ok) {
          return { ok: false, error: `Evolution respondió ${respuesta.status}` };
        }

        const cuerpo = (await respuesta.json().catch(() => null)) as { key?: { id?: string } } | null;

        return { ok: true, id: cuerpo?.key?.id };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : 'fallo de red' };
      }
    },
  };
}
