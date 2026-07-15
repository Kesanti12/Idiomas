# Investigación base — Ciclo 1 (2026-07-15)

Síntesis accionable para diseñar el motor SRS y la curricula. No es un ensayo, son decisiones.

## 1. SRS: FSRS vs SM-2 → **decisión: FSRS (versión simplificada, pesos por defecto)**

- SM-2 (Anki clásico, 1987): fórmula fija de "ease factor", no modela olvido por ítem de forma
  explícita. Bueno, simple, pero impreciso: se desvía ±16.2% del retention target.
- FSRS (Free Spaced Repetition Scheduler): modelo DSR (**D**ifficulty, **S**tability,
  **R**etrievability) entrenado sobre ~700M reviews reales. Necesita ~20-30% menos repasos
  para la misma retención, y predice el recall con ±5.3% de error (vs ±16.2% de SM-2).
  No requiere entrenar por usuario — los pesos por defecto (community-trained) ya superan a SM-2
  para el 99.5% de los usuarios.
- **Implementación**: FSRS simplificado en JS puro (sin librerías): por ítem se guarda
  `difficulty` (D, 1-10), `stability` (S, en días) y `last_review`. Retrievability se calcula
  como `R = (1 + t/(9*S))^-1` (forgetting curve power-law de FSRS). Tras cada review se
  actualiza D y S según el rating (Again/Hard/Good/Easy) con las fórmulas estándar de FSRS-4.5
  (pesos por defecto publicados, 17 parámetros `w[0..16]`). El próximo intervalo = S ajustado a
  un retention objetivo (90%).
- Fuentes: [FSRS vs SM-2 (Flica)](https://flica.app/article/fsrs-vs-sm2),
  [Diane.app FSRS-5 vs SM-2](https://www.diane.app/en/guides/fsrs-vs-sm2),
  [Memstride](https://memstride.com/blog/fsrs-vs-sm2-algorithm-comparison/).

## 2. Curva del olvido (Ebbinghaus)

- Se olvida ~50% de info nueva en la primera hora, ~70% en 24h — la curva es exponencial.
  Cada repaso exitoso aplana la curva y alarga el intervalo óptimo siguiente (por eso FSRS/SM-2
  usan intervalos crecientes, no fijos).
- Meta-análisis de 254 estudios de "distributed practice": el intervalo óptimo depende de cuánto
  tiempo necesitás retener el material; después del primer repaso el gap óptimo aproximadamente
  se duplica cada vez (patrón típico: 1d → 3d → 7d → 14d → 30d…), que es justamente lo que FSRS
  aproxima de forma adaptativa por ítem.
- Fuente: [Wikipedia - Forgetting curve](https://en.wikipedia.org/wiki/Forgetting_curve),
  [Structural Learning](https://www.structural-learning.com/post/ebbinghaus-forgetting-curve).

## 3. Por qué Duolingo se queda corto (diseñar deliberadamente distinto)

- **Nunca obliga a producir lenguaje libre** — solo reconocimiento (opción múltiple, arrastrar
  palabras). Tocar fichas de palabras no es escribir. → Nuestra app pesa el **recall activo
  (escribir la respuesta)** sobre el reconocimiento, sobre todo pasado el nivel de introducción.
- **Gramática oculta / incompleta** — las explicaciones son secundarias o inexistentes. →
  Nosotros explicamos la regla explícitamente antes de practicarla (principio #5 de CLAUDE.md).
- **Vocabulario de baja frecuencia real / frases sin aplicación** — se pierde tiempo en frases
  "graciosas" no representativas del uso real. → Priorizar corpus de frecuencia real (principio #7).
- **Plateau en intermedio**: falta de phrasal verbs, discourse markers, registro (formal/informal).
  → A partir de B1 incluir explícitamente registro y conectores discursivos.
- Fuentes: [Clozemaster - Duolingo alternative](https://www.clozemaster.com/blog/duolingo-alternative-for-intermediate-learners/),
  [Autolingual review](https://autolingual.com/duolingo-review/).

## 4. Input comprensible (Krashen, i+1)

- Regla operativa: el input nuevo debe ser **90-95% comprensible** — el resto se infiere por
  contexto. En la práctica: cada oración/lectura nueva introduce como máximo 1 elemento
  desconocido (palabra o estructura), nunca varios a la vez.
- Debate contemporáneo: el i+1 "puro" (un único camino lineal) no sirve igual para todos los
  alumnos — sistemas adaptativos que ajustan el input a cada usuario superan un i+1 fijo. →
  Justifica el punto #9 de CLAUDE.md (adaptativo): el ritmo/dificultad de introducción de
  vocabulario nuevo se ajusta al desempeño real (aciertos/fallos), no a una secuencia fija para todos.
- Fuente: [Gianfranco Conti - 95-98% comprehensible input](https://gianfrancoconti.com/2025/02/27/why-the-input-we-give-our-learners-must-be-95-98-comprehensible-in-order-to-enhance-language-acquisition-the-theory-and-the-research-evidence/).

## 5. Italiano para hispanohablantes — puntos de fricción a diseñar explícitamente

- **Falsos amigos** (alta prioridad temprana, A1-A2): burro (mantequilla, no animal), salire
  (subir, no "salir"), guardare (mirar, no guardar), subire (sufrir/soportar, no subir),
  imbarazzata (avergonzada, no embarazada — "incinta"), caldo (caliente, no "caldo" de sopa),
  topo (ratón, no "topo"), oficio→ufficio, largo (ancho, no "largo" = lungo).
- **Preposiciones articuladas** (di+il=del, a+il=al, in+il=nel, su+il=sul, da+il=dal...): no
  tienen equivalente directo en español (contracción obligatoria preposición+artículo) → punto
  de fricción real, requiere práctica dedicada desde A1-A2, con tabla + drills.
- **Concordancia de género/número**: transferible parcialmente desde español pero con
  excepciones (ej. "la mano" fem. en ambos, pero "il problema", "il programma" masc. en italiano
  pese a terminar en -a) — aprovechar la transferencia positiva y marcar explícitamente las
  excepciones, no tratarlas como regla nueva completa.
- **Subjuntivo**: uso diverge del español en varios contextos (más extendido en italiano
  cotidiano tras "penso che", "credo che" incluso en registro informal) → introducir en B1,
  con contraste explícito español↔italiano.
- **Verbos pronominales / partícula "ci"/"ne"**: sin equivalente 1:1 en español, punto de
  fricción medio, introducir A2-B1.
- **Fonética**: dobles consonantes (geminadas) cambian significado (`pena` vs `penna`, `casa`
  vs `cassa`) — el español no las distingue igual → foco temprano en pronunciación/dictado.
- **Transferencia positiva a explotar**: léxico latino compartido (~80% cognados reconocibles),
  estructura SVO similar, sistema verbal con tiempos análogos (a diferencia de un anglófono
  aprendiendo italiano) → permite avanzar más rápido que Duolingo en la introducción de
  vocabulario de alta frecuencia, dedicando el tiempo ganado a los puntos de fricción reales.
- Fuentes: [Burbuja del Español - falsos amigos](https://burbujadelespanol.com/falsos-amigos-italiano-espanol/),
  [PONS - preposiciones articuladas](https://ponsidiomas.com/actividad/curso-pons-italiano/a1-a2-italiano-unidades-5-8/preposiciones-articuladas/).

## 6. CEFR — estructura de niveles (para mapear currícula)

- 3 bloques: **Básico** (A1 Breakthrough, A2 Waystage) — **Independiente** (B1 Threshold, B2
  Vantage) — **Competente** (C1 Effective Operational, C2 Mastery).
- A1: frases básicas, presentarse, preguntar datos personales, interacción simple si el otro
  habla despacio.
- A2: oraciones sobre info inmediata (familia, compras, entorno), tareas rutinarias simples.
- B1: maneja viajes, describe experiencias/sueños, produce texto conectado en temas conocidos.
- B2: entiende ideas principales de texto complejo (técnico incluido), interactúa con fluidez
  espontánea con nativos.
- C1: lenguaje académico/profesional con soltura — ensayos estructurados, sigue conferencias,
  argumenta una posición.
- C2: lee entre líneas, capta modismos, cambia de registro sin esfuerzo.
- Fuente: [Council of Europe - CEFR levels](https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions).

## Decisiones curriculares derivadas para A1 (unidad 1, implementada en este ciclo)

- Tema: presentarse + saludos + verbo "essere" (ser/estar) — alta frecuencia, base de casi
  toda interacción A1.
- Input comprensible: mini-diálogo con 90%+ palabras cognadas/reconocibles + glosario del 1
  elemento nuevo en contexto.
- Práctica activa: completar huecos escribiendo (no solo multiple choice), con feedback
  explicativo en el error.
- Ítems que entran al SRS: vocabulario clave + conjugación de "essere" como ítems individuales.
