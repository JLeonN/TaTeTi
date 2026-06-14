import deDE from './DeDE/Index.js'
import enUS from './EnUS/Index.js'
import esAR from './EsAR/Index.js'
import frFR from './FrFR/Index.js'
import itIT from './ItIT/Index.js'
import ptBR from './PtBR/Index.js'
import { idiomasHabilitados } from './ConfiguracionIdiomas'

const mensajesPorIdioma = {
  'es-AR': esAR,
  'en-US': enUS,
  'pt-BR': ptBR,
  'fr-FR': frFR,
  'it-IT': itIT,
  'de-DE': deDE,
}

const codigosSinMensajes = idiomasHabilitados
  .map((idioma) => idioma.codigoApp)
  .filter((codigo) => !mensajesPorIdioma[codigo])

if (codigosSinMensajes.length > 0) {
  throw new Error(`Faltan mensajes para los idiomas: ${codigosSinMensajes.join(', ')}`)
}

export default Object.fromEntries(
  idiomasHabilitados.map((idioma) => [idioma.codigoApp, mensajesPorIdioma[idioma.codigoApp]]),
)
