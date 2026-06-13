# PLAN DE ESTADÍSTICAS DE PARTIDAS

## Descripción del plan

Crear una página de estadísticas completa para las partidas contra la IA. La app comenzará a registrar todas las partidas y sus turnos en una base de datos SQLite local, sin un límite artificial de historial, para mostrar resultados, tiempos, puntuación, rachas, escudo, fichas, dificultades y gráficas.

Las estadísticas comenzarán a ser exactas desde la instalación de esta versión. Solo se reconstruirán datos anteriores cuando exista una fuente confiable; no se inventarán resultados históricos que la app no guardaba.

## Objetivo principal

- Registrar de forma permanente todas las partidas contra la IA y sus turnos
- Mostrar estadísticas generales y comparativas por dificultad, ficha, resultado y período
- Medir duración de partidas y tiempos de los turnos del usuario
- Analizar puntuación, rachas positivas, rachas negativas y uso del escudo
- Incorporar gráficas claras y adaptadas a dispositivos móviles
- Preparar una estructura de datos ampliable para futuras estadísticas

## Reglas del plan

- Usar español en archivos, variables, funciones, comentarios y textos visibles
- Crear archivos y carpetas nuevos en PascalCase, sin guiones ni guiones bajos
- Guardar los archivos de texto en UTF-8 y conservar correctamente acentos y eñes
- Registrar únicamente partidas contra la IA en esta primera versión
- No incluir logros; deberán desarrollarse mediante otro plan
- No agregar botones ni flujos para borrar, reiniciar o limpiar estadísticas
- No establecer un límite artificial para la cantidad de partidas guardadas
- No contar los abandonos como derrotas
- No considerar abandono si el tablero todavía está vacío
- Considerar racha negativa al episodio que alcanza dos derrotas consecutivas
- Medir el tiempo real del usuario sin incluir la espera artificial configurada para la IA
- Pausar las mediciones cuando la app quede en segundo plano
- Usar los colores existentes en `src/css/Variables.css`
- Mantener el CSS compacto y sin líneas vacías entre reglas
- Verificar compatibilidad con Android y definir una estrategia compatible con el modo web de desarrollo

## FASE 1: Diseñar el modelo de estadísticas

### Objetivo

Definir qué información se guardará y cómo se calcularán las estadísticas sin depender de datos derivados difíciles de corregir.

- [x] Documentar el contrato de una partida contra la IA
- [x] Definir identificadores, fechas y versión del esquema de datos
- [x] Definir los estados posibles de una partida: victoria, derrota, empate y abandono
- [x] Definir el motivo de abandono: reinicio, cambio de dificultad o salida de la pantalla
- [x] Definir los datos de partida: dificultad, ficha del usuario, ficha de la IA, resultado, fechas, duración, movimientos, puntos iniciales, variación de puntos y puntos finales
- [x] Definir los datos de cada turno: número de turno, participante, ficha, posición, hora de inicio, hora de finalización y duración
- [x] Definir cómo registrar interrupciones por segundo plano sin sumar ese tiempo
- [x] Definir cómo identificar líneas ganadoras: fila, columna o diagonal
- [x] Definir cómo detectar victorias y derrotas con el mínimo de movimientos
- [x] Definir cómo detectar situaciones donde el usuario o la IA estuvieron a una jugada de ganar
- [x] Definir cómo registrar la activación, uso y desactivación del escudo
- [x] Definir cómo contabilizar rachas positivas y episodios de racha negativa
- [x] Definir acumulados de respaldo para estadísticas globales que deban conservarse de forma eficiente
- [x] Definir la fecha inicial de recopilación para comunicar que no existen datos completos anteriores

## FASE 2: Integrar SQLite

### Objetivo

Agregar una base de datos local preparada para guardar un historial completo y evolucionar mediante migraciones.

- [x] Evaluar y seleccionar un plugin SQLite compatible con la versión actual de Capacitor y Android
- [x] Instalar la dependencia seleccionada y configurar el proyecto Capacitor
- [x] Definir el comportamiento para navegador durante `quasar dev`
- [x] Crear un servicio central de base de datos con una única responsabilidad de conexión e inicialización
- [x] Crear la tabla de partidas con índices para fecha, dificultad, ficha y resultado
- [x] Crear la tabla de turnos relacionada con la partida
- [x] Crear la tabla de metadatos y versión del esquema
- [x] Crear la primera migración de base de datos
- [x] Ejecutar las migraciones de forma transaccional e idempotente
- [x] Manejar errores de apertura, escritura y migración sin romper el inicio de la app
- [x] Evitar consultas SQL dispersas en páginas y componentes visuales
- [x] Validar que los registros soporten historiales grandes sin depender de cargar todas las filas en memoria

## FASE 3: Crear el servicio de registro de partidas

### Objetivo

Centralizar el ciclo de vida de cada partida para asegurar que se registre una sola vez y con datos coherentes.

- [x] Crear un servicio o composable de estadísticas con nombres descriptivos en español
- [x] Iniciar una sesión de partida cuando se realiza la primera jugada válida
- [x] Registrar el puntaje, dificultad y ficha vigentes al comenzar la partida
- [x] Registrar cada turno del usuario y de la IA en orden
- [x] Medir por separado el tiempo de decisión del usuario y la ejecución de la IA
- [x] Pausar y reanudar el cronómetro mediante eventos del ciclo de vida de Capacitor
- [x] Finalizar la partida una sola vez al producirse victoria, derrota o empate
- [x] Registrar como abandono un reinicio con tablero no vacío
- [x] Registrar como abandono un cambio de dificultad con tablero no vacío
- [x] Registrar como abandono la salida de la página con tablero no vacío
- [x] Evitar registrar abandono después de una partida ya finalizada
- [x] Evitar registros duplicados causados por watchers o eventos repetidos
- [x] Guardar la partida y sus turnos mediante una transacción
- [x] Mantener la partida pendiente en memoria hasta confirmar su persistencia
- [x] Definir una recuperación segura si la app se cierra durante una partida

## FASE 4: Integrar puntuación, rachas y escudo

### Objetivo

Relacionar el resultado de cada partida con el sistema de puntuación existente y conservar datos suficientes para analizar su evolución.

- [x] Revisar `usePuntuacion.js` y separar el cálculo de puntuación del almacenamiento cuando sea necesario
- [x] Registrar puntos antes y después de cada partida
- [x] Registrar puntos ganados, puntos perdidos y balance neto
- [x] Registrar el máximo histórico de puntos alcanzado desde el inicio de las estadísticas
- [x] Registrar la racha positiva antes y después de cada resultado
- [x] Registrar la racha positiva más larga general y por dificultad
- [x] Contar derrotas consecutivas desde la primera derrota
- [x] Contar como racha negativa cada episodio que alcance dos derrotas consecutivas
- [x] Registrar cantidad de rachas negativas y peor racha negativa
- [x] Registrar recuperaciones mediante una victoria posterior a una racha negativa
- [x] Registrar cada activación del escudo
- [x] Registrar cuántas derrotas fueron protegidas por el escudo
- [x] Registrar cuántas partidas se necesitaron para desactivar el escudo
- [x] Calcular tiempo promedio y máximo necesario para salir del escudo
- [x] Conservar compatibilidad con la puntuación y rachas actuales almacenadas en Preferences
- [x] Reconstruir únicamente los valores anteriores que puedan obtenerse de forma confiable

## FASE 5: Crear consultas y cálculos estadísticos

### Objetivo

Preparar consultas eficientes que alimenten la página sin cargar el historial completo en memoria.

- [x] Crear consultas generales de partidas, victorias, derrotas, empates y abandonos
- [x] Calcular porcentajes de resultados sobre partidas finalizadas
- [x] Calcular resultados por dificultad
- [x] Detectar dificultad más jugada y dificultad con mejor rendimiento
- [x] Calcular resultados usando X y usando O
- [x] Comparar rendimiento por ficha sin confundir ficha con orden de inicio
- [x] Calcular duración promedio, mínima y máxima de partidas
- [x] Calcular duración promedio de partidas por dificultad y resultado
- [x] Calcular turno promedio, más corto y más largo del usuario
- [x] Calcular tiempos de turno por dificultad y resultado
- [x] Excluir pausas y tiempo artificial de la IA de las métricas del usuario
- [x] Calcular promedio, mínimo y máximo de movimientos por resultado
- [x] Detectar victorias logradas con el mínimo de movimientos
- [x] Detectar derrotas sufridas con el mínimo de movimientos
- [x] Calcular victoria y derrota más rápidas
- [x] Calcular partidas donde el usuario estuvo a una jugada de ganar
- [x] Calcular recuperaciones cuando la IA estuvo a una jugada de ganar
- [x] Calcular posiciones iniciales y casillas más utilizadas
- [x] Calcular líneas ganadoras más frecuentes
- [x] Calcular evolución histórica del puntaje
- [x] Calcular puntos ganados, perdidos y balance neto por período
- [x] Calcular rendimiento de las últimas 10, 25 y 50 partidas finalizadas
- [x] Calcular días y franjas horarias con mayor actividad
- [x] Paginar todas las consultas de historial detallado

## FASE 6: Diseñar la página de estadísticas

### Objetivo

Crear una página móvil clara que priorice los datos principales y permita explorar detalles sin saturar la interfaz.

- [x] Crear `EstadisticasPage.vue`
- [x] Agregar la ruta de estadísticas al router
- [x] Agregar el acceso de estadísticas al menú lateral con texto traducido
- [x] Crear traducciones completas para español e inglés
- [x] Mostrar la fecha desde la que se recopilan estadísticas
- [x] Mostrar un estado vacío claro cuando todavía no existen partidas registradas
- [x] Crear tarjetas para partidas, victorias, derrotas, empates, abandonos y porcentaje de victoria
- [x] Crear una sección comparativa por dificultad
- [x] Crear una sección comparativa por ficha X y O
- [x] Crear una sección de puntuación, balance y máximo histórico
- [x] Crear una sección de rachas positivas, negativas y recuperaciones
- [x] Crear una sección de activaciones y duración del escudo
- [x] Crear una sección de tiempos de partida y tiempos de turno
- [x] Crear una sección de movimientos, victorias mínimas y derrotas en pocos movimientos
- [x] Crear una sección de posiciones y líneas ganadoras frecuentes
- [x] Mostrar abandonos separados de las derrotas
- [x] Evitar incluir controles para borrar o reiniciar estadísticas
- [x] Aplicar diseño adaptable a pantallas pequeñas y orientación horizontal
- [x] Usar exclusivamente variables de color existentes

## FASE 7: Incorporar filtros y gráficas

### Objetivo

Permitir comparaciones visuales sin degradar el rendimiento ni sobrecargar la pantalla.

- [x] Definir filtros por período, dificultad, ficha y resultado
- [x] Incluir opciones de período total, últimas partidas y rango de fechas
- [x] Mantener filtros compatibles con consultas SQLite paginadas
- [x] Evaluar una librería de gráficas compatible con Vue 3, Quasar, Vite y Capacitor
- [x] Instalar una librería solo si aporta mejor accesibilidad, mantenimiento y rendimiento que SVG o CSS
- [x] Crear un gráfico de distribución de victorias, derrotas y empates
- [x] Crear barras comparativas por dificultad
- [x] Crear una línea de evolución del puntaje
- [x] Crear una gráfica de puntos ganados y perdidos por período
- [x] Crear una gráfica de duración de partidas y turnos
- [x] Crear un mapa de calor del tablero para posiciones utilizadas
- [x] Crear una visualización de líneas ganadoras frecuentes
- [x] Mostrar valores textuales equivalentes para no depender solo de colores o gráficas
- [x] Evitar renderizar miles de puntos sin agregación o paginación
- [x] Actualizar todas las secciones al cambiar filtros sin realizar consultas duplicadas

## FASE 8: Optimizar historial y mantenimiento

### Objetivo

Conservar todas las partidas sin aplicar límites artificiales y mantener tiempos de carga estables.

- [x] Crear índices SQLite según las consultas reales de la página
- [x] Usar agregaciones SQL para evitar cargar todas las partidas
- [x] Paginar el historial cuando se muestre información detallada
- [x] Medir tiempos de consulta con miles de partidas generadas para pruebas
- [x] Evitar guardar datos duplicados que puedan derivarse de forma segura
- [x] Mantener datos originales suficientes para recalcular estadísticas futuras
- [x] Documentar cómo agregar nuevas migraciones sin perder historial
- [x] Documentar cómo respaldar y restaurar la base si se incorpora esa función en otro plan
- [x] Verificar que actualizar la app conserve la base de datos existente
- [x] Verificar que no exista ninguna limpieza automática del historial

## FASE TESTING

### Objetivo

Validar de forma ejecutable por IA y revisable por humano que el registro, los cálculos y la página funcionen correctamente.

- [x] Ejecutar ESLint y corregir todos los errores relacionados con el cambio
- [x] Ejecutar el build Quasar para Android
- [x] Validar la creación de la base en una instalación limpia
- [x] Validar una actualización desde una versión anterior sin base de estadísticas
- [x] Validar que puntuación y rachas actuales se conserven al actualizar
- [ ] Jugar y verificar victoria, derrota y empate en cada dificultad
- [ ] Jugar usando X y O y verificar que las fichas se registren correctamente
- [x] Verificar que una partida no comience a registrarse con el tablero vacío
- [ ] Reiniciar con tablero no vacío y verificar un único abandono
- [ ] Cambiar dificultad con tablero no vacío y verificar un único abandono
- [x] Salir de la página con tablero no vacío y verificar un único abandono
- [x] Verificar que los abandonos no aumenten las derrotas
- [x] Verificar que cerrar un modal o reiniciar una partida terminada no genere abandono
- [ ] Enviar la app a segundo plano durante un turno y verificar que ese tiempo no se sume
- [x] Verificar turno más corto, turno más largo y promedio con datos controlados
- [x] Verificar partida más corta, partida más larga y promedio con datos controlados
- [ ] Verificar victorias y derrotas con mínimo de movimientos
- [ ] Verificar rachas positivas y el bonus de puntuación correspondiente
- [ ] Verificar que una racha negativa se contabilice al llegar a dos derrotas
- [ ] Verificar cantidad de rachas negativas, peor racha y recuperación posterior
- [ ] Activar el escudo y verificar activación, derrotas protegidas y desactivación
- [x] Verificar puntos ganados, perdidos, balance y máximo histórico
- [x] Verificar estadísticas generales, por dificultad, ficha, resultado y período
- [x] Verificar últimas 10, 25 y 50 partidas
- [x] Verificar que todas las gráficas coincidan con sus valores textuales
- [x] Verificar estados vacíos, una sola partida y grandes cantidades de partidas
- [x] Generar miles de partidas de prueba y medir carga, filtros y consultas
- [ ] Verificar funcionamiento en Android real
- [x] Verificar comportamiento de desarrollo en navegador
- [x] Verificar textos completos en español e inglés
- [x] Verificar que no exista opción visible ni interna para borrar el historial
- [x] Revisar manualmente diseño vertical, horizontal y pantallas pequeñas

## Progreso del plan

- [x] Fase 1: Diseñar el modelo de estadísticas
- [x] Fase 2: Integrar SQLite
- [x] Fase 3: Crear el servicio de registro de partidas
- [x] Fase 4: Integrar puntuación, rachas y escudo
- [x] Fase 5: Crear consultas y cálculos estadísticos
- [x] Fase 6: Diseñar la página de estadísticas
- [x] Fase 7: Incorporar filtros y gráficas
- [x] Fase 8: Optimizar historial y mantenimiento
- [ ] Fase Testing

Fecha de creación: 12 de Junio 2026
Fecha de última actualización: 12 de Junio 2026
Estado: EN PROCESO
