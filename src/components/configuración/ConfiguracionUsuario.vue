<template>
  <div class="seccion-config">
    <div class="encabezado-seccion">
      <i class="ti ti-user icono-md icono-primario"></i>
      <span class="titulo-seccion">Usuario</span>
    </div>

    <div class="contenido-seccion">
      <div class="info-usuario">
        <span class="etiqueta">Nombre actual:</span>
        <span class="valor-actual">{{ nombreUsuario }}</span>
      </div>

      <button class="boton-base boton-primario" @click="abrirModalCambiarNombre">
        <i class="ti ti-edit"></i>
        <span>Cambiar Nombre</span>
      </button>
    </div>

    <!-- Modal para cambiar nombre -->
    <ModalConfirmacion
      v-model="mostrarModal"
      titulo="Cambiar Nombre"
      icono="user-edit"
      texto-boton-aceptar="Guardar"
      texto-boton-cancelar="Cancelar"
      @aceptar="guardarNuevoNombre"
      @cancelar="cancelarCambioNombre"
    >
      <q-input
        v-model="nuevoNombre"
        outlined
        label="Nuevo nombre"
        placeholder="Ingresá tu nombre"
        class="input-quasar"
        maxlength="20"
        counter
        :rules="[(val) => !!val || 'El nombre no puede estar vacío']"
        @keyup.enter="guardarNuevoNombre"
      />
    </ModalConfirmacion>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useConfiguracion } from 'src/components/Composables/useConfiguracion'
import ModalConfirmacion from 'src/components/Modales/ModalConfirmacion.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const { nombreUsuario, cargarNombre, guardarNombre } = useConfiguracion()

const mostrarModal = ref(false)
const nuevoNombre = ref('')

onMounted(async () => {
  await cargarNombre()
})

const abrirModalCambiarNombre = () => {
  nuevoNombre.value = nombreUsuario.value
  mostrarModal.value = true
}

const guardarNuevoNombre = async () => {
  if (!nuevoNombre.value || nuevoNombre.value.trim() === '') {
    $q.notify({
      type: 'negative',
      message: 'El nombre no puede estar vacío',
      position: 'top',
    })
    return
  }

  const exito = await guardarNombre(nuevoNombre.value)

  if (exito) {
    mostrarModal.value = false
    $q.notify({
      type: 'positive',
      message: '¡Nombre actualizado correctamente!',
      position: 'top',
      icon: 'ti ti-check',
    })
  } else {
    $q.notify({
      type: 'negative',
      message: 'Error al guardar el nombre',
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
@media (max-width: 600px) {
  .seccion-config {
    padding: 16px;
  }
}
</style>
