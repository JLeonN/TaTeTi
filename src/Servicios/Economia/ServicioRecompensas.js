import { computed, ref } from 'vue'
import { App } from '@capacitor/app'
import { Preferences } from '@capacitor/preferences'
import {
  MAXIMO_ANUNCIOS_DIARIOS,
  RECOMPENSA_ANUNCIO,
  RECOMPENSA_DIARIA,
} from './CatalogoTienda'
import { inicializarEconomia, registrarMovimiento } from './ServicioEconomia'

const CLAVE_ESTADO_RECOMPENSAS = 'estado_recompensas'
const estado = ref({
  fechaLocal: '',
  periodoRegalo: '',
  regaloReclamado: false,
  anunciosConsumidos: 0,
  ultimaHoraValida: 0,
  bloqueadoHasta: 0,
})
let suscripcionEstado = null
let promesaInicializacion = null

const fechaLocal = (fecha = new Date()) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`

const periodoRegaloActual = (fecha = new Date()) => fechaLocal(fecha)

const guardar = () =>
  Preferences.set({ key: CLAVE_ESTADO_RECOMPENSAS, value: JSON.stringify(estado.value) })

export const actualizarDisponibilidad = async () => {
  const ahora = Date.now()
  const hoy = fechaLocal()
  const periodoRegalo = periodoRegaloActual()
  if (estado.value.ultimaHoraValida && ahora < estado.value.ultimaHoraValida - 5 * 60 * 1000) {
    estado.value.bloqueadoHasta = estado.value.ultimaHoraValida
  }
  if (ahora >= estado.value.bloqueadoHasta && periodoRegalo !== estado.value.periodoRegalo) {
    estado.value.periodoRegalo = periodoRegalo
    if (hoy !== estado.value.fechaLocal) estado.value.regaloReclamado = false
  }
  if (ahora >= estado.value.bloqueadoHasta && hoy !== estado.value.fechaLocal) {
    estado.value.fechaLocal = hoy
    estado.value.anunciosConsumidos = 0
    estado.value.bloqueadoHasta = 0
  }
  estado.value.ultimaHoraValida = Math.max(estado.value.ultimaHoraValida, ahora)
  await guardar()
}

export const inicializarRecompensas = async () => {
  if (promesaInicializacion) return promesaInicializacion
  promesaInicializacion = (async () => {
    await inicializarEconomia()
    const resultado = await Preferences.get({ key: CLAVE_ESTADO_RECOMPENSAS })
    if (resultado.value) {
      try {
        estado.value = { ...estado.value, ...JSON.parse(resultado.value) }
      } catch {
        // Se conserva el estado inicial.
      }
    }
    await actualizarDisponibilidad()
    if (!suscripcionEstado) {
      suscripcionEstado = await App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) void actualizarDisponibilidad()
      })
    }
  })()
  return promesaInicializacion
}

export const reclamarRegaloDiario = async () => {
  await actualizarDisponibilidad()
  if (estado.value.bloqueadoHasta > Date.now()) throw new Error('relojBloqueado')
  if (estado.value.regaloReclamado) throw new Error('regaloReclamado')
  await registrarMovimiento({
    tipo: 'regaloDiario',
    cantidad: RECOMPENSA_DIARIA,
    origen: `regalo:${estado.value.periodoRegalo}`,
  })
  estado.value.regaloReclamado = true
  await guardar()
}

export const registrarAnuncioRecompensado = async () => {
  await actualizarDisponibilidad()
  if (estado.value.bloqueadoHasta > Date.now()) throw new Error('relojBloqueado')
  if (estado.value.anunciosConsumidos >= MAXIMO_ANUNCIOS_DIARIOS) {
    throw new Error('limiteAnuncios')
  }
  const numero = estado.value.anunciosConsumidos + 1
  await registrarMovimiento({
    tipo: 'anuncio',
    cantidad: RECOMPENSA_ANUNCIO,
    origen: `anuncio:${estado.value.fechaLocal}:${numero}`,
  })
  estado.value.anunciosConsumidos = numero
  await guardar()
}

export const usarRecompensas = () => ({
  estadoRecompensas: estado,
  regaloDisponible: computed(
    () => !estado.value.regaloReclamado && estado.value.bloqueadoHasta <= Date.now(),
  ),
  anunciosRestantes: computed(() =>
    Math.max(0, MAXIMO_ANUNCIOS_DIARIOS - estado.value.anunciosConsumidos),
  ),
  recompensasBloqueadas: computed(() => estado.value.bloqueadoHasta > Date.now()),
  inicializarRecompensas,
  actualizarDisponibilidad,
  reclamarRegaloDiario,
  registrarAnuncioRecompensado,
})
