import type { ReactNode } from 'react';

/**
 * Anotación al margen sin numerar, en mono (Parte A §3, franja «Lo que siempre incluye»).
 * A diferencia de `Nota`, no lleva llamada ni se abre con un botón: es un dato,
 * no un fundamento.
 */
export function AlMargen({ children }: { children: ReactNode }) {
  return <span className="al-margen">{children}</span>;
}
