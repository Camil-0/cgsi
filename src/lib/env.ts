import { z } from 'zod';

/**
 * Variables de entorno (B.15) validadas con Zod (B.11).
 *
 * - Solo las `NEXT_PUBLIC_*` llegan al cliente.
 * - La validación es perezosa y memorizada: la primera lectura durante el build o
 *   en tiempo de ejecución falla si falta una variable, sin romper las pruebas
 *   unitarias por el solo hecho de importar el módulo.
 * - Las variables que todavía no consume ningún código van como opcionales y se
 *   vuelven obligatorias en la fase que las usa (ver PROGRESS.md).
 */

type Fuente = Record<string, string | undefined>;

const soloDigitos = /^\d{8,15}$/;

const esquemaPublico = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_APP_VERSION: z.string().min(1),
  NEXT_PUBLIC_BUILD_DATE: z.string().min(1),
  /** Formato wa.me: solo dígitos, sin «+» ni espacios (B.5). Obligatoria desde F4. */
  NEXT_PUBLIC_WHATSAPP_NUMERO: z.string().regex(soloDigitos).optional(),
  /** p. ej. `cgsi/diagnostico`. Obligatoria desde F4. */
  NEXT_PUBLIC_CAL_LINK: z.string().min(1).optional(),
  /** Clave de proyecto de PostHog (`phc_…`). Sin ella, la analítica no se carga. */
  NEXT_PUBLIC_POSTHOG_KEY: z.string().startsWith('phc_').optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.url().optional(),
});

const proveedoresMensajeria = ['evolution', 'cloud', 'ninguno'] as const;

const credencialesEvolution = [
  'EVOLUTION_API_URL',
  'EVOLUTION_API_KEY',
  'EVOLUTION_INSTANCIA',
  'NOTIFICACIONES_DESTINO',
] as const;

const esquemaServidor = z
  .object({
    /** Firma del webhook de Cal.com. Obligatoria desde F4. */
    CAL_WEBHOOK_SECRET: z.string().min(1).optional(),
    FIREBASE_PROJECT_ID: z.string().min(1).optional(),
    FIREBASE_CLIENT_EMAIL: z.email().optional(),
    FIREBASE_PRIVATE_KEY: z.string().min(1).optional(),
    MENSAJERIA_PROVEEDOR: z.enum(proveedoresMensajeria).default('ninguno'),
    EVOLUTION_API_URL: z.url().optional(),
    EVOLUTION_API_KEY: z.string().min(1).optional(),
    EVOLUTION_INSTANCIA: z.string().min(1).optional(),
    NOTIFICACIONES_DESTINO: z.string().regex(soloDigitos).optional(),
    POLITICA_VERSION: z.string().min(1).default('1.0'),
    GOOGLE_SITE_VERIFICATION: z.string().min(1).optional(),
    BING_SITE_VERIFICATION: z.string().min(1).optional(),
  })
  .superRefine((valor, ctx) => {
    if (valor.MENSAJERIA_PROVEEDOR !== 'evolution') return;

    for (const clave of credencialesEvolution) {
      if (valor[clave]) continue;
      ctx.addIssue({
        code: 'custom',
        path: [clave],
        message: `${clave} es obligatoria cuando MENSAJERIA_PROVEEDOR es «evolution»`,
      });
    }
  });

export type EntornoPublico = z.infer<typeof esquemaPublico>;
export type EntornoServidor = z.infer<typeof esquemaServidor>;

function fallar(ambito: string, error: z.ZodError): never {
  const detalle = error.issues
    .map((problema) => `${problema.path.join('.') || '(raíz)'}: ${problema.message}`)
    .join(' · ');

  throw new Error(`Entorno ${ambito} inválido — ${detalle}`);
}

export function parsearEntornoPublico(fuente: Fuente): EntornoPublico {
  const resultado = esquemaPublico.safeParse(fuente);
  return resultado.success ? resultado.data : fallar('público', resultado.error);
}

export function parsearEntornoServidor(fuente: Fuente): EntornoServidor {
  const resultado = esquemaServidor.safeParse(fuente);
  return resultado.success ? resultado.data : fallar('del servidor', resultado.error);
}

function memorizar<T>(leer: () => T): () => T {
  let valor: T | undefined;
  return () => (valor ??= leer());
}

/** Entorno público. Disponible en el cliente porque Next inserta los `NEXT_PUBLIC_*`. */
export const entornoPublico = memorizar(() =>
  parsearEntornoPublico({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_BUILD_DATE: process.env.NEXT_PUBLIC_BUILD_DATE,
    NEXT_PUBLIC_WHATSAPP_NUMERO: process.env.NEXT_PUBLIC_WHATSAPP_NUMERO,
    NEXT_PUBLIC_CAL_LINK: process.env.NEXT_PUBLIC_CAL_LINK,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  }),
);

/** Entorno del servidor. Nunca se importa desde un componente de cliente. */
export const entornoServidor = memorizar(() => parsearEntornoServidor(process.env));
