import { ref, computed } from 'vue'

export function useTaTeTi() {
  // Estado del tablero (array de 9 posiciones)
  const tablero = ref(Array(9).fill(null))

  // Turno actual ('X' o 'O')
  const turnoActual = ref('X')

  // Estado del juego
  const juegoTerminado = ref(false)
  const ganador = ref(null)

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
    // Validaciones
    if (juegoTerminado.value || tablero.value[indice]) {
      return false
    }

    // Colocar ficha
    tablero.value[indice] = turnoActual.value

    // Verificar ganador
    const hayGanador = verificarGanador()
    if (hayGanador) {
      ganador.value = hayGanador
      juegoTerminado.value = true
      return true
    }

    // Verificar empate
    if (esEmpate.value) {
      juegoTerminado.value = true
      return true
    }

    // Cambiar turno
    turnoActual.value = turnoActual.value === 'X' ? 'O' : 'X'
    return true
  }

  // Reiniciar juego
  const reiniciarJuego = () => {
    tablero.value = Array(9).fill(null)
    turnoActual.value = 'X'
    juegoTerminado.value = false
    ganador.value = null
  }

  return {
    tablero,
    turnoActual,
    juegoTerminado,
    ganador,
    esEmpate,
    realizarJugada,
    reiniciarJuego,
  }
}
