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
import { ref, onMounted } from 'vue'
import { useTaTeTi } from 'src/components/Composables/useTaTeTi'
import { useIA } from 'src/components/Composables/useIA'
import { useConfiguracion } from 'src/components/Composables/useConfiguracion'
import TableroTaTeTi from 'src/components/TaTeTi/TableroTaTeTi.vue'
import InfoJuego from 'src/components/TaTeTi/InfoJuego.vue'
import ControlesJuego from 'src/components/TaTeTi/ControlesJuego.vue'
import SelectorDificultad from 'src/components/TaTeTi/JugarVsIA/SelectorDificultad.vue'

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
  // Validaciones: que no esté esperando IA, que no esté terminado, que la celda esté vacía
  if (esperandoIA.value || juegoTerminado.value || tablero.value[indice]) {
    return
  }

  // Realizar jugada del usuario (X)
  const jugadaExitosa = realizarJugada(indice)

  // Si la jugada fue exitosa y el juego no terminó, es turno de la IA
  if (jugadaExitosa && !juegoTerminado.value && turnoActual.value === 'O') {
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

  console.log('🤖 IA va a jugar en celda:', indiceIA)
  console.log('📊 Estado del tablero ANTES:', [...tablero.value])

  // Realizar jugada de la IA
  realizarJugada(indiceIA)

  console.log('📊 Estado del tablero DESPUÉS:', [...tablero.value])

  esperandoIA.value = false
}

// Reiniciar juego
const reiniciarJuego = () => {
  reiniciarJuegoBase()
}
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
