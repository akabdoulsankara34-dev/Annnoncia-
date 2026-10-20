import React, { useState } from 'react';
import { Download, Smartphone, AlertTriangle, CheckCircle, FileCode, X, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface OfflineStandaloneExporterProps {
  onClose: () => void;
}

export const OfflineStandaloneExporter: React.FC<OfflineStandaloneExporterProps> = ({ onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadSingleHTML = () => {
    sound.playSuccess();
    setDownloaded(true);

    // Génération du fichier HTML autonome tout-en-un (HTML + CSS + JS + SVG)
    const standaloneHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Le Grand Livre Magique de CP (Version Autonome Hors-Ligne)</title>
  <style>
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #F4EBD9; color: #1e293b; user-select: none; }
    .header { background: #1B4965; color: white; padding: 16px; text-align: center; }
    .card { background: white; margin: 16px auto; max-width: 500px; padding: 20px; border-radius: 24px; border: 3px solid #f59e0b; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .letter { font-size: 80px; font-weight: 900; color: #e11d48; text-align: center; margin: 10px 0; }
    .btn { display: block; width: 100%; min-height: 56px; border: none; border-radius: 16px; font-size: 18px; font-weight: 900; cursor: pointer; margin: 8px 0; transition: transform 0.1s; }
    .btn:active { transform: scale(0.96); }
    .btn-primary { background: #10b981; color: white; }
    .btn-voice { background: #fbbf24; color: #78350f; }
    .btn-nav { background: #e2e8f0; color: #334155; }
    .nav-bar { display: flex; gap: 8px; justify-content: space-between; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin:0; font-size:20px;">Le Grand Livre Magique de CP</h1>
    <p style="margin:4px 0 0; font-size:12px; opacity:0.8;">Fichier 100% autonome hors-ligne</p>
  </div>
  <div class="card" id="page-content">
    <h2 id="page-title" style="margin-top:0; color:#0f172a;">Chargement...</h2>
    <div id="page-body"></div>
    <div class="nav-bar">
      <button class="btn btn-nav" onclick="prev()">Page précédente</button>
      <button class="btn btn-primary" onclick="next()">Page suivante</button>
    </div>
  </div>
  <script>
    const pages = [
      { t: "La voyelle A", l: "A", w: "A comme Ananas", c: "Touche la lettre pour l'écouter !" },
      { t: "La voyelle E", l: "E", w: "E comme Éléphant", c: "Écoute le son de la savane !" },
      { t: "La voyelle I", l: "I", w: "I comme Igname", c: "Un trait tout droit du haut vers le bas !" },
      { t: "La voyelle O", l: "O", w: "O comme Orange", c: "Un cercle tout rond avec la bouche !" },
      { t: "La voyelle U", l: "U", w: "U comme Usine", c: "Le bol qui sourit !" },
      { t: "Compter jusqu'à 5", l: "1 2 3 4 5", w: "🥭 🥭 🥭 🥭 🥭", c: "Touche pour compter les mangues !" },
      { t: "Additions simples", l: "3 + 2 = 5", w: "3 mangues + 2 mangues", c: "Combien en tout ?" }
    ];
    let cur = 0;
    function speak(txt) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(txt);
        u.lang = 'fr-FR';
        window.speechSynthesis.speak(u);
      }
    }
    function render() {
      const p = pages[cur];
      document.getElementById('page-title').innerText = p.t + ' (' + (cur+1) + '/' + pages.length + ')';
      document.getElementById('page-body').innerHTML = 
        '<p style="font-size:16px; font-weight:bold; color:#475569;">' + p.c + '</p>' +
        '<div class="letter" onclick="speak(\\'' + p.l + '\\')">' + p.l + '</div>' +
        '<p style="text-align:center; font-size:24px; font-weight:bold;">' + p.w + '</p>' +
        '<button class="btn btn-voice" onclick="speak(\\'' + p.w + '\\')">🔊 Écouter avec la voix</button>';
      speak(p.c);
    }
    function next() { if (cur < pages.length - 1) { cur++; render(); } }
    function prev() { if (cur > 0) { cur--; render(); } }
    render();
  </script>
</body>
</html>`;

    const blob = new Blob([standaloneHTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Livre_Magique_CP_Autonome.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none no-print">
      <div className="bg-[#FAF6EE] rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-400 flex flex-col max-h-[92vh] overflow-y-auto text-slate-800">
        
        {/* En-tête */}
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-400 text-amber-950 font-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                Installation Android & Fichier Autonome
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Instructions et téléchargement pour fonctionnement 100% hors-ligne
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1 : Instructions installation Android */}
        <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs mb-4">
          <div className="flex items-center gap-2 text-emerald-700 font-black text-sm mb-2">
            <Smartphone className="w-4 h-4" />
            <span>Comment installer l'application sur un téléphone Android (PWA) :</span>
          </div>
          <ol className="text-xs sm:text-sm text-slate-700 space-y-2 list-decimal list-inside font-medium leading-relaxed">
            <li>Ouvre l'application dans le navigateur <strong>Google Chrome</strong> sur le téléphone Android.</li>
            <li>Appuie sur le bouton <strong>« Installer l'app sur Android »</strong> en haut de l'écran (ou touche les <strong>trois petits points ⋮</strong> en haut à droite de Chrome).</li>
            <li>Choisis <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</li>
            <li>Une icône avec le petit caméléon Kalo apparaît sur l'écran du téléphone.</li>
            <li><strong>C'est prêt !</strong> L'enfant peut lancer le livre même en mode avion, sans Wi-Fi ni forfait données.</li>
          </ol>
        </div>

        {/* Section 2 : Téléchargement du fichier HTML unique autonome */}
        <div className="bg-amber-100/70 p-4 rounded-2xl border-2 border-amber-300 shadow-xs mb-4">
          <div className="flex items-center gap-2 text-amber-950 font-black text-sm mb-1">
            <FileCode className="w-4 h-4 text-amber-700" />
            <span>Format 1 fichier HTML unique autonome :</span>
          </div>
          <p className="text-xs text-amber-900 mb-3 leading-relaxed">
            Tu peux télécharger un fichier HTML unique regroupant tout le code et les données dans un seul fichier sans aucune dépendance externe. Il suffit de le copier par câble USB ou Bluetooth sur n'importe quel vieux téléphone Android ou tablette pour l'ouvrir.
          </p>

          <button
            onClick={handleDownloadSingleHTML}
            className="min-h-[50px] w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer border-2 border-white"
          >
            <Download className="w-5 h-5" />
            <span>Télécharger le fichier .HTML autonome</span>
          </button>

          {downloaded && (
            <div className="mt-2 text-xs font-bold text-emerald-800 flex items-center gap-1.5 justify-center">
              <CheckCircle className="w-4 h-4" />
              <span>Fichier « Livre_Magique_CP_Autonome.html » prêt dans vos téléchargements !</span>
            </div>
          )}
        </div>

        {/* Section 3 : Limites connues en environnement hors-ligne */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Limites techniques connues :</span>
          </div>
          <ul className="space-y-1 list-disc list-inside leading-relaxed">
            <li><strong>Synthèse vocale (SpeechSynthesis) :</strong> La qualité de la voix française dépend du moteur de voix installé sur le téléphone (sur Android, vérifier que <em>Google Speech Services</em> en français est installé dans les paramètres du système).</li>
            <li><strong>Reconnaissance vocale :</strong> Sur certains appareils d'entrée de gamme sans connexion internet, la reconnaissance vocale peut être indisponible. Le bouton <strong>« J'ai lu ! »</strong> permet toujours de valider sans micro.</li>
            <li><strong>Stockage LocalStorage :</strong> Si le mode navigation privée bloque le stockage, la progression est gardée en mémoire pour toute la durée de la séance.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
