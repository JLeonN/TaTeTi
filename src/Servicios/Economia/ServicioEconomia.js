import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'
import {
  ejecutarConsultaEstadisticas,
  ejecutarTransaccionEstadisticas,
  inicializarBaseEstadisticas,
} from 'src/Servicios/Estadisticas/BaseDatosEstadisticas'
import { catalogoColores, obtenerArticulo } from './CatalogoTienda'

const CLAVE_PUNTUACION = 'puntuacion_sistema'
const CLAVE_EQUIPAMIENTO_RESPALDO = 'equipamiento_fichas'
const CLAVE_MIGRACION = 'economia_migrada_v2'
const puntajeTotal = ref(0)
const economiaDisponible = ref(false)
const articulosAdquiridos = ref(new Set(catalogoColores.filter((item) => item.inicial).map((item) => item.id)))
const equipamiento = ref({ X: 'rojo', O: 'azul' })
let promesaInicializacion = null

const generarId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`

const crearFechaLocal = (fecha = new Date()) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`

const leerPuntuacionRespaldo = async () => {
  const resultado = await Preferences.get({ key: CLAVE_PUNTUACION })
  if (!resultado.value) return { puntajeTotal: 0 }
  try {
    return JSON.parse(resultado.value)
  } catch {
    return { puntajeTotal: 0 }
  }
}

const guardarSaldoRespaldo = async () => {
  const datos = await leerPuntuacionRespaldo()
  datos.puntajeTotal = puntajeTotal.value
  await Preferences.set({ key: CLAVE_PUNTUACION, value: JSON.stringify(datos) })
}

const cargarEquipamientoRespaldo = async () => {
  const resultado = await Preferences.get({ key: CLAVE_EQUIPAMIENTO_RESPALDO })
  if (!resultado.value) return
  try {
    const guardado = JSON.parse(resultado.value)
    if (obtenerArticulo(guardado.X) && obtenerArticulo(guardado.O) && guardado.X !== guardado.O) {
      equipamiento.value = guardado
    }
  } catch {
    equipamiento.value = { X: 'rojo', O: 'azul' }
  }
}

const migrarEconomia = async (saldoRespaldo) => {
  const migrada = await Preferences.get({ key: CLAVE_MIGRACION })
  if (migrada.value === 'true') return

  const partidas = await ejecutarConsultaEstadisticas(
    `SELECT id, fechaFin, fechaLocal, variacionPuntos
    FROM Partidas
    WHERE resultado <> 'abandono'
    ORDER BY fechaFin`,
  )
  const sumaPartidas = partidas.reduce((total, partida) => total + Number(partida.variacionPuntos), 0)
  const ajusteInicial = Number(saldoRespaldo) - sumaPartidas

  await ejecutarTransaccionEstadisticas(async (base) => {
    let saldo = 0
    if (ajusteInicial !== 0) {
      saldo += ajusteInicial
      await base.run(
        `INSERT OR IGNORE INTO MovimientosEconomicos
          (id, tipo, cantidad, saldoResultante, origen, articuloId, fechaUtc, fechaLocal)
        VALUES (?, 'ajusteInicial', ?, ?, 'migracion:inicial', NULL, ?, ?)`,
        [generarId(), ajusteInicial, saldo, new Date(0).toISOString(), '1970-01-01'],
        false,
      )
    }
    for (const partida of partidas) {
      saldo += Number(partida.variacionPuntos)
      await base.run(
        `INSERT OR IGNORE INTO MovimientosEconomicos
          (id, tipo, cantidad, saldoResultante, origen, articuloId, fechaUtc, fechaLocal)
        VALUES (?, 'partida', ?, ?, ?, NULL, ?, ?)`,
        [
          generarId(),
          Number(partida.variacionPuntos),
          saldo,
          `partida:${partida.id}`,
          partida.fechaFin,
          partida.fechaLocal,
        ],
        false,
      )
    }
    await base.run(
      `INSERT OR REPLACE INTO EstadoEconomia (clave, valor) VALUES ('saldo', ?)`,
      [String(saldoRespaldo)],
      false,
    )
    for (const articulo of catalogoColores.filter((item) => item.inicial)) {
      await base.run(
        `INSERT OR IGNORE INTO ArticulosAdquiridos (articuloId, fechaAdquisicion)
        VALUES (?, ?)`,
        [articulo.id, new Date(0).toISOString()],
        false,
      )
    }
  })
  await Preferences.set({ key: CLAVE_MIGRACION, value: 'true' })
}

const cargarEstado = async () => {
  const filasSaldo = await ejecutarConsultaEstadisticas(
    `SELECT valor FROM EstadoEconomia WHERE clave = 'saldo'`,
  )
  puntajeTotal.value = Number(filasSaldo[0]?.valor) || 0

  const filasArticulos = await ejecutarConsultaEstadisticas(
    `SELECT articuloId FROM ArticulosAdquiridos`,
  )
  articulosAdquiridos.value = new Set(filasArticulos.map((fila) => fila.articuloId))

  const filasEquipamiento = await ejecutarConsultaEstadisticas(
    `SELECT ficha, articuloId FROM EquipamientoFichas`,
  )
  if (filasEquipamiento.length === 2) {
    equipamiento.value = Object.fromEntries(
      filasEquipamiento.map((fila) => [fila.ficha, fila.articuloId]),
    )
  }
}

export const inicializarEconomia = async () => {
  if (promesaInicializacion) return promesaInicializacion
  promesaInicializacion = (async () => {
    const respaldo = await leerPuntuacionRespaldo()
    await cargarEquipamientoRespaldo()
    try {
      await inicializarBaseEstadisticas()
      await migrarEconomia(Number(respaldo.puntajeTotal) || 0)
      await cargarEstado()
      economiaDisponible.value = true
    } catch (error) {
      console.error('Error al inicializar la economía:', error)
      puntajeTotal.value = Number(respaldo.puntajeTotal) || 0
      economiaDisponible.value = false
    }
  })()
  return promesaInicializacion
}

export const registrarMovimiento = async ({
  tipo,
  cantidad,
  origen,
  articuloId = null,
  fecha = new Date(),
}) => {
  if (!economiaDisponible.value) throw new Error('economiaNoDisponible')
  let nuevoSaldo = puntajeTotal.value
  await ejecutarTransaccionEstadisticas(async (base) => {
    const existente = await base.query(
      `SELECT saldoResultante FROM MovimientosEconomicos WHERE origen = ?`,
      [origen],
    )
    if (existente.values?.length) {
      nuevoSaldo = Number(existente.values[0].saldoResultante)
      return
    }
    nuevoSaldo = puntajeTotal.value + Number(cantidad)
    if (nuevoSaldo < 0) throw new Error('fondosInsuficientes')
    await base.run(
      `INSERT INTO MovimientosEconomicos
        (id, tipo, cantidad, saldoResultante, origen, articuloId, fechaUtc, fechaLocal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        generarId(),
        tipo,
        Number(cantidad),
        nuevoSaldo,
        origen,
        articuloId,
        fecha.toISOString(),
        crearFechaLocal(fecha),
      ],
      false,
    )
    await base.run(
      `INSERT OR REPLACE INTO EstadoEconomia (clave, valor) VALUES ('saldo', ?)`,
      [String(nuevoSaldo)],
      false,
    )
  })
  puntajeTotal.value = nuevoSaldo
  await guardarSaldoRespaldo()
  return nuevoSaldo
}

export const comprarArticulo = async (articuloId) => {
  const articulo = obtenerArticulo(articuloId)
  if (!articulo) throw new Error('articuloInvalido')
  if (articulosAdquiridos.value.has(articuloId)) throw new Error('articuloAdquirido')
  if (puntajeTotal.value < articulo.precio) throw new Error('fondosInsuficientes')
  const origen = `compra:${generarId()}`

  await ejecutarTransaccionEstadisticas(async (base) => {
    const nuevoSaldo = puntajeTotal.value - articulo.precio
    await base.run(
      `INSERT INTO ArticulosAdquiridos (articuloId, fechaAdquisicion) VALUES (?, ?)`,
      [articuloId, new Date().toISOString()],
      false,
    )
    await base.run(
      `INSERT INTO MovimientosEconomicos
        (id, tipo, cantidad, saldoResultante, origen, articuloId, fechaUtc, fechaLocal)
      VALUES (?, 'compra', ?, ?, ?, ?, ?, ?)`,
      [
        generarId(),
        -articulo.precio,
        nuevoSaldo,
        origen,
        articuloId,
        new Date().toISOString(),
        crearFechaLocal(),
      ],
      false,
    )
    await base.run(
      `INSERT OR REPLACE INTO EstadoEconomia (clave, valor) VALUES ('saldo', ?)`,
      [String(nuevoSaldo)],
      false,
    )
    puntajeTotal.value = nuevoSaldo
  })
  articulosAdquiridos.value = new Set([...articulosAdquiridos.value, articuloId])
  await guardarSaldoRespaldo()
}

export const equiparArticulo = async (ficha, articuloId) => {
  if (!['X', 'O'].includes(ficha) || !articulosAdquiridos.value.has(articuloId)) return false
  const otraFicha = ficha === 'X' ? 'O' : 'X'
  const siguiente = { ...equipamiento.value }
  if (siguiente[otraFicha] === articuloId) {
    siguiente[otraFicha] = siguiente[ficha]
  }
  siguiente[ficha] = articuloId

  await ejecutarTransaccionEstadisticas(async (base) => {
    for (const [simbolo, color] of Object.entries(siguiente)) {
      await base.run(
        `INSERT OR REPLACE INTO EquipamientoFichas (ficha, articuloId) VALUES (?, ?)`,
        [simbolo, color],
        false,
      )
    }
  })
  equipamiento.value = siguiente
  await Preferences.set({
    key: CLAVE_EQUIPAMIENTO_RESPALDO,
    value: JSON.stringify(siguiente),
  })
  return true
}

export const obtenerEstadisticasEconomicas = async () => {
  const resumen = await ejecutarConsultaEstadisticas(
    `SELECT
      SUM(CASE WHEN cantidad > 0 AND tipo <> 'ajusteInicial' THEN cantidad ELSE 0 END) AS ganados,
      ABS(SUM(CASE WHEN tipo = 'compra' THEN cantidad ELSE 0 END)) AS gastados,
      SUM(CASE WHEN tipo = 'partida' AND cantidad > 0 THEN cantidad ELSE 0 END) AS jugando,
      SUM(CASE WHEN tipo = 'anuncio' THEN cantidad ELSE 0 END) AS anuncios,
      SUM(CASE WHEN tipo = 'regaloDiario' THEN cantidad ELSE 0 END) AS regalos,
      SUM(CASE WHEN tipo = 'anuncio' THEN 1 ELSE 0 END) AS cantidadAnuncios,
      SUM(CASE WHEN tipo = 'regaloDiario' THEN 1 ELSE 0 END) AS cantidadRegalos,
      SUM(CASE WHEN tipo = 'compra' THEN 1 ELSE 0 END) AS compras,
      MAX(saldoResultante) AS maximo
    FROM MovimientosEconomicos`,
  )
  const evolucion = await ejecutarConsultaEstadisticas(
    `SELECT fechaUtc, saldoResultante
    FROM MovimientosEconomicos
    ORDER BY fechaUtc DESC
    LIMIT 30`,
  )
  return { ...(resumen[0] ?? {}), saldo: puntajeTotal.value, evolucion: evolucion.reverse() }
}

export const usarEconomia = () => ({
  puntajeTotal,
  economiaDisponible,
  articulosAdquiridos,
  equipamiento,
  inicializarEconomia,
  registrarMovimiento,
  comprarArticulo,
  equiparArticulo,
})

