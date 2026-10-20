import React, { useState } from 'react';
import { ChildProfile } from '../types/book';
import { sound, speakText } from '../utils/audio';
import { SvgIcons } from './SvgIcons';
import { X, Sparkles, Check, RotateCcw, Heart } from 'lucide-react';

interface ReviewGameModalProps {
  profile: ChildProfile;
  onResolveMistake: (type: string, value: string) => void;
  onAwardBonusStars: (count: number) => void;
  onClose: () => void;
}

export const ReviewGameModal: React.FC<ReviewGameModalProps> = ({
  profile,
  onResolveMistake,
  onAwardBonusStars,
  onClose,
}) => {
  // Construire la liste de révision : prendre les notions ratées ou notions de base par défaut
  const defaultReviewItems = [
    { type: 'letter', value: 'A', question: 'Quelle est cette lettre qui chante Ananas ?' },
    { type: 'letter', value: 'O', question: 'Quelle est cette lettre toute ronde comme une orange ?' },
    { type: 'number', value: '5', question: 'Combien de doigts as-tu sur une main ?' },
  ];

  const reviewItems = profile.reviewQueue.length > 0
    ? profile.reviewQueue.slice(0, 5).map(item => ({
        type: item.type,
        value: item.value,
        question: `Révise avec Kalo : ${item.type === 'letter' ? 'la lettre' : 'le nombre'} ${item.value} !`
      }))
    : defaultReviewItems;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentItem = reviewItems[currentIndex];

  const handleSuccessItem = () => {
    sound.playSuccess();
    speakText('Très bien retenu !');
    onResolveMistake(currentItem.type, currentItem.value);

    if (currentIndex < reviewItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCompleted(true);
      sound.playStarReward();
      onAwardBonusStars(2);
      speakText('Félicitations ! Tu as terminé ta petite révision du jour !');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#FAF6EE] rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-400 flex flex-col text-center">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-400 text-amber-950">
              <RotateCcw className="w-5 h-5 animate-spin" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                Jeu de Révision Express (5 min)
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Question {currentIndex + 1} sur {reviewItems.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!completed ? (
          <div className="flex flex-col items-center">
            {/* Mascotte Kalo */}
            <div className="mb-2">
              <SvgIcons.KaloMascot mood="happy" size={72} />
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-800 mb-4 px-2">
              {currentItem.question}
            </p>

            {/* Carte de révision centrale */}
            <div 
              onClick={() => {
                sound.playPop(520);
                speakText(currentItem.value);
              }}
              className="w-36 h-36 rounded-3xl bg-white border-4 border-amber-300 shadow-md flex items-center justify-center text-7xl font-black text-amber-600 mb-6 cursor-pointer hover:scale-105 active:scale-95 transition"
            >
              {currentItem.value}
            </div>

            {/* Boutons de validation */}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => {
                  sound.playPop(440);
                  speakText(currentItem.value);
                }}
                className="flex-1 py-3 px-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold text-sm transition"
              >
                Répéter
              </button>

              <button
                onClick={handleSuccessItem}
                className="flex-1 min-h-[56px] py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-lg shadow-emerald-400/40 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Je m'en souviens !</span>
              </button>
            </div>
          </div>
        ) : (
          /* Écran de félicitations */
          <div className="flex flex-col items-center py-4">
            <SvgIcons.KaloMascot mood="celebrating" size={100} className="kalo-jump" />
            <h4 className="text-2xl font-black text-slate-900 mt-3">
              Superbe mémoire !
            </h4>
            <p className="text-sm font-semibold text-slate-600 mt-1 mb-4">
              Tu as gagné <span className="text-amber-600 font-black">+2 étoiles d'or</span> pour ta collection !
            </p>

            <button
              onClick={onClose}
              className="w-full min-h-[54px] py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-lg transition active:scale-95"
            >
              Retourner au livre
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
