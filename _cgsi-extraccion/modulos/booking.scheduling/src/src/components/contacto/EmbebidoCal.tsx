'use client';

import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { useTranslations } from 'next-intl';

type Props = {
  enlace: string;
  alReservar: () => void;
};

/**
 * El embed en sí. Vive en su propio módulo para que `@calcom/embed-react` solo
 * se descargue cuando la agenda se pide (B.10).
 *
 * El nombre del evento de reserva exitosa cambió entre versiones del embed
 * (`bookingSuccessful` / `bookingSuccessfulV2`), así que se escuchan los dos:
 * el que no exista en esta versión simplemente no dispara.
 */
const EVENTOS_DE_RESERVA = ['bookingSuccessful', 'bookingSuccessfulV2'] as const;

/**
 * El embed vive en un iframe y no ve nuestras variables CSS, así que hay que
 * pasarle el color en hex. Se lee de `tokens.css` en vez de escribirlo a mano:
 * una sonda con `data-tema` puesto resuelve el token de cada tema.
 */
function tokenEnTema(tema: 'papel' | 'plano', nombre: string): string {
  const sonda = document.createElement('div');
  sonda.dataset.tema = tema;
  sonda.style.display = 'none';
  document.body.append(sonda);

  const valor = getComputedStyle(sonda).getPropertyValue(nombre).trim();
  sonda.remove();

  return valor;
}

export function EmbebidoCal({ enlace, alReservar }: Props) {
  const t = useTranslations('contacto');

  useEffect(() => {
    let vivo = true;

    void (async () => {
      const cal = await getCalApi();
      if (!vivo) return;

      cal('ui', {
        cssVarsPerTheme: {
          light: { 'cal-brand': tokenEnTema('papel', '--firma') },
          dark: { 'cal-brand': tokenEnTema('plano', '--firma') },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });

      for (const evento of EVENTOS_DE_RESERVA) {
        cal('on', { action: evento, callback: alReservar });
      }
    })();

    return () => {
      vivo = false;
    };
  }, [alReservar]);

  return (
    <Cal
      calLink={enlace}
      style={{ width: '100%', height: '100%', overflow: 'scroll' }}
      config={{ layout: 'month_view' }}
      aria-label={t('tituloAgenda')}
    />
  );
}
