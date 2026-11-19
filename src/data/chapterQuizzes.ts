import { Chapter } from '../types/book';

export interface ChapterQuizQuestion {
  id: string;
  question: string;
  visualEmoji?: string;
  visualText?: string;
  options: {
    id: string;
    label: string;
    emoji?: string;
  }[];
  correctOptionId: string;
  explanation: string;
}

export const CHAPTER_QUIZZES: Record<string, ChapterQuizQuestion[]> = {
  chap_1: [
    {
      id: 'q1_1',
      question: 'Quelle voyelle commence le mot « Ananas » ?',
      visualEmoji: '🍍',
      options: [
        { id: 'a', label: 'A' },
        { id: 'o', label: 'O' },
        { id: 'u', label: 'U' },
      ],
      correctOptionId: 'a',
      explanation: 'A comme Ananas ! A - na - nas.',
    },
    {
      id: 'q1_2',
      question: 'Quelle voyelle fait un beau rond comme une orange ?',
      visualEmoji: '🍊',
      options: [
        { id: 'i', label: 'I' },
        { id: 'o', label: 'O' },
        { id: 'e', label: 'E' },
      ],
      correctOptionId: 'o',
      explanation: 'O comme Orange, tout rond !',
    },
    {
      id: 'q1_3',
      question: 'Combien y a-t-il de voyelles magiques de base dans ce chapitre ?',
      visualText: 'a • e • i • o • u',
      options: [
        { id: '3', label: '3 voyelles' },
        { id: '5', label: '5 voyelles' },
        { id: '8', label: '8 voyelles' },
      ],
      correctOptionId: '5',
      explanation: 'Il y a 5 voyelles : A, E, I, O, U !',
    },
  ],
  chap_2: [
    {
      id: 'q2_1',
      question: 'Quand on colle M et A ensemble, quelle syllabe obtient-on ?',
      visualText: 'M + A = ?',
      options: [
        { id: 'ma', label: 'MA' },
        { id: 'la', label: 'LA' },
        { id: 'mo', label: 'MO' },
      ],
      correctOptionId: 'ma',
      explanation: 'M + A font MA, comme dans Mangue ou Maman !',
    },
    {
      id: 'q2_2',
      question: 'Quelle syllabe commence le mot « Lune » ?',
      visualEmoji: '🌙',
      options: [
        { id: 'ba', label: 'BA' },
        { id: 'lu', label: 'LU' },
        { id: 'mi', label: 'MI' },
      ],
      correctOptionId: 'lu',
      explanation: 'L + U = LU, comme dans Lune !',
    },
    {
      id: 'q2_3',
      question: 'Quel mot obtient-on avec les syllabes BA + NA + NE ?',
      visualEmoji: '🍌',
      options: [
        { id: 'banane', label: 'Banane' },
        { id: 'baobab', label: 'Baobab' },
        { id: 'velo', label: 'Vélo' },
      ],
      correctOptionId: 'banane',
      explanation: 'BA + NA + NE = Banane !',
    },
  ],
  chap_3: [
    {
      id: 'q3_1',
      question: 'Combien de poussins vois-tu ici ?',
      visualText: '🐥 🐥 🐥 🐥 🐥',
      options: [
        { id: '4', label: '4 poussins' },
        { id: '5', label: '5 poussins' },
        { id: '7', label: '7 poussins' },
      ],
      correctOptionId: '5',
      explanation: '1, 2, 3, 4, 5 ! Il y a bien 5 poussins.',
    },
    {
      id: 'q3_2',
      question: 'Quel nombre est le PLUS GRAND ?',
      visualText: '6   ou   3',
      options: [
        { id: '3', label: '3' },
        { id: '6', label: '6' },
        { id: 'pareil', label: 'Ils sont pareils' },
      ],
      correctOptionId: '6',
      explanation: '6 est plus grand que 3 !',
    },
    {
      id: 'q3_3',
      question: 'Quel nombre vient juste après 9 quand on compte jusqu’à 10 ?',
      visualText: '7, 8, 9, [ ? ]',
      options: [
        { id: '8', label: '8' },
        { id: '10', label: '10' },
        { id: '12', label: '12' },
      ],
      correctOptionId: '10',
      explanation: 'Après 9 vient 10 ! C’est une dizaine complète.',
    },
  ],
  chap_4: [
    {
      id: 'q4_1',
      question: 'Combien font 3 mangues + 2 mangues ?',
      visualText: '🥭🥭🥭  +  🥭🥭  =  ?',
      options: [
        { id: '4', label: '4' },
        { id: '5', label: '5' },
        { id: '6', label: '6' },
      ],
      correctOptionId: '5',
      explanation: '3 + 2 = 5 mangues au total !',
    },
    {
      id: 'q4_2',
      question: 'Quel est le double de 4 (4 + 4) ?',
      visualText: '4 + 4 = ?',
      options: [
        { id: '6', label: '6' },
        { id: '8', label: '8' },
        { id: '10', label: '10' },
      ],
      correctOptionId: '8',
      explanation: '4 + 4 font 8 ! C’est le double de 4.',
    },
    {
      id: 'q4_3',
      question: 'Il y a 6 calebasses. On en enlève 2 (6 − 2). Combien en reste-t-il ?',
      visualText: '6 − 2 = ?',
      options: [
        { id: '3', label: '3' },
        { id: '4', label: '4' },
        { id: '8', label: '8' },
      ],
      correctOptionId: '4',
      explanation: '6 moins 2 égale 4 !',
    },
  ],
  chap_5: [
    {
      id: 'q5_1',
      question: 'Quelle est la minuscule de la lettre « B » ?',
      visualText: 'B  ➜  ?',
      options: [
        { id: 'b', label: 'b' },
        { id: 'd', label: 'd' },
        { id: 'p', label: 'p' },
      ],
      correctOptionId: 'b',
      explanation: 'Le petit b a son ventre tourné vers la droite, comme B !',
    },
    {
      id: 'q5_2',
      question: 'Combien de lettres y a-t-il dans tout l’alphabet français ?',
      visualText: 'A B C ... X Y Z',
      options: [
        { id: '20', label: '20 lettres' },
        { id: '26', label: '26 lettres' },
        { id: '30', label: '30 lettres' },
      ],
      correctOptionId: '26',
      explanation: 'L’alphabet compte 26 lettres de A jusqu’à Z !',
    },
    {
      id: 'q5_3',
      question: 'Laquelle de ces lettres est une voyelle ?',
      visualText: 'A • B • C • D',
      options: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
        { id: 'd', label: 'D' },
      ],
      correctOptionId: 'a',
      explanation: 'A est une voyelle ! Les 6 voyelles sont A, E, I, O, U, Y.',
    },
  ],
  chap_6: [
    {
      id: 'q6_1',
      question: 'Quelle lettre manque dans le train : A, B, [ ? ], D, E ?',
      visualText: '🚂 A - B - [?] - D - E',
      options: [
        { id: 'C', label: 'C' },
        { id: 'F', label: 'F' },
        { id: 'G', label: 'G' },
      ],
      correctOptionId: 'C',
      explanation: 'C se place toujours entre B et D !',
    },
    {
      id: 'q6_2',
      question: 'Laquelle de ces lettres est écrite en MAJUSCULE ?',
      visualText: 'm  •  R  •  a',
      options: [
        { id: 'm', label: 'm' },
        { id: 'R', label: 'R' },
        { id: 'a', label: 'a' },
      ],
      correctOptionId: 'R',
      explanation: 'R est la grande lettre majuscule !',
    },
    {
      id: 'q6_3',
      question: 'Quelle est la toute dernière lettre de l’alphabet ?',
      visualEmoji: '🦓',
      options: [
        { id: 'A', label: 'A' },
        { id: 'M', label: 'M' },
        { id: 'Z', label: 'Z' },
      ],
      correctOptionId: 'Z',
      explanation: 'Z comme Zèbre est la dernière lettre de l’alphabet !',
    },
  ],
  chap_7: [
    {
      id: 'q7_1',
      question: '3 paquets de 10 mangues et 4 mangues seules, ça fait combien ?',
      visualText: '3 dizaines + 4 unités',
      options: [
        { id: '24', label: '24' },
        { id: '34', label: '34' },
        { id: '43', label: '43' },
      ],
      correctOptionId: '34',
      explanation: '3 dizaines (30) + 4 unités = 34 mangues !',
    },
    {
      id: 'q7_2',
      question: 'Quel nombre vient juste après 29 ?',
      visualText: '28, 29, [ ? ], 31',
      options: [
        { id: '30', label: '30' },
        { id: '39', label: '39' },
        { id: '20', label: '20' },
      ],
      correctOptionId: '30',
      explanation: 'Après 29, on passe à la dizaine suivante : 30 !',
    },
    {
      id: 'q7_3',
      question: 'Combien de dizaines y a-t-il dans le nombre 50 ?',
      visualEmoji: '🪙',
      options: [
        { id: '3', label: '3 dizaines' },
        { id: '4', label: '4 dizaines' },
        { id: '5', label: '5 dizaines' },
      ],
      correctOptionId: '5',
      explanation: '50 = 10 + 10 + 10 + 10 + 10, donc 5 dizaines !',
    },
  ],
  chap_8: [
    {
      id: 'q8_1',
      question: 'Comment appelle-t-on l’écriture attachée qu’on trace dans le cahier ?',
      visualEmoji: '✍️',
      options: [
        { id: 'cursive', label: 'L’écriture cursive' },
        { id: 'chiffre', label: 'Les chiffres' },
        { id: 'dessin', label: 'Le coloriage' },
      ],
      correctOptionId: 'cursive',
      explanation: 'L’écriture cursive est l’écriture attachée d’écolier !',
    },
    {
      id: 'q8_2',
      question: 'Laquelle de ces lettres forme une grande boucle qui monte vers le ciel ?',
      visualText: 'l  •  a  •  o',
      options: [
        { id: 'l', label: 'l' },
        { id: 'a', label: 'a' },
        { id: 'o', label: 'o' },
      ],
      correctOptionId: 'l',
      explanation: 'La lettre « l » monte de 3 interlignes avec une belle boucle !',
    },
    {
      id: 'q8_3',
      question: 'Laquelle de ces lettres descend sous la ligne violette ?',
      visualText: 'g  •  m  •  u',
      options: [
        { id: 'm', label: 'm' },
        { id: 'g', label: 'g' },
        { id: 'u', label: 'u' },
      ],
      correctOptionId: 'g',
      explanation: 'La lettre « g » plonge sous la ligne pour faire sa boucle en bas !',
    },
  ],
  chap_pack_1: [
    {
      id: 'qp1_1',
      question: 'Où le petit lièvre aime-t-il lire son livre ?',
      visualEmoji: '🌳',
      options: [
        { id: 'baobab', label: 'Sous le grand baobab' },
        { id: 'riviere', label: 'Dans la rivière' },
        { id: 'montagne', label: 'Sur la montagne' },
      ],
      correctOptionId: 'baobab',
      explanation: 'Le lièvre lit toujours sous le grand baobab !',
    },
    {
      id: 'qp1_2',
      question: 'Qu’apporte le petit mouton dans sa calebasse ?',
      visualEmoji: '🥛',
      options: [
        { id: 'lait', label: 'Du lait' },
        { id: 'sable', label: 'Du sable' },
        { id: 'cailloux', label: 'Des cailloux' },
      ],
      correctOptionId: 'lait',
      explanation: 'Le petit mouton arrive avec une calebasse de lait !',
    },
    {
      id: 'qp1_3',
      question: 'Quels fruits les deux amis partagent-ils ensemble ?',
      visualEmoji: '🥭',
      options: [
        { id: 'pommes', label: 'Des pommes' },
        { id: 'mangues', label: 'Des mangues sucrées' },
        { id: 'citrons', label: 'Des citrons' },
      ],
      correctOptionId: 'mangues',
      explanation: 'Ils partagent de bonnes mangues sucrées au clair de lune !',
    },
  ],
};

export function getQuizForChapter(chapter: Chapter): ChapterQuizQuestion[] {
  if (CHAPTER_QUIZZES[chapter.id]) {
    return CHAPTER_QUIZZES[chapter.id];
  }
  // Fallback générique si un nouveau pack externe est importé
  return [
    {
      id: `gen_${chapter.id}_1`,
      question: `As-tu bien exploré le chapitre « ${chapter.title.fr} » ?`,
      visualEmoji: chapter.badgeEmoji,
      options: [
        { id: 'oui', label: 'Oui, j’ai tout compris !' },
        { id: 'encore', label: 'Presque, je révise encore' },
      ],
      correctOptionId: 'oui',
      explanation: 'Bravo pour ta curiosité et ton travail !',
    },
    {
      id: `gen_${chapter.id}_2`,
      question: 'Combien font 5 + 5 ?',
      visualText: '5 + 5 = ?',
      options: [
        { id: '8', label: '8' },
        { id: '10', label: '10' },
        { id: '12', label: '12' },
      ],
      correctOptionId: '10',
      explanation: '5 + 5 = 10 !',
    },
  ];
}
