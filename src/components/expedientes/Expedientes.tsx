import { getTranslations } from 'next-intl/server';
import { expedientes } from '#contenido';
import { Mdx } from '@/components/documento/Mdx';
import { PestanasExpediente } from './PestanasExpediente';

/**
 * Expedientes de la sección IV: pestañas de carpeta con transición lateral
 * (Parte A §3, IV). Los paneles se arman en el servidor y se entregan ya
 * renderizados a las pestañas, que solo se ocupan de la interacción.
 */
export async function Expedientes() {
  const t = await getTranslations('expedientes');
  const lista = [...expedientes].sort((uno, otro) => uno.numero - otro.numero);

  const pestanas = lista.map((expediente) => ({
    id: expediente.slug,
    etiqueta: t('encabezado', {
      numero: String(expediente.numero).padStart(2, '0'),
      titulo: expediente.titulo,
    }),
  }));

  return (
    <PestanasExpediente titulo={t('lista')} pestanas={pestanas}>
      {lista.map((expediente) => (
        <article key={expediente.slug} className="expediente">
          <p className="expediente-etiqueta">{expediente.etiqueta}</p>
          <Mdx cuerpo={expediente.cuerpo} />
        </article>
      ))}
    </PestanasExpediente>
  );
}
