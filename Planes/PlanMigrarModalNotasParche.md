# PLAN INTEGRAR MODAL DE NOTAS DE PARCHE

## Descripción del plan

Integrar en TaTeTi un sistema completo de actualización para Android. GitHub Pages publicará el archivo remoto `version.json`; la aplicación consultará ese archivo, comparará la versión publicada con la instalada y mostrará un modal bilingüe con las novedades aprobadas por Leo.

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
- No inventar notas de parche. Deben salir del historial real de Git o de decisiones confirmadas por Leo.
- Mostrar a Leo un borrador editable antes de aplicar notas definitivas.
- Mantener textos de interfaz en `es-AR` y `en-US`.
- Mantener compatibilidad razonable con el formato anterior de `cambios` como array de strings o grupos.
- No incluir secretos, tokens ni información privada en GitHub Pages.
- No publicar toda la aplicación web en Pages. Publicar solamente `version.json` y un `index.html` informativo mínimo.
- Preservar `cambios` cuando un script regenere `public/version.json`.

## FASE 1: Crear el contrato remoto

### Objetivo

Definir el archivo que GitHub Pages publicará y que la aplicación consumirá.

- [ ] Crear `public/version.json` en UTF-8.
- [ ] Definir `versionDisponible` inicialmente con la versión actual `4.0.3`.
- [ ] Definir `urlPlayStore` como `https://play.google.com/store/apps/details?id=com.leotateti.tateti`.
- [ ] Definir `mostrarActualizacion` como booleano.
- [ ] Definir `cambios` por idioma con las claves `es-AR` y `en-US`.
- [ ] Mantener ambos arrays de novedades vacíos hasta que Leo apruebe notas reales.
- [ ] Usar grupos con la forma `{ "apartado": "...", "novedades": ["..."] }`.
- [ ] Validar que `public/version.json` sea JSON válido.
- [ ] Crear un `public/index.html` mínimo que indique que el sitio contiene información pública de versiones de TaTeTi.

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

- [ ] Crear `.github/workflows/PublicarVersion.yml`.
- [ ] Activar el workflow en cambios de `public/version.json`, `public/index.html` o del propio workflow enviados a `master`.
- [ ] Agregar `workflow_dispatch` para permitir una publicación manual.
- [ ] Configurar los permisos mínimos `contents: read`, `pages: write` e `id-token: write`.
- [ ] Configurar la concurrencia de Pages para evitar despliegues simultáneos.
- [ ] Usar el entorno oficial `github-pages`.
- [ ] Preparar un directorio temporal `PublicacionPages` durante el workflow.
- [ ] Copiar únicamente `public/version.json` y `public/index.html` al artefacto.
- [ ] Usar las acciones oficiales mantenidas para configurar Pages, subir el artefacto y desplegarlo.
- [ ] Validar el JSON dentro del workflow antes de publicarlo.
- [ ] Ejecutar el workflow desde GitHub Actions.
- [ ] Confirmar que el despliegue finaliza correctamente.
- [ ] Abrir `https://jleonn.github.io/TaTeTi/version.json` y confirmar que responde con el JSON esperado mediante HTTPS.
- [ ] Confirmar que una segunda publicación reemplaza correctamente la versión anterior.

## FASE 3: Automatizar la generación de version.json

### Objetivo

Actualizar los datos técnicos del contrato sin borrar las notas aprobadas.

- [ ] Crear la carpeta `Scripts` si no existe.
- [ ] Crear `Scripts/GenerarVersionJson.js`.
- [ ] Leer la versión desde `package.json`.
- [ ] Leer `public/version.json` si ya existe.
- [ ] Mantener `urlPlayStore` si ya está definido.
- [ ] Mantener `mostrarActualizacion` si ya está definido.
- [ ] Preservar íntegramente `cambios.es-AR` y `cambios.en-US`.
- [ ] Preservar temporalmente un `cambios` antiguo si todavía usa formato array.
- [ ] Escribir JSON con sangría de dos espacios y salto de línea final.
- [ ] Agregar `generar-version` a los scripts de `package.json`.
- [ ] Integrar `npm run generar-version` antes del build sin alterar el comportamiento de los demás comandos.
- [ ] Ejecutar el script dos veces y comprobar que el resultado sea estable.
- [ ] Confirmar que el script no elimina ni modifica novedades existentes.

## FASE 4: Exponer la configuración de actualización

### Objetivo

Entregar al frontend la versión instalada y la URL remota mediante la configuración real de Quasar.

- [ ] Leer `package.json` desde `quasar.config.js` con una API compatible con módulos ES.
- [ ] Exponer `VERSION_APP` con el valor de `package.json`.
- [ ] Exponer `URL_VERSION_REMOTA` con `https://jleonn.github.io/TaTeTi/version.json`.
- [ ] Exponer `URL_PLAY_STORE` con la URL de `com.leotateti.tateti`.
- [ ] Mantener intacta la variable existente `MODO_PRUEBA_ADS`.
- [ ] Usar `process.env` de forma consistente con el patrón actual del proyecto.
- [ ] Evitar valores secretos porque estas variables quedan incluidas en el frontend.

## FASE 5: Crear el servicio de actualización

### Objetivo

Consultar GitHub Pages, validar el contrato y devolver un estado seguro para la interfaz.

- [ ] Crear `src/components/Actualizacion`.
- [ ] Crear `src/components/Actualizacion/ServicioActualizacionApp.js`.
- [ ] Obtener la URL remota, la versión instalada y la URL de Play Store desde las variables configuradas.
- [ ] Implementar una comparación de versiones por segmentos numéricos.
- [ ] Implementar `crearEstadoSinActualizacion()` con valores seguros y `cambios: []`.
- [ ] Implementar `normalizarCambios(cambios, idiomaActual)`.
- [ ] Seleccionar las novedades de `es-AR` o `en-US` según el idioma activo.
- [ ] Usar `es-AR` como respaldo si el idioma solicitado no existe.
- [ ] Aceptar temporalmente `cambios` como array de strings.
- [ ] Aceptar temporalmente `cambios` como array de grupos con `apartado` y `novedades`.
- [ ] Filtrar strings vacíos, grupos inválidos y propiedades inesperadas.
- [ ] Implementar `obtenerEstadoActualizacion(idiomaActual)` con `fetch` y `cache: 'no-store'`.
- [ ] Agregar un timeout con `AbortController`.
- [ ] Tratar errores de red, timeout o JSON inválido sin interrumpir el inicio de la aplicación.
- [ ] Mostrar actualización solamente cuando `mostrarActualizacion === true`.
- [ ] Mostrar actualización solamente cuando `versionDisponible` sea mayor que `VERSION_APP`.
- [ ] Implementar `abrirActualizacionEnTienda(urlPlayStore)` con apertura externa y fallback seguro.

## FASE 6: Crear el modal bilingüe

### Objetivo

Encapsular la interfaz de actualización sin aumentar innecesariamente la responsabilidad de `MainLayout.vue`.

- [ ] Crear `src/components/Actualizacion/ModalActualizacion.vue`.
- [ ] Definir props para visibilidad, versión instalada, versión disponible, URL de tienda y cambios.
- [ ] Definir eventos para cerrar el modal y solicitar la apertura de Play Store.
- [ ] Agregar las traducciones del modal en `src/i18n/es-AR/index.js`.
- [ ] Agregar las traducciones equivalentes en `src/i18n/en-US/index.js`.
- [ ] Traducir título, versiones, aviso de Play Store, encabezado de novedades y botones.
- [ ] Mostrar la sección de novedades solo cuando existan grupos válidos.
- [ ] Renderizar `apartado` como subtítulo y cada novedad como elemento de lista.
- [ ] Mostrar el aviso fijo de que Play Store puede demorar en ofrecer la nueva versión.
- [ ] Usar `Cancelar` y `Actualizar` mediante Vue I18n.
- [ ] Aplicar solamente colores existentes en `src/css/Variables.css`.
- [ ] Mantener el CSS scoped y compacto.
- [ ] Añadir un comentario breve junto al renderizado de notas para documentar el contrato.

Comentario de integración:

```vue
<!-- Las notas llegan desde version.json agrupadas por idioma, apartado y novedades. -->
<!-- Mantener textos cortos; Leo aprueba las líneas antes de publicar. -->
```

## FASE 7: Integrar la verificación en MainLayout

### Objetivo

Consultar la versión remota al iniciar la interfaz y conectar el resultado con el modal.

- [ ] Importar el servicio y `ModalActualizacion.vue` en `src/layouts/MainLayout.vue`.
- [ ] Crear un único estado reactivo para la información de actualización.
- [ ] Ejecutar la consulta después de cargar la configuración y el idioma.
- [ ] Entregar al servicio el locale activo de Vue I18n.
- [ ] Evitar que un error remoto bloquee la carga del nombre, puntuación o publicidad.
- [ ] Mostrar el modal automáticamente cuando el servicio indique que hay actualización.
- [ ] Conectar el botón `Cancelar` con el cierre local.
- [ ] Conectar el botón `Actualizar` con la apertura de Play Store.
- [ ] Agregar un indicador discreto en el drawer solamente cuando haya actualización disponible.
- [ ] Permitir reabrir el modal desde ese indicador después de cancelarlo.
- [ ] Mantener `MainLayout.vue` como coordinador y dejar el marcado del diálogo dentro del componente.

## FASE 8: Integrar notas-modal y el flujo editorial

### Objetivo

Preparar notas reales desde Git y publicarlas solo después de la aprobación de Leo.

- [ ] Crear un tag base antes del primer uso regular de `$notas-modal`, porque actualmente el repositorio no tiene tags.
- [ ] Usar como tag base la versión real confirmada al comenzar esta fase.
- [ ] Ejecutar `$notas-modal` cuando Leo pida preparar las novedades.
- [ ] Mostrar primero el borrador editable con base, rango y novedades sugeridas.
- [ ] Esperar la selección o reescritura de Leo antes de editar `version.json`.
- [ ] Mantener un máximo recomendado de ocho novedades concretas.
- [ ] Agrupar las novedades aprobadas por apartados visibles de TaTeTi.
- [ ] Preparar primero la versión `es-AR`.
- [ ] Preparar la traducción `en-US` manteniendo exactamente el mismo significado.
- [ ] Mostrar ambas versiones a Leo antes de aplicarlas.
- [ ] Actualizar `cambios.es-AR` y `cambios.en-US` solamente con aprobación.
- [ ] Activar `mostrarActualizacion` únicamente cuando la versión ya esté publicada o lista para publicación.
- [ ] No borrar notas antiguas sin confirmación explícita.

## FASE 9: Alinear el versionado del proyecto

### Objetivo

Mantener una única versión funcional entre JavaScript, Capacitor, Android y el contrato remoto.

- [ ] Alinear la versión en `package.json`.
- [ ] Alinear la versión raíz en `package-lock.json`.
- [ ] Alinear la versión en `src-capacitor/package.json`.
- [ ] Alinear la versión en `src-capacitor/package-lock.json`.
- [ ] Alinear `versionName` en `src-capacitor/android/app/build.gradle`.
- [ ] Incrementar `versionCode` de Android sin reutilizar valores anteriores.
- [ ] Ejecutar `Scripts/GenerarVersionJson.js`.
- [ ] Confirmar que `versionDisponible` coincide con la versión que se publicará.
- [ ] Confirmar que `cambios` sigue intacto después de generar el archivo.
- [ ] Publicar primero la aplicación en Play Store o confirmar que está lista para distribución.
- [ ] Publicar después `version.json` con `mostrarActualizacion: true`.

## FASE TESTING

### Objetivo

Validar el flujo completo en local, GitHub Pages y Android sin duplicar pruebas.

- [ ] Ejecutar `npm run lint`.
- [ ] Ejecutar `npm run build`.
- [ ] Ejecutar `npm run generar-version` y confirmar que conserva ambos idiomas.
- [ ] Validar `public/version.json` con un parser JSON.
- [ ] Ejecutar manualmente `PublicarVersion.yml`.
- [ ] Confirmar respuesta HTTP correcta en `https://jleonn.github.io/TaTeTi/version.json`.
- [ ] Confirmar que el JSON remoto no queda servido desde una caché anterior después de un nuevo despliegue.
- [ ] Probar una versión remota mayor y `mostrarActualizacion: true`.
- [ ] Confirmar que el modal aparece en español.
- [ ] Cambiar el idioma de la app y confirmar que el modal y sus novedades aparecen en inglés.
- [ ] Confirmar que los apartados se muestran como subtítulos.
- [ ] Confirmar que las novedades aparecen como lista dentro de cada apartado.
- [ ] Probar `cambios` vacío y confirmar que el modal funciona sin mostrar la sección de novedades.
- [ ] Probar el formato antiguo de strings y confirmar que no rompe el modal.
- [ ] Probar `mostrarActualizacion: false` y confirmar que no aparece el modal.
- [ ] Probar una versión remota igual o menor y confirmar que no aparece el modal.
- [ ] Simular falta de red, timeout y JSON inválido; la aplicación debe iniciar normalmente.
- [ ] Cancelar el modal y reabrirlo desde el indicador del drawer.
- [ ] Instalar la compilación en Android y confirmar que `Actualizar` abre la ficha correcta de Play Store.
- [ ] Confirmar que la carga del modal no interfiere con nombre, idioma, puntuación ni AdMob.
- [ ] Confirmar que no existen errores de ESLint ni caracteres dañados.
- [ ] Revisar visualmente el modal en una pantalla móvil estrecha.

## Progreso del plan

- [ ] Fase 1: Crear el contrato remoto
- [ ] Fase 2: Publicar el contrato con GitHub Pages
- [ ] Fase 3: Automatizar la generación de version.json
- [ ] Fase 4: Exponer la configuración de actualización
- [ ] Fase 5: Crear el servicio de actualización
- [ ] Fase 6: Crear el modal bilingüe
- [ ] Fase 7: Integrar la verificación en MainLayout
- [ ] Fase 8: Integrar notas-modal y el flujo editorial
- [ ] Fase 9: Alinear el versionado del proyecto
- [ ] Fase Testing

Fecha de creación: 7 de Junio 2026
Fecha de última actualización: 10 de Junio 2026
Estado: BORRADOR
