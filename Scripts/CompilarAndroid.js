import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const carpetaAndroid = fileURLToPath(new URL('../src-capacitor/android/', import.meta.url))
const tareaGradle = process.argv[2]
const configuracionesPermitidas = {
  assembleDebug: '../src-capacitor/android/app/build/outputs/apk/debug/app-debug.apk',
  bundleRelease: '../src-capacitor/android/app/build/outputs/bundle/release/app-release.aab',
}

if (!configuracionesPermitidas[tareaGradle]) {
  console.error('Tarea Android inválida. Use assembleDebug o bundleRelease.')
  process.exit(1)
}

const ejecutableGradle = fileURLToPath(
  new URL(
    process.platform === 'win32'
      ? '../src-capacitor/android/gradlew.bat'
      : '../src-capacitor/android/gradlew',
    import.meta.url,
  ),
)
const rutaArtefacto = fileURLToPath(new URL(configuracionesPermitidas[tareaGradle], import.meta.url))

const resultado = spawnSync(ejecutableGradle, [tareaGradle], {
  cwd: carpetaAndroid,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (resultado.error) {
  throw resultado.error
}

if (resultado.status !== 0) {
  process.exit(resultado.status ?? 1)
}

if (!existsSync(rutaArtefacto)) {
  console.error(`No se encontró el artefacto Android esperado: ${rutaArtefacto}`)
  process.exit(1)
}

console.log(`Artefacto Android generado: ${rutaArtefacto}`)
