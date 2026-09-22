'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { fechaYHoraCot } from '@/lib/fechas';

/**
 * Sello «Recibido» (B.5 y Parte A §4.7). Aparece al confirmarse la cita, con
 * fecha y hora reales de Colombia.
 *
 * Animación 6 del inventario de B.6: `scale` 1.15→1, `rotate` −4°, `opacity` 0→1,
 * 0,3 s `back.out(2)`. GSAP se importa aquí en diferido, igual que en el resto
 * del sitio; con movimiento reducido el sello aparece sin animarse.
 */
export function Sello({ fecha }: { fecha: Date }) {
  const sello = useRef<HTMLParagraphElement>(null);
  const t = useTranslations('contacto');

  useEffect(() => {
    const nodo = sello.current;
    if (!nodo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let contexto: { revert: () => void } | undefined;

    void import('@/lib/gsap').then(({ gsap }) => {
      contexto = gsap.context(() => {
        gsap.from(nodo, {
          scale: 1.15,
          rotate: -4,
          opacity: 0,
          duration: 0.3,
          ease: 'back.out(2)',
        });
      });
    });

    return () => contexto?.revert();
  }, []);

  return (
    <p ref={sello} role="status" className="sello">
      {t('sello', { cuando: fechaYHoraCot(fecha) })}
    </p>
  );
}
