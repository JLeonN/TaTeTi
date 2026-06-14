# Resumen de configuración

> Vigencia: 14 de junio de 2026.

## Alcance

La página `/configuracion` permite cambiar el nombre y el idioma. Ambos valores usan composables singleton y Capacitor Preferences, por lo que se actualizan de forma reactiva y persisten entre sesiones.

## Archivos

- `src/pages/ConfiguracionPage.vue`: contenedor y enfoque solicitado desde el header.
- `src/components/configuración/ConfiguracionUsuario.vue`: edición del nombre.
- `src/components/configuración/ConfiguracionIdioma.vue`: selección de idioma.
- `src/components/Composables/useConfiguracion.js`: estado global del nombre.
- `src/components/Composables/useIdioma.js`: estado global del idioma.
- `src/layouts/MainLayout.vue`: carga inicial y navegación desde el chip del usuario.
- `src/i18n/IdiomasApp.json`: catálogo central de idiomas habilitados.
- `src/i18n/ConfiguracionIdiomas.js`: normalización, detección y fallback.
- `src/i18n/EsAR/`, `EnUS/`, `PtBR/`, `FrFR/`, `ItIT/`, `DeDE/`, `JaJP/` y `KoKR/`: textos visibles.

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
- Idiomas disponibles: `es-AR`, `en-US`, `pt-BR`, `fr-FR`, `it-IT`, `de-DE`, `ja-JP` y `ko-KR`.
- Si no existe una preferencia, se revisan los idiomas del sistema en orden, se normalizan códigos completos, alias y códigos base, y se aplica `es-AR` si ninguno está soportado.
- `en-US` es el fallback técnico para claves de traducción faltantes.
- El cambio es inmediato y afecta páginas, drawer, juego, modales, notificaciones y actualización remota.
- La selección persiste después de cerrar completamente y volver a abrir la aplicación.
- El modal renderiza el catálogo de forma dinámica, mantiene `Cancelar` y `Guardar` visibles y desplaza únicamente la lista.
- El selector usa un grupo de radios accesible; flechas, Inicio y Fin cambian la selección manteniendo un único elemento en el orden de foco.
- Todo texto nuevo visible debe agregarse con la misma estructura de claves en los ocho idiomas.

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
- Activar `contenidoDesplazable` cuando un modal necesite cabecera y acciones fijas con contenido central desplazable.
- Usar variables de `src/css/Variables.css`.
- Comprobar el teclado Android: campos, botones y notificaciones deben permanecer visibles.
- Mantener nombres, funciones y comentarios en español.
