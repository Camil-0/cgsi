'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
  /** Versión semántica de package.json, inyectada en el build */
  revision: string;
  /** Fecha del build en dd.mm.aaaa */
  fecha: string;
  /** Numeral que se muestra antes del primer scroll */
  numeralInicial: string;
};

/**
 * Cajetín vivo (B.5 y Parte A §4.1).
 *
 * Es el único observador del scroll del documento: calcula la página visible y,
 * de paso, marca la sección actual en el índice (que es de servidor y por eso no
 * puede observar nada por su cuenta).
 */
export function Cajetin({ revision, fecha, numeralInicial }: Props) {
  const [numeral, setNumeral] = useState<string>(numeralInicial);
  const caja = useRef<HTMLElement>(null);
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

  // El aviso de cookies se apoya sobre el cajetín, que en móvil es una barra
  // fija abajo. Su alto depende de cómo envuelva el texto, así que se mide en
  // vez de adivinarse.
  useEffect(() => {
    const nodo = caja.current;
    if (!nodo) return;

    const medir = () => {
      const alto = nodo.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--alto-cajetin', `${Math.ceil(alto)}px`);
    };

    const observador = new ResizeObserver(medir);
    observador.observe(nodo);

    return () => {
      observador.disconnect();
      document.documentElement.style.removeProperty('--alto-cajetin');
    };
  }, []);

  return (
    <aside ref={caja} aria-label={t('etiqueta')} className="cajetin">
      {t('texto', { revision, fecha, pagina: numeral })}
    </aside>
  );
}
