import { ChildProfile, AppSettings } from '../types/book';

const STORAGE_KEY_PROFILES = 'cp_magic_book_profiles_v1';
const STORAGE_KEY_ACTIVE_ID = 'cp_magic_book_active_profile_v1';
const STORAGE_KEY_SETTINGS = 'cp_magic_book_settings_v1';

// En mémoire si localStorage est désactivé ou plein
const memoryStore: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {
    console.warn('LocalStorage non accessible, bascule en mémoire.', e);
  }
  return memoryStore[key] || null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn('LocalStorage plein ou indisponible, sauvegarde en mémoire.', e);
  }
  memoryStore[key] = value;
}

export const DEFAULT_PROFILES: ChildProfile[] = [
  {
    id: 'p_awa',
    name: 'Awa',
    avatar: 'gazelle',
    starsCount: 3,
    unlockedChapters: ['chap_1', 'chap_2', 'chap_4', 'chap_5', 'chap_6'],
    completedPages: { 'p_1_1': true, 'p_1_2': true },
    stickersEarned: ['stk_kalo_star', 'stk_mango_gold'],
    placedStickers: [
      { id: 'placed_1', stickerId: 'stk_kalo_star', x: 25, y: 30 },
      { id: 'placed_2', stickerId: 'stk_mango_gold', x: 65, y: 45 }
    ],
    reviewQueue: [],
    lastPageVisited: 1,
  },
  {
    id: 'p_issa',
    name: 'Issa',
    avatar: 'lionceau',
    starsCount: 1,
    unlockedChapters: ['chap_1', 'chap_5', 'chap_6'],
    completedPages: {},
    stickersEarned: ['stk_kalo_star'],
    placedStickers: [],
    reviewQueue: [],
    lastPageVisited: 1,
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  voiceEnabled: true,
  bilingualLanguage: 'none',
  sessionTimeLimitEnabled: true,
  allChaptersUnlocked: false,
  fontType: 'script',
};

export function loadProfiles(): ChildProfile[] {
  const data = safeGetItem(STORAGE_KEY_PROFILES);
  if (!data) {
    saveProfiles(DEFAULT_PROFILES);
    return DEFAULT_PROFILES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_PROFILES;
  }
}

export function saveProfiles(profiles: ChildProfile[]): void {
  safeSetItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
}

export function getActiveProfileId(): string {
  const id = safeGetItem(STORAGE_KEY_ACTIVE_ID);
  if (id) return id;
  const profiles = loadProfiles();
  const firstId = profiles[0]?.id || 'p_awa';
  setActiveProfileId(firstId);
  return firstId;
}

export function setActiveProfileId(id: string): void {
  safeSetItem(STORAGE_KEY_ACTIVE_ID, id);
}

export function getActiveProfile(): ChildProfile {
  const profiles = loadProfiles();
  const activeId = getActiveProfileId();
  const found = profiles.find(p => p.id === activeId);
  if (found) return found;
  return profiles[0] || DEFAULT_PROFILES[0];
}

export function updateActiveProfile(updater: (current: ChildProfile) => ChildProfile): ChildProfile {
  const profiles = loadProfiles();
  const activeId = getActiveProfileId();
  let updatedActive: ChildProfile | null = null;

  const nextProfiles = profiles.map(p => {
    if (p.id === activeId) {
      updatedActive = updater(p);
      return updatedActive;
    }
    return p;
  });

  if (!updatedActive) {
    const fresh = updater(DEFAULT_PROFILES[0]);
    nextProfiles.push(fresh);
    updatedActive = fresh;
  }

  saveProfiles(nextProfiles);
  return updatedActive;
}

export function loadSettings(): AppSettings {
  const data = safeGetItem(STORAGE_KEY_SETTINGS);
  if (!data) {
    saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  safeSetItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

/**
 * Enregistre une difficulté pour la répétition espacée
 */
export function recordMistake(type: 'letter' | 'syllable' | 'number' | 'addition', value: string) {
  updateActiveProfile(profile => {
    const queue = [...profile.reviewQueue];
    const existingIndex = queue.findIndex(item => item.type === type && item.value === value);

    if (existingIndex >= 0) {
      queue[existingIndex].mistakesCount += 1;
      queue[existingIndex].lastPracticed = new Date().toISOString();
    } else {
      queue.push({
        id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type,
        value,
        mistakesCount: 1,
        lastPracticed: new Date().toISOString()
      });
    }

    return { ...profile, reviewQueue: queue };
  });
}

/**
 * Enlève une notion de la révision si maîtrisée
 */
export function resolveMistake(type: string, value: string) {
  updateActiveProfile(profile => {
    return {
      ...profile,
      reviewQueue: profile.reviewQueue.filter(item => !(item.type === type && item.value === value))
    };
  });
}
