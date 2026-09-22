<template>
  <q-page class="pagina-inventario">
    <div class="contenedor-inventario">
      <header class="cabecera-inventario cabecera-con-accion">
        <div class="bloque-titulo-pagina">
          <h1 class="titulo-h1-con-icono">
            <i class="ti ti-backpack icono-xl icono-primario"></i>
            <span class="texto-titulo-pagina">{{ t('inventario.titulo') }}</span>
          </h1>
          <p>{{ t('inventario.subtitulo') }}</p>
        </div>
        <router-link
          class="boton-cabecera-pagina"
          to="/tienda"
          :aria-label="t('tienda.titulo')"
          :title="t('tienda.titulo')"
        >
          <i class="ti ti-shopping-bag"></i>
          <span class="texto-boton-cabecera">{{ t('tienda.titulo') }}</span>
        </router-link>
      </header>

      <section class="tarjeta-equipado" :aria-label="t('inventario.equipado')">
        <h2>{{ t('inventario.equipado') }}</h2>
        <div class="grilla-equipado">
          <button
            v-for="ficha in fichas"
            :key="`equipado-${ficha}`"
            type="button"
            class="ficha-equipada"
            :class="{
              fluor: esArticuloFluor(obtenerArticuloEquipado(ficha, 'color')),
              preferida: fichaUsuario === ficha,
            }"
            :style="obtenerEstiloArticulo(obtenerArticuloEquipado(ficha, 'color'))"
            :aria-label="textoAccesibleFicha(ficha)"
            @click="seleccionarFicha(ficha)"
          >
            <FichaVisual class="simbolo-equipado" :ficha="ficha" tamano="3.75rem" />
            <span
              v-if="esArticuloFluor(obtenerArticuloEquipado(ficha, 'color'))"
              class="icono-fluor-equipado"
              :aria-label="t('inventario.fluor')"
            >
              <i class="ti ti-sparkles"></i>
            </span>
            <strong>{{ nombreArticulo(equipamiento[ficha].color) }}</strong>
            <span
              class="chip-participante"
              :class="{ nexus: fichaUsuario !== ficha }"
              :title="nombreParticipanteFicha(ficha)"
            >
              {{ nombreParticipanteFicha(ficha) }}
            </span>
          </button>
        </div>
      </section>

      <p
        v-if="mensajeEstado"
        class="mensaje-estado"
        :class="{ error: estadoConError }"
        role="status"
        aria-live="polite"
      >
        {{ mensajeEstado }}
      </p>

      <section v-for="ficha in fichasParticipantes" :key="`colores-${ficha}`" class="seccion-inventario">
        <h2 class="titulo-seccion-inventario">{{ tituloSeleccion(ficha, 'color') }}</h2>
        <div class="panel-inventario">
          <div class="carrusel-colores" role="list" :aria-label="tituloSeleccion(ficha, 'color')">
            <button
              v-for="articulo in articulosDisponiblesPorCategoria('color')"
              :key="`${ficha}-${articulo.id}`"
              class="item-color"
              type="button"
              role="listitem"
              :class="{
                activo: equipamiento[ficha].color === articulo.id,
                fluor: esArticuloFluor(articulo),
              }"
              :style="obtenerEstiloArticulo(articulo)"
              :aria-label="textoAccesibleColor(ficha, articulo)"
              @click="equipar(ficha, 'color', articulo.id)"
            >
              <FichaVisual class="simbolo-color" :ficha="ficha" :color-id="articulo.id" />
              <span class="nombre-color">{{ t(articulo.claveNombre) }}</span>
            </button>
          </div>
        </div>
      </section>

      <section v-for="ficha in fichasParticipantes" :key="`simbolos-${ficha}`" class="seccion-inventario">
        <h2 class="titulo-seccion-inventario">{{ tituloSeleccion(ficha, 'simbolo') }}</h2>
        <div class="panel-inventario">
          <div class="carrusel-colores" role="list" :aria-label="tituloSeleccion(ficha, 'simbolo')">
            <button
              v-for="articulo in articulosDisponiblesPorCategoria('simbolo')"
              :key="`${ficha}-${articulo.id}`"
              class="item-color"
              type="button"
              role="listitem"
              :class="{ activo: equipamiento[ficha].simbolo === articulo.id }"
              :disabled="simboloEnUso(ficha, articulo.id)"
              :aria-label="textoAccesibleSimbolo(ficha, articulo)"
              @click="equipar(ficha, 'simbolo', articulo.id)"
            >
              <FichaVisual class="simbolo-color" :ficha="ficha" :simbolo-id="articulo.id" />
              <span class="nombre-color">{{ t(articulo.claveNombre) }}</span>
              <span
                v-if="simboloEnUso(ficha, articulo.id)"
                v-desplazar-si-desborda
                class="estado-no-disponible"
                aria-hidden="true"
              >
                <span class="cinta-estado">
                  <span class="texto-cinta">
                    {{ textoSimboloEnUso(ficha) }}<span class="separador-cinta">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                  </span>
                  <span class="texto-cinta texto-cinta--repetido">
                    {{ textoSimboloEnUso(ficha) }}<span class="separador-cinta">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                  </span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>

    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { obtenerArticulo, obtenerArticulosPorCategoria } from 'src/Servicios/Economia/CatalogoTienda'
import { useEquipamiento } from 'src/components/Composables/useEquipamiento'
import FichaVisual from 'src/components/TaTeTi/Compartido/FichaVisual.vue'
import { useFichaJugador } from 'src/components/Composables/UseFichaJugador'
import { useConfiguracion } from 'src/components/Composables/useConfiguracion'

const { t } = useI18n()
const { equipamiento, articulosAdquiridos, cargarEquipamiento, equiparArticulo } =
  useEquipamiento()
const { fichaUsuario, cargarFichaUsuario, guardarFichaUsuario } = useFichaJugador()
const { nombreUsuario, cargarNombre } = useConfiguracion()
const fichas = ['X', 'O']
const fichasParticipantes = computed(() => [fichaUsuario.value, fichaUsuario.value === 'X' ? 'O' : 'X'])
const mensajeEstado = ref('')
const estadoConError = ref(false)
const observadoresDesbordamiento = new WeakMap()

const actualizarDesplazamiento = (elemento) => {
  const texto = elemento.querySelector('.texto-cinta:not(.texto-cinta--repetido)')
  elemento.classList.toggle(
    'con-desplazamiento',
    Boolean(texto && texto.scrollWidth > elemento.clientWidth + 1),
  )
}

const vDesplazarSiDesborda = {
  mounted(elemento) {
    const medir = () => actualizarDesplazamiento(elemento)
    const observador = new ResizeObserver(medir)
    observador.observe(elemento)
    observadoresDesbordamiento.set(elemento, observador)
    window.requestAnimationFrame(medir)
    void document.fonts?.ready.then(medir)
  },
  updated(elemento) {
    window.requestAnimationFrame(() => actualizarDesplazamiento(elemento))
  },
  unmounted(elemento) {
    observadoresDesbordamiento.get(elemento)?.disconnect()
    observadoresDesbordamiento.delete(elemento)
  },
}
const articulosDisponiblesPorCategoria = (categoria) =>
  obtenerArticulosPorCategoria(categoria).filter((articulo) => articulosAdquiridos.value.has(articulo.id))
const nombreArticulo = (id) => {
  const articulo = obtenerArticulo(id)
  return articulo ? t(articulo.claveNombre) : ''
}

const obtenerArticuloEquipado = (ficha, categoria) =>
  obtenerArticulo(equipamiento.value[ficha]?.[categoria])

const esArticuloFluor = (articulo) => articulo?.id.endsWith('Fluor') ?? false

const obtenerEstiloArticulo = (articulo) => ({
  '--color-articulo': articulo?.colorVista ?? 'var(--color-texto-principal)',
})

const equipar = async (ficha, categoria, articuloId) => {
  const otraFicha = ficha === 'X' ? 'O' : 'X'
  const intercambiaColores =
    categoria === 'color' && equipamiento.value[otraFicha].color === articuloId
  try {
    const resultado = await equiparArticulo(ficha, categoria, articuloId)
    estadoConError.value = resultado !== 'equipado'
    if (resultado === 'equipado') {
      mensajeEstado.value = t(
        intercambiaColores
          ? 'inventario.coloresIntercambiados'
          : categoria === 'color'
            ? 'inventario.colorEquipado'
            : 'inventario.simboloEquipado',
      )
      return
    }
    mensajeEstado.value = t(
      resultado === 'simboloEnUso'
        ? 'inventario.simboloEnUso'
        : resultado === 'articuloNoAdquirido'
          ? 'inventario.articuloNoAdquirido'
          : 'inventario.errorEquipamiento',
    )
  } catch {
    estadoConError.value = true
    mensajeEstado.value = t('inventario.errorEquipamiento')
  }
}

const simboloEnUso = (ficha, articuloId) => {
  const otraFicha = ficha === 'X' ? 'O' : 'X'
  return equipamiento.value[otraFicha].simbolo === articuloId && equipamiento.value[ficha].simbolo !== articuloId
}

const tituloSeleccion = (ficha, categoria) =>
  fichaUsuario.value === ficha
    ? t(`inventario.${categoria}Jugador`, { nombre: nombreUsuario.value || t('juego.jugador') })
    : t(`inventario.${categoria}Nexus`)

const textoSimboloEnUso = (ficha) => {
  const otraFicha = ficha === 'X' ? 'O' : 'X'
  return t('inventario.simboloUsadoPor', { nombre: nombreParticipanteFicha(otraFicha) })
}

const seleccionarFicha = async (ficha) => {
  const guardada = await guardarFichaUsuario(ficha)
  estadoConError.value = !guardada
  mensajeEstado.value = t(
    guardada ? 'inventario.fichaActualizada' : 'inventario.errorEquipamiento',
  )
}

const textoAccesibleColor = (ficha, articulo) =>
  `${tituloSeleccion(ficha, 'color')}: ${t(articulo.claveNombre)}`

const textoAccesibleSimbolo = (ficha, articulo) => {
  const estado = simboloEnUso(ficha, articulo.id)
    ? ` ${textoSimboloEnUso(ficha)}`
    : equipamiento.value[ficha].simbolo === articulo.id
      ? ` ${t('inventario.simboloEquipado')}`
      : ''
  return `${tituloSeleccion(ficha, 'simbolo')}: ${t(articulo.claveNombre)}.${estado}`
}

const textoAccesibleFicha = (ficha) =>
  `${t('inventario.fichaPreferida')}: ${ficha}. ${nombreParticipanteFicha(ficha)}`

const nombreParticipanteFicha = (ficha) =>
  fichaUsuario.value === ficha ? nombreUsuario.value : t('juego.nexus')

onMounted(async () => {
  await Promise.all([cargarEquipamiento(), cargarFichaUsuario(), cargarNombre()])
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
.cabecera-con-accion {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.bloque-titulo-pagina {
  min-width: 0;
}
.cabecera-inventario p {
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
.boton-cabecera-pagina {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  gap: 8px;
  min-height: 32px;
  margin-top: 7px;
  padding: 7px 11px;
  color: var(--color-texto-principal);
  background: linear-gradient(135deg, var(--color-boton), var(--color-turno-activo));
  border: none;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
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
.mensaje-estado {
  margin: -6px 0 14px;
  padding: 8px 10px;
  color: var(--color-texto-principal);
  background-color: var(--color-fondo-alterno);
  border: 1px solid var(--color-exito);
  border-radius: 8px;
  font-size: 0.78rem;
  text-align: center;
}
.mensaje-estado.error {
  border-color: var(--color-error);
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
  width: 100%;
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
  cursor: pointer;
}
.ficha-equipada.fluor {
  box-shadow:
    0 0 8px color-mix(in srgb, var(--color-articulo) 42%, transparent),
    inset 0 0 12px color-mix(in srgb, var(--color-articulo) 26%, transparent);
}
.ficha-equipada.preferida {
  border-color: var(--color-turno-activo);
  box-shadow:
    0 0 8px color-mix(in srgb, var(--color-turno-activo) 70%, transparent),
    inset 0 0 8px color-mix(in srgb, var(--color-turno-activo) 26%, transparent);
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
.item-color.activo {
  border-color: var(--color-turno-activo);
  box-shadow:
    0 0 8px color-mix(in srgb, var(--color-turno-activo) 70%, transparent),
    inset 0 0 8px color-mix(in srgb, var(--color-turno-activo) 26%, transparent);
}
.item-color:disabled {
  cursor: not-allowed;
  opacity: 0.58;
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
.estado-no-disponible {
  position: absolute;
  top: 4px;
  right: 4px;
  left: 4px;
  overflow: hidden;
  color: var(--color-texto-secundario);
  font-size: 0.54rem;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
}
.cinta-estado {
  display: flex;
  width: max-content;
}
.texto-cinta {
  flex: 0 0 auto;
}
.texto-cinta--repetido {
  display: none;
}
.separador-cinta {
  display: none;
}
.estado-no-disponible.con-desplazamiento .cinta-estado {
  animation: desplazar-estado 8s linear infinite;
}
.estado-no-disponible.con-desplazamiento .texto-cinta--repetido,
.estado-no-disponible.con-desplazamiento .separador-cinta {
  display: inline;
}
@keyframes desplazar-estado {
  to {
    transform: translateX(-50%);
  }
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
.icono-fluor-equipado {
  position: absolute;
  top: 7px;
  right: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: var(--color-fondo);
  background-color: var(--color-turno-activo);
  border-radius: 999px;
  box-shadow: 0 0 8px var(--color-turno-activo);
}
.icono-fluor-equipado i {
  font-size: 0.8rem;
}
.chip-participante {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: min(112px, 100%);
  min-height: 21px;
  padding: 3px 9px;
  overflow: hidden;
  color: var(--color-fondo);
  background: linear-gradient(135deg, var(--color-boton), var(--color-turno-activo));
  border-radius: 999px;
  box-shadow: 0 0 8px color-mix(in srgb, var(--color-turno-activo) 58%, transparent);
  font-size: 0.66rem;
  font-weight: 900;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chip-participante.nexus {
  background: linear-gradient(135deg, var(--color-desactivado), var(--color-boton));
  box-shadow: 0 0 7px color-mix(in srgb, var(--color-boton) 46%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .estado-no-disponible.con-desplazamiento .cinta-estado {
    display: block;
    max-width: 100%;
    overflow: hidden;
    animation: none;
    text-overflow: ellipsis;
  }
  .estado-no-disponible.con-desplazamiento .texto-cinta--repetido {
    display: none;
  }
}
@media (max-width: 600px) {
  .carrusel-colores {
    grid-auto-columns: 88px;
  }
  .texto-boton-cabecera {
    display: none;
  }
  .boton-cabecera-pagina {
    width: 34px;
    padding-right: 0;
    padding-left: 0;
  }
}
@media (max-width: 360px) {
  .cabecera-inventario .icono-xl {
    display: none;
  }
}
@media (max-width: 300px) {
  .texto-titulo-pagina {
    display: none;
  }
  .cabecera-inventario .icono-xl {
    display: inline-block;
  }
}
</style>
