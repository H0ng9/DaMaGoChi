import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, Globe, Sparkles, HelpCircle } from 'lucide-react';
import { ChatMessage, LanguageCode, PetStats, CasingTheme } from '../types/tamagotchi';
import { sounds } from '../utils/sound';

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  stats: PetStats;
  petName?: string;
  ttsEnabled: boolean;
  onToggleTts: () => void;
  theme?: CasingTheme;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  isLoading,
  language,
  onLanguageChange,
  stats,
  petName = '루미',
  ttsEnabled,
  onToggleTts,
  theme = 'mint',
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    sounds.playBeep();
    await onSendMessage(text);
  };

  // Quick suggestion prompts based on language and current pet state
  const getSuggestions = () => {
    if (language === 'ja') {
      if (stats.fullness < 30) return ['お腹空いてるの？', 'ごはん食べる？', '大丈夫？'];
      if (stats.cleanliness < 30) return ['お風呂入ろうか？', 'きれいにしてあげるね', 'かゆい？'];
      return ['ルミ、こんにちは！', '今日何してたの？', '日本語を教えて！', '大好きだよ！'];
    }
    if (language === 'en') {
      if (stats.fullness < 30) return ['Are you hungry?', 'Want some snacks?', 'Hang in there!'];
      if (stats.cleanliness < 30) return ['Need a bath?', 'Let me clean you up!', 'Feeling itchy?'];
      return ['Hi Lumi!', 'How was your day?', 'Teach me a cool word!', 'You are so cute!'];
    }
    // Korean
    if (stats.fullness < 30) return ['루미야 배고프지?', '맛있는 사과 줄까?', '배에서 꼬르륵 소리 나!'];
    if (stats.cleanliness < 30) return ['몸이 간지러워 보여!', '깨끗하게 씻겨줄게', '청소해 줄까?'];
    if (stats.happiness < 30) return ['루미야 왜 우울해?', '내가 심심하게 했지 미안해', '나랑 신나게 놀자!'];
    return ['루미야 안녕! 오늘 뭐 해?', '오늘 하루 어땠어?', '유용한 외국어 표현 알려줘!', '쓰담쓰담~ 사랑해!'];
  };

  // Optional Text-To-Speech for pet's voice
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.4; // Cute high pitch voice for Lumi!
    if (language === 'ja') utterance.lang = 'ja-JP';
    else if (language === 'en') utterance.lang = 'en-US';
    else utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  const getThemeAccent = (t: CasingTheme) => {
    switch (t) {
      case 'mint':
        return {
          title: 'text-teal-300',
          dot: 'bg-teal-400',
          ttsActive: 'bg-teal-950/60 border-teal-500/70 text-teal-300',
          activeLang: 'bg-teal-600 text-white font-bold',
          userBubble: 'bg-teal-600 text-white',
          sendBtn: 'bg-teal-600 hover:bg-teal-500',
          focus: 'focus:border-teal-500',
        };
      case 'lavender':
        return {
          title: 'text-purple-300',
          dot: 'bg-purple-400',
          ttsActive: 'bg-purple-950/60 border-purple-500/70 text-purple-300',
          activeLang: 'bg-purple-600 text-white font-bold',
          userBubble: 'bg-purple-600 text-white',
          sendBtn: 'bg-purple-600 hover:bg-purple-500',
          focus: 'focus:border-purple-500',
        };
      case 'cyan':
        return {
          title: 'text-cyan-300',
          dot: 'bg-cyan-400',
          ttsActive: 'bg-cyan-950/60 border-cyan-500/70 text-cyan-300',
          activeLang: 'bg-cyan-600 text-white font-bold',
          userBubble: 'bg-cyan-600 text-white',
          sendBtn: 'bg-cyan-600 hover:bg-cyan-500',
          focus: 'focus:border-cyan-500',
        };
      case 'coral':
        return {
          title: 'text-rose-300',
          dot: 'bg-rose-400',
          ttsActive: 'bg-rose-950/60 border-rose-500/70 text-rose-300',
          activeLang: 'bg-rose-600 text-white font-bold',
          userBubble: 'bg-rose-600 text-white',
          sendBtn: 'bg-rose-600 hover:bg-rose-500',
          focus: 'focus:border-rose-500',
        };
      case 'yellow':
        return {
          title: 'text-amber-300',
          dot: 'bg-amber-400',
          ttsActive: 'bg-amber-950/60 border-amber-500/70 text-amber-300',
          activeLang: 'bg-amber-600 text-white font-bold',
          userBubble: 'bg-amber-600 text-white',
          sendBtn: 'bg-amber-600 hover:bg-amber-500',
          focus: 'focus:border-amber-500',
        };
      case 'retro-gray':
        return {
          title: 'text-slate-300',
          dot: 'bg-slate-400',
          ttsActive: 'bg-slate-800 border-slate-500 text-slate-200',
          activeLang: 'bg-slate-600 text-white font-bold',
          userBubble: 'bg-slate-700 text-white',
          sendBtn: 'bg-slate-700 hover:bg-slate-600',
          focus: 'focus:border-slate-400',
        };
      case 'pink':
      default:
        return {
          title: 'text-pink-300',
          dot: 'bg-pink-400',
          ttsActive: 'bg-pink-950/60 border-pink-500/70 text-pink-300',
          activeLang: 'bg-pink-600 text-white font-bold',
          userBubble: 'bg-pink-600 text-white',
          sendBtn: 'bg-pink-600 hover:bg-pink-500',
          focus: 'focus:border-pink-500',
        };
    }
  };

  const colors = getThemeAccent(theme);

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 shadow-sm flex flex-col h-[380px]">
      {/* Chat Header: Title, Language Selector, TTS Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-pixel text-xs ${colors.title} font-bold flex items-center gap-1.5`}>
            <span className={`w-2 h-2 rounded-full ${colors.dot}`}></span>
            {petName}와의 대화창
          </span>
          {stats.isSleeping && (
            <span className="text-[10px] text-amber-300/80 font-pixel">(수면 중 💤)</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* TTS Voice Toggle */}
          <button
            onClick={() => {
              sounds.playBeep();
              onToggleTts();
            }}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              ttsEnabled
                ? colors.ttsActive
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={ttsEnabled ? '음성 읽기 켜짐' : '음성 읽기 꺼짐'}
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-700">
            <Globe className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
            <button
              onClick={() => {
                sounds.playBeep();
                onLanguageChange('ko');
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                language === 'ko'
                  ? colors.activeLang
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => {
                sounds.playBeep();
                onLanguageChange('en');
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                language === 'en'
                  ? colors.activeLang
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => {
                sounds.playBeep();
                onLanguageChange('ja');
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                language === 'ja'
                  ? colors.activeLang
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              日本語
            </button>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-sm">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-4">
            <span className="text-3xl mb-2">🐾</span>
            <p className="text-xs font-pixel text-slate-300">
              루미에게 인사를 건네보세요!
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              상태(배고픔, 행복도, 청결도)에 따라 대화와 표정이 달라져요.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5 px-1 font-pixel">
                <span>{msg.role === 'user' ? '나 (집사)' : petName}</span>
                <span>·</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 leading-relaxed text-xs shadow-sm ${
                  msg.role === 'user'
                    ? `${colors.userBubble} rounded-br-none`
                    : 'bg-slate-900 border border-slate-700/80 text-slate-100 rounded-bl-none'
                }`}
              >
                {msg.text}

                {/* Pet Action Reaction */}
                {msg.actionReaction && (
                  <div className="text-[11px] text-pink-300/80 italic mt-1 font-serif">
                    {msg.actionReaction}
                  </div>
                )}

                {/* Language Learning Tip Card if present */}
                {msg.languageTip && (
                  <div className="mt-2 pt-2 border-t border-slate-700/60 bg-slate-950/60 p-2 rounded-lg text-[11px]">
                    <div className="flex items-center gap-1 text-emerald-400 font-bold mb-0.5">
                      <Sparkles className="w-3 h-3" />
                      <span>오늘의 표현 팁</span>
                    </div>
                    <div className="font-semibold text-slate-100">
                      {msg.languageTip.expression}
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      {msg.languageTip.meaning}
                      {msg.languageTip.pronunciation && ` [${msg.languageTip.pronunciation}]`}
                    </div>
                  </div>
                )}
              </div>

              {/* Speaker button on pet message */}
              {msg.role === 'pet' && (
                <button
                  onClick={() => speakText(msg.text)}
                  className="mt-1 ml-1 text-slate-500 hover:text-slate-300 transition-colors p-0.5"
                  title="다시 읽어주기"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
            <span className={`w-2 h-2 rounded-full ${colors.dot} animate-ping`}></span>
            <span className="font-pixel text-[11px]">{petName}가 생각하는 중...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 scrollbar-none">
        {getSuggestions().map((s, idx) => (
          <button
            key={idx}
            disabled={isLoading || stats.isSleeping}
            onClick={() => {
              sounds.playBeep();
              onSendMessage(s);
            }}
            className="text-[11px] whitespace-nowrap bg-slate-900/90 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition-colors shrink-0 disabled:opacity-40 cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chat Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1 border-t border-slate-700/60">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            stats.isSleeping
              ? '루미가 자고 있어요 (깨우거나 조용히 말을 건네보세요)'
              : '루미에게 하고 싶은 말을 입력하세요...'
          }
          disabled={isLoading}
          className={`flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none ${colors.focus} transition-colors disabled:opacity-50`}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className={`${colors.sendBtn} disabled:bg-slate-700 text-white p-2 rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-sm active:scale-95 shrink-0`}
          title="전송"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
