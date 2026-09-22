import { getTranslations } from 'next-intl/server';
import { entornoPublico } from '@/lib/env';

import type { ReactNode } from 'react';

type Props = {
  /** Etiqueta. Si no viene, se usa la de `messages`. */
  children?: ReactNode;
  clase?: string;
};

/**
 * Enlace a WhatsApp (B.5 y Parte A §6).
 *
 * El sitio **no conecta el número comercial a ninguna API**: esto es un `wa.me`
 * con el texto prellenado, nada más. Quien responde es una persona, desde el
 * teléfono, en menos de una hora hábil.
 */
export async function BotonWhatsApp({ children, clase = 'cta cta-secundario' }: Props) {
  const t = await getTranslations('contacto');
  const numero = entornoPublico().NEXT_PUBLIC_WHATSAPP_NUMERO;
  const etiqueta = children ?? t('whatsapp');

  if (!numero) {
    return (
      <span className="pendiente" data-pendiente="whatsapp">
        {etiqueta}
      </span>
    );
  }

  const enlace = `https://wa.me/${numero}?text=${encodeURIComponent(t('whatsappTexto'))}`;

  return (
    <a href={enlace} className={clase} rel="noopener noreferrer" target="_blank">
      {etiqueta}
    </a>
  );
}
