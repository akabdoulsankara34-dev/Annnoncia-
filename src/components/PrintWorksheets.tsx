import React from 'react';

export const PrintWorksheets: React.FC = () => {
  return (
    <div className="print-only p-8 text-black bg-white max-w-4xl mx-auto">
      {/* FICHE 1 : ÉCRITURE DES VOYELLES */}
      <div className="page-break mb-12">
        <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wide">Fiche d'Écriture CP : Les Voyelles</h1>
            <p className="text-sm font-semibold text-gray-700">Le Grand Livre Magique de CP</p>
          </div>
          <div className="border-2 border-black p-3 rounded-lg text-sm font-bold min-w-[200px]">
            Prénom de l'élève : ..............................<br />
            Date : ..............................................
          </div>
        </div>

        <div className="space-y-8">
          {['A', 'E', 'I', 'O', 'U'].map((lettre) => (
            <div key={lettre} className="flex items-center gap-6">
              <div className="w-16 h-16 border-2 border-black rounded-lg flex items-center justify-center text-4xl font-black">
                {lettre}
              </div>
              <div className="flex-1 space-y-3">
                <div className="border-b-2 border-dashed border-gray-400 h-6"></div>
                <div className="border-b-2 border-black h-6 flex items-center gap-12 text-gray-300 font-serif text-2xl">
                  <span>{lettre}</span>
                  <span>{lettre}</span>
                  <span>{lettre}</span>
                  <span>{lettre}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FICHE 2 : CALCUL ET ADDITIONS */}
      <div className="page-break mb-12">
        <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wide">Fiche de Calcul CP : Additions et Comptage</h1>
            <p className="text-sm font-semibold text-gray-700">Le Grand Livre Magique de CP</p>
          </div>
          <div className="border-2 border-black p-3 rounded-lg text-sm font-bold min-w-[200px]">
            Prénom de l'élève : ..............................<br />
            Date : ..............................................
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-lg font-bold">
          <div className="border-2 border-gray-300 p-4 rounded-xl">
            <p className="mb-2">1. Compte les mangues et écris le total :</p>
            <p className="text-2xl mb-2">🥭 🥭 🥭 + 🥭 🥭 = .......</p>
            <p className="text-sm text-gray-500 font-normal">3 + 2 = .......</p>
          </div>

          <div className="border-2 border-gray-300 p-4 rounded-xl">
            <p className="mb-2">2. Compte les poussins :</p>
            <p className="text-2xl mb-2">🐥 🐥 🐥 🐥 + 🐥 🐥 🐥 🐥 = .......</p>
            <p className="text-sm text-gray-500 font-normal">4 + 4 = .......</p>
          </div>

          <div className="border-2 border-gray-300 p-4 rounded-xl">
            <p className="mb-2">3. Soustraction :</p>
            <p className="text-2xl mb-2">6 calebasses moins 2 = .......</p>
            <p className="text-sm text-gray-500 font-normal">6 - 2 = .......</p>
          </div>

          <div className="border-2 border-gray-300 p-4 rounded-xl">
            <p className="mb-2">4. Monnaie locale :</p>
            <p className="text-2xl mb-2">5 pièces + 5 pièces = ....... pièces</p>
            <p className="text-sm text-gray-500 font-normal">5 + 5 = .......</p>
          </div>
        </div>
      </div>

      {/* FICHE 3 : L'ALPHABET MAJUSCULES & MINUSCULES */}
      <div className="page-break mb-12">
        <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wide">Fiche de Correspondance : Majuscules & Minuscules</h1>
            <p className="text-sm font-semibold text-gray-700">Le Grand Livre Magique de CP - Les 26 Lettres</p>
          </div>
          <div className="border-2 border-black p-3 rounded-lg text-sm font-bold min-w-[200px]">
            Prénom de l'élève : ..............................<br />
            Date : ..............................................
          </div>
        </div>

        <p className="text-sm font-bold mb-6">Consigne : Relie chaque lettre majuscule à sa lettre minuscule avec une règle !</p>

        <div className="grid grid-cols-2 gap-12 text-2xl font-black max-w-lg mx-auto">
          <div className="space-y-6 text-center border-r-2 border-dashed border-gray-400 pr-6">
            <div className="p-2 border-2 border-black rounded-lg">A &bull;</div>
            <div className="p-2 border-2 border-black rounded-lg">B &bull;</div>
            <div className="p-2 border-2 border-black rounded-lg">D &bull;</div>
            <div className="p-2 border-2 border-black rounded-lg">M &bull;</div>
            <div className="p-2 border-2 border-black rounded-lg">R &bull;</div>
            <div className="p-2 border-2 border-black rounded-lg">T &bull;</div>
          </div>
          <div className="space-y-6 text-center pl-6">
            <div className="p-2 border-2 border-black rounded-lg">&bull; d</div>
            <div className="p-2 border-2 border-black rounded-lg">&bull; a</div>
            <div className="p-2 border-2 border-black rounded-lg">&bull; b</div>
            <div className="p-2 border-2 border-black rounded-lg">&bull; r</div>
            <div className="p-2 border-2 border-black rounded-lg">&bull; t</div>
            <div className="p-2 border-2 border-black rounded-lg">&bull; m</div>
          </div>
        </div>
      </div>
    </div>
  );
};
