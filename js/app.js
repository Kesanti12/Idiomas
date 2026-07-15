/* Router simple + pantallas. Sin framework: mantiene la app liviana y rápida en celular. */

const root = document.getElementById('app');

function render(html) {
  root.innerHTML = html;
}

// ---------- INMERSIÓN: italiano + gloss en español, audio y fonética ----------

// UI en italiano por defecto (botones, títulos, consignas) con una traducción chica
// en español debajo para que nunca haya ambigüedad sobre qué hacer.
function gloss(it, es) {
  return `${it}<span class="gloss">${es}</span>`;
}

function speakItalian(text) {
  if (!('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'it-IT';
  utter.rate = 0.85;
  window.speechSynthesis.speak(utter);
}

// data-speak en vez de onclick inline: el diálogo tiene comillas simples ("un po' di")
// que romperían un onclick="speakItalian('...')" armado a mano.
function speakerBtn(text) {
  return `<button type="button" class="speaker-btn" data-speak="${text.replace(/"/g, '&quot;')}" aria-label="Ascolta la pronuncia">🔊</button>`;
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.speaker-btn');
  if (btn) speakItalian(btn.dataset.speak);
});

// Fonética simple (no IPA) para hispanohablantes, buscada en el diccionario de la
// lección. Case-insensitive porque el mismo texto aparece con distinta capitalización
// en el diálogo, la tabla de gramática y las respuestas de los ejercicios.
function phoneticFor(lesson, text) {
  if (!lesson.phonetics || !text) return null;
  return lesson.phonetics[text.toLowerCase()] || null;
}

// Bloque reusable: texto en italiano + botón de audio + fonética si está disponible.
function italianWithAudio(lesson, text, extraClass) {
  const phon = phoneticFor(lesson, text);
  return `<span class="it-audio ${extraClass || ''}">${text} ${speakerBtn(text)}${phon ? `<div class="phonetic">${phon}</div>` : ''}</span>`;
}

// Consigna según el tipo de ítem — el problema reportado era que el usuario veía la
// frase/hueco sin ninguna indicación de qué se esperaba responder.
const INSTRUCTIONS = {
  fill: { it: 'Scrivi solo la parola mancante (non l\'intera frase).', es: 'Escribí solo la palabra que falta (no la frase entera).' },
  translate: { it: 'Traduci in italiano.', es: 'Traducí al italiano.' },
  recognize: { it: 'Cosa significa? Rispondi in spagnolo.', es: '¿Qué significa? Respondé en español.' },
};

function instructionLine(kind) {
  const i = INSTRUCTIONS[kind];
  if (!i) return '';
  return `<p class="instruction">${gloss(i.it, i.es)}</p>`;
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
      <h3>${done ? '✅ ' : '📘 '}${lesson.title} <span class="cefr-badge">${lesson.cefr}</span></h3>
      <p class="gloss-block">${lesson.titleEs}</p>
      <p style="color:var(--text-dim); font-size:14px;">${lesson.descriptor}</p>
      <button class="btn ${done ? 'secondary' : ''}" onclick="startLesson('${lesson.id}')">
        ${done ? gloss('Ripassa la lezione', 'Repasar la lección') : gloss('Inizia la lezione', 'Empezar lección')}
      </button>
    </div>`;
  }).join('');

  render(`
    <div class="top-bar">
      <span>🔥 ${gloss('Serie: ' + progress.streak + ' giorni', 'Racha: ' + progress.streak + ' día(s)')}</span>
      <span class="cefr-badge">A1</span>
    </div>
    <h1>Ciao! 👋</h1>
    <p>Impara l'italiano sul serio: input reale, pratica attiva e ripasso spaziato.<br>
       <span class="gloss-block">Aprendé italiano de verdad: input real, práctica activa y repaso espaciado.</span></p>

    <div class="card">
      <h3>🔁 ${gloss('Ripasso spaziato', 'Repaso espaciado')}</h3>
      <p style="color:var(--text-dim); font-size:14px;">
        ${due > 0
          ? gloss(`Hai ${due} elemento/i pronti da ripassare oggi.`, `Tenés ${due} ítem(s) listos para repasar hoy.`)
          : gloss('Nessun ripasso in sospeso oggi. Torna domani.', 'No hay repasos pendientes hoy. Volvé mañana.')}
      </p>
      <button class="btn ${due === 0 ? 'secondary' : ''}" ${due === 0 ? 'disabled' : ''} onclick="go('review')">
        ${gloss('Ripassa ora' + (due > 0 ? ' (' + due + ')' : ''), 'Repasar ahora')}
      </button>
    </div>

    ${lessonCards}

    <button class="btn secondary" onclick="go('progress')">${gloss('Il mio progresso', 'Ver mi progreso')}</button>
  `);
}

// ---------- LESSON ----------
let lessonState = null;

// Punto de entrada explícito para (re)empezar una lección desde Home. No alcanza con
// comparar lessonId en renderLesson: cuando la lección termina, el propio flujo interno
// pone step='done' y vuelve a llamar a renderRoute() con el mismo id — si renderLesson
// reseteara ahí, la pantalla de "lección completa" nunca se llegaría a mostrar.
function startLesson(id) {
  lessonState = { lessonId: id, step: 'dialogue', exIndex: 0, answered: false };
  go('lesson', { id }); // actualiza el hash (historial/back)
  renderLesson(id); // renderiza ya mismo — go() no dispara hashchange si el hash no cambió
}

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

// Vuelve a la tarjeta anterior dentro de la misma lección (dialogo ↔ gramática ↔
// ejercicios) sin perder el progreso ya hecho (exIndex/answered quedan como estaban).
function backTo(step) {
  lessonState.step = step;
  renderRoute();
}

function exitLink() {
  return `<a class="link" href="#home">← ${gloss('Esci', 'Salir')}</a>`;
}

function backLink(step) {
  return `<a class="link" onclick="backTo('${step}')">↩ ${gloss('Indietro', 'Atrás')}</a>`;
}

function renderDialogueStep(lesson) {
  render(`
    <div class="top-bar"><div class="top-bar-left">${exitLink()}</div><span class="cefr-badge">${lesson.cefr}</span></div>
    <h2>${lesson.title}</h2>
    <p class="gloss-block" style="margin-top:-8px;">${lesson.titleEs}</p>
    <p style="color:var(--text-dim); font-size:14px;">${gloss('Leggi il dialogo. Tocca 🔊 per ascoltare.', 'Leé el diálogo. Tocá 🔊 para escuchar.')}</p>
    <div class="card">
      ${lesson.dialogue.map(d => `<div class="dialogue-line"><div class="speaker">${d.speaker}</div><div class="line">${italianWithAudio(lesson, d.line)}</div></div>`).join('')}
    </div>
    <div class="card">
      <h3 style="font-size:15px;">${gloss('Vocabolario nuovo', 'Vocabulario nuevo')}</h3>
      ${lesson.glossary.map(g => `<div class="glossary-item"><b>${italianWithAudio(lesson, g.it)}</b> — ${g.es}${g.note ? '<br><i>' + g.note + '</i>' : ''}</div>`).join('')}
    </div>
    <button class="btn" onclick="lessonState.step='grammar'; renderRoute()">${gloss('Avanti: grammatica', 'Siguiente: gramática')}</button>
  `);
}

function renderGrammarStep(lesson) {
  const g = lesson.grammar;
  render(`
    <div class="top-bar"><div class="top-bar-left">${exitLink()}${backLink('dialogue')}</div><span class="cefr-badge">${lesson.cefr}</span></div>
    <h2>${g.title}</h2>
    <p>${g.explanation}</p>
    <div class="card">
      <table>${g.table.map(([p, f]) => `<tr><td>${p}</td><td>${italianWithAudio(lesson, f)}</td></tr>`).join('')}</table>
    </div>
    <button class="btn" onclick="lessonState.step='exercises'; renderRoute()">${gloss('Avanti: pratica', 'Siguiente: práctica')}</button>
  `);
}

function renderExerciseStep(lesson) {
  const ex = lesson.exercises[lessonState.exIndex];
  const total = lesson.exercises.length;
  const pct = Math.round((lessonState.exIndex / total) * 100);

  render(`
    <div class="top-bar"><div class="top-bar-left">${exitLink()}${backLink('grammar')}</div><span>${lessonState.exIndex + 1}/${total}</span></div>
    <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
    <div class="card">
      ${instructionLine(ex.type)}
      <h3>${ex.prompt}</h3>
      <input type="text" id="answer-input" autocomplete="off" autocapitalize="off" placeholder="Scrivi qui..." ${lessonState.answered ? 'disabled' : ''}>
      <div id="feedback-slot"></div>
    </div>
    <button class="btn" id="check-btn" onclick="checkExercise('${lesson.id}')">${lessonState.answered ? gloss('Continua', 'Continuar') : gloss('Verifica', 'Comprobar')}</button>
  `);

  const input = document.getElementById('answer-input');
  input.focus();
  input.addEventListener('keydown', e => { if (e.key === 'Enter') checkExercise(lesson.id); });

  if (lessonState.answered) {
    showExerciseFeedback(ex, lessonState.lastCorrect, lesson);
  }
}

function showExerciseFeedback(ex, correct, lesson) {
  const slot = document.getElementById('feedback-slot');
  const correctForm = ex.srsBack || ex.answer;
  slot.innerHTML = `<div class="feedback ${correct ? 'correct' : 'incorrect'}">
    ${correct ? '✅ ' + gloss('Corretto!', '¡Correcto!') : '❌ ' + gloss('La risposta era:', 'La respuesta era:') + ' <b>' + italianWithAudio(lesson, correctForm) + '</b>'}
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

    // Cada ejercicio de la lección entra al banco SRS como ítem individual. "kind" queda
    // guardado para que la pantalla de Repaso sepa qué consigna mostrar (fill/translate/
    // recognize) sin tener que adivinarlo del contenido del ítem.
    SRS.initItem(lesson.id + '_' + ex.id, ex.srsFront, ex.srsBack, { lessonId: lesson.id, kind: ex.type });
    SRS.review(lesson.id + '_' + ex.id, correct ? SRS.RATING.GOOD : SRS.RATING.AGAIN);

    // Vocabulario (no drills de conjugación): además de producir ES→IT, se agrega el
    // ítem inverso IT→ES para entrenar comprensión, no solo producción (principio #3).
    if (ex.type === 'translate' && ex.reverseFront && ex.reverseBack) {
      const revId = lesson.id + '_' + ex.id + '_rev';
      SRS.initItem(revId, ex.reverseFront, ex.reverseBack, { lessonId: lesson.id, kind: 'recognize' });
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
      <h2>🎉 ${gloss('Lezione completata!', '¡Lección completa!')}</h2>
      <p>${gloss(`Hai guadagnato 50 XP. I ${lesson.exercises.length} nuovi elementi sono già programmati nel tuo ripasso spaziato.`, `Sumaste 50 XP. Los ${lesson.exercises.length} ítems nuevos ya están programados en tu repaso espaciado.`)}</p>
      <button class="btn" onclick="go('home')">${gloss('Torna alla home', 'Volver al inicio')}</button>
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

// Interleaving real: un shuffle uniforme puede dejar, por azar, varios ítems seguidos
// de la misma lección (o toda una lección sub-representada al final de la cola si hay
// pocos repasos). Se agrupa por lección, se mezcla adentro de cada grupo, y se intercala
// round-robin entre lecciones — así cada sesión de repaso mezcla temas de verdad
// (principio #4 de CLAUDE.md), no solo "a veces le toca".
function interleaveByLesson(items) {
  const groups = {};
  items.forEach(item => {
    const key = (item.meta && item.meta.lessonId) || 'sin_leccion';
    (groups[key] = groups[key] || []).push(item);
  });
  const lessonKeys = shuffle(Object.keys(groups));
  lessonKeys.forEach(k => { groups[k] = shuffle(groups[k]); });

  const result = [];
  let remaining = true;
  while (remaining) {
    remaining = false;
    for (const key of lessonKeys) {
      if (groups[key].length) {
        result.push(groups[key].shift());
        remaining = true;
      }
    }
  }
  return result;
}

function lessonById(id) {
  return CONTENT.lessons.find(l => l.id === id) || {};
}

function renderReview() {
  if (reviewQueue === null) {
    reviewQueue = interleaveByLesson(SRS.dueItems());
    reviewIndex = 0;
  }
  if (reviewIndex >= reviewQueue.length) {
    render(`
      <div class="card" style="text-align:center;">
        <h2>✅ ${gloss('Ripasso completato', 'Repaso terminado')}</h2>
        <p>${gloss(`Hai ripassato ${reviewQueue.length} elemento/i. Il sistema ha già riprogrammato ognuno in base a come ti è andata.`, `Repasaste ${reviewQueue.length} ítem(s). El sistema ya reprogramó cada uno según cómo te fue.`)}</p>
        <button class="btn" onclick="reviewQueue=null; go('home')">${gloss('Torna alla home', 'Volver al inicio')}</button>
      </div>
    `);
    return;
  }

  const item = reviewQueue[reviewIndex];
  const lesson = lessonById(item.meta && item.meta.lessonId);
  const kind = (item.meta && item.meta.kind) || 'translate';
  // "recognize" muestra una frase en italiano de verdad (pronunciable) — ahí sí tiene
  // sentido ofrecer audio/fonética antes de responder. En "translate"/"fill" el front
  // es la consigna en español o una frase con hueco, así que el audio se ofrece recién
  // sobre la respuesta correcta, una vez revelada.
  const frontHtml = kind === 'recognize' ? italianWithAudio(lesson, item.front) : item.front;
  render(`
    <div class="top-bar"><a class="link" href="#home" onclick="reviewQueue=null">← ${gloss('Esci', 'Salir')}</a><span>${reviewIndex + 1}/${reviewQueue.length}</span></div>
    <div class="card">
      ${instructionLine(kind)}
      <h3>${frontHtml}</h3>
      <input type="text" id="review-input" autocomplete="off" autocapitalize="off" placeholder="Scrivi qui..." ${reviewAnswered ? 'disabled' : ''}>
      <div id="review-feedback"></div>
    </div>
    <div id="review-actions">
      <button class="btn" id="review-check-btn" onclick="checkReview()">${gloss('Verifica', 'Comprobar')}</button>
    </div>
  `);

  const input = document.getElementById('review-input');
  input.focus();
  input.addEventListener('keydown', e => { if (e.key === 'Enter') checkReview(); });

  if (reviewAnswered) showReviewFeedback(item, lesson, kind);
}

function showReviewFeedback(item, lesson, kind) {
  const slot = document.getElementById('review-feedback');
  // El audio/fonética solo tiene sentido cuando la respuesta correcta está en italiano
  // (kind !== 'recognize', donde la respuesta es la traducción al español).
  const backHtml = kind === 'recognize' ? item.back : italianWithAudio(lesson, item.back);
  slot.innerHTML = `<div class="feedback ${reviewCorrect ? 'correct' : 'incorrect'}">
    ${reviewCorrect ? '✅ ' + gloss('Corretto!', '¡Correcto!') : '❌ ' + gloss('La risposta era:', 'La respuesta era:') + ' <b>' + backHtml + '</b>'}
  </div>`;

  const actions = document.getElementById('review-actions');
  if (reviewCorrect) {
    actions.innerHTML = `
      <div class="rating-row">
        <button class="btn secondary" onclick="rateReview(${SRS.RATING.HARD})">😓 ${gloss('Difficile', 'Difícil')}</button>
        <button class="btn" onclick="rateReview(${SRS.RATING.GOOD})">🙂 ${gloss('Bene', 'Bien')}</button>
        <button class="btn" onclick="rateReview(${SRS.RATING.EASY})">😎 ${gloss('Facile', 'Fácil')}</button>
      </div>`;
  } else {
    actions.innerHTML = `<button class="btn danger" onclick="rateReview(${SRS.RATING.AGAIN})">${gloss('Continua', 'Vi la respuesta, seguir')}</button>`;
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

// Agrupa los ítems introducidos por fecha de repaso y arma las próximas N fechas con
// ítems pendientes (fechas vencidas se acumulan todas en "Hoy" — ya están due).
function upcomingReviewCalendar(maxDates) {
  const today = SRS.todayISO();
  const counts = {};
  SRS.allItems().filter(i => i.introduced).forEach(i => {
    const bucket = i.due <= today ? today : i.due;
    counts[bucket] = (counts[bucket] || 0) + 1;
  });
  const dates = Object.keys(counts).sort();
  return dates.slice(0, maxDates).map(date => ({ date, count: counts[date], label: formatRelativeDate(date, today) }));
}

function formatRelativeDate(dateISO, todayISO) {
  if (dateISO <= todayISO) return gloss('Oggi', 'Hoy');
  const today = new Date(todayISO + 'T00:00:00');
  const target = new Date(dateISO + 'T00:00:00');
  const diffDays = Math.round((target - today) / 86400000);
  if (diffDays === 1) return gloss('Domani', 'Mañana');
  const [, m, d] = dateISO.split('-');
  return `${d}/${m}`;
}

function renderProgress() {
  const progress = SRS.getProgress();
  const items = SRS.allItems();
  const learned = items.filter(i => i.introduced).length;
  const dueToday = SRS.dueItems().length;
  const calendar = upcomingReviewCalendar(6);

  render(`
    <div class="top-bar"><a class="link" href="#home">← ${gloss('Home', 'Inicio')}</a></div>
    <h2>${gloss('I tuoi progressi', 'Tu progreso')}</h2>
    <div class="stat-row">
      <div class="stat"><div class="num">${progress.streak}</div><div class="label">${gloss('Serie (giorni)', 'Racha (días)')}</div></div>
      <div class="stat"><div class="num">${learned}</div><div class="label">${gloss('Elementi imparati', 'Ítems aprendidos')}</div></div>
      <div class="stat"><div class="num">${progress.xp}</div><div class="label">XP</div></div>
    </div>
    <div class="card">
      <h3>${gloss('Livello CEFR approssimativo', 'Nivel CEFR aproximado')}</h3>
      <p><span class="cefr-badge">A1</span></p>
      ${CONTENT.lessons.map(l => `<p style="font-size:14px; color:var(--text-dim);">${l.title} (${l.titleEs}): ${progress.completedLessons.includes(l.id) ? 'completa ✅' : gloss('in sospeso', 'pendiente')}</p>`).join('')}
    </div>
    <div class="card">
      <h3>${gloss('Ripassi in sospeso', 'Repasos pendientes')}</h3>
      <p>${dueToday > 0 ? gloss(`${dueToday} elemento/i pronti oggi.`, `${dueToday} ítem(s) listos hoy.`) : gloss('Sei in pari! 🎉', 'Estás al día. 🎉')}</p>
      ${calendar.length > 0 ? `
        <table>
          ${calendar.map(c => `<tr><td>${c.label}</td><td>${c.count} ${gloss('elemento/i', 'ítem(s)')}</td></tr>`).join('')}
        </table>
      ` : learned > 0 ? '' : `<p style="font-size:14px; color:var(--text-dim);">${gloss('Non hai ancora imparato nessun elemento.', 'Todavía no aprendiste ningún ítem.')}</p>`}
    </div>
  `);
}
