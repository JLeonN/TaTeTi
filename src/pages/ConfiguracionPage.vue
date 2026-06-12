<template>
  <q-page class="pagina-configuracion">
    <div class="contenedor-configuracion">
      <h1 class="titulo-h1-con-icono">
        <i class="ti ti-settings icono-xl icono-primario"></i>
        {{ t('configuracion.titulo') }}
      </h1>

      <!-- Componente de configuración de usuario -->
      <ConfiguracionUsuario ref="configuracionUsuario" />

      <!-- Componente de configuración de idioma -->
      <ConfiguracionIdioma />
    </div>
  </q-page>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ConfiguracionUsuario from '../components/configuración/ConfiguracionUsuario.vue'
import ConfiguracionIdioma from '../components/configuración/ConfiguracionIdioma.vue'

const { t } = useI18n()
const route = useRoute()
const configuracionUsuario = ref(null)

const enfocarConfiguracionUsuario = async () => {
  if (route.query.enfocar !== 'usuario') return
  await nextTick()
  configuracionUsuario.value?.enfocarSeccion()
}

onMounted(enfocarConfiguracionUsuario)
watch(() => route.query.solicitud, enfocarConfiguracionUsuario)
</script>

<style scoped>
.pagina-configuracion {
  background-color: var(--color-fondo);
  padding: 20px;
  overflow-y: auto;
}
.contenedor-configuracion {
  max-width: 600px;
  margin: 0 auto;
}
</style>
