<template>
  <div class="controles-juego">
    <!-- El botón de reiniciar ya no existe aquí -->
    <!-- Este componente queda vacío por ahora, pero lo dejamos por si querés agregar otros controles más adelante -->
  </div>
</template>

<script setup>
// Ya no se necesita emitir 'reiniciar' desde aquí
// const emit = defineEmits(['volver'])
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
    width: 100%;
  }
}
</style>
