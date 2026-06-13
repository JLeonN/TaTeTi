<template>
  <q-page class="pagina-estadisticas">
    <div class="contenedor-estadisticas">
      <header class="cabecera-estadisticas">
        <div>
          <h1 class="titulo-h1-con-icono">
            <i class="ti ti-chart-bar icono-xl icono-primario"></i>
            {{ t('estadisticas.titulo') }}
          </h1>
          <p v-if="fechaInicioRecopilacion" class="texto-secundario">
            {{ t('estadisticas.desde', { fecha: fechaInicioRecopilacion }) }}
          </p>
        </div>
        <q-btn
          flat
          round
          icon="refresh"
          :aria-label="t('estadisticas.actualizar')"
          :loading="cargando"
          @click="cargarEstadisticas"
        />
      </header>

      <section class="panel filtros-estadisticas">
        <q-select
          v-model="filtros.periodo"
          outlined
          dense
          emit-value
          map-options
          :options="opcionesPeriodo"
          :label="t('estadisticas.periodo')"
        />
        <q-select
          v-model="filtros.dificultad"
          outlined
          dense
          emit-value
          map-options
          :options="opcionesDificultad"
          :label="t('juego.dificultad')"
        />
        <q-select
          v-model="filtros.ficha"
          outlined
          dense
          emit-value
          map-options
          :options="opcionesFicha"
          :label="t('estadisticas.ficha')"
        />
        <q-select
          v-model="filtros.resultado"
          outlined
          dense
          emit-value
          map-options
          :options="opcionesResultado"
          :label="t('estadisticas.resultado')"
        />
        <q-input
          v-model="filtros.fechaDesde"
          outlined
          dense
          type="date"
          :label="t('estadisticas.fechaDesde')"
          stack-label
        />
        <q-input
          v-model="filtros.fechaHasta"
          outlined
          dense
          type="date"
          :label="t('estadisticas.fechaHasta')"
          stack-label
        />
      </section>

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
            <h2>{{ t('estadisticas.distribucionResultados') }}</h2>
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
                <span><i class="marca derrota"></i>{{ t('estadisticas.derrotas') }}</span>
                <span><i class="marca empate"></i>{{ t('estadisticas.empates') }}</span>
              </div>
            </div>
          </article>

          <article class="panel">
            <h2>{{ t('estadisticas.porDificultad') }}</h2>
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
                  t('estadisticas.resumenVictorias', {
                    victorias: numero(fila.victorias),
                    partidas: numero(fila.partidas),
                  })
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
            <h2>{{ t('estadisticas.evolucionPuntos') }}</h2>
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
            <h2>{{ t('estadisticas.fichas') }}</h2>
            <div class="comparacion-fichas">
              <div v-for="fila in fichasCompletas" :key="fila.ficha" class="ficha-resultado">
                <span :class="`simbolo-ficha ficha-${fila.ficha.toLowerCase()}`">
                  {{ fila.ficha }}
                </span>
                <strong>{{ porcentaje(fila.porcentajeVictorias) }}</strong>
                <small>
                  {{
                    t('estadisticas.resumenVictorias', {
                      victorias: numero(fila.victorias),
                      partidas: numero(fila.partidas),
                    })
                  }}
                </small>
              </div>
            </div>
          </article>
        </section>

        <section class="panel">
          <h2>{{ t('estadisticas.tiempos') }}</h2>
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
            <h2>{{ t('estadisticas.rachas') }}</h2>
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
            <h2>{{ t('estadisticas.escudo') }}</h2>
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
            <h2>{{ t('estadisticas.movimientos') }}</h2>
            <div class="cuadricula-datos">
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
          <article class="panel">
            <h2>{{ t('estadisticas.horarios') }}</h2>
            <div v-if="datos.actividad.length" class="lista-simple">
              <span v-for="fila in datos.actividad" :key="fila.hora">
                <strong>{{ formatoHora(fila.hora) }}</strong>
                {{ t('estadisticas.cantidadPartidas', { cantidad: numero(fila.cantidad) }) }}
              </span>
              <span v-for="fila in datos.actividadDias" :key="`dia-${fila.dia}`">
                <strong>{{ nombreDia(fila.dia) }}</strong>
                {{ t('estadisticas.cantidadPartidas', { cantidad: numero(fila.cantidad) }) }}
              </span>
            </div>
            <span v-else class="texto-secundario">{{ t('estadisticas.sinDatos') }}</span>
          </article>
        </section>

        <section class="cuadricula-paneles">
          <article class="panel">
            <h2>{{ t('estadisticas.mapaPosiciones') }}</h2>
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
          </article>
          <article class="panel">
            <h2>{{ t('estadisticas.lineasGanadoras') }}</h2>
            <div class="lista-simple">
              <span v-for="linea in datos.lineas" :key="linea.tipo">
                <strong>{{ nombreLinea(linea.tipo) }}</strong>
                {{ numero(linea.cantidad) }}
              </span>
              <span v-if="!datos.lineas.length" class="texto-secundario">
                {{ t('estadisticas.sinDatos') }}
              </span>
            </div>
          </article>
        </section>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { inicializarBaseEstadisticas } from 'src/Servicios/Estadisticas/BaseDatosEstadisticas'
import { obtenerEstadisticas } from 'src/Servicios/Estadisticas/ConsultasEstadisticas'

const { t, locale } = useI18n()
const cargando = ref(false)
const errorCarga = ref(false)
const datos = ref(null)
const filtros = reactive({
  periodo: 'total',
  dificultad: 'todas',
  ficha: 'todas',
  resultado: 'todos',
  fechaDesde: '',
  fechaHasta: '',
})
let temporizadorFiltros = 0

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
const porcentaje = (valor) => `${numero(valor)}%`
const conSigno = (valor) => {
  const cantidad = numero(valor)
  return cantidad > 0 ? `+${cantidad}` : String(cantidad)
}
const rangoMovimientos = (minimo, maximo) => {
  if (!numero(minimo) && !numero(maximo)) return t('estadisticas.sinDatos')
  return `${numero(minimo)} - ${numero(maximo)}`
}
const duracion = (valor) => {
  const milisegundos = numero(valor)
  if (!milisegundos) return t('estadisticas.sinDatos')
  if (milisegundos < 1000) return `${milisegundos} ms`
  const segundos = Math.round(milisegundos / 1000)
  if (segundos < 60) return `${segundos} s`
  const minutos = Math.floor(segundos / 60)
  return `${minutos} min ${segundos % 60} s`
}

const opcionesPeriodo = computed(() => [
  { label: t('estadisticas.todoElHistorial'), value: 'total' },
  { label: t('estadisticas.ultimasPartidas', { cantidad: 10 }), value: 10 },
  { label: t('estadisticas.ultimasPartidas', { cantidad: 25 }), value: 25 },
  { label: t('estadisticas.ultimasPartidas', { cantidad: 50 }), value: 50 },
])
const opcionesDificultad = computed(() => [
  { label: t('estadisticas.todas'), value: 'todas' },
  { label: t('juego.facil'), value: 'facil' },
  { label: t('juego.normal'), value: 'normal' },
  { label: t('juego.dificil'), value: 'dificil' },
])
const opcionesFicha = computed(() => [
  { label: t('estadisticas.todas'), value: 'todas' },
  { label: 'X', value: 'X' },
  { label: 'O', value: 'O' },
])
const opcionesResultado = computed(() => [
  { label: t('estadisticas.todos'), value: 'todos' },
  { label: t('estadisticas.victorias'), value: 'victoria' },
  { label: t('estadisticas.derrotas'), value: 'derrota' },
  { label: t('estadisticas.empates'), value: 'empate' },
  { label: t('estadisticas.abandonos'), value: 'abandono' },
])

const hayPartidas = computed(() => numero(datos.value?.resumen?.partidas) > 0)
const fechaInicioRecopilacion = computed(() => {
  const fecha = datos.value?.metadatos?.fechaInicioRecopilacion
  if (!fecha) return ''
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'long' }).format(new Date(fecha))
})
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
    etiqueta: t('estadisticas.derrotas'),
    valor: numero(datos.value.resumen.derrotas),
    icono: 'ti-arrow-down',
  },
  {
    etiqueta: t('estadisticas.empates'),
    valor: numero(datos.value.resumen.empates),
    icono: 'ti-equal',
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
        porcentajeVictorias: 0,
      },
  ),
)
const fondoGraficaResultados = computed(() => {
  const total = Math.max(1, numero(datos.value.resumen.finalizadas))
  const victorias = (numero(datos.value.resumen.victorias) / total) * 100
  const derrotas = victorias + (numero(datos.value.resumen.derrotas) / total) * 100
  return `conic-gradient(
    var(--color-exito) 0 ${victorias}%,
    var(--color-error) ${victorias}% ${derrotas}%,
    var(--color-turno-activo) ${derrotas}% 100%
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
  const filas = datos.value.tiemposComparados.map((fila) => ({
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
    derrota: 'derrotas',
    empate: 'empates',
    abandono: 'abandonos',
  }
  return t(`estadisticas.${claves[resultado]}`)
}
const nombreLinea = (tipo) => t(`estadisticas.linea${tipo[0].toUpperCase()}${tipo.slice(1)}`)
const nombreDia = (dia) => {
  const fecha = new Date(2026, 5, 7 + numero(dia))
  return new Intl.DateTimeFormat(locale.value, { weekday: 'long' }).format(fecha)
}
const formatoHora = (hora) => `${String(numero(hora)).padStart(2, '0')}:00`

const cargarEstadisticas = async () => {
  cargando.value = true
  errorCarga.value = false
  try {
    await inicializarBaseEstadisticas()
    datos.value = await obtenerEstadisticas({ ...filtros })
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
    errorCarga.value = true
  } finally {
    cargando.value = false
  }
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
  overflow-y: auto;
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
.texto-secundario {
  margin: 0;
  color: var(--color-texto-secundario);
}
.panel {
  padding: 16px;
  background-color: var(--color-fondo-alterno);
  border: 1px solid var(--color-borde-tablero);
  border-radius: 12px;
}
.panel h2 {
  margin: 0 0 14px;
  font-size: 1.1rem;
}
.filtros-estadisticas {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.filtros-estadisticas :deep(.q-field__control),
.filtros-estadisticas :deep(.q-field__native),
.filtros-estadisticas :deep(.q-field__label) {
  color: var(--color-texto-principal);
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
.grafica-circular-contenedor {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}
.grafica-circular {
  width: 150px;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border: 24px solid transparent;
  border-radius: 50%;
  box-shadow: inset 0 0 0 30px var(--color-fondo-alterno);
}
.grafica-circular span {
  padding: 8px;
  background-color: var(--color-fondo-alterno);
  border-radius: 50%;
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
  gap: 12px;
}
.ficha-resultado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 16px;
  background-color: var(--color-tablero);
  border-radius: 10px;
}
.simbolo-ficha {
  font-size: 2.2rem;
  font-weight: bold;
}
.ficha-x {
  color: var(--color-ficha-x);
}
.ficha-o {
  color: var(--color-ficha-o);
}
.ficha-resultado small {
  color: var(--color-texto-secundario);
}
.mapa-tablero {
  width: min(280px, 100%);
  aspect-ratio: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin: 0 auto;
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
  .filtros-estadisticas {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .fila-datos,
  .cuadricula-datos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .pagina-estadisticas {
    padding: 10px;
  }
  .cuadricula-paneles {
    grid-template-columns: 1fr;
  }
  .cuadricula-resumen {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .filtros-estadisticas {
    grid-template-columns: 1fr;
  }
  .grafica-circular-contenedor {
    flex-direction: column;
  }
}
</style>
