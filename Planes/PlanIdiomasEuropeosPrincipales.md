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

- [ ] Crear `src/i18n/IdiomasApp.json` en UTF-8
- [ ] Definir para cada idioma su código de aplicación, código de Google Play, nombre nativo, región, alias de detección y estado habilitado
- [ ] Identificar explícitamente `es-AR` como idioma fuente y predeterminado, y `en-US` como fallback
- [ ] Incluir inicialmente `es-AR`, `en-US`, `pt-BR`, `fr-FR`, `it-IT` y `de-DE`
- [ ] Definir un esquema estable para el catálogo y rechazar códigos duplicados, alias repetidos o idiomas sin código de Google Play
- [ ] Migrar los módulos existentes a rutas nuevas con PascalCase, por ejemplo `src/i18n/EsAR/Index.js` y `src/i18n/EnUS/Index.js`
- [ ] Crear los nuevos módulos bajo rutas PascalCase, por ejemplo `PtBR/Index.js`, sin usar códigos BCP 47 como nombres de carpetas
- [ ] Refactorizar `src/i18n/index.js` para registrar solamente módulos locales conocidos y comprobar que coincidan con los idiomas habilitados
- [ ] No construir rutas de importación directamente desde valores JSON ni aceptar rutas arbitrarias en el catálogo
- [ ] Crear una función reutilizable que canonicalice códigos BCP 47 y normalice los idiomas del sistema a uno habilitado
- [ ] Evaluar `navigator.languages` en orden de preferencia antes de recurrir a `navigator.language`
- [ ] Admitir coincidencia exacta, alias declarado y coincidencia por idioma base antes de usar el predeterminado
- [ ] Reemplazar la detección binaria de español o inglés en `src/boot/i18n.js`
- [ ] Reutilizar la misma normalización en `src/components/Composables/useIdioma.js`
- [ ] Validar el idioma guardado antes de asignarlo y usar el fallback cuando ya no esté habilitado
- [ ] Actualizar `document.documentElement.lang` cada vez que cambie el idioma
- [ ] Crear `Scripts/ValidarIdiomas.js` para validar catálogo, módulos, claves, interpolaciones y códigos de Google Play
- [ ] Agregar un comando npm para ejecutar la validación de idiomas de forma independiente y dentro del release

## FASE 2: Convertir el selector en una interfaz dinámica

### Objetivo

Hacer que la configuración de idioma consuma el catálogo central sin agregar botones manuales por cada idioma.

- [ ] Refactorizar `ConfiguracionIdioma.vue` para renderizar los idiomas habilitados desde `IdiomasApp.json`
- [ ] Mostrar cada idioma mediante su nombre nativo para que siempre sea reconocible
- [ ] Sustituir el cálculo binario del nombre actual por una búsqueda en el catálogo
- [ ] Mantener selección, guardado, cancelación y notificaciones existentes
- [ ] Ajustar el modal para que la lista siga siendo usable con seis idiomas
- [ ] Incorporar desplazamiento interno, foco visible y navegación por teclado en la lista
- [ ] Verificar que el idioma seleccionado se anuncie correctamente a tecnologías de asistencia
- [ ] Verificar que los estilos usen únicamente variables de `src/css/Variables.css`

## FASE 3: Traducir la aplicación

### Objetivo

Agregar traducciones completas y consistentes para portugués, francés, italiano y alemán.

- [ ] Crear `src/i18n/PtBR/Index.js`
- [ ] Crear `src/i18n/FrFR/Index.js`
- [ ] Crear `src/i18n/ItIT/Index.js`
- [ ] Crear `src/i18n/DeDE/Index.js`
- [ ] Conservar exactamente la misma estructura de claves que `es-AR` y `en-US`
- [ ] Traducir textos generales, configuración, menú, juego, puntuación, estadísticas y actualización
- [ ] Conservar interpolaciones como `{puntos}`, `{victorias}`, `{partidas}` y `{cantidad}`
- [ ] Auditar componentes y páginas para detectar textos visibles fuera de `vue-i18n`
- [ ] Mover a `vue-i18n` cualquier texto visible que todavía esté escrito directamente en la interfaz
- [ ] Traducir `ErrorNotFound.vue` y eliminar los valores visibles fijos de los componentes compartidos, como los textos predeterminados de `ModalConfirmacion.vue`
- [ ] Revisar pluralización y concordancia en textos que dependen de cantidades, sin concatenar singulares y plurales manualmente
- [ ] Usar `Intl.NumberFormat` y formatos dependientes del idioma cuando se muestren números, porcentajes, fechas o duraciones
- [ ] Revisar que el vocabulario del juego sea natural y consistente en cada idioma

## FASE 4: Versionar la ficha de Google Play

### Objetivo

Mantener en el repositorio los textos oficiales de Google Play para todos los idiomas publicados.

- [ ] Crear la carpeta `PublicacionGooglePlay`
- [ ] Crear `PublicacionGooglePlay/FichaGooglePlay.json` en UTF-8
- [ ] Definir por idioma el nombre de la app, descripción corta y descripción completa
- [ ] Incluir `es-419`, `en-US`, `pt-BR`, `fr-FR`, `it-IT` y `de-DE`
- [ ] Validar los límites vigentes de Google Play: 30 caracteres para el nombre, 80 para la descripción corta y 4000 para la descripción completa
- [ ] Mantener el mismo posicionamiento y las mismas funciones destacadas en todos los idiomas
- [ ] Evitar afirmaciones promocionales no comprobables o términos que incumplan las políticas de metadatos
- [ ] Documentar en el mismo archivo o en un campo descriptivo la correspondencia entre idioma de app y código de Google Play
- [ ] Mantener el archivo como datos puros y no guardar credenciales, tokens ni identificadores sensibles de Play Console
- [ ] Revisar si las capturas contienen texto y preparar recursos localizados solo cuando aporten valor
- [ ] Preparar los textos finales para cargarlos manualmente en Play Console

## FASE 5: Generalizar la skill de notas del modal

### Objetivo

Hacer que `notas-modal` detecte los idiomas de cada proyecto y aplique novedades sin imponer una combinación fija.

- [ ] Actualizar la documentación de la skill global `notas-modal`
- [ ] Modificar `scripts/NotasModal.py` para leer primero un catálogo de idiomas del proyecto cuando exista
- [ ] Detectar `src/i18n/IdiomasApp.json` como contrato preferente en TaTeTi
- [ ] Incorporar un fallback que detecte idiomas desde la estructura i18n o desde las claves existentes de `version.json`
- [ ] Usar español como idioma fuente predeterminado cuando el proyecto no declare otro idioma fuente
- [ ] Reemplazar los argumentos fijos `--novedades-es` y `--novedades-en` por un archivo JSON estructurado por código de idioma
- [ ] Validar esquema, códigos, cantidad máxima de ítems y longitud antes de modificar el archivo de destino
- [ ] Resolver y validar rutas para impedir escrituras fuera del repositorio objetivo
- [ ] Mantener compatibilidad con proyectos antiguos que solo tengan español o español e inglés
- [ ] Reemplazar únicamente `cambios` y conservar los demás campos de `version.json`
- [ ] Generar el apartado de novedades traducido de forma natural para cada idioma detectado
- [ ] Validar que todos los idiomas habilitados tengan novedades antes de aplicar el archivo
- [ ] Escribir primero en un archivo temporal y reemplazar el destino de forma atómica para evitar un JSON truncado
- [ ] Evitar interpolar traducciones dentro de comandos de shell para no depender del escapado de comillas o caracteres especiales
- [ ] Actualizar los ejemplos de uso y la salida final de la skill

## FASE 6: Generalizar la skill de release

### Objetivo

Hacer que `release-notas-de-parche` prepare notas para los idiomas reales del proyecto.

- [ ] Actualizar la documentación de la skill global `release-notas-de-parche`
- [ ] Reutilizar el mismo orden de detección de idiomas definido para `notas-modal`
- [ ] Usar español como idioma fuente predeterminado cuando el proyecto no declare otro
- [ ] Eliminar la obligación fija de entregar únicamente `es-419` y `en-US`
- [ ] Generar una sección de notas por cada código de Google Play detectado
- [ ] Mantener el límite máximo de 450 caracteres por idioma
- [ ] Detener el release si falta una traducción requerida por un idioma habilitado
- [ ] Ejecutar el validador de idiomas y metadatos antes del build y antes de crear commit o tag
- [ ] Mantener sin cambios las reglas de AdMob, compilación, commit, tag, ausencia de push y apertura final de Android Studio
- [ ] Verificar que proyectos monolingües y bilingües sigan funcionando sin configuración adicional

## FASE 7: Endurecer el contrato remoto de actualización

### Objetivo

Evitar que datos remotos inválidos, excesivos o manipulados alteren el flujo de actualización.

- [ ] Validar que `urlPlayStore` use HTTPS, el dominio oficial `play.google.com` y el identificador esperado `com.leotateti.tateti`
- [ ] Ignorar cualquier URL remota que no cumpla la lista permitida y usar `URL_PLAY_STORE_POR_DEFECTO`
- [ ] Limitar la cantidad de apartados, novedades y caracteres aceptados desde `version.json`
- [ ] Validar el tipo y tamaño razonable de los campos antes de mostrarlos
- [ ] Mantener el renderizado como texto y no introducir `v-html` para las novedades
- [ ] Agregar pruebas unitarias para URL válida, dominio falso, paquete incorrecto, notas excesivas y estructura inválida
- [ ] Mantener el timeout y el comportamiento no bloqueante ante errores de red

## FASE 8: Integrar novedades y publicación

### Objetivo

Conectar los nuevos idiomas con el modal y preparar su publicación coordinada en Google Play.

- [ ] Actualizar `Scripts/GenerarVersionJson.js` para inicializar novedades según los idiomas habilitados sin sobrescribir las existentes
- [ ] Revisar `Scripts/ValidarVersionPublicacion.js` para exigir novedades válidas en todos los idiomas habilitados cuando `mostrarActualizacion` sea `true`
- [ ] Cambiar el fallback de `ServicioActualizacionApp.js` para usar la configuración central en lugar de depender directamente de `es-AR`
- [ ] Agregar novedades traducidas a `public/version.json` para los seis idiomas
- [ ] Cargar en Play Console las fichas `pt-BR`, `fr-FR`, `it-IT` y `de-DE`
- [ ] Agregar notas de la versión en los códigos correspondientes de Google Play
- [ ] Publicar la app y las fichas nuevas de forma coordinada para evitar una experiencia parcialmente traducida

## FASE TESTING

### Objetivo

Validar la infraestructura compartida y los cuatro idiomas en la aplicación, las skills y Google Play.

- [ ] Ejecutar ESLint y corregir todos los errores
- [ ] Ejecutar `Scripts/ValidarIdiomas.js` y detectar claves faltantes, adicionales, tipos incompatibles e interpolaciones distintas
- [ ] Ejecutar pruebas unitarias de normalización, persistencia, fallback y validación del contrato remoto
- [ ] Confirmar que cada idioma puede seleccionarse, guardarse y restaurarse al reiniciar
- [ ] Simular códigos completos, códigos base, mayúsculas distintas y preferencias múltiples para portugués, francés, italiano y alemán
- [ ] Verificar que un dispositivo sin idioma soportado use `es-AR` como idioma predeterminado y que las claves faltantes recurran a `en-US`
- [ ] Recorrer juego contra IA, multijugador, estadísticas, configuración y modal de actualización en cada idioma
- [ ] Revisar desbordes, cortes, saltos de línea y botones con textos largos en celular y tablet
- [ ] Verificar el atributo `lang`, foco, navegación por teclado y lectura del selector con tecnología de asistencia
- [ ] Revisar pluralización y formatos de números, porcentajes y duraciones en cada idioma
- [ ] Probar novedades traducidas en `public/version.json` para cada idioma
- [ ] Ejecutar `notas-modal` en un proyecto monolingüe, uno bilingüe y TaTeTi
- [ ] Ejecutar una validación controlada de `release-notas-de-parche` sin publicar ni cerrar un release real
- [ ] Validar automáticamente el JSON de `FichaGooglePlay.json` y sus límites de caracteres
- [ ] Revisar manualmente en Play Console las cuatro fichas antes de publicarlas
- [ ] Ejecutar el build de producción y confirmar que incluye todos los archivos de traducción

## Progreso del plan

- [ ] Fase 1: Centralizar la configuración de idiomas
- [ ] Fase 2: Convertir el selector en una interfaz dinámica
- [ ] Fase 3: Traducir la aplicación
- [ ] Fase 4: Versionar la ficha de Google Play
- [ ] Fase 5: Generalizar la skill de notas del modal
- [ ] Fase 6: Generalizar la skill de release
- [ ] Fase 7: Endurecer el contrato remoto de actualización
- [ ] Fase 8: Integrar novedades y publicación
- [ ] Fase Testing

Fecha de creación: 13 de Junio 2026
Fecha de última actualización: 13 de Junio 2026
Estado: BORRADOR
