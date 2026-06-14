# Resumen de interfaz responsive y Android

> Vigencia: 14 de junio de 2026. Este documento concentra las reglas globales de pantalla.

## Objetivo

Evitar que header, contenido, tablero, botones, modales o notificaciones queden debajo de la barra de estado, notch, navegación Android, teclado o banner AdMob. En tablets, el contenido se centra sin estirarse innecesariamente.

## Fuentes principales

- `src-capacitor/capacitor.config.json`
- `src/css/app.css`
- `src/layouts/MainLayout.vue`
- `src/components/Composables/usePublicidad.js`
- `src/pages/JugarContraIA.vue`
- `src/pages/JugarMultijugador.vue`
- `src/components/TaTeTi/TableroTaTeTi.vue`

## Zonas seguras

- Capacitor usa `adjustMarginsForEdgeToEdge: "force"`.
- El viewport web usa `viewport-fit=cover`.
- Variables globales:
  - `--altura-pantalla`
  - `--altura-header`
  - `--altura-banner-publicidad`
  - `--espacio-inferior-contenido`
  - `--altura-pagina`
- `100dvh` es la referencia principal y existe fallback para navegadores anteriores.
- Los fondos pueden extenderse, pero el contenido interactivo debe quedar dentro de la zona visible.

## Banner

- AdMob usa `ADAPTIVE_BANNER`, no `SMART_BANNER`.
- `usePublicidad.js` escucha `bannerAdSizeChanged`.
- La altura informada se guarda en `--altura-banner-publicidad`.
- Si el banner se oculta, elimina o falla, la reserva debe volver a cero.
- Los listeners deben limpiarse al retirar el banner.
- No agregar paddings fijos por página para compensar publicidad.

## Header responsive

- El toolbar ocupa la altura útil del header y centra sus elementos verticalmente.
- Un `ResizeObserver` mide el ancho real.
- Orden de compactación:
  1. Ocultar logo de TaTeTi.
  2. Ocultar copa del puntaje.
  3. Ocultar icono del usuario.
  4. Ocultar texto `PTS`.
  5. Recortar el nombre con `...`.
- El menú, el número de puntos y parte del nombre deben permanecer visibles.
- Durante la compactación también se reducen separaciones antes de recortar texto.
- El logo visible navega a `/`.
- El chip del usuario navega y enfoca la configuración del nombre.

## Juegos y tablets

- Los contenedores de juego se centran horizontalmente en pantallas anchas.
- No se amplía el tablero solo para llenar una tablet.
- El tablero calcula su tamaño según ancho y altura disponibles.
- Se prioriza evitar scroll; si una pantalla extrema no permite mostrar todo, la solución debe conservar controles accesibles sin deformar el tablero.
- No restaurar márgenes superiores fijos de `24px` o `32px` ni `padding-bottom: 175px`.

## Elementos flotantes

- Diálogos Quasar, modal de resultado y notificaciones tienen ajustes globales de zonas seguras.
- Al abrir el teclado, la altura dinámica debe permitir acceder a inputs y acciones.
- Los componentes con posición fija son excepciones y deben revisar explícitamente insets y banner.
- `ModalConfirmacion.vue` ofrece `contenidoDesplazable`: cabecera y acciones quedan fijas y solo el contenido central puede desplazarse.
- El selector de idiomas oculta la barra visual, mantiene el desplazamiento táctil y conserva `Cancelar` y `Guardar` horizontales salvo anchos extremos.
- En pantallas bajas reduce espacios y tarjetas; en alturas muy limitadas oculta el icono decorativo para priorizar las acciones.

## Matriz mínima de prueba

- Android 6 a 14 y comportamiento edge-to-edge de Android 15/16.
- Navegación por gestos y tres botones.
- Notch o cámara perforada.
- Vertical y horizontal.
- Teléfono angosto, pantalla baja y tablet.
- Banner visible, oculto y fallo al cargar.
- Teclado abierto en Configuración.
- Juego IA, multijugador, drawer, modal de resultado, modal de actualización, selector de idiomas y notificaciones.

## Restricciones

- No agregar un plugin nuevo de safe area mientras Capacitor cubra el caso.
- No resolver problemas globales con márgenes fijos locales.
- No duplicar el cálculo de altura del banner en páginas.
- Mantener colores en `Variables.css` y CSS compacto según `AGENTS.md`.
