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
            <span>{{ regaloDisponible ? t('tienda.reclamar') : t('tienda.regaloReclamado') }}</span>
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
            <span>{{ recompensadoCargando ? t('tienda.cargandoAnuncio') : t('tienda.verVideo') }}</span>
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
          v-for="articulo in catalogoColores"
          :key="articulo.id"
          class="cuadro-color"
          type="button"
          :class="{
            adquirido: esArticuloAdquirido(articulo),
            bloqueado: !esArticuloAdquirido(articulo) && !puedeComprarArticulo(articulo),
          }"
          :aria-label="textoAccesibleArticulo(articulo)"
          :disabled="esArticuloAdquirido(articulo) || !puedeComprarArticulo(articulo)"
          @click="solicitarCompra(articulo)"
        >
          <span v-if="esArticuloAdquirido(articulo)" class="estado-color">
            <i class="ti ti-check"></i>
          </span>
          <span v-else class="precio-color">{{ articulo.precio }}</span>
          <span class="muestra-color" :style="{ color: `var(${articulo.variable})` }">
            <span>X</span>
            <span>O</span>
          </span>
        </button>
      </CarruselTienda>
    </div>

    <q-dialog v-model="mostrarConfirmacion">
      <q-card class="dialogo-compra">
        <q-card-section>
          <h2>{{ t('tienda.confirmarCompra') }}</h2>
          <p>
            {{
              t('tienda.confirmarCompraDescripcion', {
                articulo: articuloPendiente ? t(articuloPendiente.claveNombre) : '',
                precio: articuloPendiente?.precio ?? 0,
              })
            }}
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="t('general.cancelar')" v-close-popup />
          <q-btn color="primary" :label="t('tienda.comprar')" @click="confirmarCompra" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CarruselTienda from 'src/components/Tienda/CarruselTienda.vue'
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

const puedeComprarArticulo = (articulo) =>
  !esArticuloAdquirido(articulo) && puntajeTotal.value >= articulo.precio

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
  padding: 4px 12px 16px;
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
  margin: 2px 0 2px;
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
  margin: 8px 0;
}
.cuadro-recompensa {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 132px;
  padding: 12px;
  text-align: center;
  background-color: var(--color-fondo-alterno);
  border: 1px solid var(--color-borde-tablero);
  border-radius: 16px;
}
.cuadro-recompensa > i {
  font-size: 2.35rem;
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
.contenido-recompensa strong,
.contenido-recompensa span {
  display: block;
  margin-top: 4px;
  color: var(--color-texto-secundario);
  font-size: 0.82rem;
  line-height: 1.15;
}
.boton-cuadrado {
  min-height: 30px;
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
  border: 1px solid var(--color-borde-tablero);
  border-radius: 18px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
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
  text-shadow: 0 0 12px currentColor;
}
.estado-color,
.precio-color {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
  padding: 3px 6px;
  color: var(--color-fondo);
  background-color: var(--color-turno-activo);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
}
.estado-color {
  color: var(--color-fondo);
  background-color: var(--color-exito);
}
.dialogo-compra {
  color: var(--color-texto-principal);
  background-color: var(--color-modal-fondo);
  border: 1px solid var(--color-borde-modal);
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
    min-height: 126px;
    padding: 10px;
  }
}
@media (max-width: 340px) {
  .grilla-recompensas {
    grid-template-columns: 1fr;
  }
}
</style>
