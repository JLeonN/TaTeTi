<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      class="header-personalizado"
      :class="{ 'header-modo-prueba': esModoPruebaPublicidad }"
    >
      <q-toolbar
        ref="toolbarHeader"
        class="toolbar-header"
        :class="{ 'toolbar-header-compacto': nivelCompactacionHeader > 0 }"
      >
        <q-btn class="boton-menu-header" dense flat round icon="menu" @click="toggleLeftDrawer" />

        <button
          v-show="nivelCompactacionHeader < 1"
          type="button"
          class="logo-header"
          :aria-label="t('menu.jugarIA')"
          :title="t('menu.jugarIA')"
          @click="irAJugarContraIA"
        >
          <q-avatar size="40px">
            <img src="/favicon.png" />
          </q-avatar>
        </button>
        <div class="espaciador-header"></div>

        <!-- Mostrar puntaje -->
        <button
          ref="puntajeHeader"
          type="button"
          class="puntaje-header"
          :aria-label="t('tienda.abrirTienda')"
          @click="irATienda"
        >
          <i v-show="nivelCompactacionHeader < 2" class="ti ti-trophy icono-sm icono-primario"></i>
          <span class="puntaje-numero">{{ puntajeTotal }}</span>
          <span v-show="nivelCompactacionHeader < 4" class="puntaje-texto">
            {{ t('puntuacion.puntos') }}
          </span>
        </button>

        <!-- Mostrar nombre del usuario -->
        <button
          ref="nombreHeader"
          type="button"
          class="nombre-usuario"
          :class="{ 'nombre-usuario-recortado': nivelCompactacionHeader >= 5 }"
          :title="nombreUsuario"
          :aria-label="`${t('configuracion.cambiarNombre')}: ${nombreUsuario}`"
          @click="irAConfiguracionUsuario"
        >
          <i v-show="nivelCompactacionHeader < 3" class="ti ti-user icono-sm icono-primario"></i>
          <span class="nombre-usuario-texto">{{ nombreUsuario }}</span>
        </button>
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

          <q-item clickable to="/tienda" exact class="item-menu">
            <q-item-section avatar>
              <i class="ti ti-shopping-bag icono-md icono-primario"></i>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t('tienda.titulo') }}</q-item-label>
              <q-item-label caption>{{ t('tienda.menuDescripcion') }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable to="/inventario" exact class="item-menu">
            <q-item-section avatar>
              <i class="ti ti-backpack icono-md icono-primario"></i>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t('inventario.titulo') }}</q-item-label>
              <q-item-label caption>{{ t('inventario.menuDescripcion') }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="separador-personalizado separador-menu" />

          <q-item clickable to="/estadisticas" exact class="item-menu">
            <q-item-section avatar>
              <i class="ti ti-chart-bar icono-md icono-primario"></i>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t('menu.estadisticas') }}</q-item-label>
              <q-item-label caption>{{ t('menu.estadisticasDescripcion') }}</q-item-label>
            </q-item-section>
          </q-item>

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
import { ref, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ModalActualizacion from 'src/components/Actualizacion/ModalActualizacion.vue'
import {
  abrirActualizacionEnTienda,
  crearEstadoSinActualizacion,
  obtenerEstadoActualizacion,
} from 'src/components/Actualizacion/ServicioActualizacionApp'
import { useConfiguracion } from 'src/components/Composables/useConfiguracion'
import { useIdioma } from 'src/components/Composables/useIdioma'
import { usePuntuacion } from 'src/components/Composables/usePuntuacion'
import { useEquipamiento } from 'src/components/Composables/useEquipamiento'
import { usePublicidad } from 'src/components/Composables/usePublicidad'
import { inicializarRecompensas } from 'src/Servicios/Economia/ServicioRecompensas'
import { esModoPruebaPublicidad } from 'src/components/Configuracion/ConfiguracionPublicidad'
import { useI18n } from 'vue-i18n'

const leftDrawerOpen = ref(false)
const mostrarModalActualizacion = ref(false)
const estadoActualizacion = ref(crearEstadoSinActualizacion())
const toolbarHeader = ref(null)
const puntajeHeader = ref(null)
const nombreHeader = ref(null)
const nivelCompactacionHeader = ref(0)
let idiomaPreparado = false
let observadorHeader = null
let identificadorMedicionHeader = 0
let fotogramaAjusteHeader = 0

const { nombreUsuario, cargarNombre } = useConfiguracion()
const { idiomaActual, cargarIdioma } = useIdioma()
const { puntajeTotal, cargarPuntuacion } = usePuntuacion()
const { cargarEquipamiento } = useEquipamiento()
const { inicializarAdMob, mostrarBanner } = usePublicidad()
const { t } = useI18n()
const router = useRouter()

const obtenerElementoDom = (referencia) => referencia.value?.$el ?? referencia.value

const sumarMedidasHorizontales = (elemento) => {
  if (!elemento) return 0
  const estilos = window.getComputedStyle(elemento)
  return (
    (Number.parseFloat(estilos.paddingLeft) || 0) +
    (Number.parseFloat(estilos.paddingRight) || 0) +
    (Number.parseFloat(estilos.borderLeftWidth) || 0) +
    (Number.parseFloat(estilos.borderRightWidth) || 0)
  )
}

const calcularAnchoNaturalNombre = (nombre) => {
  if (!nombre) return 0
  const texto = nombre.querySelector('.nombre-usuario-texto')
  const icono = nombre.querySelector('i')
  const estilos = window.getComputedStyle(nombre)
  const separacion =
    icono && window.getComputedStyle(icono).display !== 'none'
      ? Number.parseFloat(estilos.columnGap) || 0
      : 0

  return (
    (texto?.scrollWidth ?? 0) +
    (icono?.offsetWidth ?? 0) +
    separacion +
    sumarMedidasHorizontales(nombre)
  )
}

const calcularAnchoRequeridoHeader = () => {
  const toolbar = obtenerElementoDom(toolbarHeader)
  const puntaje = obtenerElementoDom(puntajeHeader)
  const nombre = obtenerElementoDom(nombreHeader)
  const botonMenu = toolbar?.querySelector('.boton-menu-header')
  const logo = toolbar?.querySelector('.logo-header')
  const estilosToolbar = toolbar ? window.getComputedStyle(toolbar) : null
  const separacion = estilosToolbar ? Number.parseFloat(estilosToolbar.columnGap) || 0 : 0
  const cantidadElementosVisibles = toolbar
    ? Array.from(toolbar.children).filter(
        (elemento) => window.getComputedStyle(elemento).display !== 'none',
      ).length
    : 0
  const relleno =
    estilosToolbar === null
      ? 0
      : (Number.parseFloat(estilosToolbar.paddingLeft) || 0) +
        (Number.parseFloat(estilosToolbar.paddingRight) || 0)

  return (
    relleno +
    (botonMenu?.offsetWidth ?? 0) +
    (logo?.offsetWidth ?? 0) +
    (puntaje?.scrollWidth ?? 0) +
    calcularAnchoNaturalNombre(nombre) +
    separacion * Math.max(0, cantidadElementosVisibles - 1)
  )
}

const ajustarHeader = async () => {
  const identificadorActual = ++identificadorMedicionHeader
  nivelCompactacionHeader.value = 0
  await nextTick()

  const toolbar = obtenerElementoDom(toolbarHeader)
  if (!toolbar) return

  for (let nivel = 0; nivel <= 4; nivel += 1) {
    if (identificadorActual !== identificadorMedicionHeader) return
    nivelCompactacionHeader.value = nivel
    await nextTick()

    if (calcularAnchoRequeridoHeader() <= toolbar.clientWidth) return
  }

  nivelCompactacionHeader.value = 5
}

const programarAjusteHeader = () => {
  window.cancelAnimationFrame(fotogramaAjusteHeader)
  fotogramaAjusteHeader = window.requestAnimationFrame(() => {
    void ajustarHeader()
  })
}

const irAConfiguracionUsuario = () => {
  void router.push({
    path: '/configuracion',
    query: {
      enfocar: 'usuario',
      solicitud: Date.now().toString(),
    },
  })
}

const irAJugarContraIA = () => {
  void router.push('/')
}

const irATienda = () => {
  void router.push('/tienda')
}

const verificarActualizacion = async () => {
  estadoActualizacion.value = await obtenerEstadoActualizacion(idiomaActual.value)
  mostrarModalActualizacion.value = estadoActualizacion.value.hayActualizacion
}

const irAPlayStore = () => {
  abrirActualizacionEnTienda(estadoActualizacion.value.urlPlayStore)
}

onMounted(async () => {
  observadorHeader = new ResizeObserver(programarAjusteHeader)
  const toolbar = obtenerElementoDom(toolbarHeader)
  if (toolbar) observadorHeader.observe(toolbar)
  programarAjusteHeader()

  await cargarNombre()
  await cargarIdioma()
  idiomaPreparado = true
  await cargarPuntuacion()
  await cargarEquipamiento()
  await inicializarRecompensas()
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

watch([nombreUsuario, puntajeTotal], programarAjusteHeader, { flush: 'post' })

onBeforeUnmount(() => {
  observadorHeader?.disconnect()
  observadorHeader = null
  identificadorMedicionHeader += 1
  window.cancelAnimationFrame(fotogramaAjusteHeader)
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.header-personalizado {
  background-color: var(--color-nav-fondo);
  color: var(--color-texto-principal);
  height: var(--altura-header);
}
.header-modo-prueba {
  background-color: var(--color-modo-prueba);
}
.toolbar-header {
  box-sizing: border-box;
  min-height: var(--altura-header);
  height: var(--altura-header);
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  overflow: hidden;
}
.toolbar-header-compacto {
  gap: 4px;
  padding-right: 6px;
  padding-left: 6px;
}
.boton-menu-header,
.logo-header,
.puntaje-header {
  appearance: none;
  flex: 0 0 auto;
}
.logo-header {
  appearance: none;
  display: flex;
  align-items: center;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.logo-header:focus-visible {
  outline: 2px solid var(--color-turno-activo);
  outline-offset: 2px;
}
.logo-header:active {
  transform: scale(0.94);
}
.espaciador-header {
  min-width: 0;
  flex: 1 1 auto;
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
  white-space: nowrap;
  cursor: pointer;
  font-family: inherit;
}
.puntaje-header:focus-visible {
  outline: 2px solid var(--color-texto-principal);
  outline-offset: 2px;
}
.puntaje-header:active {
  transform: scale(0.97);
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
  appearance: none;
  min-width: 0;
  max-width: 100%;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  color: var(--color-texto-secundario);
  padding: 6px 12px;
  background-color: var(--color-fondo-alterno);
  border-radius: 20px;
  border: 1px solid var(--color-borde-tablero);
  cursor: pointer;
  white-space: nowrap;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}
.nombre-usuario-recortado {
  flex: 1 1 auto;
}
.nombre-usuario:hover,
.nombre-usuario:focus-visible {
  border-color: var(--color-turno-activo);
}
.nombre-usuario:active {
  transform: scale(0.97);
}
.nombre-usuario-texto {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.contenedor-paginas :deep(.q-page) {
  min-height: var(--altura-pagina) !important;
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
  .toolbar-header {
    padding-right: 8px;
    padding-left: 8px;
  }
  .toolbar-header-compacto {
    gap: 3px;
    padding-right: 4px;
    padding-left: 4px;
  }
  .puntaje-header {
    font-size: 0.85rem;
    padding: 4px 10px;
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
  .toolbar-header-compacto .puntaje-header,
  .toolbar-header-compacto .nombre-usuario {
    gap: 4px;
    padding-right: 7px;
    padding-left: 7px;
  }
}
</style>
