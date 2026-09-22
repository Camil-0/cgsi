import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/** Accesibilidad (B.13): cero violaciones de axe en todas las rutas, en Papel y en Plano. */

const etiquetas = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const tema of ['light', 'dark'] as const) {
  test(`la portada no tiene violaciones de axe (${tema === 'light' ? 'Papel' : 'Plano'})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: tema });
    await page.goto('/');

    const resultado = await new AxeBuilder({ page }).withTags(etiquetas).analyze();

    expect(resultado.violations).toEqual([]);
  });
}
