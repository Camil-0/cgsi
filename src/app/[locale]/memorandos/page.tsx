import { getTranslations, setRequestLocale } from 'next-intl/server';
import { memorandos } from '#contenido';
import { DobleFilete } from '@/components/documento/DobleFilete';
import { JsonLd } from '@/components/seo/JsonLd';
import { Link } from '@/i18n/navigation';
import { alternativas, migas } from '@/lib/seo';

import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

/** Listado de memorandos (Parte A §5). En producción solo lo publicado (B.8). */
function publicados() {
  return [...memorandos]
    .filter((memorando) => memorando.estado === 'publicado')
    .sort((uno, otro) => otro.numero - uno.numero);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('memorandos');

  return {
    title: t('titulo'),
    alternates: {
      ...alternativas('/memorandos'),
      types: { 'application/rss+xml': '/rss.xml' },
    },
  };
}

export default async function PaginaMemorandos({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const lista = publicados();

  return (
    <div className="documento">
      <JsonLd
        datos={[
          migas([
            { nombre: t('memorandos.inicio'), ruta: '/' },
            { nombre: t('memorandos.titulo'), ruta: '/memorandos' },
          ]),
        ]}
      />

      <main id="contenido" tabIndex={-1} className="documento-cuerpo py-16 lg:py-24">
        <p className="membrete">{t('sitio.nombre')}</p>
        <h1 className="mt-6 font-serif text-seccion text-tinta">{t('memorandos.titulo')}</h1>
        <DobleFilete className="mt-4" />

        {lista.length === 0 ? (
          <p className="pendiente mt-8 max-w-medida" data-pendiente="memorandos">
            {t('base.pendienteMemorandos')}
          </p>
        ) : (
          <ol className="lista-memorandos">
            {lista.map((memorando) => (
              <li key={memorando.slug} className="memorando-fila">
                <p className="memorando-numero">
                  {t('memorandos.numero', {
                    numero: String(memorando.numero).padStart(3, '0'),
                  })}
                </p>
                <h2 className="memorando-titulo">
                  <Link href={`/memorandos/${memorando.slug}`}>{memorando.titulo}</Link>
                </h2>
                <p className="memorando-resumen">{memorando.resumen}</p>
                <p className="memorando-meta">
                  <time dateTime={memorando.fecha}>{memorando.fecha}</time>
                </p>
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  );
}
