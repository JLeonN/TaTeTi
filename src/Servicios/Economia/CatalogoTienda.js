export const RECOMPENSA_DIARIA = 10
export const RECOMPENSA_ANUNCIO = 15
export const MAXIMO_ANUNCIOS_DIARIOS = 3

export const catalogoColores = Object.freeze([
  {
    id: 'rojo',
    claveNombre: 'tienda.colores.rojo',
    precio: 0,
    variable: '--color-catalogo-rojo',
    inicial: true,
  },
  {
    id: 'azul',
    claveNombre: 'tienda.colores.azul',
    precio: 0,
    variable: '--color-catalogo-azul',
    inicial: true,
  },
  {
    id: 'amarillo',
    claveNombre: 'tienda.colores.amarillo',
    precio: 60,
    variable: '--color-catalogo-amarillo',
  },
  {
    id: 'verde',
    claveNombre: 'tienda.colores.verde',
    precio: 60,
    variable: '--color-catalogo-verde',
  },
  {
    id: 'naranja',
    claveNombre: 'tienda.colores.naranja',
    precio: 60,
    variable: '--color-catalogo-naranja',
  },
  {
    id: 'magenta',
    claveNombre: 'tienda.colores.magenta',
    precio: 90,
    variable: '--color-catalogo-magenta',
  },
  {
    id: 'turquesa',
    claveNombre: 'tienda.colores.turquesa',
    precio: 90,
    variable: '--color-catalogo-turquesa',
  },
  {
    id: 'blanco',
    claveNombre: 'tienda.colores.blanco',
    precio: 120,
    variable: '--color-catalogo-blanco',
  },
])

export const obtenerArticulo = (identificador) =>
  catalogoColores.find((articulo) => articulo.id === identificador) ?? null

