import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Preferences } from '@capacitor/preferences'
import {
  IDIOMA_PREDETERMINADO,
  actualizarIdiomaDocumento,
  obtenerPreferenciasIdiomaSistema,
} from 'src/i18n/ConfiguracionIdiomas'
import { crearGestorIdioma } from 'src/components/Composables/GestorIdioma'

const idiomaActual = ref(IDIOMA_PREDETERMINADO)
const cargandoIdioma = ref(false)

export function useIdioma() {
  const { locale } = useI18n()

  const aplicarIdioma = (codigo) => {
    idiomaActual.value = codigo
    locale.value = codigo
    actualizarIdiomaDocumento(codigo)
  }

  const gestorIdioma = crearGestorIdioma({
    almacenamiento: Preferences,
    aplicarIdioma,
    obtenerIdiomasSistema: obtenerPreferenciasIdiomaSistema,
  })

  const cargarIdioma = async () => {
    try {
      cargandoIdioma.value = true
      await gestorIdioma.cargarIdioma()
    } catch (error) {
      console.error('Error al cargar el idioma:', error)
    } finally {
      cargandoIdioma.value = false
    }
  }

  const guardarIdioma = async (nuevoIdioma) => {
    try {
      return await gestorIdioma.guardarIdioma(nuevoIdioma)
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
