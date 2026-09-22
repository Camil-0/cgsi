import { getTranslations } from 'next-intl/server';

/**
 * Hueco de la agenda. El embed de Cal.com, diferido hasta el clic o la proximidad
 * a la sección VII, entra en F4 (B.10). Hasta entonces el hueco se ve y está
 * registrado en PROGRESS.md, en vez de fingir una agenda que no existe.
 */
export async function Agenda() {
  const t = await getTranslations('base');

  return (
    <div className="pendiente my-8" data-pendiente="agenda-f4">
      {t('pendienteAgenda')}
    </div>
  );
}
