<template>
  <q-page class="pagina-inventario">
    <div class="contenedor-inventario">
      <header>
        <h1 class="titulo-h1-con-icono">
          <i class="ti ti-backpack icono-xl icono-primario"></i>
          {{ t('inventario.titulo') }}
        </h1>
        <p>{{ t('inventario.subtitulo') }}</p>
      </header>

      <section class="vista-equipamiento">
        <div>
          <span>X</span>
          <strong>{{ nombreColor(equipamiento.X) }}</strong>
        </div>
        <div>
          <span>O</span>
          <strong>{{ nombreColor(equipamiento.O) }}</strong>
        </div>
      </section>

      <section class="panel-inventario">
        <h2>{{ t('inventario.coloresFicha', { ficha: 'X' }) }}</h2>
        <div class="lista-colores">
          <button
            v-for="articulo in articulosDisponibles"
            :key="`X-${articulo.id}`"
            type="button"
            :class="{ activo: equipamiento.X === articulo.id }"
            @click="equipar('X', articulo.id)"
          >
            <i :style="{ backgroundColor: `var(${articulo.variable})` }"></i>
            {{ t(articulo.claveNombre) }}
          </button>
        </div>
      </section>

      <section class="panel-inventario">
        <h2>{{ t('inventario.coloresFicha', { ficha: 'O' }) }}</h2>
        <div class="lista-colores">
          <button
            v-for="articulo in articulosDisponibles"
            :key="`O-${articulo.id}`"
            type="button"
            :class="{ activo: equipamiento.O === articulo.id }"
            @click="equipar('O', articulo.id)"
          >
            <i :style="{ backgroundColor: `var(${articulo.variable})` }"></i>
            {{ t(articulo.claveNombre) }}
          </button>
        </div>
      </section>

      <section class="panel-inventario">
        <h2>{{ t('inventario.fichaPreferida') }}</h2>
        <p>{{ t('inventario.fichaPreferidaDescripcion') }}</p>
        <div class="selector-ficha">
          <button
            v-for="ficha in ['X', 'O']"
            :key="ficha"
            type="button"
            :class="{ activo: fichaUsuario === ficha }"
            @click="seleccionarFicha(ficha)"
          >
            {{ ficha }}
          </button>
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
const articulosDisponibles = computed(() =>
  catalogoColores.filter((articulo) => articulosAdquiridos.value.has(articulo.id)),
)
const nombreColor = (id) => {
  const articulo = obtenerArticulo(id)
  return articulo ? t(articulo.claveNombre) : ''
}

const equipar = async (ficha, articuloId) => {
  await equiparArticulo(ficha, articuloId)
}

const seleccionarFicha = async (ficha) => {
  await guardarFichaUsuario(ficha)
}

onMounted(async () => {
  await Promise.all([cargarEquipamiento(), cargarFichaUsuario()])
})
</script>

<style scoped>
.pagina-inventario {
  padding: 16px;
  color: var(--color-texto-principal);
  background-color: var(--color-fondo);
}
.contenedor-inventario {
  width: min(800px, 100%);
  margin: 0 auto;
}
.contenedor-inventario header p,
.panel-inventario p {
  color: var(--color-texto-secundario);
}
.vista-equipamiento {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 20px 0;
}
.vista-equipamiento div {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: var(--color-tablero);
  border-radius: 14px;
}
.vista-equipamiento span {
  font-size: 4rem;
  font-weight: bold;
}
.vista-equipamiento div:first-child span {
  color: var(--color-ficha-x);
  text-shadow: 0 0 16px var(--color-ficha-x);
}
.vista-equipamiento div:last-child span {
  color: var(--color-ficha-o);
  text-shadow: 0 0 16px var(--color-ficha-o);
}
.panel-inventario {
  margin-bottom: 16px;
  padding: 16px;
  background-color: var(--color-fondo-alterno);
  border: 1px solid var(--color-borde-tablero);
  border-radius: 12px;
}
.panel-inventario h2 {
  margin-top: 0;
}
.lista-colores {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.lista-colores button,
.selector-ficha button {
  padding: 12px;
  color: var(--color-texto-principal);
  background-color: var(--color-tablero);
  border: 2px solid transparent;
  border-radius: 9px;
  cursor: pointer;
}
.lista-colores button.activo,
.selector-ficha button.activo {
  border-color: var(--color-turno-activo);
}
.lista-colores i {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 6px;
  border-radius: 50%;
}
.selector-ficha {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.selector-ficha button {
  font-size: 2rem;
  font-weight: bold;
}
@media (max-width: 600px) {
  .lista-colores {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
