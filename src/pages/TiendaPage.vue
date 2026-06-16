<template>
  <q-page class="pagina-tienda">
    <div class="contenedor-tienda">
      <header class="cabecera-tienda">
        <div>
          <h1 class="titulo-h1-con-icono">
            <i class="ti ti-shopping-bag icono-xl icono-primario"></i>
            {{ t('tienda.titulo') }}
          </h1>
          <p>{{ t('tienda.subtitulo') }}</p>
        </div>
      </header>

      <section class="grilla-recompensas">
        <article
          ref="tarjetaRegalo"
          class="cuadro-recompensa regalo"
          :class="{ resaltada: seccionResaltada === 'regalo' }"
        >
          <i class="ti ti-gift"></i>
          <div class="contenido-recompensa">
            <h2>{{ t('tienda.regaloDiario') }}</h2>
            <strong>+{{ RECOMPENSA_DIARIA }} {{ t('puntuacion.puntos') }}</strong>
          </div>
          <button
            class="boton-cuadrado"
            type="button"
            :disabled="!regaloDisponible || procesando"
            @click="reclamarRegalo"
          >
            {{ regaloDisponible ? t('tienda.reclamar') : t('tienda.regaloReclamado') }}
          </button>
        </article>

        <article
          ref="tarjetaAnuncios"
          class="cuadro-recompensa anuncio"
          :class="{ resaltada: seccionResaltada === 'anuncios' }"
        >
          <i class="ti ti-player-play"></i>
          <div class="contenido-recompensa">
            <h2>{{ t('tienda.verAnuncio') }}</h2>
            <strong>
              +{{ RECOMPENSA_ANUNCIO }} {{ t('puntuacion.puntos') }} ·
              {{ anunciosRestantes }}/{{ MAXIMO_ANUNCIOS_DIARIOS }}
            </strong>
          </div>
          <button
            class="boton-cuadrado"
            type="button"
            :disabled="
              anunciosRestantes === 0 ||
              !recompensadoDisponible ||
              recompensadoCargando ||
              recompensadoMostrando ||
              procesando
            "
            @click="verAnuncio"
          >
            {{ recompensadoCargando ? t('tienda.cargandoAnuncio') : t('tienda.verVideo') }}
          </button>
        </article>
      </section>

      <div v-if="recompensasBloqueadas" class="aviso-bloqueo">
        <i class="ti ti-clock-exclamation"></i>
        {{ t('tienda.relojBloqueado') }}
      </div>

      <CarruselTienda :titulo="t('tienda.coloresTitulo')" :aria-label="t('tienda.coloresTitulo')">
        <template #acciones>
          <router-link class="boton-inventario" to="/inventario">
            <i class="ti ti-backpack"></i>
            {{ t('inventario.titulo') }}
          </router-link>
        </template>
        <button
          v-for="articulo in catalogoColoresOrdenados"
          :key="articulo.id"
          class="cuadro-color"
          type="button"
          :class="{
            adquirido: esArticuloAdquirido(articulo),
            bloqueado: !esArticuloAdquirido(articulo) && !puedeComprarArticulo(articulo),
            fluor: esArticuloFluor(articulo),
          }"
          :style="{ '--color-articulo': articulo.colorVista }"
          :aria-label="textoAccesibleArticulo(articulo)"
          :disabled="esArticuloAdquirido(articulo) || !puedeComprarArticulo(articulo)"
          @click="solicitarCompra(articulo)"
        >
          <span v-if="esArticuloFluor(articulo)" class="etiqueta-fluor">
            <i class="ti ti-sparkles"></i>
            FLÚOR
          </span>
          <span v-if="esArticuloAdquirido(articulo)" class="estado-color">
            <i class="ti ti-check"></i>
          </span>
          <span v-else class="precio-color">
            <i class="ti ti-trophy"></i>
            <strong>{{ articulo.precio }}</strong>
            <small>{{ t('puntuacion.puntos') }}</small>
          </span>
          <span class="muestra-color" :style="obtenerEstiloMuestraColor(articulo)">
            <span :style="obtenerEstiloMuestraColor(articulo)">X</span>
            <span :style="obtenerEstiloMuestraColor(articulo)">O</span>
          </span>
        </button>
      </CarruselTienda>
    </div>

    <ModalConfirmacion
      v-model="mostrarConfirmacion"
      compacto
      :titulo="t('tienda.confirmarCompra')"
      :mensaje="textoConfirmacionCompra"
      :texto-boton-cancelar="t('general.cancelar')"
      :texto-boton-aceptar="t('tienda.comprar')"
      @aceptar="confirmarCompra"
    >
      <div v-if="articuloPendiente" class="vista-previa-compra">
        <div
          class="vista-previa-color"
          :class="{ fluor: esArticuloFluor(articuloPendiente) }"
          :style="{ '--color-articulo': articuloPendiente.colorVista }"
          role="img"
          :aria-label="t(articuloPendiente.claveNombre)"
        >
          <span
            v-if="esArticuloFluor(articuloPendiente)"
            class="etiqueta-fluor etiqueta-fluor--preview"
          >
            <i class="ti ti-sparkles"></i>
            FLÚOR
          </span>
          <span
            class="muestra-color muestra-color--preview"
            :style="obtenerEstiloMuestraColor(articuloPendiente)"
          >
            <span :style="obtenerEstiloMuestraColor(articuloPendiente)">X</span>
            <span :style="obtenerEstiloMuestraColor(articuloPendiente)">O</span>
          </span>
        </div>
      </div>
    </ModalConfirmacion>
  </q-page>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CarruselTienda from 'src/components/Tienda/CarruselTienda.vue'
import ModalConfirmacion from 'src/components/Modales/ModalConfirmacion.vue'
import {
  catalogoColores,
  MAXIMO_ANUNCIOS_DIARIOS,
  RECOMPENSA_ANUNCIO,
  RECOMPENSA_DIARIA,
} from 'src/Servicios/Economia/CatalogoTienda'
import {
  comprarArticulo,
  inicializarEconomia,
  usarEconomia,
} from 'src/Servicios/Economia/ServicioEconomia'
import {
  actualizarDisponibilidad,
  inicializarRecompensas,
  reclamarRegaloDiario,
  registrarAnuncioRecompensado,
  usarRecompensas,
} from 'src/Servicios/Economia/ServicioRecompensas'
import { usePublicidad } from 'src/components/Composables/usePublicidad'

const { t } = useI18n()
const route = useRoute()
const { puntajeTotal, articulosAdquiridos, economiaDisponible } = usarEconomia()
const { regaloDisponible, anunciosRestantes, recompensasBloqueadas } = usarRecompensas()
const {
  recompensadoDisponible,
  recompensadoCargando,
  recompensadoMostrando,
  prepararRecompensado,
  mostrarRecompensado,
  eliminarManejadoresRecompensado,
} = usePublicidad()
const mostrarConfirmacion = ref(false)
const articuloPendiente = ref(null)
const procesando = ref(false)
const seccionResaltada = ref('')
const tarjetaRegalo = ref(null)
const tarjetaAnuncios = ref(null)
let temporizadorResaltado = 0
let temporizadorRecompensas = 0

const reclamarRegalo = async () => {
  procesando.value = true
  try {
    await reclamarRegaloDiario()
  } catch {
    // La pantalla ya refleja si la recompensa no está disponible.
  } finally {
    procesando.value = false
  }
}

const verAnuncio = async () => {
  procesando.value = true
  try {
    const recompensa = await mostrarRecompensado()
    if (!recompensa) throw new Error('anuncioIncompleto')
    await registrarAnuncioRecompensado()
    if (anunciosRestantes.value > 0) void prepararRecompensado()
  } catch {
    // La pantalla conserva el estado actual si el anuncio no completa recompensa.
  } finally {
    procesando.value = false
  }
}

const solicitarCompra = (articulo) => {
  articuloPendiente.value = articulo
  mostrarConfirmacion.value = true
}

const confirmarCompra = async () => {
  if (!articuloPendiente.value) return
  procesando.value = true
  try {
    await comprarArticulo(articuloPendiente.value.id)
    mostrarConfirmacion.value = false
  } catch {
    // Los botones deshabilitados evitan compras inválidas en el flujo normal.
  } finally {
    procesando.value = false
  }
}

const esArticuloAdquirido = (articulo) => articulosAdquiridos.value.has(articulo.id)

const esArticuloFluor = (articulo) => articulo.id.endsWith('Fluor')

const textoConfirmacionCompra = computed(() =>
  t('tienda.confirmarCompraDescripcion', {
    articulo: articuloPendiente.value ? t(articuloPendiente.value.claveNombre) : '',
    precio: articuloPendiente.value?.precio ?? 0,
  }),
)

const obtenerEstiloMuestraColor = (articulo) => {
  const color = articulo.colorVista
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
      ? '0 0 6px #8beeff, 0 0 14px #8beeff, 0 0 24px #8beeff'
      : `0 0 5px ${color}, 0 0 12px ${color}, 0 0 22px ${color}`
  return {
    color,
    WebkitTextFillColor: color,
    textShadow: `${sombraFluor}, ${sombraBase}`,
  }
}

const puedeComprarArticulo = (articulo) =>
  !esArticuloAdquirido(articulo) && puntajeTotal.value >= articulo.precio

const catalogoColoresOrdenados = computed(() =>
  [...catalogoColores].sort((articuloA, articuloB) => {
    const adquiridoA = esArticuloAdquirido(articuloA)
    const adquiridoB = esArticuloAdquirido(articuloB)
    if (adquiridoA !== adquiridoB) return adquiridoA ? 1 : -1
    return articuloA.precio - articuloB.precio
  }),
)

const textoAccesibleArticulo = (articulo) => {
  const nombre = t(articulo.claveNombre)
  if (esArticuloAdquirido(articulo)) return `${nombre}. ${t('tienda.comprado')}`
  if (!puedeComprarArticulo(articulo)) {
    return `${nombre}. ${articulo.precio} ${t('puntuacion.puntos')}. ${t('tienda.sinPuntos')}`
  }
  return `${nombre}. ${articulo.precio} ${t('puntuacion.puntos')}. ${t('tienda.comprar')}`
}

onMounted(async () => {
  await inicializarEconomia()
  await inicializarRecompensas()
  temporizadorRecompensas = window.setInterval(() => {
    void actualizarDisponibilidad()
  }, 1000)
  if (economiaDisponible.value && anunciosRestantes.value > 0) void prepararRecompensado()
  if (route.query.resaltar === 'regalo' || route.query.resaltar === 'anuncios') {
    seccionResaltada.value = route.query.resaltar
    await nextTick()
    const tarjeta = route.query.resaltar === 'regalo' ? tarjetaRegalo.value : tarjetaAnuncios.value
    tarjeta?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    temporizadorResaltado = window.setTimeout(() => {
      seccionResaltada.value = ''
    }, 2600)
  }
})

onBeforeUnmount(() => {
  window.clearTimeout(temporizadorResaltado)
  window.clearInterval(temporizadorRecompensas)
  void eliminarManejadoresRecompensado()
})
</script>

<style scoped>
.pagina-tienda {
  padding: 10px 12px 16px;
  color: var(--color-texto-principal);
  background-color: var(--color-fondo);
}
.contenedor-tienda {
  width: min(1000px, 100%);
  margin: 0 auto;
}
.cabecera-tienda p {
  margin: 0;
  color: var(--color-texto-secundario);
  font-size: 0.78rem;
  line-height: 1.15;
}
.cabecera-tienda .titulo-h1-con-icono {
  margin: 8px 0 3px;
  font-size: 1.7rem;
  line-height: 1.1;
}
.cabecera-tienda .icono-xl {
  font-size: 1.85rem;
}
.boton-inventario {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 32px;
  padding: 7px 11px;
  color: var(--color-texto-principal);
  background: linear-gradient(135deg, var(--color-boton), var(--color-turno-activo));
  border: none;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}
.grilla-recompensas {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 12px 0 8px;
}
.cuadro-recompensa {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 154px;
  padding: 16px 12px;
  text-align: center;
  background-color: var(--color-fondo-alterno);
  border: 1px solid var(--color-borde-tablero);
  border-radius: 16px;
}
.cuadro-recompensa > i {
  font-size: 3.15rem;
}
.cuadro-recompensa.regalo > i {
  color: var(--color-turno-activo);
}
.cuadro-recompensa.anuncio > i {
  color: var(--color-exito);
}
.contenido-recompensa h2 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.1;
}
.contenido-recompensa strong {
  display: block;
  margin-top: 8px;
  color: var(--color-texto-secundario);
  font-size: 0.82rem;
  line-height: 1.15;
}
.boton-cuadrado {
  min-height: 30px;
  margin-top: 2px;
  padding: 6px 10px;
  color: var(--color-texto-principal);
  background: linear-gradient(135deg, var(--color-boton), var(--color-turno-activo));
  border: none;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}
.boton-cuadrado:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.resaltada {
  animation: resaltar-tarjeta 0.65s ease-in-out 4;
}
.aviso-bloqueo {
  padding: 12px;
  color: var(--color-fondo);
  background-color: var(--color-turno-activo);
  border-radius: 10px;
}
.cuadro-color {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  color: var(--color-texto-principal);
  background-color: var(--color-fondo-alterno);
  border: 1px solid var(--color-articulo);
  border-radius: 18px;
  box-shadow:
    0 0 5px color-mix(in srgb, var(--color-articulo) 45%, transparent),
    inset 0 0 9px color-mix(in srgb, var(--color-articulo) 18%, transparent);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease,
    transform 0.2s ease;
}
.cuadro-color:not(:disabled):hover {
  border-color: var(--color-turno-activo);
  transform: translateY(-2px);
}
.cuadro-color.adquirido {
  border-color: var(--color-exito);
}
.cuadro-color.fluor {
  border-color: var(--color-articulo);
  background:
    radial-gradient(circle at 50% 58%, color-mix(in srgb, var(--color-articulo) 26%, transparent) 0 24%, transparent 55%),
    var(--color-fondo-alterno);
  box-shadow:
    0 0 7px color-mix(in srgb, var(--color-articulo) 70%, transparent),
    0 0 13px color-mix(in srgb, var(--color-articulo) 48%, transparent),
    inset 0 0 12px color-mix(in srgb, var(--color-articulo) 36%, transparent);
}
.cuadro-color.fluor::before {
  position: absolute;
  inset: 7px;
  content: '';
  border: 1px solid var(--color-articulo);
  border-radius: 13px;
  box-shadow: 0 0 6px color-mix(in srgb, var(--color-articulo) 55%, transparent);
  pointer-events: none;
}
.cuadro-color.bloqueado {
  opacity: 0.55;
  cursor: not-allowed;
}
.muestra-color {
  display: flex;
  justify-content: center;
  gap: 8px;
  font-size: 2rem;
  font-weight: bold;
}
.muestra-color span {
  color: inherit !important;
  -webkit-text-fill-color: currentColor !important;
}
.etiqueta-fluor {
  position: absolute;
  left: 8px;
  bottom: 8px;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 6px;
  color: var(--color-fondo);
  background-color: var(--color-turno-activo);
  border-radius: 999px;
  box-shadow: 0 0 10px var(--color-turno-activo);
  font-size: 0.58rem;
  font-weight: 900;
  line-height: 1;
}
.etiqueta-fluor i {
  font-size: 0.68rem;
}
.vista-previa-compra {
  display: flex;
  justify-content: center;
  padding-top: 2px;
}
.vista-previa-color {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  aspect-ratio: 1;
  background-color: var(--color-fondo-alterno);
  border: 1px solid var(--color-articulo);
  border-radius: 16px;
  box-shadow:
    0 0 4px color-mix(in srgb, var(--color-articulo) 38%, transparent),
    inset 0 0 8px color-mix(in srgb, var(--color-articulo) 16%, transparent);
}
.vista-previa-color.fluor {
  background:
    radial-gradient(circle at 50% 55%, color-mix(in srgb, var(--color-articulo) 22%, transparent) 0 24%, transparent 55%),
    var(--color-fondo-alterno);
  box-shadow:
    0 0 6px color-mix(in srgb, var(--color-articulo) 58%, transparent),
    0 0 10px color-mix(in srgb, var(--color-articulo) 36%, transparent),
    inset 0 0 10px color-mix(in srgb, var(--color-articulo) 30%, transparent);
}
.vista-previa-color.fluor::before {
  position: absolute;
  inset: 7px;
  content: '';
  border: 1px solid var(--color-articulo);
  border-radius: 11px;
  box-shadow: 0 0 5px color-mix(in srgb, var(--color-articulo) 45%, transparent);
  pointer-events: none;
}
.muestra-color--preview {
  font-size: 1.7rem;
}
.etiqueta-fluor--preview {
  left: 7px;
  bottom: 7px;
  padding: 3px 5px;
  font-size: 0.52rem;
}
.estado-color,
.precio-color {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 25px;
  padding: 3px 7px;
  color: var(--color-fondo);
  background: linear-gradient(135deg, var(--color-boton), var(--color-turno-activo));
  border: 1px solid var(--color-turno-activo);
  border-radius: 999px;
  box-shadow: 0 3px 8px rgba(255, 190, 11, 0.28);
  line-height: 1;
}
.estado-color {
  min-width: 25px;
  color: var(--color-fondo);
  background-color: var(--color-exito);
}
.precio-color i {
  font-size: 0.82rem;
}
.precio-color strong {
  color: var(--color-texto-principal);
  font-size: 0.8rem;
  font-weight: 800;
}
.precio-color small {
  color: var(--color-texto-principal);
  font-size: 0.62rem;
  font-weight: 700;
  opacity: 0.9;
}
@keyframes resaltar-tarjeta {
  50% {
    border-color: var(--color-turno-activo);
    box-shadow: 0 0 22px var(--color-turno-activo);
  }
}
@media (prefers-reduced-motion: reduce) {
  .resaltada {
    animation: none;
    border-color: var(--color-turno-activo);
  }
}
@media (max-width: 700px) {
  .cuadro-recompensa {
    min-height: 148px;
    padding: 14px 10px;
  }
  .precio-color i {
    display: none;
  }
}
@media (max-width: 340px) {
  .grilla-recompensas {
    grid-template-columns: 1fr;
  }
}
</style>
