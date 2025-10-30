<template>
  <div class="controles-juego">
    <button class="boton-reiniciar" @click="manejarReiniciar">
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
.boton-reiniciar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, var(--color-boton) 0%, var(--color-borde-tablero) 100%);
  border: 2px solid var(--color-borde-tablero);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--sombra-boton);
  position: relative;
  overflow: hidden;
}
.boton-reiniciar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-boton-hover) 0%, var(--color-turno-activo) 100%);
  transition: left 0.4s ease;
  z-index: 0;
}
.boton-reiniciar:hover::before {
  left: 0;
}
.boton-reiniciar:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px var(--sombra-boton);
  border-color: var(--color-boton-hover);
}
.boton-reiniciar:active {
  transform: translateY(-1px);
}
.boton-reiniciar span,
.icono-reiniciar {
  position: relative;
  z-index: 1;
}
.icono-reiniciar {
  animation: rotarIcono 2s ease-in-out infinite;
}
.boton-reiniciar:hover .icono-reiniciar {
  animation: rotarIconoRapido 0.6s ease-in-out;
}
@keyframes rotarIcono {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}
@keyframes rotarIconoRapido {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@media (max-width: 600px) {
  .controles-juego {
    width: 100%;
  }
  .boton-reiniciar {
    width: 100%;
    justify-content: center;
    padding: 16px 24px;
    font-size: 1rem;
  }
}
</style>
