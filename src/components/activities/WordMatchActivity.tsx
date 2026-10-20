import React, { useState } from 'react';
import { SvgIcons } from '../SvgIcons';
import { sound, speakText } from '../../utils/audio';
import { Sparkles, Check } from 'lucide-react';
import { MultilingualText } from '../../types/book';

interface WordMatchActivityProps {
  pairs: {
    id: string;
    word: MultilingualText;
    iconSvg: string;
  }[];
  onSuccess: () => void;
  onMistake: () => void;
}

export const WordMatchActivity: React.FC<WordMatchActivityProps> = ({
  pairs,
  onSuccess,
  onMistake,
}) => {
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  const handleSelectWord = (id: string, text: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedWordId(id);
    sound.playPop(440);
    speakText(text);
  };

  const handleSelectImage = (id: string) => {
    if (matchedIds.includes(id) || !selectedWordId) return;

    if (selectedWordId === id) {
      const nextMatched = [...matchedIds, id];
      setMatchedIds(nextMatched);
      setSelectedWordId(null);
      sound.playSuccess();
      speakText('Bravo ! C’est bien ça !');

      if (nextMatched.length === pairs.length) {
        setTimeout(() => {
          onSuccess();
        }, 600);
      }
    } else {
      sound.playGentleEncouragement();
      speakText('Oups, essaie une autre image !');
      onMistake();
      setSelectedWordId(null);
    }
  };

  const renderIcon = (name: string) => {
    if (name === 'Pineapple') return <SvgIcons.Pineapple size={56} />;
    if (name === 'OrangeFruit') return <SvgIcons.OrangeFruit size={56} />;
    if (name === 'Elephant') return <SvgIcons.Elephant size={56} />;
    if (name === 'Yam') return <SvgIcons.Yam size={56} />;
    if (name === 'Factory') return <SvgIcons.Factory size={56} />;
    return <SvgIcons.Mango size={56} />;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-amber-50/80 p-5 rounded-3xl border-3 border-amber-300 shadow-md">
      <p className="text-slate-700 font-extrabold text-sm sm:text-base mb-4 text-center">
        Touche d'abord un mot, puis touche son image correspondante !
      </p>

      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Colonne des mots */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">1. Mots</span>
          {pairs.map((p) => {
            const isMatched = matchedIds.includes(p.id);
            const isSelected = selectedWordId === p.id;

            return (
              <button
                key={`word_${p.id}`}
                onClick={() => handleSelectWord(p.id, p.word.fr)}
                disabled={isMatched}
                className={`min-h-[64px] px-4 py-3 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-between cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 opacity-80'
                    : isSelected
                    ? 'bg-amber-400 text-amber-950 border-3 border-amber-600 shadow-md scale-102'
                    : 'bg-white hover:bg-amber-50 text-slate-800 border-2 border-amber-200 shadow-xs'
                }`}
              >
                <span>{p.word.fr}</span>
                {isMatched && <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Colonne des images */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">2. Images</span>
          {pairs.map((p) => {
            const isMatched = matchedIds.includes(p.id);

            return (
              <button
                key={`img_${p.id}`}
                onClick={() => handleSelectImage(p.id)}
                disabled={isMatched}
                className={`min-h-[64px] p-2 rounded-2xl transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-100 border-2 border-emerald-400 opacity-80'
                    : 'bg-white hover:bg-amber-50 border-2 border-amber-200 shadow-xs hover:border-amber-400'
                }`}
              >
                {renderIcon(p.iconSvg)}
              </button>
            );
          })}
        </div>
      </div>

      {matchedIds.length === pairs.length && (
        <div className="mt-4 flex items-center gap-2 text-emerald-700 font-black text-lg animate-star-float">
          <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
          <span>Bravo ! Tu as trouvé toutes les paires !</span>
        </div>
      )}
    </div>
  );
};
