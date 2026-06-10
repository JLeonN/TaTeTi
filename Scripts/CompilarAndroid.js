import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const carpetaAndroid = fileURLToPath(new URL('../src-capacitor/android/', import.meta.url))
const ejecutableGradle = fileURLToPath(
  new URL(
    process.platform === 'win32'
      ? '../src-capacitor/android/gradlew.bat'
      : '../src-capacitor/android/gradlew',
    import.meta.url,
  ),
)

const resultado = spawnSync(ejecutableGradle, ['assembleRelease'], {
  cwd: carpetaAndroid,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (resultado.error) {
  throw resultado.error
}

process.exit(resultado.status ?? 1)
