import assert from 'node:assert/strict'
import {
  IDIOMA_PREDETERMINADO,
  canonicalizarCodigoIdioma,
  normalizarIdioma,
} from '../src/i18n/ConfiguracionIdiomas.js'

assert.equal(canonicalizarCodigoIdioma('PT_br'), '')
assert.equal(canonicalizarCodigoIdioma('pt-br'), 'pt-BR')
assert.equal(normalizarIdioma(['fr-CA']), 'fr-FR')
assert.equal(normalizarIdioma(['fr-CA', 'en-US']), 'fr-FR')
assert.equal(normalizarIdioma(['it-CH']), 'it-IT')
assert.equal(normalizarIdioma(['de-AT']), 'de-DE')
assert.equal(normalizarIdioma(['xx-XX', 'pt-BR']), 'pt-BR')
assert.equal(normalizarIdioma(['xx-XX']), IDIOMA_PREDETERMINADO)

console.log('Normalización de idiomas validada.')
