# Resumen del modo jugador contra IA

> Vigencia: 12 de junio de 2026. La IA se llama NEXUS.

## Regla central

El usuario elige `X` u `O` antes de la partida y siempre juega primero. NEXUS recibe automáticamente la ficha contraria. La ficha elegida persiste entre sesiones.

## Archivos

- `src/pages/JugarContraIA.vue`: coordinador del modo.
- `src/components/Composables/UseFichaJugador.js`: selección y persistencia de ficha.
- `src/components/Composables/useTaTeTi.js`: tablero con ficha inicial parametrizable.
- `src/components/Composables/useIA.js`: estrategia parametrizada para cualquier combinación de fichas.
- `src/components/TaTeTi/InfoJuego.vue`: nombre de turno y acceso al selector.
- `src/components/TaTeTi/JugarVsIA/SelectorDificultad.vue`: dificultad e indicadores de racha.
- `src/components/Modales/ModalConfirmacion.vue`: modal reutilizado para elegir `X` u `O`.
- `src/components/Composables/usePuntuacion.js`: resultado, puntos y rachas.

## Selección de ficha

- Clave persistente: `ficha_usuario_ia`.
- Valor predeterminado: `X`.
- El nombre animado del usuario funciona como botón solo si el tablero está vacío, el juego no terminó y no se espera una jugada.
- El modal presenta `X` roja y `O` azul.
- Cambiar la ficha actualiza inmediatamente nombres, colores y turno inicial.
- Tras la primera jugada no se puede cambiar hasta reiniciar o cambiar dificultad.
- Jugar nuevamente deja el tablero vacío y vuelve a habilitar el selector.

## Asignación dinámica

- Si el usuario usa `X`: nombre de `X` = usuario; nombre de `O` = NEXUS.
- Si el usuario usa `O`: nombre de `O` = usuario; nombre de `X` = NEXUS.
- El resultado se interpreta comparando el ganador con `fichaUsuario`, no suponiendo que el usuario sea `X`.
- `reiniciarJuego(fichaUsuario)` garantiza que el usuario conserve el primer turno.

## IA

`ejecutarJugadaIA(tablero, dificultad, fichaIA, fichaUsuario)` no debe asumir símbolos fijos.

- Fácil: elige una celda libre al azar.
- Normal: primero intenta ganar con `fichaIA`, luego bloquea `fichaUsuario` y finalmente juega al azar.
- Difícil: Minimax maximiza para `fichaIA` y minimiza para `fichaUsuario`.
- Durante el cálculo y el retraso visual, `esperandoIA` bloquea la interacción.

## Dificultad

- Se persiste con la clave `dificultad_ia`.
- Valores: `facil`, `normal`, `dificil`.
- Cambiar dificultad reinicia el tablero y vuelve a habilitar el selector de ficha.
- Los indicadores de racha forman parte de `SelectorDificultad.vue`; no existe un componente separado activo para ellos.

## Puntuación

- Fácil: victoria `+3`, derrota `-1`, empate `+1`.
- Normal: victoria `+5`, derrota `-2`, empate `+1`.
- Difícil: victoria `+10`, derrota `-5`, empate `+1`.
- Hay bonos por rachas de 3 y 10 victorias.
- Tras 5 derrotas seguidas se activa protección y deja de restar hasta ganar.
- Las rachas son independientes por dificultad.
- El puntaje nunca baja de cero.

## Contratos que no deben romperse

- El usuario siempre comienza, aunque elija `O`.
- Los colores pertenecen a `X` y `O`, no al usuario o a la IA.
- No permitir selección durante una partida.
- No volver a codificar comparaciones fijas `turnoActual === 'X'` para identificar al usuario.
- No volver a fijar Minimax a IA `O` y usuario `X`.
- Multijugador debe permanecer sin selección de ficha.

## Validación recomendada

- Primera instalación: usuario `X`, NEXUS `O`.
- Usuario `O`: comienza primero y NEXUS juega con `X`.
- Persistencia tras cerrar y abrir la app.
- Fácil, normal y difícil con ambas fichas.
- Victoria, derrota, empate, puntuación, rachas y reinicio.
- Selector habilitado solo antes de la primera jugada.
- Nombres largos sin superposición.
