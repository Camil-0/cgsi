import 'server-only';

import { entornoServidor } from '../env';
import { cloudApi } from './cloud-api';
import { evolution } from './evolution';
import { ninguno } from './ninguno';

/**
 * Adaptador de mensajería (B.10).
 *
 * **Prohibido** conectar el número comercial (+57 323 813 4588) a Evolution, y
 * **prohibido** enviar mensajes automáticos por WhatsApp a prospectos: su
 * confirmación llega por correo desde Cal.com. Esto solo avisa al fundador.
 */

export type Resultado = { ok: boolean; id?: string; error?: string };

export interface Mensajeria {
  enviarTexto(destino: string, texto: string): Promise<Resultado>;
}

export function mensajeria(): Mensajeria {
  switch (entornoServidor().MENSAJERIA_PROVEEDOR) {
    case 'evolution':
      return evolution();
    case 'cloud':
      return cloudApi();
    default:
      return ninguno();
  }
}

/** Aviso interno de una cita nueva, con el texto exacto de B.10. */
export function textoDeAviso(datos: {
  nombre: string;
  empresa: string;
  cuando: string;
  presupuesto: string;
}): string {
  return `Nueva cita · ${datos.nombre} (${datos.empresa}) · ${datos.cuando} COT · Presupuesto: ${datos.presupuesto}`;
}

/**
 * Avisa sin bloquear la respuesta del webhook: 3 segundos como máximo (B.10.6).
 * Si falla, se registra y se sigue; la cita ya quedó guardada, que es lo que importa.
 */
export async function avisar(texto: string, tiempoMaximo = 3000): Promise<Resultado> {
  const destino = entornoServidor().NOTIFICACIONES_DESTINO;
  if (!destino) return { ok: false, error: 'sin NOTIFICACIONES_DESTINO' };

  const corte = new Promise<Resultado>((resolver) =>
    setTimeout(() => resolver({ ok: false, error: 'tiempo agotado' }), tiempoMaximo),
  );

  return Promise.race([mensajeria().enviarTexto(destino, texto), corte]);
}
