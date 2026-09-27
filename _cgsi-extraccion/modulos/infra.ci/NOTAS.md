# infra.ci · A · confianza media

- `.github/workflows/ci.yml`: job `verificar` (checkout → pnpm → Node desde `.nvmrc` con caché →
  `install --frozen-lockfile` → lint → typecheck → unit → build → Chromium de Playwright → e2e →
  a11y; sube el reporte si falla) y job `dependencias` (`pnpm audit --audit-level high`).
  `concurrency` cancela las corridas viejas de la misma rama.
- `.github/dependabot.yml`: npm y github-actions, semanal.
- `.nvmrc`: Node 24.
- **Falta:** Lighthouse CI (F6), despliegue y variables secretas de CI. Las e2e del webhook corren
  sin `CAL_WEBHOOK_SECRET` y por eso aceptan 503.
- **Confianza media:** `NO VERIFICADO` que haya corrido en GitHub. `TODO.md` §1 dice que no había
  remoto, y hoy sí lo hay.
- El `push` solo dispara en `main`, pero la rama por defecto de este repo es `master`: los pushes
  a `master` no corren CI (solo los PR).
