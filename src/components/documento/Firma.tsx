import { getTranslations } from 'next-intl/server';

/**
 * Firma del fundador (B.5, decisión cerrada de la Parte A §0):
 * compuesta en tipografía sobre un filete en `--firma`. Texto real, nunca imagen,
 * y nunca la firma manuscrita.
 */
export async function Firma() {
  const t = await getTranslations('documento.firma');

  return (
    <div className="mt-12 max-w-[22rem]">
      <div className="h-[3px] w-full bg-firma" aria-hidden="true" />
      <p className="mt-3 font-serif text-[1.375rem] text-tinta">{t('nombre')}</p>
      <p className="font-mono text-[0.8125rem] tracking-[0.02em] text-lapiz">{t('cargo')}</p>
    </div>
  );
}
