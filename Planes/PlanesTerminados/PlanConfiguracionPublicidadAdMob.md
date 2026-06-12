# PLAN CONFIGURACIÓN DE PUBLICIDAD ADMOB

## Descripción del plan

Adaptar TaTeTi al contrato utilizado por las skills `InstalarCel` y `release-notas-de-parche`. La aplicación tendrá un archivo central de configuración que permitirá alternar entre publicidad de prueba y publicidad real mediante un valor booleano, sin modificar las skills compartidas.

La integración de publicidad puede ejecutarse directamente. La ejecución completa de los flujos Android requiere resolver primero la diferencia entre la ruta `android` esperada por las skills y la ruta real `src-capacitor/android` utilizada por TaTeTi.

## Objetivo principal

- Crear una configuración central compatible con las skills existentes
- Usar anuncios de prueba al generar e instalar un APK en el celular de pruebas
- Usar anuncios reales al preparar el AAB de producción
- Evitar que una publicación de producción utilice accidentalmente publicidad de prueba

## Reglas del plan

- No modificar las skills `InstalarCel` ni `release-notas-de-parche`
- Usar `src/components/Configuracion/ConfiguracionPublicidad.js` como ruta obligatoria
- Declarar exactamente `export const esModoPruebaPublicidad = false` para que las skills puedan detectar y modificar el valor
- Mantener `esModoPruebaPublicidad` en `false` como valor predeterminado del repositorio
- Usar únicamente IDs oficiales de prueba de Google cuando el modo de prueba esté activo
- Mostrar el header principal en color naranja cuando `esModoPruebaPublicidad` sea `true`
- Toda publicación con notas visibles debe usar `mostrarActualizacion: true`
- Mantener `src-capacitor/android` como única estructura Android del proyecto
- No crear una segunda carpeta `android`, copias del proyecto nativo ni enlaces de compatibilidad frágiles
- Mantener los archivos nuevos y modificados en UTF-8
- Respetar la nomenclatura en español y las reglas de ESLint del proyecto

## FASE 1: Crear la configuración central

### Objetivo

Crear el archivo reconocido por las skills y definir claramente el modo de publicidad de la aplicación.

- [x] Crear la carpeta `src/components/Configuracion` con nombre PascalCase si todavía no existe
- [x] Crear `src/components/Configuracion/ConfiguracionPublicidad.js`
- [x] Declarar exactamente `export const esModoPruebaPublicidad = false`
- [x] Centralizar los IDs de prueba y producción de banner e intersticial
- [x] Exportar una única configuración de IDs seleccionada mediante `esModoPruebaPublicidad`
- [x] Mantener los IDs reales existentes sin exponerlos en registros innecesarios

## FASE 2: Integrar la configuración con AdMob

### Objetivo

Hacer que el composable de publicidad dependa únicamente del nuevo archivo central.

- [x] Revisar `src/components/Composables/usePublicidad.js` y conservar su comportamiento actual
- [x] Eliminar el uso de `process.env.MODO_PRUEBA_ADS`
- [x] Eliminar `MODO_PRUEBA_ADS` de `quasar.config.js` para evitar dos fuentes de configuración
- [x] Importar `esModoPruebaPublicidad` y los IDs seleccionados desde `ConfiguracionPublicidad.js`
- [x] Usar `esModoPruebaPublicidad` en `initializeForTesting`
- [x] Verificar que el banner use el ID correspondiente al modo activo
- [x] Verificar que el intersticial use el ID correspondiente al modo activo
- [x] Reducir o eliminar registros que muestren IDs reales completos en la consola
- [x] Confirmar que `MainLayout.vue`, `JugarContraIA.vue` y `JugarMultijugador.vue` continúen consumiendo `usePublicidad` sin cambios de contrato

## FASE 3: Resolver el contrato Android de las skills

### Objetivo

Resolver la diferencia de rutas Android antes de ejecutar las skills, sin duplicar el proyecto nativo.

- [x] Conservar `src-capacitor/android` como ruta Android canónica de TaTeTi
- [x] Confirmar que `InstalarCel` actualmente intenta usar `android/app` desde la raíz y registrar esta incompatibilidad antes de ejecutarla
- [x] Confirmar que el flujo de release debe ejecutar Capacitor dentro de `src-capacitor`
- [ ] Definir una solución compartida que permita a las skills reconocer proyectos Quasar con `src-capacitor`, sin agregar duplicaciones dentro de TaTeTi
- [x] No ejecutar `InstalarCel` hasta que su flujo pueda resolver `src-capacitor/android`
- [ ] No declarar compatible el release hasta que genere y verifique el artefacto dentro de `src-capacitor/android/app/build/outputs`

Resultado de ejecución: la app quedó preparada, pero las skills compartidas continúan esperando una carpeta `android` en la raíz. Resolverlo requiere actualizar las skills para detectar `src-capacitor` o cambiar una regla del plan.

## FASE 4: Documentar el contrato de publicidad

### Objetivo

Dejar claro el punto de integración para futuras modificaciones y ejecuciones automatizadas.

- [x] Agregar un comentario breve junto a `esModoPruebaPublicidad` indicando que las skills modifican ese valor
- [x] Documentar que `true` corresponde exclusivamente a instalaciones de prueba
- [x] Documentar que `false` es obligatorio para producción
- [x] Evitar instrucciones duplicadas fuera del archivo central

## FASE 5: Normalizar los artefactos Android

### Objetivo

Separar explícitamente la generación del APK de prueba y del AAB de producción.

- [x] Mantener un comando de APK que ejecute `assembleDebug` y verifique `src-capacitor/android/app/build/outputs/apk/debug/app-debug.apk`
- [x] Crear o ajustar un comando de AAB que ejecute `bundleRelease`
- [x] Verificar el AAB en `src-capacitor/android/app/build/outputs/bundle/release/app-release.aab`
- [x] Alinear el script `cel` con el contrato definido en `AGENTS.md`
- [x] Confirmar que el build actual con `assembleRelease` genera un APK release y no se use como prueba de generación de AAB
- [x] Mantener sincronizados `package.json` y `src-capacitor/android/app/build.gradle` durante el release

## FASE 6: Identificar visualmente el modo de prueba

### Objetivo

Mostrar una señal visual inmediata para evitar confundir una instalación de prueba con una compilación de producción.

- [x] Agregar una variable naranja específica para el modo de prueba en `src/css/Variables.css`
- [x] Importar `esModoPruebaPublicidad` en `MainLayout.vue`
- [x] Aplicar una clase condicional al header cuando `esModoPruebaPublicidad` sea `true`
- [x] Mantener el color normal del header cuando `esModoPruebaPublicidad` sea `false`

## FASE 7: Corregir la publicación del modal 4.0.5

### Objetivo

Activar el aviso remoto de la versión `4.0.5` y evitar que futuras publicaciones con novedades dejen el modal desactivado.

- [x] Confirmar que GitHub Pages publicó correctamente `versionDisponible: 4.0.5`
- [x] Identificar que el modal no apareció porque `mostrarActualizacion` permaneció en `false`
- [x] Documentar que `GenerarVersionJson.js` conserva el valor anterior y no activa el aviso automáticamente
- [x] Cambiar `public/version.json` a `mostrarActualizacion: true`
- [x] Mantener la versión `4.0.5` y las notas bilingües sin generar otra APK
- [x] Crear una validación que falle cuando existan novedades y `mostrarActualizacion` no sea `true`
- [x] Ejecutar la validación antes del flujo Android de release
- [x] Ejecutar la misma validación antes de publicar GitHub Pages
- [ ] Publicar el contrato corregido y verificar la respuesta remota sin caché
- [ ] Confirmar en un dispositivo con la versión `4.0.4` que el modal aparezca automáticamente
- [ ] Cerrar el modal y confirmar que pueda abrirse nuevamente desde el menú
- [ ] Confirmar que una instalación `4.0.5` no muestre el aviso

Resultado del incidente: la compilación Android `4.0.5` era correcta. El fallo estaba únicamente en el contrato remoto, por lo que la corrección no requiere cambiar la versión ni publicar otra aplicación.

## FASE TESTING

### Objetivo

Validar que la configuración seleccione correctamente la publicidad y que ambos flujos Android sean seguros.

- [x] Ejecutar ESLint y corregir todos los errores relacionados con los archivos modificados
- [x] Ejecutar el build web de Quasar con la configuración en `true` y en `false`
- [x] Establecer temporalmente `esModoPruebaPublicidad` en `true` y verificar que se seleccionen los IDs oficiales de prueba
- [x] Verificar que `initializeForTesting` reciba `true` en modo de prueba
- [ ] Ejecutar `InstalarCel` únicamente después de resolver la compatibilidad con `src-capacitor/android`
- [x] Confirmar que la skill cambie exactamente `export const esModoPruebaPublicidad = false` a `true`
- [ ] Instalar el APK debug mediante `InstalarCel`
- [ ] Confirmar en el dispositivo que el banner y el intersticial sean anuncios de prueba
- [x] Compilar el APK debug con publicidad de prueba mediante `androidApkPrueba`
- [x] Establecer `esModoPruebaPublicidad` en `false` y verificar que se seleccionen los IDs reales
- [x] Verificar que `initializeForTesting` reciba `false` en modo de producción
- [x] Ejecutar el comando basado en `bundleRelease` y confirmar que el AAB se genere correctamente
- [x] Confirmar que el archivo quede finalmente con `esModoPruebaPublicidad` en `false`
- [x] Revisar que no haya texto dañado ni caracteres corruptos en los archivos modificados
- [x] Verificar que el header reciba la clase naranja cuando el modo de prueba esté activo
- [x] Verificar que el header conserve su color normal en modo de producción

## Progreso del plan

- [x] Fase 1: Crear la configuración central
- [x] Fase 2: Integrar la configuración con AdMob
- [ ] Fase 3: Resolver el contrato Android de las skills
- [x] Fase 4: Documentar el contrato de publicidad
- [x] Fase 5: Normalizar los artefactos Android
- [x] Fase 6: Identificar visualmente el modo de prueba
- [ ] Fase 7: Corregir la publicación del modal 4.0.5
- [ ] Fase Testing

Fecha de creación: 10 de Junio 2026
Fecha de última actualización: 11 de Junio 2026
Estado: EN PROCESO
