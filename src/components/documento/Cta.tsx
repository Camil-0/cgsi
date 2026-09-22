import type { ReactNode } from 'react';

type Props = {
  href: string;
  tipo?: 'primario' | 'secundario';
  /** Microcopy bajo el botón, p. ej. «30 minutos · sin costo» */
  microcopy?: string;
  children: ReactNode;
};

/**
 * Llamado a la acción. `--firma` es el único color de acción del sitio (Parte A §2.1)
 * y no se usa para decorar: aquí sí, porque esto es la acción.
 */
export function Cta({ href, tipo = 'primario', microcopy, children }: Props) {
  return (
    <span className="cta-envoltura">
      <a href={href} className={`cta cta-${tipo}`}>
        {children}
      </a>
      {microcopy ? <span className="cta-microcopy">{microcopy}</span> : null}
    </span>
  );
}
