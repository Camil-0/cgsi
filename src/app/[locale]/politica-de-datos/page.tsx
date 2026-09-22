import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { legal } from '#contenido';
import { DobleFilete } from '@/components/documento/DobleFilete';
import { Mdx } from '@/components/documento/Mdx';

import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

const RUTA = 'politica-de-datos';

function politica() {
  return legal.find((documento) => documento.slug === RUTA);
}

/** Fecha en dd.mm.aaaa desde la fecha ISO del frontmatter, sin depender de la zona. */
function formatear(iso: string): string {
  const [anio, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}.${mes}.${anio}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const documento = politica();
  if (!documento) return {};

  return {
    title: documento.titulo,
    alternates: { canonical: `/${RUTA}` },
  };
}

export default async function PaginaPolitica({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const documento = politica();
  if (!documento) notFound();

  const t = await getTranslations();
  const fecha = formatear(documento.vigenteDesde);

  return (
    <div className="documento">
      <main id="contenido" tabIndex={-1} className="documento-cuerpo py-16 lg:py-24">
        <p className="membrete">{t('sitio.razonSocial')}</p>
        <h1 className="mt-6 max-w-medida font-serif text-seccion text-tinta">{documento.titulo}</h1>
        <p className="mt-3 font-mono text-[0.8125rem] tracking-[0.02em] text-lapiz">
          {t('legal.vigencia', { version: documento.version, fecha })}
        </p>
        <DobleFilete className="mt-6" />

        <p className="pendiente mt-8 max-w-medida" data-pendiente="politica">
          {t('base.pendientePolitica')}
        </p>

        <div className="max-w-medida">
          <Mdx cuerpo={documento.cuerpo} extra={{ Vigencia: () => fecha }} />
        </div>
      </main>
    </div>
  );
}
