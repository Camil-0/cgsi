# site.motion — GSAP diferido · A · confianza media

- `src/lib/gsap.ts`: registro **único** de ScrollTrigger, DrawSVGPlugin y `useGSAP`.
- `Movimiento.tsx`: puerta cliente de pocas líneas. Con `prefers-reduced-motion: reduce` no
  descarga GSAP. Si no, carga `Animaciones` por `next/dynamic`. Tiene una red de seguridad de 3 s
  que quita `data-movimiento` si el trozo no llega.
- `ScriptMovimiento.tsx`: marca `<html data-movimiento="si">` antes del primer pintado, para que
  lo que está sobre el pliegue arranque sin trazo y no parpadee.
- `Animaciones.tsx`: todo dentro de `useGSAP` + `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`.
  Solo `transform`, `opacity` y trazo SVG. Sin pin: figura `sticky` con `scrub`.
  `ScrollTrigger.refresh()` después de `document.fonts.ready`.
  **Los selectores son de este sitio** (`[data-filete]`, `.nota-cuerpo`, `[data-figura-recorrido]`,
  `.figura-estado`): se reutiliza el patrón, no el inventario.
- `DobleFilete.tsx`: SVG de servidor que GSAP anima desde fuera, sin sumar JS de cliente.
- **Deps:** `gsap@3.15.0`, `@gsap/react@2.1.2`.
- **Tests:** `tests/e2e/movimiento.spec.ts` (pestañas, carga diferida, movimiento reducido).
- **CSS faltante:** la regla que oculta el trazo con `[data-movimiento]` está en `documento.css`
  (no copiado).
