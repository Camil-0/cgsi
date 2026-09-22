import {
  CLAVE_CONSENTIMIENTO,
  expect,
  testSinConsentimiento as test,
  VERSION_POLITICA,
} from '../utiles/playwright';

import type { Page } from '@playwright/test';

/**
 * Aviso de cookies por categoría (Parte A §7.5 y §12 de la política).
 *
 * Estas pruebas entran en limpio, sin decisión guardada: son las únicas que
 * deben ver el aviso.
 */

type Decision = Record<string, boolean>;

async function decisionGuardada(page: Page): Promise<{
  version: string;
  fecha: string;
  decision: Decision;
} | null> {
  return page.evaluate((clave) => {
    const crudo = localStorage.getItem(clave);
    return crudo ? (JSON.parse(crudo) as { version: string; fecha: string; decision: Decision }) : null;
  }, CLAVE_CONSENTIMIENTO);
}

test.describe('primera visita', () => {
  test('el aviso aparece, es corto y no tapa el cajetín', async ({ page }) => {
    await page.goto('/');

    const aviso = page.locator('.aviso-cookies');
    await expect(aviso).toBeVisible();
    await expect(aviso).toHaveAttribute('aria-label', 'Cookies de este sitio');

    await expect(aviso.getByRole('button', { name: 'Aceptar todo' })).toBeVisible();
    await expect(aviso.getByRole('button', { name: 'Configuración' })).toBeVisible();
    await expect(aviso.getByRole('link', { name: /política de datos/i })).toBeVisible();

    // El cajetín sigue legible: el aviso se apoya sobre él, nunca lo tapa.
    // En móvil el cajetín es una barra fija abajo; en escritorio va en la
    // columna del índice. En los dos casos, las dos cajas no se pisan.
    const cajetin = await page.locator('.cajetin').boundingBox();
    const caja = await aviso.boundingBox();
    expect(cajetin).not.toBeNull();
    expect(caja).not.toBeNull();

    const seSolapan =
      (caja?.y ?? 0) < (cajetin?.y ?? 0) + (cajetin?.height ?? 0) &&
      (cajetin?.y ?? 0) < (caja?.y ?? 0) + (caja?.height ?? 0);

    expect(seSolapan).toBe(false);
  });

  test('sin decidir, no se guarda nada ni se descarga analítica', async ({ page }) => {
    const pedidos: string[] = [];
    page.on('request', (peticion) => pedidos.push(peticion.url()));

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    expect(await decisionGuardada(page)).toBeNull();
    expect(pedidos.filter((url) => /posthog|vercel-insights|vitals/i.test(url))).toEqual([]);
  });
});

test.describe('aceptar', () => {
  test('«Aceptar todo» cierra el aviso y deja constancia de las cuatro categorías', async ({
    page,
  }) => {
    await page.goto('/');
    await page.locator('.aviso-cookies').getByRole('button', { name: 'Aceptar todo' }).click();

    await expect(page.locator('.aviso-cookies')).toHaveCount(0);

    const guardada = await decisionGuardada(page);
    expect(guardada?.version).toBe(VERSION_POLITICA);
    expect(guardada?.decision).toEqual({
      necesarias: true,
      preferencias: true,
      analitica: true,
      grabacion: true,
    });
    expect(Date.parse(guardada?.fecha ?? '')).not.toBeNaN();
  });

  test('la decisión sobrevive a una recarga', async ({ page }) => {
    await page.goto('/');
    await page.locator('.aviso-cookies').getByRole('button', { name: 'Aceptar todo' }).click();

    await page.reload();

    await expect(page.locator('.aviso-cookies')).toHaveCount(0);
  });
});

test.describe('configuración', () => {
  test('abre un diálogo con las cuatro categorías separadas', async ({ page }) => {
    await page.goto('/');
    await page.locator('.aviso-cookies').getByRole('button', { name: 'Configuración' }).click();

    const dialogo = page.locator('dialog.dialogo-cookies');
    await expect(dialogo).toBeVisible();

    const casillas = dialogo.locator('input[type="checkbox"]');
    await expect(casillas).toHaveCount(4);

    // Las necesarias van marcadas y bloqueadas; el resto, apagadas.
    await expect(page.locator('#cookies-necesarias')).toBeChecked();
    await expect(page.locator('#cookies-necesarias')).toBeDisabled();

    for (const categoria of ['preferencias', 'analitica', 'grabacion']) {
      await expect(page.locator(`#cookies-${categoria}`)).not.toBeChecked();
      await expect(page.locator(`#cookies-${categoria}`)).toBeEnabled();
    }
  });

  test('«Rechazar todo» deja constancia del «no», que es lo que lo hace valer', async ({ page }) => {
    await page.goto('/');
    await page.locator('.aviso-cookies').getByRole('button', { name: 'Configuración' }).click();
    await page.getByRole('button', { name: 'Rechazar todo' }).click();

    await expect(page.locator('.aviso-cookies')).toHaveCount(0);
    expect((await decisionGuardada(page))?.decision).toEqual({
      necesarias: true,
      preferencias: false,
      analitica: false,
      grabacion: false,
    });
  });

  test('se puede autorizar la analítica sin autorizar la grabación', async ({ page }) => {
    await page.goto('/');
    await page.locator('.aviso-cookies').getByRole('button', { name: 'Configuración' }).click();

    await page.locator('#cookies-analitica').check();
    await page.getByRole('button', { name: 'Guardar mi selección' }).click();

    expect((await decisionGuardada(page))?.decision).toEqual({
      necesarias: true,
      preferencias: false,
      analitica: true,
      grabacion: false,
    });
  });

  test('se opera con teclado y se cierra con Escape', async ({ page }) => {
    await page.goto('/');
    await page.locator('.aviso-cookies').getByRole('button', { name: 'Configuración' }).click();

    const dialogo = page.locator('dialog.dialogo-cookies');
    await expect(dialogo).toBeVisible();

    // El foco entra al diálogo, no se queda detrás.
    const dentro = await page.evaluate(
      () => document.activeElement?.closest('dialog') !== null,
    );
    expect(dentro).toBe(true);

    await page.locator('#cookies-analitica').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#cookies-analitica')).toBeChecked();

    await page.keyboard.press('Escape');
    await expect(dialogo).toBeHidden();

    // Cerrar con Escape no decide nada: el aviso sigue ahí.
    await expect(page.locator('.aviso-cookies')).toBeVisible();
    expect(await decisionGuardada(page)).toBeNull();
  });

  test('se puede volver a abrir desde el pie, después de haber decidido', async ({ page }) => {
    await page.goto('/');
    await page.locator('.aviso-cookies').getByRole('button', { name: 'Aceptar todo' }).click();
    await expect(page.locator('.aviso-cookies')).toHaveCount(0);

    await page.getByRole('button', { name: 'Configurar cookies' }).click();

    const dialogo = page.locator('dialog.dialogo-cookies');
    await expect(dialogo).toBeVisible();
    // Abre mostrando lo que ya se decidió, no un formulario en blanco.
    await expect(page.locator('#cookies-analitica')).toBeChecked();

    await page.getByRole('button', { name: 'Rechazar todo' }).click();
    expect((await decisionGuardada(page))?.decision.analitica).toBe(false);
  });
});

test.describe('las categorías hacen lo que dicen', () => {
  test('sin «preferencias», el tema no se guarda en el navegador', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.locator('.aviso-cookies').getByRole('button', { name: 'Configuración' }).click();
    await page.getByRole('button', { name: 'Rechazar todo' }).click();

    await page.locator('.interruptor-tema').click();
    await expect(page.locator('html')).toHaveAttribute('data-tema', 'plano');

    // Cambió para esta pestaña, pero no quedó nada guardado.
    expect(await page.evaluate(() => localStorage.getItem('cgsi-tema'))).toBeNull();

    await page.reload();
    await expect(page.locator('html')).not.toHaveAttribute('data-tema', 'plano');
  });

  test('con «preferencias», el tema sí se guarda', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.locator('.aviso-cookies').getByRole('button', { name: 'Configuración' }).click();
    await page.locator('#cookies-preferencias').check();
    await page.getByRole('button', { name: 'Guardar mi selección' }).click();

    await page.locator('.interruptor-tema').click();
    expect(await page.evaluate(() => localStorage.getItem('cgsi-tema'))).toBe('plano');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-tema', 'plano');
  });
});

test.describe('vigencia de la decisión', () => {
  test('una decisión de otra versión de la política vuelve a preguntar', async ({ page }) => {
    await page.addInitScript(
      ([clave, valor]) => localStorage.setItem(clave as string, valor as string),
      [
        CLAVE_CONSENTIMIENTO,
        JSON.stringify({
          version: 'version-vieja',
          fecha: new Date().toISOString(),
          decision: { necesarias: true, preferencias: true, analitica: true, grabacion: true },
        }),
      ],
    );

    await page.goto('/');

    await expect(page.locator('.aviso-cookies')).toBeVisible();
  });

  test('una decisión vencida vuelve a preguntar', async ({ page }) => {
    await page.addInitScript(
      ([clave, valor]) => localStorage.setItem(clave as string, valor as string),
      [
        CLAVE_CONSENTIMIENTO,
        JSON.stringify({
          version: VERSION_POLITICA,
          fecha: '2024-01-01T00:00:00.000Z',
          decision: { necesarias: true, preferencias: true, analitica: true, grabacion: true },
        }),
      ],
    );

    await page.goto('/');

    await expect(page.locator('.aviso-cookies')).toBeVisible();
  });
});
