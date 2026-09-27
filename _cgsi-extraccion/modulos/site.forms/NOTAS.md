# site.forms — Registro de prospectos desde Cal.com · B · confianza media

El sitio no tiene formulario propio: el lead se captura en el formulario de Cal.com (4 preguntas,
una de ellas la autorización de datos) y llega por webhook. Este módulo lo convierte en registro.

- **Qué hace:** `prospectoDesdeWebhook` arma el `Prospecto` (nombre, empresa por regex sobre las
  claves de las respuestas, correo, teléfono, respuestas, cita, consentimiento con versión de
  política y `expiraEn`). `guardarProspecto` hace `set(merge)` en `prospectos/{uid}` y `add` en
  `prospectos/{uid}/eventos`.
- **Archivos copiados:** `src/lib/prospectos.ts`. **No se copió** `src/lib/firebase-admin.ts`:
  es el punto de sustitución (lo reemplaza el cliente de Payload o Supabase).
- **Deps:** `firebase-admin@14.4.0`, `server-only@0.0.1`.
- **Env:** `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `POLITICA_VERSION`.
- **Tests:** ninguno.

## Traducción a Payload
- Colección `prospectos`: `calUid` (text, `unique: true`, `index: true`), `nombre`, `empresa`,
  `correo` (email, index), `telefono`, `respuestas` (json), `estado` (select), grupo `cita`
  (`inicio`, `fin` date), grupo `consentimiento` (`aceptado` checkbox, `versionPolitica`, `fecha`,
  `medio`), `ultimoContacto` (date), `expiraEn` (date, index).
- Colección `prospecto-eventos`: `prospecto` (relationship), `evento` (select), `fecha`.
  Access: `update: () => false`; `delete` solo para admin.
- Access de `prospectos`: `read`/`update` solo para usuarios admin; `create` solo desde el
  servidor (Local API con `overrideAccess`).
- `expiraEn` → cron diario (Vercel Cron o `pg_cron`) que borra los vencidos. En Postgres no hay
  TTL nativo.
- Transiciones de `estado` → hook `beforeChange` con una tabla de transiciones permitidas. Hoy no
  existe y un reagendamiento regresa el estado a `nuevo`.

## Qué corregir al portar
- Una sola fuente de versión de política (hoy: env `POLITICA_VERSION` aquí y el MDX en el aviso de
  cookies).
- Leer la casilla de autorización real del payload en vez de fijar `aceptado: true`.
- Manejar el reagendamiento con uid nuevo (`rescheduleUid`, `NO VERIFICADO`).
