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
      <div className="figura-lienzo">
        {/* El trazo es decoración: los cinco estados están en la lista de al lado. */}
        <svg
          className="figura-trazo"
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="100"
            className="stroke-carbon"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            data-figura-linea
          />
        </svg>

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
      </div>

      {mensajes ? null : (
        <p className="pendiente mt-4" data-pendiente="mensajes-whatsapp">
          {t('pendienteMensajes')}
        </p>
      )}

      <figcaption className="figura-pie">{titulo}</figcaption>
    </figure>
  );
}
