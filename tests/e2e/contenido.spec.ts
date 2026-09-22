import { expect, test } from '@playwright/test';

/** Contenido (F2): el documento, los expedientes, la política y el folio no encontrado. */

test.describe('portada y franja', () => {
  test('muestra el membrete, el título y los dos llamados a la acción', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toHaveText('Tu empresa ya no cabe en WhatsApp y Excel.');
    await expect(page.locator('.membrete')).toHaveText('CG Software Integration');

    await expect(page.locator('.cta-primario')).toHaveText('Agendar diagnóstico');
    await expect(page.locator('.cta-microcopy')).toHaveText('30 minutos · sin costo');
    await expect(page.locator('.cta-secundario')).toHaveText('Escribir por WhatsApp');
  });

  test('la franja lleva sus seis puntos y tres notas', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.franja li')).toHaveCount(6);
    await expect(page.locator('.franja .nota')).toHaveCount(3);
  });

  test('el bloque Para / De es una lista de definiciones', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.destinatario dt')).toHaveCount(2);
    await expect(page.locator('.destinatura dd, .destinatario dd').first()).toContainText(
      'quien dirige una empresa',
    );
  });
});

test.describe('secciones', () => {
  test('II lista las cuatro líneas con sus exclusiones', async ({ page }) => {
    await page.goto('/');

    const alcance = page.locator('#alcance');
    await expect(alcance.locator('h3')).toHaveCount(4);
    await expect(alcance).toContainText('No incluye');
  });

  test('III muestra el cronograma de seis semanas', async ({ page }) => {
    await page.goto('/');

    // Semanas 0, 1–2, 3–4, 5 y 6: cinco filas para seis semanas.
    const filas = page.locator('#como-trabajamos .tabla tbody tr');
    await expect(filas).toHaveCount(5);
    await expect(filas.first()).toContainText('Diagnóstico');
    await expect(filas.last()).toContainText('Lanzamiento');
  });

  test('IV muestra los dos expedientes, y el confidencial va sin cliente', async ({ page }) => {
    await page.goto('/');

    const expedientes = page.locator('#expedientes .expediente');
    await expect(expedientes).toHaveCount(2);
    await expect(expedientes.first()).toContainText('Essenza');
    await expect(expedientes.nth(1)).toContainText('Confidencial');
  });

  test('IV incluye la figura del recorrido con sus cinco estados', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('[data-figura-recorrido] .figura-estado')).toHaveCount(5);
    await expect(page.locator('[data-figura-recorrido] figcaption')).toContainText('Fig. 1');
  });

  test('VI cierra con la firma tipográfica, nunca con una imagen', async ({ page }) => {
    await page.goto('/');

    const firma = page.locator('#lo-que-firmamos');
    await expect(firma).toContainText('Camilo Charris C.');
    await expect(firma.locator('img')).toHaveCount(0);
  });

  test('VII lleva la agenda, el aviso de privacidad y siete aclaraciones', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('[data-pendiente="agenda-f4"]')).toBeVisible();
    await expect(page.locator('.aviso-privacidad')).toContainText('Autorizo a CG Software');
    await expect(page.locator('.faq h4')).toHaveCount(7);
  });
});

test.describe('política de datos', () => {
  test('se llega desde el aviso y desde el pie', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.aviso-privacidad a')).toHaveAttribute(
      'href',
      '/politica-de-datos',
    );
    await expect(page.locator('.pie a[href="/politica-de-datos"]')).toHaveCount(1);
  });

  test('publica su versión y su fecha de vigencia', async ({ page }) => {
    await page.goto('/politica-de-datos');

    await expect(page.locator('h1')).toContainText('Política de Tratamiento de Datos Personales');
    await expect(page.locator('main')).toContainText(/Versión 1\.0 · Vigente desde \d{2}\.\d{2}\./);
    await expect(page.locator('main h2')).toHaveCount(14);
  });
});

test.describe('folio no encontrado', () => {
  test('el 404 usa el mismo cajetín y enlaza al índice', async ({ page }) => {
    const respuesta = await page.goto('/folio-que-no-existe');

    expect(respuesta?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText('Folio no encontrado');
    await expect(page.locator('.cajetin')).toContainText('Ref. CSI-2026-WEB-001');
    await expect(page.locator('main a[href="/"]')).toHaveCount(1);
  });
});
