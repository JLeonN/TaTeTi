# PLAN IDIOMAS JAPONÉS Y COREANO

## Descripción del plan

Agregar japonés y coreano a TaTeTi utilizando la infraestructura central de idiomas, ficha de Google Play y skills multidioma implementadas en el plan anterior.

## Objetivo principal

- Incorporar `ja-JP` y `ko-KR` a la aplicación
- Traducir la ficha y las novedades de Google Play
- Validar legibilidad, tamaños y adaptación visual para ambos sistemas de escritura

## Reglas del plan

- Ejecutar este plan después de completar `PlanIdiomasEuropeosPrincipales.md`
- Reutilizar `src/i18n/IdiomasApp.json` y `PublicacionGooglePlay/FichaGooglePlay.json`
- Mantener `en-US` como fallback
- Usar los códigos `ja-JP` y `ko-KR` tanto en la app como en Google Play
- No duplicar la lógica de detección, selector, skills o validadores
- Actualizar los registros controlados existentes; agregar el idioma al catálogo no importa automáticamente su módulo de mensajes
- Usar rutas PascalCase para los módulos y mantener los códigos BCP 47 únicamente como datos
- Conservar nombres propios como `TaTeTi` y `NEXUS` salvo decisión explícita
- Priorizar traducciones naturales y breves sobre traducciones literales
- Mantener `es-AR` como idioma predeterminado cuando el idioma del sistema no esté soportado

## FASE 1: Registrar los idiomas

### Objetivo

Habilitar japonés y coreano mediante el catálogo central existente.

- [x] Agregar japonés con código `ja-JP` a `src/i18n/IdiomasApp.json`
- [x] Agregar coreano con código `ko-KR` a `src/i18n/IdiomasApp.json`
- [x] Definir nombres y regiones nativas: `日本語` / `日本` y `한국어` / `대한민국`
- [x] Agregar los imports y entradas controladas de `ja-JP` y `ko-KR` en `src/i18n/index.js`
- [x] Agregar las rutas controladas `JaJP/Index.js` y `KoKR/Index.js` en `Scripts/ValidarIdiomas.js`
- [x] Ejecutar `npm run generar-idiomas` después de modificar el catálogo
- [x] Confirmar que la detección del idioma del sistema reconoce ambas variantes
- [x] Confirmar que el selector dinámico muestra ambos idiomas sin lógica adicional
- [x] Confirmar que `document.documentElement.lang` cambia a `ja-JP` o `ko-KR`

## FASE 2: Traducir la aplicación

### Objetivo

Crear traducciones completas y coherentes para japonés y coreano.

- [x] Crear `src/i18n/JaJP/Index.js`
- [x] Crear `src/i18n/KoKR/Index.js`
- [x] Conservar exactamente la misma estructura de claves que el idioma fuente
- [x] Traducir textos generales, configuración, menú, juego, puntuación, estadísticas y actualización
- [x] Conservar interpolaciones y símbolos funcionales sin modificaciones
- [x] Adaptar el vocabulario del juego a los términos usados naturalmente en cada idioma
- [x] Revisar tratamientos, tono y longitud para una interfaz de juego informal
- [x] Evitar espacios o signos de puntuación impropios de japonés y coreano
- [x] Revisar expresiones con cantidades para evitar plurales o concordancias heredadas innecesariamente
- [ ] Solicitar una revisión humana o independiente de los textos críticos antes de publicar

## FASE 3: Adaptar la interfaz

### Objetivo

Garantizar que ambos sistemas de escritura sean legibles y no rompan el diseño existente.

- [x] Revisar que las fuentes actuales incluyan glifos completos para japonés y coreano
- [x] Probar los glifos sin conexión para confirmar que Android usa una fuente local de respaldo
- [x] Definir una pila de fuentes de sistema compatible para evitar depender de una fuente remota
- [x] Revisar encabezado, menú lateral, botones, modales y tarjetas de estadísticas
- [ ] Ajustar alturas, anchos o saltos de línea únicamente donde exista un problema comprobado
- [x] Mantener colores y estilos mediante las variables existentes
- [ ] Verificar que nombres de usuario combinados con caracteres japoneses o coreanos se muestren correctamente
- [ ] Verificar composición de texto, interlineado, peso tipográfico y símbolos junto a caracteres CJK

## FASE 4: Traducir Google Play y las novedades

### Objetivo

Preparar una experiencia completa para usuarios japoneses y coreanos desde la ficha hasta cada actualización.

- [x] Agregar `ja-JP` y `ko-KR` a `PublicacionGooglePlay/FichaGooglePlay.json`
- [x] Traducir nombre, descripción corta y descripción completa
- [x] Respetar los límites vigentes de caracteres de Google Play
- [x] Agregar novedades de actualización para ambos idiomas en `public/version.json`
- [x] Confirmar que las skills detectan y generan ambos idiomas automáticamente
- [x] Ejecutar una simulación controlada de `release-notas-de-parche` y comprobar notas para `ja-JP` y `ko-KR`
- [ ] Cargar ambas fichas y sus notas de versión en Play Console
- [ ] Revisar manualmente los textos antes de publicarlos

## FASE TESTING

### Objetivo

Validar traducción, persistencia y presentación visual en japonés y coreano.

- [x] Ejecutar ESLint y los validadores de idiomas y publicación
- [x] Comparar claves, tipos e interpolaciones de `ja-JP` y `ko-KR` contra el idioma fuente
- [x] Simular dispositivos configurados en japonés y coreano
- [x] Ampliar `Scripts/ProbarIdiomas.js` con `ja`, `ja-JP`, `ko` y `ko-KR`; la prueba de persistencia recorrerá automáticamente todos los idiomas habilitados
- [x] Seleccionar ambos idiomas y confirmar que los nombres y textos cambian correctamente
- [ ] Cerrar completamente la app en ambos idiomas, volver a abrirla y confirmar su persistencia
- [x] Recorrer visualmente las pantallas principales en japonés y coreano
- [ ] Probar nombres de usuario con caracteres japoneses y coreanos
- [ ] Revisar visualmente celular y tablet en orientación vertical y horizontal
- [ ] Confirmar que no existan caracteres faltantes, cuadros vacíos ni texto cortado
- [x] Verificar técnicamente `lang`, roles ARIA, foco y navegación por teclado
- [ ] Confirmar manualmente con TalkBack la pronunciación y el anuncio de selección en japonés y coreano
- [x] Probar el contrato del modal con novedades reales en ambos idiomas
- [x] Validar la ficha de Google Play y sus límites de caracteres
- [x] Ejecutar el build de producción antes de publicar

## Progreso del plan

- [x] Fase 1: Registrar los idiomas
- [ ] Fase 2: Traducir la aplicación
- [ ] Fase 3: Adaptar la interfaz
- [ ] Fase 4: Traducir Google Play y las novedades
- [ ] Fase Testing

Fecha de creación: 13 de Junio 2026
Fecha de última actualización: 14 de Junio 2026
Estado: EN PROCESO

## Verificación realizada el 14 de junio de 2026

- Validadores, pruebas automatizadas, ESLint y build Android de producción completados correctamente.
- APK de prueba compilada, instalada y abierta en el dispositivo Android `M2102J20SG`.
- El dispositivo incluye fuentes locales `NotoSansCJK` y `NotoSerifCJK`.
- Revisión manual confirmada por Leo: al seleccionar japonés y coreano cambian correctamente los nombres y textos visibles.
- Quedan pendientes la revisión lingüística independiente, la persistencia tras reiniciar, las pruebas funcionales completas, TalkBack y la carga en Play Console.
