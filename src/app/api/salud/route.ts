import { entornoPublico } from '@/lib/env';
import { hayFirestore } from '@/lib/firebase-admin';

/**
 * Healthcheck (B.2). Dice si el sitio está en pie y qué integraciones tiene
 * configuradas, sin filtrar ningún valor: solo `true` o `false`.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(): Response {
  const publico = entornoPublico();

  return Response.json(
    {
      estado: 'ok',
      revision: publico.NEXT_PUBLIC_APP_VERSION,
      build: publico.NEXT_PUBLIC_BUILD_DATE,
      integraciones: {
        firestore: hayFirestore(),
        agenda: Boolean(publico.NEXT_PUBLIC_CAL_LINK),
        whatsapp: Boolean(publico.NEXT_PUBLIC_WHATSAPP_NUMERO),
        analitica: Boolean(publico.NEXT_PUBLIC_POSTHOG_KEY),
      },
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}
