const URL_VERSION_REMOTA = process.env.URL_VERSION_REMOTA
const URL_PLAY_STORE_POR_DEFECTO = process.env.URL_PLAY_STORE
const VERSION_INSTALADA = process.env.VERSION_APP
const TIEMPO_LIMITE_MS = 8000

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

  cambios.forEach((cambio) => {
    if (typeof cambio === 'string' && cambio.trim()) {
      grupos.push({
        apartado: '',
        novedades: [cambio.trim()],
      })
      return
    }

    if (!cambio || typeof cambio !== 'object' || !Array.isArray(cambio.novedades)) {
      return
    }

    const novedades = cambio.novedades
      .filter((novedad) => typeof novedad === 'string' && novedad.trim())
      .map((novedad) => novedad.trim())

    if (novedades.length > 0) {
      grupos.push({
        apartado: typeof cambio.apartado === 'string' ? cambio.apartado.trim() : '',
        novedades,
      })
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

  const cambiosDelIdioma = cambios[idiomaActual] ?? cambios['es-AR']
  return normalizarGrupos(cambiosDelIdioma)
}

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
      urlPlayStore:
        typeof datos.urlPlayStore === 'string' && datos.urlPlayStore.trim()
          ? datos.urlPlayStore.trim()
          : URL_PLAY_STORE_POR_DEFECTO,
      cambios: normalizarCambios(datos.cambios, idiomaActual),
    }
  } catch {
    return estadoSinActualizacion
  } finally {
    clearTimeout(temporizador)
  }
}

const abrirActualizacionEnTienda = (urlPlayStore = URL_PLAY_STORE_POR_DEFECTO) => {
  const urlDestino = urlPlayStore || URL_PLAY_STORE_POR_DEFECTO
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
  obtenerEstadoActualizacion,
}
