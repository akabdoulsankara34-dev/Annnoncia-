import React, { useState } from 'react';
import { SvgIcons } from '../SvgIcons';
import { sound, speakText } from '../../utils/audio';
import { Sparkles, Check, Plus, Package } from 'lucide-react';
import { MultilingualText } from '../../types/book';

interface TensAndUnitsActivityProps {
  tens: number;
  units: number;
  itemName: MultilingualText;
  itemType: 'mango' | 'coin' | 'calabash';
  onSuccess: () => void;
  onMistake?: () => void;
}

export const TensAndUnitsActivity: React.FC<TensAndUnitsActivityProps> = ({
  tens,
  units,
  itemName,
  itemType,
  onSuccess,
  onMistake,
}) => {
  const total = tens * 10 + units;
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // 3 choix pour l'enfant (hauteur min 56px)
  const options = [
    total - 10 > 0 ? total - 10 : total + 2,
    total,
    total + 10 <= 50 ? total + 10 : total - 2
  ].sort((a, b) => a - b);

  const handleChoose = (choice: number) => {
    setSelectedChoice(choice);

    if (choice === total) {
      setIsCompleted(true);
      sound.playSuccess();
      speakText(`Exact ! ${tens} paquets de 10 et ${units} unités, ça fait ${total} !`);
      setTimeout(() => {
        onSuccess();
      }, 900);
    } else {
      sound.playGentleEncouragement();
      speakText(`Oups ! Recompte les paquets de 10 : chaque paquet vaut 10 !`);
      if (onMistake) onMistake();
      setTimeout(() => setSelectedChoice(null), 1200);
    }
  };

  const renderSingleIcon = () => {
    if (itemType === 'coin') return <SvgIcons.CoinFCFA size={36} />;
    if (itemType === 'calabash') return <SvgIcons.Calabash size={36} />;
    return <SvgIcons.Mango size={36} />;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-amber-50/90 p-5 rounded-3xl border-3 border-amber-300 shadow-md select-none">
      {/* En-tête de la consigne */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-amber-900 font-black text-xs uppercase tracking-wider mb-1">
          <Package className="w-3.5 h-3.5" />
          <span>Dizaines et Unités (jusqu'à 50)</span>
        </div>
        <h4 className="text-lg sm:text-xl font-black text-slate-800">
          Combien y a-t-il d'objets en tout ?
        </h4>
        <p className="text-xs font-semibold text-slate-600">
          Chaque grand panier contient <strong>10 {itemName.fr}</strong>. Compte les dizaines, puis les unités !
        </p>
      </div>

      {/* Zone visuelle de manipulation : Les paquets de 10 + les unités */}
      <div className="w-full bg-white p-4 rounded-3xl border-2 border-amber-200 shadow-inner flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
        {/* Les Dizaines (Paquets de 10) */}
        <div className="flex flex-col items-center p-3 bg-amber-100/60 rounded-2xl border border-amber-300">
          <span className="text-xs font-black uppercase tracking-wider text-amber-800 mb-2">
            {tens} Paquets de 10 ({tens * 10})
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-[220px]">
            {Array.from({ length: tens }).map((_, i) => (
              <div
                key={`ten_${i}`}
                onClick={() => {
                  sound.playPop(420);
                  speakText(`Paquet de 10 ! Déjà ${(i + 1) * 10} !`);
                }}
                className="p-2 rounded-2xl bg-amber-300/80 hover:bg-amber-400 border-2 border-amber-500 shadow-xs flex flex-col items-center cursor-pointer active:scale-95 transition"
                title="Touche pour compter de 10 en 10"
              >
                <div className="flex -space-x-2">
                  {renderSingleIcon()}
                  {renderSingleIcon()}
                </div>
                <span className="text-xs font-black text-amber-950 mt-1">10</span>
              </div>
            ))}
          </div>
        </div>

        <Plus className="w-6 h-6 text-slate-400 stroke-[3]" />

        {/* Les Unités */}
        <div className="flex flex-col items-center p-3 bg-blue-50/70 rounded-2xl border border-blue-200">
          <span className="text-xs font-black uppercase tracking-wider text-blue-800 mb-2">
            {units} Unités seules ({units})
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[140px] min-h-[60px]">
            {Array.from({ length: units }).map((_, i) => (
              <div
                key={`unit_${i}`}
                onClick={() => {
                  sound.playPop(520);
                  speakText(`Une unité : ${i + 1}`);
                }}
                className="cursor-pointer active:scale-90 transition"
              >
                {renderSingleIcon()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 grands choix pour l'enfant */}
      <div className="w-full flex flex-col items-center">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Choisis le bon nombre au total :
        </span>

        <div className="flex items-center justify-center gap-3 w-full">
          {options.map((opt) => {
            const isSelected = selectedChoice === opt;
            const isCorrect = isSelected && opt === total;
            const isWrong = isSelected && opt !== total;

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
          <span>Bravo ! Tu sais compter avec les dizaines !</span>
        </div>
      )}
    </div>
  );
};
