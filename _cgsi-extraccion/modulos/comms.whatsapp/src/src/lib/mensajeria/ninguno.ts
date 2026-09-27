import type { Mensajeria, Resultado } from './index';

/**
 * Proveedor por defecto en desarrollo y en las pruebas (B.10): solo registra.
 * Así nadie manda un WhatsApp de verdad desde un entorno que no es producción.
 */
export function ninguno(): Mensajeria {
  return {
    enviarTexto(destino, texto): Promise<Resultado> {
      console.info('[mensajeria:ninguno]', { destino, texto });

      return Promise.resolve({ ok: true, id: 'ninguno' });
    },
  };
}
