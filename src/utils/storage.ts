import { PetStats, DiaryEntry, ChatMessage, AppSettings } from '../types/tamagotchi';

const STORAGE_KEYS = {
  STATS: 'ai_tamagotchi_stats_v1',
  DIARIES: 'ai_tamagotchi_diaries_v1',
  CHATS: 'ai_tamagotchi_chats_v1',
  SETTINGS: 'ai_tamagotchi_settings_v1',
  EVENTS: 'ai_tamagotchi_events_v1',
};

export const DEFAULT_STATS: PetStats = {
  fullness: 80,
  happiness: 80,
  cleanliness: 90,
  affinity: 15,
  affinityLevel: 1,
  isSleeping: false,
  poopCount: 0,
  daysAlive: 1,
  birthDate: new Date().toISOString(),
};

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'ko',
  theme: 'mint',
  tickRateSec: 10,
  isMuted: false,
  ttsEnabled: false,
  soundVolume: 0.8,
};

export const storage = {
  getStats(): PetStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (data) {
        return { ...DEFAULT_STATS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed to load stats from localStorage:', e);
    }
    return DEFAULT_STATS;
  },

  saveStats(stats: PetStats) {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to save stats to localStorage:', e);
    }
  },

  getDiaries(): DiaryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DIARIES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load diaries from localStorage:', e);
    }
    return [];
  },

  saveDiaries(diaries: DiaryEntry[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.DIARIES, JSON.stringify(diaries));
    } catch (e) {
      console.warn('Failed to save diaries to localStorage:', e);
    }
  },

  getChats(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load chats from localStorage:', e);
    }
    return [];
  },

  saveChats(chats: ChatMessage[]) {
    try {
      // Keep up to 50 latest messages
      const sliced = chats.slice(-50);
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(sliced));
    } catch (e) {
      console.warn('Failed to save chats to localStorage:', e);
    }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  },

  getEvents(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addEvent(event: string) {
    try {
      const events = storage.getEvents();
      events.push(`[${new Date().toLocaleTimeString()}] ${event}`);
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events.slice(-20)));
    } catch {
      // Ignore
    }
  },

  resetAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.STATS);
      localStorage.removeItem(STORAGE_KEYS.DIARIES);
      localStorage.removeItem(STORAGE_KEYS.CHATS);
      localStorage.removeItem(STORAGE_KEYS.EVENTS);
    } catch (e) {
      console.warn('Reset error:', e);
    }
  },
};
