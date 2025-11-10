<template>
  <q-page class="pagina-configuracion">
    <div class="contenedor-configuracion">
      <h1 class="titulo-h1-con-icono">
        <i class="ti ti-settings icono-xl icono-primario"></i>
        Configuración
      </h1>

      <!-- Componente de configuración de usuario -->
      <ConfiguracionUsuario />

      <!-- Componente de configuración de idioma -->
      <ConfiguracionIdioma />
    </div>
  </q-page>
</template>

<script setup>
import ConfiguracionUsuario from '../components/configuración/ConfiguracionUsuario.vue'
import ConfiguracionIdioma from '../components/configuración/ConfiguracionIdioma.vue'
</script>

<style scoped>
.pagina-configuracion {
  background-color: var(--color-fondo);
  min-height: 100vh;
  padding: 20px;
}
.contenedor-configuracion {
  max-width: 600px;
  margin: 0 auto;
}
</style>
