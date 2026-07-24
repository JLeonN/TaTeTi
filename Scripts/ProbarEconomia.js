import assert from 'node:assert/strict'
import initSqlJs from 'sql.js'
import {
  catalogoArticulos,
  catalogoColores,
  catalogoSimbolos,
  MAXIMO_ANUNCIOS_DIARIOS,
  RECOMPENSA_ANUNCIO,
  RECOMPENSA_DIARIA,
} from '../src/Servicios/Economia/CatalogoTienda.js'
import {
  MIGRACIONES_ESTADISTICAS,
  VERSION_BASE_ESTADISTICAS,
} from '../src/Servicios/Estadisticas/EsquemaEstadisticas.js'

assert.equal(VERSION_BASE_ESTADISTICAS, 3)
assert.equal(RECOMPENSA_DIARIA, 10)
assert.equal(RECOMPENSA_ANUNCIO, 15)
assert.equal(MAXIMO_ANUNCIOS_DIARIOS, 3)
assert.deepEqual(
  catalogoColores.filter((articulo) => articulo.inicial).map((articulo) => articulo.id),
  ['rojo', 'azul'],
)
assert.equal(new Set(catalogoColores.map((articulo) => articulo.id)).size, catalogoColores.length)
assert.ok(catalogoColores.every((articulo) => articulo.variable.startsWith('--color-catalogo-')))
assert.deepEqual(
  catalogoSimbolos.filter((articulo) => articulo.inicial).map((articulo) => articulo.id),
  ['simboloX', 'simboloO'],
)
assert.deepEqual(
  catalogoSimbolos.filter((articulo) => !articulo.inicial).map((articulo) => articulo.precio),
  [120, 120],
)
assert.equal(new Set(catalogoArticulos.map((articulo) => articulo.id)).size, catalogoArticulos.length)

const SQL = await initSqlJs()
const base = new SQL.Database()
for (const migracion of MIGRACIONES_ESTADISTICAS.filter((migracion) => migracion.toVersion <= 2)) {
  for (const sentencia of migracion.statements) base.run(sentencia)
}

base.run(`UPDATE EquipamientoFichas SET articuloId = 'verde' WHERE ficha = 'X'`)
for (const sentencia of MIGRACIONES_ESTADISTICAS.find((migracion) => migracion.toVersion === 3).statements) {
  base.run(sentencia)
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

assert.deepEqual(
  base.exec(`SELECT ficha, categoria, articuloId FROM EquipamientoFichas ORDER BY ficha, categoria`)[0]
    .values,
  [
    ['O', 'color', 'azul'],
    ['O', 'simbolo', 'simboloO'],
    ['X', 'color', 'verde'],
    ['X', 'simbolo', 'simboloX'],
  ],
)

base.run(
  `INSERT INTO MovimientosEconomicos
    (id, tipo, cantidad, saldoResultante, origen, articuloId, fechaUtc, fechaLocal)
  VALUES ('1', 'regaloDiario', ?, ?, 'regalo:2026-06-15', NULL, ?, '2026-06-15')`,
  [RECOMPENSA_DIARIA, RECOMPENSA_DIARIA, new Date().toISOString()],
)
assert.throws(
  () =>
    base.run(
      `INSERT INTO MovimientosEconomicos
        (id, tipo, cantidad, saldoResultante, origen, articuloId, fechaUtc, fechaLocal)
      VALUES ('2', 'regaloDiario', ?, ?, 'regalo:2026-06-15', NULL, ?, '2026-06-15')`,
      [RECOMPENSA_DIARIA, RECOMPENSA_DIARIA * 2, new Date().toISOString()],
    ),
  /UNIQUE constraint failed/,
)

console.log('Catálogo, configuración y migración económica validados.')
