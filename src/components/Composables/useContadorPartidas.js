import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

const CLAVE_CONTADOR = 'contador_partidas_publicidad'
const PARTIDAS_PARA_INTERSTICIAL = 4

// Estado global (singleton)
const contadorPartidas = ref(0)

export function useContadorPartidas() {
  // ==========================================================================
  // CARGAR CONTADOR DESDE STORAGE
  // ==========================================================================
  const cargarContador = async () => {
    try {
      const resultado = await Preferences.get({ key: CLAVE_CONTADOR })

      if (resultado.value) {
        contadorPartidas.value = parseInt(resultado.value, 10)
        console.log('📊 Contador de partidas cargado:', contadorPartidas.value)
      } else {
        contadorPartidas.value = 0
        console.log('📊 Contador de partidas inicializado en 0')
      }
    } catch (error) {
      console.error('❌ Error al cargar contador de partidas:', error)
      contadorPartidas.value = 0
    }
  }

  // ==========================================================================
  // GUARDAR CONTADOR EN STORAGE
  // ==========================================================================
  const guardarContador = async () => {
    try {
      await Preferences.set({
        key: CLAVE_CONTADOR,
        value: contadorPartidas.value.toString(),
      })

      console.log('📊 Contador de partidas guardado:', contadorPartidas.value)
    } catch (error) {
      console.error('❌ Error al guardar contador de partidas:', error)
    }
  }

  // ==========================================================================
  // INCREMENTAR CONTADOR Y VERIFICAR SI MOSTRAR INTERSTICIAL
  // ==========================================================================
  const incrementarPartida = async () => {
    contadorPartidas.value++
    console.log(
      `🎮 Partida #${contadorPartidas.value} de ${PARTIDAS_PARA_INTERSTICIAL} para intersticial`,
    )

    // Verificar si llegó a 4 partidas
    if (contadorPartidas.value >= PARTIDAS_PARA_INTERSTICIAL) {
      contadorPartidas.value = 0 // Resetear contador
      await guardarContador()
      console.log('🎯 ¡Mostrar intersticial!')
      return true // Sí, mostrar intersticial
    }

    await guardarContador()
    return false // No, todavía no
  }

  // ==========================================================================
  // RESETEAR CONTADOR (opcional, por si lo necesitás en el futuro)
  // ==========================================================================
  const resetearContador = async () => {
    contadorPartidas.value = 0
    await guardarContador()
    console.log('🔄 Contador de partidas reseteado')
  }

  // ==========================================================================
  // OBTENER PARTIDAS RESTANTES
  // ==========================================================================
  const partidasRestantes = () => {
    return PARTIDAS_PARA_INTERSTICIAL - contadorPartidas.value
  }

  // ==========================================================================
  // RETORNO
  // ==========================================================================
  return {
    contadorPartidas,
    cargarContador,
    incrementarPartida,
    resetearContador,
    partidasRestantes,
  }
}
