# PLAN IDIOMAS EUROPEOS PRINCIPALES

## Descripción del plan

Agregar portugués de Brasil, francés de Francia, italiano y alemán a TaTeTi. Esta primera etapa también debe centralizar la configuración de idiomas, preparar una fuente mantenible para la ficha de Google Play y adaptar las skills globales de notas de parche para trabajar con los idiomas reales de cada proyecto.

## Objetivo principal

- Incorporar `pt-BR`, `fr-FR`, `it-IT` y `de-DE` a la aplicación
- Centralizar los idiomas habilitados y sus códigos de aplicación y Google Play
- Mantener en el repositorio las traducciones de la ficha de Google Play
- Adaptar las skills globales para detectar idiomas sin imponer español e inglés
- Publicar la aplicación y su ficha de Google Play en los cuatro idiomas

## Reglas del plan

- Mantener `es-AR` como idioma fuente y predeterminado del proyecto, y `en-US` como fallback técnico de traducciones faltantes
- Usar portugués de Brasil con el código `pt-BR`
- Usar los códigos de Google Play `es-419`, `en-US`, `pt-BR`, `fr-FR`, `it-IT` y `de-DE`
- No usar `public/version.json` como fuente de configuración de idiomas
- Mantener `public/version.json` limitado al contrato de versión, URL, visualización y novedades
- Tratar el catálogo de idiomas como configuración local incluida en el build, nunca como contenido remoto ejecutable
- Usar códigos BCP 47 en los datos, aunque los nombres de archivos y carpetas nuevos respeten PascalCase
- No traducir nombres propios como `TaTeTi` y `NEXUS` salvo decisión explícita
- Conservar variables, funciones y claves internas en español
- Evitar traducciones literales que resulten poco naturales para usuarios nativos

## FASE 1: Centralizar la configuración de idiomas

### Objetivo

Crear una única fuente de verdad para los idiomas disponibles y eliminar las listas duplicadas del flujo actual.

- [x] Crear `src/i18n/IdiomasApp.json` en UTF-8
- [x] Definir para cada idioma su código de aplicación, código de Google Play, nombre nativo, región, alias de detección y estado habilitado
- [x] Identificar explícitamente `es-AR` como idioma fuente y predeterminado, y `en-US` como fallback
- [x] Incluir inicialmente `es-AR`, `en-US`, `pt-BR`, `fr-FR`, `it-IT` y `de-DE`
- [x] Definir un esquema estable para el catálogo y rechazar códigos duplicados, alias repetidos o idiomas sin código de Google Play
- [x] Migrar los módulos existentes a rutas nuevas con PascalCase, por ejemplo `src/i18n/EsAR/Index.js` y `src/i18n/EnUS/Index.js`
- [x] Crear los nuevos módulos bajo rutas PascalCase, por ejemplo `PtBR/Index.js`, sin usar códigos BCP 47 como nombres de carpetas
- [x] Refactorizar `src/i18n/index.js` para registrar solamente módulos locales conocidos y comprobar que coincidan con los idiomas habilitados
- [x] No construir rutas de importación directamente desde valores JSON ni aceptar rutas arbitrarias en el catálogo
- [x] Crear una función reutilizable que canonicalice códigos BCP 47 y normalice los idiomas del sistema a uno habilitado
- [x] Evaluar `navigator.languages` en orden de preferencia antes de recurrir a `navigator.language`
- [x] Admitir coincidencia exacta, alias declarado y coincidencia por idioma base antes de usar el predeterminado
- [x] Reemplazar la detección binaria de español o inglés en `src/boot/i18n.js`
- [x] Reutilizar la misma normalización en `src/components/Composables/useIdioma.js`
- [x] Validar el idioma guardado antes de asignarlo y usar el fallback cuando ya no esté habilitado
- [x] Actualizar `document.documentElement.lang` cada vez que cambie el idioma
- [x] Crear `Scripts/ValidarIdiomas.js` para validar catálogo, módulos, claves, interpolaciones y códigos de Google Play
- [x] Agregar un comando npm para ejecutar la validación de idiomas de forma independiente y dentro del release

## FASE 2: Convertir el selector en una interfaz dinámica

### Objetivo

Hacer que la configuración de idioma consuma el catálogo central sin agregar botones manuales por cada idioma.

- [x] Refactorizar `ConfiguracionIdioma.vue` para renderizar los idiomas habilitados desde `IdiomasApp.json`
- [x] Mostrar cada idioma mediante su nombre nativo para que siempre sea reconocible
- [x] Sustituir el cálculo binario del nombre actual por una búsqueda en el catálogo
- [x] Mantener selección, guardado, cancelación y notificaciones existentes
- [x] Ajustar el modal para que la lista siga siendo usable con seis idiomas
- [x] Incorporar desplazamiento interno, foco visible y navegación por teclado en la lista
- [ ] Verificar que el idioma seleccionado se anuncie correctamente a tecnologías de asistencia
- [x] Verificar que los estilos usen únicamente variables de `src/css/Variables.css`

## FASE 3: Traducir la aplicación

### Objetivo

Agregar traducciones completas y consistentes para portugués, francés, italiano y alemán.

- [x] Crear `src/i18n/PtBR/Index.js`
- [x] Crear `src/i18n/FrFR/Index.js`
- [x] Crear `src/i18n/ItIT/Index.js`
- [x] Crear `src/i18n/DeDE/Index.js`
- [x] Conservar exactamente la misma estructura de claves que `es-AR` y `en-US`
- [x] Traducir textos generales, configuración, menú, juego, puntuación, estadísticas y actualización
- [x] Conservar interpolaciones como `{puntos}`, `{victorias}`, `{partidas}` y `{cantidad}`
- [x] Auditar componentes y páginas para detectar textos visibles fuera de `vue-i18n`
- [x] Mover a `vue-i18n` cualquier texto visible que todavía esté escrito directamente en la interfaz
- [x] Traducir `ErrorNotFound.vue` y eliminar los valores visibles fijos de los componentes compartidos, como los textos predeterminados de `ModalConfirmacion.vue`
- [x] Revisar pluralización y concordancia en textos que dependen de cantidades, sin concatenar singulares y plurales manualmente
- [x] Usar `Intl.NumberFormat` y formatos dependientes del idioma cuando se muestren números, porcentajes, fechas o duraciones
- [x] Revisar que el vocabulario del juego sea natural y consistente en cada idioma

## FASE 4: Versionar la ficha de Google Play

### Objetivo

Mantener en el repositorio los textos oficiales de Google Play para todos los idiomas publicados.

- [x] Crear la carpeta `PublicacionGooglePlay`
- [x] Crear `PublicacionGooglePlay/FichaGooglePlay.json` en UTF-8
- [x] Definir por idioma el nombre de la app, descripción corta y descripción completa
- [x] Incluir `es-419`, `en-US`, `pt-BR`, `fr-FR`, `it-IT` y `de-DE`
- [x] Validar los límites vigentes de Google Play: 30 caracteres para el nombre, 80 para la descripción corta y 4000 para la descripción completa
- [x] Mantener el mismo posicionamiento y las mismas funciones destacadas en todos los idiomas
- [x] Evitar afirmaciones promocionales no comprobables o términos que incumplan las políticas de metadatos
- [x] Documentar en el mismo archivo o en un campo descriptivo la correspondencia entre idioma de app y código de Google Play
- [x] Mantener el archivo como datos puros y no guardar credenciales, tokens ni identificadores sensibles de Play Console
- [x] Revisar si las capturas contienen texto y preparar recursos localizados solo cuando aporten valor
- [x] Preparar los textos finales para cargarlos manualmente en Play Console

## FASE 5: Generalizar la skill de notas del modal

### Objetivo

Hacer que `notas-modal` detecte los idiomas de cada proyecto y aplique novedades sin imponer una combinación fija.

- [x] Actualizar la documentación de la skill global `notas-modal`
- [x] Modificar `scripts/NotasModal.py` para leer primero un catálogo de idiomas del proyecto cuando exista
- [x] Detectar `src/i18n/IdiomasApp.json` como contrato preferente en TaTeTi
- [x] Incorporar un fallback que detecte idiomas desde la estructura i18n o desde las claves existentes de `version.json`
- [x] Usar español como idioma fuente predeterminado cuando el proyecto no declare otro idioma fuente
- [x] Reemplazar los argumentos fijos `--novedades-es` y `--novedades-en` por un archivo JSON estructurado por código de idioma
- [x] Validar esquema, códigos, cantidad máxima de ítems y longitud antes de modificar el archivo de destino
- [x] Resolver y validar rutas para impedir escrituras fuera del repositorio objetivo
- [x] Mantener compatibilidad con proyectos antiguos que solo tengan español o español e inglés
- [x] Reemplazar únicamente `cambios` y conservar los demás campos de `version.json`
- [x] Generar el apartado de novedades traducido de forma natural para cada idioma detectado
- [x] Validar que todos los idiomas habilitados tengan novedades antes de aplicar el archivo
- [x] Escribir primero en un archivo temporal y reemplazar el destino de forma atómica para evitar un JSON truncado
- [x] Evitar interpolar traducciones dentro de comandos de shell para no depender del escapado de comillas o caracteres especiales
- [x] Actualizar los ejemplos de uso y la salida final de la skill

## FASE 6: Generalizar la skill de release

### Objetivo

Hacer que `release-notas-de-parche` prepare notas para los idiomas reales del proyecto.

- [x] Actualizar la documentación de la skill global `release-notas-de-parche`
- [x] Reutilizar el mismo orden de detección de idiomas definido para `notas-modal`
- [x] Usar español como idioma fuente predeterminado cuando el proyecto no declare otro
- [x] Eliminar la obligación fija de entregar únicamente `es-419` y `en-US`
- [x] Generar una sección de notas por cada código de Google Play detectado
- [x] Mantener el límite máximo de 450 caracteres por idioma
- [x] Detener el release si falta una traducción requerida por un idioma habilitado
- [x] Ejecutar el validador de idiomas y metadatos antes del build y antes de crear commit o tag
- [x] Mantener sin cambios las reglas de AdMob, compilación, commit, tag, ausencia de push y apertura final de Android Studio
- [x] Verificar que proyectos monolingües y bilingües sigan funcionando sin configuración adicional

## FASE 7: Endurecer el contrato remoto de actualización

### Objetivo

Evitar que datos remotos inválidos, excesivos o manipulados alteren el flujo de actualización.

- [x] Validar que `urlPlayStore` use HTTPS, el dominio oficial `play.google.com` y el identificador esperado `com.leotateti.tateti`
- [x] Ignorar cualquier URL remota que no cumpla la lista permitida y usar `URL_PLAY_STORE_POR_DEFECTO`
- [x] Limitar la cantidad de apartados, novedades y caracteres aceptados desde `version.json`
- [x] Validar el tipo y tamaño razonable de los campos antes de mostrarlos
- [x] Mantener el renderizado como texto y no introducir `v-html` para las novedades
- [x] Agregar pruebas unitarias para URL válida, dominio falso, paquete incorrecto, notas excesivas y estructura inválida
- [x] Mantener el timeout y el comportamiento no bloqueante ante errores de red

## FASE 8: Integrar novedades y publicación

### Objetivo

Conectar los nuevos idiomas con el modal y preparar su publicación coordinada en Google Play.

- [x] Actualizar `Scripts/GenerarVersionJson.js` para inicializar novedades según los idiomas habilitados sin sobrescribir las existentes
- [x] Revisar `Scripts/ValidarVersionPublicacion.js` para exigir novedades válidas en todos los idiomas habilitados cuando `mostrarActualizacion` sea `true`
- [x] Cambiar el fallback de `ServicioActualizacionApp.js` para usar la configuración central en lugar de depender directamente de `es-AR`
- [x] Agregar novedades traducidas a `public/version.json` para los seis idiomas
- [x] Cargar en Play Console las fichas `pt-BR`, `fr-FR`, `it-IT` y `de-DE`
- [ ] Agregar notas de la versión en los códigos correspondientes de Google Play
- [ ] Publicar la app y las fichas nuevas de forma coordinada para evitar una experiencia parcialmente traducida

## FASE TESTING

### Objetivo

Validar la infraestructura compartida y los cuatro idiomas en la aplicación, las skills y Google Play.

- [x] Ejecutar ESLint y corregir todos los errores
- [x] Ejecutar `Scripts/ValidarIdiomas.js` y detectar claves faltantes, adicionales, tipos incompatibles e interpolaciones distintas
- [ ] Ejecutar pruebas unitarias de normalización, persistencia, fallback y validación del contrato remoto
- [x] Confirmar que cada idioma puede seleccionarse, guardarse y restaurarse al reiniciar
- [x] Simular códigos completos, códigos base, mayúsculas distintas y preferencias múltiples para portugués, francés, italiano y alemán
- [x] Verificar que un dispositivo sin idioma soportado use `es-AR` como idioma predeterminado y que las claves faltantes recurran a `en-US`
- [x] Recorrer juego contra IA, multijugador, estadísticas, configuración y modal de actualización en cada idioma
- [x] Revisar desbordes, cortes, saltos de línea y botones con textos largos en celular y tablet
- [ ] Verificar el atributo `lang`, foco, navegación por teclado y lectura del selector con tecnología de asistencia
- [x] Revisar pluralización y formatos de números, porcentajes y duraciones en cada idioma
- [x] Probar novedades traducidas en `public/version.json` para cada idioma
- [x] Ejecutar `notas-modal` en un proyecto monolingüe, uno bilingüe y TaTeTi
- [ ] Ejecutar una validación controlada de `release-notas-de-parche` sin publicar ni cerrar un release real
- [x] Validar automáticamente el JSON de `FichaGooglePlay.json` y sus límites de caracteres
- [x] Revisar manualmente en Play Console las cuatro fichas antes de publicarlas
- [x] Ejecutar el build de producción y confirmar que incluye todos los archivos de traducción

## Progreso del plan

- [x] Fase 1: Centralizar la configuración de idiomas
- [ ] Fase 2: Convertir el selector en una interfaz dinámica
- [x] Fase 3: Traducir la aplicación
- [x] Fase 4: Versionar la ficha de Google Play
- [x] Fase 5: Generalizar la skill de notas del modal
- [x] Fase 6: Generalizar la skill de release
- [x] Fase 7: Endurecer el contrato remoto de actualización
- [ ] Fase 8: Integrar novedades y publicación
- [ ] Fase Testing

Fecha de creación: 13 de Junio 2026
Fecha de última actualización: 14 de Junio 2026
Estado: EN PROCESO
