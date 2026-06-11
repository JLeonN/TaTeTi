$ErrorActionPreference = 'Stop'

$rutaRaiz = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$rutaAab = Join-Path $rutaRaiz 'src-capacitor\android\app\build\outputs\bundle\release\app-release.aab'
$rutaOrigenSimbolos = Join-Path $rutaRaiz 'src-capacitor\android\app\build\intermediates\merged_native_libs\release\mergeReleaseNativeLibs\out\lib'
$rutaZipSimbolos = Join-Path $rutaRaiz 'src-capacitor\android\app\build\outputs\native-debug-symbols\release\native-debug-symbols.zip'

if (-not (Test-Path -LiteralPath $rutaAab)) {
  Write-Error "Falta el AAB de producción: $rutaAab"
}

$archivoAab = Get-Item -LiteralPath $rutaAab
if ($archivoAab.Length -le 100) {
  Write-Error "El AAB parece vacío o inválido: $rutaAab"
}
Write-Output "AAB verificado: $rutaAab ($($archivoAab.Length) bytes)"

if (-not (Test-Path -LiteralPath $rutaOrigenSimbolos)) {
  Write-Output 'Símbolos no requeridos: la app no contiene librerías nativas .so.'
  exit 0
}

$archivosSo = @(Get-ChildItem -LiteralPath $rutaOrigenSimbolos -Recurse -File -Filter '*.so')
if ($archivosSo.Count -eq 0) {
  Write-Output 'Símbolos no requeridos: la app no contiene librerías nativas .so.'
  exit 0
}

if (-not (Test-Path -LiteralPath $rutaZipSimbolos)) {
  Write-Error "Falta el ZIP de símbolos nativos: $rutaZipSimbolos"
}

$archivoZip = Get-Item -LiteralPath $rutaZipSimbolos
if ($archivoZip.Length -le 100) {
  Write-Error "El ZIP de símbolos parece vacío o inválido: $rutaZipSimbolos"
}
Write-Output "Símbolos verificados: $rutaZipSimbolos ($($archivoZip.Length) bytes)"
