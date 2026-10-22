import React from 'react';
import { SvgIcons } from './SvgIcons';
import { ChildProfile } from '../types/book';
import { BookOpen, Sparkles, Star, User } from 'lucide-react';
import { sound } from '../utils/audio';

interface BookCoverProps {
  activeProfile: ChildProfile;
  onOpenBook: () => void;
  onOpenProfileSelect: () => void;
  onOpenParentSpace: () => void;
  onOpenLireEtCompter?: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({
  activeProfile,
  onOpenBook,
  onOpenProfileSelect,
  onOpenParentSpace,
  onOpenLireEtCompter,
}) => {
  const handleOpen = () => {
    sound.playPageFlip();
    onOpenBook();
  };

  const renderAvatar = (avatar: string) => {
    if (avatar === 'lionceau') return <SvgIcons.LionAvatar size={48} />;
    if (avatar === 'gazelle') return <SvgIcons.GazelleAvatar size={48} />;
    if (avatar === 'fennec') return <SvgIcons.FennecAvatar size={48} />;
    if (avatar === 'lievre') return <SvgIcons.HareAvatar size={48} />;
    return <SvgIcons.KaloMascot size={48} />;
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#1B4965] via-[#2B6CB0] to-[#0F2D3C] text-white overflow-hidden">
      {/* Motifs traditionnels wax stylisés en arrière-plan */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FFE600_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Barre supérieure d'en-tête (profil enfant & espace parent discret) */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 z-10 px-2">
        {/* Sélecteur de profil enfant */}
        <button
          onClick={onOpenProfileSelect}
          className="flex items-center gap-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 border-2 border-white/40 rounded-full py-1.5 px-3.5 shadow-md transition active:scale-95 cursor-pointer"
          title="Changer d'enfant"
        >
          <div className="rounded-full overflow-hidden w-9 h-9 border-2 border-amber-300 bg-white">
            {renderAvatar(activeProfile.avatar)}
          </div>
          <div className="text-left">
            <span className="text-xs text-amber-200 block font-semibold leading-tight">Élève CP</span>
            <span className="text-sm font-black text-white">{activeProfile.name}</span>
          </div>
          <User className="w-4 h-4 text-white/70 ml-1" />
        </button>

        {/* Étoiles récoltées */}
        <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 font-black text-sm px-3.5 py-1.5 rounded-full shadow-md border-2 border-white">
          <Star className="w-4 h-4 fill-amber-900" />
          <span>{activeProfile.starsCount}</span>
        </div>
      </div>

      {/* Le Livre 3D fermé avec sa couverture et sa tranche */}
      <div 
        onClick={handleOpen}
        className="relative w-full max-w-sm aspect-[3/4.2] rounded-3xl bg-gradient-to-tr from-[#9B2226] via-[#AE2012] to-[#BB3E03] p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-4 border-[#FFB703] cursor-pointer group transform transition-all duration-500 hover:scale-102 hover:-rotate-1 active:scale-98 select-none"
      >
        {/* Tranche du livre visible à gauche */}
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/50 via-black/20 to-transparent rounded-l-2xl pointer-events-none"></div>
        {/* Rainure de reliure */}
        <div className="absolute top-2 bottom-2 left-6 w-1 bg-amber-300/40 rounded-full shadow-inner"></div>

        {/* Cadre intérieur doré à motifs géométriques */}
        <div className="w-full h-full rounded-2xl border-2 border-dashed border-amber-300/60 p-4 flex flex-col items-center justify-between text-center relative overflow-hidden bg-black/10">
          
          {/* Écusson titre */}
          <div className="mt-2">
            <div className="flex items-center justify-center gap-1.5 text-amber-300 font-extrabold text-xs uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Livre Pédagogique CP</span>
              <Sparkles className="w-4 h-4" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md leading-tight">
              Le Grand Livre<br />
              <span className="text-[#FFE600] drop-shadow-lg">Magique</span>
            </h1>
            <p className="text-amber-200 text-xs sm:text-sm font-bold mt-1">
              Lecture &bull; Calcul &bull; Contes
            </p>
          </div>

          {/* Mascotte Kalo au centre de la couverture */}
          <div className="my-auto relative">
            <div className="w-36 h-36 rounded-full bg-white/10 backdrop-blur-xs border-3 border-amber-300 flex items-center justify-center shadow-inner group-hover:scale-110 transition duration-300">
              <SvgIcons.KaloMascot mood="celebrating" size={120} />
            </div>
            {/* Petit ruban marque-page qui dépasse */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-amber-400 text-amber-950 font-black text-[11px] px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
              Avec Kalo le Caméléon
            </div>
          </div>

          {/* Bouton d'ouverture tactile géant (>= 56px) */}
          <div className="w-full mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              className="w-full min-h-[58px] rounded-2xl bg-gradient-to-r from-[#FFB703] to-[#FB8500] hover:from-[#FB8500] hover:to-[#FFB703] text-amber-950 font-black text-lg sm:text-xl shadow-lg border-2 border-white flex items-center justify-center gap-3 transition-transform active:scale-95 animate-pulse"
            >
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
              <span>Ouvrir mon Livre</span>
            </button>
          </div>
        </div>
      </div>

      {/* Boutons d'accès complémentaires */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 z-10 px-4">
        {onOpenLireEtCompter && (
          <button
            onClick={onOpenLireEtCompter}
            className="flex items-center gap-2 bg-[#C8372D] hover:bg-[#B02A20] text-white border-2 border-amber-300 font-black text-xs sm:text-sm py-2 px-4 rounded-full shadow-lg transition active:scale-95 cursor-pointer"
          >
            <span>🎒</span>
            <span>Méthode 6-7 ans (4 semaines)</span>
          </button>
        )}

        <button
          onClick={onOpenParentSpace}
          className="text-xs text-white/70 hover:text-white underline font-semibold transition cursor-pointer py-2 px-3 rounded-full hover:bg-white/10"
        >
          ⚙️ Espace Enseignants & Parents
        </button>
      </div>
    </div>
  );
};
