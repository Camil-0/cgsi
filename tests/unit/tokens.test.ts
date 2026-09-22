import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Guardas sobre los tokens (Parte A §2.1, B.3):
 * los hex viven solo en tokens.css y los dos temas declaran el juego completo.
 */

const raiz = fileURLToPath(new URL('../..', import.meta.url));
const tokensCss = readFileSync(join(raiz, 'src/styles/tokens.css'), 'utf8');

const papel = {
  '--papel': '#f5f0e8',
  '--papel-2': '#ede8e0',
  '--tinta': '#0d1b2a',
  '--grafito': '#2a2a2a',
  '--lapiz': '#5a6778',
  '--carbon': '#3d3d3d',
  '--firma': '#2340c8',
  '--texto-sobre-firma': '#f5f0e8',
  '--tachado': '#9b2f24',
  '--agregado': '#2e6a4a',
} as const;

const plano = {
  '--papel': '#0d1b2a',
  '--papel-2': '#13253a',
  '--tinta': '#f5f0e8',
  '--grafito': '#f5f0e8',
  '--lapiz': '#9aa6b5',
  '--carbon': '#c9ced6',
  '--firma': '#8fa2ff',
  '--texto-sobre-firma': '#0d1b2a',
  '--tachado': '#e08a7e',
  '--agregado': '#7fc49a',
} as const;

function bloque(selector: string): string {
  const inicio = tokensCss.indexOf(selector);
  expect(inicio, `no existe el selector ${selector}`).toBeGreaterThan(-1);
  const abre = tokensCss.indexOf('{', inicio);
  const cierra = tokensCss.indexOf('}', abre);
  return tokensCss.slice(abre, cierra);
}

describe('tokens.css', () => {
  it('declara el juego completo del modo Papel', () => {
    const modoPapel = bloque(':root,');

    for (const [token, hex] of Object.entries(papel)) {
      expect(modoPapel, token).toContain(`${token}: ${hex};`);
    }
  });

  it('declara el juego completo del modo Plano', () => {
    const modoPlano = bloque("[data-tema='plano']");

    for (const [token, hex] of Object.entries(plano)) {
      expect(modoPlano, token).toContain(`${token}: ${hex};`);
    }
  });

  it('los dos temas declaran exactamente los mismos tokens', () => {
    expect(Object.keys(plano)).toEqual(Object.keys(papel));
  });

  it('cae al modo Plano con prefers-color-scheme cuando no hay JavaScript', () => {
    expect(tokensCss).toContain('@media (prefers-color-scheme: dark)');
    expect(tokensCss).toContain(":root:not([data-tema='papel'])");
  });
});

function archivosFuente(directorio: string): string[] {
  return readdirSync(directorio).flatMap((entrada) => {
    const ruta = join(directorio, entrada);
    if (statSync(ruta).isDirectory()) return archivosFuente(ruta);
    return /\.(ts|tsx|css)$/.test(entrada) ? [ruta] : [];
  });
}

describe('regla «ningún color escrito a mano» (B.3)', () => {
  // Tres excepciones, cada una con su razón:
  // - `tokens.css` es la fuente.
  // - `print.css` redefine los tokens para el papel impreso (B.14).
  // - `LienzoOg.tsx` lo compone satori, que no lee variables CSS; que esos hex
  //   sigan siendo los de `tokens.css` lo verifica `tests/unit/seo.test.ts`.
  const declaranColor = [
    join('styles', 'tokens.css'),
    join('styles', 'print.css'),
    join('seo', 'LienzoOg.tsx'),
  ];

  it('solo los archivos de tokens contienen valores hex', () => {
    const conHex = archivosFuente(join(raiz, 'src'))
      .filter((ruta) => !declaranColor.some((archivo) => ruta.endsWith(archivo)))
      .filter((ruta) => /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(ruta, 'utf8')))
      .map((ruta) => ruta.slice(raiz.length));

    expect(conHex).toEqual([]);
  });
});
