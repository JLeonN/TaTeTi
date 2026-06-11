================================================================================
SISTEMA DE CONFIGURACIÓN - TA-TE-TI
================================================================================

DESCRIPCIÓN
--------------------------------------------------------------------------------
Sistema de configuración que permite al usuario personalizar su nombre y 
seleccionar el idioma de la aplicación (Español/Inglés).
Los datos se guardan en almacenamiento nativo de Capacitor y persisten entre 
sesiones.

TECNOLOGÍAS UTILIZADAS
--------------------------------------------------------------------------------
- Capacitor Preferences (almacenamiento nativo)
- Vue I18n (internacionalización)
- Composables singleton para estado compartido
- Tabler Icons para iconografía
- Quasar Notify para notificaciones

ARCHIVOS PRINCIPALES
--------------------------------------------------------------------------------

1. src/components/Composables/useConfiguracion.js
   - Composable singleton para el nombre del usuario
   - Funciones: cargarNombre(), guardarNombre()
   - Estado compartido globalmente
   - Clave Capacitor: 'nombre_usuario'

2. src/components/Composables/useIdioma.js
   - Composable singleton para el idioma de la aplicación
   - Funciones: cargarIdioma(), guardarIdioma()
   - Detecta idioma del sistema automáticamente
   - Cambia el idioma de toda la app en tiempo real
   - Clave Capacitor: 'idioma_usuario'

3. src/components/configuración/ConfiguracionUsuario.vue
   - Muestra nombre actual del usuario
   - Botón para abrir modal de cambio de nombre
   - Input con validación y contador de caracteres
   - Notificaciones de éxito/error al guardar

4. src/components/configuración/ConfiguracionIdioma.vue
   - Muestra idioma actual (Español/English)
   - Botón para abrir modal de cambio de idioma
   - Selector con dos opciones: es-AR y en-US
   - Notificaciones de éxito/error al guardar

5. src/pages/ConfiguracionPage.vue
   - Página contenedora de configuraciones
   - Estructura modular para agregar más secciones
   - Título traducido dinámicamente

6. src/boot/i18n.js
   - Configuración de Vue I18n
   - Detección automática del idioma del navegador
   - Fallback a inglés si no hay traducción

7. src/i18n/es-AR/index.js y src/i18n/en-US/index.js
   - Traducciones organizadas por secciones
   - Secciones: general, configuracion, menu, juego
   - Fácil de expandir con más idiomas

8. src/layouts/MainLayout.vue (modificado)
   - Muestra nombre del usuario en el header
   - Carga nombre e idioma al iniciar
   - Menú lateral completamente traducido

9. src/router/routes.js (modificado)
   - Ruta '/configuracion' agregada

FLUJO DE FUNCIONAMIENTO - NOMBRE
--------------------------------------------------------------------------------

1. Al iniciar, MainLayout carga el nombre guardado
2. Usuario navega a Configuración
3. Usuario presiona "Cambiar Nombre"
4. Modal se abre con input prellenado
5. Usuario ingresa nuevo nombre y presiona "Guardar"
6. Se valida que no esté vacío
7. Se guarda en Capacitor Preferences
8. Se actualiza el estado reactivo (singleton)
9. El header se actualiza automáticamente
10. Notificación de éxito aparece

FLUJO DE FUNCIONAMIENTO - IDIOMA
--------------------------------------------------------------------------------

1. Al iniciar, se detecta idioma del sistema automáticamente
2. Si hay idioma guardado, se usa ese en vez del detectado
3. Usuario navega a Configuración
4. Usuario presiona "Cambiar Idioma"
5. Modal muestra dos opciones: Español e Inglés
6. Usuario selecciona un idioma y presiona "Guardar"
7. Se guarda en Capacitor Preferences
8. Se actualiza el idioma de Vue I18n (locale)
9. Toda la app cambia de idioma instantáneamente
10. Notificación de éxito aparece (traducida)

PATRÓN SINGLETON
--------------------------------------------------------------------------------
Los composables useConfiguracion y useIdioma usan refs declarados fuera de 
la función para compartir el mismo estado entre todos los componentes.
Esto permite actualización reactiva automática sin eventos o store.

ALMACENAMIENTO
--------------------------------------------------------------------------------
- Plugin: @capacitor/preferences
- Claves:
  * 'nombre_usuario': Nombre del jugador
  * 'idioma_usuario': Código de idioma (es-AR o en-US)
- Valores por defecto:
  * Nombre: 'Jugador'
  * Idioma: Detectado del sistema (español si es 'es-*', sino inglés)

VALIDACIONES
--------------------------------------------------------------------------------
- Nombre: No puede estar vacío, se hace trim(), máximo 20 caracteres
- Idioma: Debe seleccionar una opción (es-AR o en-US)

ICONOGRAFÍA (TABLER ICONS)
--------------------------------------------------------------------------------
- ti-settings: Configuración
- ti-user: Usuario
- ti-user-edit: Editar usuario
- ti-edit: Editar
- ti-language: Idioma
- ti-world: Cambiar idioma
- ti-flag: Banderas de idiomas
- ti-check: Éxito (en notificaciones)

NOTIFICACIONES PERSONALIZADAS
--------------------------------------------------------------------------------
- Estilos con gradientes según tipo (éxito, error, advertencia, info)
- Bordes redondeados y sombras de neón
- Animación de entrada desde arriba
- Colores:
  * Éxito: Verde (#00d9a3)
  * Error: Rojo (#ff4757)
  * Advertencia: Amarillo (#ffbe0b)
  * Info: Azul (#1e90ff)

AGREGAR MÁS IDIOMAS
--------------------------------------------------------------------------------
1. Crear carpeta en src/i18n/ (ej: fr-FR para francés)
2. Copiar estructura de es-AR/index.js y traducir
3. Exportar en src/i18n/index.js
4. Agregar botón en ConfiguracionIdioma.vue
5. Actualizar computed nombreIdiomaActual

MEJORAS FUTURAS POSIBLES
--------------------------------------------------------------------------------
- Avatar personalizado del usuario
- Más opciones de configuración (tema, sonidos, etc.)
- Estadísticas del jugador
- Historial de partidas
- Más idiomas (francés, italiano, portugués, etc.)

================================================================================
FIN DEL RESUMEN
================================================================================
