<template>
  <div class="info-juego">
    <div v-if="!juegoTerminado" class="turno-actual">
      <span class="etiqueta">Turno de:</span>
      <span class="jugador" :class="`jugador-${turnoActual.toLowerCase()}`">
        {{ turnoActual }}
      </span>
    </div>

    <div v-else-if="ganador" class="resultado ganador-anuncio">
      <q-icon name="emoji_events" size="2rem" color="warning" />
      <span class="texto-ganador">
        ¡Ganó <strong :class="`jugador-${ganador.toLowerCase()}`">{{ ganador }}</strong
        >!
      </span>
    </div>

    <div v-else-if="esEmpate" class="resultado empate-anuncio">
      <q-icon name="handshake" size="2rem" />
      <span class="texto-empate">¡Es un empate!</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  turnoActual: {
    type: String,
    required: true,
  },
  juegoTerminado: {
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
})
</script>

<style scoped>
.info-juego {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: var(--color-fondo-alterno);
  border-radius: 12px;
  margin-bottom: 20px;
}
.turno-actual {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
}
.etiqueta {
  color: var(--color-texto-secundario);
}
.jugador {
  font-weight: bold;
  font-size: 2rem;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: var(--color-tablero);
  animation: pulsarTurno 1.5s ease-in-out infinite;
}
.jugador-x {
  color: var(--color-ficha-x);
}
.jugador-o {
  color: var(--color-ficha-o);
}
.resultado {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.8rem;
  animation: aparecerResultado 0.5s ease;
}
.ganador-anuncio {
  color: var(--color-exito);
}
.empate-anuncio {
  color: var(--color-texto-principal);
}
.texto-ganador strong {
  padding: 4px 12px;
  border-radius: 6px;
  background-color: var(--color-tablero);
}
@keyframes pulsarTurno {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
@keyframes aparecerResultado {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 600px) {
  .turno-actual {
    font-size: 1.2rem;
  }
  .jugador {
    font-size: 1.5rem;
  }
  .resultado {
    font-size: 1.4rem;
  }
}
</style>
