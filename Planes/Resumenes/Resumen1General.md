# Resumen general de TaTeTi

> Vigencia: 14 de junio de 2026. Versión documentada: `4.0.9`.
> Este archivo está pensado como punto de entrada para otra IA. Antes de modificar el proyecto, leer `AGENTS.md` y verificar el código actual.

## Propósito

TaTeTi es una aplicación móvil hecha con Vue 3, Quasar 2 y Capacitor 7. Ofrece partidas contra la IA NEXUS y multijugador local, estadísticas persistentes en SQLite, configuración, puntuación, publicidad AdMob, interfaz en diez idiomas y un sistema remoto de notas de actualización.

## Rutas

- `/`: partida contra IA.
- `/jugador-vs-jugador`: multijugador local.
- `/estadisticas`: rendimiento e historial agregado de partidas contra NEXUS.
- `/configuracion`: nombre e idioma.
- Cualquier ruta desconocida: página 404.

## Arquitectura

- `src/layouts/MainLayout.vue`: coordina header, drawer, publicidad, puntuación y actualización remota.
- `src/pages/JugarContraIA.vue`: orquesta juego, IA, ficha elegida, puntuación y resultado.
- `src/pages/JugarMultijugador.vue`: orquesta el modo local para dos jugadores.
- `src/pages/ConfiguracionPage.vue`: contiene las secciones de configuración.
- `src/pages/EstadisticasPage.vue`: consulta y presenta estadísticas agregadas.
- `src/Servicios/Estadisticas/`: esquema SQLite, registro transaccional y consultas.
- `src/components/Estadisticas/`: filtros sticky y encabezados explicativos.
- `src/components/Composables/`: estado y lógica compartida.
- `src/components/TaTeTi/`: tablero, celdas, información de turno, dificultad y modales de resultado.
- `src/components/Actualizacion/`: consulta de versión y modal de novedades.
- `src/components/Configuracion/ConfiguracionPublicidad.js`: fuente central de IDs y modo de prueba de AdMob.
- `src/i18n/IdiomasApp.json`: fuente central de idiomas habilitados, códigos de aplicación y códigos de Google Play.
- `src/i18n/ConfiguracionIdiomas.js`: normalización, detección y fallback de idiomas.
- `src/css/Variables.css`: única fuente permitida para colores.
- `src/css/app.css`: variables y protecciones globales de pantalla.
- `src-capacitor/android/`: proyecto Android real.

## Composables principales

- `useTaTeTi.js`: tablero, turno, ganador, empate y reinicio con ficha inicial parametrizable.
- `useIA.js`: jugadas fácil, normal y difícil; recibe explícitamente las fichas de IA y usuario.
- `UseFichaJugador.js`: selección persistente de `X` u `O` para el modo IA.
- `useConfiguracion.js`: nombre global del usuario.
- `useIdioma.js`: idioma global y persistente.
- `usePuntuacion.js`: puntos, rachas y protección por derrotas.
- `usePublicidad.js`: banner adaptativo, intersticial y reserva dinámica de espacio.
- `useContadorPartidas.js`: contador persistente para intersticiales.

## Contratos funcionales

- En modo IA el usuario puede elegir `X` u `O`, pero siempre realiza la primera jugada.
- La IA usa siempre la ficha contraria.
- La selección de ficha solo se habilita con el tablero vacío y se bloquea tras la primera jugada.
- En multijugador siempre comienza `X`.
- Los colores pertenecen a las fichas: `X` roja y `O` azul, sin depender de quién las use.
- Los nombres largos nunca deben superponer elementos; se recortan con puntos suspensivos como último recurso.
- El contenido no debe quedar debajo de barras Android, notch, teclado ni banner.

## Persistencia con Capacitor Preferences

- `nombre_usuario`: nombre del jugador.
- `idioma_usuario`: uno de los idiomas habilitados en `IdiomasApp.json`.
- `dificultad_ia`: `facil`, `normal` o `dificil`.
- `ficha_usuario_ia`: `X` u `O`.
- `puntuacion_sistema`: puntos y rachas.
- `contador_partidas_publicidad`: progreso hacia el siguiente intersticial.

## Estadísticas con SQLite

- La base `EstadisticasTaTeTi` registra partidas contra NEXUS y sus turnos.
- En Android usa `@capacitor-community/sqlite`; en web usa `jeep-sqlite` sobre IndexedDB.
- No existe límite artificial, limpieza automática ni botón para borrar estadísticas.
- La página filtra visualmente por dificultad y ficha mediante chips.
- Período, resultado, fechas y horarios activos siguen disponibles en los datos o consultas, pero no se muestran en la interfaz actual.
- Leer `Planes/Resumenes/Resumen5Estadisticas.md` y `src/Servicios/Estadisticas/ContratoEstadisticas.md` antes de modificar este módulo.

## Interfaz global

- `MainLayout.vue` centra verticalmente el toolbar y adapta el header mediante `ResizeObserver`.
- Si falta ancho se ocultan, en orden: logo, copa, icono de usuario y texto `PTS`; después se recorta el nombre.
- El logo visible navega siempre al juego contra IA.
- El chip del usuario navega a Configuración y enfoca visualmente la sección Usuario.
- Las páginas de juego se centran en tablets; no se estira artificialmente el tablero.
- El tablero se adapta a la altura disponible para evitar scroll innecesario.
- Los modales, notificaciones y controles respetan las zonas seguras.
- El selector de idiomas conserva cabecera y acciones visibles; solo la lista central se desplaza y se compacta según la altura disponible.

## Android y publicidad

- `src-capacitor/capacitor.config.json` usa `adjustMarginsForEdgeToEdge: "force"`.
- `index.html` mantiene `viewport-fit=cover`.
- `app.css` define `--altura-pantalla`, `--altura-header`, `--altura-banner-publicidad`, `--espacio-inferior-contenido` y `--altura-pagina`.
- Se usa `100dvh` con fallback compatible.
- AdMob usa `ADAPTIVE_BANNER`.
- `usePublicidad.js` escucha el tamaño real del banner, actualiza la variable global y libera el espacio si se oculta o falla.

## Actualizaciones remotas

- `public/version.json` contiene versión disponible, URL de Play Store, flag de visualización y novedades para todos los idiomas habilitados.
- `Scripts/GenerarVersionJson.js` sincroniza la versión sin borrar notas existentes.
- `ServicioActualizacionApp.js` compara versiones, normaliza notas y tolera errores de red.
- `ModalActualizacion.vue` muestra las novedades.
- `MainLayout.vue` abre el modal y permite reabrirlo desde el drawer.
- La skill `$notas-modal` genera y aplica directamente las notas; no solicita aprobación previa.

## Versionado y compilación

- La versión debe mantenerse alineada entre `package.json`, archivos de `src-capacitor`, Android y `public/version.json`.
- Scripts importantes:
  - `npm run lint`
  - `npm run validar-idiomas`
  - `npm test`
  - `npm run build`
  - `npm run generar-version`
  - `npm run androidApkPrueba`
  - `npm run androidReleaseConSimbolos`
  - `npm run abrir-android`
- No ejecutar commit, tag ni push salvo pedido explícito o skill que lo incluya.

## Reglas para cambios futuros

- Preservar nombres de código en español y archivos nuevos en PascalCase.
- Reutilizar composables y modales existentes antes de crear duplicados.
- Mantener la misma estructura de claves y textos naturales en todos los idiomas habilitados.
- Verificar teléfonos angostos, tablets, orientación horizontal, navegación gestual y tres botones.
- Ejecutar ESLint y build cuando se cambie comportamiento; para documentación alcanza validar Markdown y `git diff --check`.
