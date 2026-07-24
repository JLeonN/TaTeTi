export const NOMBRE_BASE_ESTADISTICAS = 'EstadisticasTaTeTi'
export const VERSION_BASE_ESTADISTICAS = 4

export const MIGRACIONES_ESTADISTICAS = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS Metadatos (
        clave TEXT PRIMARY KEY NOT NULL,
        valor TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS Partidas (
        id TEXT PRIMARY KEY NOT NULL,
        fechaInicio TEXT NOT NULL,
        fechaFin TEXT NOT NULL,
        fechaLocal TEXT NOT NULL,
        horaLocal INTEGER NOT NULL,
        resultado TEXT NOT NULL,
        motivoAbandono TEXT,
        dificultad TEXT NOT NULL,
        fichaUsuario TEXT NOT NULL,
        fichaIA TEXT NOT NULL,
        duracionMs INTEGER NOT NULL DEFAULT 0,
        tiempoPausadoMs INTEGER NOT NULL DEFAULT 0,
        movimientosUsuario INTEGER NOT NULL DEFAULT 0,
        movimientosIA INTEGER NOT NULL DEFAULT 0,
        puntosIniciales INTEGER NOT NULL DEFAULT 0,
        variacionPuntos INTEGER NOT NULL DEFAULT 0,
        puntosFinales INTEGER NOT NULL DEFAULT 0,
        rachaAntes INTEGER NOT NULL DEFAULT 0,
        rachaDespues INTEGER NOT NULL DEFAULT 0,
        derrotasAntes INTEGER NOT NULL DEFAULT 0,
        derrotasDespues INTEGER NOT NULL DEFAULT 0,
        proteccionAntes INTEGER NOT NULL DEFAULT 0,
        proteccionDespues INTEGER NOT NULL DEFAULT 0,
        activoProteccion INTEGER NOT NULL DEFAULT 0,
        derrotaProtegida INTEGER NOT NULL DEFAULT 0,
        desactivoProteccion INTEGER NOT NULL DEFAULT 0,
        partidasParaDesactivarProteccion INTEGER NOT NULL DEFAULT 0,
        duracionProteccionMs INTEGER NOT NULL DEFAULT 0,
        inicioRachaNegativa INTEGER NOT NULL DEFAULT 0,
        recuperacionRachaNegativa INTEGER NOT NULL DEFAULT 0,
        resultadoMinimosMovimientos INTEGER NOT NULL DEFAULT 0,
        usuarioEstuvoAUnaJugada INTEGER NOT NULL DEFAULT 0,
        iaEstuvoAUnaJugada INTEGER NOT NULL DEFAULT 0,
        recuperacionAnteAmenaza INTEGER NOT NULL DEFAULT 0,
        tipoLineaGanadora TEXT,
        combinacionGanadora TEXT,
        versionApp TEXT NOT NULL,
        versionEsquema INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS Turnos (
        id TEXT PRIMARY KEY NOT NULL,
        partidaId TEXT NOT NULL,
        numero INTEGER NOT NULL,
        participante TEXT NOT NULL,
        ficha TEXT NOT NULL,
        posicion INTEGER NOT NULL,
        fechaInicio TEXT NOT NULL,
        fechaFin TEXT NOT NULL,
        duracionMs INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (partidaId) REFERENCES Partidas(id) ON DELETE CASCADE
      );`,
      'CREATE INDEX IF NOT EXISTS indicePartidasFecha ON Partidas(fechaInicio);',
      'CREATE INDEX IF NOT EXISTS indicePartidasDificultad ON Partidas(dificultad);',
      'CREATE INDEX IF NOT EXISTS indicePartidasFicha ON Partidas(fichaUsuario);',
      'CREATE INDEX IF NOT EXISTS indicePartidasResultado ON Partidas(resultado);',
      'CREATE INDEX IF NOT EXISTS indicePartidasFiltros ON Partidas(dificultad, fichaUsuario, resultado, fechaInicio);',
      'CREATE INDEX IF NOT EXISTS indiceTurnosPartida ON Turnos(partidaId, numero);',
      `INSERT OR IGNORE INTO Metadatos(clave, valor)
        VALUES ('fechaInicioRecopilacion', datetime('now'));`,
      `INSERT OR REPLACE INTO Metadatos(clave, valor)
        VALUES ('versionEsquema', '1');`,
    ],
  },
  {
    toVersion: 2,
    statements: [
      `CREATE TABLE IF NOT EXISTS MovimientosEconomicos (
        id TEXT PRIMARY KEY NOT NULL,
        tipo TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        saldoResultante INTEGER NOT NULL,
        origen TEXT NOT NULL UNIQUE,
        articuloId TEXT,
        fechaUtc TEXT NOT NULL,
        fechaLocal TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS EstadoEconomia (
        clave TEXT PRIMARY KEY NOT NULL,
        valor TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS EstadoPuntuacionDificultad (
        dificultad TEXT PRIMARY KEY NOT NULL,
        estado TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS ArticulosAdquiridos (
        articuloId TEXT PRIMARY KEY NOT NULL,
        fechaAdquisicion TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS EquipamientoFichas (
        ficha TEXT PRIMARY KEY NOT NULL,
        articuloId TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS EstadoRecompensas (
        clave TEXT PRIMARY KEY NOT NULL,
        valor TEXT NOT NULL
      );`,
      'CREATE INDEX IF NOT EXISTS indiceMovimientosTipo ON MovimientosEconomicos(tipo);',
      'CREATE INDEX IF NOT EXISTS indiceMovimientosFecha ON MovimientosEconomicos(fechaUtc);',
      'CREATE UNIQUE INDEX IF NOT EXISTS indiceMovimientosOrigen ON MovimientosEconomicos(origen);',
      `INSERT OR IGNORE INTO EquipamientoFichas(ficha, articuloId) VALUES ('X', 'rojo');`,
      `INSERT OR IGNORE INTO EquipamientoFichas(ficha, articuloId) VALUES ('O', 'azul');`,
    ],
  },
  {
    toVersion: 3,
    statements: [
      'ALTER TABLE EquipamientoFichas RENAME TO EquipamientoFichasAnterior;',
      `CREATE TABLE EquipamientoFichas (
        ficha TEXT NOT NULL,
        categoria TEXT NOT NULL,
        articuloId TEXT NOT NULL,
        PRIMARY KEY (ficha, categoria)
      );`,
      `INSERT INTO EquipamientoFichas (ficha, categoria, articuloId)
        SELECT ficha, 'color', articuloId FROM EquipamientoFichasAnterior;`,
      'DROP TABLE EquipamientoFichasAnterior;',
      'CREATE INDEX IF NOT EXISTS indiceEquipamientoArticulo ON EquipamientoFichas(articuloId);',
      `INSERT OR IGNORE INTO ArticulosAdquiridos (articuloId, fechaAdquisicion)
        VALUES ('simboloX', datetime('now'));`,
      `INSERT OR IGNORE INTO ArticulosAdquiridos (articuloId, fechaAdquisicion)
        VALUES ('simboloO', datetime('now'));`,
      `INSERT OR IGNORE INTO EquipamientoFichas (ficha, categoria, articuloId)
        VALUES ('X', 'simbolo', 'simboloX');`,
      `INSERT OR IGNORE INTO EquipamientoFichas (ficha, categoria, articuloId)
        VALUES ('O', 'simbolo', 'simboloO');`,
    ],
  },
  {
    toVersion: 4,
    statements: [
      'ALTER TABLE Partidas ADD COLUMN simboloUsuarioId TEXT;',
      'ALTER TABLE Partidas ADD COLUMN simboloIAId TEXT;',
    ],
  },
]
