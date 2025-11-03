<template>
  <q-dialog v-model="mostrarModal" persistent>
    <q-card class="modal-confirmacion">
      <!-- Ícono opcional -->
      <div v-if="icono" class="contenedor-icono">
        <i :class="`ti ti-${icono} icono-modal icono-primario`"></i>
      </div>

      <!-- Título -->
      <q-card-section v-if="titulo" class="seccion-titulo">
        <div class="titulo-h2">{{ titulo }}</div>
      </q-card-section>

      <!-- Mensaje -->
      <q-card-section v-if="mensaje" class="seccion-mensaje">
        <div class="subtitulo">{{ mensaje }}</div>
      </q-card-section>

      <!-- Slot para contenido personalizado -->
      <q-card-section v-if="$slots.default" class="seccion-contenido">
        <slot></slot>
      </q-card-section>

      <!-- Botones -->
      <q-card-actions class="seccion-botones">
        <q-btn
          flat
          :label="textoBotonCancelar"
          class="boton-base boton-secundario"
          @click="manejarCancelar"
        />
        <q-btn
          unelevated
          :label="textoBotonAceptar"
          class="boton-base boton-primario"
          @click="manejarAceptar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  titulo: {
    type: String,
    default: '',
  },
  mensaje: {
    type: String,
    default: '',
  },
  icono: {
    type: String,
    default: '',
  },
  textoBotonAceptar: {
    type: String,
    default: 'Aceptar',
  },
  textoBotonCancelar: {
    type: String,
    default: 'Cancelar',
  },
})

const emit = defineEmits(['update:modelValue', 'aceptar', 'cancelar'])

const mostrarModal = ref(props.modelValue)

watch(
  () => props.modelValue,
  (nuevoValor) => {
    mostrarModal.value = nuevoValor
  },
)

watch(mostrarModal, (nuevoValor) => {
  emit('update:modelValue', nuevoValor)
})

const manejarAceptar = () => {
  emit('aceptar')
  mostrarModal.value = false
}

const manejarCancelar = () => {
  emit('cancelar')
  mostrarModal.value = false
}
</script>

<style scoped>
.modal-confirmacion {
  min-width: 300px;
  max-width: 400px;
  background-color: var(--color-modal-fondo);
  border: 2px solid var(--color-borde-modal);
  border-radius: 16px;
  padding: 8px;
}
.contenedor-icono {
  display: flex;
  justify-content: center;
  padding: 24px 0 0 0;
}
.seccion-titulo {
  padding: 16px 24px 8px 24px;
  text-align: center;
}
.seccion-mensaje {
  padding: 8px 24px;
  text-align: center;
}
.seccion-contenido {
  padding: 16px 24px;
}
.seccion-botones {
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px 24px;
  justify-content: flex-end;
}
</style>
