import { getTranslations } from 'next-intl/server';
import { entornoPublico } from '@/lib/env';
import { AgendaCal } from './AgendaCal';

/**
 * Hueco de la agenda en la sección VII.
 *
 * Con `NEXT_PUBLIC_CAL_LINK` configurada, entra el embed de Cal.com, que no
 * descarga nada hasta el clic o la proximidad (B.10). Sin ella, se ve el
 * pendiente en vez de fingir una agenda que no existe: el enlace del evento es
 * un punto de `TODO.md`.
 */
export async function Agenda() {
  const enlace = entornoPublico().NEXT_PUBLIC_CAL_LINK;

  if (!enlace) {
    const t = await getTranslations('base');

    return (
      <div className="pendiente my-8" data-pendiente="agenda">
        {t('pendienteAgenda')}
      </div>
    );
  }

  return <AgendaCal enlace={enlace} />;
}
