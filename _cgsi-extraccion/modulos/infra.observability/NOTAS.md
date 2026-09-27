# infra.observability — `/api/salud` · B · confianza alta

- `GET /api/salud`: `{ estado, revision, build, integraciones: { firestore, agenda, whatsapp, analitica } }`,
  solo booleanos (nunca valores), `cache-control: no-store`, runtime Node.
- **Tests:** e2e «healthcheck» en `integraciones.spec.ts` (copiado en `booking.scheduling`).
- **Traducción:** `hayFirestore()` → un chequeo de Payload (`payload.db` inicializado) o un
  `select 1` contra Supabase, con timeout. Solo dice si hay configuración, no si hay conexión:
  conviene separar `/api/salud` (vivo) de `/api/salud/listo` (dependencias).
- `TODO.md` propone conectarlo a un monitor externo (Better Stack o UptimeRobot); no está hecho.
