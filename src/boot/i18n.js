import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default defineBoot(({ app }) => {
  // Detectar idioma del navegador/sistema
  const idiomaNavegador = navigator.language || navigator.userLanguage

  // Determinar idioma inicial (español si es de Latinoamérica/España, sino inglés)
  let idiomaInicial = 'en-US'
  if (idiomaNavegador.startsWith('es')) {
    idiomaInicial = 'es-AR'
  }

  const i18n = createI18n({
    locale: idiomaInicial,
    fallbackLocale: 'en-US', // Si falta una traducción, usa inglés
    globalInjection: true,
    legacy: false, // Usar Composition API
    messages,
  })

  // Set i18n instance on app
  app.use(i18n)
})
