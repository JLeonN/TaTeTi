<template>
  <div class="selector-dificultad">
    <div class="etiqueta-selector">Dificultad:</div>
    <div class="botones-dificultad">
      <button
        class="boton-dificultad"
        :class="{ activo: dificultadSeleccionada === 'facil' }"
        @click="seleccionarDificultad('facil')"
      >
        <i class="ti ti-mood-smile icono-sm"></i>
        <span>Fácil</span>
      </button>

      <button
        class="boton-dificultad"
        :class="{ activo: dificultadSeleccionada === 'normal' }"
        @click="seleccionarDificultad('normal')"
      >
        <i class="ti ti-brain icono-sm"></i>
        <span>Normal</span>
      </button>

      <button
        class="boton-dificultad"
        :class="{ activo: dificultadSeleccionada === 'dificil' }"
        @click="seleccionarDificultad('dificil')"
      >
        <i class="ti ti-flame icono-sm"></i>
        <span>Difícil</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Preferences } from '@capacitor/preferences'

const CLAVE_DIFICULTAD = 'dificultad_ia'

const dificultadSeleccionada = ref('normal')

const emit = defineEmits(['cambio-dificultad'])

onMounted(async () => {
  await cargarDificultad()
})

const cargarDificultad = async () => {
  try {
    const resultado = await Preferences.get({ key: CLAVE_DIFICULTAD })
    if (resultado.value) {
      dificultadSeleccionada.value = resultado.value
      emit('cambio-dificultad', resultado.value)
    }
  } catch (error) {
    console.error('❌ Error al cargar dificultad:', error)
  }
}

const seleccionarDificultad = async (dificultad) => {
  dificultadSeleccionada.value = dificultad

  try {
    await Preferences.set({
      key: CLAVE_DIFICULTAD,
      value: dificultad,
    })
    emit('cambio-dificultad', dificultad)
  } catch (error) {
    console.error('❌ Error al guardar dificultad:', error)
  }
}
</script>

<style scoped>
.selector-dificultad {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: var(--color-fondo-alterno);
  border-radius: 12px;
  margin-bottom: 20px;
}
.etiqueta-selector {
  font-size: 1rem;
  color: var(--color-texto-secundario);
  font-weight: 600;
  text-align: center;
}
.botones-dificultad {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.boton-dificultad {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-texto-secundario);
  background-color: var(--color-tablero);
  border: 2px solid var(--color-borde-tablero);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.boton-dificultad:hover {
  background-color: var(--color-fondo-alterno);
  border-color: var(--color-turno-activo);
  transform: translateY(-2px);
}
.boton-dificultad.activo {
  color: var(--color-texto-principal);
  background: linear-gradient(135deg, var(--color-boton) 0%, var(--color-turno-activo) 100%);
  border-color: var(--color-turno-activo);
  box-shadow: 0 4px 12px var(--sombra-boton);
}
@media (max-width: 600px) {
  .botones-dificultad {
    flex-direction: column;
    width: 100%;
  }
  .boton-dificultad {
    width: 100%;
    justify-content: center;
  }
}
</style>
