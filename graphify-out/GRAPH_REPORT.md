# Graph Report - research  (2026-07-15)

## Corpus Check
- Corpus is ~1,028 words - fits in a single context window. You may not need a graph.

## Summary
- 19 nodes · 18 edges · 5 communities (4 shown, 1 thin omitted)
- Extraction: 72% EXTRACTED · 11% INFERRED · 17% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 3,500 input · 2,200 output

## Community Hubs (Navigation)
- SRS y Curva del Olvido
- Fricciones Gramaticales IT-ES
- Adaptividad e Input Comprensible
- Diseño Anti-Duolingo
- Fonética Italiana

## God Nodes (most connected - your core abstractions)
1. `FSRS (Free Spaced Repetition Scheduler)` - 5 edges
2. `Transferencia positiva español→italiano` - 4 edges
3. `Unidad 1 A1 — presentarse + essere` - 4 edges
4. `Curva del olvido de Ebbinghaus` - 3 edges
5. `Por qué Duolingo se queda corto` - 3 edges
6. `SM-2 (algoritmo clásico de Anki)` - 2 edges
7. `Distributed practice (meta-análisis 254 estudios)` - 2 edges
8. `Recall activo (producción, no solo reconocimiento)` - 2 edges
9. `Krashen — Input Hypothesis (i+1)` - 2 edges
10. `Modelo DSR (Difficulty, Stability, Retrievability)` - 1 edges

## Surprising Connections (you probably didn't know these)
- `Unidad 1 A1 — presentarse + essere` --shares_data_with--> `FSRS (Free Spaced Repetition Scheduler)`  [EXTRACTED]
  investigacion.md → investigacion.md  _Bridges community 0 → community 2_
- `Unidad 1 A1 — presentarse + essere` --implements--> `Recall activo (producción, no solo reconocimiento)`  [EXTRACTED]
  investigacion.md → investigacion.md  _Bridges community 3 → community 2_

## Hyperedges (group relationships)
- **Puntos de fricción gramatical para hispanohablantes** — investigacion_falsos_amigos, investigacion_preposiciones_articuladas, investigacion_subjuntivo_it_es, investigacion_verbos_pronominales, investigacion_consonantes_geminadas [EXTRACTED 0.90]
- **Principios de diseño que corrigen las carencias de Duolingo** — investigacion_recall_activo, investigacion_gramatica_explicita, investigacion_frecuencia_real, investigacion_adaptividad [EXTRACTED 0.90]

## Communities (5 total, 1 thin omitted)

### Community 0 - "SRS y Curva del Olvido"
Cohesion: 0.60
Nodes (5): Distributed practice (meta-análisis 254 estudios), Modelo DSR (Difficulty, Stability, Retrievability), Curva del olvido de Ebbinghaus, FSRS (Free Spaced Repetition Scheduler), SM-2 (algoritmo clásico de Anki)

### Community 1 - "Fricciones Gramaticales IT-ES"
Cohesion: 0.40
Nodes (5): Falsos amigos español-italiano, Preposiciones articuladas, Subjuntivo italiano vs español (divergencia), Transferencia positiva español→italiano, Verbos pronominales / partículas ci, ne

### Community 2 - "Adaptividad e Input Comprensible"
Cohesion: 0.50
Nodes (4): Adaptividad (ritmo/dificultad según desempeño), CEFR (A1-C2), Krashen — Input Hypothesis (i+1), Unidad 1 A1 — presentarse + essere

### Community 3 - "Diseño Anti-Duolingo"
Cohesion: 0.50
Nodes (4): Por qué Duolingo se queda corto, Vocabulario por frecuencia de uso real (corpus), Gramática explícita (no oculta), Recall activo (producción, no solo reconocimiento)

## Ambiguous Edges - Review These
- `Preposiciones articuladas` → `Transferencia positiva español→italiano`  [AMBIGUOUS]
  investigacion.md · relation: conceptually_related_to
- `Subjuntivo italiano vs español (divergencia)` → `Transferencia positiva español→italiano`  [AMBIGUOUS]
  investigacion.md · relation: conceptually_related_to
- `Verbos pronominales / partículas ci, ne` → `Transferencia positiva español→italiano`  [AMBIGUOUS]
  investigacion.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `Modelo DSR (Difficulty, Stability, Retrievability)`, `Gramática explícita (no oculta)`, `Vocabulario por frecuencia de uso real (corpus)`, `Adaptividad (ritmo/dificultad según desempeño)`, `Falsos amigos español-italiano` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Preposiciones articuladas` and `Transferencia positiva español→italiano`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Subjuntivo italiano vs español (divergencia)` and `Transferencia positiva español→italiano`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Verbos pronominales / partículas ci, ne` and `Transferencia positiva español→italiano`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Unidad 1 A1 — presentarse + essere` connect `Adaptividad e Input Comprensible` to `SRS y Curva del Olvido`, `Diseño Anti-Duolingo`?**
  _High betweenness centrality (0.320) - this node is a cross-community bridge._
- **Why does `FSRS (Free Spaced Repetition Scheduler)` connect `SRS y Curva del Olvido` to `Adaptividad e Input Comprensible`?**
  _High betweenness centrality (0.232) - this node is a cross-community bridge._
- **Why does `Recall activo (producción, no solo reconocimiento)` connect `Diseño Anti-Duolingo` to `Adaptividad e Input Comprensible`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **What connects `Modelo DSR (Difficulty, Stability, Retrievability)`, `Gramática explícita (no oculta)`, `Vocabulario por frecuencia de uso real (corpus)` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._