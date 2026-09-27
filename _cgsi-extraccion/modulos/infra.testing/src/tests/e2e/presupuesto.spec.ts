import { gzipSync } from 'node:zlib';
import { expect, test } from '../utiles/playwright';

/**
 * Presupuesto de JavaScript (B.12, con la corrección registrada en PROGRESS.md).
 *
 * El umbral de 120 KB de B.12 no es alcanzable con el stack de B.1: Next 16 con
 * React 19 y App Router pone un piso medido de ~179 KB comprimidos con la página
 * vacía. Lo que sí se controla, y lo que esta prueba cuida, es que el JavaScript
 * propio no crezca sin que nadie se entere, y que lo diferido siga diferido.
 */

/** Piso del framework (medido en F0, con la página vacía) más 20 KB de código propio. */
const TECHO_KB = 200;

test.describe('presupuesto de JavaScript', () => {
  test('el JavaScript inicial no pasa del techo acordado', async ({ page, request }) => {
    const respuesta = await page.goto('/');
    const html = (await respuesta?.text()) ?? '';

    const rutas = [
      ...new Set([...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1])),
    ];

    expect(rutas.length).toBeGreaterThan(0);

    let comprimido = 0;
    for (const ruta of rutas) {
      const archivo = await request.get(ruta as string);
      comprimido += gzipSync(await archivo.body()).length;
    }

    const kb = comprimido / 1024;
    // Queda en el reporte para que el número se vea, no solo el veredicto.
    test.info().annotations.push({ type: 'JS inicial', description: `${kb.toFixed(1)} KB gzip` });

    expect(kb).toBeLessThan(TECHO_KB);
  });

  test('lo que va diferido no viaja en el arranque', async ({ page }) => {
    const respuesta = await page.goto('/');
    const html = (await respuesta?.text()) ?? '';

    const rutas = [...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]);

    // GSAP entra al pedirlo `Movimiento`; Cal.com, al acercarse a la sección VII (F4).
    for (const diferido of [/gsap/i, /cal\.com/i, /embed/i]) {
      expect(rutas.some((ruta) => diferido.test(ruta as string))).toBe(false);
    }
  });
});
