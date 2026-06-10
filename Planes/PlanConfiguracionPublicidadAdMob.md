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
- Mantener `src-capacitor/android` como única estructura Android del proyecto
- No crear una segunda carpeta `android`, copias del proyecto nativo ni enlaces de compatibilidad frágiles
- Mantener los archivos nuevos y modificados en UTF-8
- Respetar la nomenclatura en español y las reglas de ESLint del proyecto

## FASE 1: Crear la configuración central

### Objetivo

Crear el archivo reconocido por las skills y definir claramente el modo de publicidad de la aplicación.

- [ ] Crear la carpeta `src/components/Configuracion` con nombre PascalCase si todavía no existe
- [ ] Crear `src/components/Configuracion/ConfiguracionPublicidad.js`
- [ ] Declarar exactamente `export const esModoPruebaPublicidad = false`
- [ ] Centralizar los IDs de prueba y producción de banner e intersticial
- [ ] Exportar una única configuración de IDs seleccionada mediante `esModoPruebaPublicidad`
- [ ] Mantener los IDs reales existentes sin exponerlos en registros innecesarios

## FASE 2: Integrar la configuración con AdMob

### Objetivo

Hacer que el composable de publicidad dependa únicamente del nuevo archivo central.

- [ ] Revisar `src/components/Composables/usePublicidad.js` y conservar su comportamiento actual
- [ ] Eliminar el uso de `process.env.MODO_PRUEBA_ADS`
- [ ] Eliminar `MODO_PRUEBA_ADS` de `quasar.config.js` para evitar dos fuentes de configuración
- [ ] Importar `esModoPruebaPublicidad` y los IDs seleccionados desde `ConfiguracionPublicidad.js`
- [ ] Usar `esModoPruebaPublicidad` en `initializeForTesting`
- [ ] Verificar que el banner use el ID correspondiente al modo activo
- [ ] Verificar que el intersticial use el ID correspondiente al modo activo
- [ ] Reducir o eliminar registros que muestren IDs reales completos en la consola
- [ ] Confirmar que `MainLayout.vue`, `JugarContraIA.vue` y `JugarMultijugador.vue` continúen consumiendo `usePublicidad` sin cambios de contrato

## FASE 3: Resolver el contrato Android de las skills

### Objetivo

Resolver la diferencia de rutas Android antes de ejecutar las skills, sin duplicar el proyecto nativo.

- [ ] Conservar `src-capacitor/android` como ruta Android canónica de TaTeTi
- [ ] Confirmar que `InstalarCel` actualmente intenta usar `android/app` desde la raíz y registrar esta incompatibilidad antes de ejecutarla
- [ ] Confirmar que el flujo de release debe ejecutar Capacitor dentro de `src-capacitor`
- [ ] Definir una solución compartida que permita a las skills reconocer proyectos Quasar con `src-capacitor`, sin agregar duplicaciones dentro de TaTeTi
- [ ] No ejecutar `InstalarCel` hasta que su flujo pueda resolver `src-capacitor/android`
- [ ] No declarar compatible el release hasta que genere y verifique el artefacto dentro de `src-capacitor/android/app/build/outputs`

## FASE 4: Documentar el contrato de publicidad

### Objetivo

Dejar claro el punto de integración para futuras modificaciones y ejecuciones automatizadas.

- [ ] Agregar un comentario breve junto a `esModoPruebaPublicidad` indicando que las skills modifican ese valor
- [ ] Documentar que `true` corresponde exclusivamente a instalaciones de prueba
- [ ] Documentar que `false` es obligatorio para producción
- [ ] Evitar instrucciones duplicadas fuera del archivo central

## FASE 5: Normalizar los artefactos Android

### Objetivo

Separar explícitamente la generación del APK de prueba y del AAB de producción.

- [ ] Mantener un comando de APK que ejecute `assembleDebug` y verifique `src-capacitor/android/app/build/outputs/apk/debug/app-debug.apk`
- [ ] Crear o ajustar un comando de AAB que ejecute `bundleRelease`
- [ ] Verificar el AAB en `src-capacitor/android/app/build/outputs/bundle/release/app-release.aab`
- [ ] Alinear el script `cel` con el contrato definido en `AGENTS.md`
- [ ] Confirmar que el build actual con `assembleRelease` genera un APK release y no se use como prueba de generación de AAB
- [ ] Mantener sincronizados `package.json` y `src-capacitor/android/app/build.gradle` durante el release

## FASE TESTING

### Objetivo

Validar que la configuración seleccione correctamente la publicidad y que ambos flujos Android sean seguros.

- [ ] Ejecutar ESLint y corregir todos los errores relacionados con los archivos modificados
- [ ] Ejecutar el build web de Quasar con la configuración en `true` y en `false`
- [ ] Establecer temporalmente `esModoPruebaPublicidad` en `true` y verificar que se seleccionen los IDs oficiales de prueba
- [ ] Verificar que `initializeForTesting` reciba `true` en modo de prueba
- [ ] Ejecutar `InstalarCel` únicamente después de resolver la compatibilidad con `src-capacitor/android`
- [ ] Confirmar que la skill cambie exactamente `export const esModoPruebaPublicidad = false` a `true`
- [ ] Compilar e instalar el APK debug mediante `InstalarCel`
- [ ] Confirmar en el dispositivo que el banner y el intersticial sean anuncios de prueba
- [ ] Establecer `esModoPruebaPublicidad` en `false` y verificar que se seleccionen los IDs reales
- [ ] Verificar que `initializeForTesting` reciba `false` en modo de producción
- [ ] Ejecutar el comando basado en `bundleRelease` y confirmar que el AAB se genere correctamente
- [ ] Confirmar que el archivo quede finalmente con `esModoPruebaPublicidad` en `false`
- [ ] Revisar que no haya texto dañado ni caracteres corruptos en los archivos modificados

## Progreso del plan

- [ ] Fase 1: Crear la configuración central
- [ ] Fase 2: Integrar la configuración con AdMob
- [ ] Fase 3: Resolver el contrato Android de las skills
- [ ] Fase 4: Documentar el contrato de publicidad
- [ ] Fase 5: Normalizar los artefactos Android
- [ ] Fase Testing

Fecha de creación: 10 de Junio 2026
Fecha de última actualización: 10 de Junio 2026
Estado: BORRADOR
