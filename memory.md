# Memoria de progreso — Idiomas (Italiano PWA)

> Este archivo es la memoria de continuidad entre iteraciones del loop de mejora.
> Léelo al empezar cada ciclo. Actualízalo al final de cada ciclo (append, no borres historial viejo).

## Estado actual
- Fase: **MVP núcleo funcionando** (loop aprender → practicar → repasar espaciado, verificado
  end-to-end). Unidad 1 A1 completa; falta ampliar contenido e interleaving real.
- MVP: alcanzado según el criterio de CLAUDE.md — ver Ciclo 1 en el log de iteraciones.

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
