import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

import type { ReactNode } from 'react';

/**
 * Aviso de privacidad corto (B.5 y Parte A §7.2): va junto a la agenda y en el pie,
 * y siempre enlaza a la política completa. Visible antes de agendar.
 *
 * La casilla de autorización no vive aquí: es una pregunta obligatoria del formulario
 * de Cal.com (Parte A §6), y su registro queda en el webhook (F4).
 */
export async function AvisoPrivacidad({ children }: { children: ReactNode }) {
  const t = await getTranslations('documento');

  return (
    <p className="aviso-privacidad">
      {children} <Link href="/politica-de-datos">{t('politicaEnlace')}</Link>
    </p>
  );
}
