<template>
  <span
    class="ficha-visual"
    :class="`ficha-${fichaNormalizada.toLowerCase()}`"
    :style="estiloFicha"
    :role="etiquetaAccesible ? 'img' : undefined"
    :aria-label="etiquetaAccesible || undefined"
    :aria-hidden="etiquetaAccesible ? undefined : 'true'"
  >
    {{ representacionVisible }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { obtenerArticulo } from 'src/Servicios/Economia/CatalogoTienda'
import { usarEconomia } from 'src/Servicios/Economia/ServicioEconomia'

const props = defineProps({
  ficha: {
    type: String,
    default: 'X',
  },
  colorId: {
    type: String,
    default: '',
  },
  simboloId: {
    type: String,
    default: '',
  },
  tamano: {
    type: String,
    default: '',
  },
  etiquetaAccesible: {
    type: String,
    default: '',
  },
})

const { equipamiento } = usarEconomia()
const fichaNormalizada = computed(() => (props.ficha === 'O' ? 'O' : 'X'))
const articuloColor = computed(() =>
  obtenerArticulo(props.colorId || equipamiento.value[fichaNormalizada.value]?.color),
)
const articuloSimbolo = computed(() =>
  obtenerArticulo(props.simboloId || equipamiento.value[fichaNormalizada.value]?.simbolo),
)
const representacionVisible = computed(
  () => articuloSimbolo.value?.representacion?.valor ?? fichaNormalizada.value,
)
const estiloFicha = computed(() => {
  const estilos = {}
  if (props.tamano) estilos.fontSize = props.tamano
  if (props.colorId && articuloColor.value?.colorVista) {
    const color = articuloColor.value.colorVista
    const sombraBase = '0 2px 3px rgba(0, 0, 0, 0.35)'
    const sombraFluor =
      articuloColor.value.id === 'blancoFluor'
        ? '0 0 6px #8beeff, 0 0 14px #8beeff, 0 0 24px #8beeff'
        : `0 0 5px ${color}, 0 0 12px ${color}, 0 0 22px ${color}`
    estilos.color = color
    estilos.WebkitTextFillColor = color
    estilos.textShadow = articuloColor.value.id.endsWith('Fluor')
      ? `${sombraFluor}, ${sombraBase}`
      : sombraBase
  }
  if (articuloSimbolo.value?.estiloVisual?.grosorContorno) {
    estilos.WebkitTextStroke = `${articuloSimbolo.value.estiloVisual.grosorContorno} currentColor`
    estilos.paintOrder = 'stroke fill'
  }
  return estilos
})
</script>

<style scoped>
.ficha-visual {
  display: inline-block;
  font-weight: 900;
  line-height: 1;
  user-select: none;
}
.ficha-x {
  color: var(--color-ficha-x);
  text-shadow: var(--sombra-ficha-x);
}
.ficha-o {
  color: var(--color-ficha-o);
  text-shadow: var(--sombra-ficha-o);
}
</style>
