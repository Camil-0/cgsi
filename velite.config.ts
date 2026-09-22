import { defineCollection, defineConfig, s } from 'velite';

/**
 * Capa de contenido (B.8). El copy largo vive en MDX; los textos cortos de
 * interfaz, en `messages/es.json`. Publicar es hacer commit y desplegar.
 *
 * Los archivos se escriben en F2 (documento, expedientes, legal) y F5 (memorandos).
 */

/**
 * Secciones del documento (portada, franja, I–VII, pie).
 * La Parte B no fija este esquema: se define aquí y queda registrado en PROGRESS.md.
 */
const documento = defineCollection({
  name: 'SeccionDocumento',
  pattern: 'es/documento/**/*.mdx',
  schema: s.object({
    orden: s.number().int(),
    tipo: s.enum(['portada', 'seccion', 'pie']),
    /** Numeral romano I–VII. Vacío en la portada y en el pie. */
    numeral: s.string(),
    titulo: s.string(),
    slug: s.slug('documento'),
    cuerpo: s.mdx(),
  }),
});

const expedientes = defineCollection({
  name: 'Expediente',
  pattern: 'es/expedientes/**/*.mdx',
  schema: s
    .object({
      numero: s.number().int(),
      slug: s.slug('expedientes'),
      titulo: s.string(),
      etiqueta: s.string(),
      stack: s.array(s.string()),
      confidencial: s.boolean(),
      /** Referencia del documento firmado, p. ej. CSI-2026-ESSENZA-002 */
      autorizacion: s.string().optional(),
      cuerpo: s.mdx(),
    })
    .refine((expediente) => expediente.confidencial || Boolean(expediente.autorizacion), {
      message:
        'Un expediente no confidencial necesita `autorizacion` (referencia del documento firmado). B.8',
      path: ['autorizacion'],
    }),
});

const memorandos = defineCollection({
  name: 'Memorando',
  pattern: 'es/memorandos/**/*.mdx',
  schema: s.object({
    numero: s.number().int(),
    slug: s.slug('memorandos'),
    titulo: s.string().max(90),
    asunto: s.string().max(120),
    para: s.string(),
    fecha: s.isodate(),
    resumen: s.string().max(160),
    etiquetas: s.array(s.string()),
    estado: s.enum(['borrador', 'publicado']),
    cuerpo: s.mdx(),
  }),
});

const legal = defineCollection({
  name: 'Legal',
  pattern: 'es/legal/**/*.mdx',
  schema: s.object({
    titulo: s.string(),
    slug: s.slug('legal'),
    version: s.string(),
    /** Sin fecha de vigencia el build falla (B.8) */
    vigenteDesde: s.isodate(),
    cuerpo: s.mdx(),
  }),
});

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    clean: true,
  },
  collections: { documento, expedientes, memorandos, legal },
  strict: true,
});
