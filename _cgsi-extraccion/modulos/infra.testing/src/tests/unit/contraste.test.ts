import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Contraste WCAG 2.2 AA sobre los tokens reales de `tokens.css` (B.13).
 *
 * B.3 deja marcado como «pendiente de verificar» que `--papel-2` y `--carbon`
 * del modo Plano son derivados nuevos. Esta prueba los mide.
 */

const tokensCss = readFileSync(
  fileURLToPath(new URL('../../src/styles/tokens.css', import.meta.url)),
  'utf8',
);

function tokensDe(selector: string): Record<string, string> {
  const inicio = tokensCss.indexOf(selector);
  const abre = tokensCss.indexOf('{', inicio);
  const cierra = tokensCss.indexOf('}', abre);
  const bloque = tokensCss.slice(abre, cierra);

  return Object.fromEntries(
    [...bloque.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{6});/g)].map((coincidencia) => [
      coincidencia[1] as string,
      coincidencia[2] as string,
    ]),
  );
}

function luminancia(hex: string): number {
  const canales = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = canales.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * (r as number) + 0.7152 * (g as number) + 0.0722 * (b as number);
}

function contraste(a: string, b: string): number {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return ((claro as number) + 0.05) / ((oscuro as number) + 0.05);
}

const papel = tokensDe(':root,');
const plano = tokensDe("[data-tema='plano']");

const textos = ['--tinta', '--grafito', '--lapiz', '--carbon', '--firma'] as const;
const superficies = ['--papel', '--papel-2'] as const;

describe('la medición reproduce los valores publicados en la Parte A §2.1', () => {
  const esperados: Array<[string, number]> = [
    ['--tinta', 15.3],
    ['--grafito', 12.7],
    ['--lapiz', 5.1],
    ['--carbon', 9.6],
    ['--firma', 7.0],
    ['--tachado', 6.6],
    ['--agregado', 5.7],
  ];

  for (const [token, esperado] of esperados) {
    it(`${token} sobre papel da ${esperado}:1`, () => {
      const medido = contraste(papel[token] as string, papel['--papel'] as string);

      // Las cifras del brief están redondeadas a un decimal.
      expect(Math.abs(medido - esperado)).toBeLessThanOrEqual(0.1);
    });
  }
});

describe('modo Papel: AA sobre las dos superficies', () => {
  for (const superficie of superficies) {
    for (const texto of textos) {
      it(`${texto} sobre ${superficie}`, () => {
        expect(contraste(papel[texto] as string, papel[superficie] as string)).toBeGreaterThanOrEqual(
          4.5,
        );
      });
    }
  }
});

describe('modo Plano: AA sobre las dos superficies', () => {
  for (const superficie of superficies) {
    for (const texto of textos) {
      it(`${texto} sobre ${superficie}`, () => {
        expect(contraste(plano[texto] as string, plano[superficie] as string)).toBeGreaterThanOrEqual(
          4.5,
        );
      });
    }
  }
});

describe('las líneas del diff se leen en los dos temas', () => {
  for (const [nombre, tema] of [
    ['Papel', papel],
    ['Plano', plano],
  ] as const) {
    for (const token of ['--tachado', '--agregado'] as const) {
      it(`${token} sobre las superficies de ${nombre}`, () => {
        for (const superficie of superficies) {
          expect(
            contraste(tema[token] as string, tema[superficie] as string),
            `${token} sobre ${superficie}`,
          ).toBeGreaterThanOrEqual(4.5);
        }
      });
    }
  }
});

describe('el texto sobre --firma se lee en los dos temas', () => {
  for (const [nombre, tema] of [
    ['Papel', papel],
    ['Plano', plano],
  ] as const) {
    it(`en modo ${nombre}`, () => {
      expect(
        contraste(tema['--texto-sobre-firma'] as string, tema['--firma'] as string),
      ).toBeGreaterThanOrEqual(4.5);
    });
  }
});
