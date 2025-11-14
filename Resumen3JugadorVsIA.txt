================================================================================
MODO JUGADOR VS IA - TA-TE-TI
================================================================================

DESCRIPCIÓN
--------------------------------------------------------------------------------
Modo de juego donde el usuario enfrenta a la IA llamada "NEXUS". Incluye tres
niveles de dificultad con diferentes estrategias. El jugador siempre es X y
juega primero, la IA es O y responde con delays según la dificultad.

ARCHIVOS PRINCIPALES
--------------------------------------------------------------------------------

1. src/pages/JugarContraIA.vue
   - Página principal del modo IA
   - Orquesta componentes y lógica de IA
   - Utiliza composable useTaTeTi con modo 'ia'
   - Maneja turnos de IA con delays
   - Carga nombre del usuario desde configuración
   - Nombres: nombreUsuario (X) y "NEXUS" (O)

2. src/components/Composables/useIA.js
   - Composable con toda la lógica de IA
   - Tres algoritmos de dificultad:
     * jugarFacil(): Jugadas aleatorias
     * jugarNormal(): Bloquea y busca ganar
     * jugarDificil(): Algoritmo Minimax
   - Función principal: ejecutarJugadaIA(tablero, dificultad)
   - verificarGanadorMinimax(): Versión sin side-effects

3. src/components/Composables/useTaTeTi.js
   - Composable compartido entre modos
   - Modo 'ia': Incluye flag esperandoIA
   - esperandoIA: Bloquea interacción durante turno de IA

4. src/components/TaTeTi/SelectorDificultad.vue
   - Selector de dificultad con 3 botones
   - Guarda selección en Capacitor Preferences
   - Clave: 'dificultad_ia'
   - Carga dificultad guardada al montar
   - Emite evento 'cambio-dificultad'
   - Iconos: ti-mood-smile (Fácil), ti-brain (Normal), ti-flame (Difícil)

5. src/components/Composables/useConfiguracion.js
   - Carga nombre del usuario para mostrar en InfoJuego
   - Nombre se usa como "Jugador X" en pantalla

6. src/components/Composables/usePuntuacion.js
   - Composable singleton para sistema de puntuación
   - Funciones: cargarPuntuacion(), guardarPuntuacion(), procesarResultado()
   - Maneja rachas independientes por dificultad
   - Protección de 5 derrotas consecutivas
   - Cálculo de bonus por racha (x3 y x10)
   - Clave Capacitor: 'puntuacion_sistema'

7. src/components/TaTeTi/Compartido/IndicadorRacha.vue
   - Muestra racha positiva con llama 🔥
   - Muestra racha negativa con triángulo ⚠️
   - Muestra escudo de protección 🛡️
   - Posición fija en esquina superior derecha
   - Animaciones suaves y responsive

8. src/components/Composables/usePublicidad.js
   - Gestión de banner e intersticial
   - Inicialización de AdMob
   - IDs de prueba y producción

9. src/components/Composables/useContadorPartidas.js
   - Contador de partidas terminadas
   - Muestra intersticial cada 4 partidas
   - Persistencia con Capacitor Preferences

FLUJO DE JUEGO
--------------------------------------------------------------------------------

1. Usuario accede desde drawer → "Jugar vs IA" (ruta raíz)
2. Se carga JugarContraIA.vue
3. Se inicializa useTaTeTi con modo 'ia'
4. Se carga dificultad guardada (default: 'normal')
5. Se carga nombre del usuario
6. Usuario (X) clickea una celda
7. Se coloca ficha X, se verifica ganador/empate
8. Si no hay ganador ni empate:
   - esperandoIA = true (bloquea clicks)
   - Delay según dificultad
   - IA ejecuta jugada con algoritmo correspondiente
   - Se coloca ficha O, se verifica ganador/empate
   - esperandoIA = false (habilita clicks)
9. Se repite proceso hasta ganador o empate
10. Al finalizar, se muestra resultado y botón de reinicio
11. Al terminar partida, se incrementa contador de publicidad
12. Cada 4 partidas se muestra intersticial a pantalla completa
13. Se prepara automáticamente el siguiente intersticial

SISTEMA DE PUNTUACIÓN
--------------------------------------------------------------------------------

CONFIGURACIÓN DE PUNTOS:
- Puntaje inicial: 0 pts
- Mínimo: 0 pts (no permite negativos)

PUNTOS BASE:
- Fácil: +3 victoria | -1 derrota | +1 empate
- Normal: +5 victoria | -2 derrota | +1 empate
- Difícil: +10 victoria | -5 derrota | +1 empate

BONUS POR RACHA:
- 3 victorias seguidas:
  * Fácil: +1 adicional (total 4 pts)
  * Normal: +2 adicional (total 7 pts)
  * Difícil: +3 adicional (total 13 pts)
- 10 victorias seguidas:
  * Fácil: +2 adicional (total 5 pts)
  * Normal: +3 adicional (total 8 pts)
  * Difícil: +5 adicional (total 15 pts)

PROTECCIÓN:
- Después de 5 derrotas consecutivas deja de restar puntos
- Se reactiva al ganar 1 partida
- Puede volver a activarse si pierde 5 más

RACHAS INDEPENDIENTES:
- Cada dificultad mantiene su propia racha
- Cambiar de dificultad no afecta las rachas existentes
- Ejemplo: 10 rachas en Fácil + 5 rachas en Normal simultáneamente

VISUALIZACIÓN:
- Header: Puntaje total con trofeo 🏆
- Esquina derecha: Indicador de racha actual
- Modal resultado: Puntos ganados/perdidos + puntaje total

FLUJO AL TERMINAR PARTIDA:
1. Juego termina (victoria/derrota/empate)
2. Se determina el resultado
3. Se calcula puntos según dificultad + racha
4. Se actualiza racha (suma o resetea)
5. Se verifica protección de derrotas
6. Se guarda en Capacitor Preferences
7. Se muestra modal con resultado y puntos
8. Header se actualiza automáticamente

ALGORITMOS DE IA
--------------------------------------------------------------------------------

NIVEL FÁCIL (jugarFacil):
- Estrategia: Jugadas completamente aleatorias
- No analiza el tablero
- Filtra celdas vacías y elige una al azar
- Math.random() para selección

NIVEL NORMAL (jugarNormal):
- Estrategia: Defensiva y oportunista
- Prioridades:
  1. Intentar ganar si tiene 2 'O' en una combinación
  2. Bloquear al jugador si tiene 2 'X' en una combinación
  3. Si no aplica ninguno, jugar random (jugarFacil)
- Recorre las 8 combinaciones ganadoras buscando oportunidades

NIVEL DIFÍCIL (jugarDificil):
- Estrategia: Algoritmo Minimax
- Imposible de vencer (juego perfecto)
- Explora todos los posibles estados del juego
- Asigna puntajes: +10 (gana IA), -10 (gana usuario), 0 (empate)
- Recursivo: Simula jugadas hasta estado terminal
- IA maximiza su puntaje, usuario lo minimiza
- Elige la jugada con mejor puntaje garantizado

ALGORITMO MINIMAX (Explicación Breve)
--------------------------------------------------------------------------------

CONCEPTO:
- Algoritmo de teoría de juegos para decisiones óptimas
- Asume que el oponente juega perfectamente
- Explora árbol de posibilidades hasta el final

FUNCIONAMIENTO:
1. Si hay ganador o empate, retorna puntaje
2. Para cada celda vacía:
   - Simula jugada
   - Llama recursivamente para el otro jugador
   - Deshace jugada
   - Guarda puntaje
3. IA (O) elige máximo puntaje
4. Usuario (X) elige mínimo puntaje
5. Retorna mejor jugada con su puntaje

PUNTAJES:
- Gana IA (O): +10
- Gana Usuario (X): -10
- Empate: 0

DELAYS SEGÚN DIFICULTAD
--------------------------------------------------------------------------------

FÁCIL: 1000ms + random(500ms) = 1 a 1.5 segundos
- Delay largo para simular "pensamiento" humano
- Hace más creíble el nivel fácil

NORMAL: 700ms + random(300ms) = 0.7 a 1 segundo
- Balance entre rapidez y credibilidad
- Simula jugador experimentado pensando

DIFÍCIL: 300ms + random(200ms) = 0.3 a 0.5 segundos
- Respuesta rápida, refleja cálculo computacional
- IA confiada en sus decisiones

IMPLEMENTACIÓN:
await new Promise(resolve => setTimeout(resolve, delay))
Después del delay se ejecuta la jugada de IA

SELECTOR DE DIFICULTAD
--------------------------------------------------------------------------------

DISEÑO:
- 3 botones horizontales en mobile, verticales en desktop
- Botón activo: Degradado amarillo-púrpura
- Botones inactivos: Fondo púrpura con borde
- Animación hover: Translatey(-2px) y borde amarillo

PERSISTENCIA:
- Usa Capacitor Preferences
- Clave: 'dificultad_ia'
- Se carga al montar componente
- Se guarda al cambiar selección
- Al cambiar dificultad, se reinicia el juego automáticamente

EVENTO:
- Emite 'cambio-dificultad' con valor: 'facil', 'normal' o 'dificil'
- JugarContraIA.vue escucha evento y reinicia juego

BLOQUEO DE INTERACCIÓN
--------------------------------------------------------------------------------

VARIABLE: esperandoIA (ref<boolean>)
PROPÓSITO: Evitar que usuario juegue durante turno de IA

FLUJO:
1. Usuario realiza jugada válida
2. esperandoIA = true
3. Delay según dificultad
4. IA ejecuta jugada
5. esperandoIA = false

VALIDACIÓN EN manejarJugada():
- Si turnoActual === 'O', no hacer nada
- Si juegoTerminado === true, no hacer nada
- Si esperandoIA === true, no hacer nada

VISUAL:
- Celdas muestran cursor not-allowed
- No se aplica hover effect
- Clicks no tienen efecto

DIFERENCIAS CON MODO PVP
--------------------------------------------------------------------------------

MODO IA:
- SelectorDificultad visible
- Delays entre turnos
- Usuario solo juega como X
- Lógica de IA (useIA composable)
- esperandoIA bloquea interacción
- Nombre usuario configurable vs "NEXUS"
- Watch en turnoActual para activar IA

MODO PVP:
- Sin selector de dificultad
- Sin delays
- Ambos jugadores pueden clickear
- Sin lógica de IA
- esperandoIA siempre false
- Nombres genéricos: "Jugador 1" y "Jugador 2"
- Sin watch en turnoActual

COMPONENTES VISUALES ESPECÍFICOS
--------------------------------------------------------------------------------

SELECTOR DIFICULTAD:
- Fondo púrpura alterno con bordes redondeados
- Etiqueta "Dificultad:" centrada
- Botones con iconos descriptivos
- Responsive: Columna en mobile, fila en desktop
- Margin-bottom: 20px (separa de InfoJuego)

INFO JUEGO (Adaptaciones):
- Muestra nombre del usuario en lugar de "Jugador 1"
- Mensaje de victoria incluye oponente ("venció a NEXUS")
- Solo si nombreOponente !== 'Jugador 2' (detecta modo IA)

INDICADOR DE RACHA:
- Posición fija superior derecha (top: 180px)
- Racha positiva: Llama 🔥 amarilla con número de victorias
- Racha negativa: Triángulo ⚠️ rojo con número de derrotas
- Protección activa: Escudo 🛡️ verde con texto "Protegido"
- Animaciones suaves de entrada y pulso
- Responsive: se ajusta en móviles

MODAL RESULTADO (Actualizado):
- Muestra puntos ganados en verde (+X pts)
- Muestra puntos perdidos en rojo (-X pts)
- Muestra empate en gris (=X pts)
- Puntaje total actualizado debajo
- Animaciones escalonadas

NAVEGACIÓN Y RUTAS
--------------------------------------------------------------------------------

RUTA: / (raíz)
COMPONENTE: JugarContraIA.vue
LAYOUT: MainLayout.vue
ACCESO: Drawer lateral → "Jugar vs IA" (primera opción)

ÍTEM EN DRAWER:
- Icono: ti-robot
- Título: "Jugar vs IA"
- Caption: "Enfrentá a NEXUS"

CASOS DE USO
--------------------------------------------------------------------------------

1. Usuario quiere practicar solo
2. No hay otra persona disponible para jugar
3. Desafío personal contra IA difícil
4. Aprendizaje de estrategias (observando nivel difícil)
5. Entretenimiento rápido sin necesitar otro jugador

MEJORAS FUTURAS POSIBLES
--------------------------------------------------------------------------------

- Estadísticas: Victorias/Derrotas/Empates contra cada dificultad
- Más niveles de dificultad (Experto, Imposible)
- IA con "personalidad" (mensajes, reacciones)
- Tutorial interactivo para principiantes
- Historial de partidas contra IA
- Sugerencias de jugadas para aprender
- Modo "Maestro": IA explica sus jugadas

================================================================================
FIN DEL RESUMEN
================================================================================
