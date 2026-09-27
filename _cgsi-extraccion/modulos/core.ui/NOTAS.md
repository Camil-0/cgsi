# core.ui

Los **valores** son la marca de CGSI («Papel» y «Plano»). Lo que se reutiliza es el mecanismo.

## Candidato 10 · Tokens + `@theme` de Tailwind v4 · A · confianza alta
- `tokens.css`: 10 tokens semánticos por tema en `:root, [data-tema='papel']` y
  `[data-tema='plano']`, más un respaldo `@media (prefers-color-scheme: dark)` sobre
  `:root:not([data-tema='papel'])` para cuando no hay JS.
- `globals.css`: `@theme inline` mapea `--color-*` → `var(--token)`, así las clases de Tailwind
  (`text-tinta`, `bg-firma`) siguen el tema en vivo. Escala tipográfica con `clamp`, medida de
  `68ch`, foco visible y `prefers-reduced-motion`.
  **Al reutilizar:** quitar `@import './documento.css'` y `@import './print.css'` (clase C, no
  copiados).
- `fuentes.ts`: tres familias de `next/font/google` con variable CSS y fallbacks.
- **Deps:** `tailwindcss@4.3.3`, `@tailwindcss/postcss@4.3.3`.
- **Tests:** `tokens.test.ts` y `contraste.test.ts` (copiados en `infra.testing`).

## Candidato 11 · Tema sin parpadeo · A · confianza alta
- `ScriptTema`: script inline de bloqueo que lee `localStorage['cgsi-tema']` y fija `data-tema`
  antes del primer pintado.
- `AplicarTema`: lo repone en `useLayoutEffect`, porque React lo borra al hidratar el `<html>`
  estático. Es un workaround imprescindible con render estático.
- `InterruptorPapelPlano`: se suscribe al DOM (`MutationObserver` + `matchMedia`) con
  `useSyncExternalStore`, sin estado duplicado. **Persiste solo si la categoría «preferencias» está
  autorizada** (depende de `otro.privacidad`).
- **Tests:** `tests/e2e/tema.spec.ts`.
- **CSP:** el script inline exige `'unsafe-inline'` o un nonce/hash en `script-src`.

## Candidato 12 · Componentes accesibles · A · confianza media
- `Nota`: nota al margen con botón `aria-expanded`. Arranca en `null` para que el CSS resuelva el
  primer pintado (sin salto ni ARIA falso). `<span role="note">` porque va dentro de `<p>`.
- `Diff`: `<del>`/`<ins>` con signo visible; nunca depende solo del color.
- `PestanasExpediente`: patrón ARIA de tabs completo (flechas con vuelta, Inicio y Fin, roving
  tabindex) y View Transitions con dirección. Espejo en `ref` contra las carreras.
- `BotonImprimir`: `window.print()`.
- `MedidorCarga`: KB transferidos y tiempo real con `PerformanceNavigationTiming`; dice «caché» si
  `transferSize` es 0.
- **Por qué confianza media:** las clases (`nota-*`, `pestanas-*`, `medidor`, `boton-barra`) y el
  CSS de View Transitions viven en `documento.css`, que no se copió. Hay que reescribir los
  estilos.
- **Tests:** e2e `documento.spec.ts` y `movimiento.spec.ts` (el primero es clase C y no se
  copió).
