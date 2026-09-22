# PROGRESS — CGSI

Bitácora por fase del sitio `Ref. CSI-2026-WEB-001`. Especificación: `docs/brief.md`.
Reglas de trabajo: `CLAUDE.md`.

**Regla:** al cerrar cada fase → pruebas en verde, esta bitácora actualizada y commit.
Ningún despliegue a producción sin revisión humana explícita.

---

## Estado de las fases

| Fase | Estado | Cierre |
|---|---|---|
| F0 Base | 🟢 Cerrada y revisada | 21.09.2026 |
| F1 Sistema documento | 🟢 Cerrada | 22.09.2026 |
| F2 Contenido | 🟢 Cerrada | 22.09.2026 |
| F3 Movimiento | 🟢 Cerrada | 22.09.2026 |
| F4 Integraciones | 🟡 Construida y probada; **su criterio de salida depende de credenciales** (`TODO.md`, puntos 3, 4 y 6) | — |
| F5 SEO y memorandos | ⬜ Sin empezar | — |
| F6 Endurecimiento | ⬜ Sin empezar | — |

---

## Decisiones tomadas fuera del brief

Decisiones que el brief no cierra y que se resolvieron con el fundador antes de empezar F0.

| Fecha | Tema | Decisión | Quién |
|---|---|---|---|
| 21.09.2026 | Raíz del proyecto | El proyecto Next vive en la **raíz del repo**, no en `cgsi-web/`. `docs/` y `design/` quedan como carpetas de referencia y no entran al build. El árbol de B.2 se actualizó en el brief. | Camilo |
| 21.09.2026 | Runtime | **Node 24 LTS** en local, en CI y en producción, en lugar del Node 22 LTS de B.1. Un solo runtime en todas partes. | Camilo |
| 21.09.2026 | Alcance de la sesión | Ejecutar F0 completa y detenerse en su criterio de salida para revisión humana. | Camilo |
| 22.09.2026 | Fecha de vigencia de la política | **22 de septiembre de 2026.** Deja de ser provisional. La validación del abogado sigue pendiente y es lo único que queda marcado en la página. | Camilo |
| 22.09.2026 | Nota al pie 12 | Recortar «; ver sección 9»: esa sección es del brief, no del sitio. La desviación queda declarada en `tests/unit/copy.test.ts`. | Camilo |
| 22.09.2026 | Presupuesto de JS | Delegado en el agente: decidir en F3 con la medición en la mano. | Camilo |
| 22.09.2026 | Revisión de F0 | Aprobada. El presupuesto de JS se decide en F3 (evaluando carga diferida). El override de `sharp` se mantiene: la prioridad es no tener vulnerabilidades. Las desviaciones técnicas quedan aprobadas mientras el resultado sea estable. | Camilo |

## Desviaciones respecto a la Parte B

| Punto del brief | Qué dice | Qué se hizo | Razón |
|---|---|---|---|
| B.1 Runtime | Node 22 LTS | Node 24 LTS (`.nvmrc`, `engines`, CI) | Decisión del fundador (arriba). Next 16 exige ≥ 20.9, así que se cumple el requisito real. |
| B.1 Framework | React 19.2 | React 19.3.x | Es la versión que instala y prueba Next 16.3. Sin cambios de API. |
| B.1 TypeScript | «TypeScript `strict`», sin versión | TypeScript 5.9.3, con `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride` y `verbatimModuleSyntax` | TS 7.0 (compilador nativo) ya es `latest`, pero el ecosistema de Next 16 y ESLint todavía se prueba contra 5.9. Se reevalúa en F6. |
| B.2 Raíz | `cgsi-web/` | Raíz del repo | Decisión del fundador (arriba). |
| B.1 Dependencias | Tabla completa del stack | En F0 solo se instaló lo que F0 necesita | GSAP, Firebase, Cal.com y analítica entran en su fase (F3–F5). Evita dependencias sin usar y mantiene medible el presupuesto de JS. |
| B.8 Scripts | `"prebuild": "velite build"` | `"build": "velite build && next build"` | El gancho `prebuild` depende de una opción del gestor de paquetes; encadenarlo es explícito y no cambia el resultado. `typecheck` también corre Velite antes, porque los tipos del contenido se generan. |
| B.8 Desarrollo | `velite dev --watch` en paralelo con `next dev` | `scripts/dev.mjs` lanza los dos procesos | Evita agregar `concurrently`, que estaría fuera de B.1. |
| B.5 / B.8 Esquema `documento` | No se especifica | `orden`, `numeral`, `titulo`, `slug`, `cuerpo` | La Parte B define los esquemas de `memorandos`, `expedientes` y `legal`, pero no el de `documento`. Este es el mínimo para armar I–VII; se ajusta en F2 si el copy pide otro campo. |
| B.9 Metadata | Descripción ≤ 160 caracteres | Sin descripción todavía | La descripción es copy y el copy se escribe en F2 con la Parte A §3. No se inventa. |
| B.2 Estilos | `styles/{tokens,globals,print}.css` | Se agregó `styles/documento.css` | Las reglas de la retícula y de los componentes de B.5 en `globals.css` lo dejaban ilegible. Mismo contenido, un archivo más. |
| B.5 `Nota` | `<aside id>` con botón `aria-expanded` | `<span role="note">` con el mismo botón | La llamada va dentro de un párrafo y `<aside>` no es contenido en línea válido dentro de `<p>`. `role="note"` da la misma semántica sin HTML inválido. |
| B.5 `DobleFilete` | Componente de cliente | De servidor en F1 | En F1 es estático (criterio de salida de B.17). Lo vuelve de cliente F3, cuando GSAP lo dibuja con DrawSVG, y para entonces entra por `next/dynamic` (B.6.7). Así no suma JavaScript inicial antes de tiempo. |
| B.5 `IndiceSecciones` | `aria-current="location"` | Lo pone el `Cajetin` | El índice es de servidor (B.5 no lo lista como cliente) y `aria-current` depende del scroll. El `Cajetin`, que ya observa las secciones, marca el enlace y escribe `data-seccion-activa` en `<html>`. Un solo observador para todo el documento. |
| B.5 Tabla de componentes | No incluye un botón de impresión | Se agregó `BotonImprimir` | La Parte A §4.5 y B.14 piden un botón «Descargar como PDF» que llame a `window.print()`. |
| B.2 Rutas | No contempla una página de sistema | Se agregó `/sistema`, con `noindex` | `Nota` y `Diff` no tienen contenido real hasta F2 y el criterio de salida de F1 exige probarlos con teclado y con axe. Es una página interna de referencia; se reevalúa en F6. |
| B.14 Impresión | Notas al margen como notas al pie | Notas numeradas en el flujo, después de su párrafo | Las notas al pie reales necesitan `float: footnote` de CSS Paged Media, que ningún navegador implementa. El encabezado y el pie de hoja usan `position: fixed` por la misma razón. |
| B.2 Ruta `/sistema` | — | **Retirada en F2** | Existía solo para poder probar `Nota` y `Diff` sin contenido real. Ya están en el documento, así que la página sobraba. La deuda de F1 queda saldada. |
| B.5 Tabla de componentes | No contempla la portada ni la franja | Se agregaron `Cta`, `Destinatario`, `Franja`, `Acciones`, `AlMargen` y `Faq` | El copy de la Parte A §3 los pide: llamados a la acción con microcopy, bloque «Para / De», franja «Lo que siempre incluye», anotación al margen en mono y «Aclaraciones frecuentes». Ninguno lleva texto escrito a mano: todo viene del MDX. |
| B.8 Render de MDX | No especifica cómo | `new Function` sobre el cuerpo que compila Velite | Es el patrón de Velite. Corre solo en el servidor, así que la CSP del navegador (B.11) no necesita `unsafe-eval`. |
| Parte A §3, pie | «Página N de VII · Rev. {versión}» dentro del pie | Lo muestra el cajetín | Es el mismo dato y el cajetín ya lo calcula en vivo. Repetirlo en el pie sería una segunda fuente que se puede desincronizar. |
| Parte A §3, VII | «[Agenda Cal.com embebida] · [Escribir por WhatsApp]» | Hueco marcado `{PENDIENTE}` | La agenda y el botón de WhatsApp son F4. El hueco se ve, en vez de fingir una agenda que no existe. |
| Parte A §4.8 | «un enlace al índice», sin texto | «Volver al índice» | El brief no da la etiqueta. Es funcional, no una afirmación. |
| B.12 Presupuesto de JS | ≤ 120 KB comprimidos de JS inicial | Código propio ≤ 20 KB gzip sobre el piso del framework, con techo duro de 200 KB en pruebas | El piso de Next 16 con React 19 es de ~179 KB gzip con la página vacía. El número de B.12 no es alcanzable sin cambiar la decisión de stack de B.1. Medición completa en F3. Decisión delegada por Camilo el 22.09.2026. |
| B.5 `DobleFilete` | Componente de cliente | Sigue siendo de servidor en F3 | GSAP lo anima desde fuera, por elemento, no por componente. Así el filete se renderiza sin JavaScript y el motor de movimiento vive en un solo módulo diferido, que es lo que pide B.6.7. |

## Dependencias fuera de B.1

| Dependencia | Tipo | Razón |
|---|---|---|
| `posthog-js` | Dependencia nueva | **Pedida por Camilo el 22.09.2026.** B.1 solo contempla la analítica de Vercel. Se configura sin cookies ni almacenamiento persistente (`persistence: 'memory'`), sin grabación de sesión y sin autocaptura, para que la política pueda seguir diciendo que la analítica no usa cookies (Parte A §7.5). Se carga en diferido y solo si hay clave: no toca el arranque. PostHog se agregó a la tabla de encargados de la política (§10) y a su fuente. |
| `server-only` | Guardia de empaquetado | Es el mecanismo oficial para que un módulo de servidor reviente el build si alguien lo importa desde el cliente. Lo usan `firebase-admin`, `prospectos` y la mensajería, que es justo lo que B.1 exige que viva solo en el servidor. Pesa cero en el cliente. |
| `pnpm.overrides.uuid: ^11.1.1` | Override, no dependencia nueva | `firebase-admin` arrastra `uuid` viejo a través de `@google-cloud/storage`, con una vulnerabilidad moderada (falta de control de límites del búfer en v3/v5/v6). Con el override, `pnpm audit` vuelve a quedar limpio. |
| `pnpm.overrides.sharp: ^0.35.4` | Override, no dependencia nueva | Velite 0.4.0 pide `sharp ^0.34.5`, que arrastra dos vulnerabilidades altas heredadas de libvips y libheif (GHSA-rgj7-g3m4-5g8c y CVE-2026-33327/33328/35590/35591). Con el override, `pnpm audit --audit-level high` queda limpio y Velite sigue compilando. Se retira cuando Velite suba su rango. |

## Marcadores `{PENDIENTE}` abiertos

| Marcador | Dónde | Quién lo resuelve | Bloquea |
|---|---|---|---|
| `{PENDIENTE: agenda de Cal.com}` | Sección VII, componente `Agenda` | El agente, en F4 | Nada. |
| `{PENDIENTE: mensajes de WhatsApp por estado}` | Fig. 1 del expediente Essenza | Camilo | Nada en el build. La Parte A §3 pide el mensaje que recibe el cliente en cada estado, pero no los transcribe. |
| `{PENDIENTE: testimonio del Anexo 2}` | `content/es/expedientes/essenza.mdx` | Camilo | Lanzamiento. El texto del Anexo 2 no está en el brief. |
| `{PENDIENTE: validación por abogado}` | Cabeza de `/politica-de-datos` | Camilo y abogado | **Lanzamiento.** La fecha de vigencia ya está fija: 22.09.2026. |
| `{PENDIENTE: dominio}` | `NEXT_PUBLIC_SITE_URL`, canónicas, JSON-LD | Camilo | Lanzamiento (Parte A §11). Mientras tanto: `http://localhost:3000` en desarrollo y `http://127.0.0.1:3100` en CI. |
| Correo del dominio | Pie del sitio, política de datos, JSON-LD | Camilo | Lanzamiento. Hoy se publica `cgsoftwareintegrations@gmail.com`, que es el correo que la política ya declara; hay que cambiarlo por el del dominio antes de salir (Parte A §9). |
| `{PENDIENTE: enlace del evento Cal.com}` | `NEXT_PUBLIC_CAL_LINK` | Camilo | F4 |
| `{PENDIENTE: fecha de vigencia de la política}` | `content/es/legal/politica-de-datos.mdx` | Camilo y abogado | F2: el build falla sin `vigenteDesde`. |
| `{PENDIENTE: número secundario Evolution}` | `EVOLUTION_*`, `NOTIFICACIONES_DESTINO` | Camilo | F4 |
| `{PENDIENTE: firma CSI-2026-ESSENZA-002 y testimonio del Anexo 2}` | `content/es/expedientes/essenza.mdx` | Camilo | F2: el build falla si un expediente no confidencial no tiene `autorizacion`. |
| `{PENDIENTE: stack real de Essenza}` | Etiqueta del expediente 01 | Camilo | F2 |
| `{PENDIENTE: logo SVG y foto del fundador}` | Membrete, imágenes OG | Camilo | F5 |

Los pendientes de lanzamiento (legal, contenido, operación) están en la Parte A §9 y §11.
Esta tabla solo lista los que dejan un marcador visible en el código o bloquean un build.

## Riesgos abiertos

| Riesgo | Medición | Cuándo se resuelve |
|---|---|---|
| ~~Presupuesto de JS~~ | **Resuelto en F3.** El umbral de 120 KB de B.12 no es alcanzable con el stack de B.1: el piso del framework es de ~179 KB gzip con la página vacía, y no baja ni cambiando de empaquetador ni recortando objetivos de navegador. Se redefinió lo que sí se controla y se puso una prueba que lo vigila. Ver «El presupuesto de JavaScript» en F3. | — |
| **Bloque de polyfills de 38,7 KB gzip** que se sirve a todos los navegadores, sin `nomodule`, en Turbopack y en webpack por igual. Es el 20 % del arranque. | Medido el 22.09.2026, al desglosar los trozos del build. | **F6**, donde vive el endurecimiento de rendimiento. |
| ~~Contraste del modo Plano~~ | **Resuelto en F1.** Ver la tabla de medición más abajo: los diez tokens pasan AA en las dos superficies. | — |
| ~~Fecha de vigencia de la política~~ | **Resuelto el 22.09.2026:** Camilo la fijó en el 22 de septiembre de 2026, que es la que ya estaba en el MDX. | — |
| **La política no la ha revisado un abogado.** La página lo dice, arriba del todo, con un marcador visible. | — | **Antes del lanzamiento** (Parte A §11). Al aprobarse, se quita el marcador de `messages/es.json` y de la página. El gate de F6 no debe pasar con el marcador puesto. |
| **El pie enlaza a `/memorandos`, que todavía no existe.** El enlace es copy literal de la Parte A §3 y hoy cae en el folio no encontrado. | — | **F5**, que crea la colección y la ruta. |

---

## F0 — Base

**Alcance (B.17):** Next 16, TS strict, Tailwind v4 con tokens, fuentes, next-intl con `proxy.ts`,
Velite, `env.ts`, CI esqueleto, `CLAUDE.md` y `PROGRESS.md`.
**Criterio de salida:** build y CI en verde; página vacía con tokens aplicados.

### Bitácora

- **21.09.2026** — Lectura del brief completo (Parte A y Parte B) y del bundle de `design/`.
  Confirmadas con el fundador las tres decisiones de arriba. Generados `CLAUDE.md` y este archivo.
- **21.09.2026** — Andamiaje completo, pipeline local en verde y cierre de F0 a la espera de
  revisión humana.

### Trabajo realizado

**Base del proyecto**
- `package.json` (pnpm, Node ≥ 24, scripts del pipeline de B.16), `pnpm-lock.yaml` versionado.
- `tsconfig.json` con `strict` y alias `@/*` y `#contenido`.
- `next.config.ts`: App Router con Turbopack, raíz de Turbopack fijada al repo e inyección de
  `NEXT_PUBLIC_APP_VERSION` (desde `package.json`) y `NEXT_PUBLIC_BUILD_DATE` (fecha del build),
  que alimentan el cajetín de F1. Los encabezados de seguridad y la CSP quedan marcados para F6.
- `eslint.config.mjs` (flat config de `eslint-config-next`), `postcss.config.mjs`, `.nvmrc`, `.gitignore`.

**Tokens, tema y tipografía**
- `src/styles/tokens.css`: los 10 tokens de la Parte A §2.1 en Papel y en Plano, más el respaldo
  por `prefers-color-scheme` para cuando no hay JavaScript.
- `src/styles/globals.css`: Tailwind v4 con `@theme inline`, escala tipográfica con `clamp()`,
  medida de 68 caracteres, foco visible de 2 px en `--firma` y respeto por `prefers-reduced-motion`.
- `src/lib/fuentes.ts`: Source Serif 4 (`axes: ['opsz']`), Source Sans 3 y JetBrains Mono por
  `next/font/google`, con los fallbacks Georgia y Calibri de los documentos.

**i18n y contenido**
- `src/i18n/{routing,request,navigation}.ts` y `src/proxy.ts` (nombre de Next 16). Español en la
  raíz, sin prefijo; `generateStaticParams` y `setRequestLocale` para mantener el render estático.
- `messages/es.json` con los textos de interfaz que hoy existen.
- `velite.config.ts` con las cuatro colecciones y las reglas de build de B.8: un expediente no
  confidencial sin `autorizacion` rompe el build, y la política necesita `vigenteDesde`.
- `src/app/[locale]/{layout,page}.tsx`: página base con tokens y fuentes aplicados.

**Entorno y pruebas**
- `src/lib/env.ts`: validación con Zod de todas las variables de B.15, perezosa y memorizada.
  Las que todavía no usa ningún código van opcionales, con la fase en que se vuelven obligatorias.
- `.env.example` con las variables y ningún valor real.
- `vitest.config.ts`, `playwright.config.ts` (1440 px y 390 px, más el proyecto de accesibilidad).
- `.github/workflows/ci.yml` con el orden de B.16 y `pnpm audit` en un job aparte;
  `.github/dependabot.yml` semanal (B.11). El job de Lighthouse CI queda señalado para F6.
- `scripts/dev.mjs`: Velite en watch junto a `next dev`.

### Pruebas

| Suite | Resultado |
|---|---|
| `pnpm lint` | Sin errores ni advertencias |
| `pnpm typecheck` | Sin errores |
| `pnpm test:unit` (Vitest) | **15 en verde** — 10 de `env.ts` y 5 de tokens |
| `pnpm build` | En verde; 3 páginas estáticas |
| `pnpm test:e2e` (1440 px y 390 px) | **10 en verde** |
| `pnpm test:a11y` (axe, Papel y Plano) | **2 en verde**, cero violaciones |
| `pnpm audit --audit-level high` | Sin vulnerabilidades conocidas |

Las pruebas de `env.ts` se escribieron antes que el módulo y se vieron fallar primero.
Las de tokens se verificaron rompiendo a propósito `--firma` del modo Plano y metiendo un hex
fuera de `tokens.css`: las dos guardas fallaron como debían y volvieron a verde al restaurar.

### Verificación del criterio de salida

- [x] **Build en verde.** `pnpm build` compila y genera las páginas estáticas.
- [x] **Pipeline en verde.** Los siete pasos de B.16 corrieron localmente en el orden del brief.
      El job de GitHub Actions está escrito pero **todavía no ha corrido en GitHub**: este repo no
      tiene remoto configurado.
- [x] **Página vacía con tokens aplicados.** Verificado en navegador por las pruebas e2e:
      fondo `#F5F0E8` y texto `#2A2A2A` en Papel, `#0D1B2A` y `#F5F0E8` en Plano, las tres
      familias tipográficas cargadas, `lang="es-CO"` y sin desbordes horizontales a 390 px.

### Revisión humana

Aprobada el 22.09.2026 (ver la tabla de decisiones). Queda abierto conectar el repositorio a un
remoto para que CI corra de verdad.

---

## F1 — Sistema documento

**Alcance (B.17):** retícula, `Seccion`, `IndiceSecciones`, `Cajetin`, `Nota`, `Diff`, `Firma`,
`DobleFilete` estático, tema Papel/Plano y `print.css`.
**Criterio de salida:** pruebas de axe y teclado en verde; contraste del modo Plano medido.

### Bitácora

- **22.09.2026** — Medido primero el contraste del modo Plano, que era el pendiente que el brief
  dejaba marcado en B.3. Luego los componentes, la retícula y la hoja de impresión.

### Contraste del modo Plano (cierra el pendiente de B.3)

Medido sobre los hex reales de `tokens.css` con la fórmula de WCAG 2.2, en
`tests/unit/contraste.test.ts`. La misma prueba se calibra contra las siete cifras publicadas en
la Parte A §2.1 para el modo Papel, así que mide igual que el brief.

| Token | Sobre `--papel` | Sobre `--papel-2` |
|---|---|---|
| `--tinta` y `--grafito` | 15,33:1 | 13,68:1 |
| `--carbon` (derivado nuevo) | 11,00:1 | 9,81:1 |
| `--firma` | 7,27:1 | 6,49:1 |
| `--lapiz` | 7,04:1 | 6,28:1 |
| `--agregado` | 8,50:1 | 7,58:1 |
| `--tachado` | 6,71:1 | 5,99:1 |

**Los diez tokens pasan AA en las dos superficies.** El más ajustado es `--tachado` sobre
`--papel-2`, con 5,99:1 contra el mínimo de 4,5:1. `--papel-2` (#13253A) y `--carbon` (#C9CED6),
los dos derivados que el brief marcaba como pendientes, quedan confirmados sin tocar ningún valor.

### Trabajo realizado

**Retícula (Parte A §2.3)**
- 12 columnas desde 1024 px: 1–2 índice y cajetín, 3–12 el documento, que adentro reparte
  7 columnas de texto (máximo 68 caracteres) y 3 de notas al margen.
- Una columna en móvil, con el índice compacto y deslizable arriba y el cajetín como barra
  delgada abajo. Márgenes seguros con `env(safe-area-inset-*)`.

**Componentes (B.5)**
- `Seccion`, `IndiceSecciones`, `DobleFilete` y `Firma`: de servidor, sin JavaScript.
- `Cajetin`, `Nota`, `InterruptorPapelPlano` y `BotonImprimir`: de cliente, 3,3 KB gzip entre
  los cuatro.
- `Diff`: `<del>`/`<ins>` con signos «−»/«+» visibles y tachado; nunca depende del color.
- `Nota`: en escritorio flota en las columnas 10–12, alineada con su llamada; en móvil se abre
  con un toque. El primer pintado lo resuelve el CSS, así que no hay salto de layout ni
  `aria-expanded` que mienta antes de hidratar. Sin JavaScript queda visible, por `<noscript>`.

**Tema y impresión**
- `ScriptTema` fija `data-tema` antes del primer pintado; el interruptor persiste en
  `localStorage` dentro de try/catch y se suscribe al DOM en vez de guardar una copia del estado.
- `print.css`: carta con márgenes de una pulgada, Georgia y Calibri, tinta negra sobre blanco,
  sin interfaz, con los enlaces mostrando su URL y encabezado y pie de hoja.

**Un bug que encontró una prueba.** El `Cajetin` escribía la sección visible en
`<html data-seccion>`, y su propio `IntersectionObserver` buscaba `[data-seccion]`: se encontraba
a sí mismo y el cajetín se congelaba. Ahora el observador mira `section[data-seccion]` y el estado
vive en `data-seccion-activa`.

### Pruebas

| Suite | Resultado |
|---|---|
| `pnpm lint` · `pnpm typecheck` | Limpios |
| `pnpm test:unit` | **48 en verde** (10 de `env`, 5 de tokens, 33 de contraste) |
| `pnpm test:e2e` (1440 px y 390 px) | **40 en verde** |
| `pnpm test:a11y` (axe en `/` y `/sistema`, Papel y Plano) | **5 en verde**, cero violaciones |
| `pnpm audit --audit-level high` | Sin vulnerabilidades |

Las pruebas de teclado cubren: el primer tabulador llega a «Saltar al contenido» y el enlace mueve
el foco de verdad; el índice se recorre con el tabulador; la nota se abre y se cierra con Enter en
móvil; el interruptor de tema se opera con teclado. El foco visible se verifica contra `--firma`.

### Verificación del criterio de salida

- [x] **axe en verde**, en las dos rutas y en los dos temas, con las etiquetas WCAG 2.2 AA.
- [x] **Teclado en verde**, con las pruebas de arriba.
- [x] **Contraste del modo Plano medido**, con la tabla de arriba. Cierra el pendiente de B.3.
- [x] Revisado también a ojo en 1440 px y 390 px, en Papel y en Plano.

### Nota para F2

Los títulos de las siete secciones están hoy en `messages/es.json`, porque el índice los necesita
y todavía no hay MDX. En F2 pasan al frontmatter de `content/es/documento/*.mdx` y tanto el índice
como las secciones los leen desde Velite. Mientras tanto no hay dos fuentes: `messages` es la única.

_Cerrado en F2: los títulos viven en el frontmatter y `messages/es.json` ya no los duplica._

---

## F2 — Contenido

**Alcance (B.17):** MDX literal de la Parte A §3, expedientes, política y 404.
**Criterio de salida:** copy idéntico al brief; sin marcadores `{PENDIENTE}` sin registrar.

### Bitácora

- **22.09.2026** — Transcrito el documento completo a MDX, montado el render de Velite, escritas
  la política y el folio no encontrado, y retirada la página `/sistema` de F1.

### Trabajo realizado

**Capa de contenido**
- `content/es/documento/`: portada, las siete secciones y el pie, con `orden`, `tipo`, `numeral`,
  `slug` y `titulo` en el frontmatter. El índice y las secciones leen de aquí: una sola fuente.
- `content/es/expedientes/`: Essenza (con su diff y la Fig. 1) y el de salud ocupacional,
  confidencial y sin nombre de cliente.
- `content/es/legal/politica-de-datos.mdx`, transcrita de `docs/politica-de-datos.md`.
- `Mdx`: render del cuerpo que compila Velite, con los componentes de B.8 y la tipografía del
  documento. Corre solo en el servidor.

**Rutas nuevas**
- `/politica-de-datos`, con su versión y su fecha de vigencia.
- `[...resto]` + `not-found`: «Folio no encontrado», con el mismo cajetín y enlace al índice.
  Sin la ruta comodín, `proxy.ts` dejaba salir el 404 genérico de Next, sin idioma ni documento.

**Dos bugs que encontraron las pruebas**
1. **El tema no sobrevivía a una recarga.** `ScriptTema` escribe `data-tema` antes del primer
   pintado, pero React es dueño del `<html>` y lo borraba al hidratar, porque ese atributo no
   venía en el HTML estático. `suppressHydrationWarning` silencia el aviso pero no evita el
   borrado. Lo arregla `AplicarTema`, que lo repone en un efecto de layout, en el mismo commit:
   el navegador nunca pinta el tema equivocado.
2. **Desborde horizontal de 1 px a 390 px.** La retícula usaba `1fr`, cuyo mínimo es el
   `min-content` del contenido; con tablas y correos largos adentro, la columna crecía más que el
   viewport. Ahora es `minmax(0, 1fr)`.

### Pruebas

| Suite | Resultado |
|---|---|
| `pnpm lint` · `pnpm typecheck` | Limpios |
| `pnpm test:unit` | **62 en verde** (14 de ellas, de fidelidad del copy) |
| `pnpm test:e2e` (1440 px y 390 px) | **64 en verde** |
| `pnpm test:a11y` (axe en `/`, `/politica-de-datos` y el 404, Papel y Plano) | **7 en verde** |

### Verificación del criterio de salida

- [x] **Copy idéntico al brief**, y verificado por una prueba, no a ojo:
      `tests/unit/copy.test.ts` compara **cada frase** de `content/es/documento` y
      `content/es/expedientes` contra `docs/brief.md`, y las de `content/es/legal` contra
      `docs/politica-de-datos.md`. Si alguien inventa, agrega o retoca una frase, la prueba falla
      y dice cuál. Las tres sustituciones deliberadas (correo, página y revisión del pie, fecha de
      vigencia) están declaradas en la prueba, con su razón.
- [x] **Sin `{PENDIENTE}` sin registrar**: los cuatro que quedan están en la tabla de arriba.

### Decisiones del fundador sobre F2 (22.09.2026)

1. **Fecha de vigencia de la política:** 22 de septiembre de 2026. Resuelto.
2. **Nota al pie 12:** recortada. Resuelto.
3. **Autorización de Essenza.** El expediente lleva la referencia CSI-2026-ESSENZA-002, que es lo
   que el build exige. La firma sigue pendiente y bloquea el lanzamiento, no el build.

---

## F3 — Movimiento

**Alcance (B.17):** GSAP con el inventario de B.6, View Transitions en las pestañas y movimiento
reducido.
**Criterio de salida:** sin animaciones fuera del inventario; presupuesto de JS respetado.

### Bitácora

- **22.09.2026** — Inventario de B.6 implementado, pestañas de expediente con transición lateral,
  y medición completa del presupuesto de JavaScript, que Camilo delegó en el agente.

### Trabajo realizado

**Las seis animaciones de B.6, ni una más**

| # | Elemento | Cómo quedó |
|---|---|---|
| 1 | Doble filete de la portada | DrawSVG 0→100 %, 0,8 s `power2.out`, primero el grueso |
| 2 | Doble filete de cada sección | DrawSVG al entrar (`top 80%`), una vez, 0,6 s |
| 3 | Notas al margen | `opacity` 0→1 e `y` 8→0, 0,25 s `power1.out`, en lote |
| 4 | Fig. 1 «Recorrido de un pedido» | Ligada al scroll con `scrub`; la figura se fija con `position: sticky`, nunca con pin |
| 5 | Cambio de expediente | View Transition lateral de 0,3 s, según la dirección |
| 6 | Sello «Recibido» | Entra en F4, con el propio sello |

**Cómo se respetan las reglas de B.6**
- Plugins registrados una sola vez en `src/lib/gsap.ts`. Solo ScrollTrigger y DrawSVG.
- Todo dentro de `useGSAP` y de `gsap.matchMedia()`. Los objetivos son elementos, nunca cadenas
  de selector: este módulo es el motor de todo el documento, no de un subárbol.
- Solo se animan `transform`, `opacity` y el trazo SVG.
- `ScrollTrigger.refresh()` después de `document.fonts.ready`.
- **GSAP no entra en el JavaScript inicial:** `Movimiento` es una puerta de unas pocas líneas que
  carga el módulo en diferido, y solo si no hay `prefers-reduced-motion: reduce`. Con movimiento
  reducido no se descarga nada: no hay nada que animar.

**Sin parpadeo en el filete de la portada.** Está sobre el pliegue, así que si GSAP llegara tarde
se vería dibujado, luego borrado y luego redibujado. `ScriptMovimiento` marca `<html>` antes del
primer pintado y el CSS lo deja sin trazo, con una red de seguridad de 3 s por si el módulo no
carga. Es el mismo patrón del tema.

**Pestañas de expediente.** Patrón ARIA completo: flechas con vuelta, Inicio y Fin, foco móvil y
una sola parada de tabulador. La transición usa View Transitions; donde no hay soporte, o con
movimiento reducido, el cambio es instantáneo. Un espejo en `ref` del índice activo evita que dos
teclas seguidas se pisen mientras la transición está en curso: esa carrera salió en las pruebas.

### El presupuesto de JavaScript

Camilo delegó la decisión el 22.09.2026. Esto es lo que se midió, sobre el build de producción:

| Escenario | JS inicial |
|---|---|
| F0, página vacía | 178,9 KB gzip · 154,3 KB brotli |
| F3, documento completo | **188,7 KB gzip · 163,2 KB brotli** |
| Lo mismo, con webpack en vez de Turbopack | 185,9 KB gzip |
| Lo mismo, con `browserslist` moderno | 188,7 KB gzip (sin cambio) |
| GSAP, que se descarga aparte y solo si hay movimiento | 45,5 KB gzip |

**Lectura:** de los 188,7 KB, unos **179 son el piso de Next 16 con React 19 y App Router** —
react-dom (69,9), el runtime de RSC y acciones de servidor (43,0) y un bloque de polyfills que
ambos empaquetadores incluyen sin `nomodule` (38,7). **Todo el código del sitio —F1, F2 y F3—
suma unos 10 KB.** El umbral de 120 KB de B.12 no es alcanzable sin cambiar la decisión de stack
de B.1, que es una decisión cerrada.

**Decisión:** no se persigue el número absoluto ni se maquilla la medición. En su lugar:

1. **Código propio ≤ 20 KB gzip** sobre el piso del framework. Es lo que sí se controla.
2. **Lo pesado sigue diferido:** GSAP solo si hay movimiento; Cal.com, al acercarse a VII (F4).
3. `tests/e2e/presupuesto.spec.ts` **hace fallar el pipeline** si el JS inicial pasa de 200 KB
   gzip o si algo diferido se cuela en el arranque. El presupuesto deja de ser una aspiración.
4. Las métricas de usuario de B.12 (LCP ≤ 2,0 s, CLS ≤ 0,05, INP ≤ 200 ms) y los umbrales de
   Lighthouse siguen intactos y son el criterio real de F6.

**Pista para F6:** el bloque de polyfills de 38,7 KB gzip se sirve a todos los navegadores, sin
`nomodule`, en Turbopack y en webpack por igual. Son 20 % del arranque. Merece una revisión
enfocada cuando se endurezca el rendimiento.

### Pruebas

| Suite | Resultado |
|---|---|
| `pnpm lint` · `pnpm typecheck` | Limpios |
| `pnpm test:unit` | **62 en verde** |
| `pnpm test:e2e` (1440 px y 390 px) | **84 en verde** |
| `pnpm test:a11y` | **7 en verde** |

Las pruebas nuevas cubren: patrón ARIA de las pestañas, operación solo con teclado con vuelta al
principio, que con movimiento reducido **no se descargue GSAP**, que los filetes se vean completos
sin movimiento, que la figura marque estados al avanzar el scroll, y el presupuesto de arriba.

### Verificación del criterio de salida

- [x] **Sin animaciones fuera del inventario:** las seis de B.6, cada una con su variante de
      movimiento reducido. Nada de pin, nada de smooth scroll, nada de texto partido.
- [x] **Presupuesto respetado**, con la definición corregida y una prueba que lo vigila.

---

## F4 — Integraciones

**Alcance (B.17):** WhatsApp, `AgendaCal` diferida, webhook → Firestore con TTL, adaptador
Evolution, `Sello`, `MedidorCarga` y los scripts de titulares.
**Criterio de salida:** reserva de prueba de principio a fin; aviso interno recibido.

> **Estado: construida y probada, no cerrada.** El criterio de salida exige una reserva real y un
> aviso real, y eso necesita la cuenta de Cal.com, el proyecto de Firebase y el número secundario
> con Evolution. Los tres son de Camilo y están en `TODO.md` (puntos 3, 4 y 6). Todo lo demás
> está hecho y cubierto por pruebas: cuando lleguen esas credenciales, solo hay que cargarlas.

### Trabajo realizado

**Webhook `POST /api/cal/webhook`** (runtime Node, por el HMAC)
- Cuerpo crudo con tope de 64 KB; la firma se calcula sobre el crudo, nunca sobre el JSON
  reserializado.
- HMAC-SHA256 comparado con `timingSafeEqual` contra `x-cal-signature-256`. Si no coincide: 401.
- Zod sobre el cuerpo. Si no valida: 400.
- **Idempotente por `payload.uid`**, que es el id del documento. Cal.com no firma marca de tiempo,
  así que un mensaje capturado podría reenviarse; la idempotencia lo neutraliza.
- Si Firestore falla, responde 500 **a propósito**, para que Cal.com reintente: perder una cita es
  peor que un reintento.
- El aviso interno sale sin `await`, con tope de 3 s, y no bloquea la respuesta.

**Prospectos en Firestore**
- `prospectos/{uid}` con el documento de B.10, incluido el registro de consentimiento (fecha,
  versión de la política y medio).
- `expiraEn` = último contacto + 24 meses. Es el campo sobre el que corre el TTL, que es lo que
  cumple la conservación sin trabajo manual.
- Cada cambio de estado agrega un registro en `prospectos/{uid}/eventos`. Solo se agregan.

**Mensajería**: interfaz `Mensajeria` con `evolution`, `cloud` y `ninguno`. Evolution **solo**
para avisos internos al fundador, desde un número secundario. Cloud API queda implementada e
inactiva. `ninguno` es el valor por defecto y solo registra: en desarrollo y en pruebas nadie
manda un WhatsApp de verdad.

**Interfaz**: `BotonWhatsApp` (solo `wa.me` con texto prellenado; el número comercial no toca
ninguna API), `AgendaCal` que no descarga nada de Cal.com hasta el clic o la proximidad, `Sello`
«Recibido» con hora real de Bogotá, y `MedidorCarga`, que mide de verdad con
`PerformanceNavigationTiming` y dice «servida desde caché» cuando `transferSize` es 0.

**Derechos de titulares**: `scripts/prospectos-exportar.ts` responde una consulta, y
`scripts/prospectos-suprimir.ts` borra y deja constancia **sin datos personales** (una huella del
correo, no el correo).

**Healthcheck** `GET /api/salud`: dice qué integraciones están configuradas, con `true` o `false`,
sin filtrar ningún valor. Sirve para el monitor de disponibilidad de `TODO.md`.

### Analítica (pedida por Camilo, fuera de B.1)

PostHog **sin cookies**: `persistence: 'memory'`, sin grabación de sesión, sin autocaptura y con
`respect_dnt`. No queda ningún identificador cuando se cierra la pestaña, así que el sitio sigue
sin necesitar banner de consentimiento y la política sigue siendo cierta cuando dice que la
analítica no usa cookies. Se carga en diferido y solo si hay clave configurada.

Se agregó PostHog a la tabla de encargados de la política (§10) y a su fuente en
`docs/politica-de-datos.md`, porque trata datos fuera de Colombia y eso hay que declararlo.
**Esto es un cambio en un documento legal: el abogado debe verlo en la misma revisión.**

Vercel Web Analytics y Speed Insights quedan también, como pide B.1. Ninguno usa cookies.

### Pruebas

| Suite | Resultado |
|---|---|
| `pnpm test:unit` | **88 en verde** (26 nuevas: firma del webhook, esquemas, fechas COT, TTL de 24 meses y adaptador de mensajería con `fetch` simulado) |
| `pnpm test:e2e` | **96 en verde** |
| `pnpm test:a11y` | **7 en verde** |

Las pruebas nuevas cubren lo que B.16 pide para esta fase: firma válida, inválida y **cuerpo
alterado con la firma original**; rechazo de firmas de largo distinto sin reventar; esquemas Zod;
cálculo de `expiraEn`, incluido el 29 de febrero; formateo en hora de Colombia cruzando el día; y
el adaptador de mensajería contra un `fetch` simulado, incluido el caso «sin configurar».

En e2e: el webhook nunca responde 200 a algo sin firmar, el healthcheck no filtra valores, el
enlace de WhatsApp tiene el formato correcto y **la página no descarga nada de Cal.com al abrir**.

### Presupuesto

192,1 KB gzip / 166,3 KB brotli de JavaScript inicial: **+3,4 KB** sobre F3, que es todo el
código de cliente de F4 más la analítica de Vercel. PostHog y Cal.com **no** están en el arranque.

### Lo que falta para cerrar F4

1. Cal.com configurado (`TODO.md`, punto 3) → reserva de prueba de principio a fin.
2. Firebase configurado (punto 4) → que esa reserva quede guardada, con su TTL.
3. Evolution con el número secundario (punto 6) → aviso interno recibido.
