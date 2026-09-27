'use client';

import { useTranslations } from 'next-intl';
import { pedirConfiguracion } from '@/lib/consentimiento';

/**
 * «Configurar cookies» en el pie. La política promete que se puede cambiar la
 * decisión cuando sea, y este es el sitio donde se cumple esa promesa.
 */
export function BotonConfigurarCookies() {
  const t = useTranslations('cookies');

  return (
    <button type="button" className="enlace-pie" onClick={pedirConfiguracion}>
      {t('configurarPie')}
    </button>
  );
}
