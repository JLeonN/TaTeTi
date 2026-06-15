# PLAN TIENDA, INVENTARIO Y RECOMPENSAS

## Descripción del plan

Agregar una economía local ampliable para que el jugador pueda conseguir, gastar y consultar puntos. La primera versión incluirá una Tienda llamativa, un Inventario independiente, colores comprables para las fichas, regalo diario, anuncios recompensados y nuevas estadísticas económicas.

La implementación debe reutilizar la puntuación, selección de ficha, publicidad, traducciones, navegación y base SQLite existentes. Los datos empiezan siendo exactos desde la incorporación de cada función; no se inventarán movimientos anteriores que no puedan reconstruirse.

## Objetivo principal

- Permitir obtener 10 puntos mediante un regalo diario y 15 puntos por cada anuncio recompensado
- Limitar los anuncios recompensados a 3 por día local
- Permitir comprar colores y equiparlos de forma independiente en `X` y `O`
- Mantener colores distintos entre ambas fichas
- Sincronizar la ficha preferida contra NEXUS entre el selector actual y el Inventario
- Registrar movimientos económicos y mostrar estadísticas agregadas sin exponer fechas ni horas
- Preparar catálogo, compras, equipamiento y recompensas para incorporar nuevos artículos próximamente

## Reglas del plan

- Usar `X` y `O` como valores internos; en textos visibles utilizar la traducción apropiada para cada idioma.
- Mantener rojo para `X` y azul para `O` desbloqueados desde la primera instalación.
- Comprar cada color una sola vez y habilitarlo para cualquiera de las dos fichas, sin exigir una compra separada para `X` y `O`.
- No permitir equipar el mismo color simultáneamente en `X` y `O`.
- Si el usuario elige para una ficha el color equipado en la otra, intercambiar automáticamente los colores de ambas fichas.
- Comprar un color no debe equiparlo automáticamente; debe quedar disponible en el Inventario.
- Aplicar los colores equipados al modo contra NEXUS y al multijugador local.
- Mantener que en multijugador siempre comienza `X`.
- La ficha preferida elegida en Inventario solo afecta al modo contra NEXUS.
- Reutilizar la preferencia `ficha_usuario_ia` para que el selector actual y el Inventario nunca se contradigan.
- Reiniciar regalo diario y anuncios disponibles a las `00:00` según la fecha local del dispositivo.
- Aplicar una protección horaria local sencilla, sin prometer seguridad absoluta sin servidor.
- Entregar los 15 puntos únicamente después de que AdMob confirme la recompensa.
- No entregar puntos si el anuncio falla, no carga o se cierra antes de obtener la recompensa.
- Guardar fecha y hora de los movimientos para control interno, pero no mostrarlas en Estadísticas.
- No crear estadísticas por color equipado ni por partidas jugadas con cada color.
- Mostrar las estadísticas económicas como datos globales; los filtros de dificultad y ficha solo deben afectar las estadísticas de partidas.
- Mostrar recompensas pendientes y estadísticas económicas aunque todavía no existan partidas contra NEXUS.
- Todo texto visible debe existir con la misma estructura de claves en los diez idiomas habilitados.
- Agregar colores únicamente como variables de `src/css/Variables.css` y mantener el CSS compacto.
- No ejecutar commit, tag ni push como parte de este plan.

## Configuración de AdMob confirmada

- ID de aplicación Android: `ca-app-pub-7620083100302566~5749295943`
- ID de producción del anuncio recompensado: `ca-app-pub-7620083100302566/4478872457`
- ID oficial de prueba Android: `ca-app-pub-3940256099942544/5224354917`
- Recompensa configurada en AdMob: `15 Puntos`
- Nombre administrativo recomendado de la unidad: `Videos recompensados`
- Formato: anuncio `Recompensado`, no intersticial recompensado
- El ID general de aplicación ya está configurado en `src-capacitor/android/app/src/main/AndroidManifest.xml`; no duplicarlo ni reemplazarlo durante esta implementación
- `ConfiguracionPublicidad.js` debe mantener ambos IDs dentro de `idsPublicidadPrueba` e `idsPublicidadProduccion`
- `esModoPruebaPublicidad = true` debe seleccionar automáticamente el ID recompensado oficial de prueba
- `esModoPruebaPublicidad = false` debe seleccionar automáticamente el ID recompensado de producción
- Tienda, composables y páginas deben consumir únicamente `idsPublicidad.recompensado`, sin IDs escritos directamente

## FASE 1: Definir contratos de economía y catálogo

### Objetivo

Crear modelos centrales reutilizables antes de construir las páginas.

- [ ] Crear un catálogo central de artículos con identificador estable, tipo, nombre traducible, precio, variable CSS, estado inicial y orden visual
- [ ] Separar claramente catálogo, propiedad de artículos, equipamiento, recompensas y movimientos de puntos
- [ ] Definir tipos de movimiento: partida, regalo diario, anuncio recompensado, compra y bonificación
- [ ] Reservar el tipo `ajusteInicial` para migración y excluirlo de puntos ganados, gastados y recompensas
- [ ] Permitir un identificador de artículo opcional en movimientos de compra para relacionar el gasto con el artículo adquirido
- [ ] Definir identificadores de origen únicos para impedir que una partida, anuncio, regalo o compra se procese dos veces
- [ ] Usar `partida:{id}`, `regalo:{fechaLocal}`, `anuncio:{idOperacion}` y `compra:{idOperacion}` como contratos de origen
- [ ] Mantener precios y recompensas en configuración central y no dispersarlos por componentes visuales
- [ ] Documentar el contrato real de almacenamiento y las reglas de compatibilidad

## FASE 2: Ampliar la persistencia económica

### Objetivo

Registrar saldo, movimientos, compras, equipamiento y recompensas de forma consistente y migrable.

- [ ] Incrementar `VERSION_BASE_ESTADISTICAS` de 1 a 2 y agregar una migración `toVersion: 2` sin modificar la versión 1 publicada
- [ ] Crear `MovimientosEconomicos` con ID, tipo, cantidad firmada, saldo resultante, origen único, artículo opcional, fecha UTC y fecha local
- [ ] Crear `EstadoEconomia` para conservar el saldo autoritativo y la versión de migración
- [ ] Crear `EstadoPuntuacionDificultad` para racha, derrotas consecutivas, protección y sus datos por dificultad
- [ ] Crear `ArticulosAdquiridos` con identificador de artículo y fecha de adquisición
- [ ] Crear `EquipamientoFichas` con una única configuración persistida para `X` y `O`
- [ ] Crear `EstadoRecompensas` para regalo, anuncios consumidos, última hora válida y bloqueo horario
- [ ] Agregar índices para tipo, fecha y origen de los movimientos
- [ ] Leer una sola vez el objeto completo `puntuacion_sistema` para migrar saldo, rachas y protección sin perder datos
- [ ] Reconstruir en orden cronológico los movimientos conocidos de `Partidas` usando `partida:{id}` y excluyendo abandonos
- [ ] Insertar antes de esos movimientos un único `ajusteInicial` por la diferencia necesaria para que el saldo final reconstruido coincida exactamente con el saldo actual
- [ ] Excluir `ajusteInicial` de estadísticas de puntos ganados, gastados y obtenidos jugando
- [ ] No volver a importar partidas ni crear otro ajuste inicial después de completar la migración
- [ ] Establecer `EstadoEconomia` y `EstadoPuntuacionDificultad` en SQLite como fuentes únicas de saldo, rachas y protección
- [ ] Mantener el objeto completo `puntuacion_sistema` únicamente como espejo de compatibilidad y recuperación
- [ ] Inicializar la base económica desde `MainLayout.vue` antes de mostrar el saldo definitivo
- [ ] Si SQLite falla, mantener visible el último saldo espejo y deshabilitar compras y recompensas hasta recuperar la base
- [ ] Permitir que las partidas sigan funcionando durante una falla de SQLite mediante una cola `movimientos_economicos_pendientes` en Preferences que incluya movimiento y estado posterior de la dificultad
- [ ] Reprocesar esa cola de forma idempotente al recuperar SQLite y eliminar cada pendiente solo después de confirmar su movimiento
- [ ] Serializar operaciones económicas para evitar compras o recompensas simultáneas
- [ ] Hacer idempotentes regalo, anuncio, compra y registro de puntos de partida
- [ ] Recuperar de forma segura una operación interrumpida sin entregar dos veces ni descontar sin otorgar el artículo

## FASE 3: Centralizar operaciones de puntos

### Objetivo

Evitar que páginas y componentes modifiquen el puntaje directamente.

- [ ] Exponer operaciones para acreditar, gastar, consultar saldo y validar fondos
- [ ] Separar en `usePuntuacion` el cálculo del resultado de la persistencia definitiva del saldo
- [ ] Adaptar `RegistroPartida.finalizar()` para guardar la partida, su movimiento económico, el nuevo saldo y el estado posterior de racha y protección dentro de la misma transacción SQLite
- [ ] Relacionar el movimiento con el ID real de `RegistroPartida` antes de finalizar la partida
- [ ] Sincronizar rachas, protección, saldo reactivo y espejo completo de Preferences solamente después de confirmar la transacción
- [ ] Mantener las reglas actuales de rachas, derrotas y protección
- [ ] Preservar el mínimo de puntuación definido actualmente por el juego al procesar derrotas
- [ ] Permitir que una compra deje el saldo exactamente en cero, pero nunca en negativo
- [ ] No aplicar a las compras el mínimo protegido usado por las derrotas
- [ ] Permitir compras solo cuando el artículo no esté adquirido y el saldo alcance
- [ ] Descontar puntos y entregar el artículo como una única operación lógica
- [ ] Actualizar inmediatamente el saldo del header después de partidas, regalos, anuncios y compras
- [ ] Preparar mensajes claros para fondos insuficientes, artículo comprado y errores de persistencia

## FASE 4: Implementar recompensas diarias

### Objetivo

Ofrecer recompensas comprensibles con renovación diaria local y protección básica ante cambios del reloj.

- [ ] Crear un composable o servicio único para el regalo diario y los anuncios disponibles
- [ ] Entregar 10 puntos una sola vez por día local mediante el regalo
- [ ] Permitir como máximo 3 anuncios recompensados por día local
- [ ] Entregar 15 puntos por cada anuncio confirmado
- [ ] Renovar regalo y cupo de anuncios a las `00:00` locales
- [ ] Guardar la última fecha y hora válidas observadas
- [ ] Tolerar diferencias menores de hasta 5 minutos para evitar bloqueos por ajustes normales del reloj
- [ ] Detectar retrocesos superiores a 5 minutos y bloquear temporalmente las recompensas
- [ ] Si el reloj se adelanta, impedir nuevas recompensas hasta alcanzar la fecha futura ya registrada
- [ ] Mantener el último día local reclamado como referencia para que un cambio de zona horaria no entregue dos regalos en la misma fecha registrada
- [ ] Mostrar un mensaje simple cuando exista un bloqueo horario, sin presentar el sistema como infalible
- [ ] Recalcular disponibilidad al iniciar la app, volver desde segundo plano y regresar a Tienda o Estadísticas
- [ ] Registrar una única suscripción singleton de recompensas a `App.addListener('appStateChange')` y no duplicarla por página
- [ ] Evitar temporizadores permanentes innecesarios; calcular el estado desde los datos persistidos

## FASE 5: Integrar anuncios recompensados

### Objetivo

Extender la configuración central de AdMob y controlar correctamente el ciclo del anuncio.

- [ ] Agregar `recompensado` a los IDs de prueba y producción de `ConfiguracionPublicidad.js`
- [ ] Verificar que `AndroidManifest.xml` conserve el ID general `ca-app-pub-7620083100302566~5749295943`
- [ ] Dejar el ID oficial de prueba en `idsPublicidadPrueba.recompensado`
- [ ] Dejar `ca-app-pub-7620083100302566/4478872457` en `idsPublicidadProduccion.recompensado`
- [ ] Confirmar que el objeto exportado `idsPublicidad` cambie también el anuncio recompensado usando únicamente `esModoPruebaPublicidad`
- [ ] Usar el ID oficial de prueba cuando `esModoPruebaPublicidad` sea `true`
- [ ] Usar `ca-app-pub-7620083100302566/4478872457` cuando el modo de producción esté activo
- [ ] Consumir `idsPublicidad.recompensado` desde `usePublicidad.js` sin duplicar IDs en Tienda ni en otros archivos
- [ ] Extender `usePublicidad.js` con preparación, carga, visualización, eventos y limpieza del anuncio recompensado
- [ ] No volver a inicializar AdMob desde la Tienda; reutilizar la inicialización singleton realizada por `MainLayout.vue`
- [ ] Preparar el anuncio antes de habilitar el botón cuando sea razonable
- [ ] Diferenciar estados cargando, disponible, mostrando, sin disponibilidad y error
- [ ] Bloquear pulsaciones repetidas mientras el anuncio se prepara o muestra
- [ ] Usar el valor resuelto por `showRewardVideoAd()` como única confirmación para acreditar y no acreditar también desde el evento `Rewarded`
- [ ] Usar los eventos para estado visual y diagnóstico, no como una segunda vía de acreditación
- [ ] Entregar los 15 puntos configurados por la app después de la confirmación; usar `rewardItem.amount` solo como dato de diagnóstico para no romper el ID oficial de prueba
- [ ] Acreditar una sola vez después de validar la confirmación y generar un origen económico único
- [ ] No usar el evento de cierre como prueba de que el usuario obtuvo la recompensa
- [ ] Limpiar listeners para evitar acreditaciones duplicadas al entrar varias veces a la Tienda
- [ ] Mantener el banner global y los intersticiales actuales sin regresiones

## FASE 6: Crear la página Tienda

### Objetivo

Construir una página atractiva que destaque recompensas, saldo y artículos disponibles.

- [ ] Crear `TiendaPage.vue` y registrar la ruta `/tienda`
- [ ] Agregar Tienda al drawer inmediatamente debajo de Multijugador
- [ ] Convertir todo el chip de puntos del header en un botón accesible que navegue a `/tienda`
- [ ] Mantener el chip del nombre navegando a Configuración
- [ ] Mostrar el saldo actual en la cabecera de la Tienda
- [ ] Crear una tarjeta destacada para reclamar 10 puntos diarios
- [ ] Mostrar cuándo el regalo ya fue reclamado y que volverá a estar disponible al día siguiente
- [ ] Crear una tarjeta para anuncios que indique cuántos quedan, por ejemplo `2 de 3`
- [ ] Deshabilitar la tarjeta cuando no queden anuncios o no exista uno cargado
- [ ] Mostrar una cuadrícula reutilizable de artículos con vista previa real de `X` y `O`
- [ ] Mostrar estados `Comprar`, `Comprado`, `Equipado` y `No te alcanzan los puntos`
- [ ] Pedir confirmación antes de descontar puntos
- [ ] Después de comprar, mantener el equipamiento actual y ofrecer la acción `Ir al Inventario`
- [ ] Incluir un acceso visible al Inventario
- [ ] Aceptar una marca de navegación para resaltar temporalmente la tarjeta de regalo o anuncios
- [ ] Respetar header, banner, zonas seguras, teléfono angosto, tablet y orientación horizontal

## FASE 7: Crear catálogo inicial de colores

### Objetivo

Incorporar artículos visuales diferenciables sobre el fondo actual.

- [ ] Mantener rojo y azul como colores gratuitos y adquiridos inicialmente
- [ ] Agregar amarillo, verde, naranja, magenta, turquesa y blanco brillante
- [ ] Definir todas las tonalidades y efectos de línea ganadora en `Variables.css`
- [ ] Reutilizar variables existentes cuando representen exactamente el mismo color
- [ ] Verificar contraste en fichas, nombres de turno, selectores, resultados y líneas ganadoras
- [ ] Usar precios iniciales de 60 puntos para amarillo, verde y naranja
- [ ] Usar precios iniciales de 90 puntos para magenta y turquesa
- [ ] Usar un precio inicial de 120 puntos para blanco brillante
- [ ] Mantener precios desacoplados de los componentes para poder balancearlos después
- [ ] Tratar los colores del catálogo como identificadores estables y no persistir valores hexadecimales en el Inventario

## FASE 8: Crear la página Inventario

### Objetivo

Permitir revisar artículos adquiridos y configurar la apariencia y ficha preferida.

- [ ] Crear `InventarioPage.vue` y registrar la ruta `/inventario`
- [ ] Agregar Inventario al drawer junto a Tienda
- [ ] Ubicar Inventario inmediatamente debajo de Tienda y antes del separador que antecede a Estadísticas
- [ ] Mostrar solamente artículos adquiridos y los colores predeterminados
- [ ] Separar visualmente el equipamiento de `X`, el equipamiento de `O` y la ficha preferida contra NEXUS
- [ ] Permitir seleccionar un color comprado para `X`
- [ ] Permitir seleccionar un color comprado para `O`
- [ ] Si el color elegido ya está equipado en la otra ficha, intercambiar automáticamente ambos colores
- [ ] Guardar el intercambio de `X` y `O` como una única operación para no dejar colores duplicados ante un error
- [ ] Informar brevemente al usuario que los colores fueron intercambiados
- [ ] Mostrar una vista previa conjunta antes o después de equipar
- [ ] Permitir elegir `X` u `O` como ficha preferida contra NEXUS
- [ ] Reutilizar `UseFichaJugador.js` y `ficha_usuario_ia`
- [ ] Reflejar inmediatamente cambios hechos desde el selector actual del juego
- [ ] Reflejar inmediatamente en el selector actual los cambios hechos desde Inventario
- [ ] Conservar la configuración al cerrar y volver a abrir la app

## FASE 9: Aplicar el equipamiento al juego

### Objetivo

Reemplazar los colores fijos por equipamiento reactivo sin alterar las reglas del Ta-Te-Ti.

- [ ] Crear una fuente reactiva única para obtener el color equipado de cada ficha
- [ ] Aplicar desde esa fuente variables CSS dinámicas para color, neón y brillo de `X` y `O`
- [ ] Adaptar `CeldaTaTeTi.vue` para usar el color equipado de `X` y `O`
- [ ] Adaptar la línea ganadora para usar el color equipado correspondiente
- [ ] Adaptar `InfoJuego.vue`, el selector de ficha y los resultados
- [ ] Revisar cualquier otro lugar que represente `X` u `O` con rojo o azul fijos
- [ ] Incluir `ModalResultado.vue`, `JugarContraIA.vue`, `EstadisticasPage.vue` y `BarraFiltrosEstadisticas.vue` en esa revisión
- [ ] Mantener los colores asociados a la ficha y no al jugador
- [ ] Aplicar la misma configuración en juego contra NEXUS y multijugador
- [ ] No modificar turno inicial, IA, Minimax ni reglas de victoria

## FASE 10: Agregar accesos contextuales desde Estadísticas

### Objetivo

Recordar recompensas pendientes sin ocupar espacio cuando ya fueron consumidas.

- [ ] Mostrar un botón pequeño de regalo únicamente cuando el regalo diario esté disponible
- [ ] Mostrar un botón pequeño de anuncios mientras quede al menos uno de los tres diarios
- [ ] Indicar en el botón cuántos anuncios quedan disponibles
- [ ] Ocultar completamente cada acceso cuando su disponibilidad llegue a cero
- [ ] Navegar desde cada botón a la Tienda con una marca que identifique la sección objetivo
- [ ] Hacer parpadear o resaltar temporalmente la tarjeta correspondiente al llegar
- [ ] Evitar animaciones continuas y respetar `prefers-reduced-motion`
- [ ] Actualizar los botones al volver de la Tienda sin recargar la aplicación
- [ ] Mostrar estos accesos también en el estado sin partidas de `EstadisticasPage.vue`
- [ ] Ubicar los accesos debajo del título y subtítulo de Estadísticas, en una fila compacta y adaptable

## FASE 11: Ampliar las estadísticas económicas

### Objetivo

Mostrar datos útiles de puntos y recompensas sin añadir detalles innecesarios.

- [ ] Agregar consultas agregadas sobre la tabla de movimientos económicos
- [ ] Consultar los datos económicos sin aplicar filtros de dificultad ni ficha
- [ ] Mantener el panel actual de rendimiento de puntos de partidas sujeto a los filtros de dificultad y ficha
- [ ] Crear un panel global independiente llamado Economía
- [ ] Mostrar puntos totales ganados excluyendo `ajusteInicial` y movimientos negativos
- [ ] Mostrar puntos gastados únicamente en compras, sin mezclar derrotas ni otras variaciones negativas
- [ ] Mostrar puntos obtenidos jugando
- [ ] Mostrar puntos recibidos mediante anuncios recompensados
- [ ] Mostrar puntos recibidos mediante regalos diarios
- [ ] Mostrar cantidad de anuncios completados
- [ ] Mostrar cantidad de regalos diarios reclamados
- [ ] Mostrar cantidad de artículos comprados
- [ ] Mantener saldo actual y máximo histórico correctamente calculados
- [ ] Mostrar la evolución económica completa usando los saldos de `MovimientosEconomicos`
- [ ] Mantener los puntos perdidos jugando dentro del panel de rendimiento de partidas y no llamarlos puntos gastados
- [ ] No mostrar fecha ni hora de movimientos
- [ ] No mostrar estadísticas por color comprado, equipado o utilizado
- [ ] No duplicar puntos de partidas entre `Partidas` y movimientos migrados
- [ ] Integrar los datos en la página actual manteniendo filtros y paneles existentes
- [ ] Separar el estado `sin partidas` del estado `sin economía` para que las recompensas y métricas económicas sigan visibles
- [ ] Explicar cada métrica con textos breves y no técnicos

## FASE 12: Traducciones, accesibilidad y documentación

### Objetivo

Cerrar la funcionalidad con textos completos y contratos mantenibles.

- [ ] Agregar las nuevas claves a español, inglés, portugués, francés, italiano, alemán, japonés, coreano, sueco y noruego
- [ ] Mantener idéntica estructura de claves en todos los idiomas
- [ ] Traducir Tienda, Inventario, recompensas, compras, equipamiento, bloqueos y estadísticas
- [ ] Agregar etiquetas accesibles a chips, botones, tarjetas y selectores
- [ ] Verificar navegación por teclado, foco visible y estados deshabilitados
- [ ] Actualizar `ContratoEstadisticas.md` con la migración y los movimientos económicos
- [ ] Actualizar los resúmenes relevantes después de terminar la implementación
- [ ] Documentar cómo agregar un nuevo artículo sin modificar la lógica de compra o equipamiento

## FASE TESTING

### Objetivo

Validar la economía, anuncios, persistencia, navegación y apariencia en escenarios reales y de error.

- [ ] Ejecutar ESLint, validación de idiomas, pruebas automatizadas y compilación Android
- [ ] Agregar pruebas automáticas de migración de base versión 1 a versión 2
- [ ] Agregar pruebas para catálogo, compras, fondos insuficientes e intentos de compra duplicada
- [ ] Probar migración desde una instalación con puntos, rachas y estadísticas existentes
- [ ] Confirmar que movimientos reconstruidos más `ajusteInicial` producen exactamente el saldo previo
- [ ] Confirmar que abrir nuevamente la versión migrada no repite partidas ni ajustes
- [ ] Verificar que una partida acredita o descuenta puntos una sola vez
- [ ] Reclamar el regalo, reiniciar la app y confirmar que no pueda repetirse el mismo día
- [ ] Simular el cambio de día local y confirmar la renovación a las `00:00`
- [ ] Completar tres anuncios y comprobar que el cuarto queda bloqueado
- [ ] Cerrar un anuncio antes de la recompensa y confirmar que no suma puntos ni consume cupo
- [ ] Simular fallo de carga y falta de inventario publicitario sin bloquear la Tienda
- [ ] Verificar que cada recompensa se acredite una sola vez aunque se repitan eventos
- [ ] Probar retroceso y adelanto del reloj y comprobar el bloqueo local previsto
- [ ] Comprar cada color, reiniciar la app y comprobar propiedad, saldo e historial
- [ ] Confirmar que comprar un color no modifica el equipamiento actual
- [ ] Equipar colores distintos en `X` y `O` y comprobar que no se admita duplicarlos
- [ ] Elegir el color de la otra ficha y comprobar el intercambio automático y persistente
- [ ] Cambiar la ficha preferida desde el juego y comprobar la actualización del Inventario
- [ ] Cambiar la ficha preferida desde Inventario y comprobar la actualización del juego
- [ ] Verificar colores en celdas, turnos, selector, resultado y línea ganadora
- [ ] Probar contra NEXUS y multijugador sin alterar reglas ni turnos
- [ ] Verificar accesos de Estadísticas con regalo disponible, entre uno y tres anuncios y disponibilidad cero
- [ ] Confirmar navegación y resaltado correcto de cada tarjeta de la Tienda
- [ ] Verificar que Estadísticas no muestre fechas, horas ni métricas por color
- [ ] Verificar que los filtros de dificultad y ficha no alteren las métricas económicas
- [ ] Verificar recompensas y estadísticas económicas en una instalación sin partidas
- [ ] Confirmar que los totales económicos no dupliquen puntos de partidas históricas
- [ ] Probar los diez idiomas, textos largos y cambios de idioma en tiempo de ejecución
- [ ] Probar teléfono angosto, pantalla baja, tablet, vertical y horizontal
- [ ] Probar navegación Android por gestos y tres botones con banner visible, oculto y fallido
- [ ] Validar anuncios exclusivamente con el ID oficial de prueba antes de usar producción
- [ ] Ejecutar una prueba con `esModoPruebaPublicidad = true` y verificar que se solicita `ca-app-pub-3940256099942544/5224354917`
- [ ] Ejecutar la validación de configuración con `esModoPruebaPublicidad = false` y verificar que queda seleccionado `ca-app-pub-7620083100302566/4478872457`
- [ ] Realizar una prueba final en dispositivo Android real

## Progreso del plan

- [ ] Fase 1: Definir contratos de economía y catálogo
- [ ] Fase 2: Ampliar la persistencia económica
- [ ] Fase 3: Centralizar operaciones de puntos
- [ ] Fase 4: Implementar recompensas diarias
- [ ] Fase 5: Integrar anuncios recompensados
- [ ] Fase 6: Crear la página Tienda
- [ ] Fase 7: Crear catálogo inicial de colores
- [ ] Fase 8: Crear la página Inventario
- [ ] Fase 9: Aplicar el equipamiento al juego
- [ ] Fase 10: Agregar accesos contextuales desde Estadísticas
- [ ] Fase 11: Ampliar las estadísticas económicas
- [ ] Fase 12: Traducciones, accesibilidad y documentación
- [ ] Fase Testing

Fecha de creación: 14 de Junio 2026
Fecha de última actualización: 15 de Junio 2026
Estado: BORRADOR
