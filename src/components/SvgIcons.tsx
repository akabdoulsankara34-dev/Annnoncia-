import React from 'react';

export const SvgIcons = {
  // Mascotte Kalo le Caméléon en grand avec expressions
  KaloMascot: ({ mood = 'happy', size = 80, className = '' }: { mood?: 'happy' | 'talking' | 'celebrating' | 'thinking' | 'gentle'; size?: number; className?: string }) => {
    return (
      <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Ombre portée douce */}
        <ellipse cx="80" cy="148" rx="48" ry="10" fill="#000000" fillOpacity="0.12" />

        {/* Queue en spirale enroulée */}
        <path d="M 40 120 C 25 125, 10 115, 15 98 C 18 88, 30 88, 35 96 C 38 102, 33 110, 27 108" 
              stroke="#2D6A4F" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Corps potelé vert tendre */}
        <ellipse cx="78" cy="104" rx="42" ry="32" fill="#52B788" />
        {/* Motifs wax / taches douces sur le dos */}
        <circle cx="68" cy="88" r="5" fill="#40916C" />
        <circle cx="85" cy="85" r="6" fill="#40916C" />
        <circle cx="102" cy="92" r="5" fill="#40916C" />
        <path d="M 55 102 Q 62 108 58 116" stroke="#40916C" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 80 102 Q 87 108 83 118" stroke="#40916C" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Pattes mignonnes */}
        <ellipse cx="58" cy="132" rx="10" ry="7" fill="#40916C" />
        <ellipse cx="98" cy="132" rx="10" ry="7" fill="#40916C" />

        {/* Tête expressive de caméléon */}
        <ellipse cx="108" cy="65" rx="36" ry="32" fill="#52B788" />
        {/* Petite crête arrondie */}
        <circle cx="86" cy="42" r="7" fill="#40916C" />
        <circle cx="100" cy="38" r="9" fill="#40916C" />
        <circle cx="116" cy="42" r="8" fill="#40916C" />

        {/* Grands yeux ronds mobiles */}
        {/* Œil gauche (extérieur visible) */}
        <circle cx="120" cy="60" r="17" fill="#FFFFFF" stroke="#2D6A4F" strokeWidth="2.5" />
        <circle cx="122" cy="60" r="8" fill="#1B4332" />
        <circle cx="125" cy="57" r="3.5" fill="#FFFFFF" />

        {/* Œil droit (légèrement en retrait) */}
        <circle cx="92" cy="55" r="14" fill="#FFFFFF" stroke="#2D6A4F" strokeWidth="2" />
        <circle cx="94" cy="55" r="6" fill="#1B4332" />
        <circle cx="96" cy="53" r="2.5" fill="#FFFFFF" />

        {/* Joues roses mignonnes */}
        <circle cx="110" cy="78" r="8" fill="#FF8FA3" fillOpacity="0.8" />

        {/* Bouche selon humeur */}
        {mood === 'happy' && (
          <path d="M 124 74 Q 134 82 142 72" stroke="#1B4332" strokeWidth="4" strokeLinecap="round" fill="#E63946" />
        )}
        {mood === 'talking' && (
          <ellipse cx="134" cy="75" rx="6" ry="8" fill="#E63946" stroke="#1B4332" strokeWidth="2.5" />
        )}
        {mood === 'celebrating' && (
          <g>
            <path d="M 122 72 Q 134 88 144 72 Z" fill="#E63946" stroke="#1B4332" strokeWidth="2.5" />
            <path d="M 126 78 Q 134 82 140 78" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            {/* Bras levés en l'air qui applaudissent */}
            <path d="M 98 90 Q 115 65 125 50" stroke="#40916C" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 75 90 Q 60 70 55 52" stroke="#40916C" strokeWidth="7" strokeLinecap="round" fill="none" />
          </g>
        )}
        {mood === 'gentle' && (
          <path d="M 125 76 Q 135 80 142 77" stroke="#1B4332" strokeWidth="3" strokeLinecap="round" fill="none" />
        )}
        {mood === 'thinking' && (
          <g>
            <path d="M 126 77 L 138 75" stroke="#1B4332" strokeWidth="3" strokeLinecap="round" />
            {/* Petite bulle de pensée */}
            <circle cx="145" cy="40" r="4" fill="#64748B" fillOpacity="0.4" />
            <circle cx="152" cy="30" r="7" fill="#64748B" fillOpacity="0.4" />
          </g>
        )}
      </svg>
    );
  },

  // Mangue dorée juteuse (symbole récurrent Afrique de l'Ouest)
  Mango: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="mangoGlow" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFE853" />
          <stop offset="55%" stopColor="#FFA41C" />
          <stop offset="100%" stopColor="#E84820" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="90" rx="30" ry="6" fill="#000000" fillOpacity="0.15" />
      {/* Forme galbée de mangue mûre */}
      <path d="M 48 18 C 22 18, 12 45, 20 68 C 28 88, 55 92, 70 82 C 86 70, 88 40, 72 26 C 62 16, 54 18, 48 18 Z" 
            fill="url(#mangoGlow)" stroke="#C83815" strokeWidth="3" />
      {/* Reflet de brillance */}
      <ellipse cx="36" cy="38" rx="8" ry="16" transform="rotate(-25 36 38)" fill="#FFFFFF" fillOpacity="0.5" />
      {/* Tige et feuille vert vif */}
      <path d="M 48 18 Q 46 8 44 4" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" />
      <path d="M 48 14 C 62 8, 72 14, 76 22 C 68 24, 56 22, 48 14 Z" fill="#2E7D32" stroke="#1B5E20" strokeWidth="2" />
    </svg>
  ),

  // Calebasse traditionnelle décorée
  Calabash: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="calabashGrad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F2D7A1" />
          <stop offset="70%" stopColor="#C68B45" />
          <stop offset="100%" stopColor="#8A501F" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="88" rx="34" ry="7" fill="#000000" fillOpacity="0.15" />
      {/* Corps bulbeux de la calebasse */}
      <path d="M 50 14 C 42 14, 38 22, 38 30 C 38 38, 42 42, 32 54 C 20 68, 22 84, 50 86 C 78 84, 80 68, 68 54 C 58 42, 62 38, 62 30 C 62 22, 58 14, 50 14 Z" 
            fill="url(#calabashGrad)" stroke="#5C3312" strokeWidth="3" />
      {/* Gravures pyrogravées traditionnelles */}
      <path d="M 36 62 Q 50 68 64 62" stroke="#5C3312" strokeWidth="2.5" strokeDasharray="3 3" fill="none" />
      <path d="M 32 72 Q 50 80 68 72" stroke="#5C3312" strokeWidth="2.5" strokeDasharray="4 3" fill="none" />
      <circle cx="50" cy="65" r="4" fill="#5C3312" />
      {/* Collet en cordelette */}
      <path d="M 40 38 L 60 38" stroke="#D7CCC8" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),

  // Arbre Baobab majestueux
  Baobab: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="50" cy="92" rx="42" ry="6" fill="#000000" fillOpacity="0.12" />
      {/* Tronc massif sculpté */}
      <path d="M 38 90 C 36 62, 28 50, 20 40 L 32 40 C 38 48, 42 56, 46 62 C 48 56, 46 44, 40 32 L 52 32 C 54 44, 54 52, 56 60 C 60 52, 64 42, 72 34 L 82 38 C 76 48, 68 60, 64 90 Z" 
            fill="#795548" stroke="#4E342E" strokeWidth="2.5" />
      {/* Texture écorce puissante */}
      <path d="M 46 72 Q 50 78 48 86" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
      <path d="M 56 68 Q 54 78 57 88" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
      {/* Rameaux de feuillage stylisés */}
      <circle cx="20" cy="34" r="14" fill="#388E3C" />
      <circle cx="36" cy="24" r="16" fill="#4CAF50" />
      <circle cx="56" cy="20" r="18" fill="#2E7D32" />
      <circle cx="76" cy="26" r="15" fill="#4CAF50" />
      <circle cx="86" cy="38" r="12" fill="#388E3C" />
      {/* Petites fleurs blanches de baobab */}
      <circle cx="38" cy="26" r="3" fill="#FFF" />
      <circle cx="72" cy="28" r="3" fill="#FFF" />
    </svg>
  ),

  // Poussin jaune tout mignon
  Chick: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="50" cy="90" rx="26" ry="5" fill="#000000" fillOpacity="0.12" />
      {/* Pattes fines */}
      <path d="M 42 78 L 42 88 M 38 88 L 46 88" stroke="#F57C00" strokeWidth="3" strokeLinecap="round" />
      <path d="M 58 78 L 58 88 M 54 88 L 62 88" stroke="#F57C00" strokeWidth="3" strokeLinecap="round" />
      {/* Corps dodu jaune */}
      <ellipse cx="50" cy="62" rx="28" ry="24" fill="#FFEB3B" stroke="#FBC02D" strokeWidth="2.5" />
      {/* Petite aile battante */}
      <path d="M 56 60 Q 72 65 62 74 Q 52 72 56 60 Z" fill="#FDD835" />
      {/* Tête */}
      <circle cx="50" cy="36" r="22" fill="#FFEB3B" stroke="#FBC02D" strokeWidth="2.5" />
      {/* Œil pétillant */}
      <circle cx="60" cy="32" r="5" fill="#212121" />
      <circle cx="62" cy="30" r="2" fill="#FFF" />
      {/* Joue rose */}
      <circle cx="56" cy="42" r="4" fill="#FF80AB" />
      {/* Petit bec orange */}
      <path d="M 68 34 L 80 40 L 68 44 Z" fill="#FF9800" stroke="#F57C00" strokeWidth="1.5" />
      {/* Petite houppette sur la tête */}
      <path d="M 50 14 Q 54 8 50 4 Q 46 8 50 14" fill="#FDD835" />
    </svg>
  ),

  // Pièce d'or / 50 FCFA gravée
  CoinFCFA: ({ size = 56, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="44" fill="#FFC107" stroke="#FF8F00" strokeWidth="4" />
      <circle cx="50" cy="50" r="38" stroke="#FFE082" strokeWidth="2" strokeDasharray="4 4" fill="#FFA000" />
      <text x="50" y="52" fontFamily="'Fredoka', sans-serif" fontWeight="900" fontSize="28" fill="#FFFFFF" textAnchor="middle">50</text>
      <text x="50" y="70" fontFamily="'Fredoka', sans-serif" fontWeight="700" fontSize="12" fill="#FFF8E1" textAnchor="middle">FCFA</text>
    </svg>
  ),

  // Étoile d'or brillante
  Star: ({ size = 48, filled = true, className = '' }: { size?: number; filled?: boolean; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M 50 8 L 62 34 L 92 37 L 69 57 L 76 86 L 50 71 L 24 86 L 31 57 L 8 37 L 38 34 Z" 
            fill={filled ? "#FFC107" : "#E2E8F0"} 
            stroke={filled ? "#FFA000" : "#94A3B8"} 
            strokeWidth="4" 
            strokeLinejoin="round" />
      {filled && <circle cx="44" cy="40" r="4" fill="#FFFFFF" fillOpacity="0.8" />}
    </svg>
  ),

  // Éléphant (mot avec E)
  Elephant: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="50" cy="62" rx="30" ry="22" fill="#90A4AE" stroke="#607D8B" strokeWidth="2.5" />
      <circle cx="32" cy="46" r="18" fill="#90A4AE" stroke="#607D8B" strokeWidth="2.5" />
      {/* Grande oreille */}
      <ellipse cx="40" cy="46" rx="10" ry="16" fill="#B0BEC5" stroke="#607D8B" strokeWidth="2" />
      {/* Trompe joyeuse relevée */}
      <path d="M 22 52 C 14 56, 8 46, 12 36 C 14 30, 20 32, 18 38" stroke="#90A4AE" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="42" r="3" fill="#263238" />
      {/* Défense blanche */}
      <path d="M 24 54 Q 18 56 16 50" stroke="#FFF" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Pattes solides */}
      <rect x="34" y="74" width="8" height="16" rx="4" fill="#78909C" />
      <rect x="58" y="74" width="8" height="16" rx="4" fill="#78909C" />
    </svg>
  ),

  // Ananas (mot avec A)
  Pineapple: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Feuilles vertes pointues au sommet */}
      <path d="M 50 30 Q 35 12 25 18 Q 42 24 46 32" fill="#43A047" stroke="#2E7D32" strokeWidth="1.5" />
      <path d="M 50 30 Q 50 8 52 4 Q 54 16 52 30" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
      <path d="M 52 30 Q 65 12 75 18 Q 58 24 54 32" fill="#43A047" stroke="#2E7D32" strokeWidth="1.5" />
      {/* Corps doré quadrillé */}
      <ellipse cx="50" cy="62" rx="26" ry="30" fill="#FFB300" stroke="#E65100" strokeWidth="2.5" />
      <path d="M 32 45 L 68 78 M 32 78 L 68 45 M 26 62 L 74 62" stroke="#EF6C00" strokeWidth="2" strokeDasharray="2 3" />
    </svg>
  ),

  // Igname (mot avec I)
  Yam: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M 20 65 C 25 45, 70 30, 84 45 C 92 60, 75 75, 45 78 C 28 80, 16 75, 20 65 Z" 
            fill="#8D6E63" stroke="#4E342E" strokeWidth="3" />
      {/* Texture écorce d'igname */}
      <circle cx="35" cy="60" r="2" fill="#3E2723" />
      <circle cx="55" cy="52" r="2" fill="#3E2723" />
      <circle cx="68" cy="62" r="2.5" fill="#3E2723" />
      <path d="M 40 54 Q 48 56 46 62" stroke="#5D4037" strokeWidth="2" fill="none" />
      {/* Racine coupée révélant le coeur clair */}
      <ellipse cx="80" cy="48" rx="8" ry="12" fill="#FFF8E1" stroke="#4E342E" strokeWidth="2" />
    </svg>
  ),

  // Orange (mot avec O)
  OrangeFruit: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="54" r="36" fill="#FF9800" stroke="#E65100" strokeWidth="3" />
      <ellipse cx="38" cy="38" rx="8" ry="14" transform="rotate(-30 38 38)" fill="#FFF" fillOpacity="0.4" />
      <path d="M 50 18 Q 48 10 46 6" stroke="#4E342E" strokeWidth="4" strokeLinecap="round" />
      <path d="M 50 16 C 62 10, 70 16, 72 22 C 64 24, 54 22, 50 16 Z" fill="#4CAF50" />
    </svg>
  ),

  // Usine (mot avec U)
  Factory: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Bâtiment avec toits en dents de scie */}
      <path d="M 18 84 L 18 48 L 40 34 L 40 48 L 62 34 L 62 48 L 84 34 L 84 84 Z" fill="#607D8B" stroke="#37474F" strokeWidth="3" />
      {/* Fenêtres carrées lumineuses */}
      <rect x="26" y="58" width="10" height="12" rx="2" fill="#FFEB3B" />
      <rect x="48" y="58" width="10" height="12" rx="2" fill="#FFEB3B" />
      <rect x="70" y="58" width="10" height="12" rx="2" fill="#FFEB3B" />
      {/* Cheminée avec volute de vapeur douce */}
      <rect x="68" y="20" width="12" height="20" fill="#78909C" stroke="#37474F" strokeWidth="2" />
      <circle cx="74" cy="12" r="5" fill="#CFD8DC" />
      <circle cx="78" cy="5" r="7" fill="#ECEFF1" />
    </svg>
  ),

  // Vélo coloré (pour les phrases et syllabes)
  Bicycle: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Roues */}
      <circle cx="26" cy="68" r="18" stroke="#37474F" strokeWidth="4" fill="none" />
      <circle cx="26" cy="68" r="3" fill="#37474F" />
      <circle cx="74" cy="68" r="18" stroke="#37474F" strokeWidth="4" fill="none" />
      <circle cx="74" cy="68" r="3" fill="#37474F" />
      {/* Cadre bleu vif */}
      <path d="M 26 68 L 48 68 L 66 45 L 44 45 Z" stroke="#0288D1" strokeWidth="4" strokeLinejoin="round" fill="none" />
      <path d="M 48 68 L 44 38" stroke="#0288D1" strokeWidth="4" />
      {/* Selle */}
      <path d="M 38 38 L 50 38" stroke="#D32F2F" strokeWidth="5" strokeLinecap="round" />
      {/* Guidon */}
      <path d="M 74 68 L 64 34 L 56 34" stroke="#37474F" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  ),

  // Lionceau (Avatar)
  LionAvatar: ({ size = 56 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#FFA726" />
      {/* Crinière douce en pétales */}
      <circle cx="50" cy="50" r="34" fill="#FB8C00" />
      <circle cx="50" cy="52" r="28" fill="#FFE082" />
      {/* Yeux */}
      <circle cx="40" cy="46" r="4" fill="#3E2723" />
      <circle cx="60" cy="46" r="4" fill="#3E2723" />
      {/* Petit museau */}
      <path d="M 46 54 L 54 54 L 50 58 Z" fill="#D84315" />
      <path d="M 50 58 Q 44 64 42 60 M 50 58 Q 56 64 58 60" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // Gazelle (Avatar)
  GazelleAvatar: ({ size = 56 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#81D4FA" />
      {/* Tête fine */}
      <ellipse cx="50" cy="56" rx="22" ry="26" fill="#D7CCC8" />
      {/* Cornes stylisées */}
      <path d="M 42 36 Q 36 20 38 12" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M 58 36 Q 64 20 62 12" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Grands yeux de biche */}
      <ellipse cx="40" cy="52" rx="4" ry="6" fill="#212121" />
      <ellipse cx="60" cy="52" rx="4" ry="6" fill="#212121" />
      <circle cx="41" cy="50" r="2" fill="#FFF" />
      <circle cx="61" cy="50" r="2" fill="#FFF" />
      {/* Museau */}
      <ellipse cx="50" cy="68" rx="5" ry="3" fill="#4E342E" />
    </svg>
  ),

  // Fennec (Avatar)
  FennecAvatar: ({ size = 56 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#FFE082" />
      {/* Grandes oreilles de fennec */}
      <path d="M 28 44 Q 10 14 26 12 Q 40 24 38 42 Z" fill="#FFE0B2" stroke="#FFB74D" strokeWidth="2" />
      <path d="M 72 44 Q 90 14 74 12 Q 60 24 62 42 Z" fill="#FFE0B2" stroke="#FFB74D" strokeWidth="2" />
      {/* Tête */}
      <ellipse cx="50" cy="58" rx="26" ry="22" fill="#FFF8E1" stroke="#FFA726" strokeWidth="2" />
      {/* Yeux malicieux */}
      <circle cx="38" cy="54" r="5" fill="#3E2723" />
      <circle cx="62" cy="54" r="5" fill="#3E2723" />
      <circle cx="40" cy="52" r="2" fill="#FFF" />
      <circle cx="64" cy="52" r="2" fill="#FFF" />
      {/* Museau pointu */}
      <circle cx="50" cy="65" r="3.5" fill="#D84315" />
    </svg>
  ),

  // Lièvre malin (Avatar)
  HareAvatar: ({ size = 56 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#C8E6C9" />
      {/* Longues oreilles */}
      <ellipse cx="38" cy="24" rx="8" ry="20" fill="#BCAAA4" stroke="#8D6E63" strokeWidth="2" />
      <ellipse cx="38" cy="24" rx="4" ry="14" fill="#FFCDD2" />
      <ellipse cx="62" cy="24" rx="8" ry="20" fill="#BCAAA4" stroke="#8D6E63" strokeWidth="2" />
      <ellipse cx="62" cy="24" rx="4" ry="14" fill="#FFCDD2" />
      {/* Tête */}
      <ellipse cx="50" cy="58" rx="25" ry="22" fill="#D7CCC8" />
      <circle cx="40" cy="54" r="4" fill="#3E2723" />
      <circle cx="60" cy="54" r="4" fill="#3E2723" />
      <path d="M 48 64 L 52 64 L 50 67 Z" fill="#E91E63" />
      {/* Moustaches */}
      <path d="M 30 62 L 20 60 M 30 66 L 18 68 M 70 62 L 80 60 M 70 66 L 82 68" stroke="#8D6E63" strokeWidth="2" />
    </svg>
  ),

  // Girafe (G)
  Giraffe: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#000000" fillOpacity="0.12" />
      {/* Long cou */}
      <path d="M 42 85 L 45 35 L 58 35 L 56 85 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
      {/* Taches */}
      <circle cx="48" cy="72" r="5" fill="#B45309" />
      <circle cx="53" cy="54" r="6" fill="#B45309" />
      <circle cx="49" cy="42" r="4" fill="#B45309" />
      {/* Tête */}
      <ellipse cx="56" cy="30" rx="14" ry="11" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
      {/* Cornillons */}
      <path d="M 52 20 L 52 14 M 50 14 L 54 14" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
      <path d="M 60 20 L 60 14 M 58 14 L 62 14" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
      {/* Œil */}
      <circle cx="60" cy="28" r="3" fill="#1E293B" />
      <circle cx="61" cy="27" r="1" fill="#FFF" />
      {/* Museau */}
      <ellipse cx="66" cy="32" rx="5" ry="4" fill="#FDE68A" />
    </svg>
  ),

  // Soleil (S)
  Sun: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="26" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
      {/* Rayons flamboyants */}
      <g stroke="#D97706" strokeWidth="4" strokeLinecap="round">
        <line x1="50" y1="10" x2="50" y2="18" />
        <line x1="50" y1="82" x2="50" y2="90" />
        <line x1="10" y1="50" x2="18" y2="50" />
        <line x1="82" y1="50" x2="90" y2="50" />
        <line x1="22" y1="22" x2="28" y2="28" />
        <line x1="72" y1="72" x2="78" y2="78" />
        <line x1="78" y1="22" x2="72" y2="28" />
        <line x1="28" y1="72" x2="22" y2="78" />
      </g>
      {/* Visage souriant du soleil */}
      <circle cx="43" cy="46" r="3" fill="#78350F" />
      <circle cx="57" cy="46" r="3" fill="#78350F" />
      <path d="M 44 54 Q 50 60 56 54" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="38" cy="52" r="3" fill="#F87171" opacity="0.6" />
      <circle cx="62" cy="52" r="3" fill="#F87171" opacity="0.6" />
    </svg>
  ),

  // Tortue (T)
  Turtle: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="50" cy="85" rx="30" ry="6" fill="#000000" fillOpacity="0.12" />
      {/* Pattes */}
      <ellipse cx="26" cy="68" rx="8" ry="6" fill="#15803D" />
      <ellipse cx="74" cy="68" rx="8" ry="6" fill="#15803D" />
      {/* Tête */}
      <ellipse cx="80" cy="52" rx="10" ry="8" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
      <circle cx="84" cy="50" r="2" fill="#1E293B" />
      {/* Carapace solide */}
      <path d="M 22 62 C 22 36, 74 36, 74 62 Z" fill="#16A34A" stroke="#14532D" strokeWidth="3" />
      {/* Motifs géométriques carapace */}
      <path d="M 36 62 L 44 48 L 56 48 L 62 62" stroke="#DCFCE7" strokeWidth="2" fill="none" />
      <path d="M 44 48 L 50 38 L 56 48" stroke="#DCFCE7" strokeWidth="2" fill="none" />
    </svg>
  ),

  // Zèbre (Z)
  Zebra: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="50" cy="85" rx="30" ry="6" fill="#000000" fillOpacity="0.12" />
      {/* Corps */}
      <ellipse cx="48" cy="64" rx="28" ry="20" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" />
      {/* Rayures noires */}
      <path d="M 38 48 L 44 78 M 48 45 L 52 82 M 58 48 L 62 78" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
      {/* Tête */}
      <circle cx="68" cy="46" r="16" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" />
      <path d="M 64 34 L 70 48 M 72 36 L 76 52" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="72" cy="42" r="3" fill="#0F172A" />
      {/* Museau noir */}
      <ellipse cx="78" cy="52" rx="6" ry="5" fill="#0F172A" />
      {/* Oreilles */}
      <path d="M 62 32 L 64 22 L 68 32" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
    </svg>
  ),

  // Médaille Grand Champion de l'Alphabet (Sticker reward)
  AlphabetMedal: ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ruban */}
      <path d="M 35 15 L 25 55 L 42 45 L 45 15 Z" fill="#EF4444" />
      <path d="M 65 15 L 75 55 L 58 45 L 55 15 Z" fill="#3B82F6" />
      {/* Médaille d'or */}
      <circle cx="50" cy="55" r="32" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
      <circle cx="50" cy="55" r="26" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
      <text x="50" y="52" fontFamily="'Fredoka', sans-serif" fontWeight="900" fontSize="18" fill="#B45309" textAnchor="middle">Aa</text>
      <text x="50" y="68" fontFamily="'Fredoka', sans-serif" fontWeight="900" fontSize="13" fill="#B45309" textAnchor="middle">Zz</text>
    </svg>
  ),
};
