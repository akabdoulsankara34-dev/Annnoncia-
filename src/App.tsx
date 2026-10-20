import React, { useState, useEffect } from 'react';
import { Chapter, BookPage, ChildProfile, AppSettings, ContentPack } from './types/book';
import { CHAPITRES } from './data/bookContent';
import { 
  loadProfiles, 
  saveProfiles, 
  getActiveProfileId, 
  setActiveProfileId, 
  getActiveProfile, 
  updateActiveProfile, 
  loadSettings, 
  saveSettings,
  recordMistake,
  resolveMistake
} from './utils/storage';
import { sound } from './utils/audio';

import { BookCover } from './components/BookCover';
import { TableOfContents } from './components/TableOfContents';
import { BookViewer } from './components/BookViewer';
import { StickerAlbumModal } from './components/StickerAlbumModal';
import { ProfileSelectorModal } from './components/ProfileSelectorModal';
import { ReviewGameModal } from './components/ReviewGameModal';
import { ParentSpaceModal } from './components/ParentSpaceModal';
import { OfflineStandaloneExporter } from './components/OfflineStandaloneExporter';
import { PrintWorksheets } from './components/PrintWorksheets';
import { PWAInstallButton } from './components/PWAInstallButton';
import { SvgIcons } from './components/SvgIcons';
import { RotateCcw, HelpCircle, User, Award, Shield } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'cover' | 'contents' | 'book'>('cover');
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => loadProfiles());
  const [activeProfileId, setActiveProfileState] = useState<string>(() => getActiveProfileId());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [chaptersList, setChaptersList] = useState<Chapter[]>(CHAPITRES);
  
  // Page sélectionnée pour ouvrir directement le livre
  const [targetPageNumber, setTargetPageNumber] = useState<number>(1);

  // Modales
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showStickerModal, setShowStickerModal] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // Calculer toutes les pages du livre
  const allPages: BookPage[] = chaptersList.flatMap(c => c.pages);

  // Synchroniser le paramètre audio
  useEffect(() => {
    sound.setSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Gestion du profil actif
  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    setActiveProfileState(id);
  };

  const handleCreateProfile = (name: string, avatar: ChildProfile['avatar']) => {
    const newProfile: ChildProfile = {
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name,
      avatar,
      starsCount: 0,
      unlockedChapters: ['chap_1'],
      completedPages: {},
      stickersEarned: ['stk_kalo_star'],
      placedStickers: [],
      reviewQueue: [],
      lastPageVisited: 1,
    };
    const nextList = [...profiles, newProfile];
    setProfiles(nextList);
    saveProfiles(nextList);
    handleSelectProfile(newProfile.id);
  };

  const handleDeleteProfile = (id: string) => {
    const nextList = profiles.filter(p => p.id !== id);
    if (nextList.length === 0) return;
    setProfiles(nextList);
    saveProfiles(nextList);
    if (activeProfileId === id) {
      handleSelectProfile(nextList[0].id);
    }
  };

  const handleUpdateProfile = (updater: (prev: ChildProfile) => ChildProfile) => {
    const updated = updateActiveProfile(updater);
    setProfiles(loadProfiles());
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    sound.setSoundEnabled(newSettings.soundEnabled);
  };

  const handleResetProgress = (profileId: string) => {
    handleUpdateProfile(prev => ({
      ...prev,
      starsCount: 0,
      unlockedChapters: ['chap_1'],
      completedPages: {},
      stickersEarned: ['stk_kalo_star'],
      placedStickers: [],
      reviewQueue: [],
      lastPageVisited: 1,
    }));
    alert('Progression réinitialisée avec succès !');
  };

  const handleUnlockAllChapters = () => {
    const allChapIds = chaptersList.map(c => c.id);
    handleUpdateProfile(prev => ({
      ...prev,
      unlockedChapters: allChapIds,
    }));
    handleUpdateSettings({ ...settings, allChaptersUnlocked: true });
    alert('Tous les chapitres sont désormais accessibles !');
  };

  const handleImportPack = (pack: ContentPack) => {
    const newChapters = pack.chapters.map((c, i) => ({
      ...c,
      number: chaptersList.length + i + 1,
    }));
    setChaptersList(prev => [...prev, ...newChapters]);
  };

  // Ouvrir le livre sur la dernière page mémorisée par le marque-page
  const handleOpenBook = () => {
    const lastPage = activeProfile.lastPageVisited || 1;
    setTargetPageNumber(lastPage);
    setView('book');
  };

  // Clic sur un chapitre depuis le sommaire
  const handleSelectChapterFromContents = (chapter: Chapter) => {
    const firstPage = chapter.pages[0]?.pageNumber || 1;
    setTargetPageNumber(firstPage);
    setView('book');
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans bg-[#FAF6EE] select-none text-slate-800">
      
      {/* Barre d'outils utilitaires en haut (PWA install, mode hors-ligne, profil, révision) */}
      <header className="w-full bg-[#1B4965] text-white px-3 sm:px-6 py-2 flex items-center justify-between z-30 shadow-sm no-print">
        <div className="flex items-center gap-2">
          <div 
            onClick={() => setView('cover')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 border border-amber-300">
              <SvgIcons.KaloMascot mood="happy" size={30} />
            </div>
            <span className="font-black text-sm sm:text-base hidden sm:inline text-amber-300">
              Le Livre de CP
            </span>
          </div>

          {/* Bouton PWA Install */}
          <PWAInstallButton />
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton Jeu de révision si disponible */}
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-xs transition active:scale-95 cursor-pointer"
            title="Jeu de révision express 5 minutes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Révision 5 min</span>
          </button>

          {/* Guide Android & fichier autonome */}
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition cursor-pointer"
            title="Guide d'installation Android et téléchargement hors-ligne"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mode Hors-ligne</span>
          </button>

          {/* Sélecteur de profil */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition cursor-pointer border border-white/30"
            title="Changer d'élève"
          >
            <User className="w-3.5 h-3.5 text-amber-300" />
            <span>{activeProfile.name}</span>
          </button>
        </div>
      </header>

      {/* Vues principales */}
      <main className="flex-1 w-full flex flex-col no-print">
        {view === 'cover' && (
          <BookCover
            activeProfile={activeProfile}
            onOpenBook={handleOpenBook}
            onOpenProfileSelect={() => setShowProfileModal(true)}
            onOpenParentSpace={() => setShowParentModal(true)}
          />
        )}

        {view === 'contents' && (
          <TableOfContents
            chapters={chaptersList}
            unlockedChapters={settings.allChaptersUnlocked ? chaptersList.map(c => c.id) : activeProfile.unlockedChapters}
            starsCount={activeProfile.starsCount}
            onSelectChapter={handleSelectChapterFromContents}
            onBackToCover={() => setView('cover')}
            onOpenStickerAlbum={() => setShowStickerModal(true)}
          />
        )}

        {view === 'book' && (
          <BookViewer
            chapters={chaptersList}
            allPages={allPages}
            initialPageNumber={targetPageNumber}
            activeProfile={activeProfile}
            settings={settings}
            onUpdateProfile={handleUpdateProfile}
            onReturnToContents={() => setView('contents')}
            onOpenStickerAlbum={() => setShowStickerModal(true)}
            onRecordMistake={(type, val) => recordMistake(type, val)}
          />
        )}
      </main>

      {/* Fiches d'exercices A4 imprimables (uniquement visibles lors de l'impression) */}
      <PrintWorksheets />

      {/* Modale Profils */}
      {showProfileModal && (
        <ProfileSelectorModal
          profiles={profiles}
          activeProfileId={activeProfileId}
          onSelectProfile={handleSelectProfile}
          onCreateProfile={handleCreateProfile}
          onDeleteProfile={handleDeleteProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Modale Album d'autocollants */}
      {showStickerModal && (
        <StickerAlbumModal
          earnedStickerIds={activeProfile.stickersEarned}
          placedStickers={activeProfile.placedStickers || []}
          onSavePlacedStickers={(placed) => {
            handleUpdateProfile(prev => ({ ...prev, placedStickers: placed }));
          }}
          onClose={() => setShowStickerModal(false)}
        />
      )}

      {/* Modale Jeu de révision 5 minutes */}
      {showReviewModal && (
        <ReviewGameModal
          profile={activeProfile}
          onResolveMistake={(type, val) => resolveMistake(type, val)}
          onAwardBonusStars={(cnt) => {
            handleUpdateProfile(prev => ({ ...prev, starsCount: prev.starsCount + cnt }));
          }}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {/* Modale Espace Parent */}
      {showParentModal && (
        <ParentSpaceModal
          profiles={profiles}
          activeProfile={activeProfile}
          settings={settings}
          chapters={chaptersList}
          onUpdateSettings={handleUpdateSettings}
          onResetProgress={handleResetProgress}
          onUnlockAllChapters={handleUnlockAllChapters}
          onImportPack={handleImportPack}
          onClose={() => setShowParentModal(false)}
        />
      )}

      {/* Modale Instructions Android & Export Fichier Unique */}
      {showExportModal && (
        <OfflineStandaloneExporter
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
