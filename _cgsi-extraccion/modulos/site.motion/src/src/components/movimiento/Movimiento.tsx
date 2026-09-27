'use client';

import dynamic from 'next/dynamic';
import { useEffect, useSyncExternalStore } from 'react';

/**
 * Puerta de entrada del movimiento (B.6.7).
 *
 * GSAP no está en el JavaScript inicial: este componente pesa unas pocas líneas
 * y solo carga el módulo de animaciones cuando hay razón para hacerlo. Con
 * `prefers-reduced-motion: reduce` no se descarga nada, porque no hay nada
 * que animar: todo ya está en su estado final.
 */
const Animaciones = dynamic(() => import('./Animaciones').then((m) => m.Animaciones), {
  ssr: false,
});

const SIN_PREFERENCIA = '(prefers-reduced-motion: no-preference)';

function suscribir(alCambiar: () => void): () => void {
  const consulta = window.matchMedia(SIN_PREFERENCIA);
  consulta.addEventListener('change', alCambiar);

  return () => consulta.removeEventListener('change', alCambiar);
}

export function Movimiento() {
  const animar = useSyncExternalStore(
    suscribir,
    () => window.matchMedia(SIN_PREFERENCIA).matches,
    () => false,
  );

  useEffect(() => {
    // Sin movimiento, los filetes se ven completos: se quita la marca del script.
    if (!animar) {
      delete document.documentElement.dataset.movimiento;
      return;
    }

    // Red de seguridad: si el trozo de GSAP no llega, el filete de la portada no
    // se queda invisible para siempre. Cuando sí llega, ya fijó su estilo en línea
    // y quitar la marca no le hace nada.
    const espera = setTimeout(() => {
      delete document.documentElement.dataset.movimiento;
    }, 3000);

    return () => clearTimeout(espera);
  }, [animar]);

  if (!animar) return null;

  return <Animaciones />;
}
