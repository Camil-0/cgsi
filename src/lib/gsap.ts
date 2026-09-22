'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Registro único de plugins (B.6.1). Nadie más llama a `registerPlugin`.
 * Solo ScrollTrigger y DrawSVG: la tabla de B.1 no admite ninguno más.
 *
 * Este módulo se carga en diferido desde `Movimiento`, así que GSAP no entra
 * en el JavaScript inicial (B.6.7 y B.12).
 */
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

export { DrawSVGPlugin, gsap, ScrollTrigger, useGSAP };
