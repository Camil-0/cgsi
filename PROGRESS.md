# PROGRESS — CGSI

Bitácora por fase del sitio `Ref. CSI-2026-WEB-001`. Especificación: `docs/brief.md`.
Reglas de trabajo: `CLAUDE.md`.

**Regla:** al cerrar cada fase → pruebas en verde, esta bitácora actualizada y commit.
Ningún despliegue a producción sin revisión humana explícita.

---

## Estado de las fases

| Fase | Estado | Cierre |
|---|---|---|
| F0 Base | 🟢 Cerrada, **pendiente de revisión humana** | 21.09.2026 |
| F1 Sistema documento | ⬜ Sin empezar | — |
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

## Dependencias fuera de B.1

| Dependencia | Tipo | Razón |
|---|---|---|
| `pnpm.overrides.sharp: ^0.35.4` | Override, no dependencia nueva | Velite 0.4.0 pide `sharp ^0.34.5`, que arrastra dos vulnerabilidades altas heredadas de libvips y libheif (GHSA-rgj7-g3m4-5g8c y CVE-2026-33327/33328/35590/35591). Con el override, `pnpm audit --audit-level high` queda limpio y Velite sigue compilando. Se retira cuando Velite suba su rango. |

## Marcadores `{PENDIENTE}` abiertos

| Marcador | Dónde | Quién lo resuelve | Bloquea |
|---|---|---|---|
| `{PENDIENTE: documento I–VII}` | `messages/es.json` → `base.pendienteDocumento`, visible en la página base | El agente, en F2 | Nada. Desaparece al entrar el copy de la Parte A §3. |
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
| **Presupuesto de JS.** B.12 fija ≤ 120 KB comprimidos de JS inicial en la página principal. La base de Next 16 + React 19, con la página vacía, ya va en **178,9 KB gzip / 154,3 KB brotli** (7 scripts, 586,1 KB sin comprimir). Quitar `NextIntlClientProvider` del layout solo baja 9,9 KB: el peso es del framework, no del contenido. | Medido el 21.09.2026 sobre el build de producción, sumando los `<script src>` de `/`. | **F3**, cuyo criterio de salida es el presupuesto. Caminos a evaluar allí: dar traducciones a los componentes de cliente por props en vez de proveedor, revisar el build de Turbopack contra el de webpack, y confirmar con qué compresión se mide el umbral. Si el piso del framework no baja de 120 KB, hay que renegociar el número con el fundador, no maquillar la medición. |
| **Contraste del modo Plano.** `--papel-2` (#13253A) y `--carbon` (#C9CED6) son derivados nuevos que el brief marca como «pendiente de verificar» (B.3). | axe ya corre en Papel y en Plano sobre la página base, sin violaciones, pero todavía no hay texto real sobre esas superficies. | **F1**, con los componentes del documento ya puestos. |

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

### Pendiente de revisión humana antes de F1

1. Las tres decisiones y las nueve desviaciones de arriba.
2. El riesgo del presupuesto de JS: hay que decidir en F3 si se ataca o se renegocia el umbral.
3. El override de `sharp`.
4. Conectar el repositorio a un remoto para que CI corra de verdad.
