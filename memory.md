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
