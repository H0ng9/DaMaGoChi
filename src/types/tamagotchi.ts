export type LanguageCode = 'ko' | 'en' | 'ja';

export type PetEmotion = 'normal' | 'happy' | 'excited' | 'hungry' | 'dirty' | 'sad' | 'sleepy' | 'loving' | 'eating' | 'cleaning' | 'playing';

export interface PetStats {
  fullness: number;      // 0 ~ 100
  happiness: number;     // 0 ~ 100
  cleanliness: number;   // 0 ~ 100
  affinity: number;      // Cumulative interaction score
  affinityLevel: number; // 1 ~ 10
  isSleeping: boolean;
  poopCount: number;     // 0 ~ 3
  daysAlive: number;
  birthDate: string;
}

export interface LanguageTip {
  expression: string;
  meaning: string;
  pronunciation?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'pet';
  text: string;
  emotion?: PetEmotion;
  languageTip?: LanguageTip;
  actionReaction?: string;
  timestamp: number;
}

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  moodStamp: 'excited' | 'happy' | 'full' | 'sparkling' | 'sleepy' | 'touched';
  todayWord?: {
    word: string;
    meaning: string;
  };
  statsSnapshot: {
    fullness: number;
    happiness: number;
    cleanliness: number;
    affinityLevel: number;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  rewardAffinity: number;
}

export type CasingTheme = 'mint' | 'lavender' | 'cyan' | 'coral' | 'yellow' | 'pink' | 'retro-gray';

export interface AppSettings {
  language: LanguageCode;
  theme: CasingTheme;
  tickRateSec: number;   // default 10 seconds
  isMuted: boolean;
  ttsEnabled: boolean;
  soundVolume: number;
}
