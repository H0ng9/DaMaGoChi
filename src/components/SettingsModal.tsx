import React from 'react';
import { X, Settings, Volume2, VolumeX, RotateCcw, Palette, Clock, Info } from 'lucide-react';
import { AppSettings, CasingTheme } from '../types/tamagotchi';
import { sounds } from '../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetData: () => void;
  petName?: string;
}

const THEME_OPTIONS: { id: CasingTheme; name: string; bgClass: string; borderClass: string }[] = [
  { id: 'mint', name: '민트 에메랄드', bgClass: 'bg-emerald-400', borderClass: 'border-emerald-300' },
  { id: 'lavender', name: '사이버 라벤더', bgClass: 'bg-purple-400', borderClass: 'border-purple-300' },
  { id: 'cyan', name: '네온 아쿠아', bgClass: 'bg-cyan-400', borderClass: 'border-cyan-300' },
  { id: 'coral', name: '선셋 코랄', bgClass: 'bg-rose-400', borderClass: 'border-rose-300' },
  { id: 'yellow', name: '버터 옐로우', bgClass: 'bg-amber-400', borderClass: 'border-amber-300' },
  { id: 'pink', name: '파스텔 핑크', bgClass: 'bg-pink-400', borderClass: 'border-pink-300' },
  { id: 'retro-gray', name: '레트로 그레이', bgClass: 'bg-slate-400', borderClass: 'border-slate-300' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetData,
  petName = '루미',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-300" />
            <h3 className="font-pixel text-sm text-slate-200 font-bold">환경 설정</h3>
          </div>
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

        {/* 1. Tamagotchi Casing Color */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
            <Palette className="w-4 h-4 text-pink-400" />
            <span>다마고치 기기 색상 테마</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {THEME_OPTIONS.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  sounds.playBeep();
                  onUpdateSettings({ theme: theme.id });
                }}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                  settings.theme === theme.id
                    ? 'border-pink-500 bg-slate-800 shadow-sm ring-2 ring-pink-500/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${theme.bgClass} shadow-inner`}></div>
                <span className="text-[10px] text-slate-300 text-center truncate w-full">
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Simulation Speed (Tick Rate) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>시간 경과 주기 (수치 자연 감소 속도)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { sec: 10, label: '표준 (10초)' },
              { sec: 30, label: '여유롭게 (30초)' },
              { sec: 5, label: '빠르게 (5초)' },
            ].map((rate) => (
              <button
                key={rate.sec}
                onClick={() => {
                  sounds.playBeep();
                  onUpdateSettings({ tickRateSec: rate.sec });
                }}
                className={`py-2 px-1 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                  settings.tickRateSec === rate.sec
                    ? 'bg-amber-950/60 border-amber-500 text-amber-200 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {rate.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Audio & Sound Setting */}
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              {settings.isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-xs text-slate-300 font-medium">8-bit 레트로 사운드 효과</span>
            </div>
            <button
              onClick={() => {
                const nextMuted = !settings.isMuted;
                sounds.setMuted(nextMuted);
                if (!nextMuted) sounds.playBeep();
                onUpdateSettings({ isMuted: nextMuted });
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                settings.isMuted
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-700'
                  : 'bg-emerald-950/60 text-emerald-300 border border-emerald-700'
              }`}
            >
              {settings.isMuted ? '음소거' : '켜짐'}
            </button>
          </div>
        </div>

        {/* 4. Reset Game */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm(`${petName}의 모든 상태와 대화 기록을 초기화하시겠습니까?`)) {
                onResetData();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors p-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>데이터 초기화 (처음부터 키우기)</span>
          </button>

          <button
            onClick={() => {
              sounds.playBeep();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium cursor-pointer transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
