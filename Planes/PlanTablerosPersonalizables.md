# PLAN DE TABLEROS PERSONALIZABLES

## Descripción del plan

Incorporar tableros visuales comprables y equipables al sistema de economía existente. La primera entrega conservará el tablero clásico, añadirá el tablero gratuito **Emblema X/O** usando `public/favicon.png` y añadirá el tablero **Torbellino X/O** por 200 puntos usando la imagen `F:\Programación\Ta-Te-Ti\Ta-Te-Ti.png`.

El tablero seleccionado será una personalización global: se aplicará por igual en partidas contra NEXUS y en multijugador. Las imágenes aparecerán dentro del cuadrado del tablero, detrás de las nueve celdas, con oscurecimiento y transparencia configurables para mantener legibles las fichas y la línea ganadora.

La solución debe quedar preparada para sumar nuevos diseños mediante datos de catálogo, sin agregar condiciones específicas por cada tablero en la tienda, el inventario o el componente de juego.

## Objetivo principal

- Permitir comprar, conservar y equipar diseños de tablero desde la economía existente.
- Incluir desde el inicio los tableros `tableroClasico` y `tableroEmblema`.
- Vender `tableroTorbellino` por exactamente 200 puntos.
- Aplicar el tablero equipado en ambos modos de juego sin duplicar lógica en sus páginas.
- Reutilizar la misma configuración visual y la misma vista previa en tienda e inventario.
- Mantener las fichas, los bordes de las celdas y la línea ganadora claramente visibles sobre cualquier fondo.
- Dejar una estructura extensible para agregar más imágenes en futuras versiones.

## Contexto técnico verificado

- El proyecto usa Vue 3, Quasar 2, Composition API y JavaScript.
- `src/components/TaTeTi/TableroTaTeTi.vue` es el único tablero interactivo y ya es consumido por `src/pages/JugarContraIA.vue` y `src/pages/JugarMultijugador.vue`; por eso la personalización debe integrarse en ese componente compartido y no en las páginas.
- El tablero actual ya posee un contenedor cuadrado, padding, fondo, radio y sombra. Ese bloque se conservará como marco y se reforzará con las variables visuales existentes.
- `src/Servicios/Economia/CatalogoTienda.js` centraliza colores y símbolos mediante artículos con `id`, `categoria`, `claveNombre`, `precio` e `inicial`.
- `src/Servicios/Economia/ServicioEconomia.js` ya compra cualquier artículo del catálogo mediante `ArticulosAdquiridos`; no se necesita una rutina de compra exclusiva para tableros.
- `EstadoEconomia` es una tabla clave/valor existente y adecuada para persistir la selección global `tableroEquipado`; no es necesario aumentar `VERSION_BASE_ESTADISTICAS` ni crear una migración SQLite.
- El respaldo mediante Capacitor Preferences debe ampliarse para que el tablero seleccionado sobreviva también cuando SQLite no esté disponible.
- La migración económica actual deja de ejecutarse cuando `economia_migrada_v2` ya existe. Por eso los nuevos artículos gratuitos no pueden depender únicamente de `migrarEconomia`: se necesita una sincronización idempotente de todos los artículos `inicial: true` en cada inicialización.
- `src/pages/TiendaPage.vue` y `src/pages/InventarioPage.vue` ya presentan categorías mediante carruseles horizontales y botones accesibles; los tableros deben seguir esos patrones.
- `src/i18n/MensajesEconomia.js` concentra los textos económicos de los diez idiomas habilitados: `es-AR`, `en-US`, `pt-BR`, `fr-FR`, `it-IT`, `de-DE`, `ja-JP`, `ko-KR`, `sv-SE` y `nb-NO`.
- `Scripts/ProbarEconomia.js` es la prueba automatizada específica del catálogo, los textos económicos y la persistencia estructural.
- Los archivos nuevos deben usar PascalCase, el código debe usar nombres en español y los textos deben guardarse en UTF-8.
- Los colores de marco, fondo, celdas, estados y texto deben proceder de `src/css/Variables.css`; la personalización solo definirá rutas de imagen y porcentajes de mezcla u opacidad.
- No hay una herramienta de conversión WebP instalada en el entorno. La imagen Torbellino se incorporará como PNG sin introducir una dependencia nueva ni una conversión no reproducible.

## Decisiones funcionales cerradas

- `tableroClasico`: incluido gratuitamente y equipado por defecto.
- `tableroEmblema`: incluido gratuitamente y disponible desde el inicio.
- `tableroTorbellino`: cuesta 200 puntos y requiere compra.
- El equipamiento es global, no pertenece a X, O, un jugador o un modo de juego.
- Solo puede existir un tablero equipado a la vez.
- El tablero clásico no usa imagen y reproduce el aspecto sólido actual.
- El marco forma parte del cuadrado del tablero; no se agregará un panel exterior que aumente innecesariamente la altura de la pantalla de juego.
- Las imágenes no se modificarán destructivamente para oscurecerlas. Cada artículo guardará ajustes visuales reutilizables y la interfaz aplicará una capa CSS.
- La primera versión no permitirá ajustar manualmente brillo, zoom o posición desde la interfaz.

## Alcance

### Incluye

- Tres artículos de categoría `tablero`.
- Copia al proyecto de la imagen Torbellino.
- Configuración visual por artículo para imagen, posición, tamaño, oscurecimiento y transparencia de celdas.
- Persistencia principal en SQLite y respaldo en Capacitor Preferences.
- Compra en tienda, selección en inventario y aplicación automática en partidas.
- Vista previa reutilizable para tienda e inventario.
- Traducciones en los diez idiomas activos.
- Pruebas automatizadas, visuales, responsivas y de persistencia.

### No incluye

- Generar imágenes adicionales.
- Editar permanentemente el brillo o los colores de los PNG originales.
- Estadísticas de uso por tablero.
- Tableros diferentes para X, O, NEXUS o cada modo de juego.
- Sincronización en la nube.
- Selector de intensidad, recorte o posición controlado por el usuario.

## Contrato de los artículos de tablero

Cada artículo de categoría `tablero` en `CatalogoTienda.js` tendrá este contrato estable:

- `id`: identificador camelCase único y persistible.
- `categoria`: valor fijo `tablero`.
- `claveNombre`: clave localizada bajo `tienda.tableros`.
- `precio`: entero no negativo.
- `inicial`: booleano que determina si se garantiza su adquisición durante la inicialización.
- `aparienciaTablero.rutaImagen`: ruta pública o `null` para el tablero sin imagen.
- `aparienciaTablero.tamanoFondo`: valor CSS controlado por catálogo; inicialmente `cover`.
- `aparienciaTablero.posicionFondo`: valor CSS controlado por catálogo; inicialmente `center`.
- `aparienciaTablero.oscurecimiento`: porcentaje entero entre 0 y 100 aplicado con `var(--color-fondo)`.
- `aparienciaTablero.opacidadCeldas`: porcentaje entero entre 0 y 100 aplicado con `var(--color-tablero)`.

Valores exactos de la primera entrega:

| ID | Nombre es-AR | Precio | Inicial | Imagen | Oscurecimiento | Opacidad de celdas |
| --- | --- | ---: | --- | --- | ---: | ---: |
| `tableroClasico` | Clásico | 0 | Sí | `null` | 100 | 100 |
| `tableroEmblema` | Emblema X/O | 0 | Sí | `/favicon.png` | 62 | 46 |
| `tableroTorbellino` | Torbellino X/O | 200 | No | `/Tableros/TorbellinoXO.png` | 68 | 52 |

Los tres usarán `tamanoFondo: 'cover'` y `posicionFondo: 'center'`. Estos valores son datos del catálogo y no deben convertirse en condicionales por ID.

## Mapa de cambios

| Archivo | Acción | Símbolos principales | Propósito |
| --- | --- | --- | --- |
| `public/Tableros/TorbellinoXO.png` | Crear desde la imagen entregada | Recurso estático | Empaquetar el fondo de pago dentro de la aplicación. |
| `src/Servicios/Economia/CatalogoTienda.js` | Modificar | `crearTablero`, `catalogoTableros`, `catalogoArticulos` | Declarar la categoría y sus tres artículos. |
| `src/Servicios/Economia/PresentacionTableros.js` | Crear | `TABLERO_PREDETERMINADO_ID`, `obtenerArticuloTablero`, `obtenerEstiloTablero` | Normalizar selecciones y traducir metadatos del catálogo a variables CSS reutilizables. |
| `src/Servicios/Economia/ServicioEconomia.js` | Modificar | `tableroEquipado`, `asegurarArticulosIniciales`, `equiparTablero` | Cargar, validar, persistir y respaldar el tablero global. |
| `src/components/Composables/useEquipamiento.js` | Modificar | `useEquipamiento` | Exponer el tablero y su operación de equipamiento junto al resto de la personalización. |
| `src/components/TaTeTi/Compartido/VistaPreviaTablero.vue` | Crear | `tableroId` | Renderizar una miniatura reutilizable con la misma apariencia configurada. |
| `src/components/TaTeTi/TableroTaTeTi.vue` | Modificar | `estiloTablero`, `.tablero-tateti`, `.celda-tateti` relacionada | Aplicar el fondo equipado al tablero interactivo y mantener la legibilidad. |
| `src/components/TaTeTi/CeldaTaTeTi.vue` | Modificar | `.celda-tateti`, `.celda-clickeable:hover` | Permitir que el fondo se vea mediante la opacidad configurada. |
| `src/pages/TiendaPage.vue` | Modificar | `catalogoTablerosOrdenados`, sección y vista previa de tableros | Permitir visualizar y comprar Torbellino con el flujo genérico existente. |
| `src/pages/InventarioPage.vue` | Modificar | `equiparTableroSeleccionado`, sección y resumen de tablero | Mostrar artículos adquiridos y seleccionar el tablero global. |
| `src/i18n/MensajesEconomia.js` | Modificar | `crearMensajes`, `agregarIdioma`, textos `tienda` e `inventario` | Localizar nombres, secciones, estados y descripciones. |
| `Scripts/ProbarEconomia.js` | Modificar | aserciones de catálogo, idiomas e integración | Evitar regresiones en precios, artículos iniciales y consumidores. |

## FASE 1: Incorporar los recursos y el catálogo extensible

### Objetivo

Disponer de tres artículos de tablero completamente definidos mediante datos, con una ruta local válida para Torbellino y sin lógica especial por diseño.

### Archivos y símbolos involucrados

- Nuevo `public/Tableros/TorbellinoXO.png`.
- Existente `public/favicon.png`.
- `src/Servicios/Economia/CatalogoTienda.js`: `catalogoArticulos`, `obtenerArticulosPorCategoria`, `obtenerArticulo`.

### Pasos de ejecución

- [x] Crear la carpeta `public/Tableros` y copiar `F:\Programación\Ta-Te-Ti\Ta-Te-Ti.png` como `public/Tableros/TorbellinoXO.png`.
  - Conservar el PNG cuadrado de 1024 × 1024 y verificar que el archivo copiado se abra correctamente.
  - No mover, renombrar ni modificar el archivo fuente externo.
  - No duplicar `favicon.png`; reutilizar su ruta pública existente `/favicon.png`.
- [x] Añadir en `CatalogoTienda.js` un constructor interno `crearTablero(articulo)` equivalente a `crearColor`, responsable de fijar `categoria: 'tablero'` y conservar `aparienciaTablero`.
- [x] Incorporar al final de `catalogoArticulos` los artículos `tableroClasico`, `tableroEmblema` y `tableroTorbellino` con exactamente los contratos y valores indicados en la tabla anterior.
  - Usar las claves `tienda.tableros.clasico`, `tienda.tableros.emblemaXO` y `tienda.tableros.torbellinoXO`.
  - Mantener `tableroClasico` y `tableroEmblema` con `precio: 0` e `inicial: true`.
  - Mantener `tableroTorbellino` con `precio: 200` e `inicial: false`.
- [x] Exportar `catalogoTableros` como arreglo congelado filtrado desde `catalogoArticulos`, siguiendo exactamente el patrón de `catalogoColores` y `catalogoSimbolos`.
- [x] Confirmar que `obtenerArticulosPorCategoria('tablero')` y `obtenerArticulo(id)` funcionen sin ramas nuevas, preservando la compra genérica existente.

### Criterio de finalización

- Los tres artículos aparecen una sola vez en el catálogo, las dos opciones gratuitas están marcadas como iniciales y Torbellino cuesta exactamente 200 puntos.
- Todas las imágenes utilizadas son locales y quedan empaquetadas por Quasar/Capacitor.

## FASE 2: Centralizar la presentación visual de los tableros

### Objetivo

Crear una única traducción entre el catálogo y las variables CSS, reutilizable por el tablero real y todas sus miniaturas futuras.

### Archivos y símbolos involucrados

- Nuevo `src/Servicios/Economia/PresentacionTableros.js`.
- Nuevo `src/components/TaTeTi/Compartido/VistaPreviaTablero.vue`.

### Pasos de ejecución

- [x] Crear `PresentacionTableros.js` y exportar `TABLERO_PREDETERMINADO_ID` con el valor `tableroClasico`.
- [x] Implementar `obtenerArticuloTablero(identificador)`.
  - Buscar el artículo mediante `obtenerArticulo`.
  - Aceptarlo únicamente si su categoría es `tablero` y posee `aparienciaTablero` válida.
  - Ante un ID vacío, eliminado o perteneciente a otra categoría, devolver `tableroClasico`.
- [x] Implementar `obtenerEstiloTablero(identificador)` para devolver exclusivamente estas propiedades CSS:
  - `--imagen-tablero`: `url("ruta")` cuando exista `rutaImagen` o `none` en el tablero clásico.
  - `--tamano-fondo-tablero`: `tamanoFondo`.
  - `--posicion-fondo-tablero`: `posicionFondo`.
  - `--oscurecimiento-tablero`: porcentaje con sufijo `%`.
  - `--opacidad-celdas-tablero`: porcentaje con sufijo `%`.
  - La función debe usar el artículo normalizado por `obtenerArticuloTablero`, para que nunca entregue un estilo incompleto.
- [x] Crear `VistaPreviaTablero.vue` como componente puramente visual y reutilizable.
  - Prop pública `tableroId`: `String`, valor predeterminado `TABLERO_PREDETERMINADO_ID`.
  - Resolver el estilo con un `computed` y `obtenerEstiloTablero`.
  - Renderizar un cuadrado con nueve elementos decorativos para representar la cuadrícula 3 × 3.
  - Marcar su contenido como `aria-hidden="true"`; el botón consumidor será responsable del nombre accesible.
  - Aplicar `aspect-ratio: 1`, cuadrícula 3 × 3, fondo configurado, capa oscura, celdas translúcidas, borde y radio usando variables de `Variables.css`.
  - No incluir nombres, precios, estados de compra ni eventos dentro del componente.

### Criterio de finalización

- El tablero real y las vistas de tienda/inventario pueden consumir el mismo ID y obtener la misma imagen, encuadre y porcentajes visuales.
- Un ID inválido muestra el diseño clásico sin producir errores ni estilos incompletos.

## FASE 3: Persistir y equipar un tablero global

### Objetivo

Extender el servicio económico sin alterar el esquema SQLite y garantizar compatibilidad con instalaciones existentes y con el respaldo de Preferences.

### Archivos y símbolos involucrados

- `src/Servicios/Economia/ServicioEconomia.js`: constantes de almacenamiento, `inicializarEconomia`, `migrarEconomia`, `cargarEstado`, `usarEconomia`.
- `src/components/Composables/useEquipamiento.js`: `useEquipamiento`.

### Pasos de ejecución

- [x] Importar `TABLERO_PREDETERMINADO_ID` y `obtenerArticuloTablero` desde `PresentacionTableros.js`.
- [x] Declarar en `ServicioEconomia.js`:
  - `CLAVE_TABLERO_RESPALDO = 'tablero_equipado'` para Capacitor Preferences.
  - `CLAVE_TABLERO_ECONOMIA = 'tableroEquipado'` para `EstadoEconomia`.
  - `tableroEquipado = ref(TABLERO_PREDETERMINADO_ID)` como estado reactivo compartido.
- [x] Implementar `normalizarTableroEquipado(identificador, exigirAdquisicion = true)`.
  - Validar siempre que el artículo exista y sea de categoría `tablero`.
  - Cuando `exigirAdquisicion` sea `true`, aceptar únicamente IDs presentes en `articulosAdquiridos.value`.
  - Volver siempre a `tableroClasico` ante datos vacíos, corruptos, eliminados o, cuando corresponda, no adquiridos.
- [x] Implementar `guardarTableroRespaldo(identificador)` y `cargarTableroRespaldo()` con Capacitor Preferences.
  - Guardar el ID como cadena simple.
  - No usar JSON para este valor escalar.
  - Normalizar el valor leído con `exigirAdquisicion: false` antes de asignarlo, porque si SQLite está temporalmente indisponible todavía no se puede reconstruir el conjunto de compras; esto replica el comportamiento de respaldo del equipamiento de fichas y permite conservar un Torbellino comprado previamente.
- [x] Extraer la inserción de artículos iniciales a `asegurarArticulosIniciales()`.
  - Ejecutar una transacción que recorra `catalogoArticulos.filter((articulo) => articulo.inicial)`.
  - Realizar `INSERT OR IGNORE` en `ArticulosAdquiridos` para cada ID con una fecha válida.
  - Invocar esta función en cada inicialización correcta de SQLite, después de `migrarEconomia` y antes de `cargarEstado`.
  - Mantener la operación idempotente para no duplicar adquisiciones ni generar movimientos económicos.
  - Con esto, instalaciones ya marcadas con `economia_migrada_v2` recibirán `tableroClasico` y `tableroEmblema` sin una compra ficticia.
- [x] Ampliar `cargarEstado()`.
  - Cargar primero `ArticulosAdquiridos`.
  - Consultar `EstadoEconomia` por `CLAVE_TABLERO_ECONOMIA`.
  - Normalizar el valor con `exigirAdquisicion: true`, porque en este punto ya se cargó la fuente principal de artículos adquiridos.
  - Si no existe fila, conservar `tableroClasico`; no es obligatorio escribir durante una mera lectura.
- [x] Ajustar `inicializarEconomia()` para cargar también el respaldo del tablero antes de intentar SQLite.
  - Si SQLite funciona, el valor de `EstadoEconomia` será la fuente principal.
  - Si SQLite falla, conservar el valor válido recuperado desde Preferences.
- [x] Implementar y exportar `equiparTablero(articuloId)`.
  - Validar que el artículo exista y sea de categoría `tablero`; devolver `articuloInvalido` si no lo es.
  - Validar que esté adquirido; devolver `articuloNoAdquirido` si no lo está.
  - Persistir mediante `INSERT OR REPLACE INTO EstadoEconomia (clave, valor)` dentro de `ejecutarTransaccionEstadisticas`.
  - Actualizar `tableroEquipado` únicamente después de que la transacción finalice correctamente.
  - Guardar el mismo ID en Preferences.
  - Devolver `equipado`, respetando los códigos ya usados por el inventario.
- [x] Exponer `tableroEquipado` y `equiparTablero` desde `usarEconomia()`.
- [x] Exponer los mismos símbolos desde `useEquipamiento()` sin duplicar estado ni observadores.
- [x] Mantener `FICHAS` y `CATEGORIAS_EQUIPAMIENTO` limitados a X/O, `color` y `simbolo`.
  - El tablero no debe insertarse artificialmente en `EquipamientoFichas` porque es una selección global.
- [x] No modificar `EsquemaEstadisticas.js` ni `VERSION_BASE_ESTADISTICAS`: `EstadoEconomia` y `ArticulosAdquiridos` ya cubren el nuevo comportamiento.

### Criterio de finalización

- Una instalación nueva y una ya migrada poseen Clásico y Emblema sin movimientos de compra.
- Torbellino solo queda adquirido después de descontar 200 puntos mediante `comprarArticulo`.
- El tablero seleccionado se restaura después de recargar la aplicación y tiene un fallback clásico ante datos inválidos.

## FASE 4: Integrar compra y vista previa en la tienda

### Objetivo

Añadir una tercera categoría visual al flujo de compra actual sin duplicar validaciones, confirmación ni descuento de puntos.

### Archivos y símbolos involucrados

- `src/pages/TiendaPage.vue`: imports, computeds, template, modal y estilos.
- `src/components/Tienda/CarruselTienda.vue`: reutilización sin cambios de contrato.
- `src/components/TaTeTi/Compartido/VistaPreviaTablero.vue`: consumidor.

### Pasos de ejecución

- [x] Importar `catalogoTableros` y `VistaPreviaTablero` en `TiendaPage.vue`.
- [x] Crear `catalogoTablerosOrdenados` mediante el `ordenarArticulos` ya existente, sin una segunda implementación de orden.
- [x] Agregar después del carrusel de símbolos un `CarruselTienda` con título y etiqueta `t('tienda.tablerosTitulo')`.
- [x] Renderizar un botón por artículo con el mismo contrato de los botones existentes:
  - Estado `adquirido` cuando el ID está en `articulosAdquiridos`.
  - Estado `bloqueado` y `disabled` cuando el saldo no alcanza.
  - Marca de verificación para artículos adquiridos.
  - Precio para artículos no adquiridos.
  - `textoAccesibleArticulo(articulo)` como nombre accesible.
  - `solicitarCompra(articulo)` como acción, de modo que Torbellino reutilice `confirmarCompra` y `comprarArticulo`.
- [x] Mostrar `VistaPreviaTablero` dentro de cada tarjeta y agregar clases específicas `cuadro-tablero` únicamente para distribución y tamaño.
- [x] Ampliar la vista previa de `ModalConfirmacion`.
  - Si `articuloPendiente.categoria === 'tablero'`, mostrar `VistaPreviaTablero` con el ID pendiente.
  - Mantener sin cambios funcionales las ramas existentes de color y símbolo.
- [x] Ajustar CSS para que la miniatura sea cuadrada, ocupe el ancho útil de la tarjeta y no quede tapada por precio o estado.
  - Reutilizar colores, bordes, radios y sombras actuales.
  - Mantener el ancho de columnas definido por `CarruselTienda` en 116 px y 128 px desde 700 px.
  - No introducir colores literales nuevos.

### Criterio de finalización

- Clásico y Emblema aparecen como adquiridos desde el inicio.
- Torbellino muestra 200 puntos, queda deshabilitado sin saldo suficiente y abre la confirmación con su miniatura cuando la compra es posible.
- Confirmar la compra descuenta exactamente 200 puntos y lo mueve al estado adquirido usando el servicio existente.

## FASE 5: Integrar selección y resumen en el inventario

### Objetivo

Permitir seleccionar uno de los tableros adquiridos y mostrar claramente cuál está equipado, sin asociarlo a X u O.

### Archivos y símbolos involucrados

- `src/pages/InventarioPage.vue`: imports, estado de equipamiento, resumen, sección de tableros, acciones, accesibilidad y estilos.
- `src/components/TaTeTi/Compartido/VistaPreviaTablero.vue`: consumidor.

### Pasos de ejecución

- [x] Importar `VistaPreviaTablero` y obtener `tableroEquipado` y `equiparTablero` desde `useEquipamiento()`.
- [x] Ampliar la tarjeta `tarjeta-equipado` con un resumen de tablero global.
  - Conservar las dos tarjetas actuales de X y O.
  - Agregar debajo una tarjeta `tablero-equipado` que abarque ambas columnas.
  - Mostrar `VistaPreviaTablero`, el nombre localizado del artículo y la etiqueta `inventario.tableroEquipado`.
  - El resumen es informativo; no debe cambiar la selección al pulsarlo.
- [x] Agregar una única sección de tableros después del resumen equipado y antes de las secciones por participante.
  - Título `t('inventario.tablerosTitulo')`.
  - Reutilizar `articulosDisponiblesPorCategoria('tablero')` para listar solo diseños adquiridos.
  - Usar un carrusel horizontal con botones cuadrados y `VistaPreviaTablero`.
  - Marcar `activo` cuando `tableroEquipado === articulo.id`.
  - Mostrar el nombre localizado debajo de la miniatura.
- [x] Implementar `equiparTableroSeleccionado(articuloId)` separado de `equipar(ficha, categoria, articuloId)`.
  - Invocar `equiparTablero`.
  - Mostrar `inventario.tableroEquipadoCorrectamente` cuando devuelva `equipado`.
  - Traducir `articuloNoAdquirido` con la clave existente.
  - Traducir cualquier otro resultado o excepción con `inventario.errorEquipamiento`.
  - Actualizar `estadoConError` de forma consistente con colores y símbolos.
- [x] Implementar `textoAccesibleTablero(articulo)` con nombre localizado y estado equipado cuando corresponda.
- [x] Reutilizar los estilos base de `.panel-inventario`, `.item-color`, `.activo` y el carrusel.
  - Añadir clases específicas solo para la miniatura, el resumen de ancho completo y la proporción interna.
  - No copiar la lógica visual de fondos al inventario; delegarla siempre a `VistaPreviaTablero`.

### Criterio de finalización

- El inventario muestra siempre Clásico y Emblema, y muestra Torbellino únicamente después de comprarlo.
- Seleccionar un tablero actualiza el resaltado, el resumen y el mensaje de estado.
- La selección no modifica los colores, símbolos ni la ficha preferida.

## FASE 6: Aplicar el tablero equipado al juego

### Objetivo

Mostrar el mismo diseño global en los dos modos de juego, usando el cuadrado existente como marco y manteniendo intacta la interacción.

### Archivos y símbolos involucrados

- `src/components/TaTeTi/TableroTaTeTi.vue`: template, script y estilos.
- `src/components/TaTeTi/CeldaTaTeTi.vue`: estilos de estado normal y hover.
- Consumidores ya existentes: `src/pages/JugarContraIA.vue` y `src/pages/JugarMultijugador.vue`.

### Pasos de ejecución

- [x] En `TableroTaTeTi.vue`, obtener `tableroEquipado` desde `usarEconomia()` y calcular `estiloTablero` mediante `obtenerEstiloTablero(tableroEquipado.value)`.
- [x] Vincular `:style="estiloTablero"` a `.tablero-tateti`.
- [x] Convertir `.tablero-tateti` en la superficie enmarcada:
  - Mantener cuadrícula, proporción 1:1, padding, radio y sombra actuales.
  - Añadir borde con `var(--color-borde-tablero)`.
  - Componer el fondo con una capa `linear-gradient` basada en `var(--color-fondo)` y `--oscurecimiento-tablero`, seguida por `--imagen-tablero`.
  - Usar `--tamano-fondo-tablero`, `--posicion-fondo-tablero` y `no-repeat`.
  - Mantener el fondo clásico visualmente equivalente al actual.
- [x] En `CeldaTaTeTi.vue`, sustituir el fondo opaco por una mezcla de `var(--color-tablero)` y transparencia controlada mediante `--opacidad-celdas-tablero`.
  - Mantener los bordes de las nueve celdas con `var(--color-borde-tablero)`.
  - Ajustar el hover con `var(--color-fondo-alterno)` y el mismo principio de transparencia, sin volver a ocultar por completo la imagen.
  - No cambiar eventos, validación de celdas ocupadas ni animación de fichas.
- [x] Verificar el orden visual:
  - Imagen al fondo.
  - Capa oscura sobre la imagen.
  - Celdas y bordes sobre la capa.
  - Fichas sobre las celdas.
  - SVG de la línea ganadora sobre todo lo anterior con su `z-index` actual.
- [x] No agregar props nuevas en `JugarContraIA.vue` ni `JugarMultijugador.vue`.
  - Ambos consumidores deben recibir la personalización automáticamente desde `TableroTaTeTi`.
  - La carga global existente de `cargarEquipamiento()` en `MainLayout.vue` debe seguir siendo el único punto de inicialización de la personalización al arrancar.

### Criterio de finalización

- Cambiar el tablero en Inventario se refleja en ambos modos sin reiniciar la aplicación.
- Las nueve celdas siguen siendo pulsables en los mismos estados.
- Las fichas de cualquier color, incluyendo negro y variantes flúor, y la línea ganadora siguen distinguiéndose sobre Emblema y Torbellino.

## FASE 7: Completar la localización

### Objetivo

Incorporar todos los textos de tableros sin depender accidentalmente del fallback inglés.

### Archivos y símbolos involucrados

- `src/i18n/MensajesEconomia.js`: `crearMensajes`, idiomas base y `agregarIdioma`.

### Pasos de ejecución

- [x] Ampliar `crearMensajes` para aceptar `tableros` y exponerlo como `tienda.tableros`, igual que ya hace con `colores`.
- [x] Ampliar `agregarIdioma` para recibir y mezclar el objeto `tableros` de cada idioma con el inglés base.
- [x] Agregar en `tienda` para los diez idiomas:
  - `tablerosTitulo`: nombre de la sección de diseños de tablero.
  - Actualizar `subtitulo` y `menuDescripcion` para que no limiten la personalización únicamente a colores y símbolos.
- [x] Agregar bajo `tienda.tableros` en los diez idiomas:
  - `clasico`.
  - `emblemaXO`.
  - `torbellinoXO`.
- [x] Agregar en `inventario` para los diez idiomas:
  - `tablerosTitulo`.
  - `tableroEquipado`.
  - `tableroEquipadoCorrectamente`.
- [x] Redactar traducciones naturales para cada idioma habilitado y no dejar ninguno usando el texto inglés por omisión.
- [x] Conservar interpolaciones, acentos y caracteres nativos en UTF-8.

### Criterio de finalización

- Todos los nombres, títulos, estados y textos accesibles de tableros se resuelven en los diez idiomas.
- La tienda y el inventario describen correctamente que ahora personalizan fichas y tablero.

## FASE TESTING

### Objetivo

Validar catálogo, compatibilidad de datos, compra, persistencia, apariencia, accesibilidad e integración completa en teléfono y escritorio.

### Pruebas automatizadas

- [x] Extender `Scripts/ProbarEconomia.js` para importar `catalogoTableros`, `TABLERO_PREDETERMINADO_ID`, `obtenerArticuloTablero` y `obtenerEstiloTablero`.
- [x] Verificar exactamente:
  - IDs `tableroClasico`, `tableroEmblema`, `tableroTorbellino` sin duplicados.
  - Categoría `tablero` en los tres artículos.
  - Iniciales `[tableroClasico, tableroEmblema]`.
  - Precios `[0, 0, 200]` en ese orden.
  - Rutas `null`, `/favicon.png` y `/Tableros/TorbellinoXO.png`.
  - Porcentajes dentro del rango 0–100 y valores exactos definidos por este plan.
  - Fallback de un ID desconocido hacia `tableroClasico`.
  - Presencia de las cinco variables CSS devueltas por `obtenerEstiloTablero`.
- [x] Mantener la aserción `VERSION_BASE_ESTADISTICAS === 4`, demostrando que no se agregó una migración innecesaria.
- [x] Ampliar el bucle de idiomas para exigir `tienda.tablerosTitulo`, los tres nombres de `tienda.tableros` y las tres claves nuevas de inventario en cada código.
- [x] Verificar mediante lectura de archivos que:
  - Tienda e Inventario integran `VistaPreviaTablero`.
  - `TableroTaTeTi.vue` consume `tableroEquipado` y `obtenerEstiloTablero`.
  - El recurso `public/Tableros/TorbellinoXO.png` existe.
- [x] Ejecutar `npm run lint` y corregir todos los errores.
- [x] Ejecutar `npm test` y comprobar que idiomas, actualización y economía finalicen correctamente.
- [x] Ejecutar `npm run build` para validar empaquetado Quasar/Capacitor y disponibilidad de las rutas públicas en Android.

### Pruebas manuales de economía y persistencia

- [x] Simular o usar un perfil existente con `economia_migrada_v2 = true` y comprobar que Clásico y Emblema aparecen adquiridos sin registrar compras ni descontar puntos.
- [x] Con menos de 200 puntos, comprobar que Torbellino muestra su precio pero no permite abrir una compra válida.
- [x] Con al menos 200 puntos, comprar Torbellino y verificar un único descuento de 200, un registro en `ArticulosAdquiridos` y un movimiento económico de tipo `compra`.
- [x] Confirmar que repetir la inicialización no duplica artículos iniciales ni modifica el saldo.
- [x] Equipar cada tablero, recargar la aplicación y comprobar que se restaura la selección.
- [x] Probar un ID de respaldo inválido o perteneciente a color/símbolo y comprobar el fallback a Clásico.
- [x] Simular indisponibilidad de SQLite y comprobar que un tablero válido puede recuperarse desde Preferences sin bloquear el arranque.

### Pruebas manuales de interfaz y juego

- [x] En Tienda, revisar los tres diseños, los estados adquirido/bloqueado, los nombres, precios y la miniatura del modal de confirmación.
- [x] En Inventario, verificar el resumen global, el carrusel de diseños adquiridos, el resaltado activo y los mensajes de éxito/error.
- [x] En juego contra NEXUS y multijugador, probar Clásico, Emblema y Torbellino con partidas completas.
- [x] Para cada fondo, comprobar celda vacía, hover en web, celda ocupada, ficha negra, ficha blanca flúor y línea ganadora X/O.
- [x] Confirmar que cambiar de tablero no afecta colores, símbolos, ficha preferida, puntaje, recompensas ni estadísticas existentes.
- [x] Navegar por botones de tienda e inventario con teclado y comprobar foco, nombre accesible, estado deshabilitado y selección equipada.

### Casos responsivos

- [x] Validar un teléfono angosto de 300–360 px: el cuadrado no desborda, conserva su marco, las miniaturas caben en los carruseles y los controles superiores siguen visibles.
- [x] Validar el teléfono de referencia mostrado por Leo: el tablero ocupa el espacio disponible sin empujar fuera de pantalla el selector de dificultad ni `InfoJuego`.
- [x] Validar 600 px, donde cambia el padding y gap del tablero.
- [x] Validar 700 px o más, donde el carrusel de tienda usa columnas de 128 px.
- [x] Validar escritorio hasta el máximo actual de 400 px del tablero y comprobar que la imagen no se pixela ni se estira fuera del cuadrado.
- [x] Comprobar orientación vertical y horizontal en Android, incluyendo el espacio reservado para publicidad.

## Progreso del plan

- [x] Fase 1: Incorporar los recursos y el catálogo extensible
- [x] Fase 2: Centralizar la presentación visual de los tableros
- [x] Fase 3: Persistir y equipar un tablero global
- [x] Fase 4: Integrar compra y vista previa en la tienda
- [x] Fase 5: Integrar selección y resumen en el inventario
- [x] Fase 6: Aplicar el tablero equipado al juego
- [x] Fase 7: Completar la localización
- [x] Fase Testing

Fecha de creación: 22 de septiembre de 2026
Fecha de última actualización: 22 de septiembre de 2026
Estado: COMPLETADO
