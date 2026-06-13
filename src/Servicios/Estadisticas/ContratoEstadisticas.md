# Contrato de estadísticas

## Alcance

El sistema registra únicamente partidas contra la IA. Los datos comienzan a ser exactos desde la creación de la base SQLite y no intentan inventar partidas anteriores.

## Persistencia

- Base: `EstadisticasTaTeTi`
- Versión inicial: `1`
- Plataforma nativa: SQLite mediante `@capacitor-community/sqlite`
- Plataforma web: SQLite en IndexedDB mediante `jeep-sqlite`
- Tablas: `Metadatos`, `Partidas` y `Turnos`
- Las escrituras se ejecutan en una cola serial y las partidas se guardan con sus turnos dentro de una transacción
- No existe limpieza automática ni opción para borrar el historial

## Ciclo de una partida

1. La sesión comienza con la primera jugada válida del usuario.
2. Cada turno registra participante, ficha, posición, fechas y duración.
3. El tiempo en segundo plano se descuenta de la duración de la partida.
4. La espera artificial de la IA no forma parte del tiempo de decisión del usuario.
5. La sesión termina como victoria, derrota, empate o abandono.
6. Un tablero vacío nunca genera abandono.
7. Reiniciar, cambiar dificultad o salir con un tablero iniciado genera un abandono.
8. Los abandonos no modifican puntuación, rachas ni derrotas.

## Recuperación

La sesión activa se refleja en Capacitor Preferences después de cada turno. Si la aplicación se cierra antes de terminar, la próxima inicialización registra esa sesión como abandono con motivo `cierreApp`.

## Rachas y escudo

- Las derrotas consecutivas se cuentan desde la primera derrota.
- Una racha negativa comienza cuando se alcanza la segunda derrota consecutiva.
- Una victoria después de dos o más derrotas cuenta como recuperación.
- Se registra activación del escudo, derrotas protegidas, cantidad de partidas bajo protección y tiempo hasta desactivarlo.

## Migraciones

Cada cambio de estructura debe agregar una entrada nueva a `MIGRACIONES_ESTADISTICAS` con un `toVersion` superior. No se deben modificar migraciones ya publicadas ni eliminar columnas con datos históricos sin una migración explícita.

## Respaldo futuro

El respaldo y la restauración quedan fuera de este plan. Si se incorporan, deben usar exportación transaccional de SQLite, validar la versión del esquema y nunca sobrescribir una base existente sin confirmación explícita.
