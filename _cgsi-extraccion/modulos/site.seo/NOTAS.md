# site.seo · A · confianza alta

- `src/lib/seo.ts`: `urlAbsoluta`, `alternativas(ruta)` (canónica + hreflang; Next **reemplaza**
  `alternates` completo por página, así que cada página lo tiene que declarar), y constructores
  JSON-LD `organizacion`, `sitioWeb`, `entradaDeBlog`, `migas` y `preguntasFrecuentes`. Regla: no
  publicar la dirección de calle en el marcado.
- `src/lib/extraer.ts`: primer párrafo y FAQ sacados del MDX crudo, para que la descripción y el
  `FAQPage` no dupliquen el copy. `recortar` a 160 caracteres. Con Payload/Lexical, se reescribe
  sobre el JSON de Lexical.
- `src/lib/og.ts` + `LienzoOg.tsx` + `opengraph-image.tsx`: imagen OG estática con `next/og`. Baja
  el TTF de Google en el build y, si falla, sigue con la fuente por defecto. `PAPEL_OG` repite los
  hex de los tokens (satori no lee variables CSS) y `seo.test.ts` vigila que no diverjan.
- `src/components/seo/JsonLd.tsx`, `src/app/robots.ts` (bloquea `/api/`).
- **Env:** `NEXT_PUBLIC_SITE_URL`, `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` (estas dos
  las usa `layout.tsx`, clase C).
- **Tests:** `tests/unit/seo.test.ts`, `tests/e2e/seo.spec.ts`.
- **Al portar:** `ORGANIZACION` tiene los datos de CGSI escritos en el código (NIT, correo,
  teléfono, fundador): en el kit debería ser un global `organizacion` de Payload. El comentario de
  `LienzoOg.tsx` cita `og.test.ts`, que no existe.
