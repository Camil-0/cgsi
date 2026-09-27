# i18n — next-intl · A · confianza alta

- `src/proxy.ts`: en Next 16, `middleware.ts` se llama `proxy.ts`. `createMiddleware(routing)`
  con `matcher` que excluye `api`, `_next`, `_vercel` y los archivos con punto.
- `src/i18n/routing.ts`: `locales: ['es']`, `localePrefix: 'as-needed'` (español sin prefijo) y el
  mapa `es → es-CO` para `lang`.
- `src/i18n/request.ts`: carga `messages/{locale}.json`.
- `src/i18n/navigation.ts`: `Link`, `redirect`, etc. tipados.
- `src/app/[locale]/[...resto]/page.tsx`: comodín que llama a `notFound()` para que el 404 salga
  localizado y con layout.
- `messages/es.json`: textos cortos de interfaz, en 11 espacios de nombres. Se copió como
  referencia de estructura: los componentes copiados de otros módulos usan sus claves (`cookies.*`,
  `tema.*`, `contacto.*`, `documento.nota.*`).
- **Deps:** `next-intl@4.14.6` (+ plugin en `next.config.ts`, copiado en `infra.env`).
- **Tests:** indirectos (todas las e2e navegan por `proxy.ts`).
- **Con Payload:** agregar `admin` (y las rutas de Payload) al `matcher`, o el proxy va a reescribir
  `/admin` → `/es/admin`.
