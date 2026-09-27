# site.blog — Memorandos · B · confianza media

- **Qué hace:** listado `/memorandos`, detalle `/memorandos/[slug]` con `BlogPosting` +
  `BreadcrumbList`, `sitemap.ts` y `rss.xml`. **Solo lo publicado**: un borrador se comporta como
  una ruta inexistente.
- **Archivos:** `src/app/sitemap.ts`, `src/app/rss.xml/route.ts`,
  `src/app/[locale]/memorandos/page.tsx`, `src/app/[locale]/memorandos/[slug]/page.tsx`.
- **Deps:** `velite@0.4.0` (vía `#contenido`), `next-intl@4.14.6`. Usa componentes de `core.ui`,
  `site.seo`, `comms.whatsapp` y algunos de clase C (`Cta`, `Acciones`).
- **Tests:** `tests/e2e/seo.spec.ts` («memorandos», «descubrimiento»), en `site.seo`. **La
  colección está vacía**: solo se probó el estado sin memorandos.
- **Traducción a Payload:** colección `memorandos` con `versions: { drafts: true }`. Campos:
  `numero`, `slug` (unique), `titulo` (maxLength 90), `asunto` (120), `para`, `fecha`, `resumen`
  (160), `etiquetas` (array o relación a `etiquetas`), `cuerpo` (richText Lexical).
  `memorandos.filter(estado==='publicado')` pasa a `payload.find({ collection: 'memorandos', where: { _status: { equals: 'published' } } })`.
  `generateStaticParams` sigue igual; conviene revalidar con `revalidatePath` en un hook
  `afterChange`.
- **Corregir:** `authors: ['Camilo Charris C.']` está escrito a mano en el componente.
