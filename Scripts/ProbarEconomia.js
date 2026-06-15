import assert from 'node:assert/strict'
import initSqlJs from 'sql.js'
import {
  catalogoColores,
  MAXIMO_ANUNCIOS_DIARIOS,
  RECOMPENSA_ANUNCIO,
  RECOMPENSA_DIARIA,
} from '../src/Servicios/Economia/CatalogoTienda.js'
import {
  MIGRACIONES_ESTADISTICAS,
  VERSION_BASE_ESTADISTICAS,
} from '../src/Servicios/Estadisticas/EsquemaEstadisticas.js'

assert.equal(VERSION_BASE_ESTADISTICAS, 2)
assert.equal(RECOMPENSA_DIARIA, 10)
assert.equal(RECOMPENSA_ANUNCIO, 15)
assert.equal(MAXIMO_ANUNCIOS_DIARIOS, 3)
assert.deepEqual(
  catalogoColores.filter((articulo) => articulo.inicial).map((articulo) => articulo.id),
  ['rojo', 'azul'],
)
assert.equal(new Set(catalogoColores.map((articulo) => articulo.id)).size, catalogoColores.length)
assert.ok(catalogoColores.every((articulo) => articulo.variable.startsWith('--color-catalogo-')))

const SQL = await initSqlJs()
const base = new SQL.Database()
for (const migracion of MIGRACIONES_ESTADISTICAS) {
  for (const sentencia of migracion.statements) base.run(sentencia)
}

const tablas = base
  .exec(`SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name`)[0]
  .values.flat()
for (const tabla of [
  'MovimientosEconomicos',
  'EstadoEconomia',
  'EstadoPuntuacionDificultad',
  'ArticulosAdquiridos',
  'EquipamientoFichas',
  'EstadoRecompensas',
]) {
  assert.ok(tablas.includes(tabla), `Falta la tabla ${tabla}.`)
}

base.run(
  `INSERT INTO MovimientosEconomicos
    (id, tipo, cantidad, saldoResultante, origen, articuloId, fechaUtc, fechaLocal)
  VALUES ('1', 'regaloDiario', 10, 10, 'regalo:2026-06-15', NULL, ?, '2026-06-15')`,
  [new Date().toISOString()],
)
assert.throws(
  () =>
    base.run(
      `INSERT INTO MovimientosEconomicos
        (id, tipo, cantidad, saldoResultante, origen, articuloId, fechaUtc, fechaLocal)
      VALUES ('2', 'regaloDiario', 10, 20, 'regalo:2026-06-15', NULL, ?, '2026-06-15')`,
      [new Date().toISOString()],
    ),
  /UNIQUE constraint failed/,
)

console.log('Catálogo, configuración y migración económica validados.')

