<template>
  <header class="encabezado-panel">
    <h2>{{ titulo }}</h2>
    <div ref="filaDescripcion" class="fila-descripcion">
      <p :id="idDescripcion" class="descripcion-panel" :class="{ abierta: abierto }">
        {{ descripcion }}
      </p>
      <span ref="medidorDescripcion" class="medidor-descripcion" aria-hidden="true">
        {{ descripcion }}
      </span>
      <button
        v-if="descripcionRecortada"
        type="button"
        class="boton-descripcion"
        :aria-label="titulo"
        :aria-expanded="abierto"
        :aria-controls="idDescripcion"
        @click="$emit('alternar')"
      >
        <i
          :class="`ti ${abierto ? 'ti-chevron-up' : 'ti-chevron-down'} icono-sm`"
          aria-hidden="true"
        ></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineEmits(['alternar'])

const props = defineProps({
  identificador: { type: String, required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  abierto: { type: Boolean, required: true },
})

const idDescripcion = computed(() => `descripcion-panel-${props.identificador}`)
const filaDescripcion = ref(null)
const medidorDescripcion = ref(null)
const descripcionRecortada = ref(false)
let observadorTamano = null

const actualizarDescripcionRecortada = () => {
  if (!filaDescripcion.value || !medidorDescripcion.value) return
  descripcionRecortada.value =
    medidorDescripcion.value.scrollWidth > filaDescripcion.value.clientWidth + 1
}

watch(
  () => props.descripcion,
  async () => {
    await nextTick()
    actualizarDescripcionRecortada()
  },
)

onMounted(() => {
  actualizarDescripcionRecortada()
  observadorTamano = new ResizeObserver(actualizarDescripcionRecortada)
  observadorTamano.observe(filaDescripcion.value)
})

onBeforeUnmount(() => {
  observadorTamano?.disconnect()
})
</script>

<style scoped>
.encabezado-panel {
  min-width: 0;
  width: 100%;
  margin-bottom: 14px;
}
.encabezado-panel h2 {
  margin: 0 0 5px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25;
}
.fila-descripcion {
  position: relative;
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}
.medidor-descripcion {
  position: absolute;
  visibility: hidden;
  max-width: none;
  font-size: 0.75rem;
  line-height: 1.35;
  white-space: nowrap;
  pointer-events: none;
}
.descripcion-panel {
  min-width: 0;
  flex: 1;
  margin: 0;
  overflow: hidden;
  color: var(--color-texto-secundario);
  font-size: 0.75rem;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.descripcion-panel.abierta {
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
}
.boton-descripcion {
  display: grid;
  flex: 0 0 22px;
  width: 22px;
  height: 22px;
  place-items: center;
  padding: 0;
  color: var(--color-texto-secundario);
  background-color: transparent;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}
.boton-descripcion:focus-visible {
  outline: 1px solid var(--color-borde-tablero);
  outline-offset: 1px;
}
@media (hover: hover) {
  .boton-descripcion:hover {
    color: var(--color-texto-principal);
    background-color: var(--color-tablero);
  }
}
</style>
