# Tarea de arranque — corrida automática de las 5:30am

Esta es la tarea a ejecutar por el agente programado. Lee primero `CLAUDE.md` (identidad y
principios, no negociables) y `memory.md` (estado y progreso) antes de empezar.

## Ventana de trabajo
- Empieza: ~5:30am (hora de esta corrida).
- **Termina: 10:00am en punto.** No sigas iterando después de esa hora aunque el MVP no
  esté "perfecto" — deja el estado como esté, actualiza `memory.md` con un resumen final
  y un TODO claro de qué seguiría, y detente. Usa `ScheduleWakeup` con `stop: true` para
  cerrar el loop en ese momento (o simplemente no programes un nuevo wakeup).
- Trabaja en ciclos de ~10 minutos. Cada ciclo: 1 mejora concreta, probada, commiteada.

## Fase 0 — Investigación (una sola vez, al arrancar)
Investiga (WebSearch/WebFetch) y sintetiza, sin quedarte en lo superficial:
1. **Curva del olvido y SRS**: Ebbinghaus, algoritmo SM-2 (Anki clásico) vs FSRS (más moderno,
   mejor ajuste por ítem/usuario). Elige uno para implementar y justifica en `memory.md` por qué.
2. **Adquisición de segundas lenguas**: input comprensible (Krashen, i+1), interleaving,
   recall activo vs reconocimiento pasivo, producción temprana vs silenciosa.
3. **Por qué Duolingo se queda corto** en niveles intermedios/avanzados (gramática oculta,
   sobre-gamificación sin profundidad, traducción literal en vez de uso real) — para
   diseñar deliberadamente distinto.
4. **Italiano específico para hispanohablantes**: falsos amigos, puntos de fricción
   gramatical (subjuntivo, preposiciones articuladas, concordancia, verbos pronominales,
   diferencias fonéticas clave), y qué transferencia positiva existe desde el español
   (para aprovecharla, no repetir lo obvio).
5. **CEFR (A1-C2)**: descriptores por nivel, para mapear la progresión curricular.

Guarda los hallazgos de forma que sirvan de base curricular (no hace falta un ensayo largo,
sí decisiones claras y accionables).

## Fase 1 — Grafo de conocimiento
Corre `/graphify` sobre la investigación de la Fase 0 (y sobre el contenido curricular a
medida que se genere) para tener un grafo consultable de conceptos gramaticales/temáticos
y sus relaciones/prerequisitos. Guarda el resultado en `graphify-out/`.

## Fase 2 — Esqueleto de la PWA
- `index.html`, `manifest.json`, `service-worker.js`, íconos (varios tamaños, al menos
  192x192 y 512x512) — debe cumplir criterios de instalabilidad ("Add to Home Screen").
- Sin frameworks pesados salvo que de verdad lo justifiques — prioridad: carga rápida en
  celular, funciona razonablemente offline tras instalar.
- Diseño muy intuitivo: onboarding claro, una sola acción obvia por pantalla, feedback
  inmediato.

## Fase 3 — Loop núcleo de aprendizaje (esto define el MVP)
Un usuario nuevo debe poder, de punta a punta:
1. Instalar la PWA.
2. Completar una lección real de A1 con input comprensible (no lista de vocabulario suelta).
3. Practicar con recall activo (escribir, no solo opción múltiple).
4. Ver esos ítems entrar a un sistema SRS real (con intervalos que de verdad varían según
   desempeño, no un checkbox de "visto").
5. Ver su progreso (racha, nivel CEFR aproximado, próximos repasos pendientes).

Esto es el criterio de "MVP razonable" — no hace falta cobertura A1-C2 completa todavía,
pero sí que este loop funcione de verdad y de forma sólida, no simulada.

## Fase 4 — Loop de mejora continua (10 min por ciclo, hasta las 10:00am)
En cada ciclo:
1. Lee `memory.md`.
2. Elige la mejora de mayor impacto pendiente hacia el MVP de la Fase 3 (o, si el MVP ya
   está sólido, la siguiente mejora de mayor impacto: más contenido A1, mejor A2, mejor UI,
   mejor algoritmo SRS, etc.).
3. Impleméntala.
4. Verifica que no rompiste nada (abre la app, revisa que cargue y que el flujo principal
   funcione).
5. `git add` + `git commit` con mensaje descriptivo.
6. Añade una entrada al log de `memory.md`: qué hiciste, por qué, qué queda pendiente.
7. Programa el siguiente ciclo en 10 minutos (o detente si ya son las 10:00am).

## Nota sobre alcance
Esto es un proyecto ambicioso ("mejor que Duolingo"). En una ventana de ~4.5 horas no se
llega a una app completa — el objetivo real es un MVP sólido del loop núcleo (Fase 3) más
tanto contenido/pulido adicional como el tiempo permita. Prioriza profundidad y que
funcione de verdad sobre amplitud simulada.
