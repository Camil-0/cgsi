import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#contenido': fileURLToPath(new URL('./.velite', import.meta.url)),
      // Guardia de empaquetado: en las pruebas no hay bundle de cliente que proteger.
      'server-only': fileURLToPath(new URL('./tests/utiles/server-only-vacio.ts', import.meta.url)),
    },
  },
});
