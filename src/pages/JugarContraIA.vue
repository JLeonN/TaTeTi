<template>
  <q-page class="pagina-tateti">
    <div class="contenedor-juego">
      <SelectorDificultad
        :racha="rachaActual"
        :derrotas="derrotasActuales"
        :proteccion-activa="proteccionActiva"
        @cambio-dificultad="cambiarDificultad"
      />

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
    </div>

    <!-- Modal de resultado -->
    <ModalResultado
      v-model="mostrarModal"
      :ganador="ganador"
      :es-empate="esEmpate"
      :nombre-jugador-x="nombreUsuario"
      :nombre-jugador-o="nombreIA"
      :puntos-ganados="puntosGanadosPartida"
      :puntaje-total="puntajeTotal"
      @reiniciar="reiniciarJuego"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useTaTeTi } from 'src/components/Composables/useTaTeTi'
import { useIA } from 'src/components/Composables/useIA'
import { useConfiguracion } from 'src/components/Composables/useConfiguracion'
import { usePuntuacion } from 'src/components/Composables/usePuntuacion'
import { usePublicidad } from 'src/components/Composables/usePublicidad'
import { useContadorPartidas } from 'src/components/Composables/useContadorPartidas'
import { useI18n } from 'vue-i18n'
import TableroTaTeTi from 'src/components/TaTeTi/TableroTaTeTi.vue'
import InfoJuego from 'src/components/TaTeTi/InfoJuego.vue'
import SelectorDificultad from 'src/components/TaTeTi/JugarVsIA/SelectorDificultad.vue'
import ModalResultado from 'src/components/TaTeTi/Compartido/ModalResultado.vue'

const { t } = useI18n()
const nombreIA = ref('')
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

const {
  puntajeTotal,
  cargarPuntuacion,
  procesarResultado,
  obtenerRacha,
  obtenerDerrotasConsecutivas,
} = usePuntuacion()

const { prepararIntersticial, mostrarIntersticial } = usePublicidad()
const { cargarContador, incrementarPartida } = useContadorPartidas()

const dificultadActual = ref('normal')
const mostrarModal = ref(false)
const puntosGanadosPartida = ref(null)
const proteccionActiva = ref(false)

// Computeds para racha y derrotas actuales
const rachaActual = computed(() => obtenerRacha(dificultadActual.value))
const derrotasActuales = computed(() => obtenerDerrotasConsecutivas(dificultadActual.value))

onMounted(async () => {
  await cargarNombre()
  await cargarPuntuacion()
  await cargarContador()
  nombreIA.value = t('juego.nexus')

  // Preparar intersticial para cuando se necesite
  await prepararIntersticial()
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
  mostrarModal.value = false
  puntosGanadosPartida.value = null
}

// Watcher para procesar resultado cuando termina el juego
watch(juegoTerminado, async (nuevoValor) => {
  if (nuevoValor) {
    // Determinar resultado
    let resultado = ''
    if (ganador.value === 'X') {
      resultado = 'victoria'
    } else if (ganador.value === 'O') {
      resultado = 'derrota'
    } else if (esEmpate.value) {
      resultado = 'empate'
    }

    // Procesar puntuación
    const resultadoPuntuacion = await procesarResultado(resultado, dificultadActual.value)
    puntosGanadosPartida.value = resultadoPuntuacion.puntosGanados
    proteccionActiva.value = resultadoPuntuacion.proteccionActiva

    console.log('🎯 Resultado procesado:', {
      resultado,
      puntos: resultadoPuntuacion.puntosGanados,
      total: resultadoPuntuacion.puntajeTotal,
      racha: resultadoPuntuacion.racha,
      proteccion: resultadoPuntuacion.proteccionActiva,
    })

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

    // Abrir modal después de un delay
    setTimeout(() => {
      mostrarModal.value = true
    }, 800) // Delay para que se vea la línea ganadora primero
  }
})
</script>

<style scoped>
.pagina-tateti {
  --alto-elementos-juego: 142px;
  background-color: var(--color-fondo);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 12px;
  overflow-y: auto;
}
.contenedor-juego {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-block: auto;
}
.contenedor-juego:has(> .selector-dificultad.con-indicadores) {
  --alto-elementos-juego: 190px;
}
</style>
