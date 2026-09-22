import { expect, test } from '@playwright/test';

/** Tema Papel/Plano (B.3 y B.5). */

test.describe('interruptor Papel/Plano', () => {
  test('alterna el tema y lo persiste al recargar', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    const interruptor = page.locator('.interruptor-tema');
    await expect(interruptor).toHaveAttribute('aria-pressed', 'false');

    await interruptor.click();

    await expect(page.locator('html')).toHaveAttribute('data-tema', 'plano');
    await expect(interruptor).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(13, 27, 42)');

    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-tema', 'plano');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(13, 27, 42)');
  });

  test('se opera con teclado', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    const interruptor = page.locator('.interruptor-tema').first();
    await interruptor.focus();
    await page.keyboard.press('Enter');

    await expect(interruptor).toHaveAttribute('aria-pressed', 'true');
  });

  test('sin nada guardado, el tema sigue al sistema', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    await expect(page.locator('html')).not.toHaveAttribute('data-tema', 'papel');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(13, 27, 42)');
    await expect(page.locator('.interruptor-tema').first()).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('el foco visible usa --firma', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    await page.keyboard.press('Tab');

    const contorno = await page
      .locator('.saltar')
      .evaluate((nodo) => getComputedStyle(nodo).outlineColor);

    expect(contorno).toBe('rgb(35, 64, 200)');
  });
});
