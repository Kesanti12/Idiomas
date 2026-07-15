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
  ],
};

function normalizeAnswer(s) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // quita acentos
    .replace(/[¿?¡!.,]/g, '')
    .trim();
}
