import * as runtime from 'react/jsx-runtime';
import { Agenda } from '@/components/contacto/Agenda';
import { AvisoPrivacidad } from '@/components/contacto/AvisoPrivacidad';
import { BotonWhatsApp } from '@/components/contacto/BotonWhatsApp';
import { BotonConfigurarCookies } from '@/components/consentimiento/BotonConfigurarCookies';
import { MedidorCarga } from '@/components/pie/MedidorCarga';
import { Expedientes } from '@/components/expedientes/Expedientes';
import { Link } from '@/i18n/navigation';
import { AlMargen } from './AlMargen';
import { Cta } from './Cta';
import { Destinatario } from './Destinatario';
import { Diff } from './Diff';
import { Faq } from './Faq';
import { FiguraRecorrido } from './FiguraRecorrido';
import { Firma } from './Firma';
import { Acciones, Franja } from './Franja';
import { Nota } from './Nota';

import type { ComponentProps, ReactNode } from 'react';

/**
 * Render del MDX compilado por Velite (B.8).
 *
 * Velite entrega el cuerpo como cuerpo de función, así que se evalúa con `Function`.
 * Esto corre solo en el servidor —los componentes del documento son de servidor—,
 * de modo que la CSP del navegador (B.11) no necesita `unsafe-eval`.
 */

/** Componentes disponibles dentro del MDX (B.8), más los que pide el copy de §3. */
const componentes = {
  Nota,
  Diff,
  Firma,
  FiguraRecorrido,
  AlMargen,
  Acciones,
  Agenda,
  AvisoPrivacidad,
  BotonConfigurarCookies,
  BotonWhatsApp,
  Cta,
  MedidorCarga,
  Destinatario,
  Expedientes,
  Faq,
  Franja,
  // Tipografía del documento: el MDX no lleva clases, las pone el sistema.
  h2: (props: ComponentProps<'h2'>) => (
    <h2 className="mt-12 font-serif text-[1.5rem] text-tinta" {...props} />
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3 className="mt-12 font-serif text-[1.375rem] text-tinta" {...props} />
  ),
  h4: (props: ComponentProps<'h4'>) => (
    <h4 className="mt-8 font-sans text-[1.0625rem] font-semibold text-tinta" {...props} />
  ),
  p: (props: ComponentProps<'p'>) => <p className="mt-4" {...props} />,
  ul: (props: ComponentProps<'ul'>) => <ul className="mt-4 space-y-2 pl-5" {...props} />,
  ol: (props: ComponentProps<'ol'>) => <ol className="mt-4 space-y-2 pl-5" {...props} />,
  li: (props: ComponentProps<'li'>) => <li className="marcador" {...props} />,
  blockquote: (props: ComponentProps<'blockquote'>) => (
    <blockquote className="mt-6 border-l-2 border-lapiz pl-4 text-lapiz" {...props} />
  ),
  table: (props: ComponentProps<'table'>) => (
    <div className="tabla-envoltura">
      <table className="tabla" {...props} />
    </div>
  ),
  code: (props: ComponentProps<'code'>) => (
    <code className="font-mono text-[0.875rem] text-lapiz" {...props} />
  ),
  hr: () => <hr className="mt-8 border-papel-2" />,
  // Los enlaces internos pasan por el router; los anclajes y lo externo, no.
  a: ({ href = '', ...props }: ComponentProps<'a'>) =>
    href.startsWith('/') ? (
      <Link href={href} className="underline decoration-firma" {...props} />
    ) : (
      <a href={href} className="underline decoration-firma" {...props} />
    ),
};

type Props = {
  cuerpo: string;
  /** Componentes extra o reemplazos para una ruta concreta */
  extra?: Record<string, unknown>;
};

export function Mdx({ cuerpo, extra }: Props) {
  const construir = new Function(cuerpo) as (entorno: typeof runtime) => {
    default: (props: { components: Record<string, unknown> }) => ReactNode;
  };

  const Contenido = construir({ ...runtime }).default;

  return <Contenido components={{ ...componentes, ...extra }} />;
}
