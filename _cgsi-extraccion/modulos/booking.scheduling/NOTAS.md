# booking.scheduling — Cal.com

Cal.com también está en el stack destino. Lo que no toca la base de datos es clase **A**.

## Candidato 1 · Verificación y esquema del webhook · A · confianza alta
- **Qué hace:** `verificarFirma` calcula HMAC-SHA256 en hex sobre el **cuerpo crudo** y compara
  con `timingSafeEqual`, después de igualar longitudes. `esquemaWebhook` (Zod 4) valida
  `triggerEvent` y `payload` (`uid`, fechas ISO con offset, `attendees` ≥ 1, `responses`).
  `respuestasPlanas` aplana respuestas que llegan como texto o como `{ value }`.
- **Archivos:** `src/lib/cal.ts`, `src/lib/fechas.ts` (hora de Bogotá con `Intl` y zona explícita;
  `expiraEn` = +24 meses).
- **Deps:** `zod@4.6.5`. **Env:** ninguna.
- **Tests:** `tests/unit/cal.test.ts`, `tests/unit/fechas.test.ts` (en verde).
- **Notas:** no hay marca de tiempo firmada: contra un reenvío solo protege la idempotencia.
  `fechas.ts` supone Colombia (UTC−5 fijo); en el kit, la zona debería ser un parámetro.

## Candidato 2 · Embed diferido · A · confianza alta
- **Qué hace:** `Agenda` (servidor) muestra un pendiente visible si falta `NEXT_PUBLIC_CAL_LINK`.
  `AgendaCal` (cliente) espera un clic o un `IntersectionObserver` con `rootMargin: 200px`, y
  entonces carga `EmbebidoCal` por `next/dynamic` (`ssr:false`). `EmbebidoCal` le pasa al iframe
  el color de marca de cada tema leyendo los tokens con una sonda del DOM, y escucha
  `bookingSuccessful` y `bookingSuccessfulV2`.
- **Deps:** `@calcom/embed-react@1.5.3`, `next-intl@4.14.6`. **Env:** `NEXT_PUBLIC_CAL_LINK`.
- **Tests:** `tests/e2e/integraciones.spec.ts` («agenda») y `presupuesto.spec.ts`: Cal.com no
  viaja en el arranque.
- **Acoplamientos al portar:** `AgendaCal` importa `@/components/documento/Sello` (clase C, no
  copiado): hay que cambiarlo por un `onReservado` o un slot. Claves `contacto.*` y
  `base.pendienteAgenda` de `messages/es.json` (copiado en `i18n/`).

## Candidato 3 · Endpoint `POST /api/cal/webhook` · B · confianza media
- **Flujo:** secreto (503) → ≤ 64 KB (413) → firma (401) → Zod (400) → filtra eventos → persiste
  (500 si falla, para que Cal.com reintente) → aviso sin esperar → 200.
- **Env:** `CAL_WEBHOOK_SECRET`, más las de `site.forms` y `comms.whatsapp`.
- **Tests:** e2e solo para los rechazos, y **aceptan 503**: el camino feliz no está probado.
- **Traducción a Payload:**
  - `hayFirestore()` + `guardarProspecto()` → `payload.find({ collection: 'prospectos', where: { calUid: { equals: uid } } })`
    y luego `create`/`update`, desde un route handler de Next con la Local API (`getPayload`) o
    desde un `endpoints` custom de la colección. Mejor todavía: un upsert por SQL sobre el índice
    único `cal_uid`, para evitar carreras entre dos entregas simultáneas.
  - Registro de eventos → `payload.create({ collection: 'prospecto-eventos', data: { prospecto, evento, fecha } })`.
  - `avisar()` → hook `afterChange` de `prospectos` (`operation === 'create'`) o `after()` de
    `next/server`. Hoy va con `void` y puede no terminar en serverless.
- **Defectos a no heredar:** `JSON.parse` sin try/catch; 200 cuando no hay base (pierde la cita).
  Ver `LECCIONES.md`.
