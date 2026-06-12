# Resumen de configuración

> Vigencia: 12 de junio de 2026.

## Alcance

La página `/configuracion` permite cambiar el nombre y el idioma. Ambos valores usan composables singleton y Capacitor Preferences, por lo que se actualizan de forma reactiva y persisten entre sesiones.

## Archivos

- `src/pages/ConfiguracionPage.vue`: contenedor y enfoque solicitado desde el header.
- `src/components/configuración/ConfiguracionUsuario.vue`: edición del nombre.
- `src/components/configuración/ConfiguracionIdioma.vue`: selección de idioma.
- `src/components/Composables/useConfiguracion.js`: estado global del nombre.
- `src/components/Composables/useIdioma.js`: estado global del idioma.
- `src/layouts/MainLayout.vue`: carga inicial y navegación desde el chip del usuario.
- `src/i18n/es-AR/index.js` y `src/i18n/en-US/index.js`: textos visibles.

## Nombre

- Clave: `nombre_usuario`.
- Valor predeterminado: `Jugador`.
- Se aplica `trim`, no se acepta vacío y el máximo es 20 caracteres.
- Al guardar, el header y el modo contra IA se actualizan sin recargar.
- Los lugares con ancho limitado usan una línea y puntos suspensivos.

## Acceso desde el header

- El chip del usuario es un botón accesible.
- Al pulsarlo navega a `/configuracion?enfocar=usuario&solicitud=...`.
- La marca `solicitud` permite repetir la acción aun estando ya en Configuración.
- `ConfiguracionPage.vue` llama a la función expuesta `enfocarSeccion()`.
- `ConfiguracionUsuario.vue` hace scroll hasta la sección y recorre su borde aproximadamente tres veces durante 2,6 segundos.
- La animación no bloquea la edición y respeta `prefers-reduced-motion`.

## Idioma

- Clave: `idioma_usuario`.
- Idiomas disponibles: `es-AR` y `en-US`.
- Si no existe una preferencia, se detecta el idioma del sistema y se aplica el fallback configurado.
- El cambio es inmediato y afecta páginas, drawer, juego, modales, notificaciones y actualización remota.
- Todo texto nuevo visible debe agregarse en ambos idiomas.

## Preferencias relacionadas

Aunque no aparecen como secciones de esta página, también se guardan con Preferences:

- `dificultad_ia`
- `ficha_usuario_ia`
- `puntuacion_sistema`
- `contador_partidas_publicidad`

No mezclar esas responsabilidades dentro de `useConfiguracion.js`.

## Reglas para ampliar

- Crear cada ajuste nuevo como componente independiente dentro de `src/components/configuración/`.
- Mantener `ConfiguracionPage.vue` como coordinador liviano.
- Reutilizar `ModalConfirmacion.vue` cuando el flujo encaje.
- Usar variables de `src/css/Variables.css`.
- Comprobar el teclado Android: campos, botones y notificaciones deben permanecer visibles.
- Mantener nombres, funciones y comentarios en español.
