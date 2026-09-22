import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Cajetin } from '@/components/documento/Cajetin';
import { DobleFilete } from '@/components/documento/DobleFilete';
import { Firma } from '@/components/documento/Firma';
import { IndiceSecciones } from '@/components/documento/IndiceSecciones';
import { Seccion } from '@/components/documento/Seccion';
import { SECCIONES } from '@/lib/documento';
import { fechaBuild, revision } from '@/lib/version';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * El documento I–VII.
 *
 * F1 arma el sistema: retícula, secciones, índice, cajetín y filetes.
 * El copy literal de la Parte A §3 entra en F2, desde MDX; hasta entonces cada
 * sección muestra su marcador `{PENDIENTE}`.
 */
export default async function PaginaDocumento({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="documento">
      <div className="columna-indice">
        <IndiceSecciones />
        <Cajetin revision={revision()} fecha={fechaBuild()} />
      </div>

      {/* `tabIndex` para que «Saltar al contenido» mueva el foco de verdad (B.13) */}
      <main id="contenido" tabIndex={-1} className="documento-cuerpo">
        <header className="py-16 lg:py-24">
          <p className="font-mono text-[0.75rem] tracking-[0.35em] text-lapiz uppercase">
            {t('sitio.nombre')}
          </p>
          <h1 className="mt-6 max-w-medida font-serif text-portada leading-[1.05] text-tinta">
            {t('sitio.razonSocial')}
          </h1>
          <DobleFilete className="mt-8" />
          <p className="pendiente mt-8 max-w-medida">{t('base.pendientePortada')}</p>
        </header>

        {SECCIONES.map(({ numeral, ancla }) => (
          <Seccion
            key={ancla}
            numeral={numeral}
            ancla={ancla}
            titulo={t(`documento.secciones.${ancla}`)}
          >
            <p className="pendiente">{t('base.pendienteSeccion', { numeral })}</p>
            {ancla === 'lo-que-firmamos' ? <Firma /> : null}
          </Seccion>
        ))}
      </main>
    </div>
  );
}
