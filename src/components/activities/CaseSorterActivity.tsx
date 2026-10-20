import React, { useState } from 'react';
import { sound, speakText } from '../../utils/audio';
import { Sparkles, Check, ArrowDown } from 'lucide-react';

interface CaseSorterActivityProps {
  items: { id: string; letter: string; isUpper: boolean }[];
  onSuccess: () => void;
  onMistake: () => void;
}

export const CaseSorterActivity: React.FC<CaseSorterActivityProps> = ({
  items,
  onSuccess,
  onMistake,
}) => {
  const [remainingItems, setRemainingItems] = useState(items);
  const [upperBasket, setUpperBasket] = useState<string[]>([]);
  const [lowerBasket, setLowerBasket] = useState<string[]>([]);

  const activeItem = remainingItems[0];

  const handleSort = (target: 'upper' | 'lower') => {
    if (!activeItem) return;

    const isMatch = (target === 'upper' && activeItem.isUpper) || (target === 'lower' && !activeItem.isUpper);

    if (isMatch) {
      sound.playPop(480);
      speakText(`${activeItem.letter} dans le bon panier !`);

      if (target === 'upper') {
        setUpperBasket([...upperBasket, activeItem.letter]);
      } else {
        setLowerBasket([...lowerBasket, activeItem.letter]);
      }

      const nextRemaining = remainingItems.slice(1);
      setRemainingItems(nextRemaining);

      if (nextRemaining.length === 0) {
        sound.playSuccess();
        setTimeout(onSuccess, 800);
      }
    } else {
      sound.playGentleEncouragement();
      speakText(`Oups ! Regarde bien la taille de la lettre ${activeItem.letter} !`);
      onMistake();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-amber-50/80 p-5 rounded-3xl border-3 border-amber-300 shadow-md">
      <div className="text-center mb-4">
        <h4 className="text-lg font-black text-slate-800">
          Le Grand Tri : Majuscules ou Minuscules ?
        </h4>
        <p className="text-xs font-semibold text-slate-600">
          Envoie la lettre dans le grand panier des MAJUSCULES ou dans le panier des minuscules.
        </p>
      </div>

      {/* Lettre active à trier */}
      {activeItem ? (
        <div className="flex flex-col items-center my-3 animate-star-float">
          <div className="w-28 h-28 rounded-3xl bg-white border-4 border-amber-400 shadow-lg flex items-center justify-center text-6xl font-black text-rose-600">
            {activeItem.letter}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mt-2">
            <ArrowDown className="w-4 h-4 animate-bounce" />
            <span>Où dois-je ranger cette lettre ?</span>
          </div>
        </div>
      ) : (
        <div className="my-6 text-center">
          <Sparkles className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-2" />
          <span className="text-xl font-black text-emerald-700">Toutes les lettres sont triées !</span>
        </div>
      )}

      {/* Les deux paniers récepteurs */}
      <div className="grid grid-cols-2 gap-4 w-full mt-4">
        {/* Panier des Majuscules */}
        <button
          onClick={() => handleSort('upper')}
          disabled={!activeItem}
          className="min-h-[140px] p-4 rounded-3xl bg-rose-50 hover:bg-rose-100 border-3 border-rose-300 flex flex-col items-center justify-between shadow-md active:scale-95 transition cursor-pointer"
        >
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-wider text-rose-700 block">
              Grand Panier
            </span>
            <span className="text-base font-black text-slate-800">
              MAJUSCULES (A, B, C...)
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center mt-2 max-w-[140px]">
            {upperBasket.map((l, i) => (
              <span key={i} className="text-sm font-black text-rose-600 bg-white px-2 py-0.5 rounded-lg border border-rose-200">
                {l}
              </span>
            ))}
          </div>

          <span className="text-xs font-bold text-rose-700 bg-rose-200 px-3 py-1 rounded-full mt-2">
            Touche ici pour Majuscule
          </span>
        </button>

        {/* Panier des Minuscules */}
        <button
          onClick={() => handleSort('lower')}
          disabled={!activeItem}
          className="min-h-[140px] p-4 rounded-3xl bg-blue-50 hover:bg-blue-100 border-3 border-blue-300 flex flex-col items-center justify-between shadow-md active:scale-95 transition cursor-pointer"
        >
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-wider text-blue-700 block">
              Petit Panier
            </span>
            <span className="text-base font-black text-slate-800">
              minuscules (a, b, c...)
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center mt-2 max-w-[140px]">
            {lowerBasket.map((l, i) => (
              <span key={i} className="text-sm font-black text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                {l}
              </span>
            ))}
          </div>

          <span className="text-xs font-bold text-blue-700 bg-blue-200 px-3 py-1 rounded-full mt-2">
            Touche ici pour Minuscule
          </span>
        </button>
      </div>
    </div>
  );
};
