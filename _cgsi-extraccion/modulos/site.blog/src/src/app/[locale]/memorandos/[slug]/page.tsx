import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { memorandos } from '#contenido';
import { BotonWhatsApp } from '@/components/contacto/BotonWhatsApp';
import { Cta } from '@/components/documento/Cta';
import { DobleFilete } from '@/components/documento/DobleFilete';
import { Acciones } from '@/components/documento/Franja';
import { Mdx } from '@/components/documento/Mdx';
import { JsonLd } from '@/components/seo/JsonLd';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { alternativas, entradaDeBlog, migas } from '@/lib/seo';

import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

function buscar(slug: string) {
  const memorando = memorandos.find((candidato) => candidato.slug === slug);

  // Un borrador no existe para quien visita: se comporta como una ruta que no está.
  return memorando?.estado === 'publicado' ? memorando : undefined;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    memorandos
      .filter((memorando) => memorando.estado === 'publicado')
      .map((memorando) => ({ locale, slug: memorando.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const memorando = buscar(slug);
  if (!memorando) return {};

  return {
    title: memorando.titulo,
    description: memorando.resumen,
    alternates: alternativas(`/memorandos/${memorando.slug}`),
    openGraph: {
      type: 'article',
      title: memorando.titulo,
      description: memorando.resumen,
      publishedTime: memorando.fecha,
      authors: ['Camilo Charris C.'],
    },
  };
}

export default async function PaginaMemorando({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const memorando = buscar(slug);
  if (!memorando) notFound();

  const t = await getTranslations();
  const numero = String(memorando.numero).padStart(3, '0');

  return (
    <div className="documento">
      <JsonLd
        datos={[
          entradaDeBlog(memorando),
          migas([
            { nombre: t('memorandos.inicio'), ruta: '/' },
            { nombre: t('memorandos.titulo'), ruta: '/memorandos' },
            { nombre: memorando.titulo, ruta: `/memorandos/${memorando.slug}` },
          ]),
        ]}
      />

      <main id="contenido" tabIndex={-1} className="documento-cuerpo py-16 lg:py-24">
        <article>
          <p className="membrete">{t('memorandos.numero', { numero })}</p>
          <h1 className="mt-6 max-w-medida font-serif text-seccion text-tinta">
            {memorando.titulo}
          </h1>
          <DobleFilete className="mt-6" />

          {/* Cajetín del memorando, con el formato de los memorandos de CGSI. */}
          <dl className="destinatario">
            <dt>{t('documento.destinatario.para')}</dt>
            <dd>{memorando.para}</dd>
            <dt>{t('documento.destinatario.de')}</dt>
            <dd>{t('documento.firma.nombre')}</dd>
            <dt>{t('memorandos.fecha')}</dt>
            <dd>
              <time dateTime={memorando.fecha}>{memorando.fecha}</time>
            </dd>
            <dt>{t('memorandos.asunto')}</dt>
            <dd>{memorando.asunto}</dd>
          </dl>

          <div className="mt-10 max-w-medida">
            <Mdx cuerpo={memorando.cuerpo} />
          </div>
        </article>

        {/* Cada memorando cierra con la invitación al diagnóstico (Parte A §5). */}
        <footer className="cierre-memorando">
          <DobleFilete />
          <Acciones>
            <Cta href="/#proximos-pasos" microcopy={t('contacto.agendarMicrocopy')}>
              {t('contacto.agendar')}
            </Cta>
            <BotonWhatsApp />
          </Acciones>

          <p className="mt-8">
            <Link href="/memorandos">{t('memorandos.volver')}</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
