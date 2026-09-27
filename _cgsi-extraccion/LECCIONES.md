# LECCIONES — cgsi-web

Sale del código, de `PROGRESS.md` y de `TODO.md`. Lo que es opinión del agente está marcado.

## Lo que más costó (según `PROGRESS.md`)

1. **Presupuesto de JS.** B.12 pedía ≤ 120 KB gzip. Se midió que Next 16 + React 19 + App Router
   ya pesa **~179 KB con la página vacía**, y no baja cambiando de empaquetador ni de
   `browserslist`. Se redefinió como «código propio ≤ 20 KB sobre el piso» y se vigila con
   `tests/e2e/presupuesto.spec.ts` (techo de 200 KB). **Para el kit:** no prometer 120 KB con este
   stack. Payload en el mismo proyecto no suma al cliente público si el admin queda en su propia
   ruta, pero hay que medirlo.
2. **Tema sin parpadeo.** Un script de bloqueo escribe `data-tema` antes del primer pintado, y
   **React lo borraba al hidratar** porque el `<html>` estático no lo traía.
   `suppressHydrationWarning` no lo evita. Lo resuelve `AplicarTema` con un `useLayoutEffect`
   (`src/components/tema/AplicarTema.tsx`). Es el mismo patrón que se repitió para el movimiento
   (`ScriptMovimiento.tsx`).
3. **El observador del cajetín se observaba a sí mismo.** Escribía `data-seccion` en `<html>` y
   observaba `[data-seccion]` (`Cajetin.tsx`, comentario de la línea 54).
4. **Desborde de 1 px a 390 px** por `1fr` (mínimo = `min-content`). Se arregló con
   `minmax(0, 1fr)`.
5. **Carrera en pestañas con View Transitions:** dos teclas llegaban antes del re-render. Se
   arregló con un espejo en `ref` (`PestanasExpediente.tsx`).
6. **Vulnerabilidades heredadas:** overrides de `sharp` (por Velite) y de `uuid` (por
   `firebase-admin` → `@google-cloud/storage`).

## Workarounds visibles

- `FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')` (`src/lib/firebase-admin.ts`).
- Dos nombres de evento del embed de Cal.com (`EmbebidoCal.tsx`).
- «Sonda» del DOM para pasar los tokens al iframe de Cal.com (`EmbebidoCal.tsx`, `tokenEnTema`).
- `new Function(cuerpo)` para renderizar el MDX de Velite (`Mdx.tsx`).
- El TTF de Google Fonts se pide con `user-agent` antiguo para que satori lo lea (`src/lib/og.ts`).
- Ruta comodín `[...resto]` para que el 404 salga localizado detrás de `proxy.ts`.
- El `DobleFilete` sigue de servidor y GSAP lo anima desde fuera, para no sumar JS inicial.

## Deuda técnica concreta

| # | Qué | Dónde | Por qué importa |
|---|---|---|---|
| 1 | Las e2e del webhook aceptan `503` como resultado válido | `tests/e2e/integraciones.spec.ts` | En CI, sin secreto, **nunca se prueba el camino feliz**. Una reserva real nunca ha recorrido el flujo completo |
| 2 | `guardarProspecto` y `prospectoDesdeWebhook` no tienen tests | `src/lib/prospectos.ts` | Es la escritura del único dato de negocio del sitio |
| 3 | Sin Firestore configurado, el webhook responde 200 y **descarta la cita** con un `warn` | `route.ts:51-61` | Pérdida silenciosa. Debería ser 503 para que Cal.com reintente |
| 4 | `JSON.parse` sin proteger después de verificar la firma | `route.ts:41` | Un cuerpo firmado inválido da 500 y reintentos inútiles |
| 5 | `void avisar()` después de responder | `route.ts:79` | En serverless la función se puede congelar. Next 16 tiene `after()` para esto |
| 6 | `BOOKING_RESCHEDULED` regresa el estado a `'nuevo'` | `prospectos.ts:105` | Borra el avance manual (si algún día hay panel) |
| 7 | Posible uid nuevo al reagendar (`NO VERIFICADO`) | `prospectos.ts` | Crearía prospectos sin nombre, correo ni consentimiento |
| 8 | Dos fuentes de «versión de política»: `POLITICA_VERSION` (env) y `versionPolitica()` (MDX) | `prospectos.ts:76` vs `politica.ts` | El consentimiento del prospecto puede quedar con una versión distinta a la publicada |
| 9 | `consentimiento.aceptado: true` fijo, sin leer la casilla del payload | `prospectos.ts:75` | Se asume en vez de registrarse. Débil como prueba ante la SIC |
| 10 | La subcolección `eventos` no tiene TTL; el TTL del padre no la borra | `DOMINIO.md` §1.2 | Datos personales (fechas de eventos ligadas a un uid) que sobreviven a la conservación prometida |
| 11 | Cloud API lee `WHATSAPP_*` directo de `process.env`, sin pasar por `env.ts` | `cloud-api.ts:16-17` | Rompe la regla de validación central |
| 12 | `setTimeout` del tope de `avisar` sin limpiar | `mensajeria/index.ts` | Menor: un temporizador colgado por aviso |
| 13 | Los scripts dicen `pnpm exec tsx`, pero `tsx` no está en `package.json` | `scripts/prospectos-*.ts` | No corren tal cual |
| 14 | Búsqueda por correo exacto, sin normalizar | scripts | `Ana@x.com` ≠ `ana@x.com`. La huella sí normaliza: es incoherente |
| 15 | Documentación desfasada: `.env.example` («PostHog sin cookies»), la sección de dependencias de `PROGRESS.md` (`persistence: 'memory'`), `TODO.md` §1 («no tiene remoto»), `LienzoOg.tsx` (cita `og.test.ts`, que no existe) | varios | Un agente que lea esto va a tomar decisiones con datos viejos |
| 16 | Texto escrito a mano en un componente: `authors: ['Camilo Charris C.']` | `memorandos/[slug]/page.tsx` | Rompe la regla del propio `CLAUDE.md` |
| 17 | No hay `firestore.rules` versionado; las reglas solo están en `TODO.md` | — | Nadie puede auditarlas desde el repo |
| 18 | Faltan CSP y encabezados de seguridad (F6) | `next.config.ts` | Planeado, no hecho |
| 19 | Lighthouse CI instalado (`@lhci/cli`) pero no conectado | `ci.yml` | Una dependencia sin uso |
| 20 | Polyfills de 38,7 KB gzip servidos a todos los navegadores | `PROGRESS.md`, riesgos | El 20 % del arranque |
| 21 | CI dispara en `push` a `main`, pero la rama por defecto es `master` | `ci.yml` | Los pushes directos a `master` no corren CI; solo los PR |

## Qué no repetiría (opinión del agente, basada en lo de arriba)

1. **Construir integraciones enteras contra simulaciones sin un entorno de preview con
   credenciales.** F4 quedó «construida y probada», pero su criterio de salida real (una reserva de
   principio a fin) sigue sin cumplirse. Por eso los defectos 1–7 no los ha visto nadie. En el kit,
   `booking.scheduling` debería traer una prueba de integración contra un Cal.com de sandbox y una
   base efímera.
2. **Poner el TTL en la base cuando hay subcolecciones.** En Postgres, `ON DELETE CASCADE` + cron
   lo resuelve de una vez.
3. **Aceptar códigos alternativos en los asserts** (`[401, 503]`). Es una prueba que pasa en los
   dos mundos y no protege ninguno.
4. **Mantener la documentación para agentes a mano en tres archivos sin una prueba que la vigile.**
   Ya hay cuatro afirmaciones desfasadas en ocho commits. `CLAUDE.md` como contrato sirve; la
   bitácora de `PROGRESS.md` crece sin control.

## Qué sí repetiría

- `env.ts` perezoso con vacío = ausente y respaldo de URL de Vercel.
- Tests que vigilan reglas de diseño: prohibir hex fuera de los tokens y medir el contraste sobre
  los tokens reales.
- Presupuesto de JS como prueba que hace fallar el build, con la lista de lo que debe ir diferido.
- Idempotencia por id externo (`uid` de Cal.com), en vez de deduplicar después.
- Adaptador de mensajería con proveedor nulo por defecto: ningún entorno que no sea producción
  manda un WhatsApp real.
- Consentimiento versionado por política, con expiración, y pruebas e2e que comprueban que cada
  categoría de verdad bloquea.
