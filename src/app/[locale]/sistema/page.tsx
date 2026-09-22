import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Diff } from '@/components/documento/Diff';
import { DobleFilete } from '@/components/documento/DobleFilete';
import { Firma } from '@/components/documento/Firma';
import { Nota } from '@/components/documento/Nota';

import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Página interna de referencia del sistema documento.
 *
 * Existe para que los componentes de B.5 que todavía no tienen contenido real
 * (`Nota` y `Diff`) se puedan ver, probar con teclado y auditar con axe antes de
 * que entre el copy en F2. Los ejemplos son literales del brief.
 *
 * No se indexa. Se reevalúa en F6.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('sistema');

  return {
    title: t('titulo'),
    robots: { index: false, follow: false },
  };
}

export default async function PaginaSistema({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('sistema');

  return (
    <div className="documento">
      <main id="contenido" tabIndex={-1} className="documento-cuerpo py-16">
        <h1 className="font-serif text-seccion text-tinta">{t('titulo')}</h1>
        <DobleFilete className="mt-4" />
        <p className="mt-6 max-w-medida">{t('descripcion')}</p>

        <section aria-labelledby="ejemplo-nota" className="mt-16">
          <h2 id="ejemplo-nota" className="font-serif text-[1.5rem] text-tinta">
            {t('notaTitulo')}
          </h2>
          <div className="mt-4 max-w-medida">
            <p>
              {t('notaParrafo')}
              <Nota n={3}>{t('notaTexto')}</Nota>
            </p>
          </div>
        </section>

        <section aria-labelledby="ejemplo-diff" className="mt-16">
          <h2 id="ejemplo-diff" className="font-serif text-[1.5rem] text-tinta">
            {t('diffTitulo')}
          </h2>
          <div className="max-w-medida">
            <Diff
              titulo={t('diffTitulo')}
              lineas={[
                { signo: 'quita', texto: t('diffQuita1') },
                { signo: 'agrega', texto: t('diffAgrega1') },
                { signo: 'quita', texto: t('diffQuita2') },
                { signo: 'agrega', texto: t('diffAgrega2') },
              ]}
            />
          </div>
        </section>

        <section aria-labelledby="ejemplo-firma" className="mt-16">
          <h2 id="ejemplo-firma" className="font-serif text-[1.5rem] text-tinta">
            {t('firmaTitulo')}
          </h2>
          <Firma />
        </section>
      </main>
    </div>
  );
}
