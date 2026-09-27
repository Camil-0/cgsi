# comms.whatsapp

## Candidato 8 · Adaptador de mensajería · A · confianza media
- **Qué hace:** interfaz `Mensajeria { enviarTexto(destino, texto): Promise<Resultado> }`.
  `mensajeria()` elige el proveedor por `MENSAJERIA_PROVEEDOR` (`evolution | cloud | ninguno`,
  `ninguno` por defecto). `avisar()` envía a `NOTIFICACIONES_DESTINO` con `Promise.race` contra un
  tope de 3 s. Ningún proveedor lanza: todos devuelven `{ ok, id?, error? }`.
- **Archivos:** `src/lib/mensajeria/{index,evolution,cloud-api,ninguno}.ts`.
- **Deps:** ninguna (usa `fetch`), `server-only@0.0.1`.
- **Env:** `MENSAJERIA_PROVEEDOR`, `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCIA`,
  `NOTIFICACIONES_DESTINO`. `WHATSAPP_PHONE_NUMBER_ID` y `WHATSAPP_TOKEN` se leen **fuera** de
  `env.ts`.
- **Tests:** `tests/unit/mensajeria.test.ts` (nulo, Evolution con `fetch` simulado, texto). Cloud
  API no tiene tests.
- **Para el stack destino (Twilio):** falta `twilio.ts` detrás de la misma interfaz:
  `client.messages.create({ from: 'whatsapp:+…', to: 'whatsapp:+…', body })`, y fuera de la
  ventana de 24 h, `contentSid` + `contentVariables` (plantilla aprobada). Se agrega `'twilio'` al
  enum de `env.ts` con su `superRefine` de credenciales, igual que Evolution. El patrón (nulo por
  defecto, errores como valor, tope de tiempo) se conserva tal cual.
- **Reglas de negocio de este repo:** el número comercial nunca se conecta a una API; nunca se
  envían mensajes automáticos a prospectos. Solo avisos internos al fundador.

## Candidato 9 · Botón `wa.me` · A · confianza alta
- `src/components/contacto/BotonWhatsApp.tsx` (servidor): `https://wa.me/{numero}?text=…`, con el
  texto de `messages` (`contacto.whatsappTexto`). Sin número, muestra un pendiente visible.
- **Env:** `NEXT_PUBLIC_WHATSAPP_NUMERO` (solo dígitos, 8–15).
- **Tests:** e2e «WhatsApp» en `integraciones.spec.ts` (copiado en `booking.scheduling`).
