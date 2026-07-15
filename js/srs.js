/*
 * Motor SRS inspirado en FSRS (modelo Difficulty/Stability/Retrievability).
 * No reproduce los pesos oficiales publicados de FSRS (serían un número
 * inventado si los "recordara" de memoria) — implementa el mismo modelo
 * conceptual con una heurística propia y documentada, ver research/investigacion.md #1.
 *
 * R(t) = (1 + t / (9 * S))^-1   — retrievability estimada a t días del último repaso.
 * Con retención objetivo 90%, el próximo intervalo óptimo ≈ S (estabilidad en días).
 */

const SRS = (() => {
  const STORAGE_KEY = 'italiano_srs_v1';
  const RATING = { AGAIN: 1, HARD: 2, GOOD: 3, EASY: 4 };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* localStorage corrupto o bloqueado: arrancamos de cero */ }
    return { items: {}, progress: { streak: 0, lastActiveDate: null, completedLessons: [], xp: 0 } };
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let state = loadState();

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function daysBetween(isoA, isoB) {
    const a = new Date(isoA + 'T00:00:00');
    const b = new Date(isoB + 'T00:00:00');
    return Math.round((b - a) / 86400000);
  }

  // Retrievability estimada al momento de repasar un ítem existente.
  function retrievability(item, onDateISO) {
    const t = Math.max(0, daysBetween(item.lastReview, onDateISO));
    return Math.pow(1 + t / (9 * item.stability), -1);
  }

  function initItem(id, front, back, meta) {
    if (state.items[id]) return state.items[id];
    const item = {
      id, front, back, meta: meta || {},
      difficulty: 5,          // 1 (fácil) - 10 (difícil), arranca neutro
      stability: 1,           // días
      due: todayISO(),        // nuevo ítem: disponible para practicar hoy
      lastReview: todayISO(),
      reps: 0,
      lapses: 0,
      introduced: false,      // true tras la primera práctica real (no la introducción de la lección)
    };
    state.items[id] = item;
    saveState(state);
    return item;
  }

  // rating: RATING.AGAIN | HARD | GOOD | EASY
  function review(id, rating) {
    const item = state.items[id];
    if (!item) throw new Error('Ítem SRS no encontrado: ' + id);
    const today = todayISO();

    if (rating === RATING.AGAIN) {
      item.stability = Math.max(0.5, item.stability * 0.25);
      item.difficulty = Math.min(10, item.difficulty + 2);
      item.lapses += 1;
      item.due = today; // reintentar hoy mismo (dentro de la misma sesión de repaso)
    } else if (item.reps === 0) {
      // Primer repaso: no hay retrievability previa que evaluar (R no tiene sentido
      // todavía), así que la estabilidad inicial se fija directo por rating en vez de
      // pasar por la fórmula de "dificultad deseable" (que necesita un R < 1 real).
      item.stability = { [RATING.HARD]: 1.5, [RATING.GOOD]: 3, [RATING.EASY]: 5 }[rating];
      item.difficulty = { [RATING.HARD]: 6, [RATING.GOOD]: 5, [RATING.EASY]: 3.5 }[rating];
      const nextIntervalDays = Math.max(1, Math.round(item.stability));
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + nextIntervalDays);
      item.due = dueDate.toISOString().slice(0, 10);
    } else {
      const R = retrievability(item, today);
      const easeBonus = { [RATING.HARD]: 0.7, [RATING.GOOD]: 1.5, [RATING.EASY]: 2.4 }[rating];
      // Efecto de "dificultad deseable": si costó recordarlo (R baja) y aun así acertó,
      // la estabilidad crece más que si era trivial recordarlo (R alta).
      const growth = 1 + ((11 - item.difficulty) / 10) * (1 - R) * easeBonus;
      item.stability = Math.max(1, item.stability * growth);
      item.difficulty = Math.max(1, item.difficulty - (rating - RATING.GOOD) * 0.8 - 0.3);
      const nextIntervalDays = Math.max(1, Math.round(item.stability));
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + nextIntervalDays);
      item.due = dueDate.toISOString().slice(0, 10);
    }
    item.reps += 1;
    item.lastReview = today;
    item.introduced = true;
    saveState(state);
    return item;
  }

  function dueItems(onDateISO) {
    const date = onDateISO || todayISO();
    return Object.values(state.items).filter(i => i.introduced && i.due <= date);
  }

  function newItemsCount() {
    return Object.values(state.items).filter(i => !i.introduced).length;
  }

  function allItems() {
    return Object.values(state.items);
  }

  function markLessonComplete(lessonId) {
    if (!state.progress.completedLessons.includes(lessonId)) {
      state.progress.completedLessons.push(lessonId);
    }
    bumpStreak();
    saveState(state);
  }

  function bumpStreak() {
    const today = todayISO();
    const last = state.progress.lastActiveDate;
    if (last === today) return;
    if (last) {
      const gap = daysBetween(last, today);
      state.progress.streak = gap === 1 ? state.progress.streak + 1 : 1;
    } else {
      state.progress.streak = 1;
    }
    state.progress.lastActiveDate = today;
  }

  function addXP(amount) {
    state.progress.xp += amount;
    saveState(state);
  }

  function getProgress() {
    return state.progress;
  }

  return {
    RATING, initItem, review, dueItems, newItemsCount, allItems,
    markLessonComplete, bumpStreak, addXP, getProgress, todayISO,
  };
})();
