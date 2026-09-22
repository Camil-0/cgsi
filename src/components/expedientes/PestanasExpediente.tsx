'use client';

import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import type { ReactNode } from 'react';

type Pestana = {
  id: string;
  etiqueta: string;
};

type Props = {
  /** Título accesible de la lista de pestañas */
  titulo: string;
  pestanas: Pestana[];
  /** Un panel por pestaña, en el mismo orden */
  children: ReactNode[];
};

function prefiereQuietud(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** El CSS de la View Transition lee esta dirección para decidir hacia dónde desliza. */
function fijarDireccion(direccion: 'adelante' | 'atras'): void {
  document.documentElement.dataset.dir = direccion;
}

/**
 * Pestañas de carpeta de los expedientes (B.5 y B.6, animación 5).
 *
 * Patrón ARIA de pestañas completo: flechas, Inicio y Fin, foco móvil y un solo
 * tabulador para entrar y salir. El cambio usa View Transitions con deslizamiento
 * lateral; donde no hay soporte, o con movimiento reducido, el cambio es instantáneo.
 */
export function PestanasExpediente({ titulo, pestanas, children }: Props) {
  const [activa, setActiva] = useState(0);
  const listaRef = useRef<HTMLDivElement>(null);
  // Espejo de `activa` para leerla sin esperar al render: con View Transitions,
  // dos teclas seguidas llegan antes de que React vuelva a pintar.
  const activaRef = useRef(0);

  function cambiar(indice: number) {
    const anterior = activaRef.current;
    if (indice === anterior) return;

    activaRef.current = indice;

    const iniciar = document.startViewTransition?.bind(document);
    if (!iniciar || prefiereQuietud()) {
      setActiva(indice);
      return;
    }

    fijarDireccion(indice > anterior ? 'adelante' : 'atras');
    iniciar(() => flushSync(() => setActiva(indice)));
  }

  function enfocar(indice: number) {
    const boton = listaRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[indice];
    boton?.focus();
    cambiar(indice);
  }

  function alTeclear(evento: React.KeyboardEvent<HTMLDivElement>) {
    const ultima = pestanas.length - 1;
    const actual = activaRef.current;
    const movimientos: Record<string, number> = {
      ArrowRight: actual === ultima ? 0 : actual + 1,
      ArrowLeft: actual === 0 ? ultima : actual - 1,
      Home: 0,
      End: ultima,
    };

    const destino = movimientos[evento.key];
    if (destino === undefined) return;

    evento.preventDefault();
    enfocar(destino);
  }

  return (
    <div className="pestanas">
      <div
        ref={listaRef}
        role="tablist"
        aria-label={titulo}
        className="pestanas-lista"
        onKeyDown={alTeclear}
      >
        {pestanas.map((pestana, indice) => (
          <button
            key={pestana.id}
            type="button"
            role="tab"
            id={`pestana-${pestana.id}`}
            aria-selected={indice === activa}
            aria-controls={`panel-${pestana.id}`}
            tabIndex={indice === activa ? 0 : -1}
            className="pestana"
            onClick={() => cambiar(indice)}
          >
            {pestana.etiqueta}
          </button>
        ))}
      </div>

      {pestanas.map((pestana, indice) => (
        <div
          key={pestana.id}
          role="tabpanel"
          id={`panel-${pestana.id}`}
          aria-labelledby={`pestana-${pestana.id}`}
          tabIndex={0}
          hidden={indice !== activa}
          className="panel-expediente"
        >
          {children[indice]}
        </div>
      ))}
    </div>
  );
}
