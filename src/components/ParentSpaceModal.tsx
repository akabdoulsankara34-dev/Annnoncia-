import React, { useState } from 'react';
import { ChildProfile, AppSettings, Chapter, ContentPack } from '../types/book';
import { PACK_CONTES_LOCAL } from '../data/bookContent';
import { sound, speakText, stopSpeaking } from '../utils/audio';
import { 
  X, 
  ShieldCheck, 
  Printer, 
  Settings, 
  FolderPlus, 
  RotateCcw, 
  Unlock, 
  Lock,
  Volume2, 
  VolumeX, 
  Clock, 
  Languages,
  BookOpen,
  CheckCircle2,
  Download,
  Upload
} from 'lucide-react';

interface ParentSpaceModalProps {
  profiles: ChildProfile[];
  activeProfile: ChildProfile;
  settings: AppSettings;
  chapters: Chapter[];
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetProgress: (profileId: string) => void;
  onUnlockChapter?: (chapterId: string) => void;
  onToggleChapterUnlock?: (chapterId: string) => void;
  onUnlockAllChapters: () => void;
  onImportPack: (pack: ContentPack) => void;
  onOpenLireEtCompter?: () => void;
  onClose: () => void;
}

export const ParentSpaceModal: React.FC<ParentSpaceModalProps> = ({
  profiles,
  activeProfile,
  settings,
  chapters,
  onUpdateSettings,
  onResetProgress,
  onUnlockChapter,
  onToggleChapterUnlock,
  onUnlockAllChapters,
  onImportPack,
  onOpenLireEtCompter,
  onClose,
}) => {
  // Protection parentale par calcul aléatoire
  const [numA] = useState(() => Math.floor(Math.random() * 5) + 6); // 6 à 10
  const [numB] = useState(() => Math.floor(Math.random() * 5) + 4); // 4 à 8
  const expectedAnswer = numA + numB;
  const [parentInput, setParentInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Tab sélectionnée
  const [activeTab, setActiveTab] = useState<'progress' | 'settings' | 'worksheets' | 'packs'>('progress');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(parentInput, 10) === expectedAnswer) {
      setIsUnlocked(true);
      setAuthError(false);
      sound.playSuccess();
    } else {
      setAuthError(true);
      sound.playGentleEncouragement();
      setParentInput('');
    }
  };

  const handlePrintWorksheets = () => {
    window.print();
  };

  const handleExportPackExample = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PACK_CONTES_LOCAL, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "pack_contes_baobab_exemple.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const [importFeedback, setImportFeedback] = useState<{ msg: string; success: boolean } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.packId && parsed.chapters && Array.isArray(parsed.chapters)) {
          onImportPack(parsed);
          setImportFeedback({
            msg: `Pack « ${parsed.title} » importé avec succès (${parsed.chapters.length} chapitres ajoutés) !`,
            success: true
          });
        } else {
          setImportFeedback({
            msg: 'Le fichier JSON ne respecte pas le format de pack attendu.',
            success: false
          });
        }
      } catch (err) {
        setImportFeedback({
          msg: 'Erreur lors de la lecture du fichier JSON.',
          success: false
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none no-print">
      <div className="bg-[#FAF6EE] rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border-4 border-slate-700 flex flex-col max-h-[92vh] overflow-hidden text-slate-800">
        
        {/* En-tête */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-slate-800 text-white">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Espace Enseignants & Parents
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Suivi pédagogique, impression de fiches et configuration
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

        {/* Écran de verrouillage mathématique anti-enfant de 6 ans */}
        {!isUnlocked ? (
          <div className="flex flex-col items-center justify-center py-8 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <ShieldCheck className="w-8 h-8 text-amber-700" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-1">
              Contrôle Parental
            </h4>
            <p className="text-xs font-semibold text-slate-600 mb-4">
              Pour accéder aux réglages, calcule la somme suivante :
            </p>

            <form onSubmit={handleVerify} className="w-full flex flex-col gap-3">
              <div className="bg-white p-3 rounded-2xl border-2 border-amber-300 text-2xl font-black text-slate-800 shadow-sm">
                {numA} + {numB} = ?
              </div>

              <input
                type="number"
                inputMode="numeric"
                autoFocus
                value={parentInput}
                onChange={(e) => setParentInput(e.target.value)}
                placeholder="Ta réponse"
                className="w-full min-h-[48px] px-4 rounded-2xl border-2 border-slate-300 bg-white font-black text-center text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              {authError && (
                <span className="text-xs font-bold text-rose-600">
                  Calcul incorrect, essaie à nouveau.
                </span>
              )}

              <button
                type="submit"
                className="min-h-[50px] w-full rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-md transition active:scale-95"
              >
                Déverrouiller
              </button>
            </form>
          </div>
        ) : (
          /* Contenu déverrouillé */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Onglets */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition shrink-0 ${
                  activeTab === 'progress' ? 'bg-amber-400 text-amber-950 font-black' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Progrès élève
              </button>
              <button
                onClick={() => setActiveTab('worksheets')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition shrink-0 ${
                  activeTab === 'worksheets' ? 'bg-amber-400 text-amber-950 font-black' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Fiches à imprimer
              </button>
              <button
                onClick={() => setActiveTab('packs')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition shrink-0 ${
                  activeTab === 'packs' ? 'bg-amber-400 text-amber-950 font-black' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Packs de contenu
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition shrink-0 ${
                  activeTab === 'settings' ? 'bg-amber-400 text-amber-950 font-black' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Réglages
              </button>
            </div>

            {/* Contenu de l'onglet sélectionné */}
            <div className="flex-1 overflow-y-auto pr-1">
              {/* ONGLET 1 : PROGRÈS */}
              {activeTab === 'progress' && (
                <div className="flex flex-col gap-4">
                  <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-slate-800 text-base">
                        Profil actif : {activeProfile.name}
                      </span>
                      <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                        {activeProfile.starsCount} étoiles récoltées
                      </span>
                    </div>

                    {/* Programme Spécial 6-7 ans */}
                    {onOpenLireEtCompter && (
                      <div className="mb-3 p-3 bg-gradient-to-r from-rose-50 to-amber-50 border-2 border-rose-300 rounded-2xl flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">🎒</span>
                          <div>
                            <span className="font-['Fredoka',sans-serif] text-xs font-black text-rose-950 block">
                              Programme « Lire et compter à 6-7 ans »
                            </span>
                            <span className="text-[11px] text-slate-600 font-medium">
                              4 semaines • 20 séances • Fiche de suivi & jeux
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            onClose();
                            onOpenLireEtCompter();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#C8372D] hover:bg-rose-700 text-white font-black text-xs shadow-xs transition active:scale-95 cursor-pointer shrink-0"
                        >
                          Ouvrir le module
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 mb-2 pt-2 border-t border-slate-100">
                      <span className="text-xs font-black text-slate-700">Gestion manuelle des chapitres :</span>
                      <button
                        onClick={onUnlockAllChapters}
                        className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs flex items-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Tout débloquer</span>
                      </button>
                    </div>

                    <div className="space-y-2 mt-2">
                      {chapters.map((chap) => {
                        const totalPages = chap.pages.length;
                        const doneCount = chap.pages.filter(p => activeProfile.completedPages[p.id]).length;
                        const pct = Math.round((doneCount / totalPages) * 100);
                        const isChapUnlocked = settings.allChaptersUnlocked || activeProfile.unlockedChapters.includes(chap.id);

                        return (
                          <div key={chap.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                              <span className="truncate pr-2">Chapitre {chap.number} : {chap.title.fr}</span>
                              <div className="flex items-center gap-2 shrink-0">
                                <span>{doneCount}/{totalPages} ({pct}%)</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onToggleChapterUnlock) {
                                      onToggleChapterUnlock(chap.id);
                                    } else if (onUnlockChapter) {
                                      onUnlockChapter(chap.id);
                                    }
                                  }}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition flex items-center gap-1 cursor-pointer ${
                                    isChapUnlocked
                                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                                      : 'bg-amber-300 text-amber-950 hover:bg-amber-400 border border-amber-400'
                                  }`}
                                  title={isChapUnlocked ? 'Cliquer pour verrouiller' : 'Cliquer pour débloquer manuellement'}
                                >
                                  {isChapUnlocked ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>Débloqué</span>
                                    </>
                                  ) : (
                                    <>
                                      <Unlock className="w-3 h-3" />
                                      <span>Débloquer</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notions à revoir */}
                  <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
                    <h5 className="font-black text-slate-800 text-sm mb-2">
                      Notions signalées pour la révision espacée :
                    </h5>
                    {activeProfile.reviewQueue.length === 0 ? (
                      <p className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl">
                        Aucune difficulté particulière ! Toutes les notions testées ont été bien assimilées.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {activeProfile.reviewQueue.map((item) => (
                          <span
                            key={item.id}
                            className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-xl border border-amber-300"
                          >
                            {item.type === 'letter' ? 'Lettre' : 'Nombre'} {item.value} ({item.mistakesCount} essais)
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ONGLET 2 : FICHES IMPRIMABLES */}
              {activeTab === 'worksheets' && (
                <div className="flex flex-col gap-3">
                  <div className="bg-amber-100/70 p-3.5 rounded-2xl border border-amber-300 text-xs font-bold text-amber-950">
                    Ces fiches au format A4 sont prêtes à imprimer pour faire écrire l'enfant sur papier ou pour des activités en classe de CP.
                  </div>

                  <button
                    onClick={handlePrintWorksheets}
                    className="min-h-[50px] w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md flex items-center justify-center gap-2 transition active:scale-95"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Lancer l'impression des fiches d'exercices (PDF / Imprimante)</span>
                  </button>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800">Contenu des fiches imprimées :</p>
                    <p>&bull; Fiche 1 : Tracé des 5 voyelles (A, E, I, O, U) en lignes Seyès CP.</p>
                    <p>&bull; Fiche 2 : Découpage et coloriage des mots-images (Ananas, Éléphant, Igname, Baobab, Mangue).</p>
                    <p>&bull; Fiche 3 : Additions simples et comptage d'objets ou de pièces de monnaie.</p>
                  </div>
                </div>
              )}

              {/* ONGLET 3 : PACKS DE CONTENU */}
              {activeTab === 'packs' && (
                <div className="flex flex-col gap-3">
                  <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
                    <h5 className="font-black text-slate-900 text-sm mb-1">
                      Extension de contenu sans toucher au code
                    </h5>
                    <p className="text-xs text-slate-600 mb-3">
                      Les enseignants et parents peuvent concevoir ou partager des packs de contes ou d'exercices au format JSON standard.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-2.5">
                      <button
                        onClick={handleExportPackExample}
                        className="w-full sm:w-auto flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Download className="w-4 h-4 text-slate-600" />
                        <span>Télécharger le modèle « Pack Contes » (JSON)</span>
                      </button>

                      <label className="w-full sm:w-auto flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs">
                        <Upload className="w-4 h-4" />
                        <span>Importer un fichier JSON</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {importFeedback && (
                      <div className={`mt-3 p-3 rounded-xl text-xs font-bold ${
                        importFeedback.success 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : 'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}>
                        {importFeedback.msg}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ONGLET 4 : RÉGLAGES */}
              {activeTab === 'settings' && (
                <div className="flex flex-col gap-3">
                  {/* Synthèse vocale (Web Speech API) */}
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Lecture à voix haute (Web Speech API)</span>
                      <span className="text-xs text-slate-500">Lecture vocale des pages, titres, consignes et histoires</span>
                    </div>
                    <button
                      onClick={() => {
                        const nextVoice = !settings.voiceEnabled;
                        onUpdateSettings({ ...settings, voiceEnabled: nextVoice });
                        if (nextVoice) {
                          speakText("Synthèse vocale activée !", { force: true });
                        } else {
                          stopSpeaking();
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer shadow-xs ${
                        settings.voiceEnabled ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
                      }`}
                    >
                      {settings.voiceEnabled ? 'Activée' : 'Désactivée'}
                    </button>
                  </div>

                  {/* Son */}
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Effets sonores & tourne-page</span>
                      <span className="text-xs text-slate-500">Bruits doux et fanfares</span>
                    </div>
                    <button
                      onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                        settings.soundEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {settings.soundEnabled ? 'Activé' : 'Désactivé'}
                    </button>
                  </div>

                  {/* Langue bilingue */}
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Option langue locale d'Afrique de l'Ouest</span>
                      <span className="text-xs text-slate-500">Affiche le mot en langue locale en complément</span>
                    </div>
                    <select
                      value={settings.bilingualLanguage}
                      onChange={(e) => onUpdateSettings({ ...settings, bilingualLanguage: e.target.value as any })}
                      className="text-xs font-bold p-2 rounded-xl bg-slate-100 border border-slate-300"
                    >
                      <option value="none">Aucune (Français seul)</option>
                      <option value="moore">Mooré (Burkina Faso)</option>
                      <option value="dioula">Dioula (Côte d'Ivoire / Mali / BF)</option>
                    </select>
                  </div>

                  {/* Police d'écriture */}
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Police pour le tracé d'écriture</span>
                      <span className="text-xs text-slate-500">Scripte bâton ou Cursive attachée</span>
                    </div>
                    <select
                      value={settings.fontType}
                      onChange={(e) => onUpdateSettings({ ...settings, fontType: e.target.value as any })}
                      className="text-xs font-bold p-2 rounded-xl bg-slate-100 border border-slate-300"
                    >
                      <option value="script">Scripte d'imprimerie</option>
                      <option value="cursive">Cursive d'écolier</option>
                    </select>
                  </div>

                  {/* Débloquer tous les chapitres */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Accès libre à tous les chapitres</span>
                      <span className="text-xs text-slate-500">Permet d'accéder à tous les chapitres sans blocage séquentiel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateSettings({ ...settings, allChaptersUnlocked: !settings.allChaptersUnlocked })}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                          settings.allChaptersUnlocked ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {settings.allChaptersUnlocked ? '✓ Mode libre (Ouvert)' : 'Mode guidé'}
                      </button>
                      <button
                        onClick={onUnlockAllChapters}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 text-amber-950 font-black text-xs hover:bg-amber-500 transition shadow-xs cursor-pointer"
                        title="Débloquer tous les chapitres manuellement pour l'élève"
                      >
                        Tout débloquer
                      </button>
                    </div>
                  </div>

                  {/* Réinitialiser la progression */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 rounded-xl border border-rose-200">
                    <div>
                      <span className="text-sm font-bold text-rose-700 block">Réinitialiser l'élève {activeProfile.name}</span>
                      <span className="text-xs text-slate-500">Remet les étoiles et les pages à zéro</span>
                    </div>
                    {showResetConfirm ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onResetProgress(activeProfile.id);
                            setShowResetConfirm(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition"
                        >
                          Oui, effacer
                        </button>
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 transition"
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
