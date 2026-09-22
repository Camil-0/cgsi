/**
 * Consentimiento de cookies por categoría (Parte A §7.5 y §12 de la política).
 *
 * La decisión vive en `localStorage`, con la versión de la política y la fecha:
 * si la política cambia de versión, o pasan doce meses, se vuelve a preguntar.
 * Eso es lo que hace que el registro sirva como prueba consultable.
 *
 * Este módulo es lógica pura más un almacén observable. No toca React: los
 * componentes se suscriben con `useSyncExternalStore`.
 */

export const CATEGORIAS = ['necesarias', 'preferencias', 'analitica', 'grabacion'] as const;

export type Categoria = (typeof CATEGORIAS)[number];

/** Las necesarias no se pueden apagar: sin ellas no se puede recordar un «no». */
export const OBLIGATORIAS: readonly Categoria[] = ['necesarias'];

export type Decision = Record<Categoria, boolean>;

export type Consentimiento = {
  version: string;
  fecha: string;
  decision: Decision;
};

export const CLAVE = 'cgsi-consentimiento';

/** Doce meses, como dice la política. */
export const VIGENCIA_MESES = 12;

export const TODO_NO: Decision = {
  necesarias: true,
  preferencias: false,
  analitica: false,
  grabacion: false,
};

export const TODO_SI: Decision = {
  necesarias: true,
  preferencias: true,
  analitica: true,
  grabacion: true,
};

export function normalizar(decision: Partial<Decision>): Decision {
  const completa = { ...TODO_NO, ...decision };

  for (const categoria of OBLIGATORIAS) completa[categoria] = true;

  return completa;
}

export function vencio(consentimiento: Consentimiento, ahora: Date): boolean {
  const limite = new Date(consentimiento.fecha);
  if (Number.isNaN(limite.getTime())) return true;

  limite.setUTCMonth(limite.getUTCMonth() + VIGENCIA_MESES);

  return ahora.getTime() >= limite.getTime();
}

/**
 * Devuelve la decisión guardada, o `null` si no hay ninguna válida: porque nunca
 * se respondió, porque la política cambió de versión, porque venció, o porque lo
 * guardado no se puede leer.
 */
export function interpretar(
  crudo: string | null,
  versionActual: string,
  ahora = new Date(),
): Consentimiento | null {
  if (!crudo) return null;

  try {
    const guardado = JSON.parse(crudo) as Partial<Consentimiento>;

    if (typeof guardado?.version !== 'string' || typeof guardado?.fecha !== 'string') return null;
    if (guardado.version !== versionActual) return null;

    const consentimiento: Consentimiento = {
      version: guardado.version,
      fecha: guardado.fecha,
      decision: normalizar((guardado.decision ?? {}) as Partial<Decision>),
    };

    return vencio(consentimiento, ahora) ? null : consentimiento;
  } catch {
    return null;
  }
}

export function construir(decision: Partial<Decision>, version: string, ahora = new Date()) {
  return {
    version,
    fecha: ahora.toISOString(),
    decision: normalizar(decision),
  } satisfies Consentimiento;
}

/* ---------------------------------------------------------------- almacén */

type Escucha = () => void;

const escuchas = new Set<Escucha>();
let cache: Consentimiento | null | undefined;

function leerCrudo(): string | null {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

/** Snapshot estable: `useSyncExternalStore` compara por referencia. */
export function consentimientoActual(version: string): Consentimiento | null {
  if (cache === undefined) cache = interpretar(leerCrudo(), version);

  return cache;
}

export function guardar(decision: Partial<Decision>, version: string): Consentimiento {
  const consentimiento = construir(decision, version);

  try {
    localStorage.setItem(CLAVE, JSON.stringify(consentimiento));
  } catch {
    // Almacenamiento bloqueado: la decisión vale para esta sesión.
  }

  cache = consentimiento;
  for (const escucha of escuchas) escucha();

  return consentimiento;
}

export function suscribir(escucha: Escucha): () => void {
  escuchas.add(escucha);

  return () => {
    escuchas.delete(escucha);
  };
}

/**
 * Canal para volver a abrir la configuración desde cualquier parte del sitio
 * —el pie, por ejemplo— sin arrastrar el diálogo por props.
 */
export const EVENTO_CONFIGURAR = 'cgsi:configurar-cookies';

export function pedirConfiguracion(): void {
  window.dispatchEvent(new Event(EVENTO_CONFIGURAR));
}

/** Solo para pruebas: vacía la memoria del almacén. */
export function olvidar(): void {
  cache = undefined;
}

export function permite(consentimiento: Consentimiento | null, categoria: Categoria): boolean {
  if (OBLIGATORIAS.includes(categoria)) return true;

  return consentimiento?.decision[categoria] === true;
}
