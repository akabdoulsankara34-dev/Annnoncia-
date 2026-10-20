import { Chapter, ContentPack } from '../types/book';

export const MOTS = {
  ananas: { fr: 'ananas', moore: 'ananasi', dioula: 'anana' },
  elephant: { fr: 'éléphant', moore: 'wobgo', dioula: 'samè' },
  igname: { fr: 'igname', moore: 'boussa', dioula: 'kuyin' },
  orange: { fr: 'orange', moore: 'lemu', dioula: 'lèmunu' },
  usine: { fr: 'usine', moore: 'koodo', dioula: 'izin' },
  mangue: { fr: 'mangue', moore: 'manga', dioula: 'mangoro' },
  baobab: { fr: 'baobab', moore: 'toega', dioula: 'sira' },
  calebasse: { fr: 'calebasse', moore: 'wamdé', dioula: 'filen' },
  poussin: { fr: 'poussin', moore: 'no-biiga', dioula: 'sise dèn' },
  velo: { fr: 'vélo', moore: 'kéké', dioula: 'negso' },
  papa: { fr: 'papa', moore: 'baaba', dioula: 'fa' },
  maman: { fr: 'maman', moore: 'maaba', dioula: 'ba' },
  marche: { fr: 'marché', moore: 'raaga', dioula: 'sugu' },
};

export const CHAPITRES: Chapter[] = [
  // CHAPITRE 1 : VOYELLES MAGIQUES (LECTURE)
  {
    id: 'chap_1',
    number: 1,
    subject: 'lecture',
    title: { fr: 'Les Voyelles Magiques', moore: 'Kãng-gom-bila', dioula: 'Da-yɛlɛman Kuma' },
    description: { fr: 'Découvre les 5 voyelles : a, e, i, o, u et apprends à les chanter et tracer.', moore: 'Bãng gom-biisa', dioula: 'Sɛbɛnni fɔlɔ' },
    badgeEmoji: '🔤',
    iconSvg: 'letter',
    colorScheme: {
      primary: '#E63946',
      secondary: '#F1FAEE',
      accent: '#FFB703',
      bgPattern: 'bg-[#FFF9F2]',
    },
    stickerReward: {
      id: 'stk_kalo_star',
      title: { fr: 'Kalo Champion des Voyelles', moore: 'Kalo waoongo', dioula: 'Kalo fari' },
      svg: 'kalo_star'
    },
    pages: [
      {
        id: 'p_1_1',
        pageNumber: 1,
        chapterId: 'chap_1',
        title: { fr: 'La voyelle A', moore: 'Gom-biiga A', dioula: 'Da-yɛlɛ A' },
        instruction: { fr: 'Écoute le son de la lettre A et trace-la avec ton doigt !', moore: 'Kẽlegh A bãngre', dioula: 'Mɛn A kuma' },
        activity: {
          type: 'letter_intro',
          prompt: { fr: 'A comme Ananas. Touche la lettre pour entendre son chant !', moore: 'A n yaa Ananasi', dioula: 'A i n’a fɔ Anana' },
          letter: 'A',
          sampleWord: MOTS.ananas,
          wordImageSvg: 'Pineapple',
          traceData: {
            letter: 'A',
            type: 'script',
            startPoint: { x: 50, y: 90 },
            guidelinePoints: [{ x: 50, y: 90 }, { x: 150, y: 20 }, { x: 250, y: 90 }, { x: 100, y: 60 }, { x: 200, y: 60 }],
            strokeHelp: 'Monte vers le sommet, descends à droite, puis trace le pont au milieu !'
          }
        },
        simplifiedActivity: {
          type: 'letter_intro',
          prompt: { fr: 'Touche le grand A pour entendre son son !' },
          letter: 'A',
          sampleWord: MOTS.ananas,
          wordImageSvg: 'Pineapple'
        }
      },
      {
        id: 'p_1_2',
        pageNumber: 2,
        chapterId: 'chap_1',
        title: { fr: 'La voyelle E', moore: 'Gom-biiga E', dioula: 'Da-yɛlɛ E' },
        instruction: { fr: 'Voici le E majuscule. Découvre l’éléphant de la savane !', moore: 'E waobgo pʋgẽ', dioula: 'E i n’a fɔ Samɛ' },
        activity: {
          type: 'letter_intro',
          letter: 'E',
          prompt: { fr: 'E comme Éléphant. Chante : E ! E ! E !', moore: 'E wobgo', dioula: 'E samɛ' },
          sampleWord: MOTS.elephant,
          wordImageSvg: 'Elephant',
          traceData: {
            letter: 'E',
            type: 'script',
            startPoint: { x: 60, y: 20 },
            guidelinePoints: [{ x: 60, y: 20 }, { x: 60, y: 90 }, { x: 160, y: 20 }, { x: 140, y: 55 }, { x: 160, y: 90 }],
            strokeHelp: 'Trace le grand mât droit, puis les 3 branches comme un peigne !'
          }
        }
      },
      {
        id: 'p_1_3',
        pageNumber: 3,
        chapterId: 'chap_1',
        title: { fr: 'La voyelle I', moore: 'Gom-biiga I', dioula: 'Da-yɛlɛ I' },
        instruction: { fr: 'Le son I sourit comme quand on montre ses dents !', moore: 'I bãngre', dioula: 'I kuma' },
        activity: {
          type: 'letter_intro',
          letter: 'I',
          prompt: { fr: 'I comme Igname que l’on prépare au village !', moore: 'I boussa', dioula: 'I kuyin' },
          sampleWord: MOTS.igname,
          wordImageSvg: 'Yam',
          traceData: {
            letter: 'I',
            type: 'script',
            startPoint: { x: 150, y: 20 },
            guidelinePoints: [{ x: 150, y: 20 }, { x: 150, y: 90 }],
            strokeHelp: 'Un grand trait tout droit du haut vers le bas !'
          }
        }
      },
      {
        id: 'p_1_4',
        pageNumber: 4,
        chapterId: 'chap_1',
        title: { fr: 'La voyelle O', moore: 'Gom-biiga O', dioula: 'Da-yɛlɛ O' },
        instruction: { fr: 'Fais un beau cercle tout rond avec ta bouche : O !', moore: 'O gom-biiga', dioula: 'O da-yɛlɛ' },
        activity: {
          type: 'letter_intro',
          letter: 'O',
          prompt: { fr: 'O comme une Orange bien ronde et bien sucrée !', moore: 'O lemu', dioula: 'O lèmunu' },
          sampleWord: MOTS.orange,
          wordImageSvg: 'OrangeFruit',
          traceData: {
            letter: 'O',
            type: 'script',
            startPoint: { x: 150, y: 20 },
            guidelinePoints: [{ x: 150, y: 20 }, { x: 80, y: 55 }, { x: 150, y: 90 }, { x: 220, y: 55 }, { x: 150, y: 20 }],
            strokeHelp: 'Tourne vers la gauche et referme le rond parfaitement !'
          }
        }
      },
      {
        id: 'p_1_5',
        pageNumber: 5,
        chapterId: 'chap_1',
        title: { fr: 'La voyelle U', moore: 'Gom-biiga U', dioula: 'Da-yɛlɛ U' },
        instruction: { fr: 'Le U forme un petit bol qui sourit.', moore: 'U gom-biiga', dioula: 'U kuma' },
        activity: {
          type: 'letter_intro',
          letter: 'U',
          prompt: { fr: 'U comme Usine. Écoute : U !', moore: 'U koodo', dioula: 'U izin' },
          sampleWord: MOTS.usine,
          wordImageSvg: 'Factory',
          traceData: {
            letter: 'U',
            type: 'script',
            startPoint: { x: 80, y: 20 },
            guidelinePoints: [{ x: 80, y: 20 }, { x: 80, y: 75 }, { x: 150, y: 90 }, { x: 220, y: 75 }, { x: 220, y: 20 }],
            strokeHelp: 'Descends, arrondis bien en bas, et remonte tout en haut !'
          }
        }
      },
      {
        id: 'p_1_6',
        pageNumber: 6,
        chapterId: 'chap_1',
        title: { fr: 'Mini-Quiz des Voyelles', moore: 'Voyelles gãnegre', dioula: 'Voyelles quiz' },
        instruction: { fr: 'Relie chaque lettre à la bonne image !', moore: 'Bãng gom-biisi', dioula: 'Giri kuma kan' },
        activity: {
          type: 'word_match',
          prompt: { fr: 'Touche une lettre puis son image pour les réunir !' },
          matchingPairs: [
            { id: 'pair_a', word: { fr: 'A - Ananas' }, iconSvg: 'Pineapple' },
            { id: 'pair_o', word: { fr: 'O - Orange' }, iconSvg: 'OrangeFruit' },
            { id: 'pair_e', word: { fr: 'E - Éléphant' }, iconSvg: 'Elephant' }
          ]
        }
      }
    ]
  },

  // CHAPITRE 2 : CONSONNES & PREMIÈRES SYLLABES (LECTURE)
  {
    id: 'chap_2',
    number: 2,
    subject: 'lecture',
    title: { fr: 'Consonnes et Syllabes', moore: 'Syllabes bãngre', dioula: 'Syllabes dɔnni' },
    description: { fr: 'Associe les lettres pour faire chanter les syllabes : MA, MI, LA, LI !', moore: 'Gom-biis tũudba', dioula: 'Kuma dɛmɛ' },
    badgeEmoji: '🗣️',
    iconSvg: 'speech',
    colorScheme: {
      primary: '#2A9D8F',
      secondary: '#E8F5E9',
      accent: '#E76F51',
      bgPattern: 'bg-[#F2FAF7]',
    },
    stickerReward: {
      id: 'stk_mango_gold',
      title: { fr: 'La Mangue Magique de lecture', moore: 'Manga waoongo', dioula: 'Mangoro sani' },
      svg: 'mango_gold'
    },
    pages: [
      {
        id: 'p_2_1',
        pageNumber: 7,
        chapterId: 'chap_2',
        title: { fr: 'La consonne M', moore: 'Gom-biiga M', dioula: 'Sɛbɛn M' },
        instruction: { fr: 'M comme Mangue mûre ! Le son fait : Mmm...', moore: 'M manga', dioula: 'M mangoro' },
        activity: {
          type: 'syllable_mixer',
          prompt: { fr: 'Touche une syllabe avec M pour l’entendre chanter !' },
          syllables: {
            consonant: 'M',
            vowels: ['A', 'I', 'O', 'U', 'E']
          },
          sampleWord: MOTS.mangue,
          wordImageSvg: 'Mango'
        }
      },
      {
        id: 'p_2_2',
        pageNumber: 8,
        chapterId: 'chap_2',
        title: { fr: 'La consonne L', moore: 'Gom-biiga L', dioula: 'Sɛbɛn L' },
        instruction: { fr: 'La langue monte au palais : Lll... Écoute LA, LI, LO !', moore: 'L bãngre', dioula: 'L kuma' },
        activity: {
          type: 'syllable_mixer',
          prompt: { fr: 'Compose les syllabes avec la lettre L !' },
          syllables: {
            consonant: 'L',
            vowels: ['A', 'I', 'O', 'U', 'E']
          },
          sampleWord: { fr: 'Lune', moore: 'Kiuugu', dioula: 'Kalo' },
          wordImageSvg: 'Star'
        }
      },
      {
        id: 'p_2_3',
        pageNumber: 9,
        chapterId: 'chap_2',
        title: { fr: 'La consonne B', moore: 'Gom-biiga B', dioula: 'Sɛbɛn B' },
        instruction: { fr: 'B comme le grand Baobab et le Vélo de Bobo !', moore: 'B toega', dioula: 'B sira' },
        activity: {
          type: 'syllable_mixer',
          prompt: { fr: 'Touche BA, BI, BO, BU pour les prononcer !' },
          syllables: {
            consonant: 'B',
            vowels: ['A', 'I', 'O', 'U', 'E']
          },
          sampleWord: MOTS.baobab,
          wordImageSvg: 'Baobab'
        }
      },
      {
        id: 'p_2_4',
        pageNumber: 10,
        chapterId: 'chap_2',
        title: { fr: 'Premiers Mots et Mini-Histoire', moore: 'Seb-biis fɔlɔ', dioula: 'Kuma dɔnni' },
        instruction: { fr: 'Lis avec Kalo la jolie histoire de Fatou et du vélo !', moore: 'Karem ne Kalo', dioula: 'Kalan kɛ ni Kalo ye' },
        activity: {
          type: 'read_aloud',
          prompt: { fr: 'Appuie sur « Écouter », puis lis à voix haute avec le micro !' },
          storySentences: [
            { id: 1, text: 'Fatou a une belle mangue.' },
            { id: 2, text: 'Issa a un joli vélo bleu.' },
            { id: 3, text: 'Le petit poussin mange du mil.' },
            { id: 4, text: 'Maman va au grand marché.' },
            { id: 5, text: 'Tous les enfants sont très contents.' }
          ]
        }
      }
    ]
  },

  // CHAPITRE 3 : COMPTONS JUSQU’À 10 ET 20 (CALCUL)
  {
    id: 'chap_3',
    number: 3,
    subject: 'calcul',
    title: { fr: 'Compter de 1 à 10 et 20', moore: 'Sõdgre bãngre 1 ta 10', dioula: 'Jateminɛ 1 fo 10' },
    description: { fr: 'Touche les fruits, calebasses et poussins pour compter un par un !', moore: 'Sõd bũmb nins', dioula: 'Fɛnw jate kelen-kelen' },
    badgeEmoji: '🔢',
    iconSvg: 'numbers',
    colorScheme: {
      primary: '#1D3557',
      secondary: '#E0F2FE',
      accent: '#FFB703',
      bgPattern: 'bg-[#F0F7FD]',
    },
    stickerReward: {
      id: 'stk_baobab_gold',
      title: { fr: 'L’Arbre des Nombres', moore: 'Toega sani', dioula: 'Sira jate' },
      svg: 'baobab_gold'
    },
    pages: [
      {
        id: 'p_3_1',
        pageNumber: 11,
        chapterId: 'chap_3',
        title: { fr: 'Compter jusqu’à 5', moore: 'Sõd ta 5', dioula: 'Jate fo 5' },
        instruction: { fr: 'Touche chaque mangue dans le panier pour les compter !', moore: 'Sõd mangasi', dioula: 'Mangoro jate' },
        activity: {
          type: 'count_tap',
          prompt: { fr: 'Combien y a-t-il de mangues mûres ? Touche-les toutes !' },
          countData: {
            targetNumber: 5,
            itemName: MOTS.mangue,
            itemType: 'mango',
            options: [3, 5, 7]
          }
        }
      },
      {
        id: 'p_3_2',
        pageNumber: 12,
        chapterId: 'chap_3',
        title: { fr: 'Le Nombre 7 et son écriture', moore: 'Sõbre 7', dioula: 'Jatelen 7' },
        instruction: { fr: 'Touche les 7 poussins, puis trace le chiffre 7 !', moore: 'Sõd no-biisi', dioula: 'Sise dɛnw jate' },
        activity: {
          type: 'number_trace',
          prompt: { fr: 'Trace le chiffre 7 au doigt : un trait couché, puis descends en biais !' },
          countData: {
            targetNumber: 7,
            itemName: MOTS.poussin,
            itemType: 'chick'
          },
          traceData: {
            letter: '7',
            type: 'script',
            startPoint: { x: 70, y: 25 },
            guidelinePoints: [{ x: 70, y: 25 }, { x: 230, y: 25 }, { x: 120, y: 95 }, { x: 90, y: 60 }, { x: 170, y: 60 }],
            strokeHelp: 'Trait horizontal en haut, grande glissade vers le bas, et barre au milieu !'
          }
        }
      },
      {
        id: 'p_3_3',
        pageNumber: 13,
        chapterId: 'chap_3',
        title: { fr: 'Compter jusqu’à 10 avec les pièces', moore: 'Sõd ta 10', dioula: 'Jate fo 10' },
        instruction: { fr: 'Touche les 10 pièces de monnaie pour acheter des fruits au marché !', moore: 'Raaga ligdi', dioula: 'Sugu wari' },
        activity: {
          type: 'count_tap',
          prompt: { fr: 'Compte les 10 pièces avec Kalo !' },
          countData: {
            targetNumber: 10,
            itemName: { fr: 'pièces de monnaie' },
            itemType: 'coin',
            options: [8, 10, 12]
          }
        }
      },
      {
        id: 'p_3_4',
        pageNumber: 14,
        chapterId: 'chap_3',
        title: { fr: 'Comparer : Plus, Moins ou Autant', moore: 'Waoongo la bilfu', dioula: 'Ka dɔgɔ walima ka caya' },
        instruction: { fr: 'Regarde les deux paniers. Lequel a le PLUS de calebasses ?', moore: 'Gese wamdo', dioula: 'Filenw lajɛ' },
        activity: {
          type: 'compare_quantities',
          prompt: { fr: 'Choisis le panier qui contient le PLUS de fruits !' },
          compareData: {
            leftCount: 6,
            rightCount: 3,
            itemType: 'calabash'
          }
        }
      }
    ]
  },

  // CHAPITRE 4 : ADDITIONS ET MANIPULATIONS (CALCUL)
  {
    id: 'chap_4',
    number: 4,
    subject: 'calcul',
    title: { fr: 'Additions Magiques jusqu’à 10', moore: 'Lagengre bãngre (+)', dioula: 'Farali jateminɛ (+)' },
    description: { fr: 'Mets ensemble les fruits pour découvrir le résultat de l’addition.', moore: 'Lagim taaba', dioula: 'Fɛnw fara ɲɔgɔn kan' },
    badgeEmoji: '➕',
    iconSvg: 'plus',
    colorScheme: {
      primary: '#D97706',
      secondary: '#FEF3C7',
      accent: '#2563EB',
      bgPattern: 'bg-[#FFFBEB]',
    },
    stickerReward: {
      id: 'stk_calabash_party',
      title: { fr: 'La Calebasse d’or du Calcul', moore: 'Wamd sani', dioula: 'Filen sani' },
      svg: 'calabash_gold'
    },
    pages: [
      {
        id: 'p_4_1',
        pageNumber: 15,
        chapterId: 'chap_4',
        title: { fr: 'Addition : 3 + 2', moore: 'Lagengre 3 + 2', dioula: '3 fara 2 kan' },
        instruction: { fr: 'Glisse 3 mangues, puis 2 mangues dans le panier pour trouver le total !', moore: 'Lagim mangasi', dioula: 'Mangoro kɛ panyen kɔnɔ' },
        activity: {
          type: 'drag_addition',
          prompt: { fr: 'Combien font 3 mangues et 2 mangues réunies ?' },
          additionData: {
            num1: 3,
            num2: 2,
            itemType: 'mango'
          }
        }
      },
      {
        id: 'p_4_2',
        pageNumber: 16,
        chapterId: 'chap_4',
        title: { fr: 'Addition : 4 + 4 (Le Double)', moore: '4 + 4 lagengre', dioula: '4 fara 4 kan' },
        instruction: { fr: 'Awa a 4 étoiles. Kalo lui en donne 4 autres. Combien en tout ?', moore: 'Awa ne Kalo', dioula: 'Awa ni Kalo' },
        activity: {
          type: 'drag_addition',
          prompt: { fr: 'Calcule 4 + 4 en touchant les étoiles dorées !' },
          additionData: {
            num1: 4,
            num2: 4,
            itemType: 'star'
          }
        }
      },
      {
        id: 'p_4_3',
        pageNumber: 17,
        chapterId: 'chap_4',
        title: { fr: 'La Soustraction : Enlever des objets', moore: 'Yikri bãngre (-)', dioula: 'Bɔli jateminɛ (-)' },
        instruction: { fr: 'Il y avait 6 poussins. 2 sont partis boire de l’eau. Combien en reste-t-il ?', moore: 'No-biisi yikre', dioula: 'Sise dɛnw bɔli' },
        activity: {
          type: 'subtraction_cut',
          prompt: { fr: 'Touche 2 poussins pour les faire rentrer dans la case, et compte ceux qui restent !' },
          subtractionData: {
            total: 6,
            toRemove: 2,
            itemType: 'chick'
          }
        }
      },
      {
        id: 'p_4_4',
        pageNumber: 18,
        chapterId: 'chap_4',
        title: { fr: 'La Moitié et les Formes', moore: 'Pʋɩɩre la sũuri', dioula: 'Tilancɛ ni jaaw' },
        instruction: { fr: 'Partage équitablement la calebasse en deux parts égales !', moore: 'Pʋɩ wamdo sɩd-sɩda', dioula: 'Filen tila fila ye cɛncɛn' },
        activity: {
          type: 'quiz',
          prompt: { fr: 'Quelle forme a 3 côtés comme un toit de case ?' },
          sequenceData: {
            pattern: ['Cercle', 'Carré', 'Triangle'],
            options: ['Triangle', 'Cercle', 'Carré'],
            correct: 'Triangle'
          }
        }
      }
    ]
  },

  // CHAPITRE 5 : L'ABÉCÉDAIRE MAGIQUE DE A À Z (18 PAGES)
  {
    id: 'chap_5',
    number: 5,
    subject: 'lecture',
    title: { fr: 'L’Abécédaire Magique : De A à Z', moore: 'Seb-biisi A ta Z', dioula: 'Sɛbɛndenw A fo Z' },
    description: { fr: 'Découvre les 26 lettres de l’alphabet en MAJUSCULES et en minuscules avec Kalo !', moore: 'Bãng gom-biis fãa', dioula: 'Sɛbɛndenw bɛɛ dɔnni' },
    badgeEmoji: '🅰️',
    iconSvg: 'letters',
    colorScheme: {
      primary: '#8B5CF6',
      secondary: '#EDE9FE',
      accent: '#F59E0B',
      bgPattern: 'bg-[#FDF4FF]',
    },
    stickerReward: {
      id: 'stk_alphabet_champion',
      title: { fr: 'Médaille d’Or de l’Alphabet', moore: 'Waoongo seb-biisi', dioula: 'Sɛbɛndenw jaba' },
      svg: 'alphabet_medal'
    },
    pages: [
      // Page 19 : Aa & Bb
      {
        id: 'p_5_1',
        pageNumber: 19,
        chapterId: 'chap_5',
        title: { fr: 'Les lettres Aa & Bb', moore: 'Gom-biisi Aa la Bb', dioula: 'Sɛbɛn Aa ni Bb' },
        instruction: { fr: 'Découvre le grand A et le petit a, puis le grand B et le petit b !', moore: 'Gese Aa la Bb', dioula: 'Aa ni Bb lajɛ' },
        activity: {
          type: 'alphabet_duo',
          prompt: { fr: 'Touche chaque lettre pour entendre son chant et son mot !' },
          alphabetDuo: {
            letters: [
              { upper: 'A', lower: 'a', word: { fr: 'Ananas' }, phonetic: 'Aaa', iconSvg: 'Pineapple' },
              { upper: 'B', lower: 'b', word: { fr: 'Baobab' }, phonetic: 'Béé', iconSvg: 'Baobab' }
            ]
          }
        }
      },
      // Page 20 : Cc & Dd
      {
        id: 'p_5_2',
        pageNumber: 20,
        chapterId: 'chap_5',
        title: { fr: 'Les lettres Cc & Dd', moore: 'Gom-biisi Cc la Dd', dioula: 'Sɛbɛn Cc ni Dd' },
        instruction: { fr: 'C comme Calebasse et D comme Dromadaire du désert !', moore: 'Cc la Dd bãngre', dioula: 'Cc ni Dd dɔnni' },
        activity: {
          type: 'alphabet_duo',
          prompt: { fr: 'Touche le grand C et le petit c, puis le grand D et le petit d !' },
          alphabetDuo: {
            letters: [
              { upper: 'C', lower: 'c', word: { fr: 'Calebasse' }, phonetic: 'Kéé', iconSvg: 'Calabash' },
              { upper: 'D', lower: 'd', word: { fr: 'Dromadaire' }, phonetic: 'Déé', iconSvg: 'Fennec' }
            ]
          }
        }
      },
      // Page 21 : Ee & Ff
      {
        id: 'p_5_3',
        pageNumber: 21,
        chapterId: 'chap_5',
        title: { fr: 'Les lettres Ee & Ff', moore: 'Gom-biisi Ee la Ff', dioula: 'Sɛbɛn Ee ni Ff' },
        instruction: { fr: 'E comme Éléphant et F comme Fennec aux grandes oreilles !', moore: 'Ee wobgo la Ff', dioula: 'Ee samɛ ni Ff' },
        activity: {
          type: 'alphabet_duo',
          prompt: { fr: 'Observe la différence entre la majuscule et la minuscule !' },
          alphabetDuo: {
            letters: [
              { upper: 'E', lower: 'e', word: { fr: 'Éléphant' }, phonetic: 'Euh', iconSvg: 'Elephant' },
              { upper: 'F', lower: 'f', word: { fr: 'Fennec' }, phonetic: 'Fff', iconSvg: 'Fennec' }
            ]
          }
        }
      },
      // Page 22 : Gg & Hh
      {
        id: 'p_5_4',
        pageNumber: 22,
        chapterId: 'chap_5',
        title: { fr: 'Les lettres Gg & Hh', moore: 'Gom-biisi Gg la Hh', dioula: 'Sɛbɛn Gg ni Hh' },
        instruction: { fr: 'G comme Girafe au long cou et H comme Hutte du village !', moore: 'Gg la Hh', dioula: 'Gg ni Hh' },
        activity: {
          type: 'alphabet_duo',
          prompt: { fr: 'Chante : Gg ! Hh ! avec Kalo !' },
          alphabetDuo: {
            letters: [
              { upper: 'G', lower: 'g', word: { fr: 'Girafe' }, phonetic: 'Gué ou Je', iconSvg: 'Giraffe' },
              { upper: 'H', lower: 'h', word: { fr: 'Hutte' }, phonetic: 'Ach', iconSvg: 'Baobab' }
            ]
          }
        }
      },
      // Page 23 : Ii & Jj
      {
        id: 'p_5_5',
        pageNumber: 23,
        chapterId: 'chap_5',
        title: { fr: 'Les lettres Ii & Jj', moore: 'Gom-biisi Ii la Jj', dioula: 'Sɛbɛn Ii ni Jj' },
        instruction: { fr: 'I comme Igname et J comme Jarre d’eau fraîche !', moore: 'Ii boussa la Jj', dioula: 'Ii kuyin ni Jj' },
        activity: {
          type: 'alphabet_duo',
          prompt: { fr: 'Le i et le j ont un joli petit point sur la tête en minuscule !' },
          alphabetDuo: {
            letters: [
              { upper: 'I', lower: 'i', word: { fr: 'Igname' }, phonetic: 'Iii', iconSvg: 'Yam' },
              { upper: 'J', lower: 'j', word: { fr: 'Jarre' }, phonetic: 'Jjj', iconSvg: 'Calabash' }
            ]
          }
        }
      },
      // Page 24 : Kk & Ll
      {
        id: 'p_5_6',
        pageNumber: 24,
        chapterId: 'chap_5',
        title: { fr: 'Les lettres Kk & Ll', moore: 'Gom-biisi Kk la Ll', dioula: 'Sɛbɛn Kk ni Ll' },
        instruction: { fr: 'K comme Kalo le caméléon et L comme Lion roi de la savane !', moore: 'Kk Kalo la Ll', dioula: 'Kk Kalo ni Ll' },
        activity: {
          type: 'alphabet_duo',
          prompt: { fr: 'Touche le grand K et le grand L !' },
          alphabetDuo: {
            letters: [
              { upper: 'K', lower: 'k', word: { fr: 'Karité' }, phonetic: 'Kaa', iconSvg: 'Mango' },
              { upper: 'L', lower: 'l', word: { fr: 'Lion' }, phonetic: 'Lll', iconSvg: 'Star' }
            ]
          }
        }
      },
      // Page 25 : Mm & Nn
      {
        id: 'p_5_7',
        pageNumber: 25,
        chapterId: 'chap_5',
        title: { fr: 'Les lettres Mm & Nn', moore: 'Gom-biisi Mm la Nn', dioula: 'Sɛbɛn Mm ni Nn' },
        instruction: { fr: 'M comme Mangue bien mûre et N comme Nénuphar sur le marigot !', moore: 'Mm manga la Nn', dioula: 'Mm mangoro ni Nn' },
        activity: {
          type: 'alphabet_duo',
          prompt: { fr: 'M a trois ponts en minuscule (m), N en a deux (n) !' },
          alphabetDuo: {
            letters: [
              { upper: 'M', lower: 'm', word: { fr: 'Mangue' }, phonetic: 'Mmm', iconSvg: 'Mango' },
              { upper: 'N', lower: 'n', word: { fr: 'Nénuphar' }, phonetic: 'Nnn', iconSvg: 'Star' }
            ]
          }
        }
      },
      // Page 26 : Oo & Pp
      {
        id: 'p_5_8',
        pageNumber: 26,
        chapterId: 'chap_5',
        title: { fr: 'Les lettres Oo & Pp', moore: 'Gom-biisi Oo la Pp', dioula: 'Sɛbɛn Oo ni Pp' },
        instruction: { fr: 'O comme Orange toute ronde et P comme Petit poussin jaune !', moore: 'Oo lemu la Pp', dioula: 'Oo lèmunu ni Pp' },
        activity: {
          type: 'alphabet_duo',
          prompt: { fr: 'Chante O et P à voix haute !' },
          alphabetDuo: {
            letters: [
              { upper: 'O', lower: 'o', word: { fr: 'Orange' }, phonetic: 'Ooo', iconSvg: 'OrangeFruit' },
              { upper: 'P', lower: 'p', word: { fr: 'Poussin' }, phonetic: 'Péé', iconSvg: 'Chick' }
            ]
          }
        }
      },
      // Page 27 : Qq & Rr
      {
        id: 'p_5_9',
        pageNumber: 27,
        chapterId: 'chap_5',
        title: { fr: 'Les lettres Qq & Rr', moore: 'Gom-biisi Qq la Rr', dioula: 'Sɛbɛn Qq ni Rr' },
        instruction: { fr: 'Q comme Quenouille pour le coton et R comme Rame pour la pirogue !', moore: 'Qq la Rr', dioula: 'Qq ni Rr' },
        activity: {
          type: 'alphabet_duo',
          prompt: { fr: 'Regarde le q minuscule qui descend sous la ligne !' },
          alphabetDuo: {
            letters: [
              { upper: 'Q', lower: 'q', word: { fr: 'Quenouille' }, phonetic: 'Ku', iconSvg: 'Yam' },
              { upper: 'R', lower: 'r', word: { fr: 'Rame' }, phonetic: 'Rrr', iconSvg: 'Star' }
            ]
          }
        }
      },
      // Page 28 : Ss & Tt
      {
        id: 'p_5_10',
        pageNumber: 28,
        chapterId: 'chap_5',
        title: { fr: 'Les lettres Ss & Tt', moore: 'Gom-biisi Ss la Tt', dioula: 'Sɛbɛn Ss ni Tt' },
        instruction: { fr: 'S comme le Soleil d’or et T comme la Tortue sage !', moore: 'Ss wĩntoog la Tt', dioula: 'Ss tile ni Tt' },
        activity: {
          type: 'alphabet_duo',
          prompt: { fr: 'S siffle comme le vent, T claque comme un tambour !' },
          alphabetDuo: {
            letters: [
              { upper: 'S', lower: 's', word: { fr: 'Soleil' }, phonetic: 'Sss', iconSvg: 'Sun' },
              { upper: 'T', lower: 't', word: { fr: 'Tortue' }, phonetic: 'Téé', iconSvg: 'Turtle' }
            ]
          }
        }
      },
      // Page 29 : Uu & Vv
      {
        id: 'p_5_11',
        pageNumber: 29,
        chapterId: 'chap_5',
        title: { fr: 'Les lettres Uu & Vv', moore: 'Gom-biisi Uu la Vv', dioula: 'Sɛbɛn Uu ni Vv' },
        instruction: { fr: 'U comme Usine et V comme le beau Vélo bleu d’Issa !', moore: 'Uu la Vv kéké', dioula: 'Uu ni Vv negso' },
        activity: {
          type: 'alphabet_duo',
          prompt: { fr: 'Le U est arrondi en bas, le V est pointu !' },
          alphabetDuo: {
            letters: [
              { upper: 'U', lower: 'u', word: { fr: 'Usine' }, phonetic: 'Uuu', iconSvg: 'Factory' },
              { upper: 'V', lower: 'v', word: { fr: 'Vélo' }, phonetic: 'Vvv', iconSvg: 'Bicycle' }
            ]
          }
        }
      },
      // Page 30 : Ww & Xx
      {
        id: 'p_5_12',
        pageNumber: 30,
        chapterId: 'chap_5',
        title: { fr: 'Les lettres Ww & Xx', moore: 'Gom-biisi Ww la Xx', dioula: 'Sɛbɛn Ww ni Xx' },
        instruction: { fr: 'W comme le grand Wagon et X comme le Xylophone ou Balafon !', moore: 'Ww la Xx', dioula: 'Ww ni Xx' },
        activity: {
          type: 'alphabet_duo',
          prompt: { fr: 'W fait deux V collés ensemble ! X croise deux traits !' },
          alphabetDuo: {
            letters: [
              { upper: 'W', lower: 'w', word: { fr: 'Wagon' }, phonetic: 'Double Vé', iconSvg: 'Train' },
              { upper: 'X', lower: 'x', word: { fr: 'Xylophone' }, phonetic: 'Iks', iconSvg: 'Star' }
            ]
          }
        }
      },
      // Page 31 : Yy & Zz
      {
        id: 'p_5_13',
        pageNumber: 31,
        chapterId: 'chap_5',
        title: { fr: 'Les lettres Yy & Zz', moore: 'Gom-biisi Yy la Zz', dioula: 'Sɛbɛn Yy ni Zz' },
        instruction: { fr: 'Y comme Yoyo amusant et Z comme Zèbre rayé ! Et voilà les 26 lettres !', moore: 'Yy la Zz', dioula: 'Yy ni Zz' },
        activity: {
          type: 'alphabet_duo',
          prompt: { fr: 'Bravo ! Tu as découvert les 26 lettres de l’alphabet !' },
          alphabetDuo: {
            letters: [
              { upper: 'Y', lower: 'y', word: { fr: 'Yoyo' }, phonetic: 'I-grec', iconSvg: 'Star' },
              { upper: 'Z', lower: 'z', word: { fr: 'Zèbre' }, phonetic: 'Zzz', iconSvg: 'Zebra' }
            ]
          }
        }
      },
      // Page 32 : Le club des 6 Voyelles en majuscules et minuscules
      {
        id: 'p_5_14',
        pageNumber: 32,
        chapterId: 'chap_5',
        title: { fr: 'Le Club des 6 Voyelles (Aa, Ee, Ii, Oo, Uu, Yy)', moore: 'Voyelles a, e, i, o, u, y', dioula: 'Voyelles bɛɛ' },
        instruction: { fr: 'Les voyelles chantent toutes seules ! Écoute leur mélodie magique.', moore: 'Gom-biis nins n yɩɩlmd', dioula: 'Sɛbɛnden donkilila' },
        activity: {
          type: 'case_match',
          prompt: { fr: 'Relie chaque voyelle majuscule à sa minuscule !' },
          casePairs: [
            { id: 'v_a', upper: 'A', lower: 'a' },
            { id: 'v_e', upper: 'E', lower: 'e' },
            { id: 'v_i', upper: 'I', lower: 'i' },
            { id: 'v_o', upper: 'O', lower: 'o' },
            { id: 'v_u', upper: 'U', lower: 'u' }
          ]
        }
      },
      // Page 33 : Attention aux lettres miroirs (b et d, p et q)
      {
        id: 'p_5_15',
        pageNumber: 33,
        chapterId: 'chap_5',
        title: { fr: 'Glisser-Déposer : Les Lettres Miroirs (b, d, p, q)', moore: 'Gom-biis b la d', dioula: 'Sɛbɛnden b ni d' },
        instruction: { fr: 'Attrape chaque minuscule avec ton doigt et glisse-la dans son panier majuscule !', moore: 'Glisse b la d', dioula: 'Sɛbɛnden b ni d labili' },
        activity: {
          type: 'drag_drop_case',
          prompt: { fr: 'Glisse b, d, p, q dans le bon panier de leur maman majuscule !' },
          dragDropCaseData: {
            pairs: [
              { id: 'pair_b', upper: 'B', lower: 'b', word: 'Baobab' },
              { id: 'pair_d', upper: 'D', lower: 'd', word: 'Dromadaire' },
              { id: 'pair_p', upper: 'P', lower: 'p', word: 'Poussin' },
              { id: 'pair_q', upper: 'Q', lower: 'q', word: 'Quenouille' }
            ]
          }
        }
      },
      // Page 34 : Les lettres à tiges et les lettres à queues
      {
        id: 'p_5_16',
        pageNumber: 34,
        chapterId: 'chap_5',
        title: { fr: 'Les Lettres Hautes et Basses', moore: 'Gom-biis zĩiga', dioula: 'Sɛbɛnden janya' },
        instruction: { fr: 'Certaines lettres montent vers le ciel (l, b, h), d’autres plongent sous terre (p, q, g, j, y) !', moore: 'Zĩiga bãngre', dioula: 'Yɛlɛli ni jigili' },
        activity: {
          type: 'case_match',
          prompt: { fr: 'Relie les lettres hautes à leur majuscule !' },
          casePairs: [
            { id: 'pair_l', upper: 'L', lower: 'l' },
            { id: 'pair_h', upper: 'H', lower: 'h' },
            { id: 'pair_t', upper: 'T', lower: 't' },
            { id: 'pair_g', upper: 'G', lower: 'g' }
          ]
        }
      },
      // Page 35 : La grande chanson de l'alphabet
      {
        id: 'p_5_17',
        pageNumber: 35,
        chapterId: 'chap_5',
        title: { fr: 'La Chanson de l’Alphabet', moore: 'Alphabet yɩɩle', dioula: 'Alphabet dɔnkili' },
        instruction: { fr: 'Chante l’alphabet complet de A à Z avec Kalo le Caméléon !', moore: 'Yɩɩl ne Kalo', dioula: 'Dɔnkili da ni Kalo ye' },
        activity: {
          type: 'alphabet_interactive_chart',
          prompt: { fr: 'Appuie sur « Chanter l’Alphabet » pour entendre la comptine de A à Z !' }
        }
      },
      // Page 36 : Le mur géant des 26 lettres
      {
        id: 'p_5_18',
        pageNumber: 36,
        chapterId: 'chap_5',
        title: { fr: 'Le Grand Tableau de l’Abécédaire', moore: 'Seb-biis teeblo', dioula: 'Sɛbɛndenw tebili' },
        instruction: { fr: 'Bascule entre Majuscules et minuscules et touche n’importe quelle lettre pour l’entendre !', moore: 'Touche gom-biis', dioula: 'Sɛbɛnden magan' },
        activity: {
          type: 'alphabet_interactive_chart',
          prompt: { fr: 'Explore les 26 lettres en majuscules et minuscules !' }
        }
      }
    ]
  },

  // CHAPITRE 6 : LES GRANDS JEUX LUDIQUES DE L'ALPHABET (5 PAGES)
  {
    id: 'chap_6',
    number: 6,
    subject: 'lecture',
    title: { fr: 'Jeux Ludiques de l’Alphabet', moore: 'Alphabet reem-nams', dioula: 'Alphabet tulonw' },
    description: { fr: '5 grands jeux amusants pour devenir le champion incontesté de l’alphabet CP !', moore: 'Reem la bãngre', dioula: 'Tulonkɛ ni dɔnni ye' },
    badgeEmoji: '🎮',
    iconSvg: 'games',
    colorScheme: {
      primary: '#EC4899',
      secondary: '#FCE7F3',
      accent: '#3B82F6',
      bgPattern: 'bg-[#FFF1F2]',
    },
    stickerReward: {
      id: 'stk_alphabet_champion',
      title: { fr: 'Diplôme du Roi de l’Alphabet', moore: 'Alphabet naaba', dioula: 'Alphabet masa' },
      svg: 'alphabet_medal'
    },
    pages: [
      // Page 37 : Jeu 1 - Glisser-Déposer Majuscules & Minuscules
      {
        id: 'p_6_1',
        pageNumber: 37,
        chapterId: 'chap_6',
        title: { fr: 'Jeu 1 : Glisser-Déposer des Lettres', moore: 'Reem 1 : Glisser-déposer', dioula: 'Tulon 1 : Sɛbɛnden labili' },
        instruction: { fr: 'Attrape chaque lettre minuscule avec ton doigt et glisse-la dans son panier majuscule !', moore: 'Glisse seb-biisi', dioula: 'Sɛbɛnden labili' },
        activity: {
          type: 'drag_drop_case',
          prompt: { fr: 'Glisse chaque minuscule vers sa MAJUSCULE correspondante !' },
          dragDropCaseData: {
            pairs: [
              { id: 'm_a', upper: 'A', lower: 'a', word: 'Ananas' },
              { id: 'm_m', upper: 'M', lower: 'm', word: 'Mangue' },
              { id: 'm_r', upper: 'R', lower: 'r', word: 'Rame' },
              { id: 'm_s', upper: 'S', lower: 's', word: 'Soleil' }
            ]
          }
        }
      },
      // Page 38 : Jeu 2 - Le Train de l'Alphabet (La Lettre Manquante)
      {
        id: 'p_6_2',
        pageNumber: 38,
        chapterId: 'chap_6',
        title: { fr: 'Jeu 2 : Le Train de l’Alphabet', moore: 'Reem 2 : Train', dioula: 'Tulon 2 : Kuluntise' },
        instruction: { fr: 'Le train doit partir ! Trouve la lettre qui manque dans le wagon vide.', moore: 'Gese wagon pʋgẽ', dioula: 'Wagon kɔnɔ fɛn ɲini' },
        activity: {
          type: 'missing_letter_train',
          prompt: { fr: 'Quelle lettre vient entre B et D dans l’alphabet ?' },
          trainData: {
            sequence: ['A', 'B', '?', 'D', 'E'],
            missingIndex: 2,
            options: ['C', 'F', 'H'],
            correct: 'C'
          }
        }
      },
      // Page 39 : Jeu 3 - La Pêche aux Lettres de Kalo
      {
        id: 'p_6_3',
        pageNumber: 39,
        chapterId: 'chap_6',
        title: { fr: 'Jeu 3 : La Chasse aux Lettres', moore: 'Reem 3 : Pêche', dioula: 'Tulon 3 : Jɛgɛminɛ' },
        instruction: { fr: 'Écoute bien la consigne de Kalo et attrape la bonne mangue volante !', moore: 'Kẽlegh Kalo', dioula: 'Kalo mɛn ka mangoro minɛ' },
        activity: {
          type: 'letter_hunt',
          prompt: { fr: 'Attrape la lettre M dans les mangues dorées !' },
          huntData: {
            targetLetter: 'M',
            targetName: 'comme Mangue',
            options: [
              { letter: 'M', isUpper: true, isTarget: true },
              { letter: 'N', isUpper: true, isTarget: false },
              { letter: 'W', isUpper: true, isTarget: false },
              { letter: 'm', isUpper: false, isTarget: true }
            ]
          }
        }
      },
      // Page 40 : Jeu 4 - Le Grand Panier de Tri Majuscules vs Minuscules
      {
        id: 'p_6_4',
        pageNumber: 40,
        chapterId: 'chap_6',
        title: { fr: 'Jeu 4 : Le Tri dans les Paniers', moore: 'Reem 4 : Panier tri', dioula: 'Tulon 4 : Panyen woloma' },
        instruction: { fr: 'Range chaque lettre dans le Grand Panier (MAJUSCULES) ou le Petit Panier (minuscules) !', moore: 'Pʋɩ panyen pʋgẽ', dioula: 'Sɛbɛndenw don panyen kɔnɔ' },
        activity: {
          type: 'case_sorter',
          prompt: { fr: 'Touche le bon panier pour chaque lettre qui apparaît !' },
          sorterData: {
            items: [
              { id: 's1', letter: 'A', isUpper: true },
              { id: 's2', letter: 'b', isUpper: false },
              { id: 's3', letter: 'F', isUpper: true },
              { id: 's4', letter: 'm', isUpper: false },
              { id: 's5', letter: 'R', isUpper: true },
              { id: 's6', letter: 't', isUpper: false }
            ]
          }
        }
      },
      // Page 41 : Jeu 5 - Le Grand Quiz et Diplôme de l'Alphabet
      {
        id: 'p_6_5',
        pageNumber: 41,
        chapterId: 'chap_6',
        title: { fr: 'Jeu 5 : Le Quiz du Champion de l’Alphabet', moore: 'Reem 5 : Quiz kãsenga', dioula: 'Tulon 5 : Quiz kɔrɔba' },
        instruction: { fr: 'Réponds à la question finale pour remporter la Médaille d’Or de l’Alphabet !', moore: 'Rɩk waoongo', dioula: 'Sɛbɛnden masa sani sara ta' },
        activity: {
          type: 'quiz',
          prompt: { fr: 'Quelle est la toute première lettre de l’alphabet ?' },
          sequenceData: {
            pattern: ['A', 'B', 'C'],
            options: ['A', 'Z', 'M'],
            correct: 'A'
          }
        }
      }
    ]
  },

  // CHAPITRE 7 : COMPTER JUSQU'À 50 ET LES DIZAINES (CALCUL)
  {
    id: 'chap_7',
    number: 7,
    subject: 'calcul',
    title: { fr: 'Compter jusqu’à 50 & Les Dizaines', moore: 'Sõd ta 50 la piisi', dioula: 'Jate fo 50 ni tanw' },
    description: { fr: 'Apprends les nombres jusqu’à 50, les dizaines (10, 20, 30, 40, 50) et les paquets de mangues !', moore: 'Bãng sõbre 50 taaba', dioula: 'Jateminɛ 50 dɔnni' },
    badgeEmoji: '🪙',
    iconSvg: 'numbers',
    colorScheme: {
      primary: '#0D9488',
      secondary: '#CCFBF1',
      accent: '#F59E0B',
      bgPattern: 'bg-[#F0FDFA]',
    },
    stickerReward: {
      id: 'stk_fifty_coins',
      title: { fr: 'Trésor des 50 Nombres', moore: 'Sõb-kãsenga', dioula: 'Jate masa' },
      svg: 'calabash_gold'
    },
    pages: [
      // Page 42 : Le grand tableau interactif des 50 nombres
      {
        id: 'p_7_1',
        pageNumber: 42,
        chapterId: 'chap_7',
        title: { fr: 'Le Grand Tableau de 1 à 50', moore: 'Teeblo 1 ta 50', dioula: 'Tebili 1 fo 50' },
        instruction: { fr: 'Explore tous les nombres de 1 à 50 ! Touche les dizaines dorées (10, 20, 30, 40, 50) !', moore: 'Sõd piisi', dioula: 'Tanw jate' },
        activity: {
          type: 'count_to_50',
          prompt: { fr: 'Touche n’importe quel nombre pour l’entendre ou lance le jeu de piste !' },
          countTo50Data: {
            start: 1,
            end: 50,
            targetFind: 34
          }
        }
      },
      // Page 43 : Les paquets de 10 mangues (Dizaines et Unités)
      {
        id: 'p_7_2',
        pageNumber: 43,
        chapterId: 'chap_7',
        title: { fr: 'Les Paquets de 10 (Dizaines et Unités)', moore: 'Mangasi piisi', dioula: 'Mangoro tan-tan' },
        instruction: { fr: 'Chaque grand panier compte pour 10 mangues. Combien y en a-t-il au total ?', moore: 'Sõd mangasi fãa', dioula: 'Mangoro bɛɛ jate' },
        activity: {
          type: 'tens_units',
          prompt: { fr: 'Calcule 3 paquets de 10 et 4 mangues seules !' },
          tensUnitsData: {
            tens: 3,
            units: 4,
            itemName: { fr: 'mangues' },
            itemType: 'mango'
          }
        }
      },
      // Page 44 : Le Trésor des pièces de monnaie (FCFA)
      {
        id: 'p_7_3',
        pageNumber: 44,
        chapterId: 'chap_7',
        title: { fr: 'Les Pièces de Monnaie au Marché', moore: 'Raaga ligdi', dioula: 'Sugu wari' },
        instruction: { fr: 'Awa a 4 sachets de 10 pièces et 5 pièces seules. Quel est le montant ?', moore: 'Ligdi sõdgre', dioula: 'Wari jateminɛ' },
        activity: {
          type: 'tens_units',
          prompt: { fr: '4 paquets de 10 et 5 unités, ça fait combien ?' },
          tensUnitsData: {
            tens: 4,
            units: 5,
            itemName: { fr: 'pièces de monnaie' },
            itemType: 'coin'
          }
        }
      },
      // Page 45 : La suite numérique jusqu'à 50
      {
        id: 'p_7_4',
        pageNumber: 45,
        chapterId: 'chap_7',
        title: { fr: 'La Suite des Nombres jusqu’à 50', moore: 'Sõbre nins n pʋgd taaba', dioula: 'Jatelen tũunugna' },
        instruction: { fr: 'Quel nombre vient juste après 29 et avant 31 ?', moore: 'Sõbre bãngre', dioula: 'Jatelen cɛmancɛ' },
        activity: {
          type: 'missing_letter_train',
          prompt: { fr: 'Trouve le nombre manquant dans la suite : 28, 29, [?], 31, 32 !' },
          trainData: {
            sequence: ['28', '29', '?', '31', '32'],
            missingIndex: 2,
            options: ['30', '35', '40'],
            correct: '30'
          }
        }
      }
    ]
  },

  // CHAPITRE 8 : L'ATELIER D'ÉCRITURE MANUSCRITE CURSIVE (CP)
  {
    id: 'chap_8',
    number: 8,
    subject: 'lecture',
    title: { fr: 'Atelier d’Écriture Manuscrite Cursive', moore: 'Seb-biis sɛbgo', dioula: 'Sɛbɛnni kurisiwu' },
    description: { fr: 'Apprends l’écriture attachée d’écolier avec les lignes Seyès de cahier CP !', moore: 'Sɛb sõama', dioula: 'Kalan kɛ sɛbɛnni cɛcɛlen na' },
    badgeEmoji: '✍️',
    iconSvg: 'pencil',
    colorScheme: {
      primary: '#4F46E5',
      secondary: '#EEF2FF',
      accent: '#F59E0B',
      bgPattern: 'bg-[#F5F3FF]',
    },
    stickerReward: {
      id: 'stk_master_pen',
      title: { fr: 'Plume d’Or d’Écriture', moore: 'Seb-biis bãngda', dioula: 'Sɛbɛnnikɛla fari' },
      svg: 'alphabet_medal'
    },
    pages: [
      // Page 46 : L'Atelier d'écriture cursive et les 3 écritures
      {
        id: 'p_8_1',
        pageNumber: 46,
        chapterId: 'chap_8',
        title: { fr: 'Les 3 Écritures CP (Capitale, Scripte, Cursive)', moore: 'Sɛb-buud a 3', dioula: 'Sɛbɛn sugu 3' },
        instruction: { fr: 'Découvre la Capitale, la Scripte et la belle Cursive attachée d’écolier ! Trace au doigt sur les lignes Seyès !', moore: 'Gese sɛb-buud', dioula: 'Sɛbɛn sugu lajɛ' },
        activity: {
          type: 'cursive_atelier',
          prompt: { fr: 'Choisis une lettre et trace-la en écriture cursive attachée !' }
        }
      },
      // Page 47 : Les grandes boucles et liaisons cursives
      {
        id: 'p_8_2',
        pageNumber: 47,
        chapterId: 'chap_8',
        title: { fr: 'Tracer les Boucles Cursives (l, b, h, k)', moore: 'Boucles sɛbgo', dioula: 'Kurunw sɛbɛnni' },
        instruction: { fr: 'La boucle monte jusqu’au ciel (3e interligne) et redescend bien droite ! Entraîne-toi au doigt !', moore: 'Gese boucles', dioula: 'Kurunw cɛcɛlen' },
        activity: {
          type: 'cursive_atelier',
          prompt: { fr: 'Entraîne-toi à tracer les lettres à grandes boucles (l, b, h, k) !' }
        }
      },
      // Page 48 : Les lettres rondes cursives (a, c, d, o, x)
      {
        id: 'p_8_3',
        pageNumber: 48,
        chapterId: 'chap_8',
        title: { fr: 'Les Lettres Rondes Cursives (a, c, d, o, x)', moore: 'Rondes sɛbgo', dioula: 'Sɛbɛnden kulunw' },
        instruction: { fr: 'On part toujours du premier interligne et on tourne vers la gauche comme un croissant de lune !', moore: 'Gese rondes', dioula: 'Kulunw lajɛ' },
        activity: {
          type: 'cursive_atelier',
          prompt: { fr: 'Trace les lettres rondes : a, c, d, o, x sur le cahier d’écolier !' }
        }
      },
      // Page 49 : Les lettres qui plongent sous terre (g, j, p, q, y, z)
      {
        id: 'p_8_4',
        pageNumber: 49,
        chapterId: 'chap_8',
        title: { fr: 'Les Lettres sous la Ligne (g, j, p, q, y, z)', moore: 'Tẽnga gom-biisi', dioula: 'Duguma sɛbɛndenw' },
        instruction: { fr: 'Ces lettres plongent sous la ligne violette de 2 interlignes ! Fais la boucle et remonte !', moore: 'Tẽnga boucles', dioula: 'Jigili duguma' },
        activity: {
          type: 'cursive_atelier',
          prompt: { fr: 'Trace les lettres à queue qui plongent sous la terre !' }
        }
      }
    ]
  }
];

// Pack additionnel d'exemple "Pack Contes du Baobab"
export const PACK_CONTES_LOCAL: ContentPack = {
  packId: 'pack_contes_baobab',
  title: 'Contes et Légendes du Baobab',
  author: 'Équipe Pédagogique Ouest-Africaine',
  version: '1.0.0',
  description: 'Trois petites histoires illustrées avec lecture guidée, questions de compréhension et jeux de vocabulaire pour le CP.',
  chapters: [
    {
      id: 'chap_pack_1',
      number: 9,
      subject: 'conte',
      title: { fr: 'Le Lièvre et le Petit Mouton', moore: 'Soamba la Pe-biiga', dioula: 'Sounsounba ni Sagadɛn' },
      description: { fr: 'Conte traditionnel d’amitié et de partage au clair de lune.', moore: 'Solma sõama', dioula: 'Nsiirin cɛkɔrɔba' },
      badgeEmoji: '📖',
      iconSvg: 'book',
      colorScheme: {
        primary: '#7C3AED',
        secondary: '#EDE9FE',
        accent: '#F59E0B',
        bgPattern: 'bg-[#FAF5FF]',
      },
      stickerReward: {
        id: 'stk_hare_sheep',
        title: { fr: 'Le Lièvre Rusé', moore: 'Soamba yam', dioula: 'Sounsounba hakili' },
        svg: 'hare_avatar'
      },
      pages: [
        {
          id: 'p_pack_1',
          pageNumber: 50,
          chapterId: 'chap_pack_1',
          title: { fr: 'Le Lièvre et l’Arbre Enchanté', moore: 'Tiig waoongo', dioula: 'Yiri nsiirin' },
          instruction: { fr: 'Écoute l’histoire du petit lièvre malin qui adorait lire sous le grand baobab.', moore: 'Karem kibare', dioula: 'Kuma mɛn' },
          activity: {
            type: 'read_aloud',
            prompt: { fr: 'Touche pour écouter puis répète avec le lièvre !' },
            storySentences: [
              { id: 1, text: 'Sous le grand baobab, le lièvre lit un livre.' },
              { id: 2, text: 'Le petit mouton arrive avec une calebasse de lait.' },
              { id: 3, text: 'Ils partagent les mangues sucrées ensemble.' },
              { id: 4, text: 'La lune brille doucement dans le ciel bleu.' }
            ]
          }
        }
      ]
    }
  ]
};

export const STICKERS_CATALOG = [
  { id: 'stk_kalo_star', name: 'Kalo l’Étoile', icon: 'kalo_star', color: '#10B981' },
  { id: 'stk_mango_gold', name: 'Mangue Dorée', icon: 'mango_gold', color: '#F59E0B' },
  { id: 'stk_baobab_gold', name: 'Grand Baobab', icon: 'baobab_gold', color: '#8B5CF6' },
  { id: 'stk_calabash_party', name: 'Calebasse Royale', icon: 'calabash_gold', color: '#EC4899' },
  { id: 'stk_hare_sheep', name: 'Lièvre Rusé', icon: 'hare_avatar', color: '#3B82F6' },
  { id: 'stk_chick_hero', name: 'Poussin Courageux', icon: 'chick', color: '#EAB308' },
  { id: 'stk_alphabet_champion', name: 'Roi de l’Alphabet', icon: 'alphabet_medal', color: '#F59E0B' },
  { id: 'stk_fifty_coins', name: 'Trésor des 50 Nombres', icon: 'coin', color: '#0D9488' },
  { id: 'stk_master_pen', name: 'Plume d’Écriture Cursive', icon: 'alphabet_medal', color: '#4F46E5' },
];
