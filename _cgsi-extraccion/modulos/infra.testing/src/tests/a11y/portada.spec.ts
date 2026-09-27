import AxeBuilder from '@axe-core/playwright';
import { expect, test, testSinConsentimiento } from '../utiles/playwright';

/** Accesibilidad (B.13): cero violaciones de axe en todas las rutas, en Papel y en Plano. */

const etiquetas = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const rutas = [
  { nombre: 'documento', ruta: '/' },
  { nombre: 'política de datos', ruta: '/politica-de-datos' },
  { nombre: 'folio no encontrado', ruta: '/folio-que-no-existe' },
];

const temas = [
  { nombre: 'Papel', esquema: 'light' },
  { nombre: 'Plano', esquema: 'dark' },
] as const;

for (const { nombre, ruta } of rutas) {
  for (const tema of temas) {
    test(`${nombre} sin violaciones de axe (${tema.nombre})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: tema.esquema });
      await page.goto(ruta);

      const resultado = await new AxeBuilder({ page }).withTags(etiquetas).analyze();

      expect(resultado.violations).toEqual([]);
    });
  }
}

for (const tema of temas) {
  testSinConsentimiento(
    `el aviso de cookies no tiene violaciones de axe (${tema.nombre})`,
    async ({ page }) => {
      await page.emulateMedia({ colorScheme: tema.esquema });
      await page.goto('/');

      await expect(page.locator('.aviso-cookies')).toBeVisible();

      const conAviso = await new AxeBuilder({ page }).withTags(etiquetas).analyze();
      expect(conAviso.violations).toEqual([]);

      await page.locator('.aviso-cookies').getByRole('button', { name: 'Configuración' }).click();
      await expect(page.locator('dialog.dialogo-cookies')).toBeVisible();

      const conDialogo = await new AxeBuilder({ page }).withTags(etiquetas).analyze();
      expect(conDialogo.violations).toEqual([]);
    },
  );
}

test('el documento se recorre completo con el teclado', async ({ page }) => {
  await page.goto('/');

  const alcanzados: string[] = [];

  for (let paso = 0; paso < 12; paso += 1) {
    await page.keyboard.press('Tab');
    alcanzados.push(
      await page.evaluate(() => {
        const activo = document.activeElement as HTMLElement | null;
        return activo ? `${activo.tagName}.${activo.className}`.trim() : 'ninguno';
      }),
    );
  }

  expect(alcanzados.some((elemento) => elemento.includes('saltar'))).toBe(true);
  expect(alcanzados.some((elemento) => elemento.includes('interruptor-tema'))).toBe(true);
  expect(alcanzados.some((elemento) => elemento.includes('indice-enlace'))).toBe(true);
});
