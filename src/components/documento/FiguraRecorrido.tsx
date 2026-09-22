import { getTranslations } from 'next-intl/server';

type Props = {
  titulo: string;
  estados: string[];
  /** Mensaje de WhatsApp que recibe el cliente en cada estado (Parte A §3, IV) */
  mensajes?: string[];
};

/**
 * Fig. 1 — Recorrido de un pedido (B.5 y Parte A §4.4).
 *
 * En F2 es la versión estática y accesible: una lista ordenada con los cinco estados
 * numerados, que es exactamente lo que debe verse sin JavaScript o con movimiento
 * reducido. F3 le agrega encima el SVG de líneas ligado al scroll, sin quitar la lista.
 */
export async function FiguraRecorrido({ titulo, estados, mensajes }: Props) {
  const t = await getTranslations('base');

  return (
    <figure className="figura" data-figura-recorrido>
      <ol className="figura-estados">
        {estados.map((estado, indice) => (
          <li key={estado} className="figura-estado" data-estado={indice + 1}>
            <span className="figura-numero" aria-hidden="true">
              {indice + 1}
            </span>
            <span className="figura-nombre">{estado}</span>
            {mensajes?.[indice] ? (
              <span className="figura-mensaje">{mensajes[indice]}</span>
            ) : null}
          </li>
        ))}
      </ol>

      {mensajes ? null : (
        <p className="pendiente mt-4" data-pendiente="mensajes-whatsapp">
          {t('pendienteMensajes')}
        </p>
      )}

      <figcaption className="figura-pie">{titulo}</figcaption>
    </figure>
  );
}
