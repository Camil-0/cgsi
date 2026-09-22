import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { etiquetaIdioma, routing } from '@/i18n/routing';
import { entornoPublico } from '@/lib/env';
import { claseFuentes } from '@/lib/fuentes';
import '@/styles/globals.css';

import type { Metadata, Viewport } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  // Márgenes seguros en móvil (Parte A §2.3)
  viewportFit: 'cover',
};

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('sitio');

  return {
    metadataBase: new URL(entornoPublico().NEXT_PUBLIC_SITE_URL),
    title: { default: t('nombre'), template: `%s · ${t('nombre')}` },
    alternates: { canonical: '/' },
  };
}

export default async function LayoutRaiz({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={etiquetaIdioma[locale]} className={claseFuentes}>
      <body>
        {/* ScriptTema (B.3) e IndiceSecciones (B.5) entran en F1. */}
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
