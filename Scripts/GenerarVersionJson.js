import { readFile, writeFile } from 'node:fs/promises'

const RUTA_PACKAGE = new URL('../package.json', import.meta.url)
const RUTA_VERSION = new URL('../public/version.json', import.meta.url)
const URL_PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.leotateti.tateti'

const leerJson = async (ruta, valorPredeterminado = {}) => {
  try {
    return JSON.parse(await readFile(ruta, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') {
      return valorPredeterminado
    }
    throw error
  }
}

const paquete = await leerJson(RUTA_PACKAGE)
const versionActual = await leerJson(RUTA_VERSION)

const contenidoVersion = {
  versionDisponible: paquete.version,
  urlPlayStore: versionActual.urlPlayStore || URL_PLAY_STORE,
  mostrarActualizacion: versionActual.mostrarActualizacion === true,
  cambios: versionActual.cambios ?? {
    'es-AR': [],
    'en-US': [],
  },
}

await writeFile(RUTA_VERSION, `${JSON.stringify(contenidoVersion, null, 2)}\n`, 'utf8')

console.log(`version.json generado para la versión ${paquete.version}`)
