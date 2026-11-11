import React, { useState } from 'react';
import { Apple, Sparkles, Gamepad2, BookOpen, Moon, Sun, GraduationCap } from 'lucide-react';
import { sounds } from '../utils/sound';

interface ActionControlsProps {
  onFeed: (foodType: string, fullnessGain: number, happinessGain: number) => void;
  onClean: () => void;
  onPlay: () => void;
  onOpenDiary: () => void;
  onOpenQuiz: () => void;
  onToggleSleep: () => void;
  isSleeping: boolean;
  disabled?: boolean;
}

const FOOD_OPTIONS = [
  { name: '사과', icon: '🍎', fullness: 20, happiness: 5, desc: '달콤한 사과' },
  { name: '쿠키', icon: '🍪', fullness: 15, happiness: 10, desc: '바삭바삭 초코칩' },
  { name: '딸기 케이크', icon: '🍰', fullness: 30, happiness: 20, desc: '부드러운 케이크' },
  { name: '따뜻한 우유', icon: '🥛', fullness: 15, happiness: 10, desc: '마음이 포근해지는 우유' },
];

export const ActionControls: React.FC<ActionControlsProps> = ({
  onFeed,
  onClean,
  onPlay,
  onOpenDiary,
  onOpenQuiz,
  onToggleSleep,
  isSleeping,
  disabled = false,
}) => {
  const [showFoodMenu, setShowFoodMenu] = useState(false);

  const handleFoodSelect = (food: typeof FOOD_OPTIONS[0]) => {
    setShowFoodMenu(false);
    onFeed(food.name, food.fullness, food.happiness);
  };

  return (
    <div className="relative">
      {/* Food Selection Popover */}
      {showFoodMenu && !isSleeping && (
        <div className="absolute -top-32 left-0 right-0 z-40 bg-slate-800 border-2 border-emerald-500/60 rounded-xl p-2.5 shadow-xl grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95">
          <div className="col-span-2 text-center text-[11px] font-pixel text-emerald-300 font-bold">
            🍽️ 루미에게 줄 간식을 골라주세요!
          </div>
          {FOOD_OPTIONS.map((f) => (
            <button
              key={f.name}
              onClick={() => handleFoodSelect(f)}
              className="flex items-center gap-2 p-1.5 bg-slate-900/90 hover:bg-slate-700/80 rounded-lg border border-slate-700 text-left transition-colors cursor-pointer"
            >
              <span className="text-xl">{f.icon}</span>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-200">{f.name}</div>
                <div className="text-[10px] text-emerald-400 font-mono">+{f.fullness}%</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main Action Buttons Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {/* 1. Feed Button */}
        <button
          disabled={disabled || isSleeping}
          onClick={() => {
            sounds.playBeep();
            setShowFoodMenu(!showFoodMenu);
          }}
          className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            isSleeping
              ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
              : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 border-emerald-700/70 hover:border-emerald-500 active:scale-95 shadow-sm'
          }`}
          title="루미에게 맛있는 음식 주기"
        >
          <Apple className="w-5 h-5 mb-1 text-emerald-400" />
          <span className="whitespace-nowrap">먹이주기</span>
        </button>

        {/* 2. Clean Button */}
        <button
          disabled={disabled || isSleeping}
          onClick={() => {
            setShowFoodMenu(false);
            onClean();
          }}
          className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            isSleeping
              ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
              : 'bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-200 border-cyan-700/70 hover:border-cyan-500 active:scale-95 shadow-sm'
          }`}
          title="더러워진 방과 루미 청소하기"
        >
          <Sparkles className="w-5 h-5 mb-1 text-cyan-400" />
          <span className="whitespace-nowrap">청소하기</span>
        </button>

        {/* 3. Play Button */}
        <button
          disabled={disabled || isSleeping}
          onClick={() => {
            setShowFoodMenu(false);
            onPlay();
          }}
          className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            isSleeping
              ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
              : 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 border-amber-700/70 hover:border-amber-500 active:scale-95 shadow-sm'
          }`}
          title="루미와 공놀이하며 행복도 올리기"
        >
          <Gamepad2 className="w-5 h-5 mb-1 text-amber-400" />
          <span className="whitespace-nowrap">놀아주기</span>
        </button>

        {/* 4. Language Quiz Button */}
        <button
          disabled={disabled || isSleeping}
          onClick={() => {
            setShowFoodMenu(false);
            onOpenQuiz();
          }}
          className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            isSleeping
              ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
              : 'bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-200 border-indigo-700/70 hover:border-indigo-500 active:scale-95 shadow-sm'
          }`}
          title="외국어 단어 퀴즈 풀고 친밀도 보너스 받기"
        >
          <GraduationCap className="w-5 h-5 mb-1 text-indigo-400" />
          <span className="whitespace-nowrap">단어 퀴즈</span>
        </button>

        {/* 5. Diary Button */}
        <button
          disabled={disabled}
          onClick={() => {
            setShowFoodMenu(false);
            onOpenDiary();
          }}
          className="flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 border-rose-700/70 hover:border-rose-500 active:scale-95 shadow-sm"
          title="루미가 쓴 오늘 하루 일기장 열기"
        >
          <BookOpen className="w-5 h-5 mb-1 text-rose-400" />
          <span className="whitespace-nowrap">오늘 일기</span>
        </button>

        {/* 6. Sleep / Wake Button */}
        <button
          disabled={disabled}
          onClick={() => {
            setShowFoodMenu(false);
            onToggleSleep();
          }}
          className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            isSleeping
              ? 'bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 border-amber-600/70 shadow-sm'
              : 'bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 border-purple-700/70 hover:border-purple-500 active:scale-95 shadow-sm'
          }`}
          title={isSleeping ? '루미 깨우기' : '루미 재우기 (수치 감소 중단)'}
        >
          {isSleeping ? (
            <>
              <Sun className="w-5 h-5 mb-1 text-amber-300" />
              <span className="whitespace-nowrap">깨우기</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 mb-1 text-purple-300" />
              <span className="whitespace-nowrap">재우기</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
