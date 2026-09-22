import { getTranslations } from 'next-intl/server';

import type { SeccionDocumento } from '#contenido';

/**
 * Índice I–VII (B.5 y Parte A §2.3): fijo en las columnas 1–2 en escritorio,
 * compacto y deslizable en móvil.
 *
 * Es un componente de servidor: funciona sin JavaScript. El resaltado de la
 * sección actual lo agrega el `Cajetin`, que es quien observa el scroll.
 */
export async function IndiceSecciones({ secciones }: { secciones: SeccionDocumento[] }) {
  const t = await getTranslations('documento');

  return (
    <nav aria-label={t('indice')} className="indice">
      <ol className="indice-lista">
        {secciones.map((seccion) => (
          <li key={seccion.slug}>
            <a href={`#${seccion.slug}`} data-numeral={seccion.numeral} className="indice-enlace">
              <span className="indice-numeral">{seccion.numeral}</span>
              <span className="indice-titulo">{seccion.titulo}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
