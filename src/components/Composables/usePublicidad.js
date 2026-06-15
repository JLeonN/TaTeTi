import { ref } from 'vue'
import {
  AdMob,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
  RewardAdPluginEvents,
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
const recompensadoDisponible = ref(false)
const recompensadoCargando = ref(false)
const recompensadoMostrando = ref(false)
const manejadoresEventosBanner = []
const manejadoresEventosRecompensado = []

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

const eliminarManejadoresRecompensado = async () => {
  const manejadoresPendientes = manejadoresEventosRecompensado.splice(0)
  await Promise.allSettled(manejadoresPendientes.map((manejador) => manejador.remove()))
}

const registrarEventosRecompensado = async () => {
  if (manejadoresEventosRecompensado.length > 0) return
  manejadoresEventosRecompensado.push(
    await AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
      recompensadoDisponible.value = true
      recompensadoCargando.value = false
    }),
    await AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
      recompensadoDisponible.value = false
      recompensadoCargando.value = false
    }),
    await AdMob.addListener(RewardAdPluginEvents.Showed, () => {
      recompensadoMostrando.value = true
    }),
    await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      recompensadoDisponible.value = false
      recompensadoMostrando.value = false
    }),
    await AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
      recompensadoDisponible.value = false
      recompensadoMostrando.value = false
    }),
  )
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

  const prepararRecompensado = async () => {
    if (!admobInicializado.value || recompensadoCargando.value || recompensadoDisponible.value) {
      return recompensadoDisponible.value
    }
    recompensadoCargando.value = true
    try {
      await registrarEventosRecompensado()
      await AdMob.prepareRewardVideoAd({ adId: idsPublicidad.recompensado })
      recompensadoDisponible.value = true
      return true
    } catch (error) {
      recompensadoCargando.value = false
      recompensadoDisponible.value = false
      console.error('Error al preparar el anuncio recompensado:', error)
      return false
    }
  }

  const mostrarRecompensado = async () => {
    if (!recompensadoDisponible.value || recompensadoMostrando.value) return null
    try {
      recompensadoMostrando.value = true
      const recompensa = await AdMob.showRewardVideoAd()
      recompensadoDisponible.value = false
      return recompensa
    } catch (error) {
      console.error('Error al mostrar el anuncio recompensado:', error)
      return null
    } finally {
      recompensadoMostrando.value = false
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
    recompensadoDisponible,
    recompensadoCargando,
    recompensadoMostrando,
    prepararRecompensado,
    mostrarRecompensado,
    eliminarManejadoresRecompensado,
  }
}
