import React, { useState } from 'react';
import { ChildProfile } from '../types/book';
import { SvgIcons } from './SvgIcons';
import { sound } from '../utils/audio';
import { X, UserPlus, Check, Star, Trash2 } from 'lucide-react';

interface ProfileSelectorModalProps {
  profiles: ChildProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (name: string, avatar: ChildProfile['avatar']) => void;
  onDeleteProfile: (id: string) => void;
  onClose: () => void;
}

export const ProfileSelectorModal: React.FC<ProfileSelectorModalProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onClose,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<ChildProfile['avatar']>('gazelle');
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null);

  const avatarChoices: { id: ChildProfile['avatar']; label: string }[] = [
    { id: 'gazelle', label: 'Gazelle' },
    { id: 'lionceau', label: 'Lionceau' },
    { id: 'kalo', label: 'Caméléon' },
    { id: 'lievre', label: 'Lièvre' },
    { id: 'fennec', label: 'Fennec' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onCreateProfile(newName.trim(), selectedAvatar);
    sound.playSuccess();
    setNewName('');
    setIsCreating(false);
  };

  const renderAvatar = (avatar: string, size = 64) => {
    if (avatar === 'lionceau') return <SvgIcons.LionAvatar size={size} />;
    if (avatar === 'gazelle') return <SvgIcons.GazelleAvatar size={size} />;
    if (avatar === 'fennec') return <SvgIcons.FennecAvatar size={size} />;
    if (avatar === 'lievre') return <SvgIcons.HareAvatar size={size} />;
    return <SvgIcons.KaloMascot mood="happy" size={size} />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#FAF6EE] rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-400 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900 leading-tight">
              Qui va lire aujourd'hui ?
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Chaque enfant a son propre livre et ses étoiles !
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Liste des profils existants */}
        {!isCreating ? (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {profiles.map((p) => {
                const isActive = p.id === activeProfileId;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      sound.playPop(500);
                      onSelectProfile(p.id);
                      onClose();
                    }}
                    className={`relative p-4 rounded-3xl flex flex-col items-center justify-center text-center transition cursor-pointer border-3 ${
                      isActive
                        ? 'bg-amber-100 border-amber-500 shadow-md scale-102 ring-4 ring-amber-300/50'
                        : 'bg-white hover:bg-amber-50/50 border-amber-200 shadow-xs'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    <div className="w-18 h-18 rounded-full overflow-hidden mb-2 bg-slate-50 border-2 border-amber-300 flex items-center justify-center shadow-inner">
                      {renderAvatar(p.avatar, 64)}
                    </div>

                    <h4 className="text-lg font-black text-slate-900 line-clamp-1">{p.name}</h4>

                    <div className="flex items-center gap-1 mt-1 bg-amber-200/80 px-2.5 py-0.5 rounded-full text-xs font-black text-amber-900">
                      <Star className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                      <span>{p.starsCount} étoiles</span>
                    </div>

                    {profiles.length > 1 && (
                      <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                        {deletingProfileId === p.id ? (
                          <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-lg">
                            <span className="text-[10px] font-bold text-rose-700">Supprimer ?</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteProfile(p.id);
                                setDeletingProfileId(null);
                              }}
                              className="px-1.5 py-0.5 rounded bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold"
                            >
                              Oui
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingProfileId(null);
                              }}
                              className="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold"
                            >
                              Non
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingProfileId(p.id);
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1 transition"
                            title="Supprimer ce profil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bouton ajouter un profil */}
            <button
              onClick={() => setIsCreating(true)}
              className="w-full mt-3 min-h-[56px] py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-base shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <UserPlus className="w-5 h-5" />
              <span>Ajouter un frère ou une sœur</span>
            </button>
          </div>
        ) : (
          /* Formulaire de création de profil */
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
                Prénom de l'enfant
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex : Fatou, Moussa, Awa..."
                className="w-full min-h-[52px] px-4 rounded-2xl border-2 border-amber-300 bg-white font-bold text-lg text-slate-900 focus:outline-none focus:ring-3 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                Choisis un animal compagnon
              </label>
              <div className="grid grid-cols-5 gap-2">
                {avatarChoices.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`p-2 rounded-2xl flex flex-col items-center justify-center transition border-2 cursor-pointer ${
                      selectedAvatar === av.id
                        ? 'bg-amber-300 border-amber-600 shadow-md scale-105'
                        : 'bg-white border-slate-200 hover:bg-amber-50'
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      {renderAvatar(av.id, 46)}
                    </div>
                    <span className="text-[10px] font-black text-slate-800 mt-1 line-clamp-1">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[52px] py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-md transition active:scale-95"
              >
                Créer le profil
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
