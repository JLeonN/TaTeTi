<template>
  <span class="vista-previa-tablero" :style="estiloTablero" aria-hidden="true">
    <span v-for="indice in 9" :key="indice" class="celda-previa-tablero"></span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import {
  TABLERO_PREDETERMINADO_ID,
  obtenerEstiloTablero,
} from 'src/Servicios/Economia/PresentacionTableros'

const props = defineProps({
  tableroId: {
    type: String,
    default: TABLERO_PREDETERMINADO_ID,
  },
})

const estiloTablero = computed(() => obtenerEstiloTablero(props.tableroId))
</script>

<style scoped>
.vista-previa-tablero {
  display: grid;
  width: 100%;
  aspect-ratio: 1;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 3px;
  padding: 5px;
  overflow: hidden;
  background-color: var(--color-fondo);
  background-image:
    linear-gradient(
      color-mix(in srgb, var(--color-fondo) var(--oscurecimiento-tablero), transparent),
      color-mix(in srgb, var(--color-fondo) var(--oscurecimiento-tablero), transparent)
    ),
    var(--imagen-tablero);
  background-position: center, var(--posicion-fondo-tablero);
  background-repeat: no-repeat;
  background-size: cover, var(--tamano-fondo-tablero);
  border: 2px solid var(--color-borde-tablero);
  border-radius: 9px;
  box-shadow: inset 0 0 8px var(--color-sombra-tablero);
}
.celda-previa-tablero {
  background-color: color-mix(
    in srgb,
    var(--color-tablero) var(--opacidad-celdas-tablero),
    transparent
  );
  border: 1px solid var(--color-borde-tablero);
}
</style>
