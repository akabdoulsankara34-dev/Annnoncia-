import React, { useState } from 'react';
import { SvgIcons } from '../SvgIcons';
import { sound, speakText } from '../../utils/audio';
import { Sparkles, Plus, Minus, Equal, Check } from 'lucide-react';

interface AddSubActivityProps {
  mode: 'addition' | 'subtraction';
  num1: number;
  num2: number;
  itemType: 'mango' | 'star' | 'coin' | 'calabash' | 'chick';
  onSuccess: () => void;
  onMistake: () => void;
}

export const AddSubActivity: React.FC<AddSubActivityProps> = ({
  mode,
  num1,
  num2,
  itemType,
  onSuccess,
  onMistake,
}) => {
  const result = mode === 'addition' ? num1 + num2 : num1 - num2;
  const [removedIndices, setRemovedIndices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Generate 3 answers
  const options = [
    result - 1 >= 0 ? result - 1 : result + 2,
    result,
    result + 1
  ].sort((a, b) => a - b);

  const handleToggleRemove = (index: number) => {
    if (mode !== 'subtraction' || isCompleted) return;

    if (removedIndices.includes(index)) {
      setRemovedIndices(removedIndices.filter(i => i !== index));
      sound.playPop(420);
    } else {
      if (removedIndices.length < num2) {
        setRemovedIndices([...removedIndices, index]);
        sound.playPop(340);
        speakText('Enlevé !');
      }
    }
  };

  const handleChoose = (ans: number) => {
    setSelectedAnswer(ans);
    if (ans === result) {
      setIsCompleted(true);
      sound.playSuccess();
      speakText(`Exact ! ${num1} ${mode === 'addition' ? 'plus' : 'moins'} ${num2} égale ${result} !`);
      onSuccess();
    } else {
      sound.playGentleEncouragement();
      speakText('Essaie encore ! Tu vas y arriver !');
      onMistake();
      setTimeout(() => setSelectedAnswer(null), 1200);
    }
  };

  const renderIcon = (type: string, isRemoved = false) => {
    const size = 52;
    return (
      <div className={`transition-all duration-300 relative ${isRemoved ? 'opacity-25 grayscale scale-90' : 'hover:scale-105 active:scale-95'}`}>
        {type === 'mango' && <SvgIcons.Mango size={size} />}
        {type === 'star' && <SvgIcons.Star size={size} filled={true} />}
        {type === 'coin' && <SvgIcons.CoinFCFA size={size} />}
        {type === 'calabash' && <SvgIcons.Calabash size={size} />}
        {type === 'chick' && <SvgIcons.Chick size={size} />}

        {isRemoved && (
          <div className="absolute inset-0 flex items-center justify-center text-rose-600 font-black text-3xl">
            ✕
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-amber-50/80 p-5 rounded-3xl border-3 border-amber-300 shadow-md">
      {/* Équation géante en haut */}
      <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border-2 border-amber-200 shadow-xs mb-4 text-2xl sm:text-3xl font-black text-slate-800">
        <span className="text-amber-600">{num1}</span>
        {mode === 'addition' ? (
          <Plus className="w-7 h-7 text-emerald-600 stroke-[3]" />
        ) : (
          <Minus className="w-7 h-7 text-rose-500 stroke-[3]" />
        )}
        <span className="text-amber-600">{num2}</span>
        <Equal className="w-7 h-7 text-slate-400 stroke-[3]" />
        <span className={`px-4 py-1 rounded-xl border-2 ${isCompleted ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-100 text-slate-400 border-dashed border-slate-300'}`}>
          {isCompleted ? result : '?'}
        </span>
      </div>

      {/* Zone visuelle de manipulation */}
      {mode === 'addition' ? (
        <div className="w-full flex items-center justify-center gap-4 bg-white/70 p-4 rounded-2xl border-2 border-amber-200">
          {/* Premier groupe */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-2 bg-amber-100/50 rounded-xl border border-amber-200 min-h-[70px] min-w-[100px]">
            {Array.from({ length: num1 }).map((_, i) => (
              <div key={i}>{renderIcon(itemType)}</div>
            ))}
          </div>

          <div className="p-2 rounded-full bg-emerald-100 text-emerald-700 font-black">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>

          {/* Deuxième groupe */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-2 bg-amber-100/50 rounded-xl border border-amber-200 min-h-[70px] min-w-[100px]">
            {Array.from({ length: num2 }).map((_, i) => (
              <div key={i}>{renderIcon(itemType)}</div>
            ))}
          </div>
        </div>
      ) : (
        /* Mode soustraction : touche pour barrer */
        <div className="w-full flex flex-col items-center bg-white/70 p-4 rounded-2xl border-2 border-amber-200">
          <p className="text-xs sm:text-sm font-bold text-slate-600 mb-2">
            Touche {num2} {itemType} pour les enlever :
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 p-2">
            {Array.from({ length: num1 }).map((_, i) => {
              const isRemoved = removedIndices.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => handleToggleRemove(i)}
                  className="cursor-pointer"
                >
                  {renderIcon(itemType, isRemoved)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Boutons de réponse (hauteur min 56px) */}
      <div className="mt-5 w-full flex flex-col items-center">
        <p className="text-slate-700 font-extrabold text-base mb-3">
          Quel est le bon résultat ?
        </p>

        <div className="flex items-center justify-center gap-3 w-full">
          {options.map((opt) => {
            const isSelected = selectedAnswer === opt;
            const isCorrect = isSelected && opt === result;
            const isWrong = isSelected && opt !== result;

            return (
              <button
                key={opt}
                onClick={() => handleChoose(opt)}
                disabled={isCompleted}
                className={`min-h-[60px] min-w-[76px] px-5 py-3 rounded-2xl text-2xl font-black shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5 ${
                  isCorrect
                    ? 'bg-emerald-500 text-white scale-105 shadow-emerald-400/50'
                    : isWrong
                    ? 'bg-rose-400 text-white'
                    : 'bg-white hover:bg-amber-100 text-slate-800 border-3 border-amber-400'
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
          <span>Bravo champion des additions !</span>
        </div>
      )}
    </div>
  );
};
