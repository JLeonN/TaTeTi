import { ref, computed } from 'vue'

export function useTaTeTi(modoJuego = 'pvp') {
  // Estado del tablero (array de 9 posiciones)
  const tablero = ref(Array(9).fill(null))

  // Turno actual ('X' o 'O')
  const turnoActual = ref('X')

  // Estado del juego
  const juegoTerminado = ref(false)
  const ganador = ref(null)
  const combinacionGanadora = ref(null)

  // Modo de juego ('pvp' o 'ia')
  const modo = ref(modoJuego)

  // Bloquear interacción durante turno de IA
  const esperandoIA = ref(false)

  // Combinaciones ganadoras
  const combinacionesGanadoras = [
    [0, 1, 2], // Fila 1
    [3, 4, 5], // Fila 2
    [6, 7, 8], // Fila 3
    [0, 3, 6], // Columna 1
    [1, 4, 7], // Columna 2
    [2, 5, 8], // Columna 3
    [0, 4, 8], // Diagonal 1
    [2, 4, 6], // Diagonal 2
  ]

  // Verificar si hay ganador
  const verificarGanador = () => {
    for (const combinacion of combinacionesGanadoras) {
      const [a, b, c] = combinacion
      if (
        tablero.value[a] &&
        tablero.value[a] === tablero.value[b] &&
        tablero.value[a] === tablero.value[c]
      ) {
        combinacionGanadora.value = combinacion
        return tablero.value[a]
      }
    }
    return null
  }

  // Verificar si es empate
  const esEmpate = computed(() => {
    return tablero.value.every((celda) => celda !== null) && !ganador.value
  })

  // Realizar jugada
  const realizarJugada = (indice) => {
    console.log('🎮 realizarJugada llamada con índice:', indice)
    console.log('🎮 Turno actual:', turnoActual.value)
    console.log('🎮 Celda actual:', tablero.value[indice])

    // Validaciones
    if (juegoTerminado.value) {
      console.log('❌ Juego terminado, no se puede jugar')
      return false
    }

    if (tablero.value[indice]) {
      console.log('❌ Celda ocupada, no se puede jugar')
      return false
    }

    // Colocar ficha
    tablero.value[indice] = turnoActual.value
    console.log('✅ Ficha colocada:', turnoActual.value, 'en celda:', indice)

    // Verificar ganador
    const hayGanador = verificarGanador()
    if (hayGanador) {
      ganador.value = hayGanador
      juegoTerminado.value = true
      console.log('🏆 Ganador:', hayGanador)
      return true
    }

    // Verificar empate
    if (esEmpate.value) {
      juegoTerminado.value = true
      console.log('🤝 Empate')
      return true
    }

    // Cambiar turno
    turnoActual.value = turnoActual.value === 'X' ? 'O' : 'X'
    console.log('🔄 Cambio de turno a:', turnoActual.value)
    return true
  }

  // Reiniciar juego
  const reiniciarJuego = () => {
    tablero.value = Array(9).fill(null)
    turnoActual.value = 'X'
    juegoTerminado.value = false
    ganador.value = null
    combinacionGanadora.value = null
    esperandoIA.value = false
  }

  return {
    tablero,
    turnoActual,
    juegoTerminado,
    ganador,
    combinacionGanadora,
    esEmpate,
    realizarJugada,
    reiniciarJuego,
    modo,
    esperandoIA,
  }
}
