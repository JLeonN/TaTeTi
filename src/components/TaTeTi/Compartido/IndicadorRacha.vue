<template>
  <div class="indicador-racha">
    <!-- Racha positiva (victorias) -->
    <div v-if="racha > 0" class="racha racha-positiva">
      <i class="ti ti-flame icono-md"></i>
      <div class="racha-info">
        <span class="racha-numero">{{ racha }}</span>
        <span class="racha-texto">{{
          racha === 1 ? t('puntuacion.victoria') : t('puntuacion.victorias')
        }}</span>
      </div>
    </div>

    <!-- Racha negativa (derrotas) -->
    <div v-if="derrotas > 0" class="racha racha-negativa">
      <i class="ti ti-alert-triangle icono-md"></i>
      <div class="racha-info">
        <span class="racha-numero">{{ derrotas }}</span>
        <span class="racha-texto">{{
          derrotas === 1 ? t('puntuacion.derrota') : t('puntuacion.derrotas')
        }}</span>
      </div>
    </div>

    <!-- Protección activa -->
    <div v-if="proteccionActiva" class="proteccion-activa">
      <i class="ti ti-shield-check icono-sm"></i>
      <span>{{ t('puntuacion.proteccion') }}</span>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
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
})
</script>

<style scoped>
.indicador-racha {
  position: fixed;
  top: 100px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
}
.racha {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: var(--color-fondo-alterno);
  border: 2px solid;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: aparecer 0.3s ease;
}
.racha-positiva {
  border-color: var(--color-exito);
}
.racha-positiva i {
  color: var(--color-turno-activo);
  animation: llamarada 1.5s ease-in-out infinite;
}
.racha-negativa {
  border-color: var(--color-error);
}
.racha-negativa i {
  color: var(--color-error);
  animation: pulsar 1s ease-in-out infinite;
}
.racha-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.racha-numero {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-texto-principal);
  line-height: 1;
}
.racha-texto {
  font-size: 0.75rem;
  color: var(--color-texto-secundario);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.proteccion-activa {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-exito) 0%, #00b386 100%);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 217, 163, 0.4);
  animation: aparecer 0.3s ease;
}
.proteccion-activa i {
  font-size: 1.2rem;
}
/* Animaciones */
@keyframes aparecer {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes llamarada {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
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
/* Responsive */
@media (max-width: 600px) {
  .indicador-racha {
    top: 75px;
    right: 12px;
  }
  .racha {
    padding: 10px 12px;
  }
  .racha-numero {
    font-size: 1.3rem;
  }
  .racha-texto {
    font-size: 0.7rem;
  }
  .proteccion-activa {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
}
</style>
