import React, { useState, useEffect } from 'react';
import { ChildProfile } from '../types/book';
import { sound, speakText, stopSpeaking } from '../utils/audio';
import { SvgIcons } from './SvgIcons';
import { 
  X, 
  Star, 
  Volume2, 
  Plus, 
  Minus, 
  Equal, 
  RotateCcw, 
  Calculator, 
  Trophy, 
  Sparkles,
  ArrowRightLeft,
  CheckCircle2
} from 'lucide-react';

interface MathBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: ChildProfile;
  onAwardStars: (count: number) => void;
}

type CountingToolType = 'tokens' | 'tenframe' | 'numberline' | 'fingers';

const TARGET_CHALLENGES = [5, 7, 8, 10, 6, 9, 4, 12, 3, 11];

export const MathBuilderModal: React.FC<MathBuilderModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onAwardStars,
}) => {
  const [mode, setMode] = useState<'free' | 'challenge'>('free');
  const [countingTool, setCountingTool] = useState<CountingToolType>('tokens');

  // Emplacements de combinaison : [num1] [operator] [num2] = [result]
  const [num1, setNum1] = useState<number | null>(4);
  const [operator, setOperator] = useState<'+' | '-' | null>('+');
  const [num2, setNum2] = useState<number | null>(3);
  const [activeSlot, setActiveSlot] = useState<'num1' | 'operator' | 'num2'>('num2');
  const [showResult, setShowResult] = useState<boolean>(true);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  // Comptage interactif au toucher sur les jetons
  const [countedTokens, setCountedTokens] = useState<number[]>([]);
  const [removedSubTokens, setRemovedSubTokens] = useState<number[]>([]);

  // Mode Défi : obtenir un résultat cible
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const [challengeSuccess, setChallengeSuccess] = useState<boolean>(false);
  const [challengesSolved, setChallengesSolved] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
    }
  }, [isOpen]);

  // Réinitialiser le comptage interactif quand l'opération change
  useEffect(() => {
    setCountedTokens([]);
    setRemovedSubTokens([]);
    setWarningMsg(null);
  }, [num1, num2, operator]);

  if (!isOpen) return null;

  const targetResult = TARGET_CHALLENGES[challengeIndex % TARGET_CHALLENGES.length];

  const isSubtractionInvalid =
    operator === '-' && num1 !== null && num2 !== null && num1 < num2;

  const computedResult =
    num1 !== null && num2 !== null && operator !== null && !isSubtractionInvalid
      ? operator === '+'
        ? num1 + num2
        : num1 - num2
      : null;

  const handleSelectDigit = (digit: number) => {
    sound.playPop(460 + digit * 20);
    setWarningMsg(null);
    setChallengeSuccess(false);

    if (activeSlot === 'num1') {
      setNum1(digit);
      setActiveSlot(operator ? 'num2' : 'operator');
      if (mode === 'challenge') setShowResult(false);
    } else if (activeSlot === 'num2') {
      setNum2(digit);
      if (operator === '-' && num1 !== null && num1 < digit) {
        setWarningMsg(`Attention : pour soustraire, ${num1} est plus petit que ${digit} !`);
      }
      if (mode === 'challenge') setShowResult(false);
    } else {
      // Si l'utilisateur clique un chiffre alors que le slot actif est operator, on remplit num2
      setNum2(digit);
    }
  };

  const handleSelectOperator = (op: '+' | '-') => {
    sound.playPop(540);
    setOperator(op);
    setWarningMsg(null);
    setChallengeSuccess(false);
    setActiveSlot('num2');
    if (op === '-' && num1 !== null && num2 !== null && num1 < num2) {
      setWarningMsg(`Attention : pour enlever, le 1er nombre (${num1}) doit être plus grand que le 2e (${num2}) !`);
    }
    if (mode === 'challenge') setShowResult(false);
  };

  const handleCalculate = () => {
    if (num1 === null || num2 === null || operator === null) {
      sound.playGentleEncouragement();
      setWarningMsg('Choisis d’abord les deux chiffres et un signe (+ ou −) !');
      speakText('Choisis deux chiffres et un signe plus ou moins !', { force: true });
      return;
    }

    if (isSubtractionInvalid) {
      sound.playGentleEncouragement();
      setWarningMsg(`Impossible d’enlever ${num2} de ${num1} ! Inverse les chiffres ou change en +.`);
      speakText(`Pour enlever, le premier nombre doit être plus grand que ${num2} !`, { force: true });
      return;
    }

    setShowResult(true);
    const res = operator === '+' ? num1 + num2 : num1 - num2;
    const opWord = operator === '+' ? 'plus' : 'moins';

    if (mode === 'challenge') {
      if (res === targetResult) {
        setChallengeSuccess(true);
        setChallengesSolved(prev => prev + 1);
        sound.playSuccess();
        sound.playStarReward();
        onAwardStars(1);
        speakText(`Bravo ! ${num1} ${opWord} ${num2} égale bien ${res} ! Tu gagnes une étoile !`, { force: true });
      } else {
        sound.playGentleEncouragement();
        setWarningMsg(`${num1} ${operator} ${num2} = ${res}. On cherche une combinaison qui donne ${targetResult} !`);
        speakText(`${num1} ${opWord} ${num2} font ${res}. Cherche une opération qui donne ${targetResult} !`, { force: true });
      }
    } else {
      sound.playSuccess();
      speakText(`${num1} ${opWord} ${num2} égale ${res} !`, { force: true });
    }
  };

  const handleSwapNumbers = () => {
    if (num1 === null || num2 === null) return;
    sound.playPop();
    const tmp = num1;
    setNum1(num2);
    setNum2(tmp);
    setWarningMsg(null);
  };

  const handleClear = () => {
    sound.playPop(380);
    setNum1(null);
    setOperator('+');
    setNum2(null);
    setActiveSlot('num1');
    setShowResult(false);
    setWarningMsg(null);
    setChallengeSuccess(false);
  };

  const handleTapTokenToCount = (idx: number) => {
    const nextList = countedTokens.includes(idx)
      ? countedTokens.filter(i => i !== idx)
      : [...countedTokens, idx];
    setCountedTokens(nextList);
    sound.playPop(420 + nextList.length * 35);
    speakText(String(nextList.length), { rate: 0.95, force: true });
  };

  const handleTapSubToken = (idx: number) => {
    if (removedSubTokens.includes(idx)) {
      setRemovedSubTokens(removedSubTokens.filter(i => i !== idx));
      sound.playPop(460);
    } else {
      const next = [...removedSubTokens, idx];
      setRemovedSubTokens(next);
      sound.playPop(320);
      speakText(`Moins ${next.length}`, { rate: 0.95, force: true });
    }
  };

  // Rendu visuel des doigts pour un nombre 0..10 (ou 2 mains max)
  const renderFingerHand = (count: number, label: string, colorClass: string) => {
    const clamped = Math.max(0, Math.min(10, count));
    return (
      <div className={`flex flex-col items-center p-2.5 rounded-2xl border-2 ${colorClass}`}>
        <span className="text-[11px] font-black uppercase mb-1.5">{label} ({count})</span>
        <div className="flex items-end gap-1">
          {Array.from({ length: 10 }).map((_, idx) => {
            const isUp = idx < clamped;
            const isSeparator = idx === 5;
            return (
              <React.Fragment key={idx}>
                {isSeparator && <div className="w-2" />}
                <div
                  className={`w-3.5 sm:w-4 rounded-t-full border transition-all ${
                    isUp
                      ? 'h-9 bg-amber-300 border-amber-600 shadow-xs'
                      : 'h-3.5 bg-slate-200 border-slate-300 opacity-50'
                  }`}
                  title={`Doigt ${idx + 1}`}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="w-full max-w-2xl bg-[#FAF6EE] rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* En-tête */}
        <header className="bg-gradient-to-r from-[#1B4965] to-[#2B6CB0] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-xs">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-['Fredoka',sans-serif] text-lg sm:text-xl font-black leading-tight">
                Atelier Addition & Soustraction
              </h2>
              <p className="text-xs text-amber-200 font-semibold">
                Combine les chiffres et les signes (+ / −) avec les outils de comptage
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

        {/* Sélecteur de Mode */}
        <div className="bg-white border-b border-amber-200 px-4 py-2 flex items-center justify-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setMode('free');
              setChallengeSuccess(false);
              setWarningMsg(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition cursor-pointer ${
              mode === 'free'
                ? 'bg-[#1B4965] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Calculatrice Libre</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setMode('challenge');
              setNum1(null);
              setNum2(null);
              setOperator('+');
              setActiveSlot('num1');
              setShowResult(false);
              setChallengeSuccess(false);
              setWarningMsg(null);
              speakText(`Combine deux chiffres et un signe pour obtenir ${targetResult} !`, { force: true });
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition cursor-pointer ${
              mode === 'challenge'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Défi Combinatoire ⭐</span>
          </button>
        </div>

        {/* Contenu défilable */}
        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 space-y-3.5">
          {/* Bannière de défi si mode Défi actif */}
          {mode === 'challenge' && (
            <div className="bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-400 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🎯</span>
                <div>
                  <span className="text-xs font-black text-amber-900 uppercase block">
                    Défi {challengesSolved + 1} • Trouve une combinaison !
                  </span>
                  <span className="font-['Fredoka',sans-serif] text-base sm:text-lg font-black text-slate-900">
                    Combine des chiffres et un signe (+ ou −) pour obtenir :{' '}
                    <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#C8372D] text-white text-xl">
                      {targetResult}
                    </span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => speakText(`Fabrique une opération dont le résultat est ${targetResult} !`, { force: true })}
                className="p-2 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 cursor-pointer"
                title="Réécouter la consigne"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Zone d'opération interactive : [Chiffre 1] [Signe] [Chiffre 2] = [Résultat] */}
          <div className="bg-white rounded-3xl border-3 border-amber-300 p-3.5 sm:p-4 shadow-md">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {/* Emplacement Nombre 1 */}
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveSlot('num1');
                }}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-black flex flex-col items-center justify-center transition cursor-pointer ${
                  activeSlot === 'num1'
                    ? 'bg-blue-100 border-blue-500 text-blue-900 scale-105 shadow-md'
                    : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-blue-300'
                }`}
                title="Cliquer pour changer le 1er chiffre"
              >
                <span>{num1 !== null ? num1 : '?'}</span>
                <span className="text-[9px] font-bold uppercase text-slate-500">1er nombre</span>
              </button>

              {/* Emplacement Signe (+ ou -) */}
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveSlot('operator');
                }}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 font-black text-2xl sm:text-3xl flex items-center justify-center transition cursor-pointer ${
                  operator === '+'
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                    : 'bg-rose-100 border-rose-500 text-rose-700'
                } ${activeSlot === 'operator' ? 'ring-4 ring-amber-300 scale-105' : ''}`}
                title="Signe + ou −"
              >
                {operator === '+' ? <Plus className="w-7 h-7 stroke-[3]" /> : <Minus className="w-7 h-7 stroke-[3]" />}
              </button>

              {/* Emplacement Nombre 2 */}
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveSlot('num2');
                }}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-black flex flex-col items-center justify-center transition cursor-pointer ${
                  activeSlot === 'num2'
                    ? 'bg-blue-100 border-blue-500 text-blue-900 scale-105 shadow-md'
                    : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-blue-300'
                }`}
                title="Cliquer pour changer le 2e chiffre"
              >
                <span>{num2 !== null ? num2 : '?'}</span>
                <span className="text-[9px] font-bold uppercase text-slate-500">2e nombre</span>
              </button>

              {/* Bouton = Calculer */}
              <button
                onClick={handleCalculate}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-400 hover:bg-amber-500 border-3 border-amber-500 text-amber-950 font-black flex items-center justify-center shadow-md active:scale-95 transition cursor-pointer"
                title="Calculer le résultat"
              >
                <Equal className="w-8 h-8 stroke-[3]" />
              </button>

              {/* Emplacement Résultat */}
              <div
                onClick={() => {
                  if (computedResult !== null && showResult) {
                    const opWord = operator === '+' ? 'plus' : 'moins';
                    speakText(`${num1} ${opWord} ${num2} égale ${computedResult}`, { force: true });
                  }
                }}
                className={`min-w-[72px] sm:min-w-[84px] h-16 sm:h-20 px-3 rounded-2xl border-3 font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-black flex flex-col items-center justify-center cursor-pointer transition ${
                  challengeSuccess
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg scale-105'
                    : showResult && computedResult !== null
                    ? 'bg-amber-100 border-amber-400 text-amber-950'
                    : 'bg-slate-100 border-dashed border-slate-300 text-slate-400'
                }`}
              >
                <span>{showResult && computedResult !== null ? computedResult : '?'}</span>
                <span className="text-[9px] font-bold uppercase opacity-75">Résultat</span>
              </div>
            </div>

            {/* Alerte douce / Inversion rapide */}
            {warningMsg && (
              <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex flex-wrap items-center justify-center gap-2 text-center">
                <span>{warningMsg}</span>
                {isSubtractionInvalid && (
                  <button
                    onClick={handleSwapNumbers}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3 h-3" />
                    <span>Inverser ({num2} − {num1})</span>
                  </button>
                )}
              </div>
            )}

            {/* Succès Défi */}
            {challengeSuccess && (
              <div className="mt-3 p-3 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Super ! {num1} {operator} {num2} = {computedResult} (+1 ⭐)</span>
                </div>
                <button
                  onClick={() => {
                    sound.playPop();
                    const nextIdx = challengeIndex + 1;
                    setChallengeIndex(nextIdx);
                    setNum1(null);
                    setNum2(null);
                    setActiveSlot('num1');
                    setShowResult(false);
                    setChallengeSuccess(false);
                    setWarningMsg(null);
                    const nextTarget = TARGET_CHALLENGES[nextIdx % TARGET_CHALLENGES.length];
                    speakText(`Nouveau défi ! Obtiens le résultat ${nextTarget} !`, { force: true });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer"
                >
                  Défi suivant ➜
                </button>
              </div>
            )}

            {/* Clavier de combinaison Chiffres + Signes */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
              {/* Chiffres 0 à 10 */}
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(digit => (
                  <button
                    key={digit}
                    onClick={() => handleSelectDigit(digit)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-50 hover:bg-blue-100 border-2 border-slate-300 hover:border-blue-400 font-['Fredoka',sans-serif] text-lg sm:text-xl font-black text-slate-800 transition active:scale-90 cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
              </div>

              {/* Signes + / - / = / Effacer */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handleSelectOperator('+')}
                  className={`px-4 py-2 rounded-xl font-black text-sm flex items-center gap-1.5 border-2 transition active:scale-95 cursor-pointer ${
                    operator === '+'
                      ? 'bg-emerald-600 border-emerald-700 text-white shadow-sm'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Ajouter (+)</span>
                </button>

                <button
                  onClick={() => handleSelectOperator('-')}
                  className={`px-4 py-2 rounded-xl font-black text-sm flex items-center gap-1.5 border-2 transition active:scale-95 cursor-pointer ${
                    operator === '-'
                      ? 'bg-rose-600 border-rose-700 text-white shadow-sm'
                      : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  <Minus className="w-4 h-4 stroke-[3]" />
                  <span>Enlever (−)</span>
                </button>

                <button
                  onClick={handleCalculate}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 border-2 border-amber-500 text-amber-950 font-black text-sm flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <Equal className="w-4 h-4 stroke-[3]" />
                  <span>Calculer (=)</span>
                </button>

                <button
                  onClick={handleClear}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  title="Effacer l'opération"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Effacer</span>
                </button>
              </div>
            </div>
          </div>

          {/* OUTILS DE COMPTAGE VISUELS POUR L'ENFANT */}
          <div className="bg-white rounded-3xl border-2 border-[#1B4965]/25 p-3.5 sm:p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-['Fredoka',sans-serif] text-sm sm:text-base font-black text-slate-800">
                  Outils de comptage pour t’aider :
                </span>
              </div>

              {/* Sélecteur des 4 outils */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'tokens', label: '🥭 Jetons' },
                  { id: 'tenframe', label: '🔟 Boîtes de 10' },
                  { id: 'numberline', label: '📏 Droite 0-20' },
                  { id: 'fingers', label: '🖐️ Doigts' },
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      sound.playPop();
                      setCountingTool(tool.id as CountingToolType);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black border transition cursor-pointer ${
                      countingTool === tool.id
                        ? 'bg-[#1B4965] text-white border-[#1B4965]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tool.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu de l'outil choisi */}
            {num1 === null && num2 === null ? (
              <div className="text-center py-6 text-xs sm:text-sm font-bold text-slate-400">
                Choisis des chiffres ci-dessus pour voir l’outil de comptage s’animer !
              </div>
            ) : (
              <>
                {/* OUTIL 1 : JETONS / MANGUES À COMPTER */}
                {countingTool === 'tokens' && (
                  <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-3">
                    {operator === '+' ? (
                      <div>
                        <p className="text-xs font-bold text-slate-600 text-center mb-2">
                          Touche chaque mangue ou jeton pour compter ensemble ({countedTokens.length} compté{countedTokens.length > 1 ? 's' : ''}) :
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <div className="flex flex-wrap gap-1.5 justify-center p-2 bg-white rounded-xl border border-amber-200 min-w-[80px] min-h-[48px]">
                            {Array.from({ length: num1 || 0 }).map((_, i) => {
                              const tokenId = i;
                              const isCounted = countedTokens.includes(tokenId);
                              return (
                                <button
                                  key={tokenId}
                                  onClick={() => handleTapTokenToCount(tokenId)}
                                  className={`p-1 rounded-lg transition cursor-pointer ${
                                    isCounted ? 'bg-amber-200 scale-110 ring-2 ring-amber-500' : 'hover:scale-105'
                                  }`}
                                >
                                  <SvgIcons.Mango size={34} />
                                </button>
                              );
                            })}
                          </div>

                          <Plus className="w-5 h-5 text-emerald-600 stroke-[3]" />

                          <div className="flex flex-wrap gap-1.5 justify-center p-2 bg-white rounded-xl border border-blue-200 min-w-[80px] min-h-[48px]">
                            {Array.from({ length: num2 || 0 }).map((_, i) => {
                              const tokenId = 100 + i;
                              const isCounted = countedTokens.includes(tokenId);
                              return (
                                <button
                                  key={tokenId}
                                  onClick={() => handleTapTokenToCount(tokenId)}
                                  className={`p-1 rounded-lg transition cursor-pointer ${
                                    isCounted ? 'bg-blue-200 scale-110 ring-2 ring-blue-500' : 'hover:scale-105'
                                  }`}
                                >
                                  <SvgIcons.CoinFCFA size={34} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-bold text-slate-600 text-center mb-2">
                          Il y a <b>{num1 || 0}</b> jetons. Touche <b>{num2 || 0}</b> jeton{(num2 || 0) > 1 ? 's' : ''} pour les enlever (ou compte ceux qui restent) !
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center p-2 bg-white rounded-xl border border-rose-200">
                          {Array.from({ length: num1 || 0 }).map((_, i) => {
                            const autoRemoved = removedSubTokens.length === 0 && i >= Math.max(0, (num1 || 0) - (num2 || 0));
                            const manuallyRemoved = removedSubTokens.includes(i);
                            const isRemoved = removedSubTokens.length > 0 ? manuallyRemoved : autoRemoved;
                            return (
                              <button
                                key={i}
                                onClick={() => handleTapSubToken(i)}
                                className={`relative p-1 rounded-xl transition cursor-pointer ${
                                  isRemoved ? 'opacity-30 grayscale scale-90' : 'hover:scale-105'
                                }`}
                              >
                                <SvgIcons.Mango size={36} />
                                {isRemoved && (
                                  <span className="absolute inset-0 flex items-center justify-center text-rose-600 font-black text-2xl">
                                    ✕
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* OUTIL 2 : BOÎTES DE 10 (JUSQU'À 20) */}
                {countingTool === 'tenframe' && (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 flex flex-col items-center gap-2.5">
                    <p className="text-xs font-bold text-slate-600 text-center">
                      {operator === '+'
                        ? `🟡 ${num1 || 0} jetons + 🔵 ${num2 || 0} jetons dans les boîtes de 10`
                        : `🟡 ${num1 || 0} jetons au départ, ❌ ${num2 || 0} enlevés`}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {[0, 1].map(frameIdx => (
                        <div
                          key={frameIdx}
                          className="grid grid-cols-5 gap-1.5 p-2 bg-white rounded-xl border-2 border-[#1B4965]"
                        >
                          {Array.from({ length: 10 }).map((_, cellIdx) => {
                            const globalIdx = frameIdx * 10 + cellIdx;
                            const n1 = num1 || 0;
                            const n2 = num2 || 0;
                            let cellState: 'empty' | 'n1' | 'n2' | 'removed' = 'empty';

                            if (operator === '+') {
                              if (globalIdx < n1) cellState = 'n1';
                              else if (globalIdx < n1 + n2) cellState = 'n2';
                            } else {
                              if (globalIdx < Math.max(0, n1 - n2)) cellState = 'n1';
                              else if (globalIdx < n1) cellState = 'removed';
                            }

                            return (
                              <div
                                key={cellIdx}
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs font-black ${
                                  cellState === 'n1'
                                    ? 'bg-amber-400 border-amber-600 text-amber-950'
                                    : cellState === 'n2'
                                    ? 'bg-blue-500 border-blue-700 text-white'
                                    : cellState === 'removed'
                                    ? 'bg-rose-100 border-rose-400 text-rose-600'
                                    : 'bg-slate-50 border-slate-300'
                                }`}
                              >
                                {cellState === 'removed' ? '✕' : ''}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* OUTIL 3 : DROITE NUMÉRIQUE (0 À 20) */}
                {countingTool === 'numberline' && (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3">
                    <p className="text-xs font-bold text-slate-600 text-center mb-2">
                      Départ sur <b className="text-blue-700">{num1 || 0}</b>, puis{' '}
                      {operator === '+' ? (
                        <b className="text-emerald-700">+{num2 || 0} pas en avant ➜</b>
                      ) : (
                        <b className="text-rose-700">⬅ −{num2 || 0} pas en arrière</b>
                      )}
                    </p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {Array.from({ length: 21 }).map((_, n) => {
                        const n1 = num1 ?? -1;
                        const res = computedResult ?? -1;
                        const isStart = n === n1;
                        const isEnd = showResult && n === res;
                        const isInPath =
                          n1 >= 0 &&
                          res >= 0 &&
                          ((operator === '+' && n > n1 && n < res) ||
                            (operator === '-' && n < n1 && n > res));

                        return (
                          <button
                            key={n}
                            onClick={() => {
                              sound.playPop(400 + n * 15);
                              speakText(String(n), { force: true });
                            }}
                            className={`w-7 h-8 sm:w-8 sm:h-9 rounded-lg font-['Fredoka',sans-serif] text-xs sm:text-sm font-black border transition cursor-pointer ${
                              isEnd
                                ? 'bg-amber-400 border-amber-600 text-amber-950 scale-110 shadow-sm'
                                : isStart
                                ? 'bg-blue-600 border-blue-700 text-white'
                                : isInPath
                                ? operator === '+'
                                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                                  : 'bg-rose-100 border-rose-400 text-rose-800'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* OUTIL 4 : DOIGTS DES MAINS */}
                {countingTool === 'fingers' && (
                  <div className="bg-amber-50/60 rounded-2xl border border-amber-200 p-3 flex flex-wrap items-center justify-center gap-3">
                    {renderFingerHand(num1 || 0, '1er nombre', 'bg-white border-blue-200 text-blue-900')}
                    <div className="font-black text-2xl text-slate-500">
                      {operator}
                    </div>
                    {renderFingerHand(num2 || 0, '2e nombre', 'bg-white border-emerald-200 text-emerald-900')}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
