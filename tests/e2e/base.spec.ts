import { expect, test } from '@playwright/test';

/**
 * Criterio de salida de F0 (B.17): página con los tokens aplicados.
 * Los colores esperados son los de la Parte A §2.1.
 */

test.describe('F0 — base del documento', () => {
  test('la página se sirve en español de Colombia', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'es-CO');
  });

  test('aplica los tokens del modo Papel', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    const fondo = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const texto = await page.evaluate(() => getComputedStyle(document.body).color);

    expect(fondo).toBe('rgb(245, 240, 232)');
    expect(texto).toBe('rgb(42, 42, 42)');
  });

  test('aplica los tokens del modo Plano cuando el sistema está en oscuro', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    const fondo = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const texto = await page.evaluate(() => getComputedStyle(document.body).color);

    expect(fondo).toBe('rgb(13, 27, 42)');
    expect(texto).toBe('rgb(245, 240, 232)');
  });

  test('carga las tres familias tipográficas', async ({ page }) => {
    await page.goto('/');

    const cuerpo = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    const titular = await page.evaluate(
      () => getComputedStyle(document.querySelector('h1') as Element).fontFamily,
    );
    const metadatos = await page.evaluate(
      () => getComputedStyle(document.querySelector('main p') as Element).fontFamily,
    );

    expect(cuerpo).toMatch(/Source Sans 3/);
    expect(cuerpo).toMatch(/Calibri/);
    expect(titular).toMatch(/Source Serif 4/);
    expect(titular).toMatch(/Georgia/);
    expect(metadatos).toMatch(/JetBrains Mono/);
    expect(metadatos).toMatch(/ui-monospace/);
  });

  test('no hay desbordes horizontales', async ({ page }) => {
    await page.goto('/');

    const desborde = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(desborde).toBe(false);
  });
});
