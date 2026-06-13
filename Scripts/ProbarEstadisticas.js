import initSqlJs from 'sql.js'
import { MIGRACIONES_ESTADISTICAS } from '../src/Servicios/Estadisticas/EsquemaEstadisticas.js'

const CANTIDAD_PARTIDAS = 5000
const SQL = await initSqlJs()
const base = new SQL.Database()

for (const migracion of MIGRACIONES_ESTADISTICAS) {
  for (const sentencia of migracion.statements) base.run(sentencia)
}

const insertar = base.prepare(`
  INSERT INTO Partidas (
    id, fechaInicio, fechaFin, fechaLocal, horaLocal, resultado, motivoAbandono,
    dificultad, fichaUsuario, fichaIA, duracionMs, tiempoPausadoMs,
    movimientosUsuario, movimientosIA, puntosIniciales, variacionPuntos,
    puntosFinales, rachaAntes, rachaDespues, derrotasAntes, derrotasDespues,
    proteccionAntes, proteccionDespues, activoProteccion, derrotaProtegida,
    desactivoProteccion, partidasParaDesactivarProteccion, duracionProteccionMs,
    inicioRachaNegativa, recuperacionRachaNegativa, resultadoMinimosMovimientos,
    usuarioEstuvoAUnaJugada, iaEstuvoAUnaJugada, recuperacionAnteAmenaza,
    tipoLineaGanadora, combinacionGanadora, versionApp, versionEsquema
  ) VALUES (${Array(38).fill('?').join(', ')})
`)

const inicioInsercion = performance.now()
base.run('BEGIN TRANSACTION')
for (let indice = 0; indice < CANTIDAD_PARTIDAS; indice += 1) {
  const resultado = ['victoria', 'derrota', 'empate', 'abandono'][indice % 4]
  const dificultad = ['facil', 'normal', 'dificil'][indice % 3]
  const fecha = new Date(Date.UTC(2026, 0, 1, 0, indice)).toISOString()
  insertar.run([
    `prueba-${indice}`,
    fecha,
    fecha,
    fecha.slice(0, 10),
    indice % 24,
    resultado,
    resultado === 'abandono' ? 'reinicio' : null,
    dificultad,
    indice % 2 ? 'X' : 'O',
    indice % 2 ? 'O' : 'X',
    5000 + indice,
    0,
    3,
    3,
    10,
    resultado === 'victoria' ? 5 : 0,
    15,
    0,
    resultado === 'victoria' ? 1 : 0,
    0,
    resultado === 'derrota' ? 1 : 0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    resultado === 'victoria' || resultado === 'derrota' ? 1 : 0,
    0,
    0,
    0,
    resultado === 'victoria' ? 'fila' : null,
    resultado === 'victoria' ? '0,1,2' : null,
    'prueba',
    1,
  ])
}
base.run('COMMIT')
insertar.free()

const inicioConsulta = performance.now()
const consulta = base.exec(`
  SELECT dificultad, COUNT(*) AS partidas,
    SUM(CASE WHEN resultado = 'victoria' THEN 1 ELSE 0 END) AS victorias,
    AVG(duracionMs) AS duracionPromedio
  FROM Partidas
  GROUP BY dificultad
`)

const duracionInsercion = Math.round(performance.now() - inicioInsercion)
const duracionConsulta = Math.round(performance.now() - inicioConsulta)
const cantidadGuardada = base.exec('SELECT COUNT(*) AS cantidad FROM Partidas')[0].values[0][0]

if (cantidadGuardada !== CANTIDAD_PARTIDAS || consulta.length !== 1) {
  throw new Error('La prueba de estadísticas no produjo los resultados esperados.')
}

console.log(
  `Prueba SQLite correcta: ${cantidadGuardada} partidas, inserción ${duracionInsercion} ms, consulta ${duracionConsulta} ms.`,
)
