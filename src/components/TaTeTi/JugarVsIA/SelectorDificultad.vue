<template>
  <div class="selector-dificultad" :class="{ 'con-indicadores': mostrarIndicadores }">
    <!-- Indicadores de racha (ancho completo, arriba de todos los botones) -->
    <transition name="slide-down">
      <div v-if="mostrarIndicadores" class="contenedor-indicadores">
        <div v-if="racha > 0" class="indicador-item racha-positiva">
          <i class="ti ti-flame icono-sm"></i>
          <div class="indicador-texto">
            <div class="indicador-renglon">
              <span class="indicador-numero">{{ racha }}</span>
              <span class="indicador-label">{{
                racha === 1 ? t('puntuacion.victoria') : t('puntuacion.victorias')
              }}</span>
            </div>
            <span class="puntos-proximo-resultado">
              {{ t('puntuacion.mantenerRacha', { puntos: puntosProximaVictoria }) }}
            </span>
          </div>
        </div>

        <div v-if="derrotas > 0" class="indicador-item racha-negativa">
          <i class="ti ti-alert-triangle icono-sm"></i>
          <div class="indicador-texto">
            <div class="indicador-renglon">
              <span class="indicador-numero">{{ derrotas }}</span>
              <span class="indicador-label">{{
                derrotas === 1 ? t('puntuacion.derrota') : t('puntuacion.derrotas')
              }}</span>
            </div>
            <span class="puntos-proximo-resultado">
              {{ t('puntuacion.proximaDerrota', { puntos: puntosProximaDerrota }) }}
            </span>
          </div>
        </div>

        <div v-if="proteccionActiva" class="indicador-item proteccion">
          <i class="ti ti-shield-check icono-sm"></i>
          <span class="indicador-label">{{ t('puntuacion.proteccion') }}</span>
        </div>
      </div>
    </transition>

    <!-- Botones de dificultad -->
    <div class="botones-dificultad" :class="{ 'con-indicadores-arriba': mostrarIndicadores }">
      <button
        class="boton-dificultad boton-izquierda"
        :class="{ activo: dificultadSeleccionada === 'facil' }"
        @click="seleccionarDificultad('facil')"
      >
        <i class="ti ti-mood-smile icono-sm"></i>
        <span>{{ t('juego.facil') }}</span>
      </button>

      <button
        class="boton-dificultad boton-centro"
        :class="{ activo: dificultadSeleccionada === 'normal' }"
        @click="seleccionarDificultad('normal')"
      >
        <i class="ti ti-brain icono-sm"></i>
        <span>{{ t('juego.normal') }}</span>
      </button>

      <button
        class="boton-dificultad boton-derecha"
        :class="{ activo: dificultadSeleccionada === 'dificil' }"
        @click="seleccionarDificultad('dificil')"
      >
        <i class="ti ti-flame icono-sm"></i>
        <span>{{ t('juego.dificil') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Preferences } from '@capacitor/preferences'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const CLAVE_DIFICULTAD = 'dificultad_ia'

const props = defineProps({
  racha: {
    type: Number,
    default: 0,
  },
  derrotas: {
    type: Number,
    default: 0,
  },
  proteccionActiva: {
    type: Boolean,
    default: false,
  },
  puntosProximaVictoria: {
    type: Number,
    default: 0,
  },
  puntosProximaDerrota: {
    type: Number,
    default: 0,
  },
})

const dificultadSeleccionada = ref('normal')

const emit = defineEmits(['cambio-dificultad'])

onMounted(async () => {
  await cargarDificultad()
})

// Computed para saber si mostrar los indicadores
const mostrarIndicadores = computed(() => {
  return props.racha > 0 || props.derrotas > 0 || props.proteccionActiva
})

const cargarDificultad = async () => {
  try {
    const resultado = await Preferences.get({ key: CLAVE_DIFICULTAD })
    if (resultado.value) {
      dificultadSeleccionada.value = resultado.value
      emit('cambio-dificultad', resultado.value)
    }
  } catch (error) {
    console.error('❌ Error al cargar dificultad:', error)
  }
}

const seleccionarDificultad = async (dificultad) => {
  dificultadSeleccionada.value = dificultad

  try {
    await Preferences.set({
      key: CLAVE_DIFICULTAD,
      value: dificultad,
    })
    emit('cambio-dificultad', dificultad)
  } catch (error) {
    console.error('❌ Error al guardar dificultad:', error)
  }
}
</script>

<style scoped>
.selector-dificultad {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px;
  background-color: var(--color-fondo-alterno);
  border-radius: 12px;
  gap: 0;
}
/* Contenedor de indicadores (ancho completo) */
.contenedor-indicadores {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  padding: 6px;
  background: linear-gradient(135deg, var(--color-boton) 0%, var(--color-turno-activo) 100%);
  border: 2px solid var(--color-turno-activo);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}
.indicador-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--color-texto-principal);
}
.indicador-texto {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
}
.indicador-renglon {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.indicador-numero {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
}
.indicador-label {
  font-size: 0.9rem;
  font-weight: 600;
}
.puntos-proximo-resultado {
  margin-top: 3px;
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0.9;
}
.racha-positiva i {
  color: var(--color-texto-principal);
  animation: llamarada 1.5s ease-in-out infinite;
}
.racha-negativa {
  background-color: rgba(255, 71, 87, 0.3);
}
.racha-negativa i {
  color: var(--color-error);
  animation: pulsar 1s ease-in-out infinite;
}
.proteccion {
  background-color: rgba(0, 217, 163, 0.3);
}
.proteccion i {
  color: var(--color-exito);
}
/* Botones de dificultad */
.botones-dificultad {
  display: flex;
  justify-content: center;
  gap: 0;
}
/* Cuando hay indicadores arriba, quitar border-radius superior */
.botones-dificultad.con-indicadores-arriba .boton-izquierda {
  border-radius: 0 0 0 8px;
}
.botones-dificultad.con-indicadores-arriba .boton-derecha {
  border-radius: 0 0 8px 0;
}
.botones-dificultad.con-indicadores-arriba .boton-centro {
  border-radius: 0;
}
.boton-dificultad {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-texto-secundario);
  background-color: var(--color-tablero);
  border: 2px solid var(--color-borde-tablero);
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 42px;
  flex: 1;
}
/* Bordes redondeados por defecto */
.boton-izquierda {
  border-radius: 8px 0 0 8px;
}
.boton-derecha {
  border-radius: 0 8px 8px 0;
}
.boton-centro {
  border-left: none;
  border-right: none;
  border-radius: 0;
}
.boton-dificultad:hover {
  background-color: var(--color-fondo-alterno);
  border-color: var(--color-turno-activo);
  transform: translateY(-2px);
  z-index: 1;
}
.boton-dificultad.activo {
  color: var(--color-texto-principal);
  background: linear-gradient(135deg, var(--color-boton) 0%, var(--color-turno-activo) 100%);
  border-color: var(--color-turno-activo);
  box-shadow: 0 4px 12px var(--sombra-boton);
  z-index: 2;
}
/* Animaciones */
@keyframes llamarada {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}
@keyframes pulsar {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
/* Transiciones */
.slide-down-enter-active {
  animation: slideDown 0.3s ease;
}
.slide-down-leave-active {
  animation: slideUp 0.25s ease;
}
@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
  to {
    opacity: 1;
    max-height: 200px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
}
@keyframes slideUp {
  from {
    opacity: 1;
    max-height: 200px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  to {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
}
/* Responsive */
@media (max-width: 600px) {
  .boton-dificultad {
    padding: 6px 8px;
    font-size: 0.85rem;
    min-height: 42px;
  }
  .indicador-numero {
    font-size: 1.3rem;
  }
  .indicador-label {
    font-size: 0.8rem;
  }
}
</style>
