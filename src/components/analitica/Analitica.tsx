'use client';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect } from 'react';

/**
 * Analítica (B.1, Parte A §7.5 y §12 de la política).
 *
 * **Sin cookies y sin almacenamiento persistente.** Vercel Web Analytics y Speed
 * Insights no usan cookies. PostHog se configura con `persistence: 'memory'`, sin
 * grabación de sesión y sin autocaptura: no queda ningún identificador en el
 * navegador cuando se cierra la pestaña.
 *
 * Por eso el sitio no necesita banner de consentimiento y la política puede seguir
 * diciendo que la analítica no emplea cookies. **Si algún día se quiere seguir a un
 * visitante entre sesiones, hay que agregar aviso y consentimiento** (Parte A §7.5)
 * y publicar una versión nueva de la política.
 *
 * PostHog se carga en diferido y solo si hay clave configurada.
 */
type Props = {
  clave?: string;
  host?: string;
};

export function Analitica({ clave, host }: Props) {
  useEffect(() => {
    if (!clave) return;

    void import('posthog-js').then(({ default: posthog }) => {
      posthog.init(clave, {
        api_host: host ?? 'https://us.i.posthog.com',
        // Sin cookies ni localStorage: nada sobrevive al cierre de la pestaña.
        persistence: 'memory',
        disable_session_recording: true,
        autocapture: false,
        capture_pageview: true,
        capture_pageleave: true,
        // El nombre completo del sitio no lleva datos personales, pero por si acaso:
        mask_all_text: false,
        respect_dnt: true,
      });
    });
  }, [clave, host]);

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
