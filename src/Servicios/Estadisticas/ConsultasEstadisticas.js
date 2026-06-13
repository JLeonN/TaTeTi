import { ejecutarConsultaEstadisticas } from './BaseDatosEstadisticas'

const crearFiltro = (filtros) => {
  const condiciones = []
  const valores = []

  if (filtros.dificultad && filtros.dificultad !== 'todas') {
    condiciones.push('dificultad = ?')
    valores.push(filtros.dificultad)
  }
  if (filtros.ficha && filtros.ficha !== 'todas') {
    condiciones.push('fichaUsuario = ?')
    valores.push(filtros.ficha)
  }
  if (filtros.resultado && filtros.resultado !== 'todos') {
    condiciones.push('resultado = ?')
    valores.push(filtros.resultado)
  }
  if (filtros.fechaDesde) {
    condiciones.push('fechaInicio >= ?')
    valores.push(`${filtros.fechaDesde}T00:00:00.000Z`)
  }
  if (filtros.fechaHasta) {
    condiciones.push('fechaInicio <= ?')
    valores.push(`${filtros.fechaHasta}T23:59:59.999Z`)
  }

  const limite = Number(filtros.periodo)
  if (Number.isInteger(limite) && limite > 0) {
    const condicionesLimitadas = [...condiciones, "resultado <> 'abandono'"]
    return {
      clausula: `WHERE id IN (
        SELECT id FROM Partidas
        WHERE ${condicionesLimitadas.join(' AND ')}
        ORDER BY fechaInicio DESC
        LIMIT ${limite}
      )`,
      valores,
    }
  }

  return {
    clausula: condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '',
    valores,
  }
}

const primeraFila = (filas) => filas[0] ?? {}

export const obtenerEstadisticas = async (filtros = {}) => {
  const filtro = crearFiltro(filtros)
  const tablaFiltrada = `SELECT * FROM Partidas ${filtro.clausula}`
  const parametros = filtro.valores

  const resumen = primeraFila(
    await ejecutarConsultaEstadisticas(
      `WITH Filtradas AS (${tablaFiltrada})
      SELECT
        COUNT(*) AS partidas,
        SUM(CASE WHEN resultado = 'victoria' THEN 1 ELSE 0 END) AS victorias,
        SUM(CASE WHEN resultado = 'derrota' THEN 1 ELSE 0 END) AS derrotas,
        SUM(CASE WHEN resultado = 'empate' THEN 1 ELSE 0 END) AS empates,
        SUM(CASE WHEN resultado = 'abandono' THEN 1 ELSE 0 END) AS abandonos,
        SUM(CASE WHEN resultado <> 'abandono' THEN 1 ELSE 0 END) AS finalizadas,
        ROUND(
          100.0 * SUM(CASE WHEN resultado = 'victoria' THEN 1 ELSE 0 END) /
          NULLIF(SUM(CASE WHEN resultado <> 'abandono' THEN 1 ELSE 0 END), 0),
          1
        ) AS porcentajeVictorias
      FROM Filtradas`,
      parametros,
    ),
  )

  const porDificultad = await ejecutarConsultaEstadisticas(
    `WITH Filtradas AS (${tablaFiltrada})
    SELECT
      dificultad,
      COUNT(*) AS partidas,
      SUM(CASE WHEN resultado = 'victoria' THEN 1 ELSE 0 END) AS victorias,
      SUM(CASE WHEN resultado = 'derrota' THEN 1 ELSE 0 END) AS derrotas,
      SUM(CASE WHEN resultado = 'empate' THEN 1 ELSE 0 END) AS empates,
      ROUND(
        100.0 * SUM(CASE WHEN resultado = 'victoria' THEN 1 ELSE 0 END) /
        NULLIF(SUM(CASE WHEN resultado <> 'abandono' THEN 1 ELSE 0 END), 0),
        1
      ) AS porcentajeVictorias
    FROM Filtradas
    GROUP BY dificultad
    ORDER BY CASE dificultad WHEN 'facil' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END`,
    parametros,
  )
  const dificultadesConPartidas = porDificultad.filter((fila) => Number(fila.partidas) > 0)
  const dificultadMasJugada = [...dificultadesConPartidas].sort(
    (a, b) => Number(b.partidas) - Number(a.partidas),
  )[0]
  const mejorDificultad = [...dificultadesConPartidas]
    .filter((fila) => Number(fila.victorias) > 0)
    .sort((a, b) => Number(b.porcentajeVictorias) - Number(a.porcentajeVictorias))[0]

  const porFicha = await ejecutarConsultaEstadisticas(
    `WITH Filtradas AS (${tablaFiltrada})
    SELECT
      fichaUsuario AS ficha,
      COUNT(*) AS partidas,
      SUM(CASE WHEN resultado = 'victoria' THEN 1 ELSE 0 END) AS victorias,
      SUM(CASE WHEN resultado = 'empate' THEN 1 ELSE 0 END) AS empates,
      SUM(CASE WHEN resultado = 'derrota' THEN 1 ELSE 0 END) AS derrotas,
      ROUND(
        100.0 * SUM(CASE WHEN resultado = 'victoria' THEN 1 ELSE 0 END) /
        NULLIF(SUM(CASE WHEN resultado <> 'abandono' THEN 1 ELSE 0 END), 0),
        1
      ) AS porcentajeVictorias
    FROM Filtradas
    GROUP BY fichaUsuario
    ORDER BY fichaUsuario`,
    parametros,
  )

  const puntuacion = primeraFila(
    await ejecutarConsultaEstadisticas(
      `WITH Filtradas AS (${tablaFiltrada})
      SELECT
        SUM(CASE WHEN variacionPuntos > 0 THEN variacionPuntos ELSE 0 END) AS puntosGanados,
        ABS(SUM(CASE WHEN variacionPuntos < 0 THEN variacionPuntos ELSE 0 END)) AS puntosPerdidos,
        SUM(variacionPuntos) AS balancePuntos,
        MAX(puntosFinales) AS maximoPuntos
      FROM Filtradas`,
      parametros,
    ),
  )

  const rachas = primeraFila(
    await ejecutarConsultaEstadisticas(
      `WITH Filtradas AS (${tablaFiltrada})
      SELECT
        MAX(rachaDespues) AS mejorRacha,
        MAX(derrotasDespues) AS peorRachaNegativa,
        SUM(inicioRachaNegativa) AS cantidadRachasNegativas,
        SUM(recuperacionRachaNegativa) AS recuperaciones
      FROM Filtradas`,
      parametros,
    ),
  )

  const proteccion = primeraFila(
    await ejecutarConsultaEstadisticas(
      `WITH Filtradas AS (${tablaFiltrada})
      SELECT
        SUM(activoProteccion) AS activaciones,
        SUM(derrotaProtegida) AS derrotasProtegidas,
        SUM(desactivoProteccion) AS desactivaciones,
        ROUND(AVG(NULLIF(partidasParaDesactivarProteccion, 0)), 1) AS promedioPartidas,
        MAX(partidasParaDesactivarProteccion) AS maximoPartidas,
        ROUND(AVG(NULLIF(duracionProteccionMs, 0))) AS promedioDuracionMs,
        MAX(duracionProteccionMs) AS maximoDuracionMs
      FROM Filtradas`,
      parametros,
    ),
  )

  const tiemposPartida = primeraFila(
    await ejecutarConsultaEstadisticas(
      `WITH Filtradas AS (${tablaFiltrada})
      SELECT
        ROUND(AVG(NULLIF(duracionMs, 0))) AS promedioMs,
        MIN(NULLIF(duracionMs, 0)) AS minimoMs,
        MAX(duracionMs) AS maximoMs,
        MIN(CASE WHEN resultado = 'victoria' THEN NULLIF(duracionMs, 0) END) AS victoriaRapidaMs,
        MIN(CASE WHEN resultado = 'derrota' THEN NULLIF(duracionMs, 0) END) AS derrotaRapidaMs
      FROM Filtradas
      WHERE resultado <> 'abandono'`,
      parametros,
    ),
  )

  const tiemposTurno = primeraFila(
    await ejecutarConsultaEstadisticas(
      `WITH Filtradas AS (${tablaFiltrada})
      SELECT
        ROUND(AVG(Turnos.duracionMs)) AS promedioMs,
        MIN(Turnos.duracionMs) AS minimoMs,
        MAX(Turnos.duracionMs) AS maximoMs
      FROM Turnos
      INNER JOIN Filtradas ON Filtradas.id = Turnos.partidaId
      WHERE Turnos.participante = 'usuario'`,
      parametros,
    ),
  )

  const tiemposComparados = await ejecutarConsultaEstadisticas(
    `WITH Filtradas AS (${tablaFiltrada})
    SELECT
      Filtradas.dificultad,
      Filtradas.resultado,
      ROUND((
        SELECT AVG(Comparadas.duracionMs)
        FROM Filtradas AS Comparadas
        WHERE Comparadas.dificultad = Filtradas.dificultad
          AND Comparadas.resultado = Filtradas.resultado
      )) AS duracionPartidaMs,
      ROUND(AVG(Turnos.duracionMs)) AS duracionTurnoMs
    FROM Filtradas
    LEFT JOIN Turnos
      ON Turnos.partidaId = Filtradas.id
      AND Turnos.participante = 'usuario'
    WHERE Filtradas.resultado <> 'abandono'
    GROUP BY Filtradas.dificultad, Filtradas.resultado
    ORDER BY Filtradas.dificultad, Filtradas.resultado`,
    parametros,
  )

  const movimientos = primeraFila(
    await ejecutarConsultaEstadisticas(
      `WITH Filtradas AS (${tablaFiltrada})
      SELECT
        ROUND(AVG(CASE WHEN resultado = 'victoria' THEN movimientosUsuario END), 1)
          AS promedioVictoria,
        ROUND(AVG(CASE WHEN resultado = 'derrota' THEN movimientosUsuario END), 1)
          AS promedioDerrota,
        MIN(CASE WHEN resultado = 'victoria' THEN movimientosUsuario END)
          AS minimoVictoria,
        MAX(CASE WHEN resultado = 'victoria' THEN movimientosUsuario END)
          AS maximoVictoria,
        MIN(CASE WHEN resultado = 'derrota' THEN movimientosUsuario END)
          AS minimoDerrota,
        MAX(CASE WHEN resultado = 'derrota' THEN movimientosUsuario END)
          AS maximoDerrota,
        SUM(CASE WHEN resultado = 'victoria' AND resultadoMinimosMovimientos = 1
          THEN 1 ELSE 0 END) AS victoriasMinimas,
        SUM(CASE WHEN resultado = 'derrota' AND resultadoMinimosMovimientos = 1
          THEN 1 ELSE 0 END) AS derrotasMinimas,
        SUM(usuarioEstuvoAUnaJugada) AS oportunidadesUsuario,
        SUM(iaEstuvoAUnaJugada) AS amenazasIA,
        SUM(recuperacionAnteAmenaza) AS recuperacionesAnteAmenaza
      FROM Filtradas`,
      parametros,
    ),
  )

  const posiciones = await ejecutarConsultaEstadisticas(
    `WITH Filtradas AS (${tablaFiltrada})
    SELECT Turnos.posicion, COUNT(*) AS cantidad
    FROM Turnos
    INNER JOIN Filtradas ON Filtradas.id = Turnos.partidaId
    WHERE Turnos.participante = 'usuario'
    GROUP BY Turnos.posicion
    ORDER BY Turnos.posicion`,
    parametros,
  )

  const lineas = await ejecutarConsultaEstadisticas(
    `WITH Filtradas AS (${tablaFiltrada})
    SELECT tipoLineaGanadora AS tipo, COUNT(*) AS cantidad
    FROM Filtradas
    WHERE resultado = 'victoria' AND tipoLineaGanadora IS NOT NULL
    GROUP BY tipoLineaGanadora
    ORDER BY cantidad DESC`,
    parametros,
  )

  const evolucion = await ejecutarConsultaEstadisticas(
    `WITH Filtradas AS (${tablaFiltrada})
    SELECT fechaInicio, puntosFinales
    FROM Filtradas
    WHERE resultado <> 'abandono'
    ORDER BY fechaInicio DESC
    LIMIT 30`,
    parametros,
  )

  const actividad = await ejecutarConsultaEstadisticas(
    `WITH Filtradas AS (${tablaFiltrada})
    SELECT horaLocal AS hora, COUNT(*) AS cantidad
    FROM Filtradas
    GROUP BY horaLocal
    ORDER BY cantidad DESC, horaLocal
    LIMIT 3`,
    parametros,
  )

  const actividadDias = await ejecutarConsultaEstadisticas(
    `WITH Filtradas AS (${tablaFiltrada})
    SELECT CAST(strftime('%w', fechaLocal) AS INTEGER) AS dia, COUNT(*) AS cantidad
    FROM Filtradas
    GROUP BY dia
    ORDER BY cantidad DESC, dia
    LIMIT 3`,
    parametros,
  )

  const metadatos = primeraFila(
    await ejecutarConsultaEstadisticas(
      `SELECT valor AS fechaInicioRecopilacion
      FROM Metadatos
      WHERE clave = 'fechaInicioRecopilacion'`,
    ),
  )

  return {
    resumen,
    porDificultad,
    destacados: {
      dificultadMasJugada: dificultadMasJugada?.dificultad ?? null,
      mejorDificultad: mejorDificultad?.dificultad ?? null,
    },
    porFicha,
    puntuacion,
    rachas,
    proteccion,
    tiemposPartida,
    tiemposTurno,
    tiemposComparados,
    movimientos,
    posiciones,
    lineas,
    evolucion: evolucion.reverse(),
    actividad,
    actividadDias,
    metadatos,
  }
}

export const obtenerHistorialPaginado = async (filtros = {}, pagina = 1, tamanio = 25) => {
  const filtro = crearFiltro(filtros)
  const limite = Math.min(100, Math.max(1, Number(tamanio) || 25))
  const paginaNormalizada = Math.max(1, Number(pagina) || 1)
  const desplazamiento = (paginaNormalizada - 1) * limite

  return ejecutarConsultaEstadisticas(
    `SELECT
      id, fechaInicio, resultado, motivoAbandono, dificultad, fichaUsuario,
      duracionMs, movimientosUsuario, movimientosIA, variacionPuntos, puntosFinales
    FROM Partidas
    ${filtro.clausula}
    ORDER BY fechaInicio DESC
    LIMIT ? OFFSET ?`,
    [...filtro.valores, limite, desplazamiento],
  )
}
