import { Capacitor } from '@capacitor/core'
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite'
import {
  MIGRACIONES_ESTADISTICAS,
  NOMBRE_BASE_ESTADISTICAS,
  VERSION_BASE_ESTADISTICAS,
} from './EsquemaEstadisticas'

const conexionSqlite = new SQLiteConnection(CapacitorSQLite)
let conexionBase = null
let promesaInicializacion = null
let colaOperaciones = Promise.resolve()

const esPlataformaWeb = () => Capacitor.getPlatform() === 'web'

const prepararPlataformaWeb = async () => {
  const { defineCustomElement } = await import('jeep-sqlite/dist/components/jeep-sqlite.js')
  defineCustomElement()
  await customElements.whenDefined('jeep-sqlite')

  if (!document.querySelector('jeep-sqlite')) {
    const elementoSqlite = document.createElement('jeep-sqlite')
    document.body.appendChild(elementoSqlite)
  }

  await conexionSqlite.initWebStore()
}

const abrirConexion = async () => {
  if (esPlataformaWeb()) await prepararPlataformaWeb()

  await conexionSqlite.addUpgradeStatement(NOMBRE_BASE_ESTADISTICAS, MIGRACIONES_ESTADISTICAS)

  const conexionExistente = await conexionSqlite.isConnection(NOMBRE_BASE_ESTADISTICAS, false)

  conexionBase = conexionExistente.result
    ? await conexionSqlite.retrieveConnection(NOMBRE_BASE_ESTADISTICAS, false)
    : await conexionSqlite.createConnection(
        NOMBRE_BASE_ESTADISTICAS,
        false,
        'no-encryption',
        VERSION_BASE_ESTADISTICAS,
        false,
      )

  const abierta = await conexionBase.isDBOpen()
  if (!abierta.result) await conexionBase.open()
  await conexionBase.execute('PRAGMA foreign_keys = ON;', false)
  return conexionBase
}

export const inicializarBaseEstadisticas = async () => {
  if (!promesaInicializacion) {
    promesaInicializacion = abrirConexion().catch((error) => {
      promesaInicializacion = null
      conexionBase = null
      throw error
    })
  }
  return promesaInicializacion
}

const ejecutarEnCola = (operacion) => {
  const resultado = colaOperaciones.then(operacion, operacion)
  colaOperaciones = resultado.catch(() => undefined)
  return resultado
}

const guardarWeb = async () => {
  if (esPlataformaWeb()) {
    await conexionSqlite.saveToStore(NOMBRE_BASE_ESTADISTICAS)
  }
}

export const ejecutarConsultaEstadisticas = async (consulta, valores = []) => {
  const base = await inicializarBaseEstadisticas()
  const resultado = await base.query(consulta, valores)
  return resultado.values ?? []
}

export const ejecutarEscrituraEstadisticas = (consulta, valores = []) =>
  ejecutarEnCola(async () => {
    const base = await inicializarBaseEstadisticas()
    const resultado = await base.run(consulta, valores, false)
    await guardarWeb()
    return resultado
  })

export const ejecutarTransaccionEstadisticas = (operacion) =>
  ejecutarEnCola(async () => {
    const base = await inicializarBaseEstadisticas()
    await base.beginTransaction()
    try {
      const resultado = await operacion(base)
      await base.commitTransaction()
      await guardarWeb()
      return resultado
    } catch (error) {
      await base.rollbackTransaction()
      throw error
    }
  })
