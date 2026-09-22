import { DobleFilete } from './DobleFilete';

import type { ReactNode } from 'react';

/** Franja «Lo que siempre incluye» (Parte A §3), bajo la portada. */
export function Franja({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="franja" aria-labelledby="franja-titulo">
      <DobleFilete />
      <h2 id="franja-titulo" className="mt-6 font-serif text-[1.5rem] text-tinta">
        {titulo}
      </h2>
      <div className="franja-cuerpo">{children}</div>
    </section>
  );
}

/** Fila de llamados a la acción. */
export function Acciones({ children }: { children: ReactNode }) {
  return <div className="acciones">{children}</div>;
}
