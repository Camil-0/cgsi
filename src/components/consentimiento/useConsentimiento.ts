'use client';

import { useSyncExternalStore } from 'react';
import { consentimientoActual, suscribir } from '@/lib/consentimiento';

import type { Consentimiento } from '@/lib/consentimiento';

/**
 * El consentimiento vive en un almacén externo al árbol de React, igual que el
 * tema: así cualquier componente lo lee sin proveedor de por medio, y todos se
 * enteran a la vez cuando cambia.
 *
 * En el servidor no hay decisión: se renderiza como si no hubiera consentimiento,
 * que es el estado seguro.
 */
export function useConsentimiento(version: string): Consentimiento | null {
  return useSyncExternalStore(
    suscribir,
    () => consentimientoActual(version),
    () => null,
  );
}
