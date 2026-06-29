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

## ✅ 2026-06-18 추가 (파일럿: 심정영성 7축 재설계 완본)

뻠뻠 결정: ① 파일럿 1개(심정영성) 먼저 → 톤 검수 후 6개 복제. ② 학술 12문항 모드 폐지, 전문 FC 40으로 대체.

**인프라(7개 진단 공통, 재사용 가능):**
- [x] `types.ts` — `SurveyMode = 'general' | 'academic' | 'professional'` 추가
- [x] `scoringEngine.ts` — `calculateScores(survey, answers, mode)` mode 인자 추가. professional이면 `professionalQuestions` 기준 채점
- [x] `SurveyEngine.tsx` — `modeLimit`(숫자) → `mode`(SurveyMode) prop 교체. `getModeData()`로 모드별 문항/섹션 선택. **레거시 일반모드 섹션 버그 수정**(이전엔 6문항인데 학술 포함 6섹션 전부 순회 → 깨짐, 이제 앞 3섹션만). FC 모드 인트로 힌트("A·B 중 선택") + 리액션 텍스트 분기
- [x] `App.tsx` — `modeLimit` state → `surveyMode` state
- [x] `SurveyIntro.tsx` — `survey.professionalQuestions` 있으면 [일반30 / 전문FC40] 버튼, 없으면 레거시 [일반6 / 학술12] 버튼 (레거시 6개 진단 안전 보존)
- [x] `SurveyResults.tsx` — `mode` prop 추가, 채점에 전달. 학술 분석 블록을 `mode==='academic'`일 때만 노출(FC 모드 오작동 방지)

**심정영성 콘텐츠 (surveys.ts):**
- [x] 축 재설계: **내향 묵상형(낮음/1) ↔ 외향 표현형(높음/5)**. 모든 문항 '동의=외향'으로 일관 키잉(기존 Q1~4 내향/Q5~6 외향 혼재 버그 해결)
- [x] 6 facet 카테고리: 기도방식·예배체험·에너지충전·심정표현·신앙성장·영성나눔
- [x] 일반 30문항(facet당 5, Likert) + 6 섹션
- [x] 전문 FC 40문항(강제선택 'V' 타입, 좌=내향/우=외향) + 8 섹션(`professionalSections_spirituality`)
- [x] `npm run build` 통과(12.47s, 신규 에러 0). tsc도 내 수정 파일 클린(SurveyEngine motion variants는 기존 에러)

⚠️ **페르소나는 기존 9개 유지**(HANDOFF 원칙). 매핑 방향 검증 완료. 단, 일부 페르소나 **이름/설명이 옛 '수직 vs 수평' 프레임** 잔존 → 추후 성향 언어로 다듬으면 더 좋음(선택).

---

## ✅ 2026-06-18 추가 (나머지 6개 진단 전면 재설계 완료 — 7개 전부 완성)

"알아서 해라" 지시로 파일럿 검증 후 나머지 6개까지 동일 패턴으로 재설계 완료. **인프라 코드는 추가 변경 없이 그대로 재사용**(데이터만 교체).

모든 진단 방향 규칙 통일: **personaData idx0=전통/규율/내부 극, idx8=실천/관계/자유/세상 극 → avg 높을수록 idx8 극**. 모든 문항을 '동의(5)=idx8 극'으로 일관 키잉.

| 진단 | 축 (낮음 ↔ 높음=동의) | 6 facet 카테고리 |
|------|------|------|
| 심정영성 | 내향 묵상형 ↔ 외향 표현형 | 기도방식·예배체험·에너지충전·심정표현·신앙성장·영성나눔 |
| 말씀체휼 | 원리·논리형 ↔ 경험·직관형 | 말씀이해·훈독방식·진리관·적용방식·의문해소·전달방식 |
| 참부모신학 | 개인 수련형 ↔ 관계 교제형 | 신앙수행·심정상속·헌신방식·신앙배움·위로원천·사명실천 |
| 구원섭리 | 구조·규율형 ↔ 자유·창의형 | 구원관·신앙태도·정성방식·영성표현·고난관·신앙리듬 |
| 실천자유 | 질서 순응형 ↔ 자율 주체형 | 의사결정·권위관·실천방식·책임소재·주도성·변화태도 |
| 초종교평화 | 내부 집중형 ↔ 세상 참여형 | 관심초점·타종교관·활동무대·정체성표현·사명관·관계범위 |
| 이상가정 | 규칙·확신형 ↔ 포용·통합형 | 가정운영·자녀양육·갈등대처·신앙전수·분별관·가정비전 |

- [x] 7개 진단 각각 일반 30문항(Likert) + 6 섹션 + 전문 FC 40문항('V') + 8 섹션
- [x] 정합성 검증: 일반 210문항(7×30), FC 280문항(7×40), 전문 연결 7/7
- [x] 미사용 `academicSections` 정의 제거(학술 모드 폐지 완료)
- [x] `npm run build` 통과(17.97s, 신규 에러 0) + tsc 내 수정 파일 클린
- [x] ✅ **배포 완료** — 2026-06-18, 뻠뻠 승인 후 `node deploy-sinang-inside.js`로 프로덕션 배포. https://sinang-inside.vercel.app (deploy ID dpl_9zS8s4AMetf77Ku4aMMVzzGH23kB, READY)
  - ⚠️ SurveyResults의 학술분석 블록(mode==='academic')은 이제 호출 안 됨(게이팅됨, 무해). 레거시 general(6)/academic 엔진 경로도 dead-but-harmless

## ✅ 2026-06-18 추가 (페르소나 63종 전면 리라이트 + 재배포)

"ㄱㄱㄱ" 지시로 personaData.ts 전체를 새 성향 축 언어로 리라이트:
- [x] 7진단 × 9종 = **63개 페르소나** 전면 재작성. 각 진단을 9단계 스펙트럼(idx0=한쪽 극 → idx4=균형/통합 → idx8=반대 극)으로 구성
- [x] 옛 '수직 vs 수평/전통 vs 실천' 프레임 제거 → 각 축의 성향 언어로 통일 (이름·headline·desc·strengths·weaknesses·advice 전부)
- [x] 매핑 방향 유지: idx0=낮은 avg 극, idx8=높은 avg 극 (getResultForSurvey 로직 그대로). worstMatch=8-idx(반대극), bestMatch=idx3/4(균형)도 자연스럽게 작동
- [x] desc를 옛 ~500자에서 2~3문장으로 간결화(가독성 ↑), 모든 advice는 반대 극의 강점으로 성장 유도
- [x] 빌드 통과(20.67s) + 정합성(64 name = 인터페이스1+63) + tsc 클린
- [x] ✅ **재배포 완료** — https://sinang-inside.vercel.app (deploy ID dpl_54TwJdinj15pMvkD3ZdZCBzeHaVY)

→ **sinang-inside 7축 재설계 프로젝트 사실상 완료.** 이후는 실사용 피드백 기반 문항/페르소나 미세 조정.

---

## ✅ 2026-06-18 추가 (밸런스 게임도 새 축으로 일관화 + 재배포)

뻠뻠 지적: 밸런스 게임(BalanceGame)이 메인 진단 재설계에서 누락되어 옛 축("수직 기도 vs 수평 실천" 등) 잔존.
- [x] `balanceGameData.ts` 전면 교체 — 카테고리 7개 설명 + 30개 딜레마를 새 성향 축으로 재작성(갈등→성향, 정답 없음 톤)
- [x] 2축 메타모델로 재해석: **V/H = 내면 지향 ↔ 관계·실천 지향**(심정영성·참부모신학·초종교평화 13문항), **T/M = 원칙·규율 ↔ 자유·직관**(말씀체휼·구원섭리·실천자유·이상가정 17문항). 각 카테고리가 자기 축의 두 타입만 쓰도록 정리(기존엔 혼재)
- [x] `BalanceGame.tsx` — 인트로 문구·결과 프로필 9종·결과 축 라벨·공유 문구 전부 새 축 언어로 교체
- [x] 빌드 통과 + tsc 클린 + 타입 분포 검증(V13/H13/T17/M17)
- [x] ✅ **재배포 완료** — https://sinang-inside.vercel.app (deploy ID dpl_4DceE6grCfAeDqRk2f2KcgksBJQH, HTTP 200)

---

## 🗄️ (참고) 원래 1단계 계획 — 7개 진단 축 재설계 (갈등 → 성향)
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
