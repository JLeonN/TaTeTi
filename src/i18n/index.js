import deDE from './DeDE/Index.js'
import enUS from './EnUS/Index.js'
import esAR from './EsAR/Index.js'
import frFR from './FrFR/Index.js'
import itIT from './ItIT/Index.js'
import jaJP from './JaJP/Index.js'
import koKR from './KoKR/Index.js'
import nbNO from './NbNO/Index.js'
import ptBR from './PtBR/Index.js'
import svSE from './SvSE/Index.js'
import mensajesEconomia from './MensajesEconomia.js'
import { idiomasHabilitados } from './ConfiguracionIdiomas'

const mensajesPorIdioma = {
  'es-AR': { ...esAR, ...mensajesEconomia['es-AR'] },
  'en-US': { ...enUS, ...mensajesEconomia['en-US'] },
  'pt-BR': { ...ptBR, ...mensajesEconomia['pt-BR'] },
  'fr-FR': { ...frFR, ...mensajesEconomia['fr-FR'] },
  'it-IT': { ...itIT, ...mensajesEconomia['it-IT'] },
  'de-DE': { ...deDE, ...mensajesEconomia['de-DE'] },
  'ja-JP': { ...jaJP, ...mensajesEconomia['ja-JP'] },
  'ko-KR': { ...koKR, ...mensajesEconomia['ko-KR'] },
  'sv-SE': { ...svSE, ...mensajesEconomia['sv-SE'] },
  'nb-NO': { ...nbNO, ...mensajesEconomia['nb-NO'] },
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
