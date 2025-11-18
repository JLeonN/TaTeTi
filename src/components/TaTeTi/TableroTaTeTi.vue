<template>
  <div class="contenedor-tablero">
    <div class="tablero-tateti">
      <CeldaTaTeTi
        v-for="(valor, indice) in tablero"
        :key="indice"
        :valor="valor"
        :indice="indice"
        :juego-terminado="juegoTerminado"
        @click="manejarClickCelda"
      />
    </div>

    <svg
      v-if="combinacionGanadora"
      class="linea-ganadora"
      :class="`linea-${ganador.toLowerCase()}`"
      viewBox="0 0 400 400"
    >
      <line
        :x1="obtenerCoordenadasLinea().x1"
        :y1="obtenerCoordenadasLinea().y1"
        :x2="obtenerCoordenadasLinea().x2"
        :y2="obtenerCoordenadasLinea().y2"
        stroke-width="8"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<script setup>
// Se ha eliminado 'computed' ya que no se utiliza, arreglando el error (no-unused-vars)
import CeldaTaTeTi from './CeldaTaTeTi.vue'

const props = defineProps({
  tablero: {
    type: Array,
    required: true,
  },
  juegoTerminado: {
    type: Boolean,
    default: false,
  },
  combinacionGanadora: {
    type: Array,
    default: null,
  },
  ganador: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['jugada'])

const manejarClickCelda = (indice) => {
  emit('jugada', indice)
}

// Calcular coordenadas de la línea ganadora
const obtenerCoordenadasLinea = () => {
  if (!props.combinacionGanadora) return { x1: 0, y1: 0, x2: 0, y2: 0 }

  // Se omite la variable 'b' ya que no se usa, arreglando el error (no-unused-vars)
  const [a, , c] = props.combinacionGanadora

  // Convertir índice a coordenadas (x, y) en el grid 3x3
  const obtenerPosicion = (indice) => {
    const fila = Math.floor(indice / 3)
    const columna = indice % 3
    return {
      x: columna * 133.33 + 66.66, // Centro de cada celda
      y: fila * 133.33 + 66.66,
    }
  }

  const posInicio = obtenerPosicion(a)
  const posFin = obtenerPosicion(c)

  return {
    x1: posInicio.x,
    y1: posInicio.y,
    x2: posFin.x,
    y2: posFin.y,
  }
}
</script>

<style scoped>
.contenedor-tablero {
  position: relative;
  max-width: 400px;
  width: 100%;
}
.tablero-tateti {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 6px;
  width: 100%;
  aspect-ratio: 1;
  padding: 16px;
  background-color: var(--color-fondo);
  border-radius: 12px;
  box-shadow: 0 8px 24px var(--sombra-tablero);
}
.linea-ganadora {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}
.linea-ganadora line {
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  animation:
    dibujarLinea 0.8s ease-out forwards,
    pulsarNeon 1.5s ease-in-out infinite;
}
.linea-x line {
  stroke: var(--neon-x);
  filter: drop-shadow(var(--brillo-neon-x));
}
.linea-o line {
  stroke: var(--neon-o);
  filter: drop-shadow(var(--brillo-neon-o));
}
@keyframes dibujarLinea {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes pulsarNeon {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
@media (max-width: 600px) {
  .tablero-tateti {
    max-width: 90vw;
    padding: 15px;
    gap: 6px;
  }
}
</style>
