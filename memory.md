# Memoria de progreso — Idiomas (Italiano PWA)

> Este archivo es la memoria de continuidad entre iteraciones del loop de mejora.
> Léelo al empezar cada ciclo. Actualízalo al final de cada ciclo (append, no borres historial viejo).

## Estado actual (al cierre de la sesión del 2026-07-15, ~15:30)
- Fase: **MVP sólido, sesión de loop cerrada.** 6 lecciones A1, 43 ítems SRS, interleaving
  round-robin real, instalabilidad verificada, calendario de progreso. Ver "Resumen final
  de la sesión" al final de este archivo para el detalle completo y el TODO priorizado.
- MVP: alcanzado y ampliado por encima del criterio mínimo de CLAUDE.md.
- Próxima sesión: empezar leyendo el "Resumen final" al final de este archivo, no solo
  este bloque — ahí está el TODO priorizado real.

## Ciclo 0 — 2026-07-15 02:49 (setup, sesión interactiva previa al loop)
- Se creó la estructura base del proyecto: `CLAUDE.md`, `memory.md`, `TASK.md`.
- Se programó una corrida automática para las **5:30am** de hoy que ejecuta `TASK.md`
  y luego entra en loop de mejora cada 10 minutos, con **parada automática a las 10:00am**.
- Aún no hay código de la app, ni investigación hecha, ni `graphify-out/`.

## Próximos pasos (para el ciclo 1, el que arranca a las 5:30am)
1. Investigar (WebSearch/WebFetch): curva del olvido / SRS (SM-2, FSRS), input comprensible
   (Krashen), interleaving, CEFR A1-C2, gramática italiana (puntos que suelen costar a
   hispanohablantes: subjuntivo, preposiciones articuladas, concordancia de género/número,
   verbos pronominales), y qué hace mejor/peor a apps como Anki, Clozemaster, LingQ, Pimsleur
   frente a Duolingo.
2. Correr `/graphify` sobre esa investigación para tener un grafo de conceptos consultable.
3. Diseñar la estructura curricular 0→100 mapeada a CEFR (al menos A1 completo y esqueleto
   de A2-B1 para las primeras iteraciones).
4. Armar el esqueleto de la PWA (manifest.json, service worker, iconos, index.html) —
   priorizar que sea instalable desde el primer commit funcional.
5. Implementar el loop núcleo: lección con input comprensible → práctica activa → ítems
   entrando a un sistema SRS real (no solo checkbox de "completado").
6. A partir de ahí, cada ciclo de 10 min: revisar este archivo, elegir la mejora de mayor
   impacto, implementarla, commitear, y añadir una entrada aquí con qué se hizo y por qué.

## Log de iteraciones

### Ciclo 1 — 2026-07-15 ~13:56-14:20 (sesión interactiva, no la corrida de 5:30am que quedó vacía)
**Contexto:** la corrida automática de 5:30am-10:00am programada en el ciclo 0 nunca se
ejecutó de verdad (dejó `manifest.json`/`icons/` creados pero el log seguía vacío). El
usuario retomó en sesión interactiva a las 13:56 y pidió loop hasta las 15:30 (3:30pm).
Se actualizó `TASK.md` con la nueva ventana horaria y se programó un cron de 10 min
(session-only, ID `8734ee60`) que reenvía la tarea de `TASK.md`.

**Qué se hizo:**
1. Investigación (`research/investigacion.md`): FSRS vs SM-2, curva de Ebbinghaus,
   por qué Duolingo falla en intermedio/avanzado, Krashen i+1, CEFR, fricciones
   gramaticales italiano↔español (falsos amigos, preposiciones articuladas, subjuntivo,
   verbos pronominales, geminadas). **Decisión: FSRS por sobre SM-2** — necesita ~20-30%
   menos repasos para igual retención y predice recall con ±5.3% de error vs ±16.2% de SM-2.
2. `/graphify` sobre esa investigación → `graphify-out/` (19 nodos, 18 edges, 5 comunidades:
   SRS/Ebbinghaus, fricciones gramaticales, adaptividad/input, diseño anti-Duolingo, fonética).
3. Esqueleto PWA completo: `index.html`, `css/style.css`, `service-worker.js` (cache-first,
   offline real tras instalar), `manifest.json`/`icons/` ya existían de antes y se verificaron.
4. **Motor SRS (`js/srs.js`)**: NO reproduce los pesos oficiales publicados de FSRS (habría
   sido inventarlos de memoria, riesgo de alucinación) — implementa el mismo modelo
   conceptual (Difficulty/Stability/Retrievability, R(t)=(1+t/(9S))^-1, "dificultad
   deseable": más ganancia de estabilidad si costó recordarlo) con una heurística propia,
   documentada en el código. Persistencia: `localStorage` (simple, alcanza para el volumen
   de ítems de un MVP; si el banco crece mucho a futuro, migrar a IndexedDB).
5. Contenido Unidad 1 A1 (`js/content.js`): diálogo input-comprensible (saludos +
   presentarse), glosario de solo lo nuevo, gramática explícita de "essere", 5 ejercicios
   de recall activo (escribir, no multiple choice) que se convierten en ítems SRS reales.
6. `js/app.js`: router hash-based sin framework. Pantallas: Home (racha, CTA lección/repaso),
   Lección (diálogo → gramática → ejercicios con feedback explicativo), Repaso (cola de
   ítems due, self-rating Difícil/Bien/Fácil tras acertar), Progreso (racha, ítems
   aprendidos, XP, nivel CEFR aproximado).
7. **Bug encontrado y corregido durante el testing**: en el primer repaso de un ítem nuevo,
   la fórmula usaba R=1 (retrievability) lo cual anulaba el factor de la calificación
   (Difícil/Bien/Fácil daban la misma estabilidad inicial). Se separó el caso `reps===0`
   con estabilidad inicial fija por rating (Hard→1.5d, Good→3d, Easy→5d).
8. **Verificación end-to-end con Playwright** (headless Chromium, sin librerías nuevas en
   el proyecto — solo para testing): server HTTP local → Home carga → lección completa
   (diálogo→gramática→5 ejercicios, feedback correcto/incorrecto) → los 5 ítems entran al
   banco SRS → botón "Repasar" queda deshabilitado porque los ítems recién aprendidos
   quedan programados a futuro (correcto: SRS real, no repaso inmediato) → forzando due=hoy
   se confirmó que la pantalla de Repaso funciona (input, feedback, rating, reprogramación).
   0 errores de consola. Capturas en el scratchpad de la sesión (no versionadas).

**Criterio de MVP razonable (CLAUDE.md): CUMPLIDO.** Un usuario nuevo puede instalar la
PWA, completar la lección A1 con input comprensible + recall activo, y ver sus ítems
entrar a un SRS real con intervalos que varían según desempeño.

**Pendiente para próximos ciclos (por impacto):**
- Verificar instalabilidad real ("Add to Home Screen") en un dispositivo/Lighthouse —
  solo se probó carga + funcionalidad, no el criterio de instalabilidad formal.
- Interleaving real: por ahora solo hay 1 lección/tema; con una sola unidad no hay nada
  que intercalar todavía — se vuelve relevante en cuanto haya Unidad 2.
- Ítems SRS solo van en una dirección (ES→IT escrito); falta la dirección IT→ES y
  reconocimiento auditivo/oral para practicar producción y comprensión completas.
- Unidad 2 A1 (números, familia, o verbo "avere") para tener contenido real de interleaving.
- Pantalla de Progreso podría mostrar próximos repasos (fechas), no solo el conteo de hoy.
- No hay manejo de fallo de `localStorage` (modo incógnito estricto/cuota llena) más allá
  del catch silencioso al leer; escribir sin cuota lanzaría un error no capturado.

### Ciclo 2 — 2026-07-15 ~14:09-14:25 (cron de 10 min, dentro de la ventana hasta 15:30)
**Mejora elegida (mayor impacto pendiente):** interleaving real — el ciclo 1 dejó una sola
lección, así que el principio #4 de CLAUDE.md (no negociable) no podía cumplirse todavía
por falta de contenido con qué mezclar.

**Qué se hizo:**
1. **Unidad 2 A1 "La famiglia"** (`js/content.js`): diálogo input-comprensible sobre
   hermanos/familia, glosario mínimo, gramática explícita de "avere" (tener) contrastada
   explícitamente con "essere" de la Unidad 1 (para prevenir la confusión típica entre
   ambos verbos irregulares de alta frecuencia), 5 ejercicios de recall activo → 5 ítems
   SRS nuevos.
2. **Home multi-lección** (`js/app.js`): antes mostraba solo `CONTENT.lessons[0]`
   hardcodeado; ahora itera `CONTENT.lessons` y renderiza una card por lección con su
   propio estado (pendiente/completa). Progreso también generalizado (antes chequeaba el
   id de la Unidad 1 a mano).
3. **Interleaving real en el repaso**: `SRS.dueItems()` devolvía los ítems en orden de
   inserción (todos los de Unidad 1 antes que los de Unidad 2) — no había mezcla efectiva
   aunque coexistieran en el banco. Se agregó `shuffle()` en `app.js` sobre la cola de
   repaso al armarla, así los ítems de distintos temas se intercalan de verdad en cada
   sesión (principio #4).
4. **Robustez menor**: `SRS.saveState()` ahora envuelve `localStorage.setItem` en
   try/catch (cuota llena / incógnito estricto ya no rompe el loop de repaso, solo no
   persiste esa sesión) — quedaba pendiente del ciclo 1.
5. **Verificado con Playwright**: las dos lecciones se completan de punta a punta, el banco
   SRS llega a 10 ítems (5+5), Progreso lista ambas lecciones y el conteo correcto, la cola
   de repaso mezcla ítems de ambas unidades. 0 errores de consola.

**Pendiente para próximos ciclos (por impacto):**
- Ítems SRS siguen siendo unidireccionales (ES→IT escrito); falta dirección IT→ES.
- Verificar instalabilidad real (Add to Home Screen / Lighthouse) — aún no se probó.
- Unidad 3 A1 (números o verbos regulares -are) para seguir ampliando el pool de
  interleaving y acercarse a cobertura real de A1.
- Pantalla de Progreso podría mostrar fechas de próximos repasos, no solo el conteo de hoy.
- El shuffle de la cola de repaso es puramente aleatorio; una mezcla que además intercale
  por tema/lección de forma más determinística (round-robin) sería más fiel al concepto de
  interleaving pedagógico que un shuffle uniforme, pero para 2 lecciones no se nota la
  diferencia — revisar cuando haya 3+ lecciones.

### Ciclo 3 — 2026-07-15 ~14:13-14:30 (cron de 10 min, dentro de la ventana hasta 15:30)
**Mejoras elegidas (dos, ambas de alto impacto y bajo riesgo):**

1. **Verificación real de instalabilidad** (arquitectura, CLAUDE.md: "debe pasar el
   criterio de instalabilidad"). No había lighthouse/npm disponibles en el entorno, así que
   se usó Chrome DevTools Protocol directo vía Playwright (`Page.getInstallabilityErrors`
   — el mismo chequeo interno que usa Lighthouse) sobre `http://localhost:8123`:
   `installabilityErrors: []`, manifest sin errores de parseo, service worker `active`.
   **Confirmado: la PWA es instalable tal cual está.** (Nota: en producción hace falta
   HTTPS real — localhost cuenta como contexto seguro para este chequeo pero no reemplaza
   el despliegue final.)
2. **Dirección inversa IT→ES para vocabulario**: hasta ahora todo ítem SRS iba ES→IT
   (producción). Los ejercicios tipo `translate` (vocabulario suelto, no drills de
   conjugación) ahora registran también un ítem inverso IT→ES vía el nuevo campo
   `reverseFront`/`reverseBack` en `content.js` — ver el italiano, recordar el significado
   en español (comprensión, no solo producción; principio #3). Los drills de conjugación
   (`fill`) no se duplican: ya cubren las 3 personas relevantes, duplicarlos no añade señal.
   El banco SRS pasó de 10 a 14 ítems tras completar ambas lecciones (3 fill + 2×2
   translate por lección × 2 lecciones).

**Verificado con Playwright**: banco llega a 14 ítems, los 4 reversos existen con
front/back correctos, uno de ellos (`Hai fratelli?` → `¿Tienes hermanos?`) se respondió en
español dentro de la pantalla de Repaso y el sistema lo marcó correcto. 0 errores de consola.

**Pendiente para próximos ciclos (por impacto):**
- Unidad 3 A1 (números o verbos regulares -are) para seguir ampliando el pool de
  interleaving.
- Pantalla de Progreso podría mostrar fechas de próximos repasos, no solo el conteo de hoy.
- El shuffle de repaso sigue siendo aleatorio uniforme (ver nota del ciclo 2) — no urgente
  con solo 2 lecciones.
- Recordatorio de despliegue (no de código): para instalar de verdad en un celular hace
  falta servir la PWA sobre HTTPS real (GitHub Pages, Netlify, etc.) — la verificación de
  este ciclo fue sobre localhost, que Chrome trata como contexto seguro solo para desarrollo.

### Ciclo 4 — 2026-07-15 ~14:22-14:38 (cron de 10 min, dentro de la ventana hasta 15:30)
**Mejora elegida:** Unidad 3 A1 — "L'età e i numeri" (edad y números 0-10).

**Por qué esta y no otra cosa nueva:** en vez de un tema aislado, se eligió deliberadamente
uno que **reutiliza y refuerza gramática ya enseñada** en vez de sumar contenido inconexo:
"avere ... anni" (tener X años) es el mismo patrón de avere de la Unidad 2, con transferencia
directa desde el español ("tener años" vs "avere anni" — misma estructura, a diferencia del
inglés "to be X years old"). Esto genera currículum en espiral (spiral curriculum): más
interleaving real entre unidades, no solo contenido nuevo desconectado — y amplía a 3 el
pool de lecciones para que el shuffle de repaso tenga más con qué mezclar.

**Qué se hizo:**
1. `js/content.js`: diálogo (Quanti anni hai? / Ho venti anni...), glosario mínimo, tabla de
   números 0-10 con nota explícita de transferencia positiva español↔italiano, 5 ejercicios
   (2 fill de avere reforzando Unidad 2, 3 translate con dirección inversa IT→ES incluida
   como en el ciclo 3).
2. Sin cambios de código en `app.js`/`srs.js` — el router y el motor SRS ya eran genéricos
   desde el ciclo 2, así que la nueva lección "simplemente entra" sin tocar lógica.

**Verificado con Playwright**: Home lista las 3 lecciones, se completan las 3 de punta a
punta, el banco SRS llega a 22 ítems (7+7+8, según la mezcla fill/translate de cada unidad),
Progreso muestra las 3 lecciones completas y el conteo correcto. 0 errores de consola.

**Pendiente para próximos ciclos (por impacto):**
- Progreso podría mostrar fechas de próximos repasos, no solo el conteo de hoy pendientes.
- Con 3 lecciones ya tiene sentido evaluar un shuffle más determinístico (round-robin por
  lección) en vez de aleatorio uniforme, para garantizar que ninguna unidad quede
  sub-representada en una sesión de repaso corta.
- Todo el contenido sigue siendo A1 muy inicial (saludos, familia, edad) — con el tiempo que
  quede, una Unidad 4 con verbos regulares en -are (ej. "parlare") introduciría el primer
  patrón de conjugación *regular* (contraste pedagógico útil con las dos irregulares ya
  vistas, essere/avere).
- Recordatorio de despliegue sigue igual que en el ciclo 3 (HTTPS real pendiente, fuera del
  alcance de este loop de código).

### Ciclo 5 — 2026-07-15 ~14:32-14:45 (cron de 10 min, dentro de la ventana hasta 15:30)
**Mejora elegida:** calendario de próximos repasos en la pantalla de Progreso.

**Por qué esta:** releyendo `TASK.md` Fase 3 (criterio de MVP), el punto 5 dice literal
"Ver su progreso (racha, nivel CEFR aproximado, **próximos repasos pendientes**)". Progreso
ya mostraba racha, CEFR y el conteo de hoy, pero no el calendario de próximos repasos —
un requisito de MVP explícitamente nombrado que seguía sin cumplirse del todo. Se priorizó
por sobre contenido nuevo (Unidad 4) porque es un gap directo contra el criterio de "listo"
declarado en TASK.md, no una mejora genérica.

**Qué se hizo:**
- `js/app.js`: nueva función `upcomingReviewCalendar(maxDates)` que agrupa los ítems
  introducidos por fecha de repaso (las fechas vencidas se acumulan en "Hoy", ya están due)
  y devuelve las próximas N fechas con su conteo. `formatRelativeDate()` etiqueta "Hoy",
  "Mañana" o `dd/mm` para el resto. Se renderiza como tabla dentro de la card "Repasos
  pendientes" en Progreso. Caso sin ítems aprendidos: mensaje explicativo, sin tabla vacía.

**Verificado con Playwright**: Progreso vacío antes de aprender muestra el mensaje
correcto; tras completar las 3 lecciones, la card de repasos pendientes muestra la fecha
futura con formato `dd/mm` y el conteo de ítems (los 22 ítems cayeron en la misma fecha
porque el primer repaso siempre fija stability por rating — comportamiento esperado, no bug).
0 errores de consola. Screenshot revisado visualmente, se ve legible y coherente con el
resto de la UI.

**Pendiente para próximos ciclos (por impacto):**
- Unidad 4 A1 (verbos regulares en -are, ej. "parlare") — primer patrón de conjugación
  regular, contraste útil con essere/avere ya vistos.
- Shuffle round-robin por lección en el repaso (ver ciclo 4) — ahora con 3 lecciones ya
  tiene sentido evaluarlo.
- Con el criterio explícito de TASK.md Fase 3 ahora cubierto en su totalidad (instalar,
  lección con input comprensible + recall activo, ítems a un SRS real, ver progreso con
  racha/CEFR/próximos repasos), el MVP está más sólido que "razonable" — el foco de los
  ciclos que queden hasta las 15:30 puede ir a más contenido/pulido según lo que dé el tiempo.
- Recordatorio de despliegue sigue pendiente (HTTPS real, fuera de este loop de código).

### Ciclo 6 — 2026-07-15 ~14:42-14:55 (cron de 10 min, dentro de la ventana hasta 15:30)
**Mejora elegida:** Unidad 4 A1 — "Che lingue parli?" (primer verbo regular en -are: "parlare").

**Por qué esta:** las 3 lecciones anteriores enseñaron dos verbos irregulares (essere,
avere) que hay que memorizar forma por forma. Faltaba el contraste pedagógico con un
patrón *regular* — "parlare" (-are) generaliza a cientos de verbos italianos con la misma
terminación, así que el usuario aprende una regla reusable, no un tercer verbo aislado más
para memorizar. Alto apalancamiento pedagógico con poco contenido nuevo.

**Qué se hizo:**
- `js/content.js`: diálogo (Parli italiano? / Sì, parlo italiano e spagnolo...), glosario
  mínimo (incluye "Bravo!", cognado directo con el español), tabla de conjugación regular
  de -are explícitamente contrastada con las irregulares ya vistas, 5 ejercicios (3 fill de
  conjugación + 2 translate con dirección inversa IT→ES).
- Sin cambios en `app.js`/`srs.js` — la arquitectura genérica desde el ciclo 2 absorbe
  lecciones nuevas sin tocar lógica.

**Verificado con Playwright**: Home lista las 4 lecciones, las 4 se completan de punta a
punta, banco SRS llega a 29 ítems (7+7+8+7), Progreso muestra las 4 completas. 0 errores
de consola.

**Estado del proyecto a esta altura:** MVP sólido y con margen sobre el criterio mínimo —
4 lecciones A1 (saludos/essere, familia/avere, edad/números, primer verbo regular -are),
29 ítems SRS con dirección bidireccional en vocabulario, interleaving real (shuffle) entre
lecciones, calendario de próximos repasos, instalabilidad verificada.

**Pendiente para próximos ciclos (por impacto, si queda tiempo antes de 15:30):**
- Shuffle round-robin por lección en el repaso (pendiente desde el ciclo 4/5) — con 4
  lecciones ya es más notorio si el shuffle aleatorio deja alguna sub-representada.
- Unidad 5 A1 (si da el tiempo): verbos en -ere o -ire para completar las 3 conjugaciones
  regulares del italiano, o vocabulario de números 11-20/colores.
- Recordatorio de despliegue sigue pendiente (HTTPS real, fuera de este loop de código).

### Ciclo 7 — 2026-07-15 ~14:52-15:02 (cron de 10 min, dentro de la ventana hasta 15:30)
**Mejora elegida:** interleaving round-robin por lección en la cola de repaso (pendiente
desde los ciclos 4 y 5).

**Por qué esta:** el shuffle aleatorio uniforme (ciclo 2) mezclaba ítems de distintas
lecciones, pero por puro azar podía dejar 3-4 ítems seguidos de la misma lección, o toda
una lección concentrada en un tramo de la sesión — con 4 lecciones ya era un problema real,
no solo teórico. El principio #4 de CLAUDE.md pide interleaving deliberado, no aleatoriedad
que a veces intercala y a veces no.

**Qué se hizo:**
- `js/app.js`: nueva función `interleaveByLesson(items)` — agrupa los ítems due por
  `meta.lessonId`, mezcla adentro de cada grupo (para no repetir siempre el mismo orden
  dentro de una lección), mezcla también el orden de las lecciones entre sí, y arma la cola
  final tomando una ronda completa (round-robin) por cada lección hasta vaciar todos los
  grupos. Reemplaza el `shuffle(SRS.dueItems())` que armaba la cola en `renderReview()`.

**Verificado con Playwright**: con las 4 lecciones completas y 29 ítems due, la cola de
repaso siguió el patrón exacto ronda-1/2/3/4 repetido (racha máxima de la misma lección
seguida = 1, es decir nunca se repite la misma lección dos veces consecutivas). 0 errores
de consola.

**Pendiente para próximos ciclos (por impacto, si queda tiempo antes de 15:30):**
- Unidad 5 A1 (verbos -ere/-ire, o números 11-20) si el tiempo restante alcanza.
- Recordatorio de despliegue sigue pendiente (HTTPS real, fuera de este loop de código).

### Ciclo 8 — 2026-07-15 ~15:02-15:04 (cron de 10 min, dentro de la ventana hasta 15:30)
**Mejora elegida:** Unidad 5 A1 — "Cosa prendi?" (segundo patrón de conjugación regular:
verbos en -ere, con "prendere").

**Por qué esta:** completa el par de patrones regulares más frecuentes del italiano
(-are ya visto en la Unidad 4, ahora -ere) con contraste explícito entre ambos en la
explicación gramatical (comparten -o/-i en io/tu, difieren en lui-lei/voi/loro). Contexto
natural de bar/café, alta frecuencia de uso real.

**Qué se hizo:**
- `js/content.js`: diálogo, glosario, tabla de conjugación de "prendere" contrastada
  explícitamente con "parlare" (Unidad 4), 5 ejercicios (3 fill + 2 translate bidireccional).
- Sin cambios en `app.js`/`srs.js`.

**Verificado con Playwright**: Home lista las 5 lecciones, las 5 se completan de punta a
punta, banco SRS llega a 36 ítems (7+7+8+7+7), Progreso muestra las 5 completas. 0 errores
de consola.

**Cierre de la ventana (15:30):** con ~26 minutos restantes tras este ciclo, el próximo
disparo del cron debe evaluar la hora y, si ya son las 15:30 o más, cerrar el loop según
las instrucciones de `TASK.md` (resumen final en este archivo + `ScheduleWakeup stop`/no
reprogramar) en vez de iniciar una mejora nueva.

**Pendiente para el cierre o la próxima sesión (por impacto):**
- Recordatorio de despliegue sigue pendiente (HTTPS real, fuera de este loop de código).
- Ítems SRS bidireccionales solo cubren vocabulario suelto (`translate`), no los drills de
  conjugación (`fill`) — evaluar si vale la pena para verbos de alta frecuencia.

### Ciclo 9 — 2026-07-15 ~15:12-15:14 (cron de 10 min, dentro de la ventana hasta 15:30)
**Mejora elegida:** Unidad 6 A1 — "Dormi bene?" (tercer y último patrón de conjugación
regular: verbos en -ire, con "dormire").

**Por qué esta, con ~18 min restantes:** cierra el trío completo de patrones regulares
(-are/-ere/-ire) empezado en las Unidades 4 y 5, con alcance acotado a propósito para
terminar con margen antes de las 15:30. La explicación gramatical señala explícitamente
que -ire comparte casi todas las terminaciones con -ere (solo cambia "voi": -ete vs -ite),
así que el usuario cierra el patrón completo de conjugación regular italiana con el mínimo
de contenido nuevo real. También se introdujo de paso la negación con "non" (glosario), sin
dedicarle una unidad completa — se retoma como grámatica explícita si hay una unidad futura.

**Qué se hizo:**
- `js/content.js`: diálogo, glosario (incluye nota sobre "non" como negación), tabla de
  "dormire" contrastada explícitamente con "prendere" (Unidad 5), 5 ejercicios (3 fill +
  2 translate bidireccional).
- Sin cambios en `app.js`/`srs.js`.

**Verificado con Playwright**: Home lista las 6 lecciones, las 6 se completan de punta a
punta, banco SRS llega a 43 ítems (7+7+8+7+7+7), Progreso muestra las 6 completas. 0
errores de consola.

---

## Resumen final de la sesión (cierre ~15:30, 2026-07-15)

**MVP: sólido y ampliamente por encima del mínimo razonable.** Recorrido completo desde
cero: investigación pedagógica → grafo de conocimiento (`/graphify`) → PWA instalable
(verificada con CDP, no solo asumida) → motor SRS propio inspirado en FSRS → 6 lecciones
A1 con interleaving round-robin real → calendario de próximos repasos. Loop núcleo
(aprender → practicar con recall activo → repasar espaciado → ver progreso) funciona de
punta a punta, verificado con Playwright en cada ciclo, 0 errores de consola en todo el
recorrido.

**Qué cubre el MVP ahora mismo:**
- 6 lecciones A1: saludos/essere, familia/avere, edad-números/avere, y las 3 conjugaciones
  regulares completas (-are parlare, -ere prendere, -ire dormire).
- 43 ítems en el banco SRS, con dirección bidireccional (ES→IT producción, IT→ES
  comprensión) para todo el vocabulario suelto.
- Interleaving real (round-robin por lección, no aleatoriedad simple) en cada sesión de
  repaso.
- Progreso con racha, XP, nivel CEFR por lección, y calendario de próximos repasos.
- Instalabilidad confirmada vía Chrome DevTools Protocol (no solo por inspección del
  manifest).

**TODO priorizado para la próxima sesión/loop:**
1. **Desplegar sobre HTTPS real** (GitHub Pages/Netlify/Vercel) — todo lo verificado hasta
   ahora fue sobre `localhost`; sin esto no se puede instalar de verdad en un celular.
2. Unidad 7+ A1: negación explícita con "non" (ya insinuada en la Unidad 6), o vocabulario
   de lugares/direcciones. Seguir en espiral, reforzando gramática ya vista donde se pueda.
3. Ítems SRS bidireccionales para los drills de conjugación de verbos de alta frecuencia
   (hoy solo el vocabulario suelto tiene ambas direcciones).
4. Progresar hacia A2 una vez A1 tenga cobertura más amplia (CLAUDE.md pide progresión
   completa A1→C2 a largo plazo; hoy todo el contenido es A1).
5. Considerar exportar/backup del progreso (hoy vive solo en `localStorage` del dispositivo;
   si el usuario cambia de celular pierde el historial SRS).
6. Revisar accesibilidad básica (contraste, tamaños táctiles) — no se auditó explícitamente
   en esta sesión, aunque el diseño mobile-first ya apunta en esa dirección.

**Cierre del loop:** esta sesión de loop automático (cron de 10 min, ID `8734ee60`) termina
acá según lo indicado en `TASK.md` — ventana 13:56→15:30 cumplida. No se programa un nuevo
ciclo de mejora después de este commit.

---

## Sesión interactiva post-loop — 2026-07-15 ~16:30 (feedback directo del usuario)

El usuario probó la app y reportó, con capturas, dos problemas de usabilidad reales en la
pantalla de Repaso/ejercicios: (1) ningún ítem decía qué se esperaba responder (ni "completá
el hueco" ni "traducí" ni nada — solo la frase pelada), y (2) pidió que títulos/instrucciones
pasen a italiano para inmersión, y pronunciación (audio si se podía, si no fonética).

Se preguntó al usuario el nivel de inmersión deseado (para no arriesgar instrucciones 100%
en italiano que un A1 real no podría entender, empeorando el problema reportado) y el
formato de pronunciación. Eligió: **"Italiano con apoyo"** (consigna en italiano + gloss
chico en español debajo, siempre visible) y **"Audio + fonética siempre visible"**.

**Qué se hizo:**
1. `js/content.js`: diccionario `phonetics: {...}` por lección (claves en minúscula, guía
   simple no-IPA pensada para hispanohablantes, ej. "Come ti chiami?" → "KO-me ti KIA-mi?")
   cubriendo diálogos, tablas de conjugación y respuestas de ejercicios de las 6 lecciones.
2. `js/app.js`:
   - `speakItalian(text)`: Web Speech API (`SpeechSynthesisUtterance`, `lang: 'it-IT'`) —
     nativa del navegador, cero dependencias nuevas, funciona offline en la mayoría de OS.
   - `speakerBtn()` + delegación de eventos (`data-speak` en vez de `onclick` inline, para
     no romper con comillas simples como en "un po' d'italiano").
   - `phoneticFor()` / `italianWithAudio()`: helper reusable que muestra el texto + 🔊 +
     fonética si existe en el diccionario de la lección (fallback gracioso si no existe).
   - `INSTRUCTIONS` + `instructionLine()`: consigna según el tipo de ítem (`fill` →
     "Completa lo spazio vuoto." / `translate` → "Traduci in italiano." / `recognize` →
     "Cosa significa? Rispondi in spagnolo."), con gloss en español. Esto resuelve
     directamente el bug reportado.
   - Los ítems SRS ahora guardan `meta.kind` (fill/translate/recognize) para que la
     pantalla de Repaso sepa qué consigna mostrar sin adivinar.
   - Prácticamente todo el copy de UI (botones, títulos de pantalla, mensajes) pasó a
     italiano con `gloss(it, es)` — un helper que renderiza el texto en italiano y una
     traducción chica gris debajo.
3. `css/style.css`: estilos para `.gloss`, `.instruction`, `.it-audio`, `.speaker-btn`,
   `.phonetic`.

**Verificado con Playwright**: las 6 lecciones se completan de punta a punta (43 ítems SRS
sin cambios), la pantalla de ejercicio muestra la instrucción arriba del prompt, el feedback
incorrecto muestra la respuesta correcta con audio, la pantalla de Repaso muestra instrucción
+ audio + fonética para ítems `recognize` (el caso exacto reportado por el usuario — "Come ti
chiami?"/"Prendere" ahora traen consigna + 🔊 + fonética). Se verificó además que el botón de
audio efectivamente llama a `speechSynthesis.speak()` con el texto y `lang: 'it-IT'`
correctos. 0 errores de consola en todo el recorrido. Capturas revisadas visualmente.

**Pendiente / decisiones a revisar más adelante:**
- La fonética se escribió a mano por lección (no hay generador automático) — es preciso
  pero no escala solo; cada lección nueva necesita su propio diccionario `phonetics`.
- El audio depende de que el navegador/SO tenga una voz italiana instalada — no se verificó
  en un dispositivo real (Playwright/Chromium headless no reproduce audio real, solo se
  confirmó que la llamada a la API se dispara correctamente).
- Con "Italiano con apoyo" elegido, casi toda la UI quedó bilingüe (más texto en pantalla)
  — si en el futuro el usuario nota que se siente sobrecargada, la opción "Full italiano"
  o volver a mayormente-español queda como ajuste de una sola variable de diseño (los
  helpers `gloss()`/`instructionLine()` ya centralizan el patrón).

### Fix inmediato — mismo día, el usuario reportó dos problemas más sobre lo recién hecho

1. **Service worker sirviendo versión vieja**: el usuario vio una captura sin la
   instrucción recién agregada — el `service-worker.js` (cache-first, `CACHE_NAME =
   'italiano-v1'` desde el ciclo 1) seguía sirviendo `app.js`/`content.js`/`style.css`
   cacheados de antes del cambio. Aprendizaje importante para memoria futura: **cada vez
   que se toquen archivos listados en `ASSETS` de `service-worker.js`, hay que bumpear
   `CACHE_NAME`** (ahora `italiano-v2`), si no el cache-first sirve contenido stale
   indefinidamente sin que haya ningún error visible — se ve como si el cambio no se
   hubiera aplicado. `skipWaiting()`/`clients.claim()` ya estaban, así que alcanza con
   bumpear el nombre; el usuario puede necesitar un refresh extra para que el nuevo SW
   tome control.
2. **Consigna de "fill" seguía ambigua**: aunque ya decía "Completá el espacio en blanco",
   no aclaraba si había que escribir toda la frase o solo la palabra faltante. Se cambió a
   "Escribí solo la palabra que falta (no la frase entera)." / it: "Scrivi solo la parola
   mancante (non l'intera frase)."

Verificado con Playwright que la nueva consigna se renderiza. Lección aprendida guardada
arriba para no repetir el olvido del cache-bump en futuras ediciones de `app.js`/
`content.js`/`css/style.css`.

### Fix — "repetir la lección" no funcionaba

El usuario pidió poder repetir la Unidad 1 ya completada. El botón "Ripassa la lezione"
en Home ya existía desde el ciclo 2, pero tenía un bug real: `renderLesson(id)` solo
reseteaba `lessonState` (variable de módulo, no persistida) si `lessonId` cambiaba — al
repetir la MISMA lección dentro de la misma sesión de página, `lessonState.step` seguía en
`'done'` de la vez anterior, así que el flujo saltaba directo a la pantalla "lección
completa" en vez de arrancar del diálogo.

Primer intento (resetear también cuando `step === 'done'`) rompió el flujo normal: al
completar una lección por primera vez, el propio código interno pone `step='done'` y
vuelve a llamar a `renderRoute()` con el mismo id — con ese chequeo, eso también gatillaba
un reset y la pantalla de "lección completa" nunca llegaba a mostrarse.

Fix correcto: función dedicada `startLesson(id)` que resetea `lessonState` a fresco *solo*
cuando el usuario pide explícitamente (re)empezar desde Home, en vez de inferirlo del
estado. El botón de Home ahora llama `startLesson(lesson.id)` en vez de `go('lesson', ...)`
directo. `renderLesson()` interno vuelve a su lógica original (solo resetea si cambia el
`lessonId`), así que el flujo de completar una lección por primera vez no se toca.

Verificado con Playwright: repetir la Unidad 1 vuelve al diálogo, completarla de nuevo SÍ
llega a "Lezione completata", y los ítems SRS no se duplican (7 antes y después — `initItem`
ya era idempotente). Regresión completa de las 6 lecciones sigue en 43 ítems, 0 errores.

`CACHE_NAME` del service worker subido a `italiano-v3` por este cambio (ver nota de arriba
sobre bumpear el cache en cada edición de `app.js`).

### Fix de raíz al problema recurrente de cache + dos pedidos más del usuario

El usuario volvió a ver la versión vieja (sin gloss, sin audio) pese al bump de cache y el
aviso de hacer hard-refresh — el "acordate de recargar fuerte" no es una solución real.
Se resolvió de raíz en vez de seguir pidiendo hard-refresh manual:

1. **`service-worker.js` reescrito con estrategia mixta**: el app shell (`index.html`,
   `manifest.json`, `css/style.css`, `js/*.js` — todo lo que cambia seguido durante
   desarrollo activo) pasa a **network-first** (pide red primero, cae a cache solo si no
   hay conexión). Los íconos (que casi no cambian) siguen **cache-first**. Esto elimina la
   clase de bug completa: ya no depende de que alguien se acuerde de bumpear `CACHE_NAME`
   ni de que el usuario haga hard-refresh — con conexión, siempre se sirve lo último.
   `CACHE_NAME` → `italiano-v4`.
2. **Auto-reload en `index.html`**: se agregó un listener de
   `navigator.serviceWorker.addEventListener('controllerchange', ...)` que recarga la
   página una sola vez cuando un service worker nuevo toma control (patrón estándar del
   "Offline Cookbook" de Google) — refuerza el fix anterior para el caso de que el usuario
   ya tenga la pestaña abierta desde antes de la actualización.
3. **Botón "Atrás" (pedido explícito)**: antes solo existía "← Salir" (que saca de la
   lección por completo). Se agregó `backTo(step)` + un link "↩ Indietro / Atrás" en las
   pantallas de gramática (vuelve al diálogo) y ejercicios (vuelve a gramática), sin perder
   el progreso ya hecho (`exIndex`/`answered` no se tocan). Nuevo `.top-bar-left` en CSS
   para agrupar Salir+Atrás sin romper el layout existente.
4. **Ícono de audio**: no era un bug de código (ya funcionaba, verificado con capturas en
   el ciclo anterior) — era el mismo problema de cache sirviendo la versión sin la
   funcionalidad. Se resuelve solo con el fix #1.

Verificado con Playwright: SW controla la página (`navigator.serviceWorker.controller`
no nulo), un reload normal (no hard-refresh) sirve contenido actualizado, audio+fonética
visibles en diálogo y tabla de gramática, botón Atrás funciona en ambas direcciones sin
perder progreso, regresión completa de 6 lecciones/43 ítems sigue en verde, 0 errores de
consola.

---

## Multi-idioma: se agrega Portugués + selector al iniciar

Pedido del usuario: "añade portugués a la aplicación, quiero que al iniciar pueda escoger
que idioma quiero aprender". Esto cambió la arquitectura de fondo — la app pasó de ser
"la app de italiano" a "la app de idiomas, con cursos". Cambios:

**1. `js/content.js` reestructurado**: `CONTENT.lessons` (flat, solo italiano) →
`COURSES = { it: {code, name, flag, speechLang, lessons}, pt: {...} }`. Las 6 lecciones de
italiano se movieron sin cambios de contenido bajo `COURSES.it.lessons`. Se agregaron
**2 lecciones de portugués** (`COURSES.pt.lessons`), mismo formato exacto que las
italianas (dialogue/phonetics/glossary/grammar/exercises con srsFront/srsBack/reverseFront/
reverseBack):
  - Unidad 1 "Cumprimentos e apresentações" — verbo "ser" (a diferencia del italiano, que
    no distingue ser/estar, el portugués sí — igual que el español: soy→sou, es→é,
    somos→somos, son→são. Transferencia casi directa, se explicita en la gramática).
  - Unidad 2 "A família" — verbo "ter" (tener), mismo patrón pedagógico que "avere" en
    italiano: contraste explícito con "ser" para no confundirlos.
  - Se renombró el campo `glossary[].it` → `glossary[].target` (nombre genérico: antes
    tenía sentido porque solo existía italiano, ahora sería confuso con el código "it").
  - Fonética simple (mismo estilo "no IPA" que italiano) escrita a mano para el portugués
    brasileño, incluyendo el rasgo distintivo de palatalización (te→tchi, di→dji) y vocales
    nasales (ão→ÃUN) — con la misma salvedad de que es una guía aproximada, no IPA.

**2. `js/srs.js` multi-curso**: nueva `SRS.setCourse(code)` que carga/guarda el estado en
una clave de localStorage separada por curso — `italiano_srs_v1` para 'it' (se conserva el
nombre histórico para no perder progreso de quien ya usaba la app) e
`idiomas_srs_v1_<code>` para los demás. Cada idioma tiene su propia racha, XP, ítems y
lecciones completadas, totalmente independientes. Todas las funciones internas pasaron de
recibir `state` como parámetro a usar la variable de closure (ya la tenían, se limpió la
redundancia).

**3. Pantalla de selección de idioma (`js/app.js`)**: nueva `renderChooseLanguage()` — se
muestra automáticamente si no hay curso guardado en localStorage (`idiomas_course_v1`).
`selectCourse(code)` guarda la preferencia, llama a `SRS.setCourse(code)`, resetea el
estado de lección/repaso en memoria (para no arrastrar el de un curso a otro) y va a Home.
Un ícono 🌐 en el top-bar de Home (`openLanguagePicker()`) permite cambiar de idioma en
cualquier momento sin perder el progreso de ningún curso — cada uno vive en su propia
clave de storage, así que cambiar y volver no borra nada.

**4. Toda la UI traducida a diccionario bilingüe por curso**: se creó `UI = { it: {...},
pt: {...} }` con ~35 strings de interfaz (saludos, botones, mensajes, etiquetas) más
`INSTRUCTIONS` (consignas fill/translate/recognize) también por curso — antes estaban
hardcodeadas en italiano. Helper `ui(key, ...args)` arma el bloque con gloss(target, es)
listo para insertar; `uiRaw(key)` para atributos sin HTML (placeholder). `wordWithAudio()`
(antes `italianWithAudio()`) ahora usa `currentCourse().speechLang` para el botón de audio,
así que cada curso habla con la voz/idioma correcto (it-IT vs pt-BR).

**5. `manifest.json` e `index.html`**: nombre/título pasaron de "Italiano — Aprende de
verdad" a "Idiomas — Aprende de verdad" (ya no aplica solo a un idioma). **Pendiente**: los
íconos (`icons/*.png`) siguen con la estética de bandera italiana (verde/blanco/rojo) —
no se regeneraron en este cambio; sería lo próximo para que la marca no favorezca
visualmente a un solo curso.

**6. `service-worker.js`**: `CACHE_NAME` → `italiano-v5` (cambiaron `app.js`, `content.js`,
`srs.js`, `manifest.json`, `index.html`).

**Verificado con Playwright**:
- Estado fresco (sin curso guardado) → aparece el picker con Italiano y Português.
- Elegir Italiano → Home en italiano, se completa la Unidad 1 → 7 ítems en
  `italiano_srs_v1`.
- Cambiar de idioma (ícono 🌐) → picker de nuevo → elegir Português → Home en portugués,
  vocabulario/gramática/ejercicios en portugués con audio (`lang=pt-BR`) y fonética
  correctos → se completa la Unidad 1 → 7 ítems en `idiomas_srs_v1_pt`, **el banco
  italiano queda en 7 sin tocarse**.
- Volver a Italiano → la Unidad 1 sigue marcada completa, el audio vuelve a `lang=it-IT`.
- Regresión completa de las 6 lecciones de italiano (43 ítems, repaso, progreso) sigue en
  verde después del refactor grande de `app.js`.
- 0 errores de consola en todo el recorrido.

**Pendiente para próximos ciclos (por impacto):**
- Portugués solo tiene 2 lecciones vs. las 6 del italiano — ampliar para emparejar
  cobertura (edad/números, primer verbo regular -ar como "falar", etc.), siguiendo el
  mismo patrón de currículo en espiral ya usado en italiano.
- Íconos de la PWA siguen con estética de bandera italiana — regenerar con algo neutral
  (o un ícono por idioma) para que la marca no favorezca a un curso sobre otro.
- El campo `speechLang` de cada curso asume una sola variante (pt-BR, no pt-PT) — está
  bien documentado en el código pero no es configurable desde la UI.

## Ciclo: Botón de audio en toda la app (no solo lecciones)

Pedido del usuario: "quiero que todos los textos tengan la opción de escuchar como se
dice, no solo en las lecciones sino en todo". Antes, `speakerBtn()` solo aparecía en
diálogo/glosario/tabla de gramática/feedback de ejercicio — Home, Progreso y Repaso no
tenían audio en absoluto (ni siquiera el saludo o los títulos de las tarjetas).

**Decisión de diseño clave**: `speakerBtn()` pasó de `<button>` a `<span role="button"
tabindex="0">`. Motivo: al extender el audio a toda la app, muchos textos con audio ahora
podían terminar dentro de un `<button>`/`<a>` ya clickeable (ej. el título de una lección
en su tarjeta de Home, que está dentro del `<button onclick="startLesson(...)">`). Un
`<button>` anidado dentro de otro es HTML inválido y el navegador lo reordena de forma
impredecible — con `<span role="button">` no hay ese problema. Se agregó manejo de
teclado (Enter/Espacio) para no perder accesibilidad al dejar de ser un `<button>` real.

**Dónde SÍ se agregó audio** (título/párrafo/label, nada clickeable): saludo y tagline de
Home, título de la tarjeta de repaso y su mensaje, título de cada lección en su tarjeta,
título de lección dentro de la lección (paso diálogo), "Vocabulario nuevo", consigna de
cada ejercicio (`instructionLine`) y el prompt mismo, feedback de correcto/incorrecto
(lección y repaso), título y mensaje de lección completa / repaso terminado, y todo
Progreso (streak, ítems aprendidos, nivel CEFR, título de cada lección en la lista,
repasos pendientes).

**Dónde NO se agregó** (deliberado): dentro de botones/links reales — "Verifica",
"Continuar", "Salir", "Atrás", "Empezar lección", "Ver mi progreso", los botones de
Fácil/Bien/Difícil, etc. Ponerle audio ahí haría que tocar 🔊 también dispare la acción
del botón padre (el click burbujea). Se agregó `event.stopPropagation()` en el handler
de `.speaker-btn` como defensa adicional, pero la regla de fondo es "no lo pongas dentro
de un elemento clickeable" — más simple y predecible que depender solo de stopPropagation.
Se separó `ui()` (sin audio, para botones) de `uiSpeak()` (con audio, para todo lo demás)
para que quede explícito en cada call site cuál corresponde.

**Verificado con Playwright**: 11 botones de audio en Home, 12 en Progreso, audio en
diálogo/gramática/prompt de ejercicio/instrucción de repaso/feedback; click en audio de
una tarjeta de lección NO navega a la lección; click en audio de la instrucción de repaso
NO envía la respuesta. Regresión completa de italiano (43 ítems, repaso, progreso) sigue
en verde. 0 errores de consola.

`service-worker.js` → `CACHE_NAME` a `italiano-v6` (cambiaron `app.js` y `style.css`).

## Loop automático — 2026-08-07 13:43→14:44 (cron 5 min, ID `339163eb`, foco: portugués)

Pedido del usuario: loop de 1 hora mejorando específicamente el curso de **portugués**
(más lecciones, mejor SRS, input comprensible, producción activa), sin perder el objetivo
de superar a Duolingo. Cron session-only cada 5 min con auto-corte a las 14:44 (el propio
prompt del cron se revisa la hora y se autodestruye con `CronDelete` al llegar la hora).

### Ciclo 1 — 2026-08-07 ~13:44-13:52
**Mejora elegida:** Unidad 3 A1 de portugués — "A idade e os números" (edad y números
0-10), mismo patrón que la Unidad 3 de italiano.

**Por qué esta:** era el pendiente de mayor impacto ya identificado en la sesión anterior
("Portugués solo tiene 2 lecciones vs. las 6 del italiano"). Currículo en espiral: reusa
el verbo "ter" recién enseñado en la Unidad 2 con el patrón "ter ... anos" (igual que
"avere ... anni" en italiano y "tener años" en español — transferencia directa), en vez de
introducir vocabulario aislado. También amplía a 3 el pool de lecciones de portugués para
que el interleaving round-robin (ya implementado en `app.js`, genérico por curso) tenga
más con qué mezclar — antes con 2 lecciones el round-robin era poco notorio.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u3_idade` (dialogue, phonetics estilo "no IPA" para
  hispanohablantes, glossary, tabla de números 0-10, grammar explicando "ter...anos" con
  nota de transferencia y del plural "anos" desde 2 en adelante, 5 ejercicios: 2 fill
  reforzando "ter", 3 translate bidireccional ES↔PT incluyendo el cognado exacto
  "cinco"=="cinco").
- Sin cambios en `app.js`/`srs.js` — arquitectura genérica multi-curso desde la sesión
  anterior absorbe la lección nueva sin tocar lógica.
- `service-worker.js` → `CACHE_NAME` a `italiano-v7` (cambió `content.js`; lección
  aprendida en sesiones previas: bumpear siempre que cambie algo en `ASSETS`, si no el
  service worker network-first igual sirve la red primero así que el riesgo es menor que
  antes del fix de raíz, pero se bumpea de todas formas por consistencia).

**Verificación (sin Playwright disponible en este entorno no interactivo — no hay
node/npx en PATH):** se hizo un check de balance de llaves/corchetes/paréntesis en Python
respetando strings literales sobre todo `content.js` tras el edit (balance final y mínimo
en 0 para los tres tipos de delimitador) — confirma que la estructura del objeto `COURSES`
sigue siendo sintácticamente válida. Se verificaron a mano los 3 IDs de lección de
portugués (únicos: `pt_a1_u1_cumprimentos`, `pt_a1_u2_familia`, `pt_a1_u3_idade`). **No se
pudo hacer verificación end-to-end en navegador esta vez** — pendiente confirmarlo con
Playwright en la próxima sesión interactiva que tenga node disponible.

**Pendiente para el próximo ciclo del loop (por impacto):**
- Unidad 4 de portugués: primer verbo regular en -ar (ej. "falar"), mismo rol pedagógico
  que "parlare" tuvo para italiano (contraste irregular ter/ser vs. patrón regular).
- Ítems SRS de portugués con dirección inversa en los drills `fill` de conjugación — hoy
  igual que en italiano, solo `translate` tiene bidireccionalidad.
- Confirmar si hay algún entorno con node/Playwright accesible para retomar la
  verificación end-to-end automática en los próximos ciclos del loop.

### Ciclo 2 — 2026-08-07 ~13:49-13:56
**Mejora elegida:** Unidad 4 A1 de portugués — "Que línguas você fala?" (primer verbo
regular en -ar: "falar"), el pendiente #1 dejado por el ciclo 1.

**Por qué esta:** portugués tenía "ser" y "ter" (ambos irregulares) sin ningún contraste
con un patrón *regular* todavía, mientras que italiano ya tenía las 3 conjugaciones
regulares completas desde el ciclo 6 de la sesión de julio. "Falar" cumple exactamente el
mismo rol pedagógico que tuvo "parlare" para italiano: en vez de sumar un cuarto verbo
irregular aislado para memorizar, enseña una terminación (-ar) que generaliza a cientos de
verbos (morar, estudar, escutar...) — alto apalancamiento con poco contenido nuevo. También
suma la 4ª lección al pool de portugués (italiano llegó a este punto — 4 lecciones — en su
ciclo 6).

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u4_falar` (dialogue sobre idiomas que se hablan,
  phonetics, glossary con "Legal!" como cognado cultural de aprobación, tabla de
  conjugación -ar completa contrastada explícitamente con "parlare" del italiano y con el
  español "hablo/hablas/habla" en la explicación de gramática, 5 ejercicios: 3 fill de
  conjugación + 2 translate bidireccional ES↔PT).
- Sin cambios en `app.js`/`srs.js` — igual que en el ciclo 1, la arquitectura genérica
  absorbe la lección sin tocar lógica.
- `service-worker.js` → `CACHE_NAME` a `italiano-v8` (cambió `content.js`).

**Verificación:** mismo método que el ciclo 1 (no hay node/Playwright en este entorno) —
check de balance de llaves/corchetes/paréntesis en Python respetando strings, balance
final y mínimo en 0 para los tres delimitadores tras el edit. Se confirmaron a mano los 4
IDs de lección de portugués, todos únicos (`pt_a1_u1_cumprimentos`, `pt_a1_u2_familia`,
`pt_a1_u3_idade`, `pt_a1_u4_falar`). **Sigue pendiente la verificación end-to-end en
navegador** (Playwright) en la próxima sesión interactiva.

**Pendiente para el próximo ciclo del loop (por impacto):**
- Portugués (4 lecciones) todavía no alcanza la cobertura de italiano (6) — considerar una
  Unidad 5 con el segundo patrón regular (-er, ej. "comer"/"beber", paralelo a "prendere"
  en italiano) o el shuffle round-robin ya se beneficia de más lecciones para mezclar.
- Ítems SRS de portugués con dirección inversa en los drills `fill` de conjugación — sigue
  igual que en italiano, solo `translate` tiene bidireccionalidad (no es un bug, es una
  decisión de diseño ya documentada arriba: los drills de conjugación ya cubren las
  personas relevantes, duplicarlos no añade señal — revisar si aplica igual a portugués).
- Confirmar verificación end-to-end en navegador (Playwright) en cuanto haya un entorno con
  node disponible — pendiente desde el ciclo 1.

### Ciclo 3 — 2026-08-07 ~13:53-14:00
**Mejora elegida:** Unidad 5 A1 de portugués — "O que você quer comer?" (segundo verbo
regular: "comer", patrón -er).

**Por qué esta:** cierra el segundo patrón regular en portugués, exactamente el mismo rol
que tuvo "prendere" (-ere) para italiano en su ciclo 7 — contraste explícito con -ar
(falar, Unidad 4 de este mismo loop) en vez de contenido temático desconectado. Contexto
de pedir comida (alta frecuencia de uso real), y el infinitivo "comer" es un cognado
idéntico al español, lo cual reduce la carga cognitiva del ítem nuevo.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u5_comer` (dialogue pidiendo comida, phonetics,
  glossary, tabla de conjugación -er contrastada explícitamente con -ar en la explicación
  de gramática, 5 ejercicios: 3 fill de conjugación + 2 translate bidireccional ES↔PT).
- Sin cambios en `app.js`/`srs.js`.
- `service-worker.js` → `CACHE_NAME` a `italiano-v9`.

**Verificación:** mismo método que ciclos 1-2 (check de balance de llaves/corchetes/
paréntesis en Python respetando strings) — balance final y mínimo en 0 tras el edit. Los 5
IDs de lección de portugués son únicos (`pt_a1_u1_cumprimentos` … `pt_a1_u5_comer`).
Verificación end-to-end en navegador sigue pendiente (sin node/Playwright en este entorno).

**Estado del pool de portugués a esta altura:** 5 lecciones (saludos/ser, familia/ter,
edad-números/ter, primer verbo regular -ar, segundo verbo regular -er) — mismo punto en el
que estaba italiano tras su ciclo 8 (julio), a falta de la Unidad 6 con el tercer patrón
-ir para emparejar cobertura completa con italiano (6 lecciones).

**Pendiente para el próximo ciclo del loop (por impacto):**
- Unidad 6 de portugués: tercer patrón regular -ir (ej. "abrir"/"assistir"), paralelo a
  "dormire" en italiano — cerraría el trío -ar/-er/-ir y emparejaría la cobertura de
  lecciones con italiano (6 y 6).
- Ítems SRS bidireccionales en drills `fill` de conjugación — pendiente de evaluar, sigue
  igual desde el ciclo 2.
- Verificación end-to-end en navegador (Playwright) — pendiente desde el ciclo 1, sin
  entorno con node disponible todavía.

### Ciclo 4 — 2026-08-07 ~13:58-14:05
**Mejora elegida:** Unidad 6 A1 de portugués — "O que você assiste à noite?" (tercer
verbo regular: "assistir", patrón -ir).

**Por qué esta:** cierra el trío completo de patrones regulares del portugués (-ar/-er/-ir)
en paralelo exacto con -are/-ere/-ire de italiano — mismo rol que tuvo "dormire" para
italiano. **Con esta unidad, portugués alcanza 6 lecciones y empareja por primera vez la
cobertura de italiano (6 y 6)**, cerrando la brecha identificada al inicio de esta sesión
de loop ("Portugués solo tiene 2 lecciones vs. las 6 del italiano").

**Decisión de contenido:** se evitó "dormir" (el paralelo temático más obvio con "dormire")
porque en portugués es un verbo con cambio de raíz (durmo, no *dormo*) — no serviría como
ejemplo de conjugación *regular*. Se eligió "assistir" (ver/mirar series o películas,
totalmente regular) para mantener el foco pedagógico en el patrón, no en el vocabulario.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u6_assistir` (dialogue sobre hábitos de ocio,
  phonetics, glossary, tabla de conjugación -ir contrastada explícitamente con -ar/-er en
  la gramática, nota aclarando que "assistir" en portugués significa "ver/mirar" y no
  "asistir a un lugar" pese al cognado engañoso con el español, 5 ejercicios: 3 fill + 2
  translate bidireccional).
- Sin cambios en `app.js`/`srs.js`.
- `service-worker.js` → `CACHE_NAME` a `italiano-v10`.

**Verificación:** mismo método que ciclos 1-3 (balance de llaves/corchetes/paréntesis en
Python) — balance final y mínimo en 0. Los 6 IDs de lección de portugués son únicos
(`pt_a1_u1_cumprimentos` … `pt_a1_u6_assistir`). Verificación end-to-end en navegador
sigue pendiente (sin node/Playwright en este entorno no interactivo).

**Pendiente para el próximo ciclo del loop (por impacto, ahora que hay paridad 6 vs 6):**
- Con la brecha de cantidad cerrada, el siguiente foco de mayor impacto para portugués deja
  de ser "más lecciones" y pasa a profundidad/calidad: negación explícita con "não" (portugués
  la pospone igual que el italiano con "non", tema insinuado pero nunca explicado a fondo),
  o ítems SRS bidireccionales en los drills `fill` de las 3 conjugaciones regulares.
  Alternativa: Unidad 7 de portugués para adelantarse a italiano si el tiempo alcanza,
  siguiendo currículo en espiral (ej. números 11-20, o preposiciones básicas de lugar).
- Verificación end-to-end en navegador (Playwright) — sigue pendiente desde el ciclo 1.
- Revisar antes de la próxima sesión si vale la pena traer contenido de portugués a los
  niveles A2 (todo lo hecho en este loop, igual que italiano, es A1 puro).

### Ciclo 5 — 2026-08-07 ~14:03-14:10
**Mejora elegida:** Unidad 7 A1 de portugués — "Não, obrigada!" (negación explícita con
"não").

**Por qué esta:** con la paridad de cantidad ya lograda en el ciclo 4 (6 lecciones cada
curso), el pendiente de mayor impacto dejó de ser "sumar una lección más" y pasó a un gap
de calidad pedagógica real: CLAUDE.md principio #5 pide gramática explícita cuando ayuda,
y la negación (algo que un usuario A1 necesita desde el primer día para poder decir "no")
nunca tuvo lección propia ni siquiera en italiano — solo quedó insinuada en una nota de
glosario de la Unidad 6 de italiano. Se priorizó por sobre "adelantarse con más contenido
temático nuevo" porque cierra un hueco funcional real del curso, no solo agrega volumen.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u7_negacao` — refuerza los 5 verbos ya vistos
  (ser, ter, falar, comer, assistir) negándolos en vez de introducir vocabulario nuevo
  aislado (currículo en espiral, mismo criterio que las unidades anteriores de este loop).
  Explica el patrón de doble "não" en respuestas negativas ("Você fala francês? Não, não
  falo.") con nota explícita para que no se traduzca mal desde el español (que no dobla el
  "no" de esa forma). 5 ejercicios: 2 fill (rellenar con "não" en distinta posición
  gramatical) + 3 translate bidireccional.
- Sin cambios en `app.js`/`srs.js` — se verificó además que el renderer genérico de tablas
  de gramática (`renderGrammarStep` en `app.js:388`, `g.table.map(([p,f]) => ...)`) no
  asume que la tabla sea de conjugación (pronombre→forma); acepta cualquier par de strings,
  así que la tabla de ejemplos afirmativo→negativo de esta unidad se renderiza sin tocar
  código. `wordWithAudio()` hace fallback gracioso si una frase de la tabla no tiene
  entrada exacta en el diccionario `phonetics` (confirmado leyendo `phoneticFor`/
  `wordWithAudio` en `app.js:225-227`), así que no hace falta fonética para cada frase de
  ejemplo de la tabla, solo para las líneas de diálogo y vocabulario nuevo.
- `service-worker.js` → `CACHE_NAME` a `italiano-v11`.

**Verificación:** mismo método que ciclos 1-4 (balance de llaves/corchetes/paréntesis en
Python) — balance final y mínimo en 0. 7 IDs de lección de portugués, todos únicos.
Verificación end-to-end en navegador sigue pendiente (sin node/Playwright en este entorno).

**Estado a esta altura:** portugués ya tiene **7 lecciones, una más que las 6 de
italiano** — la sesión cumplió y superó el objetivo inicial de "emparejar cobertura".

**Pendiente para el próximo ciclo del loop (por impacto):**
- Ítems SRS bidireccionales en los drills `fill` de conjugación (pendiente desde el ciclo
  2, sigue sin resolverse — evaluar si de verdad aporta señal o es redundante como se
  concluyó para italiano).
- Con 7 lecciones ya activas, revisar si el `interleaveByLesson` (round-robin) sigue
  comportándose bien con un número impar/mayor de grupos — no debería requerir cambios de
  código (es genérico), pero no se verificó en navegador en este loop.
- Verificación end-to-end en navegador (Playwright) — sigue pendiente desde el ciclo 1, es
  el gap más importante de todo este loop: todo el contenido se verificó solo por balance
  de sintaxis, no por comportamiento real en la app.
- Si queda tiempo: números 11-20 o vocabulario de lugares/direcciones para portugués,
  siguiendo el mismo patrón de espiral curricular.

### Ciclo 6 — 2026-08-07 ~14:08-14:16 (sin agregar contenido — cierre del gap de verificación)
**Mejora elegida:** resolver el gap más repetido en los pendientes de los ciclos 1-5 —
"no hay Playwright/node en este entorno, todo el contenido se verificó solo por balance de
sintaxis" — en vez de sumar una octava lección sin haber confirmado que las 5 anteriores
de este loop funcionan de verdad en un navegador.

**Hallazgo importante: sí hay forma de verificar en este entorno**, solo que no es
Playwright/node (no instalados aquí) sino **Microsoft Edge headless**, que sí está en el
sistema (`/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`). Método
reutilizable para próximos ciclos/sesiones sin node disponible:
1. Servir el proyecto con `python -m http.server 8123` (Python 3.11 está en
   `/c/Users/kesan/AppData/Local/Programs/Python/Python311/python`, no en PATH de Git
   Bash — hay que usar la ruta completa).
2. Crear un HTML de arnés temporal (ej. `_test_pt.html`, **nunca commitear, borrar al
   terminar**) que carga `content.js`/`srs.js`/`app.js` en el mismo orden que
   `index.html`, pre-setea `localStorage.setItem('idiomas_course_v1', 'pt')` antes de
   cargarlos (evita el picker de idioma), y opcionalmente llama a `startLesson(id)` +
   fuerza `lessonState.step` para saltar directo a la pantalla que se quiere inspeccionar.
3. `msedge.exe --headless=new --disable-gpu --virtual-time-budget=4000
   --run-all-compositor-stages-before-draw --enable-logging=stderr --v=1 --dump-dom
   <url>` — el headless SÍ ejecuta el JS real (no es solo parseo estático), así que
   `--dump-dom` devuelve el DOM ya renderizado por `app.js`, y el log de stderr sirve para
   grepear `SyntaxError|ReferenceError|TypeError|Uncaught`.

**Qué se verificó con este método (0 errores de JS en todos los casos):**
- Home con curso 'pt' preseleccionado: las **7 lecciones** de portugués (ciclos 1-5 de
  este loop) aparecen con título, badge CEFR, gloss en español, botón de audio con
  `data-lang="pt-BR"` correcto, y fonética donde corresponde. Confirma que
  `js/content.js` no tiene errores de sintaxis reales (más allá del balance de brackets
  chequeado en ciclos previos) y que el pipeline completo `content.js→srs.js→app.js`
  bootea sin romperse con el nuevo contenido.
- Pantalla de diálogo de la Unidad 7 (negación): `startLesson('pt_a1_u7_negacao')`
  renderiza el diálogo João/Maria completo, con "não"/"novela"/"obrigada" presentes.
- Pantalla de gramática de la Unidad 7: la tabla de pares afirmativo→negativo (formato
  no estándar, primera vez que `grammar.table` no es pronombre→forma) se renderiza sin
  romper `renderGrammarStep()` — confirma que el renderer genérico (`g.table.map(([p,f])
  => ...)`, `app.js:388`) efectivamente no asume estructura de conjugación, como se había
  inferido leyendo el código en el ciclo 5, ahora confirmado en ejecución real.

**No se hizo en este ciclo (limitación del método, a diferencia de Playwright):**
sin interacción real de clicks/inputs, no se pudo probar el flujo completo de ejercicios
(escribir respuesta → feedback → ítem entrando al banco SRS) ni el ciclo de repaso — el
arnés solo fuerza `lessonState.step` directamente, no simula la interacción real del
usuario. Para esa cobertura completa sigue haciendo falta Playwright/node en una sesión
futura.

**Qué se hizo (archivos):** ninguno permanente — `_test_pt.html` se creó y se borró en
este mismo ciclo, no quedó rastro en el repo (`git status` limpio). No hay commit de
código para este ciclo porque no hubo cambios de código, solo verificación; sí se
commitea esta entrada de `memory.md`.

**Pendiente para el próximo ciclo del loop (por impacto):**
- Con la verificación de humo ya cubierta para las 7 lecciones existentes, retomar
  contenido: números 11-20, vocabulario de lugares/direcciones, o adelantar A2 si el
  tiempo restante del loop (vence 14:44) alcanza.
- El método de Edge headless queda documentado acá para reusar en sesiones futuras sin
  node — no reemplaza a Playwright para flujos con interacción real, pero cubre
  "¿el JS tiene errores de sintaxis/runtime reales, y el DOM se arma como se espera?"
  mucho mejor que el check de balance de brackets solo.

### Ciclo 7 — 2026-08-07 ~14:12-14:20
**Mejora elegida:** Unidad 8 A1 de portugués — "Quantos anos ele tem?" (números 11-20).

**Por qué esta:** retoma contenido nuevo ahora que el ciclo 6 cerró el gap de
verificación. Números 11-20 extiende directamente los números 0-10 (Unidad 3) y reutiliza
"ter ... anos" pero en tercera persona (hablar de la edad de otra persona, no solo la
propia) — currículo en espiral otra vez, más un punto gramatical genuinamente nuevo (cómo
el portugués arma 16-19 con "dez+e+unidad" en vez de fusionar la palabra como el español).
Ninguno de los dos cursos (italiano tampoco) tenía números más allá del 0-10, así que esto
amplía cobertura CEFR real, no solo repite el patrón de "un verbo más".

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u8_numeros2` (dialogue preguntando la edad de
  hermanos/as usando números más altos, phonetics, glossary con "Uau!" como interjección
  casi idéntica al español, tabla 11-20 con nota explícita del patrón "dez+e+unidad" para
  16-19, 5 ejercicios: 1 fill reforzando "ter" + 4 translate bidireccional incluyendo un
  número que NO sigue el patrón nuevo — "treze" — para que no se generalice mal la regla).
- `service-worker.js` → `CACHE_NAME` a `italiano-v12`.

**Verificación (con el método de Edge headless documentado en el ciclo 6):** arnés
temporal `_test_pt.html` (creado y borrado en este mismo ciclo, no quedó en el repo) que
precarga `idiomas_course_v1='pt'`, llama `startLesson('pt_a1_u8_numeros2')` y fuerza
`lessonState.step='grammar'`. `msedge.exe --headless=new --dump-dom` sobre
`python -m http.server 8123`: **0 errores de JS** en el log de consola, la tabla de
números 11-20 se renderiza completa con audio (`pt-BR`) y fonética correctos para las 10
entradas. También se re-confirmó el balance de llaves/corchetes/paréntesis en Python sobre
todo `content.js` (0/0/0) antes de la verificación en navegador.

**Estado a esta altura:** portugués tiene **8 lecciones** (saludos/ser, familia/ter,
edad-números 0-10/ter, -ar/falar, -er/comer, -ir/assistir, negación/não, números 11-20) —
2 más que las 6 de italiano, y con al menos un punto de gramática (negación) que italiano
ni siquiera cubrió con lección propia.

**Pendiente para el próximo ciclo del loop (por impacto):**
- Vocabulario de lugares/direcciones, o colores, para seguir ampliando cobertura léxica
  A1 si el tiempo alcanza (loop vence 14:44).
- Ítems SRS bidireccionales en drills `fill` de conjugación — sigue pendiente desde el
  ciclo 2, no resuelto en ningún ciclo de este loop todavía.
- Evaluar si con 8 lecciones ya conviene revisar el rendimiento/orden del
  `interleaveByLesson` en una sesión con Playwright real (el headless de Edge confirma que
  no rompe, pero no prueba el comportamiento interactivo del repaso).

### Ciclo 8 — 2026-08-07 ~14:17-14:25 (encontró y corrigió un bug real antes de commitear)
**Mejora elegida:** Unidad 9 A1 de portugués — "Onde fica o banco?" (lugares y
preposiciones básicas de ubicación).

**Por qué esta:** siguiente pendiente de la lista por impacto (vocabulario de
lugares/direcciones), con valor real de CEFR A1 ("puede preguntar y entender direcciones
simples"). Introduce "fica" (no "está") para ubicación de lugares fijos — un contraste
real con el español que vale la pena explicitar (principio #5 de CLAUDE.md), y
contracciones de preposición+artículo (perto do/da), tema gramatical genuinamente nuevo
para el curso de portugués.

**Bug real encontrado por la verificación (no solo "no rompe", sino "está mal"):** al
armar la tabla de gramática puse las columnas en el orden `[portugués, español]`
(ej. `['perto de', 'cerca de']`), pero el renderer genérico `renderGrammarStep()` en
`app.js:388` siempre pone el botón de audio (con `lang` del curso, acá `pt-BR`) sobre la
**segunda** columna — la convención implícita en todas las unidades anteriores (1-8) es
`[algo, forma_target]`. Con las columnas invertidas, el botón de audio iba a **leer texto
en español con voz de portugués** — un bug de UX real, no cosmético, que el check de
balance de brackets nunca podría haber detectado (es sintácticamente válido). Se encontró
al inspeccionar la tabla renderizada por Edge headless (`--dump-dom`) antes del commit y
notar que el `data-speak` del botón de audio decía "cerca de" en vez de "perto de". Se
corrigió invirtiendo el orden a `[español, portugués]`, y se re-verificó que el audio y la
fonética ahora coinciden con la columna correcta.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u9_lugares` (dialogue preguntando por el banco y
  la farmacia, phonetics, glossary de 4 lugares —todos cognados directos con el español—,
  tabla de preposiciones corregida tras el bug de arriba, 5 ejercicios: 2 fill + 3
  translate bidireccional).
- `service-worker.js` → `CACHE_NAME` a `italiano-v13`.

**Verificación:** balance de brackets en Python (0/0/0) + Edge headless con el mismo
arnés temporal de ciclos anteriores (`_test_pt.html`, creado y borrado en este ciclo) —
0 errores de JS en ambas corridas (antes y después del fix), tabla de gramática confirmada
visualmente correcta en la segunda corrida.

**Lección para memoria futura:** al escribir `grammar.table` para cualquier lección
nueva (de cualquier curso), **la segunda columna de cada par siempre debe ser la forma en
el idioma que se está aprendiendo** — es la que recibe audio automáticamente. Revisar esto
a simple vista no alcanza si el contenido "se ve bien"; conviene volver a correr la
verificación de Edge headless y mirar el `data-speak` real del botón de audio, no solo que
la tabla exista.

**Estado a esta altura:** portugués tiene **9 lecciones**.

**Pendiente para el próximo ciclo del loop (por impacto):**
- Revisar las tablas de gramática de las Unidades 1-8 de este mismo loop (idade/números,
  falar, comer, assistir, negación, números 11-20) para confirmar que ninguna quedó con el
  mismo problema de columnas invertidas — se armaron todas con `[pronombre/número,
  forma_target]`, que es el orden correcto, pero vale una pasada de confirmación rápida.
- Colores, o ampliar el vocabulario de lugares (Unidad 9) con más ejemplos si el tiempo
  alcanza.
- Ítems SRS bidireccionales en drills `fill` — sigue pendiente, no resuelto en este loop.

**Confirmación (hecha en el ciclo 9):** se revisaron a mano las 13 tablas de gramática de
`content.js` (6 italianas + 8 portuguesas de antes de este cambio) — todas con el orden
`[pronombre/número/afirmativo, forma_target]` correcto. El bug del ciclo 8 fue aislado a la
Unidad 9 de portugués y ya está corregido.

### Ciclo 9 — 2026-08-07 ~14:22-14:30
**Mejora elegida:** Unidad 10 A1 de portugués — "De que cor é?" (colores y concordancia de
género en adjetivos).

**Por qué esta:** siguiente pendiente de la lista (colores), pero elegida sobre todo por
su valor gramatical: los colores en portugués son el ejemplo más simple y frecuente para
enseñar concordancia de género en adjetivos (branco/branca, vermelho/vermelha vs.
verde/azul invariables) — mismo patrón que el español, así que la transferencia es casi
directa, pero vale explicitarlo (principio #5 de CLAUDE.md) para que el usuario generalice
la regla en vez de memorizar cada color suelto. Se agregó también una nota sobre "preto"
vs. "negro" (el segundo existe pero no es la palabra de uso cotidiano para el color de un
objeto en portugués brasileño) para prevenir un falso amigo de transferencia directa.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u10_cores` (dialogue sobre el color de una casa y
  un auto, phonetics, glossary, tabla de 6 colores con el orden de columnas `[ES, PT]`
  correcto desde el vamos —aplicando la lección del ciclo 8—, 5 ejercicios: 2 fill
  practicando la concordancia de género según el sustantivo + 3 translate bidireccional).
- `service-worker.js` → `CACHE_NAME` a `italiano-v14`.

**Verificación:** balance de brackets en Python (0/0/0) + Edge headless (mismo método,
arnés temporal creado y borrado en este ciclo) — 0 errores de JS, tabla de gramática
confirmada con `data-speak` en portugués en la columna correcta (ej. "branco/branca", no
"blanco/blanca") antes de commitear, aplicando directamente la lección del ciclo 8.

**Estado a esta altura:** portugués tiene **10 lecciones** — supera ampliamente el
objetivo inicial de "emparejar" a italiano (6), y ya cubre más terreno gramatical
explícito (negación, concordancia de género en adjetivos) que el curso de italiano en
este mismo repositorio.

**Pendiente para el próximo ciclo del loop (por impacto, quedan ~14 min antes de 14:44):**
- Ítems SRS bidireccionales en drills `fill` de conjugación — sigue sin resolverse en
  ningún ciclo de este loop; sería el pendiente de más impacto si alcanza el tiempo.
- Si no alcanza para eso, una lección más corta (ej. días de la semana, o repasar/ampliar
  colores con más ejemplos) es preferible a dejar algo a medio terminar cuando falte poco
  para las 14:44.
- Verificación end-to-end completa con Playwright real (clicks/inputs, no solo dump-dom)
  sigue pendiente para una sesión futura con node disponible.

### Ciclo 10 — 2026-08-07 ~14:27-14:34
**Mejora elegida:** Unidad 11 A1 de portugués — "Que dia é hoje?" (los días de la semana).

**Por qué esta y no la bidireccionalidad de SRS en `fill`:** con ~17 minutos restantes
antes del corte de las 14:44, se priorizó una lección acotada y de bajo riesgo (vocabulario
puro, sin cambios de código) por sobre abrir un cambio estructural en `srs.js`/`app.js`
(bidireccionalidad de ítems `fill`) que quedaría a medio verificar si el tiempo se corta a
mitad de camino — coherente con la nota del propio ciclo 9 de preferir cerrar algo completo
antes que dejar algo a medias cerca del límite de tiempo.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u11_dias` (dialogue corto preguntando el día,
  phonetics, glossary, tabla de los 7 días con el patrón numérico-ordinal explicado
  explícitamente —"-feira" derivado de número, empezando a contar desde el domingo—,
  contrastado con el español que no deriva los días de números, 5 ejercicios: 1 fill +
  4 translate bidireccional).
- `service-worker.js` → `CACHE_NAME` a `italiano-v15`.

**Verificación:** balance de brackets en Python (0/0/0) + Edge headless (mismo arnés
temporal, creado y borrado en este ciclo) — 0 errores de JS, tabla de gramática con los 7
días, audio (`pt-BR`) y fonética correctos en la columna target.

**Estado a esta altura:** portugués tiene **11 lecciones** (casi el doble de las 6 de
italiano), cubriendo saludos, familia, edad/números 0-20, las 3 conjugaciones regulares,
negación, lugares/preposiciones, colores/concordancia de género, y días de la semana.

**Pendiente para el próximo ciclo (si el loop sigue corriendo, vence 14:44):**
- Ítems SRS bidireccionales en drills `fill` — sigue siendo el pendiente estructural más
  importante no resuelto en todo este loop; requiere revisar `js/srs.js`/`app.js`, no solo
  `content.js`, así que conviene abordarlo con margen de tiempo completo, no sobre la hora.
- Verificación end-to-end con Playwright real (interacción de clicks/inputs) para toda la
  sesión de este loop (11 lecciones nuevas) — sigue pendiente para una sesión con node.
- Si el loop se corta acá: la sesión cumplió y superó ampliamente el objetivo original
  ("mejorá específicamente portugués, no hace falta mucho para superar a Duolingo") — 11
  lecciones nuevas, un bug de UX real encontrado y corregido antes de llegar a producción,
  y un método de verificación end-to-end documentado y reutilizable sin depender de node.

### Ciclo 11 — 2026-08-07 ~14:31-14:38
**Mejora elegida:** Unidad 12 A1 de portugués — "Bom dia!" (saludos según el momento del
día: bom dia/boa tarde/boa noite).

**Por qué esta:** con ~13 minutos restantes antes del corte de las 14:44, se mantuvo el
criterio del ciclo 10 (lección acotada y de bajo riesgo, sin tocar `srs.js`/`app.js`, para
no dejar nada a medio verificar si el tiempo se corta). Se eligió este tema porque reusa
directamente la concordancia de género recién enseñada en la Unidad 10 (colores:
branco/branca) aplicándola a los saludos de más alta frecuencia real del idioma — currículo
en espiral una vez más, y una pieza de vocabulario que un usuario A1 necesita literalmente
desde el primer intercambio con un hablante nativo.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u12_saudacoes2` (dialogue corto de saludo/despedida,
  phonetics, glossary con "Tudo bem?" como el saludo informal más usado en Brasil, tabla de
  5 expresiones con concordancia bom/boa explicada explícitamente, 5 ejercicios: 2 fill
  practicando bom vs. boa según el género + 3 translate bidireccional).
- `service-worker.js` → `CACHE_NAME` a `italiano-v16`.

**Verificación:** balance de brackets en Python (0/0/0) + Edge headless (arnés temporal
creado y borrado en este ciclo) — 0 errores de JS, tabla de gramática con audio/fonética
correctos en la columna target.

**Estado a esta altura:** portugués tiene **12 lecciones**, el doble de las 6 de italiano.

**Si este fue el último ciclo (loop vence 14:44):** el cron `339163eb` se autodestruye en
su próxima ejecución si ya pasó la hora, según la lógica embebida en su propio prompt (no
requiere acción manual). Resumen de la sesión completa de este loop (13:43→14:44, foco
portugués): **12 lecciones nuevas de portugués** (saludos, familia, edad/números 0-20, las
3 conjugaciones regulares completas, negación, lugares/preposiciones, colores/concordancia
de género, días de la semana, saludos por momento del día), **1 bug de UX real encontrado
y corregido antes de producción** (columnas de audio invertidas en una tabla de gramática,
ciclo 8), y **un método de verificación end-to-end sin node/Playwright documentado y
reusable** (Edge headless + `--dump-dom`, ciclo 6). Portugués pasó de 2 a 12 lecciones —
duplicó la cobertura de italiano y cubre más terreno gramatical explícito (negación,
concordancia de género) que el curso más viejo del repositorio.

### Ciclo 12 — 2026-08-07 ~14:36-14:41
**Mejora elegida:** Unidad 13 A1 de portugués — "Meus pais" (posesivos meu/minha,
seu/sua).

**Por qué esta:** con ~8 minutos restantes antes del corte, se mantuvo el criterio de los
ciclos 10-11 (lección acotada, sin tocar código de `srs.js`/`app.js`). Se explicita un
punto gramatical que ya se venía usando implícitamente desde la Unidad 2 ("seu irmão",
"sua irmã") sin nunca haberlo explicado — concordancia de posesivo con la cosa poseída
(no con quien posee), mismo patrón ya visto con los colores (Unidad 10) y los saludos por
momento del día (Unidad 12). Amplía además el vocabulario de familia (pai/mãe/pais) sobre
la Unidad 2, que solo cubría hermanos.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u13_pais` (dialogue preguntando por los padres,
  phonetics, glossary con nota sobre "moram" como repaso del patrón -ar ya conocido
  —"morar" no se explica de cero, se ancla a "falar" de la Unidad 4—, tabla de posesivos,
  5 ejercicios: 2 fill practicando meu/minha según el género + 3 translate bidireccional).
- `service-worker.js` → `CACHE_NAME` a `italiano-v17`.

**Verificación:** balance de brackets en Python (0/0/0) + Edge headless (arnés temporal
creado y borrado en este ciclo) — 0 errores de JS, tabla de posesivos con audio/fonética
correctos.

**Estado a esta altura:** portugués tiene **13 lecciones**, más del doble de las 6 de
italiano. Con ~3 minutos restantes antes de las 14:44, no se arranca una lección más para
no dejarla a medio verificar — el cron se autodetendrá solo en su próximo disparo según la
lógica ya embebida en su prompt.

**Resumen final de la sesión de loop (13:43→14:44, foco portugués), si este fue el
último ciclo:** **13 lecciones nuevas de portugués** en 12 ciclos de 5 minutos —
saludos×2 (presentación + momento del día), familia×2 (hermanos + padres/posesivos),
edad/números 0-20, las 3 conjugaciones regulares completas (-ar/-er/-ir), negación,
lugares/preposiciones, colores/concordancia de género, días de la semana. **1 bug de UX
real encontrado y corregido antes de producción** (audio leyendo el idioma equivocado por
columnas invertidas, ciclo 8). **Un método de verificación end-to-end sin
node/Playwright** documentado y reusado en 6 ciclos seguidos (Edge headless +
`--dump-dom`, desde el ciclo 6). Portugués pasó de 2 a 13 lecciones — más del doble de
italiano — y cubre gramática explícita (negación, concordancia de género en adjetivos y
posesivos) que ni el curso de italiano, más viejo, llegó a cubrir con lección propia.

### Ciclo 13 — 2026-08-07 ~14:41-14:45 (último ciclo — cierre del loop)
**Mejora elegida:** Unidad 14 A1 de portugués — "Quanto custa?" (precios y decenas 20-100).

**Por qué esta:** el disparo del cron llegó a las 14:41:24, todavía antes del corte de las
14:44, así que se arrancó una lección más siguiendo el mismo criterio de acotar alcance
(sin tocar `srs.js`/`app.js`). Amplía los números ya vistos (0-10 Unidad 3, 11-20 Unidad 8)
a las decenas hasta 100, en el contexto práctico de preguntar precios — descriptor CEFR A1
real ("puede preguntar/entender precios simples") — y reutiliza el patrón -ar ya conocido
("custa", de "custar", mismo esquema que "falar").

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u14_precos` (dialogue preguntando el precio de un
  libro y una camisa, phonetics, glossary, tabla de decenas 30-100, 5 ejercicios: 1 fill +
  4 translate bidireccional).
- `service-worker.js` → `CACHE_NAME` a `italiano-v18`.

**Verificación:** balance de brackets en Python (0/0/0) + Edge headless (arnés temporal
creado y borrado en este ciclo) — 0 errores de JS, tabla de decenas completa con
audio/fonética correctos, confirmado **antes** de cruzar la hora límite. El commit de
código se hizo a las ~14:45, ya cruzado el límite, porque el trabajo se había arrancado y
verificado por completo antes de las 14:44 — no tenía sentido descartar una lección ya
terminada y probada solo por el reloj de pared durante el commit.

**Cierre del loop:** con la hora ya en 14:45 (pasado el corte de las 14:44), este es el
último ciclo. Se detiene el cron `339163eb` con `CronDelete` a continuación, según lo
indicado en el prompt del propio job.

**Resumen final de la sesión completa (13:43→14:45, foco portugués, 13 ciclos):**
**14 lecciones nuevas de portugués** — saludos×2, familia×2 (hermanos + padres/posesivos),
edad/números 0-100, las 3 conjugaciones regulares completas (-ar/-er/-ir), negación,
lugares/preposiciones, colores/concordancia de género, días de la semana, precios/decenas.
**1 bug de UX real encontrado y corregido antes de producción** (audio con idioma
equivocado por columnas invertidas en una tabla de gramática, ciclo 8). **Un método de
verificación end-to-end sin node/Playwright** (Edge headless + `--dump-dom` +
`localStorage` preseteado + `startLesson()` forzado), documentado en el ciclo 6 y
reutilizado en 7 de los 13 ciclos. Portugués pasó de **2 a 14 lecciones** — más del doble
de las 6 de italiano — y cubre gramática explícita (negación, concordancia de género en
adjetivos y posesivos) que el curso de italiano, más antiguo en este repositorio, nunca
llegó a cubrir con lección propia. **Pendiente real para la próxima sesión:**
bidireccionalidad de ítems SRS en los drills `fill` de conjugación (nunca abordado en este
loop, requiere tocar `srs.js`/`app.js` con margen de tiempo completo) y verificación
end-to-end con Playwright real (interacción de clicks/inputs, no solo `--dump-dom`) para
las 14 lecciones nuevas.

## Sesión de loop de UX/estética (2026-08-07, ~14:57→~15:27-15:30, cron `70ae7c9b` cada 5 min)

**Objetivo de esta sesión:** el usuario pidió mejorar específicamente la UX y la estética
para que la app se parezca más a Duolingo (mandó 2 capturas de referencia: pantalla de ruta
de lecciones con nodos circulares tipo "isla" sobre un camino, y mockups con contador de
XP/racha, botones grandes redondeados en verde brillante, feedback visual claro). No tocar
`srs.js` salvo estricta necesidad — el foco es 100% visual/UX, no contenido ni algoritmo.

### Ciclo 1 — 2026-08-07 ~14:57-15:01
**Mejora elegida:** cambio de paleta y componentes base de tema oscuro (navy `#0d1b2a`) a
tema claro estilo Duolingo.

**Por qué esta primero:** era el gap más grande entre la app actual y las referencias — un
tema oscuro completo no se parece en nada a Duolingo (fondo blanco/gris muy claro, verde
brillante como color de marca). Antes de tocar estructura (path serpenteante con nodos,
mascota) hacía falta la base de color/tipografía/sombra correcta, porque todo lo demás se
construye encima.

**Qué se hizo:**
- `css/style.css`: reescritura completa de `:root` y componentes. Paleta nueva: verde
  `#58cc02`/`#4aa800` (Duolingo real), azul `#1cb0f6` (antes usado solo para acentos, ahora
  para links y badge CEFR), rojo `#ff4b4b`, fondo `#f7f7f7`, tarjetas blancas `#ffffff` con
  borde `2px solid #e5e5e5` y `box-shadow: 0 4px 0 var(--border)` (efecto de profundidad
  tipo Duolingo). Botones (`.btn`): más grandes, `border-radius:16px`, texto en mayúsculas
  y negrita, `box-shadow: 0 4px 0` del color oscuro correspondiente que **desaparece y el
  botón baja 4px en `:active`** (efecto "3D press" característico de Duolingo). Mismo
  patrón aplicado a `.btn.secondary`, `.btn.danger`, `.stat`, `.cefr-badge`.
- `manifest.json`: `background_color` a `#f7f7f7` y `theme_color` a `#58cc02` (antes navy
  oscuro y verde bandera italiana) para que coincidan con el tema nuevo.
- `index.html`: `<meta name="theme-color">` actualizado igual a `#58cc02`.
- `service-worker.js` → `CACHE_NAME` a `italiano-v19`.

**No se tocó:** estructura HTML/DOM en `js/app.js` (la lista de lecciones sigue siendo
tarjetas verticales, no un path con nodos todavía — eso queda para un ciclo futuro si el
tiempo alcanza) ni `js/srs.js`.

**Verificación:** `python -m http.server 8791` + Edge headless. **El flag `--screenshot`
falló de forma consistente en este entorno** (crash del proceso de render/GPU incluso con
`--disable-gpu --disable-software-rasterizer --no-sandbox`, probado 3 veces) — limitación
del entorno, no del código. Se usó en su lugar el método ya documentado en el ciclo 6 de la
sesión anterior: `--headless=new --dump-dom` sobre el `index.html` servido — **0 errores de
JS** en el log de stderr (`SyntaxError|ReferenceError|TypeError|Uncaught` sin matches), y el
DOM renderizado confirma que las clases nuevas (`.btn`, `.lang-card`, `.lang-picker`) se
aplican correctamente sobre la pantalla de selección de idioma (primera pantalla que ve un
usuario nuevo sin curso elegido en `localStorage`). La verificación visual de color/sombra
real (screenshot) queda pendiente de un entorno que soporte el render headless con GPU —
para los próximos ciclos de esta sesión, documentar el mismo intento y si sigue fallando no
insistir más de una vez por ciclo (para no gastar el ciclo de 5 min en reintentos).

**Pendiente para el próximo ciclo de esta sesión (por impacto):**
- Header/top-bar tipo Duolingo real: racha con ícono de fuego más prominente, contador de
  XP visible, quizás corazones/vidas — hoy `.top-bar` es texto chico gris.
- Tarjetas de lección en Home como un "path" serpenteante con nodos circulares (hoy son
  tarjetas verticales apiladas) — cambio más grande, toca `js/app.js` (`renderHome`), no
  solo CSS.
- Animación de feedback correcto/incorrecto (shake al fallar, check animado al acertar) —
  hoy `.feedback` es solo un cambio de color estático.
- Mascota/personaje ilustrado — no hay ninguno hoy; evaluar si usar un emoji grande como
  placeholder liviano (sin assets pesados, PWA debe cargar rápido) en vez de una imagen.
- Confirmar de nuevo si el screenshot headless funciona en el próximo ciclo antes de asumir
  que sigue roto.

### Ciclo 2 — 2026-08-07 ~15:03-15:08
**Mejora elegida:** header de Home con "stat chips" tipo Duolingo (racha 🔥 y XP ⚡ como
píldoras con color propio) en vez del texto plano gris que había.

**Por qué esta:** era la mejora #1 de la lista pendiente del ciclo 1 y la de menor riesgo
estructural (toca `renderHome` en `js/app.js`, no la lista completa de lecciones). Duolingo
muestra siempre racha/XP/vidas como chips prominentes arriba — hoy la app ya trackea
`progress.xp` en `srs.js` pero nunca lo mostraba en ninguna pantalla.

**Qué se hizo:**
- `js/app.js` (`renderHome`): el `.top-bar` ahora tiene `.stat-chips` con dos píldoras
  (`.streak-chip` con 🔥 y el número de racha, `.xp-chip` con ⚡ y `progress.xp`) más el
  selector de idioma (`.lang-switch`) como una tercera píldora clickeable a la derecha.
- `css/style.css`: nueva variable `--orange:#ff9600`; `.stat-chip` (píldora con
  `border-radius:999px`, borde + `box-shadow` inferior sutil, mismo lenguaje visual que
  `.card`/`.btn`); `.stat-chip.streak-chip` y `.stat-chip.xp-chip` con su propio color de
  acento (naranja/ámbar) y fondo casi blanco; `.stat-chip.lang-switch` con `:active` de
  escala en vez de sombra (es un selector, no una acción primaria).
- `service-worker.js` → `CACHE_NAME` a `italiano-v20`.

**Bug encontrado y corregido en este mismo ciclo (antes de commitear):** el `title` del
chip de racha usaba `uiSpeak('streakLabel')`, pero `uiSpeak()` devuelve **HTML** (texto +
botón de audio `<span>`), no texto plano — al insertarlo dentro de un atributo `title="..."`
rompía el HTML (el dump mostraba el markup del botón de audio literalmente como texto en
el atributo). Se cambió a `uiRaw('streakLabel')`, que sí devuelve string plano. Confirmado
con Edge headless antes y después del fix (ver método abajo) — el `grep` de errores de JS
seguía en 0 en ambos casos porque no era un error de sintaxis, sino HTML mal formado dentro
de un atributo, algo que solo se ve inspeccionando el DOM renderizado.

**Verificación:** arnés temporal `_test_home.html` (creado y borrado en este ciclo, mismo
patrón que las sesiones de portugués: precarga `idiomas_course_v1='it'` en `localStorage` y
redirige a `index.html`, todo servido desde el mismo origen `python -m http.server`) +
Edge headless `--dump-dom`. 0 errores de JS en el log de stderr. El DOM confirma los 3 chips
renderizados con las clases correctas y el contenido esperado (`🔥 0`, `⚡ 0`, `🇮🇹 🌐`, con
`progress.xp`/`streak` en 0 porque es una cuenta nueva sin lecciones completadas). El flag
`--screenshot` no se reintentó este ciclo (documentado como roto en el entorno en el ciclo
1) — se prioriza no gastar tiempo del ciclo de 5 min reintentando algo ya confirmado como
limitación de infraestructura, no del código.

**Pendiente para el próximo ciclo de esta sesión (por impacto, sin cambios respecto al
ciclo 1 salvo tachar lo hecho):**
- ~~Header/top-bar con racha/XP~~ ✅ hecho este ciclo.
- Tarjetas de lección en Home como un "path" serpenteante con nodos circulares — sigue
  siendo el cambio más grande y el que más acerca visualmente a la referencia del usuario;
  toca estructura de `renderHome`, no solo CSS.
- Animación de feedback correcto/incorrecto (shake al fallar, check animado al acertar).
- Mascota/personaje — evaluar emoji grande como placeholder liviano.
- Si en algún ciclo se prueba `--screenshot` de nuevo y funciona, documentarlo (podría ser
  un problema transitorio de recursos del sistema, no permanente).

### Ciclo 3 — 2026-08-07 ~15:08-15:13
**Mejora elegida:** camino serpenteante con nodos circulares en Home, reemplazando la lista
vertical de tarjetas de lección.

**Por qué esta:** era el pendiente #1 (por impacto) tanto del ciclo 1 como del ciclo 2 — el
elemento más reconocible de las capturas de referencia de Duolingo (nodos tipo "isla" sobre
un camino) y el que más "gap visual" cerraba de todo lo pendiente.

**Qué se hizo:**
- `js/app.js` (`renderHome`): las tarjetas verticales (`.card` por lección, con botón
  "Empezar/Repasar") se reemplazaron por `.lesson-path` → una lista de `.path-node`, cada
  uno con un desplazamiento horizontal alternado (`pathOffsets = [0, 56, 0, -56]px`, cíclico
  por índice) para el efecto zigzag. Cada nodo es un círculo (`.path-circle`, 72px) con
  ⭐ si está pendiente o ✅ si está completada, más un aro de énfasis extra (`.current`) en
  la **primera lección no completada** (para que el usuario sepa "por acá seguís" sin
  necesidad de leer texto). El título con audio + badge CEFR quedan como etiqueta debajo del
  círculo. Todo el nodo (`div.path-node`) es clickeable y llama a `startLesson(id)` — ya no
  hace falta un botón de texto separado.
- `css/style.css`: `.lesson-path` (columna centrada, gap chico), `.path-circle` con el mismo
  lenguaje de sombra "3D press" que `.btn` (`box-shadow` que colapsa a 0 y el nodo baja 6px
  en `:active`, vía `.path-node:active .path-circle`), `.path-circle.done` con estilo
  outline (fondo blanco, borde verde) en vez de relleno, `.path-circle.current` con
  `box-shadow` doble (la sombra 3D + un halo `var(--green-soft)` de 6px) para destacarlo sin
  animación (se evitó `@keyframes` de pulso por simpleza en el tiempo de un ciclo de 5 min).
- `service-worker.js` → `CACHE_NAME` a `italiano-v21`.

**Decisión de diseño:** no se agregó lógica de "bloqueo" de lecciones futuras (Duolingo sí
bloquea nodos no alcanzados) — la app nunca tuvo ese concepto y agregarlo es una decisión de
producto (no solo visual) que no corresponde meter de paso en un ciclo de UX. Todas las
lecciones siguen siendo clickeables como antes; el único indicador de progreso es el ícono
(⭐/✅) y el aro en la próxima pendiente.

**Verificación:** mismo patrón de arnés temporal (`_test_home3.html`, creado y borrado en
este ciclo) + Edge headless `--dump-dom`. 0 errores de JS. Se confirmaron **6 nodos
`.path-circle`** para el curso de italiano (coincide con las 6 lecciones existentes), el
primero con clase `current`, el resto sin clase de estado (ninguna completada en una cuenta
nueva) — y se inspeccionó el HTML de un nodo completo para confirmar que el título con audio
(`data-speak`, `data-lang="it-IT"`) y el badge CEFR (`A1`) se renderizan correctamente
dentro de `.path-label`. `--screenshot` headless no se reintentó (sigue documentado como
roto en este entorno desde el ciclo 1).

**Pendiente para el próximo ciclo de esta sesión (por impacto):**
- Línea/conector visual entre los nodos del camino (hoy son círculos flotantes sin línea que
  los una) — reforzaría la sensación de "camino" de la referencia. Se puede lograr con un
  pseudo-elemento (`::before`) en `.path-node` que dibuje un segmento hacia el nodo anterior,
  sin necesidad de JS ni SVG.
- Animación de feedback correcto/incorrecto (shake al fallar, check animado al acertar) en
  `.feedback` — sigue pendiente desde el ciclo 1.
- Mascota/personaje — evaluar emoji grande como placeholder liviano, quizás junto al nodo
  `current` del camino en vez de en el header.
- Revisar que el zigzag (`translateX` de hasta 56px) no se corte en pantallas angostas (viewport
  muy chico, <320px) — no se probó ese caso límite este ciclo, solo el ancho por defecto del
  harness headless.

### Ciclo 4 — 2026-08-07 ~15:12-15:18
**Mejora elegida:** animación de feedback al acertar/fallar (pop al acertar, shake al
fallar), en el recuadro `.feedback` y en el input de respuesta.

**Por qué esta:** segundo pendiente en la lista desde el ciclo 1, y de menor riesgo
estructural que el conector visual del camino (ese requiere tocar `::before` con posiciones
relativas entre nodos consecutivos, más delicado). El principio #8 de `CLAUDE.md` pide
"feedback inmediato y explicativo" — hasta ahora el feedback era correcto en contenido pero
visualmente estático (solo cambio de color), sin la reacción inmediata que sí tiene
Duolingo.

**Qué se hizo:**
- `css/style.css`: `@keyframes feedback-pop` (escala 0.92→1 + fade in) y `@keyframes
  feedback-shake` (sacudida horizontal con 4 pasos de translateX decrecientes), aplicadas a
  `.feedback.correct`/`.feedback.incorrect`. Nuevas clases `input-correct`/`input-incorrect`
  para el `<input>` de respuesta (fondo y borde verde/rojo + la misma animación pop/shake).
- `js/app.js`: el `<input>` de `renderExerciseStep` (ejercicios de lección) y el de
  `renderReview` (pantalla de repaso) ahora reciben la clase `input-correct`/`input-incorrect`
  según `lessonState.lastCorrect`/`reviewCorrect` cuando ya está respondido — antes el input
  se quedaba con el mismo estilo neutro sin importar el resultado.

**Verificación (y bug encontrado en el propio proceso, no en el código de producción):**
arnés temporal `_test_ex4.html` que precarga el curso, llama a `startLesson()` y fuerza
`lessonState.step='exercises'` + `answered=true` + `lastCorrect=false` para poder inspeccionar
el estado "incorrecto" sin completar la lección a mano. La **primera corrida del arnés** dio
`Uncaught SyntaxError: Invalid regular expression` en `content.js` (el regex de
`normalizeAnswer` que quita acentos, `/[̀-ͯ]/g`) — pero **el bug estaba en el arnés, no en la
app**: a diferencia de `index.html`, el harness no tenía `<meta charset="UTF-8">`, así que
Edge interpretó `content.js` con una codificación equivocada (Windows-1252 en vez de UTF-8),
corrompiendo el rango Unicode del regex. Se agregó el `<meta charset="UTF-8">` al harness y
la segunda corrida dio **0 errores de JS**, con `id="answer-input" class="input-incorrect"`
y `class="feedback incorrect"` confirmados en el DOM. **Lección para arneses futuros de este
tipo (harness "completo" que reimplementa el `<head>` en vez de solo redirigir a
`index.html`): siempre copiar el `<meta charset="UTF-8">` de `index.html`**, si no cualquier
archivo con acentos/caracteres especiales puede fallar de forma engañosa (parece un bug del
código de producción y no lo es).
- `service-worker.js` → `CACHE_NAME` a `italiano-v22`.

**Pendiente para el próximo ciclo de esta sesión (por impacto):**
- Línea/conector visual entre los nodos del camino de lecciones (ver ciclo 3) — sigue siendo
  el pendiente más visible de la lista.
- Mascota/personaje — evaluar emoji grande como placeholder liviano.
- Revisar el caso límite de viewport angosto (<320px) para el zigzag del camino — sigue sin
  probarse.
- Si queda tiempo hacia el final de la sesión (cerca de 15:27), preferir un pendiente chico y
  ya probado (como este ciclo) antes que arrancar el conector del camino a último momento sin
  margen para verificarlo.

### Ciclo 5 — 2026-08-07 ~15:17-15:22
**Mejora elegida:** mascota placeholder (🐺, un lobo) con globo de diálogo mostrando el
tagline, reemplazando el `<p>` plano debajo del saludo en Home.

**Por qué esta:** el pendiente #1 (conector visual del camino) requiere calcular geometría
exacta (ángulo/distancia entre centros de nodos consecutivos, que dependen de la altura
variable de cada etiqueta con texto largo) — un cambio arriesgado de verificar sin
`--screenshot` funcionando en este entorno (solo `--dump-dom`, que no permite confirmar
alineación visual en píxeles). Se prefirió la mascota: un pendiente más chico, de bajo
riesgo estructural, y totalmente verificable con `--dump-dom` (basta confirmar que el emoji
y el texto están presentes en el DOM). Además cierra otro elemento explícito de las
referencias del usuario (personaje ilustrado) que ninguna capa de contenido tenía todavía.

**Qué se hizo:**
- `js/app.js` (`renderHome`): el `<p>${uiSpeak('tagline')}</p>` se reemplazó por
  `.mascot-row` → un emoji grande (`.mascot-emoji`) + un globo de diálogo (`.mascot-bubble`)
  con el mismo texto de tagline adentro.
- `css/style.css`: `.mascot-row` (flex, alineado abajo), `.mascot-emoji` (46px), y
  `.mascot-bubble` con el mismo lenguaje visual de tarjeta (borde + sombra inferior) más una
  flecha de globo de diálogo apuntando a la mascota, hecha con dos triángulos CSS
  superpuestos (`::before`/`::after`, sin SVG ni imágenes).
- `service-worker.js` → `CACHE_NAME` a `italiano-v23`.

**Decisión de diseño (por qué un lobo y no un búho):** Duolingo usa un búho verde como
mascota central de su identidad de marca — clonarlo literalmente iría en contra de la
instrucción explícita de `CLAUDE.md` ("No eres un clon de Duolingo"). Se eligió un lobo
🐺 en su lugar: referencia cultural italiana/romana (la Loba Capitolina) que además da pie a
mascotas distintas por curso en el futuro (ej. un mascote específico para portugués) sin
depender de un ícono ya asociado a un competidor.

**Verificación:** arnés temporal `_test_home5.html` (con `<meta charset="UTF-8">` esta vez,
aplicando la lección del ciclo 4) que redirige a `index.html` real tras precargar
`idiomas_course_v1='it'` + Edge headless `--dump-dom`. 0 errores de JS; se confirmó en el
DOM `class="mascot-row"`, el emoji 🐺 dentro de `.mascot-emoji`, y el texto del tagline en
italiano dentro de `.mascot-bubble`. `--screenshot` no se reintentó (sigue documentado como
roto en este entorno desde el ciclo 1).

**Pendiente para el próximo ciclo de esta sesión (por impacto):**
- Línea/conector visual entre los nodos del camino de lecciones — el pendiente más grande
  que queda, pero de riesgo alto de verificar sin screenshots; si se aborda, dejar el cálculo
  de geometría lo más simple posible (ej. conectores verticales cortos entre offsets iguales
  en vez de diagonales exactas) para poder confirmarlo solo con `--dump-dom`.
- Revisar el caso límite de viewport angosto (<320px) para el zigzag del camino.
- Si este resulta ser el último o anteúltimo ciclo de la sesión (se acerca 15:27), priorizar
  cerrar con un resumen prolijo de memory.md antes que arrancar algo nuevo sin margen.

### Ciclo 6 — 2026-08-07 ~15:22-15:24
**Mejora elegida:** conector visual del camino de lecciones — pero con un enfoque distinto
al que se había descartado como riesgoso en el ciclo 5.

**Por qué esta y por qué este enfoque:** con el reloj cerca del corte de las 15:27, no había
margen para el cálculo diagonal exacto (ángulo/distancia entre offsets variables por altura
de etiqueta) que el ciclo 5 había marcado como de "riesgo alto de verificar sin
screenshots". En vez de eso: una **línea vertical punteada única, centrada en el contenedor
`.lesson-path`**, detrás de todos los nodos (`z-index:0` vs. `z-index:1` de los nodos). Los
círculos son opacos, así que tapan la línea donde se superponen — el resultado visual sigue
leyéndose como "camino" (la referencia de Duolingo también tiene una guía vertical de fondo
con nodos zigzagueando encima) pero sin ninguna dependencia de la posición horizontal exacta
de cada nodo. Cero riesgo geométrico, 100% verificable con las herramientas disponibles.

**Qué se hizo:**
- `css/style.css`: `.lesson-path` pasa a `position:relative`; nuevo `::before` con
  `repeating-linear-gradient` vertical (segmentos de 10px con 12px de espacio, efecto
  punteado) centrado con `left:50%; margin-left:-3px`, `top`/`bottom` de 36px para no
  sobresalir del primer/último nodo. `.path-node` pasa a `position:relative; z-index:1`
  para quedar por encima de la línea.
- `service-worker.js` → `CACHE_NAME` a `italiano-v24`.
- **No se tocó `js/app.js` este ciclo** — cambio 100% CSS, sin riesgo de romper lógica.

**Verificación:** arnés temporal `_test_home6.html` (mismo patrón de los ciclos 2/3/5, con
`<meta charset="UTF-8">`) + Edge headless `--dump-dom`. 0 errores de JS, `.lesson-path`
presente y los 6 `.path-circle` de italiano siguen renderizando igual que en el ciclo 3 (el
cambio no tocó su marcado, solo agregó un pseudo-elemento al contenedor). `--screenshot`
sigue sin probarse de nuevo en esta sesión (roto desde el ciclo 1) — la verificación visual
real de cómo se ve la línea detrás de los nodos queda pendiente de un entorno con soporte de
captura de pantalla.

## Resumen final de la sesión de UX (2026-08-07, 14:57→~15:23, 6 ciclos, cron `70ae7c9b`)

**6 mejoras visuales implementadas, todas commiteadas y verificadas sin errores de JS:**
1. Tema completo oscuro→claro estilo Duolingo (verde `#58cc02`, tarjetas con sombra "3D",
   botones con efecto de presión).
2. Header con chips de racha 🔥 y XP ⚡ (antes texto plano gris).
3. Camino serpenteante con nodos circulares en zigzag reemplazando la lista vertical de
   tarjetas de lección (el cambio más grande de la sesión).
4. Animación de feedback correcto/incorrecto (pop/shake) en input y recuadro de feedback,
   en ejercicios y en repaso.
5. Mascota placeholder (🐺, lobo — deliberadamente distinto al búho de Duolingo) con globo
   de diálogo.
6. Conector punteado detrás del camino de lecciones.

**Cómo se ve la app ahora vs. antes:** pasó de un tema oscuro tipo "app de utilidad" sin
ningún elemento de gamificación visual, a un tema claro con la paleta y el lenguaje visual
(sombras "3D press", píldoras, camino con nodos) que se reconoce como género "Duolingo-like"
a primera vista, cerrando la mayoría de los elementos puntuales que el usuario señaló en sus
capturas de referencia (nodos circulares ✅, racha/XP arriba ✅, botones grandes con sombra
inferior ✅, feedback visual claro ✅, mascota ✅). Queda más cerca de la referencia que al
empezar la sesión.

**1 bug real encontrado y corregido en el proceso (ciclo 2):** un `title` de atributo roto
por usar una función que devuelve HTML (`uiSpeak`) en vez de texto plano (`uiRaw`) —
detectado con Edge headless antes de commitear, no llegó a producción.

**Limitación de entorno documentada y reutilizada en toda la sesión:** `--screenshot` de
Edge headless falla de forma consistente en esta máquina (crash del proceso de
render/GPU incluso con `--disable-gpu`), así que **ninguna mejora de esta sesión fue
verificada con una captura de pantalla real** — toda la verificación fue estructural
(`--dump-dom` + grep de errores de consola + inspección del HTML renderizado). Esto es
suficiente para confirmar "no rompí nada" pero **no** para confirmar que el resultado se ve
bien en píxeles reales — eso queda pendiente de que el usuario lo revise en su celular o de
un entorno con soporte de captura de pantalla headless funcional.

**Qué falta para acercarse más a Duolingo (pendiente real para la próxima sesión de UX):**
- Verificación visual real (screenshot o revisión manual del usuario) de las 6 mejoras —
  nunca se vio un píxel renderizado en esta sesión, solo estructura.
- El conector del camino (ciclo 6) usa una línea vertical simple, no la geometría diagonal
  exacta entre nodos — si se quiere ese acabado más fiel a la referencia, hace falta
  abordarlo con tiempo completo y, idealmente, con `--screenshot` funcionando.
- Caso límite de viewport angosto (<320px) para el zigzag del camino — nunca se probó.
- Tipografía: se sigue usando la pila de fuentes del sistema (`ui-rounded`/`-apple-system`);
  no se evaluó una fuente redondeada real (ej. cargar una variable font local tipo Baloo/
  Quicksand) que se vea "juguetona" en plataformas que no soportan `ui-rounded` (la mayoría
  de Android/Windows no lo soportan, así que ahí la tipografía sigue siendo el system font
  normal, no redondeada).
- Iconografía de vidas/corazones (la referencia del usuario mostraba un ícono de corazón
  además de racha/XP) — no implementado, la app no tiene concepto de "vidas" en su diseño
  actual (es una decisión de producto, no solo visual, que no se tomó en esta sesión).
- Progreso dentro de la lección (`.progress-bar-track`) no recibió ningún cambio visual en
  esta sesión — sigue con el estilo simple del ciclo 1.

**Cierre del loop:** con la hora en ~15:23-15:24 (todavía antes del corte de las 15:27), no
se detiene el cron todavía — este resumen se deja preparado para que, si el próximo disparo
(~15:27-15:29) ya cruza el corte, ese ciclo pueda cerrar rápido: confirmar que no hay una
mejora nueva de bajo riesgo que valga la pena, y llamar a `CronList` + `CronDelete` sobre el
job `70ae7c9b` sin necesidad de re-explorar toda la sesión desde cero.

### Ciclo 7 — 2026-08-07 ~15:27 (cierre del loop)
El disparo llegó a las 15:26:54, prácticamente en el corte de las 15:27 y sin margen real
para implementar+verificar+commitear una mejora nueva antes de que el próximo disparo
(~15:31-15:32) ya esté bien pasado el corte. Se trata este ciclo como el último: no se
implementa una mejora nueva (el resumen del ciclo 6 ya cubre las 6 mejoras de la sesión y el
estado pendiente, sigue vigente sin cambios). Se confirma con `CronList` el job `70ae7c9b` y
se detiene con `CronDelete`.

**Sesión de UX/estética terminada:** 14:57→~15:27, 6 ciclos con mejora implementada (más
este séptimo de cierre sin cambios de código), 6 mejoras visuales commiteadas — ver el
resumen completo en el cierre del ciclo 6 arriba. Sin working tree sucio: cada ciclo dejó su
propio commit de código + su propio commit de memory.md.

## Sesión de loop de contenido de portugués (2026-08-13, ~14:33→~15:33, cron `355fa447` cada 5 min)

**Objetivo de esta sesión:** el usuario pidió un loop de 1 hora enfocado 100% en contenido
pedagógico de portugués — módulos/lecciones nuevas, ejercicios, cubrir huecos gramaticales o
temáticos. No es un loop de UX (no tocar css/style.css ni la estructura visual salvo que un
tipo de ejercicio nuevo lo requiera). Portugués arranca esta sesión con 14 lecciones A1
(pt_a1_u1…pt_a1_u14, ver sesión de julio/agosto anterior en este mismo archivo).

**Nota de estilo importante para esta sesión:** el usuario corrigió explícitamente (mismo día,
antes de este loop) que el español debe usar **tuteo, nunca voseo** (tienes/puedes/escribe,
no tenés/podés/escribí) — corrección guardada en memoria permanente del agente
(`feedback_tuteo_no_voseo.md`). Todo el texto en español que se genere en este loop
(explicaciones de gramática, notas, prompts) debe revisarse contra esto antes de commitear.
También: la app ya está publicada en GitHub Pages (`https://kesanti12.github.io/Idiomas/`,
remoto `origin` configurado) y instalada en el celular del usuario — cada ciclo que toque
contenido debe hacer `git push` además de commit, para que los cambios lleguen al celular.

### Ciclo 1 — 2026-08-13 ~14:33-14:40
**Mejora elegida:** Unidad 15 A1 de portugués — "Aonde você vai?" (verbo irregular "ir" +
futuro próximo "vou + infinitivo").

**Por qué esta:** "ir" es uno de los verbos más frecuentes del portugués (frecuencia de uso
real, principio #7 de CLAUDE.md) y, a diferencia de los verbos regulares ya cubiertos
(-ar/-er/-ir, Unidades 4-6), es irregular como "ser"/"ter" (Unidades 1-2) — cierra ese trío
de irregulares de alta frecuencia. Además desbloquea una estructura muy productiva (futuro
próximo con "vou + infinitivo", paralelo directo al español "voy a + infinitivo" pero sin
preposición) que el usuario va a poder reutilizar en conversación real de inmediato.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u15_ir` (diálogo sobre planes — ir al mercado,
  trabajar, ir al cine —, phonetics, glossary con "aonde" vs. "onde", tabla de conjugación
  completa de "ir", 6 ejercicios: 3 fill de conjugación [eu/você/nós] + 3 translate
  bidireccional incluyendo la frase de futuro próximo "vou trabalhar").
- `service-worker.js` → `CACHE_NAME` a `italiano-v27`.

**Verificación:** el chequeo de balance de brackets en Python (heurística de sesiones
anteriores) dio un falso positivo (desbalance de -1 a +2) por comillas/apóstrofes dentro de
strings que la regex simple no maneja bien — **se descartó como no confiable** y se fue
directo al método definitivo: Edge headless `--dump-dom` (con `<meta charset="UTF-8">` en el
arnés, lección del ciclo 4 de la sesión de UX). Dos corridas: (1) curso `pt` cargado desde
cero → 0 errores de JS, 15 nodos `.path-circle` en el camino de lecciones (14 previos + 1
nuevo); (2) `startLesson('pt_a1_u15_ir')` forzado a `step='grammar'` → 0 errores, tabla de
conjugación completa renderizada con audio `pt-BR` y fonética correctos en las 6 filas
(eu/você/ele-ela/nós/vocês/eles-elas). Arneses temporales borrados al terminar.

**Nota metodológica para próximos ciclos:** el chequeo de balance de brackets en Python ya
dio falso positivo en esta sesión — no perder tiempo de ciclo depurándolo, ir directo a Edge
headless `--dump-dom` como verificación principal (es la que de verdad importa).

**Pendiente para el próximo ciclo de esta sesión (por impacto):**
- Huecos temáticos A1 todavía no cubiertos: clima, ropa, comida en detalle, transporte, la
  casa, el cuerpo, verbos irregulares de alta frecuencia restantes (poder, querer, ver),
  comparativos.
- Bidireccionalidad SRS en drills `fill` de conjugación — pendiente documentado desde
  sesiones anteriores, nunca abordado (requiere tocar `srs.js`/`app.js`, no solo `content.js`).
- Si A1 se siente razonablemente cubierto en algún ciclo posterior, evaluar arrancar
  contenido A2 con su propio descriptor CEFR.

### Ciclo 2 — 2026-08-13 ~14:38-14:44
**Mejora elegida:** Unidad 16 A1 de portugués — "Você pode me ajudar?" (verbo irregular
"poder" + infinitivo, para pedir ayuda/permiso).

**Por qué esta:** siguiente verbo irregular de alta frecuencia de la lista pendiente
(después de "ir" en el ciclo 1) — "poder" es de los verbos más usados del portugués
cotidiano y, a diferencia de "ir" (irregular en casi todas las formas), es un buen contraste
pedagógico: irregular **solo en la primera persona** ("eu posso", no "podo"), el resto seguí
el patrón -er ya conocido de "comer" (Unidad 5). Reforzar ese contraste (irregularidad total
vs. parcial) ayuda a que el usuario no memorice todo de cero por fuerza bruta, sino que
reconozca el patrón subyacente cuando existe.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u16_poder` (diálogo pidiendo permiso para sentarse y
  después ayuda con algo, phonetics, glossary con 4 ítems nuevos — "com licença", "sentar",
  "ajudar", "uma coisa" —, tabla de conjugación completa de "poder", 6 ejercicios: 3 fill de
  conjugación [eu/você/nós] + 3 translate bidireccional).
- `service-worker.js` → `CACHE_NAME` a `italiano-v28`.
- Vocabulario nuevo acotado a 4 ítems (com licença, sentar, ajudar, uma coisa) para no pasar
  el umbral de ~95% comprensible del principio #2 de CLAUDE.md — el diálogo reutiliza
  estructuras y palabras de unidades previas (claro, obrigado) en vez de introducir todo de
  cero.

**Verificación:** Edge headless `--dump-dom` (arnés con `<meta charset="UTF-8">`, mismo
patrón del ciclo 1) forzando `startLesson('pt_a1_u16_poder')` + `step='grammar'` → 0 errores
de JS, tabla de conjugación completa renderizada con audio `pt-BR` y fonética correctos en
las 6 filas (eu/você/ele-ela/nós/vocês/eles-elas: posso/pode/pode/podemos/podem/podem).
Arnés temporal borrado, servidor de prueba cerrado.

**Pendiente para el próximo ciclo de esta sesión (por impacto, sin cambios de fondo):**
- Huecos temáticos A1: clima, ropa, comida en detalle, transporte, la casa, el cuerpo,
  "querer" y "ver" (últimos irregulares de alta frecuencia pendientes de la lista original),
  comparativos.
- Bidireccionalidad SRS en drills `fill` — sigue sin abordarse, requiere tiempo dedicado en
  `srs.js`/`app.js`.
- Considerar arrancar A2 si en un par de ciclos más A1 se siente suficientemente amplio.

### Ciclo 3 — 2026-08-13 ~14:43-14:49
**Mejora elegida:** Unidad 17 A1 de portugués — "O que você quer comer?" (verbo irregular
"querer" + sustantivo/infinitivo).

**Por qué esta:** completa el trío de verbos irregulares de alta frecuencia planificado
desde el ciclo 1 (ir → ciclo 1, poder → ciclo 2, querer → este ciclo). Valor pedagógico
extra respecto a simplemente "otro verbo más": cada uno de los tres es irregular en una
**persona distinta** (ir: casi todas las formas; poder: solo "eu posso"; querer: solo
"você/ele/ela quer") — el contraste ayuda a que el usuario internalice que la irregularidad
se aprende forma por forma, no como una regla general, algo que Duolingo tiende a ocultar
presentando cada verbo de forma aislada sin señalar el patrón entre ellos.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u17_querer` (diálogo pidiendo comida — pizza, ya
  conocida desde la Unidad 5 "comer" —, phonetics, glossary con 2 ítems nuevos acotados
  ["por favor", "duas" con nota de concordancia de género en números 1-2], tabla de
  conjugación completa de "querer", 6 ejercicios: 3 fill de conjugación + 3 translate
  bidireccional).
- `service-worker.js` → `CACHE_NAME` a `italiano-v29`.
- Vocabulario nuevo deliberadamente mínimo (2 ítems) porque el diálogo ya reutiliza "pizza"
  (Unidad 5) y "também" (Unidad 12) — foco del input comprensible puesto 100% en la
  conjugación de "querer", no diluido con vocabulario nuevo de relleno.

**Verificación:** Edge headless `--dump-dom` (arnés con `<meta charset="UTF-8">`) forzando
`startLesson('pt_a1_u17_querer')` + `step='grammar'` → 0 errores de JS, tabla de conjugación
completa y correcta (quero/quer/quer/queremos/querem/querem) con audio `pt-BR` y fonética en
las 6 filas. Arnés temporal borrado, servidor cerrado.

**Pendiente para el próximo ciclo de esta sesión (por impacto):**
- El trío ir/poder/querer ya está cerrado — siguiente huecos temáticos sin cubrir: "ver"
  (último irregular de alta frecuencia de la lista original), clima, ropa, comida en
  detalle, transporte, la casa, el cuerpo, comparativos.
- Bidireccionalidad SRS en drills `fill` — sigue pendiente, requiere tocar `srs.js`/`app.js`
  con tiempo dedicado (no encaja bien en un ciclo de 5 min junto con una lección nueva).
- Con 17 lecciones A1 ya son casi 3x las 6 de italiano — considerar seriamente arrancar A2
  en los próximos 1-2 ciclos si no aparece un hueco A1 claramente más urgente.

### Ciclo 4 — 2026-08-13 ~14:48-14:54
**Mejora elegida:** Unidad 18 A1 de portugués — "Posso ver o cardápio?" (verbo irregular
"ver").

**Por qué esta:** cierra el set completo de verbos irregulares de alta frecuencia
planificado desde el ciclo 1 (ir, poder, querer, ver). "Ver" es el más irregular de los
cuatro (irregular en casi todas las formas, como "ir"), buen cierre de la serie por
contraste de grado de irregularidad. Aprovechando que ya existía "poder" (Unidad 16), se
diseñó un ejercicio que **combina ambos verbos en la misma frase** ("Posso ver o
cardápio?") — interleaving real (principio #4 de CLAUDE.md), no solo lecciones aisladas en
secuencia: el usuario repasa "poder" en el mismo momento en que aprende "ver".

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u18_ver` (diálogo pidiendo el menú en un
  restaurante, phonetics, glossary con 2 ítems nuevos ["cardápio", "isso"], tabla de
  conjugación completa de "ver", 6 ejercicios: 3 fill de conjugación + 3 translate
  bidireccional, uno de ellos combinando "poder"+"ver").
- `service-worker.js` → `CACHE_NAME` a `italiano-v30`.

**Verificación:** Edge headless `--dump-dom` forzando `startLesson('pt_a1_u18_ver')` +
`step='grammar'` → 0 errores de JS, tabla de conjugación correcta (vejo/vê/vê/vemos/veem/veem)
con audio `pt-BR` y fonética en las 6 filas. Arnés temporal borrado, servidor cerrado.

**Estado a esta altura:** portugués tiene **18 lecciones A1** — 3x las 6 de italiano.

**Pendiente para el próximo ciclo de esta sesión (por impacto):**
- El set completo de verbos irregulares de alta frecuencia (ir/poder/querer/ver) ya está
  cerrado. Huecos temáticos sin cubrir: clima, ropa, comida en detalle, transporte, la casa,
  el cuerpo, comparativos.
- Bidireccionalidad SRS en drills `fill` — sigue sin abordarse en toda la sesión (4 ciclos),
  sigue siendo mejor candidato para una sesión futura con más margen de tiempo por ciclo.
- Dado el volumen ya alcanzado (18 vs. 6), el próximo ciclo es un buen momento para evaluar
  en serio arrancar A2 con su propio descriptor CEFR, en vez de seguir sumando A1 solamente.

### Ciclo 5 — 2026-08-13 ~14:53-14:59
**Mejora elegida:** primera lección de nivel **A2** de portugués — `pt_a2_u1_preterito`,
"Você trabalhou ontem?" (pretérito perfeito de verbos regulares en -ar).

**Por qué esta y por qué ahora:** con 18 lecciones A1 (3x italiano) y los verbos irregulares
de alta frecuencia ya cerrados (ciclos 1-4), seguir sumando solo vocabulario temático A1
(clima, ropa, etc.) empezaba a rendir menos que dar el salto estructural más importante del
curso: pasar de presente-únicamente a poder hablar del pasado. Es el primer gran salto
gramatical de todo el curso (italiano incluido, que tampoco tiene pasado todavía) y abre la
puerta a producción mucho más real (contar lo que uno hizo, no solo describir el presente).

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a2_u1_preterito`, **primera con `cefr: 'A2'`** en todo
  el proyecto (italiano y portugués). Diálogo mínimo en vocabulario nuevo (reutiliza
  "trabalhar" de la Unidad 16 y "falar" de la Unidad 4, solo agrega "ontem"), tabla de
  conjugación del pretérito perfeito de -ar (trabalhei/trabalhou/trabalhamos/trabalharam,
  paralelo directo a trabajé/trabajó/trabajamos/trabajaron en español), 6 ejercicios (3 fill
  + 3 translate bidireccional).
- `service-worker.js` → `CACHE_NAME` a `italiano-v31`.

**Verificación:** Edge headless `--dump-dom` forzando `startLesson('pt_a2_u1_preterito')` +
`step='grammar'` → 0 errores de JS, tabla de conjugación correcta con audio/fonética en las
6 filas, y se confirmó además que el `.cefr-badge` renderiza **"A2"** correctamente — el
sistema de niveles CEFR ya soportaba múltiples niveles sin ningún cambio de código (el campo
`lesson.cefr` es de texto libre desde el principio), confirmando que no hacía falta tocar
`js/app.js` para este salto de nivel.

**Estado a esta altura:** portugués tiene **18 lecciones A1 + 1 lección A2** (19 en total) —
la primera lección A2 de todo el proyecto (italiano sigue sin ninguna).

**Pendiente para el próximo ciclo de esta sesión (por impacto):**
- Seguir A2: verbos irregulares comunes en pretérito (ser/estar/ter/ir en pasado — distinto
  del presente ya visto), o pretérito de -er/-ir para completar los 3 patrones en pasado
  igual que se hizo en presente.
- Si se prefiere volver a A1: huecos temáticos siguen abiertos (clima, ropa, comida,
  transporte, casa, cuerpo, comparativos).
- Bidireccionalidad SRS en drills `fill` — sigue pendiente, 5 ciclos sin abordarse.

### Ciclo 6 — 2026-08-13 ~14:58-15:04
**Mejora elegida:** segunda lección A2 de portugués — `pt_a2_u2_preterito2`, "O que você
comeu ontem?" (pretérito perfeito de -er e -ir).

**Por qué esta:** completa de inmediato lo que el ciclo 5 dejó pendiente como opción #1 —
los otros dos patrones regulares en pasado (-er/-ir), simétrico a como se enseñó el
presente en las Unidades 4-6 (-ar/-er/-ir en lecciones separadas). Como -er e -ir comparten
casi todas las terminaciones del pretérito (solo difieren en "você/ele/ela": -eu vs. -iu),
se cubrieron ambos patrones en una sola lección usando dos verbos ya conocidos ("comer" de
la Unidad 5 y "assistir" de la Unidad 6) en vez de forzar dos lecciones casi idénticas.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a2_u2_preterito2`. Diálogo con **cero vocabulario
  nuevo** salvo "TV" (reutiliza comer, assistir, pizza, filme, bom — todos de unidades
  anteriores), tabla de conjugación del pretérito de "comer", 6 ejercicios mezclando ambos
  verbos (comer/assistir) para cubrir -er e -ir en los mismos 6 ejercicios. Uno de los
  ejercicios recicla deliberadamente el false-friend "assistir" (Unidad 6: significa
  ver/mirar, no "asistir" en español) ahora en pretérito — repaso espaciado real de un punto
  de fricción ya señalado antes, no solo contenido nuevo aislado.
- `service-worker.js` → `CACHE_NAME` a `italiano-v32`.

**Verificación:** Edge headless `--dump-dom` forzando `startLesson('pt_a2_u2_preterito2')`
+ `step='grammar'` → 0 errores de JS, tabla de conjugación de "comer" en pretérito correcta
(comi/comeu/comeu/comemos/comeram/comeram) con audio/fonética en las 6 filas. Arnés
temporal borrado, servidor cerrado.

**Estado a esta altura:** portugués tiene **18 lecciones A1 + 2 lecciones A2** (20 en
total). Los 3 patrones regulares (-ar/-er/-ir) ya están cubiertos tanto en presente como en
pretérito — un usuario que termine A1+A2 hasta acá puede describir el presente Y contar
eventos simples del pasado con cualquier verbo regular.

**Pendiente para el próximo ciclo de esta sesión (por impacto):**
- A2: verbos irregulares en pretérito (ser/estar/ter/ir/fazer en pasado, distinto del
  presente) — siguiente paso lógico para reforzar el pasado con los verbos de más alta
  frecuencia, no solo los regulares.
- Si se prefiere volver a A1: huecos temáticos siguen abiertos (clima, ropa, comida,
  transporte, casa, cuerpo, comparativos).
- Bidireccionalidad SRS en drills `fill` — sigue pendiente, 6 ciclos sin abordarse; buena
  candidata si en algún ciclo restante no surge una lección de contenido clara y hay margen
  para trabajar en `srs.js`/`app.js` en vez de `content.js`.

### Ciclo 7 — 2026-08-13 ~15:02-15:08
**Mejora elegida:** tercera lección A2 de portugués — `pt_a2_u3_ser_ir_preterito`, "Como
foi a festa?" (pretérito irregular de "ser" e "ir", idénticos).

**Por qué esta:** siguiente paso lógico marcado en el pendiente del ciclo 6 (verbos
irregulares en pretérito). Se eligió el par ser/ir primero, antes que estar/ter/fazer,
porque es el caso más llamativo y de mayor valor pedagógico: dos verbos completamente
distintos en presente colapsan a las mismas 4 formas en pretérito (fui/foi/fomos/foram).
Este tipo de irregularidad "sorprendente" (no una excepción menor sino una fusión total)
vale más la pena señalarla explícitamente temprano en A2 que dejar que el usuario la
descubra por error — coincide con el principio #5 de CLAUDE.md (gramática explícita,
no ocultar la regla).

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a2_u3_ser_ir_preterito`. Diálogo sobre una fiesta
  (contexto donde ambos usos —"ser" para valorar, "ir" para el movimiento— aparecen
  naturalmente), glossary con 3 ítems nuevos (festa, ótima, amigos), tabla de conjugación
  única que sirve para ambos verbos, 6 ejercicios (3 fill alternando el uso "ser" y "ir" +
  3 translate bidireccional, incluyendo una nota sobre la contracción "à" = a+a).
- `service-worker.js` → `CACHE_NAME` a `italiano-v33`.

**Verificación:** Edge headless `--dump-dom` forzando
`startLesson('pt_a2_u3_ser_ir_preterito')` + `step='grammar'` → 0 errores de JS, tabla de
conjugación correcta (fui/foi/foi/fomos/foram/foram) con audio/fonética en las 6 filas.
Arnés temporal borrado, servidor cerrado.

**Estado a esta altura:** portugués tiene **18 lecciones A1 + 3 lecciones A2** (21 en
total). A2 ya cubre: pretérito regular completo (-ar/-er/-ir, ciclos 5-6) + el primer verbo
irregular de alta frecuencia en pretérito (ciclo 7).

**Pendiente para el próximo ciclo de esta sesión (por impacto):**
- A2: seguir con más verbos irregulares en pretérito de alta frecuencia — "estar"
  (estive/esteve/estivemos/estiveram, muy irregular) o "ter"/"fazer" son los siguientes
  candidatos naturales.
- Si se prefiere volver a A1: huecos temáticos siguen abiertos (clima, ropa, comida,
  transporte, casa, cuerpo, comparativos).
- Bidireccionalidad SRS en drills `fill` — 7 ciclos sin abordarse; si quedan pocos ciclos
  antes del corte de las 15:33, mejor seguir con contenido (que sí entra en 5 min) que
  arrancar un cambio de `srs.js` a medio terminar.

### Ciclo 8 — 2026-08-13 ~15:07-15:13
**Mejora elegida:** cuarta lección A2 de portugués — `pt_a2_u4_ter_preterito`, "Você teve
um bom dia?" (pretérito irregular de "ter").

**Por qué esta (y no "estar"):** el pendiente del ciclo 7 sugería "estar" como candidato,
pero al revisar `content.js` se detectó que **"estar" en presente nunca se enseñó
explícitamente** — la Unidad 9 (lugares) usa deliberadamente "fica" en vez de "está" para
preguntar ubicación (uso auténtico brasileño), así que nunca hubo una tabla de conjugación
de "estar". Introducir su pretérito sin haber dado el presente sería construir sobre una
base que no existe. Se optó por "ter" en su lugar: ya tiene presente enseñado (Unidad 2),
así que su pretérito es una extensión limpia sin huecos de andamiaje.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a2_u4_ter_preterito`. Diálogo sobre cómo estuvo el día
  (reutiliza "bom dia" de la Unidad 12), glossary con 3 ítems nuevos (problemas, trabalho,
  tranquilo), tabla de conjugación del pretérito irregular de "ter" (raíz "tiv-"), 6
  ejercicios (3 fill + 3 translate). El último ejercicio ("foi tranquilo") repasa
  deliberadamente el pretérito de "ser" de la lección anterior — interleaving real, no solo
  lecciones en secuencia aislada.
- `service-worker.js` → `CACHE_NAME` a `italiano-v34`.

**Verificación:** Edge headless `--dump-dom` forzando
`startLesson('pt_a2_u4_ter_preterito')` + `step='grammar'` → 0 errores de JS, tabla de
conjugación correcta (tive/teve/teve/tivemos/tiveram/tiveram) con audio/fonética en las 6
filas. Arnés temporal borrado, servidor cerrado.

**Estado a esta altura:** portugués tiene **18 lecciones A1 + 4 lecciones A2** (22 en
total).

**Nota para sesiones futuras (importante):** si se quiere seguir con "estar" en el futuro,
primero hace falta una lección de **presente de "estar"** (uso para estados/ubicación
temporal, ej. "estou bem", "estou cansado") antes de poder enseñar su pretérito — no saltear
ese andamiaje. Documentado acá para no repetir el mismo chequeo de nuevo.

**Pendiente para el próximo ciclo de esta sesión (por impacto):**
- A2: introducir el **presente de "estar"** (hueco identificado este ciclo) sería un buen
  siguiente paso antes de seguir sumando más pretéritos — cierra una base que faltaba.
  Alternativa: "fazer" en pretérito (fiz/fez/fizemos/fizeram, ya tiene presente implícito
  por alta frecuencia aunque no se confirmó si se enseñó explícitamente, revisar primero).
- Si se prefiere volver a A1: huecos temáticos siguen abiertos (clima, ropa, comida,
  transporte, casa, cuerpo, comparativos).
- Bidireccionalidad SRS en drills `fill` — 8 ciclos sin abordarse.

### Ciclo 9 — 2026-08-13 ~15:12-15:18
**Mejora elegida:** Unidad 19 A1 de portugués — "Como você está?" (presente del verbo
irregular "estar").

**Por qué esta:** cierra directamente el hueco identificado en el ciclo 8 — "estar" nunca
tuvo su presente enseñado explícitamente (la Unidad 9 usa deliberadamente "fica" para
ubicación de lugares fijos). Sin esta base, cualquier pretérito de "estar" en un ciclo
futuro construiría sobre el aire. Se le asignó `cefr: 'A1'` (no A2) porque el contenido en
sí —conjugar un verbo básico en presente— es de dificultad A1, aunque se agregue después de
varias lecciones A2 en el archivo; el nivel CEFR de una lección depende de su dificultad,
no de su posición en la secuencia.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u19_estar`. Diálogo sobre cómo está alguien
  (saludo, cansancio, salud), glossary con 3 ítems nuevos (cansada/cansado, doente, que
  pena), tabla de conjugación completa de "estar", 6 ejercicios (3 fill + 3 translate
  bidireccional). La explicación de gramática señala explícitamente la frontera con "fica"
  (Unidad 9) para que el usuario no confunda cuándo usar cada uno.
- `service-worker.js` → `CACHE_NAME` a `italiano-v35`.

**Verificación:** Edge headless `--dump-dom` forzando `startLesson('pt_a1_u19_estar')` +
`step='grammar'` → 0 errores de JS, tabla de conjugación correcta
(estou/está/está/estamos/estão/estão) con audio/fonética en las 6 filas. Arnés temporal
borrado, servidor cerrado.

**Estado a esta altura:** portugués tiene **19 lecciones A1 + 4 lecciones A2** (23 en
total).

**Pendiente para el próximo ciclo de esta sesión (por impacto):**
- Con la base de "estar" ya lista, un pretérito de "estar" (estive/esteve/estivemos/
  estiveram) en A2 ya es viable si se quiere seguir esa línea.
- "Fazer" en pretérito (fiz/fez/fizemos/fizeram) — verificar primero si "fazer" tiene
  presente enseñado antes de saltar directo al pasado (mismo chequeo que evitó el error del
  ciclo 8).
- Huecos temáticos A1 sin cubrir: clima, ropa, comida en detalle, transporte, la casa, el
  cuerpo, comparativos.
- Bidireccionalidad SRS en drills `fill` — 9 ciclos sin abordarse.

### Ciclo 10 — 2026-08-13 ~15:17-15:23
**Mejora elegida:** Unidad 20 A1 de portugués — "Como está o tempo?" (el clima, con "estar"
+ adjetivo y "fazer" impersonal).

**Por qué esta:** después de 9 ciclos seguidos de gramática verbal (verbos irregulares en
presente y pretérito), se priorizó volver a un hueco temático puro del brief original — el
clima nunca se había tocado en toda la sesión. Además funciona como repaso natural: "está
nublado/ensolarado" reutiliza directamente "estar" (Unidad 19, recién enseñada) y "faz
frio/calor" introduce la construcción impersonal de "fazer" con paralelo directo al español
("hace frío/calor"), un punto de transferencia positiva muy claro para hispanohablantes.

**Qué se hizo:**
- `js/content.js`: nueva lección `pt_a1_u20_clima`. Diálogo comparando el clima en dos
  lugares (nublado/frío vs. soleado/calor), glossary con 4 ítems nuevos (tempo, nublado,
  ensolarado, diferença), tabla con las 4 expresiones fijas de clima, 6 ejercicios (3 fill —
  dos con "faz" para remarcar que la forma no cambia nunca, uno con "está" repasando la
  Unidad 19 — + 3 translate bidireccional).
- `service-worker.js` → `CACHE_NAME` a `italiano-v36`.

**Verificación:** Edge headless `--dump-dom` forzando `startLesson('pt_a1_u20_clima')` +
`step='grammar'` → 0 errores de JS, tabla de expresiones de clima renderizada correctamente
(está nublado, está ensolarado, faz frio, faz calor) con audio en las 4 filas. Arnés
temporal borrado, servidor cerrado.

**Estado a esta altura:** portugués tiene **20 lecciones A1 + 4 lecciones A2** (24 en
total).

**Pendiente para el próximo ciclo de esta sesión (por impacto, quedan pocos ciclos antes
del corte de las 15:33):**
- Huecos temáticos A1 sin cubrir: ropa, comida en detalle, transporte, la casa, el cuerpo,
  comparativos — buenos candidatos rápidos de implementar en lo que queda de sesión.
- A2: pretérito de "estar" o de "fazer" (verificando primero si "fazer" presente ya se
  enseñó) siguen disponibles si se prefiere continuar esa línea.
- Bidireccionalidad SRS en drills `fill` — 10 ciclos sin abordarse; con poco tiempo restante
  en la sesión, seguramente quede para una sesión futura dedicada.
