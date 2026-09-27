# analytics — PostHog + Vercel con consentimiento previo · A · confianza alta

- **Qué hace:** sin la categoría «analítica», **ni siquiera se descarga** `posthog-js` (import
  dinámico), y `<Analytics/>` y `<SpeedInsights/>` no se montan. Con permiso: `posthog.init` una
  sola vez (persistencia `localStorage+cookie`, cookie de 365 días, autocaptura,
  `pageview`/`pageleave`, `respect_dnt`, grabación apagada con `maskAllInputs`). La grabación se
  enciende solo con la categoría «grabación». Si se retira el permiso: `stopSessionRecording`,
  `opt_out_capturing`, `reset(true)`.
- **Archivos:** `src/components/analitica/Analitica.tsx`.
- **Deps:** `posthog-js@1.434.8`, `@vercel/analytics@2.0.1`, `@vercel/speed-insights@2.0.0`.
- **Env:** `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` (host por defecto: US).
- **Depende de:** `otro.privacidad` (`useConsentimiento`, `permite`).
- **Tests:** `tests/e2e/cookies.spec.ts` (copiado en `otro.privacidad`).
- **Montaje en este repo:** en `src/app/[locale]/layout.tsx`, con la versión de la política como
  prop.
- **Ojo:** `.env.example` y `PROGRESS.md` todavía describen la configuración anterior («sin
  cookies», `persistence: 'memory'`).
