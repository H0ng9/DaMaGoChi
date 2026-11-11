import React, { useState } from 'react';
import { X, BookOpen, Calendar, Sparkles, RefreshCw, Bookmark, Award } from 'lucide-react';
import { DiaryEntry } from '../types/tamagotchi';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  diaries: DiaryEntry[];
  onGenerateTodayDiary: () => Promise<void>;
  isGenerating: boolean;
  petName?: string;
}

export const DiaryModal: React.FC<DiaryModalProps> = ({
  isOpen,
  onClose,
  diaries,
  onGenerateTodayDiary,
  isGenerating,
  petName = '루미',
}) => {
  const [selectedDiaryId, setSelectedDiaryId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDiary = diaries.find((d) => d.id === selectedDiaryId) || diaries[0] || null;

  const handleGenerate = async () => {
    sounds.playBeep();
    await onGenerateTodayDiary();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }
  };

  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case 'excited':
        return { label: '기운 펄펄! 🌟', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'happy':
        return { label: '행복 가득 💖', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40' };
      case 'full':
        return { label: '배부른 하루 🍎', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'sparkling':
        return { label: '뽀득뽀득 상쾌 ✨', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      case 'sleepy':
        return { label: '꿈나라 여행 💤', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      default:
        return { label: '따뜻한 하루 🐾', color: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border-2 border-pink-500/40 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-400" />
            <h2 className="font-pixel text-sm text-pink-200 font-bold">
              {petName}의 비밀 그림일기장
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={isGenerating}
              onClick={handleGenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-500 disabled:bg-slate-700 text-white rounded-xl text-xs font-medium transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? '일기 작성 중...' : '오늘 일기 쓰기'}</span>
            </button>
            <button
              onClick={() => {
                sounds.playBeep();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Left Column: Diary List */}
          <div className="p-3 overflow-y-auto max-h-[220px] md:max-h-none space-y-1.5 bg-slate-950/40">
            <div className="text-[11px] font-pixel text-slate-400 px-2 py-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              일기 보관함 ({diaries.length}권)
            </div>

            {diaries.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs font-pixel px-2">
                아직 작성된 일기가 없어요. '오늘 일기 쓰기' 버튼을 눌러보세요!
              </div>
            ) : (
              diaries.map((diary) => (
                <button
                  key={diary.id}
                  onClick={() => {
                    sounds.playBeep();
                    setSelectedDiaryId(diary.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    currentDiary?.id === diary.id
                      ? 'bg-pink-950/60 border-pink-500/80 text-pink-100 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold truncate mb-0.5">{diary.title}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{diary.date}</span>
                    <span className="font-pixel text-pink-400">Lv.{diary.statsSnapshot.affinityLevel}</span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Right Column: Active Diary Entry Reader */}
          <div className="p-5 md:col-span-2 overflow-y-auto bg-slate-900 space-y-4">
            {currentDiary ? (
              <div className="space-y-4 animate-in fade-in">
                {/* Entry Header */}
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs text-slate-400 font-pixel flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-pink-400" />
                      {currentDiary.date}
                    </span>
                    {/* Mood badge */}
                    {(() => {
                      const badge = getMoodBadge(currentDiary.moodStamp);
                      return (
                        <span
                          className={`text-[11px] font-pixel px-2 py-0.5 rounded-full border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      );
                    })()}
                  </div>
                  <h3 className="text-lg font-bold text-pink-200 tracking-tight font-serif">
                    {currentDiary.title}
                  </h3>
                </div>

                {/* Entry Body */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 leading-relaxed text-sm text-slate-200 whitespace-pre-line font-serif shadow-inner">
                  {currentDiary.content}
                </div>

                {/* Today's Word Highlight */}
                {currentDiary.todayWord && (
                  <div className="bg-emerald-950/30 border border-emerald-600/40 p-3.5 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>{petName}가 오늘 기억한 특별한 단어</span>
                    </div>
                    <div className="text-sm font-bold text-slate-100">
                      {currentDiary.todayWord.word}
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      {currentDiary.todayWord.meaning}
                    </div>
                  </div>
                )}

                {/* Snapshot Stats */}
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400 font-pixel">
                  <span>작성 당시 루미 상태:</span>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400">포만감 {currentDiary.statsSnapshot.fullness}%</span>
                    <span className="text-amber-400">행복도 {currentDiary.statsSnapshot.happiness}%</span>
                    <span className="text-cyan-400">청결도 {currentDiary.statsSnapshot.cleanliness}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-600 animate-pulse" />
                <h4 className="font-pixel text-sm text-slate-300">
                  아직 일기가 비어 있어요
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  루미와 대화를 나누고 간식을 준 다음, 상단의 '오늘 일기 쓰기' 버튼을 누르면 루미가 오늘의 추억을 기록해줘요!
                </p>
                <button
                  disabled={isGenerating}
                  onClick={handleGenerate}
                  className="mt-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-medium cursor-pointer shadow transition-all active:scale-95"
                >
                  지금 오늘 일기 쓰기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
