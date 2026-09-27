# INVENTARIO — cgsi-web

```
PROYECTO = cgsi-web
TIPO     = sitio
ESTADO   = en-desarrollo
Fecha    = 2026-09-27
Rama     = cgsi/extraccion
```

`PROYECTO = cgsi-web` lo infirió el agente: en la corrida se confirmaron `TIPO` y `ESTADO`, pero no
el slug. Es el único de la lista que corresponde a este repositorio (`Camil-0/cgsi`).

## Contradicciones con lo que asume el prompt

1. **No hay autenticación de ningún tipo.** No hay usuarios, sesiones ni roles. No hay candidatos
   para `core.auth`, `core.roles`, `core.admin-shell`, `core.operator` ni `core.sso`.
2. **Datos en Firestore**, solo del lado del servidor (`firebase-admin`). No usa Supabase, Postgres
   ni Payload.
3. **No hay CMS.** El contenido está en MDX versionado en git y se compila con Velite. Payload no
   tiene equivalente directo aquí.
4. **No hay Twilio ni Resend.** WhatsApp sale por Evolution API (activo) y por Meta Cloud API
   (escrito pero inactivo). No hay email transaccional: la confirmación al prospecto la manda
   Cal.com.
5. **Nunca se ha desplegado.** El hosting previsto es Vercel (`TODO.md`, punto 7), pero no hay
   despliegue.
6. **Cal.com también está en el stack destino** (lo confirmó el usuario). Por eso lo que depende
   solo de Cal.com se clasifica como **A**.

## Tabla resumen de candidatos

| # | ID | Nombre | Clase | Tests | Confianza |
|---|---|---|---|---|---|
| 1 | `booking.scheduling` | Verificación y esquema del webhook de Cal.com | A | sí | alta |
| 2 | `booking.scheduling` | Embed de Cal.com diferido (clic o proximidad) | A | sí (e2e) | alta |
| 3 | `booking.scheduling` | Endpoint `POST /api/cal/webhook` | B | parcial | media |
| 4 | `site.forms` | Registro de prospectos desde Cal.com, con consentimiento y TTL | B | no | media |
| 5 | `otro.privacidad` | Consentimiento de cookies por categoría, versionado por política | A | sí | alta |
| 6 | `otro.privacidad` | Scripts de consulta y supresión de titulares (Ley 1581) | B | no | media |
| 7 | `analytics` | PostHog + Vercel Analytics condicionados al consentimiento | A | sí (e2e) | alta |
| 8 | `comms.whatsapp` | Adaptador de mensajería (interfaz + Evolution + Cloud API + nulo) | A | sí | media |
| 9 | `comms.whatsapp` | Botón `wa.me` sin API | A | sí (e2e) | alta |
| 10 | `core.ui` | Tokens en variables CSS + `@theme` de Tailwind v4 | A | sí | alta |
| 11 | `core.ui` | Tema claro/oscuro sin parpadeo, persistido solo con consentimiento | A | sí (e2e) | alta |
| 12 | `core.ui` | Componentes accesibles: Nota, Diff, Pestañas, BotónImprimir, MedidorCarga | A | sí (e2e) | media |
| 13 | `site.motion` | GSAP diferido con movimiento reducido | A | sí (e2e) | media |
| 14 | `site.seo` | Constructores de JSON-LD, canónica/hreflang, OG y robots | A | sí | alta |
| 15 | `site.blog` | Memorandos: listado, detalle, sitemap y RSS | B | sí (e2e) | media |
| 16 | `site.content` | Colecciones Velite con reglas de build y render de MDX | B | parcial | baja |
| 17 | `i18n` | next-intl con `proxy.ts`, español sin prefijo, 404 localizado | A | indirectos | alta |
| 18 | `infra.env` | Entorno validado con Zod, perezoso y memorizado | A | sí | alta |
| 19 | `infra.observability` | Healthcheck `/api/salud` sin filtrar valores | B | sí (e2e) | alta |
| 20 | `infra.ci` | Pipeline de GitHub Actions + Dependabot | A | n/a | media |
| 21 | `infra.testing` | Guardas de tokens y contraste WCAG, presupuesto de JS, axe | A | n/a | alta |
| 22 | `dev.agent-docs` | CLAUDE.md + PROGRESS.md + TODO.md | A | n/a | alta |

**Clase C (se documenta, no se copia):** el sistema visual «Por escrito». Incluye `Cajetin`,
`Seccion`, `IndiceSecciones`, `Firma`, `Sello`, `FiguraRecorrido`, `Franja`/`Acciones`, `Cta`,
`Destinatario`, `AlMargen`, `Faq`, `Expedientes`, `documento.css`, `print.css`,
`src/lib/documento.ts`, las páginas `[locale]/page.tsx`, `politica-de-datos/page.tsx` y
`not-found.tsx`, todo `content/es/**`, `tests/unit/copy.test.ts` y las e2e `base`, `contenido` y
`documento`. Son la identidad de este sitio en particular; en la sección de clase C se describe el
patrón reutilizable de cada uno.

**Excluido a propósito:** `src/lib/firebase-admin.ts`. No se traduce: en el stack destino lo
reemplaza el cliente de Payload o Supabase. Es el punto de sustitución de los candidatos 4 y 6.

---

## Paso 1 — Reconocimiento

### Versiones exactas instaladas (de `pnpm-lock.yaml`)

| Paquete | Versión |
|---|---|
| next | 16.3.5 |
| react / react-dom | 19.3.0 / 19.3.0 |
| typescript | 5.9.3 |
| tailwindcss / @tailwindcss/postcss | 4.3.3 / 4.3.3 |
| firebase-admin | 14.4.0 |
| firebase (cliente) | **no instalado** |
| @supabase/* | **no instalado** |
| payload | **no instalado** |
| twilio | **no instalado** |
| resend / nodemailer | **no instalado** |
| googleapis | **no instalado** |
| zod | 4.6.5 |
| Librería de UI | **ninguna** (prohibido en `CLAUDE.md`) |
| @calcom/embed-react | 1.5.3 |
| gsap / @gsap/react | 3.15.0 / 2.1.2 |
| next-intl | 4.14.6 |
| posthog-js | 1.434.8 |
| @vercel/analytics / @vercel/speed-insights | 2.0.1 / 2.0.0 |
| server-only | 0.0.1 |
| velite | 0.4.0 |
| vitest | 5.0.1 |
| @playwright/test | 1.63.0 |
| @axe-core/playwright | 4.13.0 |
| @lhci/cli | 0.15.1 (instalado, no está conectado a CI todavía) |
| eslint / eslint-config-next | 9.39.5 / 16.3.5 |
| @types/node | 24.13.6 |

Overrides de pnpm: `sharp ^0.35.4`, `uuid ^11.1.1` (por vulnerabilidades, según `PROGRESS.md`).

### Arquitectura

| Aspecto | Valor |
|---|---|
| Framework / router | Next.js 16 App Router, Turbopack, React 19. `src/proxy.ts` (antes `middleware.ts`) |
| Backend de datos | Firestore, solo por Admin SDK en el servidor. Reglas `allow read, write: if false` (`TODO.md` §4) |
| Auth | Ninguna |
| Storage | Ninguno |
| Contenido | MDX en `content/es/**`, compilado con Velite a `.velite` (alias `#contenido`) |
| Hosting | Vercel previsto; **nunca desplegado** |
| Gestor de paquetes | pnpm 10.28.0 (`packageManager`), Node ≥ 24 (`engines`, `.nvmrc`) |

### Árbol a 3 niveles (sin node_modules ni artefactos)

```
.env.example · .gitignore · .nvmrc · CLAUDE.md · PROGRESS.md · TODO.md
.github/ dependabot.yml · workflows/ci.yml
content/es/ documento/ · expedientes/ · legal/        (no hay memorandos/ todavía)
design/ README.md · project/ (prototipo HTML de Claude Design, solo referencia)
docs/ brief.md · politica-de-datos.md
messages/ es.json
scripts/ dev.mjs · prospectos-exportar.ts · prospectos-suprimir.ts
src/
  app/ [locale]/ · api/ (cal/webhook, salud) · robots.ts · rss.xml/ · sitemap.ts
  components/ analitica · consentimiento · contacto · documento · expedientes · movimiento · pie · seo · tema
  i18n/ navigation.ts · request.ts · routing.ts
  lib/ cal · consentimiento · documento · env · extraer · fechas · firebase-admin · fuentes · gsap · mensajeria/ · og · politica · prospectos · seo · version
  proxy.ts
  styles/ documento.css · globals.css · print.css · tokens.css
tests/ a11y/ · e2e/ · unit/ · utiles/
eslint.config.mjs · next.config.ts · playwright.config.ts · postcss.config.mjs · tsconfig.json · velite.config.ts · vitest.config.ts
```

### Documentación para agentes

- `CLAUDE.md`: contexto persistente, fuentes de verdad, reglas duras, stack cerrado, fases.
- `PROGRESS.md`: bitácora por fase, decisiones del fundador y desviaciones del brief.
- `TODO.md`: lo que bloquea por credenciales o terceros, con pasos concretos.
- `docs/brief.md`: especificación (Parte A: copy y diseño; Parte B: técnica).
- `design/README.md`: instrucciones del paquete de Claude Design.
- **No existen** `.claude/`, `MASTER_PROMPT.md` ni `SETUP_MANUAL.md`.

### Diagnóstico (solo lectura)

Corrido en este contenedor con **Node 22.22.2**. El repo pide ≥ 24 y pnpm solo dio un aviso:
- `pnpm typecheck` (velite build + `tsc --noEmit`): **pasa**.
- `pnpm lint`: **pasa**, sin avisos.
- `pnpm test:unit`: **9 archivos, 121 pruebas, todas en verde**.
- **No se corrieron** `pnpm build`, e2e ni a11y: necesitan levantar el servidor y bajar fuentes
  de Google.

---

## Paso 2 — Inventario funcional

### Funcionalidades (vistas por el visitante)

1. Leer la propuesta comercial como documento I–VII, con índice fijo y cajetín que dice la
   «página» actual.
2. Abrir notas al margen (en móvil, con un toque) y leer los diffs de proceso («−»/«+»).
3. Ver expedientes (casos) en pestañas con transición.
4. Cambiar entre tema Papel (claro) y Plano (oscuro).
5. Imprimir o descargar como PDF (`window.print()`, con `print.css`).
6. Agendar un diagnóstico de 30 min con Cal.com embebido. Se carga al hacer clic o al acercarse a
   la sección VII y muestra el sello «Recibido» al confirmar.
7. Escribir por WhatsApp (enlace `wa.me` con texto prellenado).
8. Decidir sobre cookies en cuatro categorías y volver a abrir la configuración desde el pie.
9. Leer la política de tratamiento de datos.
10. Leer memorandos (blog) con RSS. La colección está vacía hoy.
11. Ver en el pie cuánto pesó la página y cuánto tardó en cargar.

### Funcionalidades internas (sin interfaz)

- Guardar cada reserva de Cal.com como prospecto en Firestore, con registro de consentimiento y
  TTL de 24 meses.
- Aviso interno por WhatsApp (Evolution) al fundador por cada cita nueva.
- Scripts de consola para exportar o suprimir los datos de un titular por correo (Ley 1581).
- Healthcheck `/api/salud`.

### Roles

| Rol | Qué puede hacer |
|---|---|
| Visitante anónimo | Todo lo anterior. No hay cuentas. |
| Fundador (operador) | Recibe avisos por WhatsApp y corre los scripts de consola con credenciales de Firebase. **No hay panel**: los estados `contactado`, `propuesta`, `ganado` y `perdido` existen en el tipo, pero ningún código los asigna. |
| Cal.com (sistema) | Llama al webhook firmado. |

### Flujos principales

**F1 — Reserva de diagnóstico**
1. El visitante baja hasta la sección VII, o hace clic en «cargar agenda».
2. `AgendaCal` monta `EmbebidoCal` por `next/dynamic`, que descarga `@calcom/embed-react`.
3. El visitante llena las 4 preguntas de Cal.com. La autorización de datos es obligatoria.
4. Cal.com confirma. El embed emite `bookingSuccessful`/`bookingSuccessfulV2` y aparece el
   `Sello` con la hora de Bogotá.
5. Cal.com hace `POST /api/cal/webhook` con `x-cal-signature-256`.
6. El endpoint verifica tamaño (≤ 64 KB), firma HMAC y esquema Zod, y filtra los eventos
   relevantes.
7. `guardarProspecto` hace upsert en `prospectos/{uid}` y agrega un registro en
   `prospectos/{uid}/eventos`.
8. Si es `BOOKING_CREATED`, lanza `avisar()` sin esperarlo (tope de 3 s) y responde 200.

**F2 — Consentimiento de cookies**
1. Primera visita: después de hidratar aparece el aviso (aceptar todo / configurar).
2. «Configurar» abre un `<dialog>` nativo con 4 categorías; «necesarias» no se puede apagar.
3. La decisión se guarda en `localStorage` con `version` de la política y `fecha`.
4. `Analitica` monta PostHog y Vercel solo con «analítica». La grabación de sesión, solo con
   «grabación».
5. `InterruptorPapelPlano` persiste el tema solo con «preferencias».
6. Si la política sube de versión o pasan 12 meses, `interpretar` devuelve `null` y se vuelve a
   preguntar.
7. Si se retira el permiso: `stopSessionRecording`, `opt_out_capturing` y `reset(true)` en
   PostHog.

**F3 — Derechos del titular (Ley 1581)**
1. El fundador recibe la solicitud (fuera del sistema).
2. Consulta: `scripts/prospectos-exportar.ts --correo X` imprime el JSON con los eventos.
3. Supresión: `scripts/prospectos-suprimir.ts --correo X` hace una corrida en seco.
4. Con `--confirmar` borra los eventos y el prospecto, y deja una constancia en `supresiones` con
   la huella SHA-256 (16 hex) del correo.

---

## Paso 3 — Candidatos a módulo

Detalle completo de cada uno en `modulos/<id>/NOTAS.md`. Resumen:

### 1. `booking.scheduling` — Verificación y esquema del webhook de Cal.com · A
- **Qué hace:** verifica HMAC-SHA256 sobre el cuerpo crudo con `timingSafeEqual` y valida el
  payload con Zod. También aplana las respuestas del formulario (texto suelto o `{ value }`).
- **Archivos:** `src/lib/cal.ts`, `src/lib/fechas.ts`, `tests/unit/cal.test.ts`,
  `tests/unit/fechas.test.ts`.
- **Deps:** `zod@4.6.5`, `node:crypto`.
- **Env:** ninguna (el secreto entra por parámetro).
- **Portabilidad:** A. Es puro, sin acoplamiento a datos.
- **Calidad:** tiene tests. Anota en un comentario que Cal.com no firma una marca de tiempo, así
  que no hay protección contra reenvío salvo la idempotencia.
- **Confianza:** alta.

### 2. `booking.scheduling` — Embed de Cal.com diferido · A
- **Qué hace:** no descarga nada de Cal.com hasta el clic o hasta que la sección está a menos de
  200 px. Pasa el color de marca al iframe leyéndolo de los tokens con una «sonda» del DOM.
- **Archivos:** `src/components/contacto/{Agenda,AgendaCal,EmbebidoCal}.tsx`.
- **Deps:** `@calcom/embed-react@1.5.3`, `next-intl@4.14.6`.
- **Env:** `NEXT_PUBLIC_CAL_LINK`.
- **Portabilidad:** A. Depende de `Sello` (clase C) y de claves de `messages/es.json`: hay que
  cambiar el sello por un callback.
- **Calidad:** e2e comprueba que Cal.com no entra en el arranque. Workaround: escucha los dos
  nombres de evento de reserva porque cambiaron entre versiones del embed.
- **Confianza:** alta.

### 3. `booking.scheduling` — Endpoint `POST /api/cal/webhook` · B
- **Archivos:** `src/app/api/cal/webhook/route.ts`, `tests/e2e/integraciones.spec.ts`.
- **Deps:** los de 1, 4 y 8.
- **Env:** `CAL_WEBHOOK_SECRET`, las de Firebase y las de mensajería.
- **Portabilidad:** B. `hayFirestore()` y `guardarProspecto()` pasan a ser
  `payload.create/update` sobre la colección `prospectos`, desde un **endpoint custom de Payload**
  o desde un route handler de Next que use la Local API. `avisar()` se mueve a un hook
  `afterChange` de la colección, o a `after()` de Next.
- **Calidad:** las e2e aceptan `503` como respuesta válida, así que **en CI nunca se prueba el
  camino feliz** ni la persistencia. `JSON.parse` no está protegido: un cuerpo firmado pero que no
  es JSON revienta en 500. `void avisar()` después de responder: en serverless puede no terminar.
- **Confianza:** media.

### 4. `site.forms` — Registro de prospectos · B
- **Qué hace:** convierte el webhook en un `Prospecto` con consentimiento (versión de la política,
  fecha, medio) y `expiraEn` = último contacto + 24 meses. El id del documento es el `uid` de la
  reserva, y eso lo hace idempotente.
- **Archivos:** `src/lib/prospectos.ts` (importa `firebase-admin.ts`, que no se copió).
- **Deps:** `firebase-admin@14.4.0`, `server-only@0.0.1`.
- **Env:** `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`,
  `POLITICA_VERSION`.
- **Portabilidad:** B. Pasa a ser la colección `prospectos` de Payload, con `uid` único como
  índice, y la colección `prospecto-eventos` (relación, solo inserción: access
  `update: () => false`). El TTL de Firestore no existe en Postgres: se reemplaza por un cron
  (Vercel Cron o `pg_cron` de Supabase) que borre donde `expira_en < now()`.
- **Calidad:** **sin tests** para `prospectoDesdeWebhook` ni `guardarProspecto`. La versión de la
  política sale de `POLITICA_VERSION` (env, `'1.0'` por defecto), mientras el aviso de cookies usa
  `versionPolitica()`, que la lee del MDX. Son dos fuentes que pueden divergir. Un
  `BOOKING_RESCHEDULED` devuelve el estado a `'nuevo'` aunque el prospecto ya estuviera más
  adelante.
- **Confianza:** media.

### 5. `otro.privacidad` — Consentimiento de cookies por categoría · A
- **Por qué `otro`:** `analytics` cubre la medición, no la base legal. Ninguna entrada de la
  taxonomía cubre consentimiento ni derechos del titular.
- **Archivos:** `src/lib/consentimiento.ts`, `src/lib/politica.ts`,
  `src/components/consentimiento/*`, `src/components/contacto/AvisoPrivacidad.tsx`,
  `tests/unit/consentimiento.test.ts`, `tests/e2e/cookies.spec.ts`.
- **Deps:** `react@19.3.0` (`useSyncExternalStore`), `next-intl@4.14.6`.
- **Env:** ninguna.
- **Portabilidad:** A. La lógica es pura con un almacén observable. `politica.ts` lee Velite: con
  Payload, la versión sale de un global `politica`, y eso es un cambio de una línea.
- **Calidad:** buena cobertura (unit + e2e que verifican que las categorías de verdad bloquean).
  El consentimiento **no se registra en el servidor**: solo vive en el `localStorage` del
  visitante.
- **Confianza:** alta.

### 6. `otro.privacidad` — Consulta y supresión del titular · B
- **Archivos:** `scripts/prospectos-exportar.ts`, `scripts/prospectos-suprimir.ts`.
- **Deps:** `firebase-admin@14.4.0`, `node:crypto`. Los encabezados mencionan `tsx`, que **no
  está en `package.json`**.
- **Env:** las de Firebase.
- **Portabilidad:** B. Pasan a ser consultas de Payload (`find` por `correo`, `delete` en
  cascada) y la colección `supresiones`. Mejor como endpoint de administración con access control
  que como script.
- **Calidad:** sin tests. No hay borrado por lotes (un `delete` por documento). La búsqueda es por
  correo exacto, sin normalizar, aunque la huella sí normaliza.
- **Confianza:** media.

### 7. `analytics` — PostHog y Vercel condicionados al consentimiento · A
- **Archivos:** `src/components/analitica/Analitica.tsx`.
- **Deps:** `posthog-js@1.434.8`, `@vercel/analytics@2.0.1`, `@vercel/speed-insights@2.0.0`.
- **Env:** `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`.
- **Portabilidad:** A. Necesita el candidato 5.
- **Calidad:** e2e en `cookies.spec.ts` (categoría «las categorías hacen lo que dicen").
  `.env.example` todavía dice «sin cookies ni almacenamiento persistente», y eso ya no es cierto.
- **Confianza:** alta.

### 8. `comms.whatsapp` — Adaptador de mensajería · A
- **Qué hace:** interfaz `Mensajeria.enviarTexto` con tres proveedores (Evolution v2, Meta Cloud
  API v21.0 y un nulo que solo registra). `avisar()` corre una carrera contra un tope de 3 s.
- **Archivos:** `src/lib/mensajeria/{index,evolution,cloud-api,ninguno}.ts`,
  `tests/unit/mensajeria.test.ts`.
- **Deps:** ninguna (usa `fetch`), `server-only@0.0.1`.
- **Env:** `MENSAJERIA_PROVEEDOR`, `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`,
  `EVOLUTION_INSTANCIA`, `NOTIFICACIONES_DESTINO`. `WHATSAPP_PHONE_NUMBER_ID` y `WHATSAPP_TOKEN`
  se leen directo de `process.env`, **fuera** de `env.ts`.
- **Portabilidad:** A para la interfaz y el patrón. **Ojo:** el destino usa Twilio, y aquí no hay
  proveedor Twilio. Hay que escribir `twilio.ts` detrás de la misma interfaz. Evolution y Cloud API
  solo sirven como referencia.
- **Calidad:** tests del nulo, de Evolution (con `fetch` simulado) y del texto. Cloud API no tiene
  tests. El `setTimeout` del tope no se limpia.
- **Confianza:** media.

### 9. `comms.whatsapp` — Botón `wa.me` · A
- **Archivos:** `src/components/contacto/BotonWhatsApp.tsx`. **Env:** `NEXT_PUBLIC_WHATSAPP_NUMERO`.
- Si falta el número, muestra un pendiente visible en vez de un enlace roto. **Confianza:** alta.

### 10–12. `core.ui` · A
- **Archivos:** `src/styles/{tokens,globals}.css`, `src/lib/fuentes.ts`,
  `src/components/tema/*`, `src/components/documento/{Nota,Diff,BotonImprimir}.tsx`,
  `src/components/expedientes/PestanasExpediente.tsx`, `src/components/pie/MedidorCarga.tsx`,
  `tests/e2e/tema.spec.ts`.
- **Deps:** `tailwindcss@4.3.3`, `next-intl@4.14.6`, `next/font`.
- **Portabilidad:** A. Los **valores** de los tokens son la marca de CGSI; el mecanismo (tokens →
  `@theme inline` → clases, dos temas y caída a `prefers-color-scheme` sin JS) es lo que se
  reutiliza. `globals.css` importa `documento.css` y `print.css` (clase C, no copiados): quitar
  esos `@import` al reutilizar.
- **Calidad:** `AplicarTema` existe para arreglar que React borre el `data-tema` puesto antes de
  hidratar. Es un workaround documentado.
- **Confianza:** alta en tokens y tema; media en los componentes, porque sus clases CSS viven en
  `documento.css`, que no se copia.

### 13. `site.motion` — GSAP diferido · A
- **Archivos:** `src/lib/gsap.ts`, `src/components/movimiento/*`,
  `src/components/documento/DobleFilete.tsx`, `tests/e2e/movimiento.spec.ts`.
- **Deps:** `gsap@3.15.0`, `@gsap/react@2.1.2` (DrawSVGPlugin es gratis desde GSAP 3.13).
- **Portabilidad:** A. `Animaciones.tsx` usa selectores de este sitio (`[data-filete]`,
  `.nota-cuerpo`, `[data-figura-recorrido]`). El patrón se reutiliza; el inventario concreto no.
- **Confianza:** media.

### 14. `site.seo` · A
- **Archivos:** `src/lib/{seo,extraer,og}.ts`, `src/components/seo/{JsonLd,LienzoOg}.tsx`,
  `src/app/[locale]/opengraph-image.tsx`, `src/app/robots.ts`, `tests/unit/seo.test.ts`,
  `tests/e2e/seo.spec.ts`.
- **Env:** `NEXT_PUBLIC_SITE_URL`, `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`.
- **Portabilidad:** A. `ORGANIZACION` tiene los datos de CGSI escritos en el código: en el kit
  debería ser configuración (global de Payload). `extraer.ts` parsea MDX crudo: con Payload/Lexical
  se reescribe.
- **Calidad:** el comentario de `LienzoOg.tsx` cita `tests/unit/og.test.ts`, que no existe (la
  prueba real está en `seo.test.ts`). Falta correr el validador oficial de Google (necesita una URL
  pública).
- **Confianza:** alta.

### 15. `site.blog` — Memorandos · B
- **Archivos:** `src/app/sitemap.ts`, `src/app/rss.xml/route.ts`,
  `src/app/[locale]/memorandos/{page,[slug]/page}.tsx`.
- **Portabilidad:** B. `memorandos` de `#contenido` pasa a `payload.find({ collection:
  'memorandos', where: { estado: { equals: 'publicado' } } })`. El esquema de `velite.config.ts`
  (título ≤ 90, asunto ≤ 120, resumen ≤ 160, `estado` borrador/publicado) pasa tal cual a campos
  de Payload con `maxLength` y `_status`/drafts.
- **Calidad:** la colección **no tiene ningún archivo**, así que solo se probó el estado vacío.
  `authors: ['Camilo Charris C.']` está escrito a mano en el componente, contra la regla del propio
  `CLAUDE.md`.
- **Confianza:** media.

### 16. `site.content` — Velite + MDX · B
- **Archivos:** `velite.config.ts`, `src/components/documento/Mdx.tsx`.
- **Portabilidad:** B, y de las más bajas. Los esquemas y las reglas de build (expediente no
  confidencial sin `autorizacion` → falla; política sin `vigenteDesde` → falla) pasan a
  `validate` de campo o `beforeValidate` en Payload. El render MDX con `new Function` **no se
  traduce**: Payload usa Lexical. El mapa de componentes MDX → React sí sirve como referencia para
  los bloques de Lexical.
- **Confianza:** baja.

### 17. `i18n` · A
- **Archivos:** `src/proxy.ts`, `src/i18n/*`, `src/app/[locale]/[...resto]/page.tsx`,
  `messages/es.json`.
- **Deps:** `next-intl@4.14.6`.
- **Portabilidad:** A. **Ojo con Payload:** su admin vive en `/admin` y su API en `/api`. El
  `matcher` ya excluye `api`, pero habría que excluir también `admin`.
- **Confianza:** alta.

### 18. `infra.env` · A
- **Archivos:** `src/lib/env.ts`, `src/lib/version.ts`, `next.config.ts`,
  `tests/unit/env.test.ts`.
- **Qué aporta:** esquemas público/servidor separados, validación perezosa y memorizada (importar
  no rompe las pruebas), vacío = ausente, URL de Vercel como respaldo, `superRefine` condicional
  por proveedor, y `APP_VERSION`/`BUILD_DATE` inyectadas desde `next.config.ts`.
- **Confianza:** alta.

### 19. `infra.observability` — `/api/salud` · B
- Solo cambia `hayFirestore()` por un chequeo de Payload o Postgres. **Confianza:** alta.

### 20. `infra.ci` · A
- **Archivos:** `.github/workflows/ci.yml`, `.github/dependabot.yml`, `.nvmrc`.
- Lighthouse CI todavía no está conectado. `TODO.md` §1 dice que el repo no tiene remoto, pero sí
  lo tiene (`origin`): `NO VERIFICADO` que el workflow haya corrido en GitHub. **Confianza:** media.

### 21. `infra.testing` · A
- **Archivos:** `vitest.config.ts`, `playwright.config.ts`, `eslint.config.mjs`, `tests/utiles/*`,
  `tests/unit/{tokens,contraste}.test.ts`, `tests/e2e/presupuesto.spec.ts`,
  `tests/a11y/portada.spec.ts`.
- **Qué aporta:** una prueba que prohíbe los hex fuera de los tokens, contraste WCAG medido sobre
  los tokens reales en los dos temas, presupuesto de JS gzip con lista de lo que debe ir diferido,
  y axe en los dos temas. **Confianza:** alta.

### 22. `dev.agent-docs` · A
- **Archivos:** `CLAUDE.md`, `PROGRESS.md`, `TODO.md`.
- **Portabilidad:** A **como plantilla**; el contenido es de este proyecto. **Confianza:** alta.

---

## Clase C — referencia de dominio (no copiado)

| Pieza | Patrón reutilizable que contiene |
|---|---|
| `Cajetin.tsx` | Un solo `IntersectionObserver` sobre `[data-seccion]` que marca la sección actual y pone `aria-current="location"` en el índice (scrollspy accesible). Mide su propio alto con `ResizeObserver` y lo expone como `--alto-cajetin` para `scroll-padding`. |
| `Sello.tsx` | Confirmación `role="status"` con GSAP importado bajo demanda. |
| `FiguraRecorrido.tsx` | Figura `sticky` + ScrollTrigger con `scrub` sin pin. |
| `Seccion`, `IndiceSecciones`, `Firma`, `Franja`, `Cta`, `Destinatario`, `AlMargen`, `Faq`, `Expedientes` | Piezas del lenguaje visual «documento». |
| `documento.css` (928 líneas), `print.css` | Retícula de 12 columnas; impresión carta con notas numeradas en el flujo. |
| `copy.test.ts` | Prueba que el MDX es idéntico al brief, línea por línea. **El patrón sí es reutilizable** para sitios con copy aprobado. |
| `content/es/**` | Copy aprobado del sitio. |

## Secretos y datos redactados

- **No se encontró ningún secreto** en los archivos copiados (búsqueda de claves privadas, `phc_`,
  `sk_live`, `AIza…`, apikeys literales). `.env.example` no se copió; de todos modos no tiene
  valores.
- **No se redactó nada.** Los fixtures de prueba usan datos ficticios (`Ana Ruiz`,
  `ana@ejemplo.com`, `alguien@ejemplo.com`, `573001112233`).
- **Datos reales de la propia CGSI que quedaron en las copias**, sin redactar porque son públicos
  y no son de clientes finales: NIT `901.983.287`, `cgsoftwareintegrations@gmail.com`, número
  comercial `+57 323 813 4588` y nombre del fundador. Aparecen en `site.seo` (`seo.ts`,
  `seo.test.ts`), `site.blog`, `i18n/messages/es.json`, `comms.whatsapp`, `infra.ci`,
  `infra.testing`, `infra.env` (tests) y `dev.agent-docs`. En `TODO.md` también se nombra a un
  cliente (Essenza) y una referencia de autorización.
