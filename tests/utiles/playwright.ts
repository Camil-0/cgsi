import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test as base, expect } from '@playwright/test';

/**
 * Fixture compartido de las pruebas de navegador.
 *
 * Desde que existe el aviso de cookies, una visita nueva siempre lo ve. Eso es
 * correcto para quien llega, pero falsearía las demás pruebas: el aviso se
 * queda fijo abajo y taparía lo que se quiere mirar.
 *
 * Por eso `test` entra con el consentimiento ya dado, como quien vuelve al
 * sitio, y `testSinConsentimiento` entra en limpio, que es lo que necesitan las
 * pruebas del propio aviso.
 *
 * La versión se lee del MDX de la política: si alguien la sube, estas pruebas
 * siguen sirviendo sin tocarlas.
 */

const mdx = readFileSync(
  fileURLToPath(new URL('../../content/es/legal/politica-de-datos.mdx', import.meta.url)),
  'utf8',
);

export const VERSION_POLITICA = /^version:\s*'?([^'\n]+)'?/m.exec(mdx)?.[1]?.trim() ?? '1.0';

export const CLAVE_CONSENTIMIENTO = 'cgsi-consentimiento';

export function consentimientoTotal(): string {
  return JSON.stringify({
    version: VERSION_POLITICA,
    fecha: new Date().toISOString(),
    decision: { necesarias: true, preferencias: true, analitica: true, grabacion: true },
  });
}

export const test = base.extend({
  page: async ({ page }, usar) => {
    await page.addInitScript(
      ([clave, valor]) => {
        try {
          localStorage.setItem(clave as string, valor as string);
        } catch {
          // Almacenamiento bloqueado: la prueba verá el aviso, y eso también se sabe.
        }
      },
      [CLAVE_CONSENTIMIENTO, consentimientoTotal()],
    );

    await usar(page);
  },
});

/** Visita en limpio: sin decisión guardada. */
export const testSinConsentimiento = base;

export { expect };
