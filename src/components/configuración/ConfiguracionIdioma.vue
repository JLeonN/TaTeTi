<template>
  <div class="seccion-config">
    <div class="encabezado-seccion">
      <i class="ti ti-language icono-md icono-primario"></i>
      <span class="titulo-seccion">{{ t('configuracion.idioma') }}</span>
    </div>

    <div class="contenido-seccion">
      <div class="info-usuario">
        <span class="etiqueta">{{ t('configuracion.idiomaActual') }}:</span>
        <span class="valor-actual">{{ nombreIdiomaActual }}</span>
      </div>

      <button class="boton-base boton-primario" @click="abrirModalCambiarIdioma">
        <i class="ti ti-world"></i>
        <span>{{ t('configuracion.cambiarIdioma') }}</span>
      </button>
    </div>

    <ModalConfirmacion
      v-model="mostrarModal"
      :titulo="t('configuracion.cambiarIdioma')"
      icono="world"
      :texto-boton-aceptar="t('general.guardar')"
      :texto-boton-cancelar="t('general.cancelar')"
      contenido-desplazable
      @aceptar="guardarNuevoIdioma"
      @cancelar="cancelarCambioIdioma"
    >
      <div
        ref="selectorIdiomas"
        class="selector-idiomas"
        role="radiogroup"
        :aria-label="t('configuracion.cambiarIdioma')"
      >
        <button
          v-for="idioma in idiomasHabilitados"
          :key="idioma.codigoApp"
          type="button"
          class="boton-idioma"
          :class="{ activo: idiomaSeleccionado === idioma.codigoApp }"
          role="radio"
          :aria-checked="idiomaSeleccionado === idioma.codigoApp"
          :tabindex="idiomaSeleccionado === idioma.codigoApp ? 0 : -1"
          @click="idiomaSeleccionado = idioma.codigoApp"
          @keydown="manejarNavegacionTeclado($event, idioma.codigoApp)"
        >
          <i class="ti ti-flag icono-lg"></i>
          <div class="info-idioma">
            <span class="nombre-idioma" :lang="idioma.codigoApp">{{ idioma.nombreNativo }}</span>
            <span class="codigo-idioma" :lang="idioma.codigoApp">{{ idioma.regionNativa }}</span>
          </div>
        </button>
      </div>
    </ModalConfirmacion>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useIdioma } from 'src/components/Composables/useIdioma'
import ModalConfirmacion from 'src/components/Modales/ModalConfirmacion.vue'
import { useI18n } from 'vue-i18n'
import {
  IDIOMA_PREDETERMINADO,
  idiomasHabilitados,
  obtenerIdioma,
} from 'src/i18n/ConfiguracionIdiomas'

const { t } = useI18n()

const { idiomaActual, cargarIdioma, guardarIdioma } = useIdioma()

const mostrarModal = ref(false)
const idiomaSeleccionado = ref(IDIOMA_PREDETERMINADO)
const selectorIdiomas = ref(null)

const nombreIdiomaActual = computed(() => {
  return obtenerIdioma(idiomaActual.value)?.nombreNativo ?? idiomaActual.value
})

onMounted(async () => {
  await cargarIdioma()
})

const abrirModalCambiarIdioma = () => {
  idiomaSeleccionado.value = idiomaActual.value
  mostrarModal.value = true
}

const enfocarIdiomaSeleccionado = async () => {
  await nextTick()
  requestAnimationFrame(() => {
    const botonSeleccionado = selectorIdiomas.value?.querySelector('[aria-checked="true"]')
    botonSeleccionado?.scrollIntoView({ block: 'nearest' })
  })
}

const seleccionarIdiomaPorIndice = (indice) => {
  const cantidadIdiomas = idiomasHabilitados.length
  const indiceNormalizado = (indice + cantidadIdiomas) % cantidadIdiomas
  idiomaSeleccionado.value = idiomasHabilitados[indiceNormalizado].codigoApp
  nextTick(() => {
    selectorIdiomas.value?.querySelector('[aria-checked="true"]')?.focus()
  })
}

const manejarNavegacionTeclado = (evento, codigoIdioma) => {
  const indiceActual = idiomasHabilitados.findIndex((idioma) => idioma.codigoApp === codigoIdioma)
  const desplazamientos = {
    ArrowDown: 1,
    ArrowRight: 1,
    ArrowUp: -1,
    ArrowLeft: -1,
  }

  if (evento.key in desplazamientos) {
    evento.preventDefault()
    seleccionarIdiomaPorIndice(indiceActual + desplazamientos[evento.key])
  } else if (evento.key === 'Home') {
    evento.preventDefault()
    seleccionarIdiomaPorIndice(0)
  } else if (evento.key === 'End') {
    evento.preventDefault()
    seleccionarIdiomaPorIndice(idiomasHabilitados.length - 1)
  }
}

const guardarNuevoIdioma = async () => {
  if (!idiomaSeleccionado.value) {
    return
  }

  const exito = await guardarIdioma(idiomaSeleccionado.value)

  if (exito) {
    mostrarModal.value = false
  }
}

const cancelarCambioIdioma = () => {
  idiomaSeleccionado.value = idiomaActual.value
  mostrarModal.value = false
}

watch(mostrarModal, (nuevoValor) => {
  if (nuevoValor) {
    enfocarIdiomaSeleccionado()
    return
  }
  idiomaSeleccionado.value = idiomaActual.value
})
</script>

<style scoped>
.seccion-config {
  background-color: var(--color-fondo-alterno);
  border: 2px solid var(--color-borde-tablero);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}
.encabezado-seccion {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-borde-tablero);
}
.contenido-seccion {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.info-usuario {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.etiqueta {
  font-size: 0.9rem;
  color: var(--color-texto-secundario);
}
.valor-actual {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-texto-principal);
}
.selector-idiomas {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px;
}
.boton-idioma {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 72px;
  padding: 12px 14px;
  background-color: var(--color-tablero);
  border: 2px solid var(--color-borde-tablero);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}
.boton-idioma:hover {
  background-color: var(--color-fondo-alterno);
  border-color: var(--color-turno-activo);
  transform: translateX(4px);
}
.boton-idioma:focus-visible {
  outline: 3px solid var(--color-turno-activo);
  outline-offset: 2px;
}
.boton-idioma.activo {
  background: linear-gradient(135deg, var(--color-boton) 0%, var(--color-turno-activo) 100%);
  border-color: var(--color-turno-activo);
  box-shadow: 0 4px 12px var(--sombra-boton);
}
.info-idioma {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}
.nombre-idioma {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-texto-principal);
}
.codigo-idioma {
  font-size: 0.85rem;
  color: var(--color-texto-secundario);
}
@media (max-width: 600px) {
  .seccion-config {
    padding: 16px;
  }
}
@media (max-height: 700px) {
  .selector-idiomas {
    gap: 8px;
  }
  .boton-idioma {
    gap: 10px;
    min-height: 62px;
    padding: 9px 12px;
  }
  .boton-idioma .icono-lg {
    font-size: 1.6rem;
  }
  .nombre-idioma {
    font-size: 1rem;
  }
  .codigo-idioma {
    font-size: 0.78rem;
  }
}
@media (max-height: 560px) {
  .selector-idiomas {
    gap: 6px;
  }
  .boton-idioma {
    min-height: 56px;
    padding: 7px 10px;
  }
}
</style>
