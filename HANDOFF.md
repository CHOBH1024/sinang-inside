# 🔄 Agent Handoff State — sinang-inside

- **작업 주도권**: Claude Code 대기 중 → 뻠뻠 재개 시 바로 시작
- **작업 중인 브랜치**: main
- **배포 URL**: https://sinang-inside.vercel.app

---

## ✅ 완료된 작업

- [x] 관제탑(control-tower)에 sinang-inside 등록 (SITES + REPO_MAP, 카운트 16으로 업데이트)
- [x] 관제탑 배포 완료
- [x] SurveyEngine — 영화 자막 스타일 대화형 진단 흐름 구현
  - section-intro → question × 2 → section-reaction × 3회 → "수고하셨습니다 🙏" + 로딩바
- [x] 7개 진단 모두 3섹션 데이터 추가 (섹션 인트로 + 리액션 3종)
- [x] SurveyIntro — 일반(6문항) / 학술연구자(12문항) 버튼 두 개로 분리
- [x] 학술 문항 6개 × 7진단 추가 (올포트·프랭클·융·매슬로·로어·가드너)
- [x] SurveyResults — 학술 심층 분석 블록 추가 (12문항 응답 시 자동 표시)
- [x] sinang-inside 배포 완료

---

## ✅ 2026-06-14 추가 (실천 엔진 — "스스로 실천하는 신앙")

뻠뻠 7대 의사결정 확정 후 데일리 실천 루프 구현:
- [x] `src/utils/practiceStorage.ts` — 데일리 훈독/기도/결심 체크인 + 스트릭(연속·최장·누적) 계산
- [x] `src/data/challenges.ts` — 21일 챌린지 4종(기도/훈독/참사랑/효정, 각 21일=84스텝) + 진행상태 저장 + 진단별 추천(recommendChallenge)
- [x] `src/components/DailyPracticeHub.tsx` — 홈 상단 데일리 허브(말씀+3체크인+스트릭+오늘의 챌린지 스텝+선택 모달)
- [x] `gamification.ts` — 실천일·스트릭 XP 및 스트릭 뱃지(🔥3일/7일/👑21일/🌟50일)
- [x] `Dashboard.tsx` — UserLevelCard 아래 DailyPracticeHub 배치
- [x] `SurveyResults.tsx` — 결과 포토카드 직후 "맞춤 챌린지 처방" CTA (성향별 추천 → 시작 → 홈 허브로)
- [x] `npm run build` 통과 (Vite, 신규 에러 0)

⚠️ 기존 tsc strict 에러(HrPdfReport/SurveyEngine motion variants)는 이전부터 존재, Vite 빌드엔 영향 없음. 신규 파일은 깨끗.
⚠️ 아직 배포 안 함 — 뻠뻠 확인 후 배포 예정.

---

## 🔴 다음에 할 작업 (핵심)

### 1단계: 7개 진단 축 완전 재설계 (갈등 → 성향)
기존 7개 진단의 축이 "신학 논쟁 어느 편"이었음. 아래로 완전 교체:

| 진단 | 새 축 |
|------|------|
| 심정영성 | 내향 묵상형 ↔ 외향 표현형 |
| 말씀체휼 | 원리·논리형 ↔ 경험·직관형 |
| 참부모신학 | 개인 수련형 ↔ 관계 교제형 |
| 구원섭리 | 구조·규율형 ↔ 자유·창의형 |
| 실천자유 | 내재적 동기형 ↔ 외재적 동기형 |
| 초종교평화 | 내부 집중형 ↔ 세상 참여형 |
| 이상가정 | 규칙·확신형(전반전) ↔ 신비·통합형(후반전) |

### 2단계: 문항 수 확장
- **일반 진단**: 30문항 (5문항 × 6카테고리), Likert 5점
- **전문 진단**: 40문항, **강제선택(Forced Choice)** 방식 — A vs B 중 하나만 선택
  - CliftonStrengths(갤럽) 방식
  - 사회적 바람직성 편향 완전 제거
  - 중립 불가

### 3단계: 구현 순서
1. `types.ts` — ForcedChoicePair 타입 추가, SurveyConfig에 professionalQuestions 추가
2. `App.tsx` — surveyMode 상태 추가 ('general' | 'professional')
3. `SurveyIntro.tsx` — 버튼 3개: 일반(30) / 전문진단(40 강제선택)
4. `SurveyEngine.tsx` — 전문 모드: Forced Choice 카드 UI
5. `surveys.ts` — 7개 진단 전면 재작성 (성향 기반 30문항 + FC 40문항)

---

## 🔑 핵심 결정사항 (이어서 작업 시 반드시 유지)

1. **질문은 절대 갈등/포지션이 아닌 성향** — "어느 편이냐"가 아닌 "나는 이런 사람이다"
2. **강제선택 40문항** = 완전히 다른 방식, 중립 없음
3. **대화형 섹션 흐름** (section-intro → question → reaction) 유지
4. **수익화 없음** — 결과 다운로드 기능만
5. Vercel 토큰: Claude 메모리(`project_vercel_token.md`)에 보관 — 저장소에 커밋 금지

---

## 📁 주요 수정 파일

- `src/types.ts` — SurveySection 추가됨, ForcedChoicePair 추가 예정
- `src/data/surveys.ts` — 섹션 데이터 + 학술 문항 추가됨, 전면 재작성 예정
- `src/components/SurveyEngine.tsx` — 대화형 흐름 구현됨, Forced Choice 추가 예정
- `src/components/SurveyIntro.tsx` — 버튼 2개 구현됨, 3개로 업데이트 예정
- `src/components/SurveyResults.tsx` — 학술 분석 블록 추가됨

---

## ⚠️ 주의사항

- `surveys.ts`의 기존 personaData.ts 페르소나 9개는 유지 (축 방향만 바뀜)
- sections 배열 구조 건드리지 말 것 (SurveyEngine이 의존)
- build 전 반드시 `npm run build`로 검증
