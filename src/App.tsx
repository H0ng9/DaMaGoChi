import React, { useState, useEffect, useRef } from 'react';
import { PetStats, PetEmotion, ChatMessage, DiaryEntry, AppSettings, LanguageCode, CasingTheme } from './types/tamagotchi';
import { storage, DEFAULT_STATS, DEFAULT_SETTINGS } from './utils/storage';
import { sounds } from './utils/sound';
import { PetViewport } from './components/PetViewport';
import { StatusBars } from './components/StatusBars';
import { ActionControls } from './components/ActionControls';
import { ChatBox } from './components/ChatBox';
import { DiaryModal } from './components/DiaryModal';
import { QuizModal } from './components/QuizModal';
import { SettingsModal } from './components/SettingsModal';
import { Sparkles, Heart, BookOpen, Volume2, VolumeX, Settings, GraduationCap, Award, HelpCircle, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';

const QUICK_THEMES: { id: CasingTheme; name: string; bg: string }[] = [
  { id: 'mint', name: '민트 에메랄드', bg: 'bg-emerald-400' },
  { id: 'lavender', name: '사이버 라벤더', bg: 'bg-purple-400' },
  { id: 'cyan', name: '네온 아쿠아', bg: 'bg-cyan-400' },
  { id: 'coral', name: '선셋 코랄', bg: 'bg-rose-400' },
  { id: 'yellow', name: '버터 옐로우', bg: 'bg-amber-400' },
  { id: 'pink', name: '스위트 핑크', bg: 'bg-pink-400' },
  { id: 'retro-gray', name: '클래식 그레이', bg: 'bg-slate-400' },
];

export default function App() {
  const [stats, setStats] = useState<PetStats>(() => storage.getStats());
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());
  const [messages, setMessages] = useState<ChatMessage[]>(() => storage.getChats());
  const [diaries, setDiaries] = useState<DiaryEntry[]>(() => storage.getDiaries());

  const [emotion, setEmotion] = useState<PetEmotion>('normal');
  const [activeActionEffect, setActiveActionEffect] = useState<'eat' | 'clean' | 'play' | null>(null);

  // Modals state
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Loading states
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isGeneratingDiary, setIsGeneratingDiary] = useState(false);

  const statsRef = useRef(stats);
  statsRef.current = stats;

  // Initialize sounds mute state
  useEffect(() => {
    sounds.setMuted(settings.isMuted);
  }, [settings.isMuted]);

  // Periodic stat decay loop (default every 10s as in requirements)
  useEffect(() => {
    const intervalMs = (settings.tickRateSec || 10) * 1000;
    const timer = setInterval(() => {
      setStats((prev) => {
        if (prev.isSleeping) {
          // Slow recovery while sleeping
          const nextHappy = Math.min(100, prev.happiness + 0.5);
          const nextFull = Math.max(0, prev.fullness - 0.5);
          const updated = {
            ...prev,
            happiness: Math.round(nextHappy * 10) / 10,
            fullness: Math.round(nextFull * 10) / 10,
          };
          storage.saveStats(updated);
          return updated;
        }

        // Active state decay
        const nextFullness = Math.max(0, prev.fullness - 2);
        const nextHappiness = Math.max(0, prev.happiness - 1);
        const nextCleanliness = Math.max(0, prev.cleanliness - 1.5);

        // Spawn poop if dirty and not already full of poops
        let nextPoop = prev.poopCount;
        if (nextCleanliness < 35 && prev.poopCount < 2 && Math.random() < 0.25) {
          nextPoop = Math.min(3, prev.poopCount + 1);
        }

        const updated: PetStats = {
          ...prev,
          fullness: Math.round(nextFullness),
          happiness: Math.round(nextHappiness),
          cleanliness: Math.round(nextCleanliness),
          poopCount: nextPoop,
        };

        storage.saveStats(updated);
        return updated;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [settings.tickRateSec]);

  // Check for affinity level up
  const checkLevelUp = (newAffinity: number, prevLevel: number) => {
    const threshold = prevLevel * 50;
    if (newAffinity >= threshold && prevLevel < 10) {
      const nextLevel = prevLevel + 1;
      sounds.playFanfare();
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // Ignore
      }
      return nextLevel;
    }
    return prevLevel;
  };

  // 1. Feed action
  const handleFeed = (foodName: string, fullnessGain: number, happinessGain: number) => {
    sounds.playEat();
    setActiveActionEffect('eat');
    setEmotion('eating');

    setTimeout(() => {
      setActiveActionEffect(null);
      setEmotion('happy');
    }, 1800);

    setStats((prev) => {
      const newAffinity = prev.affinity + 4;
      const newLevel = checkLevelUp(newAffinity, prev.affinityLevel);
      const updated: PetStats = {
        ...prev,
        fullness: Math.min(100, prev.fullness + fullnessGain),
        happiness: Math.min(100, prev.happiness + happinessGain),
        affinity: newAffinity,
        affinityLevel: newLevel,
      };
      storage.saveStats(updated);
      return updated;
    });

    storage.addEvent(`유저가 루미에게 맛있는 ${foodName}을(를) 먹여주었습니다.`);
  };

  // 2. Clean action
  const handleClean = () => {
    sounds.playClean();
    setActiveActionEffect('clean');
    setEmotion('happy');

    setTimeout(() => {
      setActiveActionEffect(null);
    }, 1800);

    setStats((prev) => {
      const newAffinity = prev.affinity + 5;
      const newLevel = checkLevelUp(newAffinity, prev.affinityLevel);
      const updated: PetStats = {
        ...prev,
        cleanliness: 100,
        poopCount: 0,
        happiness: Math.min(100, prev.happiness + 15),
        affinity: newAffinity,
        affinityLevel: newLevel,
      };
      storage.saveStats(updated);
      return updated;
    });

    storage.addEvent('유저가 루미의 방을 깨끗이 청소하고 목욕을 시켜주었습니다.');
  };

  // 3. Play action
  const handlePlay = () => {
    sounds.playHappy();
    setActiveActionEffect('play');
    setEmotion('excited');

    setTimeout(() => {
      setActiveActionEffect(null);
      setEmotion('normal');
    }, 1800);

    setStats((prev) => {
      const newAffinity = prev.affinity + 6;
      const newLevel = checkLevelUp(newAffinity, prev.affinityLevel);
      const updated: PetStats = {
        ...prev,
        happiness: Math.min(100, prev.happiness + 25),
        fullness: Math.max(0, prev.fullness - 5),
        affinity: newAffinity,
        affinityLevel: newLevel,
      };
      storage.saveStats(updated);
      return updated;
    });

    storage.addEvent('유저와 루미가 함께 즐겁게 공놀이를 했습니다.');
  };

  // 4. Petting Lumi (click on pet)
  const handlePetLumi = () => {
    setEmotion('loving');
    setTimeout(() => setEmotion('normal'), 1500);

    setStats((prev) => {
      const newAffinity = prev.affinity + 2;
      const newLevel = checkLevelUp(newAffinity, prev.affinityLevel);
      const updated: PetStats = {
        ...prev,
        happiness: Math.min(100, prev.happiness + 5),
        affinity: newAffinity,
        affinityLevel: newLevel,
      };
      storage.saveStats(updated);
      return updated;
    });
  };

  // 5. Toggle Sleep Mode
  const handleToggleSleep = () => {
    if (stats.isSleeping) {
      sounds.playHappy();
      setStats((prev) => {
        const updated = { ...prev, isSleeping: false };
        storage.saveStats(updated);
        return updated;
      });
      storage.addEvent('루미가 잠에서 깨어났습니다.');
    } else {
      sounds.playSleep();
      setStats((prev) => {
        const updated = { ...prev, isSleeping: true };
        storage.saveStats(updated);
        return updated;
      });
      storage.addEvent('루미가 잠자리에 들었습니다.');
    }
  };

  // 6. Send Chat Message
  const handleSendMessage = async (text: string) => {
    if (isChatLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    storage.saveChats(newMessages);
    storage.addEvent(`유저와의 대화: "${text}"`);

    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          stats,
          language: settings.language,
          chatHistory: newMessages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();

      const petMsg: ChatMessage = {
        id: `pet-${Date.now()}`,
        role: 'pet',
        text: data.reply || '루미는 당신을 정말 좋아해요!',
        emotion: data.emotion || 'happy',
        languageTip: data.languageTip,
        actionReaction: data.actionReaction,
        timestamp: Date.now(),
      };

      const finalMessages = [...newMessages, petMsg];
      setMessages(finalMessages);
      storage.saveChats(finalMessages);

      if (data.emotion) {
        setEmotion(data.emotion);
      }

      // Reward affinity on chat
      setStats((prev) => {
        const newAffinity = prev.affinity + 3;
        const newLevel = checkLevelUp(newAffinity, prev.affinityLevel);
        const updated = {
          ...prev,
          happiness: Math.min(100, prev.happiness + 8),
          affinity: newAffinity,
          affinityLevel: newLevel,
        };
        storage.saveStats(updated);
        return updated;
      });

      // Optional TTS speak
      if (settings.ttsEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(petMsg.text);
        utterance.rate = 1.1;
        utterance.pitch = 1.4;
        if (settings.language === 'ja') utterance.lang = 'ja-JP';
        else if (settings.language === 'en') utterance.lang = 'en-US';
        else utterance.lang = 'ko-KR';
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsChatLoading(false);
    }
  };

  // 7. Generate Today's Diary
  const handleGenerateTodayDiary = async () => {
    if (isGeneratingDiary) return;
    setIsGeneratingDiary(true);

    try {
      const events = storage.getEvents();
      const res = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats,
          language: settings.language,
          events,
          petName: '루미',
        }),
      });

      const diaryData = await res.json();
      const newEntry: DiaryEntry = {
        id: `diary-${Date.now()}`,
        date: diaryData.date || new Date().toLocaleDateString(),
        title: diaryData.title || '오늘의 소중한 하루',
        content: diaryData.content || '오늘 하루도 행복하고 즐거웠어!',
        moodStamp: diaryData.moodStamp || 'happy',
        todayWord: diaryData.todayWord,
        statsSnapshot: {
          fullness: stats.fullness,
          happiness: stats.happiness,
          cleanliness: stats.cleanliness,
          affinityLevel: stats.affinityLevel,
        },
      };

      const updatedDiaries = [newEntry, ...diaries];
      setDiaries(updatedDiaries);
      storage.saveDiaries(updatedDiaries);
      sounds.playFanfare();
    } catch (e) {
      console.warn('Failed to generate diary:', e);
    } finally {
      setIsGeneratingDiary(false);
    }
  };

  // 8. Quiz Reward
  const handleQuizReward = (affinityGain: number, happinessGain: number) => {
    setStats((prev) => {
      const newAffinity = prev.affinity + affinityGain;
      const newLevel = checkLevelUp(newAffinity, prev.affinityLevel);
      const updated = {
        ...prev,
        happiness: Math.min(100, prev.happiness + happinessGain),
        affinity: newAffinity,
        affinityLevel: newLevel,
      };
      storage.saveStats(updated);
      return updated;
    });
    setEmotion('excited');
    storage.addEvent(`유저가 언어 퀴즈를 맞히고 보너스를 획득했습니다.`);
  };

  // 9. Reset Game Data
  const handleResetData = () => {
    storage.resetAll();
    setStats(DEFAULT_STATS);
    setMessages([]);
    setDiaries([]);
    sounds.playBeep();
  };

  // Get theme styling classes for Tamagotchi Shell
  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'mint':
        return 'bg-gradient-to-b from-emerald-300 via-teal-300 to-cyan-400 border-teal-500 shadow-teal-500/25';
      case 'lavender':
        return 'bg-gradient-to-b from-indigo-300 via-purple-300 to-violet-400 border-indigo-500 shadow-indigo-500/25';
      case 'cyan':
        return 'bg-gradient-to-b from-sky-300 via-cyan-300 to-blue-400 border-cyan-500 shadow-cyan-500/25';
      case 'coral':
        return 'bg-gradient-to-b from-orange-300 via-rose-300 to-red-400 border-rose-500 shadow-rose-500/25';
      case 'yellow':
        return 'bg-gradient-to-b from-amber-200 via-yellow-300 to-amber-300 border-amber-500 shadow-amber-500/25';
      case 'retro-gray':
        return 'bg-gradient-to-b from-slate-200 via-gray-300 to-slate-400 border-slate-500 shadow-slate-500/25';
      case 'pink':
      default:
        return 'bg-gradient-to-b from-pink-300 via-rose-300 to-pink-400 border-pink-400 shadow-pink-500/25';
    }
  };

  const getThemeHeaderColor = () => {
    switch (settings.theme) {
      case 'mint':
        return 'text-teal-300';
      case 'lavender':
        return 'text-purple-300';
      case 'cyan':
        return 'text-cyan-300';
      case 'coral':
        return 'text-rose-300';
      case 'yellow':
        return 'text-amber-300';
      case 'retro-gray':
        return 'text-slate-300';
      case 'pink':
      default:
        return 'text-pink-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Top Bar Contract */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className="text-xl">🐣</span>
            <span className={`font-pixel text-sm ${getThemeHeaderColor()} font-bold tracking-tight transition-colors`}>
              AI 다마고치 다이어리 · 루미 (Lumi)
            </span>
          </div>

          {/* Zone 2: Single-line concise nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400">
            <button
              onClick={() => {
                sounds.playBeep();
                setIsDiaryOpen(true);
              }}
              className="hover:text-pink-300 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-pink-400" />
              오늘의 일기
            </button>
            <button
              onClick={() => {
                sounds.playBeep();
                setIsQuizOpen(true);
              }}
              className="hover:text-indigo-300 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              외국어 퀴즈
            </button>
            <button
              onClick={() => {
                sounds.playBeep();
                setIsGuideOpen(true);
              }}
              className="hover:text-slate-200 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              가이드
            </button>
          </nav>

          {/* Zone 3: Quick Action / Settings Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const nextMuted = !settings.isMuted;
                sounds.setMuted(nextMuted);
                if (!nextMuted) sounds.playBeep();
                const updated = { ...settings, isMuted: nextMuted };
                setSettings(updated);
                storage.saveSettings(updated);
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title={settings.isMuted ? '소리 켜기' : '음소거'}
            >
              {settings.isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => {
                sounds.playBeep();
                setIsSettingsOpen(true);
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="설정"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Section: Tamagotchi Device Shell (7 cols) */}
        <section className="lg:col-span-7 flex flex-col items-center">
          {/* Quick Color Switcher Bar */}
          <div className="w-full max-w-md mb-3 flex items-center justify-between px-3.5 py-2 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm text-xs">
            <span className="font-pixel text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
              <Palette className="w-3.5 h-3.5 text-teal-400" />
              <span>기기 색상 변경:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {QUICK_THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    sounds.playBeep();
                    const updated = { ...settings, theme: t.id };
                    setSettings(updated);
                    storage.saveSettings(updated);
                  }}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${t.bg} border transition-all cursor-pointer shadow-inner ${
                    settings.theme === t.id
                      ? 'ring-2 ring-white scale-110 shadow-md border-white'
                      : 'border-slate-700/60 hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                  title={`${t.name} 테마로 변경`}
                />
              ))}
            </div>
          </div>

          {/* Egg-Shaped Handheld Tamagotchi Shell */}
          <div
            className={`w-full max-w-md p-5 sm:p-6 rounded-[48px] border-[6px] shadow-2xl relative transition-all duration-300 ${getThemeClasses()}`}
          >
            {/* Top Device Keychain Loop */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-12 h-6 bg-slate-800 rounded-t-full border-2 border-slate-700 shadow-inner flex items-center justify-center">
              <div className="w-4 h-2 bg-slate-950 rounded-full"></div>
            </div>

            {/* Tamagotchi Screen Bezel */}
            <div className="bg-slate-900/90 rounded-[28px] p-3 sm:p-4 border-4 border-slate-950/80 shadow-2xl space-y-3.5">
              {/* Pet Animated Viewport */}
              <PetViewport
                stats={stats}
                emotion={emotion}
                petName="루미"
                onPetLumi={handlePetLumi}
                activeActionEffect={activeActionEffect}
              />

              {/* Status Gauges HUD */}
              <StatusBars stats={stats} />
            </div>

            {/* Physical 3-Button Tamagotchi Aesthetic Controls */}
            <div className="mt-4 flex items-center justify-center gap-8 py-1">
              <button
                onClick={() => handleFeed('사과', 20, 5)}
                className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 active:translate-y-1 text-slate-200 border-2 border-slate-600 shadow-lg flex flex-col items-center justify-center cursor-pointer transition-transform group"
                title="A 버튼: 밥 주기"
              >
                <span className="font-pixel text-[10px] text-pink-300 font-bold group-hover:scale-110 transition-transform">
                  A
                </span>
                <span className="text-[9px] text-slate-400">밥</span>
              </button>

              <button
                onClick={handlePlay}
                className="w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-700 active:translate-y-1 text-slate-200 border-2 border-slate-600 shadow-lg flex flex-col items-center justify-center cursor-pointer transition-transform group -translate-y-1"
                title="B 버튼: 놀아주기"
              >
                <span className="font-pixel text-xs text-amber-300 font-bold group-hover:scale-110 transition-transform">
                  B
                </span>
                <span className="text-[10px] text-slate-400">놀기</span>
              </button>

              <button
                onClick={handleClean}
                className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 active:translate-y-1 text-slate-200 border-2 border-slate-600 shadow-lg flex flex-col items-center justify-center cursor-pointer transition-transform group"
                title="C 버튼: 청소하기"
              >
                <span className="font-pixel text-[10px] text-cyan-300 font-bold group-hover:scale-110 transition-transform">
                  C
                </span>
                <span className="text-[9px] text-slate-400">청소</span>
              </button>
            </div>

            {/* Bottom Tamagotchi Device Brand Tag */}
            <div className="mt-2 text-center">
              <span className="font-pixel text-[11px] text-slate-900/70 font-bold tracking-widest uppercase">
                ✦ LUMI POCKET PET ✦
              </span>
            </div>
          </div>

          {/* Quick Action Buttons Grid below Tamagotchi */}
          <div className="w-full max-w-md mt-4">
            <ActionControls
              onFeed={handleFeed}
              onClean={handleClean}
              onPlay={handlePlay}
              onOpenDiary={() => {
                sounds.playBeep();
                setIsDiaryOpen(true);
              }}
              onOpenQuiz={() => {
                sounds.playBeep();
                setIsQuizOpen(true);
              }}
              onToggleSleep={handleToggleSleep}
              isSleeping={stats.isSleeping}
            />
          </div>
        </section>

        {/* Right Section: Companion Panel (5 cols) */}
        <section className="lg:col-span-5 space-y-4">
          {/* AI Interactive Chat Box */}
          <ChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            language={settings.language}
            onLanguageChange={(lang: LanguageCode) => {
              const updated = { ...settings, language: lang };
              setSettings(updated);
              storage.saveSettings(updated);
            }}
            stats={stats}
            petName="루미"
            ttsEnabled={settings.ttsEnabled}
            onToggleTts={() => {
              const updated = { ...settings, ttsEnabled: !settings.ttsEnabled };
              setSettings(updated);
              storage.saveSettings(updated);
            }}
            theme={settings.theme}
          />

          {/* Today's Diary Teaser Card */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${getThemeHeaderColor()} font-pixel transition-colors`}>
                <BookOpen className="w-4 h-4 text-pink-400" />
                <span>루미의 다이어리 미리보기</span>
              </div>
              <button
                onClick={() => {
                  sounds.playBeep();
                  setIsDiaryOpen(true);
                }}
                className={`text-[11px] ${getThemeHeaderColor()} hover:underline font-medium cursor-pointer transition-colors`}
              >
                전체보기 →
              </button>
            </div>

            {diaries.length > 0 ? (
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/70 text-xs space-y-1">
                <div className="font-semibold text-slate-100 truncate">
                  {diaries[0].title}
                </div>
                <p className="text-slate-400 line-clamp-2 leading-relaxed font-serif">
                  {diaries[0].content}
                </p>
                <div className="text-[10px] text-pink-400/80 font-pixel pt-1">
                  {diaries[0].date} 기록
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 text-center text-xs text-slate-400 py-3">
                <p className="text-[11px] text-slate-400">아직 오늘의 일기가 작성되지 않았어요.</p>
                <button
                  onClick={handleGenerateTodayDiary}
                  disabled={isGeneratingDiary}
                  className="mt-2 text-xs text-pink-400 hover:text-pink-300 underline font-medium cursor-pointer"
                >
                  루미에게 오늘 일기 쓰라고 하기 ✨
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-lg p-5 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-pink-400" />
                <h3 className="font-pixel text-sm text-pink-200 font-bold">
                  AI 다마고치 '루미' 키우기 가이드
                </h3>
              </div>
              <button
                onClick={() => {
                  sounds.playBeep();
                  setIsGuideOpen(false);
                }}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-pink-300">🐾 루미의 상태 수치 (Status)</div>
                <p>• <b>포만감 (Fullness)</b>: 10초마다 조금씩 배고파져요. 30 미만이 되면 배에서 꼬르륵 소리가 나며 불평해요!</p>
                <p>• <b>행복도 (Happiness)</b>: 대화하고 놀아주면 쑥쑥 올라가요. 방치하면 외로워하고 슬퍼해요.</p>
                <p>• <b>청결도 (Cleanliness)</b>: 시간이 지나면 똥이 생기고 간지러워해요. 청소하기 버튼으로 목욕시켜 주세요.</p>
                <p>• <b>친밀도 (Affinity)</b>: 루미와 소통할수록 레벨이 오르고 더 다정하고 애정 어린 말투로 변해요.</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-300">🌐 다국어 학습 & 그림일기</div>
                <p>• 한국어, 영어(EN), 일본어(JA) 언어를 바꾸면 루미가 그 나라 말로 대화하며 실생활 유용한 표현 팁을 선물해요.</p>
                <p>• <b>단어 퀴즈</b>를 맞히면 친밀도와 행복도 보너스를 대량 획득할 수 있어요!</p>
                <p>• <b>오늘 일기 쓰기</b>를 누르면 루미가 오늘 있었던 일과 기분을 귀여운 일기장으로 저장해줘요.</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-amber-300">💡 꿀팁!</div>
                <p>• 화면 속 루미를 직접 마우스로 <b>클릭</b>하면 쓰다듬어 주며 하트가 퐁퐁 솟아나요!</p>
                <p>• 외출하거나 잘 때는 <b>재우기(Sleep)</b>를 켜두면 상태 감소가 멈추고 편안히 휴식해요.</p>
              </div>
            </div>
            <button
              onClick={() => setIsGuideOpen(false)}
              className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              확인했어요!
            </button>
          </div>
        </div>
      )}

      {/* Diary Modal */}
      <DiaryModal
        isOpen={isDiaryOpen}
        onClose={() => setIsDiaryOpen(false)}
        diaries={diaries}
        onGenerateTodayDiary={handleGenerateTodayDiary}
        isGenerating={isGeneratingDiary}
        petName="루미"
      />

      {/* Language Quiz Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        language={settings.language}
        affinityLevel={stats.affinityLevel}
        onReward={handleQuizReward}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          const updated = { ...settings, ...newSettings };
          setSettings(updated);
          storage.saveSettings(updated);
        }}
        onResetData={handleResetData}
        petName="루미"
      />
    </div>
  );
}
