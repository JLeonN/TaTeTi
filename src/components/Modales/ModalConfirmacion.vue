<template>
  <q-dialog v-model="mostrarModal">
    <q-card
      class="modal-confirmacion"
      :class="{
        'modal-confirmacion--contenido-desplazable': contenidoDesplazable,
        'modal-confirmacion--compacto': compacto,
      }"
    >
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
      <q-card-section
        v-if="$slots.default"
        class="seccion-contenido"
        :class="{ 'seccion-contenido--desplazable': contenidoDesplazable }"
      >
        <slot></slot>
      </q-card-section>

      <!-- Botones -->
      <q-card-actions class="seccion-botones">
        <q-btn
          flat
          :label="textoCancelar"
          class="boton-base boton-secundario"
          @click="manejarCancelar"
        />
        <q-btn
          unelevated
          :label="textoAceptar"
          class="boton-base boton-primario"
          @click="manejarAceptar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

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
    default: '',
  },
  textoBotonCancelar: {
    type: String,
    default: '',
  },
  contenidoDesplazable: {
    type: Boolean,
    default: false,
  },
  compacto: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'aceptar', 'cancelar'])
const { t } = useI18n()
const mostrarModal = ref(props.modelValue)
const textoAceptar = computed(() => props.textoBotonAceptar || t('general.aceptar'))
const textoCancelar = computed(() => props.textoBotonCancelar || t('general.cancelar'))

watch(
  () => props.modelValue,
  (nuevoValor) => {
    mostrarModal.value = nuevoValor
  },
)

watch(mostrarModal, (nuevoValor) => {
  emit('update:modelValue', nuevoValor)
  // Si se cierra el modal (click afuera), emitir cancelar
  if (!nuevoValor) {
    emit('cancelar')
  }
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
  width: min(88vw, 400px);
  max-width: 400px;
  max-height: 100%;
  background-color: var(--color-modal-fondo);
  border: 2px solid var(--color-borde-modal);
  border-radius: 16px;
  padding: 8px;
  overflow-y: auto;
}
.modal-confirmacion--contenido-desplazable {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-confirmacion--compacto {
  min-width: 0;
  width: min(86vw, 340px);
  max-width: 340px;
  padding: 6px;
}
.contenedor-icono {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  padding: 24px 0 0 0;
}
.modal-confirmacion--compacto .contenedor-icono {
  padding-top: 12px;
}
.modal-confirmacion--compacto .icono-modal {
  font-size: 2.2rem;
}
.seccion-titulo {
  flex: 0 0 auto;
  padding: 16px 24px 8px 24px;
  text-align: center;
}
.modal-confirmacion--compacto .seccion-titulo {
  padding: 10px 18px 4px 18px;
}
.modal-confirmacion--compacto .seccion-titulo .titulo-h2 {
  font-size: 1.45rem;
  line-height: 1.12;
}
.seccion-mensaje {
  flex: 0 0 auto;
  padding: 8px 24px;
  text-align: center;
}
.modal-confirmacion--compacto .seccion-mensaje {
  padding: 6px 18px;
}
.modal-confirmacion--compacto .seccion-mensaje .subtitulo {
  font-size: 0.86rem;
  line-height: 1.25;
}
.seccion-contenido {
  padding: 16px 24px;
}
.modal-confirmacion--compacto .seccion-contenido {
  padding: 8px 18px 4px 18px;
}
.seccion-contenido--desplazable {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.seccion-contenido--desplazable::-webkit-scrollbar {
  display: none;
}
.seccion-botones {
  flex: 0 0 auto;
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px 24px;
  justify-content: flex-end;
}
.modal-confirmacion--compacto .seccion-botones {
  gap: 8px;
  padding: 10px 18px 14px 18px;
}
.modal-confirmacion--compacto .seccion-botones :deep(.boton-base) {
  width: auto;
  min-height: 34px;
  padding: 8px 14px;
  font-size: 0.78rem;
}
.modal-confirmacion--contenido-desplazable .seccion-botones {
  flex-wrap: nowrap;
  padding: 10px 16px 12px 16px;
}
.modal-confirmacion--contenido-desplazable .seccion-botones :deep(.boton-base) {
  flex: 1 1 0;
  width: auto;
  min-width: 0;
  padding: 10px 12px;
  font-size: clamp(0.78rem, 3.6vw, 0.95rem);
}
@media (max-height: 700px) {
  .modal-confirmacion--contenido-desplazable {
    padding: 6px;
  }
  .modal-confirmacion--contenido-desplazable .contenedor-icono {
    padding-top: 12px;
  }
  .modal-confirmacion--contenido-desplazable .icono-modal {
    font-size: 2.5rem;
  }
  .modal-confirmacion--contenido-desplazable .seccion-titulo {
    padding: 8px 16px 4px 16px;
  }
  .modal-confirmacion--contenido-desplazable .seccion-contenido {
    padding: 8px 16px;
  }
}
@media (max-height: 560px) {
  .modal-confirmacion--contenido-desplazable .contenedor-icono {
    display: none;
  }
  .modal-confirmacion--contenido-desplazable .seccion-titulo {
    padding-top: 6px;
  }
}
@media (max-width: 319px) {
  .modal-confirmacion {
    min-width: 0;
    width: 94vw;
  }
  .modal-confirmacion--contenido-desplazable .seccion-botones {
    flex-direction: column;
  }
  .modal-confirmacion--contenido-desplazable .seccion-botones :deep(.boton-base) {
    width: 100%;
  }
}
</style>
