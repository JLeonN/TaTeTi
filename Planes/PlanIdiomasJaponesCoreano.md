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
- Usar rutas PascalCase para los módulos y mantener los códigos BCP 47 únicamente como datos
- Conservar nombres propios como `TaTeTi` y `NEXUS` salvo decisión explícita
- Priorizar traducciones naturales y breves sobre traducciones literales

## FASE 1: Registrar los idiomas

### Objetivo

Habilitar japonés y coreano mediante el catálogo central existente.

- [ ] Agregar japonés con código `ja-JP` a `src/i18n/IdiomasApp.json`
- [ ] Agregar coreano con código `ko-KR` a `src/i18n/IdiomasApp.json`
- [ ] Definir los nombres nativos `日本語` y `한국어`
- [ ] Confirmar que el registro dinámico de mensajes incluya ambos idiomas
- [ ] Confirmar que la detección del idioma del sistema reconoce ambas variantes
- [ ] Confirmar que el selector dinámico muestra ambos idiomas sin lógica adicional
- [ ] Confirmar que `document.documentElement.lang` cambia a `ja-JP` o `ko-KR`

## FASE 2: Traducir la aplicación

### Objetivo

Crear traducciones completas y coherentes para japonés y coreano.

- [ ] Crear `src/i18n/JaJP/Index.js`
- [ ] Crear `src/i18n/KoKR/Index.js`
- [ ] Conservar exactamente la misma estructura de claves que el idioma fuente
- [ ] Traducir textos generales, configuración, menú, juego, puntuación, estadísticas y actualización
- [ ] Conservar interpolaciones y símbolos funcionales sin modificaciones
- [ ] Adaptar el vocabulario del juego a los términos usados naturalmente en cada idioma
- [ ] Revisar tratamientos, tono y longitud para una interfaz de juego informal
- [ ] Evitar espacios o signos de puntuación impropios de japonés y coreano
- [ ] Revisar expresiones con cantidades para evitar plurales o concordancias heredadas innecesariamente
- [ ] Solicitar una revisión humana o independiente de los textos críticos antes de publicar

## FASE 3: Adaptar la interfaz

### Objetivo

Garantizar que ambos sistemas de escritura sean legibles y no rompan el diseño existente.

- [ ] Revisar que las fuentes actuales incluyan glifos completos para japonés y coreano
- [ ] Definir una pila de fuentes de sistema compatible si Roboto no cubre esos caracteres sin depender de una fuente remota
- [ ] Revisar encabezado, menú lateral, botones, modales y tarjetas de estadísticas
- [ ] Ajustar alturas, anchos o saltos de línea únicamente donde exista un problema comprobado
- [ ] Mantener colores y estilos mediante las variables existentes
- [ ] Verificar que nombres de usuario combinados con caracteres japoneses o coreanos se muestren correctamente
- [ ] Verificar composición de texto, interlineado, peso tipográfico y símbolos junto a caracteres CJK

## FASE 4: Traducir Google Play y las novedades

### Objetivo

Preparar una experiencia completa para usuarios japoneses y coreanos desde la ficha hasta cada actualización.

- [ ] Agregar `ja-JP` y `ko-KR` a `PublicacionGooglePlay/FichaGooglePlay.json`
- [ ] Traducir nombre, descripción corta y descripción completa
- [ ] Respetar los límites vigentes de caracteres de Google Play
- [ ] Agregar novedades de actualización para ambos idiomas en `public/version.json`
- [ ] Confirmar que las skills detectan y generan ambos idiomas automáticamente
- [ ] Cargar ambas fichas y sus notas de versión en Play Console
- [ ] Revisar manualmente los textos antes de publicarlos

## FASE TESTING

### Objetivo

Validar traducción, persistencia y presentación visual en japonés y coreano.

- [ ] Ejecutar ESLint y los validadores de idiomas y publicación
- [ ] Comparar claves, tipos e interpolaciones de `ja-JP` y `ko-KR` contra el idioma fuente
- [ ] Simular dispositivos configurados en japonés y coreano
- [ ] Seleccionar ambos idiomas, reiniciar la app y confirmar su persistencia
- [ ] Recorrer juego contra IA, multijugador, estadísticas, configuración y actualización
- [ ] Probar nombres de usuario con caracteres japoneses y coreanos
- [ ] Revisar visualmente celular y tablet en orientación vertical y horizontal
- [ ] Confirmar que no existan caracteres faltantes, cuadros vacíos ni texto cortado
- [ ] Confirmar que el lector de pantalla detecte correctamente el idioma del documento
- [ ] Probar el modal con novedades reales en ambos idiomas
- [ ] Validar la ficha de Google Play y sus límites de caracteres
- [ ] Ejecutar el build de producción antes de publicar

## Progreso del plan

- [ ] Fase 1: Registrar los idiomas
- [ ] Fase 2: Traducir la aplicación
- [ ] Fase 3: Adaptar la interfaz
- [ ] Fase 4: Traducir Google Play y las novedades
- [ ] Fase Testing

Fecha de creación: 13 de Junio 2026
Fecha de última actualización: 13 de Junio 2026
Estado: BORRADOR
