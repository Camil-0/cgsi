'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sello } from '@/components/documento/Sello';

/**
 * Agenda de Cal.com (B.5 y B.10).
 *
 * No descarga nada de Cal.com hasta que el lector hace clic o se acerca a la
 * sección VII: el embed no puede penalizar la carga inicial. El tema sigue al
 * del sitio y el color de marca es `--firma`.
 */
const Embebido = dynamic(() => import('./EmbebidoCal').then((m) => m.EmbebidoCal), { ssr: false });

type Props = {
  /** Enlace del evento, p. ej. `cgsi/diagnostico` */
  enlace: string;
};

export function AgendaCal({ enlace }: Props) {
  const [cargar, setCargar] = useState(false);
  const [reservado, setReservado] = useState<Date | null>(null);
  const marco = useRef<HTMLDivElement>(null);
  const t = useTranslations('contacto');

  useEffect(() => {
    if (cargar || !marco.current) return;

    // Proximidad: se precarga cuando la sección VII está por entrar en pantalla.
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          setCargar(true);
          observador.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    observador.observe(marco.current);

    return () => observador.disconnect();
  }, [cargar]);

  return (
    <div ref={marco} className="agenda" data-agenda>
      {reservado ? <Sello fecha={reservado} /> : null}

      {cargar ? (
        <Embebido enlace={enlace} alReservar={() => setReservado(new Date())} />
      ) : (
        <button type="button" className="cta cta-primario" onClick={() => setCargar(true)}>
          {t('cargarAgenda')}
        </button>
      )}
    </div>
  );
}
