import assert from 'node:assert/strict'
import { crearGestorIdioma, CLAVE_IDIOMA } from '../src/components/Composables/GestorIdioma.js'
import {
  IDIOMA_PREDETERMINADO,
  actualizarIdiomaDocumento,
  canonicalizarCodigoIdioma,
  idiomasHabilitados,
  normalizarIdioma,
} from '../src/i18n/ConfiguracionIdiomas.js'

assert.equal(canonicalizarCodigoIdioma('PT_br'), '')
assert.equal(canonicalizarCodigoIdioma('pt-br'), 'pt-BR')
assert.equal(normalizarIdioma(['fr-CA']), 'fr-FR')
assert.equal(normalizarIdioma(['fr-CA', 'en-US']), 'fr-FR')
assert.equal(normalizarIdioma(['it-CH']), 'it-IT')
assert.equal(normalizarIdioma(['de-AT']), 'de-DE')
assert.equal(normalizarIdioma(['ja']), 'ja-JP')
assert.equal(normalizarIdioma(['ja-JP']), 'ja-JP')
assert.equal(normalizarIdioma(['ko']), 'ko-KR')
assert.equal(normalizarIdioma(['ko-KR']), 'ko-KR')
assert.equal(normalizarIdioma(['xx-XX', 'pt-BR']), 'pt-BR')
assert.equal(normalizarIdioma(['xx-XX']), IDIOMA_PREDETERMINADO)

const crearAlmacenamiento = (valorInicial = null) => {
  let valor = valorInicial
  return {
    get: async ({ key }) => ({ value: key === CLAVE_IDIOMA ? valor : null }),
    set: async ({ key, value: nuevoValor }) => {
      if (key === CLAVE_IDIOMA) {
        valor = nuevoValor
      }
    },
  }
}

for (const idioma of idiomasHabilitados) {
  const idiomasAplicados = []
  const almacenamiento = crearAlmacenamiento()
  const gestor = crearGestorIdioma({
    almacenamiento,
    aplicarIdioma: (codigo) => idiomasAplicados.push(codigo),
    obtenerIdiomasSistema: () => ['xx-XX'],
  })

  assert.equal(await gestor.guardarIdioma(idioma.codigoApp), true)
  assert.equal(await gestor.cargarIdioma(), idioma.codigoApp)
  assert.deepEqual(idiomasAplicados, [idioma.codigoApp, idioma.codigoApp])
}

const idiomasFallback = []
const gestorFallback = crearGestorIdioma({
  almacenamiento: crearAlmacenamiento('xx-XX'),
  aplicarIdioma: (codigo) => idiomasFallback.push(codigo),
  obtenerIdiomasSistema: () => ['fr-CA'],
})
assert.equal(await gestorFallback.cargarIdioma(), 'fr-FR')
assert.deepEqual(idiomasFallback, ['fr-FR'])

const gestorIdiomaInvalido = crearGestorIdioma({
  almacenamiento: crearAlmacenamiento(),
  aplicarIdioma: () => assert.fail('No debe aplicar un idioma inválido.'),
  obtenerIdiomasSistema: () => [],
})
assert.equal(await gestorIdiomaInvalido.guardarIdioma('xx-XX'), false)

const gestorSinConfirmacion = crearGestorIdioma({
  almacenamiento: {
    get: async () => ({ value: 'es-AR' }),
    set: async () => {},
  },
  aplicarIdioma: () => assert.fail('No debe aplicar un guardado sin confirmar.'),
  obtenerIdiomasSistema: () => [],
})
assert.equal(await gestorSinConfirmacion.guardarIdioma('de-DE'), false)

const gestorConErrorAlGuardar = crearGestorIdioma({
  almacenamiento: {
    get: async () => ({ value: null }),
    set: async () => {
      throw new Error('Error de escritura simulado')
    },
  },
  aplicarIdioma: () => assert.fail('No debe aplicar un idioma si falla la escritura.'),
  obtenerIdiomasSistema: () => [],
})
await assert.rejects(gestorConErrorAlGuardar.guardarIdioma('it-IT'), /Error de escritura simulado/)

const idiomasTrasError = []
const gestorConError = crearGestorIdioma({
  almacenamiento: {
    get: async () => {
      throw new Error('Error simulado')
    },
    set: async () => {},
  },
  aplicarIdioma: (codigo) => idiomasTrasError.push(codigo),
  obtenerIdiomasSistema: () => ['de-DE'],
})
await assert.rejects(gestorConError.cargarIdioma(), /Error simulado/)
assert.deepEqual(idiomasTrasError, [IDIOMA_PREDETERMINADO])

const documentoOriginal = globalThis.document
globalThis.document = { documentElement: { lang: '' } }
actualizarIdiomaDocumento('de-DE')
assert.equal(globalThis.document.documentElement.lang, 'de-DE')
actualizarIdiomaDocumento('xx-XX')
assert.equal(globalThis.document.documentElement.lang, IDIOMA_PREDETERMINADO)
globalThis.document = documentoOriginal

console.log('Normalización, persistencia, fallback y atributo lang validados.')
