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

        <!-- Puntos ganados/perdidos -->
        <div v-if="puntosGanados !== null" class="puntos-resultado">
          <div v-if="puntosGanados > 0" class="puntos-positivos">
            <i class="ti ti-circle-plus icono-lg"></i>
            <span class="puntos-valor">+{{ puntosGanados }}</span>
            <span class="puntos-texto">{{ t('puntuacion.puntos') }}</span>
          </div>
          <div v-else-if="puntosGanados < 0" class="puntos-negativos">
            <i class="ti ti-circle-minus icono-lg"></i>
            <span class="puntos-valor">{{ puntosGanados }}</span>
            <span class="puntos-texto">{{ t('puntuacion.puntos') }}</span>
          </div>
          <div v-else class="puntos-neutros">
            <i class="ti ti-equal icono-lg"></i>
            <span class="puntos-valor">{{ puntosGanados }}</span>
            <span class="puntos-texto">{{ t('puntuacion.puntos') }}</span>
          </div>
        </div>

        <!-- Puntaje total -->
        <div v-if="puntajeTotal !== null" class="puntaje-total">
          <i class="ti ti-trophy icono-md icono-primario"></i>
          <span class="total-texto">{{ t('puntuacion.puntos') }}:</span>
          <span class="total-valor">{{ puntajeTotal }}</span>
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
  puntosGanados: {
    type: Number,
    default: null,
  },
  puntajeTotal: {
    type: Number,
    default: null,
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
  inset: 0;
  box-sizing: border-box;
  width: 100%;
  height: var(--altura-pantalla);
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  padding-bottom: calc(20px + var(--espacio-inferior-contenido));
  overflow-y: auto;
  z-index: 9999;
  backdrop-filter: blur(4px);
}
.modal-contenido {
  background-color: var(--color-modal-fondo);
  border: 3px solid var(--color-borde-modal);
  border-radius: 16px;
  padding: 40px 32px;
  max-width: 400px;
  max-height: calc(var(--altura-pantalla) - var(--espacio-inferior-contenido) - 40px);
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  overflow-y: auto;
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
/* Puntos resultado */
.puntos-resultado {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: bold;
  animation: texto-fade-in 0.5s ease-out 0.3s backwards;
}
.puntos-positivos {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--color-exito) 0%, #00b386 100%);
  padding: 16px 24px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 217, 163, 0.4);
}
.puntos-negativos {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--color-error) 0%, #ff3838 100%);
  padding: 16px 24px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 16px rgba(255, 71, 87, 0.4);
}
.puntos-neutros {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--color-texto-secundario) 0%, #9b8bd6 100%);
  padding: 16px 24px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 16px rgba(196, 181, 253, 0.4);
}
.puntos-valor {
  font-size: 2rem;
  font-weight: bold;
}
.puntos-texto {
  font-size: 1rem;
  opacity: 0.9;
}
/* Puntaje total */
.puntaje-total {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background-color: var(--color-fondo-alterno);
  border: 2px solid var(--color-borde-tablero);
  border-radius: 10px;
  animation: texto-fade-in 0.5s ease-out 0.4s backwards;
}
.total-texto {
  font-size: 1rem;
  color: var(--color-texto-secundario);
  font-weight: 600;
}
.total-valor {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-texto-principal);
}
.modal-contenido button {
  animation: boton-fade-in 0.5s ease-out 0.5s backwards;
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
    width: 100%;
  }
  .modal-icono {
    font-size: 4rem;
  }
  .puntos-valor {
    font-size: 1.5rem;
  }
  .puntos-texto {
    font-size: 0.9rem;
  }
  .total-valor {
    font-size: 1.3rem;
  }
}
</style>
