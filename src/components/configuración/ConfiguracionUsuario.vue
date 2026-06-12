<template>
  <div ref="seccionUsuario" class="seccion-config" :class="{ resaltada: resaltandoSeccion }">
    <div class="encabezado-seccion">
      <i class="ti ti-user icono-md icono-primario"></i>
      <span class="titulo-seccion">{{ t('configuracion.usuario') }}</span>
    </div>

    <div class="contenido-seccion">
      <div class="info-usuario">
        <span class="etiqueta">{{ t('configuracion.nombreActual') }}:</span>
        <span class="valor-actual">{{ nombreUsuario }}</span>
      </div>

      <button class="boton-base boton-primario" @click="abrirModalCambiarNombre">
        <i class="ti ti-edit"></i>
        <span>{{ t('configuracion.cambiarNombre') }}</span>
      </button>
    </div>

    <!-- Modal para cambiar nombre -->
    <ModalConfirmacion
      v-model="mostrarModal"
      :titulo="t('configuracion.cambiarNombre')"
      icono="user-edit"
      :texto-boton-aceptar="t('general.guardar')"
      :texto-boton-cancelar="t('general.cancelar')"
      @aceptar="guardarNuevoNombre"
      @cancelar="cancelarCambioNombre"
    >
      <q-input
        v-model="nuevoNombre"
        outlined
        :label="t('configuracion.nuevoNombre')"
        :placeholder="t('configuracion.placeholderNombre')"
        class="input-quasar"
        maxlength="20"
        counter
        :rules="[(val) => !!val || t('configuracion.nombreVacio')]"
        @keyup.enter="guardarNuevoNombre"
      />
    </ModalConfirmacion>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { useConfiguracion } from 'src/components/Composables/useConfiguracion'
import ModalConfirmacion from 'src/components/Modales/ModalConfirmacion.vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const $q = useQuasar()
const { t } = useI18n()

const { nombreUsuario, cargarNombre, guardarNombre } = useConfiguracion()

const mostrarModal = ref(false)
const nuevoNombre = ref('')
const seccionUsuario = ref(null)
const resaltandoSeccion = ref(false)
let temporizadorResaltado = null

onMounted(async () => {
  await cargarNombre()
})

const abrirModalCambiarNombre = () => {
  nuevoNombre.value = nombreUsuario.value
  mostrarModal.value = true
}

const enfocarSeccion = () => {
  window.clearTimeout(temporizadorResaltado)
  resaltandoSeccion.value = false
  seccionUsuario.value?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'center',
  })
  window.requestAnimationFrame(() => {
    resaltandoSeccion.value = true
    temporizadorResaltado = window.setTimeout(() => {
      resaltandoSeccion.value = false
    }, 2600)
  })
}

defineExpose({ enfocarSeccion })

const guardarNuevoNombre = async () => {
  if (!nuevoNombre.value || nuevoNombre.value.trim() === '') {
    $q.notify({
      type: 'negative',
      message: t('configuracion.nombreVacio'),
      position: 'top',
    })
    return
  }

  const exito = await guardarNombre(nuevoNombre.value)

  if (exito) {
    mostrarModal.value = false
    $q.notify({
      type: 'positive',
      message: t('configuracion.nombreActualizado'),
      position: 'top',
    })
  } else {
    $q.notify({
      type: 'negative',
      message: t('configuracion.errorGuardar'),
      position: 'top',
    })
  }
}

const cancelarCambioNombre = () => {
  nuevoNombre.value = nombreUsuario.value
  mostrarModal.value = false
}

watch(mostrarModal, (nuevoValor) => {
  if (!nuevoValor) {
    nuevoNombre.value = nombreUsuario.value
  }
})

onBeforeUnmount(() => {
  window.clearTimeout(temporizadorResaltado)
})
</script>

<style scoped>
.seccion-config {
  position: relative;
  overflow: hidden;
  background-color: var(--color-fondo-alterno);
  border: 2px solid var(--color-borde-tablero);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}
.seccion-config.resaltada {
  animation: resaltarSeccionUsuario 0.85s ease-in-out 3;
}
@keyframes resaltarSeccionUsuario {
  0%,
  100% {
    border-color: var(--color-borde-tablero);
    box-shadow: none;
  }
  50% {
    border-color: var(--color-turno-activo);
    box-shadow:
      0 0 8px var(--color-turno-activo),
      0 0 20px var(--color-boton);
  }
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
@media (max-width: 600px) {
  .seccion-config {
    padding: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .seccion-config.resaltada {
    animation: resaltarSeccionUsuarioReducido 2.5s ease;
  }
  @keyframes resaltarSeccionUsuarioReducido {
    0%,
    100% {
      border-color: var(--color-borde-tablero);
      box-shadow: none;
    }
    10%,
    90% {
      border-color: var(--color-turno-activo);
      box-shadow: 0 0 12px var(--color-boton);
    }
  }
}
</style>
