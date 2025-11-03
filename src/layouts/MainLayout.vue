<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="header-personalizado">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="/favicon.png" />
          </q-avatar>
          Ta-Te-Ti
        </q-toolbar-title>

        <!-- Mostrar nombre del usuario -->
        <div class="nombre-usuario">
          <i class="ti ti-user icono-usuario"></i>
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
          <div class="drawer-titulo">Ta-Te-Ti</div>
          <div class="drawer-subtitulo">Tres en Raya</div>
        </div>

        <q-separator class="separador-personalizado" />

        <q-list class="lista-menu">
          <q-item clickable to="/" exact class="item-menu">
            <q-item-section avatar>
              <i class="ti ti-device-gamepad-2"></i>
            </q-item-section>
            <q-item-section>
              <q-item-label>Jugar</q-item-label>
              <q-item-label caption>Nueva partida</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable to="/configuracion" exact class="item-menu">
            <q-item-section avatar>
              <i class="ti ti-settings"></i>
            </q-item-section>
            <q-item-section>
              <q-item-label>Configuración</q-item-label>
              <q-item-label caption>Ajustes de usuario</q-item-label>
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

const leftDrawerOpen = ref(false)

const { nombreUsuario, cargarNombre } = useConfiguracion()

onMounted(async () => {
  await cargarNombre()
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.header-personalizado {
  background-color: var(--color-nav-fondo);
  color: var(--color-texto-principal);
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
.icono-usuario {
  font-size: 1.1rem;
  color: var(--color-turno-activo);
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
.item-menu i {
  color: var(--color-turno-activo);
  font-size: 1.5rem;
}
.item-menu .q-item__label--caption {
  color: var(--color-texto-secundario);
  font-size: 0.75rem;
}
@media (max-width: 600px) {
  .nombre-usuario {
    font-size: 0.85rem;
    padding: 4px 10px;
  }
}
</style>
