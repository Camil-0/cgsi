import { getTranslations } from 'next-intl/server';
import { expedientes } from '#contenido';
import { Mdx } from '@/components/documento/Mdx';

/**
 * Expedientes de la sección IV.
 *
 * En F2 van apilados, cada uno con su etiqueta. F3 los convierte en pestañas de
 * carpeta con transición lateral (`PestanasExpediente`, B.5 y B.6), manteniendo
 * este contenido como panel.
 */
export async function Expedientes() {
  const t = await getTranslations('expedientes');
  const lista = [...expedientes].sort((uno, otro) => uno.numero - otro.numero);

  return (
    <div className="expedientes">
      {lista.map((expediente) => (
        <article
          key={expediente.slug}
          className="expediente"
          aria-labelledby={`expediente-${expediente.slug}`}
        >
          <h3 id={`expediente-${expediente.slug}`} className="expediente-titulo">
            {t('encabezado', {
              numero: String(expediente.numero).padStart(2, '0'),
              titulo: expediente.titulo,
            })}
          </h3>
          <p className="expediente-etiqueta">{expediente.etiqueta}</p>

          <Mdx cuerpo={expediente.cuerpo} />
        </article>
      ))}
    </div>
  );
}
