# PLAN DE POSICIONAMIENTO EN GOOGLE PLAY

## Descripción del plan

Mejorar progresivamente la visibilidad de Ta-Te-Ti en Google Play mediante ASO, comenzando por cambios simples y avanzando hacia tareas que requieren diseño, medición o código. El plan está escrito para que Leo y CH puedan ejecutarlo juntos, una fase por vez, sin aplicar varios cambios simultáneos.

## Objetivo principal

- Aumentar las impresiones y visitas orgánicas de la ficha.
- Mantener o mejorar la conversión actual de la ficha.
- Comunicar con precisión las funciones reales de la aplicación.
- Medir cada cambio antes de continuar con el siguiente.

## Contexto verificado

- Aplicación publicada: `com.leotateti.tateti`.
- Nombre público actual en español: `Ta-Te-Ti: Vs IA Invencible`.
- Categoría pública actual: `Estrategia`.
- La aplicación tiene anuncios y funciona sin cuenta.
- La aplicación incluye juego contra NEXUS, tres dificultades, multijugador local, estadísticas, puntuación, tienda, inventario, regalo diario, símbolos y tableros personalizables.
- El proyecto admite diez idiomas definidos en `src/i18n/IdiomasApp.json`.
- La ficha localizada se mantiene en `PublicacionGooglePlay/FichaGooglePlay.json`.
- Hay ocho capturas localizadas de `1080x1920` para cada idioma en `F:\Programación\Ta-Te-Ti`.
- En los últimos 90 días se observaron 2.260 impresiones, 31 adquisiciones de dispositivos, 22 primeros accesos y 18 dispositivos activos mensuales.
- La conversión informada por Play Console es de aproximadamente 54%, pero las impresiones descendieron 27%.
- El problema principal observado es la baja visibilidad, no una conversión claramente deficiente.
- Los nombres de archivos nuevos deben usar PascalCase y los textos deben mantenerse en UTF-8.

## Protocolo para ejecutar fases en chats independientes

Cada fase de este plan debe poder ejecutarse en una conversación nueva sin depender del historial de otros chats.

- Al comenzar un chat nuevo, indicar la ruta del proyecto: `C:\Z-Programacion\Quasar\TaTeTi`.
- Pedir que se lea primero `AGENTS.md` completo y después este archivo completo.
- Indicar expresamente qué fase se quiere ejecutar y no avanzar a la siguiente.
- Revisar `Progreso del plan` y `Registro de decisiones y resultados` para conocer lo realizado en chats anteriores.
- Verificar el estado real de los archivos y de la ficha pública; no asumir que una casilla marcada sigue publicada sin comprobarlo.
- Actualizar en este mismo archivo las casillas, decisiones, métricas, fecha de última actualización y estado general.
- Si una acción debe realizarse manualmente en Play Console, proporcionar a Leo una sola instrucción por vez y esperar la captura del resultado.
- Mantener el archivo en estado `EN PROCESO` desde la primera acción ejecutada y usar `COMPLETADO` únicamente al finalizar todas las fases y el testing.

Texto mínimo recomendado para iniciar otro chat:

```text
Estamos trabajando en C:\Z-Programacion\Quasar\TaTeTi.
Lee primero AGENTS.md y después Planes/PlanPosicionamientoGooglePlay.md completos.
Ejecuta únicamente la FASE [NÚMERO Y NOMBRE], teniendo en cuenta su contexto, dependencias y el registro de resultados.
Actualiza el plan al terminar cada paso. No avances a la fase siguiente sin que Leo lo indique.
```

## Alcance

### Incluye

- Investigación breve de competidores directos.
- Optimización de título y descripciones.
- Revisión de categoría y etiquetas.
- Revisión y mejora de capturas localizadas.
- Publicación gradual y medición de resultados.
- Identificación de mejoras posteriores de crecimiento dentro de la aplicación.

### No incluye

- Cambiar el identificador Android `com.leotateti.tateti`.
- Modificar el nombre visible dentro del lanzador de Android salvo que se detecte una necesidad independiente.
- Comprar publicidad antes de mejorar y medir la ficha.
- Aplicar todos los cambios de la ficha al mismo tiempo.
- Implementar funcionalidades nuevas de código sin revisar antes su alcance técnico con Leo.

## Mapa de cambios

| Elemento | Acción | Propósito |
| --- | --- | --- |
| `PublicacionGooglePlay/FichaGooglePlay.json` | Modificar gradualmente | Mantener los textos localizados que se publicarán en Google Play |
| `F:\Programación\Ta-Te-Ti` | Usar como fuente, sin sobrescribir inicialmente | Revisar las ochenta capturas existentes y conservar los originales |
| Google Play Console > Presencia en Play Store > Fichas de Play Store | Modificar manualmente | Publicar títulos, descripciones y recursos gráficos aprobados |
| Google Play Console > Presencia en Play Store > Configuración de la tienda | Modificar manualmente | Ajustar categoría y etiquetas |
| Código de `src` y Android | Evaluar al final | Incorporar futuras funciones de reseñas, difusión o retención |

## FASE 1: Optimizar el título en español

### Objetivo

Publicar títulos localizados comprensibles, buscables y fieles a la aplicación, sin superar los 30 caracteres por idioma.

### Contexto autónomo para un chat nuevo

- Esta es la primera fase y no depende de otra fase terminada.
- La ficha pública usa actualmente `Ta-Te-Ti: Vs IA Invencible`, mientras `PublicacionGooglePlay/FichaGooglePlay.json` conserva `Ta-Te-Ti` para `es-419`.
- Las métricas verificadas muestran buena conversión aproximada y pocas impresiones, por lo que el título debe priorizar relevancia de búsqueda sin perder claridad.
- El chat debe investigar competidores actuales en Google Play antes de proponer títulos y debe usar fuentes públicas recientes.
- Entregable: títulos elegidos para los diez idiomas, JSON actualizado, publicación manual guiada y resultado anotado en este plan.

### Pasos de ejecución

- [x] Buscar en Google Play los términos `ta te ti`, `tres en raya` y `tic tac toe` usando la región e idioma español de Latinoamérica.
- [x] Comparar entre cinco y diez competidores directos.
  - Registrar título, cantidad visible de descargas, valoración y palabras repetidas.
  - No copiar nombres de marca, frases completas ni recursos gráficos.
- [x] Preparar entre tres y cinco títulos candidatos.
  - Incluir la búsqueda principal de manera natural.
  - Evitar afirmaciones absolutas como `la mejor`, `invencible` o `número uno`.
  - Comprobar el límite de 30 caracteres contando espacios y signos.
- [x] Elegir el título definitivo español con Leo.
- [x] Investigar el nombre habitual del juego en los otros nueve idiomas habilitados.
- [x] Preparar y validar títulos localizados de hasta 30 caracteres.
- [x] Actualizar los diez campos `nombre` en `PublicacionGooglePlay/FichaGooglePlay.json`.
- [x] Cargar los diez títulos localizados en Play Console y enviarlos juntos a revisión.
- [x] Mantener sin cambios las descripciones y las imágenes durante esta fase.
- [x] Confirmar que Google aprobó y publicó los diez títulos.
- [x] Registrar la fecha efectiva de publicación.

### Criterio de finalización

- Los diez títulos aprobados aparecen en sus fichas públicas y coinciden con el JSON del proyecto.

## FASE 2: Optimizar las descripciones cortas localizadas

### Objetivo

Explicar el beneficio principal y las funciones diferenciales en los diez idiomas habilitados, con un máximo de 80 caracteres por idioma.

### Contexto autónomo para un chat nuevo

- Requiere que la Fase 1 esté terminada y que el título definitivo figure en el registro de resultados.
- Debe leerse el título publicado para evitar repetirlo literalmente.
- La descripción corta actual es `Juega al Ta-Te-Ti contra NEXUS o con otra persona.`.
- Debe describir beneficios reales de la versión actual y usar el término principal validado durante la investigación de competidores.
- Entregable: diez descripciones cortas localizadas, JSON actualizado, publicación manual guiada y resultado anotado.

### Pasos de ejecución

- [x] Revisar las recomendaciones oficiales de Google Play y las fichas de competidores directos.
- [x] Redactar entre tres y cinco descripciones cortas españolas candidatas.
  - Mencionar de forma natural `tres en raya` o el término validado en la fase anterior.
  - Priorizar IA, dificultades, estadísticas o multijugador según lo observado en la competencia.
  - No repetir literalmente el título.
- [x] Elegir la variante española con Leo y comprobar el límite de 80 caracteres.
- [x] Adaptar el mensaje a los otros nueve idiomas usando la terminología existente de la aplicación.
- [x] Comprobar el límite de 80 caracteres en las diez variantes.
- [x] Actualizar los diez campos `descripcionCorta` en `PublicacionGooglePlay/FichaGooglePlay.json`.
- [x] Cargar y enviar a revisión las diez descripciones cortas en Play Console.
- [ ] Confirmar que Google aprobó y publicó las diez descripciones.
- [ ] Registrar la fecha del cambio.

### Criterio de finalización

- Las diez descripciones cortas aprobadas están publicadas y coinciden con el JSON del proyecto.

## FASE 3: Reescribir la descripción completa en español

### Objetivo

Crear una descripción atractiva y verificable que refleje el estado real de la aplicación.

### Contexto autónomo para un chat nuevo

- Requiere que las Fases 1 y 2 estén terminadas y registradas.
- La descripción pública antigua contiene afirmaciones como `miles de jugadores`, `la IA más poderosa` y `el mejor`, incompatibles con los datos públicos o difíciles de demostrar.
- La versión real incluye NEXUS, tres dificultades, multijugador local, estadísticas, puntuación, tienda, inventario, regalo diario, símbolos y tableros.
- El texto canónico que debe modificarse está en `idiomas.es-419.descripcionCompleta` de `PublicacionGooglePlay/FichaGooglePlay.json`.
- Entregable: descripción completa española aprobada, JSON actualizado, publicación manual guiada y resultado anotado.

### Pasos de ejecución

- [ ] Sustituir afirmaciones no demostrables como `miles de jugadores`, `la IA más poderosa` o `el mejor`.
- [ ] Redactar una introducción breve que explique el juego y su diferencia principal.
- [ ] Presentar las funciones reales en bloques fáciles de leer.
  - Juego contra NEXUS con tres dificultades.
  - Multijugador local en el mismo dispositivo.
  - Estadísticas, puntuación y rachas.
  - Símbolos y tableros personalizables.
  - Progreso local y ausencia de registro obligatorio.
- [ ] Usar sinónimos relevantes con naturalidad y sin listas artificiales de palabras clave.
- [ ] Elegir el texto definitivo con Leo.
- [ ] Actualizar `idiomas.es-419.descripcionCompleta` en `PublicacionGooglePlay/FichaGooglePlay.json`.
- [ ] Publicar la descripción completa española sin modificar todavía otros idiomas.

### Criterio de finalización

- La descripción pública explica correctamente la aplicación y no contiene promesas engañosas o desactualizadas.

## FASE 4: Revisar categoría y etiquetas

### Objetivo

Ayudar a Google Play a clasificar Ta-Te-Ti dentro del público correcto.

### Contexto autónomo para un chat nuevo

- Conviene ejecutar esta fase después de estabilizar los textos españoles.
- La ficha pública está clasificada actualmente como `Estrategia`; debe compararse con `Juegos de mesa` usando competidores actuales y las opciones reales disponibles en Play Console.
- Las etiquetas no están almacenadas en el repositorio y deberán revisarse mediante capturas de Play Console.
- Entregable: categoría y etiquetas elegidas, cambio manual guiado y decisión documentada.

### Pasos de ejecución

- [ ] Comparar la categoría actual `Estrategia` con la categoría `Juegos de mesa` y observar qué categoría usan los competidores directos.
- [ ] Elegir con Leo la categoría que mejor represente la experiencia principal.
- [ ] Ir a `Aumenta la cantidad de usuarios > Presencia en Play Store > Configuración de la tienda`.
- [ ] Revisar las etiquetas disponibles y seleccionar como máximo las cinco más directamente relacionadas.
- [ ] Guardar el cambio y registrar la fecha de publicación.

### Criterio de finalización

- La categoría y las etiquetas describen el juego sin intentar atraer búsquedas ajenas.

## FASE 5: Mejorar las capturas en español

### Objetivo

Mostrar las funciones principales mediante una secuencia visual clara y menos repetitiva.

### Contexto autónomo para un chat nuevo

- Requiere textos españoles estabilizados para que los mensajes visuales no contradigan la ficha.
- Los originales españoles están en `F:\Programación\Ta-Te-Ti\Ta-Te-Ti - Español` y son ocho imágenes de `1080x1920`.
- Las capturas actuales tienen un estilo colorido coherente, pero repiten el tablero y no muestran suficientemente estadísticas, tienda, inventario o personalización.
- No se deben sobrescribir los originales. Cualquier carpeta o archivo nuevo debe respetar PascalCase.
- Si se generan o editan imágenes mediante IA, debe utilizarse la skill `imagegen` y realizar revisión visual antes de entregar.
- Entregable: ocho capturas españolas aprobadas, orden final definido, publicación manual guiada y rutas anotadas.

### Pasos de ejecución

- [ ] Revisar las ocho capturas de `F:\Programación\Ta-Te-Ti\Ta-Te-Ti - Español`.
- [ ] Verificar qué pantallas quedaron desactualizadas respecto de la versión actual.
- [ ] Definir una secuencia de mensajes antes de editar imágenes.
  - Desafío contra NEXUS.
  - Tres niveles de dificultad.
  - Personalización de símbolos y tableros.
  - Estadísticas y progreso.
  - Multijugador local.
  - Rachas o partidas rápidas.
- [ ] Eliminar mensajes ambiguos o difíciles de sostener, como `Victoria asegurada`.
- [ ] Aumentar el tamaño visible de la interfaz y reducir la competencia visual del fondo cuando sea necesario.
- [ ] Conservar los archivos originales y crear una carpeta nueva con nombre PascalCase para las versiones revisadas.
- [ ] Revisar visualmente las ocho imágenes antes de subirlas.
- [ ] Publicar las capturas españolas en el orden aprobado.

### Criterio de finalización

- Las primeras tres capturas explican qué ofrece el juego sin necesidad de abrir la descripción.

## FASE 6: Localizar la ficha completa

### Objetivo

Aplicar la estrategia aprobada a los otros nueve idiomas sin realizar traducciones literales deficientes.

### Contexto autónomo para un chat nuevo

- Requiere que las Fases 1, 2, 3 y 5 estén terminadas en español.
- Los idiomas y códigos exactos se obtienen de `src/i18n/IdiomasApp.json` y no deben inventarse.
- Las traducciones canónicas se guardan en `PublicacionGooglePlay/FichaGooglePlay.json`.
- Hay ocho capturas por idioma dentro de `F:\Programación\Ta-Te-Ti`; se deben conservar los originales y revisar si reflejan la interfaz actual.
- La adaptación debe usar el nombre habitual del juego en cada mercado, no una traducción literal de `Ta-Te-Ti` cuando perjudique la búsqueda.
- Entregable: textos y capturas revisados para los diez idiomas, publicación guiada por idioma y resultados anotados.

### Pasos de ejecución

- [ ] Adaptar la descripción completa para `en-US`, `pt-BR`, `fr-FR`, `it-IT`, `de-DE`, `ja-JP`, `ko-KR`, `sv-SE` y `no-NO`; los títulos y las descripciones cortas se resuelven en las Fases 1 y 2.
- [ ] Usar en cada idioma el nombre local habitual del juego.
- [ ] Mantener `Ta-Te-Ti` y `NEXUS` como nombres propios cuando corresponda.
- [ ] Actualizar cada entrada de `PublicacionGooglePlay/FichaGooglePlay.json`.
- [ ] Revisar las ocho capturas existentes de cada carpeta localizada en `F:\Programación\Ta-Te-Ti`.
- [ ] Regenerar solamente las capturas cuyo texto o interfaz haya quedado desactualizado.
- [ ] Publicar una localización por vez y comprobar su vista previa.

### Criterio de finalización

- Los diez idiomas tienen textos y capturas coherentes con la aplicación actual.

## FASE 7: Medir resultados y realizar experimentos

### Objetivo

Determinar si los cambios aumentan la visibilidad o la conversión sin confundir sus efectos.

### Contexto autónomo para un chat nuevo

- Esta fase comienza desde el primer cambio publicado y continúa durante todo el plan.
- Línea base verificada de 90 días: 2.260 impresiones, 31 adquisiciones, 22 primeros accesos, 18 dispositivos activos mensuales y conversión aproximada de 54%.
- Línea base verificada de 28 días: 553 impresiones y 12 adquisiciones.
- El volumen actual es bajo; una variación porcentual grande puede representar pocos usuarios y no debe interpretarse automáticamente como mejora real.
- Las capturas de Play Console aportadas por Leo son la fuente para actualizar el registro.
- Entregable: tabla temporal de métricas, interpretación prudente y decisión de conservar, revertir o continuar cada cambio.

### Pasos de ejecución

- [ ] Registrar después de cada cambio las métricas de 28 y 90 días.
  - Impresiones de dispositivos.
  - Visitantes de la ficha.
  - Clics o adquisiciones.
  - Tasa de clics o conversión.
  - Primeros accesos y dispositivos activos.
- [ ] Comparar siempre períodos equivalentes y anotar si hubo una versión nueva o promoción externa.
- [ ] No declarar ganadora una variante cuando el volumen sea insuficiente.
- [ ] Cuando exista tráfico suficiente, configurar un experimento desde `Fichas de Play Store`.
- [ ] Probar un solo elemento por experimento: icono, primera captura, descripción corta o gráfico destacado.
- [ ] Aplicar una variante únicamente cuando el resultado sea concluyente y coherente con la calidad de los usuarios obtenidos.

### Criterio de finalización

- Existe un registro comparable que permite decidir qué cambios conservar.

## FASE 8: Evaluar mejoras dentro de la aplicación

### Objetivo

Definir funciones que puedan mejorar valoraciones, difusión y retención después de optimizar la ficha.

### Contexto autónomo para un chat nuevo

- No se debe implementar código directamente desde esta fase.
- El análisis previo no encontró integración de reseñas nativas, compartir resultados, analítica de adquisición ni Play Games Services.
- El proyecto usa Vue 3, Quasar 2 y Capacitor 7; cualquier propuesta debe respetar la arquitectura y convenciones existentes.
- Antes de implementar una mejora se debe investigar el código relacionado y crear un plan técnico independiente mediante `crear-plan-md`.
- Entregable: una sola mejora priorizada mediante datos y un plan técnico separado aprobado por Leo.

### Pasos de ejecución

- [ ] Revisar con Leo, de una en una, estas posibles mejoras:
  - Solicitud nativa de reseña después de una experiencia positiva.
  - Compartir una victoria o desafío mediante el menú del sistema.
  - Desafío diario y continuidad de rachas.
  - Logros y clasificaciones de Google Play Games.
- [ ] Priorizar usando datos de dispositivos activos, primeros accesos, reseñas y retención.
- [ ] Crear un plan técnico independiente antes de implementar cualquier mejora elegida.
- [ ] Evitar pedir reseñas después de derrotas, bloquear el juego o recompensar valoraciones.

### Criterio de finalización

- Leo seleccionó una mejora concreta y existe un plan técnico separado para implementarla.

## FASE 9: Promoción externa y contenido promocional

### Objetivo

Aumentar el tráfico solamente cuando la ficha y la experiencia estén preparadas para convertirlo y conservarlo.

### Contexto autónomo para un chat nuevo

- Requiere que la ficha esté actualizada y que exista una línea base posterior a los cambios orgánicos.
- No se debe invertir dinero sin poder identificar la fuente del tráfico y comparar adquisición con primer acceso y actividad.
- Play Console ofrece contenido promocional para juegos, pero cada evento debe corresponder a una actualización, desafío u ocasión real.
- Entregable: una campaña pequeña y medible, enlaces identificables, fechas y resultados registrados.

### Pasos de ejecución

- [ ] Preparar enlaces de campaña con parámetros UTM para identificar cada fuente.
- [ ] Crear piezas breves que muestren un desafío real contra NEXUS o una función diferencial.
- [ ] Evaluar contenido promocional de Google Play para actualizaciones relevantes.
- [ ] Probar campañas pagas pequeñas únicamente después de contar con una línea base de conversión.
- [ ] Comparar adquisición, primer acceso y actividad posterior, no solamente instalaciones.

### Criterio de finalización

- Cada promoción puede asociarse con una fuente y medirse frente a la línea base.

## FASE TESTING

### Objetivo

Validar que cada publicación sea correcta, medible y coherente con el proyecto.

### Contexto autónomo para un chat nuevo

- Esta fase se ejecuta parcialmente después de cada fase y se cierra al terminar el plan completo.
- Deben revisarse tanto los archivos locales como la ficha pública; guardar un cambio en Play Console no demuestra por sí solo que ya esté publicado.
- Los comandos deben ejecutarse desde `C:\Z-Programacion\Quasar\TaTeTi`.
- Entregable: todos los checks aplicables completados, ficha pública verificada y estado del plan actualizado.

### Pruebas automatizadas

- [ ] Ejecutar `npm run validar-idiomas` después de modificar `PublicacionGooglePlay/FichaGooglePlay.json`.
- [ ] Ejecutar `npm run lint` y `npm test` solamente cuando una fase futura modifique código de la aplicación.

### Pruebas manuales

- [ ] Comprobar que cada título tenga como máximo 30 caracteres.
- [ ] Comprobar que cada descripción corta tenga como máximo 80 caracteres.
- [ ] Verificar acentos, eñes y caracteres propios de cada idioma.
- [ ] Abrir la ficha pública con el idioma y país correspondientes después de cada publicación.
- [ ] Confirmar que las capturas respeten el orden aprobado y sean legibles en un teléfono.
- [ ] Comparar los textos públicos con `PublicacionGooglePlay/FichaGooglePlay.json`.
- [ ] Registrar fecha, elemento cambiado y métricas previas antes de iniciar la siguiente fase.

## Progreso del plan

- [x] Fase 1: Optimizar los títulos localizados
- [ ] Fase 2: Optimizar las descripciones cortas localizadas
- [ ] Fase 3: Reescribir la descripción completa en español
- [ ] Fase 4: Revisar categoría y etiquetas
- [ ] Fase 5: Mejorar las capturas en español
- [ ] Fase 6: Localizar la ficha completa
- [ ] Fase 7: Medir resultados y realizar experimentos
- [ ] Fase 8: Evaluar mejoras dentro de la aplicación
- [ ] Fase 9: Promoción externa y contenido promocional
- [ ] Fase Testing

## Registro de decisiones y resultados

Completar esta sección al finalizar cada sesión para que el siguiente chat pueda continuar sin información adicional.

### Fase 1: Título

- Estado: Completada
- Título anterior: `Ta-Te-Ti: Vs IA Invencible`
- Título español aprobado: `Ta-Te-Ti: Tres en raya con IA`
- Títulos localizados preparados:
  - `en-US`: `Ta-Te-Ti: Tic Tac Toe vs AI`
  - `pt-BR`: `Ta-Te-Ti: Jogo da Velha IA`
  - `fr-FR`: `Ta-Te-Ti : Morpion avec IA`
  - `it-IT`: `Ta-Te-Ti: Tris contro IA`
  - `de-DE`: `Ta-Te-Ti: Tic-Tac-Toe KI`
  - `ja-JP`: `Ta-Te-Ti：三目並べAI対戦`
  - `ko-KR`: `Ta-Te-Ti: AI 틱택토`
  - `sv-SE`: `Ta-Te-Ti: Tre i rad mot AI`
  - `no-NO`: `Ta-Te-Ti: Tre på rad mot KI`
- Fecha de envío a revisión: 23 de septiembre de 2026
- Fecha de publicación: 23 de septiembre de 2026
- Evidencia: Google Play Console confirmó el envío conjunto de 10 cambios de nombre, uno por cada idioma habilitado.
- Competidores revisados:
  - `Juego OX - Tres en Raya`: 5 M+ de descargas y valoración 4,8.
  - `Tres en raya - XO Online`: 10 M+ de descargas y valoración 4,6.
  - `Tres en Raya: Tic Tac Toe`: 10 M+ de descargas y valoración 4,6.
  - `Tres en Raya - juego de Gato`: 100 mil+ descargas y valoración 4,4.
  - `Mega Tres En Raya Online`: 1 M+ de descargas y valoración 4,6.
  - `Tateti — Juego del Gato`: 1 M+ de descargas y valoración 4,4.
  - `Tres en Raya — IA minimax`: 500+ descargas, sin valoración pública suficiente.
- Patrones observados: `Tres en raya` domina los títulos en español; `Tic Tac Toe`, `XO`, `Online`, `Juego del Gato` e `IA` se usan como modificadores.
- Candidatos preparados:
  - `Ta-Te-Ti: Tres en raya con IA` — 29 caracteres.
  - `Ta-Te-Ti: Tres en raya` — 22 caracteres.
  - `Tres en raya: Ta-Te-Ti con IA` — 29 caracteres.
  - `Ta-Te-Ti: IA y dos jugadores` — 28 caracteres.
  - `Ta-Te-Ti: Desafía a NEXUS` — 25 caracteres.
- Recomendación de CH: `Ta-Te-Ti: Tres en raya con IA`, porque conserva la identidad regional, incorpora la búsqueda dominante y comunica el diferencial principal sin una promesa absoluta.

### Fase 2: Descripción corta

- Estado: En revisión de Google Play
- Texto público español anterior: `Tres en raya vs IA imposible de vencer. ¿Podrás ganarle a NEXUS? ¡Desafío!`
- Texto español aprobado: `Juega contra NEXUS en 3 dificultades, con multijugador local y estadísticas.`
- Descripciones localizadas: guardadas y validadas en `PublicacionGooglePlay/FichaGooglePlay.json`.
- Fecha de envío a revisión: 23 de septiembre de 2026
- Fecha de publicación: Pendiente de aprobación
- Observaciones: Las diez variantes respetan el máximo de 80 caracteres, describen funciones verificadas en el código y evitan afirmaciones absolutas como `imposible de vencer`.

### Fase 3: Descripción completa

- Estado: Pendiente
- Fecha de publicación: Pendiente
- Resumen de cambios: Pendiente
- Observaciones: Pendiente

### Fase 4: Categoría y etiquetas

- Estado: Pendiente
- Categoría anterior: `Estrategia`
- Categoría aprobada: Pendiente
- Etiquetas aprobadas: Pendiente
- Fecha de publicación: Pendiente

### Fase 5: Capturas en español

- Estado: Pendiente
- Carpeta de originales: `F:\Programación\Ta-Te-Ti\Ta-Te-Ti - Español`
- Carpeta de capturas revisadas: Pendiente
- Orden publicado: Pendiente
- Fecha de publicación: Pendiente

### Fase 6: Localización

- Estado: Pendiente
- Idiomas terminados: Ninguno
- Idiomas pendientes: `es-419`, `en-US`, `pt-BR`, `fr-FR`, `it-IT`, `de-DE`, `ja-JP`, `ko-KR`, `sv-SE`, `no-NO`
- Observaciones: Pendiente

### Fase 7: Métricas y experimentos

- Estado: En seguimiento
- Línea base de 90 días: 2.260 impresiones; 31 adquisiciones; 22 primeros accesos; 18 dispositivos activos mensuales; conversión aproximada de 54%
- Línea base de 28 días: 553 impresiones; 12 adquisiciones
- Última medición posterior a cambios: Pendiente
- Experimentos realizados: Ninguno

### Fase 8: Mejora dentro de la aplicación

- Estado: Pendiente
- Mejora elegida: Pendiente
- Plan técnico relacionado: Pendiente

### Fase 9: Promoción

- Estado: Pendiente
- Campaña o contenido: Pendiente
- Fuente identificable: Pendiente
- Resultado: Pendiente

### Testing

- Estado: Pendiente
- Última validación local: Pendiente
- Última comprobación pública: Pendiente

Fecha de creación: 23 de septiembre de 2026
Fecha de última actualización: 23 de septiembre de 2026
Estado: EN PROCESO
