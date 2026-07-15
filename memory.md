# Memoria de progreso — Idiomas (Italiano PWA)

> Este archivo es la memoria de continuidad entre iteraciones del loop de mejora.
> Léelo al empezar cada ciclo. Actualízalo al final de cada ciclo (append, no borres historial viejo).

## Estado actual
- Fase: **setup inicial** (aún no arrancó el loop de construcción).
- MVP: no iniciado.

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
(vacío — se llena a partir del ciclo 1)
