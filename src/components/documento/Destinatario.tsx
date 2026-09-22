import { getTranslations } from 'next-intl/server';

type Props = {
  para: string;
  de: string;
};

/** Bloque «Para / De» de la portada, con el formato de los memorandos de CGSI. */
export async function Destinatario({ para, de }: Props) {
  const t = await getTranslations('documento.destinatario');

  return (
    <dl className="destinatario">
      <dt>{t('para')}</dt>
      <dd>{para}</dd>
      <dt>{t('de')}</dt>
      <dd>{de}</dd>
    </dl>
  );
}
