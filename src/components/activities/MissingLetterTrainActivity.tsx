import React, { useState } from 'react';
import { sound, speakText } from '../../utils/audio';
import { Sparkles, Check, Train } from 'lucide-react';

interface MissingLetterTrainActivityProps {
  sequence: string[];
  missingIndex: number;
  options: string[];
  correct: string;
  onSuccess: () => void;
  onMistake: () => void;
}

export const MissingLetterTrainActivity: React.FC<MissingLetterTrainActivityProps> = ({
  sequence,
  missingIndex,
  options,
  correct,
  onSuccess,
  onMistake,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const isNumber = !isNaN(Number(correct));
  const itemTypeLabel = isNumber ? 'le nombre' : 'la lettre';

  const handleChoose = (opt: string) => {
    if (isCompleted) return;
    setSelectedChoice(opt);

    if (opt.toUpperCase() === correct.toUpperCase()) {
      setIsCompleted(true);
      sound.playSuccess();
      speakText(`Bravo ! C’est bien ${itemTypeLabel} ${correct} qui monte dans le wagon !`);
      setTimeout(onSuccess, 800);
    } else {
      sound.playGentleEncouragement();
      speakText(`Ce n’est pas ${itemTypeLabel} ${opt}. Recommence !`);
      onMistake();
      setTimeout(() => setSelectedChoice(null), 1200);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-amber-50/80 p-5 rounded-3xl border-3 border-amber-300 shadow-md">
      {/* En-tête train */}
      <div className="flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-blue-100 text-blue-900 font-extrabold text-sm">
        <Train className="w-5 h-5 text-blue-600" />
        <span>{isNumber ? 'Le Train des Nombres' : "Le Train de l'Alphabet"}</span>
      </div>

      <p className="text-slate-700 font-extrabold text-base mb-4 text-center">
        {isNumber 
          ? "Quel nombre manque-t-il dans le wagon avec le point d'interrogation ?"
          : "Quelle lettre manque-t-il dans le wagon avec le point d'interrogation ?"}
      </p>

      {/* Les wagons du train de l'alphabet */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 p-4 bg-sky-100 rounded-3xl border-3 border-sky-300 w-full overflow-x-auto shadow-inner">
        {/* Locomotive */}
        <div className="flex flex-col items-center justify-center w-12 sm:w-14 h-16 sm:h-20 bg-rose-600 text-white rounded-l-2xl border-2 border-white shadow-md shrink-0">
          <Train className="w-7 h-7" />
          <span className="text-[10px] font-black uppercase mt-1">Tchou !</span>
        </div>

        {/* Wagons */}
        {sequence.map((letter, idx) => {
          const isMissing = idx === missingIndex;
          const displayChar = isMissing ? (isCompleted ? correct : '?') : letter;

          return (
            <div
              key={idx}
              className={`relative flex flex-col items-center justify-center w-12 sm:w-16 h-16 sm:h-20 rounded-2xl border-3 shadow-md shrink-0 transition-transform ${
                isMissing
                  ? isCompleted
                    ? 'bg-emerald-500 border-white text-white scale-110'
                    : 'bg-amber-300 border-dashed border-amber-500 text-amber-900 animate-pulse'
                  : 'bg-white border-sky-400 text-slate-800'
              }`}
            >
              <span className="text-2xl sm:text-3xl font-black">
                {displayChar}
              </span>

              {/* Roues du wagon */}
              <div className="absolute -bottom-2 flex gap-4">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-white" />
                <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3 grands choix tactiles pour l'enfant (hauteur min 56px) */}
      <div className="mt-6 w-full flex flex-col items-center">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Choisis la bonne lettre :
        </span>

        <div className="flex items-center justify-center gap-3 w-full">
          {options.map((opt) => {
            const isSelected = selectedChoice === opt;
            const isCorrect = isSelected && opt.toUpperCase() === correct.toUpperCase();
            const isWrong = isSelected && opt.toUpperCase() !== correct.toUpperCase();

            return (
              <button
                key={opt}
                onClick={() => handleChoose(opt)}
                disabled={isCompleted}
                className={`min-h-[64px] min-w-[76px] px-5 py-3 rounded-2xl text-3xl font-black shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                  isCorrect
                    ? 'bg-emerald-500 text-white scale-105 shadow-emerald-400/50'
                    : isWrong
                    ? 'bg-rose-400 text-white animate-shake'
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
          <span>Le train de l'alphabet peut démarrer ! Tchou-tchou !</span>
        </div>
      )}
    </div>
  );
};
