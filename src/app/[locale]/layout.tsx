import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BotonImprimir } from '@/components/documento/BotonImprimir';
import { Movimiento } from '@/components/movimiento/Movimiento';
import { ScriptMovimiento } from '@/components/movimiento/ScriptMovimiento';
import { AplicarTema } from '@/components/tema/AplicarTema';
import { InterruptorPapelPlano } from '@/components/tema/InterruptorPapelPlano';
import { ScriptTema } from '@/components/tema/ScriptTema';
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

  const t = await getTranslations();

  // `suppressHydrationWarning` en el `<html>`: `ScriptTema` escribe `data-tema`
  // antes de que React hidrate, y sin esto React lo borraría al reconciliar.
  return (
    <html lang={etiquetaIdioma[locale]} className={claseFuentes} suppressHydrationWarning>
      <body>
        <ScriptTema />
        <ScriptMovimiento />
        <AplicarTema />
        <Movimiento />

        {/* Sin JavaScript las notas quedan visibles: nunca hay contenido
            atrapado detrás de un botón que no responde. */}
        <noscript>
          <style>{'.nota-cuerpo{display:block !important}'}</style>
        </noscript>

        <p className="hoja-encabezado">
          {t('sitio.nombre')} · {t('sitio.referencia')}
        </p>

        <a className="saltar" href="#contenido">
          {t('documento.saltarAlContenido')}
        </a>

        <NextIntlClientProvider>
          <div className="barra" data-sin-imprimir>
            <InterruptorPapelPlano />
            <BotonImprimir />
          </div>

          {children}
        </NextIntlClientProvider>

        <p className="hoja-pie">
          {t('sitio.razonSocial')} · {t('sitio.nit')} · {t('sitio.correo')}
        </p>
      </body>
    </html>
  );
}
