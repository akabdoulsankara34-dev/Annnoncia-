import React, { useRef, useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { RotateCcw, CheckCircle2, Sparkles, Wand2 } from 'lucide-react';

interface TracingCanvasProps {
  letter: string;
  strokeHelp?: string;
  fontType?: 'script' | 'cursive';
  onSuccess: () => void;
}

export const TracingCanvas: React.FC<TracingCanvasProps> = ({
  letter,
  strokeHelp = 'Suis les flèches avec ton doigt !',
  fontType = 'script',
  onSuccess,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [validated, setValidated] = useState(false);
  const [drawnPointsCount, setDrawnPointsCount] = useState(0);

  // Clear canvas and draw background guidelines
  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setValidated(false);
    setDrawnPointsCount(0);

    // Draw notebook Seyès light guidelines
    ctx.save();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    // Base line
    ctx.beginPath();
    ctx.moveTo(20, canvas.height * 0.75);
    ctx.lineTo(canvas.width - 20, canvas.height * 0.75);
    ctx.stroke();

    // Top line
    ctx.strokeStyle = '#F1F5F9';
    ctx.beginPath();
    ctx.moveTo(20, canvas.height * 0.25);
    ctx.lineTo(canvas.width - 20, canvas.height * 0.25);
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    resetCanvas();
  }, [letter, fontType]);

  const getCanvasCoords = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || validated) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2563EB'; // Bleu doux et net
    ctx.lineWidth = 18;

    sound.playPop(480);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing || validated) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();

    setDrawnPointsCount(prev => prev + 1);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Validation bienveillante : si l'enfant a tracé un bon nombre de points, on valide avec succès
  const checkValidation = () => {
    if (drawnPointsCount < 15) {
      sound.playGentleEncouragement();
      return;
    }

    setValidated(true);
    sound.playSuccess();
    onSuccess();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto bg-amber-50/70 p-4 rounded-3xl border-3 border-amber-200 shadow-inner">
      {/* Consigne d'écriture */}
      <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-sm sm:text-base">
        <Wand2 className="w-5 h-5 text-amber-600 animate-pulse" />
        <span>{strokeHelp}</span>
      </div>

      {/* Cadre de tracé avec canevas tactile */}
      <div className="relative w-full aspect-square max-w-[320px] bg-white rounded-2xl shadow-md border-3 border-amber-300 overflow-hidden touch-none select-none">
        {/* Modèle de lettre en filigrane sous le canevas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span 
            className={`text-[170px] select-none text-slate-200 font-black tracking-normal transition-all ${
              fontType === 'cursive' ? 'font-serif italic text-[150px]' : 'font-sans'
            }`}
          >
            {letter}
          </span>
        </div>

        {/* Flèches indicatrices animées */}
        {!hasDrawn && (
          <div className="absolute top-1/4 left-1/3 flex items-center gap-1.5 bg-emerald-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce pointer-events-none">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <span>Commence ici !</span>
          </div>
        )}

        {/* Le canevas de tracé au doigt */}
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="absolute inset-0 w-full h-full cursor-crosshair canvas-draw z-10"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Félicitations de réussite */}
        {validated && (
          <div className="absolute inset-0 bg-emerald-500/85 z-20 flex flex-col items-center justify-center text-white p-4 animate-star-float">
            <Sparkles className="w-16 h-16 text-yellow-300 mb-2 animate-spin" />
            <span className="text-2xl font-black">Bravo !</span>
            <span className="text-sm font-semibold mt-1">Magnifique tracé !</span>
          </div>
        )}
      </div>

      {/* Boutons d'action pour enfant */}
      <div className="flex items-center gap-3 mt-4 w-full justify-center">
        <button
          onClick={resetCanvas}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-700 font-bold text-sm shadow transition"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Effacer</span>
        </button>

        <button
          onClick={checkValidation}
          disabled={!hasDrawn || validated}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-base shadow-lg transition active:scale-95 ${
            hasDrawn && !validated
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-400/50'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>J’ai terminé !</span>
        </button>
      </div>
    </div>
  );
};
