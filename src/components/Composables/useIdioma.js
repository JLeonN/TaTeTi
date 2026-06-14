import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Preferences } from '@capacitor/preferences'
import {
  IDIOMA_PREDETERMINADO,
  actualizarIdiomaDocumento,
  esIdiomaHabilitado,
  normalizarIdioma,
  obtenerPreferenciasIdiomaSistema,
} from 'src/i18n/ConfiguracionIdiomas'

const idiomaActual = ref(IDIOMA_PREDETERMINADO)
const cargandoIdioma = ref(false)
const CLAVE_IDIOMA = 'idioma_usuario'

export function useIdioma() {
  const { locale } = useI18n()

  const aplicarIdioma = (codigo) => {
    idiomaActual.value = codigo
    locale.value = codigo
    actualizarIdiomaDocumento(codigo)
  }

  const cargarIdioma = async () => {
    try {
      cargandoIdioma.value = true
      const resultado = await Preferences.get({ key: CLAVE_IDIOMA })

      if (esIdiomaHabilitado(resultado.value)) {
        aplicarIdioma(resultado.value)
      } else {
        aplicarIdioma(normalizarIdioma(obtenerPreferenciasIdiomaSistema()))
      }
    } catch (error) {
      aplicarIdioma(IDIOMA_PREDETERMINADO)
      console.error('Error al cargar el idioma:', error)
    } finally {
      cargandoIdioma.value = false
    }
  }

  const guardarIdioma = async (nuevoIdioma) => {
    try {
      if (!esIdiomaHabilitado(nuevoIdioma)) {
        return false
      }

      await Preferences.set({
        key: CLAVE_IDIOMA,
        value: nuevoIdioma,
      })

      const verificacion = await Preferences.get({ key: CLAVE_IDIOMA })
      if (verificacion.value !== nuevoIdioma) {
        return false
      }

      aplicarIdioma(nuevoIdioma)
      return true
    } catch (error) {
      console.error('Error al guardar el idioma:', error)
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
