# PLAN INTEGRAR MODAL DE NOTAS DE PARCHE

> Documento histórico del diseño bilingüe original. Desde el 14 de junio de 2026, el contrato vigente detecta los idiomas habilitados mediante `src/i18n/IdiomasApp.json`; consultar `Resumen1General.md` y `PlanIdiomasEuropeosPrincipales.md`.

## Descripción del plan

Integrar en TaTeTi un sistema completo de actualización para Android. GitHub Pages publicará el archivo remoto `version.json`; la aplicación consultará ese archivo, comparará la versión publicada con la instalada y mostrará un modal bilingüe con las novedades generadas desde el historial real.

El proyecto usa Quasar 2, Vue 3, Capacitor 7, Vue I18n y la rama `master`. El identificador Android es `com.leotateti.tateti` y el proyecto nativo se encuentra en `src-capacitor/android`.

## Objetivo principal

- Publicar `version.json` en `https://jleonn.github.io/TaTeTi/version.json`.
- Detectar desde la aplicación cuando existe una versión superior en Play Store.
- Mostrar un modal bilingüe con notas agrupadas por apartado.
- Mantener alineado el versionado web y Android sin borrar notas ya aprobadas.
- Integrar la skill `$notas-modal` en futuros procesos de publicación.

## Reglas del plan

- Leer y respetar `AGENTS.md` antes de ejecutar cada fase.
- Usar nombres en español y PascalCase para archivos y carpetas, salvo nombres obligatorios de plataformas externas como `.github`.
- Guardar todos los archivos de texto en UTF-8 y corregir cualquier carácter dañado.
- Usar las variables de `src/css/Variables.css`; no agregar colores directos en los componentes.
- Mantener el CSS compacto, sin líneas vacías entre reglas.
- No inventar notas de parche. Deben salir del historial real de Git y de los cambios comprobables del repositorio.
- La skill `$notas-modal` debe generar y aplicar directamente las notas en el archivo correspondiente, sin solicitar aprobación previa.
- Mantener textos de interfaz en `es-AR` y `en-US`.
- Mantener compatibilidad razonable con el formato anterior de `cambios` como array de strings o grupos.
- No incluir secretos, tokens ni información privada en GitHub Pages.
- No publicar toda la aplicación web en Pages. Publicar solamente `version.json` y un `index.html` informativo mínimo.
- Preservar `cambios` cuando un script regenere `public/version.json`.

## FASE 1: Crear el contrato remoto

### Objetivo

Definir el archivo que GitHub Pages publicará y que la aplicación consumirá.

- [x] Crear `public/version.json` en UTF-8.
- [x] Definir `versionDisponible` inicialmente con la versión actual `4.0.3`.
- [x] Definir `urlPlayStore` como `https://play.google.com/store/apps/details?id=com.leotateti.tateti`.
- [x] Definir `mostrarActualizacion` como booleano.
- [x] Definir `cambios` por idioma con las claves `es-AR` y `en-US`.
- [x] Mantener ambos arrays de novedades vacíos hasta que Leo apruebe notas reales.
- [x] Usar grupos con la forma `{ "apartado": "...", "novedades": ["..."] }`.
- [x] Validar que `public/version.json` sea JSON válido.
- [x] Crear un `public/index.html` mínimo que indique que el sitio contiene información pública de versiones de TaTeTi.

Contrato inicial:

```json
{
  "versionDisponible": "4.0.3",
  "urlPlayStore": "https://play.google.com/store/apps/details?id=com.leotateti.tateti",
  "mostrarActualizacion": false,
  "cambios": {
    "es-AR": [],
    "en-US": []
  }
}
```

## FASE 2: Publicar el contrato con GitHub Pages

### Objetivo

Publicar los archivos de actualización mediante el origen GitHub Actions ya seleccionado en la configuración de Pages.

- [x] Crear `.github/workflows/PublicarVersion.yml`.
- [x] Activar el workflow en cambios de `public/version.json`, `public/index.html` o del propio workflow enviados a `master`.
- [x] Agregar `workflow_dispatch` para permitir una publicación manual.
- [x] Configurar los permisos mínimos `contents: read`, `pages: write` e `id-token: write`.
- [x] Configurar la concurrencia de Pages para evitar despliegues simultáneos.
- [x] Usar el entorno oficial `github-pages`.
- [x] Preparar un directorio temporal `PublicacionPages` durante el workflow.
- [x] Copiar únicamente `public/version.json` y `public/index.html` al artefacto.
- [x] Usar las acciones oficiales mantenidas para configurar Pages, subir el artefacto y desplegarlo.
- [x] Validar el JSON dentro del workflow antes de publicarlo.
- [ ] Ejecutar el workflow desde GitHub Actions.
- [ ] Confirmar que el despliegue finaliza correctamente.
- [ ] Abrir `https://jleonn.github.io/TaTeTi/version.json` y confirmar que responde con el JSON esperado mediante HTTPS.
- [ ] Confirmar que una segunda publicación reemplaza correctamente la versión anterior.

## FASE 3: Automatizar la generación de version.json

### Objetivo

Actualizar los datos técnicos del contrato sin borrar las notas aprobadas.

- [x] Crear la carpeta `Scripts` si no existe.
- [x] Crear `Scripts/GenerarVersionJson.js`.
- [x] Leer la versión desde `package.json`.
- [x] Leer `public/version.json` si ya existe.
- [x] Mantener `urlPlayStore` si ya está definido.
- [x] Mantener `mostrarActualizacion` si ya está definido.
- [x] Preservar íntegramente `cambios.es-AR` y `cambios.en-US`.
- [x] Preservar temporalmente un `cambios` antiguo si todavía usa formato array.
- [x] Escribir JSON con sangría de dos espacios y salto de línea final.
- [x] Agregar `generar-version` a los scripts de `package.json`.
- [x] Integrar `npm run generar-version` antes del build sin alterar el comportamiento de los demás comandos.
- [x] Ejecutar el script dos veces y comprobar que el resultado sea estable.
- [x] Confirmar que el script no elimina ni modifica novedades existentes.

## FASE 4: Exponer la configuración de actualización

### Objetivo

Entregar al frontend la versión instalada y la URL remota mediante la configuración real de Quasar.

- [x] Leer `package.json` desde `quasar.config.js` con una API compatible con módulos ES.
- [x] Exponer `VERSION_APP` con el valor de `package.json`.
- [x] Exponer `URL_VERSION_REMOTA` con `https://jleonn.github.io/TaTeTi/version.json`.
- [x] Exponer `URL_PLAY_STORE` con la URL de `com.leotateti.tateti`.
- [x] Mantener intacta la variable existente `MODO_PRUEBA_ADS`.
- [x] Usar `process.env` de forma consistente con el patrón actual del proyecto.
- [x] Evitar valores secretos porque estas variables quedan incluidas en el frontend.

## FASE 5: Crear el servicio de actualización

### Objetivo

Consultar GitHub Pages, validar el contrato y devolver un estado seguro para la interfaz.

- [x] Crear `src/components/Actualizacion`.
- [x] Crear `src/components/Actualizacion/ServicioActualizacionApp.js`.
- [x] Obtener la URL remota, la versión instalada y la URL de Play Store desde las variables configuradas.
- [x] Implementar una comparación de versiones por segmentos numéricos.
- [x] Implementar `crearEstadoSinActualizacion()` con valores seguros y `cambios: []`.
- [x] Implementar `normalizarCambios(cambios, idiomaActual)`.
- [x] Seleccionar las novedades de `es-AR` o `en-US` según el idioma activo.
- [x] Usar `es-AR` como respaldo si el idioma solicitado no existe.
- [x] Aceptar temporalmente `cambios` como array de strings.
- [x] Aceptar temporalmente `cambios` como array de grupos con `apartado` y `novedades`.
- [x] Filtrar strings vacíos, grupos inválidos y propiedades inesperadas.
- [x] Implementar `obtenerEstadoActualizacion(idiomaActual)` con `fetch` y `cache: 'no-store'`.
- [x] Agregar un timeout con `AbortController`.
- [x] Tratar errores de red, timeout o JSON inválido sin interrumpir el inicio de la aplicación.
- [x] Mostrar actualización solamente cuando `mostrarActualizacion === true`.
- [x] Mostrar actualización solamente cuando `versionDisponible` sea mayor que `VERSION_APP`.
- [x] Implementar `abrirActualizacionEnTienda(urlPlayStore)` con apertura externa y fallback seguro.

## FASE 6: Crear el modal bilingüe

### Objetivo

Encapsular la interfaz de actualización sin aumentar innecesariamente la responsabilidad de `MainLayout.vue`.

- [x] Crear `src/components/Actualizacion/ModalActualizacion.vue`.
- [x] Definir props para visibilidad, versiones y cambios.
- [x] Definir eventos para cerrar el modal y solicitar la apertura de Play Store.
- [x] Agregar las traducciones del modal en `src/i18n/es-AR/index.js`.
- [x] Agregar las traducciones equivalentes en `src/i18n/en-US/index.js`.
- [x] Traducir título, versiones, aviso de Play Store, encabezado de novedades y botones.
- [x] Mostrar la sección de novedades solo cuando existan grupos válidos.
- [x] Renderizar `apartado` como subtítulo y cada novedad como elemento de lista.
- [x] Mostrar el aviso fijo de que Play Store puede demorar en ofrecer la nueva versión.
- [x] Usar `Cancelar` y `Actualizar` mediante Vue I18n.
- [x] Aplicar solamente colores existentes en `src/css/Variables.css`.
- [x] Mantener el CSS scoped y compacto.
- [x] Añadir un comentario breve junto al renderizado de notas para documentar el contrato.

Comentario de integración:

```vue
<!-- Las notas llegan desde version.json agrupadas por idioma, apartado y novedades. -->
<!-- Mantener textos cortos y derivados de cambios comprobables del repositorio. -->
```

## FASE 7: Integrar la verificación en MainLayout

### Objetivo

Consultar la versión remota al iniciar la interfaz y conectar el resultado con el modal.

- [x] Importar el servicio y `ModalActualizacion.vue` en `src/layouts/MainLayout.vue`.
- [x] Crear un único estado reactivo para la información de actualización.
- [x] Ejecutar la consulta después de cargar la configuración y el idioma.
- [x] Entregar al servicio el locale activo de Vue I18n.
- [x] Evitar que un error remoto bloquee la carga del nombre, puntuación o publicidad.
- [x] Mostrar el modal automáticamente cuando el servicio indique que hay actualización.
- [x] Conectar el botón `Cancelar` con el cierre local.
- [x] Conectar el botón `Actualizar` con la apertura de Play Store.
- [x] Agregar un indicador discreto en el drawer solamente cuando haya actualización disponible.
- [x] Permitir reabrir el modal desde ese indicador después de cancelarlo.
- [x] Mantener `MainLayout.vue` como coordinador y dejar el marcado del diálogo dentro del componente.

## FASE 8: Integrar notas-modal y el flujo editorial

### Objetivo

Preparar notas reales desde Git y aplicarlas automáticamente al contrato de actualización.

- [x] Crear tags de versión para disponer de una base real de comparación.
- [x] Usar como base el último tag alcanzable desde `HEAD`.
- [x] Ejecutar `$notas-modal` cuando Leo pida preparar las novedades.
- [x] Configurar la skill para editar directamente `public/version.json` sin solicitar aprobación previa.
- [x] Mantener un máximo recomendado de ocho novedades concretas.
- [x] Agrupar las novedades por apartados visibles de TaTeTi.
- [x] Preparar las notas en `es-AR` y su equivalente en `en-US`.
- [x] Actualizar `cambios.es-AR` y `cambios.en-US` en la misma ejecución.
- [x] Permitir que Leo solicite correcciones después de aplicar las notas.
- [ ] Activar `mostrarActualizacion` únicamente cuando la versión ya esté publicada o lista para publicación.
- [ ] Definir en cada release si las notas anteriores se reemplazan o se conservan según el contrato vigente.

## FASE 9: Alinear el versionado del proyecto

### Objetivo

Mantener una única versión funcional entre JavaScript, Capacitor, Android y el contrato remoto.

- [x] Alinear la versión en `package.json`.
- [x] Alinear la versión raíz en `package-lock.json`.
- [x] Alinear la versión en `src-capacitor/package.json`.
- [x] Alinear la versión en `src-capacitor/package-lock.json`.
- [x] Alinear `versionName` en `src-capacitor/android/app/build.gradle`.
- [ ] Incrementar `versionCode` de Android sin reutilizar valores anteriores.
- [x] Ejecutar `Scripts/GenerarVersionJson.js`.
- [x] Confirmar que `versionDisponible` coincide con la versión que se publicará.
- [x] Confirmar que `cambios` sigue intacto después de generar el archivo.
- [ ] Publicar primero la aplicación en Play Store o confirmar que está lista para distribución.
- [ ] Publicar después `version.json` con `mostrarActualizacion: true`.

## FASE TESTING

### Objetivo

Validar el flujo completo en local, GitHub Pages y Android sin duplicar pruebas.

- [x] Ejecutar `npm run lint`.
- [x] Ejecutar `npm run build`.
- [x] Ejecutar `npm run generar-version` y confirmar que conserva ambos idiomas.
- [x] Validar `public/version.json` con un parser JSON.
- [ ] Ejecutar manualmente `PublicarVersion.yml`.
- [ ] Confirmar respuesta HTTP correcta en `https://jleonn.github.io/TaTeTi/version.json`.
- [ ] Confirmar que el JSON remoto no queda servido desde una caché anterior después de un nuevo despliegue.
- [x] Probar el servicio con una versión remota mayor y `mostrarActualizacion: true`.
- [ ] Confirmar que el modal aparece en español.
- [ ] Cambiar el idioma de la app y confirmar que el modal y sus novedades aparecen en inglés.
- [ ] Confirmar que los apartados se muestran como subtítulos.
- [x] Confirmar mediante prueba de normalización que las novedades se agrupan correctamente por idioma.
- [x] Probar `cambios` vacío y confirmar que el servicio devuelve una lista segura.
- [x] Probar el formato antiguo de strings y confirmar que no rompe la normalización.
- [x] Probar `mostrarActualizacion: false` mediante el contrato inicial.
- [x] Probar una versión remota igual y confirmar que el servicio no activa la actualización.
- [x] Confirmar que una URL remota no disponible o un JSON inválido no impide iniciar la aplicación local.
- [ ] Cancelar el modal y reabrirlo desde el indicador del drawer.
- [ ] Instalar la compilación en Android y confirmar que `Actualizar` abre la ficha correcta de Play Store.
- [ ] Confirmar que la carga del modal no interfiere con nombre, idioma, puntuación ni AdMob.
- [x] Confirmar que no existen errores de ESLint ni caracteres dañados.
- [ ] Revisar visualmente el modal en una pantalla móvil estrecha.

## Progreso del plan

- [x] Fase 1: Crear el contrato remoto
- [ ] Fase 2: Publicar el contrato con GitHub Pages
- [x] Fase 3: Automatizar la generación de version.json
- [x] Fase 4: Exponer la configuración de actualización
- [x] Fase 5: Crear el servicio de actualización
- [x] Fase 6: Crear el modal bilingüe
- [x] Fase 7: Integrar la verificación en MainLayout
- [x] Fase 8: Integrar notas-modal y el flujo editorial
- [ ] Fase 9: Alinear el versionado del proyecto
- [ ] Fase Testing

Fecha de creación: 7 de Junio 2026
Fecha de última actualización: 12 de junio de 2026
Estado: EN PROCESO
