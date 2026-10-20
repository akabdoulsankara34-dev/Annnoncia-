import React, { useState } from 'react';
import { sound, speakText, stopSpeaking, startVoiceRecognition } from '../../utils/audio';
import { Volume2, Mic, MicOff, CheckCircle, Sparkles, BookOpen } from 'lucide-react';

interface ReadWithMeActivityProps {
  sentences: {
    id: number;
    text: string;
  }[];
  onSuccess: () => void;
}

export const ReadWithMeActivity: React.FC<ReadWithMeActivityProps> = ({
  sentences,
  onSuccess,
}) => {
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [heardText, setHeardText] = useState<string>('');
  const [completedSentences, setCompletedSentences] = useState<number[]>([]);

  const activeSentence = sentences[currentSentenceIdx] || sentences[0];
  const words = activeSentence.text.split(' ');

  const handleListenApp = () => {
    setIsReadingAloud(true);
    setHighlightedWordIndex(0);

    let wordIdx = 0;
    speakText(activeSentence.text, {
      rate: 0.8,
      onStart: () => {
        setIsReadingAloud(true);
        setHighlightedWordIndex(0);
      },
      onBoundary: () => {
        setHighlightedWordIndex(prev => {
          const next = (prev !== null ? prev + 1 : 0);
          return next < words.length ? next : words.length - 1;
        });
      },
      onEnd: () => {
        setIsReadingAloud(false);
        setHighlightedWordIndex(null);
      }
    });
  };

  const handleChildReadAlone = () => {
    stopSpeaking();
    setIsListeningMic(true);
    setHeardText('');

    const recognition = startVoiceRecognition(
      activeSentence.text,
      (heard, isMatch) => {
        setIsListeningMic(false);
        setHeardText(heard);
        if (isMatch) {
          handleValidateReading();
        } else {
          speakText('Bien essayé ! Tu peux aussi appuyer sur "J’ai lu !"');
        }
      },
      () => {
        // Fallback si micro non supporté ou refusé
        setIsListeningMic(false);
      }
    );
  };

  const handleValidateReading = () => {
    stopSpeaking();
    sound.playSuccess();
    speakText('Bravo ! Quelle belle lecture !');

    if (!completedSentences.includes(currentSentenceIdx)) {
      const next = [...completedSentences, currentSentenceIdx];
      setCompletedSentences(next);
      if (next.length === sentences.length) {
        setTimeout(onSuccess, 800);
      } else {
        setTimeout(() => {
          setCurrentSentenceIdx(prev => Math.min(prev + 1, sentences.length - 1));
          setHeardText('');
        }, 1200);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-amber-50/90 p-5 rounded-3xl border-3 border-amber-300 shadow-md">
      {/* Indicateur de phrase */}
      <div className="flex items-center justify-between w-full mb-3 px-2">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-amber-800">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>Phrase {currentSentenceIdx + 1} sur {sentences.length}</span>
        </div>

        <div className="flex items-center gap-1">
          {sentences.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                completedSentences.includes(i)
                  ? 'bg-emerald-500 scale-110'
                  : i === currentSentenceIdx
                  ? 'bg-amber-500 ring-2 ring-amber-300'
                  : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Cadre de lecture grand format (police >= 28px) avec surlignage mot par mot */}
      <div className="w-full bg-white p-6 rounded-2xl border-3 border-amber-200 shadow-sm min-h-[140px] flex items-center justify-center flex-wrap gap-x-3 gap-y-2 text-center">
        {words.map((word, idx) => {
          const isHighlighted = highlightedWordIndex === idx;
          return (
            <span
              key={idx}
              className={`text-2xl sm:text-3xl font-extrabold transition-all duration-200 px-2 py-1 rounded-xl ${
                isHighlighted
                  ? 'bg-amber-300 text-amber-950 scale-115 shadow-sm ring-2 ring-amber-400'
                  : 'text-slate-800 hover:text-amber-700'
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>

      {heardText && (
        <div className="mt-2 text-xs font-semibold text-slate-500 bg-white/70 px-3 py-1 rounded-full">
          Entendu : « {heardText} »
        </div>
      )}

      {/* Boutons d'interaction : Écouter l'app / Lire seul / Valider */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 w-full">
        {/* Écouter la voix modèle */}
        <button
          onClick={handleListenApp}
          disabled={isReadingAloud}
          className="min-h-[56px] px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-base shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Volume2 className="w-5 h-5" />
          <span>Écoute Kalo</span>
        </button>

        {/* Lire au micro */}
        <button
          onClick={handleChildReadAlone}
          className={`min-h-[56px] px-5 py-3 rounded-2xl font-black text-base shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer ${
            isListeningMic
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-sky-500 hover:bg-sky-600 text-white'
          }`}
        >
          {isListeningMic ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span>{isListeningMic ? 'Je t’écoute...' : 'À mon tour !'}</span>
        </button>

        {/* Bouton de validation bienveillant "J'ai lu !" */}
        <button
          onClick={handleValidateReading}
          className="min-h-[56px] px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer shadow-emerald-400/40"
        >
          <CheckCircle className="w-6 h-6 stroke-[2.5]" />
          <span>J’ai lu !</span>
        </button>
      </div>

      {completedSentences.length === sentences.length && (
        <div className="mt-4 flex items-center gap-2 text-emerald-700 font-black text-lg animate-star-float">
          <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
          <span>Champion de la lecture ! Tu as lu toute l'histoire !</span>
        </div>
      )}
    </div>
  );
};
