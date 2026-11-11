🐣 AI 다마고치 다이어리 (AI Virtual Pet Lumi)
"상태 수치와 대화 맥락이 살아 숨 쉬는 감성 AI 다마고치 가상 펫 & 다국어 다이어리"
![이미지](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)
![이미지](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![이미지](https://img.shields.io/badge/Vite-8.x-646cff?logo=vite&logoColor=white)
![이미지](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss&logoColor=white)
![이미지](https://img.shields.io/badge/Express-4.21-white?logo=express&logoColor=black)
![이미지](https://img.shields.io/badge/Google%20Gemini-gemini--3.8--flash-4285F4?logo=google&logoColor=white)
📖 프로젝트 소개 (Overview)
AI 다마고치 다이어리는 고전 90년대 레트로 다마고치의 감성에 최신 Google Gemini 3.8 Flash 생성형 AI 모델을 결합한 가상 펫 육성 웹 애플리케이션입니다.
단순히 정해진 대사만 반복하는 기존 가상 펫과 달리, 포만감·행복도·청결도 등의 실시간 상태 수치와 사용자와 나눈 최근 대화 맥락이 AI 시스템 프롬프트(System Instruction)에 동적으로 주입됩니다. 배가 고프면 꼬르륵거리며 투정을 부리고, 깨끗이 씻겨주면 신나서 방방 뛰며, 한국어·영어·일본어로 대화하면서 실생활 유용한 어휘 팁과 하루의 추억을 그림일기로 기록해 줍니다.
✨ 핵심 기능 (Key Features)
1. 🎮 실시간 상태 시뮬레이션 (Status Gauges)
포만감 (Fullness: 0~100): 시간이 지남에 따라 자연 감소. 30 미만 시 배고픔 상태로 전환되어 투정을 부립니다.
행복도 (Happiness: 0~100): 대화하거나 함께 놀아줄 때 상승하며, 방치하면 우울해합니다.
청결도 (Cleanliness: 0~100): 시간이 지나면 방에 똥이나 먼지가 생겨 간지러워합니다. 청소 시 100% 회복.
친밀도 (Affinity & Level: Lv.1~10): 유저와의 상호작용 지수. 레벨이 오를수록 펫의 어조가 더 다정하고 애정 어린 말투로 진화합니다.
2. 👾 레트로 픽셀 LCD 뷰포트 & 애니메이션
SVG 기반 순수 픽셀 아트 렌더러로 레트로 LCD 스캔라인 및 도트 매트릭스 구현.
루미의 상태에 맞춘 다채로운 표정/애니메이션 (눈 깜빡임, 냠냠 먹기, 깡총 댄스, 긁적거리기, 쿨쿨 잠자기 등).
마우스 터치/클릭 반응: 뷰포트 속 루미를 클릭하면 하트가 퐁퐁 솟아나며 쓰다듬기 반응과 친밀도 보너스를 획득합니다.
3. 🤖 Gemini 3.8 Flash 연동 실시간 대화 & 다국어 학습
동적 페르소나 주입: 펫의 현재 상태 수치(FULLNESS, HAPPINESS, CLEANLINESS, AFFINITY_LEVEL)를 시스템 프롬프트에 실시간 반영.
3개 국어 지원: 한국어(KO), 영어(EN), 일본어(JA) 즉시 전환.
오늘의 언어 표현 팁 (Language Tip): 선택된 언어로 대화 시 일상에서 유용한 단어나 숙어 팁을 자동으로 추천.
Web Speech API (TTS): 루미의 귀여운 톤으로 대화를 소리 내어 읽어주는 음성 재생 기능.
4. 📝 AI 그림일기장 (Secret Diary)
하루 동안 먹었던 음식, 나눈 대화, 펫의 기분 상태를 회상하여 루미의 1인칭 시점으로 작성되는 그림일기 생성.
기분 스탬프(🌟 기운 펄펄, 💖 사랑 가득, 🍎 배부른 하루 등) 및 오늘 기억한 핵심 단어 보관.
지난 일기를 날짜별로 보관하고 다시 열어볼 수 있는 아카이브 제공.
5. 📚 외국어 단어 퀴즈 (Interactive Quiz)
Gemini 모델이 출제하는 실생활 맞춤 4지선다 어휘 퀴즈.
정답 시 친밀도(+20)와 행복도(+25) 대량 획득 및 축하 파티클(Confetti) 연출.
6. 🎨 7가지 레트로 다마고치 기기 테마
원클릭 빠른 색상 변경 바(Quick Color Switcher) 제공:
🍃 민트 에메랄드 (Mint) - 기본
🔮 사이버 라벤더 (Lavender)
🌊 네온 아쿠아 (Cyan)
🌺 선셋 코랄 (Coral)
🍯 버터 옐로우 (Yellow)
🌸 스위트 핑크 (Pink)
🕹️ 클래식 그레이 (Retro Gray)
선택한 테마에 따라 기기 케이스, 대화창 말풍선, 헤더 포인트 색상이 조화롭게 자동 전환.
7. 🔊 Web Audio API 8-bit 레트로 사운드
외부 오디오 파일 의존성 없이 브라우저 Web Audio API로 합성된 8-bit 칩튠 사운드 (버튼 삑 소리, 먹기, 청소, 신남, 레벨업 팡파레, 삐침 등). 음소거 기능 지원.
8. 💾 로컬 저장소 영속화 (LocalStorage)
새로고침이나 브라우저 재시작 후에도 펫의 상태, 친밀도, 레벨, 채팅 기록, 일기장이 안전하게 보존됩니다.
🏗️ 기술 스택 (Tech Stack)
구분	기술 / 라이브러리
Frontend	React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Canvas-Confetti, Motion
Backend	Express 4.21, Node.js, tsx (Full-Stack Dev Server)
AI / LLM	@google/genai (SDK v2.x) - Model: gemini-3.8-flash
Audio & FX	Web Audio API (Synthesized 8-bit sound effects), Web Speech API (TTS)
Storage	Browser localStorage
📁 프로젝트 구조 (Directory Structure)
Code
.
├── server.ts                  # Express 백엔드 서버 (Gemini API 프록시 & Vite 미들웨어)
├── index.html                 # HTML 엔트리 (Neo둥근모 & Plus Jakarta Sans 폰트 로드)
├── package.json               # 프로젝트 의존성 및 스크립트 정의
├── vite.config.ts             # Vite 빌드 설정
├── tsconfig.json              # TypeScript 컴파일러 설정
├── metadata.json              # AI Studio 앱렛 메타데이터
├── src/
│   ├── main.tsx               # React 앱 진입점
│   ├── App.tsx                # 메인 게임 루프, 상태 관리 및 레이아웃
│   ├── index.css              # Tailwind CSS v4 및 레트로 LCD 스캔라인 스타일
│   ├── types/
│   │   └── tamagotchi.ts      # 펫 수치, 대화, 일기, 퀴즈, 테마 타입 정의
│   ├── utils/
│   │   ├── sound.ts           # Web Audio API 기반 8-bit 사운드 합성기
│   │   └── storage.ts         # localStorage 데이터 저장/불러오기 유틸
│   └── components/
│       ├── PetViewport.tsx    # SVG 픽셀 캐릭터 & LCD 애니메이션 뷰포트
│       ├── StatusBars.tsx     # 포만감·행복도·청결도 게이지 및 친밀도 HUD
│       ├── ActionControls.tsx # 먹이주기/청소/놀기/퀴즈/일기/수면 액션 버튼
│       ├── ChatBox.tsx        # 실시간 AI 대화창, 언어 선택, 회화 팁, TTS
│       ├── DiaryModal.tsx     # 비밀 그림일기장 모달 & 일기 생성기
│       ├── QuizModal.tsx      # 언어 퀴즈 모달 & 보너스 지급
│       └── SettingsModal.tsx  # 기기 테마, 시간 경과 주기, 오디오 설정 모달
🚀 시작하기 (Getting Started)
1. 사전 요구사항 (Prerequisites)
Node.js v18.0.0 이상
Google AI Studio API Key
2. 저장소 복제 및 의존성 설치
Bash
git clone https://github.com/<your-username>/ai-tamagotchi-lumi.git
cd ai-tamagotchi-lumi
npm install
3. 환경 변수 설정
프로젝트 루트 경로에 .env 파일을 생성하고 발급받은 Gemini API 키를 입력합니다.
Bash
cp .env.example .env
.env 내용:
Env
GEMINI_API_KEY="your_gemini_api_key_here"
(참고: API 키가 없어도 내장된 룰 기반 Fallback 엔진을 통해 오프라인 환경에서도 게임의 핵심 루프가 원활히 작동합니다.)
4. 개발 서버 실행
Bash
npm run dev
브라우저에서 http://localhost:3000으로 접속합니다.
5. 프로덕션 빌드 & 실행
Bash
npm run build
npm start
📡 API 엔드포인트 명세 (Backend API)
모든 Gemini API 호출은 브라우저에 키를 노출하지 않고 server.ts 백엔드 프록시를 통해 안전하게 처리됩니다.
엔드포인트	메서드	설명	주요 파라미터
/api/chat	POST	루미와의 실시간 대화 및 페르소나 응답	message, stats, language, chatHistory
/api/diary	POST	하루 상호작용 기록 기반 1인칭 그림일기 생성	stats, language, events, petName
/api/quiz	POST	선택된 언어의 4지선다 어휘 퀴즈 생성	language, affinityLevel
🎮 게임 조작 및 규칙 (Game Mechanics)
밥 주기 (🍎): 사과, 쿠키, 딸기 케이크, 우유 중 선택하여 포만감(+15~30%)과 행복도를 채워줍니다.
청소하기 (🧹): 청결도가 35 미만이 되면 똥(💩)과 파리가 꼬입니다. 청소 버튼으로 뽀득뽀득 100%로 씻겨주세요.
놀아주기 (🎾): 루미와 통통 튀는 공놀이를 하여 행복도(+25%)를 올립니다.
쓰다듬기 (Click): 화면 속 루미를 직접 마우스로 클릭하면 하트가 피어나며 친밀도가 오릅니다.
재우기 (💤): 밤이나 외출 시 수면 모드로 전환하면 수치 감소가 멈추고 천천히 에너지를 회복합니다.
단어 퀴즈 (📚): 퀴즈를 맞히면 대량의 친밀도와 행복도 보너스를 획득합니다.
오늘 일기 쓰기 (📝): 오늘 하루 루미와 함께한 소중한 추억을 일기로 기록하고 간직하세요.
📄 라이선스 (License)
This project is licensed under the Apache-2.0 License.
