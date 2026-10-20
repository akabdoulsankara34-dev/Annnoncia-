/**
 * Synthesiseur audio 100% autonome et hors ligne utilisant le Web Audio API
 * et la synthèse vocale SpeechSynthesis.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  /**
   * Bruit doux de page qui tourne (effet papier froissé feutré)
   */
  public playPageFlip() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Pink/White noise buffer simulation for paper rustle
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.2;
        output[i] = (b0 + b1 + b2) * 0.15;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.22);
      filter.Q.setValueAtTime(1.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.25);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Son bulle pop joyeux (quand on touche un fruit ou compte)
   */
  public playPop(frequency = 520) {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.8, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  /**
   * Fanfare / Son de réussite joyeux
   */
  public playSuccess() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const now = ctx.currentTime + index * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch {}
  }

  /**
   * Son d'encouragement doux (marimba chaleureuse)
   */
  public playGentleEncouragement() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [440, 392]; // A4, G4 doux
      notes.forEach((freq, index) => {
        const now = ctx.currentTime + index * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      });
    } catch {}
  }

  /**
   * Son magique d'étoile ou autocollant débloqué
   */
  public playStarReward() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98]; // E5, G5, B5, E6, G6
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
      });
    } catch {}
  }
}

export const sound = new SoundEngine();

/**
 * Synthèse Vocale (Web Speech API) en français
 */
export function speakText(
  text: string, 
  options?: { 
    rate?: number; 
    pitch?: number; 
    onStart?: () => void; 
    onEnd?: () => void; 
    onBoundary?: (charIndex: number) => void;
  }
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Annule la lecture précédente

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = options?.rate || 0.85; // Rythme un peu plus lent pour enfant de 6 ans
    utterance.pitch = options?.pitch || 1.15; // Voix chaleureuse et lumineuse

    // Essayer de trouver une voix française naturelle si disponible
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith('fr') && (v.name.includes('Amélie') || v.name.includes('Google') || v.name.includes('Thomas') || v.name.includes('Audrey')));
    if (frVoice) {
      utterance.voice = frVoice;
    }

    if (options?.onStart) utterance.onstart = options.onStart;
    if (options?.onEnd) utterance.onend = options.onEnd;
    if (options?.onBoundary) {
      utterance.onboundary = (e) => {
        options.onBoundary!(e.charIndex);
      };
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Reconnaissance vocale (SpeechRecognition API) pour le mode "Lis avec moi"
 */
export function startVoiceRecognition(
  expectedWord: string,
  onResult: (heard: string, isMatch: boolean) => void,
  onError: () => void
): { stop: () => void } | null {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition = 
    (window as unknown as { SpeechRecognition?: any }).SpeechRecognition || 
    (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError();
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: any) => {
      const heard = event.results[0][0].transcript.trim().toLowerCase();
      const cleanExpected = expectedWord.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const cleanHeard = heard.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const isMatch = cleanHeard.includes(cleanExpected) || cleanExpected.includes(cleanHeard);
      onResult(heard, isMatch);
    };

    recognition.onerror = () => {
      onError();
    };

    recognition.start();

    return {
      stop: () => {
        try { recognition.stop(); } catch {}
      }
    };
  } catch {
    onError();
    return null;
  }
}
