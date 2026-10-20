export type SubjectType = 'lecture' | 'calcul' | 'conte';

export interface MultilingualText {
  fr: string;
  moore?: string;
  dioula?: string;
}

export type ActivityType = 
  | 'letter_intro'
  | 'letter_trace'
  | 'syllable_mixer'
  | 'word_match'
  | 'read_aloud'
  | 'count_tap'
  | 'number_trace'
  | 'compare_quantities'
  | 'drag_addition'
  | 'subtraction_cut'
  | 'logical_sequence'
  | 'quiz'
  | 'alphabet_duo'
  | 'case_match'
  | 'missing_letter_train'
  | 'letter_hunt'
  | 'case_sorter'
  | 'alphabet_interactive_chart'
  | 'drag_drop_case'
  | 'count_to_50'
  | 'tens_units'
  | 'cursive_atelier';

export interface ActivityData {
  type: ActivityType;
  prompt: MultilingualText;
  letter?: string;
  sampleWord?: MultilingualText;
  wordImageSvg?: string;
  traceData?: {
    letter: string;
    type: 'script' | 'cursive';
    startPoint: { x: number; y: number };
    guidelinePoints: { x: number; y: number }[];
    strokeHelp: string;
  };
  syllables?: {
    consonant: string;
    vowels: string[];
  };
  matchingPairs?: {
    id: string;
    word: MultilingualText;
    iconSvg: string;
  }[];
  storySentences?: {
    id: number;
    text: string;
    translation?: MultilingualText;
  }[];
  countData?: {
    targetNumber: number;
    itemName: MultilingualText;
    itemType: 'mango' | 'calabash' | 'star' | 'chick' | 'coin' | 'baobab';
    options?: number[];
  };
  additionData?: {
    num1: number;
    num2: number;
    itemType: 'mango' | 'star' | 'coin';
  };
  subtractionData?: {
    total: number;
    toRemove: number;
    itemType: 'mango' | 'calabash' | 'chick';
  };
  compareData?: {
    leftCount: number;
    rightCount: number;
    itemType: 'mango' | 'chick' | 'calabash';
  };
  sequenceData?: {
    pattern: string[];
    options: string[];
    correct: string;
  };
  alphabetDuo?: {
    letters: { 
      upper: string; 
      lower: string; 
      word: MultilingualText; 
      phonetic: string;
      iconSvg?: string;
    }[];
  };
  casePairs?: { 
    id: string;
    upper: string; 
    lower: string; 
  }[];
  trainData?: {
    sequence: string[];
    missingIndex: number;
    options: string[];
    correct: string;
  };
  huntData?: {
    targetLetter: string;
    targetName: string;
    options: { letter: string; isUpper: boolean; isTarget: boolean }[];
  };
  sorterData?: {
    items: { id: string; letter: string; isUpper: boolean }[];
  };
  dragDropCaseData?: {
    pairs: { id: string; upper: string; lower: string; word?: string }[];
  };
  countTo50Data?: {
    start: number;
    end: number;
    targetFind?: number;
    mode?: 'explore' | 'find' | 'count_tens';
  };
  tensUnitsData?: {
    tens: number;
    units: number;
    itemName: MultilingualText;
    itemType: 'mango' | 'coin' | 'calabash';
  };
  cursiveData?: {
    letters: {
      char: string;
      capital: string;
      script: string;
      cursive: string;
      word: string;
      strokeInstruction: string;
    }[];
  };
}

export interface BookPage {
  id: string;
  pageNumber: number;
  chapterId: string;
  title: MultilingualText;
  instruction: MultilingualText;
  activity: ActivityData;
  simplifiedActivity?: ActivityData; // Adaptive scaffolding if child struggles
}

export interface Chapter {
  id: string;
  number: number;
  subject: SubjectType;
  title: MultilingualText;
  description: MultilingualText;
  badgeEmoji: string;
  iconSvg: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    bgPattern: string;
  };
  pages: BookPage[];
  stickerReward: {
    id: string;
    title: MultilingualText;
    svg: string;
  };
}

export interface ChildProfile {
  id: string;
  name: string;
  avatar: 'kalo' | 'lionceau' | 'gazelle' | 'fennec' | 'lievre';
  starsCount: number;
  unlockedChapters: string[];
  completedPages: Record<string, boolean>;
  stickersEarned: string[];
  placedStickers?: { id: string; stickerId: string; x: number; y: number }[];
  reviewQueue: {
    id: string;
    type: 'letter' | 'syllable' | 'number' | 'addition';
    value: string;
    mistakesCount: number;
    lastPracticed?: string;
  }[];
  lastPageVisited?: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  bilingualLanguage: 'none' | 'moore' | 'dioula';
  sessionTimeLimitEnabled: boolean;
  allChaptersUnlocked: boolean;
  fontType: 'script' | 'cursive';
}

export interface ContentPack {
  packId: string;
  title: string;
  author: string;
  version: string;
  description: string;
  chapters: Chapter[];
}
