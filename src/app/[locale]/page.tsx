import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * F0: página base con los tokens y las fuentes aplicados.
 * El documento I–VII se arma en F1 y se llena con el copy de la Parte A §3 en F2.
 */
export default async function PaginaDocumento({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main id="contenido" className="mx-auto max-w-medida px-6 py-24">
      <p className="font-mono text-[0.8125rem] tracking-[0.02em] text-lapiz">
        {t('sitio.referencia')}
      </p>
      <h1 className="mt-4 font-serif text-seccion text-tinta">{t('sitio.razonSocial')}</h1>
      <p className="mt-8 font-mono text-[0.8125rem] text-lapiz">{t('base.pendienteDocumento')}</p>
    </main>
  );
}
