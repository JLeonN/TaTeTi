<template>
  <div class="controles-juego">
    <button
      class="boton-base boton-primario boton-con-efecto boton-icono-rotante"
      @click="manejarReiniciar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icono-reiniciar"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1.002 7.935 1.007 9.425 4.747" />
        <path d="M20 4v5h-5" />
      </svg>
      <span>Reiniciar Juego</span>
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['reiniciar', 'volver'])

const manejarReiniciar = () => {
  emit('reiniciar')
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
    width: 100%;
  }
}
</style>
