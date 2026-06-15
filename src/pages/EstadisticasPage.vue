<template>
  <q-page class="pagina-estadisticas">
    <div class="contenedor-estadisticas">
      <header class="cabecera-estadisticas">
        <div>
          <h1 class="titulo-h1-con-icono">
            <i class="ti ti-chart-bar icono-xl icono-primario"></i>
            {{ t('estadisticas.titulo') }}
          </h1>
          <p class="texto-secundario">{{ t('estadisticas.subtitulo') }}</p>
        </div>
      </header>

      <div v-if="regaloDisponible || anunciosRestantes > 0" class="accesos-recompensas">
        <button v-if="regaloDisponible" type="button" @click="irARecompensa('regalo')">
          <i class="ti ti-gift"></i>
          {{ t('economia.regaloDisponible') }}
        </button>
        <button v-if="anunciosRestantes > 0" type="button" @click="irARecompensa('anuncios')">
          <i class="ti ti-player-play"></i>
          {{ t('economia.videosDisponibles', { cantidad: anunciosRestantes }) }}
        </button>
      </div>

      <BarraFiltrosEstadisticas
        v-model:dificultad="filtros.dificultad"
        v-model:ficha="filtros.ficha"
      />

      <article v-if="economia" class="panel panel-economia">
        <EncabezadoPanel
          identificador="economia"
          :titulo="t('economia.titulo')"
          :descripcion="t('economia.descripcion')"
          :abierto="panelesDesplegados.economia"
          @alternar="alternarPanel('economia')"
        />
        <svg class="grafica-linea" viewBox="0 0 300 100" role="img" :aria-label="t('economia.titulo')">
          <polyline v-if="puntosEvolucionEconomia" :points="puntosEvolucionEconomia" />
        </svg>
        <div class="cuadricula-datos">
          <DatoSimple :etiqueta="t('economia.saldo')" :valor="numero(economia.saldo)" />
          <DatoSimple :etiqueta="t('economia.ganados')" :valor="numero(economia.ganados)" />
          <DatoSimple :etiqueta="t('economia.gastados')" :valor="numero(economia.gastados)" />
          <DatoSimple :etiqueta="t('economia.jugando')" :valor="numero(economia.jugando)" />
          <DatoSimple :etiqueta="t('economia.anuncios')" :valor="numero(economia.anuncios)" />
          <DatoSimple :etiqueta="t('economia.regalos')" :valor="numero(economia.regalos)" />
          <DatoSimple
            :etiqueta="t('economia.cantidadAnuncios')"
            :valor="numero(economia.cantidadAnuncios)"
          />
          <DatoSimple
            :etiqueta="t('economia.cantidadRegalos')"
            :valor="numero(economia.cantidadRegalos)"
          />
          <DatoSimple :etiqueta="t('economia.compras')" :valor="numero(economia.compras)" />
          <DatoSimple :etiqueta="t('economia.maximo')" :valor="numero(economia.maximo)" />
        </div>
      </article>

      <div v-if="errorCarga" class="panel estado-mensaje estado-error">
        <i class="ti ti-alert-triangle icono-lg"></i>
        <span>{{ t('estadisticas.errorCarga') }}</span>
      </div>
      <div v-else-if="cargando && !datos" class="panel estado-mensaje">
        <q-spinner size="42px" />
        <span>{{ t('estadisticas.cargando') }}</span>
      </div>
      <div v-else-if="!hayPartidas" class="panel estado-mensaje">
        <i class="ti ti-chart-dots-3 icono-xl icono-primario"></i>
        <h2>{{ t('estadisticas.sinDatosTitulo') }}</h2>
        <p>{{ t('estadisticas.sinDatosDescripcion') }}</p>
      </div>

      <template v-else>
        <section class="cuadricula-resumen">
          <article
            v-for="tarjeta in tarjetasResumen"
            :key="tarjeta.etiqueta"
            class="tarjeta-resumen"
          >
            <i :class="`ti ${tarjeta.icono} icono-lg`"></i>
            <strong>{{ tarjeta.valor }}</strong>
            <span>{{ tarjeta.etiqueta }}</span>
          </article>
        </section>

        <section class="cuadricula-paneles">
          <article class="panel">
            <EncabezadoPanel
              identificador="resultados"
              :titulo="t('estadisticas.distribucionResultados')"
              :descripcion="t('estadisticas.descripcionResultados')"
              :abierto="panelesDesplegados.resultados"
              @alternar="alternarPanel('resultados')"
            />
            <div class="grafica-circular-contenedor">
              <div
                class="grafica-circular"
                :style="{ background: fondoGraficaResultados }"
                role="img"
                :aria-label="t('estadisticas.distribucionResultados')"
              >
                <span>{{ numero(datos.resumen.finalizadas) }}</span>
              </div>
              <div class="leyenda-resultados">
                <span><i class="marca victoria"></i>{{ t('estadisticas.victorias') }}</span>
                <span><i class="marca empate"></i>{{ t('estadisticas.empates') }}</span>
                <span><i class="marca derrota"></i>{{ t('estadisticas.derrotas') }}</span>
              </div>
            </div>
          </article>

          <article class="panel">
            <EncabezadoPanel
              identificador="dificultad"
              :titulo="t('estadisticas.porDificultad')"
              :descripcion="t('estadisticas.descripcionDificultad')"
              :abierto="panelesDesplegados.dificultad"
              @alternar="alternarPanel('dificultad')"
            />
            <div v-for="fila in dificultadesCompletas" :key="fila.dificultad" class="fila-barra">
              <div class="fila-barra-cabecera">
                <span>{{ nombreDificultad(fila.dificultad) }}</span>
                <strong>{{ porcentaje(fila.porcentajeVictorias) }}</strong>
              </div>
              <div class="barra-fondo">
                <div
                  class="barra-valor"
                  :style="{ width: `${numero(fila.porcentajeVictorias)}%` }"
                ></div>
              </div>
              <small>
                {{
                  resumenVictorias(fila.victorias, fila.partidas)
                }}
              </small>
            </div>
            <div class="fila-datos">
              <DatoSimple
                :etiqueta="t('estadisticas.dificultadMasJugada')"
                :valor="nombreDificultadOpcional(datos.destacados.dificultadMasJugada)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.mejorDificultad')"
                :valor="nombreDificultadOpcional(datos.destacados.mejorDificultad)"
              />
            </div>
          </article>

          <article class="panel">
            <EncabezadoPanel
              identificador="puntos"
              :titulo="t('estadisticas.evolucionPuntos')"
              :descripcion="t('estadisticas.descripcionPuntos')"
              :abierto="panelesDesplegados.puntos"
              @alternar="alternarPanel('puntos')"
            />
            <svg
              class="grafica-linea"
              viewBox="0 0 300 100"
              role="img"
              :aria-label="t('estadisticas.evolucionPuntos')"
            >
              <polyline v-if="puntosEvolucion" :points="puntosEvolucion" />
            </svg>
            <div class="fila-datos">
              <DatoSimple
                :etiqueta="t('estadisticas.puntosGanados')"
                :valor="numero(datos.puntuacion.puntosGanados)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.puntosPerdidos')"
                :valor="numero(datos.puntuacion.puntosPerdidos)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.balance')"
                :valor="conSigno(datos.puntuacion.balancePuntos)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.maximoHistorico')"
                :valor="numero(datos.puntuacion.maximoPuntos)"
              />
            </div>
            <div class="barras-comparativas">
              <div v-for="barra in barrasPuntuacion" :key="barra.etiqueta" class="fila-barra">
                <div class="fila-barra-cabecera">
                  <span>{{ barra.etiqueta }}</span>
                  <strong>{{ barra.valor }}</strong>
                </div>
                <div class="barra-fondo">
                  <div
                    class="barra-valor"
                    :class="barra.clase"
                    :style="{ width: `${barra.porcentaje}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </article>

          <article class="panel">
            <EncabezadoPanel
              identificador="fichas"
              :titulo="t('estadisticas.fichas')"
              :descripcion="t('estadisticas.descripcionFichas')"
              :abierto="panelesDesplegados.fichas"
              @alternar="alternarPanel('fichas')"
            />
            <div class="comparacion-fichas">
              <div v-for="fila in fichasCompletas" :key="fila.ficha" class="ficha-resultado">
                <button
                  type="button"
                  class="boton-ficha"
                  :aria-expanded="fichasDesplegadas[fila.ficha]"
                  :aria-controls="`detalle-ficha-${fila.ficha}`"
                  @click="alternarFicha(fila.ficha)"
                >
                  <span :class="`simbolo-ficha ficha-${fila.ficha.toLowerCase()}`">
                    {{ fila.ficha }}
                  </span>
                  <i
                    :class="`ti ${
                      fichasDesplegadas[fila.ficha] ? 'ti-chevron-up' : 'ti-chevron-down'
                    } icono-sm chevron-ficha`"
                    aria-hidden="true"
                  ></i>
                </button>
                <transition name="desplegar-ficha">
                  <ul
                    v-if="fichasDesplegadas[fila.ficha]"
                    :id="`detalle-ficha-${fila.ficha}`"
                    class="detalle-ficha"
                  >
                    <li>
                      <span>{{ t('estadisticas.porcentajeVictorias') }}</span>
                      <strong>{{ porcentaje(fila.porcentajeVictorias) }}</strong>
                    </li>
                    <li>
                      <span>{{ t('estadisticas.victorias') }}</span>
                      <strong>{{ numero(fila.victorias) }}</strong>
                    </li>
                    <li>
                      <span>{{ t('estadisticas.empates') }}</span>
                      <strong>{{ numero(fila.empates) }}</strong>
                    </li>
                    <li>
                      <span>{{ t('estadisticas.derrotas') }}</span>
                      <strong>{{ numero(fila.derrotas) }}</strong>
                    </li>
                  </ul>
                </transition>
              </div>
            </div>
          </article>
        </section>

        <section class="panel">
          <EncabezadoPanel
            identificador="tiempos"
            :titulo="t('estadisticas.tiempos')"
            :descripcion="t('estadisticas.descripcionTiempos')"
            :abierto="panelesDesplegados.tiempos"
            @alternar="alternarPanel('tiempos')"
          />
          <div class="cuadricula-datos">
            <DatoSimple
              :etiqueta="t('estadisticas.partidaPromedio')"
              :valor="duracion(datos.tiemposPartida.promedioMs)"
            />
            <DatoSimple
              :etiqueta="t('estadisticas.partidaMasCorta')"
              :valor="duracion(datos.tiemposPartida.minimoMs)"
            />
            <DatoSimple
              :etiqueta="t('estadisticas.partidaMasLarga')"
              :valor="duracion(datos.tiemposPartida.maximoMs)"
            />
            <DatoSimple
              :etiqueta="t('estadisticas.victoriaMasRapida')"
              :valor="duracion(datos.tiemposPartida.victoriaRapidaMs)"
            />
            <DatoSimple
              :etiqueta="t('estadisticas.derrotaMasRapida')"
              :valor="duracion(datos.tiemposPartida.derrotaRapidaMs)"
            />
            <DatoSimple
              :etiqueta="t('estadisticas.turnoPromedio')"
              :valor="duracion(datos.tiemposTurno.promedioMs)"
            />
            <DatoSimple
              :etiqueta="t('estadisticas.turnoMasCorto')"
              :valor="duracion(datos.tiemposTurno.minimoMs)"
            />
            <DatoSimple
              :etiqueta="t('estadisticas.turnoMasLargo')"
              :valor="duracion(datos.tiemposTurno.maximoMs)"
            />
          </div>
          <div class="barras-comparativas">
            <div v-for="barra in barrasTiempos" :key="barra.etiqueta" class="fila-barra">
              <div class="fila-barra-cabecera">
                <span>{{ barra.etiqueta }}</span>
                <strong>{{ barra.valorTexto }}</strong>
              </div>
              <div class="barra-fondo">
                <div
                  class="barra-valor barra-tiempo"
                  :style="{ width: `${barra.porcentaje}%` }"
                ></div>
              </div>
            </div>
          </div>
        </section>

        <section class="cuadricula-paneles">
          <article class="panel">
            <EncabezadoPanel
              identificador="rachas"
              :titulo="t('estadisticas.rachas')"
              :descripcion="t('estadisticas.descripcionRachas')"
              :abierto="panelesDesplegados.rachas"
              @alternar="alternarPanel('rachas')"
            />
            <div class="cuadricula-datos">
              <DatoSimple
                :etiqueta="t('estadisticas.mejorRacha')"
                :valor="numero(datos.rachas.mejorRacha)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.peorRacha')"
                :valor="numero(datos.rachas.peorRachaNegativa)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.rachasNegativas')"
                :valor="numero(datos.rachas.cantidadRachasNegativas)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.recuperaciones')"
                :valor="numero(datos.rachas.recuperaciones)"
              />
            </div>
          </article>
          <article class="panel">
            <EncabezadoPanel
              identificador="escudo"
              :titulo="t('estadisticas.escudo')"
              :descripcion="t('estadisticas.descripcionEscudo')"
              :abierto="panelesDesplegados.escudo"
              @alternar="alternarPanel('escudo')"
            />
            <div class="cuadricula-datos">
              <DatoSimple
                :etiqueta="t('estadisticas.activaciones')"
                :valor="numero(datos.proteccion.activaciones)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.derrotasProtegidas')"
                :valor="numero(datos.proteccion.derrotasProtegidas)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.promedioParaSalir')"
                :valor="numero(datos.proteccion.promedioPartidas)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.tiempoParaSalir')"
                :valor="duracion(datos.proteccion.promedioDuracionMs)"
              />
            </div>
          </article>
          <article class="panel">
            <EncabezadoPanel
              identificador="movimientos"
              :titulo="t('estadisticas.movimientos')"
              :descripcion="t('estadisticas.descripcionMovimientos')"
              :abierto="panelesDesplegados.movimientos"
              @alternar="alternarPanel('movimientos')"
            />
            <div class="cuadricula-datos cuadricula-movimientos">
              <DatoSimple
                :etiqueta="t('estadisticas.victoriasMinimas')"
                :valor="numero(datos.movimientos.victoriasMinimas)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.derrotasMinimas')"
                :valor="numero(datos.movimientos.derrotasMinimas)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.promedioAlGanar')"
                :valor="numero(datos.movimientos.promedioVictoria)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.promedioAlPerder')"
                :valor="numero(datos.movimientos.promedioDerrota)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.rangoAlGanar')"
                :valor="
                  rangoMovimientos(
                    datos.movimientos.minimoVictoria,
                    datos.movimientos.maximoVictoria,
                  )
                "
              />
              <DatoSimple
                :etiqueta="t('estadisticas.rangoAlPerder')"
                :valor="
                  rangoMovimientos(datos.movimientos.minimoDerrota, datos.movimientos.maximoDerrota)
                "
              />
              <DatoSimple
                :etiqueta="t('estadisticas.oportunidades')"
                :valor="numero(datos.movimientos.oportunidadesUsuario)"
              />
              <DatoSimple
                :etiqueta="t('estadisticas.recuperacionesAmenaza')"
                :valor="numero(datos.movimientos.recuperacionesAnteAmenaza)"
              />
            </div>
          </article>
        </section>

        <section class="cuadricula-paneles">
          <article class="panel">
            <EncabezadoPanel
              identificador="tablero"
              :titulo="t('estadisticas.usoTablero')"
              :descripcion="t('estadisticas.descripcionTablero')"
              :abierto="panelesDesplegados.tablero"
              @alternar="alternarPanel('tablero')"
            />
            <div class="posiciones-lineas">
              <div class="mapa-tablero">
                <div
                  v-for="posicion in mapaPosiciones"
                  :key="posicion.indice"
                  class="casilla-mapa"
                  :style="{ opacity: posicion.opacidad }"
                >
                  {{ posicion.cantidad }}
                </div>
              </div>
              <div
                class="tarjeta-lineas"
                role="group"
                :aria-label="t('estadisticas.lineasGanadoras')"
              >
                <div class="lista-simple">
                  <span v-for="linea in datos.lineas" :key="linea.tipo">
                    <strong>{{ nombreLinea(linea.tipo) }}</strong>
                    {{ numero(linea.cantidad) }}
                  </span>
                  <span v-if="!datos.lineas.length" class="texto-secundario">
                    {{ t('estadisticas.sinDatos') }}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </section>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BarraFiltrosEstadisticas from 'src/components/Estadisticas/BarraFiltrosEstadisticas.vue'
import EncabezadoPanel from 'src/components/Estadisticas/EncabezadoPanelEstadistica.vue'
import { inicializarBaseEstadisticas } from 'src/Servicios/Estadisticas/BaseDatosEstadisticas'
import { obtenerEstadisticas } from 'src/Servicios/Estadisticas/ConsultasEstadisticas'
import {
  inicializarEconomia,
  obtenerEstadisticasEconomicas,
} from 'src/Servicios/Economia/ServicioEconomia'
import {
  inicializarRecompensas,
  usarRecompensas,
} from 'src/Servicios/Economia/ServicioRecompensas'

const { locale, t } = useI18n()
const router = useRouter()
const { regaloDisponible, anunciosRestantes } = usarRecompensas()
const cargando = ref(false)
const errorCarga = ref(false)
const datos = ref(null)
const economia = ref(null)
const fichasDesplegadas = reactive({
  X: false,
  O: false,
})
const panelesDesplegados = reactive({
  resultados: false,
  dificultad: false,
  puntos: false,
  fichas: false,
  tiempos: false,
  rachas: false,
  escudo: false,
  movimientos: false,
  tablero: false,
  economia: false,
})
const filtros = reactive({
  dificultad: 'todas',
  ficha: 'todas',
})
let temporizadorFiltros = 0

const alternarFicha = (ficha) => {
  fichasDesplegadas[ficha] = !fichasDesplegadas[ficha]
}
const alternarPanel = (panel) => {
  panelesDesplegados[panel] = !panelesDesplegados[panel]
}

const DatoSimple = defineComponent({
  props: {
    etiqueta: { type: String, required: true },
    valor: { type: [String, Number], required: true },
  },
  setup(props) {
    return () =>
      h('div', { class: 'dato-simple' }, [
        h('strong', String(props.valor)),
        h('span', props.etiqueta),
      ])
  },
})

const numero = (valor) => Number(valor) || 0
const formateadorNumero = computed(() => new Intl.NumberFormat(locale.value))
const formateadorPorcentaje = computed(
  () => new Intl.NumberFormat(locale.value, { style: 'percent', maximumFractionDigits: 1 }),
)
const porcentaje = (valor) => formateadorPorcentaje.value.format(numero(valor) / 100)
const conSigno = (valor) => {
  const cantidad = numero(valor)
  const cantidadFormateada = formateadorNumero.value.format(cantidad)
  return cantidad > 0 ? `+${cantidadFormateada}` : cantidadFormateada
}
const rangoMovimientos = (minimo, maximo) => {
  if (!numero(minimo) && !numero(maximo)) return t('estadisticas.sinDatos')
  return `${formateadorNumero.value.format(numero(minimo))} - ${formateadorNumero.value.format(numero(maximo))}`
}
const duracion = (valor) => {
  const milisegundos = numero(valor)
  if (!milisegundos) return t('estadisticas.sinDatos')
  if (milisegundos < 1000) return `${formateadorNumero.value.format(milisegundos)} ms`
  const segundos = Math.round(milisegundos / 1000)
  if (segundos < 60) return `${formateadorNumero.value.format(segundos)} s`
  const minutos = Math.floor(segundos / 60)
  return `${formateadorNumero.value.format(minutos)} min ${formateadorNumero.value.format(segundos % 60)} s`
}
const resumenVictorias = (victorias, partidas) => {
  const cantidadVictorias = numero(victorias)
  const cantidadPartidas = numero(partidas)
  let clave = 'estadisticas.resumenVictorias'

  if (cantidadVictorias === 1 && cantidadPartidas === 1) {
    clave = 'estadisticas.resumenUnaVictoriaUnaPartida'
  } else if (cantidadVictorias === 1) {
    clave = 'estadisticas.resumenUnaVictoria'
  } else if (cantidadPartidas === 1) {
    clave = 'estadisticas.resumenUnaPartida'
  }

  return t(clave, {
    victorias: formateadorNumero.value.format(cantidadVictorias),
    partidas: formateadorNumero.value.format(cantidadPartidas),
  })
}

const hayPartidas = computed(() => numero(datos.value?.resumen?.partidas) > 0)
const tarjetasResumen = computed(() => [
  {
    etiqueta: t('estadisticas.partidas'),
    valor: numero(datos.value.resumen.partidas),
    icono: 'ti-device-gamepad-2',
  },
  {
    etiqueta: t('estadisticas.victorias'),
    valor: numero(datos.value.resumen.victorias),
    icono: 'ti-trophy',
  },
  {
    etiqueta: t('estadisticas.empates'),
    valor: numero(datos.value.resumen.empates),
    icono: 'ti-equal',
  },
  {
    etiqueta: t('estadisticas.derrotas'),
    valor: numero(datos.value.resumen.derrotas),
    icono: 'ti-arrow-down',
  },
  {
    etiqueta: t('estadisticas.abandonos'),
    valor: numero(datos.value.resumen.abandonos),
    icono: 'ti-door-exit',
  },
  {
    etiqueta: t('estadisticas.porcentajeVictorias'),
    valor: porcentaje(datos.value.resumen.porcentajeVictorias),
    icono: 'ti-percentage',
  },
])
const dificultadesCompletas = computed(() =>
  ['facil', 'normal', 'dificil'].map(
    (dificultad) =>
      datos.value.porDificultad.find((fila) => fila.dificultad === dificultad) ?? {
        dificultad,
        partidas: 0,
        victorias: 0,
        porcentajeVictorias: 0,
      },
  ),
)
const fichasCompletas = computed(() =>
  ['X', 'O'].map(
    (ficha) =>
      datos.value.porFicha.find((fila) => fila.ficha === ficha) ?? {
        ficha,
        partidas: 0,
        victorias: 0,
        empates: 0,
        derrotas: 0,
        porcentajeVictorias: 0,
      },
  ),
)
const fondoGraficaResultados = computed(() => {
  const total = Math.max(1, numero(datos.value.resumen.finalizadas))
  const victorias = (numero(datos.value.resumen.victorias) / total) * 100
  const empates = victorias + (numero(datos.value.resumen.empates) / total) * 100
  return `conic-gradient(
    var(--color-exito) 0 ${victorias}%,
    var(--color-turno-activo) ${victorias}% ${empates}%,
    var(--color-error) ${empates}% 100%
  )`
})
const barrasPuntuacion = computed(() => {
  const ganados = numero(datos.value.puntuacion.puntosGanados)
  const perdidos = numero(datos.value.puntuacion.puntosPerdidos)
  const maximo = Math.max(1, ganados, perdidos)
  return [
    {
      etiqueta: t('estadisticas.puntosGanados'),
      valor: ganados,
      porcentaje: (ganados / maximo) * 100,
      clase: 'barra-positiva',
    },
    {
      etiqueta: t('estadisticas.puntosPerdidos'),
      valor: perdidos,
      porcentaje: (perdidos / maximo) * 100,
      clase: 'barra-negativa',
    },
  ]
})
const barrasTiempos = computed(() => {
  const ordenDificultades = { facil: 0, normal: 1, dificil: 2 }
  const ordenResultados = { victoria: 0, empate: 1, derrota: 2 }
  const filas = [...datos.value.tiemposComparados]
    .sort(
      (filaA, filaB) =>
        ordenDificultades[filaA.dificultad] - ordenDificultades[filaB.dificultad] ||
        ordenResultados[filaA.resultado] - ordenResultados[filaB.resultado],
    )
    .map((fila) => ({
      etiqueta: `${nombreDificultad(fila.dificultad)} · ${nombreResultado(fila.resultado)}`,
      valor: numero(fila.duracionPartidaMs),
      valorTexto: duracion(fila.duracionPartidaMs),
    }))
  const maximo = Math.max(1, ...filas.map((fila) => fila.valor))
  return filas.map((fila) => ({
    ...fila,
    porcentaje: (fila.valor / maximo) * 100,
  }))
})
const puntosEvolucion = computed(() => {
  const filas = datos.value.evolucion
  if (!filas.length) return ''
  const valores = filas.map((fila) => numero(fila.puntosFinales))
  const minimo = Math.min(...valores)
  const maximo = Math.max(...valores)
  const rango = Math.max(1, maximo - minimo)
  return valores
    .map((valor, indice) => {
      const x = filas.length === 1 ? 150 : (indice / (filas.length - 1)) * 290 + 5
      const y = 95 - ((valor - minimo) / rango) * 90
      return `${x},${y}`
    })
    .join(' ')
})
const puntosEvolucionEconomia = computed(() => {
  const filas = economia.value?.evolucion ?? []
  if (!filas.length) return ''
  const valores = filas.map((fila) => numero(fila.saldoResultante))
  const minimo = Math.min(...valores)
  const maximo = Math.max(...valores)
  const rango = Math.max(1, maximo - minimo)
  return valores
    .map((valor, indice) => {
      const x = filas.length === 1 ? 150 : (indice / (filas.length - 1)) * 290 + 5
      const y = 95 - ((valor - minimo) / rango) * 90
      return `${x},${y}`
    })
    .join(' ')
})
const mapaPosiciones = computed(() => {
  const cantidades = Array(9).fill(0)
  for (const fila of datos.value.posiciones)
    cantidades[numero(fila.posicion)] = numero(fila.cantidad)
  const maximo = Math.max(1, ...cantidades)
  return cantidades.map((cantidad, indice) => ({
    indice,
    cantidad,
    opacidad: 0.25 + (cantidad / maximo) * 0.75,
  }))
})

const nombreDificultad = (dificultad) => t(`juego.${dificultad}`)
const nombreDificultadOpcional = (dificultad) =>
  dificultad ? nombreDificultad(dificultad) : t('estadisticas.sinDatos')
const nombreResultado = (resultado) => {
  const claves = {
    victoria: 'victorias',
    empate: 'empates',
    derrota: 'derrotas',
    abandono: 'abandonos',
  }
  return t(`estadisticas.${claves[resultado]}`)
}
const nombreLinea = (tipo) => t(`estadisticas.linea${tipo[0].toUpperCase()}${tipo.slice(1)}`)

const cargarEstadisticas = async () => {
  cargando.value = true
  errorCarga.value = false
  try {
    await inicializarBaseEstadisticas()
    await inicializarEconomia()
    await inicializarRecompensas()
    ;[datos.value, economia.value] = await Promise.all([
      obtenerEstadisticas({ ...filtros }),
      obtenerEstadisticasEconomicas(),
    ])
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
    errorCarga.value = true
  } finally {
    cargando.value = false
  }
}

const irARecompensa = (seccion) => {
  void router.push({ path: '/tienda', query: { resaltar: seccion } })
}

watch(
  filtros,
  () => {
    window.clearTimeout(temporizadorFiltros)
    temporizadorFiltros = window.setTimeout(cargarEstadisticas, 200)
  },
  { deep: true },
)

onMounted(cargarEstadisticas)
</script>

<style scoped>
.pagina-estadisticas {
  background-color: var(--color-fondo);
  color: var(--color-texto-principal);
  padding: 16px;
}
.contenedor-estadisticas {
  width: min(1100px, 100%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cabecera-estadisticas {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.cabecera-estadisticas h1 {
  margin-bottom: 2px;
}
.accesos-recompensas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.accesos-recompensas button {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 13px;
  color: var(--color-fondo);
  background-color: var(--color-turno-activo);
  border: 0;
  border-radius: 18px;
  font-weight: bold;
  cursor: pointer;
}
.panel-economia {
  width: 100%;
}
.texto-secundario {
  margin: 0;
  color: var(--color-texto-secundario);
}
.panel {
  min-width: 0;
  padding: 16px;
  background-color: var(--color-fondo-alterno);
  border: 1px solid var(--color-borde-tablero);
  border-radius: 12px;
}
.cuadricula-resumen {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
}
.tarjeta-resumen {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px;
  text-align: center;
  background-color: var(--color-tablero);
  border: 1px solid var(--color-borde-tablero);
  border-radius: 10px;
}
.tarjeta-resumen i {
  color: var(--color-turno-activo);
}
.tarjeta-resumen strong {
  font-size: 1.55rem;
}
.tarjeta-resumen span {
  color: var(--color-texto-secundario);
  font-size: 0.78rem;
}
.cuadricula-paneles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.cuadricula-paneles > .panel:only-child,
.cuadricula-paneles > .panel:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}
.grafica-circular-contenedor {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}
.grafica-circular {
  position: relative;
  width: 150px;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 50%;
}
.grafica-circular::after {
  content: '';
  position: absolute;
  width: 82px;
  aspect-ratio: 1;
  background-color: var(--color-fondo-alterno);
  border-radius: 50%;
}
.grafica-circular span {
  position: relative;
  z-index: 1;
  font-size: 1.3rem;
  font-weight: bold;
}
.leyenda-resultados,
.lista-simple {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.leyenda-resultados span,
.lista-simple span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.marca {
  width: 12px;
  height: 12px;
  margin-right: 6px;
  border-radius: 50%;
}
.marca.victoria {
  background-color: var(--color-exito);
}
.marca.derrota {
  background-color: var(--color-error);
}
.marca.empate {
  background-color: var(--color-turno-activo);
}
.fila-barra {
  margin-bottom: 12px;
}
.fila-barra:last-child {
  margin-bottom: 0;
}
.fila-barra-cabecera {
  display: flex;
  justify-content: space-between;
}
.barra-fondo {
  height: 9px;
  margin: 5px 0;
  overflow: hidden;
  background-color: var(--color-tablero);
  border-radius: 8px;
}
.barra-valor {
  height: 100%;
  background-color: var(--color-exito);
  border-radius: inherit;
}
.barra-negativa {
  background-color: var(--color-error);
}
.barra-positiva {
  background-color: var(--color-exito);
}
.barra-tiempo {
  background-color: var(--color-ficha-o);
}
.barras-comparativas {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 14px;
}
.fila-barra small {
  color: var(--color-texto-secundario);
}
.grafica-linea {
  width: 100%;
  height: 140px;
  background-color: var(--color-tablero);
  border-radius: 8px;
}
.grafica-linea polyline {
  fill: none;
  stroke: var(--color-turno-activo);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.fila-datos,
.cuadricula-datos {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
}
.cuadricula-movimientos {
  grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
}
.dato-simple {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 9px;
  text-align: center;
  background-color: var(--color-tablero);
  border-radius: 8px;
}
.dato-simple strong {
  font-size: 1.1rem;
}
.dato-simple span {
  color: var(--color-texto-secundario);
  font-size: 0.72rem;
}
.comparacion-fichas {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: start;
  gap: 12px;
}
.ficha-resultado {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--color-tablero);
  border-radius: 10px;
  overflow: hidden;
}
.boton-ficha {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  min-height: 68px;
  padding: 10px 12px;
  color: var(--color-texto-principal);
  background-color: transparent;
  border: 0;
  cursor: pointer;
}
.boton-ficha:focus-visible {
  outline: 2px solid var(--color-borde-tablero);
  outline-offset: -2px;
}
@media (hover: hover) {
  .boton-ficha:hover {
    background-color: var(--color-fondo-alterno);
  }
}
.boton-ficha .simbolo-ficha {
  grid-column: 2;
}
.chevron-ficha {
  grid-column: 3;
  justify-self: end;
  color: var(--color-texto-secundario);
  font-size: 0.75rem;
}
.simbolo-ficha {
  font-size: 1.8rem;
  font-weight: bold;
}
.ficha-x {
  color: var(--color-ficha-x);
}
.ficha-o {
  color: var(--color-ficha-o);
}
.detalle-ficha {
  width: 100%;
  margin: 0;
  padding: 0 12px 10px;
  list-style: none;
}
.detalle-ficha li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 0;
  color: var(--color-texto-secundario);
  font-size: 0.78rem;
  border-top: 1px solid var(--color-borde-tablero);
}
.detalle-ficha strong {
  color: var(--color-texto-principal);
}
.desplegar-ficha-enter-active,
.desplegar-ficha-leave-active {
  max-height: 160px;
  overflow: hidden;
  transition:
    max-height 0.2s ease,
    opacity 0.2s ease;
}
.desplegar-ficha-enter-from,
.desplegar-ficha-leave-to {
  max-height: 0;
  opacity: 0;
}
.posiciones-lineas {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(220px, 1fr);
  align-items: center;
  gap: 32px;
}
.mapa-tablero {
  width: min(280px, 100%);
  aspect-ratio: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin: 0 auto;
}
.tarjeta-lineas {
  width: min(320px, 100%);
  margin: 0 auto;
  padding: 16px;
  background-color: var(--color-tablero);
  border: 1px solid var(--color-borde-tablero);
  border-radius: 10px;
}
.tarjeta-lineas .lista-simple {
  gap: 0;
}
.tarjeta-lineas .lista-simple span {
  min-height: 34px;
  padding: 7px 4px;
  border-bottom: 1px solid var(--color-borde-tablero);
}
.tarjeta-lineas .lista-simple span:last-child {
  border-bottom: 0;
}
.casilla-mapa {
  display: grid;
  place-items: center;
  background-color: var(--color-turno-activo);
  color: var(--color-fondo);
  border-radius: 8px;
  font-weight: bold;
}
.estado-mensaje {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
}
.estado-mensaje h2,
.estado-mensaje p {
  margin: 0;
}
.estado-error {
  color: var(--color-error);
}
@media (max-width: 800px) {
  .cuadricula-resumen {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .fila-datos,
  .cuadricula-datos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .cuadricula-movimientos {
    grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
  }
}
@media (max-width: 600px) {
  .pagina-estadisticas {
    padding: 10px;
  }
  .cuadricula-paneles {
    grid-template-columns: minmax(0, 1fr);
  }
  .cuadricula-resumen {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grafica-circular-contenedor {
    flex-direction: column;
  }
  .posiciones-lineas {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .cuadricula-movimientos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
