import React, { useState, useEffect } from 'react';
import { X, GraduationCap, CheckCircle2, AlertCircle, RefreshCw, Trophy } from 'lucide-react';
import { QuizQuestion, LanguageCode } from '../types/tamagotchi';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  affinityLevel: number;
  onReward: (affinity: number, happiness: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  language,
  affinityLevel,
  onReward,
}) => {
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const fetchQuiz = async () => {
    setLoading(true);
    setSelectedIndex(null);
    setIsAnswered(false);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: language === 'ja' ? 'ja' : 'en', affinityLevel }),
      });
      const data = await res.json();
      setQuiz(data);
    } catch (e) {
      console.warn('Failed to fetch quiz:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchQuiz();
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleSelect = (idx: number) => {
    if (isAnswered || !quiz) return;
    setSelectedIndex(idx);
    setIsAnswered(true);

    if (idx === quiz.correctIndex) {
      sounds.playFanfare();
      onReward(quiz.rewardAffinity || 20, 25);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore
      }
    } else {
      sounds.playSad();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-2xl w-full max-w-lg p-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h3 className="font-pixel text-sm text-indigo-200 font-bold">
              루미와 함께하는 {language === 'ja' ? '일본어' : '영어'} 퀴즈
            </h3>
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

        {/* Content */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-xs font-pixel text-indigo-200">
              루미가 문제를 준비하고 있어요...
            </p>
          </div>
        ) : quiz ? (
          <div className="py-4 space-y-4">
            {/* Question */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-pixel text-indigo-400 block mb-1">
                QUESTION · 보너스 친밀도 +{quiz.rewardAffinity} & 행복도 +25
              </span>
              <p className="text-sm font-semibold text-slate-100 leading-snug">
                {quiz.question}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-2">
              {quiz.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200';
                if (isAnswered) {
                  if (idx === quiz.correctIndex) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                  } else if (idx === selectedIndex) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === quiz.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && idx === selectedIndex && idx !== quiz.correctIndex && (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Result Explanation */}
            {isAnswered && (
              <div
                className={`p-3.5 rounded-xl border text-xs animate-in fade-in space-y-1 ${
                  selectedIndex === quiz.correctIndex
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {selectedIndex === quiz.correctIndex ? (
                    <>
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>정답입니다! 루미가 아주 좋아해요!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>아쉬워요! 다시 공부해봐요.</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed pt-1">
                  {quiz.explanation}
                </p>
              </div>
            )}

            {/* Next Question Button */}
            {isAnswered && (
              <button
                onClick={fetchQuiz}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-all cursor-pointer shadow active:scale-95 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>다음 문제 풀기</span>
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
