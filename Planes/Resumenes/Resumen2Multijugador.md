# Resumen del modo multijugador

> Vigencia: 12 de junio de 2026. Leer junto con `Resumen1General.md`.

## Alcance

Partida local para dos personas en el mismo dispositivo. No usa IA, dificultad, selección persistente de ficha ni puntuación. `X` comienza siempre y luego los turnos alternan.

## Archivos

- `src/pages/JugarMultijugador.vue`: coordinación de la partida, resultado y publicidad.
- `src/components/Composables/useTaTeTi.js`: estado compartido del tablero.
- `src/components/TaTeTi/TableroTaTeTi.vue`: cuadrícula y línea ganadora.
- `src/components/TaTeTi/CeldaTaTeTi.vue`: ficha y estados de cada celda.
- `src/components/TaTeTi/InfoJuego.vue`: turno, ganador y empate.
- `src/components/TaTeTi/Compartido/ModalResultado.vue`: resultado final.
- `src/components/Composables/useContadorPartidas.js`: frecuencia del intersticial.

## Flujo

1. `JugarMultijugador.vue` crea `useTaTeTi('pvp')`.
2. El tablero comienza vacío y el turno es `X`.
3. Una jugada válida coloca la ficha, comprueba ganador o empate y alterna el turno.
4. Al finalizar se muestra el modal de resultado y se registra la partida para publicidad.
5. Jugar nuevamente reinicia el tablero con `X`.

## Interfaz

- Los nombres son Jugador 1 para `X` y Jugador 2 para `O`, traducidos por i18n.
- `InfoJuego.vue` comparte el recorte de nombres largos, pero la opción de seleccionar ficha permanece deshabilitada.
- La animación del nombre de turno se conserva.
- La página queda centrada en pantallas anchas y tablets.
- El tablero adapta su tamaño a la altura disponible para evitar scroll y mantiene sus proporciones.
- Header, banner, modales y barras Android se resuelven globalmente desde el layout y `app.css`.

## Restricciones

- No incorporar aquí la selección de ficha del modo IA.
- No usar `esperandoIA` para controlar el flujo PvP.
- No asignar colores por jugador: `X` siempre usa el color rojo y `O` el azul.
- Mantener la detección de las ocho combinaciones ganadoras dentro de `useTaTeTi`.
- Cualquier cambio compartido en tablero o `InfoJuego` debe probarse también contra IA.

## Validación recomendada

- Victoria de `X`, victoria de `O`, empate y reinicio.
- Nombres y mensajes en español e inglés.
- Teléfono angosto, tablet y orientación horizontal.
- Navegación gestual y tres botones con banner visible.
- Confirmar que no aparezcan scroll ni superposiciones.
