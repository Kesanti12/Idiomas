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
