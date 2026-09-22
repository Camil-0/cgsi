/**
 * `server-only` es un guardia de empaquetado: revienta si un módulo de servidor
 * termina en el bundle del cliente. En Vitest no hay bundle de cliente, así que
 * se reemplaza por este módulo vacío.
 */
export {};
