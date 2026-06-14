# PLAN IDIOMAS SUECO Y NORUEGO

## Descripción del plan

Agregar sueco y noruego a TaTeTi reutilizando la infraestructura multidioma ya implementada y completar su publicación localizada en Google Play.

## Objetivo principal

- Incorporar `sv-SE` y `nb-NO` a la aplicación
- Traducir la ficha y las novedades de Google Play
- Verificar que ambos idiomas mantengan una terminología diferenciada y natural

## Reglas del plan

- Ejecutar este plan después de completar los dos planes anteriores
- Tratar sueco y noruego como idiomas independientes
- Usar `nb-NO` dentro de la aplicación para noruego Bokmål y mapearlo al código admitido por Google Play `no-NO`
- Reutilizar el catálogo, selector, skills, validadores y ficha central existentes
- Mantener `en-US` como fallback
- No duplicar infraestructura ya resuelta
- Actualizar los registros controlados existentes; agregar el idioma al catálogo no importa automáticamente su módulo de mensajes
- Usar rutas PascalCase para los módulos y mantener los códigos BCP 47 únicamente como datos
- Conservar nombres propios como `TaTeTi` y `NEXUS` salvo decisión explícita
- Mantener `es-AR` como idioma predeterminado para variantes no soportadas, incluido Nynorsk

## FASE 1: Registrar los idiomas

### Objetivo

Habilitar sueco y noruego en el catálogo central.

- [ ] Agregar sueco con código `sv-SE` a `src/i18n/IdiomasApp.json`
- [ ] Agregar noruego Bokmål con código de app `nb-NO` y código de Google Play `no-NO`
- [ ] Definir los nombres nativos `Svenska` y `Norsk bokmål`
- [ ] Declarar los alias `nb`, `nb-NO`, `no` y `no-NO` para detectar noruego Bokmål sin confundirlo con Nynorsk
- [ ] Confirmar en Play Console que la ficha noruega se identifica como `no-NO` antes de cerrar el catálogo
- [ ] Agregar los imports y entradas controladas de `sv-SE` y `nb-NO` en `src/i18n/index.js`
- [ ] Agregar las rutas controladas `SvSE/Index.js` y `NbNO/Index.js` en `Scripts/ValidarIdiomas.js`
- [ ] Ejecutar `npm run generar-idiomas` después de modificar el catálogo
- [ ] Confirmar que la detección del sistema normaliza variantes compatibles
- [ ] Confirmar que el selector dinámico los muestra como opciones independientes
- [ ] Confirmar que `document.documentElement.lang` use `sv-SE` o `nb-NO`

## FASE 2: Traducir la aplicación

### Objetivo

Crear traducciones completas y naturales para sueco y noruego.

- [ ] Crear `src/i18n/SvSE/Index.js`
- [ ] Crear `src/i18n/NbNO/Index.js`
- [ ] Conservar exactamente la misma estructura de claves que el idioma fuente
- [ ] Traducir textos generales, configuración, menú, juego, puntuación, estadísticas y actualización
- [ ] Conservar interpolaciones y símbolos funcionales
- [ ] Revisar que los términos del juego sean naturales en cada idioma
- [ ] Evitar copiar traducciones entre sueco y noruego sin revisión individual
- [ ] Mantener un tono claro, breve e informal
- [ ] Revisar pluralización y concordancia de textos dependientes de cantidades
- [ ] Solicitar una revisión humana o independiente de los textos críticos antes de publicar

## FASE 3: Traducir Google Play y las novedades

### Objetivo

Preparar las fichas y notas necesarias para publicar ambos idiomas.

- [ ] Agregar `sv-SE` y `no-NO` a `PublicacionGooglePlay/FichaGooglePlay.json`
- [ ] Traducir nombre, descripción corta y descripción completa
- [ ] Respetar los límites vigentes de caracteres de Google Play
- [ ] Agregar novedades de actualización para ambos idiomas en `public/version.json`
- [ ] Confirmar que las skills detectan ambos idiomas automáticamente
- [ ] Ejecutar una simulación controlada de `release-notas-de-parche` y comprobar notas para `sv-SE` y `no-NO`
- [ ] Cargar ambas fichas y sus notas de versión en Play Console
- [ ] Revisar manualmente las traducciones antes de publicarlas

## FASE TESTING

### Objetivo

Validar que sueco y noruego funcionen como idiomas independientes en toda la experiencia.

- [ ] Ejecutar ESLint y los validadores de idiomas y publicación
- [ ] Comparar claves, tipos e interpolaciones de `sv-SE` y `nb-NO` contra el idioma fuente
- [ ] Simular dispositivos configurados en sueco y noruego
- [ ] Ampliar `Scripts/ProbarIdiomas.js` con `sv`, `sv-SE`, `nb-NO`, `nb`, `no-NO` y `no`; la prueba de persistencia recorrerá automáticamente todos los idiomas habilitados
- [ ] Probar `nn-NO` de forma aislada y confirmar que use `es-AR`, sin tratarlo como Bokmål
- [ ] Seleccionar ambos idiomas, reiniciar la app y confirmar su persistencia
- [ ] Recorrer juego contra IA, multijugador, estadísticas, configuración y actualización
- [ ] Revisar botones y tarjetas con las traducciones más largas
- [ ] Confirmar que no se mezclen textos suecos y noruegos
- [ ] Probar el modal con novedades reales en ambos idiomas
- [ ] Verificar técnicamente `lang`, roles ARIA, foco y navegación por teclado
- [ ] Confirmar manualmente con TalkBack la pronunciación y el anuncio de selección
- [ ] Validar ambas fichas de Google Play y sus límites de caracteres
- [ ] Ejecutar el build de producción antes de publicar

## Progreso del plan

- [ ] Fase 1: Registrar los idiomas
- [ ] Fase 2: Traducir la aplicación
- [ ] Fase 3: Traducir Google Play y las novedades
- [ ] Fase Testing

Fecha de creación: 13 de Junio 2026
Fecha de última actualización: 14 de Junio 2026
Estado: LISTO PARA EJECUTAR
