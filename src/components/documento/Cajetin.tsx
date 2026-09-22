'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SECCIONES } from '@/lib/documento';

type Props = {
  /** Versión semántica de package.json, inyectada en el build */
  revision: string;
  /** Fecha del build en dd.mm.aaaa */
  fecha: string;
};

const PRIMERA = SECCIONES[0].numeral;

/**
 * Cajetín vivo (B.5 y Parte A §4.1).
 *
 * Es el único observador del scroll del documento: calcula la página visible y,
 * de paso, marca la sección actual en el índice (que es de servidor y por eso no
 * puede observar nada por su cuenta).
 */
export function Cajetin({ revision, fecha }: Props) {
  const [numeral, setNumeral] = useState<string>(PRIMERA);
  const t = useTranslations('documento.cajetin');

  useEffect(() => {
    const secciones = [...document.querySelectorAll<HTMLElement>('section[data-seccion]')];
    if (secciones.length === 0) return;

    const visibles = new Set<HTMLElement>();

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const elemento = entrada.target as HTMLElement;
          if (entrada.isIntersecting) visibles.add(elemento);
          else visibles.delete(elemento);
        }

        // La última en orden de documento es la que el lector acaba de alcanzar.
        const actual = secciones.findLast((seccion) => visibles.has(seccion));
        if (actual?.dataset.seccion) setNumeral(actual.dataset.seccion);
      },
      { rootMargin: '-20% 0px -60% 0px' },
    );

    for (const seccion of secciones) observador.observe(seccion);

    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    // Atributo propio: si se llamara `data-seccion`, el observador de arriba
    // encontraría al propio `<html>` y se quedaría mirándose a sí mismo.
    document.documentElement.dataset.seccionActiva = numeral;

    for (const enlace of document.querySelectorAll<HTMLAnchorElement>('.indice-enlace')) {
      const esActual = enlace.dataset.numeral === numeral;
      if (esActual) enlace.setAttribute('aria-current', 'location');
      else enlace.removeAttribute('aria-current');
    }
  }, [numeral]);

  return (
    <aside aria-label={t('etiqueta')} className="cajetin">
      {t('texto', { revision, fecha, pagina: numeral })}
    </aside>
  );
}
