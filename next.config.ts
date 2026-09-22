import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const raiz = dirname(fileURLToPath(import.meta.url));

// La revisión del cajetín es la versión semántica de package.json (Parte A §4.1).
// No se calcula con `git rev-list`: el clon del proveedor puede ser superficial.
const { version } = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8')) as {
  version: string;
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // El repo es la raíz: sin esto Turbopack busca lockfiles en carpetas superiores.
  turbopack: { root: raiz },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
  },
  // Encabezados de seguridad y CSP (B.11): entran en F6, primero como Report-Only en preview.
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
