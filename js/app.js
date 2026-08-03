/* Router simple + pantallas. Sin framework: mantiene la app liviana y rápida en celular. */

const root = document.getElementById('app');

function render(html) {
  root.innerHTML = html;
}

// ---------- CURSO ACTIVO (idioma que se está aprendiendo) ----------

const COURSE_STORAGE_KEY = 'idiomas_course_v1';
let selectedCourseCode = null;

function currentCourse() {
  return COURSES[selectedCourseCode];
}

function selectCourse(code) {
  selectedCourseCode = code;
  try { localStorage.setItem(COURSE_STORAGE_KEY, code); } catch (e) { /* incógnito estricto: se re-preguntará la próxima vez */ }
  SRS.setCourse(code);
  lessonState = null;
  reviewQueue = null;
  go('home');
  renderRoute();
}

// Vuelve a la pantalla de elegir idioma sin perder el progreso de ningún curso —
// cada uno vive en su propia clave de localStorage (ver SRS.setCourse).
function openLanguagePicker() {
  go('chooseLanguage');
  renderRoute();
}

function renderChooseLanguage() {
  const cards = Object.values(COURSES).map(c => `
    <button class="btn lang-card" onclick="selectCourse('${c.code}')">
      <span class="lang-flag">${c.flag}</span> ${c.name}
    </button>
  `).join('');

  render(`
    <div style="text-align:center; margin-top:30px;">
      <h1>👋</h1>
      <h2>¿Qué idioma querés aprender?</h2>
      <p style="color:var(--text-dim); font-size:14px;">Elegí un curso para empezar. Podés cambiarlo después sin perder tu progreso.</p>
    </div>
    <div class="lang-picker">${cards}</div>
  `);
}

// ---------- INMERSIÓN: idioma del curso + gloss en español, audio y fonética ----------

// UI en el idioma del curso por defecto (botones, títulos, consignas) con una
// traducción chica en español debajo para que nunca haya ambigüedad sobre qué hacer.
function gloss(target, es) {
  return `${target}<span class="gloss">${es}</span>`;
}

// Diccionario de textos fijos de la UI, por curso. Cada entrada es [texto-en-el-idioma,
// traducción-al-español] o una función que devuelve ese par (para las que llevan datos
// dinámicos, ej. contadores). ui(key, ...args) arma el bloque con gloss() listo para
// insertar; uiRaw(key, ...args) devuelve solo el texto en el idioma (para atributos
// como placeholder, donde no puede ir HTML).
const UI = {
  it: {
    greeting: ['Ciao! 👋', 'Ciao! 👋'],
    tagline: ["Impara l'italiano sul serio: input reale, pratica attiva e ripasso spaziato.", 'Aprendé italiano de verdad: input real, práctica activa y repaso espaciado.'],
    streak: n => [`Serie: ${n} giorni`, `Racha: ${n} día(s)`],
    reviewCardTitle: ['Ripasso spaziato', 'Repaso espaciado'],
    dueMsg: n => n > 0
      ? [`Hai ${n} elemento/i pronti da ripassare oggi.`, `Tenés ${n} ítem(s) listos para repasar hoy.`]
      : ['Nessun ripasso in sospeso oggi. Torna domani.', 'No hay repasos pendientes hoy. Volvé mañana.'],
    reviewBtn: n => [`Ripassa ora${n > 0 ? ' (' + n + ')' : ''}`, 'Repasar ahora'],
    lessonDoneBtn: ['Ripassa la lezione', 'Repasar la lección'],
    lessonStartBtn: ['Inizia la lezione', 'Empezar lección'],
    myProgress: ['Il mio progresso', 'Ver mi progreso'],
    exit: ['Esci', 'Salir'],
    back: ['Indietro', 'Atrás'],
    dialogueHint: ['Leggi il dialogo. Tocca 🔊 per ascoltare.', 'Leé el diálogo. Tocá 🔊 para escuchar.'],
    newVocab: ['Vocabolario nuovo', 'Vocabulario nuevo'],
    nextGrammar: ['Avanti: grammatica', 'Siguiente: gramática'],
    nextPractice: ['Avanti: pratica', 'Siguiente: práctica'],
    writeHere: 'Scrivi qui...',
    continueBtn: ['Continua', 'Continuar'],
    checkBtn: ['Verifica', 'Comprobar'],
    correct: ['Corretto!', '¡Correcto!'],
    answerWas: ['La risposta era:', 'La respuesta era:'],
    lessonCompleteTitle: ['Lezione completata!', '¡Lección completa!'],
    lessonCompleteMsg: n => [`Hai guadagnato 50 XP. I ${n} nuovi elementi sono già programmati nel tuo ripasso spaziato.`, `Sumaste 50 XP. Los ${n} ítems nuevos ya están programados en tu repaso espaciado.`],
    backHome: ['Torna alla home', 'Volver al inicio'],
    reviewDoneTitle: ['Ripasso completato', 'Repaso terminado'],
    reviewDoneMsg: n => [`Hai ripassato ${n} elemento/i. Il sistema ha già riprogrammato ognuno in base a come ti è andata.`, `Repasaste ${n} ítem(s). El sistema ya reprogramó cada uno según cómo te fue.`],
    hard: ['Difficile', 'Difícil'], good: ['Bene', 'Bien'], easy: ['Facile', 'Fácil'],
    sawAnswerContinue: ['Continua', 'Vi la respuesta, seguir'],
    home: ['Home', 'Inicio'],
    progressTitle: ['I tuoi progressi', 'Tu progreso'],
    streakLabel: ['Serie (giorni)', 'Racha (días)'],
    learnedLabel: ['Elementi imparati', 'Ítems aprendidos'],
    cefrTitle: ['Livello CEFR approssimativo', 'Nivel CEFR aproximado'],
    pending: ['in sospeso', 'pendiente'],
    pendingReviewsTitle: ['Ripassi in sospeso', 'Repasos pendientes'],
    dueTodayCount: n => [`${n} elemento/i pronti oggi.`, `${n} ítem(s) listos hoy.`],
    allCaughtUp: ['Sei in pari! 🎉', 'Estás al día. 🎉'],
    today: ['Oggi', 'Hoy'], tomorrow: ['Domani', 'Mañana'],
    itemsUnit: ['elemento/i', 'ítem(s)'],
    noItemsYet: ['Non hai ancora imparato nessun elemento.', 'Todavía no aprendiste ningún ítem.'],
  },
  pt: {
    greeting: ['Oi! 👋', '¡Hola! 👋'],
    tagline: ['Aprenda português de verdade: input real, prática ativa e revisão espaçada.', 'Aprendé portugués de verdad: input real, práctica activa y repaso espaciado.'],
    streak: n => [`Sequência: ${n} dias`, `Racha: ${n} día(s)`],
    reviewCardTitle: ['Revisão espaçada', 'Repaso espaciado'],
    dueMsg: n => n > 0
      ? [`Você tem ${n} item(ns) pronto(s) para revisar hoje.`, `Tenés ${n} ítem(s) listos para repasar hoy.`]
      : ['Nenhuma revisão pendente hoje. Volte amanhã.', 'No hay repasos pendientes hoy. Volvé mañana.'],
    reviewBtn: n => [`Revisar agora${n > 0 ? ' (' + n + ')' : ''}`, 'Repasar ahora'],
    lessonDoneBtn: ['Revisar a lição', 'Repasar la lección'],
    lessonStartBtn: ['Começar a lição', 'Empezar lección'],
    myProgress: ['Meu progresso', 'Ver mi progreso'],
    exit: ['Sair', 'Salir'],
    back: ['Voltar', 'Atrás'],
    dialogueHint: ['Leia o diálogo. Toque 🔊 para ouvir.', 'Leé el diálogo. Tocá 🔊 para escuchar.'],
    newVocab: ['Vocabulário novo', 'Vocabulario nuevo'],
    nextGrammar: ['Avançar: gramática', 'Siguiente: gramática'],
    nextPractice: ['Avançar: prática', 'Siguiente: práctica'],
    writeHere: 'Escreva aqui...',
    continueBtn: ['Continuar', 'Continuar'],
    checkBtn: ['Verificar', 'Comprobar'],
    correct: ['Correto!', '¡Correcto!'],
    answerWas: ['A resposta era:', 'La respuesta era:'],
    lessonCompleteTitle: ['Lição completa!', '¡Lección completa!'],
    lessonCompleteMsg: n => [`Você ganhou 50 XP. Os ${n} novos itens já estão programados na sua revisão espaçada.`, `Sumaste 50 XP. Los ${n} ítems nuevos ya están programados en tu repaso espaciado.`],
    backHome: ['Voltar ao início', 'Volver al inicio'],
    reviewDoneTitle: ['Revisão concluída', 'Repaso terminado'],
    reviewDoneMsg: n => [`Você revisou ${n} item(ns). O sistema já reprogramou cada um de acordo com o seu desempenho.`, `Repasaste ${n} ítem(s). El sistema ya reprogramó cada uno según cómo te fue.`],
    hard: ['Difícil', 'Difícil'], good: ['Bom', 'Bien'], easy: ['Fácil', 'Fácil'],
    sawAnswerContinue: ['Continuar', 'Vi la respuesta, seguir'],
    home: ['Início', 'Inicio'],
    progressTitle: ['Seu progresso', 'Tu progreso'],
    streakLabel: ['Sequência (dias)', 'Racha (días)'],
    learnedLabel: ['Itens aprendidos', 'Ítems aprendidos'],
    cefrTitle: ['Nível CEFR aproximado', 'Nivel CEFR aproximado'],
    pending: ['pendente', 'pendiente'],
    pendingReviewsTitle: ['Revisões pendentes', 'Repasos pendientes'],
    dueTodayCount: n => [`${n} item(ns) pronto(s) hoje.`, `${n} ítem(s) listos hoy.`],
    allCaughtUp: ['Você está em dia! 🎉', 'Estás al día. 🎉'],
    today: ['Hoje', 'Hoy'], tomorrow: ['Amanhã', 'Mañana'],
    itemsUnit: ['item(ns)', 'ítem(s)'],
    noItemsYet: ['Você ainda não aprendeu nenhum item.', 'Todavía no aprendiste ningún ítem.'],
  },
};

function ui(key, ...args) {
  const entry = UI[selectedCourseCode][key];
  const pair = typeof entry === 'function' ? entry(...args) : entry;
  return gloss(pair[0], pair[1]);
}

function uiRaw(key, ...args) {
  const entry = UI[selectedCourseCode][key];
  const pair = typeof entry === 'function' ? entry(...args) : entry;
  return typeof pair === 'string' ? pair : pair[0];
}

function speakText(text, lang) {
  if (!('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang || 'it-IT';
  utter.rate = 0.85;
  window.speechSynthesis.speak(utter);
}

// data-speak/data-lang en vez de onclick inline: el diálogo tiene comillas simples
// ("un po' di") que romperían un onclick="speakText('...')" armado a mano.
function speakerBtn(text, lang) {
  return `<button type="button" class="speaker-btn" data-speak="${text.replace(/"/g, '&quot;')}" data-lang="${lang}" aria-label="Ascolta la pronuncia">🔊</button>`;
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.speaker-btn');
  if (btn) speakText(btn.dataset.speak, btn.dataset.lang);
});

// Fonética simple (no IPA) para hispanohablantes, buscada en el diccionario de la
// lección. Case-insensitive porque el mismo texto aparece con distinta capitalización
// en el diálogo, la tabla de gramática y las respuestas de los ejercicios.
function phoneticFor(lesson, text) {
  if (!lesson.phonetics || !text) return null;
  return lesson.phonetics[text.toLowerCase()] || null;
}

// Bloque reusable: texto en el idioma del curso + botón de audio + fonética si existe.
function wordWithAudio(lesson, text, extraClass) {
  const phon = phoneticFor(lesson, text);
  return `<span class="it-audio ${extraClass || ''}">${text} ${speakerBtn(text, currentCourse().speechLang)}${phon ? `<div class="phonetic">${phon}</div>` : ''}</span>`;
}

// Consigna según el tipo de ítem, por curso — el problema reportado originalmente era
// que el usuario veía la frase/hueco sin ninguna indicación de qué se esperaba responder.
const INSTRUCTIONS = {
  it: {
    fill: { target: 'Scrivi solo la parola mancante (non l\'intera frase).', es: 'Escribí solo la palabra que falta (no la frase entera).' },
    translate: { target: 'Traduci in italiano.', es: 'Traducí al italiano.' },
    recognize: { target: 'Cosa significa? Rispondi in spagnolo.', es: '¿Qué significa? Respondé en español.' },
  },
  pt: {
    fill: { target: 'Escreva apenas a palavra que falta (não a frase inteira).', es: 'Escribí solo la palabra que falta (no la frase entera).' },
    translate: { target: 'Traduza para o português.', es: 'Traducí al portugués.' },
    recognize: { target: 'O que significa? Responda em espanhol.', es: '¿Qué significa? Respondé en español.' },
  },
};

function instructionLine(kind) {
  const i = INSTRUCTIONS[selectedCourseCode][kind];
  if (!i) return '';
  return `<p class="instruction">${gloss(i.target, i.es)}</p>`;
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
window.addEventListener('DOMContentLoaded', () => {
  try {
    const saved = localStorage.getItem(COURSE_STORAGE_KEY);
    if (saved && COURSES[saved]) {
      selectedCourseCode = saved;
      SRS.setCourse(saved);
    }
  } catch (e) { /* incógnito estricto: se pedirá elegir idioma esta sesión */ }
  renderRoute();
});

function renderRoute() {
  if (!selectedCourseCode) return renderChooseLanguage();
  const { screen, params } = currentRoute();
  if (screen === 'chooseLanguage') return renderChooseLanguage();
  if (screen === 'lesson') return renderLesson(params.id);
  if (screen === 'review') return renderReview();
  if (screen === 'progress') return renderProgress();
  return renderHome();
}

// ---------- HOME ----------
function renderHome() {
  const course = currentCourse();
  const progress = SRS.getProgress();
  const due = SRS.dueItems().length;

  const lessonCards = course.lessons.map(lesson => {
    const done = progress.completedLessons.includes(lesson.id);
    return `
    <div class="card">
      <h3>${done ? '✅ ' : '📘 '}${lesson.title} <span class="cefr-badge">${lesson.cefr}</span></h3>
      <p class="gloss-block">${lesson.titleEs}</p>
      <p style="color:var(--text-dim); font-size:14px;">${lesson.descriptor}</p>
      <button class="btn ${done ? 'secondary' : ''}" onclick="startLesson('${lesson.id}')">
        ${done ? ui('lessonDoneBtn') : ui('lessonStartBtn')}
      </button>
    </div>`;
  }).join('');

  render(`
    <div class="top-bar">
      <span>🔥 ${ui('streak', progress.streak)}</span>
      <span class="lang-switch" onclick="openLanguagePicker()" title="Cambiar idioma">${course.flag} 🌐</span>
    </div>
    <h1>${uiRaw('greeting')}</h1>
    <p>${ui('tagline')}</p>

    <div class="card">
      <h3>🔁 ${ui('reviewCardTitle')}</h3>
      <p style="color:var(--text-dim); font-size:14px;">${ui('dueMsg', due)}</p>
      <button class="btn ${due === 0 ? 'secondary' : ''}" ${due === 0 ? 'disabled' : ''} onclick="go('review')">
        ${ui('reviewBtn', due)}
      </button>
    </div>

    ${lessonCards}

    <button class="btn secondary" onclick="go('progress')">${ui('myProgress')}</button>
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
  const lesson = currentCourse().lessons.find(l => l.id === id);
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
  return `<a class="link" href="#home">← ${ui('exit')}</a>`;
}

function backLink(step) {
  return `<a class="link" onclick="backTo('${step}')">↩ ${ui('back')}</a>`;
}

function renderDialogueStep(lesson) {
  render(`
    <div class="top-bar"><div class="top-bar-left">${exitLink()}</div><span class="cefr-badge">${lesson.cefr}</span></div>
    <h2>${lesson.title}</h2>
    <p class="gloss-block" style="margin-top:-8px;">${lesson.titleEs}</p>
    <p style="color:var(--text-dim); font-size:14px;">${ui('dialogueHint')}</p>
    <div class="card">
      ${lesson.dialogue.map(d => `<div class="dialogue-line"><div class="speaker">${d.speaker}</div><div class="line">${wordWithAudio(lesson, d.line)}</div></div>`).join('')}
    </div>
    <div class="card">
      <h3 style="font-size:15px;">${ui('newVocab')}</h3>
      ${lesson.glossary.map(g => `<div class="glossary-item"><b>${wordWithAudio(lesson, g.target)}</b> — ${g.es}${g.note ? '<br><i>' + g.note + '</i>' : ''}</div>`).join('')}
    </div>
    <button class="btn" onclick="lessonState.step='grammar'; renderRoute()">${ui('nextGrammar')}</button>
  `);
}

function renderGrammarStep(lesson) {
  const g = lesson.grammar;
  render(`
    <div class="top-bar"><div class="top-bar-left">${exitLink()}${backLink('dialogue')}</div><span class="cefr-badge">${lesson.cefr}</span></div>
    <h2>${g.title}</h2>
    <p>${g.explanation}</p>
    <div class="card">
      <table>${g.table.map(([p, f]) => `<tr><td>${p}</td><td>${wordWithAudio(lesson, f)}</td></tr>`).join('')}</table>
    </div>
    <button class="btn" onclick="lessonState.step='exercises'; renderRoute()">${ui('nextPractice')}</button>
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
      <input type="text" id="answer-input" autocomplete="off" autocapitalize="off" placeholder="${uiRaw('writeHere')}" ${lessonState.answered ? 'disabled' : ''}>
      <div id="feedback-slot"></div>
    </div>
    <button class="btn" id="check-btn" onclick="checkExercise('${lesson.id}')">${lessonState.answered ? ui('continueBtn') : ui('checkBtn')}</button>
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
    ${correct ? '✅ ' + ui('correct') : '❌ ' + ui('answerWas') + ' <b>' + wordWithAudio(lesson, correctForm) + '</b>'}
    <br>${ex.explanation}
  </div>`;
}

function checkExercise(lessonId) {
  const lesson = currentCourse().lessons.find(l => l.id === lessonId);
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

    // Vocabulario (no drills de conjugación): además de producir ES→idioma, se agrega
    // el ítem inverso idioma→ES para entrenar comprensión, no solo producción (principio #3).
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
      <h2>🎉 ${ui('lessonCompleteTitle')}</h2>
      <p>${ui('lessonCompleteMsg', lesson.exercises.length)}</p>
      <button class="btn" onclick="go('home')">${ui('backHome')}</button>
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
  return currentCourse().lessons.find(l => l.id === id) || {};
}

function renderReview() {
  if (reviewQueue === null) {
    reviewQueue = interleaveByLesson(SRS.dueItems());
    reviewIndex = 0;
  }
  if (reviewIndex >= reviewQueue.length) {
    render(`
      <div class="card" style="text-align:center;">
        <h2>✅ ${ui('reviewDoneTitle')}</h2>
        <p>${ui('reviewDoneMsg', reviewQueue.length)}</p>
        <button class="btn" onclick="reviewQueue=null; go('home')">${ui('backHome')}</button>
      </div>
    `);
    return;
  }

  const item = reviewQueue[reviewIndex];
  const lesson = lessonById(item.meta && item.meta.lessonId);
  const kind = (item.meta && item.meta.kind) || 'translate';
  // "recognize" muestra una frase de verdad en el idioma del curso (pronunciable) — ahí
  // sí tiene sentido ofrecer audio/fonética antes de responder. En "translate"/"fill" el
  // front es la consigna en español o una frase con hueco, así que el audio se ofrece
  // recién sobre la respuesta correcta, una vez revelada.
  const frontHtml = kind === 'recognize' ? wordWithAudio(lesson, item.front) : item.front;
  render(`
    <div class="top-bar"><a class="link" href="#home" onclick="reviewQueue=null">← ${ui('exit')}</a><span>${reviewIndex + 1}/${reviewQueue.length}</span></div>
    <div class="card">
      ${instructionLine(kind)}
      <h3>${frontHtml}</h3>
      <input type="text" id="review-input" autocomplete="off" autocapitalize="off" placeholder="${uiRaw('writeHere')}" ${reviewAnswered ? 'disabled' : ''}>
      <div id="review-feedback"></div>
    </div>
    <div id="review-actions">
      <button class="btn" id="review-check-btn" onclick="checkReview()">${ui('checkBtn')}</button>
    </div>
  `);

  const input = document.getElementById('review-input');
  input.focus();
  input.addEventListener('keydown', e => { if (e.key === 'Enter') checkReview(); });

  if (reviewAnswered) showReviewFeedback(item, lesson, kind);
}

function showReviewFeedback(item, lesson, kind) {
  const slot = document.getElementById('review-feedback');
  // El audio/fonética solo tiene sentido cuando la respuesta correcta está en el idioma
  // del curso (kind !== 'recognize', donde la respuesta es la traducción al español).
  const backHtml = kind === 'recognize' ? item.back : wordWithAudio(lesson, item.back);
  slot.innerHTML = `<div class="feedback ${reviewCorrect ? 'correct' : 'incorrect'}">
    ${reviewCorrect ? '✅ ' + ui('correct') : '❌ ' + ui('answerWas') + ' <b>' + backHtml + '</b>'}
  </div>`;

  const actions = document.getElementById('review-actions');
  if (reviewCorrect) {
    actions.innerHTML = `
      <div class="rating-row">
        <button class="btn secondary" onclick="rateReview(${SRS.RATING.HARD})">😓 ${ui('hard')}</button>
        <button class="btn" onclick="rateReview(${SRS.RATING.GOOD})">🙂 ${ui('good')}</button>
        <button class="btn" onclick="rateReview(${SRS.RATING.EASY})">😎 ${ui('easy')}</button>
      </div>`;
  } else {
    actions.innerHTML = `<button class="btn danger" onclick="rateReview(${SRS.RATING.AGAIN})">${ui('sawAnswerContinue')}</button>`;
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
  if (dateISO <= todayISO) return ui('today');
  const today = new Date(todayISO + 'T00:00:00');
  const target = new Date(dateISO + 'T00:00:00');
  const diffDays = Math.round((target - today) / 86400000);
  if (diffDays === 1) return ui('tomorrow');
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
    <div class="top-bar"><a class="link" href="#home">← ${ui('home')}</a></div>
    <h2>${ui('progressTitle')}</h2>
    <div class="stat-row">
      <div class="stat"><div class="num">${progress.streak}</div><div class="label">${ui('streakLabel')}</div></div>
      <div class="stat"><div class="num">${learned}</div><div class="label">${ui('learnedLabel')}</div></div>
      <div class="stat"><div class="num">${progress.xp}</div><div class="label">XP</div></div>
    </div>
    <div class="card">
      <h3>${ui('cefrTitle')}</h3>
      <p><span class="cefr-badge">A1</span></p>
      ${currentCourse().lessons.map(l => `<p style="font-size:14px; color:var(--text-dim);">${l.title} (${l.titleEs}): ${progress.completedLessons.includes(l.id) ? 'completa ✅' : ui('pending')}</p>`).join('')}
    </div>
    <div class="card">
      <h3>${ui('pendingReviewsTitle')}</h3>
      <p>${dueToday > 0 ? ui('dueTodayCount', dueToday) : ui('allCaughtUp')}</p>
      ${calendar.length > 0 ? `
        <table>
          ${calendar.map(c => `<tr><td>${c.label}</td><td>${c.count} ${ui('itemsUnit')}</td></tr>`).join('')}
        </table>
      ` : learned > 0 ? '' : `<p style="font-size:14px; color:var(--text-dim);">${ui('noItemsYet')}</p>`}
    </div>
  `);
}
