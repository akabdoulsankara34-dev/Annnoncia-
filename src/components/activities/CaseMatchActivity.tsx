import React, { useState } from 'react';
import { sound, speakText } from '../../utils/audio';
import { Sparkles, Check, CheckCircle2 } from 'lucide-react';

interface CaseMatchActivityProps {
  pairs: {
    id: string;
    upper: string;
    lower: string;
  }[];
  onSuccess: () => void;
  onMistake: () => void;
}

export const CaseMatchActivity: React.FC<CaseMatchActivityProps> = ({
  pairs,
  onSuccess,
  onMistake,
}) => {
  const [selectedUpper, setSelectedUpper] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  // Mélanger les minuscules pour le jeu
  const [shuffledLowers] = useState(() => {
    return [...pairs].sort(() => Math.random() - 0.5);
  });

  const handleSelectUpper = (upperLetter: string) => {
    setSelectedUpper(upperLetter);
    sound.playPop(480);
    speakText(`Grand ${upperLetter} majuscule`);
  };

  const handleSelectLower = (pair: typeof pairs[0]) => {
    if (!selectedUpper || matchedIds.includes(pair.id)) return;

    if (selectedUpper === pair.upper) {
      // Bonne correspondance !
      const nextMatched = [...matchedIds, pair.id];
      setMatchedIds(nextMatched);
      setSelectedUpper(null);
      sound.playSuccess();
      speakText(`Bravo ! ${pair.upper} majuscule et ${pair.lower} minuscule vont ensemble !`);

      if (nextMatched.length === pairs.length) {
        setTimeout(onSuccess, 800);
      }
    } else {
      // Erreur bienveillante
      sound.playGentleEncouragement();
      speakText('Essaie encore ! Cherche la même lettre en minuscule.');
      onMistake();
      setSelectedUpper(null);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-amber-50/80 p-5 rounded-3xl border-3 border-amber-300 shadow-md">
      <div className="text-center mb-4">
        <h4 className="text-lg font-black text-slate-800">
          Relie la Majuscule à sa Minuscule !
        </h4>
        <p className="text-xs font-semibold text-slate-600 mt-0.5">
          Touche d'abord la grande lettre rouge, puis la petite lettre bleue correspondante.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Colonne des MAJUSCULES */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-rose-600 text-center">
            MAJUSCULES
          </span>
          {pairs.map((p) => {
            const isMatched = matchedIds.includes(p.id);
            const isSelected = selectedUpper === p.upper;

            return (
              <button
                key={`upper_${p.id}`}
                onClick={() => !isMatched && handleSelectUpper(p.upper)}
                disabled={isMatched}
                className={`min-h-[58px] p-3 rounded-2xl font-black text-3xl transition active:scale-95 flex items-center justify-between cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 opacity-60'
                    : isSelected
                    ? 'bg-rose-500 text-white shadow-lg scale-105 border-3 border-rose-300'
                    : 'bg-white hover:bg-rose-50 text-rose-600 border-2 border-rose-200 shadow-xs'
                }`}
              >
                <span>{p.upper}</span>
                {isMatched && <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Colonne des minuscules mélangées */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 text-center">
            minuscules
          </span>
          {shuffledLowers.map((p) => {
            const isMatched = matchedIds.includes(p.id);

            return (
              <button
                key={`lower_${p.id}`}
                onClick={() => !isMatched && handleSelectLower(p)}
                disabled={isMatched}
                className={`min-h-[58px] p-3 rounded-2xl font-black text-3xl transition active:scale-95 flex items-center justify-between cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 opacity-60'
                    : 'bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-xs'
                }`}
              >
                <span>{p.lower}</span>
                {isMatched && <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {matchedIds.length === pairs.length && (
        <div className="mt-5 flex items-center gap-2 text-emerald-700 font-black text-lg animate-star-float">
          <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
          <span>Bravo ! Tu as réuni toutes les paires !</span>
        </div>
      )}
    </div>
  );
};
