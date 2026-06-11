import { readFile } from 'node:fs/promises'

const RUTA_VERSION = new URL('../public/version.json', import.meta.url)

const contieneNovedades = (cambios) => {
  if (Array.isArray(cambios)) {
    return cambios.some((cambio) => {
      if (typeof cambio === 'string') {
        return cambio.trim().length > 0
      }

      return (
        cambio &&
        typeof cambio === 'object' &&
        Array.isArray(cambio.novedades) &&
        cambio.novedades.some(
          (novedad) => typeof novedad === 'string' && novedad.trim().length > 0,
        )
      )
    })
  }

  if (!cambios || typeof cambios !== 'object') {
    return false
  }

  return Object.values(cambios).some(contieneNovedades)
}

const contenido = await readFile(RUTA_VERSION, 'utf8')
const version = JSON.parse(contenido)

if (contieneNovedades(version.cambios) && version.mostrarActualizacion !== true) {
  throw new Error(
    'public/version.json contiene novedades, pero mostrarActualizacion no está en true.',
  )
}

console.log('Contrato de actualización listo para publicar.')
