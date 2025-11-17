import { ref } from 'vue'
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob'

// ============================================================================
// CONFIGURACIÓN DE MODO PRUEBA
// ============================================================================
const MODO_PRUEBA = process.env.MODO_PRUEBA_ADS === 'true'

// ============================================================================
// IDs DE PRUEBA (GOOGLE ADMOB)
// ============================================================================
const IDS_PRUEBA = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  intersticial: 'ca-app-pub-3940256099942544/1033173712',
}

// ============================================================================
// IDs DE PRODUCCIÓN (TUS IDs REALES)
// ============================================================================
const IDS_PRODUCCION = {
  banner: 'ca-app-pub-7620083100302566/2415845154',
  intersticial: 'ca-app-pub-7620083100302566/3775645392',
}

// ============================================================================
// SELECCIÓN AUTOMÁTICA DE IDs
// ============================================================================
const IDS_ADMOB = MODO_PRUEBA ? IDS_PRUEBA : IDS_PRODUCCION

// Log para saber qué modo está activo
console.log(`🎯 AdMob en modo: ${MODO_PRUEBA ? '🧪 PRUEBA' : '🚀 PRODUCCIÓN'}`)
console.log('📊 IDs activos:', IDS_ADMOB)

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
        initializeForTesting: MODO_PRUEBA, // Se activa automáticamente en modo prueba
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
        adId: IDS_ADMOB.banner,
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
        adId: IDS_ADMOB.intersticial,
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
