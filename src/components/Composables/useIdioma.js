import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Preferences } from '@capacitor/preferences'

// Estado compartido global (singleton)
const idiomaActual = ref('es-AR')
const cargandoIdioma = ref(false)

// Clave para el storage
const CLAVE_IDIOMA = 'idioma_usuario'

export function useIdioma() {
  const { locale } = useI18n()

  // Cargar idioma del storage
  const cargarIdioma = async () => {
    try {
      cargandoIdioma.value = true
      const resultado = await Preferences.get({ key: CLAVE_IDIOMA })

      console.log('🌍 CAPACITOR - Idioma guardado:', resultado.value)

      if (resultado.value) {
        idiomaActual.value = resultado.value
        locale.value = resultado.value
        console.log('✅ Idioma cargado:', idiomaActual.value)
      } else {
        // Si no hay idioma guardado, detectar del navegador
        const idiomaNavegador = navigator.language || navigator.userLanguage
        const idiomaDetectado = idiomaNavegador.startsWith('es') ? 'es-AR' : 'en-US'

        idiomaActual.value = idiomaDetectado
        locale.value = idiomaDetectado
        console.log('🌐 Idioma detectado del navegador:', idiomaDetectado)
      }
    } catch (error) {
      console.error('❌ Error al cargar idioma:', error)
    } finally {
      cargandoIdioma.value = false
    }
  }

  // Guardar idioma en el storage
  const guardarIdioma = async (nuevoIdioma) => {
    try {
      if (!nuevoIdioma) {
        console.log('⚠️ Idioma vacío, no se guarda')
        return false
      }

      console.log('💾 Intentando guardar idioma:', nuevoIdioma)

      await Preferences.set({
        key: CLAVE_IDIOMA,
        value: nuevoIdioma,
      })

      // Verificar que se guardó
      const verificacion = await Preferences.get({ key: CLAVE_IDIOMA })
      console.log('✅ Verificación guardado:', verificacion.value)

      idiomaActual.value = nuevoIdioma
      locale.value = nuevoIdioma
      return true
    } catch (error) {
      console.error('❌ Error al guardar idioma:', error)
      return false
    }
  }

  return {
    idiomaActual,
    cargandoIdioma,
    cargarIdioma,
    guardarIdioma,
  }
}
