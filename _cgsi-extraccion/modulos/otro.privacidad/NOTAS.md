# otro.privacidad — Consentimiento y derechos del titular

**Por qué `otro`:** ninguna entrada de la taxonomía cubre la base legal del tratamiento de datos.
`analytics` mide, pero no decide si se puede medir. Colombia (Ley 1581 de 2012, Decreto 1377 de
2013) aplica a todos los proyectos de CGSI, así que este módulo es transversal.

## Candidato 5 · Consentimiento de cookies por categoría · A · confianza alta
- **Qué hace:** cuatro categorías (`necesarias` fija; `preferencias`, `analitica`, `grabacion`).
  La decisión se guarda en `localStorage['cgsi-consentimiento']` con la `version` de la política y
  la `fecha`. `interpretar` devuelve `null` si la versión cambió, si pasaron 12 meses o si lo
  guardado está corrupto, y entonces se vuelve a preguntar. Es un almacén observable que se
  consume con `useSyncExternalStore` (sin provider). Se abre desde cualquier lado con un evento
  `cgsi:configurar-cookies`.
- **UI:** `AvisoCookies` (barra + `<dialog>` nativo con foco atrapado), `BotonConfigurarCookies`
  (pie), `AvisoPrivacidad` (aviso corto con enlace a la política).
- **Archivos:** `src/lib/consentimiento.ts`, `src/lib/politica.ts`, `src/components/consentimiento/*`,
  `src/components/contacto/AvisoPrivacidad.tsx`.
- **Deps:** `react@19.3.0`, `next-intl@4.14.6`. **Env:** ninguna.
- **Tests:** `tests/unit/consentimiento.test.ts`, `tests/e2e/cookies.spec.ts` (verifica que sin
  «analítica» no se monta nada y sin «preferencias» no se guarda el tema).
- **Al portar:** `politica.ts` lee `legal` de Velite (`#contenido`) → `payload.findGlobal({ slug: 'politica' })`.
  Las clases CSS (`aviso-cookies`, `dialogo-cookies`, `categoria…`) viven en `documento.css`, que
  no se copió. Si el kit necesita prueba del consentimiento **del lado de CGSI**, falta una
  colección: hoy solo existe en el navegador del visitante.

## Candidato 6 · Consulta y supresión del titular · B · confianza media
- **Qué hace:** `prospectos-exportar.ts --correo X` devuelve todo lo guardado con sus eventos (art.
  14). `prospectos-suprimir.ts --correo X [--confirmar]` corre en seco por defecto; con
  confirmación borra los eventos y el prospecto y deja una constancia en `supresiones` con la
  huella SHA-256 (16 hex) del correo normalizado (art. 15).
- **Deps:** `firebase-admin@14.4.0`. `tsx` se menciona, pero **no está instalado**.
- **Tests:** ninguno.
- **Traducción a Payload:** endpoints de administración con access `isAdmin`:
  `payload.find({ collection: 'prospectos', where: { correo: { equals } } })`, luego `delete`
  (con `ON DELETE CASCADE` en eventos), luego `create` en la colección `supresiones` (sin
  `update` ni `delete`).
- **Corregir:** normalizar el correo en la búsqueda, igual que en la huella.
