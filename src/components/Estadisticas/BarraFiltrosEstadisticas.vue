<template>
  <div ref="marcadorBarra" class="marcador-barra" aria-hidden="true"></div>
  <section class="barra-filtros" :class="{ flotante: estaFlotando }">
    <fieldset class="grupo-filtros">
      <legend class="solo-lectores">{{ t('juego.dificultad') }}</legend>
      <div class="chips-filtros">
        <button
          v-for="opcion in opcionesDificultad"
          :key="opcion.valor"
          type="button"
          class="chip-filtro"
          :class="{ activo: dificultad === opcion.valor }"
          :aria-pressed="dificultad === opcion.valor"
          @click="$emit('update:dificultad', opcion.valor)"
        >
          {{ opcion.etiqueta }}
        </button>
      </div>
    </fieldset>
    <fieldset class="grupo-filtros">
      <legend class="solo-lectores">{{ t('estadisticas.ficha') }}</legend>
      <div class="chips-filtros chips-fichas">
        <button
          v-for="opcion in opcionesFicha"
          :key="opcion.valor"
          type="button"
          class="chip-filtro"
          :class="{ activo: ficha === opcion.valor }"
          :aria-pressed="ficha === opcion.valor"
          @click="$emit('update:ficha', opcion.valor)"
        >
          <FichaVisual v-if="opcion.valor !== 'todas'" :simbolo-id="opcion.valor" tamano="1.35rem" />
          <span v-else>{{ opcion.etiqueta }}</span>
        </button>
      </div>
    </fieldset>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FichaVisual from 'src/components/TaTeTi/Compartido/FichaVisual.vue'

defineEmits(['update:dificultad', 'update:ficha'])

const props = defineProps({
  dificultad: { type: String, required: true },
  ficha: { type: String, required: true },
  opcionesFicha: { type: Array, default: () => [] },
})

const { t } = useI18n()
const marcadorBarra = ref(null)
const estaFlotando = ref(false)
let observadorBarra = null

const opcionesDificultad = computed(() => [
  { etiqueta: t('estadisticas.todos'), valor: 'todas' },
  { etiqueta: t('juego.facil'), valor: 'facil' },
  { etiqueta: t('juego.normal'), valor: 'normal' },
  { etiqueta: t('juego.dificil'), valor: 'dificil' },
])
const opcionesFicha = computed(() => [
  { etiqueta: t('estadisticas.todas'), valor: 'todas' },
  ...new Set(props.opcionesFicha).values(),
].map((opcion) => (typeof opcion === 'string' ? { valor: opcion, etiqueta: opcion } : opcion)))

onMounted(() => {
  const alturaHeader =
    Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--altura-header'),
    ) || 50
  observadorBarra = new IntersectionObserver(
    ([entrada]) => {
      estaFlotando.value = !entrada.isIntersecting
    },
    { rootMargin: `-${alturaHeader}px 0px 0px` },
  )
  observadorBarra.observe(marcadorBarra.value)
})

onBeforeUnmount(() => observadorBarra?.disconnect())
</script>

<style scoped>
.marcador-barra {
  height: 1px;
  margin-bottom: -1px;
}
.barra-filtros {
  position: sticky;
  z-index: 20;
  top: var(--altura-header);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background-color: var(--color-fondo-alterno);
  border: 1px solid var(--color-borde-tablero);
  border-radius: 12px;
  transition:
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}
.barra-filtros.flotante {
  background-color: var(--color-nav-fondo);
  box-shadow: 0 8px 18px var(--color-sombra-tablero);
}
.grupo-filtros {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.solo-lectores {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.chips-filtros {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
}
.chips-fichas {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.chip-filtro {
  min-width: 0;
  min-height: 36px;
  padding: 6px 8px;
  overflow: hidden;
  color: var(--color-texto-secundario);
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: var(--color-tablero);
  border: 1px solid var(--color-borde-tablero);
  border-radius: 18px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}
.chip-filtro.activo {
  color: var(--color-texto-principal);
  background: linear-gradient(135deg, var(--color-boton) 0%, var(--color-turno-activo) 100%);
  border-color: var(--color-turno-activo);
  box-shadow: 0 4px 12px var(--sombra-boton);
}
.chip-ficha-x:not(.activo) {
  color: var(--color-ficha-x);
}
.chip-ficha-o:not(.activo) {
  color: var(--color-ficha-o);
}
.chip-filtro:focus-visible {
  outline: 2px solid var(--color-turno-activo);
  outline-offset: 2px;
}
.chip-filtro:active {
  transform: scale(0.97);
}
@media (hover: hover) {
  .chip-filtro:not(.activo):hover {
    color: var(--color-texto-principal);
    background-color: var(--color-fondo-alterno);
    border-color: var(--color-turno-activo);
  }
}
@media (max-width: 380px) {
  .barra-filtros {
    padding: 10px;
  }
  .chips-filtros {
    gap: 4px;
  }
  .chip-filtro {
    min-height: 34px;
    padding: 5px 3px;
    font-size: 0.74rem;
  }
}
</style>
