import { expect, test } from '../utiles/playwright';

import type { Page } from '@playwright/test';

/** SEO y descubrimiento (F5, B.9). */

async function datosEstructurados(page: Page): Promise<Record<string, unknown>[]> {
  const crudos = await page.locator('script[type="application/ld+json"]').allTextContents();

  return crudos.map((texto) => JSON.parse(texto) as Record<string, unknown>);
}

test.describe('datos estructurados', () => {
  test('la portada declara Organization, WebSite y FAQPage', async ({ page }) => {
    await page.goto('/');

    const tipos = (await datosEstructurados(page)).map((dato) => dato['@type']);

    expect(tipos).toContain('Organization');
    expect(tipos).toContain('WebSite');
    expect(tipos).toContain('FAQPage');
  });

  test('el FAQ estructurado dice lo mismo que la página', async ({ page }) => {
    await page.goto('/');

    const faq = (await datosEstructurados(page)).find((dato) => dato['@type'] === 'FAQPage') as {
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
    };

    const enPantalla = await page.locator('.faq h4').allTextContents();

    expect(faq.mainEntity).toHaveLength(enPantalla.length);
    expect(faq.mainEntity.map((pregunta) => pregunta.name)).toEqual(enPantalla);
  });

  test('no se publica la dirección de la calle en el marcado', async ({ page }) => {
    await page.goto('/');

    const todo = JSON.stringify(await datosEstructurados(page));

    expect(todo).not.toContain('streetAddress');
    expect(todo).not.toContain('Transversal');
  });

  test('los memorandos declaran su miga de pan', async ({ page }) => {
    await page.goto('/memorandos');

    const tipos = (await datosEstructurados(page)).map((dato) => dato['@type']);

    expect(tipos).toContain('BreadcrumbList');
  });
});

test.describe('metadata', () => {
  test('la portada lleva descripción y canónica', async ({ page }) => {
    await page.goto('/');

    const descripcion = await page.locator('meta[name="description"]').getAttribute('content');
    expect(descripcion).toContain('Construimos el sistema que la ordena');
    expect((descripcion ?? '').length).toBeLessThanOrEqual(160);

    // La canónica es absoluta y se arma en el build con NEXT_PUBLIC_SITE_URL,
    // así que aquí se comprueba la ruta, no el dominio del servidor de pruebas.
    const canonica = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonica).toMatch(/^https?:\/\//);
    expect(new URL(canonica as string).pathname).toBe('/');
  });

  test('el título sigue el formato del brief', async ({ page }) => {
    await page.goto('/memorandos');

    await expect(page).toHaveTitle('Memorandos · CG Software Integration');
  });

  test('declara el idioma para cuando exista otro', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('link[rel="alternate"][hreflang="es-CO"]')).toHaveCount(1);
  });
});

test.describe('descubrimiento', () => {
  test('el sitemap lista las páginas publicadas', async ({ request }) => {
    const respuesta = await request.get('/sitemap.xml');
    expect(respuesta.ok()).toBe(true);

    const xml = await respuesta.text();
    expect(xml).toContain('<urlset');
    expect(xml).toContain('/memorandos');
    expect(xml).toContain('/politica-de-datos');
  });

  test('robots deja pasar el contenido y bloquea la API', async ({ request }) => {
    const respuesta = await request.get('/robots.txt');
    expect(respuesta.ok()).toBe(true);

    const texto = await respuesta.text();
    expect(texto).toContain('Allow: /');
    expect(texto).toContain('Disallow: /api/');
    expect(texto).toContain('Sitemap:');
  });

  test('el RSS es XML válido y declara su canal', async ({ request }) => {
    const respuesta = await request.get('/rss.xml');
    expect(respuesta.ok()).toBe(true);
    expect(respuesta.headers()['content-type']).toContain('application/rss+xml');

    const xml = await respuesta.text();
    expect(xml.startsWith('<?xml')).toBe(true);
    expect(xml).toContain('<title>Memorandos · CG Software Integration</title>');
    expect(xml).toContain('<language>es-CO</language>');
  });

  test('la imagen OG se sirve como PNG de 1200×630', async ({ page, request }) => {
    await page.goto('/');

    const url = await page.locator('meta[property="og:image"]').first().getAttribute('content');
    expect(url).toBeTruthy();

    // La URL es absoluta contra el dominio del build; se pide contra este servidor.
    const destino = new URL(url as string);
    const respuesta = await request.get(`${destino.pathname}${destino.search}`);
    expect(respuesta.ok()).toBe(true);
    expect(respuesta.headers()['content-type']).toContain('image/png');

    // Cabecera PNG: ancho y alto viven en los bytes 16–24.
    const bytes = await respuesta.body();
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
  });
});

test.describe('memorandos', () => {
  test('el listado explica que todavía no hay ninguno, sin inventar contenido', async ({ page }) => {
    await page.goto('/memorandos');

    await expect(page.locator('h1')).toHaveText('Memorandos');
    await expect(page.locator('[data-pendiente="memorandos"]')).toBeVisible();
  });

  test('se llega desde el pie del documento', async ({ page }) => {
    await page.goto('/');

    await page.locator('.pie a[href="/memorandos"]').click();

    await expect(page).toHaveURL(/\/memorandos$/);
  });
});
