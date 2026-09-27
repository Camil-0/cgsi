# infra.testing · A · confianza alta

- `vitest.config.ts`: alias `@`, `#contenido` y `server-only` → módulo vacío
  (`tests/utiles/server-only-vacio.ts`), para poder probar módulos de servidor.
- `playwright.config.ts`: proyectos `e2e` (1440), `e2e-movil` (390) y `a11y`; locale `es-CO` y zona
  `America/Bogota`; `webServer` que reutiliza el build en CI.
- `tests/utiles/playwright.ts`: `test` extendido del proyecto.
- `tests/unit/tokens.test.ts`: los dos temas declaran el mismo juego de tokens, y **ningún archivo
  de `src/` tiene hex** salvo una lista explícita de excepciones.
- `tests/unit/contraste.test.ts`: calcula el contraste WCAG sobre los hex reales de `tokens.css`,
  calibrado contra las cifras del brief, en las dos superficies y los dos temas.
- `tests/e2e/presupuesto.spec.ts`: suma el gzip de los `<script src>` iniciales (techo de 200 KB)
  y verifica que `gsap`, `cal.com` y `embed` no están en el arranque.
- `tests/a11y/portada.spec.ts`: axe (WCAG 2.2 AA) en tres rutas × dos temas, con el diálogo de
  cookies abierto.
- `eslint.config.mjs`: flat config de `eslint-config-next` (core-web-vitals + typescript).
- **Al portar:** las rutas, las clases (`.aviso-cookies`) y los tokens son de este sitio; el
  patrón de cada prueba es genérico.
