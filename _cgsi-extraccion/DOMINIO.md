# DOMINIO — cgsi-web

El dominio es pequeño: prospectos que llegan por Cal.com, su bitácora de eventos, las constancias
de supresión, el consentimiento de cookies (solo en el cliente) y cuatro colecciones de contenido
(en MDX, no en base de datos).

---

## 1. Firestore (datos reales)

Reglas: `allow read, write: if false` para todo. Solo escribe el Admin SDK en el servidor. Esas
reglas están documentadas en `TODO.md` §4, pero **no hay `firestore.rules` versionado**.

### 1.1 `prospectos/{uid}`

El id del documento es `payload.uid` de la reserva de Cal.com. De ahí sale la idempotencia.
Fuente: `src/lib/prospectos.ts`.

| Campo | Tipo | Oblig. | Notas |
|---|---|---|---|
| `nombre` | string | sí | `attendees[0].name` |
| `empresa` | string | no | Primera respuesta cuya clave coincide con `/empresa\|company\|dedica/i` |
| `correo` | string | sí | `attendees[0].email`. Es la clave de búsqueda de los scripts de la Ley 1581 |
| `telefono` | string | no | `attendees[0].phoneNumber` |
| `respuestas` | map<string,string> | sí | Respuestas del formulario de Cal.com, aplanadas |
| `estado` | enum | sí | Ver 1.4 |
| `cita.inicio` / `cita.fin` | string ISO | no | `startTime` / `endTime` |
| `cita.zona` | literal `'America/Bogota'` | sí | Constante |
| `consentimiento.aceptado` | literal `true` | sí | Se asume `true`: la casilla es obligatoria en Cal.com. **El valor real de la casilla no se lee del payload** |
| `consentimiento.versionPolitica` | string | sí | `POLITICA_VERSION` (env, `'1.0'` por defecto) |
| `consentimiento.fecha` | string ISO | sí | Momento del webhook |
| `consentimiento.medio` | literal `'cal.com'` | sí | |
| `creadoEn` | string ISO | sí | Solo en `BOOKING_CREATED` |
| `ultimoContacto` | string ISO | sí | Se actualiza en cada evento |
| `expiraEn` | Timestamp | sí | `ultimoContacto` + 24 meses. Campo del **TTL de Firestore** (la política TTL se configura fuera del código: `TODO.md` §4.4) |

Los campos de fecha mezclan tipos: todos son string ISO salvo `expiraEn`, que es `Date`
(Timestamp), porque el TTL de Firestore lo exige.

### 1.2 `prospectos/{uid}/eventos/{auto}`

Solo se agregan, nunca se editan (regla de `CLAUDE.md` §11; en el código solo hay `.add`).

| Campo | Tipo | Oblig. |
|---|---|---|
| `evento` | enum `triggerEvent` de Cal.com | sí |
| `fecha` | string ISO | sí |

**No tienen `expiraEn`**: el TTL del padre **no borra subcolecciones** en Firestore. Así, los
eventos de un prospecto expirado quedan huérfanos. `NO VERIFICADO` contra un proyecto real, pero
así está documentado el TTL de Firestore: borrar un documento no borra sus subcolecciones.

### 1.3 `supresiones/{auto}`

Constancia sin datos personales (`scripts/prospectos-suprimir.ts`).

| Campo | Tipo | Oblig. |
|---|---|---|
| `huella` | string (16 hex del SHA-256 del correo normalizado) | sí |
| `documento` | string (uid del prospecto borrado) | sí |
| `fecha` | string ISO | sí |
| `motivo` | string fijo | sí |

### 1.4 Estados del prospecto

`nuevo | contactado | propuesta | ganado | perdido | cancelado`

Transiciones que **implementa el código**:

| Evento Cal.com | Efecto |
|---|---|
| `BOOKING_CREATED` | `set(merge)` de todo el prospecto con `estado = 'nuevo'` |
| `BOOKING_RESCHEDULED` | `estado = 'nuevo'`, actualiza `cita`, `ultimoContacto` y `expiraEn` |
| `BOOKING_CANCELLED` | `estado = 'cancelado'`, ídem |
| otros (`REQUESTED`, `REJECTED`, `PAID`, `MEETING_ENDED`) | 200 sin efecto |

`contactado`, `propuesta`, `ganado` y `perdido` **no los asigna ningún código**: no hay panel. Tampoco
hay reglas de transición (un reagendamiento regresa cualquier estado a `nuevo`).

### 1.5 Consultas críticas

- `prospectos.doc(uid)`: upsert idempotente (webhook).
- `prospectos.where('correo', '==', X)`: consulta y supresión. Igualdad simple, sin índice
  compuesto.
- `prospectos/{uid}/eventos.orderBy('fecha')`: exportación.
- TTL sobre `prospectos.expiraEn`.

### 1.6 Traducción a Postgres / Payload

| Firestore | Payload (colección) | Postgres |
|---|---|---|
| `prospectos/{uid}` | `prospectos` | tabla `prospectos`: `id` serial/uuid, **`cal_uid` text UNIQUE** (clave de idempotencia; upsert `ON CONFLICT (cal_uid)`), `nombre`, `empresa`, `correo` (índice), `telefono`, `estado` (enum), `cita_inicio`/`cita_fin` timestamptz, `creado_en`, `ultimo_contacto`, `expira_en` timestamptz (índice) |
| `respuestas` (map) | campo `json` | columna `jsonb`. Las preguntas cambian en Cal.com sin migración |
| `cita` (map) | grupo `cita` | columnas planas. `zona` sobra: es constante |
| `consentimiento` (map) | grupo `consentimiento` | columnas planas o tabla `consentimientos` 1:1 si se quiere historial por versión de política |
| `eventos` (subcolección) | `prospecto-eventos` con `relationship` → `prospectos` | tabla `prospecto_eventos (id, prospecto_id FK ON DELETE CASCADE, evento, fecha)`. Access `update: () => false`, `delete` solo por cascada. El `ON DELETE CASCADE` arregla los huérfanos de 1.2 |
| `supresiones` | `supresiones` (solo admin, sin `update`) | tabla `supresiones (id, huella, documento, fecha, motivo)` |
| TTL `expiraEn` | — | cron diario: `DELETE FROM prospectos WHERE expira_en < now()` (Vercel Cron o `pg_cron`) |
| estados | `select` + hook `beforeChange` que valide transiciones | enum `estado_prospecto` |

---

## 2. Consentimiento de cookies (solo cliente)

`localStorage['cgsi-consentimiento']` — `src/lib/consentimiento.ts`

| Campo | Tipo | Notas |
|---|---|---|
| `version` | string | Versión de la política vigente (del frontmatter de `politica-de-datos.mdx`) |
| `fecha` | string ISO | Vence a los 12 meses |
| `decision.necesarias` | `true` fijo | |
| `decision.preferencias` | boolean | Permite persistir el tema en `localStorage['cgsi-tema']` |
| `decision.analitica` | boolean | PostHog + Vercel Analytics + Speed Insights |
| `decision.grabacion` | boolean | Grabación de sesión de PostHog |

No se guarda en el servidor. Si el kit necesita una prueba de consentimiento consultable del lado
de CGSI, hace falta una colección `consentimientos-cookies` (anónima, con id de navegador). Eso hoy
no existe.

---

## 3. Contenido (Velite, en git)

Esquemas en `velite.config.ts`. En Payload se volverían colecciones o globales:

| Colección Velite | Campos | Reglas | Payload |
|---|---|---|---|
| `documento` (`SeccionDocumento`) | `orden` int, `tipo` portada\|seccion\|pie, `numeral`, `titulo`, `slug`, `cuerpo` mdx, `crudo` raw | — | Global `documento` con un array de bloques, o colección ordenable. Específico de este sitio |
| `expedientes` | `numero` int, `slug`, `titulo`, `etiqueta`, `stack` string[], `confidencial` bool, `autorizacion?`, `cuerpo` | **El build falla si `!confidencial && !autorizacion`** | Colección `casos` con `validate` en `autorizacion` |
| `memorandos` | `numero`, `slug`, `titulo` ≤ 90, `asunto` ≤ 120, `para`, `fecha` isodate, `resumen` ≤ 160, `etiquetas` string[], `estado` borrador\|publicado, `cuerpo` | En producción solo se publica `publicado` | Colección `memorandos` con drafts de Payload (`_status`) |
| `legal` | `titulo`, `slug`, `version`, `vigenteDesde` isodate (obligatoria), `cuerpo` | **El build falla sin `vigenteDesde`** | Global `politica` con `version` y `vigenteDesde` obligatorios. La versión alimenta el consentimiento (§2) |
