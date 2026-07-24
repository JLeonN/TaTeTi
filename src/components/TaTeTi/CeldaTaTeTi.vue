<template>
  <div
    class="celda-tateti"
    :class="{
      'celda-ocupada': valor,
      'celda-clickeable': !valor && !juegoTerminado,
    }"
    @click="manejarClick"
  >
    <FichaVisual v-if="valor" class="ficha" :ficha="valor" tamano="3rem" />
  </div>
</template>

<script setup>
import FichaVisual from './Compartido/FichaVisual.vue'

const props = defineProps({
  valor: {
    type: String,
    default: null,
  },
  indice: {
    type: Number,
    required: true,
  },
  juegoTerminado: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const manejarClick = () => {
  if (!props.valor && !props.juegoTerminado) {
    emit('click', props.indice)
  }
}
</script>

<style scoped>
.celda-tateti {
  width: 100%;
  height: 100%;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-tablero);
  border: 2px solid var(--color-borde-tablero);
  transition: all 0.2s ease;
  cursor: not-allowed;
}
.celda-clickeable {
  cursor: pointer;
}
.celda-clickeable:hover {
  background-color: var(--color-fondo-alterno);
  border-color: var(--color-turno-activo);
}
.celda-ocupada {
  cursor: not-allowed;
}
.ficha {
  animation: aparecerFicha 0.3s ease;
}
@keyframes aparecerFicha {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
