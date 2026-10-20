import React, { useState } from 'react';
import { SvgIcons } from '../SvgIcons';
import { sound, speakText } from '../../utils/audio';
import { Sparkles, Volume2 } from 'lucide-react';
import { MultilingualText } from '../../types/book';

interface SyllableMixerActivityProps {
  consonant: string;
  vowels: string[];
  sampleWord?: MultilingualText;
  wordImageSvg?: string;
  onSuccess: () => void;
}

export const SyllableMixerActivity: React.FC<SyllableMixerActivityProps> = ({
  consonant,
  vowels,
  sampleWord,
  wordImageSvg,
  onSuccess,
}) => {
  const [activeVowel, setActiveVowel] = useState<string>(vowels[0] || 'A');
  const [exploredVowels, setExploredVowels] = useState<string[]>([vowels[0] || 'A']);
  const [hasCompleted, setHasCompleted] = useState(false);

  const activeSyllable = `${consonant.toUpperCase()}${activeVowel.toLowerCase()}`;

  const handleSelectVowel = (vowel: string) => {
    setActiveVowel(vowel);
    const syllable = `${consonant}${vowel}`.toLowerCase();
    
    sound.playPop(480);
    speakText(`${syllable} !`, {
      rate: 0.8,
      pitch: 1.2
    });

    if (!exploredVowels.includes(vowel)) {
      const next = [...exploredVowels, vowel];
      setExploredVowels(next);
      if (next.length >= Math.min(3, vowels.length) && !hasCompleted) {
        setHasCompleted(true);
        setTimeout(() => {
          sound.playSuccess();
          onSuccess();
        }, 600);
      }
    }
  };

  const handlePronounceWord = () => {
    if (sampleWord?.fr) {
      sound.playPop(520);
      speakText(`${sampleWord.fr} !`);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-emerald-50/80 p-5 rounded-3xl border-3 border-emerald-300 shadow-md">
      {/* Mot exemple associé avec illustration */}
      {sampleWord && (
        <div 
          onClick={handlePronounceWord}
          className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border-2 border-emerald-200 shadow-xs mb-4 cursor-pointer hover:bg-emerald-50/50 transition group"
        >
          {wordImageSvg === 'Mango' && <SvgIcons.Mango size={48} />}
          {wordImageSvg === 'Star' && <SvgIcons.Star size={48} filled={true} />}
          {wordImageSvg === 'Baobab' && <SvgIcons.Baobab size={48} />}

          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Mot du jour</div>
            <div className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <span>{sampleWord.fr}</span>
              <Volume2 className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition" />
            </div>
          </div>
        </div>
      )}

      {/* Syllabe active géante fusionnée */}
      <div className="relative flex items-center justify-center gap-3 my-2 p-5 bg-white rounded-3xl border-3 border-emerald-400 shadow-lg w-full max-w-xs">
        <span className="text-6xl font-black text-emerald-700 animate-pulse">
          {consonant}
        </span>
        <span className="text-4xl font-bold text-slate-400">+</span>
        <span className="text-6xl font-black text-amber-500">
          {activeVowel}
        </span>
        <span className="text-4xl font-bold text-slate-400">=</span>
        <span className="text-6xl font-black text-rose-500 scale-110 drop-shadow-md">
          {activeSyllable}
        </span>

        <button 
          onClick={() => {
            sound.playPop(500);
            speakText(activeSyllable);
          }}
          className="absolute -top-3 -right-3 p-2 bg-amber-400 hover:bg-amber-500 rounded-full text-amber-950 shadow-md border-2 border-white cursor-pointer active:scale-95"
          title="Écouter la syllabe"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Clavier tactile des voyelles à associer */}
      <div className="mt-5 w-full">
        <p className="text-slate-700 font-extrabold text-sm sm:text-base mb-3 text-center">
          Touche une voyelle pour fabriquer une nouvelle syllabe :
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {vowels.map((v) => {
            const isSelected = activeVowel === v;
            const isExplored = exploredVowels.includes(v);

            return (
              <button
                key={v}
                onClick={() => handleSelectVowel(v)}
                className={`min-h-[58px] min-w-[58px] rounded-2xl font-black text-2xl shadow-md transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white scale-110 border-3 border-amber-300 shadow-amber-400/50'
                    : isExplored
                    ? 'bg-white text-emerald-800 border-2 border-emerald-300'
                    : 'bg-white/80 text-slate-700 border-2 border-dashed border-slate-300 hover:bg-white'
                }`}
              >
                <span>{v}</span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {consonant.toLowerCase()}{v.toLowerCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {hasCompleted && (
        <div className="mt-4 flex items-center gap-2 text-emerald-800 font-black text-base animate-star-float">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Super ! Tu sais lire les syllabes avec {consonant} !</span>
        </div>
      )}
    </div>
  );
};
