import React, { useState } from 'react';
import { sound, speakText } from '../../utils/audio';
import { Sparkles, Volume2, Target, Play, Check } from 'lucide-react';

interface CountTo50ActivityProps {
  targetFind?: number;
  onSuccess: () => void;
  onMistake?: () => void;
}

export const CountTo50Activity: React.FC<CountTo50ActivityProps> = ({
  targetFind = 34,
  onSuccess,
  onMistake,
}) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'tens' | 'first25' | 'last25'>('all');
  const [mysteryTarget, setMysteryTarget] = useState<number>(targetFind);
  const [gameMode, setGameMode] = useState<'explore' | 'quiz'>('explore');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSinging, setIsSinging] = useState(false);

  const numbers = Array.from({ length: 50 }, (_, i) => i + 1);

  const handleTapNumber = (n: number) => {
    setSelectedNumber(n);
    sound.playPop(300 + (n % 10) * 40);
    speakText(`${n}`);

    if (gameMode === 'quiz') {
      if (n === mysteryTarget) {
        setIsCompleted(true);
        sound.playSuccess();
        speakText(`Bravo champion ! Tu as trouvé le nombre ${n} !`);
        setTimeout(() => {
          onSuccess();
        }, 900);
      } else {
        sound.playGentleEncouragement();
        speakText(`Ce n’est pas ${n}. Cherche le nombre ${mysteryTarget} !`);
        if (onMistake) onMistake();
      }
    }
  };

  const handleStartQuiz = () => {
    const randomN = Math.floor(Math.random() * 40) + 11; // Nombre entre 11 et 50
    setMysteryTarget(randomN);
    setGameMode('quiz');
    setIsCompleted(false);
    sound.playPop(500);
    speakText(`Jeu de piste ! Trouve le nombre : ${randomN} sur le grand tableau !`);
  };

  const handleSingTens = () => {
    if (isSinging) return;
    setIsSinging(true);
    sound.playSuccess();

    speakText("Comptons les grandes dizaines jusqu'à 50 ! Dix, Vingt, Trente, Quarante, Cinquante ! Bravo !", {
      rate: 0.82,
      onEnd: () => setIsSinging(false)
    });
  };

  const handleSingNumbers = () => {
    if (isSinging) return;
    setIsSinging(true);
    sound.playSuccess();

    speakText("Comptons ensemble ! Un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix ! Puis vingt, trente, quarante, et cinquante ! Bravo champion !", {
      rate: 0.85,
      onEnd: () => setIsSinging(false)
    });
  };

  // Filtrage selon onglet
  const filteredNumbers = numbers.filter((n) => {
    if (activeTab === 'tens') return n % 10 === 0;
    if (activeTab === 'first25') return n <= 25;
    if (activeTab === 'last25') return n > 25;
    return true;
  });

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto bg-amber-50/90 p-4 sm:p-5 rounded-3xl border-3 border-amber-300 shadow-md select-none">
      {/* Barre de contrôle et modes de jeu */}
      <div className="flex flex-wrap items-center justify-between gap-2 w-full mb-3">
        {/* Onglets de filtrage */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-amber-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'all' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            1 à 50
          </button>
          <button
            onClick={() => setActiveTab('tens')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'tens' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            Dizaines (10, 20...)
          </button>
          <button
            onClick={() => setActiveTab('first25')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer hidden sm:inline ${
              activeTab === 'first25' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            1 à 25
          </button>
          <button
            onClick={() => setActiveTab('last25')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer hidden sm:inline ${
              activeTab === 'last25' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            26 à 50
          </button>
        </div>

        {/* Actions : Écouter dizaines ou Jeu de piste */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSingTens}
            disabled={isSinging}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Les Dizaines</span>
          </button>

          <button
            onClick={handleSingNumbers}
            disabled={isSinging}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Chanson 1 à 50</span>
          </button>

          <button
            onClick={handleStartQuiz}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs shadow-md transition active:scale-95 cursor-pointer ${
              gameMode === 'quiz'
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>{gameMode === 'quiz' ? `Trouve ${mysteryTarget} !` : 'Jeu : Trouve le nombre'}</span>
          </button>
        </div>
      </div>

      {/* Message consigne du jeu */}
      {gameMode === 'quiz' && (
        <div className="w-full bg-rose-50 border-2 border-rose-300 p-2.5 rounded-2xl text-center mb-3 text-rose-900 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-rose-600 animate-spin" />
          <span>Kalo demande : « Cherche et touche le nombre <strong>{mysteryTarget}</strong> ! »</span>
        </div>
      )}

      {/* Le Grand Tableau des 50 Nombres */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2 w-full p-3 bg-white rounded-2xl border-2 border-amber-200 shadow-inner max-h-[380px] overflow-y-auto">
        {filteredNumbers.map((n) => {
          const isTen = n % 10 === 0;
          const isSelected = selectedNumber === n;
          const isMysteryMatch = gameMode === 'quiz' && isCompleted && n === mysteryTarget;

          return (
            <button
              key={n}
              onClick={() => handleTapNumber(n)}
              className={`min-h-[46px] sm:min-h-[50px] rounded-xl flex flex-col items-center justify-center font-black text-lg sm:text-xl transition active:scale-90 cursor-pointer ${
                isMysteryMatch
                  ? 'bg-emerald-500 text-white scale-110 ring-4 ring-emerald-300 shadow-lg'
                  : isSelected
                  ? 'bg-amber-400 text-amber-950 scale-105 ring-2 ring-amber-500'
                  : isTen
                  ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 shadow-sm border border-amber-300'
                  : n <= 20
                  ? 'bg-blue-50/80 hover:bg-blue-100 text-blue-900 border border-blue-200'
                  : n <= 40
                  ? 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                  : 'bg-purple-50/80 hover:bg-purple-100 text-purple-900 border border-purple-200'
              }`}
            >
              <span>{n}</span>
              {isTen && <span className="text-[9px] font-bold uppercase opacity-80 leading-none">Dizaine</span>}
            </button>
          );
        })}
      </div>

      {/* Pied du tableau avec félicitations */}
      <div className="mt-3 flex items-center justify-between w-full px-2 text-xs font-bold text-slate-500">
        <span>Touche un nombre pour l'entendre à voix haute !</span>
        {isCompleted && (
          <div className="flex items-center gap-1.5 text-emerald-700 font-black animate-star-float">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Félicitations ! C'est le bon nombre !</span>
          </div>
        )}
      </div>
    </div>
  );
};
