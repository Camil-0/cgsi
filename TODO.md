# TODO — lo que bloquea y quién lo desbloquea

Lista de lo que el agente **no puede hacer solo**. Cada punto dice qué bloquea, los pasos
concretos y qué variable de entorno sale de ahí. Lo que sí depende del agente vive en
`PROGRESS.md`, no aquí.

Estado al 22.09.2026: F0–F3 cerradas. F4 construida contra pruebas y simulaciones; su criterio de
salida («reserva de prueba de principio a fin; aviso interno recibido») depende de los puntos 3, 4 y 6.

---

## 1. Repositorio remoto — bloquea que CI corra de verdad

El pipeline de `.github/workflows/ci.yml` está escrito y probado localmente, pero **nunca ha
corrido en GitHub**: este repositorio no tiene remoto.

1. Crear un repositorio **privado** en GitHub, sin README ni .gitignore (ya existen).
2. En la raíz del proyecto:
   ```bash
   git remote add origin git@github.com:<usuario>/cgsi.git
   git push -u origin master
   ```
3. En **Settings → Branches**, proteger la rama por defecto: exigir que CI pase antes de fusionar.
4. Verificar que la pestaña **Actions** muestre el workflow en verde.

---

## 2. Dominio y correo propios — bloquea el lanzamiento

Hoy el sitio publica `cgsoftwareintegrations@gmail.com`, que es el correo que la política ya
declara. La Parte A §9 dice que el sitio no sale con `@gmail`.

1. Comprar el dominio.
2. Crear el correo del dominio (Google Workspace u otro).
3. Configurar **SPF, DKIM y DMARC** antes de publicarlo en el sitio (B.10).
4. Pasarle al agente el dominio y el correo. Hay que actualizar, en este orden:
   - `NEXT_PUBLIC_SITE_URL`
   - `content/es/legal/politica-de-datos.mdx` y su fuente `docs/politica-de-datos.md`
   - `content/es/documento/99-pie.mdx`
   - `messages/es.json` → `sitio.correo`

**Sale de aquí:** `NEXT_PUBLIC_SITE_URL`

---

## 3. Cal.com — bloquea el criterio de salida de F4

1. Crear la cuenta y el **tipo de evento**:
   - Nombre: `Diagnóstico · 30 min`
   - Duración: 30 minutos · Ubicación: videollamada
   - Aviso mínimo: **12 horas** · Margen entre citas: **15 minutos**
2. Agregar las **cuatro preguntas** del formulario, con este texto exacto (Parte A §6):
   1. `¿A qué se dedica tu empresa?`
   2. `¿Cómo manejan hoy el proceso que quieres mejorar?`
   3. `¿Tienen presupuesto aprobado para este proyecto?` — opciones: `Sí` / `En evaluación` /
      `Todavía no`
   4. Casilla de autorización de datos: **obligatoria y sin marcar por defecto**, con el texto
      «Autorizo a CG Software Integration S.A.S. a tratar mis datos para responder esta
      solicitud, según su Política de tratamiento de datos.»
3. Copiar el enlace del evento (la parte `usuario/evento`, p. ej. `cgsi/diagnostico`).
4. En **Settings → Webhooks**, crear uno:
   - URL: `https://<dominio>/api/cal/webhook`
   - Eventos: `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`
   - Copiar el **secret** que genera Cal.com.

**Sale de aquí:** `NEXT_PUBLIC_CAL_LINK`, `CAL_WEBHOOK_SECRET`

---

## 4. Firebase — bloquea guardar prospectos

1. Crear el proyecto en Firebase y habilitar **Firestore** en modo producción.
   Elegir región (`southamerica-east1` o `us-central1`) y anotarla: va en la política.
2. Reglas de seguridad: dejarlas en
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} { allow read, write: if false; }
     }
   }
   ```
   Solo el Admin SDK escribe (B.10).
3. Crear una **cuenta de servicio** con el rol mínimo **Cloud Datastore User**, descargar el JSON.
4. Crear la **política TTL**: colección `prospectos`, campo `expiraEn`. Esto es lo que cumple la
   conservación de 24 meses sin trabajo manual (Parte A §7.3.1).
5. Activar **exportaciones programadas** a un bucket, como respaldo.

**Sale de aquí:** `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
(la clave privada va entre comillas y con los `\n` literales).

---

## 5. PostHog — analítica

1. Crear el proyecto en PostHog. Elegir región **EU** o **US** y anotarla: va en la política.
2. Copiar la **Project API Key** (`phc_...`) y el host (`https://eu.i.posthog.com` o
   `https://us.i.posthog.com`).
3. Opcional: instalar la integración de PostHog en Vercel, que inyecta las variables sola.

**Sale de aquí:** `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`

> PostHog corre con toda su funcionalidad, **pero solo después de que la persona la autorice** en
> el aviso de cookies. La grabación de sesión es una categoría aparte, apagada salvo que la
> enciendan. La política ya describe las cuatro categorías, qué guarda cada cookie y cuánto dura.
> **Tu abogado debe revisar la sección 12 de la política**, que se reescribió completa para esto.

---

## 6. Evolution API y número secundario — bloquea el aviso interno

**Nunca se conecta el número comercial (+57 323 813 4588) por esta vía** (B.10). Va un número
secundario, solo para avisarte a ti de cada cita.

1. Conseguir una **línea secundaria** (SIM o eSIM) con WhatsApp.
2. Levantar un VPS pequeño (2 GB de RAM alcanzan) con Docker, y desplegar Evolution API v2 con
   Postgres y Redis, según su documentación.
3. Servirlo **solo por HTTPS**, con una `AUTHENTICATION_API_KEY` larga y aleatoria.
4. Crear la instancia y vincular el número secundario escaneando el QR.
5. **Sin webhooks entrantes** en la v1.
6. Poner un monitor de disponibilidad que avise por correo si la instancia se desconecta.

**Sale de aquí:** `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCIA`,
`NOTIFICACIONES_DESTINO` (tu teléfono personal, solo dígitos), y `MENSAJERIA_PROVEEDOR=evolution`.

---

## 7. Vercel — bloquea el despliegue

1. Importar el repositorio en Vercel. El proyecto está en la **raíz**, no hay que tocar el
   *root directory*.
2. Cargar todas las variables de `.env.example` en **Production** y en **Preview**.
3. Conectar el dominio del punto 2.
4. Activar **Web Analytics** y **Speed Insights** (los dos sin cookies).
5. **No activar despliegue automático a producción** hasta que F6 esté cerrada y tú lo apruebes
   por escrito (B.0).

---

## 8. Buscadores

1. Agregar el sitio a **Google Search Console** y a **Bing Webmaster Tools**.
2. Elegir verificación por **metaetiqueta** y copiar el contenido.

**Sale de aquí:** `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`

---

## 9. Legal y contenido — bloquea el lanzamiento

- [ ] Abogado revisa y aprueba: la **política de tratamiento**, la **sección VI** del documento y
      el **aviso de privacidad**. Al aprobarse se quita el marcador visible de la política.
- [ ] Autorización **CSI-2026-ESSENZA-002** firmada por Essenza.
- [ ] **Testimonio del Anexo 2** aprobado y firmado; hoy es un `{PENDIENTE}` visible.
- [ ] Los **mensajes de WhatsApp por estado** de la Fig. 1 del expediente Essenza: el brief los
      pide al margen pero no los transcribe.
- [ ] Stack real de Essenza confirmado para la etiqueta del expediente.
- [ ] **Logo de CGSI en SVG** y **foto del fundador**.
- [ ] Mensajes de bienvenida y de ausencia configurados en la app WhatsApp Business.
- [ ] Anexo de seguridad agregado al contrato tipo, con los cinco controles.
- [ ] Socios del proyecto de salud ocupacional informados de la mención anonimizada.

---

## Infraestructura que conviene agregar, y no está en el brief

Propuestas del agente, para decidir:

| Qué | Para qué | Costo |
|---|---|---|
| **Monitor de disponibilidad** (Better Stack, UptimeRobot) sobre `/api/salud` y sobre Evolution | El brief pide monitorear Evolution (B.10), pero nadie vigila el sitio. Un ping cada 5 minutos avisa antes que el cliente. | Gratis |
| **Alertas de error en Vercel** hacia correo o WhatsApp | Hoy un error 500 en el webhook de Cal.com se pierde en silencio y el prospecto no queda guardado. | Incluido |
| **Reintento del webhook**: cola o reintento manual | Si Firestore falla justo cuando entra una cita, hoy se pierde. Cal.com reintenta, pero conviene tener bitácora propia. | Bajo |
| **Entorno de preview con datos aparte** (proyecto Firebase distinto) | Para que las reservas de prueba no ensucien la base real de prospectos. | Gratis |
| **Copia del repositorio fuera de GitHub** | El contrato promete entrega del repositorio; un espejo evita depender de una sola cuenta. | Gratis |
