import React, { useEffect, useState } from 'react';
import { PetStats, PetEmotion } from '../types/tamagotchi';
import { sounds } from '../utils/sound';

interface PetViewportProps {
  stats: PetStats;
  emotion: PetEmotion;
  petName?: string;
  onPetLumi?: () => void;
  activeActionEffect?: 'eat' | 'clean' | 'play' | null;
}

export const PetViewport: React.FC<PetViewportProps> = ({
  stats,
  emotion,
  petName = '루미',
  onPetLumi,
  activeActionEffect,
}) => {
  const [blink, setBlink] = useState(false);
  const [clickHeart, setClickHeart] = useState<{ x: number; y: number; id: number }[]>([]);
  const [petHovered, setPetHovered] = useState(false);

  // Periodic blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Determine current active animation state
  const isHungry = stats.fullness < 30;
  const isSad = stats.happiness < 30;
  const isDirty = stats.cleanliness < 30 || stats.poopCount > 0;
  const isSleeping = stats.isSleeping;

  let currentAnimClass = 'animate-pet-bounce';
  if (isSleeping) {
    currentAnimClass = '';
  } else if (emotion === 'excited' || emotion === 'playing' || activeActionEffect === 'play') {
    currentAnimClass = 'animate-pet-dance';
  } else if (isSad || emotion === 'sad') {
    currentAnimClass = 'animate-pet-shiver';
  } else if (isHungry || emotion === 'hungry') {
    currentAnimClass = 'animate-pet-shiver';
  }

  // Handle clicking or petting Lumi
  const handlePetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSleeping) {
      sounds.playBeep();
      return;
    }
    sounds.playHappy();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { x, y, id: Date.now() };
    setClickHeart((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setClickHeart((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 900);

    onPetLumi?.();
  };

  return (
    <div
      onClick={handlePetClick}
      onMouseEnter={() => setPetHovered(true)}
      onMouseLeave={() => setPetHovered(false)}
      className="tamagotchi-screen relative w-full h-64 md:h-72 rounded-xl flex flex-col items-center justify-center select-none cursor-pointer border-4 border-[#2b3a1d] shadow-inner overflow-hidden"
      title="루미를 클릭하면 쓰다듬어 줄 수 있어요!"
    >
      {/* Top LCD Status Header */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-20 text-[#243316] font-pixel text-[11px] tracking-wider opacity-85">
        <div className="flex items-center gap-1.5">
          <span className="font-bold">{petName}</span>
          <span>·</span>
          <span>Lv.{stats.affinityLevel}</span>
        </div>
        <div className="flex items-center gap-2">
          {isSleeping && <span>💤 SLEEP</span>}
          {isHungry && !isSleeping && <span className="text-amber-900 font-bold">⚠️ HUNGRY</span>}
          {isDirty && !isSleeping && <span className="text-amber-900 font-bold">⚠️ DIRTY</span>}
          {!isSleeping && !isHungry && !isDirty && <span>HAPPY ☀️</span>}
        </div>
      </div>

      {/* Floating Click Hearts / Pet Reaction */}
      {clickHeart.map((h) => (
        <div
          key={h.id}
          style={{ left: `${h.x}px`, top: `${h.y}px` }}
          className="absolute pointer-events-none text-rose-700 text-lg font-bold animate-ping z-30"
        >
          💖
        </div>
      ))}

      {/* Poop & Dust Elements when Dirty */}
      {isDirty && (
        <div className="absolute bottom-6 right-8 flex items-end gap-1 z-20">
          <div className="text-2xl animate-bounce">💩</div>
          {stats.poopCount > 1 && <div className="text-xl opacity-90 animate-pulse">💩</div>}
          <div className="absolute -top-3 left-1 text-[10px] text-[#243316] font-pixel animate-pulse">
            🪰 fly
          </div>
        </div>
      )}

      {/* Eating Animation Effect */}
      {activeActionEffect === 'eat' && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-[#8da86f]/80 px-3 py-1 rounded-full border border-[#2b3a1d]">
          <span className="text-2xl animate-bounce">🍎</span>
          <span className="font-pixel text-xs text-[#1e2d14] font-bold">냠냠... 쩝쩝!</span>
        </div>
      )}

      {/* Cleaning Animation Effect */}
      {activeActionEffect === 'clean' && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-cyan-900/10">
          <div className="text-3xl animate-spin">🫧</div>
          <div className="text-3xl animate-pulse ml-4">✨</div>
          <div className="text-3xl animate-bounce mr-4">🧹</div>
        </div>
      )}

      {/* Playing Animation Effect */}
      {activeActionEffect === 'play' && (
        <div className="absolute top-16 left-12 text-3xl animate-bounce z-30">
          🎾
        </div>
      )}

      {/* Sleeping Nightcap & Zzz */}
      {isSleeping && (
        <div className="absolute top-12 right-16 z-20">
          <span className="font-pixel text-lg font-bold text-[#243316] animate-zzz inline-block">
            Zzz...
          </span>
        </div>
      )}

      {/* Main Character SVG Pixel Art Container */}
      <div className={`relative transition-transform duration-200 ${currentAnimClass}`}>
        {/* Subtle ground shadow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#233315]/20 rounded-full blur-[1px]"></div>

        {/* Lumi SVG Pixel Art */}
        <svg
          width="130"
          height="130"
          viewBox="0 0 32 32"
          className="pixelated drop-shadow-sm select-none"
          shapeRendering="crispEdges"
        >
          {/* Pet Body Base (Warm creamy mint/pearl pixel creature) */}
          {/* Ears */}
          <rect x="7" y="3" width="5" height="7" fill="#2b3b1e" />
          <rect x="8" y="4" width="3" height="5" fill="#eaf2d7" />
          <rect x="9" y="5" width="2" height="3" fill="#ffb8b8" />

          <rect x="20" y="3" width="5" height="7" fill="#2b3b1e" />
          <rect x="21" y="4" width="3" height="5" fill="#eaf2d7" />
          <rect x="21" y="5" width="2" height="3" fill="#ffb8b8" />

          {/* Sleeping nightcap if sleeping */}
          {isSleeping && (
            <>
              <polygon points="12,3 24,0 20,6" fill="#3b522b" />
              <rect x="23" y="0" width="3" height="3" fill="#ffffff" />
            </>
          )}

          {/* Head & Body Silhouette */}
          <rect x="6" y="8" width="20" height="17" fill="#2b3b1e" rx="1" />
          <rect x="7" y="9" width="18" height="15" fill="#edf5dd" />

          {/* Soft Belly patch */}
          <rect x="10" y="15" width="12" height="8" fill="#ffffff" />

          {/* Rosy Cheeks */}
          <rect x="8" y="16" width="3" height="2" fill="#fca5a5" />
          <rect x="21" y="16" width="3" height="2" fill="#fca5a5" />

          {/* Paws / Feet */}
          <rect x="8" y="24" width="4" height="3" fill="#2b3b1e" />
          <rect x="9" y="24" width="3" height="2" fill="#edf5dd" />

          <rect x="20" y="24" width="4" height="3" fill="#2b3b1e" />
          <rect x="20" y="24" width="3" height="2" fill="#edf5dd" />

          {/* Tail */}
          <rect x="4" y="18" width="3" height="3" fill="#2b3b1e" />
          <rect x="4" y="19" width="2" height="2" fill="#edf5dd" />

          {/* Eyes State Logic */}
          {isSleeping || blink ? (
            /* Closed / Sleeping curved eyes */
            <>
              <line x1="10" y1="14" x2="13" y2="14" stroke="#2b3b1e" strokeWidth="1.5" />
              <line x1="19" y1="14" x2="22" y2="14" stroke="#2b3b1e" strokeWidth="1.5" />
            </>
          ) : emotion === 'excited' || emotion === 'loving' || activeActionEffect === 'play' ? (
            /* Star/Joyful Happy Eyes (><) */
            <>
              {/* Left eye > */}
              <line x1="10" y1="12" x2="13" y2="14" stroke="#2b3b1e" strokeWidth="1.5" />
              <line x1="10" y1="16" x2="13" y2="14" stroke="#2b3b1e" strokeWidth="1.5" />
              {/* Right eye < */}
              <line x1="22" y1="12" x2="19" y2="14" stroke="#2b3b1e" strokeWidth="1.5" />
              <line x1="22" y1="16" x2="19" y2="14" stroke="#2b3b1e" strokeWidth="1.5" />
            </>
          ) : isSad || emotion === 'sad' ? (
            /* Teary / Sad Eyes */
            <>
              <rect x="10" y="13" width="3" height="3" fill="#2b3b1e" />
              <rect x="19" y="13" width="3" height="3" fill="#2b3b1e" />
              <rect x="9" y="16" width="2" height="3" fill="#38bdf8" />
            </>
          ) : isHungry || emotion === 'hungry' ? (
            /* Hungry Droopy Eyes */
            <>
              <rect x="10" y="12" width="3" height="4" fill="#2b3b1e" />
              <rect x="19" y="12" width="3" height="4" fill="#2b3b1e" />
              <line x1="9" y1="11" x2="13" y2="12" stroke="#2b3b1e" strokeWidth="1" />
              <line x1="23" y1="11" x2="19" y2="12" stroke="#2b3b1e" strokeWidth="1" />
            </>
          ) : (
            /* Normal Cute Sparkly Eyes */
            <>
              <rect x="10" y="12" width="3" height="4" fill="#2b3b1e" />
              <rect x="11" y="12" width="1" height="2" fill="#ffffff" />
              <rect x="19" y="12" width="3" height="4" fill="#2b3b1e" />
              <rect x="20" y="12" width="1" height="2" fill="#ffffff" />
            </>
          )}

          {/* Mouth State Logic */}
          {activeActionEffect === 'eat' ? (
            /* Eating round munching mouth */
            <circle cx="16" cy="18" r="2" fill="#dc2626" />
          ) : isHungry ? (
            /* Hungry wavy mouth */
            <path d="M 14 18 Q 16 16 18 18" stroke="#2b3b1e" strokeWidth="1.2" fill="none" />
          ) : isSad ? (
            /* Downward sad curve */
            <path d="M 14 19 Q 16 17 18 19" stroke="#2b3b1e" strokeWidth="1.2" fill="none" />
          ) : emotion === 'excited' || emotion === 'loving' ? (
            /* Big open happy smile */
            <>
              <path d="M 14 17 Q 16 21 18 17 Z" fill="#e11d48" stroke="#2b3b1e" strokeWidth="1" />
            </>
          ) : (
            /* Cat/bunny cute w mouth */
            <path d="M 14 17 Q 15 19 16 17 Q 17 19 18 17" stroke="#2b3b1e" strokeWidth="1.2" fill="none" />
          )}

          {/* Dirty Mud Smudge if Dirty */}
          {isDirty && (
            <>
              <circle cx="9" cy="10" r="1.5" fill="#78350f" />
              <circle cx="22" cy="21" r="1.5" fill="#78350f" />
            </>
          )}
        </svg>
      </div>

      {/* Floating Action Tip at Bottom */}
      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none z-20">
        <span className="font-pixel text-[10px] text-[#243316]/75 bg-[#9cb380]/70 px-2 py-0.5 rounded">
          {petHovered
            ? '클릭하면 루미를 쓰다듬어요! ✨'
            : isSleeping
            ? '루미가 곤히 자고 있어요 (쿨쿨)'
            : '루미와 실시간으로 함께하는 중'}
        </span>
      </div>
    </div>
  );
};
