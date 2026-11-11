import React from 'react';
import { PetStats } from '../types/tamagotchi';
import { Heart, Sparkles, Smile, Apple, AlertTriangle } from 'lucide-react';

interface StatusBarsProps {
  stats: PetStats;
}

export const StatusBars: React.FC<StatusBarsProps> = ({ stats }) => {
  // Affinity next level threshold = Level * 50
  const currentLevelMax = stats.affinityLevel * 50;
  const currentExp = stats.affinity % currentLevelMax;
  const affinityPercent = Math.min(100, Math.round((currentExp / currentLevelMax) * 100));

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 shadow-sm space-y-2.5">
      {/* Top Affinity & Days info */}
      <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-700/50">
        <div className="flex items-center gap-1.5 font-medium text-pink-300">
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
          <span className="font-pixel text-[11px]">친밀도 Lv.{stats.affinityLevel}</span>
          <span className="text-[11px] text-slate-400">({stats.affinity} pts)</span>
        </div>
        <div className="text-[11px] text-slate-400 font-pixel">
          함께한 지 <span className="text-amber-300 font-bold">{stats.daysAlive}</span>일째
        </div>
      </div>

      {/* Affinity Progress */}
      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-pink-500 to-rose-400 h-full transition-all duration-500 ease-out"
          style={{ width: `${affinityPercent}%` }}
        />
      </div>

      {/* 3 Main Status Gauges */}
      <div className="grid grid-cols-3 gap-2.5 pt-0.5">
        {/* Fullness */}
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700/60 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Apple className="w-3.5 h-3.5" />
              포만감
            </span>
            <span className="font-mono text-slate-300 text-[11px] font-bold">
              {stats.fullness}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                stats.fullness < 30
                  ? 'bg-rose-500 animate-pulse'
                  : stats.fullness < 60
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${stats.fullness}%` }}
            />
          </div>
          {stats.fullness < 30 && (
            <div className="flex items-center gap-0.5 text-[10px] text-rose-400 font-medium animate-pulse">
              <AlertTriangle className="w-3 h-3" /> 배고파요!
            </div>
          )}
        </div>

        {/* Happiness */}
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700/60 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Smile className="w-3.5 h-3.5" />
              행복도
            </span>
            <span className="font-mono text-slate-300 text-[11px] font-bold">
              {stats.happiness}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                stats.happiness < 30
                  ? 'bg-rose-500 animate-pulse'
                  : stats.happiness < 60
                  ? 'bg-amber-400'
                  : 'bg-amber-300'
              }`}
              style={{ width: `${stats.happiness}%` }}
            />
          </div>
          {stats.happiness < 30 && (
            <div className="flex items-center gap-0.5 text-[10px] text-rose-400 font-medium animate-pulse">
              <AlertTriangle className="w-3 h-3" /> 외로워요...
            </div>
          )}
        </div>

        {/* Cleanliness */}
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700/60 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-cyan-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              청결도
            </span>
            <span className="font-mono text-slate-300 text-[11px] font-bold">
              {stats.cleanliness}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                stats.cleanliness < 30
                  ? 'bg-rose-500 animate-pulse'
                  : stats.cleanliness < 60
                  ? 'bg-amber-400'
                  : 'bg-cyan-400'
              }`}
              style={{ width: `${stats.cleanliness}%` }}
            />
          </div>
          {stats.cleanliness < 30 && (
            <div className="flex items-center gap-0.5 text-[10px] text-rose-400 font-medium animate-pulse">
              <AlertTriangle className="w-3 h-3" /> 간지러워요!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
