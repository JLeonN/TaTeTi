# PLAN TIENDA DE SÍMBOLOS EQUIPABLES

## Descripción del plan

Agregar símbolos visuales comprables y equipables a las dos fichas internas del TaTeTi. X y O seguirán siendo los únicos valores de lógica para tablero, turnos, IA, resultados y estadísticas. Cada ficha tendrá un color y un símbolo equipados de forma independiente.

Los artículos iniciales serán los símbolos X y O; triángulo y cuadrado serán artículos de símbolo comprables por 120 puntos cada uno. El sistema debe quedar preparado para incorporar nuevos símbolos de texto, emojis, íconos o imágenes sin reescribir la economía ni la lógica del juego.

## Objetivo principal

- Permitir comprar triángulo y cuadrado por separado, a 120 puntos cada uno.
- Permitir equipar cada símbolo adquirido en X u O desde el inventario.
- Impedir que X y O usen el mismo símbolo de forma simultánea.
- Mantener los colores, las partidas históricas y las configuraciones actuales.
- Definir una arquitectura reutilizable para futuras categorías y representaciones visuales.

## Reglas del plan

- Las fichas internas permitidas son exclusivamente `X` y `O`.
- `X` y `O` nunca se reemplazan en `useTaTeTi`, IA, tablas `Partidas` y `Turnos`, filtros ni estadísticas.
- El equipamiento de cada ficha tendrá las categorías `color` y `simbolo`.
- Cada ficha debe tener siempre un color y un símbolo válidos.
- Los símbolos `simboloX` y `simboloO` son iniciales y gratuitos.
- `simboloTriangulo` y `simboloCuadrado` cuestan 120 puntos cada uno.
- No se puede equipar el mismo símbolo en X y O, aunque sus colores sean diferentes.
- El comportamiento actual de colores se conserva: si se equipa en una ficha el color usado por la otra, los colores se intercambian.
- Los identificadores de artículos existentes no cambian.
- Todo archivo nuevo debe respetar PascalCase y no usar guiones ni guiones bajos en su nombre.
- Guardar todo texto en UTF-8 y mantener variables, funciones, comentarios y UI en español.

## Contratos técnicos definidos

### Artículos

- `CatalogoTienda.js` exportará `catalogoArticulos`, `catalogoColores`, `catalogoSimbolos`, `obtenerArticulo` y `obtenerArticulosPorCategoria`.
- Cada artículo tendrá `id`, `categoria`, `claveNombre`, `precio`, `inicial` y `representacion`.
- Los colores conservarán además `variable` y `colorVista`.
- Los símbolos usarán `categoria: 'simbolo'` y `representacion` con `tipo: 'texto'` y el carácter visible correspondiente.
- Los cuatro identificadores de símbolos serán `simboloX`, `simboloO`, `simboloTriangulo` y `simboloCuadrado`.
- Las representaciones finales son `X`, `O`, `△` y `□`, respectivamente; las figuras huecas mantienen un peso visual consistente con O.

### Equipamiento

- El estado reactivo `equipamiento` tendrá esta forma: `{ X: { color: 'rojo', simbolo: 'simboloX' }, O: { color: 'azul', simbolo: 'simboloO' } }`.
- `equiparArticulo(ficha, categoria, articuloId)` devolverá uno de estos resultados: `equipado`, `simboloEnUso`, `articuloInvalido` o `articuloNoAdquirido`.
- La interfaz mostrará estados de éxito y mensajes traducidos para resultados distintos de `equipado`.
- El respaldo de Preferences conservará la clave `equipamiento_fichas` y migrará desde el formato antiguo `{ X: 'rojo', O: 'azul' }` al nuevo formato anidado.

### Persistencia SQLite

- La migración de equipamiento corresponde a la versión 3 y el esquema vigente es la versión 4, que conserva el símbolo usado en cada partida contra NEXUS.
- La migración 3 renombrará temporalmente la tabla actual `EquipamientoFichas`, creará una nueva tabla con columnas `ficha`, `categoria` y `articuloId`, y usará clave primaria compuesta `(ficha, categoria)`.
- La migración copiará cada registro anterior como categoría `color`, eliminará la tabla temporal y agregará el índice por `articuloId` si resulta útil para consultas futuras.
- La migración insertará con `INSERT OR IGNORE` los artículos `simboloX` y `simboloO` en `ArticulosAdquiridos`.
- La migración insertará con `INSERT OR IGNORE` el símbolo inicial de X y el símbolo inicial de O en la nueva tabla de equipamiento.
- Las consultas de carga leerán `ficha`, `categoria` y `articuloId`, reconstruirán el objeto anidado y aplicarán valores iniciales ante registros incompletos o inválidos.

### Renderizado visual

- Se creará `src/components/TaTeTi/Compartido/FichaVisual.vue`.
- `FichaVisual.vue` aceptará `ficha`, `colorId`, `simboloId`, `tamano` y `etiquetaAccesible`.
- Cuando no se reciban `colorId` o `simboloId`, resolverá el equipamiento vigente de la ficha indicada.
- El componente resolverá artículos por identificador, aplicará color, sombra y flúor, y renderizará inicialmente representaciones de tipo `texto`.
- La estructura de `representacion` reservará los tipos `texto`, `emoji`, `icono` e `imagen`; solo `texto` se implementará ahora. Los tipos futuros deberán tener una representación explícita antes de renderizarse.

## FASE 1: Generalizar catálogo y migrar persistencia

### Objetivo

Crear el modelo único de artículos y migrar los datos de economía sin perder compras ni colores existentes.

- [x] Actualizar `src/Servicios/Economia/CatalogoTienda.js` con `catalogoArticulos` como fuente única de artículos.
- [x] Derivar `catalogoColores` y `catalogoSimbolos` desde el catálogo único para conservar los consumidores actuales y evitar duplicar datos.
- [x] Mantener todos los artículos de color actuales con el mismo `id`, precio, traducción, variable CSS, color de vista y estado inicial.
- [x] Agregar `simboloX` y `simboloO` con precio 0 e `inicial: true`.
- [x] Agregar `simboloTriangulo` y `simboloCuadrado` con precio 120 e `inicial: false`.
- [x] Implementar `obtenerArticulosPorCategoria(categoria)` y hacer que `obtenerArticulo(identificador)` consulte el catálogo completo.
- [x] Conservar la migración 3 de `EquipamientoFichas` y el esquema vigente en versión 4.
- [x] Ajustar `Scripts/ProbarEconomia.js` para validar catálogo completo, identificadores únicos, precios, estados iniciales y migraciones hasta versión 4.
- [x] Crear en el test una base en versión 2, ejecutar las migraciones 3 y 4 y comprobar la conservación de colores, símbolos iniciales y columnas históricas.

## FASE 2: Adaptar servicio de economía y respaldo

### Objetivo

Convertir el equipamiento en datos por ficha y categoría, con validaciones deterministas y compatibilidad de respaldo.

- [x] Actualizar `src/Servicios/Economia/ServicioEconomia.js` para inicializar `articulosAdquiridos` desde los artículos iniciales de `catalogoArticulos`.
- [x] Reemplazar el equipamiento plano por el objeto anidado definido en los contratos técnicos.
- [x] Adaptar `migrarEconomia` para registrar todos los artículos iniciales de `catalogoArticulos`, no solamente colores.
- [x] Adaptar `cargarEstado` para cargar las tres columnas de la nueva tabla y normalizar el equipamiento antes de exponerlo.
- [x] Adaptar `cargarEquipamientoRespaldo` para reconocer y convertir el formato antiguo plano y validar el formato nuevo anidado.
- [x] Mantener `guardar` del respaldo con el formato nuevo y con ambos colores y símbolos obligatorios.
- [x] Implementar `equiparArticulo(ficha, categoria, articuloId)` con validación de ficha, categoría, existencia, pertenencia de categoría y adquisición previa.
- [x] Para categoría `color`, conservar el intercambio automático cuando el color solicitado pertenece a la otra ficha.
- [x] Para categoría `simbolo`, devolver `simboloEnUso` sin escribir cambios cuando el símbolo solicitado está equipado por la otra ficha.
- [x] Persistir en una sola transacción todas las filas modificadas de color y símbolo, y actualizar el estado reactivo solo después de una transacción exitosa.
- [x] Actualizar `src/components/Composables/useEquipamiento.js` para aplicar variables CSS solo desde `equipamiento[ficha].color` y exponer `equiparArticulo` con el nuevo contrato.
- [x] Verificar que `MainLayout.vue` siga inicializando el equipamiento antes de renderizar las rutas de juego.

## FASE 3: Centralizar las fichas visuales

### Objetivo

Eliminar símbolos escritos de forma fija y usar un único componente para todos los contextos visuales.

- [x] Crear `src/components/TaTeTi/Compartido/FichaVisual.vue` con los props y comportamiento definidos en los contratos técnicos.
- [x] Mantener en `FichaVisual.vue` las clases de estilo basadas en la ficha interna, para reutilizar las variables CSS existentes `--color-ficha-x`, `--color-ficha-o`, `--sombra-ficha-x` y `--sombra-ficha-o`.
- [x] Reemplazar el contenido textual fijo de `src/components/TaTeTi/CeldaTaTeTi.vue` por `FichaVisual.vue`.
- [x] Actualizar `src/components/TaTeTi/TableroTaTeTi.vue` para conservar el color de la línea ganadora por ficha interna; la línea no debe depender del símbolo mostrado.
- [x] Actualizar `src/components/TaTeTi/InfoJuego.vue` para mostrar el símbolo de turno y el símbolo del ganador junto con el nombre, manteniendo X y O únicamente como identificadores internos.
- [x] Actualizar `src/components/TaTeTi/Compartido/ModalResultado.vue` para mostrar `FichaVisual.vue` junto al nombre ganador.
- [x] Actualizar el selector de ficha de `src/pages/JugarContraIA.vue` para mostrar el símbolo y color equipados en las opciones internas X y O.
- [x] Mantener `useTaTeTi` e IA basados en X y O, y registrar aparte los identificadores visuales usados en partidas contra NEXUS.
- [x] Mantener compatibilidad con partidas históricas X y O y mostrar el símbolo registrado mediante el esquema versión 4.

## FASE 4: Integrar símbolos en tienda e inventario

### Objetivo

Permitir comprar y equipar símbolos con la misma experiencia de los colores, sin duplicar la lógica de tarjetas ni previsualizaciones.

- [x] Actualizar `src/pages/TiendaPage.vue` para crear una función de ordenamiento común por estado adquirido y precio.
- [x] Mantener el carrusel actual de colores y agregar un segundo `CarruselTienda` para `catalogoSimbolos`.
- [x] Reutilizar el flujo existente de confirmación y compra; el artículo pendiente puede pertenecer a cualquier categoría.
- [x] Reemplazar las muestras fijas X y O de las tarjetas y del modal de compra por `FichaVisual.vue` con los identificadores de color y símbolo correspondientes.
- [x] Mostrar cada símbolo como una sola ficha de vista previa; los colores conservarán la previsualización de ambas fichas.
- [x] Actualizar etiquetas accesibles de tienda para incluir el nombre del artículo, precio, estado adquirido y acción disponible.
- [x] Actualizar `src/pages/InventarioPage.vue` para resolver `obtenerArticuloEquipado(ficha, categoria)` sobre el equipamiento anidado.
- [x] Mantener las secciones de colores de X y O y agregar dos secciones equivalentes para símbolos de X y O.
- [x] Usar `obtenerArticulosPorCategoria` filtrado por `articulosAdquiridos` para listar artículos equipables en cada sección.
- [x] Llamar a `equiparArticulo(ficha, 'color', articuloId)` para colores y a `equiparArticulo(ficha, 'simbolo', articuloId)` para símbolos.
- [x] Deshabilitar el botón del símbolo ya equipado por la otra ficha y mostrar el texto traducido de exclusividad, sin ocultar el artículo adquirido.
- [x] Usar `FichaVisual.vue` en el resumen de equipamiento, carruseles, tarjetas y modal de compra.
- [x] Mantener la selección de ficha preferida contra NEXUS en `UseFichaJugador.js`; esa preferencia continúa guardando X u O y no el símbolo visual.

## FASE 5: Completar traducciones y cobertura de regresión

### Objetivo

Traducir la nueva interfaz y asegurar que la personalización no altere los modos de juego ni los datos históricos.

- [x] Actualizar `src/i18n/MensajesEconomia.js` con claves para título y descripción de símbolos, nombre de cada símbolo, símbolo equipado, símbolo en uso y error de equipamiento.
- [x] Completar cada clave nueva en todos los idiomas registrados por `MensajesEconomia.js`.
- [x] Ejecutar `npm run generar-idiomas` y verificar los archivos generados sin editar manualmente el catálogo de idiomas.
- [x] Ejecutar `npm run validar-idiomas` y corregir cualquier clave faltante o sobrante.
- [x] Confirmar en `JugarContraIA.vue` que IA recibe y devuelve exclusivamente X y O y que el registro guarda esos valores junto con los identificadores visuales históricos.
- [x] Confirmar en `JugarMultijugador.vue`, `useTaTeTi.js`, `InfoJuego.vue` y `ModalResultado.vue` que el ganador se determina por X u O y solo cambia su apariencia.
- [x] Revisar `EstadisticasPage.vue` y `BarraFiltrosEstadisticas.vue` para admitir partidas antiguas X/O y símbolos históricos registrados desde la versión 4.

## FASE TESTING

### Objetivo

Validar el catálogo, migración, persistencia, compra, equipamiento, accesibilidad y compatibilidad de juego en datos nuevos y existentes.

- [x] Ejecutar `npm run lint` y corregir todos los errores introducidos.
- [x] Ejecutar `npm test` y confirmar que `Scripts/ProbarEconomia.js` valida las migraciones desde versión 2 hasta versión 4.
- [x] Verificar en una instalación nueva que rojo y azul están equipados, y que X y O están adquiridos y equipados como símbolos iniciales.
- [x] Verificar en datos existentes que los colores adquiridos y equipados se conservan después de actualizar mediante las migraciones 3 y 4.
- [x] Verificar que triángulo y cuadrado cuestan 120 puntos, se compran una sola vez y aparecen adquiridos tras reiniciar la aplicación.
- [x] Equipar triángulo en X y cuadrado en O y comprobar su renderizado en inventario, tienda, selector contra NEXUS, tablero, turno, línea ganadora y resultado.
- [x] Equipar X u O como símbolo sobre cualquiera de las dos fichas y comprobar que la lógica del juego no cambia.
- [x] Intentar equipar el mismo símbolo en ambas fichas y comprobar que el botón está deshabilitado, se muestra el mensaje correcto y no se altera el equipamiento vigente.
- [x] Equipar el color usado por la otra ficha y comprobar que se conserva el intercambio automático actual.
- [x] Jugar una partida completa contra IA usando símbolos nuevos y validar turnos, IA, ganador, puntaje, registro y reinicio.
- [x] Jugar una partida multijugador usando símbolos nuevos y validar turnos, ganador, empate, línea ganadora y reinicio.
- [x] Cambiar la ficha preferida contra NEXUS y confirmar que `ficha_usuario_ia` continúa guardando X u O, no un identificador de artículo.
- [x] Cambiar entre todos los idiomas y comprobar que no quedan textos sin traducir, caracteres dañados ni etiquetas accesibles ambiguas.
- [x] Probar tamaños de pantalla de 300 px, móvil y escritorio para comprobar que las tarjetas y carruseles no desbordan y que los símbolos se distinguen.
- [x] Compilar correctamente el APK Android de prueba.

## Progreso del plan

- [x] Fase 1: Generalizar catálogo y migrar persistencia
- [x] Fase 2: Adaptar servicio de economía y respaldo
- [x] Fase 3: Centralizar las fichas visuales
- [x] Fase 4: Integrar símbolos en tienda e inventario
- [x] Fase 5: Completar traducciones y cobertura de regresión
- [x] Fase Testing

Fecha de creación: 24 de Julio 2026
Fecha de última actualización: 21 de Septiembre 2026
Estado: COMPLETADO
