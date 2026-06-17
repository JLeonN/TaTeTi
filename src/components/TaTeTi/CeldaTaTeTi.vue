<template>
  <div
    class="celda-tateti"
    :class="{
      'celda-ocupada': valor,
      'celda-clickeable': !valor && !juegoTerminado,
    }"
    @click="manejarClick"
  >
    <div v-if="valor" class="ficha" :class="`ficha-${valor.toLowerCase()}`">
      {{ valor }}
    </div>
  </div>
</template>

<script setup>
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
  font-size: 3rem;
  font-weight: bold;
  user-select: none;
  animation: aparecerFicha 0.3s ease;
}
.ficha-x {
  color: var(--color-ficha-x);
  text-shadow: var(--sombra-ficha-x);
}
.ficha-o {
  color: var(--color-ficha-o);
  text-shadow: var(--sombra-ficha-o);
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
