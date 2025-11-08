<template>
  <q-page class="pagina-tateti">
    <div class="contenedor-juego">
      <InfoJuego
        :turno-actual="turnoActual"
        :juego-terminado="juegoTerminado"
        :ganador="ganador"
        :es-empate="esEmpate"
        nombre-jugador-x="Jugador 1"
        nombre-jugador-o="Jugador 2"
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
      nombre-jugador-x="Jugador 1"
      nombre-jugador-o="Jugador 2"
      @reiniciar="reiniciarJuego"
    />
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useTaTeTi } from 'src/components/Composables/useTaTeTi'
import TableroTaTeTi from 'src/components/TaTeTi/TableroTaTeTi.vue'
import InfoJuego from 'src/components/TaTeTi/InfoJuego.vue'
import ControlesJuego from 'src/components/TaTeTi/ControlesJuego.vue'
import ModalResultado from 'src/components/TaTeTi/ModalResultado.vue'

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

const mostrarModal = ref(false)

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
watch(juegoTerminado, (nuevoValor) => {
  if (nuevoValor) {
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
