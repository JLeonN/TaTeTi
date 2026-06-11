import { ref } from 'vue'
import {
  AdMob,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob'
import {
  esModoPruebaPublicidad,
  idsPublicidad,
} from 'src/components/Configuracion/ConfiguracionPublicidad'

// Log para saber qué modo está activo
console.log(`AdMob en modo: ${esModoPruebaPublicidad ? 'PRUEBA' : 'PRODUCCIÓN'}`)

// ============================================================================
// ESTADO GLOBAL
// ============================================================================
const admobInicializado = ref(false)
const bannerVisible = ref(false)
const manejadoresEventosBanner = []

const actualizarAlturaBanner = (altura = 0) => {
  if (typeof document === 'undefined') {
    return
  }

  const alturaValida = Number.isFinite(altura) ? Math.max(0, altura) : 0
  document.documentElement.style.setProperty('--altura-banner-publicidad', `${alturaValida}px`)
}

const eliminarManejadoresBanner = async () => {
  const manejadoresPendientes = manejadoresEventosBanner.splice(0)
  await Promise.allSettled(manejadoresPendientes.map((manejador) => manejador.remove()))
}

const registrarEventosBanner = async () => {
  if (manejadoresEventosBanner.length > 0) {
    return
  }

  const manejadorTamano = await AdMob.addListener(
    BannerAdPluginEvents.SizeChanged,
    ({ height }) => {
      actualizarAlturaBanner(height)
    },
  )
  manejadoresEventosBanner.push(manejadorTamano)

  const manejadorError = await AdMob.addListener(BannerAdPluginEvents.FailedToLoad, () => {
    bannerVisible.value = false
    actualizarAlturaBanner()
  })
  manejadoresEventosBanner.push(manejadorError)
}

export function usePublicidad() {
  // ==========================================================================
  // INICIALIZAR ADMOB
  // ==========================================================================
  const inicializarAdMob = async () => {
    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: [],
        initializeForTesting: esModoPruebaPublicidad,
      })

      admobInicializado.value = true
      console.log('✅ AdMob inicializado correctamente')
    } catch (error) {
      console.error('❌ Error al inicializar AdMob:', error)
    }
  }

  // ==========================================================================
  // MOSTRAR BANNER
  // ==========================================================================
  const mostrarBanner = async () => {
    if (!admobInicializado.value) {
      console.warn('⚠️ AdMob no está inicializado todavía')
      return
    }

    if (bannerVisible.value) {
      console.log('ℹ️ El banner ya está visible')
      return
    }

    try {
      await registrarEventosBanner()
      await AdMob.showBanner({
        adId: idsPublicidad.banner,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      })

      bannerVisible.value = true
      console.log('✅ Banner mostrado correctamente')
    } catch (error) {
      bannerVisible.value = false
      actualizarAlturaBanner()
      await eliminarManejadoresBanner()
      console.error('❌ Error al mostrar banner:', error)
    }
  }

  // ==========================================================================
  // OCULTAR BANNER
  // ==========================================================================
  const ocultarBanner = async () => {
    if (!bannerVisible.value) {
      console.log('ℹ️ El banner ya está oculto')
      return
    }

    try {
      await AdMob.hideBanner()
      bannerVisible.value = false
      actualizarAlturaBanner()
      console.log('✅ Banner ocultado correctamente')
    } catch (error) {
      console.error('❌ Error al ocultar banner:', error)
    }
  }

  // ==========================================================================
  // ELIMINAR BANNER
  // ==========================================================================
  const eliminarBanner = async () => {
    if (!bannerVisible.value && manejadoresEventosBanner.length === 0) {
      return
    }

    try {
      if (bannerVisible.value) {
        await AdMob.removeBanner()
      }
      bannerVisible.value = false
      actualizarAlturaBanner()
      await eliminarManejadoresBanner()
      console.log('✅ Banner eliminado correctamente')
    } catch (error) {
      bannerVisible.value = false
      actualizarAlturaBanner()
      console.error('❌ Error al eliminar banner:', error)
    } finally {
      await eliminarManejadoresBanner()
    }
  }

  // ==========================================================================
  // PREPARAR INTERSTICIAL
  // ==========================================================================
  const prepararIntersticial = async () => {
    if (!admobInicializado.value) {
      console.warn('⚠️ AdMob no está inicializado todavía')
      return false
    }

    try {
      await AdMob.prepareInterstitial({
        adId: idsPublicidad.intersticial,
      })

      console.log('✅ Intersticial preparado')
      return true
    } catch (error) {
      console.error('❌ Error al preparar intersticial:', error)
      return false
    }
  }

  // ==========================================================================
  // MOSTRAR INTERSTICIAL
  // ==========================================================================
  const mostrarIntersticial = async () => {
    try {
      await AdMob.showInterstitial()
      console.log('✅ Intersticial mostrado')
    } catch (error) {
      console.error('❌ Error al mostrar intersticial:', error)
    }
  }

  // ==========================================================================
  // RETORNO
  // ==========================================================================
  return {
    admobInicializado,
    bannerVisible,
    inicializarAdMob,
    mostrarBanner,
    ocultarBanner,
    eliminarBanner,
    prepararIntersticial,
    mostrarIntersticial,
  }
}
