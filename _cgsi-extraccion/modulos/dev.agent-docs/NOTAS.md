# dev.agent-docs · A (como plantilla) · confianza alta

- `CLAUDE.md`: contexto persistente del agente. Estructura reutilizable: fuentes de verdad en
  orden de precedencia («si chocan, detente y pregunta»), reglas duras (no inventar copy ni
  cifras, marcadores `{PENDIENTE}` visibles, ninguna dependencia fuera de la tabla, ningún
  despliegue sin aprobación escrita), voz y vocabulario prohibido, lista negra visual, stack
  cerrado con prohibiciones, árbol de carpetas, tokens, fases con criterio de salida, comandos,
  definición de terminado.
- `PROGRESS.md`: bitácora por fase con decisiones del fundador (fecha, tema, decisión, quién),
  desviaciones del brief con su razón, dependencias fuera del stack, marcadores abiertos, riesgos,
  y por cada fase: trabajo, pruebas con conteo y verificación del criterio de salida.
- `TODO.md`: solo lo que el agente **no puede** hacer, con pasos concretos y la variable de entorno
  que sale de cada punto.
- **Contenido específico de CGSI:** número comercial, nombre del fundador, nombre de un cliente
  (Essenza) y referencias de autorización. Al usarlo como plantilla se reemplaza.
- **Lección:** sin una prueba que los vigile, estos archivos se desfasan (ver `LECCIONES.md`,
  deuda 15).
