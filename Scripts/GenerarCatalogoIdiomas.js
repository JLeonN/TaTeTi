import { readFile, writeFile } from 'node:fs/promises'

const RUTA_CATALOGO = new URL('../src/i18n/IdiomasApp.json', import.meta.url)
const RUTA_GENERADA = new URL('../src/i18n/CatalogoIdiomas.js', import.meta.url)

const catalogo = JSON.parse(await readFile(RUTA_CATALOGO, 'utf8'))
const contenido = `// Archivo generado desde IdiomasApp.json. No editar manualmente.
export default ${JSON.stringify(catalogo, null, 2)}
`

await writeFile(RUTA_GENERADA, contenido, 'utf8')
console.log('Catálogo de idiomas generado.')
