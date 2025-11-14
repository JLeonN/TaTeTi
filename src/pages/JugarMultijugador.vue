<template>
  <q-page class="pagina-tateti">
    <div class="contenedor-juego">
      <InfoJuego
        :turno-actual="turnoActual"
        :juego-terminado="juegoTerminado"
        :ganador="ganador"
        :es-empate="esEmpate"
        :nombre-jugador-x="nombreJugador1"
        :nombre-jugador-o="nombreJugador2"
      />

      <TableroTaTeTi
        :tablero="tablero"
        :juego-terminado="juegoTerminado"
        :combinacion-ganadora="combinacionGanadora"
        :ganador="ganador"
        @jugada="manejarJugada"
      />

      <ControlesJuego />
    </div>

    <!-- Modal de resultado -->
    <ModalResultado
      v-model="mostrarModal"
      :ganador="ganador"
      :es-empate="esEmpate"
      :nombre-jugador-x="nombreJugador1"
      :nombre-jugador-o="nombreJugador2"
      @reiniciar="reiniciarJuego"
    />
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useTaTeTi } from 'src/components/Composables/useTaTeTi'
import { usePublicidad } from 'src/components/Composables/usePublicidad'
import { useContadorPartidas } from 'src/components/Composables/useContadorPartidas'
import { useI18n } from 'vue-i18n'
import TableroTaTeTi from 'src/components/TaTeTi/TableroTaTeTi.vue'
import InfoJuego from 'src/components/TaTeTi/InfoJuego.vue'
import ControlesJuego from 'src/components/TaTeTi/ControlesJuego.vue'
import ModalResultado from 'src/components/TaTeTi/Compartido/ModalResultado.vue'

const { t } = useI18n()

const {
  tablero,
  turnoActual,
  juegoTerminado,
  ganador,
  combinacionGanadora,
  esEmpate,
  realizarJugada,
  reiniciarJuego: reiniciarJuegoBase,
} = useTaTeTi('pvp')

const { prepararIntersticial, mostrarIntersticial } = usePublicidad()
const { cargarContador, incrementarPartida } = useContadorPartidas()

const mostrarModal = ref(false)

// Nombres de jugadores
const nombreJugador1 = ref('')
const nombreJugador2 = ref('')

onMounted(async () => {
  nombreJugador1.value = t('juego.jugador1')
  nombreJugador2.value = t('juego.jugador2')

  // Cargar contador y preparar intersticial
  await cargarContador()
  await prepararIntersticial()
})

// Manejar jugada del jugador
const manejarJugada = (indice) => {
  if (juegoTerminado.value || tablero.value[indice]) {
    return
  }
  realizarJugada(indice)
}

// Reiniciar juego
const reiniciarJuego = () => {
  reiniciarJuegoBase()
  mostrarModal.value = false
}

// Watcher para abrir el modal cuando termina el juego
watch(juegoTerminado, async (nuevoValor) => {
  if (nuevoValor) {
    // Incrementar contador de partidas y verificar intersticial
    const mostrarAd = await incrementarPartida()

    if (mostrarAd) {
      // Mostrar intersticial antes del modal
      await mostrarIntersticial()
      // Preparar el siguiente intersticial
      setTimeout(async () => {
        await prepararIntersticial()
      }, 1000)
    }

    setTimeout(() => {
      mostrarModal.value = true
    }, 800) // Delay para que se vea la línea ganadora primero
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
