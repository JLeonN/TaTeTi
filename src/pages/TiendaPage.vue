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

      <section class="cuadricula-recompensas">
        <article
          ref="tarjetaRegalo"
          class="tarjeta-recompensa regalo"
          :class="{ resaltada: seccionResaltada === 'regalo' }"
        >
          <i class="ti ti-gift icono-xxl"></i>
          <h2>{{ t('tienda.regaloDiario') }}</h2>
          <p>{{ t('tienda.regaloDescripcion', { puntos: RECOMPENSA_DIARIA }) }}</p>
          <button
            class="boton-base boton-primario"
            type="button"
            :disabled="!regaloDisponible || procesando"
            @click="reclamarRegalo"
          >
            {{ regaloDisponible ? t('tienda.reclamar') : t('tienda.regaloReclamado') }}
          </button>
        </article>

        <article
          ref="tarjetaAnuncios"
          class="tarjeta-recompensa anuncio"
          :class="{ resaltada: seccionResaltada === 'anuncios' }"
        >
          <i class="ti ti-player-play icono-xxl"></i>
          <h2>{{ t('tienda.verAnuncio') }}</h2>
          <p>{{ t('tienda.anuncioDescripcion', { puntos: RECOMPENSA_ANUNCIO }) }}</p>
          <strong>{{ t('tienda.anunciosRestantes', { cantidad: anunciosRestantes }) }}</strong>
          <button
            class="boton-base boton-primario"
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

      <div class="cabecera-catalogo">
        <div>
          <h2>{{ t('tienda.coloresTitulo') }}</h2>
          <p>{{ t('tienda.coloresDescripcion') }}</p>
        </div>
        <router-link class="boton-inventario" to="/inventario">
          <i class="ti ti-backpack"></i>
          {{ t('inventario.titulo') }}
        </router-link>
      </div>

      <section class="cuadricula-articulos">
        <article v-for="articulo in catalogoColores" :key="articulo.id" class="tarjeta-articulo">
          <div class="vista-color" :style="{ color: `var(${articulo.variable})` }">
            <span>X</span><span>O</span>
          </div>
          <h3>{{ t(articulo.claveNombre) }}</h3>
          <strong v-if="articulo.precio">{{ articulo.precio }} {{ t('puntuacion.puntos') }}</strong>
          <span v-else>{{ t('tienda.incluido') }}</span>
          <button
            class="boton-base boton-primario"
            type="button"
            :disabled="articulosAdquiridos.has(articulo.id) || puntajeTotal < articulo.precio"
            @click="solicitarCompra(articulo)"
          >
            {{
              articulosAdquiridos.has(articulo.id)
                ? t('tienda.comprado')
                : puntajeTotal < articulo.precio
                  ? t('tienda.sinPuntos')
                  : t('tienda.comprar')
            }}
          </button>
        </article>
      </section>
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
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'
import {
  catalogoColores,
  RECOMPENSA_ANUNCIO,
  RECOMPENSA_DIARIA,
} from 'src/Servicios/Economia/CatalogoTienda'
import {
  comprarArticulo,
  inicializarEconomia,
  usarEconomia,
} from 'src/Servicios/Economia/ServicioEconomia'
import {
  inicializarRecompensas,
  reclamarRegaloDiario,
  registrarAnuncioRecompensado,
  usarRecompensas,
} from 'src/Servicios/Economia/ServicioRecompensas'
import { usePublicidad } from 'src/components/Composables/usePublicidad'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
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

const notificarError = (error) => {
  const claves = {
    fondosInsuficientes: 'tienda.sinPuntos',
    economiaNoDisponible: 'tienda.economiaNoDisponible',
    relojBloqueado: 'tienda.relojBloqueado',
    limiteAnuncios: 'tienda.sinAnuncios',
  }
  Notify.create({ type: 'negative', message: t(claves[error.message] ?? 'tienda.errorOperacion') })
}

const reclamarRegalo = async () => {
  procesando.value = true
  try {
    await reclamarRegaloDiario()
    Notify.create({ type: 'positive', message: t('tienda.regaloRecibido') })
  } catch (error) {
    notificarError(error)
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
    Notify.create({ type: 'positive', message: t('tienda.puntosAnuncioRecibidos') })
    if (anunciosRestantes.value > 0) void prepararRecompensado()
  } catch (error) {
    notificarError(error)
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
    Notify.create({
      type: 'positive',
      message: t('tienda.compraExitosa'),
      actions: [{ label: t('tienda.irInventario'), handler: () => router.push('/inventario') }],
    })
    mostrarConfirmacion.value = false
  } catch (error) {
    notificarError(error)
  } finally {
    procesando.value = false
  }
}

onMounted(async () => {
  await inicializarEconomia()
  await inicializarRecompensas()
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
  void eliminarManejadoresRecompensado()
})
</script>

<style scoped>
.pagina-tienda {
  padding: 16px;
  color: var(--color-texto-principal);
  background-color: var(--color-fondo);
}
.contenedor-tienda {
  width: min(1000px, 100%);
  margin: 0 auto;
}
.cabecera-tienda,
.cabecera-catalogo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.cabecera-tienda p,
.cabecera-catalogo p {
  margin: 4px 0 0;
  color: var(--color-texto-secundario);
}
.boton-inventario {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: var(--color-texto-principal);
  background: linear-gradient(135deg, var(--color-boton), var(--color-turno-activo));
  border-radius: 20px;
  text-decoration: none;
}
.cuadricula-recompensas,
.cuadricula-articulos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 20px 0;
}
.tarjeta-recompensa,
.tarjeta-articulo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  text-align: center;
  background-color: var(--color-fondo-alterno);
  border: 2px solid var(--color-borde-tablero);
  border-radius: 16px;
}
.tarjeta-recompensa.regalo i {
  color: var(--color-turno-activo);
}
.tarjeta-recompensa.anuncio i {
  color: var(--color-exito);
}
.tarjeta-recompensa h2,
.tarjeta-recompensa p,
.tarjeta-articulo h3 {
  margin: 0;
}
.tarjeta-recompensa p,
.tarjeta-articulo span {
  color: var(--color-texto-secundario);
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
.cuadricula-articulos {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.vista-color {
  display: flex;
  gap: 18px;
  font-size: 2.6rem;
  font-weight: bold;
  text-shadow: 0 0 12px currentColor;
}
.tarjeta-articulo .boton-base,
.tarjeta-recompensa .boton-base {
  margin-top: auto;
}
.boton-base:disabled {
  cursor: not-allowed;
  opacity: 0.55;
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
  .cabecera-tienda,
  .cabecera-catalogo {
    align-items: flex-start;
    flex-direction: column;
  }
  .cuadricula-recompensas,
  .cuadricula-articulos {
    grid-template-columns: 1fr;
  }
}
</style>
