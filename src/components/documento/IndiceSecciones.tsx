import { getTranslations } from 'next-intl/server';
import { SECCIONES } from '@/lib/documento';

/**
 * Índice I–VII (B.5 y Parte A §2.3): fijo en las columnas 1–2 en escritorio,
 * compacto y deslizable en móvil.
 *
 * Es un componente de servidor: funciona sin JavaScript. El resaltado de la
 * sección actual lo agrega el `Cajetin`, que es quien observa el scroll.
 */
export async function IndiceSecciones() {
  const t = await getTranslations('documento');

  return (
    <nav aria-label={t('indice')} className="indice">
      <ol className="indice-lista">
        {SECCIONES.map(({ numeral, ancla }) => (
          <li key={ancla}>
            <a href={`#${ancla}`} data-numeral={numeral} className="indice-enlace">
              <span className="indice-numeral">{numeral}</span>
              <span className="indice-titulo">{t(`secciones.${ancla}`)}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
