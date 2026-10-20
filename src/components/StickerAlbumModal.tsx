import React, { useState } from 'react';
import { STICKERS_CATALOG } from '../data/bookContent';
import { SvgIcons } from './SvgIcons';
import { sound } from '../utils/audio';
import { X, Sparkles, Award } from 'lucide-react';

interface StickerAlbumModalProps {
  earnedStickerIds: string[];
  placedStickers?: { id: string; stickerId: string; x: number; y: number }[];
  onSavePlacedStickers: (placed: { id: string; stickerId: string; x: number; y: number }[]) => void;
  onClose: () => void;
}

export const StickerAlbumModal: React.FC<StickerAlbumModalProps> = ({
  earnedStickerIds,
  placedStickers = [],
  onSavePlacedStickers,
  onClose,
}) => {
  const [stickersOnBoard, setStickersOnBoard] = useState(placedStickers);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const handlePlaceOnBoard = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedStickerId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newPlaced = [
      ...stickersOnBoard,
      {
        id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        stickerId: selectedStickerId,
        x,
        y,
      }
    ];

    setStickersOnBoard(newPlaced);
    onSavePlacedStickers(newPlaced);
    sound.playStarReward();
    setSelectedStickerId(null);
  };

  const renderStickerIcon = (iconName: string, size = 54) => {
    if (iconName === 'kalo_star') return <SvgIcons.KaloMascot mood="celebrating" size={size} />;
    if (iconName === 'mango_gold') return <SvgIcons.Mango size={size} />;
    if (iconName === 'baobab_gold') return <SvgIcons.Baobab size={size} />;
    if (iconName === 'calabash_gold') return <SvgIcons.Calabash size={size} />;
    if (iconName === 'hare_avatar') return <SvgIcons.HareAvatar size={size} />;
    if (iconName === 'chick') return <SvgIcons.Chick size={size} />;
    if (iconName === 'alphabet_medal') return <SvgIcons.AlphabetMedal size={size} />;
    return <SvgIcons.Star size={size} filled={true} />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none">
      <div className="bg-[#FAF6EE] rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border-4 border-amber-400 flex flex-col max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-400 text-amber-950 font-black">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Mon Cahier d'Autocollants
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Gagne des étoiles dans les chapitres pour débloquer de nouveaux autocollants !
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer active:scale-95 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tableau / Paysage pour coller ses autocollants */}
        <div
          onClick={handlePlaceOnBoard}
          className="relative w-full aspect-[16/9] bg-gradient-to-b from-[#87CEEB] via-[#FDE68A] to-[#D97706] rounded-2xl border-3 border-amber-300 shadow-inner overflow-hidden cursor-crosshair mb-4 group"
        >
          {/* Soleil et décor savane */}
          <div className="absolute top-4 right-8 w-14 h-14 rounded-full bg-[#FFE600] shadow-[0_0_30px_#FFE600] opacity-90" />
          <div className="absolute bottom-0 inset-x-0 h-10 bg-[#B45309] rounded-b-xl" />

          {/* Autocollants déjà collés sur le paysage */}
          {stickersOnBoard.map((item) => (
            <div
              key={item.id}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition duration-200 filter drop-shadow-lg"
            >
              {renderStickerIcon(item.stickerId, 58)}
            </div>
          ))}

          {selectedStickerId && (
            <div className="absolute inset-0 bg-black/15 flex items-center justify-center text-white font-extrabold text-sm sm:text-base pointer-events-none">
              <span className="bg-amber-500/90 px-4 py-2 rounded-full shadow-lg border-2 border-white animate-bounce">
                Touche n'importe où sur l'image pour le coller !
              </span>
            </div>
          )}
        </div>

        {/* Collection d'autocollants gagnés en bas */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600">
              Mes Autocollants ({earnedStickerIds.length} débloqués sur {STICKERS_CATALOG.length})
            </span>
            {selectedStickerId && (
              <span className="text-xs font-bold text-amber-700 bg-amber-200 px-2.5 py-0.5 rounded-full animate-pulse">
                Autocollant sélectionné
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {STICKERS_CATALOG.map((stk) => {
              const isEarned = earnedStickerIds.includes(stk.id);
              const isSelected = selectedStickerId === stk.id;

              return (
                <button
                  key={stk.id}
                  disabled={!isEarned}
                  onClick={() => {
                    if (isEarned) {
                      sound.playPop(520);
                      setSelectedStickerId(isSelected ? null : stk.id);
                    }
                  }}
                  className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                    isEarned
                      ? isSelected
                        ? 'bg-amber-400 border-3 border-amber-600 shadow-md scale-105'
                        : 'bg-white hover:bg-amber-50 border-2 border-amber-200 shadow-xs cursor-pointer active:scale-95'
                      : 'bg-slate-100 border-2 border-dashed border-slate-300 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    {renderStickerIcon(stk.icon, 44)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 text-center line-clamp-1">
                    {stk.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
