'use client';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect } from 'react';
import { useConsentimiento } from '@/components/consentimiento/useConsentimiento';
import { permite } from '@/lib/consentimiento';

import type { PostHog } from 'posthog-js';

/**
 * Analítica (B.1, Parte A §7.5 y §12 de la política).
 *
 * **Nada se carga antes de que la persona lo autorice.** Mientras no acepte la
 * categoría «analítica», el código de PostHog ni siquiera se descarga, y Vercel
 * Web Analytics y Speed Insights tampoco se montan.
 *
 * Con la autorización puesta, PostHog corre con toda su funcionalidad: cookie de
 * identificación, páginas vistas, autocaptura de clics y, si además se autoriza
 * la categoría «grabación de sesión», la repetición de la navegación con los
 * campos de formulario enmascarados.
 *
 * Si la persona retira el permiso, se le dice a PostHog que deje de capturar y
 * que borre lo que guardó en el navegador.
 */
type Props = {
  clave?: string;
  host?: string;
  /** Versión de la política, que es contra la que se guarda la decisión. */
  version: string;
};

let instancia: PostHog | undefined;

export function Analitica({ clave, host, version }: Props) {
  const consentimiento = useConsentimiento(version);
  const analitica = permite(consentimiento, 'analitica');
  const grabacion = permite(consentimiento, 'grabacion');

  useEffect(() => {
    if (!clave) return;

    if (!analitica) {
      // Sin permiso: si había sesión en marcha, se corta y se limpia el rastro.
      instancia?.stopSessionRecording();
      instancia?.opt_out_capturing();
      instancia?.reset(true);
      return;
    }

    let vivo = true;

    void import('posthog-js').then(({ default: posthog }) => {
      if (!vivo) return;

      if (!instancia) {
        instancia = posthog.init(clave, {
          api_host: host ?? 'https://us.i.posthog.com',
          defaults: '2025-05-24',
          persistence: 'localStorage+cookie',
          cookie_expiration: 365,
          autocapture: true,
          capture_pageview: true,
          capture_pageleave: true,
          disable_session_recording: true,
          session_recording: {
            // Nunca se graba lo que la persona escribe.
            maskAllInputs: true,
          },
          respect_dnt: true,
          cross_subdomain_cookie: false,
        });
      }

      instancia?.opt_in_capturing();

      if (grabacion) instancia?.startSessionRecording();
      else instancia?.stopSessionRecording();
    });

    return () => {
      vivo = false;
    };
  }, [clave, host, analitica, grabacion]);

  if (!analitica) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
