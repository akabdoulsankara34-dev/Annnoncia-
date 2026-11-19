import React, { useState, useEffect, useRef } from 'react';
import { ChildProfile } from '../types/book';
import { sound, speakText, stopSpeaking } from '../utils/audio';
import { X, Volume2, Sparkles, Star, Grid, Layers, Trophy, RotateCcw, BookOpen, CheckCircle2 } from 'lucide-react';

interface SyllableFusionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: ChildProfile;
  onAwardStars: (count: number) => void;
}

interface ConsonantItem {
  char: string;
  soundHint: string;
  level: 1 | 2 | 3;
}

interface VowelItem {
  char: string;
  soundHint: string;
  compound?: boolean;
}

const CONSONANTS: ConsonantItem[] = [
  { char: 'm', soundHint: 'mmm', level: 1 },
  { char: 'l', soundHint: 'lll', level: 1 },
  { char: 'r', soundHint: 'rrr', level: 1 },
  { char: 's', soundHint: 'sss', level: 1 },
  { char: 'p', soundHint: 'peu', level: 2 },
  { char: 't', soundHint: 'teu', level: 2 },
  { char: 'b', soundHint: 'beu', level: 2 },
  { char: 'd', soundHint: 'deu', level: 2 },
  { char: 'n', soundHint: 'nnn', level: 3 },
  { char: 'f', soundHint: 'fff', level: 3 },
  { char: 'v', soundHint: 'vvv', level: 3 },
  { char: 'k', soundHint: 'keu', level: 3 },
  { char: 'j', soundHint: 'jjj', level: 3 },
  { char: 'z', soundHint: 'zzz', level: 3 },
];

const VOWELS: VowelItem[] = [
  { char: 'a', soundHint: 'a' },
  { char: 'e', soundHint: 'eu' },
  { char: 'i', soundHint: 'i' },
  { char: 'o', soundHint: 'o' },
  { char: 'u', soundHint: 'u' },
  { char: 'é', soundHint: 'hé' },
  { char: 'è', soundHint: 'haie' },
  { char: 'ou', soundHint: 'ou', compound: true },
  { char: 'on', soundHint: 'on', compound: true },
  { char: 'an', soundHint: 'an', compound: true },
  { char: 'oi', soundHint: 'oi', compound: true },
];

const SIMPLE_VOWELS = VOWELS.filter(v => !v.compound).map(v => v.char);
const COMPOUND_VOWELS = VOWELS.filter(v => v.compound).map(v => v.char);

const SYLLABLE_EXAMPLES: Record<string, { word: string; emoji: string }> = {
  ma: { word: 'mangue', emoji: '🥭' },
  mi: { word: 'miel', emoji: '🍯' },
  mo: { word: 'moto', emoji: '🏍️' },
  mu: { word: 'mur', emoji: '🧱' },
  mou: { word: 'mouton', emoji: '🐑' },
  mon: { word: 'montagne', emoji: '⛰️' },
  man: { word: 'maman', emoji: '👩' },
  moi: { word: 'moineau', emoji: '🐦' },
  la: { word: 'lapin', emoji: '🐇' },
  li: { word: 'livre', emoji: '📖' },
  lo: { word: 'locomotive', emoji: '🚂' },
  lu: { word: 'lune', emoji: '🌙' },
  lou: { word: 'loup', emoji: '🐺' },
  loi: { word: 'étoile', emoji: '⭐' },
  ra: { word: 'radis', emoji: '🌱' },
  ri: { word: 'riz', emoji: '🍚' },
  ro: { word: 'rose', emoji: '🌹' },
  ru: { word: 'ruche', emoji: '🐝' },
  rou: { word: 'roue', emoji: '🛞' },
  roi: { word: 'roi', emoji: '👑' },
  sa: { word: 'sapin', emoji: '🌲' },
  si: { word: 'sirène', emoji: '🧜‍♀️' },
  so: { word: 'soleil', emoji: '☀️' },
  su: { word: 'sucre', emoji: '🍬' },
  sou: { word: 'souris', emoji: '🐭' },
  pa: { word: 'papa', emoji: '👨' },
  pi: { word: 'piment', emoji: '🌶️' },
  po: { word: 'pomme', emoji: '🍎' },
  pu: { word: 'puce', emoji: '🐞' },
  pou: { word: 'poussin', emoji: '🐥' },
  pon: { word: 'pont', emoji: '🌉' },
  poi: { word: 'poisson', emoji: '🐟' },
  ta: { word: 'tasse', emoji: '☕' },
  ti: { word: 'tigre', emoji: '🐯' },
  to: { word: 'tomate', emoji: '🍅' },
  tu: { word: 'tulipe', emoji: '🌷' },
  tou: { word: 'toupie', emoji: '🪀' },
  ba: { word: 'banane', emoji: '🍌' },
  bé: { word: 'bébé', emoji: '👶' },
  bi: { word: 'bille', emoji: '🔵' },
  bo: { word: 'bonnet', emoji: '🧢' },
  bu: { word: 'bus', emoji: '🚌' },
  bou: { word: 'bougie', emoji: '🕯️' },
  bon: { word: 'bonbon', emoji: '🍬' },
  ban: { word: 'banc', emoji: '🪑' },
  boi: { word: 'bois', emoji: '🪵' },
  da: { word: 'dattes', emoji: '🌴' },
  di: { word: 'dindon', emoji: '🦃' },
  do: { word: 'domino', emoji: '🎲' },
  du: { word: 'dune', emoji: '🏜️' },
  dou: { word: 'doudou', emoji: '🧸' },
  na: { word: 'navire', emoji: '🚢' },
  ni: { word: 'nid', emoji: '🪺' },
  no: { word: 'noix', emoji: '🥥' },
  nu: { word: 'nuage', emoji: '☁️' },
  nou: { word: 'nounours', emoji: '🐻' },
  fa: { word: 'farine', emoji: '🌾' },
  fi: { word: 'figue', emoji: '🫐' },
  fo: { word: 'forêt', emoji: '🌳' },
  fu: { word: 'fusée', emoji: '🚀' },
  fou: { word: 'fourmi', emoji: '🐜' },
  va: { word: 'vache', emoji: '🐄' },
  vé: { word: 'vélo', emoji: '🚲' },
  vi: { word: 'violon', emoji: '🎻' },
  vo: { word: 'voiture', emoji: '🚗' },
  voi: { word: 'voile', emoji: '⛵' },
  ka: { word: 'karité', emoji: '🌰' },
  ki: { word: 'kiwi', emoji: '🥝' },
  ko: { word: 'koala', emoji: '🐨' },
  ja: { word: 'jardin', emoji: '🌻' },
  ju: { word: 'jus', emoji: '🧃' },
  jou: { word: 'jouet', emoji: '🧸' },
  za: { word: 'zèbre', emoji: '🦓' },
  zè: { word: 'zèbre', emoji: '🦓' },
  zo: { word: 'zoo', emoji: '🦁' },
};

const CHALLENGE_POOL = [
  { c: 'm', v: 'a' },
  { c: 'l', v: 'u' },
  { c: 'b', v: 'a' },
  { c: 't', v: 'o' },
  { c: 'p', v: 'a' },
  { c: 's', v: 'o' },
  { c: 'r', v: 'i' },
  { c: 'v', v: 'é' },
  { c: 'm', v: 'o' },
  { c: 'n', v: 'i' },
  { c: 'f', v: 'u' },
  { c: 'd', v: 'o' },
];

/**
 * Adapte certaines graphies pour obtenir une prononciation syllabique fidèle en synthèse vocale française.
 */
function getSyllableTtsText(c: string, v: string): string {
  const syl = `${c}${v}`;
  const overrides: Record<string, string> = {
    ke: 'que',
    ké: 'qué',
    kè: 'quais',
    kou: 'cou',
    kon: 'con',
    kan: 'can',
    koi: 'coi',
    jè: 'jais',
  };
  return overrides[syl] || syl;
}

export const SyllableFusionModal: React.FC<SyllableFusionModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onAwardStars,
}) => {
  const [tab, setTab] = useState<'fusion' | 'grid' | 'challenge'>('fusion');

  // Apprentissage étape par étape : l'enfant touche d'abord la consonne, puis la voyelle
  const [selectedConsonant, setSelectedConsonant] = useState<string | null>(null);
  const [selectedVowel, setSelectedVowel] = useState<string | null>(null);
  const [gridConsonant, setGridConsonant] = useState<string>('m');
  const [showCompoundVowels, setShowCompoundVowels] = useState<boolean>(false);
  const [learningLevel, setLearningLevel] = useState<'all' | 1 | 2 | 3>('all');
  const [slowAutoRead, setSlowAutoRead] = useState<boolean>(false);

  const [isFusingAnim, setIsFusingAnim] = useState<boolean>(false);
  const [isSpeakingSyllable, setIsSpeakingSyllable] = useState<boolean>(false);
  const [learnedSyllables, setLearnedSyllables] = useState<string[]>([]);
  const [starBanner, setStarBanner] = useState<boolean>(false);

  // État Défi Audio
  const [challengeTarget, setChallengeTarget] = useState(() => CHALLENGE_POOL[0]);
  const [challengeConsonant, setChallengeConsonant] = useState<string | null>(null);
  const [challengeVowel, setChallengeVowel] = useState<string | null>(null);
  const [challengeFeedback, setChallengeFeedback] = useState<'success' | 'error' | null>(null);
  const [challengeScore, setChallengeScore] = useState(0);

  const speakingTimerRef = useRef<number | null>(null);
  const starBannerTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      setIsSpeakingSyllable(false);
    }
    return () => {
      if (speakingTimerRef.current) window.clearTimeout(speakingTimerRef.current);
      if (starBannerTimerRef.current) window.clearTimeout(starBannerTimerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const activeVowels = showCompoundVowels
    ? VOWELS
    : VOWELS.filter(v => !v.compound);

  const visibleConsonants = learningLevel === 'all'
    ? CONSONANTS
    : CONSONANTS.filter(c => c.level === learningLevel);

  const fusedSyllable =
    selectedConsonant && selectedVowel ? `${selectedConsonant}${selectedVowel}` : null;
  const example = fusedSyllable ? SYLLABLE_EXAMPLES[fusedSyllable] : undefined;

  const speakWithIndicator = (text: string, rate = 0.8) => {
    if (speakingTimerRef.current) window.clearTimeout(speakingTimerRef.current);
    setIsSpeakingSyllable(true);
    const started = speakText(text, {
      rate,
      pitch: 1.15,
      force: true,
      onStart: () => setIsSpeakingSyllable(true),
      onEnd: () => setIsSpeakingSyllable(false),
    });
    // Sécurité si le navigateur ne déclenche pas onEnd
    speakingTimerRef.current = window.setTimeout(() => {
      setIsSpeakingSyllable(false);
    }, started ? 2800 : 400);
  };

  const triggerFusion = (c: string, v: string, decomposeSlow = slowAutoRead) => {
    const syl = `${c}${v}`;
    const ttsSyl = getSyllableTtsText(c, v);

    setIsFusingAnim(true);
    window.setTimeout(() => setIsFusingAnim(false), 450);

    // Enregistrer la syllabe apprise et récompenser tous les 5 nouvelles syllabes
    setLearnedSyllables(prev => {
      const isNew = !prev.includes(syl);
      const updated = [syl, ...prev.filter(s => s !== syl)].slice(0, 24);
      if (isNew && updated.length > 0 && updated.length % 5 === 0) {
        sound.playStarReward();
        onAwardStars(1);
        setStarBanner(true);
        if (starBannerTimerRef.current) window.clearTimeout(starBannerTimerRef.current);
        starBannerTimerRef.current = window.setTimeout(() => setStarBanner(false), 3200);
      } else {
        sound.playSuccess();
      }
      return updated;
    });

    if (decomposeSlow) {
      const cMeta = CONSONANTS.find(item => item.char === c);
      const vMeta = VOWELS.find(item => item.char === v);
      speakWithIndicator(`${cMeta?.soundHint || c}… ${vMeta?.soundHint || v}… ${ttsSyl} !`, 0.76);
    } else {
      speakWithIndicator(`${ttsSyl} !`, 0.78);
    }
  };

  const handleSelectConsonant = (item: ConsonantItem) => {
    sound.playPop(480);
    setGridConsonant(item.char);

    if (selectedConsonant && selectedVowel) {
      // Une syllabe était déjà formée : on démarre une nouvelle fusion avec cette consonne
      setSelectedConsonant(item.char);
      setSelectedVowel(null);
      setIsSpeakingSyllable(false);
      speakText(item.soundHint, { rate: 0.82, pitch: 1.15, force: true });
      return;
    }

    setSelectedConsonant(item.char);

    if (selectedVowel) {
      // La voyelle avait été choisie en premier : on forme la syllabe tout de suite !
      triggerFusion(item.char, selectedVowel);
    } else {
      speakText(item.soundHint, { rate: 0.82, pitch: 1.15, force: true });
    }
  };

  const handleSelectVowel = (item: VowelItem) => {
    sound.playPop(560);
    setSelectedVowel(item.char);

    if (selectedConsonant) {
      // Consonne + voyelle sélectionnées -> la syllabe se forme et l'enfant l'écoute !
      triggerFusion(selectedConsonant, item.char);
    } else {
      speakText(item.soundHint, { rate: 0.82, pitch: 1.15, force: true });
    }
  };

  const handleResetFusion = () => {
    sound.playPop(420);
    stopSpeaking();
    setSelectedConsonant(null);
    setSelectedVowel(null);
    setIsSpeakingSyllable(false);
  };

  const handlePlayFamily = () => {
    const family = activeVowels
      .slice(0, 5)
      .map(v => getSyllableTtsText(gridConsonant, v.char))
      .join(', ');
    sound.playPop(540);
    speakText(`La famille de ${gridConsonant} : ${family}`, { rate: 0.78, force: true });
  };

  // Logique du Défi Fusion
  const nextChallenge = () => {
    const nextItem = CHALLENGE_POOL[Math.floor(Math.random() * CHALLENGE_POOL.length)];
    setChallengeTarget(nextItem);
    setChallengeConsonant(null);
    setChallengeVowel(null);
    setChallengeFeedback(null);
    const targetSyl = getSyllableTtsText(nextItem.c, nextItem.v);
    speakText(`Fabrique la syllabe : ${targetSyl} !`, { rate: 0.82, force: true });
  };

  const checkChallengeResult = (c: string | null, v: string | null) => {
    if (!c || !v) return;
    const built = `${c}${v}`;
    const expected = `${challengeTarget.c}${challengeTarget.v}`;
    const builtTts = getSyllableTtsText(c, v);
    const expectedTts = getSyllableTtsText(challengeTarget.c, challengeTarget.v);

    if (built === expected) {
      setChallengeFeedback('success');
      setChallengeScore(prev => prev + 1);
      sound.playSuccess();
      sound.playStarReward();
      onAwardStars(1);
      speakText(`Bravo ! ${c} et ${v} font bien ${expectedTts} ! Tu gagnes une étoile !`, { force: true });
    } else {
      setChallengeFeedback('error');
      sound.playGentleEncouragement();
      speakText(`Tu as fabriqué ${builtTts}. Cherche la syllabe ${expectedTts} !`, { force: true });
      setTimeout(() => {
        setChallengeConsonant(null);
        setChallengeVowel(null);
        setChallengeFeedback(null);
      }, 1300);
    }
  };

  // Message de guidage pédagogique selon l'étape en cours
  const getStepPrompt = () => {
    if (!selectedConsonant && !selectedVowel) {
      return {
        step: 1,
        text: 'Étape 1 : Touche une consonne en vert pour commencer !',
        tone: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      };
    }
    if (selectedConsonant && !selectedVowel) {
      return {
        step: 2,
        text: `Étape 2 : Maintenant, touche une voyelle pour former une syllabe avec « ${selectedConsonant} » !`,
        tone: 'bg-amber-50 border-amber-300 text-amber-950',
      };
    }
    if (!selectedConsonant && selectedVowel) {
      return {
        step: 2,
        text: `Étape 2 : Touche une consonne pour l'assembler avec « ${selectedVowel} » !`,
        tone: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      };
    }
    return {
      step: 3,
      text: `✨ Super ! « ${selectedConsonant} » + « ${selectedVowel} » forment la syllabe « ${fusedSyllable} » ! Touche-la pour réécouter.`,
      tone: 'bg-rose-50 border-rose-300 text-rose-900',
    };
  };

  const stepPrompt = getStepPrompt();
  const starsProgressInBatch = learnedSyllables.length % 5;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="w-full max-w-2xl bg-[#FAF6EE] rounded-3xl border-4 border-emerald-500 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* En-tête */}
        <header className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              🔤
            </div>
            <div>
              <h2 className="font-['Fredoka',sans-serif] text-lg sm:text-xl font-black leading-tight">
                Fusion Consonnes & Voyelles
              </h2>
              <p className="text-xs text-emerald-100 font-semibold">
                Touche une consonne puis une voyelle pour former et écouter la syllabe
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-950" />
              <span>{activeProfile.starsCount}</span>
            </div>
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Onglets de navigation */}
        <div className="bg-white border-b border-emerald-100 px-3 sm:px-4 py-2 flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => {
              sound.playPop();
              setTab('fusion');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition cursor-pointer ${
              tab === 'fusion'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Apprentissage Fusion</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setTab('grid');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition cursor-pointer ${
              tab === 'grid'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Tableau des Syllabes</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setTab('challenge');
              const targetSyl = getSyllableTtsText(challengeTarget.c, challengeTarget.v);
              speakText(`Fabrique la syllabe : ${targetSyl} !`, { rate: 0.82, force: true });
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition cursor-pointer ${
              tab === 'challenge'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Défi Syllabes ⭐</span>
          </button>
        </div>

        {/* Contenu principal */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5">
          {tab === 'fusion' && (
            <>
              {/* Barre d'apprentissage & progression vers une étoile */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-white rounded-2xl border border-emerald-200 px-3.5 py-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black text-slate-700">
                    Syllabes écoutées : <span className="text-emerald-700">{learnedSyllables.length}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5" title="Découvre 5 nouvelles syllabes pour gagner 1 étoile">
                  {[0, 1, 2, 3, 4].map(idx => (
                    <span
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full transition ${
                        idx < starsProgressInBatch || (learnedSyllables.length > 0 && starsProgressInBatch === 0 && starBanner)
                          ? 'bg-amber-400 scale-110'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-black text-amber-700 ml-1">+1 ⭐ / 5</span>
                </div>
              </div>

              {starBanner && (
                <div className="bg-gradient-to-r from-amber-300 to-yellow-300 border-2 border-amber-500 rounded-2xl px-4 py-2.5 flex items-center justify-center gap-2 text-amber-950 font-black text-sm shadow-sm animate-bounce">
                  <Star className="w-5 h-5 fill-amber-950" />
                  <span>Bravo ! 5 nouvelles syllabes apprises = +1 étoile gagnée !</span>
                </div>
              )}

              {/* Consigne interactive étape par étape */}
              <div className={`rounded-2xl border-2 px-3.5 py-2.5 text-xs sm:text-sm font-black flex items-center justify-between gap-2 transition-colors ${stepPrompt.tone}`}>
                <span>{stepPrompt.text}</span>
                {(selectedConsonant || selectedVowel) && (
                  <button
                    onClick={handleResetFusion}
                    className="shrink-0 px-2.5 py-1 rounded-xl bg-white/90 hover:bg-white border border-slate-300 text-slate-700 text-xs font-black flex items-center gap-1 cursor-pointer transition active:scale-95"
                    title="Effacer pour former une nouvelle syllabe"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Effacer</span>
                  </button>
                )}
              </div>

              {/* Zone de fusion visuelle animée */}
              <div className="bg-white rounded-3xl border-3 border-emerald-300 p-4 sm:p-5 shadow-md flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
                  {/* Case Consonne */}
                  <button
                    onClick={() => {
                      if (selectedConsonant) {
                        const cMeta = CONSONANTS.find(item => item.char === selectedConsonant);
                        sound.playPop(480);
                        speakText(cMeta?.soundHint || selectedConsonant, { rate: 0.82, pitch: 1.15, force: true });
                      }
                    }}
                    disabled={!selectedConsonant}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 flex flex-col items-center justify-center transition-all ${
                      selectedConsonant
                        ? `bg-emerald-100 border-emerald-500 shadow-xs cursor-pointer hover:scale-105 ${isFusingAnim ? 'translate-x-2' : ''}`
                        : 'bg-emerald-50/60 border-dashed border-emerald-400 animate-pulse cursor-default'
                    }`}
                    title={selectedConsonant ? `Écouter le son « ${selectedConsonant} »` : 'Choisis une consonne'}
                  >
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">Consonne</span>
                    <span className={`font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-black ${
                      selectedConsonant ? 'text-emerald-900' : 'text-emerald-400'
                    }`}>
                      {selectedConsonant || '?'}
                    </span>
                  </button>

                  <span className="text-2xl sm:text-3xl font-black text-slate-400">+</span>

                  {/* Case Voyelle */}
                  <button
                    onClick={() => {
                      if (selectedVowel) {
                        const vMeta = VOWELS.find(item => item.char === selectedVowel);
                        sound.playPop(560);
                        speakText(vMeta?.soundHint || selectedVowel, { rate: 0.82, pitch: 1.15, force: true });
                      }
                    }}
                    disabled={!selectedVowel}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 flex flex-col items-center justify-center transition-all ${
                      selectedVowel
                        ? `bg-amber-100 border-amber-400 shadow-xs cursor-pointer hover:scale-105 ${isFusingAnim ? '-translate-x-2' : ''}`
                        : selectedConsonant
                        ? 'bg-amber-50 border-dashed border-amber-400 animate-pulse cursor-default'
                        : 'bg-slate-50 border-dashed border-slate-300 cursor-default'
                    }`}
                    title={selectedVowel ? `Écouter le son « ${selectedVowel} »` : 'Choisis une voyelle'}
                  >
                    <span className="text-[10px] font-bold text-amber-800 uppercase">Voyelle</span>
                    <span className={`font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-black ${
                      selectedVowel ? 'text-amber-900' : 'text-amber-400'
                    }`}>
                      {selectedVowel || '?'}
                    </span>
                  </button>

                  <span className="text-2xl sm:text-3xl font-black text-slate-400">=</span>

                  {/* Case Résultat Syllabe Formée */}
                  {fusedSyllable && selectedConsonant && selectedVowel ? (
                    <button
                      onClick={() => triggerFusion(selectedConsonant, selectedVowel, false)}
                      className={`min-w-[100px] sm:min-w-[122px] h-20 sm:h-24 px-4 rounded-3xl bg-gradient-to-br from-rose-500 to-rose-600 text-white border-4 ${
                        isSpeakingSyllable ? 'border-amber-300 ring-4 ring-rose-300/60' : 'border-rose-200'
                      } shadow-lg flex flex-col items-center justify-center cursor-pointer transition-transform ${
                        isFusingAnim ? 'scale-115' : 'hover:scale-105 active:scale-95'
                      }`}
                      title="Touche pour réécouter la syllabe formée"
                    >
                      <span className="font-['Fredoka',sans-serif] text-4xl sm:text-5xl font-black tracking-wide leading-none">
                        {fusedSyllable}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-rose-100 flex items-center gap-1 mt-1">
                        <Volume2 className={`w-3.5 h-3.5 ${isSpeakingSyllable ? 'animate-bounce' : ''}`} />
                        {isSpeakingSyllable ? 'Écoute…' : 'Réécouter'}
                      </span>
                    </button>
                  ) : (
                    <div className="min-w-[100px] sm:min-w-[122px] h-20 sm:h-24 px-4 rounded-3xl bg-slate-100 border-3 border-dashed border-slate-300 text-slate-400 flex flex-col items-center justify-center">
                      <span className="font-['Fredoka',sans-serif] text-3xl font-black">?</span>
                      <span className="text-[10px] font-bold uppercase">Syllabe</span>
                    </div>
                  )}
                </div>

                {/* Boutons d'écoute & mot exemple dès que la syllabe est formée */}
                {fusedSyllable && selectedConsonant && selectedVowel && (
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2 w-full">
                    <button
                      onClick={() => triggerFusion(selectedConsonant, selectedVowel, false)}
                      className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-rose-700" />
                      <span>Écouter « {fusedSyllable} »</span>
                    </button>

                    <button
                      onClick={() => triggerFusion(selectedConsonant, selectedVowel, true)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-black text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>Décomposer ({selectedConsonant}… {selectedVowel}… {fusedSyllable})</span>
                    </button>

                    {example && (
                      <button
                        onClick={() =>
                          speakWithIndicator(`${getSyllableTtsText(selectedConsonant, selectedVowel)}, comme dans ${example.word}`, 0.82)
                        }
                        className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs flex items-center gap-1.5 border border-amber-300 transition cursor-pointer"
                      >
                        <span className="text-base">{example.emoji}</span>
                        <span>Comme dans « {example.word} »</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Option de lecture lors de la fusion */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 w-full flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="font-bold text-slate-500">
                    Quand la syllabe se forme :
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        sound.playPop();
                        setSlowAutoRead(false);
                      }}
                      className={`px-2.5 py-1 rounded-full font-black border transition cursor-pointer ${
                        !slowAutoRead
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      Lecture directe (ma)
                    </button>
                    <button
                      onClick={() => {
                        sound.playPop();
                        setSlowAutoRead(true);
                      }}
                      className={`px-2.5 py-1 rounded-full font-black border transition cursor-pointer ${
                        slowAutoRead
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      Pas à pas (m… a… ma)
                    </button>
                  </div>
                </div>
              </div>

              {/* Sélecteur des Consonnes */}
              <div className={`bg-white rounded-2xl border-2 p-3.5 shadow-xs transition ${
                !selectedConsonant ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-emerald-200'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                    1. Touche une consonne
                  </span>
                  <div className="flex items-center gap-1">
                    {([
                      { id: 'all', label: 'Toutes (14)' },
                      { id: 1, label: 'Niv. 1' },
                      { id: 2, label: 'Niv. 2' },
                      { id: 3, label: 'Niv. 3' },
                    ] as const).map(lvl => (
                      <button
                        key={String(lvl.id)}
                        onClick={() => {
                          sound.playPop();
                          setLearningLevel(lvl.id);
                        }}
                        className={`text-[11px] font-black px-2 py-0.5 rounded-full border transition cursor-pointer ${
                          learningLevel === lvl.id
                            ? 'bg-emerald-600 text-white border-emerald-700'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {visibleConsonants.map(item => (
                    <button
                      key={item.char}
                      onClick={() => handleSelectConsonant(item)}
                      className={`w-12 h-12 rounded-xl font-['Fredoka',sans-serif] text-2xl font-black border-2 transition cursor-pointer active:scale-95 ${
                        selectedConsonant === item.char
                          ? 'bg-emerald-600 border-emerald-700 text-white shadow-md scale-105'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                      }`}
                    >
                      {item.char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sélecteur des Voyelles */}
              <div className={`bg-white rounded-2xl border-2 p-3.5 shadow-xs transition ${
                selectedConsonant && !selectedVowel ? 'border-amber-500 ring-2 ring-amber-200' : 'border-amber-200'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-black text-amber-800 uppercase tracking-wider">
                    2. Touche une voyelle ou un son
                  </span>
                  <button
                    onClick={() => {
                      sound.playPop();
                      const next = !showCompoundVowels;
                      setShowCompoundVowels(next);
                      if (!next && selectedVowel && COMPOUND_VOWELS.includes(selectedVowel)) {
                        setSelectedVowel(null);
                      }
                    }}
                    className={`text-[11px] font-black px-2.5 py-1 rounded-full border transition cursor-pointer ${
                      showCompoundVowels
                        ? 'bg-amber-400 text-amber-950 border-amber-500'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {showCompoundVowels ? '✓ Sons (ou, on, an, oi) activés' : '+ Sons composés (ou, on, an)'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {activeVowels.map(item => (
                    <button
                      key={item.char}
                      onClick={() => handleSelectVowel(item)}
                      className={`min-w-[48px] h-12 px-3 rounded-xl font-['Fredoka',sans-serif] text-2xl font-black border-2 transition cursor-pointer active:scale-95 ${
                        selectedVowel === item.char
                          ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md scale-105'
                          : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      {item.char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Syllabes récemment formées et écoutées */}
              {learnedSyllables.length > 0 && (
                <div className="bg-white/80 rounded-2xl border border-slate-200 p-3 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs font-black text-slate-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Syllabes formées (touche pour écouter) :
                  </span>
                  {learnedSyllables.map(syl => (
                    <button
                      key={syl}
                      onClick={() => {
                        const c = CONSONANTS.find(item => syl.startsWith(item.char))?.char || syl[0];
                        const v = syl.slice(c.length);
                        speakWithIndicator(getSyllableTtsText(c, v), 0.78);
                      }}
                      className="px-3 py-1 rounded-full bg-white border-2 border-emerald-200 text-sm font-black text-slate-800 hover:bg-rose-50 hover:border-rose-300 transition cursor-pointer flex items-center gap-1"
                    >
                      <span>{syl}</span>
                      <Volume2 className="w-3 h-3 text-rose-500" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'grid' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-['Fredoka',sans-serif] text-base font-black text-slate-900">
                      Famille de la consonne « {gridConsonant.toUpperCase()} »
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      Touche chaque syllabe du tableau pour l’entendre !
                    </p>
                  </div>
                  <button
                    onClick={handlePlayFamily}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Chanter toute la famille</span>
                  </button>
                </div>

                {/* Choix rapide consonne */}
                <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                  {CONSONANTS.map(item => (
                    <button
                      key={item.char}
                      onClick={() => {
                        setGridConsonant(item.char);
                        sound.playPop();
                      }}
                      className={`w-9 h-9 rounded-lg font-['Fredoka',sans-serif] font-black text-base border transition cursor-pointer ${
                        gridConsonant === item.char
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                      }`}
                    >
                      {item.char}
                    </button>
                  ))}
                </div>

                {/* Grille des syllabes fusionnées */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {activeVowels.map(vItem => {
                    const syl = `${gridConsonant}${vItem.char}`;
                    const ex = SYLLABLE_EXAMPLES[syl];
                    return (
                      <button
                        key={vItem.char}
                        onClick={() => {
                          setSelectedConsonant(gridConsonant);
                          setSelectedVowel(vItem.char);
                          triggerFusion(gridConsonant, vItem.char, false);
                        }}
                        className="p-3 rounded-2xl bg-gradient-to-b from-white to-emerald-50 border-2 border-emerald-300 hover:border-rose-400 hover:shadow-md transition active:scale-95 flex flex-col items-center justify-center cursor-pointer"
                      >
                        <span className="text-[11px] font-bold text-slate-400">
                          {gridConsonant} + {vItem.char}
                        </span>
                        <span className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black text-rose-600 my-0.5">
                          {syl}
                        </span>
                        {ex ? (
                          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                            <span>{ex.emoji}</span>
                            <span>{ex.word}</span>
                          </span>
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === 'challenge' && (
            <div className="bg-white rounded-3xl border-3 border-amber-300 p-5 shadow-md text-center space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  Défis réussis : {challengeScore}
                </span>
                <button
                  onClick={() =>
                    speakText(`Fabrique la syllabe : ${getSyllableTtsText(challengeTarget.c, challengeTarget.v)} !`, {
                      rate: 0.8,
                      force: true,
                    })
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Réécouter la syllabe cible</span>
                </button>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-600 mb-1">
                  Combine la bonne consonne et la bonne voyelle pour former :
                </p>
                <div className="inline-block px-6 py-2 rounded-2xl bg-amber-100 border-2 border-amber-400 font-['Fredoka',sans-serif] text-4xl font-black text-amber-950">
                  {challengeTarget.c}{challengeTarget.v}
                </div>
              </div>

              {/* Emplacements de combinaison */}
              <div className="flex items-center justify-center gap-3">
                <div className={`w-16 h-16 rounded-2xl border-3 flex items-center justify-center font-['Fredoka',sans-serif] text-3xl font-black ${
                  challengeConsonant ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-dashed border-slate-300 text-slate-400'
                }`}>
                  {challengeConsonant || '?'}
                </div>
                <span className="text-2xl font-black text-slate-400">+</span>
                <div className={`w-16 h-16 rounded-2xl border-3 flex items-center justify-center font-['Fredoka',sans-serif] text-3xl font-black ${
                  challengeVowel ? 'bg-amber-100 border-amber-500 text-amber-900' : 'bg-slate-50 border-dashed border-slate-300 text-slate-400'
                }`}>
                  {challengeVowel || '?'}
                </div>
                <span className="text-2xl font-black text-slate-400">=</span>
                <div className={`min-w-[72px] h-16 px-3 rounded-2xl border-3 flex items-center justify-center font-['Fredoka',sans-serif] text-3xl font-black ${
                  challengeFeedback === 'success'
                    ? 'bg-emerald-500 border-emerald-600 text-white'
                    : challengeFeedback === 'error'
                    ? 'bg-rose-500 border-rose-600 text-white'
                    : 'bg-slate-100 border-slate-300 text-slate-700'
                }`}>
                  {(challengeConsonant || '') + (challengeVowel || '') || '…'}
                </div>
              </div>

              {/* Clavier réduit pour le défi */}
              <div className="space-y-2.5 pt-2">
                <div>
                  <span className="text-[11px] font-black text-emerald-700 uppercase block mb-1">
                    Consonnes
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['m', 'l', 'r', 's', 'p', 't', 'b', 'd', 'n', 'f', 'v'].map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          sound.playPop();
                          setChallengeConsonant(c);
                          checkChallengeResult(c, challengeVowel);
                        }}
                        className={`w-10 h-10 rounded-xl font-['Fredoka',sans-serif] text-lg font-black border-2 transition cursor-pointer ${
                          challengeConsonant === c
                            ? 'bg-emerald-600 text-white border-emerald-700'
                            : 'bg-white border-emerald-200 text-slate-800 hover:bg-emerald-50'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-black text-amber-700 uppercase block mb-1">
                    Voyelles
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SIMPLE_VOWELS.map(v => (
                      <button
                        key={v}
                        onClick={() => {
                          sound.playPop();
                          setChallengeVowel(v);
                          checkChallengeResult(challengeConsonant, v);
                        }}
                        className={`w-10 h-10 rounded-xl font-['Fredoka',sans-serif] text-lg font-black border-2 transition cursor-pointer ${
                          challengeVowel === v
                            ? 'bg-amber-400 text-amber-950 border-amber-500'
                            : 'bg-white border-amber-200 text-slate-800 hover:bg-amber-50'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {challengeFeedback === 'success' && (
                <div className="p-3 bg-emerald-100 border-2 border-emerald-400 rounded-2xl flex items-center justify-between gap-3">
                  <span className="font-black text-sm text-emerald-900">
                    🎉 Bravo ! +1 ⭐ gagnée !
                  </span>
                  <button
                    onClick={nextChallenge}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Syllabe suivante</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
