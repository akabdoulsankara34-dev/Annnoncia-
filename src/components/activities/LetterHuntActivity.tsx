import React, { useState } from 'react';
import { SvgIcons } from '../SvgIcons';
import { sound, speakText } from '../../utils/audio';
import { Volume2, Sparkles, Check } from 'lucide-react';

interface LetterHuntActivityProps {
  targetLetter: string;
  targetName: string;
  options: { letter: string; isUpper: boolean; isTarget: boolean }[];
  onSuccess: () => void;
  onMistake: () => void;
}

export const LetterHuntActivity: React.FC<LetterHuntActivityProps> = ({
  targetLetter,
  targetName,
  options,
  onSuccess,
  onMistake,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleHearTarget = () => {
    sound.playPop(520);
    speakText(`Attrape la lettre : ${targetLetter} ! ${targetName}`);
  };

  const handleSelect = (item: typeof options[0]) => {
    if (isCompleted) return;
    setSelectedLetter(item.letter);

    if (item.isTarget) {
      setIsCompleted(true);
      sound.playSuccess();
      speakText(`Bravo ! Tu as trouvé la lettre ${item.letter} !`);
      setTimeout(onSuccess, 800);
    } else {
      sound.playGentleEncouragement();
      speakText(`Non, ceci est la lettre ${item.letter}. Cherche la lettre ${targetLetter} !`);
      onMistake();
      setTimeout(() => setSelectedLetter(null), 1200);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-amber-50/80 p-5 rounded-3xl border-3 border-amber-300 shadow-md">
      {/* Consigne d'écoute */}
      <div 
        onClick={handleHearTarget}
        className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border-2 border-amber-300 shadow-sm cursor-pointer hover:bg-amber-50 active:scale-95 transition mb-5 group"
      >
        <div className="w-12 h-12 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-xs group-hover:scale-110 transition">
          <Volume2 className="w-6 h-6" />
        </div>
        <div className="text-left">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
            Écoute la consigne de Kalo :
          </span>
          <span className="text-lg font-black text-slate-800">
            « Attrape la lettre <span className="text-rose-600 underline text-2xl">{targetLetter}</span> ! »
          </span>
        </div>
      </div>

      {/* Les mangues portant les lettres */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full justify-items-center my-2">
        {options.map((item, idx) => {
          const isSelected = selectedLetter === item.letter;
          const isCorrect = isSelected && item.isTarget;
          const isWrong = isSelected && !item.isTarget;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(item)}
              disabled={isCompleted}
              className={`relative flex flex-col items-center justify-center p-4 rounded-3xl transition-transform active:scale-95 cursor-pointer ${
                isCorrect
                  ? 'bg-emerald-100 border-3 border-emerald-500 scale-110 shadow-lg'
                  : isWrong
                  ? 'bg-rose-100 border-3 border-rose-400 scale-95 opacity-60'
                  : 'bg-white hover:bg-amber-50 border-3 border-amber-300 shadow-md hover:scale-105'
              }`}
            >
              <div className="relative">
                <SvgIcons.Mango size={72} />
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-black text-slate-900 drop-shadow-sm pt-2">
                  {item.letter}
                </span>
              </div>

              <span className="text-xs font-bold text-slate-500 mt-1">
                {item.isUpper ? 'Majuscule' : 'Minuscule'}
              </span>

              {isCorrect && (
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isCompleted && (
        <div className="mt-5 flex items-center gap-2 text-emerald-700 font-black text-lg animate-star-float">
          <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
          <span>Super ! C'est la bonne lettre !</span>
        </div>
      )}
    </div>
  );
};
