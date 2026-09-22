import type { ReactNode } from 'react';

/**
 * «Aclaraciones frecuentes» (Parte A §3, VII).
 * En F5 este mismo bloque alimenta el JSON-LD `FAQPage` (B.9).
 */
export function Faq({ children }: { children: ReactNode }) {
  return <div className="faq">{children}</div>;
}
