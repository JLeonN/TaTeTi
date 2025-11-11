<template>
  <transition name="modal-fade">
    <div v-if="modelValue" class="modal-overlay" @click="manejarReiniciar">
      <div class="modal-contenido" @click.stop>
        <!-- Ícono -->
        <div class="modal-icono">
          <i v-if="ganador" class="ti ti-trophy icono-modal icono-exito"></i>
          <i v-else-if="esEmpate" class="ti ti-handshake icono-modal"></i>
        </div>

        <!-- Mensaje -->
        <div class="modal-mensaje">
          <h2 v-if="ganador" class="titulo-h2">
            ¡<span :class="`jugador-${ganador.toLowerCase()}`">{{ nombreGanador }}</span>
            {{ t('juego.ganador') }}!
          </h2>
          <h2 v-else-if="esEmpate" class="titulo-h2">{{ t('juego.empate') }}</h2>
        </div>

        <!-- Botón -->
        <button class="boton-base boton-primario boton-con-efecto" @click="manejarReiniciar">
          <i class="ti ti-refresh icono-md"></i>
          <span>{{ t('juego.jugarDeNuevo') }}</span>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  ganador: {
    type: String,
    default: null,
  },
  esEmpate: {
    type: Boolean,
    default: false,
  },
  nombreJugadorX: {
    type: String,
    default: 'Jugador 1',
  },
  nombreJugadorO: {
    type: String,
    default: 'Jugador 2',
  },
})

const emit = defineEmits(['reiniciar', 'update:modelValue'])

const nombreGanador = computed(() => {
  if (!props.ganador) return ''
  return props.ganador === 'X' ? props.nombreJugadorX : props.nombreJugadorO
})

const manejarReiniciar = () => {
  emit('update:modelValue', false)
  emit('reiniciar')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}
.modal-contenido {
  background-color: var(--color-modal-fondo);
  border: 3px solid var(--color-borde-modal);
  border-radius: 16px;
  padding: 40px 32px;
  max-width: 400px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  box-shadow: 0 10px 40px var(--sombra-modal);
  animation: modal-scale 0.3s ease-out;
}
.modal-icono {
  font-size: 5rem;
  animation: icono-bounce 0.6s ease-out;
}
.modal-mensaje {
  text-align: center;
}
.modal-mensaje h2 {
  margin: 0;
  animation: texto-fade-in 0.5s ease-out 0.2s backwards;
}
.jugador-x {
  color: var(--color-ficha-x);
  text-shadow: 0 0 20px var(--color-ficha-x);
}
.jugador-o {
  color: var(--color-ficha-o);
  text-shadow: 0 0 20px var(--color-ficha-o);
}
.modal-contenido button {
  animation: boton-fade-in 0.5s ease-out 0.3s backwards;
}
/* Animación de entrada del modal */
@keyframes modal-scale {
  from {
    transform: scale(0.7);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
/* Animación del ícono */
@keyframes icono-bounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
/* Animación del texto */
@keyframes texto-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Animación del botón */
@keyframes boton-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Transición del overlay */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
@media (max-width: 600px) {
  .modal-contenido {
    padding: 32px 24px;
  }
  .modal-icono {
    font-size: 4rem;
  }
}
</style>
