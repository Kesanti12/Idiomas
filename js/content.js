/*
 * Contenido curricular. Cada lección declara su nivel CEFR y descriptor.
 * Input comprensible: el diálogo usa ~90%+ vocabulario cognado/reconocible;
 * el glosario marca solo lo nuevo, en contexto (principio Krashen i+1).
 */

const CONTENT = {
  lessons: [
    {
      id: 'a1_u1_saluti',
      cefr: 'A1',
      descriptor: 'Puede presentarse y preguntar/responder datos personales básicos.',
      title: 'Saluti e presentazioni',
      titleEs: 'Saludos y presentaciones',
      dialogue: [
        { speaker: 'Marco', line: 'Ciao! Come ti chiami?' },
        { speaker: 'Giulia', line: 'Mi chiamo Giulia. E tu?' },
        { speaker: 'Marco', line: 'Io sono Marco. Piacere!' },
        { speaker: 'Giulia', line: 'Piacere mio!' },
      ],
      glossary: [
        { it: 'Come ti chiami?', es: '¿Cómo te llamas?', note: 'Literal: "¿cómo te llamas a ti mismo?" — verbo reflexivo chiamarsi.' },
        { it: 'Mi chiamo...', es: 'Me llamo...', note: null },
        { it: 'Piacere', es: 'Mucho gusto', note: 'Se usa igual que en español al presentarse; no hace falta traducir literal.' },
      ],
      grammar: {
        title: 'El verbo "essere" (ser/estar) — presente',
        explanation: 'Essere es irregular y altísima frecuencia: aparece en casi toda frase de presentación. A diferencia del español, italiano no distingue ser/estar con dos verbos — essere cubre ambos usos centrales.',
        table: [
          ['io', 'sono'], ['tu', 'sei'], ['lui/lei', 'è'],
          ['noi', 'siamo'], ['voi', 'siete'], ['loro', 'sono'],
        ],
      },
      exercises: [
        {
          id: 'ex1', type: 'fill',
          prompt: 'Completa: Io ___ Marco.',
          answer: 'sono',
          explanation: '"io" siempre va con "sono" (1ª persona singular de essere).',
          srsFront: 'Io ___ Marco. (essere, io)', srsBack: 'sono',
        },
        {
          id: 'ex2', type: 'fill',
          prompt: 'Completa: Tu ___ Giulia?',
          answer: 'sei',
          explanation: '"tu" siempre va con "sei".',
          srsFront: 'Tu ___ Giulia? (essere, tu)', srsBack: 'sei',
        },
        {
          id: 'ex3', type: 'fill',
          prompt: 'Completa: Noi ___ studenti.',
          answer: 'siamo',
          explanation: '"noi" va con "siamo".',
          srsFront: 'Noi ___ studenti. (essere, noi)', srsBack: 'siamo',
        },
        {
          id: 'ex4', type: 'translate',
          prompt: 'Traduce al italiano: "Mucho gusto"',
          answer: 'piacere',
          explanation: '"Piacere" se usa solo, como en español.',
          srsFront: '¿Cómo se dice "Mucho gusto" en italiano?', srsBack: 'Piacere',
        },
        {
          id: 'ex5', type: 'translate',
          prompt: 'Traduce al italiano: "¿Cómo te llamas?"',
          answer: 'come ti chiami',
          explanation: '"Come ti chiami?" — chiamarsi es reflexivo (como en español "llamarse").',
          srsFront: '¿Cómo se dice "¿Cómo te llamas?" en italiano?', srsBack: 'Come ti chiami?',
        },
      ],
    },
    {
      id: 'a1_u2_famiglia',
      cefr: 'A1',
      descriptor: 'Puede hablar de su familia usando "avere" y vocabulario básico de parentesco.',
      title: 'La famiglia',
      titleEs: 'La familia',
      dialogue: [
        { speaker: 'Marco', line: 'Hai fratelli?' },
        { speaker: 'Giulia', line: 'Sì, ho un fratello e una sorella. E tu?' },
        { speaker: 'Marco', line: 'Io ho solo una sorella. Come si chiama tua sorella?' },
        { speaker: 'Giulia', line: 'Si chiama Sofia.' },
      ],
      glossary: [
        { it: 'Hai fratelli?', es: '¿Tienes hermanos?', note: 'Avere = tener (no confundir con essere, ya visto en la Unidad 1).' },
        { it: 'tua sorella', es: 'tu hermana', note: 'Posesivo antes del sustantivo, como en español.' },
        { it: 'Come si chiama...?', es: '¿Cómo se llama...?', note: 'Mismo verbo chiamarsi de la Unidad 1, ahora en 3ª persona (si chiama, no ti chiami).' },
      ],
      grammar: {
        title: 'El verbo "avere" (tener) — presente',
        explanation: 'Avere es irregular y de altísima frecuencia, como essere (Unidad 1) — pero no hay que confundirlos: essere = ser/estar, avere = tener. En italiano, a diferencia del español, la "h" de "ho/hai/ha/hanno" no suena pero se escribe siempre (marca ortográfica, no fonética).',
        table: [
          ['io', 'ho'], ['tu', 'hai'], ['lui/lei', 'ha'],
          ['noi', 'abbiamo'], ['voi', 'avete'], ['loro', 'hanno'],
        ],
      },
      exercises: [
        {
          id: 'ex1', type: 'fill',
          prompt: 'Completa: Io ___ un fratello.',
          answer: 'ho',
          explanation: '"io" va con "ho" (avere), no con "sono" (essere) — son verbos distintos.',
          srsFront: 'Io ___ un fratello. (avere, io)', srsBack: 'ho',
        },
        {
          id: 'ex2', type: 'fill',
          prompt: 'Completa: Tu ___ una sorella?',
          answer: 'hai',
          explanation: '"tu" va con "hai".',
          srsFront: 'Tu ___ una sorella? (avere, tu)', srsBack: 'hai',
        },
        {
          id: 'ex3', type: 'fill',
          prompt: 'Completa: Noi ___ una famiglia grande.',
          answer: 'abbiamo',
          explanation: '"noi" va con "abbiamo".',
          srsFront: 'Noi ___ una famiglia grande. (avere, noi)', srsBack: 'abbiamo',
        },
        {
          id: 'ex4', type: 'translate',
          prompt: 'Traduce al italiano: "hermano"',
          answer: 'fratello',
          explanation: '"Fratello" — cognado reconocible del latín frater.',
          srsFront: '¿Cómo se dice "hermano" en italiano?', srsBack: 'Fratello',
        },
        {
          id: 'ex5', type: 'translate',
          prompt: 'Traduce al italiano: "¿Tienes hermanos?"',
          answer: 'hai fratelli',
          explanation: '"Hai fratelli?" — avere (no essere) para expresar posesión/parentesco.',
          srsFront: '¿Cómo se dice "¿Tienes hermanos?" en italiano?', srsBack: 'Hai fratelli?',
        },
      ],
    },
  ],
};

function normalizeAnswer(s) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // quita acentos
    .replace(/[¿?¡!.,]/g, '')
    .trim();
}
