import { obtenerArticulo } from './CatalogoTienda.js'

export const TABLERO_PREDETERMINADO_ID = 'tableroClasico'

const esAparienciaValida = (apariencia) =>
  apariencia &&
  typeof apariencia.tamanoFondo === 'string' &&
  typeof apariencia.posicionFondo === 'string' &&
  Number.isInteger(apariencia.oscurecimiento) &&
  Number.isInteger(apariencia.opacidadCeldas)

export const obtenerArticuloTablero = (identificador) => {
  const articulo = obtenerArticulo(identificador)
  if (articulo?.categoria === 'tablero' && esAparienciaValida(articulo.aparienciaTablero)) {
    return articulo
  }
  return obtenerArticulo(TABLERO_PREDETERMINADO_ID)
}

export const obtenerEstiloTablero = (identificador) => {
  const { aparienciaTablero } = obtenerArticuloTablero(identificador)
  return {
    '--imagen-tablero': aparienciaTablero.rutaImagen
      ? `url("${aparienciaTablero.rutaImagen}")`
      : 'none',
    '--tamano-fondo-tablero': aparienciaTablero.tamanoFondo,
    '--posicion-fondo-tablero': aparienciaTablero.posicionFondo,
    '--oscurecimiento-tablero': `${aparienciaTablero.oscurecimiento}%`,
    '--opacidad-celdas-tablero': `${aparienciaTablero.opacidadCeldas}%`,
  }
}
