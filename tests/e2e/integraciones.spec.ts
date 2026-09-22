import { createHmac } from 'node:crypto';
import { expect, test } from '../utiles/playwright';

/** Integraciones (F4): webhook, healthcheck, WhatsApp y agenda diferida. */

const cuerpo = JSON.stringify({
  triggerEvent: 'BOOKING_CREATED',
  payload: {
    uid: 'prueba-e2e',
    attendees: [{ name: 'Ana Ruiz', email: 'ana@ejemplo.com' }],
  },
});

test.describe('webhook de Cal.com', () => {
  test('rechaza un cuerpo sin firma', async ({ request }) => {
    const respuesta = await request.post('/api/cal/webhook', {
      headers: { 'content-type': 'application/json' },
      data: cuerpo,
    });

    // 401 si hay secreto configurado; 503 si todavía no lo hay (ver TODO.md).
    expect([401, 503]).toContain(respuesta.status());
  });

  test('rechaza una firma que no corresponde al cuerpo', async ({ request }) => {
    const respuesta = await request.post('/api/cal/webhook', {
      headers: {
        'content-type': 'application/json',
        'x-cal-signature-256': createHmac('sha256', 'secreto-equivocado').update(cuerpo).digest('hex'),
      },
      data: cuerpo,
    });

    expect([401, 503]).toContain(respuesta.status());
  });

  test('nunca responde 200 a algo sin firmar', async ({ request }) => {
    const respuesta = await request.post('/api/cal/webhook', { data: '{}' });

    expect(respuesta.status()).not.toBe(200);
  });
});

test.describe('healthcheck', () => {
  test('dice qué integraciones están configuradas, sin filtrar valores', async ({ request }) => {
    const respuesta = await request.get('/api/salud');
    expect(respuesta.ok()).toBe(true);

    const cuerpoJson = (await respuesta.json()) as {
      estado: string;
      revision: string;
      integraciones: Record<string, boolean>;
    };

    expect(cuerpoJson.estado).toBe('ok');
    expect(cuerpoJson.revision).toMatch(/^\d+\.\d+\.\d+$/);

    for (const valor of Object.values(cuerpoJson.integraciones)) {
      expect(typeof valor).toBe('boolean');
    }

    expect(JSON.stringify(cuerpoJson)).not.toContain('phc_');
    expect(JSON.stringify(cuerpoJson)).not.toContain('PRIVATE');
  });
});

test.describe('WhatsApp', () => {
  test('el enlace es wa.me con el texto prellenado, y el número no toca ninguna API', async ({
    page,
  }) => {
    await page.goto('/');

    const enlaces = page.locator('a[href^="https://wa.me/"]');
    expect(await enlaces.count()).toBeGreaterThan(0);

    const destino = await enlaces.first().getAttribute('href');
    expect(destino).toMatch(/^https:\/\/wa\.me\/\d{8,15}\?text=/);
    expect(decodeURIComponent(destino as string)).toContain('vengo del sitio de CGSI');

    await expect(enlaces.first()).toHaveAttribute('rel', /noopener/);
  });
});

test.describe('agenda', () => {
  test('no descarga nada de Cal.com al abrir la página', async ({ page }) => {
    const deCal: string[] = [];
    page.on('request', (peticion) => {
      if (/cal\.com/i.test(peticion.url())) deCal.push(peticion.url());
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    expect(deCal).toEqual([]);
  });
});
