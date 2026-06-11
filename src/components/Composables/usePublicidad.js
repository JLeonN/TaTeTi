import { ref } from 'vue'
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob'
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
      await AdMob.showBanner({
        adId: idsPublicidad.banner,
        adSize: BannerAdSize.SMART_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      })

      bannerVisible.value = true
      console.log('✅ Banner mostrado correctamente')
    } catch (error) {
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
      console.log('✅ Banner ocultado correctamente')
    } catch (error) {
      console.error('❌ Error al ocultar banner:', error)
    }
  }

  // ==========================================================================
  // ELIMINAR BANNER
  // ==========================================================================
  const eliminarBanner = async () => {
    if (!bannerVisible.value) {
      return
    }

    try {
      await AdMob.removeBanner()
      bannerVisible.value = false
      console.log('✅ Banner eliminado correctamente')
    } catch (error) {
      console.error('❌ Error al eliminar banner:', error)
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
