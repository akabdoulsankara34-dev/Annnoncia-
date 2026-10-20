import React, { useState, useEffect, useRef } from 'react';
import { BookPage, Chapter, ChildProfile, AppSettings } from '../types/book';
import { KaloGuide } from './KaloGuide';
import { TracingCanvas } from './activities/TracingCanvas';
import { CountTapActivity } from './activities/CountTapActivity';
import { AddSubActivity } from './activities/AddSubActivity';
import { SyllableMixerActivity } from './activities/SyllableMixerActivity';
import { WordMatchActivity } from './activities/WordMatchActivity';
import { ReadWithMeActivity } from './activities/ReadWithMeActivity';
import { AlphabetDuoActivity } from './activities/AlphabetDuoActivity';
import { CaseMatchActivity } from './activities/CaseMatchActivity';
import { MissingLetterTrainActivity } from './activities/MissingLetterTrainActivity';
import { LetterHuntActivity } from './activities/LetterHuntActivity';
import { CaseSorterActivity } from './activities/CaseSorterActivity';
import { AlphabetChartActivity } from './activities/AlphabetChartActivity';
import { DragDropCaseActivity } from './activities/DragDropCaseActivity';
import { CountTo50Activity } from './activities/CountTo50Activity';
import { TensAndUnitsActivity } from './activities/TensAndUnitsActivity';
import { CursiveManuscritActivity } from './activities/CursiveManuscritActivity';
import { SvgIcons } from './SvgIcons';
import { sound, speakText } from '../utils/audio';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  List, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Award, 
  Clock,
  RotateCcw
} from 'lucide-react';

interface BookViewerProps {
  chapters: Chapter[];
  allPages: BookPage[];
  initialPageNumber?: number;
  activeProfile: ChildProfile;
  settings: AppSettings;
  onUpdateProfile: (updater: (prev: ChildProfile) => ChildProfile) => void;
  onReturnToContents: () => void;
  onOpenStickerAlbum: () => void;
  onRecordMistake: (type: any, val: string) => void;
}

export const BookViewer: React.FC<BookViewerProps> = ({
  chapters,
  allPages,
  initialPageNumber = 1,
  activeProfile,
  settings,
  onUpdateProfile,
  onReturnToContents,
  onOpenStickerAlbum,
  onRecordMistake,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(() => {
    const idx = allPages.findIndex(p => p.pageNumber === initialPageNumber);
    return idx >= 0 ? idx : 0;
  });

  const [isFlipping, setIsFlipping] = useState<'next' | 'prev' | null>(null);
  const [guideMood, setGuideMood] = useState<'happy' | 'talking' | 'celebrating' | 'thinking' | 'gentle'>('happy');
  const [soundOn, setSoundOn] = useState(settings.soundEnabled);
  const [showSessionBreak, setShowSessionBreak] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Évaluation adaptative (si 2 erreurs successives, scaffolding)
  const [pageMistakes, setPageMistakes] = useState<number>(0);
  const [useSimplified, setUseSimplified] = useState<boolean>(false);

  const currentPage = allPages[currentPageIndex] || allPages[0];
  const currentChapter = chapters.find(c => c.id === currentPage?.chapterId) || chapters[0];

  // Mémoriser la dernière page visitée (marque-page)
  useEffect(() => {
    if (currentPage) {
      onUpdateProfile(prev => ({
        ...prev,
        lastPageVisited: currentPage.pageNumber,
      }));
    }
  }, [currentPageIndex]);

  // Gestion de la séance de 15 minutes bienveillante
  useEffect(() => {
    if (!settings.sessionTimeLimitEnabled) return;
    const timer = setTimeout(() => {
      setShowSessionBreak(true);
      speakText('Tu as bien travaillé ! C’est l’heure de reposer un peu tes yeux et d’aller jouer !');
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearTimeout(timer);
  }, [settings.sessionTimeLimitEnabled]);

  // Tourner la page vers la suivante avec 3D animation et son
  const goToNextPage = () => {
    if (isFlipping || currentPageIndex >= allPages.length - 1) return;
    setIsFlipping('next');
    if (soundOn) sound.playPageFlip();

    setTimeout(() => {
      setCurrentPageIndex(prev => prev + 1);
      setIsFlipping(null);
      setGuideMood('happy');
      setPageMistakes(0);
      setUseSimplified(false);
    }, 450);
  };

  // Tourner la page vers la précédente
  const goToPrevPage = () => {
    if (isFlipping || currentPageIndex <= 0) return;
    setIsFlipping('prev');
    if (soundOn) sound.playPageFlip();

    setTimeout(() => {
      setCurrentPageIndex(prev => prev - 1);
      setIsFlipping(null);
      setGuideMood('happy');
      setPageMistakes(0);
      setUseSimplified(false);
    }, 450);
  };

  // Gestion des glissements au doigt (swipe / drag tactile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNextPage(); // Glissement vers la gauche = page suivante
      } else {
        goToPrevPage(); // Glissement vers la droite = page précédente
      }
    }
    setTouchStartX(null);
  };

  // Gestion de réussite d'une activité
  const handleActivitySuccess = () => {
    setGuideMood('celebrating');
    sound.playSuccess();

    // Débloquer page complétée & étoiles
    onUpdateProfile(prev => {
      const pageKey = currentPage.id;
      const alreadyDone = prev.completedPages[pageKey];
      const newStars = alreadyDone ? prev.starsCount : prev.starsCount + 1;
      
      // Vérifier si le chapitre est complété pour offrir l'autocollant
      const allChapterPagesDone = currentChapter.pages.every(p => p.id === pageKey || prev.completedPages[p.id]);
      const nextStickers = [...prev.stickersEarned];
      if (allChapterPagesDone && !nextStickers.includes(currentChapter.stickerReward.id)) {
        nextStickers.push(currentChapter.stickerReward.id);
        sound.playStarReward();
      }

      return {
        ...prev,
        starsCount: newStars,
        completedPages: { ...prev.completedPages, [pageKey]: true },
        stickersEarned: nextStickers,
      };
    });
  };

  // Gestion des erreurs douces et progression adaptative
  const handleActivityMistake = () => {
    setGuideMood('gentle');
    sound.playGentleEncouragement();

    const newMistakes = pageMistakes + 1;
    setPageMistakes(newMistakes);

    // Enregistrer pour la révision espacée
    if (currentPage.activity.letter) {
      onRecordMistake('letter', currentPage.activity.letter);
    } else if (currentPage.activity.countData) {
      onRecordMistake('number', String(currentPage.activity.countData.targetNumber));
    }

    // Si 2 erreurs sur la même notion, proposer l'activité simplifiée (étayage)
    if (newMistakes >= 2 && currentPage.simplifiedActivity && !useSimplified) {
      setUseSimplified(true);
      speakText('Ne t’inquiète pas ! Faisons un exercice un peu plus facile ensemble !');
    }
  };

  // Traduction bilingue si activée
  const getBilingualSubtitle = (textObj: any) => {
    if (!textObj) return null;
    if (settings.bilingualLanguage === 'moore' && textObj.moore) {
      return `Mooré : ${textObj.moore}`;
    }
    if (settings.bilingualLanguage === 'dioula' && textObj.dioula) {
      return `Dioula : ${textObj.dioula}`;
    }
    return null;
  };

  const activityToRender = useSimplified && currentPage.simplifiedActivity 
    ? currentPage.simplifiedActivity 
    : currentPage.activity;

  return (
    <div 
      className="min-h-screen w-full bg-[#1B4965] text-slate-800 flex flex-col items-center justify-between p-2 sm:p-4 select-none relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Barre de navigation supérieure du livre */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-md border-2 border-white/60 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playPageFlip();
              onReturnToContents();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs sm:text-sm transition cursor-pointer"
            title="Table des matières"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Sommaire</span>
          </button>

          <div className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentChapter.colorScheme.primary }}
            />
            <span className="text-xs sm:text-sm font-black text-slate-800 line-clamp-1">
              Ch. {currentChapter.number} : {currentChapter.title.fr}
            </span>
          </div>
        </div>

        {/* Marque-page, étoiles & son */}
        <div className="flex items-center gap-3">
          {/* Marque-page ruban */}
          <div className="flex items-center gap-1 text-xs font-black text-amber-800 bg-amber-200/70 px-2.5 py-1 rounded-full">
            <Bookmark className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
            <span>Page {currentPage.pageNumber} / {allPages.length}</span>
          </div>

          {/* Album stickers */}
          <button
            onClick={onOpenStickerAlbum}
            className="p-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-xs cursor-pointer active:scale-95 transition"
            title="Autocollants"
          >
            <Award className="w-4 h-4" />
          </button>

          {/* Toggle son */}
          <button
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              sound.setSoundEnabled(next);
            }}
            className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer transition"
            title="Activer/Désactiver le son"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
          </button>
        </div>
      </div>

      {/* Scène du livre 3D au centre */}
      <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center my-2 sm:my-4 book-stage">
        
        {/* Flèche gauche tactile géante (>= 56px) */}
        <button
          onClick={goToPrevPage}
          disabled={currentPageIndex === 0 || isFlipping !== null}
          className={`absolute left-0 sm:left-2 z-30 w-12 sm:w-16 h-16 sm:h-20 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-90 text-amber-950 font-black flex items-center justify-center shadow-xl border-3 border-white transition cursor-pointer ${
            currentPageIndex === 0 ? 'opacity-20 pointer-events-none' : 'opacity-95 hover:opacity-100'
          }`}
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-8 h-8 stroke-[3]" />
        </button>

        {/* Flèche droite tactile géante (>= 56px) */}
        <button
          onClick={goToNextPage}
          disabled={currentPageIndex === allPages.length - 1 || isFlipping !== null}
          className={`absolute right-0 sm:right-2 z-30 w-12 sm:w-16 h-16 sm:h-20 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-90 text-amber-950 font-black flex items-center justify-center shadow-xl border-3 border-white transition cursor-pointer ${
            currentPageIndex === allPages.length - 1 ? 'opacity-20 pointer-events-none' : 'opacity-95 hover:opacity-100'
          }`}
          aria-label="Page suivante"
        >
          <ChevronRight className="w-8 h-8 stroke-[3]" />
        </button>

        {/* Corps du livre ouvert (effet double page en paysage, page simple en portrait) */}
        <div 
          className={`relative w-full max-w-3xl min-h-[520px] bg-[#FFFDF9] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-4 border-[#E2D4B7] overflow-hidden flex flex-col justify-between p-4 sm:p-6 transition-transform duration-500 ${
            isFlipping === 'next' ? 'rotate-y-[-8deg] scale-98 shadow-2xl' : 
            isFlipping === 'prev' ? 'rotate-y-[8deg] scale-98 shadow-2xl' : ''
          }`}
        >
          {/* Reliure centrale ombrée (pli du livre) */}
          <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-8 bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none hidden md:block z-10" />
          <div className="absolute top-0 bottom-0 left-0 w-6 page-fold-gradient pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-6 page-right-fold-gradient pointer-events-none" />

          {/* En-tête de page avec titre et option bilingue */}
          <div className="w-full flex items-center justify-between border-b-2 border-amber-200/70 pb-3 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                  {currentChapter.title.fr}
                </span>
                {useSimplified && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Aide pas-à-pas
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {currentPage.title.fr}
              </h2>
              {getBilingualSubtitle(currentPage.title) && (
                <p className="text-xs font-bold text-emerald-700 italic mt-0.5">
                  {getBilingualSubtitle(currentPage.title)}
                </p>
              )}
            </div>

            {/* Numéro de page officiel */}
            <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-900 font-black text-sm flex items-center justify-center shrink-0">
              {currentPage.pageNumber}
            </div>
          </div>

          {/* Mascotte Kalo donnant la consigne */}
          <div className="w-full my-2">
            <KaloGuide
              instructionText={currentPage.instruction.fr}
              reactionMood={guideMood}
              voiceEnabled={settings.voiceEnabled}
              compact={false}
            />
          </div>

          {/* Cœur interactif : Rendu de l'activité pédagogique */}
          <div className="w-full flex-1 flex items-center justify-center my-3">
            {activityToRender.type === 'letter_intro' && (
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
                {/* Grande lettre interactive */}
                <div 
                  onClick={() => {
                    sound.playPop(520);
                    speakText(`${activityToRender.letter} ! Comme dans ${activityToRender.sampleWord?.fr || ''}`);
                  }}
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border-3 border-amber-300 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition group"
                >
                  <span className="text-7xl sm:text-8xl font-black text-rose-500 group-hover:scale-110 transition">
                    {activityToRender.letter}
                  </span>
                  <div className="mt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Touche pour écouter
                  </div>
                </div>

                {/* Tracé au doigt fléché */}
                {activityToRender.traceData ? (
                  <TracingCanvas
                    letter={activityToRender.letter || 'A'}
                    strokeHelp={activityToRender.traceData.strokeHelp}
                    fontType={settings.fontType}
                    onSuccess={handleActivitySuccess}
                  />
                ) : (
                  /* Image associée */
                  <div className="flex flex-col items-center gap-3">
                    {activityToRender.wordImageSvg === 'Pineapple' && <SvgIcons.Pineapple size={100} />}
                    {activityToRender.wordImageSvg === 'OrangeFruit' && <SvgIcons.OrangeFruit size={100} />}
                    {activityToRender.wordImageSvg === 'Elephant' && <SvgIcons.Elephant size={100} />}
                    {activityToRender.wordImageSvg === 'Yam' && <SvgIcons.Yam size={100} />}
                    {activityToRender.wordImageSvg === 'Factory' && <SvgIcons.Factory size={100} />}
                    
                    <button
                      onClick={handleActivitySuccess}
                      className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-extrabold text-base shadow-md hover:bg-emerald-600 transition"
                    >
                      J'ai compris !
                    </button>
                  </div>
                )}
              </div>
            )}

            {activityToRender.type === 'syllable_mixer' && activityToRender.syllables && (
              <SyllableMixerActivity
                consonant={activityToRender.syllables.consonant}
                vowels={activityToRender.syllables.vowels}
                sampleWord={activityToRender.sampleWord}
                wordImageSvg={activityToRender.wordImageSvg}
                onSuccess={handleActivitySuccess}
              />
            )}

            {activityToRender.type === 'word_match' && activityToRender.matchingPairs && (
              <WordMatchActivity
                pairs={activityToRender.matchingPairs}
                onSuccess={handleActivitySuccess}
                onMistake={handleActivityMistake}
              />
            )}

            {activityToRender.type === 'read_aloud' && activityToRender.storySentences && (
              <ReadWithMeActivity
                sentences={activityToRender.storySentences}
                onSuccess={handleActivitySuccess}
              />
            )}

            {activityToRender.type === 'count_tap' && activityToRender.countData && (
              <CountTapActivity
                targetNumber={activityToRender.countData.targetNumber}
                itemName={activityToRender.countData.itemName}
                itemType={activityToRender.countData.itemType}
                options={activityToRender.countData.options}
                onSuccess={handleActivitySuccess}
                onMistake={handleActivityMistake}
              />
            )}

            {activityToRender.type === 'number_trace' && activityToRender.traceData && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                {activityToRender.countData && (
                  <div className="flex flex-col items-center p-4 bg-white rounded-3xl border-2 border-amber-200 shadow-sm">
                    <SvgIcons.Chick size={80} />
                    <span className="text-xl font-black text-slate-800 mt-2">
                      {activityToRender.countData.targetNumber} Poussins
                    </span>
                  </div>
                )}
                <TracingCanvas
                  letter={activityToRender.traceData.letter}
                  strokeHelp={activityToRender.traceData.strokeHelp}
                  fontType={settings.fontType}
                  onSuccess={handleActivitySuccess}
                />
              </div>
            )}

            {activityToRender.type === 'drag_addition' && activityToRender.additionData && (
              <AddSubActivity
                mode="addition"
                num1={activityToRender.additionData.num1}
                num2={activityToRender.additionData.num2}
                itemType={activityToRender.additionData.itemType}
                onSuccess={handleActivitySuccess}
                onMistake={handleActivityMistake}
              />
            )}

            {activityToRender.type === 'subtraction_cut' && activityToRender.subtractionData && (
              <AddSubActivity
                mode="subtraction"
                num1={activityToRender.subtractionData.total}
                num2={activityToRender.subtractionData.toRemove}
                itemType={activityToRender.subtractionData.itemType}
                onSuccess={handleActivitySuccess}
                onMistake={handleActivityMistake}
              />
            )}

            {activityToRender.type === 'compare_quantities' && activityToRender.compareData && (
              <div className="flex flex-col items-center w-full max-w-md bg-white p-5 rounded-3xl border-3 border-amber-300 shadow-md">
                <p className="text-slate-800 font-black text-base sm:text-lg mb-4 text-center">
                  Touche le panier qui a le PLUS de calebasses !
                </p>
                <div className="flex items-center justify-center gap-6 w-full">
                  {/* Panier 1 */}
                  <button
                    onClick={() => {
                      if (activityToRender.compareData!.leftCount > activityToRender.compareData!.rightCount) {
                        handleActivitySuccess();
                        speakText('Gagné ! 6 est plus grand que 3 !');
                      } else {
                        handleActivityMistake();
                      }
                    }}
                    className="flex flex-col items-center p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border-3 border-amber-400 active:scale-95 transition cursor-pointer"
                  >
                    <div className="flex flex-wrap max-w-[120px] justify-center gap-1">
                      {Array.from({ length: activityToRender.compareData.leftCount }).map((_, i) => (
                        <SvgIcons.Calabash key={i} size={36} />
                      ))}
                    </div>
                    <span className="mt-2 font-black text-lg text-slate-800">Panier A</span>
                  </button>

                  <span className="text-xl font-bold text-slate-400">OU</span>

                  {/* Panier 2 */}
                  <button
                    onClick={() => {
                      if (activityToRender.compareData!.rightCount > activityToRender.compareData!.leftCount) {
                        handleActivitySuccess();
                      } else {
                        handleActivityMistake();
                      }
                    }}
                    className="flex flex-col items-center p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border-3 border-amber-400 active:scale-95 transition cursor-pointer"
                  >
                    <div className="flex flex-wrap max-w-[120px] justify-center gap-1">
                      {Array.from({ length: activityToRender.compareData.rightCount }).map((_, i) => (
                        <SvgIcons.Calabash key={i} size={36} />
                      ))}
                    </div>
                    <span className="mt-2 font-black text-lg text-slate-800">Panier B</span>
                  </button>
                </div>
              </div>
            )}

            {activityToRender.type === 'quiz' && activityToRender.sequenceData && (
              <div className="flex flex-col items-center w-full max-w-md bg-white p-5 rounded-3xl border-3 border-amber-300 shadow-md">
                <p className="text-slate-800 font-black text-base sm:text-lg mb-4 text-center">
                  {activityToRender.prompt.fr}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                  {activityToRender.sequenceData.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        if (opt === activityToRender.sequenceData!.correct) {
                          handleActivitySuccess();
                          speakText(`Exact ! Le ${opt} a 3 côtés !`);
                        } else {
                          handleActivityMistake();
                        }
                      }}
                      className="min-h-[56px] px-6 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-950 font-black text-xl active:scale-95 transition cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activityToRender.type === 'alphabet_duo' && activityToRender.alphabetDuo && (
              <AlphabetDuoActivity
                letters={activityToRender.alphabetDuo.letters}
                onSuccess={handleActivitySuccess}
              />
            )}

            {activityToRender.type === 'case_match' && activityToRender.casePairs && (
              <CaseMatchActivity
                pairs={activityToRender.casePairs}
                onSuccess={handleActivitySuccess}
                onMistake={handleActivityMistake}
              />
            )}

            {activityToRender.type === 'missing_letter_train' && activityToRender.trainData && (
              <MissingLetterTrainActivity
                sequence={activityToRender.trainData.sequence}
                missingIndex={activityToRender.trainData.missingIndex}
                options={activityToRender.trainData.options}
                correct={activityToRender.trainData.correct}
                onSuccess={handleActivitySuccess}
                onMistake={handleActivityMistake}
              />
            )}

            {activityToRender.type === 'letter_hunt' && activityToRender.huntData && (
              <LetterHuntActivity
                targetLetter={activityToRender.huntData.targetLetter}
                targetName={activityToRender.huntData.targetName}
                options={activityToRender.huntData.options}
                onSuccess={handleActivitySuccess}
                onMistake={handleActivityMistake}
              />
            )}

            {activityToRender.type === 'case_sorter' && activityToRender.sorterData && (
              <CaseSorterActivity
                items={activityToRender.sorterData.items}
                onSuccess={handleActivitySuccess}
                onMistake={handleActivityMistake}
              />
            )}

            {activityToRender.type === 'alphabet_interactive_chart' && (
              <AlphabetChartActivity
                onSuccess={handleActivitySuccess}
              />
            )}

            {activityToRender.type === 'drag_drop_case' && activityToRender.dragDropCaseData && (
              <DragDropCaseActivity
                pairs={activityToRender.dragDropCaseData.pairs}
                onSuccess={handleActivitySuccess}
                onMistake={handleActivityMistake}
              />
            )}

            {activityToRender.type === 'count_to_50' && (
              <CountTo50Activity
                targetFind={activityToRender.countTo50Data?.targetFind || 34}
                onSuccess={handleActivitySuccess}
                onMistake={handleActivityMistake}
              />
            )}

            {activityToRender.type === 'tens_units' && activityToRender.tensUnitsData && (
              <TensAndUnitsActivity
                tens={activityToRender.tensUnitsData.tens}
                units={activityToRender.tensUnitsData.units}
                itemName={activityToRender.tensUnitsData.itemName}
                itemType={activityToRender.tensUnitsData.itemType}
                onSuccess={handleActivitySuccess}
                onMistake={handleActivityMistake}
              />
            )}

            {activityToRender.type === 'cursive_atelier' && (
              <CursiveManuscritActivity
                onSuccess={handleActivitySuccess}
              />
            )}
          </div>

          {/* Pied de page du livre avec numéros et bouton suivant doux */}
          <div className="w-full flex items-center justify-between pt-2 border-t border-amber-200/60 text-xs font-bold text-slate-500">
            <span>Le Grand Livre Magique de CP</span>
            <span>Page {currentPage.pageNumber}</span>
          </div>
        </div>
      </div>

      {/* Modal bienveillante de fin de séance 15 minutes */}
      {showSessionBreak && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-4 border-amber-400 animate-star-float">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              L'heure de la pause !
            </h3>
            <p className="text-sm font-semibold text-slate-600 mb-6 leading-relaxed">
              Kalo dit : « Tu as été très courageux aujourd'hui ! Repose tes yeux et va jouer un peu dehors avec tes amis ! »
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowSessionBreak(false);
                  onReturnToContents();
                }}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-md active:scale-95 transition"
              >
                Fermer pour aujourd'hui
              </button>
              <button
                onClick={() => setShowSessionBreak(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition"
              >
                Continuer un peu avec l'accord des parents
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
