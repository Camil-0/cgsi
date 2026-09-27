'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';

import type { ReactNode } from 'react';

type Props = {
  /** Número de la llamada, tal como aparece en la Parte A §3 */
  n: number;
  children: ReactNode;
};

/** `null` = todavía manda el CSS: abierta en escritorio, cerrada en móvil. */
type Estado = boolean | null;

function esEscritorio(): boolean {
  return window.matchMedia('(min-width: 1024px)').matches;
}

/**
 * Nota de fundamento (B.5 y Parte A §4.2).
 *
 * - Escritorio: va en las columnas 10–12, alineada con su llamada, abierta.
 * - Móvil: cerrada; se abre con un toque y el botón lleva `aria-expanded`.
 * - Sin JavaScript: `globals.css` la deja visible con un `<noscript>`, así que
 *   nunca queda contenido atrapado detrás de un botón muerto.
 *
 * El estado arranca en `null` para que el primer pintado lo resuelva el CSS según
 * el ancho: así no hay salto de layout ni `aria-expanded` que mienta antes de hidratar.
 *
 * Es un `<span role="note">` y no un `<aside>` porque la llamada va dentro de un
 * párrafo, y `<aside>` no es contenido en línea válido dentro de `<p>`.
 */
export function Nota({ n, children }: Props) {
  const [abierta, setAbierta] = useState<Estado>(null);
  const t = useTranslations('documento.nota');
  const idCuerpo = `nota-${useId()}`;

  function alternar() {
    setAbierta((valor) => (valor === null ? !esEscritorio() : !valor));
  }

  return (
    <span className="nota">
      <sup>
        <button
          type="button"
          className="nota-llamada"
          aria-expanded={abierta ?? undefined}
          aria-controls={idCuerpo}
          aria-label={t('llamada', { n })}
          onClick={alternar}
        >
          {n}
        </button>
      </sup>
      <span
        id={idCuerpo}
        role="note"
        className="nota-cuerpo"
        data-abierta={abierta === null ? 'auto' : abierta ? 'si' : 'no'}
      >
        <span aria-hidden="true" className="nota-numero">
          {n}
        </span>
        {children}
      </span>
    </span>
  );
}
