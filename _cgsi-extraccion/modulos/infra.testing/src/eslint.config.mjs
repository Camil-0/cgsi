import next from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const configuracion = [
  {
    ignores: [
      '.next/**',
      '.velite/**',
      'node_modules/**',
      'docs/**',
      'design/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
    ],
  },
  ...next,
  ...nextTypeScript,
];

export default configuracion;
