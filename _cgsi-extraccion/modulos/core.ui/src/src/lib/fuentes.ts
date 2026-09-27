import { JetBrains_Mono, Source_Sans_3, Source_Serif_4 } from 'next/font/google';

/**
 * Tipografía — Parte A §2.2 y Parte B §B.4.
 * Subset `latin`, `display: swap`, y los fallbacks de los documentos impresos.
 */

export const serif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz'],
  variable: '--f-serif',
  fallback: ['Georgia', 'serif'],
});

export const sans = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--f-sans',
  fallback: ['Calibri', 'system-ui', 'sans-serif'],
});

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--f-mono',
  fallback: ['ui-monospace', 'monospace'],
});

export const claseFuentes = `${serif.variable} ${sans.variable} ${mono.variable}`;
