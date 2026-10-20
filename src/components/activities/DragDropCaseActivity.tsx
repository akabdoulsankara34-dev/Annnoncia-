import React, { useState, useRef } from 'react';
import { sound, speakText } from '../../utils/audio';
import { Sparkles, Check, Move, Hand } from 'lucide-react';

interface DragDropPair {
  id: string;
  upper: string;
  lower: string;
  word?: string;
}

interface DragDropCaseActivityProps {
  pairs: DragDropPair[];
  onSuccess: () => void;
  onMistake?: () => void;
}

export const DragDropCaseActivity: React.FC<DragDropCaseActivityProps> = ({
  pairs,
  onSuccess,
  onMistake,
}) => {
  // Liste des identifiants des paires déjà associées
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  // Pièce actuellement sélectionnée (pour drag ou tap)
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  
  // Coordonnées du drag flottant (support tactile et souris)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [draggingToken, setDraggingToken] = useState<DragDropPair | null>(null);

  // Cibles (slots) avec refs pour la détection de collision au drop
  const dropZoneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Mélange initial des jetons minuscules
  const [shuffledTokens] = useState(() => {
    return [...pairs].sort(() => Math.random() - 0.5);
  });

  // Début du drag au toucher ou clic
  const handlePointerDown = (e: React.PointerEvent, item: DragDropPair) => {
    if (matchedIds.includes(item.id)) return;

    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    setDraggingToken(item);
    setSelectedTokenId(item.id);
    setDragPos({ x: e.clientX, y: e.clientY });

    sound.playPop(520);
    speakText(`Petit ${item.lower}`);
  };

  // Déplacement du jeton avec le doigt
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingToken) return;
    e.preventDefault();
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  // Relâchement du jeton (Drop)
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingToken) return;
    e.preventDefault();

    const clientX = e.clientX;
    const clientY = e.clientY;

    let targetDroppedId: string | null = null;

    // Détection de la cible sous le doigt
    for (const pair of pairs) {
      const el = dropZoneRefs.current[pair.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          targetDroppedId = pair.id;
          break;
        }
      }
    }

    if (targetDroppedId) {
      validateDrop(draggingToken, targetDroppedId);
    }

    setDraggingToken(null);
    setDragPos(null);
  };

  // Validation du dépôt
  const validateDrop = (token: DragDropPair, targetId: string) => {
    if (token.id === targetId) {
      // Victoire ! Le petit a retrouvé le grand
      const nextMatched = [...matchedIds, token.id];
      setMatchedIds(nextMatched);
      setSelectedTokenId(null);

      sound.playSuccess();
      speakText(`Bravo ! Le petit ${token.lower} est avec le grand ${token.upper} !`);

      if (nextMatched.length === pairs.length) {
        setTimeout(() => {
          sound.playStarReward();
          onSuccess();
        }, 800);
      }
    } else {
      // Erreur bienveillante
      sound.playGentleEncouragement();
      speakText(`Oups ! Le petit ${token.lower} cherche le grand ${token.upper}. Essaie encore !`);
      if (onMistake) onMistake();
      setSelectedTokenId(null);
    }
  };

  // Fallback tap direct : toucher un jeton puis toucher le panier
  const handleTargetSlotClick = (targetPair: DragDropPair) => {
    if (matchedIds.includes(targetPair.id) || !selectedTokenId) return;

    const token = pairs.find(p => p.id === selectedTokenId);
    if (token) {
      validateDrop(token, targetPair.id);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-amber-50/90 p-5 rounded-3xl border-3 border-amber-300 shadow-md select-none touch-none">
      {/* En-tête consigne avec animation guide */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200 text-amber-950 font-black text-xs uppercase tracking-wider mb-1">
          <Hand className="w-3.5 h-3.5 animate-bounce text-amber-700" />
          <span>Activité Glisser-Déposer</span>
        </div>
        <h4 className="text-lg sm:text-xl font-black text-slate-800">
          Glisse chaque minuscule vers sa MAJUSCULE !
        </h4>
        <p className="text-xs font-semibold text-slate-600 mt-0.5">
          Attrape la petite lettre bleue avec ton doigt et dépose-la dans le panier rouge de sa maman !
        </p>
      </div>

      {/* ZONE 1 : Paniers récepteurs des MAJUSCULES (Drop Targets) */}
      <div className="w-full mb-6">
        <span className="text-xs font-black uppercase tracking-wider text-rose-700 block text-center mb-2">
          1. Paniers des MAJUSCULES (Dépose ici)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          {pairs.map((p) => {
            const isMatched = matchedIds.includes(p.id);

            return (
              <div
                key={`slot_${p.id}`}
                ref={(el) => { dropZoneRefs.current[p.id] = el; }}
                onClick={() => handleTargetSlotClick(p)}
                className={`min-h-[115px] p-3 rounded-3xl border-3 flex flex-col items-center justify-between transition-all duration-300 cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-100 border-emerald-500 scale-102 shadow-md'
                    : selectedTokenId === p.id
                    ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 animate-pulse'
                    : 'bg-white border-dashed border-rose-300 hover:border-rose-500 shadow-xs'
                }`}
              >
                {/* Grande lettre Majuscule */}
                <div className="flex items-center gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-rose-600">
                    {p.upper}
                  </span>
                  {p.word && (
                    <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">
                      ({p.word})
                    </span>
                  )}
                </div>

                {/* Emplacement de réception pour la minuscule */}
                <div className={`w-full py-1.5 px-2 rounded-xl flex items-center justify-center font-black transition-all ${
                  isMatched
                    ? 'bg-emerald-500 text-white text-2xl shadow-xs'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 text-xs'
                }`}>
                  {isMatched ? (
                    <div className="flex items-center gap-1.5">
                      <span>{p.lower}</span>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <span>Dépose ici</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ZONE 2 : Jetons des minuscules à glisser (Draggable Tokens) */}
      <div className="w-full bg-white/70 p-4 rounded-3xl border-2 border-amber-200 shadow-inner">
        <span className="text-xs font-black uppercase tracking-wider text-blue-700 block text-center mb-2.5">
          2. Petites lettres à attraper et glisser au doigt :
        </span>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {shuffledTokens.map((token) => {
            const isMatched = matchedIds.includes(token.id);
            const isDraggingThis = draggingToken?.id === token.id;
            const isSelected = selectedTokenId === token.id;

            if (isMatched) {
              return (
                <div
                  key={`done_${token.id}`}
                  className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-dashed border-emerald-300 flex items-center justify-center opacity-40 text-emerald-700 font-black text-xl"
                >
                  ✓
                </div>
              );
            }

            return (
              <div
                key={`drag_${token.id}`}
                onPointerDown={(e) => handlePointerDown(e, token)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`w-16 h-16 rounded-2xl font-black text-3xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform touch-none shadow-md ${
                  isDraggingThis
                    ? 'opacity-30 scale-90'
                    : isSelected
                    ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-300 scale-105 border-2 border-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95 border-2 border-white'
                }`}
              >
                <span>{token.lower}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Jeton flottant qui suit précisément le doigt pendant le glissement */}
      {draggingToken && dragPos && (
        <div
          style={{
            position: 'fixed',
            left: `${dragPos.x}px`,
            top: `${dragPos.y}px`,
            transform: 'translate(-50%, -50%) scale(1.15)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          className="w-18 h-18 rounded-2xl bg-blue-500 text-white font-black text-4xl flex items-center justify-center shadow-2xl border-3 border-amber-300 animate-pulse"
        >
          {draggingToken.lower}
        </div>
      )}

      {/* Célébration joyeuse quand tout est complété */}
      {matchedIds.length === pairs.length && (
        <div className="mt-5 flex items-center gap-2 text-emerald-700 font-black text-lg animate-star-float">
          <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
          <span>Gagné ! Toutes les minuscules ont retrouvé leurs majuscules !</span>
        </div>
      )}
    </div>
  );
};
