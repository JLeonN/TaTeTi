<template>
  <q-page class="pagina-tateti">
    <div class="contenedor-juego">
      <h1 class="titulo-juego">Ta-Te-Ti</h1>

      <InfoJuego
        :turno-actual="turnoActual"
        :juego-terminado="juegoTerminado"
        :ganador="ganador"
        :es-empate="esEmpate"
      />

      <TableroTaTeTi
        :tablero="tablero"
        :juego-terminado="juegoTerminado"
        :combinacion-ganadora="combinacionGanadora"
        :ganador="ganador"
        @jugada="realizarJugada"
      />

      <ControlesJuego @reiniciar="reiniciarJuego" @volver="volverAlInicio" />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useTaTeTi } from 'src/components/Composables/useTaTeTi'
import TableroTaTeTi from 'src/components/TaTeTi/TableroTaTeTi.vue'
import InfoJuego from 'src/components/TaTeTi/InfoJuego.vue'
import ControlesJuego from 'src/components/TaTeTi/ControlesJuego.vue'

const router = useRouter()

const {
  tablero,
  turnoActual,
  juegoTerminado,
  ganador,
  combinacionGanadora,
  esEmpate,
  realizarJugada,
  reiniciarJuego,
} = useTaTeTi()

const volverAlInicio = () => {
  router.push('/')
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
.titulo-juego {
  color: var(--color-texto-principal);
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: -40px;
  text-align: center;
  text-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);
}
@media (max-width: 600px) {
  .titulo-juego {
    font-size: 2rem;
    margin-bottom: 20px;
  }
}
</style>
