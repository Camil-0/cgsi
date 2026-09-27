import { expect, test } from '../utiles/playwright';

/** Movimiento (F3): inventario de B.6, movimiento reducido y presupuesto de JS. */

function pideGsap(url: string): boolean {
  return /gsap|Animaciones|movimiento/i.test(url) && url.endsWith('.js');
}

test.describe('pestañas de expediente', () => {
  test('cumplen el patrón ARIA de pestañas', async ({ page }) => {
    await page.goto('/');

    const lista = page.locator('#expedientes [role="tablist"]');
    await expect(lista).toHaveAttribute('aria-label', 'Expedientes');

    const primera = page.locator('#pestana-essenza');
    const segunda = page.locator('#pestana-salud-ocupacional');

    await expect(primera).toHaveAttribute('aria-selected', 'true');
    await expect(primera).toHaveAttribute('aria-controls', 'panel-essenza');
    await expect(primera).toHaveAttribute('tabindex', '0');
    await expect(segunda).toHaveAttribute('tabindex', '-1');
  });

  test('se operan solo con teclado, con flechas, Inicio y Fin', async ({ page }) => {
    await page.goto('/');

    const primera = page.locator('#pestana-essenza');
    const segunda = page.locator('#pestana-salud-ocupacional');

    await primera.focus();
    await page.keyboard.press('ArrowRight');

    await expect(segunda).toBeFocused();
    await expect(segunda).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-salud-ocupacional')).toBeVisible();
    await expect(page.locator('#panel-essenza')).toBeHidden();

    await page.keyboard.press('Home');
    await expect(primera).toBeFocused();
    await expect(page.locator('#panel-essenza')).toBeVisible();

    await page.keyboard.press('End');
    await expect(segunda).toBeFocused();

    // La lista entera es una sola parada de tabulador.
    await page.keyboard.press('ArrowRight');
    await expect(primera).toBeFocused();
  });
});

test.describe('presupuesto y carga diferida', () => {
  test('GSAP no entra en el JavaScript inicial', async ({ page }) => {
    const antesDeHidratar: string[] = [];
    page.on('request', (peticion) => {
      if (pideGsap(peticion.url())) antesDeHidratar.push(peticion.url());
    });

    const respuesta = await page.goto('/', { waitUntil: 'commit' });
    const html = (await respuesta?.text()) ?? '';

    // El HTML no referencia el módulo de movimiento en sus scripts de arranque.
    const scripts = [...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]);
    expect(scripts.some((ruta) => pideGsap(ruta as string))).toBe(false);
  });

  test('con movimiento reducido no se descarga el módulo de movimiento', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const pedidos: string[] = [];
    page.on('request', (peticion) => pedidos.push(peticion.url()));

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    expect(pedidos.filter((url) => /gsap/i.test(url))).toEqual([]);
  });
});

test.describe('movimiento reducido', () => {
  test('todo queda en su estado final: los filetes se ven completos', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(page.locator('html')).not.toHaveAttribute('data-movimiento', 'si');

    const trazo = await page
      .locator('.portada [data-filete] line')
      .first()
      .evaluate((nodo) => getComputedStyle(nodo).strokeDashoffset);

    // Cadena vacía o cero: el filete no está recortado, se ve entero.
    expect(['', 'none', '0px', '0']).toContain(trazo);
  });

  test('la figura muestra los cinco estados sin depender del scroll', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const estados = page.locator('[data-figura-recorrido] .figura-estado');
    await expect(estados).toHaveCount(5);

    for (const estado of await estados.all()) {
      await expect(estado).not.toHaveClass(/activo/);
    }
  });
});

test.describe('con movimiento', () => {
  test('el doble filete de la portada termina dibujado', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const opacidad = await page
      .locator('.portada [data-filete] line')
      .first()
      .evaluate((nodo) => {
        const estilo = getComputedStyle(nodo);
        return { offset: estilo.strokeDashoffset, visible: estilo.visibility };
      });

    expect(opacidad.visible).toBe('visible');
    expect(Number.parseFloat(opacidad.offset)).toBeLessThan(1);
  });

  test('la figura marca sus estados al avanzar el scroll', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.locator('#expedientes').scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(600);

    const activos = await page.locator('[data-figura-recorrido] .figura-estado.activo').count();
    expect(activos).toBeGreaterThan(0);
  });
});
