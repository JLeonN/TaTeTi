<template>
  <q-page class="pagina-inventario">
    <div class="contenedor-inventario">
      <header class="cabecera-inventario">
        <h1 class="titulo-h1-con-icono">
          <i class="ti ti-backpack icono-xl icono-primario"></i>
          {{ t('inventario.titulo') }}
        </h1>
        <p>{{ t('inventario.subtitulo') }}</p>
      </header>

      <section class="tarjeta-equipado" aria-label="Equipado">
        <h2>Equipado</h2>
        <div class="grilla-equipado">
          <article
            v-for="ficha in fichas"
            :key="`equipado-${ficha}`"
            class="ficha-equipada"
            :class="{ fluor: esArticuloFluor(obtenerArticuloEquipado(ficha)) }"
            :style="obtenerEstiloArticulo(obtenerArticuloEquipado(ficha))"
          >
            <span
              class="simbolo-equipado"
              :style="obtenerEstiloMuestraColor(obtenerArticuloEquipado(ficha))"
            >
              {{ ficha }}
            </span>
            <small v-if="esArticuloFluor(obtenerArticuloEquipado(ficha))" class="etiqueta-fluor">
              <i class="ti ti-sparkles"></i>
              FLÚOR
            </small>
            <strong>{{ nombreColor(equipamiento[ficha]) }}</strong>
          </article>
        </div>
      </section>

      <section class="seccion-inventario">
        <h2 class="titulo-seccion-inventario">{{ t('inventario.coloresFicha', { ficha: 'X' }) }}</h2>
        <div class="panel-inventario">
          <div class="carrusel-colores" role="list" :aria-label="t('inventario.coloresFicha', { ficha: 'X' })">
            <button
              v-for="articulo in articulosDisponibles"
              :key="`X-${articulo.id}`"
              class="item-color"
              type="button"
              role="listitem"
              :class="{
                activo: equipamiento.X === articulo.id,
                fluor: esArticuloFluor(articulo),
              }"
              :style="obtenerEstiloArticulo(articulo)"
              :aria-label="textoAccesibleColor('X', articulo)"
              @click="equipar('X', articulo.id)"
            >
              <span class="simbolo-color" :style="obtenerEstiloMuestraColor(articulo)">X</span>
              <span class="nombre-color">{{ t(articulo.claveNombre) }}</span>
            </button>
          </div>
        </div>
      </section>

      <section class="seccion-inventario">
        <h2 class="titulo-seccion-inventario">{{ t('inventario.coloresFicha', { ficha: 'O' }) }}</h2>
        <div class="panel-inventario">
          <div class="carrusel-colores" role="list" :aria-label="t('inventario.coloresFicha', { ficha: 'O' })">
            <button
              v-for="articulo in articulosDisponibles"
              :key="`O-${articulo.id}`"
              class="item-color"
              type="button"
              role="listitem"
              :class="{
                activo: equipamiento.O === articulo.id,
                fluor: esArticuloFluor(articulo),
              }"
              :style="obtenerEstiloArticulo(articulo)"
              :aria-label="textoAccesibleColor('O', articulo)"
              @click="equipar('O', articulo.id)"
            >
              <span class="simbolo-color" :style="obtenerEstiloMuestraColor(articulo)">O</span>
              <span class="nombre-color">{{ t(articulo.claveNombre) }}</span>
            </button>
          </div>
        </div>
      </section>

      <section class="seccion-inventario">
        <h2 class="titulo-seccion-inventario">{{ t('inventario.fichaPreferida') }}</h2>
        <div class="panel-inventario">
          <p>{{ t('inventario.fichaPreferidaDescripcion') }}</p>
          <div class="selector-ficha">
            <button
              v-for="ficha in fichas"
              :key="ficha"
              type="button"
              :class="{ activo: fichaUsuario === ficha }"
              @click="seleccionarFicha(ficha)"
            >
              {{ ficha }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { catalogoColores, obtenerArticulo } from 'src/Servicios/Economia/CatalogoTienda'
import { useEquipamiento } from 'src/components/Composables/useEquipamiento'
import { useFichaJugador } from 'src/components/Composables/UseFichaJugador'

const { t } = useI18n()
const { equipamiento, articulosAdquiridos, cargarEquipamiento, equiparArticulo } =
  useEquipamiento()
const { fichaUsuario, cargarFichaUsuario, guardarFichaUsuario } = useFichaJugador()
const fichas = ['X', 'O']
const articulosDisponibles = computed(() =>
  catalogoColores.filter((articulo) => articulosAdquiridos.value.has(articulo.id)),
)
const nombreColor = (id) => {
  const articulo = obtenerArticulo(id)
  return articulo ? t(articulo.claveNombre) : ''
}

const obtenerArticuloEquipado = (ficha) => obtenerArticulo(equipamiento.value[ficha])

const esArticuloFluor = (articulo) => articulo?.id.endsWith('Fluor') ?? false

const obtenerEstiloArticulo = (articulo) => ({
  '--color-articulo': articulo?.colorVista ?? 'var(--color-texto-principal)',
})

const obtenerEstiloMuestraColor = (articulo) => {
  const color = articulo?.colorVista ?? 'var(--color-texto-principal)'
  const sombraBase = '0 2px 3px rgba(0, 0, 0, 0.35)'
  if (!esArticuloFluor(articulo)) {
    return {
      color,
      WebkitTextFillColor: color,
      textShadow: sombraBase,
    }
  }
  const sombraFluor =
    articulo.id === 'blancoFluor'
      ? '0 0 6px #8beeff, 0 0 14px #8beeff'
      : `0 0 5px ${color}, 0 0 12px ${color}`
  return {
    color,
    WebkitTextFillColor: color,
    textShadow: `${sombraFluor}, ${sombraBase}`,
  }
}

const equipar = async (ficha, articuloId) => {
  await equiparArticulo(ficha, articuloId)
}

const seleccionarFicha = async (ficha) => {
  await guardarFichaUsuario(ficha)
}

const textoAccesibleColor = (ficha, articulo) =>
  `${t('inventario.coloresFicha', { ficha })}: ${t(articulo.claveNombre)}`

onMounted(async () => {
  await Promise.all([cargarEquipamiento(), cargarFichaUsuario()])
})
</script>

<style scoped>
.pagina-inventario {
  padding: 10px 12px 16px;
  color: var(--color-texto-principal);
  background-color: var(--color-fondo);
}
.contenedor-inventario {
  width: min(800px, 100%);
  margin: 0 auto;
}
.cabecera-inventario p,
.panel-inventario p {
  color: var(--color-texto-secundario);
}
.cabecera-inventario p {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.15;
}
.cabecera-inventario .titulo-h1-con-icono {
  margin: 8px 0 3px;
  font-size: 1.7rem;
  line-height: 1.1;
}
.cabecera-inventario .icono-xl {
  font-size: 1.85rem;
}
.tarjeta-equipado {
  margin: 14px 0 16px;
  padding: 12px;
  background-color: var(--color-fondo-alterno);
  border: 1px solid var(--color-borde-tablero);
  border-radius: 12px;
}
.tarjeta-equipado h2 {
  margin: 0 0 10px;
  color: var(--color-texto-secundario);
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1;
  text-transform: uppercase;
}
.grilla-equipado {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.ficha-equipada {
  position: relative;
  display: flex;
  min-height: 126px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 14px 10px;
  color: var(--color-texto-principal);
  background-color: var(--color-tablero);
  border: 1px solid color-mix(in srgb, var(--color-articulo) 44%, transparent);
  border-radius: 10px;
  box-shadow:
    0 0 5px color-mix(in srgb, var(--color-articulo) 28%, transparent),
    inset 0 0 10px color-mix(in srgb, var(--color-articulo) 16%, transparent);
}
.ficha-equipada.fluor {
  box-shadow:
    0 0 8px color-mix(in srgb, var(--color-articulo) 42%, transparent),
    inset 0 0 12px color-mix(in srgb, var(--color-articulo) 26%, transparent);
}
.ficha-equipada strong {
  max-width: 100%;
  overflow: hidden;
  font-size: 0.82rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.simbolo-equipado {
  font-size: 3.75rem;
  font-weight: bold;
  line-height: 1;
}
.seccion-inventario {
  margin-bottom: 14px;
}
.titulo-seccion-inventario {
  margin: 0 0 7px 2px;
  color: var(--color-texto-principal);
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.15;
}
.panel-inventario {
  padding: 10px;
  background-color: var(--color-fondo-alterno);
  border: 1px solid var(--color-borde-tablero);
  border-radius: 12px;
}
.carrusel-colores {
  display: grid;
  grid-auto-columns: 94px;
  grid-auto-flow: column;
  gap: 9px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding: 2px 2px 8px;
  scroll-padding-inline: 2px;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.carrusel-colores::-webkit-scrollbar {
  display: none;
}
.item-color {
  position: relative;
  display: flex;
  width: 100%;
  aspect-ratio: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: var(--color-texto-principal);
  background-color: var(--color-tablero);
  border: 2px solid color-mix(in srgb, var(--color-articulo, var(--color-borde-tablero)) 70%, transparent);
  border-radius: 10px;
  box-shadow:
    0 0 5px color-mix(in srgb, var(--color-articulo, var(--color-borde-tablero)) 34%, transparent),
    inset 0 0 8px color-mix(in srgb, var(--color-articulo, var(--color-borde-tablero)) 12%, transparent);
  cursor: pointer;
  scroll-snap-align: start;
}
.item-color.fluor {
  box-shadow:
    0 0 7px color-mix(in srgb, var(--color-articulo) 46%, transparent),
    inset 0 0 10px color-mix(in srgb, var(--color-articulo) 24%, transparent);
}
.item-color.activo,
.selector-ficha button.activo {
  border-color: var(--color-turno-activo);
  box-shadow:
    0 0 8px color-mix(in srgb, var(--color-turno-activo) 70%, transparent),
    inset 0 0 8px color-mix(in srgb, var(--color-turno-activo) 26%, transparent);
}
.simbolo-color {
  font-size: 2.35rem;
  font-weight: 900;
  line-height: 1;
}
.nombre-color {
  max-width: 100%;
  overflow: hidden;
  font-size: 0.68rem;
  font-weight: 800;
  line-height: 1.05;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.etiqueta-fluor {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 6px;
  color: var(--color-fondo);
  background-color: var(--color-turno-activo);
  border-radius: 999px;
  box-shadow: 0 0 8px var(--color-turno-activo);
  font-size: 0.58rem;
  font-weight: 900;
  line-height: 1;
}
.etiqueta-fluor i {
  font-size: 0.68rem;
}
.panel-inventario p {
  margin: 0 0 10px;
  color: var(--color-texto-secundario);
  font-size: 0.78rem;
  line-height: 1.25;
}
.selector-ficha {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.selector-ficha button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 58px;
  color: var(--color-texto-principal);
  background-color: var(--color-tablero);
  border: 2px solid var(--color-borde-tablero);
  border-radius: 10px;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
}
@media (max-width: 600px) {
  .carrusel-colores {
    grid-auto-columns: 88px;
  }
}
</style>
