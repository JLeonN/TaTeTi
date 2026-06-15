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
    raiz.style.setProperty(`--color-ficha-${sufijo}`, `var(${articulo.variable})`)
    raiz.style.setProperty(`--neon-${sufijo}`, `var(${articulo.variable})`)
    raiz.style.setProperty(
      `--brillo-neon-${sufijo}`,
      `0 0 10px var(${articulo.variable}), 0 0 20px var(${articulo.variable}), 0 0 30px var(${articulo.variable})`,
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

