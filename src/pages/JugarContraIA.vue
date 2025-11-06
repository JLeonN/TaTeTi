<template>
  <q-page class="pagina-tateti">
    <div class="contenedor-juego">
      <SelectorDificultad @cambio-dificultad="cambiarDificultad" />

      <InfoJuego
        :turno-actual="turnoActual"
        :juego-terminado="juegoTerminado"
        :ganador="ganador"
        :es-empate="esEmpate"
        :nombre-jugador-x="nombreUsuario"
        :nombre-jugador-o="nombreIA"
      />

      <TableroTaTeTi
        :tablero="tablero"
        :juego-terminado="juegoTerminado"
        :combinacion-ganadora="combinacionGanadora"
        :ganador="ganador"
        @jugada="manejarJugada"
      />

      <ControlesJuego @reiniciar="reiniciarJuego" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useTaTeTi } from 'src/components/Composables/useTaTeTi'
import { useIA } from 'src/components/Composables/useIA'
import { useConfiguracion } from 'src/components/Composables/useConfiguracion'
import TableroTaTeTi from 'src/components/TaTeTi/TableroTaTeTi.vue'
import InfoJuego from 'src/components/TaTeTi/InfoJuego.vue'
import ControlesJuego from 'src/components/TaTeTi/ControlesJuego.vue'
import SelectorDificultad from 'src/components/TaTeTi/SelectorDificultad.vue'

const nombreIA = 'NEXUS'

const { nombreUsuario, cargarNombre } = useConfiguracion()

const {
  tablero,
  turnoActual,
  juegoTerminado,
  ganador,
  combinacionGanadora,
  esEmpate,
  realizarJugada,
  reiniciarJuego: reiniciarJuegoBase,
  esperandoIA,
} = useTaTeTi('ia')

const { ejecutarJugadaIA } = useIA()

const dificultadActual = ref('normal')

onMounted(async () => {
  await cargarNombre()
})

// Cambiar dificultad y reiniciar juego
const cambiarDificultad = (nuevaDificultad) => {
  dificultadActual.value = nuevaDificultad
  reiniciarJuego()
}

// Manejar jugada del usuario
const manejarJugada = async (indice) => {
  // Si es turno de la IA o el juego terminó, no hacer nada
  if (turnoActual.value === 'O' || juegoTerminado.value || esperandoIA.value) {
    return
  }

  // Realizar jugada del usuario (X)
  const jugadaExitosa = realizarJugada(indice)

  // Si la jugada fue exitosa y el juego no terminó, es turno de la IA
  if (jugadaExitosa && !juegoTerminado.value) {
    await ejecutarTurnoIA()
  }
}

// Ejecutar turno de la IA con delay
const ejecutarTurnoIA = async () => {
  esperandoIA.value = true

  // Delay según dificultad
  const delays = {
    facil: 1000 + Math.random() * 500, // 1-1.5s
    normal: 700 + Math.random() * 300, // 0.7-1s
    dificil: 300 + Math.random() * 200, // 0.3-0.5s
  }

  const delay = delays[dificultadActual.value] || delays.normal

  await new Promise((resolve) => setTimeout(resolve, delay))

  // Obtener jugada de la IA
  const indiceIA = ejecutarJugadaIA(tablero.value, dificultadActual.value)

  // Realizar jugada de la IA
  realizarJugada(indiceIA)

  esperandoIA.value = false
}

// Reiniciar juego
const reiniciarJuego = () => {
  reiniciarJuegoBase()
}

// Watch para detectar si es turno de la IA al inicio (no debería pasar, pero por las dudas)
watch(turnoActual, async (nuevoTurno) => {
  if (nuevoTurno === 'O' && !juegoTerminado.value && !esperandoIA.value) {
    await ejecutarTurnoIA()
  }
})
</script>

<style scoped>
.pagina-tateti {
  background-color: var(--color-fondo);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.contenedor-juego {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
