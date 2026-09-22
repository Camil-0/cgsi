import { getTranslations } from 'next-intl/server';
import { DobleFilete } from '@/components/documento/DobleFilete';
import { Link } from '@/i18n/navigation';
import { fechaBuild, revision } from '@/lib/version';

/**
 * 404 — Folio no encontrado (Parte A §4.8): el mismo cajetín del documento,
 * con un enlace al índice.
 *
 * El cajetín va estático: en un folio que no existe no hay secciones que observar.
 */
export default async function FolioNoEncontrado() {
  const t = await getTranslations();

  return (
    <div className="documento">
      <main id="contenido" tabIndex={-1} className="documento-cuerpo py-24">
        <p className="membrete">{t('sitio.nombre')}</p>
        <h1 className="mt-6 font-serif text-seccion text-tinta">{t('folio.titulo')}</h1>
        <DobleFilete className="mt-6" />

        <p className="mt-8">
          <Link href="/">{t('folio.volver')}</Link>
        </p>

        <aside aria-label={t('documento.cajetin.etiqueta')} className="cajetin">
          {t('documento.cajetin.texto', {
            revision: revision(),
            fecha: fechaBuild(),
            pagina: '—',
          })}
        </aside>
      </main>
    </div>
  );
}
