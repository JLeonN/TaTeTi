import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

const CLAVE_PUNTUACION = 'puntuacion_sistema'

// Estado global (singleton)
const puntajeTotal = ref(0)
const crearEstadoInicial = () => ({
  racha: 0,
  derrotasConsecutivas: 0,
  proteccionActiva: false,
  proteccionActivadaEn: null,
  partidasConProteccion: 0,
})

const completarEstado = (estadoGuardado = {}) => ({
  ...crearEstadoInicial(),
  ...estadoGuardado,
})

const estadoFacil = ref(crearEstadoInicial())
const estadoNormal = ref(crearEstadoInicial())
const estadoDificil = ref(crearEstadoInicial())

export function usePuntuacion() {
  // ============================================================================
  // CONFIGURACIÓN DE PUNTOS
  // ============================================================================
  const configuracionPuntos = {
    facil: {
      ganar: 3,
      perder: 1,
      empate: 1,
      racha3: 1, // +1 adicional (total 4)
      racha10: 2, // +2 adicional (total 5)
    },
    normal: {
      ganar: 5,
      perder: 2,
      empate: 1,
      racha3: 2, // +2 adicional (total 7)
      racha10: 3, // +3 adicional (total 8)
    },
    dificil: {
      ganar: 10,
      perder: 5,
      empate: 1,
      racha3: 3, // +3 adicional (total 13)
      racha10: 5, // +5 adicional (total 15)
    },
  }

  // ============================================================================
  // OBTENER ESTADO SEGÚN DIFICULTAD
  // ============================================================================
  const obtenerEstado = (dificultad) => {
    switch (dificultad) {
      case 'facil':
        return estadoFacil
      case 'normal':
        return estadoNormal
      case 'dificil':
        return estadoDificil
      default:
        return estadoNormal
    }
  }

  // ============================================================================
  // CARGAR PUNTUACIÓN DESDE STORAGE
  // ============================================================================
  const cargarPuntuacion = async () => {
    try {
      const resultado = await Preferences.get({ key: CLAVE_PUNTUACION })

      if (resultado.value) {
        const datos = JSON.parse(resultado.value)
        puntajeTotal.value = datos.puntajeTotal || 0

        estadoFacil.value = completarEstado(datos.facil)
        estadoNormal.value = completarEstado(datos.normal)
        estadoDificil.value = completarEstado(datos.dificil)

        console.log('✅ Puntuación cargada:', datos)
      } else {
        console.log('ℹ️ No hay puntuación guardada, usando valores por defecto')
      }
    } catch (error) {
      console.error('❌ Error al cargar puntuación:', error)
    }
  }

  // ============================================================================
  // GUARDAR PUNTUACIÓN EN STORAGE
  // ============================================================================
  const guardarPuntuacion = async () => {
    try {
      const datos = {
        puntajeTotal: puntajeTotal.value,
        facil: estadoFacil.value,
        normal: estadoNormal.value,
        dificil: estadoDificil.value,
      }

      await Preferences.set({
        key: CLAVE_PUNTUACION,
        value: JSON.stringify(datos),
      })

      console.log('✅ Puntuación guardada:', datos)
    } catch (error) {
      console.error('❌ Error al guardar puntuación:', error)
    }
  }

  // ============================================================================
  // CALCULAR BONUS POR RACHA
  // ============================================================================
  const calcularBonusRacha = (racha, config) => {
    if (racha >= 10) return config.racha10
    if (racha >= 3) return config.racha3
    return 0
  }

  // ============================================================================
  // PROCESAR RESULTADO DE PARTIDA
  // ============================================================================
  const procesarResultado = async (resultado, dificultad) => {
    const config = configuracionPuntos[dificultad]
    const estado = obtenerEstado(dificultad)
    const rachaAntes = estado.value.racha
    const derrotasAntes = estado.value.derrotasConsecutivas
    const proteccionAntes = estado.value.proteccionActiva
    let puntosGanados = 0
    let activoProteccion = false
    let derrotaProtegida = false
    let desactivoProteccion = false
    let partidasParaDesactivarProteccion = 0
    let duracionProteccionMs = 0

    // VICTORIA
    if (resultado === 'victoria') {
      // Calcular puntos base + bonus de racha
      estado.value.racha += 1
      const bonusRacha = calcularBonusRacha(estado.value.racha, config)
      puntosGanados = config.ganar + bonusRacha

      // Sumar puntos
      puntajeTotal.value += puntosGanados

      // Resetear derrotas y desactivar protección
      estado.value.derrotasConsecutivas = 0
      if (proteccionAntes) {
        desactivoProteccion = true
        partidasParaDesactivarProteccion = estado.value.partidasConProteccion
        if (estado.value.proteccionActivadaEn) {
          duracionProteccionMs = Math.max(
            0,
            Date.now() - new Date(estado.value.proteccionActivadaEn).getTime(),
          )
        }
      }
      estado.value.proteccionActiva = false
      estado.value.proteccionActivadaEn = null
      estado.value.partidasConProteccion = 0

      console.log(
        `🏆 Victoria en ${dificultad}: +${puntosGanados} pts (Racha: ${estado.value.racha})`,
      )
    }

    // DERROTA
    else if (resultado === 'derrota') {
      // Incrementar contador de derrotas
      estado.value.derrotasConsecutivas += 1

      // Activar protección si llegó a 5 derrotas
      if (estado.value.derrotasConsecutivas >= 5) {
        if (!estado.value.proteccionActiva) {
          activoProteccion = true
          estado.value.proteccionActivadaEn = new Date().toISOString()
          estado.value.partidasConProteccion = 0
        }
        estado.value.proteccionActiva = true
      }

      // Restar puntos solo si no hay protección y no está en el mínimo
      if (!estado.value.proteccionActiva && puntajeTotal.value > 10) {
        puntosGanados = -config.perder
        puntajeTotal.value += puntosGanados // Es negativo

        // No bajar de 10
        if (puntajeTotal.value < 10) {
          puntajeTotal.value = 10
        }
      } else if (estado.value.proteccionActiva) {
        derrotaProtegida = true
      }
      if (estado.value.proteccionActiva) estado.value.partidasConProteccion += 1

      // Resetear racha
      estado.value.racha = 0

      console.log(
        `💀 Derrota en ${dificultad}: ${puntosGanados} pts (Derrotas: ${estado.value.derrotasConsecutivas})`,
      )
    }

    // EMPATE
    else if (resultado === 'empate') {
      puntosGanados = config.empate
      puntajeTotal.value += puntosGanados

      // No resetear racha ni derrotas en empate
      console.log(`🤝 Empate en ${dificultad}: +${puntosGanados} pts`)
    }

    // Guardar cambios
    await guardarPuntuacion()

    return {
      puntosGanados,
      puntajeTotal: puntajeTotal.value,
      racha: estado.value.racha,
      rachaAntes,
      derrotasAntes,
      derrotasConsecutivas: estado.value.derrotasConsecutivas,
      proteccionAntes,
      proteccionActiva: estado.value.proteccionActiva,
      activoProteccion,
      derrotaProtegida,
      desactivoProteccion,
      partidasParaDesactivarProteccion,
      duracionProteccionMs,
    }
  }

  // ============================================================================
  // OBTENER RACHA ACTUAL
  // ============================================================================
  const obtenerRacha = (dificultad) => {
    const estado = obtenerEstado(dificultad)
    return estado.value.racha
  }

  // ============================================================================
  // OBTENER DERROTAS CONSECUTIVAS
  // ============================================================================
  const obtenerDerrotasConsecutivas = (dificultad) => {
    const estado = obtenerEstado(dificultad)
    return estado.value.derrotasConsecutivas
  }

  const obtenerEstadoPuntuacion = (dificultad) => {
    const estado = obtenerEstado(dificultad)
    return { ...estado.value }
  }

  const obtenerProteccionActiva = (dificultad) => {
    const estado = obtenerEstado(dificultad)
    return estado.value.proteccionActiva
  }

  const calcularPuntosProximaVictoria = (dificultad) => {
    const config = configuracionPuntos[dificultad] || configuracionPuntos.normal
    const estado = obtenerEstado(dificultad)
    const proximaRacha = estado.value.racha + 1
    return config.ganar + calcularBonusRacha(proximaRacha, config)
  }

  const calcularPuntosProximaDerrota = (dificultad) => {
    const config = configuracionPuntos[dificultad] || configuracionPuntos.normal
    const estado = obtenerEstado(dificultad)
    const activaProteccion = estado.value.derrotasConsecutivas + 1 >= 5

    if (estado.value.proteccionActiva || activaProteccion || puntajeTotal.value <= 10) return 0

    return -Math.min(config.perder, puntajeTotal.value - 10)
  }

  return {
    puntajeTotal,
    cargarPuntuacion,
    guardarPuntuacion,
    procesarResultado,
    obtenerRacha,
    obtenerDerrotasConsecutivas,
    obtenerEstadoPuntuacion,
    obtenerProteccionActiva,
    calcularPuntosProximaVictoria,
    calcularPuntosProximaDerrota,
  }
}
