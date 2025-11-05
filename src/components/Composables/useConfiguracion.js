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
      const resultado = await Preferences.get({ key: CLAVE_NOMBRE })

      console.log('📱 CAPACITOR - Resultado completo:', resultado)
      console.log('📱 CAPACITOR - Value:', resultado.value)
      console.log('📱 CAPACITOR - Tipo:', typeof resultado.value)

      if (resultado.value) {
        nombreUsuario.value = resultado.value
        console.log('✅ Nombre cargado:', nombreUsuario.value)
      } else {
        console.log('⚠️ No hay nombre guardado, usando default')
      }
    } catch (error) {
      console.error('❌ Error al cargar nombre:', error)
    } finally {
      cargandoNombre.value = false
    }
  }

  // Guardar nombre en el storage
  const guardarNombre = async (nuevoNombre) => {
    try {
      if (!nuevoNombre || nuevoNombre.trim() === '') {
        console.log('⚠️ Nombre vacío, no se guarda')
        return false
      }

      const nombreFinal = nuevoNombre.trim()

      console.log('💾 Intentando guardar:', nombreFinal)
      console.log('💾 Clave:', CLAVE_NOMBRE)

      await Preferences.set({
        key: CLAVE_NOMBRE,
        value: nombreFinal,
      })

      // Verificar que se guardó
      const verificacion = await Preferences.get({ key: CLAVE_NOMBRE })
      console.log('✅ Verificación guardado:', verificacion.value)

      nombreUsuario.value = nombreFinal
      return true
    } catch (error) {
      console.error('❌ Error al guardar nombre:', error)
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
