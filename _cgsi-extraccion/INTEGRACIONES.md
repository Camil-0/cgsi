# INTEGRACIONES — cgsi-web

Ninguna integración se ha probado contra el servicio real: faltan credenciales (`TODO.md`, puntos
3–6). Todo lo que sigue sale de leer el código y las pruebas con simulaciones.

## Cal.com (en el stack destino)

| | |
|---|---|
| SDK | `@calcom/embed-react@1.5.3` (cliente). Webhook sin SDK |
| Envía | Nada a Cal.com. Configura el embed: `ui` con `cssVarsPerTheme` y `layout: month_view` |
| Recibe (cliente) | `bookingSuccessful` y `bookingSuccessfulV2`: se escuchan los dos porque el nombre cambió entre versiones |
| Webhook expuesto | `POST /api/cal/webhook` (runtime Node, `force-dynamic`) |
| Eventos aceptados | Esquema: `BOOKING_CREATED`, `RESCHEDULED`, `CANCELLED`, `REQUESTED`, `REJECTED`, `PAID`, `MEETING_ENDED`. Con efecto solo los tres primeros |
| Seguridad | HMAC-SHA256 hex sobre el cuerpo crudo, `x-cal-signature-256`, `timingSafeEqual`, cuerpo ≤ 64 KB |
| Respuestas | 503 sin secreto · 413 si es muy grande · 401 con firma inválida · 400 si falla Zod · 500 si falla la persistencia (para que Cal.com reintente) · 200 |
| Reintentos | Se delegan en Cal.com (se responde 500 a propósito). No hay cola ni bitácora propia |
| Fallas conocidas | (1) `JSON.parse` sin try/catch: un cuerpo firmado que no es JSON da 500 y provoca reintentos inútiles. (2) Sin marca de tiempo firmada, no hay protección contra reenvío salvo la idempotencia. (3) `NO VERIFICADO`: en Cal.com, reagendar puede crear una reserva con **uid nuevo** (`rescheduleUid` apunta a la anterior); si es así, `BOOKING_RESCHEDULED` crea un documento nuevo **sin** nombre, correo ni consentimiento (solo `estado`, `cita` y fechas). (4) La firma y el formato del encabezado no se han verificado contra una cuenta real |

## Firestore (sale en el stack destino)

| | |
|---|---|
| SDK | `firebase-admin@14.4.0`, inicialización perezosa y memorizada (`src/lib/firebase-admin.ts`) |
| Operaciones | `set(merge)` en `prospectos/{uid}`, `add` en `eventos`, `where('correo')`, `delete`, `add` en `supresiones` |
| Errores | El webhook atrapa y responde 500. Si faltan las credenciales, `hayFirestore()` da falso y la cita **se descarta con un `console.warn`** pero se responde 200: en ese estado se pierden reservas en silencio |
| Workaround | `FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')` por los saltos de línea escapados en las variables de entorno. `ignoreUndefinedProperties: true` |
| TTL | Política TTL sobre `expiraEn`, configurada a mano en consola (`NO VERIFICADO`) |

## Evolution API v2 (aviso interno; sale)

| | |
|---|---|
| SDK | Ninguno: `fetch` a `POST {EVOLUTION_API_URL}/message/sendText/{EVOLUTION_INSTANCIA}` con encabezado `apikey` |
| Envía | Un texto al fundador: `Nueva cita · {nombre} ({empresa}) · {dd.mm hh:mm} COT · Presupuesto: {…}` |
| Recibe | Nada. Sin webhooks entrantes |
| Errores | Devuelve `{ ok:false, error }` y nunca lanza. Tope de 3 s con `Promise.race`. No hay reintento |
| Fallas conocidas | La ruta tiene que verificarse contra la versión desplegada (lo dice el propio comentario). `void avisar()` sin `after()`: en Vercel la función se puede congelar después de responder y el aviso no sale (`NO VERIFICADO`, sin despliegue) |
| Restricción de negocio | Nunca con el número comercial; nunca mensajes automáticos a prospectos |

## Meta WhatsApp Cloud API v21.0 (inactivo)

| | |
|---|---|
| SDK | Ninguno: `fetch` a `graph.facebook.com/v21.0/{WHATSAPP_PHONE_NUMBER_ID}/messages` |
| Estado | Escrito, sin tests, sin variables en `env.ts` ni en `.env.example`. Solo texto libre: dentro de la ventana de 24 h |
| Relevancia para el kit | Baja. El destino es Twilio |

## PostHog

| | |
|---|---|
| SDK | `posthog-js@1.434.8`, importado de forma dinámica solo con consentimiento |
| Configuración | `defaults: '2025-05-24'`, `persistence: localStorage+cookie`, cookie de 365 días, autocaptura, `pageview`/`pageleave`, grabación apagada por defecto con `maskAllInputs`, `respect_dnt`, host por defecto `us.i.posthog.com` |
| Al retirar el permiso | `stopSessionRecording`, `opt_out_capturing`, `reset(true)` |
| Fallas conocidas | `.env.example` dice que PostHog va «sin cookies», y ya no es cierto. Sin clave no carga (`NO VERIFICADO` con una clave real) |

## Vercel Analytics y Speed Insights

`@vercel/analytics@2.0.1` y `@vercel/speed-insights@2.0.0`. Se montan solo con la categoría
«analítica». Sin despliegue no se han verificado.

## Google Fonts

- En runtime: `next/font/google` (Source Serif 4, Source Sans 3, JetBrains Mono), autoalojadas en
  el build.
- En build: `src/lib/og.ts` descarga el TTF de Source Serif 4 para satori. Si falla devuelve
  `null` y usa la fuente por defecto: el build no se rompe.

## WhatsApp `wa.me`

Solo un enlace (`https://wa.me/{NEXT_PUBLIC_WHATSAPP_NUMERO}?text=…`). Ninguna API.
