import catalogoIdiomas from './CatalogoIdiomas.js'

const idiomasHabilitados = Object.freeze(
  catalogoIdiomas.idiomas.filter((idioma) => idioma.habilitado).map((idioma) => Object.freeze(idioma)),
)

const canonicalizarCodigoIdioma = (codigo) => {
  if (typeof codigo !== 'string' || !codigo.trim()) {
    return ''
  }

  try {
    return Intl.getCanonicalLocales(codigo.trim())[0] ?? ''
  } catch {
    return ''
  }
}

const buscarIdiomaExacto = (codigo) => {
  const codigoCanonico = canonicalizarCodigoIdioma(codigo).toLowerCase()

  if (!codigoCanonico) {
    return null
  }

  return (
    idiomasHabilitados.find((idioma) => {
      const codigos = [idioma.codigoApp, ...idioma.alias]
      return codigos.some(
        (codigoDisponible) =>
          canonicalizarCodigoIdioma(codigoDisponible).toLowerCase() === codigoCanonico,
      )
    }) ?? null
  )
}

const buscarIdiomaPorBase = (codigo) => {
  const codigoCanonico = canonicalizarCodigoIdioma(codigo)
  const idiomaBase = codigoCanonico.split('-')[0]?.toLowerCase()

  if (!idiomaBase) {
    return null
  }

  return (
    idiomasHabilitados.find((idioma) => {
      const codigos = [idioma.codigoApp, ...idioma.alias]
      return codigos.some(
        (codigoDisponible) =>
          canonicalizarCodigoIdioma(codigoDisponible).split('-')[0]?.toLowerCase() === idiomaBase,
      )
    }) ?? null
  )
}

const normalizarIdioma = (preferencias = []) => {
  const codigos = (Array.isArray(preferencias) ? preferencias : [preferencias]).filter(Boolean)

  for (const codigo of codigos) {
    const idiomaExacto = buscarIdiomaExacto(codigo)
    if (idiomaExacto) {
      return idiomaExacto.codigoApp
    }
    const idiomaPorBase = buscarIdiomaPorBase(codigo)
    if (idiomaPorBase) {
      return idiomaPorBase.codigoApp
    }
  }

  return catalogoIdiomas.idiomaPredeterminado
}

const obtenerPreferenciasIdiomaSistema = () => {
  if (typeof navigator === 'undefined') {
    return []
  }

  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    return navigator.languages
  }

  return [navigator.language || navigator.userLanguage].filter(Boolean)
}

const obtenerIdioma = (codigo) =>
  idiomasHabilitados.find((idioma) => idioma.codigoApp === codigo) ?? null

const esIdiomaHabilitado = (codigo) => obtenerIdioma(codigo) !== null

const actualizarIdiomaDocumento = (codigo) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = esIdiomaHabilitado(codigo)
      ? codigo
      : catalogoIdiomas.idiomaPredeterminado
  }
}

const IDIOMA_FUENTE = catalogoIdiomas.idiomaFuente
const IDIOMA_PREDETERMINADO = catalogoIdiomas.idiomaPredeterminado
const IDIOMA_FALLBACK = catalogoIdiomas.idiomaFallback

export {
  IDIOMA_FALLBACK,
  IDIOMA_FUENTE,
  IDIOMA_PREDETERMINADO,
  actualizarIdiomaDocumento,
  canonicalizarCodigoIdioma,
  esIdiomaHabilitado,
  idiomasHabilitados,
  normalizarIdioma,
  obtenerIdioma,
  obtenerPreferenciasIdiomaSistema,
}
