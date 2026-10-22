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
  resolveMistake,
  DEFAULT_PROFILES
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
import { LireEtCompterModal } from './components/LireEtCompterModal';
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
  const [showLireEtCompterModal, setShowLireEtCompterModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILES[0];

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
    showToast('Progression réinitialisée avec succès !');
  };

  const handleUnlockChapter = (chapterId: string) => {
    handleUpdateProfile(prev => ({
      ...prev,
      unlockedChapters: Array.from(new Set([...prev.unlockedChapters, chapterId])),
    }));
    const chap = chaptersList.find(c => c.id === chapterId);
    showToast(`🔓 Chapitre ${chap?.number || ''} « ${chap?.title.fr || ''} » débloqué !`);
    sound.playStarReward();
  };

  const handleToggleChapterUnlock = (chapterId: string) => {
    const isCurrentlyUnlocked = settings.allChaptersUnlocked || activeProfile.unlockedChapters.includes(chapterId);

    if (settings.allChaptersUnlocked) {
      const remaining = chaptersList.map(c => c.id).filter(id => id !== chapterId);
      handleUpdateSettings({ ...settings, allChaptersUnlocked: false });
      handleUpdateProfile(prev => ({
        ...prev,
        unlockedChapters: remaining.length > 0 ? remaining : ['chap_1'],
      }));
      const chap = chaptersList.find(c => c.id === chapterId);
      showToast(`🔒 Chapitre ${chap?.number || ''} verrouillé.`);
      sound.playPop();
      return;
    }

    if (isCurrentlyUnlocked) {
      handleUpdateProfile(prev => {
        const nextList = prev.unlockedChapters.filter(id => id !== chapterId);
        return {
          ...prev,
          unlockedChapters: nextList.length > 0 ? nextList : ['chap_1'],
        };
      });
      const chap = chaptersList.find(c => c.id === chapterId);
      showToast(`🔒 Chapitre ${chap?.number || ''} verrouillé.`);
      sound.playPop();
    } else {
      handleUpdateProfile(prev => ({
        ...prev,
        unlockedChapters: Array.from(new Set([...prev.unlockedChapters, chapterId])),
      }));
      const chap = chaptersList.find(c => c.id === chapterId);
      showToast(`🔓 Chapitre ${chap?.number || ''} « ${chap?.title.fr || ''} » débloqué !`);
      sound.playStarReward();
    }
  };

  const handleUnlockAllChapters = () => {
    const allChapIds = chaptersList.map(c => c.id);
    handleUpdateProfile(prev => ({
      ...prev,
      unlockedChapters: allChapIds,
    }));
    handleUpdateSettings({ ...settings, allChaptersUnlocked: true });
    showToast('🎉 Tous les chapitres sont désormais débloqués !');
    sound.playSuccess();
  };

  const handleToggleAllChaptersUnlocked = () => {
    const nextVal = !settings.allChaptersUnlocked;
    handleUpdateSettings({ ...settings, allChaptersUnlocked: nextVal });
    if (nextVal) {
      const allChapIds = chaptersList.map(c => c.id);
      handleUpdateProfile(prev => ({
        ...prev,
        unlockedChapters: allChapIds,
      }));
      showToast('🔓 Mode Libre : tous les chapitres sont ouverts !');
      sound.playSuccess();
    } else {
      showToast('🔒 Mode Guidé : progression étape par étape.');
      sound.playPop();
    }
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
          {/* Bouton Programme Spécial 6-7 ans */}
          <button
            onClick={() => setShowLireEtCompterModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C8372D] hover:bg-[#B02A20] text-white font-black text-xs shadow-xs transition active:scale-95 cursor-pointer border border-white/20"
            title="Programme 'Lire et compter à 6-7 ans' (4 semaines)"
          >
            <span>🎒</span>
            <span className="hidden sm:inline">Méthode 6-7 ans</span>
          </button>

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
            onOpenLireEtCompter={() => setShowLireEtCompterModal(true)}
          />
        )}

        {view === 'contents' && (
          <TableOfContents
            chapters={chaptersList}
            unlockedChapters={settings.allChaptersUnlocked ? chaptersList.map(c => c.id) : activeProfile.unlockedChapters}
            starsCount={activeProfile.starsCount}
            allChaptersUnlocked={settings.allChaptersUnlocked}
            onSelectChapter={handleSelectChapterFromContents}
            onBackToCover={() => setView('cover')}
            onOpenStickerAlbum={() => setShowStickerModal(true)}
            onUnlockChapter={handleUnlockChapter}
            onToggleChapterUnlock={handleToggleChapterUnlock}
            onUnlockAllChapters={handleUnlockAllChapters}
            onToggleAllChaptersUnlocked={handleToggleAllChaptersUnlocked}
            onOpenLireEtCompter={() => setShowLireEtCompterModal(true)}
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
          onUnlockChapter={handleUnlockChapter}
          onToggleChapterUnlock={handleToggleChapterUnlock}
          onUnlockAllChapters={handleUnlockAllChapters}
          onImportPack={handleImportPack}
          onOpenLireEtCompter={() => setShowLireEtCompterModal(true)}
          onClose={() => setShowParentModal(false)}
        />
      )}

      {/* Modale Programme 'Lire et compter à 6-7 ans' (4 semaines) */}
      {showLireEtCompterModal && (
        <LireEtCompterModal
          isOpen={showLireEtCompterModal}
          onClose={() => setShowLireEtCompterModal(false)}
          activeProfile={activeProfile}
          onAwardStars={(cnt) => {
            handleUpdateProfile(prev => ({ ...prev, starsCount: prev.starsCount + cnt }));
            showToast(`+${cnt} ⭐ étoile${cnt > 1 ? 's' : ''} récoltée${cnt > 1 ? 's' : ''} !`);
          }}
        />
      )}

      {/* Modale Instructions Android & Export Fichier Unique */}
      {showExportModal && (
        <OfflineStandaloneExporter
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Notification Toast douce et bienveillante */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 font-extrabold text-sm sm:text-base flex items-center gap-3 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
