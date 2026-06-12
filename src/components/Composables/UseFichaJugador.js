import { computed, ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

const CLAVE_FICHA_USUARIO = 'ficha_usuario_ia'
const fichaUsuario = ref('X')

export function useFichaJugador() {
  const fichaIA = computed(() => (fichaUsuario.value === 'X' ? 'O' : 'X'))

  const cargarFichaUsuario = async () => {
    try {
      const resultado = await Preferences.get({ key: CLAVE_FICHA_USUARIO })
      if (resultado.value === 'X' || resultado.value === 'O') {
        fichaUsuario.value = resultado.value
      }
    } catch (error) {
      console.error('Error al cargar la ficha del usuario:', error)
      fichaUsuario.value = 'X'
    }
  }

  const guardarFichaUsuario = async (nuevaFicha) => {
    if (nuevaFicha !== 'X' && nuevaFicha !== 'O') return false

    try {
      await Preferences.set({
        key: CLAVE_FICHA_USUARIO,
        value: nuevaFicha,
      })
      fichaUsuario.value = nuevaFicha
      return true
    } catch (error) {
      console.error('Error al guardar la ficha del usuario:', error)
      return false
    }
  }

  return {
    fichaUsuario,
    fichaIA,
    cargarFichaUsuario,
    guardarFichaUsuario,
  }
}
