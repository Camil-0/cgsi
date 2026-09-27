# infra.env · A · confianza alta

- `src/lib/env.ts`:
  - Dos esquemas Zod: público (`NEXT_PUBLIC_*`) y servidor.
  - Validación **perezosa y memorizada** (`memorizar`): importar el módulo no exige variables; la
    primera lectura falla con un mensaje que lista cada problema.
  - `sinVacias`: `CLAVE=` cuenta como ausente (copiar `.env.example` tal cual no rompe las
    opcionales).
  - `conUrlDelSitio`: sin `NEXT_PUBLIC_SITE_URL`, usa `https://${NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`.
  - `superRefine`: si `MENSAJERIA_PROVEEDOR=evolution`, sus cuatro credenciales pasan a ser
    obligatorias.
  - El entorno público enumera cada `process.env.NEXT_PUBLIC_*` a mano: Next solo inserta las
    referencias literales.
- `src/lib/version.ts`: revisión y fecha de build en `dd.mm.aaaa`, formateada en UTC a mano para
  que coincida entre servidor y cliente.
- `next.config.ts`: inyecta `NEXT_PUBLIC_APP_VERSION` (de `package.json`) y
  `NEXT_PUBLIC_BUILD_DATE`, y fija `turbopack.root`.
- **Tests:** `tests/unit/env.test.ts`.
- **Al portar:** el esquema del servidor lista las variables de Firebase y Evolution; hay que
  cambiarlas por las de Supabase, Payload (`PAYLOAD_SECRET`, `DATABASE_URI`), Resend y Twilio.
