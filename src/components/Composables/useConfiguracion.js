import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

// Estado compartido global (singleton)
const nombreUsuario = ref('Jugador')
const cargandoNombre = ref(false)

// Clave para el storage
const CLAVE_NOMBRE = 'nombre_usuario'

export function useConfiguracion() {
  // Cargar nombre del storage
  const cargarNombre = async () => {
    try {
      cargandoNombre.value = true
      const { value } = await Preferences.get({ key: CLAVE_NOMBRE })

      if (value) {
        nombreUsuario.value = value
      }
    } catch (error) {
      console.error('Error al cargar nombre:', error)
    } finally {
      cargandoNombre.value = false
    }
  }

  // Guardar nombre en el storage
  const guardarNombre = async (nuevoNombre) => {
    try {
      if (!nuevoNombre || nuevoNombre.trim() === '') {
        return false
      }

      await Preferences.set({
        key: CLAVE_NOMBRE,
        value: nuevoNombre.trim(),
      })

      nombreUsuario.value = nuevoNombre.trim()
      return true
    } catch (error) {
      console.error('Error al guardar nombre:', error)
      return false
    }
  }

  return {
    nombreUsuario,
    cargandoNombre,
    cargarNombre,
    guardarNombre,
  }
}
