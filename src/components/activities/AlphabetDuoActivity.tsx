import React, { useState } from 'react';
import { SvgIcons } from '../SvgIcons';
import { sound, speakText } from '../../utils/audio';
import { Volume2, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { MultilingualText } from '../../types/book';

interface AlphabetDuoActivityProps {
  letters: {
    upper: string;
    lower: string;
    word: MultilingualText;
    phonetic: string;
    iconSvg?: string;
  }[];
  onSuccess: () => void;
}

export const AlphabetDuoActivity: React.FC<AlphabetDuoActivityProps> = ({
  letters,
  onSuccess,
}) => {
  const [selectedCase, setSelectedCase] = useState<'both' | 'upper' | 'lower' | 'cursive'>('both');
  const [exploredLetters, setExploredLetters] = useState<string[]>([]);
  const [activeLetterIdx, setActiveLetterIdx] = useState<number>(0);

  const handlePronounce = (item: typeof letters[0], caseType: 'upper' | 'lower' | 'both') => {
    sound.playPop(520);
    const textToSay = caseType === 'upper' 
      ? `Grand ${item.upper} majuscule, comme ${item.word.fr}`
      : caseType === 'lower'
      ? `Petit ${item.lower} minuscule, comme ${item.word.fr}`
      : `${item.upper} majuscule, ${item.lower} minuscule. Le son fait : ${item.phonetic}. Comme dans ${item.word.fr} !`;

    speakText(textToSay, { rate: 0.82 });

    if (!exploredLetters.includes(item.upper)) {
      const next = [...exploredLetters, item.upper];
      setExploredLetters(next);
      if (next.length === letters.length) {
        setTimeout(() => {
          sound.playSuccess();
          onSuccess();
        }, 800);
      }
    }
  };

  const renderIcon = (name?: string) => {
    if (!name) return <SvgIcons.Mango size={56} />;
    if (name === 'Pineapple') return <SvgIcons.Pineapple size={56} />;
    if (name === 'Baobab') return <SvgIcons.Baobab size={56} />;
    if (name === 'Calabash') return <SvgIcons.Calabash size={56} />;
    if (name === 'Elephant') return <SvgIcons.Elephant size={56} />;
    if (name === 'Chick') return <SvgIcons.Chick size={56} />;
    if (name === 'OrangeFruit') return <SvgIcons.OrangeFruit size={56} />;
    if (name === 'Yam') return <SvgIcons.Yam size={56} />;
    if (name === 'Bicycle') return <SvgIcons.Bicycle size={56} />;
    if (name === 'Giraffe') return <SvgIcons.Giraffe size={56} />;
    if (name === 'Sun') return <SvgIcons.Sun size={56} />;
    if (name === 'Turtle') return <SvgIcons.Turtle size={56} />;
    if (name === 'Zebra') return <SvgIcons.Zebra size={56} />;
    return <SvgIcons.Mango size={56} />;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-amber-50/80 p-5 rounded-3xl border-3 border-amber-300 shadow-md">
      {/* Sélecteur de casse : Majuscule / Minuscule / Les Deux */}
      <div className="flex items-center gap-2 mb-4 bg-white p-1.5 rounded-2xl border-2 border-amber-200 shadow-xs">
        <button
          onClick={() => setSelectedCase('both')}
          className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer ${
            selectedCase === 'both' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Aa (Les 2)
        </button>
        <button
          onClick={() => setSelectedCase('upper')}
          className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer ${
            selectedCase === 'upper' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          MAJ (A)
        </button>
        <button
          onClick={() => setSelectedCase('lower')}
          className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer ${
            selectedCase === 'lower' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          min (a)
        </button>
        <button
          onClick={() => setSelectedCase('cursive')}
          className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer ${
            selectedCase === 'cursive' ? 'bg-indigo-600 text-white shadow-xs' : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
          }`}
        >
          ✍️ Manuscrit
        </button>
      </div>

      {/* Cartes interactives des lettres de la page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {letters.map((item, idx) => {
          const isExplored = exploredLetters.includes(item.upper);

          return (
            <div
              key={item.upper}
              onClick={() => handlePronounce(item, selectedCase === 'cursive' ? 'both' : selectedCase)}
              className="relative p-5 rounded-3xl bg-white border-3 border-amber-300 hover:border-amber-400 shadow-md hover:scale-102 active:scale-98 transition flex flex-col items-center text-center cursor-pointer group"
            >
              {/* Badge exploré */}
              {isExplored && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              {/* Affichage des lettres en grand format */}
              <div className="flex items-baseline justify-center gap-3 my-2">
                {selectedCase === 'cursive' ? (
                  <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
                    <span className="text-5xl sm:text-6xl font-manuscrit text-indigo-900 group-hover:scale-110 transition">
                      {item.lower}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                      Cursive attachée
                    </span>
                  </div>
                ) : (
                  <>
                    {(selectedCase === 'both' || selectedCase === 'upper') && (
                      <span className="text-6xl sm:text-7xl font-black text-rose-500 group-hover:scale-110 transition drop-shadow-xs">
                        {item.upper}
                      </span>
                    )}
                    {(selectedCase === 'both' || selectedCase === 'lower') && (
                      <span className="text-5xl sm:text-6xl font-black text-blue-600 group-hover:scale-110 transition drop-shadow-xs">
                        {item.lower}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Mot-image associé */}
              <div className="flex items-center gap-2 mt-2 bg-amber-50 px-3.5 py-1.5 rounded-2xl border border-amber-200">
                {renderIcon(item.iconSvg)}
                <div className="text-left">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                    Comme dans
                  </span>
                  <span className="text-base sm:text-lg font-black text-slate-800">
                    {item.word.fr}
                  </span>
                </div>
              </div>

              {/* Bouton écouter */}
              <button className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1 rounded-full transition">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Touche pour chanter</span>
              </button>
            </div>
          );
        })}
      </div>

      {exploredLetters.length === letters.length && (
        <div className="mt-4 flex items-center gap-2 text-emerald-700 font-black text-base animate-star-float">
          <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
          <span>Bravo ! Tu connais bien ces lettres en majuscule et minuscule !</span>
        </div>
      )}
    </div>
  );
};
