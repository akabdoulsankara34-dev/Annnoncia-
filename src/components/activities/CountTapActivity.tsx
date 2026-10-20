import React, { useState } from 'react';
import { SvgIcons } from '../SvgIcons';
import { sound, speakText } from '../../utils/audio';
import { Sparkles, Check } from 'lucide-react';
import { MultilingualText } from '../../types/book';

interface CountTapActivityProps {
  targetNumber: number;
  itemName: MultilingualText;
  itemType: 'mango' | 'calabash' | 'star' | 'chick' | 'coin' | 'baobab';
  options?: number[];
  onSuccess: () => void;
  onMistake: () => void;
}

export const CountTapActivity: React.FC<CountTapActivityProps> = ({
  targetNumber,
  itemType,
  options = [targetNumber - 2 > 0 ? targetNumber - 2 : 1, targetNumber, targetNumber + 2],
  onSuccess,
  onMistake,
}) => {
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const frenchNumbers = [
    'Zéro', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 
    'Six', 'Sept', 'Huit', 'Neuf', 'Dix',
    'Onze', 'Douze', 'Treize', 'Quatorze', 'Quinze',
    'Seize', 'Dix-sept', 'Dix-huit', 'Dix-neuf', 'Vingt'
  ];

  const handleTapItem = (index: number) => {
    if (isCompleted) return;

    if (!tappedIndices.includes(index)) {
      const nextTapped = [...tappedIndices, index];
      setTappedIndices(nextTapped);
      const currentCount = nextTapped.length;

      sound.playPop(350 + currentCount * 50);
      speakText(`${currentCount}`);
    }
  };

  const handleChoice = (choice: number) => {
    setSelectedChoice(choice);
    if (choice === targetNumber) {
      setIsCompleted(true);
      sound.playSuccess();
      speakText(`Bravo ! Il y a bien ${targetNumber} !`);
      onSuccess();
    } else {
      sound.playGentleEncouragement();
      speakText('Essaie encore mon ami ! Recompte bien !');
      onMistake();
      setTimeout(() => setSelectedChoice(null), 1200);
    }
  };

  const renderIcon = (type: string, isTapped: boolean, countOrder: number) => {
    const size = 68;
    return (
      <div className={`relative transition-all duration-300 transform ${isTapped ? 'scale-105 filter drop-shadow-md' : 'opacity-85 hover:scale-105 active:scale-95'}`}>
        {type === 'mango' && <SvgIcons.Mango size={size} />}
        {type === 'calabash' && <SvgIcons.Calabash size={size} />}
        {type === 'chick' && <SvgIcons.Chick size={size} />}
        {type === 'coin' && <SvgIcons.CoinFCFA size={size} />}
        {type === 'star' && <SvgIcons.Star size={size} filled={true} />}
        {type === 'baobab' && <SvgIcons.Baobab size={size} />}

        {/* Badge numéroté au toucher */}
        {isTapped && (
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-2 border-white text-white font-black text-sm flex items-center justify-center shadow-lg animate-star-float">
            {countOrder}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-white/80 p-5 rounded-3xl border-3 border-amber-300 shadow-md">
      {/* Compteur interactif en direct */}
      <div className="flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-base">
        <span>Comptés :</span>
        <span className="text-xl text-emerald-600 font-black">{tappedIndices.length}</span>
        <span className="text-slate-400">/</span>
        <span>{targetNumber}</span>
      </div>

      {/* Grille d'objets à toucher pour compter */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 p-4 bg-amber-50/60 rounded-2xl border-2 border-amber-200/70 w-full justify-items-center min-h-[160px] items-center">
        {Array.from({ length: targetNumber }).map((_, idx) => {
          const tapIndex = tappedIndices.indexOf(idx);
          const isTapped = tapIndex !== -1;
          const countOrder = tapIndex + 1;

          return (
            <button
              key={idx}
              onClick={() => handleTapItem(idx)}
              className={`p-2 rounded-2xl transition cursor-pointer ${
                isTapped ? 'bg-amber-100/90' : 'bg-white hover:bg-amber-50 shadow-xs'
              }`}
            >
              {renderIcon(itemType, isTapped, countOrder)}
            </button>
          );
        })}
      </div>

      {/* Question à choix multiple (3 choix très visibles avec minimum 56px de hauteur) */}
      <div className="mt-5 w-full flex flex-col items-center">
        <p className="text-slate-700 font-extrabold text-base sm:text-lg mb-3 text-center">
          Combien d'objets as-tu comptés ?
        </p>

        <div className="flex items-center justify-center gap-3 w-full">
          {options.map((opt) => {
            const isSelected = selectedChoice === opt;
            const isCorrect = isSelected && opt === targetNumber;
            const isWrong = isSelected && opt !== targetNumber;

            return (
              <button
                key={opt}
                onClick={() => handleChoice(opt)}
                disabled={isCompleted}
                className={`min-h-[64px] min-w-[76px] px-5 py-3 rounded-2xl text-2xl font-black shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5 ${
                  isCorrect
                    ? 'bg-emerald-500 text-white scale-105 shadow-emerald-400/50'
                    : isWrong
                    ? 'bg-rose-400 text-white animate-shake'
                    : 'bg-white hover:bg-amber-50 text-slate-800 border-3 border-amber-400'
                }`}
              >
                <span>{opt}</span>
                {isCorrect && <Check className="w-6 h-6 text-white stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {isCompleted && (
        <div className="mt-4 flex items-center gap-2 text-emerald-700 font-black text-lg animate-star-float">
          <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
          <span>Félicitations ! C'est le bon nombre !</span>
        </div>
      )}
    </div>
  );
};
