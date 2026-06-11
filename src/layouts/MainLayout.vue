<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      class="header-personalizado"
      :class="{ 'header-modo-prueba': esModoPruebaPublicidad }"
    >
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="/favicon.png" />
          </q-avatar>
        </q-toolbar-title>

        <!-- Mostrar puntaje -->
        <div class="puntaje-header">
          <i class="ti ti-trophy icono-sm icono-primario"></i>
          <span class="puntaje-numero">{{ puntajeTotal }}</span>
          <span class="puntaje-texto">{{ t('puntuacion.puntos') }}</span>
        </div>

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

          <q-item
            v-if="estadoActualizacion.hayActualizacion"
            clickable
            class="item-menu item-actualizacion"
            @click="mostrarModalActualizacion = true"
          >
            <q-item-section avatar>
              <i class="ti ti-download icono-md icono-primario"></i>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t('actualizacion.abrirNovedades') }}</q-item-label>
              <q-item-label caption>
                {{ estadoActualizacion.versionDisponible }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container class="contenedor-paginas">
      <router-view />
    </q-page-container>

    <ModalActualizacion
      :visible="mostrarModalActualizacion"
      :version-instalada="estadoActualizacion.versionInstalada"
      :version-disponible="estadoActualizacion.versionDisponible"
      :cambios="estadoActualizacion.cambios"
      @cerrar="mostrarModalActualizacion = false"
      @actualizar="irAPlayStore"
    />
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ModalActualizacion from 'src/components/Actualizacion/ModalActualizacion.vue'
import {
  abrirActualizacionEnTienda,
  crearEstadoSinActualizacion,
  obtenerEstadoActualizacion,
} from 'src/components/Actualizacion/ServicioActualizacionApp'
import { useConfiguracion } from 'src/components/Composables/useConfiguracion'
import { useIdioma } from 'src/components/Composables/useIdioma'
import { usePuntuacion } from 'src/components/Composables/usePuntuacion'
import { usePublicidad } from 'src/components/Composables/usePublicidad'
import { esModoPruebaPublicidad } from 'src/components/Configuracion/ConfiguracionPublicidad'
import { useI18n } from 'vue-i18n'

const leftDrawerOpen = ref(false)
const mostrarModalActualizacion = ref(false)
const estadoActualizacion = ref(crearEstadoSinActualizacion())
let idiomaPreparado = false

const { nombreUsuario, cargarNombre } = useConfiguracion()
const { idiomaActual, cargarIdioma } = useIdioma()
const { puntajeTotal, cargarPuntuacion } = usePuntuacion()
const { inicializarAdMob, mostrarBanner } = usePublicidad()
const { t } = useI18n()

const verificarActualizacion = async () => {
  estadoActualizacion.value = await obtenerEstadoActualizacion(idiomaActual.value)
  mostrarModalActualizacion.value = estadoActualizacion.value.hayActualizacion
}

const irAPlayStore = () => {
  abrirActualizacionEnTienda(estadoActualizacion.value.urlPlayStore)
}

onMounted(async () => {
  await cargarNombre()
  await cargarIdioma()
  idiomaPreparado = true
  await cargarPuntuacion()
  console.log('🎯 Nombre después de cargar:', nombreUsuario.value)
  console.log('🏆 Puntaje después de cargar:', puntajeTotal.value)

  void verificarActualizacion()

  // Inicializar AdMob y mostrar banner
  await inicializarAdMob()
  await mostrarBanner()
})

watch(idiomaActual, () => {
  if (idiomaPreparado) {
    void verificarActualizacion()
  }
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.header-personalizado {
  background-color: var(--color-nav-fondo);
  color: var(--color-texto-principal);
  min-height: 50px !important;
}
.header-modo-prueba {
  background-color: var(--color-modo-prueba);
}
/* Ajuste para el toolbar dentro del header */
.header-personalizado .q-toolbar {
  min-height: 40px;
}
.puntaje-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  color: var(--color-texto-principal);
  padding: 6px 12px;
  background: linear-gradient(135deg, var(--color-boton) 0%, var(--color-turno-activo) 100%);
  border-radius: 20px;
  border: 2px solid var(--color-turno-activo);
  box-shadow: 0 4px 12px rgba(255, 190, 11, 0.3);
  margin-right: 8px;
}
.puntaje-numero {
  font-weight: bold;
  font-size: 1.1rem;
}
.puntaje-texto {
  font-size: 0.85rem;
  opacity: 0.9;
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
  box-sizing: border-box;
  background-color: var(--color-fondo-alterno);
  min-height: var(--altura-pantalla);
  padding-bottom: var(--espacio-inferior-contenido);
  width: 100%;
}
.contenedor-paginas {
  padding-bottom: var(--espacio-inferior-contenido);
  transition: padding-bottom 0.2s ease;
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
.item-actualizacion {
  border: 1px solid var(--color-turno-activo);
}
@media (max-width: 600px) {
  .puntaje-header {
    font-size: 0.85rem;
    padding: 4px 10px;
    margin-right: 6px;
  }
  .puntaje-numero {
    font-size: 1rem;
  }
  .puntaje-texto {
    font-size: 0.75rem;
  }
  .nombre-usuario {
    font-size: 0.85rem;
    padding: 4px 10px;
  }
}
</style>
