const COMBINACIONES_GANADORAS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export const tieneJugadaGanadoraDisponible = (tablero, ficha) =>
  COMBINACIONES_GANADORAS.some((combinacion) => {
    const valores = combinacion.map((indice) => tablero[indice])
    return (
      valores.filter((valor) => valor === ficha).length === 2 &&
      valores.filter((valor) => valor === null).length === 1
    )
  })

export const obtenerTipoLineaGanadora = (combinacion) => {
  if (!combinacion) return null
  const clave = combinacion.join(',')
  if (['0,1,2', '3,4,5', '6,7,8'].includes(clave)) return 'fila'
  if (['0,3,6', '1,4,7', '2,5,8'].includes(clave)) return 'columna'
  return 'diagonal'
}
