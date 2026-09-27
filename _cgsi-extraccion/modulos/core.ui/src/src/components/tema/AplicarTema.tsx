'use client';

import { useEffect, useLayoutEffect } from 'react';
import { CLAVE_TEMA } from './ScriptTema';

/**
 * Vuelve a poner `data-tema` después de hidratar.
 *
 * `ScriptTema` lo escribe antes del primer pintado, pero React es dueño del
 * `<html>` y lo borra al reconciliar, porque no venía en el HTML del servidor
 * (el documento es estático: en el build no se sabe qué tema prefiere quien lee).
 * `suppressHydrationWarning` silencia el aviso, pero no evita el borrado.
 *
 * Al correr como efecto de layout, la reposición ocurre en el mismo commit que el
 * borrado: el navegador nunca llega a pintar el tema equivocado.
 */

const useEfectoDeLayout = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function AplicarTema() {
  useEfectoDeLayout(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_TEMA);
      if (guardado === 'papel' || guardado === 'plano') {
        document.documentElement.dataset.tema = guardado;
      }
    } catch {
      // Almacenamiento bloqueado: manda `prefers-color-scheme`.
    }
  }, []);

  return null;
}
