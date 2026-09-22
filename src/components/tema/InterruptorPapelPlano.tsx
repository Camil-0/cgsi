'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { CLAVE_TEMA } from './ScriptTema';

type Tema = 'papel' | 'plano';

/**
 * El tema vive en el DOM (`data-tema` en `<html>`), que es lo que fija el
 * `ScriptTema` antes del primer pintado. El componente se suscribe a ese estado
 * externo en vez de guardar una copia: así no hay dos verdades ni parpadeo.
 */
function leerTema(): Tema {
  const fijado = document.documentElement.dataset.tema;
  if (fijado === 'papel' || fijado === 'plano') return fijado;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'plano' : 'papel';
}

function suscribir(alCambiar: () => void): () => void {
  const consulta = window.matchMedia('(prefers-color-scheme: dark)');
  const observador = new MutationObserver(alCambiar);

  consulta.addEventListener('change', alCambiar);
  observador.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-tema'],
  });

  return () => {
    consulta.removeEventListener('change', alCambiar);
    observador.disconnect();
  };
}

/**
 * Interruptor Papel/Plano (B.5 y Parte A §4.5): alterna `data-tema` y lo persiste
 * en `localStorage`, dentro de try/catch. `aria-pressed` dice si la vista Plano
 * está activa.
 */
export function InterruptorPapelPlano() {
  const tema = useSyncExternalStore<Tema>(suscribir, leerTema, () => 'papel');
  const t = useTranslations('tema');

  function alternar() {
    const siguiente: Tema = tema === 'plano' ? 'papel' : 'plano';
    document.documentElement.dataset.tema = siguiente;

    try {
      localStorage.setItem(CLAVE_TEMA, siguiente);
    } catch {
      // Almacenamiento bloqueado: el tema vale para esta sesión y ya.
    }
  }

  return (
    <button
      type="button"
      className="boton-barra interruptor-tema"
      aria-pressed={tema === 'plano'}
      onClick={alternar}
    >
      {t('vistaPlano')}
    </button>
  );
}
