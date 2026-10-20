import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-500 px-4 py-2 text-xs sm:text-sm font-black text-amber-950 shadow-md transition active:scale-95 border-2 border-white cursor-pointer"
      >
        <Smartphone className="w-4 h-4" />
        <span>Installer l'app sur Android</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-2xl border border-white/50 px-3 py-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-xs transition"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Installer sur téléphone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 select-none">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border-4 border-amber-400">
              <h3 className="text-lg font-black text-slate-900">Installer sur iPhone / iPad</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                1. Touche le bouton <strong>Partager</strong> en bas de Safari.<br />
                2. Défile vers le bas et choisis <strong>Sur l'écran d'accueil</strong>.<br />
                3. L'application fonctionnera sans connexion internet !
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-2xl bg-amber-400 py-2.5 text-xs font-black text-amber-950 hover:bg-amber-500"
              >
                J'ai compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
