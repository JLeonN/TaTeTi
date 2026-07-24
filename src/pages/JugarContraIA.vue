<template>
  <q-page class="pagina-tateti">
    <div class="contenedor-juego">
      <SelectorDificultad
        :racha="rachaActual"
        :derrotas="derrotasActuales"
        :proteccion-activa="proteccionActiva"
        :puntos-proxima-victoria="puntosProximaVictoria"
        :puntos-proxima-derrota="puntosProximaDerrota"
        @cambio-dificultad="cambiarDificultad"
      />

      <InfoJuego
        :turno-actual="turnoActual"
        :juego-terminado="juegoTerminado"
        :ganador="ganador"
        :es-empate="esEmpate"
        :nombre-jugador-x="nombreJugadorX"
        :nombre-jugador-o="nombreJugadorO"
        :puede-seleccionar-ficha="puedeSeleccionarFicha"
        @seleccionar-ficha="abrirSelectorFicha"
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
      :nombre-jugador-x="nombreJugadorX"
      :nombre-jugador-o="nombreJugadorO"
      :puntos-ganados="puntosGanadosPartida"
      :puntaje-total="puntajeTotal"
      @reiniciar="reiniciarJuego"
    />

    <ModalConfirmacion
      v-model="mostrarSelectorFicha"
      :titulo="t('juego.seleccionarFicha')"
      :mensaje="t('juego.seleccionarFichaDescripcion')"
      icono="shapes"
      :texto-boton-aceptar="t('general.guardar')"
      :texto-boton-cancelar="t('general.cancelar')"
      @aceptar="confirmarFicha"
      @cancelar="cancelarSeleccionFicha"
    >
      <div class="selector-fichas">
        <button
          type="button"
          class="opcion-ficha opcion-ficha-x"
          :class="{ activa: fichaSeleccionada === 'X' }"
          @click="fichaSeleccionada = 'X'"
        >
          <span class="simbolo-ficha">X</span>
          <span>{{ t('juego.fichaX') }}</span>
        </button>
        <button
          type="button"
          class="opcion-ficha opcion-ficha-o"
          :class="{ activa: fichaSeleccionada === 'O' }"
          @click="fichaSeleccionada = 'O'"
        >
          <span class="simbolo-ficha">O</span>
          <span>{{ t('juego.fichaO') }}</span>
        </button>
      </div>
    </ModalConfirmacion>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useTaTeTi } from 'src/components/Composables/useTaTeTi'
import { useIA } from 'src/components/Composables/useIA'
import { useConfiguracion } from 'src/components/Composables/useConfiguracion'
import { usePuntuacion } from 'src/components/Composables/usePuntuacion'
import { usePublicidad } from 'src/components/Composables/usePublicidad'
import { useContadorPartidas } from 'src/components/Composables/useContadorPartidas'
import { useFichaJugador } from 'src/components/Composables/UseFichaJugador'
import { useI18n } from 'vue-i18n'
import TableroTaTeTi from 'src/components/TaTeTi/TableroTaTeTi.vue'
import InfoJuego from 'src/components/TaTeTi/InfoJuego.vue'
import SelectorDificultad from 'src/components/TaTeTi/JugarVsIA/SelectorDificultad.vue'
import ModalResultado from 'src/components/TaTeTi/Compartido/ModalResultado.vue'
import ModalConfirmacion from 'src/components/Modales/ModalConfirmacion.vue'
import { inicializarBaseEstadisticas } from 'src/Servicios/Estadisticas/BaseDatosEstadisticas'
import { registroPartida } from 'src/Servicios/Estadisticas/RegistroPartida'
import { usarEconomia } from 'src/Servicios/Economia/ServicioEconomia'

const { t } = useI18n()
const nombreIA = ref('')
const { nombreUsuario, cargarNombre } = useConfiguracion()
const { fichaUsuario, fichaIA, cargarFichaUsuario, guardarFichaUsuario } = useFichaJugador()
const { equipamiento } = usarEconomia()

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
  obtenerEstadoPuntuacion,
  obtenerProteccionActiva,
  calcularPuntosProximaVictoria,
  calcularPuntosProximaDerrota,
} = usePuntuacion()

const { prepararIntersticial, mostrarIntersticial } = usePublicidad()
const { cargarContador, incrementarPartida } = useContadorPartidas()

const dificultadActual = ref('normal')
const mostrarModal = ref(false)
const mostrarSelectorFicha = ref(false)
const fichaSeleccionada = ref('X')
const puntosGanadosPartida = ref(null)

// Computeds para racha y derrotas actuales
const rachaActual = computed(() => obtenerRacha(dificultadActual.value))
const derrotasActuales = computed(() => obtenerDerrotasConsecutivas(dificultadActual.value))
const proteccionActiva = computed(() => obtenerProteccionActiva(dificultadActual.value))
const puntosProximaVictoria = computed(() => calcularPuntosProximaVictoria(dificultadActual.value))
const puntosProximaDerrota = computed(() => calcularPuntosProximaDerrota(dificultadActual.value))
const nombreJugadorX = computed(() =>
  fichaUsuario.value === 'X' ? nombreUsuario.value : nombreIA.value,
)
const nombreJugadorO = computed(() =>
  fichaUsuario.value === 'O' ? nombreUsuario.value : nombreIA.value,
)
const puedeSeleccionarFicha = computed(() => {
  return (
    tablero.value.every((celda) => celda === null) &&
    !juegoTerminado.value &&
    !esperandoIA.value &&
    turnoActual.value === fichaUsuario.value
  )
})

onMounted(async () => {
  await cargarNombre()
  await cargarFichaUsuario()
  reiniciarJuegoBase(fichaUsuario.value)
  await cargarPuntuacion()
  await cargarContador()
  nombreIA.value = t('juego.nexus')
  try {
    await inicializarBaseEstadisticas()
    await registroPartida.inicializar()
    registroPartida.prepararTurnoUsuario()
  } catch (error) {
    console.error('Error al inicializar las estadísticas:', error)
  }

  // Preparar intersticial para cuando se necesite
  await prepararIntersticial()
})

// Cambiar dificultad y reiniciar juego
const cambiarDificultad = async (nuevaDificultad) => {
  if (nuevaDificultad === dificultadActual.value) return
  await registroPartida.abandonar('cambioDificultad')
  dificultadActual.value = nuevaDificultad
  reiniciarJuegoBase(fichaUsuario.value)
  mostrarModal.value = false
  puntosGanadosPartida.value = null
  registroPartida.prepararTurnoUsuario()
}

// Manejar jugada del usuario
const manejarJugada = async (indice) => {
  // Validaciones: que no esté esperando IA, que no esté terminado, que la celda esté vacía
  if (
    esperandoIA.value ||
    juegoTerminado.value ||
    turnoActual.value !== fichaUsuario.value ||
    tablero.value[indice]
  ) {
    return
  }

  await registroPartida.iniciarPartida({
    dificultad: dificultadActual.value,
    fichaUsuario: fichaUsuario.value,
    fichaIA: fichaIA.value,
    simboloUsuarioId: equipamiento.value[fichaUsuario.value]?.simbolo ?? 'simboloX',
    simboloIAId: equipamiento.value[fichaIA.value]?.simbolo ?? 'simboloO',
    puntosIniciales: puntajeTotal.value,
    estadoInicial: obtenerEstadoPuntuacion(dificultadActual.value),
  })

  // Realizar jugada del usuario
  const jugadaExitosa = realizarJugada(indice)
  if (jugadaExitosa) {
    await registroPartida.registrarTurnoUsuario(indice, [...tablero.value])
  }

  // Si la jugada fue exitosa y el juego no terminó, es turno de la IA
  if (jugadaExitosa && !juegoTerminado.value && turnoActual.value === fichaIA.value) {
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
  registroPartida.iniciarTurnoIA()
  const indiceIA = ejecutarJugadaIA(
    tablero.value,
    dificultadActual.value,
    fichaIA.value,
    fichaUsuario.value,
  )

  console.log('🤖 IA va a jugar en celda:', indiceIA)
  console.log('📊 Estado del tablero ANTES:', [...tablero.value])

  // Realizar jugada de la IA
  realizarJugada(indiceIA)
  await registroPartida.registrarTurnoIA(indiceIA, [...tablero.value])

  console.log('📊 Estado del tablero DESPUÉS:', [...tablero.value])

  esperandoIA.value = false
  if (!juegoTerminado.value) registroPartida.prepararTurnoUsuario()
}

// Reiniciar juego
const reiniciarJuego = async () => {
  await registroPartida.abandonar('reinicio')
  reiniciarJuegoBase(fichaUsuario.value)
  mostrarModal.value = false
  puntosGanadosPartida.value = null
  registroPartida.prepararTurnoUsuario()
}

const abrirSelectorFicha = () => {
  if (!puedeSeleccionarFicha.value) return
  fichaSeleccionada.value = fichaUsuario.value
  mostrarSelectorFicha.value = true
}

const confirmarFicha = async () => {
  if (!puedeSeleccionarFicha.value) return
  const guardada = await guardarFichaUsuario(fichaSeleccionada.value)
  if (guardada) {
    reiniciarJuegoBase(fichaUsuario.value)
    registroPartida.prepararTurnoUsuario()
  }
}

const cancelarSeleccionFicha = () => {
  fichaSeleccionada.value = fichaUsuario.value
}

// Watcher para procesar resultado cuando termina el juego
watch(juegoTerminado, async (nuevoValor) => {
  if (nuevoValor) {
    // Determinar resultado
    let resultado = ''
    if (ganador.value === fichaUsuario.value) {
      resultado = 'victoria'
    } else if (ganador.value === fichaIA.value) {
      resultado = 'derrota'
    } else if (esEmpate.value) {
      resultado = 'empate'
    }

    // Procesar puntuación
    const idPartida = registroPartida.obtenerIdPartida()
    const resultadoPuntuacion = await procesarResultado(
      resultado,
      dificultadActual.value,
      idPartida ? `partida:${idPartida}` : `partida:${Date.now()}`,
    )
    puntosGanadosPartida.value = resultadoPuntuacion.puntosGanados
    await registroPartida.finalizar(resultado, resultadoPuntuacion, combinacionGanadora.value)

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

const abandonarPorSalida = async () => {
  try {
    await registroPartida.abandonar('salidaPagina')
  } catch (error) {
    console.error('Error al registrar el abandono:', error)
  }
}

onBeforeRouteLeave(async () => {
  await abandonarPorSalida()
})

onBeforeUnmount(() => {
  void abandonarPorSalida()
})
</script>

<style scoped>
.pagina-tateti {
  --alto-elementos-juego: 142px;
  background-color: var(--color-fondo);
  display: flex;
  align-items: center;
  justify-content: center;
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
  --alto-elementos-juego: 204px;
}
.selector-fichas {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.opcion-ficha {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  color: var(--color-texto-secundario);
  background-color: var(--color-tablero);
  border: 2px solid var(--color-borde-tablero);
  border-radius: 10px;
  cursor: pointer;
}
.opcion-ficha.activa {
  color: var(--color-texto-principal);
  border-color: var(--color-turno-activo);
  box-shadow: 0 0 12px var(--color-boton);
}
.simbolo-ficha {
  font-size: 2.5rem;
  font-weight: bold;
}
.opcion-ficha-x .simbolo-ficha {
  color: var(--color-ficha-x);
  text-shadow: var(--sombra-ficha-x);
}
.opcion-ficha-o .simbolo-ficha {
  color: var(--color-ficha-o);
  text-shadow: var(--sombra-ficha-o);
}
</style>
