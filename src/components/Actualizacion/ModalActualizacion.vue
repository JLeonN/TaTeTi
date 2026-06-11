<template>
  <q-dialog v-model="modalVisible">
    <q-card class="modal-actualizacion">
      <q-card-section class="encabezado-actualizacion">
        <div class="titulo-actualizacion">{{ t('actualizacion.titulo') }}</div>
      </q-card-section>
      <q-card-section class="contenido-actualizacion">
        <div class="versiones-actualizacion">
          <span>{{ t('actualizacion.versionInstalada') }}: {{ versionInstalada }}</span>
          <span>{{ t('actualizacion.versionDisponible') }}: {{ versionDisponible }}</span>
        </div>
        <p class="aviso-play-store">{{ t('actualizacion.avisoPlayStore') }}</p>
        <!-- Las notas llegan desde version.json agrupadas por idioma, apartado y novedades. -->
        <!-- Mantener textos cortos; Leo aprueba las líneas antes de publicar. -->
        <section v-if="cambios.length > 0" class="novedades-actualizacion">
          <h2>{{ t('actualizacion.novedades') }}</h2>
          <div v-for="(grupo, indiceGrupo) in cambios" :key="indiceGrupo">
            <h3 v-if="grupo.apartado">{{ grupo.apartado }}</h3>
            <ul>
              <li v-for="(novedad, indiceNovedad) in grupo.novedades" :key="indiceNovedad">
                {{ novedad }}
              </li>
            </ul>
          </div>
        </section>
      </q-card-section>
      <q-card-actions align="right" class="acciones-actualizacion">
        <q-btn flat :label="t('general.cancelar')" class="boton-cancelar" v-close-popup />
        <q-btn
          unelevated
          :label="t('actualizacion.actualizar')"
          class="boton-actualizar"
          @click="emit('actualizar')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  versionInstalada: {
    type: String,
    default: '',
  },
  versionDisponible: {
    type: String,
    default: '',
  },
  cambios: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['cerrar', 'actualizar'])
const { t } = useI18n()

const modalVisible = computed({
  get: () => props.visible,
  set: (visible) => {
    if (!visible) {
      emit('cerrar')
    }
  },
})
</script>

<style scoped>
.modal-actualizacion {
  width: min(92vw, 520px);
  max-height: calc(var(--altura-pantalla) - var(--espacio-inferior-contenido) - 48px);
  color: var(--color-texto-principal);
  background-color: var(--color-modal-fondo);
  border: 2px solid var(--color-borde-modal);
  box-shadow: 0 0 24px var(--sombra-modal);
  overflow: hidden;
}
.encabezado-actualizacion {
  background-color: var(--color-nav-fondo);
}
.titulo-actualizacion {
  font-size: 1.25rem;
  font-weight: 700;
}
.contenido-actualizacion {
  max-height: calc(var(--altura-pantalla) - var(--espacio-inferior-contenido) - 190px);
  overflow-y: auto;
}
.versiones-actualizacion {
  display: grid;
  gap: 6px;
  color: var(--color-texto-secundario);
}
.aviso-play-store {
  padding: 10px;
  margin: 16px 0;
  background-color: var(--color-fondo-alterno);
  border-left: 4px solid var(--color-turno-activo);
  border-radius: 6px;
}
.novedades-actualizacion h2 {
  margin: 0 0 12px;
  font-size: 1.1rem;
}
.novedades-actualizacion h3 {
  margin: 12px 0 4px;
  color: var(--color-texto-secundario);
  font-size: 1rem;
}
.novedades-actualizacion ul {
  margin: 4px 0 0;
  padding-left: 22px;
}
.novedades-actualizacion li {
  margin-bottom: 6px;
}
.acciones-actualizacion {
  background-color: var(--color-nav-fondo);
}
.boton-cancelar {
  color: var(--color-texto-secundario);
}
.boton-actualizar {
  color: var(--color-texto-principal);
  background-color: var(--color-boton);
}
</style>
