<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="header-personalizado">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="/favicon.png" />
          </q-avatar>
          {{ t('general.nombreApp') }}
        </q-toolbar-title>

        <!-- Mostrar nombre del usuario -->
        <div class="nombre-usuario">
          <i class="ti ti-user icono-sm icono-primario"></i>
          <span>{{ nombreUsuario }}</span>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      elevated
      class="drawer-personalizado"
    >
      <div class="contenedor-drawer">
        <!-- Header del drawer -->
        <div class="drawer-header">
          <q-avatar size="50px">
            <img src="/favicon.png" />
          </q-avatar>
          <div class="drawer-titulo">{{ t('general.nombreApp') }}</div>
          <div class="drawer-subtitulo">{{ t('general.tresEnRaya') }}</div>
        </div>

        <q-separator class="separador-personalizado" />

        <q-list class="lista-menu">
          <q-item clickable to="/" exact class="item-menu">
            <q-item-section avatar>
              <i class="ti ti-robot icono-md icono-primario"></i>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t('menu.jugarIA') }}</q-item-label>
              <q-item-label caption>{{ t('menu.jugarIADescripcion') }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable to="/jugador-vs-jugador" exact class="item-menu">
            <q-item-section avatar>
              <i class="ti ti-device-gamepad-2 icono-md icono-primario"></i>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t('menu.multijugador') }}</q-item-label>
              <q-item-label caption>{{ t('menu.multijugadorDescripcion') }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="separador-personalizado separador-menu" />

          <q-item clickable to="/configuracion" exact class="item-menu">
            <q-item-section avatar>
              <i class="ti ti-settings icono-md icono-primario"></i>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t('configuracion.titulo') }}</q-item-label>
              <q-item-label caption>{{ t('configuracion.subtitulo') }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfiguracion } from 'src/components/Composables/useConfiguracion'
import { useIdioma } from 'src/components/Composables/useIdioma'
import { useI18n } from 'vue-i18n'

const leftDrawerOpen = ref(false)

const { nombreUsuario, cargarNombre } = useConfiguracion()
const { cargarIdioma } = useIdioma()
const { t } = useI18n()

onMounted(async () => {
  await cargarNombre()
  await cargarIdioma()
  console.log('🎯 Nombre después de cargar:', nombreUsuario.value)
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.header-personalizado {
  background-color: var(--color-nav-fondo);
  color: var(--color-texto-principal);
  padding-top: 24px !important; /* Espacio para la barra de estado */
  min-height: 50px !important; /* Altura mínima aumentada */
}
/* Ajuste para el toolbar dentro del header */
.header-personalizado .q-toolbar {
  min-height: 40px;
}
.nombre-usuario {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  color: var(--color-texto-secundario);
  padding: 6px 12px;
  background-color: var(--color-fondo-alterno);
  border-radius: 20px;
  border: 1px solid var(--color-borde-tablero);
}
.drawer-personalizado {
  background-color: var(--color-fondo-alterno) !important;
}
.contenedor-drawer {
  background-color: var(--color-fondo-alterno);
  min-height: 100vh;
  width: 100%;
}
.drawer-header {
  padding: 30px 20px;
  text-align: center;
  background-color: var(--color-nav-fondo);
}
.drawer-titulo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-texto-principal);
  margin-top: 12px;
}
.drawer-subtitulo {
  font-size: 0.9rem;
  color: var(--color-texto-secundario);
  margin-top: 4px;
}
.separador-personalizado {
  background-color: var(--color-borde-tablero);
}
.separador-menu {
  margin: 8px 16px;
}
.lista-menu {
  padding: 12px 0;
}
.item-menu {
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: var(--color-texto-principal);
}
.item-menu:hover {
  background-color: var(--color-tablero);
  transform: translateX(4px);
}
.item-menu .q-item__label--caption {
  color: var(--color-texto-secundario);
  font-size: 0.75rem;
}
/* Responsive: Más padding en pantallas con notch */
@media (max-width: 600px) {
  .header-personalizado {
    padding-top: 32px !important; /* Más espacio en móviles */
    min-height: 50px !important;
  }
  .nombre-usuario {
    font-size: 0.85rem;
    padding: 4px 10px;
  }
}
/* Padding extra para dispositivos con notch grande */
@supports (padding: max(0px)) {
  .header-personalizado {
    padding-top: max(24px, env(safe-area-inset-top, 24px)) !important;
  }
}
</style>
