<template>
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
</template>

<script setup>
import CeldaTaTeTi from './CeldaTaTeTi.vue'

const { tablero, juegoTerminado } = defineProps({
  tablero: {
    type: Array,
    required: true,
  },
  juegoTerminado: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['jugada'])

const manejarClickCelda = (indice) => {
  // Aquí se usa 'emit', que se definió con 'defineEmits'
  emit('jugada', indice)
}
</script>

<style scoped>
.tablero-tateti {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
  max-width: 400px;
  width: 100%;
  aspect-ratio: 1;
  padding: 20px;
  /* Utiliza variables CSS para un mejor manejo del tema */
  background-color: var(--color-fondo);
  border-radius: 12px;
  box-shadow: 0 8px 24px var(--sombra-tablero);
}
@media (max-width: 600px) {
  .tablero-tateti {
    max-width: 90vw;
    padding: 15px;
    gap: 6px;
  }
}
</style>
