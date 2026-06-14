import { readFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const RAIZ = fileURLToPath(new URL('../', import.meta.url))
const RUTA_CATALOGO = path.join(RAIZ, 'src', 'i18n', 'IdiomasApp.json')
const RUTA_CATALOGO_GENERADO = path.join(RAIZ, 'src', 'i18n', 'CatalogoIdiomas.js')
const RUTA_FICHA = path.join(RAIZ, 'PublicacionGooglePlay', 'FichaGooglePlay.json')
const RUTAS_MENSAJES = {
  'es-AR': 'src/i18n/EsAR/Index.js',
  'en-US': 'src/i18n/EnUS/Index.js',
  'pt-BR': 'src/i18n/PtBR/Index.js',
  'fr-FR': 'src/i18n/FrFR/Index.js',
  'it-IT': 'src/i18n/ItIT/Index.js',
  'de-DE': 'src/i18n/DeDE/Index.js',
  'ja-JP': 'src/i18n/JaJP/Index.js',
  'ko-KR': 'src/i18n/KoKR/Index.js',
  'sv-SE': 'src/i18n/SvSE/Index.js',
  'nb-NO': 'src/i18n/NbNO/Index.js',
}

const extraerInterpolaciones = (texto) =>
  [...texto.matchAll(/\{([A-Za-z][A-Za-z0-9]*)\}/g)].map((coincidencia) => coincidencia[1]).sort()

const aplanarMensajes = (valor, prefijo = '', resultado = {}) => {
  if (typeof valor === 'string') {
    resultado[prefijo] = valor
    return resultado
  }

  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) {
    throw new Error(`El mensaje ${prefijo || 'raíz'} debe ser texto u objeto.`)
  }

  Object.entries(valor).forEach(([clave, contenido]) => {
    aplanarMensajes(contenido, prefijo ? `${prefijo}.${clave}` : clave, resultado)
  })

  return resultado
}

const validarCatalogo = (catalogo) => {
  const idiomas = catalogo.idiomas.filter((idioma) => idioma.habilitado)
  const codigosApp = new Set()
  const codigosGooglePlay = new Set()
  const codigosDeteccion = new Map()

  idiomas.forEach((idioma) => {
    if (!RUTAS_MENSAJES[idioma.codigoApp]) {
      throw new Error(`No existe una ruta controlada para ${idioma.codigoApp}.`)
    }
    if (codigosApp.has(idioma.codigoApp)) {
      throw new Error(`Código de app duplicado: ${idioma.codigoApp}.`)
    }
    if (codigosGooglePlay.has(idioma.codigoGooglePlay)) {
      throw new Error(`Código de Google Play duplicado: ${idioma.codigoGooglePlay}.`)
    }
    codigosApp.add(idioma.codigoApp)
    codigosGooglePlay.add(idioma.codigoGooglePlay)

    ;[idioma.codigoApp, ...idioma.alias].forEach((codigoDeteccion) => {
      const codigoNormalizado = codigoDeteccion.toLowerCase()
      const propietario = codigosDeteccion.get(codigoNormalizado)
      if (propietario && propietario !== idioma.codigoApp) {
        throw new Error(
          `El código de detección ${codigoDeteccion} pertenece a ${propietario} y ${idioma.codigoApp}.`,
        )
      }
      codigosDeteccion.set(codigoNormalizado, idioma.codigoApp)
    })
  })

  ;[catalogo.idiomaFuente, catalogo.idiomaPredeterminado, catalogo.idiomaFallback].forEach(
    (codigo) => {
      if (!codigosApp.has(codigo)) {
        throw new Error(`El idioma configurado ${codigo} no está habilitado.`)
      }
    },
  )

  return idiomas
}

const cargarMensajes = async (codigo) => {
  const ruta = path.join(RAIZ, RUTAS_MENSAJES[codigo])
  return (await import(pathToFileURL(ruta).href)).default
}

const validarMensajes = async (catalogo, idiomas) => {
  const mensajesFuente = aplanarMensajes(await cargarMensajes(catalogo.idiomaFuente))
  const clavesFuente = Object.keys(mensajesFuente).sort()

  for (const idioma of idiomas) {
    const mensajes = aplanarMensajes(await cargarMensajes(idioma.codigoApp))
    const claves = Object.keys(mensajes).sort()
    const faltantes = clavesFuente.filter((clave) => !claves.includes(clave))
    const adicionales = claves.filter((clave) => !clavesFuente.includes(clave))

    if (faltantes.length || adicionales.length) {
      throw new Error(
        `${idioma.codigoApp}: claves faltantes [${faltantes.join(', ')}], adicionales [${adicionales.join(', ')}].`,
      )
    }

    clavesFuente.forEach((clave) => {
      const fuente = extraerInterpolaciones(mensajesFuente[clave])
      const traduccion = extraerInterpolaciones(mensajes[clave])
      if (fuente.join('|') !== traduccion.join('|')) {
        throw new Error(`${idioma.codigoApp}: interpolaciones incompatibles en ${clave}.`)
      }
    })
  }
}

const validarFichaGooglePlay = async (idiomas) => {
  const ficha = JSON.parse(await readFile(RUTA_FICHA, 'utf8'))

  idiomas.forEach((idioma) => {
    const contenido = ficha.idiomas[idioma.codigoGooglePlay]
    if (!contenido) {
      throw new Error(`Falta la ficha de Google Play para ${idioma.codigoGooglePlay}.`)
    }
    if (contenido.nombre.length > 30) {
      throw new Error(`El nombre de ${idioma.codigoGooglePlay} supera 30 caracteres.`)
    }
    if (contenido.descripcionCorta.length > 80) {
      throw new Error(`La descripción corta de ${idioma.codigoGooglePlay} supera 80 caracteres.`)
    }
    if (contenido.descripcionCompleta.length > 4000) {
      throw new Error(`La descripción completa de ${idioma.codigoGooglePlay} supera 4000 caracteres.`)
    }
  })
}

const catalogo = JSON.parse(await readFile(RUTA_CATALOGO, 'utf8'))
const catalogoGenerado = (await import(`${pathToFileURL(RUTA_CATALOGO_GENERADO).href}?t=${Date.now()}`))
  .default
if (JSON.stringify(catalogoGenerado) !== JSON.stringify(catalogo)) {
  throw new Error('CatalogoIdiomas.js está desactualizado. Ejecuta npm run generar-idiomas.')
}
const idiomas = validarCatalogo(catalogo)
await validarMensajes(catalogo, idiomas)
await validarFichaGooglePlay(idiomas)

console.log(`Idiomas validados: ${idiomas.map((idioma) => idioma.codigoApp).join(', ')}.`)
