import { Preferences } from '@capacitor/preferences'
import { App } from '@capacitor/app'
import { ejecutarTransaccionEstadisticas } from './BaseDatosEstadisticas'
import { obtenerTipoLineaGanadora, tieneJugadaGanadoraDisponible } from './AnalisisTablero'
import { VERSION_BASE_ESTADISTICAS } from './EsquemaEstadisticas'

const CLAVE_PARTIDA_PENDIENTE = 'partida_estadisticas_pendiente'
const VERSION_APP = process.env.VERSION_APP || '0.0.0'

const generarId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`

const crearMarcaTiempo = () => ({
  fecha: new Date().toISOString(),
  monotono: performance.now(),
})

class RegistroPartida {
  constructor() {
    this.partida = null
    this.inicioTurnoUsuario = crearMarcaTiempo()
    this.inicioPausa = null
    this.suscripcionEstado = null
    this.amenazaIAPrevia = false
  }

  async inicializar() {
    if (!this.suscripcionEstado) {
      this.suscripcionEstado = await App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) this.reanudar()
        else this.pausar()
      })
    }
    await this.recuperarPartidaInterrumpida()
  }

  prepararTurnoUsuario() {
    this.inicioTurnoUsuario = crearMarcaTiempo()
  }

  async iniciarPartida({ dificultad, fichaUsuario, fichaIA, puntosIniciales, estadoInicial }) {
    if (this.partida) return
    const inicio = crearMarcaTiempo()
    this.partida = {
      id: generarId(),
      fechaInicio: inicio.fecha,
      inicioMonotono: inicio.monotono,
      dificultad,
      fichaUsuario,
      fichaIA,
      puntosIniciales,
      estadoInicial,
      tiempoPausadoMs: 0,
      turnos: [],
      usuarioEstuvoAUnaJugada: false,
      iaEstuvoAUnaJugada: false,
      recuperacionAnteAmenaza: false,
    }
    await this.guardarPartidaPendiente()
  }

  async registrarTurnoUsuario(posicion, tablero) {
    if (!this.partida) return
    const fin = crearMarcaTiempo()
    const inicio = this.inicioTurnoUsuario ?? fin
    this.agregarTurno('usuario', this.partida.fichaUsuario, posicion, inicio, fin)
    this.partida.usuarioEstuvoAUnaJugada ||= tieneJugadaGanadoraDisponible(
      tablero,
      this.partida.fichaUsuario,
    )
    if (this.amenazaIAPrevia && !tieneJugadaGanadoraDisponible(tablero, this.partida.fichaIA)) {
      this.partida.recuperacionAnteAmenaza = true
    }
    await this.guardarPartidaPendiente()
  }

  iniciarTurnoIA() {
    this.inicioTurnoIA = crearMarcaTiempo()
  }

  async registrarTurnoIA(posicion, tablero) {
    if (!this.partida) return
    const fin = crearMarcaTiempo()
    const inicio = this.inicioTurnoIA ?? fin
    this.agregarTurno('ia', this.partida.fichaIA, posicion, inicio, fin)
    this.amenazaIAPrevia = tieneJugadaGanadoraDisponible(tablero, this.partida.fichaIA)
    this.partida.iaEstuvoAUnaJugada ||= this.amenazaIAPrevia
    await this.guardarPartidaPendiente()
  }

  agregarTurno(participante, ficha, posicion, inicio, fin) {
    this.partida.turnos.push({
      id: generarId(),
      numero: this.partida.turnos.length + 1,
      participante,
      ficha,
      posicion,
      fechaInicio: inicio.fecha,
      fechaFin: fin.fecha,
      duracionMs: Math.max(0, Math.round(fin.monotono - inicio.monotono)),
    })
  }

  pausar() {
    if (!this.partida || this.inicioPausa) return
    this.inicioPausa = performance.now()
  }

  reanudar() {
    if (!this.inicioPausa) return
    if (this.partida) {
      this.partida.tiempoPausadoMs += performance.now() - this.inicioPausa
    }
    this.inicioPausa = null
    this.prepararTurnoUsuario()
  }

  async abandonar(motivo) {
    if (!this.partida) return
    await this.finalizar('abandono', {
      motivoAbandono: motivo,
      puntosGanados: 0,
      puntajeTotal: this.partida.puntosIniciales,
      rachaAntes: this.partida.estadoInicial.racha,
      racha: this.partida.estadoInicial.racha,
      derrotasAntes: this.partida.estadoInicial.derrotasConsecutivas,
      derrotasConsecutivas: this.partida.estadoInicial.derrotasConsecutivas,
      proteccionAntes: this.partida.estadoInicial.proteccionActiva,
      proteccionActiva: this.partida.estadoInicial.proteccionActiva,
    })
  }

  async finalizar(resultado, datosPuntuacion, combinacionGanadora = null) {
    if (!this.partida) return
    const partidaFinalizada = this.partida
    this.partida = null
    this.inicioPausa = null

    const ahora = new Date()
    const movimientosUsuario = partidaFinalizada.turnos.filter(
      (turno) => turno.participante === 'usuario',
    ).length
    const movimientosIA = partidaFinalizada.turnos.length - movimientosUsuario
    const resultadoMinimosMovimientos =
      (resultado === 'victoria' && movimientosUsuario === 3) ||
      (resultado === 'derrota' && movimientosIA === 3)

    const fila = {
      ...partidaFinalizada,
      fechaFin: ahora.toISOString(),
      fechaLocal: `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`,
      horaLocal: ahora.getHours(),
      resultado,
      motivoAbandono: datosPuntuacion.motivoAbandono ?? null,
      duracionMs: Math.max(
        0,
        Math.round(
          performance.now() - partidaFinalizada.inicioMonotono - partidaFinalizada.tiempoPausadoMs,
        ),
      ),
      movimientosUsuario,
      movimientosIA,
      puntosFinales: datosPuntuacion.puntajeTotal,
      variacionPuntos: datosPuntuacion.puntosGanados,
      rachaAntes: datosPuntuacion.rachaAntes,
      rachaDespues: datosPuntuacion.racha,
      derrotasAntes: datosPuntuacion.derrotasAntes,
      derrotasDespues: datosPuntuacion.derrotasConsecutivas,
      proteccionAntes: datosPuntuacion.proteccionAntes,
      proteccionDespues: datosPuntuacion.proteccionActiva,
      activoProteccion: Boolean(datosPuntuacion.activoProteccion),
      derrotaProtegida: Boolean(datosPuntuacion.derrotaProtegida),
      desactivoProteccion: Boolean(datosPuntuacion.desactivoProteccion),
      partidasParaDesactivarProteccion: datosPuntuacion.partidasParaDesactivarProteccion ?? 0,
      duracionProteccionMs: datosPuntuacion.duracionProteccionMs ?? 0,
      inicioRachaNegativa:
        resultado === 'derrota' &&
        datosPuntuacion.derrotasAntes === 1 &&
        datosPuntuacion.derrotasConsecutivas === 2,
      recuperacionRachaNegativa: resultado === 'victoria' && datosPuntuacion.derrotasAntes >= 2,
      resultadoMinimosMovimientos,
      tipoLineaGanadora: obtenerTipoLineaGanadora(combinacionGanadora),
      combinacionGanadora: combinacionGanadora?.join(',') ?? null,
    }

    await guardarPartidaFinalizada(fila)
    await Preferences.remove({ key: CLAVE_PARTIDA_PENDIENTE })
    this.prepararTurnoUsuario()
  }

  async guardarPartidaPendiente() {
    if (!this.partida) return
    const copia = {
      ...this.partida,
      inicioMonotono: undefined,
    }
    await Preferences.set({
      key: CLAVE_PARTIDA_PENDIENTE,
      value: JSON.stringify(copia),
    })
  }

  async recuperarPartidaInterrumpida() {
    const resultado = await Preferences.get({ key: CLAVE_PARTIDA_PENDIENTE })
    if (!resultado.value) return
    try {
      const pendiente = JSON.parse(resultado.value)
      pendiente.inicioMonotono = performance.now()
      this.partida = pendiente
      await this.abandonar('cierreApp')
    } catch (error) {
      console.error('Error al recuperar la partida pendiente:', error)
      await Preferences.remove({ key: CLAVE_PARTIDA_PENDIENTE })
    }
  }
}

const guardarPartidaFinalizada = async (partida) => {
  const valoresPartida = [
    partida.id,
    partida.fechaInicio,
    partida.fechaFin,
    partida.fechaLocal,
    partida.horaLocal,
    partida.resultado,
    partida.motivoAbandono,
    partida.dificultad,
    partida.fichaUsuario,
    partida.fichaIA,
    partida.duracionMs,
    Math.round(partida.tiempoPausadoMs),
    partida.movimientosUsuario,
    partida.movimientosIA,
    partida.puntosIniciales,
    partida.variacionPuntos,
    partida.puntosFinales,
    partida.rachaAntes,
    partida.rachaDespues,
    partida.derrotasAntes,
    partida.derrotasDespues,
    Number(partida.proteccionAntes),
    Number(partida.proteccionDespues),
    Number(partida.activoProteccion),
    Number(partida.derrotaProtegida),
    Number(partida.desactivoProteccion),
    partida.partidasParaDesactivarProteccion,
    partida.duracionProteccionMs,
    Number(partida.inicioRachaNegativa),
    Number(partida.recuperacionRachaNegativa),
    Number(partida.resultadoMinimosMovimientos),
    Number(partida.usuarioEstuvoAUnaJugada),
    Number(partida.iaEstuvoAUnaJugada),
    Number(partida.recuperacionAnteAmenaza),
    partida.tipoLineaGanadora,
    partida.combinacionGanadora,
    VERSION_APP,
    VERSION_BASE_ESTADISTICAS,
  ]

  await ejecutarTransaccionEstadisticas(async (base) => {
    await base.run(
      `INSERT INTO Partidas (
        id, fechaInicio, fechaFin, fechaLocal, horaLocal, resultado, motivoAbandono,
        dificultad, fichaUsuario, fichaIA, duracionMs, tiempoPausadoMs,
        movimientosUsuario, movimientosIA, puntosIniciales, variacionPuntos,
        puntosFinales, rachaAntes, rachaDespues, derrotasAntes, derrotasDespues,
        proteccionAntes, proteccionDespues, activoProteccion, derrotaProtegida,
        desactivoProteccion, partidasParaDesactivarProteccion, duracionProteccionMs,
        inicioRachaNegativa, recuperacionRachaNegativa, resultadoMinimosMovimientos,
        usuarioEstuvoAUnaJugada, iaEstuvoAUnaJugada, recuperacionAnteAmenaza,
        tipoLineaGanadora, combinacionGanadora, versionApp, versionEsquema
      ) VALUES (${Array(38).fill('?').join(', ')})`,
      valoresPartida,
      false,
    )

    for (const turno of partida.turnos) {
      await base.run(
        `INSERT INTO Turnos (
          id, partidaId, numero, participante, ficha, posicion,
          fechaInicio, fechaFin, duracionMs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          turno.id,
          partida.id,
          turno.numero,
          turno.participante,
          turno.ficha,
          turno.posicion,
          turno.fechaInicio,
          turno.fechaFin,
          turno.duracionMs,
        ],
        false,
      )
    }
  })
}

export const registroPartida = new RegistroPartida()
