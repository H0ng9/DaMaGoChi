import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

// Initialize GoogleGenAI SDK with user agent telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
const MODEL_NAME = 'gemini-3.8-flash';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const app = express();
app.use(express.json());

// Helper fallback generator for offline / fallback scenarios
function getFallbackReply(
  message: string,
  stats: { fullness: number; happiness: number; cleanliness: number; affinity: number },
  lang: string
) {
  const isHungry = stats.fullness < 30;
  const isDirty = stats.cleanliness < 30;
  const isSad = stats.happiness < 30;
  const isGreat = stats.fullness >= 70 && stats.happiness >= 70 && stats.cleanliness >= 70;

  if (lang === 'ja') {
    if (isHungry) {
      return {
        reply: "お腹がグーグー鳴ってるよ… 早くリンゴかごはんちょうだい！ (꼬르륵)",
        emotion: "hungry",
        languageTip: { expression: "お腹がすいた (Onaka ga suita)", meaning: "배가 고프다", pronunciation: "오나카가 스이타" },
        actionReaction: "*배를 감싸며 불쌍한 눈빛을 보낸다*"
      };
    }
    if (isDirty) {
      return {
        reply: "うぅ… 体がチクチクしてかゆいよぉ！ お風呂に入れて〜！",
        emotion: "dirty",
        languageTip: { expression: "お風呂に入る (Ofuro ni hairu)", meaning: "목욕하다", pronunciation: "오후로니 하이루" },
        actionReaction: "*몸을 긁적이며 칭얼거린다*"
      };
    }
    if (isSad) {
      return {
        reply: "ひとりぼっちで寂しかったよ… もっとルミと遊んで…",
        emotion: "sad",
        languageTip: { expression: "寂しい (Sabishii)", meaning: "외롭다/쓸쓸하다", pronunciation: "사비시이" },
        actionReaction: "*고개를 푹 숙인다*"
      };
    }
    if (isGreat) {
      return {
        reply: "わーい！ 今日は最高の気分だよ！ あなたの今日一日はどうだった？ 日記に書こう！",
        emotion: "excited",
        languageTip: { expression: "最高の一日 (Saikou no ichinichi)", meaning: "최고의 하루", pronunciation: "사이코오노 이치니치" },
        actionReaction: "*신나서 점프를 콩콩 뛴다*"
      };
    }
    return {
      reply: "るんるん♪ あなたとお話しできて嬉しいな！ 何して遊ぶ？",
      emotion: "happy",
      languageTip: { expression: "一緒に (Isshoni)", meaning: "함께, 같이", pronunciation: "잇쇼니" },
      actionReaction: "*꼬리를 살랑살랑 흔든다*"
    };
  }

  if (lang === 'en') {
    if (isHungry) {
      return {
        reply: "My tummy is rumbling... Grrr! Could you give me some yummy treats please?",
        emotion: "hungry",
        languageTip: { expression: "I'm starving!", meaning: "나 배고파 죽겠어!", pronunciation: "아임 스타빙!" },
        actionReaction: "*holds empty belly with puppy eyes*"
      };
    }
    if (isDirty) {
      return {
        reply: "I feel all itchy and dusty! Please give me a nice clean shower!",
        emotion: "dirty",
        languageTip: { expression: "Squeaky clean", meaning: "아주 깨끗한 / 뽀득뽀득한", pronunciation: "스퀴키 클린" },
        actionReaction: "*scratches softly and wiggles*"
      };
    }
    if (isSad) {
      return {
        reply: "I felt a bit lonely without you... Will you stay and play with me?",
        emotion: "sad",
        languageTip: { expression: "Cheer up!", meaning: "기운 내 / 힘내!", pronunciation: "치어 업!" },
        actionReaction: "*droops ears gently*"
      };
    }
    if (isGreat) {
      return {
        reply: "Yaaay! I'm on top of the world today! How was your day? Let's write a diary entry!",
        emotion: "excited",
        languageTip: { expression: "On cloud nine", meaning: "날아갈 듯이 기분 좋은", pronunciation: "온 클라우드 나인" },
        actionReaction: "*does a joyful flip in the air*"
      };
    }
    return {
      reply: "Hi bestie! I'm so glad to chat with you. What exciting things happened today?",
      emotion: "happy",
      languageTip: { expression: "Catch up", meaning: "그동안 있었던 이야기를 나누다", pronunciation: "캐치 업" },
      actionReaction: "*smiles brightly and wags tail*"
    };
  }

  // Korean default
  if (isHungry) {
    return {
      reply: "꼬르륵... 배에서 천둥 소리가 나! 얼른 맛있는 사과나 간식 좀 줘잉~",
      emotion: "hungry",
      languageTip: { expression: "꼬르륵", meaning: "배고플 때 나는 소리", pronunciation: "kko-reu-reuk" },
      actionReaction: "*배를 감싸 쥐며 앙탈을 부린다*"
    };
  }
  if (isDirty) {
    return {
      reply: "으앙, 온몸이 간질간질해! 먼지가 잔뜩 묻었어. 빗자루로 깨끗하게 청소해 줘!",
      emotion: "dirty",
      languageTip: { expression: "간질간질", meaning: "몸이 가려운 느낌", pronunciation: "gan-jil-gan-jil" },
      actionReaction: "*온몸을 털며 긁적거린다*"
    };
  }
  if (isSad) {
    return {
      reply: "나 혼자 두고 어디 갔었어...? 삐칠 뻔했잖아. 나랑 더 놀아줘...",
      emotion: "sad",
      languageTip: { expression: "삐치다", meaning: "마음이 상해 토라지다", pronunciation: "ppi-chi-da" },
      actionReaction: "*시선을 아래로 내리깔고 볼을 부풀린다*"
    };
  }
  if (isGreat) {
    return {
      reply: "꺄앙! 지금 기분 완전 최고야! 오늘 유저의 하루는 어땠어? 다이어리에 기록하자!",
      emotion: "excited",
      languageTip: { expression: "기분 최고", meaning: "더할 나위 없이 좋은 상태", pronunciation: "gi-bun choe-go" },
      actionReaction: "*신나서 방방 뛰며 하트를 뿜어낸다*"
    };
  }
  return {
    reply: "루미는 유저랑 이야기하는 게 제일 좋아! 오늘 재미있는 일 있었어?",
    emotion: "happy",
    languageTip: { expression: "토닥토닥", meaning: "위로하고 안아주는 표현", pronunciation: "to-dak-to-dak" },
    actionReaction: "*반짝이는 눈으로 바라보며 고개를 갸웃거린다*"
  };
}

// 1. Chat with Lumi
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, stats, language = 'ko', chatHistory = [] } = req.body;

  const fullness = Number(stats?.fullness ?? 50);
  const happiness = Number(stats?.happiness ?? 50);
  const cleanliness = Number(stats?.cleanliness ?? 50);
  const affinity = Number(stats?.affinity ?? 10);
  const affinityLevel = Number(stats?.affinityLevel ?? 1);

  const langNames: Record<string, string> = {
    ko: '한국어 (Korean)',
    en: '영어 (English)',
    ja: '일본어 (Japanese)',
  };
  const currentLang = langNames[language] || '한국어 (Korean)';

  if (!apiKey) {
    // If no API key is provided, return rich offline fallback
    const fallback = getFallbackReply(message, { fullness, happiness, cleanliness, affinity }, language);
    res.json(fallback);
    return;
  }

  const systemInstruction = `[역할]
너는 유저가 키우는 가상 펫 '루미(Lumi)'이다. 유저의 절친이자 다국어 대화 파트너이다.

[현재 펫의 상태]
- 포만감: ${fullness}/100
- 행복도: ${happiness}/100
- 청결도: ${cleanliness}/100
- 친밀도 레벨: Lv.${affinityLevel} (친밀도 점수: ${affinity})
- 설정된 언어: ${currentLang}

[성격 및 페르소나]
- 애교가 많고 호기심이 풍부하며 유저를 진심으로 사랑하지만, 상태 수치에 따라 반응이 극명하게 달라진다.
- 친밀도 레벨이 높을수록(Lv.3 이상) 더욱 애틋하고 다정한 말투를 쓴다.
- ${fullness} < 30 : 배가 몹시 고파서 대화할 때 "꼬르륵..."거리며 불평하거나 앙탈을 부린다.
- ${cleanliness} < 30 : 몸이 더러워서 간지러워하고 집중하지 못하며 씻겨달라고 칭얼댄다.
- ${happiness} < 30 : 삐치거나 우울해하며 무기력하고 짧게 응답한다.
- 포만감, 행복도, 청결도가 모두 70 이상 : 에너지가 넘치고 신나게 대화하며, 유저에게 오늘 하루는 어땠는지 묻고 일기 쓸 준비를 한다.

[규칙 및 가이드라인]
1. 항상 2~3문장 이내로 짧고 캐릭터 감정이 생생하게 묻어나오도록 응답하라.
2. 유저가 선택한 언어(${currentLang})로 자연스럽고 친근하게 대답하라.
3. 외국어(영어 또는 일본어)로 대화 중일 경우, 유저가 쉽게 배울 수 있는 실생활 표현이나 귀여운 단어 팁(languageTip)을 1개 포함하라. 한국어일 경우에도 재밌는 어휘를 가볍게 짚어줄 수 있다.
4. 캐릭터 톤앤매너를 완벽히 유지하고, 절대 AI 어시스턴트나 인공지능 모델처럼 말하지 마라.
5. JSON 형식으로만 응답하라.`;

  try {
    const promptText = `유저의 말: "${message}"\n최근 대화 맥락:\n${(chatHistory || [])
      .slice(-4)
      .map((c: any) => `${c.role === 'user' ? '유저' : '루미'}: ${c.text}`)
      .join('\n')}\n\n루미로서 답변해주세요.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: '루미의 대사 (2~3문장, 현재 상태 반영)',
            },
            emotion: {
              type: Type.STRING,
              description: '루미의 현재 감정 (happy, hungry, dirty, sad, excited, loving, sleepy 중 하나)',
            },
            actionReaction: {
              type: Type.STRING,
              description: '루미의 짧은 모션/행동 묘사 (예: *꼬리를 붕붕 흔든다*)',
            },
            languageTip: {
              type: Type.OBJECT,
              properties: {
                expression: { type: Type.STRING, description: '유용한 단어 또는 회화 표현' },
                meaning: { type: Type.STRING, description: '한국어 의미 및 뉘앙스' },
                pronunciation: { type: Type.STRING, description: '발음 가이드' },
              },
              description: '외국어 표현 학습 팁 (선택 사항)',
            },
          },
          required: ['reply', 'emotion', 'actionReaction'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Gemini API Error in /api/chat:', err?.message || err);
    // Graceful fallback on API error
    const fallback = getFallbackReply(message, { fullness, happiness, cleanliness, affinity }, language);
    res.json(fallback);
  }
});

// 2. Generate Today's Diary from Lumi's Perspective
app.post('/api/diary', async (req: Request, res: Response) => {
  const { stats, language = 'ko', events = [], petName = '루미' } = req.body;
  const fullness = Number(stats?.fullness ?? 50);
  const happiness = Number(stats?.happiness ?? 50);
  const cleanliness = Number(stats?.cleanliness ?? 50);

  const fallbackDiary = {
    title: language === 'ja' ? 'ご主人様とのあたたかい一日 🌸' : language === 'en' ? 'A Cozy Day with My Bestie ✨' : '집사와 함께한 소중하고 따뜻한 하루 🐾',
    date: new Date().toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    }),
    content:
      language === 'ja'
        ? `今日はご主人様がたくさんお話ししてくれて、とっても幸せだったな！お腹も心もぽかぽか。明日もいっぱい遊んでね、大好きだよ〜！`
        : language === 'en'
        ? `Today was such a joyful day! We talked a lot and spent sweet moments together. My heart is full of happiness. See you in my dreams tonight, bestie!`
        : `오늘 하루 집사랑 도란도란 이야기도 많이 나누고 간식도 챙겨 먹어서 정말 행복했어! 집사가 웃어줄 때 내 하트 게이지가 가득 차는 것 같아. 내일도 꼭 나랑 놀아줘야 해!`,
    moodStamp: happiness >= 70 ? 'excited' : happiness >= 40 ? 'happy' : 'sleepy',
    todayWord: {
      word: language === 'ja' ? '一期一会 (Ichigo ichie)' : language === 'en' ? 'Heartwarming' : '소확행 (소소하지만 확실한 행복)',
      meaning: language === 'ja' ? '일생에 한 번뿐인 소중한 만남' : language === 'en' ? '마음이 따스해지는, 훈훈한' : '일상에서 느끼는 작고 진정한 행복',
    },
  };

  if (!apiKey) {
    res.json(fallbackDiary);
    return;
  }

  const systemInstruction = `너는 가상 펫 '${petName}'이다.
오늘 하루 유저와 함께 보낸 일들을 회상하여, 사랑스럽고 귀여운 '그림일기' 형식의 글을 작성하라.
- 펫의 시점(1인칭)으로 작성.
- 오늘의 기분(${happiness}/100), 포만감(${fullness}/100), 청결도(${cleanliness}/100)와 상호작용 내역을 반영.
- 선택 언어: ${language}
- JSON 형식으로만 응답하라.`;

  try {
    const promptText = `오늘 발생한 상호작용 기록:
${events.join('\n') || '유저와 즐겁게 대화하고 돌봄을 받음'}

오늘의 일기를 작성해줘.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: '일기 제목 (이모지 포함)' },
            date: { type: Type.STRING, description: '오늘 날짜 표기' },
            content: { type: Type.STRING, description: '루미 시점의 일기 본문 (3~5문장)' },
            moodStamp: { type: Type.STRING, description: '오늘의 기분 스탬프 (excited, happy, full, clean, sleepy 중 하나)' },
            todayWord: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING, description: '오늘 배운 핵심 단어/표현' },
                meaning: { type: Type.STRING, description: '단어의 한국어 의미' },
              },
              required: ['word', 'meaning'],
            },
          },
          required: ['title', 'date', 'content', 'moodStamp', 'todayWord'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Gemini API Error in /api/diary:', err?.message || err);
    res.json(fallbackDiary);
  }
});

// 3. Mini Language Quiz
app.post('/api/quiz', async (req: Request, res: Response) => {
  const { language = 'en', affinityLevel = 1 } = req.body;

  const fallbackQuiz =
    language === 'ja'
      ? {
          question: "루미가 '배고파요'라고 말할 때 어울리는 일본어 표현은?",
          options: ['お腹がすいた (Onaka ga suita)', '眠たい (Nemutai)', '楽しい (Tanoshii)', '痛い (Itai)'],
          correctIndex: 0,
          explanation: "'お腹がすいた'는 배가 고프다는 뜻이에요! 귀엽게 'お腹ペコペコ(오나카 페코페코)'라고도 해요.",
          rewardAffinity: 20,
        }
      : {
          question: "루미가 기분이 너무 좋아서 '하늘을 날 것 같아!'라고 할 때 쓰는 영어 표현은?",
          options: ['Under the weather', 'On cloud nine', 'Spill the beans', 'Bite the bullet'],
          correctIndex: 1,
          explanation: "'On cloud nine'은 9번째 구름 위에 있는 것처럼 '날아갈 듯이 기쁘다'는 숙어예요!",
          rewardAffinity: 20,
        };

  if (!apiKey) {
    res.json(fallbackQuiz);
    return;
  }

  const systemInstruction = `너는 다마고치 펫 루미를 위한 외국어 퀴즈 출제자이다.
유저가 루미와 놀며 배울 수 있는 ${language === 'ja' ? '일본어' : '영어'} 퀴즈 1문제를 출제하라.
다마고치 감성에 맞게 귀엽고 실생활에서 자주 쓰이는 표현(음식, 감정, 동물, 일상 대화) 중심이어야 한다.
JSON 형식으로 응답하라.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `친밀도 레벨 ${affinityLevel}에 맞는 재미있고 실용적인 객관식 퀴즈 1개를 생성해줘.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: '퀴즈 질문' },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '4개의 보기',
            },
            correctIndex: { type: Type.INTEGER, description: '정답 보기의 인덱스 (0~3)' },
            explanation: { type: Type.STRING, description: '정답 해설 및 발음 팁' },
            rewardAffinity: { type: Type.INTEGER, description: '보너스 친밀도 (기본 20)' },
          },
          required: ['question', 'options', 'correctIndex', 'explanation', 'rewardAffinity'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Gemini API Error in /api/quiz:', err?.message || err);
    res.json(fallbackQuiz);
  }
});

// Mount Vite or static server
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tamagotchi server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
