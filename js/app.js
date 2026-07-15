/* Router simple + pantallas. Sin framework: mantiene la app liviana y rápida en celular. */

const root = document.getElementById('app');

function render(html) {
  root.innerHTML = html;
}

function go(screen, params) {
  location.hash = screen + (params ? '?' + new URLSearchParams(params).toString() : '');
}

function currentRoute() {
  const hash = location.hash.replace(/^#/, '');
  const [screen, query] = hash.split('?');
  return { screen: screen || 'home', params: Object.fromEntries(new URLSearchParams(query || '')) };
}

window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', renderRoute);

function renderRoute() {
  const { screen, params } = currentRoute();
  if (screen === 'lesson') return renderLesson(params.id);
  if (screen === 'review') return renderReview();
  if (screen === 'progress') return renderProgress();
  return renderHome();
}

// ---------- HOME ----------
function renderHome() {
  const progress = SRS.getProgress();
  const due = SRS.dueItems().length;

  const lessonCards = CONTENT.lessons.map(lesson => {
    const done = progress.completedLessons.includes(lesson.id);
    return `
    <div class="card">
      <h3>${done ? '✅ ' : '📘 '}${lesson.titleEs} <span class="cefr-badge">${lesson.cefr}</span></h3>
      <p style="color:var(--text-dim); font-size:14px;">${lesson.descriptor}</p>
      <button class="btn ${done ? 'secondary' : ''}" onclick="go('lesson', {id: '${lesson.id}'})">
        ${done ? 'Repasar la lección' : 'Empezar lección'}
      </button>
    </div>`;
  }).join('');

  render(`
    <div class="top-bar">
      <span>🔥 Racha: ${progress.streak} día(s)</span>
      <span class="cefr-badge">A1</span>
    </div>
    <h1>Ciao! 👋</h1>
    <p>Aprendé italiano de verdad: input real, práctica activa y repaso espaciado — no solo rachas.</p>

    <div class="card">
      <h3>🔁 Repaso espaciado</h3>
      <p style="color:var(--text-dim); font-size:14px;">
        ${due > 0 ? `Tenés ${due} ítem(s) listos para repasar hoy.` : 'No hay repasos pendientes hoy. Volvé mañana.'}
      </p>
      <button class="btn ${due === 0 ? 'secondary' : ''}" ${due === 0 ? 'disabled' : ''} onclick="go('review')">
        Repasar ahora ${due > 0 ? '(' + due + ')' : ''}
      </button>
    </div>

    ${lessonCards}

    <button class="btn secondary" onclick="go('progress')">Ver mi progreso</button>
  `);
}

// ---------- LESSON ----------
let lessonState = null;

function renderLesson(id) {
  const lesson = CONTENT.lessons.find(l => l.id === id);
  if (!lesson) return renderHome();
  if (!lessonState || lessonState.lessonId !== id) {
    lessonState = { lessonId: id, step: 'dialogue', exIndex: 0, answered: false };
  }
  if (lessonState.step === 'dialogue') return renderDialogueStep(lesson);
  if (lessonState.step === 'grammar') return renderGrammarStep(lesson);
  if (lessonState.step === 'exercises') return renderExerciseStep(lesson);
  if (lessonState.step === 'done') return renderLessonDone(lesson);
}

function renderDialogueStep(lesson) {
  render(`
    <div class="top-bar"><a class="link" href="#home">← Salir</a><span class="cefr-badge">${lesson.cefr}</span></div>
    <h2>${lesson.titleEs}</h2>
    <p style="color:var(--text-dim); font-size:14px;">Leé el diálogo. No hace falta entender cada palabra — el 90%+ es reconocible.</p>
    <div class="card">
      ${lesson.dialogue.map(d => `<div class="dialogue-line"><div class="speaker">${d.speaker}</div><div class="line">${d.line}</div></div>`).join('')}
    </div>
    <div class="card">
      <h3 style="font-size:15px;">Vocabulario nuevo</h3>
      ${lesson.glossary.map(g => `<div class="glossary-item"><b>${g.it}</b> — ${g.es}${g.note ? '<br><i>' + g.note + '</i>' : ''}</div>`).join('')}
    </div>
    <button class="btn" onclick="lessonState.step='grammar'; renderRoute()">Siguiente: gramática</button>
  `);
}

function renderGrammarStep(lesson) {
  const g = lesson.grammar;
  render(`
    <div class="top-bar"><a class="link" href="#home">← Salir</a><span class="cefr-badge">${lesson.cefr}</span></div>
    <h2>${g.title}</h2>
    <p>${g.explanation}</p>
    <div class="card">
      <table>${g.table.map(([p, f]) => `<tr><td>${p}</td><td>${f}</td></tr>`).join('')}</table>
    </div>
    <button class="btn" onclick="lessonState.step='exercises'; renderRoute()">Siguiente: práctica</button>
  `);
}

function renderExerciseStep(lesson) {
  const ex = lesson.exercises[lessonState.exIndex];
  const total = lesson.exercises.length;
  const pct = Math.round((lessonState.exIndex / total) * 100);

  render(`
    <div class="top-bar"><a class="link" href="#home">← Salir</a><span>${lessonState.exIndex + 1}/${total}</span></div>
    <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
    <div class="card">
      <h3>${ex.prompt}</h3>
      <input type="text" id="answer-input" autocomplete="off" autocapitalize="off" placeholder="Escribí tu respuesta..." ${lessonState.answered ? 'disabled' : ''}>
      <div id="feedback-slot"></div>
    </div>
    <button class="btn" id="check-btn" onclick="checkExercise('${lesson.id}')">${lessonState.answered ? 'Continuar' : 'Comprobar'}</button>
  `);

  const input = document.getElementById('answer-input');
  input.focus();
  input.addEventListener('keydown', e => { if (e.key === 'Enter') checkExercise(lesson.id); });

  if (lessonState.answered) {
    showExerciseFeedback(ex, lessonState.lastCorrect);
  }
}

function showExerciseFeedback(ex, correct) {
  const slot = document.getElementById('feedback-slot');
  slot.innerHTML = `<div class="feedback ${correct ? 'correct' : 'incorrect'}">
    ${correct ? '✅ ¡Correcto!' : '❌ La respuesta era: <b>' + ex.answer + '</b>'}
    <br>${ex.explanation}
  </div>`;
}

function checkExercise(lessonId) {
  const lesson = CONTENT.lessons.find(l => l.id === lessonId);
  const ex = lesson.exercises[lessonState.exIndex];

  if (!lessonState.answered) {
    const val = document.getElementById('answer-input').value;
    const correct = normalizeAnswer(val) === normalizeAnswer(ex.answer);
    lessonState.answered = true;
    lessonState.lastCorrect = correct;

    // Cada ejercicio de la lección entra al banco SRS como ítem individual.
    SRS.initItem(lesson.id + '_' + ex.id, ex.srsFront, ex.srsBack, { lessonId: lesson.id });
    SRS.review(lesson.id + '_' + ex.id, correct ? SRS.RATING.GOOD : SRS.RATING.AGAIN);

    // Vocabulario (no drills de conjugación): además de producir ES→IT, se agrega el
    // ítem inverso IT→ES para entrenar comprensión, no solo producción (principio #3).
    if (ex.type === 'translate' && ex.reverseFront && ex.reverseBack) {
      const revId = lesson.id + '_' + ex.id + '_rev';
      SRS.initItem(revId, ex.reverseFront, ex.reverseBack, { lessonId: lesson.id });
      SRS.review(revId, correct ? SRS.RATING.GOOD : SRS.RATING.AGAIN);
    }

    renderExerciseStep(lesson);
  } else {
    if (lessonState.exIndex + 1 < lesson.exercises.length) {
      lessonState.exIndex += 1;
      lessonState.answered = false;
      renderExerciseStep(lesson);
    } else {
      lessonState.step = 'done';
      SRS.markLessonComplete(lesson.id);
      SRS.addXP(50);
      renderRoute();
    }
  }
}

function renderLessonDone(lesson) {
  render(`
    <div class="card" style="text-align:center;">
      <h2>🎉 ¡Lección completa!</h2>
      <p>Sumaste 50 XP. Los ${lesson.exercises.length} ítems nuevos ya están programados en tu repaso espaciado.</p>
      <button class="btn" onclick="go('home')">Volver al inicio</button>
    </div>
  `);
}

// ---------- REVIEW ----------
let reviewQueue = null;
let reviewIndex = 0;
let reviewAnswered = false;
let reviewCorrect = false;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderReview() {
  if (reviewQueue === null) {
    // Mezclado a propósito: si no, los ítems quedan agrupados por lección (todos los
    // de essere, luego todos los de avere) y se pierde el efecto de interleaving.
    reviewQueue = shuffle(SRS.dueItems());
    reviewIndex = 0;
  }
  if (reviewIndex >= reviewQueue.length) {
    render(`
      <div class="card" style="text-align:center;">
        <h2>✅ Repaso terminado</h2>
        <p>Repasaste ${reviewQueue.length} ítem(s). El sistema ya reprogramó cada uno según cómo te fue.</p>
        <button class="btn" onclick="reviewQueue=null; go('home')">Volver al inicio</button>
      </div>
    `);
    return;
  }

  const item = reviewQueue[reviewIndex];
  render(`
    <div class="top-bar"><a class="link" href="#home" onclick="reviewQueue=null">← Salir</a><span>${reviewIndex + 1}/${reviewQueue.length}</span></div>
    <div class="card">
      <h3>${item.front}</h3>
      <input type="text" id="review-input" autocomplete="off" autocapitalize="off" placeholder="Escribí tu respuesta..." ${reviewAnswered ? 'disabled' : ''}>
      <div id="review-feedback"></div>
    </div>
    <div id="review-actions">
      <button class="btn" id="review-check-btn" onclick="checkReview()">Comprobar</button>
    </div>
  `);

  const input = document.getElementById('review-input');
  input.focus();
  input.addEventListener('keydown', e => { if (e.key === 'Enter') checkReview(); });

  if (reviewAnswered) showReviewFeedback(item);
}

function showReviewFeedback(item) {
  const slot = document.getElementById('review-feedback');
  slot.innerHTML = `<div class="feedback ${reviewCorrect ? 'correct' : 'incorrect'}">
    ${reviewCorrect ? '✅ ¡Correcto!' : '❌ La respuesta era: <b>' + item.back + '</b>'}
  </div>`;

  const actions = document.getElementById('review-actions');
  if (reviewCorrect) {
    actions.innerHTML = `
      <div class="rating-row">
        <button class="btn secondary" onclick="rateReview(${SRS.RATING.HARD})">😓 Difícil</button>
        <button class="btn" onclick="rateReview(${SRS.RATING.GOOD})">🙂 Bien</button>
        <button class="btn" onclick="rateReview(${SRS.RATING.EASY})">😎 Fácil</button>
      </div>`;
  } else {
    actions.innerHTML = `<button class="btn danger" onclick="rateReview(${SRS.RATING.AGAIN})">Vi la respuesta, seguir</button>`;
  }
}

function checkReview() {
  if (reviewAnswered) return;
  const item = reviewQueue[reviewIndex];
  const val = document.getElementById('review-input').value;
  reviewCorrect = normalizeAnswer(val) === normalizeAnswer(item.back);
  reviewAnswered = true;
  renderReview();
}

function rateReview(rating) {
  const item = reviewQueue[reviewIndex];
  SRS.review(item.id, rating);
  reviewIndex += 1;
  reviewAnswered = false;
  renderReview();
}

// ---------- PROGRESS ----------
function renderProgress() {
  const progress = SRS.getProgress();
  const items = SRS.allItems();
  const learned = items.filter(i => i.introduced).length;
  const dueToday = SRS.dueItems().length;

  render(`
    <div class="top-bar"><a class="link" href="#home">← Inicio</a></div>
    <h2>Tu progreso</h2>
    <div class="stat-row">
      <div class="stat"><div class="num">${progress.streak}</div><div class="label">Racha (días)</div></div>
      <div class="stat"><div class="num">${learned}</div><div class="label">Ítems aprendidos</div></div>
      <div class="stat"><div class="num">${progress.xp}</div><div class="label">XP</div></div>
    </div>
    <div class="card">
      <h3>Nivel CEFR aproximado</h3>
      <p><span class="cefr-badge">A1</span></p>
      ${CONTENT.lessons.map(l => `<p style="font-size:14px; color:var(--text-dim);">${l.titleEs}: ${progress.completedLessons.includes(l.id) ? 'completa ✅' : 'pendiente'}</p>`).join('')}
    </div>
    <div class="card">
      <h3>Repasos pendientes</h3>
      <p>${dueToday > 0 ? dueToday + ' ítem(s) listos hoy.' : 'Estás al día. 🎉'}</p>
    </div>
  `);
}
