export const RECOMPENSA_DIARIA = 10
export const RECOMPENSA_ANUNCIO = 15
export const MAXIMO_ANUNCIOS_DIARIOS = 3

const crearColor = (articulo) => ({
  ...articulo,
  categoria: 'color',
  representacion: null,
})

export const catalogoArticulos = Object.freeze([
  crearColor({
    id: 'rojo',
    claveNombre: 'tienda.colores.rojo',
    precio: 0,
    variable: '--color-catalogo-rojo',
    colorVista: '#ff4757',
    inicial: true,
  }),
  crearColor({
    id: 'azul',
    claveNombre: 'tienda.colores.azul',
    precio: 0,
    variable: '--color-catalogo-azul',
    colorVista: '#1e90ff',
    inicial: true,
  }),
  crearColor({
    id: 'amarillo',
    claveNombre: 'tienda.colores.amarillo',
    precio: 60,
    variable: '--color-catalogo-amarillo',
    colorVista: '#ffdf3e',
  }),
  crearColor({
    id: 'verde',
    claveNombre: 'tienda.colores.verde',
    precio: 60,
    variable: '--color-catalogo-verde',
    colorVista: '#00e676',
  }),
  crearColor({
    id: 'naranja',
    claveNombre: 'tienda.colores.naranja',
    precio: 60,
    variable: '--color-catalogo-naranja',
    colorVista: '#ff8c00',
  }),
  crearColor({
    id: 'magenta',
    claveNombre: 'tienda.colores.magenta',
    precio: 60,
    variable: '--color-catalogo-magenta',
    colorVista: '#ff4fd8',
  }),
  crearColor({
    id: 'turquesa',
    claveNombre: 'tienda.colores.turquesa',
    precio: 60,
    variable: '--color-catalogo-turquesa',
    colorVista: '#27e6d6',
  }),
  crearColor({
    id: 'blanco',
    claveNombre: 'tienda.colores.blanco',
    precio: 60,
    variable: '--color-catalogo-blanco',
    colorVista: '#ffffff',
  }),
  crearColor({
    id: 'rojoFluor',
    claveNombre: 'tienda.colores.rojoFluor',
    precio: 120,
    variable: '--color-catalogo-rojo-fluor',
    colorVista: '#ff4757',
  }),
  crearColor({
    id: 'azulFluor',
    claveNombre: 'tienda.colores.azulFluor',
    precio: 120,
    variable: '--color-catalogo-azul-fluor',
    colorVista: '#1e90ff',
  }),
  crearColor({
    id: 'amarilloFluor',
    claveNombre: 'tienda.colores.amarilloFluor',
    precio: 120,
    variable: '--color-catalogo-amarillo-fluor',
    colorVista: '#ffdf3e',
  }),
  crearColor({
    id: 'verdeFluor',
    claveNombre: 'tienda.colores.verdeFluor',
    precio: 120,
    variable: '--color-catalogo-verde-fluor',
    colorVista: '#00e676',
  }),
  crearColor({
    id: 'naranjaFluor',
    claveNombre: 'tienda.colores.naranjaFluor',
    precio: 120,
    variable: '--color-catalogo-naranja-fluor',
    colorVista: '#ff8c00',
  }),
  crearColor({
    id: 'magentaFluor',
    claveNombre: 'tienda.colores.magentaFluor',
    precio: 120,
    variable: '--color-catalogo-magenta-fluor',
    colorVista: '#ff4fd8',
  }),
  crearColor({
    id: 'turquesaFluor',
    claveNombre: 'tienda.colores.turquesaFluor',
    precio: 120,
    variable: '--color-catalogo-turquesa-fluor',
    colorVista: '#27e6d6',
  }),
  crearColor({
    id: 'blancoFluor',
    claveNombre: 'tienda.colores.blancoFluor',
    precio: 120,
    variable: '--color-catalogo-blanco-fluor',
    colorVista: '#e6fbff',
  }),
  {
    id: 'simboloX',
    categoria: 'simbolo',
    claveNombre: 'tienda.simbolos.x',
    precio: 0,
    inicial: true,
    representacion: { tipo: 'texto', valor: 'X' },
    estiloVisual: {},
  },
  {
    id: 'simboloO',
    categoria: 'simbolo',
    claveNombre: 'tienda.simbolos.o',
    precio: 0,
    inicial: true,
    representacion: { tipo: 'texto', valor: 'O' },
    estiloVisual: {},
  },
  {
    id: 'simboloTriangulo',
    categoria: 'simbolo',
    claveNombre: 'tienda.simbolos.triangulo',
    precio: 120,
    inicial: false,
    representacion: { tipo: 'texto', valor: '△' },
    estiloVisual: { grosorContorno: '0.125em' },
  },
  {
    id: 'simboloCuadrado',
    categoria: 'simbolo',
    claveNombre: 'tienda.simbolos.cuadrado',
    precio: 120,
    inicial: false,
    representacion: { tipo: 'texto', valor: '□' },
    estiloVisual: { grosorContorno: '0.125em' },
  },
])

export const catalogoColores = Object.freeze(
  catalogoArticulos.filter((articulo) => articulo.categoria === 'color'),
)
export const catalogoSimbolos = Object.freeze(
  catalogoArticulos.filter((articulo) => articulo.categoria === 'simbolo'),
)

export const obtenerArticulosPorCategoria = (categoria) =>
  catalogoArticulos.filter((articulo) => articulo.categoria === categoria)

export const obtenerArticulo = (identificador) =>
  catalogoArticulos.find((articulo) => articulo.id === identificador) ?? null
