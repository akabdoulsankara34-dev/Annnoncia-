import React, { useState, useEffect } from 'react';
import { SvgIcons } from './SvgIcons';
import { speakText, stopSpeaking } from '../utils/audio';
import { Volume2, Sparkles, RefreshCw } from 'lucide-react';

interface KaloGuideProps {
  instructionText: string;
  reactionMood?: 'happy' | 'talking' | 'celebrating' | 'thinking' | 'gentle';
  autoSpeak?: boolean;
  voiceEnabled?: boolean;
  onSpokenEnd?: () => void;
  className?: string;
  compact?: boolean;
}

export const KaloGuide: React.FC<KaloGuideProps> = ({
  instructionText,
  reactionMood = 'happy',
  autoSpeak = true,
  voiceEnabled = true,
  onSpokenEnd,
  className = '',
  compact = false,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMood, setCurrentMood] = useState(reactionMood);

  useEffect(() => {
    setCurrentMood(reactionMood);
  }, [reactionMood]);

  const speak = () => {
    if (!voiceEnabled || !instructionText) return;
    setIsSpeaking(true);
    setCurrentMood('talking');

    speakText(instructionText, {
      rate: 0.88,
      pitch: 1.15,
      onStart: () => {
        setIsSpeaking(true);
        setCurrentMood('talking');
      },
      onEnd: () => {
        setIsSpeaking(false);
        setCurrentMood(reactionMood);
        if (onSpokenEnd) onSpokenEnd();
      }
    });
  };

  useEffect(() => {
    if (autoSpeak && voiceEnabled && instructionText) {
      // Small timeout so DOM is painted and user isn't startled
      const timer = setTimeout(() => {
        speak();
      }, 350);
      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
  }, [instructionText, autoSpeak, voiceEnabled]);

  const animationClass = 
    currentMood === 'celebrating' ? 'kalo-jump' : 
    currentMood === 'gentle' ? 'kalo-gentle' : 
    currentMood === 'talking' ? 'kalo-happy' : '';

  if (compact) {
    return (
      <div className={`flex items-center gap-3 bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl p-2.5 shadow-sm ${className}`}>
        <button 
          onClick={speak}
          title="Écouter Kalo"
          className={`relative cursor-pointer transition transform active:scale-95 ${animationClass}`}
        >
          <SvgIcons.KaloMascot mood={currentMood} size={54} />
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          )}
        </button>
        <div className="flex-1 text-slate-800 text-sm font-semibold leading-snug">
          {instructionText}
        </div>
        <button 
          onClick={speak}
          className="p-2 rounded-xl bg-emerald-500 text-white shadow-md hover:bg-emerald-600 transition active:scale-95"
          aria-label="Répéter la consigne"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className={`relative flex items-end gap-3.5 ${className}`}>
      {/* Mascotte Kalo cliquable */}
      <div 
        onClick={speak}
        className={`relative cursor-pointer transition-transform duration-300 group ${animationClass}`}
        title="Touche Kalo pour m'écouter parler !"
      >
        <SvgIcons.KaloMascot mood={currentMood} size={88} />
        
        {/* Bulle d'action rapide */}
        <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-md border-2 border-white group-hover:scale-110 transition">
          <Volume2 className="w-4 h-4" />
        </div>
      </div>

      {/* Bulle de dialogue style bande dessinée enfantine */}
      <div className="relative flex-1 bg-white/95 backdrop-blur-xs border-3 border-emerald-400 rounded-3xl p-4 shadow-md text-slate-800">
        {/* Petite pointe de la bulle vers Kalo */}
        <div className="absolute left-[-12px] bottom-5 w-0 h-0 border-t-[10px] border-t-transparent border-r-[12px] border-r-emerald-400 border-b-[10px] border-b-transparent"></div>
        <div className="absolute left-[-8px] bottom-5 w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-white border-b-[8px] border-b-transparent"></div>

        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Kalo dit :</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
              {instructionText}
            </p>
          </div>

          <button
            onClick={speak}
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white shadow-md transition"
            title="Répéter la voix"
          >
            {isSpeaking ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
