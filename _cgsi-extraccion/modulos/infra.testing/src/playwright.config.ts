import { defineConfig, devices } from '@playwright/test';

/**
 * Pruebas de navegador (B.16). Las e2e corren a 390 px y a 1440 px;
 * el tema Papel/Plano se emula dentro de cada prueba.
 */

const PUERTO = 3100;
const baseURL = `http://127.0.0.1:${PUERTO}`;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
  },
  projects: [
    {
      name: 'e2e',
      testDir: 'tests/e2e',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'e2e-movil',
      testDir: 'tests/e2e',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'a11y',
      testDir: 'tests/a11y',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    // En CI el build ya corrió como paso propio del pipeline (B.16).
    command: process.env.CI
      ? `pnpm exec next start --port ${PUERTO}`
      : `pnpm build && pnpm exec next start --port ${PUERTO}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: {
      NEXT_PUBLIC_SITE_URL: baseURL,
      NEXT_PUBLIC_WHATSAPP_NUMERO: '573238134588',
    },
  },
});
