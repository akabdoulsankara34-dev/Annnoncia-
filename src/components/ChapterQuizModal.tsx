import React, { useState, useEffect } from 'react';
import { Chapter, ChildProfile } from '../types/book';
import { getQuizForChapter } from '../data/chapterQuizzes';
import { sound, speakText, stopSpeaking } from '../utils/audio';
import { SvgIcons } from './SvgIcons';
import { X, Star, Volume2, CheckCircle2, ArrowRight, RotateCcw, Award, Sparkles } from 'lucide-react';

interface ChapterQuizModalProps {
  chapter: Chapter;
  activeProfile: ChildProfile;
  hasNextChapter?: boolean;
  onCompleteQuiz: (chapterId: string, score: number, total: number, starsEarned: number) => void;
  onGoToNextChapter?: () => void;
  onClose: () => void;
}

export const ChapterQuizModal: React.FC<ChapterQuizModalProps> = ({
  chapter,
  activeProfile,
  hasNextChapter = false,
  onCompleteQuiz,
  onGoToNextChapter,
  onClose,
}) => {
  const questions = getQuizForChapter(chapter);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [earnedStarsInSession, setEarnedStarsInSession] = useState(0);

  const currentQuestion = questions[currentIndex];
  const alreadyCompleted = Boolean(activeProfile.completedQuizzes?.[chapter.id]);

  useEffect(() => {
    if (!quizFinished && currentQuestion) {
      const timer = setTimeout(() => {
        speakText(currentQuestion.question, { rate: 0.88 });
      }, 300);
      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
  }, [currentIndex, quizFinished]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleSelectOption = (optionId: string) => {
    if (isAnswerCorrect === true) return; // Déjà validé pour cette question

    setSelectedOptionId(optionId);
    if (optionId === currentQuestion.correctOptionId) {
      setIsAnswerCorrect(true);
      sound.playSuccess();
      sound.playStarReward();
      setScore(prev => prev + 1);
      setEarnedStarsInSession(prev => prev + 1);
      speakText(`Bravo ! ${currentQuestion.explanation}`, { rate: 0.88 });
    } else {
      setIsAnswerCorrect(false);
      sound.playGentleEncouragement();
      speakText('Pas tout à fait ! Écoute bien et essaie une autre réponse.', { rate: 0.9 });
    }
  };

  const handleNextQuestion = () => {
    sound.playPop();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerCorrect(null);
    } else {
      // Fin du quiz : bonus d'étoiles
      const finalScore = score;
      const bonusStars = finalScore === questions.length ? 2 : 1;
      const totalStarsAwarded = earnedStarsInSession + bonusStars;
      setEarnedStarsInSession(totalStarsAwarded);
      setQuizFinished(true);
      sound.playStarReward();
      speakText(`Félicitations ${activeProfile.name} ! Tu as terminé le quiz du chapitre ${chapter.number} et gagné ${totalStarsAwarded} étoiles !`);
      onCompleteQuiz(chapter.id, finalScore, questions.length, totalStarsAwarded);
    }
  };

  const handleReplay = () => {
    sound.playPop();
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerCorrect(null);
    setScore(0);
    setEarnedStarsInSession(0);
    setQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none">
      <div className="w-full max-w-lg bg-[#FFFDF9] rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* En-tête du quiz */}
        <div
          className="px-5 py-4 text-white flex items-center justify-between"
          style={{ backgroundColor: chapter.colorScheme.primary }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{chapter.badgeEmoji}</span>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-white/85 block">
                Quiz de fin de chapitre {chapter.number}
              </span>
              <h3 className="font-['Fredoka',sans-serif] text-lg sm:text-xl font-black leading-tight">
                {chapter.title.fr}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Fermer le quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps du quiz */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {!quizFinished ? (
            <div>
              {/* Barre de progression et étoiles en cours */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  Question {currentIndex + 1} / {questions.length}
                </span>

                <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow-xs">
                  <Star className="w-4 h-4 fill-amber-950" />
                  <span>+{earnedStarsInSession} gagnée{earnedStarsInSession > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + (isAnswerCorrect ? 1 : 0)) / questions.length) * 100}%` }}
                />
              </div>

              {/* Mascotte Kalo + Question */}
              <div className="flex items-start gap-3 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3.5 mb-4">
                <div className="shrink-0">
                  <SvgIcons.KaloMascot
                    mood={isAnswerCorrect === true ? 'celebrating' : isAnswerCorrect === false ? 'gentle' : 'happy'}
                    size={54}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-['Fredoka',sans-serif] text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {currentQuestion.question}
                  </p>
                </div>
                <button
                  onClick={() => speakText(currentQuestion.question, { force: true })}
                  className="p-2 rounded-xl bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer shrink-0"
                  title="Écouter la question"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Visuel indice */}
              {(currentQuestion.visualEmoji || currentQuestion.visualText) && (
                <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 mb-4 text-center shadow-xs">
                  {currentQuestion.visualEmoji && (
                    <div className="text-5xl mb-1">{currentQuestion.visualEmoji}</div>
                  )}
                  {currentQuestion.visualText && (
                    <div className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black text-slate-800 tracking-wide">
                      {currentQuestion.visualText}
                    </div>
                  )}
                </div>
              )}

              {/* Choix de réponses */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrectOpt = isSelected && opt.id === currentQuestion.correctOptionId;
                  const isWrongOpt = isSelected && opt.id !== currentQuestion.correctOptionId;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`min-h-[54px] px-4 py-3 rounded-2xl border-3 font-['Fredoka',sans-serif] text-base sm:text-lg font-black flex items-center justify-between transition active:scale-98 cursor-pointer ${
                        isCorrectOpt
                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-md'
                          : isWrongOpt
                          ? 'bg-rose-100 border-rose-400 text-rose-800'
                          : 'bg-white hover:bg-amber-50 border-amber-300 text-slate-800 shadow-xs'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {opt.emoji && <span>{opt.emoji}</span>}
                        <span>{opt.label}</span>
                      </span>
                      {isCorrectOpt && <CheckCircle2 className="w-6 h-6 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & bouton Question suivante */}
              {isAnswerCorrect === true && (
                <div className="mt-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl p-3.5 animate-fadeIn">
                  <p className="text-sm font-black text-emerald-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{currentQuestion.explanation} (+1 ⭐)</span>
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-['Fredoka',sans-serif] font-black text-base shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Question suivante' : 'Voir ma récompense !'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {isAnswerCorrect === false && (
                <div className="mt-3 text-center text-xs font-bold text-rose-600">
                  Essaie une autre réponse, tu vas trouver !
                </div>
              )}
            </div>
          ) : (
            /* Écran final de récompenses par étoiles */
            <div className="text-center py-3">
              <div className="flex justify-center mb-3">
                <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center shadow-inner animate-bounce">
                  <SvgIcons.KaloMascot mood="celebrating" size={80} />
                </div>
              </div>

              <h4 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black text-slate-900 mb-1">
                Bravo {activeProfile.name} !
              </h4>
              <p className="text-sm font-bold text-slate-600 mb-4">
                Tu as validé le chapitre {chapter.number} « {chapter.title.fr} » !
              </p>

              {/* Étoiles gagnées */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-3 border-amber-400 rounded-3xl p-4 mb-4 shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {Array.from({ length: Math.min(5, earnedStarsInSession) }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-8 h-8 text-amber-500 fill-amber-400 drop-shadow-xs animate-pulse"
                    />
                  ))}
                </div>
                <div className="font-['Fredoka',sans-serif] text-2xl font-black text-amber-950">
                  +{earnedStarsInSession} Étoiles récoltées !
                </div>
                <p className="text-xs font-bold text-amber-800 mt-1">
                  Score : {score} / {questions.length} bonnes réponses + bonus de réussite
                </p>
              </div>

              {/* Autocollant du chapitre */}
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 mb-5 flex items-center justify-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  {alreadyCompleted
                    ? `Autocollant déjà collectionné : ${chapter.stickerReward.title.fr}`
                    : `Autocollant débloqué : ${chapter.stickerReward.title.fr} !`}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleReplay}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Rejouer</span>
                </button>

                {hasNextChapter && onGoToNextChapter ? (
                  <button
                    onClick={() => {
                      stopSpeaking();
                      onClose();
                      onGoToNextChapter();
                    }}
                    className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-['Fredoka',sans-serif] font-black text-sm shadow-md flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <span>Chapitre suivant</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      stopSpeaking();
                      onClose();
                    }}
                    className="flex-1 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-['Fredoka',sans-serif] font-black text-sm shadow-md transition active:scale-95 cursor-pointer"
                  >
                    Continuer l’aventure
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
