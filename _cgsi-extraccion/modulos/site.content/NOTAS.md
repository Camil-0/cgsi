# site.content — Velite + MDX · B · confianza baja

- `velite.config.ts`: cuatro colecciones con esquemas `s.*` (Zod), `strict: true`. Reglas que
  hacen fallar el build: un expediente no confidencial sin `autorizacion`; una política sin
  `vigenteDesde`. `documento` guarda además el MDX crudo (`s.raw()`) para `extraer.ts`.
- `Mdx.tsx`: evalúa con `new Function` el cuerpo que compila Velite y le inyecta el mapa de
  componentes (con la tipografía del sistema en `h2…hr` y enlaces internos por el router). Corre
  solo en el servidor.
- **Por qué confianza baja:** Payload reemplaza Velite entero. Lo que sobrevive:
  - Los esquemas → campos de Payload (ver `DOMINIO.md` §3).
  - Las reglas de build → `validate` de campo (`autorizacion` obligatoria si `!confidencial`;
    `vigenteDesde` `required`). Con Payload se validan al guardar, no al compilar: se pierde la
    garantía de «el build falla».
  - El mapa de componentes MDX → referencia para los bloques/converters de Lexical.
  - `new Function` **no se porta**.
- **Tests:** solo indirectos (`copy.test.ts`, clase C, y las e2e de contenido).
