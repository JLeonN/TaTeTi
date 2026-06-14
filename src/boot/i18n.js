import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import {
  IDIOMA_FALLBACK,
  actualizarIdiomaDocumento,
  normalizarIdioma,
  obtenerPreferenciasIdiomaSistema,
} from 'src/i18n/ConfiguracionIdiomas'

export default defineBoot(({ app }) => {
  const idiomaInicial = normalizarIdioma(obtenerPreferenciasIdiomaSistema())
  actualizarIdiomaDocumento(idiomaInicial)

  const i18n = createI18n({
    locale: idiomaInicial,
    fallbackLocale: IDIOMA_FALLBACK,
    globalInjection: true,
    legacy: false,
    messages,
  })

  app.use(i18n)
})
