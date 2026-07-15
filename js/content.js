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
          reverseFront: 'Piacere', reverseBack: 'Mucho gusto',
        },
        {
          id: 'ex5', type: 'translate',
          prompt: 'Traduce al italiano: "¿Cómo te llamas?"',
          answer: 'come ti chiami',
          explanation: '"Come ti chiami?" — chiamarsi es reflexivo (como en español "llamarse").',
          srsFront: '¿Cómo se dice "¿Cómo te llamas?" en italiano?', srsBack: 'Come ti chiami?',
          reverseFront: 'Come ti chiami?', reverseBack: '¿Cómo te llamas?',
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
          reverseFront: 'Fratello', reverseBack: 'Hermano',
        },
        {
          id: 'ex5', type: 'translate',
          prompt: 'Traduce al italiano: "¿Tienes hermanos?"',
          answer: 'hai fratelli',
          explanation: '"Hai fratelli?" — avere (no essere) para expresar posesión/parentesco.',
          srsFront: '¿Cómo se dice "¿Tienes hermanos?" en italiano?', srsBack: 'Hai fratelli?',
          reverseFront: 'Hai fratelli?', reverseBack: '¿Tienes hermanos?',
        },
      ],
    },
    {
      id: 'a1_u3_eta',
      cefr: 'A1',
      descriptor: 'Puede decir y preguntar la edad, y usar los números del 0 al 10.',
      title: "L'età e i numeri",
      titleEs: 'La edad y los números',
      dialogue: [
        { speaker: 'Marco', line: 'Quanti anni hai?' },
        { speaker: 'Giulia', line: 'Ho venti anni. E tu?' },
        { speaker: 'Marco', line: 'Io ho ventidue anni.' },
        { speaker: 'Giulia', line: 'Sei giovane!' },
      ],
      glossary: [
        { it: 'Quanti anni hai?', es: '¿Cuántos años tienes?', note: 'Literal "¿Cuántos años tienes?" — igual estructura que el español.' },
        { it: 'giovane', es: 'joven', note: null },
      ],
      grammar: {
        title: '"Avere ... anni" para la edad, y los números 0-10',
        explanation: 'Igual que en español decimos "tener X años" (no "ser X años"), en italiano se usa avere + número + anni — mismo patrón, transferencia directa desde el español (ya conocés avere de la Unidad 2). A diferencia del español, "anni" siempre va en plural, incluso con "un anno" pasa a plural desde "due anni" en adelante, igual que en español.',
        table: [
          ['0', 'zero'], ['1', 'uno'], ['2', 'due'], ['3', 'tre'], ['4', 'quattro'],
          ['5', 'cinque'], ['6', 'sei'], ['7', 'sette'], ['8', 'otto'], ['9', 'nove'], ['10', 'dieci'],
        ],
      },
      exercises: [
        {
          id: 'ex1', type: 'fill',
          prompt: 'Completa: Io ___ venti anni.',
          answer: 'ho',
          explanation: 'Repaso de avere (Unidad 2): "io" siempre va con "ho", también para la edad.',
          srsFront: 'Io ___ venti anni. (avere, io)', srsBack: 'ho',
        },
        {
          id: 'ex2', type: 'fill',
          prompt: 'Completa: Tu ___ dieci anni?',
          answer: 'hai',
          explanation: '"tu" va con "hai".',
          srsFront: 'Tu ___ dieci anni? (avere, tu)', srsBack: 'hai',
        },
        {
          id: 'ex3', type: 'translate',
          prompt: 'Traduce al italiano: "¿Cuántos años tienes?"',
          answer: 'quanti anni hai',
          explanation: '"Quanti anni hai?" — misma estructura que en español.',
          srsFront: '¿Cómo se dice "¿Cuántos años tienes?" en italiano?', srsBack: 'Quanti anni hai?',
          reverseFront: 'Quanti anni hai?', reverseBack: '¿Cuántos años tienes?',
        },
        {
          id: 'ex4', type: 'translate',
          prompt: 'Traduce al italiano: "diez"',
          answer: 'dieci',
          explanation: '"Dieci" — cognado reconocible del latín decem.',
          srsFront: '¿Cómo se dice "diez" en italiano?', srsBack: 'Dieci',
          reverseFront: 'Dieci', reverseBack: 'Diez',
        },
        {
          id: 'ex5', type: 'translate',
          prompt: 'Traduce al italiano: "cinco"',
          answer: 'cinque',
          explanation: '"Cinque" — cognado reconocible del latín quinque.',
          srsFront: '¿Cómo se dice "cinco" en italiano?', srsBack: 'Cinque',
          reverseFront: 'Cinque', reverseBack: 'Cinco',
        },
      ],
    },
    {
      id: 'a1_u4_parlare',
      cefr: 'A1',
      descriptor: 'Puede decir qué idiomas habla usando el patrón regular de los verbos en -are.',
      title: 'Che lingue parli?',
      titleEs: '¿Qué idiomas hablas?',
      dialogue: [
        { speaker: 'Marco', line: 'Parli italiano?' },
        { speaker: 'Giulia', line: 'Sì, parlo italiano e spagnolo. Tu parli inglese?' },
        { speaker: 'Marco', line: "Sì, parlo inglese e un po' d'italiano." },
        { speaker: 'Giulia', line: 'Bravo!' },
      ],
      glossary: [
        { it: "un po' di", es: 'un poco de', note: null },
        { it: 'Bravo!', es: '¡Bien hecho!', note: 'Cognado directo — mismo uso que en español al felicitar.' },
      ],
      grammar: {
        title: 'Verbos regulares en -are (ej. "parlare" = hablar)',
        explanation: 'A diferencia de essere y avere (irregulares, Unidades 1 y 2 — hay que memorizar cada forma), "parlare" sigue un patrón regular que se repite en cientos de verbos italianos (mangiare=comer, guardare=mirar, ascoltare=escuchar...). Aprender esta terminación una sola vez multiplica el vocabulario que ya podés conjugar.',
        table: [
          ['io', 'parlo'], ['tu', 'parli'], ['lui/lei', 'parla'],
          ['noi', 'parliamo'], ['voi', 'parlate'], ['loro', 'parlano'],
        ],
      },
      exercises: [
        {
          id: 'ex1', type: 'fill',
          prompt: 'Completa: Io ___ italiano.',
          answer: 'parlo',
          explanation: '"io" + verbos en -are → termina en "-o" (parlo).',
          srsFront: 'Io ___ italiano. (parlare, io)', srsBack: 'parlo',
        },
        {
          id: 'ex2', type: 'fill',
          prompt: 'Completa: Tu ___ inglese?',
          answer: 'parli',
          explanation: '"tu" + verbos en -are → termina en "-i" (parli).',
          srsFront: 'Tu ___ inglese? (parlare, tu)', srsBack: 'parli',
        },
        {
          id: 'ex3', type: 'fill',
          prompt: 'Completa: Noi ___ spagnolo.',
          answer: 'parliamo',
          explanation: '"noi" + verbos en -are → termina en "-iamo" (parliamo).',
          srsFront: 'Noi ___ spagnolo. (parlare, noi)', srsBack: 'parliamo',
        },
        {
          id: 'ex4', type: 'translate',
          prompt: 'Traduce al italiano: "hablar" (infinitivo)',
          answer: 'parlare',
          explanation: '"Parlare" — cognado reconocible; el patrón -are es el más común entre los verbos italianos.',
          srsFront: '¿Cómo se dice "hablar" en italiano?', srsBack: 'Parlare',
          reverseFront: 'Parlare', reverseBack: 'Hablar',
        },
        {
          id: 'ex5', type: 'translate',
          prompt: 'Traduce al italiano: "¿Hablas italiano?"',
          answer: 'parli italiano',
          explanation: '"Parli italiano?" — "tu" siempre con "parli".',
          srsFront: '¿Cómo se dice "¿Hablas italiano?" en italiano?', srsBack: 'Parli italiano?',
          reverseFront: 'Parli italiano?', reverseBack: '¿Hablas italiano?',
        },
      ],
    },
    {
      id: 'a1_u5_prendere',
      cefr: 'A1',
      descriptor: 'Puede pedir algo en un bar/café usando el segundo patrón de conjugación regular (-ere).',
      title: 'Cosa prendi?',
      titleEs: '¿Qué tomas?',
      dialogue: [
        { speaker: 'Marco', line: 'Cosa prendi?' },
        { speaker: 'Giulia', line: 'Prendo un caffè. E tu?' },
        { speaker: 'Marco', line: 'Io prendo un tè.' },
        { speaker: 'Giulia', line: 'Va bene!' },
      ],
      glossary: [
        { it: 'Cosa prendi?', es: '¿Qué tomas/pedís?', note: 'Se usa así en bares y cafés, no solo literal "tomar".' },
        { it: 'Va bene', es: 'Está bien / dale', note: null },
      ],
      grammar: {
        title: 'Verbos regulares en -ere (ej. "prendere" = tomar/pedir)',
        explanation: 'Segundo patrón regular, después de -are (Unidad 4, "parlare"). Comparten "io" (-o) y "tu" (-i), pero difieren en el resto: lui/lei termina en "-e" (no "-a"), voi en "-ete" (no "-ate"), loro en "-ono" (no "-ano"). Reconocer estas dos terminaciones (-are, -ere) ya cubre la mayoría de verbos regulares italianos.',
        table: [
          ['io', 'prendo'], ['tu', 'prendi'], ['lui/lei', 'prende'],
          ['noi', 'prendiamo'], ['voi', 'prendete'], ['loro', 'prendono'],
        ],
      },
      exercises: [
        {
          id: 'ex1', type: 'fill',
          prompt: 'Completa: Io ___ un caffè.',
          answer: 'prendo',
          explanation: '"io" + verbos en -ere → también termina en "-o" (igual que en -are).',
          srsFront: 'Io ___ un caffè. (prendere, io)', srsBack: 'prendo',
        },
        {
          id: 'ex2', type: 'fill',
          prompt: 'Completa: Tu ___ un tè?',
          answer: 'prendi',
          explanation: '"tu" + verbos en -ere → también termina en "-i" (igual que en -are).',
          srsFront: 'Tu ___ un tè? (prendere, tu)', srsBack: 'prendi',
        },
        {
          id: 'ex3', type: 'fill',
          prompt: 'Completa: Lei ___ un cappuccino.',
          answer: 'prende',
          explanation: '"lui/lei" + verbos en -ere → termina en "-e" (a diferencia de "-a" en -are).',
          srsFront: 'Lei ___ un cappuccino. (prendere, lei)', srsBack: 'prende',
        },
        {
          id: 'ex4', type: 'translate',
          prompt: 'Traduce al italiano: "tomar/pedir" (infinitivo)',
          answer: 'prendere',
          explanation: '"Prendere" — el segundo patrón regular más común, después de -are.',
          srsFront: '¿Cómo se dice "tomar/pedir" en italiano?', srsBack: 'Prendere',
          reverseFront: 'Prendere', reverseBack: 'Tomar/pedir',
        },
        {
          id: 'ex5', type: 'translate',
          prompt: 'Traduce al italiano: "¿Qué tomas?"',
          answer: 'cosa prendi',
          explanation: '"Cosa prendi?" — expresión fija para pedir en un bar/café.',
          srsFront: '¿Cómo se dice "¿Qué tomas?" en italiano?', srsBack: 'Cosa prendi?',
          reverseFront: 'Cosa prendi?', reverseBack: '¿Qué tomas?',
        },
      ],
    },
    {
      id: 'a1_u6_dormire',
      cefr: 'A1',
      descriptor: 'Puede hablar de hábitos simples usando el tercer patrón de conjugación regular (-ire).',
      title: 'Dormi bene?',
      titleEs: '¿Duermes bien?',
      dialogue: [
        { speaker: 'Marco', line: 'Dormi bene stanotte?' },
        { speaker: 'Giulia', line: 'Sì, dormo bene. Tu dormi bene?' },
        { speaker: 'Marco', line: 'No, non dormo bene stanotte.' },
        { speaker: 'Giulia', line: 'Peccato!' },
      ],
      glossary: [
        { it: 'stanotte', es: 'esta noche', note: null },
        { it: 'non dormo', es: 'no duermo', note: '"non" antes del verbo niega la oración, como el "no" del español antes del verbo.' },
        { it: 'Peccato!', es: '¡Qué lástima!', note: null },
      ],
      grammar: {
        title: 'Verbos regulares en -ire (ej. "dormire" = dormir)',
        explanation: 'Tercer y último patrón regular, después de -are (parlare) y -ere (prendere). La buena noticia: -ire comparte casi todas las terminaciones con -ere (io/tu/lui-lei/noi/loro son iguales) — la única diferencia es "voi": "-ete" en -ere (prendete) vs "-ite" en -ire (dormite). Con estos 3 patrones ya podés conjugar la mayoría de verbos regulares del italiano.',
        table: [
          ['io', 'dormo'], ['tu', 'dormi'], ['lui/lei', 'dorme'],
          ['noi', 'dormiamo'], ['voi', 'dormite'], ['loro', 'dormono'],
        ],
      },
      exercises: [
        {
          id: 'ex1', type: 'fill',
          prompt: 'Completa: Io ___ bene.',
          answer: 'dormo',
          explanation: '"io" + verbos en -ire → termina en "-o" (igual que -are y -ere).',
          srsFront: 'Io ___ bene. (dormire, io)', srsBack: 'dormo',
        },
        {
          id: 'ex2', type: 'fill',
          prompt: 'Completa: Tu ___ bene stanotte?',
          answer: 'dormi',
          explanation: '"tu" + verbos en -ire → termina en "-i" (igual que -are y -ere).',
          srsFront: 'Tu ___ bene stanotte? (dormire, tu)', srsBack: 'dormi',
        },
        {
          id: 'ex3', type: 'fill',
          prompt: 'Completa: Noi ___ bene.',
          answer: 'dormiamo',
          explanation: '"noi" + verbos en -ire → termina en "-iamo" (igual en los 3 patrones regulares).',
          srsFront: 'Noi ___ bene. (dormire, noi)', srsBack: 'dormiamo',
        },
        {
          id: 'ex4', type: 'translate',
          prompt: 'Traduce al italiano: "dormir" (infinitivo)',
          answer: 'dormire',
          explanation: '"Dormire" — tercer patrón regular, comparte casi todo con -ere salvo "voi".',
          srsFront: '¿Cómo se dice "dormir" en italiano?', srsBack: 'Dormire',
          reverseFront: 'Dormire', reverseBack: 'Dormir',
        },
        {
          id: 'ex5', type: 'translate',
          prompt: 'Traduce al italiano: "esta noche"',
          answer: 'stanotte',
          explanation: '"Stanotte" — de "questa notte" (esta noche), contraído.',
          srsFront: '¿Cómo se dice "esta noche" en italiano?', srsBack: 'Stanotte',
          reverseFront: 'Stanotte', reverseBack: 'Esta noche',
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
