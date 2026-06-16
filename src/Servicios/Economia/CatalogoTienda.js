export const RECOMPENSA_DIARIA = 100
export const RECOMPENSA_ANUNCIO = 15
export const MAXIMO_ANUNCIOS_DIARIOS = 3

export const catalogoColores = Object.freeze([
  {
    id: 'rojo',
    claveNombre: 'tienda.colores.rojo',
    precio: 0,
    variable: '--color-catalogo-rojo',
    colorVista: '#ff4757',
    inicial: true,
  },
  {
    id: 'azul',
    claveNombre: 'tienda.colores.azul',
    precio: 0,
    variable: '--color-catalogo-azul',
    colorVista: '#1e90ff',
    inicial: true,
  },
  {
    id: 'amarillo',
    claveNombre: 'tienda.colores.amarillo',
    precio: 60,
    variable: '--color-catalogo-amarillo',
    colorVista: '#ffdf3e',
  },
  {
    id: 'verde',
    claveNombre: 'tienda.colores.verde',
    precio: 60,
    variable: '--color-catalogo-verde',
    colorVista: '#00e676',
  },
  {
    id: 'naranja',
    claveNombre: 'tienda.colores.naranja',
    precio: 60,
    variable: '--color-catalogo-naranja',
    colorVista: '#ff8c00',
  },
  {
    id: 'magenta',
    claveNombre: 'tienda.colores.magenta',
    precio: 60,
    variable: '--color-catalogo-magenta',
    colorVista: '#ff4fd8',
  },
  {
    id: 'turquesa',
    claveNombre: 'tienda.colores.turquesa',
    precio: 60,
    variable: '--color-catalogo-turquesa',
    colorVista: '#27e6d6',
  },
  {
    id: 'blanco',
    claveNombre: 'tienda.colores.blanco',
    precio: 60,
    variable: '--color-catalogo-blanco',
    colorVista: '#ffffff',
  },
  {
    id: 'rojoFluor',
    claveNombre: 'tienda.colores.rojoFluor',
    precio: 120,
    variable: '--color-catalogo-rojo-fluor',
    colorVista: '#ff4757',
  },
  {
    id: 'azulFluor',
    claveNombre: 'tienda.colores.azulFluor',
    precio: 120,
    variable: '--color-catalogo-azul-fluor',
    colorVista: '#1e90ff',
  },
  {
    id: 'amarilloFluor',
    claveNombre: 'tienda.colores.amarilloFluor',
    precio: 120,
    variable: '--color-catalogo-amarillo-fluor',
    colorVista: '#ffdf3e',
  },
  {
    id: 'verdeFluor',
    claveNombre: 'tienda.colores.verdeFluor',
    precio: 120,
    variable: '--color-catalogo-verde-fluor',
    colorVista: '#00e676',
  },
  {
    id: 'naranjaFluor',
    claveNombre: 'tienda.colores.naranjaFluor',
    precio: 120,
    variable: '--color-catalogo-naranja-fluor',
    colorVista: '#ff8c00',
  },
  {
    id: 'magentaFluor',
    claveNombre: 'tienda.colores.magentaFluor',
    precio: 120,
    variable: '--color-catalogo-magenta-fluor',
    colorVista: '#ff4fd8',
  },
  {
    id: 'turquesaFluor',
    claveNombre: 'tienda.colores.turquesaFluor',
    precio: 120,
    variable: '--color-catalogo-turquesa-fluor',
    colorVista: '#27e6d6',
  },
  {
    id: 'blancoFluor',
    claveNombre: 'tienda.colores.blancoFluor',
    precio: 120,
    variable: '--color-catalogo-blanco-fluor',
    colorVista: '#e6fbff',
  },
])

export const obtenerArticulo = (identificador) =>
  catalogoColores.find((articulo) => articulo.id === identificador) ?? null
