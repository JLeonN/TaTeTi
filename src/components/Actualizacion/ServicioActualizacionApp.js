import { IDIOMA_PREDETERMINADO } from '../../i18n/ConfiguracionIdiomas.js'

const URL_VERSION_REMOTA = process.env.URL_VERSION_REMOTA
const URL_PLAY_STORE_POR_DEFECTO = process.env.URL_PLAY_STORE
const VERSION_INSTALADA = process.env.VERSION_APP
const TIEMPO_LIMITE_MS = 8000
const PAQUETE_ANDROID = 'com.leotateti.tateti'
const MAXIMO_GRUPOS = 4
const MAXIMO_NOVEDADES = 8
const MAXIMO_CARACTERES_APARTADO = 80
const MAXIMO_CARACTERES_NOVEDAD = 500

const crearEstadoSinActualizacion = () => ({
  hayActualizacion: false,
  versionInstalada: VERSION_INSTALADA,
  versionDisponible: '',
  urlPlayStore: URL_PLAY_STORE_POR_DEFECTO,
  cambios: [],
})

const convertirVersionEnSegmentos = (version) => {
  if (typeof version !== 'string' || !/^\d+(\.\d+)*$/.test(version.trim())) {
    return null
  }

  return version.split('.').map(Number)
}

const esVersionMayor = (versionDisponible, versionInstalada) => {
  const disponible = convertirVersionEnSegmentos(versionDisponible)
  const instalada = convertirVersionEnSegmentos(versionInstalada)

  if (!disponible || !instalada) {
    return false
  }

  const cantidadSegmentos = Math.max(disponible.length, instalada.length)

  for (let indice = 0; indice < cantidadSegmentos; indice += 1) {
    const segmentoDisponible = disponible[indice] ?? 0
    const segmentoInstalado = instalada[indice] ?? 0

    if (segmentoDisponible !== segmentoInstalado) {
      return segmentoDisponible > segmentoInstalado
    }
  }

  return false
}

const normalizarGrupos = (cambios) => {
  if (!Array.isArray(cambios)) {
    return []
  }

  const grupos = []
  let cantidadNovedades = 0

  cambios.slice(0, MAXIMO_GRUPOS).forEach((cambio) => {
    if (typeof cambio === 'string' && cambio.trim()) {
      if (cantidadNovedades >= MAXIMO_NOVEDADES) {
        return
      }
      grupos.push({
        apartado: '',
        novedades: [cambio.trim().slice(0, MAXIMO_CARACTERES_NOVEDAD)],
      })
      cantidadNovedades += 1
      return
    }

    if (!cambio || typeof cambio !== 'object' || !Array.isArray(cambio.novedades)) {
      return
    }

    const novedades = cambio.novedades
      .filter((novedad) => typeof novedad === 'string' && novedad.trim())
      .slice(0, Math.max(0, MAXIMO_NOVEDADES - cantidadNovedades))
      .map((novedad) => novedad.trim().slice(0, MAXIMO_CARACTERES_NOVEDAD))

    if (novedades.length > 0) {
      grupos.push({
        apartado:
          typeof cambio.apartado === 'string'
            ? cambio.apartado.trim().slice(0, MAXIMO_CARACTERES_APARTADO)
            : '',
        novedades,
      })
      cantidadNovedades += novedades.length
    }
  })

  return grupos
}

const normalizarCambios = (cambios, idiomaActual) => {
  if (Array.isArray(cambios)) {
    return normalizarGrupos(cambios)
  }

  if (!cambios || typeof cambios !== 'object') {
    return []
  }

  const cambiosDelIdioma = cambios[idiomaActual] ?? cambios[IDIOMA_PREDETERMINADO]
  return normalizarGrupos(cambiosDelIdioma)
}

const validarUrlPlayStore = (url) => {
  if (typeof url !== 'string' || !url.trim()) {
    return ''
  }

  try {
    const destino = new URL(url.trim())
    const esRutaAplicacion = destino.pathname === '/store/apps/details'
    const esPaqueteEsperado = destino.searchParams.get('id') === PAQUETE_ANDROID
    const esDominioPermitido = destino.hostname === 'play.google.com'

    return destino.protocol === 'https:' &&
      esDominioPermitido &&
      esRutaAplicacion &&
      esPaqueteEsperado
      ? destino.toString()
      : ''
  } catch {
    return ''
  }
}

const obtenerUrlPlayStoreSegura = (url) =>
  validarUrlPlayStore(url) || validarUrlPlayStore(URL_PLAY_STORE_POR_DEFECTO)

const obtenerEstadoActualizacion = async (idiomaActual) => {
  const estadoSinActualizacion = crearEstadoSinActualizacion()
  const controlador = new AbortController()
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE_MS)

  try {
    const respuesta = await fetch(URL_VERSION_REMOTA, {
      cache: 'no-store',
      signal: controlador.signal,
    })

    if (!respuesta.ok) {
      return estadoSinActualizacion
    }

    const datos = await respuesta.json()
    const versionDisponible =
      typeof datos.versionDisponible === 'string' ? datos.versionDisponible.trim() : ''

    if (
      datos.mostrarActualizacion !== true ||
      !esVersionMayor(versionDisponible, VERSION_INSTALADA)
    ) {
      return estadoSinActualizacion
    }

    return {
      hayActualizacion: true,
      versionInstalada: VERSION_INSTALADA,
      versionDisponible,
      urlPlayStore: obtenerUrlPlayStoreSegura(datos.urlPlayStore),
      cambios: normalizarCambios(datos.cambios, idiomaActual),
    }
  } catch {
    return estadoSinActualizacion
  } finally {
    clearTimeout(temporizador)
  }
}

const abrirActualizacionEnTienda = (urlPlayStore = URL_PLAY_STORE_POR_DEFECTO) => {
  const urlDestino = obtenerUrlPlayStoreSegura(urlPlayStore)
  if (!urlDestino) {
    return
  }
  const ventana = window.open(urlDestino, '_blank')

  if (ventana) {
    ventana.opener = null
    return
  }

  window.location.assign(urlDestino)
}

export {
  abrirActualizacionEnTienda,
  crearEstadoSinActualizacion,
  normalizarCambios,
  obtenerUrlPlayStoreSegura,
  obtenerEstadoActualizacion,
  validarUrlPlayStore,
}
