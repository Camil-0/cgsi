import { expect, test } from '@playwright/test';

/** Sistema documento (F1): retícula, secciones, índice y cajetín. */

const NUMERALES = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

test.describe('documento I–VII', () => {
  test('rinde las siete secciones, cada una con su numeral', async ({ page }) => {
    await page.goto('/');

    const secciones = page.locator('[data-seccion]');
    await expect(secciones).toHaveCount(7);

    for (const numeral of NUMERALES) {
      await expect(page.locator(`[data-seccion="${numeral}"] h2`)).toContainText(numeral);
    }
  });

  test('los encabezados van en orden: un h1 y siete h2', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main h2')).toHaveCount(7);
  });

  test('el índice lleva a cada ancla', async ({ page }) => {
    await page.goto('/');

    const enlaces = page.locator('.indice-enlace');
    await expect(enlaces).toHaveCount(7);

    for (const numeral of NUMERALES) {
      const enlace = page.locator(`.indice-enlace[data-numeral="${numeral}"]`);
      const destino = await enlace.getAttribute('href');

      expect(destino).toMatch(/^#[a-z-]+$/);
      await expect(page.locator(`section${destino as string}`)).toHaveAttribute(
        'data-seccion',
        numeral,
      );
    }
  });

  test('el cajetín muestra referencia, revisión, fecha y página', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.cajetin')).toHaveText(
      /^Ref\. CSI-2026-WEB-001 · Rev\. \d+\.\d+\.\d+ · \d{2}\.\d{2}\.\d{4} · Pág\. [IVX]+\/VII$/,
    );
  });

  test('la página del cajetín cambia con el scroll', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-seccion="IV"]').scrollIntoViewIfNeeded();

    await expect(page.locator('.cajetin')).toContainText('Pág. IV/VII');
    await expect(page.locator('.indice-enlace[data-numeral="IV"]')).toHaveAttribute(
      'aria-current',
      'location',
    );
  });

  test('el doble filete es decorativo para las ayudas técnicas', async ({ page }) => {
    await page.goto('/');

    const filetes = page.locator('[data-filete]');
    expect(await filetes.count()).toBeGreaterThan(0);

    for (const filete of await filetes.all()) {
      await expect(filete).toHaveAttribute('aria-hidden', 'true');
    }
  });
});

test.describe('impresión', () => {
  test('la hoja impresa oculta la interfaz y muestra encabezado y pie', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('.indice')).toBeHidden();
    await expect(page.locator('.cajetin')).toBeHidden();
    await expect(page.locator('.barra')).toBeHidden();
    await expect(page.locator('.saltar')).toBeHidden();

    await expect(page.locator('.hoja-encabezado')).toBeVisible();
    await expect(page.locator('.hoja-pie')).toBeVisible();

    const fondo = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const texto = await page.evaluate(() => getComputedStyle(document.body).color);

    expect(fondo).toBe('rgb(255, 255, 255)');
    expect(texto).toBe('rgb(0, 0, 0)');
  });
});

test.describe('teclado', () => {
  test('el primer tabulador llega a «Saltar al contenido» y el enlace mueve el foco', async ({
    page,
  }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const saltar = page.locator('.saltar');
    await expect(saltar).toBeFocused();
    await expect(saltar).toBeInViewport();

    await page.keyboard.press('Enter');
    await expect(page.locator('main#contenido')).toBeFocused();
  });

  test('el índice se recorre con el tabulador', async ({ page }) => {
    await page.goto('/');

    await page.locator('.indice-enlace[data-numeral="I"]').focus();
    await page.keyboard.press('Tab');

    await expect(page.locator('.indice-enlace[data-numeral="II"]')).toBeFocused();
  });
});

test.describe('notas de fundamento', () => {
  test('en escritorio la nota se lee sin abrir nada; en móvil se abre con teclado', async ({
    page,
  }) => {
    await page.goto('/sistema');

    const boton = page.locator('.nota-llamada').first();
    const cuerpo = page.locator('.nota-cuerpo').first();
    const escritorio = (page.viewportSize()?.width ?? 0) >= 1024;

    if (escritorio) {
      await expect(cuerpo).toBeVisible();
      await expect(boton).not.toHaveAttribute('aria-expanded', 'true');
      return;
    }

    await expect(cuerpo).toBeHidden();

    await boton.focus();
    await page.keyboard.press('Enter');

    await expect(boton).toHaveAttribute('aria-expanded', 'true');
    await expect(cuerpo).toBeVisible();

    await page.keyboard.press('Enter');
    await expect(boton).toHaveAttribute('aria-expanded', 'false');
    await expect(cuerpo).toBeHidden();
  });
});

test.describe('diff de procesos', () => {
  test('nunca comunica solo con color: lleva signos y semántica', async ({ page }) => {
    await page.goto('/sistema');

    await expect(page.locator('.diff del')).toHaveCount(2);
    await expect(page.locator('.diff ins')).toHaveCount(2);
    await expect(page.locator('.diff li').first()).toContainText('−');
    await expect(page.locator('.diff li').nth(1)).toContainText('+');

    const tachado = await page
      .locator('.diff del')
      .first()
      .evaluate((nodo) => getComputedStyle(nodo).textDecorationLine);

    expect(tachado).toContain('line-through');
  });
});
