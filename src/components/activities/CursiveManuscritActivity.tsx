import React, { useState, useRef, useEffect } from 'react';
import { sound, speakText } from '../../utils/audio';
import { Sparkles, RotateCcw, CheckCircle2, Feather, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';

export interface CursiveLetterData {
  char: string;
  capital: string;
  script: string;
  cursive: string;
  word: string;
  category: 'ronde' | 'boucle' | 'pont' | 'descend';
  strokeInstruction: string;
}

const ALPHABET_CURSIVE_LIST: CursiveLetterData[] = [
  { char: 'a', capital: 'A', script: 'a', cursive: '𝒶', word: 'Ananas', category: 'ronde', strokeInstruction: 'On part de la première ligne, on tourne vers la gauche pour fermer le rond et on fait la petite canne !' },
  { char: 'b', capital: 'B', script: 'b', cursive: '𝒷', word: 'Baobab', category: 'boucle', strokeInstruction: 'Grande boucle qui monte jusqu’au 3e interligne, on redescend droit et petite boucle à droite !' },
  { char: 'c', capital: 'C', script: 'c', cursive: '𝒸', word: 'Calebasse', category: 'ronde', strokeInstruction: 'On commence en haut du 1er interligne et on arrondit comme un croissant de lune !' },
  { char: 'd', capital: 'D', script: 'd', cursive: '𝒹', word: 'Dromadaire', category: 'ronde', strokeInstruction: 'Un rond fermé comme le a, puis une grande barre droite qui monte au 2e interligne !' },
  { char: 'e', capital: 'E', script: 'e', cursive: '𝑒', word: 'Éléphant', category: 'boucle', strokeInstruction: 'Une petite boucle douce qui avance entre la ligne violette et le 1er interligne bleu !' },
  { char: 'f', capital: 'F', script: 'f', cursive: '𝒻', word: 'Fennec', category: 'boucle', strokeInstruction: 'Grande boucle qui monte à 3 interlignes, puis plonge droit à 2 interlignes sous la ligne !' },
  { char: 'g', capital: 'G', script: 'g', cursive: '𝑔', word: 'Girafe', category: 'descend', strokeInstruction: 'Un rond fermé, puis on plonge droit sous la terre avec une belle boucle qui remonte !' },
  { char: 'h', capital: 'H', script: 'h', cursive: '𝒽', word: 'Hutte', category: 'boucle', strokeInstruction: 'Grande boucle haute de 3 interlignes, on descend droit puis on fait un pont régulier !' },
  { char: 'i', capital: 'I', script: 'i', cursive: '𝒾', word: 'Igname', category: 'pont', strokeInstruction: 'On monte au 1er interligne, on redescend droit avec une petite canne et un point !' },
  { char: 'j', capital: 'J', script: 'j', cursive: '𝒿', word: 'Jarre', category: 'descend', strokeInstruction: 'Un trait penché, on plonge droit sous la terre avec une boucle, et un petit point !' },
  { char: 'k', capital: 'K', script: 'k', cursive: '𝓀', word: 'Karité', category: 'boucle', strokeInstruction: 'Grande boucle haute, puis un petit nœud comme un bras et une jambe qui s’appuie !' },
  { char: 'l', capital: 'L', script: 'l', cursive: '𝓁', word: 'Lion', category: 'boucle', strokeInstruction: 'Grande boucle qui s’envole jusqu’au 3e ciel et redescend bien droite !' },
  { char: 'm', capital: 'M', script: 'm', cursive: '𝓂', word: 'Mangue', category: 'pont', strokeInstruction: 'Trois beaux ponts réguliers qui touchent la ligne de base d’écolier !' },
  { char: 'n', capital: 'N', script: 'n', cursive: '𝓃', word: 'Nénuphar', category: 'pont', strokeInstruction: 'Deux beaux ponts réguliers qui touchent la ligne violette !' },
  { char: 'o', capital: 'O', script: 'o', cursive: '𝑜', word: 'Orange', category: 'ronde', strokeInstruction: 'On tourne vers la gauche pour fermer le rond, puis une petite queue en l’air !' },
  { char: 'p', capital: 'P', script: 'p', cursive: '𝓅', word: 'Poussin', category: 'descend', strokeInstruction: 'On monte penché, on plonge droit sous la terre à 2 interlignes, puis un beau pont !' },
  { char: 'q', capital: 'Q', script: 'q', cursive: '𝓆', word: 'Quenouille', category: 'descend', strokeInstruction: 'Un rond fermé comme le a, puis une barre droite qui descend sous la terre !' },
  { char: 'r', capital: 'R', script: 'r', cursive: '𝓇', word: 'Rame', category: 'pont', strokeInstruction: 'On monte au 1er interligne, un petit œilleton horizontal, et on descend avec une canne !' },
  { char: 's', capital: 'S', script: 's', cursive: '𝓈', word: 'Soleil', category: 'pont', strokeInstruction: 'Un trait penché qui monte et un joli petit ventre bien arrondi !' },
  { char: 't', capital: 'T', script: 't', cursive: '𝓉', word: 'Tortue', category: 'pont', strokeInstruction: 'Une grande barre droite qui descend du 2e interligne et une petite barre couchée !' },
  { char: 'u', capital: 'U', script: 'u', cursive: '𝓊', word: 'Usine', category: 'pont', strokeInstruction: 'Deux pointes reliées par un creux arrondi comme un bol qui sourit !' },
  { char: 'v', capital: 'V', script: 'v', cursive: '𝓋', word: 'Vélo', category: 'pont', strokeInstruction: 'Une petite vague qui descend, remonte au 1er interligne avec un œilleton !' },
  { char: 'w', capital: 'W', script: 'w', cursive: '𝓌', word: 'Wagon', category: 'pont', strokeInstruction: 'Comme deux v attachés ensemble avec souplesse !' },
  { char: 'x', capital: 'X', script: 'x', cursive: '𝓍', word: 'Xylophone', category: 'ronde', strokeInstruction: 'Un pont arrondi vers la gauche et un demi-rond vers la droite qui se touchent !' },
  { char: 'y', capital: 'Y', script: 'y', cursive: '𝓎', word: 'Yoyo', category: 'descend', strokeInstruction: 'On commence comme un u, puis on plonge sous la terre avec une boucle à gauche !' },
  { char: 'z', capital: 'Z', script: 'z', cursive: '𝓏', word: 'Zèbre', category: 'descend', strokeInstruction: 'Un trait couché, un trait penché, et une belle boucle sous la terre !' },
];

export const CursiveManuscritActivity: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState<'all' | 'ronde' | 'boucle' | 'pont' | 'descend'>('all');
  const activeLetter = ALPHABET_CURSIVE_LIST[selectedIdx];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  // Filtrer les lettres selon la famille de tracé
  const filteredLetters = ALPHABET_CURSIVE_LIST.filter(l => 
    activeCategory === 'all' ? true : l.category === activeCategory
  );

  const handleSelectLetter = (char: string) => {
    const idx = ALPHABET_CURSIVE_LIST.findIndex(l => l.char === char);
    if (idx >= 0) {
      setSelectedIdx(idx);
      sound.playPop(500);
      speakText(`${ALPHABET_CURSIVE_LIST[idx].char} cursive, comme ${ALPHABET_CURSIVE_LIST[idx].word}`);
    }
  };

  const handlePrevLetter = () => {
    const nextIdx = (selectedIdx - 1 + ALPHABET_CURSIVE_LIST.length) % ALPHABET_CURSIVE_LIST.length;
    setSelectedIdx(nextIdx);
    sound.playPop(460);
    speakText(`${ALPHABET_CURSIVE_LIST[nextIdx].char}`);
  };

  const handleNextLetter = () => {
    const nextIdx = (selectedIdx + 1) % ALPHABET_CURSIVE_LIST.length;
    setSelectedIdx(nextIdx);
    sound.playPop(520);
    speakText(`${ALPHABET_CURSIVE_LIST[nextIdx].char}`);
  };

  // Réinitialiser le canevas avec les réglures de cahier Seyès
  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setIsValidated(false);

    // Dessin des lignes Seyès sur le canevas
    ctx.save();
    // Marge rouge à gauche
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.lineTo(50, canvas.height);
    ctx.stroke();

    // Ligne de base (violette d'écolier)
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.65);
    ctx.lineTo(canvas.width, canvas.height * 0.65);
    ctx.stroke();

    // Interlignes Seyès (bleu clair)
    ctx.strokeStyle = '#93C5FD';
    ctx.lineWidth = 1;
    [-2, -1, 1].forEach((level) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.65 + level * 35);
      ctx.lineTo(canvas.width, canvas.height * 0.65 + level * 35);
      ctx.stroke();
    });
    ctx.restore();
  };

  useEffect(() => {
    resetCanvas();
  }, [selectedIdx]);

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

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || isValidated) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1E3A8A'; // Encre bleue d'écolier
    ctx.lineWidth = 12;
    sound.playPop(480);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing || isValidated) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const handleValidate = () => {
    setIsValidated(true);
    sound.playSuccess();
    speakText(`Bravo ! Très belle écriture cursive pour la lettre ${activeLetter.char} !`);
    setTimeout(onSuccess, 800);
  };

  const handleHearAdvice = () => {
    sound.playPop(520);
    speakText(`${activeLetter.char} en écriture cursive attachée. ${activeLetter.strokeInstruction}`);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-amber-50/90 p-5 rounded-3xl border-3 border-amber-300 shadow-md select-none">
      {/* En-tête atelier manuscrit */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 font-black text-xs uppercase tracking-wider mb-1">
          <Feather className="w-3.5 h-3.5 text-indigo-700" />
          <span>Atelier d'Écriture Manuscrite Cursive (CP)</span>
        </div>
        <h4 className="text-lg sm:text-xl font-black text-slate-800">
          Les 3 écritures de la lettre : <span className="text-rose-600">{activeLetter.capital}</span>
        </h4>
      </div>

      {/* Les 3 écritures comparées (Capitale, Scripte, Cursive d'écolier) */}
      <div className="grid grid-cols-3 gap-2 w-full mb-4">
        {/* Capitale d'imprimerie */}
        <div className="p-2.5 rounded-2xl bg-white border-2 border-rose-200 text-center shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
            1. Capitale
          </span>
          <span className="text-4xl sm:text-5xl font-black text-rose-600 my-1 block">
            {activeLetter.capital}
          </span>
          <span className="text-[10px] font-bold text-slate-500">Pour les titres</span>
        </div>

        {/* Minuscule scripte */}
        <div className="p-2.5 rounded-2xl bg-white border-2 border-blue-200 text-center shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
            2. Scripte
          </span>
          <span className="text-4xl sm:text-5xl font-black text-blue-600 my-1 block">
            {activeLetter.script}
          </span>
          <span className="text-[10px] font-bold text-slate-500">Dans les livres</span>
        </div>

        {/* Cursive manuscrite attachée */}
        <div className="p-2.5 rounded-2xl bg-amber-100 border-3 border-amber-400 text-center shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
            3. Cursive (Manuscrite)
          </span>
          <span className="text-4xl sm:text-5xl font-manuscrit text-indigo-900 my-1 block">
            {activeLetter.char}
          </span>
          <span className="text-[10px] font-bold text-amber-800">Sur ton cahier !</span>
        </div>
      </div>

      {/* Conseil de tracé écoutable */}
      <div 
        onClick={handleHearAdvice}
        className="w-full bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-xs mb-3 flex items-center justify-between cursor-pointer hover:bg-amber-50 active:scale-98 transition group"
      >
        <div className="text-left text-xs font-bold text-slate-700 leading-snug pr-2">
          <span className="text-indigo-700 font-black block">Conseil du maître Kalo :</span>
          {activeLetter.strokeInstruction}
        </div>
        <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 group-hover:scale-110 transition shadow-xs">
          <Volume2 className="w-5 h-5" />
        </div>
      </div>

      {/* Canevas tactile avec lignage de cahier Seyès CP */}
      <div className="relative w-full aspect-[4/3] max-w-[340px] rounded-2xl shadow-md border-3 border-indigo-300 overflow-hidden touch-none select-none cahier-seyes">
        {/* Modèle de lettre manuscrite en filigrane sur les lignes Seyès */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[130px] select-none text-indigo-200/60 font-manuscrit tracking-normal">
            {activeLetter.char}
          </span>
        </div>

        {/* Le canevas de tracé au doigt */}
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="absolute inset-0 w-full h-full cursor-crosshair canvas-draw z-10"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />

        {isValidated && (
          <div className="absolute inset-0 bg-emerald-500/85 z-20 flex flex-col items-center justify-center text-white p-4 animate-star-float">
            <Sparkles className="w-14 h-14 text-yellow-300 mb-1 animate-spin" />
            <span className="text-2xl font-black">Bravo !</span>
            <span className="text-xs font-semibold">Magnifique écriture d'écolier !</span>
          </div>
        )}
      </div>

      {/* Familles de lettres (Rondes, Boucles, Ponts, Sous-terre) */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 w-full mb-3">
        {[
          { key: 'all', label: 'Toutes (26)' },
          { key: 'ronde', label: 'Rondes (a, c, d, o...)' },
          { key: 'boucle', label: 'Boucles (b, e, f, l...)' },
          { key: 'pont', label: 'Ponts (m, n, r, s...)' },
          { key: 'descend', label: 'Sous-terre (g, j, p, y...)' }
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key as any)}
            className={`px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
              activeCategory === cat.key
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Navigation lettre par lettre avec chevrons et ruban */}
      <div className="flex items-center gap-2 w-full justify-between mb-3 bg-white/70 p-2 rounded-2xl border-2 border-indigo-100">
        <button
          onClick={handlePrevLetter}
          className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black flex items-center justify-center shadow-xs active:scale-95 transition cursor-pointer shrink-0"
          title="Lettre précédente"
        >
          <ChevronLeft className="w-6 h-6 stroke-[3]" />
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto p-1 max-w-[340px]">
          {filteredLetters.map((l) => (
            <button
              key={l.char}
              onClick={() => handleSelectLetter(l.char)}
              className={`w-9 h-9 rounded-xl font-manuscrit text-2xl font-bold transition shrink-0 flex items-center justify-center cursor-pointer ${
                activeLetter.char === l.char 
                  ? 'bg-indigo-600 text-white shadow-md scale-110' 
                  : 'bg-white text-slate-800 hover:bg-indigo-50 border border-slate-300'
              }`}
              title={`${l.capital} ${l.char} (${l.word})`}
            >
              {l.char}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextLetter}
          className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black flex items-center justify-center shadow-xs active:scale-95 transition cursor-pointer shrink-0"
          title="Lettre suivante"
        >
          <ChevronRight className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* Barre d'action : Effacer & Valider */}
      <div className="flex items-center gap-3 mt-3 w-full justify-between">
        <button
          onClick={resetCanvas}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs sm:text-sm transition cursor-pointer min-h-[48px]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Effacer le cahier</span>
        </button>

        <button
          onClick={handleValidate}
          disabled={!hasDrawn || isValidated}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer min-h-[48px] ${
            hasDrawn && !isValidated
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-400/40'
              : 'bg-slate-300 text-slate-500 opacity-60 cursor-not-allowed'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span>J'ai tracé !</span>
        </button>
      </div>
    </div>
  );
};
