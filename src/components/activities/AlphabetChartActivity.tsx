import React, { useState } from 'react';
import { sound, speakText } from '../../utils/audio';
import { Volume2, Play, Sparkles, CheckCircle2 } from 'lucide-react';

export const AlphabetChartActivity: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [displayMode, setDisplayMode] = useState<'both' | 'upper' | 'lower'>('both');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [isPlayingSong, setIsPlayingSong] = useState(false);

  const alphabet = [
    { u: 'A', l: 'a', w: 'Ananas' },
    { u: 'B', l: 'b', w: 'Baobab' },
    { u: 'C', l: 'c', w: 'Calebasse' },
    { u: 'D', l: 'd', w: 'Dromadaire' },
    { u: 'E', l: 'e', w: 'Éléphant' },
    { u: 'F', l: 'f', w: 'Fennec' },
    { u: 'G', l: 'g', w: 'Girafe' },
    { u: 'H', l: 'h', w: 'Hyène' },
    { u: 'I', l: 'i', w: 'Igname' },
    { u: 'J', l: 'j', w: 'Jarre' },
    { u: 'K', l: 'k', w: 'Karité' },
    { u: 'L', l: 'l', w: 'Lion' },
    { u: 'M', l: 'm', w: 'Mangue' },
    { u: 'N', l: 'n', w: 'Nénuphar' },
    { u: 'O', l: 'o', w: 'Orange' },
    { u: 'P', l: 'p', w: 'Poussin' },
    { u: 'Q', l: 'q', w: 'Quenouille' },
    { u: 'R', l: 'r', w: 'Rame' },
    { u: 'S', l: 's', w: 'Soleil' },
    { u: 'T', l: 't', w: 'Tortue' },
    { u: 'U', l: 'u', w: 'Usine' },
    { u: 'V', l: 'v', w: 'Vélo' },
    { u: 'W', l: 'w', w: 'Wagon' },
    { u: 'X', l: 'x', w: 'Xylophone' },
    { u: 'Y', l: 'y', w: 'Yoyo' },
    { u: 'Z', l: 'z', w: 'Zèbre' },
  ];

  const handleTapLetter = (item: typeof alphabet[0]) => {
    setActiveLetter(item.u);
    sound.playPop(520);
    speakText(`${item.u} majuscule, ${item.l} minuscule, comme ${item.w}`);
  };

  const handlePlaySong = () => {
    if (isPlayingSong) return;
    setIsPlayingSong(true);

    const songText = alphabet.map(a => a.u).join(', ');
    speakText(`Voici l'alphabet de A à Z : ${songText} ! Et voilà tout l'alphabet !`, {
      rate: 0.85,
      onEnd: () => {
        setIsPlayingSong(false);
        sound.playSuccess();
        onSuccess();
      }
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-amber-50/80 p-5 rounded-3xl border-3 border-amber-300 shadow-md">
      {/* Contrôles supérieurs */}
      <div className="flex flex-wrap items-center justify-between gap-2 w-full mb-4">
        {/* Sélecteur de casse */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-amber-200">
          <button
            onClick={() => setDisplayMode('both')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
              displayMode === 'both' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            Aa
          </button>
          <button
            onClick={() => setDisplayMode('upper')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
              displayMode === 'upper' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            MAJ
          </button>
          <button
            onClick={() => setDisplayMode('lower')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
              displayMode === 'lower' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            min
          </button>
        </div>

        {/* Bouton chanter tout l'alphabet */}
        <button
          onClick={handlePlaySong}
          disabled={isPlayingSong}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isPlayingSong ? 'Écoute la chanson...' : "Chanter l'Alphabet !"}</span>
        </button>
      </div>

      {/* Grille des 26 lettres de l'alphabet */}
      <div className="grid grid-cols-6 sm:grid-cols-7 gap-2 w-full p-3 bg-white rounded-2xl border-2 border-amber-200 shadow-inner">
        {alphabet.map((item) => {
          const isSelected = activeLetter === item.u;

          return (
            <button
              key={item.u}
              onClick={() => handleTapLetter(item)}
              className={`p-2 rounded-xl flex flex-col items-center justify-center transition active:scale-90 cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-amber-950 ring-3 ring-amber-500 scale-110 shadow-md'
                  : 'bg-amber-50/60 hover:bg-amber-100 text-slate-800 border border-amber-200'
              }`}
            >
              <span className="text-xl sm:text-2xl font-black">
                {displayMode === 'both' ? `${item.u}${item.l}` : displayMode === 'upper' ? item.u : item.l}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between w-full px-2 text-xs font-bold text-slate-500">
        <span>Touche n'importe quelle lettre pour écouter son chant !</span>
        <button
          onClick={onSuccess}
          className="text-emerald-700 font-extrabold hover:underline cursor-pointer"
        >
          Je connais mon alphabet !
        </button>
      </div>
    </div>
  );
};
