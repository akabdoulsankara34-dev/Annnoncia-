import React from 'react';
import { Chapter } from '../types/book';
import { sound } from '../utils/audio';
import { BookOpen, Sparkles, ChevronRight, ArrowLeft, Unlock, Lock, CheckCircle2 } from 'lucide-react';

interface TableOfContentsProps {
  chapters: Chapter[];
  unlockedChapters: string[];
  starsCount: number;
  allChaptersUnlocked?: boolean;
  onSelectChapter: (chapter: Chapter) => void;
  onBackToCover: () => void;
  onOpenStickerAlbum: () => void;
  onUnlockChapter?: (chapterId: string) => void;
  onToggleChapterUnlock?: (chapterId: string) => void;
  onUnlockAllChapters?: () => void;
  onToggleAllChaptersUnlocked?: () => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  chapters,
  unlockedChapters,
  starsCount,
  allChaptersUnlocked = false,
  onSelectChapter,
  onBackToCover,
  onOpenStickerAlbum,
  onUnlockChapter,
  onToggleChapterUnlock,
  onUnlockAllChapters,
  onToggleAllChaptersUnlocked,
}) => {
  const areAllUnlocked = allChaptersUnlocked || chapters.every(c => unlockedChapters.includes(c.id));

  return (
    <div className="min-h-screen w-full bg-[#FAF6EE] text-slate-800 p-4 sm:p-6 flex flex-col items-center">
      {/* En-tête */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={() => {
            sound.playPageFlip();
            onBackToCover();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-amber-300 text-amber-900 font-extrabold text-sm shadow-sm hover:bg-amber-50 active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Fermer le livre</span>
        </button>

        {/* Album d'autocollants */}
        <button
          onClick={onOpenStickerAlbum}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 border-2 border-white text-amber-950 font-black text-sm shadow-md active:scale-95 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Mon Album d'Autocollants</span>
        </button>
      </div>

      {/* Titre décoré de la table des matières */}
      <div className="text-center mb-4 max-w-md">
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

      {/* Barre de contrôle manuel des chapitres */}
      <div className="w-full max-w-2xl mb-5 bg-white/95 border-2 border-amber-200 rounded-3xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              areAllUnlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {areAllUnlocked ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Unlock className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 font-black text-slate-800 text-xs sm:text-sm">
              <span>Accès aux chapitres</span>
              {areAllUnlocked ? (
                <span className="text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full text-[11px]">
                  ✨ Tous débloqués
                </span>
              ) : (
                <span className="text-amber-800 font-extrabold bg-amber-100 px-2 py-0.5 rounded-full text-[11px]">
                  {unlockedChapters.length} / {chapters.length} ouverts
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {areAllUnlocked
                ? 'Tous les chapitres sont accessibles librement. Clique sur n’importe quel chapitre.'
                : 'Tu peux débloquer chaque chapitre manuellement avec le bouton dédié ou tout débloquer.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          {!areAllUnlocked ? (
            <button
              onClick={() => {
                if (onUnlockAllChapters) onUnlockAllChapters();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs sm:text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Tout débloquer manuellement</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (onToggleAllChaptersUnlocked) onToggleAllChaptersUnlocked();
              }}
              className="w-full sm:w-auto px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="Revenir au mode guidé progressif"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Mode guidé</span>
            </button>
          )}
        </div>
      </div>

      {/* Liste des chapitres illustrés */}
      <div className="w-full max-w-2xl flex flex-col gap-4 pb-12">
        {chapters.map((chap) => {
          const isUnlocked = areAllUnlocked || unlockedChapters.includes(chap.id);
          const firstPageNumber = chap.pages[0]?.pageNumber || 1;

          return (
            <div
              key={chap.id}
              onClick={() => {
                if (isUnlocked) {
                  sound.playPageFlip();
                  onSelectChapter(chap);
                } else {
                  // Déblocage automatique en touchant la carte + ouverture
                  if (onUnlockChapter) {
                    onUnlockChapter(chap.id);
                  }
                  sound.playPageFlip();
                  onSelectChapter(chap);
                }
              }}
              className={`relative overflow-hidden rounded-3xl border-3 p-4 sm:p-5 transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer select-none ${
                isUnlocked
                  ? 'bg-white hover:bg-amber-50/60 border-amber-300 shadow-md hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-amber-50/40 hover:bg-amber-50/80 border-dashed border-amber-300/80 shadow-xs hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {/* Badge numéro & Icône du chapitre */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner font-black text-white shrink-0"
                  style={{ backgroundColor: isUnlocked ? chap.colorScheme.primary : '#D97706' }}
                >
                  {chap.badgeEmoji}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                      Chapitre {chap.number} &bull; Page {firstPageNumber}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        chap.subject === 'lecture'
                          ? 'bg-rose-100 text-rose-700'
                          : chap.subject === 'calcul'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {chap.subject === 'lecture'
                        ? 'Lecture'
                        : chap.subject === 'calcul'
                        ? 'Calcul'
                        : 'Conte'}
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

              {/* Action / État débloqué ou bouton Débloquer manuellement */}
              <div className="flex items-center gap-2 shrink-0">
                {isUnlocked ? (
                  <div className="flex items-center gap-2">
                    {onToggleChapterUnlock && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleChapterUnlock(chap.id);
                        }}
                        className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                        title="Verrouiller manuellement ce chapitre"
                      >
                        <Lock className="w-3 h-3" />
                      </button>
                    )}
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
                      <ChevronRight className="w-6 h-6 stroke-[3]" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onUnlockChapter) {
                          onUnlockChapter(chap.id);
                        }
                      }}
                      className="px-3.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
                      title="Débloquer ce chapitre manuellement"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Débloquer</span>
                    </button>
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
