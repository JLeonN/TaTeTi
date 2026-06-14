import {
  IDIOMA_PREDETERMINADO,
  esIdiomaHabilitado,
  normalizarIdioma,
} from '../../i18n/ConfiguracionIdiomas.js'

const CLAVE_IDIOMA = 'idioma_usuario'

const crearGestorIdioma = ({ almacenamiento, aplicarIdioma, obtenerIdiomasSistema }) => {
  const cargarIdioma = async () => {
    try {
      const resultado = await almacenamiento.get({ key: CLAVE_IDIOMA })
      const idioma = esIdiomaHabilitado(resultado.value)
        ? resultado.value
        : normalizarIdioma(obtenerIdiomasSistema())
      aplicarIdioma(idioma)
      return idioma
    } catch (error) {
      aplicarIdioma(IDIOMA_PREDETERMINADO)
      throw error
    }
  }

  const guardarIdioma = async (nuevoIdioma) => {
    if (!esIdiomaHabilitado(nuevoIdioma)) {
      return false
    }

    await almacenamiento.set({
      key: CLAVE_IDIOMA,
      value: nuevoIdioma,
    })

    const verificacion = await almacenamiento.get({ key: CLAVE_IDIOMA })
    if (verificacion.value !== nuevoIdioma) {
      return false
    }

    aplicarIdioma(nuevoIdioma)
    return true
  }

  return {
    cargarIdioma,
    guardarIdioma,
  }
}

export { CLAVE_IDIOMA, crearGestorIdioma }
