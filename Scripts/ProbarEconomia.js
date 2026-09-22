import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import initSqlJs from 'sql.js'
import mensajesEconomia from '../src/i18n/MensajesEconomia.js'
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

assert.equal(VERSION_BASE_ESTADISTICAS, 4)
assert.equal(RECOMPENSA_DIARIA, 10)
assert.equal(RECOMPENSA_ANUNCIO, 15)
assert.equal(MAXIMO_ANUNCIOS_DIARIOS, 3)
assert.deepEqual(
  catalogoColores.filter((articulo) => articulo.inicial).map((articulo) => articulo.id),
  ['rojo', 'azul'],
)
assert.equal(new Set(catalogoColores.map((articulo) => articulo.id)).size, catalogoColores.length)
assert.ok(catalogoColores.every((articulo) => articulo.variable.startsWith('--color-catalogo-')))
assert.ok(catalogoColores.every((articulo) => articulo.categoria === 'color'))
assert.ok(catalogoColores.every((articulo) => catalogoArticulos.includes(articulo)))
assert.deepEqual(
  catalogoColores.filter((articulo) => !articulo.inicial && !articulo.id.endsWith('Fluor')).map((articulo) => articulo.precio),
  [60, 60, 60, 60, 60, 60, 60],
)
assert.ok(
  catalogoColores
    .filter((articulo) => articulo.id.endsWith('Fluor'))
    .every((articulo) => articulo.precio === 120),
)
assert.deepEqual(
  catalogoColores
    .filter((articulo) => ['negro', 'negroFluor'].includes(articulo.id))
    .map(({ id, precio, colorVista }) => ({ id, precio, colorVista })),
  [
    { id: 'negro', precio: 60, colorVista: '#000000' },
    { id: 'negroFluor', precio: 120, colorVista: '#000000' },
  ],
)
assert.deepEqual(
  catalogoSimbolos.filter((articulo) => articulo.inicial).map((articulo) => articulo.id),
  ['simboloX', 'simboloO'],
)
assert.deepEqual(
  catalogoSimbolos.filter((articulo) => !articulo.inicial).map((articulo) => articulo.precio),
  [120, 120, 120, 120],
)
assert.ok(catalogoSimbolos.every((articulo) => articulo.categoria === 'simbolo'))
assert.ok(catalogoSimbolos.every((articulo) => catalogoArticulos.includes(articulo)))
assert.deepEqual(
  catalogoSimbolos.slice(2).map((articulo) => articulo.representacion.valor),
  ['△', '□', '☆', '⬡'],
)
assert.deepEqual(
  catalogoSimbolos.slice(-2).map(({ id, estiloVisual }) => ({ id, estiloVisual })),
  [
    { id: 'simboloEstrella', estiloVisual: { grosorContorno: '0.125em' } },
    { id: 'simboloHexagono', estiloVisual: { grosorContorno: '0.125em' } },
  ],
)
assert.equal(new Set(catalogoArticulos.map((articulo) => articulo.id)).size, catalogoArticulos.length)
assert.deepEqual(
  MIGRACIONES_ESTADISTICAS.map((migracion) => migracion.toVersion),
  [1, 2, 3, 4],
)

for (const [codigo, mensajes] of Object.entries(mensajesEconomia)) {
  for (const clave of ['simbolosTitulo']) {
    assert.ok(mensajes.tienda[clave], `${codigo}: falta tienda.${clave}.`)
  }
  for (const clave of [
    'equipado',
    'fluor',
    'simbolosFicha',
    'simboloJugador',
    'simboloNexus',
    'simboloUsadoPor',
    'simboloEquipado',
    'simboloEnUso',
    'articuloNoAdquirido',
    'errorEquipamiento',
  ]) {
    assert.ok(mensajes.inventario[clave], `${codigo}: falta inventario.${clave}.`)
  }
  assert.ok(mensajes.tienda.simbolos.triangulo, `${codigo}: falta el nombre del triángulo.`)
  assert.ok(mensajes.tienda.simbolos.cuadrado, `${codigo}: falta el nombre del cuadrado.`)
  assert.ok(mensajes.tienda.simbolos.estrella, `${codigo}: falta el nombre de la estrella.`)
  assert.ok(mensajes.tienda.simbolos.hexagono, `${codigo}: falta el nombre del hexágono.`)
  assert.ok(mensajes.tienda.colores.negro, `${codigo}: falta el nombre del negro.`)
  assert.ok(mensajes.tienda.colores.negroFluor, `${codigo}: falta el nombre del negro flúor.`)
}

const contenidoTienda = await readFile(
  new URL('../src/pages/TiendaPage.vue', import.meta.url),
  'utf8',
)
assert.doesNotMatch(contenidoTienda, /setInterval\s*\(/)
assert.doesNotMatch(contenidoTienda, /\.muestra-color\s+span\s*\{/)
assert.match(contenidoTienda, /programarActualizacionRecompensas/)
for (const ruta of [
  '../src/components/TaTeTi/InfoJuego.vue',
  '../src/components/TaTeTi/Compartido/ModalResultado.vue',
  '../src/pages/JugarContraIA.vue',
  '../src/pages/InventarioPage.vue',
]) {
  const contenido = await readFile(new URL(ruta, import.meta.url), 'utf8')
  assert.match(contenido, /FichaVisual/, `${ruta}: falta integrar FichaVisual.`)
}

const contenidoFiltrosEstadisticas = await readFile(
  new URL('../src/components/Estadisticas/BarraFiltrosEstadisticas.vue', import.meta.url),
  'utf8',
)
assert.match(
  contenidoFiltrosEstadisticas,
  /:color-id="opcion\.colorId"/,
  'Los filtros de Estadísticas deben reflejar el color equipado de cada ficha.',
)

const SQL = await initSqlJs()
const base = new SQL.Database()
for (const migracion of MIGRACIONES_ESTADISTICAS.filter((migracion) => migracion.toVersion <= 2)) {
  for (const sentencia of migracion.statements) base.run(sentencia)
}

base.run(`UPDATE EquipamientoFichas SET articuloId = 'verde' WHERE ficha = 'X'`)
for (const sentencia of MIGRACIONES_ESTADISTICAS.find((migracion) => migracion.toVersion === 3).statements) {
  base.run(sentencia)
}
for (const sentencia of MIGRACIONES_ESTADISTICAS.find((migracion) => migracion.toVersion === 4).statements) {
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
const columnasPartidas = base.exec(`PRAGMA table_info(Partidas)`)[0].values.map((columna) => columna[1])
assert.ok(columnasPartidas.includes('simboloUsuarioId'))
assert.ok(columnasPartidas.includes('simboloIAId'))

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
