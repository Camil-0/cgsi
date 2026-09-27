'use client';

import { useTranslations } from 'next-intl';

/** «Descargar como PDF» (Parte A §4.5): invoca la impresión del navegador. */
export function BotonImprimir() {
  const t = useTranslations('documento');

  return (
    <button type="button" className="boton-barra boton-imprimir" onClick={() => window.print()}>
      {t('descargarPdf')}
    </button>
  );
}
