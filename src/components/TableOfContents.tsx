import React from 'react';
import { Chapter } from '../types/book';
import { sound } from '../utils/audio';
import { BookOpen, Star, Lock, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';

interface TableOfContentsProps {
  chapters: Chapter[];
  unlockedChapters: string[];
  starsCount: number;
  onSelectChapter: (chapter: Chapter) => void;
  onBackToCover: () => void;
  onOpenStickerAlbum: () => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  chapters,
  unlockedChapters,
  starsCount,
  onSelectChapter,
  onBackToCover,
  onOpenStickerAlbum,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#FAF6EE] text-slate-800 p-4 sm:p-6 flex flex-col items-center">
      {/* En-tête */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-6">
        <button
          onClick={() => {
            sound.playPageFlip();
            onBackToCover();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-amber-300 text-amber-900 font-extrabold text-sm shadow-sm hover:bg-amber-50 active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Fermer le livre</span>
        </button>

        {/* Album d'autocollants */}
        <button
          onClick={onOpenStickerAlbum}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 border-2 border-white text-amber-950 font-black text-sm shadow-md active:scale-95 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Mon Album d'Autocollants</span>
        </button>
      </div>

      {/* Titre décoré de la table des matières */}
      <div className="text-center mb-6 max-w-md">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-200/70 text-amber-900 font-black text-xs uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span>Table des Matières</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Choisis ton Chapitre !
        </h2>
        <p className="text-sm font-semibold text-slate-600 mt-1">
          Touche un chapitre pour tourner les pages jusqu'à l'aventure !
        </p>
      </div>

      {/* Liste des chapitres illustrés */}
      <div className="w-full max-w-2xl flex flex-col gap-4 pb-12">
        {chapters.map((chap, idx) => {
          const isUnlocked = unlockedChapters.includes(chap.id);
          const firstPageNumber = chap.pages[0]?.pageNumber || 1;

          return (
            <div
              key={chap.id}
              onClick={() => {
                if (isUnlocked) {
                  sound.playPageFlip();
                  onSelectChapter(chap);
                } else {
                  sound.playGentleEncouragement();
                }
              }}
              className={`relative overflow-hidden rounded-3xl border-3 p-4 sm:p-5 transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer select-none ${
                isUnlocked
                  ? 'bg-white hover:bg-amber-50/50 border-amber-300 shadow-md hover:scale-101 active:scale-98'
                  : 'bg-slate-100 border-slate-300 opacity-70 cursor-not-allowed'
              }`}
            >
              {/* Badge numéro & Icône du chapitre */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner font-black text-white shrink-0"
                  style={{ backgroundColor: isUnlocked ? chap.colorScheme.primary : '#94A3B8' }}
                >
                  {chap.badgeEmoji}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                      Chapitre {chap.number} &bull; Page {firstPageNumber}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      chap.subject === 'lecture' ? 'bg-rose-100 text-rose-700' :
                      chap.subject === 'calcul' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {chap.subject === 'lecture' ? 'Lecture' : chap.subject === 'calcul' ? 'Calcul' : 'Conte'}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    {chap.title.fr}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium line-clamp-1 mt-0.5">
                    {chap.description.fr}
                  </p>
                </div>
              </div>

              {/* Action / État débloqué */}
              <div className="flex items-center gap-2 shrink-0">
                {isUnlocked ? (
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
                    <ChevronRight className="w-6 h-6 stroke-[3]" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 text-slate-500 text-xs font-bold">
                    <Lock className="w-4 h-4" />
                    <span className="hidden sm:inline">À débloquer</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
