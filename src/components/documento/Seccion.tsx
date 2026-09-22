import { DobleFilete } from './DobleFilete';

import type { ReactNode } from 'react';

type Props = {
  numeral: string;
  ancla: string;
  titulo: string;
  children: ReactNode;
};

/**
 * Sección del documento (B.5): numeral romano, título, doble filete y `data-seccion`,
 * que es lo que observa el `Cajetin` para saber en qué página va el lector.
 *
 * La retícula de 12 columnas (Parte A §2.3) se arma dentro: el texto ocupa las
 * columnas 3–9 del documento y las notas al margen, las 10–12.
 */
export function Seccion({ numeral, ancla, titulo, children }: Props) {
  return (
    <section
      id={ancla}
      data-seccion={numeral}
      data-ancla={ancla}
      aria-labelledby={`${ancla}-titulo`}
      className="scroll-mt-24 py-16 lg:py-24"
    >
      <header className="lg:grid lg:grid-cols-10 lg:gap-x-6">
        <h2
          id={`${ancla}-titulo`}
          className="font-serif text-seccion text-tinta lg:col-span-7 lg:col-start-1"
        >
          {/* El numeral romano es titular, no metadato (Parte A §2.2) */}
          <span className="mr-4 text-carbon">{numeral}</span>
          {titulo}
        </h2>
        <DobleFilete className="mt-4 lg:col-span-10 lg:col-start-1" />
      </header>

      <div className="mt-8 lg:grid lg:grid-cols-10 lg:gap-x-6">
        <div className="max-w-medida lg:col-span-7 lg:col-start-1">{children}</div>
      </div>
    </section>
  );
}
