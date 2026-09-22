import { getTranslations, setRequestLocale } from 'next-intl/server';
import { documento } from '#contenido';
import { Cajetin } from '@/components/documento/Cajetin';
import { DobleFilete } from '@/components/documento/DobleFilete';
import { IndiceSecciones } from '@/components/documento/IndiceSecciones';
import { Mdx } from '@/components/documento/Mdx';
import { Seccion } from '@/components/documento/Seccion';
import { JsonLd } from '@/components/seo/JsonLd';
import { porTipo } from '@/lib/documento';
import { aclaraciones, primerParrafo, recortar } from '@/lib/extraer';
import { alternativas, organizacion, preguntasFrecuentes, sitioWeb } from '@/lib/seo';
import { fechaBuild, revision } from '@/lib/version';

import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * La descripción sale del subtítulo de la portada, que es copy de la Parte A §3:
 * así no hay una segunda versión del mensaje que se pueda desincronizar.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const portada = porTipo(documento, 'portada')[0];

  return {
    description: portada ? recortar(primerParrafo(portada.crudo)) : undefined,
    alternates: alternativas('/'),
  };
}

/** El documento I–VII. El copy es literal de la Parte A §3 y vive en `content/es/documento`. */
export default async function PaginaDocumento({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('sitio');

  const portada = porTipo(documento, 'portada')[0];
  const secciones = porTipo(documento, 'seccion');
  const pie = porTipo(documento, 'pie')[0];

  const proximosPasos = secciones.find((seccion) => seccion.slug === 'proximos-pasos');
  const faq = proximosPasos ? aclaraciones(proximosPasos.crudo) : [];

  return (
    <div className="documento">
      <JsonLd
        datos={[
          organizacion(),
          sitioWeb(),
          ...(faq.length > 0 ? [preguntasFrecuentes(faq)] : []),
        ]}
      />

      <div className="columna-indice">
        <IndiceSecciones secciones={secciones} />
        <Cajetin
          revision={revision()}
          fecha={fechaBuild()}
          numeralInicial={secciones[0]?.numeral ?? ''}
        />
      </div>

      {/* `tabIndex` para que «Saltar al contenido» mueva el foco de verdad (B.13) */}
      <main id="contenido" tabIndex={-1} className="documento-cuerpo">
        {portada ? (
          <header className="portada">
            <p className="membrete">{t('nombre')}</p>
            <h1 className="portada-titulo">{portada.titulo}</h1>
            <DobleFilete className="mt-8" />
            <Mdx cuerpo={portada.cuerpo} />
          </header>
        ) : null}

        {secciones.map((seccion) => (
          <Seccion
            key={seccion.slug}
            numeral={seccion.numeral}
            ancla={seccion.slug}
            titulo={seccion.titulo}
          >
            <Mdx cuerpo={seccion.cuerpo} />
          </Seccion>
        ))}

        {pie ? (
          <footer className="pie">
            <DobleFilete />
            <Mdx cuerpo={pie.cuerpo} />
          </footer>
        ) : null}
      </main>
    </div>
  );
}
