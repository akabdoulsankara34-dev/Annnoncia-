import React, { useState, useEffect, useRef } from 'react';
import { ChildProfile } from '../types/book';
import { sound, speakText, stopSpeaking } from '../utils/audio';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Star, 
  Award, 
  BookOpen,
  ShoppingBag,
  Puzzle,
  Edit3,
  CalendarCheck
} from 'lucide-react';

interface LireEtCompterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: ChildProfile;
  onAwardStars: (count: number) => void;
}

// 11 sections
type SectionId = 
  | 'bienvenue' 
  | 'seance' 
  | 'semaine1' 
  | 'semaine2' 
  | 'semaine3' 
  | 'semaine4' 
  | 'ecrire' 
  | 'conte' 
  | 'marche' 
  | 'mots' 
  | 'suivi';

interface SectionMeta {
  id: SectionId;
  title: string;
  badge?: string;
  icon: string;
}

const SECTIONS: SectionMeta[] = [
  { id: 'bienvenue', title: 'Bienvenue', icon: '👋' },
  { id: 'seance', title: 'Séance type 20 min', icon: '⏱️' },
  { id: 'semaine1', title: 'Semaine 1 : Sons & 1-10', badge: 'Sons et nombres 1-10', icon: '🌱' },
  { id: 'semaine2', title: 'Semaine 2 : Syllabes & Décomposition', badge: 'Syllabes et décomposition', icon: '🌿' },
  { id: 'semaine3', title: 'Semaine 3 : Mots & Compléter à 10', badge: 'Mots et compléter à 10', icon: '🌳' },
  { id: 'semaine4', title: 'Semaine 4 : Phrases & Retrait', badge: 'Phrases et retrait', icon: '⭐' },
  { id: 'ecrire', title: 'Écrire au doigt', badge: 'Atelier tracé', icon: '✍️' },
  { id: 'conte', title: 'Le conte : Le hibou et les étoiles', badge: 'Histoire du soir', icon: '🦉' },
  { id: 'marche', title: 'Au marché (Jeu FCFA)', badge: 'Calcul de monnaie', icon: '🛒' },
  { id: 'mots', title: 'Mots mystères (Puzzle)', badge: 'Assemblage syllabique', icon: '🧩' },
  { id: 'suivi', title: 'Fiche de suivi 4 semaines', badge: '20 séances', icon: '📋' },
];

export const LireEtCompterModal: React.FC<LireEtCompterModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onAwardStars,
}) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // État Activité 1 : Le cadre de 10 (10 cases)
  const [frameTokens, setFrameTokens] = useState<boolean[]>([
    true, true, true, true, false, false, false, false, false, false
  ]);

  // État Activité 2 : Fabrique une syllabe
  const consonants = ['m', 'l', 'r', 's', 'p', 't', 'b', 'd'];
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const [selectedConsonant, setSelectedConsonant] = useState('m');
  const [selectedVowel, setSelectedVowel] = useState('a');

  // État Activité 3 : Compléter à 10
  const [additionExampleIndex, setAdditionExampleIndex] = useState(0);
  const additionExamples = [
    { a: 8, b: 5, compA: 2, restB: 3, total: 13, text: '8 + 5' },
    { a: 9, b: 4, compA: 1, restB: 3, total: 13, text: '9 + 4' },
    { a: 7, b: 6, compA: 3, restB: 3, total: 13, text: '7 + 6' },
    { a: 8, b: 7, compA: 2, restB: 5, total: 15, text: '8 + 7' },
    { a: 9, b: 5, compA: 1, restB: 4, total: 14, text: '9 + 5' },
  ];

  // État Activité 4 : Table de 2
  const tableDeDeux = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

  // État Activité 5 : Écrire au doigt
  const lettersAndDigits = ['a', 'e', 'i', 'o', 'u', 'm', 'l', '1', '2', '3', '4', '5'];
  const [selectedLetterToTrace, setSelectedLetterToTrace] = useState('a');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // État Activité 6 : Conte "Le hibou et les étoiles"
  const storySentences = [
    "La nuit tombe sur le grand baobab.",
    "Le vieux hibou ouvre grand ses yeux ronds.",
    "Il compte les petites étoiles dans le ciel : une, deux, trois, quatre, cinq.",
    "Une étoile filante traverse la nuit comme un trait d'or.",
    "Le hibou dit doucement : Bonne nuit les enfants, dormez bien."
  ];
  const [activeStorySentenceIndex, setActiveStorySentenceIndex] = useState<number | null>(null);
  const [isOwlTalking, setIsOwlTalking] = useState(false);

  // État Activité 7 : Au marché (FCFA)
  const marketItems = [
    { id: 'mangue', name: 'Mangue mûre', price: 75, icon: '🥭', options: [25, 50, 75], correct: 25 },
    { id: 'banane', name: 'Régime de bananes', price: 50, icon: '🍌', options: [30, 50, 60], correct: 50 },
    { id: 'pain', name: 'Pain croustillant', price: 25, icon: '🥖', options: [75, 50, 25], correct: 75 },
    { id: 'tomate', name: 'Belle tomate rouge', price: 25, icon: '🍅', options: [50, 75, 80], correct: 75 },
    { id: 'oeuf', name: 'Œuf frais', price: 50, icon: '🥚', options: [25, 50, 75], correct: 50 },
  ];
  const [currentMarketIndex, setCurrentMarketIndex] = useState(0);
  const [marketFeedback, setMarketFeedback] = useState<string | null>(null);
  const [marketAnswered, setMarketAnswered] = useState<Record<number, boolean>>({});

  // État Activité 8 : Mots mystères
  const mysteryWords = [
    { id: 'lune', word: 'lune', syllables: ['lu', 'ne'], hint: 'Brille dans la nuit', emoji: '🌙' },
    { id: 'velo', word: 'vélo', syllables: ['vé', 'lo'], hint: 'Deux roues pour rouler', emoji: '🚲' },
    { id: 'tomate', word: 'tomate', syllables: ['to', 'ma', 'te'], hint: 'Légume rouge et juteux', emoji: '🍅' },
    { id: 'banane', word: 'banane', syllables: ['ba', 'na', 'ne'], hint: 'Fruit jaune sucré', emoji: '🍌' },
    { id: 'moto', word: 'moto', syllables: ['mo', 'to'], hint: 'Deux roues à moteur', emoji: '🏍️' },
    { id: 'sapin', word: 'sapin', syllables: ['sa', 'pin'], hint: 'Grand arbre vert', emoji: '🌲' },
  ];
  const [mysteryWordIndex, setMysteryWordIndex] = useState(0);
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  const [wordFeedback, setWordFeedback] = useState<'success' | 'error' | null>(null);
  const [shuffledSyllables, setShuffledSyllables] = useState<string[]>([]);

  // État Fiche de suivi (20 séances)
  const storageKey = `suivi_lire_compter_${activeProfile?.id || 'default'}`;
  const [checkedSessions, setCheckedSessions] = useState<boolean[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 20) return parsed;
        }
      }
    } catch {}
    return new Array(20).fill(false);
  });

  // Sauvegarde automatique du suivi
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(storageKey, JSON.stringify(checkedSessions));
      }
    } catch {}
  }, [checkedSessions, storageKey]);

  // Réinitialiser les syllabes du mot mystère quand on change d'index
  useEffect(() => {
    const target = mysteryWords[mysteryWordIndex];
    if (target) {
      const shuffled = [...target.syllables].sort(() => 0.5 - Math.random());
      setShuffledSyllables(shuffled);
      setSelectedSyllables([]);
      setWordFeedback(null);
    }
  }, [mysteryWordIndex]);

  // Dessin sur Canvas pour la zone d'écriture
  const drawGuideOnCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Lignes de cahier écolier
    ctx.strokeStyle = '#D9E4F1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Ligne médiane
    ctx.moveTo(20, 160);
    ctx.lineTo(300, 160);
    // Ligne haute
    ctx.moveTo(20, 70);
    ctx.lineTo(300, 70);
    // Ligne basse
    ctx.moveTo(20, 250);
    ctx.lineTo(300, 250);
    ctx.stroke();

    // Lettre guide en filigrane doux
    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'bold 150px "Fredoka", "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedLetterToTrace, 160, 165);
  };

  useEffect(() => {
    if (SECTIONS[currentSectionIndex].id === 'ecrire') {
      setTimeout(() => {
        drawGuideOnCanvas();
      }, 50);
    }
  }, [currentSectionIndex, selectedLetterToTrace]);

  // Nettoyer audio quand le modal se ferme
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      setIsOwlTalking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSection = SECTIONS[currentSectionIndex];
  const progressPercent = Math.round((currentSectionIndex / (SECTIONS.length - 1)) * 100);

  // Actions audio
  const handleNextSection = () => {
    if (currentSectionIndex < SECTIONS.length - 1) {
      sound.playPageFlip();
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      sound.playPageFlip();
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  // Cadre de 10
  const activeTokensCount = frameTokens.filter(Boolean).length;
  const missingTokensCount = 10 - activeTokensCount;
  const toggleToken = (idx: number) => {
    sound.playPop(480 + idx * 30);
    setFrameTokens(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  // Fabrique de syllabes
  const currentSyllable = `${selectedConsonant}${selectedVowel}`;
  const handleSpeakSyllable = () => {
    speakText(currentSyllable, { rate: 0.8 });
  };

  // Conte interactif
  const handlePlayStory = () => {
    let step = 0;
    setIsOwlTalking(true);

    const playNext = () => {
      if (step >= storySentences.length) {
        setActiveStorySentenceIndex(null);
        setIsOwlTalking(false);
        sound.playSuccess();
        return;
      }
      setActiveStorySentenceIndex(step);
      speakText(storySentences[step], {
        rate: 0.82,
        onEnd: () => {
          step++;
          setTimeout(playNext, 600);
        }
      });
    };

    playNext();
  };

  const handlePlaySentence = (idx: number) => {
    setActiveStorySentenceIndex(idx);
    setIsOwlTalking(true);
    speakText(storySentences[idx], {
      rate: 0.85,
      onEnd: () => {
        setIsOwlTalking(false);
      }
    });
  };

  // Au marché
  const currentItem = marketItems[currentMarketIndex];
  const handleChooseMarketChange = (val: number) => {
    if (val === currentItem.correct) {
      sound.playSuccess();
      sound.playStarReward();
      setMarketFeedback(`Bravo ! 100 − ${currentItem.price} = ${currentItem.correct} FCFA !`);
      setMarketAnswered(prev => ({ ...prev, [currentMarketIndex]: true }));
      onAwardStars(1);
      speakText(`Bravo ! La marchande te rend ${currentItem.correct} francs CFA.`);
    } else {
      sound.playPop(300);
      setMarketFeedback(`Presque ! 100 − ${currentItem.price} fait ${currentItem.correct} FCFA.`);
      speakText(`Essaie encore ! 100 moins ${currentItem.price} font ${currentItem.correct} francs.`);
    }
  };

  // Mots mystères
  const targetWord = mysteryWords[mysteryWordIndex];
  const handlePickSyllable = (syl: string, indexInShuffled: number) => {
    sound.playPop();
    const nextPicked = [...selectedSyllables, syl];
    setSelectedSyllables(nextPicked);

    // Vérifier si le mot est complet
    if (nextPicked.length === targetWord.syllables.length) {
      const built = nextPicked.join('');
      if (built === targetWord.syllables.join('')) {
        setWordFeedback('success');
        sound.playSuccess();
        sound.playStarReward();
        onAwardStars(1);
        speakText(`Bravo ! ${targetWord.word} !`, { rate: 0.85 });
      } else {
        setWordFeedback('error');
        sound.playPop(280);
        speakText("Réessaie dans le bon ordre !");
        setTimeout(() => {
          setSelectedSyllables([]);
          setWordFeedback(null);
        }, 1200);
      }
    }
  };

  // Tracé sur Canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.strokeStyle = '#C8372D';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  // Fiche de suivi
  const completedSessionsCount = checkedSessions.filter(Boolean).length;
  const toggleSessionCheck = (idx: number) => {
    sound.playPop(520);
    setCheckedSessions(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F2F6FB] text-[#1F2A44] overflow-hidden select-none">
      {/* Texture de cahier à carreaux (28px x 28px) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          backgroundImage: 'linear-gradient(#D9E4F1 1px, transparent 1px), linear-gradient(90deg, #D9E4F1 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Barre supérieure collante (Sticky Top Bar) */}
      <header className="sticky top-0 z-20 bg-[#F2F6FB]/95 backdrop-blur-md border-b border-[#C9D6E6] px-4 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          {/* Ligne titre & bouton fermer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">{currentSection.icon}</span>
              <div>
                <h1 className="font-['Fredoka',sans-serif] text-base sm:text-lg font-black text-[#1F2A44] leading-tight">
                  Lire et compter à 6-7 ans
                </h1>
                <p className="text-xs text-[#52607C] font-semibold">
                  Méthode sino-japonaise adaptée au CP
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#F2B632] text-[#1F2A44] font-black text-xs px-2.5 py-1 rounded-full shadow-xs">
                <Star className="w-3.5 h-3.5 fill-[#1F2A44]" />
                <span>{activeProfile.starsCount}</span>
              </div>

              <button
                onClick={() => {
                  sound.playPop();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-white border-2 border-[#1F2A44] flex items-center justify-center hover:bg-rose-50 text-[#1F2A44] font-black transition cursor-pointer shadow-xs"
                title="Quitter et revenir au livre"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Barre de progression & titre d'étape */}
          <div>
            <div className="h-2 w-full bg-[#C9D6E6] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#C8372D] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-xs text-[#52607C] font-bold">
              <span>Étape {currentSectionIndex + 1} / {SECTIONS.length} : {currentSection.title}</span>
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal défilable */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28 relative z-10">
        <div className="max-w-2xl mx-auto">

          {/* ================= SECTION 1 : BIENVENUE ================= */}
          {currentSection.id === 'bienvenue' && (
            <div className="animate-fadeIn">
              <h2 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black text-[#1F2A44] mb-2">
                Lire et compter à 6-7 ans
              </h2>
              <p className="text-base text-[#52607C] mb-4 leading-relaxed">
                Un petit programme de 4 semaines pour un parent ou un enseignant, inspiré des méthodes utilisées au Japon et en Chine, adapté au français.
              </p>

              {/* Les 5 principes */}
              <div className="bg-white border-2 border-[#C8372D] rounded-2xl p-4 sm:p-5 shadow-xs mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🌟</span>
                  <h3 className="font-['Fredoka',sans-serif] text-lg font-black text-[#C8372D]">
                    Les 5 principes
                  </h3>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-[#1F2A44] font-medium text-sm sm:text-base">
                  <li>
                    <b>Peu, mais chaque jour.</b> 20 minutes valent mieux qu’une heure le week-end.
                  </li>
                  <li>
                    <b>On dit à voix haute.</b> Sons, syllabes, comptines, nombres : l’oral vient avant l’écrit.
                  </li>
                  <li>
                    <b>Le concret d’abord.</b> Cailloux, bouchons, doigts, graines, puis seulement le crayon.
                  </li>
                  <li>
                    <b>Le 10 comme pilier.</b> Tout le calcul de l’année s’appuie sur lui.
                  </li>
                  <li>
                    <b>Écrire à la main</b>, lentement, en soignant le geste.
                  </li>
                </ol>
              </div>

              {/* Matériel */}
              <div className="bg-white border-2 border-[#1F2A44] rounded-2xl p-4 sm:p-5 shadow-xs mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🎒</span>
                  <h3 className="font-['Fredoka',sans-serif] text-lg font-black text-[#1F2A44]">
                    Matériel simple
                  </h3>
                </div>
                <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-[#52607C]">
                  <li>Un cahier à grands carreaux et un crayon bien taillé</li>
                  <li>20 petits objets : bouchons, graines, cailloux, jetons</li>
                  <li>Des cartes en papier pour les lettres et les syllabes</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 border-2 border-[#F2B632] rounded-2xl text-center">
                <p className="text-sm font-bold text-[#1F2A44]">
                  💡 Touchez <b>Suivant</b> en bas pour commencer la séance !
                </p>
              </div>
            </div>
          )}

          {/* ================= SECTION 2 : SEANCE TYPE 20 MIN ================= */}
          {currentSection.id === 'seance' && (
            <div className="animate-fadeIn">
              <h2 className="font-['Fredoka',sans-serif] text-2xl font-black text-[#1F2A44] mb-3">
                La séance de 20 minutes
              </h2>
              <p className="text-sm text-[#52607C] mb-4">
                Voici le déroulé recommandé pour chaque jour. Un rythme court et dynamique garde l'attention de l'enfant intacte.
              </p>

              {/* Tableau horaire */}
              <div className="overflow-hidden bg-white border-2 border-[#1F2A44] rounded-2xl shadow-xs mb-4">
                <table className="w-full text-left text-sm sm:text-base">
                  <thead className="bg-[#D9E4F1] border-b-2 border-[#1F2A44] font-black text-[#1F2A44]">
                    <tr>
                      <th className="py-2.5 px-3">Temps</th>
                      <th className="py-2.5 px-4">Activité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C9D6E6]">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-[#C8372D] whitespace-nowrap">3 min</td>
                      <td className="py-2.5 px-4">Chanter ou réciter : comptine, comptage en avant et en arrière</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-[#C8372D] whitespace-nowrap">7 min</td>
                      <td className="py-2.5 px-4">Lecture : sons, syllabes, mots doux</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-[#C8372D] whitespace-nowrap">7 min</td>
                      <td className="py-2.5 px-4">Calcul avec objets réels (bouchons, graines), puis sur le cahier</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-[#C8372D] whitespace-nowrap">3 min</td>
                      <td className="py-2.5 px-4">Écriture soignée d’une ligne, puis grands encouragements !</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Règle d'or */}
              <div className="bg-amber-100 border-2 border-[#F2B632] rounded-2xl p-4 text-[#1F2A44] font-medium text-sm sm:text-base mb-4">
                <b>⭐ Règle d’or :</b> on s’arrête quand l’enfant est encore content. Mieux vaut finir tôt avec le sourire que finir fatigué.
              </div>

              <p className="text-xs text-[#52607C] italic text-center">
                Cochez les séances sur la <b>fiche de suivi</b>, à la dernière page de ce module.
              </p>
            </div>
          )}

          {/* ================= SECTION 3 : SEMAINE 1 ================= */}
          {currentSection.id === 'semaine1' && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-['Fredoka',sans-serif] text-2xl font-black text-[#1F2A44]">
                  Semaine 1
                </h2>
                <span className="bg-[#F2B632] text-[#1F2A44] font-black rounded-lg px-2.5 py-0.5 text-xs">
                  Sons et nombres 1-10
                </span>
              </div>

              <div className="bg-white border-2 border-[#1F2A44] rounded-2xl p-4 mb-4 shadow-xs">
                <h3 className="font-['Fredoka',sans-serif] text-base font-black text-[#1F2A44] mb-1">
                  Lire : les voyelles
                </h3>
                <p className="text-xs text-[#52607C] mb-2">
                  Comme le pinyin en Chine ou les hiragana au Japon, on commence par les <b>sons</b> avant les mots.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-[#1F2A44]">
                  <li>Apprendre <b>a, e, i, o, u</b> avec un geste pour chaque son.</li>
                  <li>Chercher des mots qui commencent par chaque voyelle.</li>
                  <li>Écrire chaque lettre en la disant à voix haute : « a, a, a ».</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-[#1F2A44] rounded-2xl p-4 mb-4 shadow-xs">
                <h3 className="font-['Fredoka',sans-serif] text-base font-black text-[#1F2A44] mb-1">
                  Compter : 1 à 10
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-[#1F2A44]">
                  <li>Compter des objets en les touchant un par un.</li>
                  <li>Réciter de 1 à 10, puis de 10 à 1 en arrière.</li>
                  <li>Poser le bon nombre d’objets pour un chiffre donné.</li>
                </ul>
              </div>

              {/* Activité interactive : Le cadre de 10 */}
              <div className="bg-white border-2 border-[#C8372D] rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-['Fredoka',sans-serif] text-base font-black text-[#C8372D]">
                    Activité interactive : Le cadre de 10
                  </h3>
                  <button
                    onClick={() => {
                      setFrameTokens([false, false, false, false, false, false, false, false, false, false]);
                      sound.playPop();
                    }}
                    className="text-xs font-bold text-[#52607C] hover:text-[#C8372D] underline"
                  >
                    Vider
                  </button>
                </div>
                <p className="text-xs text-[#52607C] mb-3">
                  Touchez les cases pour poser ou enlever des jetons. Observez combien il en manque pour faire 10 !
                </p>

                {/* Grille 5x2 */}
                <div className="grid grid-cols-5 gap-2.5 max-w-[300px] mx-auto my-3">
                  {frameTokens.map((isOn, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleToken(idx)}
                      className={`aspect-square rounded-full border-2 border-[#1F2A44] flex items-center justify-center font-black transition-all active:scale-90 cursor-pointer ${
                        isOn 
                          ? 'bg-[#F2B632] shadow-sm transform scale-102' 
                          : 'bg-transparent hover:bg-slate-100'
                      }`}
                      title={`Case ${idx + 1}`}
                    >
                      {isOn && <span className="text-lg">🟡</span>}
                    </button>
                  ))}
                </div>

                {/* Résultat textuel dynamique */}
                <div className="text-center font-['Fredoka',sans-serif] font-bold text-base sm:text-lg text-[#1F2A44] mt-3 min-h-[48px] bg-slate-50 border border-[#C9D6E6] rounded-xl p-2 flex items-center justify-center gap-2">
                  {activeTokensCount === 10 ? (
                    <span className="text-[#2E7D5B] font-black">
                      🎉 Bravo ! Le cadre est complet : 10 jetons !
                    </span>
                  ) : (
                    <span>
                      <b>{activeTokensCount}</b> jeton{activeTokensCount > 1 ? 's' : ''} + <b>{missingTokensCount}</b> restant{missingTokensCount > 1 ? 's' : ''} = <b>10</b>
                    </span>
                  )}
                </div>

                <div className="mt-3 flex justify-center">
                  <button
                    onClick={() => {
                      speakText(`${activeTokensCount} jetons. Il en manque ${missingTokensCount} pour faire 10.`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#1F2A44] bg-white text-xs font-black hover:bg-slate-50 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#C8372D]" />
                    <span>Écouter la règle</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 4 : SEMAINE 2 ================= */}
          {currentSection.id === 'semaine2' && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-['Fredoka',sans-serif] text-2xl font-black text-[#1F2A44]">
                  Semaine 2
                </h2>
                <span className="bg-[#F2B632] text-[#1F2A44] font-black rounded-lg px-2.5 py-0.5 text-xs">
                  Syllabes et décomposition
                </span>
              </div>

              <div className="bg-white border-2 border-[#1F2A44] rounded-2xl p-4 mb-4 shadow-xs">
                <h3 className="font-['Fredoka',sans-serif] text-base font-black text-[#1F2A44] mb-1">
                  Lire : les syllabes
                </h3>
                <p className="text-xs text-[#52607C] mb-2">
                  On associe une consonne à une voyelle, comme la grille des 46 signes japonais.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-[#1F2A44]">
                  <li>Consonnes faciles : <b>m, l, r, s, p, t, b, d</b>.</li>
                  <li>Lire <b>ma, me, mi, mo, mu</b>, puis <b>la, le, li…</b></li>
                  <li>Assembler deux syllabes : <b>ma + ma = maman</b>.</li>
                </ul>
              </div>

              {/* Activité interactive : Fabrique une syllabe */}
              <div className="bg-white border-2 border-[#C8372D] rounded-2xl p-4 mb-4 shadow-sm">
                <h3 className="font-['Fredoka',sans-serif] text-base font-black text-[#C8372D] mb-1">
                  Activité : Fabrique une syllabe
                </h3>
                <p className="text-xs text-[#52607C] mb-3">
                  Choisis une consonne puis une voyelle, puis écoute le son qu'elles forment ensemble !
                </p>

                {/* Ligne des consonnes */}
                <div className="mb-2">
                  <span className="text-[11px] font-bold text-[#52607C] uppercase tracking-wider block mb-1">
                    1. Consonnes :
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {consonants.map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setSelectedConsonant(c);
                          sound.playPop();
                        }}
                        className={`w-9 h-9 rounded-xl font-['Fredoka',sans-serif] text-lg font-black border-2 border-[#1F2A44] transition-all cursor-pointer ${
                          selectedConsonant === c 
                            ? 'bg-[#1F2A44] text-white shadow-xs scale-105' 
                            : 'bg-white hover:bg-slate-100 text-[#1F2A44]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ligne des voyelles */}
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-[#52607C] uppercase tracking-wider block mb-1">
                    2. Voyelles :
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {vowels.map(v => (
                      <button
                        key={v}
                        onClick={() => {
                          setSelectedVowel(v);
                          sound.playPop();
                        }}
                        className={`w-9 h-9 rounded-xl font-['Fredoka',sans-serif] text-lg font-black border-2 border-[#1F2A44] transition-all cursor-pointer ${
                          selectedVowel === v 
                            ? 'bg-[#F2B632] text-[#1F2A44] shadow-xs scale-105' 
                            : 'bg-white hover:bg-slate-100 text-[#1F2A44]'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Affichage géant de la syllabe */}
                <div className="font-['Fredoka',sans-serif] text-5xl font-black text-center text-[#1F2A44] my-2 tracking-wider py-1">
                  {currentSyllable}
                </div>

                <div className="flex justify-center mt-2">
                  <button
                    onClick={handleSpeakSyllable}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8372D] text-white font-['Fredoka',sans-serif] font-black text-base shadow-md hover:bg-rose-700 active:scale-95 transition cursor-pointer"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span>Écouter la syllabe</span>
                  </button>
                </div>
              </div>

              {/* Compter : Décomposer */}
              <div className="bg-white border-2 border-[#1F2A44] rounded-2xl p-4 shadow-xs">
                <h3 className="font-['Fredoka',sans-serif] text-base font-black text-[#1F2A44] mb-1">
                  Compter : décomposer le nombre 10
                </h3>
                <p className="text-xs text-[#52607C] mb-2">
                  Avec 10 objets réels (graines ou cailloux), faire deux tas et dire chaque phrase à voix haute :
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center font-bold text-sm text-[#1F2A44]">
                  <div className="bg-slate-50 border border-[#C9D6E6] p-2 rounded-xl">10 = 1 + 9</div>
                  <div className="bg-slate-50 border border-[#C9D6E6] p-2 rounded-xl">10 = 2 + 8</div>
                  <div className="bg-slate-50 border border-[#C9D6E6] p-2 rounded-xl">10 = 3 + 7</div>
                  <div className="bg-slate-50 border border-[#C9D6E6] p-2 rounded-xl">10 = 4 + 6</div>
                  <div className="bg-slate-50 border border-[#C9D6E6] p-2 rounded-xl">10 = 5 + 5</div>
                  <div className="bg-amber-100 border border-[#F2B632] p-2 rounded-xl text-[#C8372D]">Les amis de 10 !</div>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 5 : SEMAINE 3 ================= */}
          {currentSection.id === 'semaine3' && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-['Fredoka',sans-serif] text-2xl font-black text-[#1F2A44]">
                  Semaine 3
                </h2>
                <span className="bg-[#F2B632] text-[#1F2A44] font-black rounded-lg px-2.5 py-0.5 text-xs">
                  Mots et compléter à 10
                </span>
              </div>

              <div className="bg-white border-2 border-[#1F2A44] rounded-2xl p-4 mb-4 shadow-xs">
                <h3 className="font-['Fredoka',sans-serif] text-base font-black text-[#1F2A44] mb-1">
                  Lire : les mots
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-[#1F2A44]">
                  <li>Lire des mots simples de 2 syllabes : <b>lune, rata, sapin, bateau</b>.</li>
                  <li>Relier chaque mot à une image ou un dessin.</li>
                  <li>Lire une petite comptine chaque jour, en suivant avec le doigt sous chaque mot.</li>
                </ul>
              </div>

              {/* Méthode chinoise du compléter à 10 */}
              <div className="bg-white border-2 border-[#C8372D] rounded-2xl p-4 mb-4 shadow-xs">
                <h3 className="font-['Fredoka',sans-serif] text-base font-black text-[#C8372D] mb-1">
                  Compter : jusqu’à 20 (Méthode chinoise du « compléter à 10 »)
                </h3>
                <p className="text-xs text-[#52607C] mb-3">
                  Pour additionner sans compter sur ses doigts un par un, on complète d'abord la première dizaine :
                </p>

                {/* Sélecteur d'exemple */}
                <div className="flex flex-wrap gap-2 justify-center mb-3">
                  {additionExamples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setAdditionExampleIndex(i);
                        sound.playPop();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#1F2A44] transition-all cursor-pointer ${
                        additionExampleIndex === i 
                          ? 'bg-[#1F2A44] text-white shadow-xs' 
                          : 'bg-white hover:bg-slate-100 text-[#1F2A44]'
                      }`}
                    >
                      {ex.text}
                    </button>
                  ))}
                </div>

                {/* Démonstration visuelle de l'exemple choisi */}
                {(() => {
                  const curr = additionExamples[additionExampleIndex];
                  return (
                    <div className="bg-amber-50/80 border-2 border-[#F2B632] rounded-xl p-3 text-center">
                      <div className="font-['Fredoka',sans-serif] text-2xl font-black text-[#1F2A44] mb-2">
                        {curr.a} + {curr.b} = <span className="text-[#C8372D]">{curr.total}</span>
                      </div>

                      <div className="flex flex-col gap-1.5 text-xs sm:text-sm text-[#1F2A44] font-medium text-left max-w-sm mx-auto">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#1F2A44] text-white font-bold flex items-center justify-center text-xs">1</span>
                          <span>Prendre <b>{curr.a}</b> jetons dans le cadre de 10.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#F2B632] text-[#1F2A44] font-bold flex items-center justify-center text-xs">2</span>
                          <span>Ajouter <b>{curr.compA}</b> jetons pour faire <b>10</b> ({curr.a} + {curr.compA} = 10).</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#C8372D] text-white font-bold flex items-center justify-center text-xs">3</span>
                          <span>Ajouter les <b>{curr.restB}</b> jetons restants : 10 + {curr.restB} = <b>{curr.total}</b> !</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          speakText(`${curr.a} plus ${curr.b}. On fait d'abord ${curr.a} plus ${curr.compA} égale 10. Puis 10 plus ${curr.restB} égale ${curr.total}.`);
                        }}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#1F2A44] rounded-lg text-xs font-black text-[#1F2A44] hover:bg-slate-50 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#C8372D]" />
                        <span>Écouter la décomposition</span>
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ================= SECTION 6 : SEMAINE 4 ================= */}
          {currentSection.id === 'semaine4' && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-['Fredoka',sans-serif] text-2xl font-black text-[#1F2A44]">
                  Semaine 4
                </h2>
                <span className="bg-[#F2B632] text-[#1F2A44] font-black rounded-lg px-2.5 py-0.5 text-xs">
                  Phrases et retrait
                </span>
              </div>

              <div className="bg-white border-2 border-[#1F2A44] rounded-2xl p-4 mb-4 shadow-xs">
                <h3 className="font-['Fredoka',sans-serif] text-base font-black text-[#1F2A44] mb-1">
                  Lire : les phrases
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-[#1F2A44]">
                  <li>Lire de courtes phrases : « <b>Papa a une belle moto.</b> »</li>
                  <li>Lire à voix haute chaque jour, 10 minutes, toujours au même moment calme.</li>
                  <li>L’enfant lit une phrase, l’adulte lit la suivante avec bienveillance.</li>
                </ul>
              </div>

              {/* Compter : Soustraire par la dizaine */}
              <div className="bg-white border-2 border-[#C8372D] rounded-2xl p-4 mb-4 shadow-xs">
                <h3 className="font-['Fredoka',sans-serif] text-base font-black text-[#C8372D] mb-1">
                  Compter : soustraire par passage à la dizaine
                </h3>
                <div className="bg-amber-50 border-2 border-[#F2B632] rounded-xl p-3 my-2 text-center">
                  <span className="font-['Fredoka',sans-serif] text-xl font-black text-[#1F2A44]">
                    13 − 5 → 13 − 3 = 10, puis 10 − 2 = <span className="text-[#C8372D]">8</span>
                  </span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-[#52607C]">
                  <li>On retire d'abord les unités pour arriver à 10.</li>
                  <li>Puis on retire le reste sur les 10 jetons du cadre.</li>
                  <li>Faire un petit jeu de calcul mental de 5 questions faciles, sans pression.</li>
                </ul>
              </div>

              {/* Table de 2 chantée */}
              <div className="bg-white border-2 border-[#1F2A44] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-['Fredoka',sans-serif] text-base font-black text-[#1F2A44]">
                    Chanter la table de 2 :
                  </h3>
                  <button
                    onClick={() => {
                      speakText("2, 4, 6, 8, 10, 12, 14, 16, 18, 20 ! Bravo !", { rate: 0.8 });
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#C8372D] hover:underline"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Réciter la table</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {tableDeDeux.map((n, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        sound.playPop(400 + i * 40);
                        speakText(String(n));
                      }}
                      className="w-10 h-10 rounded-xl bg-slate-50 border-2 border-[#1F2A44] font-['Fredoka',sans-serif] font-black text-sm text-[#1F2A44] hover:bg-[#F2B632] transition active:scale-95 cursor-pointer"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 7 : ÉCRIRE AU DOIGT ================= */}
          {currentSection.id === 'ecrire' && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-['Fredoka',sans-serif] text-2xl font-black text-[#1F2A44]">
                  Écrire au doigt
                </h2>
                <span className="bg-[#F2B632] text-[#1F2A44] font-black rounded-lg px-2.5 py-0.5 text-xs">
                  Atelier tracé
                </span>
              </div>
              <p className="text-xs text-[#52607C] mb-3">
                Choisissez une lettre ou un chiffre. L’enfant repasse sur le modèle avec son doigt ou le stylet, lentement, en disant le son à voix haute.
              </p>

              {/* Sélection des lettres et chiffres */}
              <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                {lettersAndDigits.map(char => (
                  <button
                    key={char}
                    onClick={() => {
                      setSelectedLetterToTrace(char);
                      sound.playPop();
                      speakText(char);
                    }}
                    className={`w-9 h-9 rounded-xl font-['Fredoka',sans-serif] text-lg font-black border-2 border-[#1F2A44] transition-all cursor-pointer ${
                      selectedLetterToTrace === char 
                        ? 'bg-[#C8372D] text-white shadow-xs scale-105' 
                        : 'bg-white hover:bg-slate-100 text-[#1F2A44]'
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>

              {/* Zone Canvas tactile 320x320 */}
              <div className="relative flex justify-center mb-3">
                <canvas
                  ref={canvasRef}
                  width={320}
                  height={320}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  className="bg-white border-2 border-[#1F2A44] rounded-2xl shadow-sm touch-none cursor-crosshair"
                />
              </div>

              {/* Boutons d'action canvas */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    sound.playPop();
                    drawGuideOnCanvas();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border-2 border-[#1F2A44] text-[#1F2A44] font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Effacer mon tracé</span>
                </button>

                <button
                  onClick={() => {
                    sound.playSuccess();
                    sound.playStarReward();
                    onAwardStars(1);
                    speakText(`Très bien écrit ! Bravo pour le ${selectedLetterToTrace} !`);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D5B] text-white font-black text-xs hover:bg-emerald-700 active:scale-95 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Valider (+1 ⭐)</span>
                </button>
              </div>

              <div className="mt-4 bg-white border-2 border-[#1F2A44] rounded-2xl p-3 text-xs sm:text-sm text-[#1F2A44]">
                <b>💡 Conseil :</b> faire d’abord le geste en l’air avec le bras entier, puis sur l’écran tactile, puis enfin sur le cahier avec le crayon.
              </div>
            </div>
          )}

          {/* ================= SECTION 8 : LE CONTE INTERACTIF ================= */}
          {currentSection.id === 'conte' && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-['Fredoka',sans-serif] text-2xl font-black text-[#1F2A44]">
                  Le hibou et les étoiles
                </h2>
                <span className="bg-[#F2B632] text-[#1F2A44] font-black rounded-lg px-2.5 py-0.5 text-xs">
                  Histoire du soir
                </span>
              </div>

              {/* Mascotte hibou animée */}
              <div className="flex flex-col items-center justify-center my-3">
                <div className={`text-6xl select-none transition-transform duration-300 ${isOwlTalking ? 'animate-bounce scale-110' : ''}`}>
                  🦉
                </div>
                <span className="text-xs font-bold text-[#52607C] mt-1">Maître Hibou</span>
              </div>

              {/* Bouton de lecture intégrale */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={handlePlayStory}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8372D] text-white font-['Fredoka',sans-serif] font-black text-sm sm:text-base shadow-md hover:bg-rose-700 active:scale-95 transition cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>{isOwlTalking ? 'Écoute de l’histoire en cours...' : 'Écouter l’histoire complète'}</span>
                </button>
              </div>

              {/* Cartes des phrases avec surbrillance .s.now */}
              <div className="space-y-2 mb-4">
                {storySentences.map((sentence, idx) => {
                  const isCurrent = activeStorySentenceIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => handlePlaySentence(idx)}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer text-sm sm:text-base font-medium flex items-center justify-between gap-3 ${
                        isCurrent 
                          ? 'bg-[#F2B632] text-[#1F2A44] border-[#1F2A44] shadow-md font-bold scale-101' 
                          : 'bg-white border-[#C9D6E6] text-[#1F2A44] hover:border-[#1F2A44]'
                      }`}
                    >
                      <span>{sentence}</span>
                      <Volume2 className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-[#1F2A44]' : 'text-slate-400'}`} />
                    </div>
                  );
                })}
              </div>

              <div className="text-center text-xs text-[#52607C] italic">
                Touchez n'importe quelle phrase pour la réécouter à voix haute.
              </div>
            </div>
          )}

          {/* ================= SECTION 9 : AU MARCHÉ (FCFA) ================= */}
          {currentSection.id === 'marche' && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-['Fredoka',sans-serif] text-2xl font-black text-[#1F2A44]">
                  Au marché
                </h2>
                <span className="bg-[#F2B632] text-[#1F2A44] font-black rounded-lg px-2.5 py-0.5 text-xs">
                  Calcul de monnaie en FCFA
                </span>
              </div>
              <p className="text-xs text-[#52607C] mb-3">
                Tu donnes une pièce de <b>100 FCFA</b> pour acheter ton article. Combien de francs CFA la marchande doit-elle te rendre ?
              </p>

              {/* État de l'article en cours */}
              <div className="bg-white border-2 border-[#1F2A44] rounded-2xl p-5 shadow-xs mb-4 text-center">
                <div className="text-6xl mb-2">{currentItem.icon}</div>
                <h3 className="font-['Fredoka',sans-serif] text-xl font-black text-[#1F2A44]">
                  {currentItem.name}
                </h3>
                <div className="inline-block bg-amber-100 text-[#C8372D] font-black text-sm px-3 py-1 rounded-full border border-[#F2B632] mt-1 mb-3">
                  Prix : {currentItem.price} FCFA
                </div>

                {/* Situation */}
                <div className="bg-slate-50 border border-[#C9D6E6] rounded-xl p-3 max-w-sm mx-auto text-sm text-[#1F2A44] font-medium mb-4">
                  🪙 Tu donnes : <b>100 FCFA</b><br />
                  💰 Monnaie à rendre = <b>100 − {currentItem.price}</b>
                </div>

                {/* Boutons d'options de monnaie */}
                <div className="flex justify-center gap-3">
                  {currentItem.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleChooseMarketChange(opt)}
                      className="px-4 py-2.5 rounded-xl bg-white border-2 border-[#1F2A44] hover:bg-[#F2B632] hover:border-[#1F2A44] font-['Fredoka',sans-serif] text-base font-black text-[#1F2A44] transition active:scale-95 cursor-pointer shadow-xs"
                    >
                      {opt} FCFA
                    </button>
                  ))}
                </div>

                {/* Message de feedback */}
                {marketFeedback && (
                  <div className="mt-4 p-2.5 rounded-xl bg-amber-50 border border-[#F2B632] text-xs sm:text-sm font-bold text-[#1F2A44] animate-fadeIn">
                    {marketFeedback}
                  </div>
                )}
              </div>

              {/* Sélecteur d'articles du marché */}
              <div className="flex justify-center gap-2">
                {marketItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentMarketIndex(idx);
                      setMarketFeedback(null);
                      sound.playPop();
                    }}
                    className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center border-2 transition cursor-pointer relative ${
                      currentMarketIndex === idx 
                        ? 'border-[#C8372D] bg-rose-50 shadow-xs' 
                        : 'border-[#C9D6E6] bg-white hover:border-[#1F2A44]'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {marketAnswered[idx] && (
                      <span className="absolute -top-1 -right-1 text-xs">⭐</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 10 : MOTS MYSTÈRES ================= */}
          {currentSection.id === 'mots' && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-['Fredoka',sans-serif] text-2xl font-black text-[#1F2A44]">
                  Mots mystères
                </h2>
                <span className="bg-[#F2B632] text-[#1F2A44] font-black rounded-lg px-2.5 py-0.5 text-xs">
                  Puzzle syllabique
                </span>
              </div>
              <p className="text-xs text-[#52607C] mb-3">
                Touche les syllabes dans le bon ordre pour reconstituer le mot secret illustré !
              </p>

              <div className="bg-white border-2 border-[#1F2A44] rounded-2xl p-5 shadow-xs mb-4 text-center">
                {/* Indice visuel */}
                <div className="text-6xl mb-2">{targetWord.emoji}</div>
                <div className="text-xs text-[#52607C] font-semibold mb-3">
                  Indice : {targetWord.hint}
                </div>

                {/* Zone de construction du mot */}
                <div className="min-h-[56px] border-2 border-dashed border-[#1F2A44] rounded-xl p-2 flex items-center justify-center gap-2 mb-4 bg-slate-50">
                  {selectedSyllables.length === 0 ? (
                    <span className="text-xs text-slate-400 font-bold">Touche les syllabes ci-dessous...</span>
                  ) : (
                    selectedSyllables.map((syl, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1.5 bg-[#1F2A44] text-white font-['Fredoka',sans-serif] text-xl font-black rounded-lg animate-bounce"
                      >
                        {syl}
                      </span>
                    ))
                  )}
                </div>

                {/* Syllabes proposées dans le désordre */}
                <div className="flex flex-wrap gap-2.5 justify-center mb-4">
                  {shuffledSyllables.map((syl, i) => (
                    <button
                      key={i}
                      onClick={() => handlePickSyllable(syl, i)}
                      className="px-4 py-2 bg-white border-2 border-[#1F2A44] hover:bg-[#F2B632] rounded-xl font-['Fredoka',sans-serif] text-xl font-black text-[#1F2A44] transition active:scale-95 cursor-pointer shadow-xs"
                    >
                      {syl}
                    </button>
                  ))}
                </div>

                {/* Bouton pour réinitialiser le mot */}
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedSyllables([]);
                      setWordFeedback(null);
                      sound.playPop();
                    }}
                    className="flex items-center gap-1 text-xs text-[#52607C] hover:text-[#C8372D] font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recommencer ce mot</span>
                  </button>
                </div>

                {/* Feedback */}
                {wordFeedback === 'success' && (
                  <div className="mt-3 p-2 bg-emerald-100 border border-emerald-400 rounded-xl text-emerald-800 font-black text-sm flex items-center justify-center gap-1.5 animate-bounce">
                    <Check className="w-4 h-4" />
                    <span>Bravo ! Tu as trouvé : « {targetWord.word} » ! (+1 ⭐)</span>
                  </div>
                )}
              </div>

              {/* Navigation entre mots */}
              <div className="flex justify-center gap-2">
                {mysteryWords.map((w, idx) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setMysteryWordIndex(idx);
                      sound.playPop();
                    }}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border-2 transition cursor-pointer ${
                      mysteryWordIndex === idx 
                        ? 'border-[#C8372D] bg-rose-50' 
                        : 'border-[#C9D6E6] bg-white hover:border-[#1F2A44]'
                    }`}
                  >
                    {w.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 11 : FICHE DE SUIVI ================= */}
          {currentSection.id === 'suivi' && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-['Fredoka',sans-serif] text-2xl font-black text-[#1F2A44]">
                  Fiche de suivi
                </h2>
                <span className="bg-[#F2B632] text-[#1F2A44] font-black rounded-lg px-2.5 py-0.5 text-xs">
                  20 séances (4 semaines)
                </span>
              </div>
              <p className="text-xs text-[#52607C] mb-3">
                Cochez chaque séance de 20 minutes réalisée avec votre enfant ({activeProfile.name}). 5 séances par semaine.
              </p>

              {/* Compteur d'accomplissement */}
              <div className="bg-white border-2 border-[#1F2A44] rounded-2xl p-4 shadow-xs mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm text-[#1F2A44]">Progression totale :</span>
                  <span className="font-black text-sm text-[#C8372D]">{completedSessionsCount} / 20 séances ({Math.round((completedSessionsCount / 20) * 100)}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full border border-[#C9D6E6] overflow-hidden">
                  <div 
                    className="h-full bg-[#2E7D5B] transition-all duration-300"
                    style={{ width: `${(completedSessionsCount / 20) * 100}%` }}
                  />
                </div>
              </div>

              {/* Les 4 semaines x 5 séances */}
              <div className="space-y-3 mb-4">
                {[1, 2, 3, 4].map(weekNum => {
                  const startIdx = (weekNum - 1) * 5;
                  const weekLabels = [
                    'Sons & nombres 1-10',
                    'Syllabes & décomposition',
                    'Mots & compléter à 10',
                    'Phrases & soustraction'
                  ];

                  return (
                    <div key={weekNum} className="bg-white border-2 border-[#1F2A44] rounded-2xl p-3.5 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-['Fredoka',sans-serif] text-sm font-black text-[#1F2A44]">
                          Semaine {weekNum} : {weekLabels[weekNum - 1]}
                        </h4>
                        <span className="text-[11px] font-bold text-[#52607C]">5 séances</span>
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        {[0, 1, 2, 3, 4].map(dayOffset => {
                          const sessionIndex = startIdx + dayOffset;
                          const isDone = checkedSessions[sessionIndex];

                          return (
                            <button
                              key={dayOffset}
                              onClick={() => toggleSessionCheck(sessionIndex)}
                              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 transition active:scale-95 cursor-pointer ${
                                isDone 
                                  ? 'bg-[#2E7D5B] border-[#2E7D5B] text-white' 
                                  : 'bg-slate-50 border-[#C9D6E6] hover:border-[#1F2A44] text-[#1F2A44]'
                              }`}
                            >
                              <span className="text-xs font-black">J{dayOffset + 1}</span>
                              <div className="mt-1">
                                {isDone ? (
                                  <Check className="w-4 h-4 stroke-[3]" />
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border border-[#52607C]" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trophée si complété */}
              {completedSessionsCount === 20 && (
                <div className="bg-amber-100 border-2 border-[#F2B632] rounded-2xl p-4 text-center animate-bounce">
                  <div className="text-4xl mb-1">🏆</div>
                  <h4 className="font-['Fredoka',sans-serif] text-lg font-black text-[#1F2A44]">
                    Félicitations chaleureuses !
                  </h4>
                  <p className="text-xs text-[#52607C]">
                    Le programme de 4 semaines est terminé. Votre enfant a acquis des bases solides pour toute sa scolarité !
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Barre de navigation inférieure fixe (Bottom Nav) */}
      <nav className="fixed left-0 right-0 bottom-0 bg-[#F2F6FB] border-t border-[#C9D6E6] px-4 py-3 z-30 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          {/* Bouton Précédent */}
          <button
            onClick={handlePrevSection}
            disabled={currentSectionIndex === 0}
            className={`flex-1 min-h-[46px] rounded-xl border-2 border-[#1F2A44] font-['Fredoka',sans-serif] font-bold text-sm flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer ${
              currentSectionIndex === 0 
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-300' 
                : 'bg-white text-[#1F2A44] hover:bg-slate-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>

          {/* Menu de saut rapide d'étape */}
          <select
            value={currentSectionIndex}
            onChange={(e) => {
              sound.playPop();
              setCurrentSectionIndex(Number(e.target.value));
            }}
            className="hidden sm:block px-3 py-2.5 rounded-xl border-2 border-[#1F2A44] bg-white text-xs font-bold text-[#1F2A44] cursor-pointer"
          >
            {SECTIONS.map((sec, idx) => (
              <option key={sec.id} value={idx}>
                {idx + 1}. {sec.title}
              </option>
            ))}
          </select>

          {/* Bouton Suivant ou Terminer */}
          {currentSectionIndex < SECTIONS.length - 1 ? (
            <button
              onClick={handleNextSection}
              className="flex-1 min-h-[46px] rounded-xl bg-[#C8372D] border-2 border-[#C8372D] text-white font-['Fredoka',sans-serif] font-black text-sm flex items-center justify-center gap-1.5 shadow-md hover:bg-rose-700 active:scale-95 transition cursor-pointer"
            >
              <span>Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playSuccess();
                onClose();
              }}
              className="flex-1 min-h-[46px] rounded-xl bg-[#2E7D5B] border-2 border-[#2E7D5B] text-white font-['Fredoka',sans-serif] font-black text-sm flex items-center justify-center gap-1.5 shadow-md hover:bg-emerald-700 active:scale-95 transition cursor-pointer"
            >
              <span>Terminer le module</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};
