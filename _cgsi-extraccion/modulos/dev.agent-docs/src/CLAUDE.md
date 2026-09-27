# CGSI — Contexto persistente para el agente

Sitio de **CG Software Integration S.A.S.** Territorio **«Por escrito»**: la página es una
propuesta comercial dirigida al visitante. Se lee como un documento impecable y se comporta
como software.

`Ref. CSI-2026-WEB-001 · Rev. 2` · Generado en F0 a partir de `docs/brief.md` (Parte B).
Idioma del producto, del contenido y del código: **español**. Los nombres de componentes,
rutas, campos y variables van en español, como en la Parte B.

---

## 1. Fuentes de verdad (orden de precedencia)

1. **Copy literal** de `docs/brief.md` → Parte A §3.
2. **Tokens** de la Parte A §2.1, implementados en `src/styles/tokens.css`.
3. **Parte B** de `docs/brief.md` (especificación técnica).
4. **Prototipos** en `design/project/` — referencia **visual**. No se copia su HTML/CSS;
   se reimplementa en el stack de §3.

> Si dos fuentes chocan, **detente y pregunta**. Nunca resuelvas inventando.

`docs/politica-de-datos.md` es la fuente del texto legal (pendiente de validación de abogado).

## 2. Reglas duras

- **No inventes** copy, cifras, clientes, logos ni testimonios. Si falta un texto, deja
  `{PENDIENTE: …}` visible en la interfaz y regístralo en `PROGRESS.md`.
- **Ninguna cifra sin fuente y fecha.** Toda afirmación fuerte lleva nota numerada al margen.
- **No agregues dependencias** fuera de la tabla de §3 sin justificarlo en `PROGRESS.md`.
- **Trabaja por fases** (§16). Al cerrar cada fase: pruebas en verde, `PROGRESS.md` actualizado
  y commit.
- **Ningún despliegue a producción sin revisión humana explícita** del fundador, por escrito.
- **Ningún componente lleva texto escrito a mano.** Copy largo → MDX en `content/es/`.
  Textos cortos de interfaz (botones, etiquetas, `aria-label`) → `messages/es.json`.
- **Ningún color escrito a mano.** Solo tokens (§5).
- El número comercial (+57 323 813 4588) **no se conecta a ninguna API**. El sitio solo genera
  enlaces `wa.me`.

### Voz (Parte A §1)

Se tutea al lector, con estructura formal y trato cercano. Frases cortas. Sin adjetivos que no
se puedan probar. Las exclusiones se dicen («No incluye»).

**Vocabulario prohibido:** vanguardia, soluciones innovadoras, transformación digital, a la
medida de tus necesidades, crecemos contigo, ingenieros dedicados, consulta gratis, cumplimos
HIPAA, certificados en ISO, «+X % de eficiencia» sin fuente.

### Lista negra visual (Parte A §2.5)

Bento grid, glassmorphism, gradientes tipo aurora, partículas o blobs 3D, líneas topográficas,
image-sequence, fotos de stock, logos de tecnología en fila, íconos decorativos, preloader,
smooth scroll global, cursor personalizado, texto partido en titulares, marquesinas, scrolljacking.

## 3. Stack (Parte B §B.1)

| Pieza | Elección |
|---|---|
| Runtime | **Node 24 LTS** (desviación registrada; el brief decía 22) |
| Framework | Next.js 16, App Router, Turbopack, React 19 |
| Lenguaje | TypeScript `strict` |
| Estilos | Tailwind CSS v4 (tokens como variables CSS) |
| i18n | `next-intl` con `src/proxy.ts` (**no** `middleware.ts`: renombrado en Next 16) |
| Contenido | Velite + MDX, colecciones tipadas con Zod |
| Movimiento | `gsap` ≥ 3.13 + `@gsap/react`. Plugins: **solo** ScrollTrigger y DrawSVGPlugin |
| Datos | `firebase-admin` (Firestore), **solo** en el servidor |
| Agenda | `@calcom/embed-react`, carga diferida |
| Analítica | `@vercel/analytics`, `@vercel/speed-insights` y **PostHog**, todos sin cookies |
| Validación | `zod` (entorno, webhooks, frontmatter) |
| Pruebas | Vitest, Playwright, `@axe-core/playwright`, Lighthouse CI |
| Paquetes | **pnpm**, lockfile versionado |

**Prohibido:** Lenis, ScrollSmoother, SplitText en titulares, Three.js/R3F, Framer Motion,
librerías de componentes (shadcn, MUI, Chakra), jQuery, y cualquier script de terceros que no
esté en esta tabla.

Las dependencias se instalan **en la fase que las necesita**, no antes (ver `PROGRESS.md`).

## 4. Estructura (Parte B §B.2, con raíz en el repo)

```
cgsi/                              # raíz del repo (docs/ y design/ son referencia, no build)
├─ CLAUDE.md · PROGRESS.md
├─ velite.config.ts · next.config.ts · package.json
├─ messages/es.json                # textos de interfaz
├─ content/es/
│  ├─ documento/                   # 00-portada.mdx … 07-proximos-pasos.mdx, 99-pie.mdx
│  ├─ expedientes/                 # essenza.mdx, salud-ocupacional.mdx
│  ├─ memorandos/                  # 001-*.mdx …
│  └─ legal/politica-de-datos.mdx
├─ src/
│  ├─ proxy.ts                     # next-intl
│  ├─ i18n/{routing,request,navigation}.ts
│  ├─ app/[locale]/{layout,page}.tsx · expedientes/[slug] · memorandos · politica-de-datos · not-found
│  ├─ app/api/cal/webhook · app/api/salud · sitemap.ts · robots.ts · rss.xml · opengraph-image.tsx
│  ├─ components/
│  │  ├─ documento/  Cajetin · IndiceSecciones · Seccion · DobleFilete · Nota · Diff · FiguraRecorrido · Firma · Sello
│  │  ├─ expedientes/ PestanasExpediente
│  │  ├─ contacto/   AgendaCal · BotonWhatsApp · AvisoPrivacidad
│  │  ├─ tema/       InterruptorPapelPlano · ScriptTema
│  │  └─ pie/        MedidorCarga
│  ├─ lib/ env.ts · gsap.ts · firebase-admin.ts · cal.ts · mensajeria/ · seo.ts · version.ts
│  └─ styles/{tokens,globals,print}.css
├─ scripts/ prospectos-exportar.ts · prospectos-suprimir.ts
├─ tests/{unit,e2e,a11y,visual}
└─ .github/workflows/ci.yml
```

## 5. Tokens y tema (Parte A §2.1, Parte B §B.3)

Cada color saturado tiene **un solo significado**: firmar, tachar, agregar.

| Token | Papel (día) | Plano (noche) | Uso |
|---|---|---|---|
| `--papel` | `#F5F0E8` | `#0D1B2A` | Fondo |
| `--papel-2` | `#EDE8E0` | `#13253A` | Superficies, filas alternas |
| `--tinta` | `#0D1B2A` | `#F5F0E8` | Titulares, filete grueso |
| `--grafito` | `#2A2A2A` | `#F5F0E8` | Texto de cuerpo |
| `--lapiz` | `#5A6778` | `#9AA6B5` | Notas al margen, metadatos |
| `--carbon` | `#3D3D3D` | `#C9CED6` | Numerales romanos, guiones, filete fino |
| `--firma` | `#2340C8` | `#8FA2FF` | **Único** color de acción: CTA, enlaces, foco, firma, sello |
| `--texto-sobre-firma` | `#F5F0E8` | `#0D1B2A` | Texto sobre `--firma` |
| `--tachado` | `#9B2F24` | `#E08A7E` | **Solo** líneas «−» del diff |
| `--agregado` | `#2E6A4A` | `#7FC49A` | **Solo** líneas «+» del diff |

- `--firma` **no** se usa como decoración.
- El diff **nunca** comunica solo con color: siempre «−»/«+» y tachado en lo que se quita.
- El SLATE de los documentos (`#6B7A8D`) no se usa para texto: no pasa AA.
- Tema inicial: `prefers-color-scheme`. El interruptor persiste `papel|plano` en `localStorage`
  (try/catch). `ScriptTema` es un script inline de bloqueo en `<head>`: **sin parpadeo**.
- Tailwind v4: los tokens se exponen con `@theme` en `globals.css`.

## 6. Tipografía (Parte A §2.2, Parte B §B.4)

`next/font/google`, subset `latin`, `display: 'swap'`.

| Rol | Fuente | Variable | Fallback |
|---|---|---|---|
| Titulares | Source Serif 4 (`axes: ['opsz']`) | `--f-serif` | Georgia |
| Texto e interfaz | Source Sans 3 | `--f-sans` | Calibri, system-ui |
| Metadatos | JetBrains Mono | `--f-mono` | ui-monospace |

Escala: portada `clamp(2.75rem, 6vw, 5.5rem)`; título de sección `clamp(1.75rem, 3vw, 2.5rem)`;
cuerpo `1.0625rem`/`1.6`; metadatos mono `0.75–0.8125rem` con `tracking +0.02em`.
El carácter sale del contraste entre titulares muy grandes y metadatos muy pequeños, con mucho aire.
`lang="es-CO"` en `<html>`.

## 7. Retícula (Parte A §2.3)

- **≥1024 px:** 12 columnas. 1–2 índice I–VII fijo con la sección actual resaltada;
  3–9 texto principal (máx. **68 caracteres** por línea); 10–12 notas al margen y figuras.
- **Móvil:** una columna; notas que se abren con un toque; cajetín como barra delgada inferior.
- `viewport-fit=cover` y `env(safe-area-inset-*)`.

## 8. Componentes (Parte B §B.5)

**Por defecto todo componente es de servidor.** Son de cliente (`"use client"`) **solo**:
`Cajetin`, `Nota` (solo el botón de móvil), `PestanasExpediente`, `DobleFilete`,
`FiguraRecorrido`, `InterruptorPapelPlano`, `AgendaCal`, `Sello`, `MedidorCarga`.

Contrato de cada uno, con su criterio de aceptación y accesibilidad: **Parte B §B.5**.
Cajetín: `Ref. CSI-2026-WEB-001 · Rev. {APP_VERSION} · {BUILD_DATE dd.mm.aaaa} · Pág. {n}/VII`,
con la página calculada por IntersectionObserver sobre `[data-seccion]`.

## 9. Movimiento (Parte B §B.6)

1. Plugins registrados **una sola vez** en `src/lib/gsap.ts` (cliente).
2. Toda animación dentro de `useGSAP(() => {…}, { scope: ref })`.
3. Todo dentro de `gsap.matchMedia()`: solo corre con `(prefers-reduced-motion: no-preference)`;
   con `reduce` se fija el estado final.
4. Solo se animan `transform`, `opacity` y trazo SVG (DrawSVG). **Nunca** propiedades de layout.
5. **Nada de pin que altere el scroll.** La figura se fija con `position: sticky` y ScrollTrigger
   solo lee el progreso (`scrub: true`).
6. `ScrollTrigger.refresh()` después de `document.fonts.ready`. `markers` solo en desarrollo.
7. Los componentes con GSAP van debajo del pliegue y se importan con `next/dynamic`.

**Inventario cerrado de 6 animaciones** (§B.6). No se agrega ninguna otra. Duraciones 150–300 ms,
salvo los filetes (0,6–0,8 s). Sin JS o con movimiento reducido, todo aparece en su estado final.

## 10. Contenido (Parte B §B.8)

Colecciones Velite: `documento`, `expedientes`, `memorandos`, `legal`. Esquemas en
`velite.config.ts`. `prebuild: velite build`. En producción solo se publica `estado: 'publicado'`.

**El build falla si** un expediente no confidencial no tiene `autorizacion`, o si la política
no tiene `vigenteDesde`.

## 11. Integraciones (Parte B §B.10)

- **Cal.com:** embed diferido (clic o proximidad a VII). Webhook `POST /api/cal/webhook`:
  cuerpo crudo ≤ 64 KB, HMAC-SHA256 con `timingSafeEqual` contra `x-cal-signature-256` (401 si no),
  Zod (400 si no), **idempotente** por `payload.uid`, guarda consentimiento, responde < 2 s.
- **Firestore:** reglas `allow read, write: if false;`. TTL sobre `expiraEn` = último contacto
  + 24 meses. Eventos de estado solo se agregan, nunca se editan.
- **Mensajería:** interfaz `Mensajeria` con proveedores `evolution | cloud | ninguno`.
  Evolution **solo** para avisos internos al fundador desde un número secundario.
  Nunca se envían mensajes automáticos por WhatsApp a prospectos.
- **Analítica con consentimiento previo:** PostHog corre con toda su funcionalidad (cookie de
  identificación, autocaptura y, aparte, grabación de sesión), **pero nada se carga hasta que la
  persona lo autoriza**. El aviso de cookies tiene cuatro categorías independientes —necesarias,
  preferencias, analítica y grabación— y la decisión se guarda con la fecha y la **versión de la
  política**: si la política sube de versión, o pasan 12 meses, se vuelve a preguntar.
  Al retirar el permiso se le pide a PostHog que deje de capturar y borre lo guardado.
- **Las categorías mandan de verdad:** sin «preferencias», el tema no se persiste; sin
  «analítica», ni PostHog ni Vercel Analytics se montan. Hay pruebas que lo verifican.
- **No se integran en la v1:** CRM, chat en vivo, píxeles publicitarios, newsletter.

> Lo que está bloqueado por credenciales o por terceros vive en `TODO.md`, con los pasos concretos.

## 12. Seguridad (Parte B §B.11)

Encabezados en `next.config.ts`: HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy` y CSP
(`default-src 'self'`, Cal.com permitido en `script-src`/`img-src`/`frame-src`/`connect-src`,
`object-src 'none'`, `frame-ancestors 'none'`). En la v1 se acepta `'unsafe-inline'` en
`script-src`; primero se despliega como `Report-Only` en preview.
Solo `NEXT_PUBLIC_*` llega al cliente. `lib/env.ts` valida con Zod y hace fallar el build.

## 13. Rendimiento (Parte B §B.12)

LCP ≤ 2,0 s en 4G · CLS ≤ 0,05 · INP ≤ 200 ms.
Lighthouse CI móvil: Rendimiento ≥ 90, **Accesibilidad = 100**, Buenas prácticas ≥ 95, **SEO = 100**.

**JavaScript inicial.** B.12 pide ≤ 120 KB comprimidos. Ese número **no es alcanzable con el
stack de B.1**: Next 16 con React 19 y App Router pone un piso medido de ~179 KB gzip con la
página vacía, y no baja ni cambiando de empaquetador ni recortando objetivos de navegador
(medido en F3; ver PROGRESS.md). Lo que rige, entonces:

- **Código propio ≤ 20 KB gzip** sobre ese piso. Hoy va en ~10 KB.
- **Lo pesado va diferido:** GSAP solo se descarga si hay movimiento; Cal.com, al acercarse a VII.
- `tests/e2e/presupuesto.spec.ts` hace fallar el build si el JS inicial pasa de 200 KB gzip o si
  algo diferido se cuela en el arranque.
- Las métricas de usuario (LCP, CLS, INP, Lighthouse) son el criterio real de F6.

## 14. Accesibilidad (Parte B §B.13, WCAG 2.2 AA)

Enlace «Saltar al contenido» · encabezados en orden · foco visible de 2 px en `--firma` con
2 px de separación · objetivos táctiles ≥ 44 px · teclado completo (índice, pestañas, notas,
interruptor, agenda) · `prefers-reduced-motion` · contraste verificado en Papel y Plano ·
`axe` sin violaciones en CI · sin desbordes horizontales a 360 px.

## 15. Impresión (Parte B §B.14)

`@page { size: letter; margin: 1in; }`, Georgia y Calibri, fondo blanco, tinta negra.
Se ocultan navegación, interruptor, agenda, WhatsApp y medidor. Las notas al margen pasan a
notas al pie numeradas. Enlaces con su URL entre paréntesis. Botón «Descargar como PDF» →
`window.print()`.

## 16. Fases (Parte B §B.17)

| Fase | Alcance | Criterio de salida |
|---|---|---|
| **F0 Base** | Next 16, TS strict, Tailwind v4 con tokens, fuentes, next-intl con `proxy.ts`, Velite, `env.ts`, CI esqueleto, `CLAUDE.md`, `PROGRESS.md` | Build y CI en verde; página vacía con tokens aplicados |
| **F1 Sistema documento** | Retícula, `Seccion`, `IndiceSecciones`, `Cajetin`, `Nota`, `Diff`, `Firma`, `DobleFilete` estático, tema Papel/Plano, `print.css` | axe y teclado en verde; contraste de Plano medido |
| **F2 Contenido** | MDX literal de la Parte A §3, expedientes, política, 404 | Copy idéntico al brief; sin `{PENDIENTE}` sin registrar |
| **F3 Movimiento** | GSAP (inventario §B.6), View Transitions en pestañas, movimiento reducido | Sin animaciones fuera del inventario; presupuesto de JS respetado |
| **F4 Integraciones** | WhatsApp, `AgendaCal` diferida, webhook → Firestore con TTL, Evolution, `Sello`, `MedidorCarga`, scripts de titulares | Reserva de prueba de principio a fin; aviso interno recibido |
| **F5 SEO y memorandos** | Colección memorandos, metadata, JSON-LD, sitemap, RSS, OG | Validadores de datos estructurados sin errores |
| **F6 Endurecimiento** | Encabezados y CSP, Lighthouse CI, e2e completos, revisión humana | Umbrales §13 cumplidos y aprobación escrita del fundador |

El estado real de cada fase vive en `PROGRESS.md`. **Léelo antes de tocar código.**

## 17. Comandos

```bash
pnpm dev          # velite en watch + next dev (Turbopack)
pnpm build        # velite build (prebuild) + next build
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit
pnpm test:unit    # vitest run
pnpm test:e2e     # playwright (tests/e2e)
pnpm test:a11y    # playwright + axe (tests/a11y)
pnpm verificar    # lint + typecheck + test:unit + build  (lo mismo que corre CI)
```

Pipeline de CI en cada PR (§B.16): `lint` → `typecheck` → `test:unit` → `build` → `test:e2e` →
`test:a11y` → Lighthouse CI.

## 18. Definición de terminado (Parte B §B.18)

Copy idéntico a la Parte A §3 · ninguna cifra sin fuente · solo animaciones del inventario, todas
con variante de movimiento reducido · el número comercial no está conectado a ninguna API · el
webhook verifica firma, es idempotente y guarda el consentimiento · TTL de 24 meses activo ·
umbrales de Lighthouse y axe cumplidos · impresión revisada en PDF · `PROGRESS.md` al día ·
revisión humana aprobada.
