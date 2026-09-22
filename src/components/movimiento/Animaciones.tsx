'use client';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

/**
 * Inventario de movimiento (B.6). Es la lista completa: aquí no se agrega nada
 * que no esté en esa tabla.
 *
 *  1. Doble filete de la portada — al cargar, DrawSVG, 0,8 s `power2.out`.
 *  2. Doble filete de cada sección — al entrar (top 80%), una vez, 0,6 s.
 *  3. Notas al margen — con su párrafo, una vez, 0,25 s `power1.out`.
 *  4. Figura «Recorrido de un pedido» — ligada al scroll, con scrub.
 *  5. Cambio de expediente — View Transition, en `PestanasExpediente`.
 *  6. Sello «Recibido» — entra con el sello, en F4.
 *
 * Reglas de B.6: todo dentro de `useGSAP`, todo dentro de `matchMedia`, solo se
 * animan `transform`, `opacity` y el trazo SVG, y nada de pin.
 *
 * Los objetivos son elementos, nunca cadenas de selector: este módulo es el motor
 * de todo el documento, no de un subárbol, así que no lleva scope.
 */

/** Solo se prepara lo que todavía no se ve: si ya está en pantalla, no parpadea. */
function debajoDelPliegue(elemento: Element): boolean {
  return elemento.getBoundingClientRect().top > window.innerHeight * 0.85;
}

export function Animaciones() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Doble filete de la portada. El script de movimiento ya lo dejó sin
      //    trazo, así que se dibuja sin haberse visto antes completo.
      const portada = gsap.utils.toArray<SVGLineElement>('.portada [data-filete] line');

      if (portada.length > 0) {
        gsap.fromTo(
          portada,
          { drawSVG: '0%' },
          { drawSVG: '100%', duration: 0.8, ease: 'power2.out', stagger: 0.12 },
        );
      }

      // 2. Doble filete de cada sección.
      const filetes = gsap.utils
        .toArray<SVGSVGElement>('section [data-filete]')
        .filter(debajoDelPliegue);

      for (const filete of filetes) {
        const lineas = [...filete.querySelectorAll('line')];
        gsap.set(lineas, { drawSVG: '0%' });

        gsap.to(lineas, {
          drawSVG: '100%',
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: { trigger: filete, start: 'top 80%', once: true },
        });
      }

      // 3. Notas al margen: entran con su párrafo.
      const notas = gsap.utils.toArray<HTMLElement>('.nota-cuerpo').filter(debajoDelPliegue);

      if (notas.length > 0) {
        gsap.set(notas, { opacity: 0, y: 8 });

        ScrollTrigger.batch(notas, {
          start: 'top 90%',
          once: true,
          onEnter: (elementos) =>
            gsap.to(elementos, {
              opacity: 1,
              y: 0,
              duration: 0.25,
              ease: 'power1.out',
              stagger: 0.05,
            }),
        });
      }

      // 4. Figura «Recorrido de un pedido»: ligada al scroll, fija con `sticky`,
      //    nunca con pin (B.6.5).
      for (const figura of gsap.utils.toArray<HTMLElement>('[data-figura-recorrido]')) {
        const trazo = figura.querySelector('[data-figura-linea]');
        const estados = [...figura.querySelectorAll<HTMLElement>('.figura-estado')];

        const marcar = (progreso: number) => {
          const alcanzados = Math.round(progreso * estados.length);
          estados.forEach((estado, indice) =>
            estado.classList.toggle('activo', indice < alcanzados),
          );
        };

        if (!trazo) continue;

        gsap.fromTo(
          trazo,
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: figura,
              start: 'top 75%',
              end: 'bottom 60%',
              scrub: true,
              onUpdate: (self) => marcar(self.progress),
            },
          },
        );
      }

      // Las fuentes cambian la altura del texto y mueven los disparadores.
      void document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        for (const estado of document.querySelectorAll('.figura-estado.activo')) {
          estado.classList.remove('activo');
        }
      };
    });

    return () => mm.revert();
  });

  return null;
}
