# Resumen del sistema de estadísticas

> Vigencia: 14 de junio de 2026. Registra únicamente partidas contra la IA NEXUS.

## Propósito

El módulo conserva todas las partidas y turnos en SQLite y presenta métricas agregadas sin cargar el historial completo en memoria. Los datos son exactos desde la creación de la base; no se inventan partidas anteriores.

## Archivos principales

- `src/pages/EstadisticasPage.vue`: coordina carga, filtros y paneles.
- `src/components/Estadisticas/BarraFiltrosEstadisticas.vue`: barra sticky con chips.
- `src/components/Estadisticas/EncabezadoPanelEstadistica.vue`: títulos y explicaciones desplegables.
- `src/Servicios/Estadisticas/RegistroPartida.js`: ciclo y persistencia de partidas.
- `src/Servicios/Estadisticas/ConsultasEstadisticas.js`: agregaciones SQL.
- `src/Servicios/Estadisticas/ContratoEstadisticas.md`: contrato de datos y migraciones.

## Persistencia

- Base: `EstadisticasTaTeTi`, esquema inicial versión `1`.
- Tablas: `Metadatos`, `Partidas` y `Turnos`.
- Android usa SQLite nativo; navegador usa `jeep-sqlite` e IndexedDB.
- Las partidas y sus turnos se guardan en una transacción.
- Una partida comienza con la primera jugada válida.
- Reiniciar, cambiar dificultad o salir con tablero iniciado registra abandono.
- Los abandonos no cuentan como derrotas ni modifican puntuación o rachas.
- No existe limpieza automática, límite de historial ni botón de reinicio.

## Interfaz actual

- La cabecera muestra `Estadísticas` y `Revisa tu rendimiento y progreso`; no muestra fechas.
- La barra de filtros aparece debajo de la cabecera y queda fija bajo el header al desplazarse.
- Solo se muestran filtros por dificultad (`Todos`, `Fácil`, `Normal`, `Difícil`) y ficha (`Todas`, `X`, `O`).
- Los filtros usan chips de selección única y degradado violeta-amarillo para el activo; `X` roja y `O` azul cuando no están seleccionadas.
- Los rótulos Dificultad y Ficha están ocultos visualmente, pero se conservan en `legend` para accesibilidad.
- Al salir y volver a la página, los filtros regresan a `Todos/Todas`.
- Período, resultado, rango de fechas y horarios activos no se muestran, aunque los datos y consultas se conservan.
- No existe botón manual para actualizar: la página carga al entrar y vuelve a consultar al cambiar un chip.

## Paneles visibles

- Resumen: partidas, victorias, empates, derrotas, abandonos y porcentaje de victorias.
- Resultados: gráfica circular ordenada como victoria, empate y derrota.
- Rendimiento por dificultad.
- Evolución, balance y máximo de puntos.
- Resultados desplegables por ficha con porcentaje, victorias, empates y derrotas.
- Tiempos de partida y turno, ordenados por dificultad y resultado.
- Rachas positivas, negativas y recuperaciones.
- Activaciones y duración del escudo.
- Movimientos, victorias mínimas, derrotas rápidas y oportunidades.
- Uso del tablero: posiciones utilizadas y líneas ganadoras dentro de un único panel.

Cada panel principal incluye una explicación de una línea, cerrada por defecto y ampliable mediante un chevrón independiente. Los títulos son compactos y las tarjetas usan `min-width: 0` para evitar desbordamientos móviles.

## Reglas que no deben romperse

- Mantener SQLite y las consultas fuera de los componentes visuales.
- No borrar columnas ni modificar migraciones publicadas; agregar una migración nueva.
- No añadir controles para borrar o reiniciar el historial.
- No contar abandonos como derrotas.
- Mantener textos, pluralización y formatos numéricos en todos los idiomas habilitados.
- Usar únicamente colores de `src/css/Variables.css`.
- Conservar el orden visual victoria, empate y derrota.
- Probar chips y paneles en celular, tablet y escritorio.

## Validación realizada

- ESLint y compilaciones SPA y Android completadas.
- Barra sticky comprobada a `50px` bajo el header.
- Cuatro chips de dificultad verificados en una fila móvil sin desbordamiento.
- Filtros, estado sin datos y reinicio a `Todos/Todas` verificados en navegador.
- APK debug instalado y abierto en un dispositivo Android real.
- Recorrido funcional realizado en los seis idiomas, con números, porcentajes, duraciones y resúmenes adaptados al idioma activo.
