<template>
  <q-dialog v-model="mostrarModal" persistent>
    <q-card class="modal-confirmacion">
      <!-- Ícono opcional -->
      <div v-if="icono" class="contenedor-icono">
        <i :class="`ti ti-${icono}`" class="icono-modal"></i>
      </div>

      <!-- Título -->
      <q-card-section v-if="titulo" class="seccion-titulo">
        <div class="texto-titulo">{{ titulo }}</div>
      </q-card-section>

      <!-- Mensaje -->
      <q-card-section v-if="mensaje" class="seccion-mensaje">
        <div class="texto-mensaje">{{ mensaje }}</div>
      </q-card-section>

      <!-- Slot para contenido personalizado -->
      <q-card-section v-if="$slots.default" class="seccion-contenido">
        <slot></slot>
      </q-card-section>

      <!-- Botones -->
      <q-card-actions class="seccion-botones">
        <q-btn flat :label="textoBotonCancelar" class="boton-cancelar" @click="manejarCancelar" />
        <q-btn
          unelevated
          :label="textoBotonAceptar"
          class="boton-aceptar"
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
.icono-modal {
  font-size: 3.5rem;
  color: var(--color-turno-activo);
}
.seccion-titulo {
  padding: 16px 24px 8px 24px;
  text-align: center;
}
.texto-titulo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-texto-principal);
}
.seccion-mensaje {
  padding: 8px 24px;
  text-align: center;
}
.texto-mensaje {
  font-size: 1rem;
  color: var(--color-texto-secundario);
  line-height: 1.5;
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
.boton-cancelar {
  color: var(--color-texto-secundario);
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.boton-cancelar:hover {
  background-color: var(--color-fondo-alterno);
}
.boton-aceptar {
  background: linear-gradient(135deg, var(--color-boton) 0%, var(--color-turno-activo) 100%);
  color: white;
  font-weight: 600;
  padding: 8px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.boton-aceptar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--sombra-boton);
}
</style>
