# CGSI — Brief del sitio web: creativo, contenido y especificación técnica

**Territorio:** «Por escrito»
**Referencia:** CSI-2026-WEB-001 · Rev. 2 · 21.09.2026
**Estado:** decisiones cerradas. La Parte A (secciones 0–11) es para diseño y contenido; la Parte B es la especificación técnica para el agente que implementa. Los pendientes de lanzamiento están en la sección 11.

# Parte A — Creativo y contenido

---

## 0. Decisiones cerradas

| Tema | Decisión |
|---|---|
| Territorio | «Por escrito»: la página es una propuesta comercial dirigida al visitante, con el sistema de las propuestas y contratos de CGSI, y se comporta como software. |
| Cliente objetivo | Empresas cuya operación creció más rápido que sus procesos. Menos clientes, ticket alto, todo a la medida. |
| Oferta | Agencia de software de servicio completo, liderada por sistemas de operación. Cuatro líneas (sección 3, II). |
| Precios | No se publican cifras ni pisos. Diagnóstico de 30 minutos sin costo. |
| Canales | Móvil primero. WhatsApp al mismo nivel que la agenda. |
| Casos | Essenza, con nombre y sujeto a la autorización CSI-2026-ESSENZA-002. Salud ocupacional, anonimizado. |
| Quién firma | Camilo Charris C., Fundador. Firma compuesta en tipografía, nunca la manuscrita real. |
| Idioma | Español, con andamiaje multilenguaje desde el día uno. |
| Agenda | Cal.com, plan gratuito. |
| Blog | «Memorandos», en MDX dentro del repositorio. |
| Seguridad | Ley 1581 de 2012 y prácticas alineadas con ISO/IEC 27001, con cinco controles. HIPAA solo como tema a evaluar en el diagnóstico. |
| Respuesta | Menos de una hora hábil por WhatsApp. |
| Paleta | Tokens web propios: «firmar, tachar, agregar» (sección 2.1). |
| Movimiento | GSAP (ScrollTrigger + DrawSVG) para lo ligado al scroll; View Transitions para las pestañas. Sin smooth scroll ni texto partido. |
| WhatsApp | El número comercial sigue en la app WhatsApp Business. Evolution API solo en un número secundario, para notificaciones internas. |
| Política de datos | Redactada (archivo `politica-de-datos.md`); falta validación legal y la fecha de publicación. |
| Propiedad del código | En todo material comercial: «licencia de uso perpetua, irrevocable y transferible, con entrega del repositorio». |

---

## 1. Mensaje

**Posicionamiento interno** (no va literal en la página): para quien dirige una empresa cuya operación creció más rápido que sus herramientas, CGSI diseña y construye el sistema que la ordena, con todo por escrito: alcance, inversión, plazos, garantía y licencia sobre el código.

**Reglas de voz**
1. Toda afirmación fuerte lleva su respaldo en una nota numerada al margen.
2. Ninguna cifra va sin fuente y fecha.
3. Las exclusiones se dicen («No incluye»).
4. Se tutea al lector, con estructura formal y trato cercano.
5. Frases cortas, sin adjetivos que no se puedan probar.

**Vocabulario prohibido:** vanguardia, soluciones innovadoras, transformación digital, a la medida de tus necesidades, crecemos contigo, ingenieros dedicados, consulta gratis, cumplimos HIPAA, certificados en ISO, «+X % de eficiencia» sin fuente.

---

## 2. Sistema visual

### 2.1 Paleta: tokens web

Cada color saturado tiene un solo significado, tomado de un gesto de oficina: firmar, tachar y agregar.

**Modo Papel (día)**

| Token CSS | Hex | Uso | Contraste sobre papel |
|---|---|---|---|
| `--papel` | #F5F0E8 | Fondo | — |
| `--papel-2` | #EDE8E0 | Superficies, filas alternas | — |
| `--tinta` | #0D1B2A | Titulares, filete grueso | 15,3:1 |
| `--grafito` | #2A2A2A | Texto de cuerpo | 12,7:1 |
| `--lapiz` | #5A6778 | Notas al margen, metadatos | 5,1:1 |
| `--carbon` | #3D3D3D | Numerales romanos, guiones, filete fino | 9,6:1 |
| `--firma` | #2340C8 | Único color de acción: CTA, enlaces, foco, firma, sello «Recibido» | 7,0:1 (texto papel sobre firma: 7,0:1) |
| `--tachado` | #9B2F24 | Solo líneas «−» del diff | 6,6:1 |
| `--agregado` | #2E6A4A | Solo líneas «+» del diff | 5,7:1 |

**Modo Plano (noche):**
- `--papel` → #0D1B2A
- `--grafito` y `--tinta` → #F5F0E8 (15,3:1)
- `--lapiz` → #9AA6B5 (7,0:1)
- `--firma` → #8FA2FF (7,3:1)
- `--tachado` → #E08A7E
- `--agregado` → #7FC49A

En modo Plano, las figuras de líneas se leen como cianotipos sin dibujar nada adicional.

**Reglas de uso**
- El diff nunca comunica solo con color: siempre lleva «−» / «+», y tachado en las líneas que se quitan.
- `--firma` no se usa como decoración.
- El SLATE de los documentos (#6B7A8D) no se usa para texto en pantalla, porque no pasa AA.

### 2.2 Tipografía

| Rol | Fuente | Fallback | Uso |
|---|---|---|---|
| Titulares | Source Serif 4, tamaño óptico display | Georgia | Portada, numerales, títulos de sección |
| Texto e interfaz | Source Sans 3 | Calibri, system-ui | Cuerpo, navegación, formularios |
| Metadatos | JetBrains Mono | ui-monospace | Cajetín, códigos, stack, fechas, notas de fundamento |

**Alternativa a probar en Claude Design:** Newsreader para titulares.

**Escala:** portada `clamp(2.75rem, 6vw, 5.5rem)`; título de sección `clamp(1.75rem, 3vw, 2.5rem)`; cuerpo 1.0625rem con interlineado 1.6; metadatos mono de 0.75 a 0.8125rem con tracking +0.02em. El carácter moderno sale del contraste entre titulares muy grandes y metadatos muy pequeños, con mucho aire.

### 2.3 Retícula

- **Escritorio (≥1024 px):** 12 columnas.
  - Columnas 1–2: índice de secciones (I–VII), fijo, con la sección actual resaltada.
  - Columnas 3–9: texto principal, con un máximo de 68 caracteres por línea.
  - Columnas 10–12: notas al margen y figuras pequeñas.
- **Móvil:** una columna. Las notas se abren con un toque, al estilo Tufte, y el cajetín pasa a ser una barra delgada inferior.
- **Márgenes seguros:** `viewport-fit=cover` y `env(safe-area-inset-*)`.

### 2.4 Movimiento

- **Firma de movimiento:** el doble filete (tinta grueso y carbón fino) se traza al entrar a cada sección.
- **Transición lateral:** al cambiar de pestaña de expediente, con View Transitions. Donde no hay soporte, el cambio es instantáneo.
- **Animaciones ligadas al scroll:** GSAP ScrollTrigger, que funciona igual en todos los navegadores, incluido Firefox (donde las animaciones CSS ligadas al scroll todavía no están habilitadas por defecto). Sin JavaScript o con movimiento reducido, cada elemento aparece en su estado final. Detalle en B.6.
- **Cronograma:** en escritorio cabe completo. En móvil se desliza con scroll-snap nativo y controles visibles.
- **Prohibido:** preloader, smooth scroll global, cursor personalizado, texto partido en cada titular, marquesinas, scrolljacking.
- **Accesibilidad:** se respeta `prefers-reduced-motion`. Las duraciones van de 150 a 300 ms.

### 2.5 Lista negra visual

Queda fuera:
- Bento grid, glassmorphism, gradientes tipo aurora.
- Partículas o blobs 3D, líneas topográficas, image-sequence.
- Fotos de stock y logos de tecnología en fila.

---

## 3. Copy final por sección

> Las notas numeradas van al margen en escritorio y se abren con un toque en móvil.

### Portada

- **Membrete:** C G S O F T W A R E I N T E G R A T I O N
- **Título:** Tu empresa ya no cabe en WhatsApp y Excel.
- **Subtítulo:** Construimos el sistema que la ordena: pedidos, despachos, clientes y reportes en un solo lugar.
- **Para:** quien dirige una empresa que creció más rápido que sus procesos.
- **De:** CG Software Integration S.A.S. · Bogotá D.C.
- **CTA primario:** Agendar diagnóstico. Microcopy: «30 minutos · sin costo».
- **CTA secundario:** Escribir por WhatsApp.
- **Cajetín:** `Ref. CSI-2026-WEB-001 · Rev. {versión} · {fecha del despliegue} · Pág. {sección}/VII`

### Franja «Lo que siempre incluye»

- Partimos de cómo opera tu equipo hoy, no de una plantilla. *Al margen, en mono: `Next.js · TypeScript · Firebase`.*
- Primera versión en producción en semanas, no en meses.¹
- Respondemos en menos de una hora hábil.²
- Hablas con quien construye. El equipo crece con el proyecto.
- Soporte incluido después del lanzamiento.³
- Tus datos, bajo la ley colombiana. → VI

¹ Cronograma de referencia de seis semanas; ver III.
² Lunes a viernes, de 8:00 a 18:00, hora de Colombia, por WhatsApp.
³ El período se fija en cada contrato: tres meses en nuestro contrato tipo.

### I. Punto de partida

Casi todas las empresas con las que trabajamos llegan con alguno de estos síntomas:

— El pedido que se perdió en un chat de WhatsApp.
— El Excel que solo entiende una persona, y esa persona está de vacaciones.
— El sitio web que nadie actualiza desde que se lanzó.
— El desarrollador que se fue y nadie sabe cómo funciona lo que dejó.

Los tres primeros se resuelven con software. El cuarto se evita por escrito (ver VI).

### II. Alcance

Diseñamos, construimos y operamos software a la medida. Trabajamos en cuatro líneas.

**2.1 Sistemas de operación y administración.** Pedidos, despachos, inventario, agendas, roles y tableros, conectados a WhatsApp para que tus clientes y tu equipo se enteren solos.
*Incluye:* diseño del flujo, desarrollo, despliegue y capacitación. *No incluye:* contabilidad, nómina ni facturación electrónica; nos integramos con el software que ya usas para eso.

**2.2 Sitios y plataformas web.** Sitios corporativos, catálogos y portales rápidos, administrables y listos para buscadores.
*Incluye:* diseño, desarrollo, SEO técnico y publicación autónoma de contenido. *No incluye:* producción de fotografía o video, ni redacción continua de contenido.

**2.3 Integraciones y automatización.** Conectamos las herramientas que ya tienes (WhatsApp, calendarios, pagos, hojas de cálculo) para que nadie copie información a mano.
*Incluye:* diseño de la integración, desarrollo y monitoreo. *No incluye:* el costo de las APIs de terceros, que se traslada a costo real y se detalla en la propuesta.

**2.4 Interfaces para productos existentes.** Diseñamos y construimos la interfaz de productos que ya tienen backend.
*Incluye:* diseño de interfaz, desarrollo y accesibilidad. *No incluye:* rediseño del backend existente.

> Las exclusiones son una propuesta de CGSI y se ajustan si alguna no corresponde a lo que realmente vendes.

### III. Cómo trabajamos

**Cronograma de referencia: seis semanas.**

| Semana | Fase | Qué pasa | Entregable |
|---|---|---|---|
| 0 | Diagnóstico | Conversación de 30 minutos, sin costo, sobre cómo opera tu equipo hoy. | Propuesta escrita en 5 días hábiles. |
| 1–2 | Fundamentos | Flujo, diseño y arquitectura. | Diseño aprobado. |
| 3–4 | Desarrollo | Revisión semanal contigo. | Versión funcional en pruebas. |
| 5 | Integración | WhatsApp, pagos y datos reales. | Sistema completo probado. |
| 6 | Lanzamiento | Producción y capacitación. | Entrega del repositorio y la documentación. |

Los proyectos más grandes se dividen en entregas de este tamaño.

### IV. Expedientes

Se presentan con pestañas de carpeta y transición lateral entre ellas.

**Expediente 01 — Essenza**
`Sistema de operación · Floristería · Next.js · Firebase · WhatsApp`

- **Punto de partida:** los pedidos llegaban por WhatsApp. El equipo los anotaba a mano, coordinaba cada pago y calculaba sin datos qué flores comprar cada día.
- **Lo que construimos:** una plataforma que digitaliza el proceso de extremo a extremo. Incluye catálogo web con carrito y personalización de cada arreglo, registro de clientes y un panel de operación con vista de producción diaria y desglose de flores por arreglo. Tiene accesos diferenciados para operación y reparto, y envía notificaciones automáticas por WhatsApp en cada cambio de estado del pedido.
- **Diff:**
  - `−` El pedido llega por WhatsApp y alguien lo copia en un cuaderno.
  - `+` El pedido entra al sistema y el cliente recibe confirmación automática.
  - `−` Cada mañana se calcula a mano qué flores comprar.
  - `+` La vista de producción suma las flores de cada arreglo del día.
- **Fig. 1 — Recorrido de un pedido:** Pedido recibido → Pago confirmado → En armado → En camino → Entregado. Al margen, el mensaje de WhatsApp que recibe el cliente en cada estado.
- **Resultado:** desde marzo de 2026, el 100 % de los pedidos de Essenza se gestiona en la plataforma, que recibe mejoras cada mes.⁴
- **Testimonio:** solo el texto del Anexo 2, aprobado y firmado.
- ⁴ Dato confirmado por escrito por Essenza. Ref. CSI-2026-ESSENZA-002.

**Expediente 02 — Salud ocupacional** `Confidencial`

Plataforma SaaS para la evaluación de riesgo psicosocial en empresas colombianas. En producción, con su primer piloto en despliegue. Somos el socio tecnológico.⁵

Este expediente va sin nombre y sin capturas.

⁵ Los datos de salud se tratan como datos sensibles (Ley 1581 de 2012, art. 5).

### V. Inversión

Cada proyecto es a la medida, así que no publicamos tarifas. Sí publicamos cómo llegamos a una cifra:

1. Diagnóstico de 30 minutos, sin costo.
2. Propuesta escrita en 5 días hábiles, con alcance, exclusiones, cronograma e inversión cerrada.
3. Pagos por hitos, contra entregables aprobados.
4. Mensualidad de operación (infraestructura, mantenimiento y soporte) cuando el sistema la requiere.

La inversión no cambia sin una solicitud de cambio aprobada por escrito.⁶

⁶ Cláusula 4.4 del contrato tipo.

### VI. Lo que firmamos

**Lo que prometemos, lo firmamos.**
Estas no son promesas de marketing: son cláusulas de nuestro contrato tipo.

- **Recibes el código y puedes seguir con quien quieras.** Licencia de uso perpetua, irrevocable y transferible sobre el software hecho para ti, con entrega del repositorio y la documentación. Puedes contratar a un tercero para mantenerlo.⁷
- **Seis meses de garantía sobre defectos** atribuibles a nuestro código.⁸
- **Soporte incluido después del lanzamiento:** tres meses en nuestro contrato tipo.⁹
- **Los cambios de alcance se aprueban por escrito** antes de hacerse.⁶
- **Tu tarifa de operación sube, como máximo, IPC + 0,6 %,** con tope de 8 % al año.¹⁰
- **Confidencialidad y protección de datos personales.**¹¹

**Datos y seguridad**
- Cumplimos la Ley 1581 de 2012 de protección de datos personales. Los datos de salud los tratamos como datos sensibles.
- Construimos con prácticas alineadas con ISO/IEC 27001: cifrado en tránsito y en reposo, acceso por roles, registro de auditoría, respaldos automáticos y mínimo privilegio.¹²
- ¿Tu empresa está sujeta a HIPAA u otra regulación extranjera? Lo revisamos contigo en el diagnóstico.

**Firma:** Camilo Charris C. — Fundador, CG Software Integration. Compuesta en tipografía sobre un filete en `--firma`.

⁷ Cláusulas 8.1 y 8.3. Los componentes base genéricos siguen siendo de CGSI y quedan incluidos en tu licencia (8.2).
⁸ Cláusula X.
⁹ Cláusula IX.
¹⁰ Cláusula 7.3.
¹¹ Cláusula XII.
¹² Anexo de seguridad del contrato tipo; ver sección 9.

### VII. Próximos pasos

1. Agenda un diagnóstico de 30 minutos, sin costo.
2. Recibe una propuesta escrita en 5 días hábiles.
3. Si la apruebas, acordamos la fecha de inicio.

**[Agenda Cal.com embebida]** · **[Escribir por WhatsApp]**

**Aviso** (bajo la agenda, con casilla sin marcar): «Autorizo a CG Software Integration S.A.S. a tratar mis datos para responder esta solicitud, según su Política de tratamiento de datos.»

**Aclaraciones frecuentes**

**¿Cuánto cuesta un proyecto?**
Depende del alcance; por eso no publicamos tarifas. En el diagnóstico entendemos tu operación, y en cinco días hábiles recibes una propuesta con inversión cerrada, pagos por hitos y exclusiones explícitas.

**¿Hacen ERP?**
Construimos los módulos de administración que tu operación necesita (pedidos, inventario, despachos, agendas y reportes) y los integramos con el software contable o de facturación que ya usas.

**¿Qué pasa si después quiero trabajar con otro proveedor?**
Puedes. Recibes el repositorio, la documentación y una licencia perpetua y transferible que te permite contratar a un tercero.

**¿Trabajan fuera de Bogotá?**
Sí. Trabajamos con empresas de todo el país de forma remota, desde Bogotá y Barranquilla.

**¿Qué pasa con mis datos y los de mis clientes?**
Cumplimos la Ley 1581 de 2012. Lo que aplicamos está en la sección VI y en nuestra Política de tratamiento de datos.

**Mi empresa está sujeta a HIPAA u otra regulación extranjera. ¿Pueden trabajar con nosotros?**
Lo revisamos contigo en el diagnóstico, antes de comprometer nada.

**¿En cuánto tiempo responden?**
En menos de una hora hábil por WhatsApp (lunes a viernes, de 8:00 a 18:00, hora de Colombia).

### Pie

CG Software Integration S.A.S. · NIT 901.983.287 · Bogotá D.C. · {correo del dominio} · WhatsApp · Política de tratamiento de datos · Memorandos · Página N de VII · Rev. {versión}

Además, en mono: «Esta página pesó {X} KB y cargó en {Y} s en tu conexión.» Es un dato real, medido en el navegador del visitante.

---

## 4. Detalles firma: especificación funcional

1. **Cajetín vivo.**
   - La revisión es la versión semántica de `package.json` y se actualiza en cada lanzamiento.
   - La fecha es la del build.
   - La página es la sección visible, calculada con IntersectionObserver.
   - No se calcula la revisión con `git rev-list` en el build, porque el clon del proveedor puede ser superficial.
2. **Notas de fundamento.** Componente `<Nota n="1">` con un `<aside>` asociado.
   - En escritorio va en las columnas 10–12, alineada con su llamada.
   - En móvil se abre y se cierra con un toque, con `aria-expanded`.
3. **Diff de procesos.** Componente `<Diff>` con líneas `−`/`+`, tachado en las líneas quitadas y los tokens `--tachado` y `--agregado`.
4. **Figura viva.** SVG de líneas; un marcador recorre los cinco estados ligado al scroll (GSAP ScrollTrigger con scrub; la figura queda fija con `position: sticky`, nunca con pin que altere el scroll). Sin JavaScript o con movimiento reducido, se muestran los cinco estados estáticos y numerados.
5. **Papel / Plano, e imprimible.**
   - Interruptor de tema que persiste en `localStorage`, envuelto en try/catch.
   - Hoja `@media print`: carta, márgenes de una pulgada, Georgia y Calibri, sin navegación ni CTA, con URLs visibles y encabezado y pie del StyleGuide.
   - Un botón «Descargar como PDF» invoca la impresión.
6. **Peso y tiempo de carga.** Se leen de `PerformanceNavigationTiming` (`transferSize`, `duration`). Si `transferSize` es 0, se muestra «servida desde caché».
7. **Sello «Recibido».** Al confirmar la cita, aparece un sello en `--firma` con fecha y hora COT reales y el texto «Te escribimos en menos de una hora hábil».
8. **404 — Folio no encontrado.** Usa el mismo cajetín, con un enlace al índice.

---

## 5. Memorandos: blog y SEO

**Formato.** Cada entrada es un memorando:
- «Memorando N.º 003»
- Para: quien dirige una PyME
- De: Camilo Charris C.
- Fecha
- Asunto

Las notas al margen funcionan igual que en la página principal. Cada memorando cierra con la invitación al diagnóstico.

**Capa de contenido.**
- Los archivos viven en `content/es/memorandos/*.mdx` y se validan con Velite, con esquema Zod: `numero`, `titulo`, `asunto`, `fecha`, `resumen`, `para`, `etiquetas`, `estado`.
- Publicar es hacer commit y desplegar.
- Por ahora no hay panel de administración. Si una persona no técnica llega a publicar, se agrega un editor sobre git o un CMS headless; esa decisión se toma entonces, no ahora.

**SEO técnico.**
- `generateMetadata` por página, con URL canónica.
- JSON-LD: `Organization`, `WebSite`, `BlogPosting` (autor como `Person`) y `BreadcrumbList`.
- `sitemap.xml` y RSS.
- Imágenes OG generadas con `next/og` en estilo Papel.
- Enlaces internos a Alcance y Expedientes.
- hreflang listo para cuando exista otro idioma.

**Estrategia.**
- Dos memorandos al mes, que es el ritmo sostenible.
- Cada uno responde una pregunta concreta de un dueño de negocio, con una respuesta directa en el primer párrafo, datos propios y ejemplos reales.
- Con los resúmenes de IA en los buscadores, el objetivo es ser la fuente citada, no solo el enlace.

**Primeros seis temas**
1. Cuándo pasar de WhatsApp Business a un sistema de pedidos.
2. WhatsApp Business app o API: qué necesita tu empresa y cuánto cuesta operar cada una.
3. Qué preguntarle a un proveedor de software antes de firmar.
4. Cómo leer una propuesta de software: exclusiones, hitos y licencia.
5. Qué exige la Ley 1581 al sistema que maneja los datos de tus clientes.
6. Sistema a la medida o software de suscripción: cómo decidir con números.

---

## 6. Agenda, WhatsApp y registro de prospectos

**Cal.com**
- **Evento:** «Diagnóstico · 30 min», con videollamada, 12 horas de aviso mínimo y 15 minutos de margen entre citas.
- **Preguntas del formulario:**
  1. ¿A qué se dedica tu empresa?
  2. ¿Cómo manejan hoy el proceso que quieres mejorar?
  3. ¿Tienen presupuesto aprobado para este proyecto? (Sí / En evaluación / Todavía no)
  4. Casilla de autorización de datos, obligatoria y sin marcar.
- **Carga del embed:** en VII, con el color `--firma`. Se carga al hacer clic o al acercarse a la sección, no al abrir la página; así el embed no penaliza la carga inicial.
- **Webhook:** `BOOKING_CREATED` → `/api/cal/webhook` (verifica la firma con el secreto del webhook) → colección `prospectos` en Firestore. Se guarda un registro de consentimiento: fecha, hora, versión de la política y origen.
- **Datos mínimos:** nada sensible, sin adjuntos.
- **Límites del plan gratuito:** mantiene la marca de Cal.com en la agenda; quitarla requiere plan de pago.

**WhatsApp**
- **Sitio:** solo un enlace `wa.me` con texto prellenado («Hola, vengo del sitio de CGSI y quiero agendar un diagnóstico»). El sitio no conecta el número comercial a ninguna API.
- **Número comercial (+57 323 813 4588):** permanece en la app WhatsApp Business y se responde desde el teléfono.
  - Mensaje de bienvenida: «Hola, gracias por escribir a CG Software Integration. Te respondemos en menos de una hora hábil. Tratamos tus datos según nuestra política: {SITIO}/politica-de-datos».
  - Mensaje de ausencia (fuera de lunes a viernes, 8:00–18:00): «Recibimos tu mensaje. Te respondemos el siguiente día hábil antes de las 9:00».
  - Respuestas rápidas para agendar el diagnóstico y enviar el enlace de la agenda.
- **Evolution API:** solo en un número secundario, para avisarle al fundador de cada cita nueva, cancelada o reprogramada. Nunca se conecta el número comercial por la vía no oficial (B.10).
- **Cuando se automatice el número comercial:** por la Cloud API oficial, preferiblemente en modo de coexistencia con la app.

---

## 7. Datos personales (Ley 1581 de 2012)

### 7.1 Inventario de datos

| Fuente | Datos | Finalidad | Encargado y ubicación |
|---|---|---|---|
| Agenda (Cal.com) | Nombre, empresa, correo, teléfono, respuestas del formulario | Agendar y realizar el diagnóstico; enviar la propuesta | Cal.com (EE. UU.) |
| Registro de prospectos | Los mismos datos más el registro de consentimiento | Seguimiento comercial y prueba de la autorización | Google Firebase (según la región del proyecto) |
| WhatsApp | Número y conversación | Responder solicitudes | Meta (EE. UU.) |
| Avisos internos (Evolution API) | Nombre, empresa y hora de la cita | Avisar al fundador de cada cita | Proveedor del VPS donde corre Evolution, y Meta |
| Correo | Dirección y mensajes | Comunicación comercial | Proveedor del correo del dominio |
| Hosting y analítica | Datos técnicos de navegación | Operación y medición del sitio | Vercel (EE. UU.) |
| Casos y testimonios | Nombre, cargo, testimonio, fotografía | Referencia comercial | CGSI, con autorización específica |

### 7.2 Documentos obligatorios

1. **Política de tratamiento** (redactada en `politica-de-datos.md`; va en `/politica-de-datos`), con el contenido mínimo del art. 2.2.2.25.3.1 del Decreto 1074 de 2015:
   - Razón social, domicilio, dirección, correo y teléfono del responsable.
   - Tratamiento y finalidades.
   - Derechos del titular.
   - Responsable de atender peticiones.
   - Procedimiento para ejercer los derechos.
   - Fecha de entrada en vigencia y período de vigencia de la base de datos.
2. **Aviso de privacidad:** va en la agenda, en el saludo de WhatsApp y en el pie.
3. **Autorización con prueba consultable:** casilla sin marcar y registro vía webhook.
4. **Autorizaciones específicas** para casos y testimonios. La de Essenza ya está redactada (CSI-2026-ESSENZA-002).

### 7.3 Transmisión internacional

Cal.com, Vercel, Google y Meta tratan datos fuera de Colombia como encargados. Hay que declararlo en la política y en la autorización, y archivar los términos de tratamiento de datos de cada proveedor.

### 7.3.1 Conservación

24 meses desde el último contacto para prospectos no convertidos (confirmado). Se implementa con TTL en Firestore (B.10).

### 7.4 Registro Nacional de Bases de Datos

Por ahora CGSI no está obligada, porque la obligación aplica a sociedades con activos totales superiores a 100.000 UVT. Hay que revisarlo cada año.

### 7.5 Analítica

Se usa analítica sin cookies. Si en algún momento se agrega una herramienta con cookies, se agrega aviso y consentimiento.

---

## 8. Implementación

Ver Parte B, que reemplaza esta sección.

---

## 9. Lista de verificación antes del lanzamiento

**Legal**
- [ ] Autorización CSI-2026-ESSENZA-002 firmada.
- [ ] Testimonio del Anexo 2 aprobado.
- [ ] Política de tratamiento validada por un abogado y publicada con su fecha de vigencia.
- [ ] Plantilla de propuesta alineada con el contrato en propiedad del código.
- [ ] Aviso de privacidad en la agenda, en WhatsApp y en el pie.
- [ ] Sección VI y aviso validados por un abogado.
- [ ] Anexo de seguridad agregado al contrato tipo, con los cinco controles.
- [ ] Socios del proyecto de salud ocupacional informados de la mención anonimizada.

**Contenido**
- [ ] Foto real del fundador.
- [ ] Logo de CGSI en SVG.
- [ ] Stack real de Essenza confirmado para la etiqueta del expediente.
- [ ] Primeros dos memorandos escritos.

**Técnico y operación**
- [ ] Dominio y correo propios. El sitio no sale con @gmail.
- [ ] Cal.com configurado y webhook probado.
- [ ] Google Search Console configurado.
- [ ] Mensajes de bienvenida y ausencia configurados en WhatsApp Business.
- [ ] Número secundario conectado a Evolution API y notificación de prueba recibida.

---

## 10. Prompt para Claude Design (tres pantallas)

```
Diseña tres pantallas del sitio de CG Software Integration (CGSI), agencia colombiana de software a la medida. Territorio: «Por escrito». La página es una propuesta comercial dirigida al visitante: se lee como un documento impecable (numeración romana I–VII, doble filete, notas al margen, cajetín tipo plano con referencia, revisión, fecha y página) y se comporta como software.

Pantallas (escritorio 1440 px y móvil 390 px, en modo Papel y en modo Plano):
1. Portada + franja «Lo que siempre incluye».
2. Sección VI «Lo que prometemos, lo firmamos», con el bloque «Datos y seguridad» y la firma tipográfica.
3. Expediente 01 Essenza: pestañas de carpeta, diff de procesos (líneas − tachadas / + agregadas), Fig. 1 «Recorrido de un pedido» (diagrama de líneas con cinco estados y mensajes de WhatsApp al margen) y bloque de resultado con nota de fundamento.

Tokens (modo Papel): papel #F5F0E8, papel-2 #EDE8E0, tinta #0D1B2A, grafito #2A2A2A, lápiz #5A6778, carbón #3D3D3D, firma #2340C8 (único color de acción), tachado #9B2F24, agregado #2E6A4A.
Modo Plano: fondo #0D1B2A, texto #F5F0E8, lápiz #9AA6B5, firma #8FA2FF, tachado #E08A7E, agregado #7FC49A.
Tipografía: Source Serif 4 (display) en titulares, Source Sans 3 en texto, JetBrains Mono en metadatos. Contraste de escala fuerte: titulares muy grandes, metadatos pequeños en mono.
Retícula escritorio: columnas 1–2 índice I–VII fijo; 3–9 texto (máx. 68 caracteres); 10–12 notas al margen. Móvil: una columna, notas desplegables, cajetín como barra inferior.

Usa el copy exacto del brief (sección 3). No inventes cifras, logos ni clientes.
Prohibido: gradientes, glassmorphism, bento grid, partículas, 3D, fotos de stock, íconos decorativos, cursor personalizado, marquesinas.
El único color saturado de acción es #2340C8; rojo y verde solo en el diff.
```

---

## 11. Pendientes (bloquean el lanzamiento, no el diseño)

| Pendiente | Responsable | Estado |
|---|---|---|
| Dominio y correo propios | Camilo | Pendiente. Al tenerlos, actualizar el correo en la política, el pie y el aviso. |
| Firma de Essenza y testimonio de Eric | Camilo | Autorización CSI-2026-ESSENZA-002 lista para enviar |
| Validación legal de la sección VI, la política y el aviso | Camilo y abogado | Pendiente |
| Número secundario para Evolution API | Camilo | Pendiente |
| Resuelto | — | Dirección (Bogotá D.C.), horario hábil (lunes a viernes, 8:00–18:00), propuesta en 5 días hábiles, conservación de 24 meses, promesa de respuesta en una hora |

---

# Parte B — Especificación técnica para el agente implementador

## B.0 Cómo usar esta parte

**Fuentes de verdad, en orden de precedencia:**
1. Copy literal de la Parte A §3.
2. Tokens de la Parte A §2.1.
3. Esta Parte B.
4. Las pantallas aprobadas en Claude Design.

Si dos fuentes chocan, se detiene y se pregunta. Nunca se resuelve inventando.

**Reglas para el agente:**
- No inventes copy, cifras, clientes, logos ni testimonios. Si falta un texto, deja `{PENDIENTE: …}` visible y regístralo en `PROGRESS.md`.
- No agregues dependencias fuera de B.1 sin justificarlo en `PROGRESS.md`.
- Trabaja por fases (B.17). Al cerrar cada fase: pruebas en verde, `PROGRESS.md` actualizado y commit.
- Ningún despliegue a producción sin revisión humana explícita.
- Instala la skill oficial de GSAP antes de la fase 3: `npx skills add https://github.com/greensock/gsap-skills`.

## B.1 Stack y versiones

| Pieza | Elección | Nota |
|---|---|---|
| Runtime | Node 22 LTS | Next.js 16 exige Node ≥ 20.9 |
| Framework | Next.js 16, App Router, Turbopack, React 19.2 | TypeScript `strict` |
| Estilos | Tailwind CSS v4 | Tokens como variables CSS (B.3) |
| i18n | next-intl | Con `proxy.ts`, **no** `middleware.ts` (renombrado en Next 16) |
| Contenido | Velite + MDX | Colecciones tipadas con Zod |
| Movimiento | `gsap` ≥ 3.13 + `@gsap/react` | Plugins: ScrollTrigger y DrawSVGPlugin. Nada más. |
| Datos | `firebase-admin` (Firestore) | Solo en el servidor |
| Agenda | `@calcom/embed-react` | Carga diferida |
| Analítica | `@vercel/analytics`, `@vercel/speed-insights` | Sin cookies |
| Validación | `zod` | Variables de entorno, webhooks, frontmatter |
| Pruebas | Vitest, Playwright, `@axe-core/playwright`, Lighthouse CI | B.16 |
| Paquetes | pnpm | Lockfile versionado |

**Prohibido:** Lenis, ScrollSmoother, SplitText en titulares, Three.js/R3F, Framer Motion (GSAP cubre lo necesario), librerías de componentes (shadcn, MUI, Chakra), jQuery, cualquier script de terceros que no esté en esta tabla.

## B.2 Estructura del repositorio

```
cgsi/                            # raíz del repo; docs/ y design/ conviven como referencia
├─ CLAUDE.md                     # contexto persistente (se genera en F0 a partir de esta Parte B)
├─ PROGRESS.md                   # bitácora por fase
├─ velite.config.ts
├─ next.config.ts                # headers de seguridad, versión y fecha de build
├─ messages/es.json              # textos de interfaz (botones, etiquetas, aria)
├─ content/es/
│  ├─ documento/                 # 00-portada.mdx … 07-proximos-pasos.mdx, 99-pie.mdx
│  ├─ expedientes/               # essenza.mdx, salud-ocupacional.mdx
│  ├─ memorandos/                # 001-*.mdx …
│  └─ legal/politica-de-datos.mdx
├─ src/
│  ├─ proxy.ts                   # next-intl
│  ├─ i18n/{routing.ts,request.ts,navigation.ts}
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx             # documento I–VII
│  │  │  ├─ expedientes/[slug]/page.tsx
│  │  │  ├─ memorandos/page.tsx
│  │  │  ├─ memorandos/[slug]/page.tsx
│  │  │  ├─ politica-de-datos/page.tsx
│  │  │  └─ not-found.tsx        # Folio no encontrado
│  │  ├─ api/cal/webhook/route.ts
│  │  ├─ api/salud/route.ts      # healthcheck
│  │  ├─ sitemap.ts · robots.ts · rss.xml/route.ts
│  │  └─ opengraph-image.tsx     # y uno por ruta dinámica
│  ├─ components/
│  │  ├─ documento/  Cajetin · IndiceSecciones · Seccion · DobleFilete · Nota · Diff · FiguraRecorrido · Firma · Sello
│  │  ├─ expedientes/ PestanasExpediente
│  │  ├─ contacto/   AgendaCal · BotonWhatsApp · AvisoPrivacidad
│  │  ├─ tema/       InterruptorPapelPlano · ScriptTema
│  │  └─ pie/        MedidorCarga
│  ├─ lib/
│  │  ├─ env.ts                  # zod: falla el build si falta una variable
│  │  ├─ gsap.ts                 # registro único de plugins ("use client")
│  │  ├─ firebase-admin.ts
│  │  ├─ cal.ts                  # verificación de firma y parseo del webhook
│  │  ├─ mensajeria/{index.ts,evolution.ts,cloud-api.ts,ninguno.ts}
│  │  ├─ seo.ts                  # constructores de JSON-LD
│  │  └─ version.ts
│  └─ styles/{tokens.css,globals.css,print.css}
├─ scripts/
│  ├─ prospectos-exportar.ts     # atender consultas de titulares (Ley 1581)
│  └─ prospectos-suprimir.ts     # atender supresiones
├─ tests/{unit,e2e,a11y,visual}
└─ .github/workflows/ci.yml
```

**Regla de contenido:** el copy largo vive en MDX y los textos cortos de interfaz en `messages/es.json`. Ningún componente tiene texto escrito a mano en el código.

## B.3 Tokens y tema

```css
/* src/styles/tokens.css */
:root, [data-tema="papel"] {
  --papel:#F5F0E8; --papel-2:#EDE8E0; --tinta:#0D1B2A; --grafito:#2A2A2A;
  --lapiz:#5A6778; --carbon:#3D3D3D; --firma:#2340C8; --texto-sobre-firma:#F5F0E8;
  --tachado:#9B2F24; --agregado:#2E6A4A;
}
[data-tema="plano"] {
  --papel:#0D1B2A; --papel-2:#13253A; --tinta:#F5F0E8; --grafito:#F5F0E8;
  --lapiz:#9AA6B5; --carbon:#C9CED6; --firma:#8FA2FF; --texto-sobre-firma:#0D1B2A;
  --tachado:#E08A7E; --agregado:#7FC49A;
}
```

- **Tailwind v4:** exponer los tokens con `@theme` (`--color-papel: var(--papel)`, etc.). No se permiten colores escritos a mano en componentes.
- **Tema inicial:** sigue `prefers-color-scheme`. El interruptor guarda `papel` o `plano` en `localStorage` (con try/catch).
- **Sin parpadeo al cargar:** `ScriptTema` es un script inline de bloqueo en `<head>` que fija `data-tema` antes del primer pintado.
- **Pendiente de verificar:** `--papel-2` y `--carbon` del modo Plano son derivados nuevos y deben medirse con axe en F1.

## B.4 Tipografía

- **Carga:** `next/font/google` con subset `latin` y `display: 'swap'`.
  - Source Serif 4 con `axes: ['opsz']`.
  - Source Sans 3.
  - JetBrains Mono.
- **Variables:** `--f-serif`, `--f-sans`, `--f-mono`.
- **Fallbacks:** `Georgia` en `--f-serif` y `Calibri, system-ui` en `--f-sans`, iguales a los documentos.
- **Escala:** la de la Parte A §2.2, con `clamp()`. `font-feature-settings: "onum"` solo en el cuerpo serif, si se usa.
- **Idioma:** `lang="es-CO"` en `<html>`.

## B.5 Componentes

**Por defecto, todo componente es de servidor.** Solo son de cliente, con `"use client"`: `Cajetin` (página actual), `Nota` (solo el botón de móvil), `PestanasExpediente`, `DobleFilete`, `FiguraRecorrido`, `InterruptorPapelPlano`, `AgendaCal`, `Sello`, `MedidorCarga`.

| Componente | Comportamiento | Accesibilidad | Aceptación |
|---|---|---|---|
| `Cajetin` | Muestra `Ref. CSI-2026-WEB-001 · Rev. {APP_VERSION} · {BUILD_DATE dd.mm.aaaa} · Pág. {n}/VII`. La página se calcula con IntersectionObserver sobre `[data-seccion]`. | `<aside aria-label="Datos del documento">`, sin `aria-live` | Versión y fecha coinciden con el build; la página cambia al hacer scroll |
| `IndiceSecciones` | Navegación I–VII fija en escritorio y compacta en móvil | `<nav>` con `aria-current="location"` | Los enlaces llevan a cada ancla |
| `Seccion` | Numeral romano, título, doble filete y `data-seccion` | Jerarquía `h2` por sección | 7 secciones renderizadas |
| `DobleFilete` | SVG de dos trazos (tinta grueso, carbón fino) que se dibuja al entrar (B.6) | `aria-hidden` | Estático con movimiento reducido |
| `Nota` | Llamada numerada. En escritorio va en las columnas 10–12, alineada con su párrafo; en móvil, un botón la expande debajo. | `<aside id>` y botón con `aria-expanded`/`aria-controls` | Legible sin JS en escritorio; en móvil, cerrada por defecto |
| `Diff` | Lista con `<del>` y `<ins>`, más signos visibles «−»/«+» | La semántica de `<del>`/`<ins>` se conserva | Nunca depende solo del color |
| `FiguraRecorrido` | SVG de 5 estados; trazo y nodos ligados al scroll; mensajes de WhatsApp al margen por estado; versión vertical en móvil | `<figure>` con `<figcaption>` y lista `<ol>` equivalente en texto | Sin JS: los 5 estados visibles |
| `PestanasExpediente` | Pestañas de carpeta con transición lateral (B.6) | Patrón ARIA tabs completo (flechas, Inicio/Fin) | Operable solo con teclado |
| `Firma` | «Camilo Charris C. — Fundador» compuesto en tipografía, sobre filete `--firma` | Texto real, no imagen | Nunca usa la firma manuscrita |
| `Sello` | Aparece al confirmarse la reserva: «Recibido · {dd.mm.aaaa · hh:mm} COT · Te escribimos en menos de una hora hábil» | `role="status"` | Hora en `America/Bogota` |
| `AgendaCal` | Embed de Cal.com que se carga al hacer clic o al acercarse a la sección VII; color de marca y tema sincronizados con Papel/Plano | Título del iframe | No descarga nada de Cal.com antes de la interacción o la proximidad |
| `BotonWhatsApp` | `https://wa.me/573238134588?text=` con `encodeURIComponent` del texto de §6 | Etiqueta explícita | Abre WhatsApp con el texto prellenado |
| `AvisoPrivacidad` | Aviso corto de la política, junto a la agenda y en el pie | Enlace a `/politica-de-datos` | Visible antes de agendar |
| `MedidorCarga` | Lee `PerformanceNavigationTiming` (`transferSize`, `duration`) después de `load` | Texto normal | Si `transferSize` es 0, muestra «servida desde caché» |
| `InterruptorPapelPlano` | Alterna `data-tema` y lo persiste | `aria-pressed` y etiqueta «Vista Plano» | Sin parpadeo al recargar |

**Eventos del embed de Cal.com.** Se escucha el evento de reserva exitosa del embed para mostrar `Sello`. El nombre del evento cambia según la versión del embed (`bookingSuccessful` / `bookingSuccessfulV2`): verificar en la documentación de la versión instalada. El color de marca se configura con la acción `ui` del embed; verificar el nombre exacto de las variables en esa misma documentación.

## B.6 Movimiento con GSAP

**Reglas:**
1. Registrar los plugins una sola vez, en `src/lib/gsap.ts` (cliente): `gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP)`.
2. Toda animación vive en `useGSAP(() => {…}, { scope: ref })`, que se encarga de la limpieza.
3. Todo va dentro de `gsap.matchMedia()`: las animaciones corren solo con `(prefers-reduced-motion: no-preference)`; con `reduce`, se fija el estado final.
4. Solo se animan `transform`, `opacity` y el trazo SVG (DrawSVG). Nunca propiedades de layout.
5. **Nada de pin que altere el scroll.** La figura se fija con `position: sticky` y ScrollTrigger solo lee el progreso (`scrub: true`).
6. `ScrollTrigger.refresh()` después de `document.fonts.ready`. `markers` solo en desarrollo.
7. Los componentes con GSAP están debajo del pliegue y se importan con `next/dynamic`, para que GSAP no entre en el JS inicial.

**Inventario de animaciones (es la lista completa: no se agregan otras):**

| # | Elemento | Disparador | Técnica | Duración y curva | Con movimiento reducido |
|---|---|---|---|---|---|
| 1 | Doble filete de portada | Carga, después del título | DrawSVG 0→100 %, primero el trazo grueso y luego el fino | 0,8 s `power2.out` | Estático |
| 2 | Doble filete de cada sección | Entra al viewport (`top 80%`), una vez | DrawSVG 0→100 % | 0,6 s `power2.out` | Estático |
| 3 | Notas al margen | Entran con su párrafo, una vez | `opacity` 0→1, `y` 8→0 | 0,25 s `power1.out` | Sin animación |
| 4 | Figura «Recorrido de un pedido» | Scroll dentro de su sección | `scrub`: DrawSVG del trazo y clase `activo` por nodo según el progreso | Ligado al scroll | 5 estados estáticos |
| 5 | Cambio de expediente | Clic o teclado en la pestaña | View Transition lateral (no GSAP) | 0,3 s | Instantáneo |
| 6 | Sello «Recibido» | Reserva exitosa | `scale` 1.15→1, `rotate` −4°, `opacity` 0→1 | 0,3 s `back.out(2)` | Aparece sin animación |

**View Transition de las pestañas:**

```ts
function cambiar(i: number) {
  if (!document.startViewTransition || reducido) return setTab(i);
  document.documentElement.dataset.dir = i > tab ? "adelante" : "atras";
  document.startViewTransition(() => flushSync(() => setTab(i)));
}
```

El CSS de `::view-transition-old/new(expediente)` desliza en X según `data-dir`, con 0,3 s de duración.

## B.7 i18n (andamiaje para varios idiomas)

- `i18n/routing.ts`: `locales: ['es']`, `defaultLocale: 'es'`, `localePrefix: 'as-needed'`. El español vive en la raíz y no lleva prefijo.
- `src/proxy.ts`: `createMiddleware(routing)` con un matcher que excluye `api`, `_next`, `_vercel` y archivos con punto.
- Llamar `setRequestLocale` en cada layout y página, y definir `generateStaticParams` por idioma, para mantener el render estático.
- `alternates.languages` en la metadata, listo para cuando exista `en`.
- **Agregar un idioma** = agregar su código en `routing.ts`, crear `messages/en.json` y `content/en/`. No se toca ningún componente.

## B.8 Contenido (Velite)

**Colecciones:** `documento`, `expedientes`, `memorandos`, `legal`.

**Esquema de `memorandos`:**

```ts
{ numero: s.number().int(), slug: s.slug('memorandos'), titulo: s.string().max(90),
  asunto: s.string().max(120), para: s.string(), fecha: s.isodate(),
  resumen: s.string().max(160), etiquetas: s.array(s.string()),
  estado: s.enum(['borrador','publicado']), cuerpo: s.mdx() }
```

**Esquemas de `expedientes` y `legal`:**
- `expedientes` agrega `etiqueta`, `stack` (array), `confidencial` (boolean) y `autorizacion` (referencia del documento firmado; obligatoria si `confidencial` es falso).
- `legal` lleva `version` y `vigenteDesde`.

**Reglas de build y publicación:**
- Scripts: `"prebuild": "velite build"` y, en desarrollo, `velite dev --watch` en paralelo con `next dev`.
- En producción solo se publica `estado: 'publicado'`.
- **El build falla si** un expediente no confidencial no tiene `autorizacion`, o si `vigenteDesde` de la política está vacío.
- Componentes MDX disponibles: `Nota`, `Diff`, `FiguraRecorrido`, `Firma`.

## B.9 SEO

- **Metadata:** `generateMetadata` en cada ruta.
  - Título: `{Título} · CG Software Integration`.
  - Descripción ≤ 160 caracteres.
  - `alternates.canonical` en todas las rutas.
- **Imágenes OG:** `opengraph-image.tsx` de 1200×630 en estilo Papel (membrete, título y referencia), con las fuentes del sitio.
- **JSON-LD** (`lib/seo.ts`):
  - `Organization`: `name`, `legalName: "CG Software Integration S.A.S."`, `taxID: "901.983.287"`, `url`, `email`, `telephone`, `address` solo con `addressLocality: "Bogotá"` y `addressCountry: "CO"`. No se publica la dirección de la calle en el marcado.
  - `WebSite`.
  - `BlogPosting`, con `author` como `Person` (Camilo Charris C.).
  - `BreadcrumbList`.
  - `FAQPage` para «Aclaraciones frecuentes». Sirve como estructura aunque no garantice resultado enriquecido.
- **Descubrimiento:** `sitemap.ts` (solo lo publicado), `robots.ts` y `rss.xml` de memorandos.
- **Verificación:** metaetiquetas de Google Search Console y Bing Webmaster Tools desde variables de entorno.

## B.10 Integraciones

### Cal.com (agenda y webhook)

**Configuración del evento:** según la Parte A §6. La pregunta de autorización es de tipo casilla y es obligatoria.

**`POST /api/cal/webhook`** (runtime `nodejs`):
1. Leer el cuerpo crudo con `await req.text()`; límite de 64 KB.
2. Calcular HMAC-SHA256 en hex del cuerpo crudo con `CAL_WEBHOOK_SECRET` y compararlo con el encabezado `x-cal-signature-256` usando `crypto.timingSafeEqual`. Si no coincide: 401.
3. Parsear con Zod: `triggerEvent`, `payload.uid`, asistente (nombre, correo, teléfono), `responses`. Si es inválido: 400.
4. **Idempotencia:** el id del documento es `payload.uid`. Cal.com no firma una marca de tiempo, así que un mensaje capturado podría reenviarse; la idempotencia neutraliza el duplicado.
5. Según el evento:
   - `BOOKING_CREATED`: crear `prospectos/{uid}`.
   - `BOOKING_RESCHEDULED` y `BOOKING_CANCELLED`: actualizar estado y fechas.
   - Otros eventos: 200 sin hacer nada.
6. Notificar al fundador con el adaptador de mensajería (abajo): tiempo máximo de 3 s y sin bloquear la respuesta.
7. Responder 200 en menos de 2 s.

**Documento `prospectos/{uid}`:**

```ts
{ nombre, empresa, correo, telefono, respuestas: {...},
  estado: 'nuevo'|'contactado'|'propuesta'|'ganado'|'perdido'|'cancelado',
  cita: { inicio, fin, zona: 'America/Bogota' },
  consentimiento: { aceptado: true, versionPolitica: POLITICA_VERSION, fecha, medio: 'cal.com' },
  creadoEn, ultimoContacto, expiraEn /* ultimoContacto + 24 meses */ }
```

**Firestore:**
- Reglas de seguridad `allow read, write: if false;`: solo el Admin SDK escribe.
- **TTL** configurado sobre `expiraEn`. Así se cumple la conservación de 24 meses sin tareas manuales.
- Cada cambio de estado agrega un registro en `prospectos/{uid}/eventos` (solo se agregan, nunca se editan).
- Exportaciones programadas de Firestore como respaldo.
- Cuenta de servicio con el rol mínimo necesario.

**Derechos de los titulares:**
- `scripts/prospectos-exportar.ts --correo x`: devuelve lo guardado de esa persona.
- `scripts/prospectos-suprimir.ts --correo x`: borra y deja constancia sin datos personales.

### WhatsApp y el adaptador de mensajería

```ts
// src/lib/mensajeria/index.ts
export interface Mensajeria { enviarTexto(destino: string, texto: string): Promise<{ ok: boolean; id?: string; error?: string }> }
// el proveedor se elige con MENSAJERIA_PROVEEDOR = 'evolution' | 'cloud' | 'ninguno'
```

**`evolution.ts`:**
- `POST {EVOLUTION_API_URL}/message/sendText/{EVOLUTION_INSTANCIA}` con encabezado `apikey: EVOLUTION_API_KEY` y cuerpo `{ number, text }`. Verificar la ruta contra la versión desplegada de Evolution API v2.
- Uso en la v1: **únicamente** avisos internos a `NOTIFICACIONES_DESTINO` (el teléfono personal del fundador), enviados desde un número secundario conectado a Evolution.
- Texto del aviso: `Nueva cita · {nombre} ({empresa}) · {dd.mm hh:mm} COT · Presupuesto: {respuesta}`.

**`cloud-api.ts`:**
- Meta Cloud API: `POST https://graph.facebook.com/{version}/{PHONE_NUMBER_ID}/messages` con token Bearer.
- Fuera de la ventana de 24 horas solo se pueden enviar plantillas aprobadas.
- Queda implementado pero inactivo; es la ruta para automatizar el número comercial más adelante.

**`ninguno.ts`:** solo registra en el log. Es el valor por defecto en desarrollo y en las pruebas.

**Prohibido:** conectar el número comercial (+57 323 813 4588) a Evolution por la vía no oficial. Tampoco se envían mensajes automáticos por WhatsApp a prospectos: su confirmación llega por correo desde Cal.com.

**Despliegue de Evolution API (fuera de este repositorio):**
- Docker en un VPS pequeño, con Postgres y Redis según su documentación.
- Solo HTTPS y `AUTHENTICATION_API_KEY` robusta.
- Sin webhooks entrantes en la v1.
- Monitoreo del estado de la instancia, con aviso por correo si se desconecta.

### Otras integraciones

- **Vercel Web Analytics y Speed Insights:** sin cookies, así que no se requiere banner.
- **Google Search Console y Bing Webmaster Tools:** verificación desde variables de entorno.
- **Correo del dominio** (cuando exista): SPF, DKIM y DMARC configurados antes de publicarlo en el sitio.
- **No se integran en la v1:** CRM externo, chat en vivo, píxeles publicitarios ni newsletter.

## B.11 Seguridad del sitio

El sitio debe cumplir lo que promete la sección VI.

**Encabezados** (`next.config.ts` → `headers()`):
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- `Content-Security-Policy`:
  - `default-src 'self'`
  - `script-src 'self' 'unsafe-inline' https://app.cal.com`
  - `style-src 'self' 'unsafe-inline'`
  - `img-src 'self' data: https://app.cal.com`
  - `frame-src https://app.cal.com https://cal.com`
  - `connect-src 'self' https://app.cal.com`
  - `font-src 'self'`
  - `object-src 'none'`
  - `base-uri 'self'`
  - `form-action 'self'`
  - `frame-ancestors 'none'`

**Compromiso consciente sobre la CSP:** una CSP con nonce obliga a renderizado dinámico en todas las páginas. Para la v1 se acepta `'unsafe-inline'` en `script-src` y se revisa en la v2. Primero se despliega como `Content-Security-Policy-Report-Only` en preview; luego se aplica.

**Secretos y dependencias:**
- Solo las variables `NEXT_PUBLIC_*` llegan al cliente.
- `lib/env.ts` valida todas las variables con Zod y hace fallar el build si falta alguna.
- `pnpm audit` en CI y Dependabot semanal.

**Accesos:**
- Vercel, Firebase y Evolution solo con cuentas del fundador, con doble factor.
- La cuenta de servicio de Firebase se limita a Firestore.

## B.12 Rendimiento

**Presupuestos:**
- LCP ≤ 2,0 s en 4G, CLS ≤ 0,05, INP ≤ 200 ms.
- JavaScript inicial ≤ 120 KB comprimido en la página principal. No cuentan GSAP ni Cal.com, porque se cargan diferidos.

**Cómo se cumplen:**
- Server Components por defecto.
- GSAP solo en componentes debajo del pliegue, importados dinámicamente.
- Embed de Cal.com diferido.
- `next/image` con AVIF/WebP.
- Fuentes con subset.
- Sin videos ni 3D.

**Umbrales de Lighthouse CI (móvil):** Rendimiento ≥ 90, Accesibilidad = 100, Buenas prácticas ≥ 95, SEO = 100.

## B.13 Accesibilidad (WCAG 2.2 AA)

- Enlace «Saltar al contenido».
- Encabezados en orden.
- Foco visible: contorno de 2 px en `--firma` con separación de 2 px.
- Objetivos táctiles de al menos 44 px.
- Navegación completa por teclado: índice, pestañas, notas, interruptor y agenda.
- `prefers-reduced-motion` respetado (B.6).
- Contraste verificado en Papel y en Plano.
- `axe` sin violaciones en CI.
- Sin desbordes horizontales a 360 px.

## B.14 Impresión (`print.css`)

- `@page { size: letter; margin: 1in; }`
- Fuentes Georgia y Calibri, fondo blanco y tinta negra.
- Se ocultan navegación, interruptor, agenda, botón de WhatsApp y medidor.
- Las notas al margen pasan a notas al pie numeradas.
- Enlaces con la URL entre paréntesis.
- Encabezado «CG Software Integration · CSI-2026-WEB-001» y pie con NIT y correo, como en los documentos del StyleGuide.
- Un botón «Descargar como PDF» llama a `window.print()`.

## B.15 Variables de entorno

| Variable | Uso | Pública |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica | Sí |
| `NEXT_PUBLIC_WHATSAPP_NUMERO` | `573238134588` | Sí |
| `NEXT_PUBLIC_CAL_LINK` | Enlace del evento, p. ej. `cgsi/diagnostico` | Sí |
| `NEXT_PUBLIC_APP_VERSION` | Se inyecta desde `package.json` en `next.config.ts` | Sí |
| `NEXT_PUBLIC_BUILD_DATE` | Se inyecta en el build | Sí |
| `CAL_WEBHOOK_SECRET` | Firma del webhook | No |
| `FIREBASE_PROJECT_ID` · `FIREBASE_CLIENT_EMAIL` · `FIREBASE_PRIVATE_KEY` | Admin SDK | No |
| `MENSAJERIA_PROVEEDOR` | `evolution` · `cloud` · `ninguno` | No |
| `EVOLUTION_API_URL` · `EVOLUTION_API_KEY` · `EVOLUTION_INSTANCIA` | Adaptador Evolution | No |
| `NOTIFICACIONES_DESTINO` | Teléfono personal del fundador | No |
| `POLITICA_VERSION` | `1.0` | No |
| `GOOGLE_SITE_VERIFICATION` · `BING_SITE_VERIFICATION` | Verificación de buscadores | No |

Se entrega `.env.example` con todas las variables y ningún valor real.

## B.16 Pruebas y CI

**Pipeline en GitHub Actions** (en cada PR): `lint` → `typecheck` → `test:unit` → `build` → `test:e2e` → `test:a11y` → Lighthouse CI.

**Pruebas unitarias (Vitest):**
- Verificación de la firma del webhook: válida, inválida y cuerpo alterado.
- Esquemas Zod.
- Cálculo de `expiraEn`.
- Adaptador de mensajería (con fetch simulado).
- Formateo de fechas COT.

**Pruebas e2e (Playwright, 390 px y 1440 px, Papel y Plano):**
- Las 7 secciones se renderizan con su numeral.
- El índice lleva a cada ancla.
- Las pestañas funcionan con teclado y cambian de panel.
- El interruptor de tema persiste al recargar.
- El enlace de WhatsApp tiene el formato correcto.
- `/politica-de-datos` es accesible desde el pie y desde el aviso.
- El 404 muestra «Folio no encontrado».
- La agenda no carga recursos de Cal.com antes de la interacción o la proximidad.

**Otras pruebas:**
- **Visuales:** capturas de referencia por pantalla, que se comparan contra las de Claude Design en la revisión humana.
- **Accesibilidad:** `@axe-core/playwright` en todas las rutas, con cero violaciones.

## B.17 Fases de implementación

| Fase | Alcance | Criterio de salida |
|---|---|---|
| F0 Base | Next 16, TS strict, Tailwind v4 con tokens, fuentes, next-intl con `proxy.ts`, Velite, `env.ts`, CI esqueleto, `CLAUDE.md` y `PROGRESS.md` | Build y CI en verde; página vacía con tokens aplicados |
| F1 Sistema documento | Retícula, `Seccion`, `IndiceSecciones`, `Cajetin`, `Nota`, `Diff`, `Firma`, `DobleFilete` estático, tema Papel/Plano, `print.css` | Pruebas de axe y teclado en verde; contraste del modo Plano medido |
| F2 Contenido | MDX literal de la Parte A §3, expedientes, política, 404 | Copy idéntico al brief; sin marcadores `{PENDIENTE}` sin registrar |
| F3 Movimiento | GSAP (inventario B.6), View Transitions en pestañas, movimiento reducido | Sin animaciones fuera del inventario; presupuesto de JS respetado |
| F4 Integraciones | WhatsApp, `AgendaCal` diferida, webhook → Firestore con TTL, adaptador Evolution, `Sello`, `MedidorCarga`, scripts de titulares | Reserva de prueba de principio a fin; aviso interno recibido |
| F5 SEO y memorandos | Colección memorandos, metadata, JSON-LD, sitemap, RSS, OG | Validadores de datos estructurados sin errores |
| F6 Endurecimiento | Encabezados y CSP, Lighthouse CI, e2e completos, revisión humana | Umbrales B.12 cumplidos y aprobación escrita del fundador; recién entonces, producción |

## B.18 Definición de terminado

- [ ] Copy idéntico a la Parte A §3.
- [ ] Ninguna cifra sin fuente.
- [ ] Solo animaciones del inventario B.6, todas con variante de movimiento reducido.
- [ ] El número comercial no está conectado a ninguna API.
- [ ] El webhook verifica la firma, es idempotente y guarda el consentimiento.
- [ ] TTL de 24 meses activo.
- [ ] Umbrales de Lighthouse y axe cumplidos.
- [ ] Impresión revisada en PDF.
- [ ] `PROGRESS.md` al día.
- [ ] Revisión humana aprobada.
