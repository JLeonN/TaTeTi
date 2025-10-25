<template>
  <div class="controles-juego">
    <q-btn
      label="Reiniciar"
      icon="refresh"
      color="primary"
      unelevated
      size="lg"
      @click="manejarReiniciar"
    />

    <q-btn
      label="Volver"
      icon="arrow_back"
      color="secondary"
      outline
      size="lg"
      @click="manejarVolver"
    />
  </div>
</template>

<script setup>
const emit = defineEmits(['reiniciar', 'volver'])

const manejarReiniciar = () => {
  emit('reiniciar')
}

const manejarVolver = () => {
  emit('volver')
}
</script>

<style scoped>
.controles-juego {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 20px;
}
@media (max-width: 600px) {
  .controles-juego {
    flex-direction: column;
    width: 100%;
  }
  .controles-juego .q-btn {
    width: 100%;
  }
}
</style>
