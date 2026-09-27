'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * «Esta página pesó X KB y cargó en Y s en tu conexión» (Parte A §3, pie).
 *
 * Es un dato real, medido en el navegador de quien lee, con
 * `PerformanceNavigationTiming`. Si `transferSize` es 0, la página vino de la
 * caché y se dice así en vez de inventar un número (Parte A §4.6).
 */
type Medida = { kb: string; segundos: string } | 'cache' | null;

function medir(): Medida {
  const [navegacion] = performance.getEntriesByType(
    'navigation',
  ) as PerformanceNavigationTiming[];

  if (!navegacion) return null;

  const recursos = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const bytes =
    navegacion.transferSize + recursos.reduce((suma, recurso) => suma + recurso.transferSize, 0);

  if (navegacion.transferSize === 0) return 'cache';

  return {
    kb: Math.round(bytes / 1024).toString(),
    segundos: (navegacion.duration / 1000).toFixed(1).replace('.', ','),
  };
}

export function MedidorCarga() {
  const [medida, setMedida] = useState<Medida>(null);
  const t = useTranslations('pie');

  useEffect(() => {
    // Después de `load`: antes, `duration` todavía es 0.
    const alCargar = () => setMedida(medir());

    if (document.readyState === 'complete') {
      const espera = setTimeout(alCargar, 0);
      return () => clearTimeout(espera);
    }

    window.addEventListener('load', alCargar, { once: true });

    return () => window.removeEventListener('load', alCargar);
  }, []);

  if (!medida) return null;

  return (
    <span className="medidor">
      {medida === 'cache' ? t('desdeCache') : t('medida', { kb: medida.kb, segundos: medida.segundos })}
    </span>
  );
}
