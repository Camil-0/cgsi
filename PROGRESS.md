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
| F2 Contenido | ⬜ Sin empezar | — |
| F3 Movimiento | ⬜ Sin empezar | — |
| F4 Integraciones | ⬜ Sin empezar | — |
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

## Dependencias fuera de B.1

| Dependencia | Tipo | Razón |
|---|---|---|
| `pnpm.overrides.sharp: ^0.35.4` | Override, no dependencia nueva | Velite 0.4.0 pide `sharp ^0.34.5`, que arrastra dos vulnerabilidades altas heredadas de libvips y libheif (GHSA-rgj7-g3m4-5g8c y CVE-2026-33327/33328/35590/35591). Con el override, `pnpm audit --audit-level high` queda limpio y Velite sigue compilando. Se retira cuando Velite suba su rango. |

## Marcadores `{PENDIENTE}` abiertos

| Marcador | Dónde | Quién lo resuelve | Bloquea |
|---|---|---|---|
| `{PENDIENTE: portada y franja}` y `{PENDIENTE: copy de la sección N}` | `messages/es.json` → `base.*`, visibles en el documento | El agente, en F2 | Nada. Desaparecen al entrar el copy de la Parte A §3. |
| `{PENDIENTE: dominio}` | `NEXT_PUBLIC_SITE_URL`, canónicas, JSON-LD, pie | Camilo | Lanzamiento (Parte A §11). Mientras tanto: `http://localhost:3000` en desarrollo y `http://127.0.0.1:3100` en CI. |
| `{PENDIENTE: correo del dominio}` | Pie, política de datos, JSON-LD | Camilo | Lanzamiento. El sitio no sale con `@gmail`. |
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
| **Presupuesto de JS.** B.12 fija ≤ 120 KB comprimidos de JS inicial en la página principal. La base de Next 16 + React 19, con la página vacía, ya va en **178,9 KB gzip / 154,3 KB brotli** (7 scripts, 586,1 KB sin comprimir). Quitar `NextIntlClientProvider` del layout solo baja 9,9 KB: el peso es del framework, no del contenido. Con F1 cerrada va en **182,2 KB gzip / 157,1 KB brotli**: los cuatro componentes de cliente sumaron 3,3 KB. | Medido el 21 y el 22.09.2026 sobre el build de producción, sumando los `<script src>` de `/`. | **F3**, cuyo criterio de salida es el presupuesto. Camilo decidió el 22.09.2026 esperar a F3 y evaluar allí la carga diferida. Caminos a evaluar allí: dar traducciones a los componentes de cliente por props en vez de proveedor, revisar el build de Turbopack contra el de webpack, y confirmar con qué compresión se mide el umbral. Si el piso del framework no baja de 120 KB, hay que renegociar el número con el fundador, no maquillar la medición. |
| ~~Contraste del modo Plano~~ | **Resuelto en F1.** Ver la tabla de medición más abajo: los diez tokens pasan AA en las dos superficies. | — |

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
