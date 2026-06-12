// Composable para la lógica de la IA del Ta-Te-Ti
// Incluye 3 niveles de dificultad: Fácil, Normal y Difícil

export function useIA() {
  // ============================================================================
  // NIVEL FÁCIL - Jugadas aleatorias
  // ============================================================================
  const jugarFacil = (tablero) => {
    const celdasVacias = tablero
      .map((celda, indice) => (celda === null ? indice : null))
      .filter((indice) => indice !== null)

    const indiceAleatorio = Math.floor(Math.random() * celdasVacias.length)
    return celdasVacias[indiceAleatorio]
  }

  // ============================================================================
  // NIVEL NORMAL - Bloquea al jugador e intenta ganar
  // ============================================================================
  const jugarNormal = (tablero, fichaIA, fichaUsuario) => {
    const combinacionesGanadoras = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    // 1. Intentar ganar si puede
    for (const combinacion of combinacionesGanadoras) {
      const [a, b, c] = combinacion
      const valores = [tablero[a], tablero[b], tablero[c]]

      // Completar una línea cuando la IA tiene dos fichas
      if (valores.filter((valor) => valor === fichaIA).length === 2 && valores.includes(null)) {
        if (tablero[a] === null) return a
        if (tablero[b] === null) return b
        if (tablero[c] === null) return c
      }
    }

    // 2. Bloquear al jugador si va a ganar
    for (const combinacion of combinacionesGanadoras) {
      const [a, b, c] = combinacion
      const valores = [tablero[a], tablero[b], tablero[c]]

      // Bloquear una línea cuando el usuario tiene dos fichas
      if (
        valores.filter((valor) => valor === fichaUsuario).length === 2 &&
        valores.includes(null)
      ) {
        if (tablero[a] === null) return a
        if (tablero[b] === null) return b
        if (tablero[c] === null) return c
      }
    }

    // 3. Si no puede ganar ni necesita bloquear, jugar random
    return jugarFacil(tablero)
  }

  // ============================================================================
  // NIVEL DIFÍCIL - Algoritmo Minimax (imposible de vencer)
  // ============================================================================
  const jugarDificil = (tablero, fichaIA, fichaUsuario) => {
    const mejorJugada = minimax(tablero, fichaIA, fichaIA, fichaUsuario)
    return mejorJugada.indice
  }

  // Algoritmo Minimax
  const minimax = (tableroActual, fichaTurno, fichaIA, fichaUsuario) => {
    const celdasVacias = tableroActual
      .map((celda, indice) => (celda === null ? indice : null))
      .filter((indice) => indice !== null)

    // Verificar estado terminal (ganador o empate)
    const ganador = verificarGanadorMinimax(tableroActual)
    if (ganador === fichaUsuario) return { puntaje: -10 }
    if (ganador === fichaIA) return { puntaje: 10 }
    if (celdasVacias.length === 0) return { puntaje: 0 }

    const jugadas = []

    for (const indice of celdasVacias) {
      const jugada = {}
      jugada.indice = indice

      // Simular jugada
      tableroActual[indice] = fichaTurno

      // Recursión
      const siguienteFicha = fichaTurno === fichaIA ? fichaUsuario : fichaIA
      const resultado = minimax(tableroActual, siguienteFicha, fichaIA, fichaUsuario)
      jugada.puntaje = resultado.puntaje

      // Deshacer jugada
      tableroActual[indice] = null
      jugadas.push(jugada)
    }

    // Elegir mejor jugada
    let mejorJugada
    if (fichaTurno === fichaIA) {
      let mejorPuntaje = -Infinity
      for (const jugada of jugadas) {
        if (jugada.puntaje > mejorPuntaje) {
          mejorPuntaje = jugada.puntaje
          mejorJugada = jugada
        }
      }
    } else {
      let mejorPuntaje = Infinity
      for (const jugada of jugadas) {
        if (jugada.puntaje < mejorPuntaje) {
          mejorPuntaje = jugada.puntaje
          mejorJugada = jugada
        }
      }
    }

    return mejorJugada
  }

  // Verificar ganador para Minimax (sin efectos secundarios)
  const verificarGanadorMinimax = (tablero) => {
    const combinacionesGanadoras = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (const combinacion of combinacionesGanadoras) {
      const [a, b, c] = combinacion
      if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
        return tablero[a]
      }
    }
    return null
  }

  // ============================================================================
  // FUNCIÓN PRINCIPAL - Ejecutar jugada según dificultad
  // ============================================================================
  const ejecutarJugadaIA = (tablero, dificultad, fichaIA = 'O', fichaUsuario = 'X') => {
    switch (dificultad) {
      case 'facil':
        return jugarFacil(tablero)
      case 'normal':
        return jugarNormal(tablero, fichaIA, fichaUsuario)
      case 'dificil':
        return jugarDificil(tablero, fichaIA, fichaUsuario)
      default:
        return jugarNormal(tablero, fichaIA, fichaUsuario)
    }
  }

  return {
    ejecutarJugadaIA,
  }
}
