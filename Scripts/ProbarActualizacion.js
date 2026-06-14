import assert from 'node:assert/strict'
import {
  normalizarCambios,
  validarUrlPlayStore,
} from '../src/components/Actualizacion/ServicioActualizacionApp.js'

const URL_VALIDA =
  'https://play.google.com/store/apps/details?id=com.leotateti.tateti'

assert.ok(validarUrlPlayStore(URL_VALIDA))
assert.equal(
  validarUrlPlayStore('https://ejemplo.com/store/apps/details?id=com.leotateti.tateti'),
  '',
)
assert.equal(
  validarUrlPlayStore('https://play.google.com/store/apps/details?id=otro.paquete'),
  '',
)
assert.equal(
  validarUrlPlayStore('http://play.google.com/store/apps/details?id=com.leotateti.tateti'),
  '',
)

const novedadesExcesivas = Array.from({ length: 12 }, (_, indice) => `Novedad ${indice + 1}`)
const cambiosNormalizados = normalizarCambios(
  {
    'es-AR': [
      {
        apartado: 'A'.repeat(120),
        novedades: novedadesExcesivas,
      },
    ],
  },
  'es-AR',
)

assert.equal(cambiosNormalizados.length, 1)
assert.equal(cambiosNormalizados[0].apartado.length, 80)
assert.equal(cambiosNormalizados[0].novedades.length, 8)
assert.deepEqual(normalizarCambios({ 'es-AR': ['Fallback'] }, 'xx-XX'), [
  { apartado: '', novedades: ['Fallback'] },
])
assert.deepEqual(normalizarCambios({ 'es-AR': 'inválido' }, 'es-AR'), [])

console.log('Contrato remoto de actualización validado.')
