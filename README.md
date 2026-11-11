👾 DaMaGoChi (AI 다마고치 & 다이어리 펫)

Google Gemini API 기반의 스마트 AI 다마고치 프로젝트입니다. 펫의 실시간 상태 수치(포만감, 행복도, 청결도)와 사용자의 대화 맥락, 선택된 언어에 맞춰 AI 펫 '루미(Lumi)'가 동적으로 반응하고 상호작용합니다.

📸 프로젝트 주요 기능

1. 🐾 실시간 펫 상태 관리

포만감 (Fullness), 행복도 (Happiness), 청결도 (Cleanliness) 수치 제공

시간이 지남에 따라 수치가 자동으로 감소하며, 수치 상태에 맞춰 펫의 표정(픽셀/이모지)과 대화 톤이 변경됩니다.

먹이주기, 청소하기, 놀아주기 액션으로 상태 수치를 회복시킬 수 있습니다.

2. 💬 AI 기반 동적 페르소나 대화

Gemini API (gemini-2.5-flash)를 활용한 정교한 프롬프트 주입.

펫의 배고픔, 우울함, 청결도 상태에 따라 투정을 부리거나 애교를 부리는 등 실제 감정을 지닌 듯한 대화를 나눈니다.

3. 🌐 다국어 지원 & 학습 퀴즈

한국어, 영어, 일본어 3개 국어 대화 지원.

펫이 언어 학습을 돕기 위한 퀴즈 모달(QuizModal)을 제공하여 재미있게 다국어를 배울 수 있습니다.

4. 📝 AI 다이어리 (오늘의 일기)

펫과의 하루 상호작용 및 대화 기록을 기반으로 AI가 펫의 시점에서 작성한 오늘의 일기를 생성합니다.

5. 🔊 효과음 & 로컬 저장소 지원

Web Audio API 기반의 레트로 스타일 SFX 효과음 지원.

localStorage를 통한 상태값 및 대화 데이터 자동 저장/복원.

🛠 기술 스택 (Tech Stack)

Frontend Framework: React, TypeScript, Vite

Styling: Tailwind CSS

AI Model & SDK: @google/genai (Gemini API)

Runtime & Package Manager: Bun / Node.js

Server: Express / TypeScript Node Server (server.ts)

📁 프로젝트 구조

DaMaGoChi-main/
├── src/
│   ├── components/       # UI 컴포넌트
│   │   ├── ActionControls.tsx   # 상호작용 버튼 그룹 (먹이, 청소, 놀기)
│   │   ├── ChatBox.tsx          # AI 펫과의 실시간 대화창
│   │   ├── DiaryModal.tsx       # AI 생성 일기 모달
│   │   ├── PetViewport.tsx      # 펫 캐릭터 뷰포트 및 상태별 애니메이션
│   │   ├── QuizModal.tsx        # 다국어 학습 퀴즈 모달
│   │   ├── SettingsModal.tsx    # API 키 및 언어 설정
│   │   └── StatusBars.tsx       # 포만감/행복도/청결도 프로그래스 바
│   ├── types/
│   │   └── tamagotchi.ts        # 상태, 대화, 설정 타입 정의
│   ├── utils/
│   │   ├── sound.ts             # 레트로 SFX 효과음 유틸리티
│   │   └── storage.ts           # LocalStorage 저장/로드 유틸리티
│   ├── App.tsx                  # 메인 게임 루프 및 상태 관리
│   ├── main.tsx                 # 앱 진입점
│   └── index.css                # 글로벌 스타일 및 Tailwind 설정
├── .env.example                 # 환경 변수 예시 파일
├── server.ts                    # 백엔드 서버
├── package.json                 # 의존성 및 스크립트 정의
└── vite.config.ts               # Vite 설정 파일


🚀 시작하기 (Quick Start)

1. 레포지토리 클론 및 패키지 설치

# 패키지 설치 (bun 또는 npm)
bun install
# 또는
npm install


2. 환경 변수 설정

.env.example 파일을 복사하여 .env 파일을 생성한 후 Gemini API 키를 입력합니다.

cp .env.example .env


.env 파일 내용:

GEMINI_API_KEY=your_gemini_api_key_here


참고: 웹 UI 내 설정(SettingsModal)에서도 직접 API 키를 입력하여 사용할 수 있습니다.

3. 개발 서버 실행

# 개발 서버 실행
bun run dev
# 또는
npm run dev


브라우저에서 http://localhost:5173으로 접속하여 실행합니다.

🎮 게임 플레이 방법

API 키 설정: 우측 상단 톱니바퀴 버튼을 눌러 Gemini API 키를 입력하고 기본 언어를 선택합니다.

펫 케어: 상태 바를 확인하며 펫이 배고프거나 더러워지기 전에 버튼을 눌러 관리해 줍니다.

대화하기: 하단 대화창을 통해 펫에게 오늘 있었던 일이나 질문을 던져보세요. 펫의 기분 상태에 따라 응답이 달라집니다.

일기 확인: 펫과 충분히 대화를 나누고 [📝 오늘 일기] 버튼을 누르면 펫이 쓴 일기를 읽을 수 있습니다.
