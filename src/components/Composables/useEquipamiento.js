import { watch } from 'vue'
import { obtenerArticulo } from 'src/Servicios/Economia/CatalogoTienda'
import { inicializarEconomia, usarEconomia } from 'src/Servicios/Economia/ServicioEconomia'

let observadorRegistrado = false

const aplicarVariables = (equipamiento) => {
  if (typeof document === 'undefined') return
  const raiz = document.documentElement
  for (const ficha of ['X', 'O']) {
    const articulo = obtenerArticulo(equipamiento[ficha])
    if (!articulo) continue
    const sufijo = ficha.toLowerCase()
    const variableColor = `var(${articulo.variable})`
    const esFluor = articulo.id.endsWith('Fluor')
    const sombraFluor =
      articulo.id === 'blancoFluor'
        ? '0 0 6px #8beeff, 0 0 14px #8beeff, 0 0 24px #8beeff'
        : `0 0 5px ${variableColor}, 0 0 12px ${variableColor}, 0 0 22px ${variableColor}`
    const brilloLinea = articulo.id === 'blancoFluor' ? '0 0 22px #8beeff' : `0 0 22px ${variableColor}`
    const sombraBase = '0 2px 3px rgba(0, 0, 0, 0.35)'
    raiz.style.setProperty(`--color-ficha-${sufijo}`, `var(${articulo.variable})`)
    raiz.style.setProperty(`--neon-${sufijo}`, `var(${articulo.variable})`)
    raiz.style.setProperty(
      `--sombra-ficha-${sufijo}`,
      esFluor ? `${sombraFluor}, ${sombraBase}` : sombraBase,
    )
    raiz.style.setProperty(
      `--brillo-neon-${sufijo}`,
      esFluor ? brilloLinea : `0 0 14px ${variableColor}`,
    )
  }
}

export function useEquipamiento() {
  const { equipamiento, articulosAdquiridos, equiparArticulo } = usarEconomia()

  const cargarEquipamiento = async () => {
    await inicializarEconomia()
    aplicarVariables(equipamiento.value)
    if (!observadorRegistrado) {
      observadorRegistrado = true
      watch(equipamiento, aplicarVariables, { deep: true })
    }
  }

  return {
    equipamiento,
    articulosAdquiridos,
    cargarEquipamiento,
    equiparArticulo,
  }
}
