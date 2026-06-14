/**
 * 21일 신앙 실천 챌린지 코스
 * 진단 결과(성향)에 따라 맞춤 처방되며, 매일 한 걸음씩 "스스로 실천하는 신앙"으로 인도한다.
 * 콘텐츠는 천성경·참부모님 말씀의 정신을 자체 요약한 것으로, 직접 인용은 최소화한다.
 */

export interface ChallengeDay {
  day: number;       // 1-based
  title: string;     // 그날의 주제
  action: string;    // 오늘의 실천 과제 (구체적 행동)
  prayer: string;    // 오늘의 기도 제목
}

export interface ChallengeCourse {
  id: string;
  title: string;
  emoji: string;
  theme: string;          // 핵심 주제 태그
  axis: string;           // 연결된 진단 축
  duration: number;       // 일수
  summary: string;        // 한 줄 소개
  forPersona: string;     // 어떤 성향에게 권하는지
  days: ChallengeDay[];
}

// ─── 1. 기도 21일 (심정영성) ─────────────────────────────────────────────
const prayerDays: ChallengeDay[] = [
  { day: 1,  title: '기도의 자리 정하기', action: '집 안에 나만의 기도 자리를 정하고 3분간 머문다.', prayer: '하늘부모님, 매일 당신을 만나는 이 자리를 거룩하게 지키게 하소서.' },
  { day: 2,  title: '심정으로 부르기', action: '눈을 감고 "하늘부모님" 한 단어만 천천히 열 번 부른다.', prayer: '형식이 아니라 심정으로 당신께 다가가게 하소서.' },
  { day: 3,  title: '감사 세 가지', action: '오늘 감사한 일 세 가지를 소리 내어 기도로 올린다.', prayer: '작은 것에도 감사할 줄 아는 마음을 주소서.' },
  { day: 4,  title: '하늘의 심정 느끼기', action: '5분간 침묵하며 하늘부모님의 마음을 헤아려 본다.', prayer: '당신의 기쁨과 슬픔을 내 심정으로 느끼게 하소서.' },
  { day: 5,  title: '가족을 위한 기도', action: '가족 한 사람의 이름을 부르며 축복 기도를 드린다.', prayer: '내 가정이 참사랑으로 하나 되게 하소서.' },
  { day: 6,  title: '회개의 시간', action: '오늘 부족했던 한 가지를 떠올리고 정직하게 회개한다.', prayer: '나를 비추어 새롭게 출발할 용기를 주소서.' },
  { day: 7,  title: '한 주를 봉헌', action: '지난 한 주를 돌아보며 봉헌 기도를 드린다.', prayer: '내 일주일의 정성을 받아 주소서.' },
  { day: 8,  title: '새벽(또는 아침) 기도', action: '평소보다 10분 일찍 일어나 하루를 기도로 연다.', prayer: '하루의 첫 시간을 당신께 드리게 하소서.' },
  { day: 9,  title: '이웃을 위한 중보', action: '도움이 필요한 이웃 한 사람을 위해 기도한다.', prayer: '내 기도가 누군가의 위로가 되게 하소서.' },
  { day: 10, title: '눈물의 기도', action: '하늘의 사정을 떠올리며 진심으로 마음을 쏟아 기도한다.', prayer: '메마른 신앙에 눈물의 은혜를 부어 주소서.' },
  { day: 11, title: '기도 후 정성 한 가지', action: '기도한 내용을 작은 실천 하나로 옮긴다.', prayer: '기도가 삶이 되게 하소서.' },
  { day: 12, title: '공동체를 위한 기도', action: '내가 속한 교회·공동체의 부흥을 위해 기도한다.', prayer: '공동체가 하늘의 뜻 안에서 하나 되게 하소서.' },
  { day: 13, title: '참부모님을 위한 기도', action: '참부모님의 노고를 기억하며 효정의 기도를 드린다.', prayer: '효정의 자녀로 살아가게 하소서.' },
  { day: 14, title: '두 주의 결실', action: '14일간의 변화를 돌아보며 감사 기도를 올린다.', prayer: '꾸준함의 은혜에 감사드립니다.' },
  { day: 15, title: '응답을 기다리는 기도', action: '조급함을 내려놓고 하늘의 때를 신뢰하며 기도한다.', prayer: '당신의 때를 믿고 기다리게 하소서.' },
  { day: 16, title: '민족과 세계', action: '한반도와 세계 평화를 위해 기도한다.', prayer: '하나님 아래 한 가족의 세계를 이루어 주소서.' },
  { day: 17, title: '침묵 속의 임재', action: '아무 말 없이 10분간 하늘의 임재 안에 머문다.', prayer: '말보다 깊은 침묵으로 당신을 만나게 하소서.' },
  { day: 18, title: '축복가정의 사명', action: '내 가정의 공적 사명을 떠올리며 결단 기도를 드린다.', prayer: '내 가정이 천국의 씨앗이 되게 하소서.' },
  { day: 19, title: '용서의 기도', action: '마음에 걸리는 한 사람을 위해 용서의 기도를 드린다.', prayer: '용서함으로 내가 먼저 자유롭게 하소서.' },
  { day: 20, title: '비전의 기도', action: '1년 뒤 되고 싶은 신앙의 모습을 그리며 기도한다.', prayer: '제 신앙의 길을 인도해 주소서.' },
  { day: 21, title: '기도하는 사람으로', action: '앞으로도 매일 기도하겠다는 결단을 봉헌한다.', prayer: '기도가 호흡이 되는 삶을 살게 하소서.' },
];

// ─── 2. 훈독 21일 (말씀체휼) ─────────────────────────────────────────────
const hoondokDays: ChallengeDay[] = [
  { day: 1,  title: '말씀 앞에 앉기', action: '오늘의 훈독 말씀을 소리 내어 두 번 읽는다.', prayer: '말씀이 살아 제 마음에 임하게 하소서.' },
  { day: 2,  title: '한 구절 필사', action: '마음에 닿은 한 구절을 손으로 적는다.', prayer: '쓰면서 말씀이 새겨지게 하소서.' },
  { day: 3,  title: '오늘의 단어', action: '말씀에서 핵심 단어 하나를 골라 하루 종일 묵상한다.', prayer: '한 단어로 하루를 살게 하소서.' },
  { day: 4,  title: '내 삶에 적용', action: '말씀을 오늘 내 삶의 한 장면에 적용해 본다.', prayer: '말씀이 지식이 아니라 삶이 되게 하소서.' },
  { day: 5,  title: '나눔 한 사람', action: '오늘 읽은 말씀을 가족이나 식구 한 명과 나눈다.', prayer: '받은 은혜를 흘려보내게 하소서.' },
  { day: 6,  title: '질문하며 읽기', action: '말씀에 "왜?"라는 질문을 던지며 깊이 읽는다.', prayer: '원리의 깊이를 깨닫게 하소서.' },
  { day: 7,  title: '한 주의 말씀 정리', action: '이번 주 가장 은혜로웠던 말씀을 다시 읽는다.', prayer: '말씀의 결실을 거두게 하소서.' },
  { day: 8,  title: '창조의 마음', action: '창조원리의 정신을 떠올리며 자연 속 하늘을 느낀다.', prayer: '창조의 기쁨에 동참하게 하소서.' },
  { day: 9,  title: '탕감의 길', action: '탕감복귀의 의미를 묵상하며 내 책임분담을 점검한다.', prayer: '제 몫의 책임을 다하게 하소서.' },
  { day: 10, title: '심정의 신학', action: '"심정"의 정의를 묵상하고 오늘 한 번 심정으로 행한다.', prayer: '하늘의 심정을 닮아가게 하소서.' },
  { day: 11, title: '소리 내어 훈독', action: '말씀을 또박또박 낭독하며 가족과 훈독회를 연다.', prayer: '우리 집이 말씀의 제단이 되게 하소서.' },
  { day: 12, title: '말씀 암송', action: '짧은 한 구절을 외워 하루 동안 되뇐다.', prayer: '말씀이 마음에 머물게 하소서.' },
  { day: 13, title: '참부모님의 생애', action: '참부모님 노정의 한 장면을 떠올리며 묵상한다.', prayer: '그 사랑의 길을 따라 걷게 하소서.' },
  { day: 14, title: '두 주의 체휼', action: '14일간 가장 변화된 한 가지를 적는다.', prayer: '말씀으로 변화된 저를 감사드립니다.' },
  { day: 15, title: '평화의 메시지', action: '평화경의 정신으로 오늘 평화의 말 한마디를 건넨다.', prayer: '평화를 짓는 사람이 되게 하소서.' },
  { day: 16, title: '말씀과 침묵', action: '읽은 뒤 5분간 침묵하며 말씀이 가라앉기를 기다린다.', prayer: '들음에서 깨달음으로 나아가게 하소서.' },
  { day: 17, title: '시대적 해석', action: '오늘의 말씀을 지금 내 현실에 비추어 해석해 본다.', prayer: '오늘을 위한 말씀으로 듣게 하소서.' },
  { day: 18, title: '말씀으로 결단', action: '말씀이 요구하는 한 가지 변화를 결단하고 실행한다.', prayer: '들은 대로 행하는 자가 되게 하소서.' },
  { day: 19, title: '감사로 읽기', action: '말씀을 받을 수 있음에 감사하며 훈독한다.', prayer: '말씀의 은혜에 감사드립니다.' },
  { day: 20, title: '나의 훈독 노트', action: '21일간의 깨달음을 한 페이지로 정리한다.', prayer: '제 신앙의 기록을 받아 주소서.' },
  { day: 21, title: '훈독하는 사람으로', action: '매일 훈독을 이어가겠다는 결단을 봉헌한다.', prayer: '말씀과 동행하는 삶을 살게 하소서.' },
];

// ─── 3. 참사랑 실천 21일 (실천자유·초종교평화) ──────────────────────────
const loveDays: ChallengeDay[] = [
  { day: 1,  title: '먼저 인사', action: '오늘 만나는 사람에게 내가 먼저 따뜻하게 인사한다.', prayer: '참사랑의 첫걸음을 떼게 하소서.' },
  { day: 2,  title: '이름 불러주기', action: '가족이나 동료의 이름을 정성껏 한 번 더 불러준다.', prayer: '한 사람을 귀하게 여기게 하소서.' },
  { day: 3,  title: '경청 10분', action: '누군가의 이야기를 끊지 않고 10분간 들어준다.', prayer: '듣는 사랑을 배우게 하소서.' },
  { day: 4,  title: '말없는 봉사', action: '티 내지 않고 작은 일 하나를 도와준다.', prayer: '주고도 잊는 사랑을 실천하게 하소서.' },
  { day: 5,  title: '감사 표현', action: '평소 고마웠던 사람에게 감사를 직접 전한다.', prayer: '사랑은 표현될 때 완성됨을 알게 하소서.' },
  { day: 6,  title: '용서 한 걸음', action: '미워했던 마음 하나를 내려놓기로 결심한다.', prayer: '용서로 마음의 벽을 허물게 하소서.' },
  { day: 7,  title: '가정의 사랑', action: '가족과 함께 식사하며 진심 어린 대화를 나눈다.', prayer: '우리 가정에 참사랑이 흐르게 하소서.' },
  { day: 8,  title: '낮은 자리', action: '오늘 한 번 나를 낮추고 상대를 높인다.', prayer: '겸손으로 사랑을 담게 하소서.' },
  { day: 9,  title: '나눔 실천', action: '가진 것 일부를 필요한 곳에 나눈다.', prayer: '나눔으로 하늘의 마음을 닮게 하소서.' },
  { day: 10, title: '위하여 살기', action: '오늘 하루 한 가지를 "남을 위해" 선택한다.', prayer: '위하여 사는 삶의 기쁨을 알게 하소서.' },
  { day: 11, title: '칭찬 한마디', action: '주변 사람의 장점을 찾아 진심으로 칭찬한다.', prayer: '사람 안의 하늘을 보게 하소서.' },
  { day: 12, title: '약속 지키기', action: '작은 약속이라도 반드시 지킨다.', prayer: '신뢰로 사랑을 쌓게 하소서.' },
  { day: 13, title: '이웃에게로', action: '이웃이나 동료에게 먼저 안부를 묻는다.', prayer: '사랑의 울타리를 넓히게 하소서.' },
  { day: 14, title: '두 주의 사랑', action: '14일간 가장 따뜻했던 순간을 적는다.', prayer: '사랑으로 변화된 저를 감사드립니다.' },
  { day: 15, title: '화해의 손길', action: '서먹했던 관계에 먼저 손을 내민다.', prayer: '화해를 짓는 자가 되게 하소서.' },
  { day: 16, title: '종족을 향해', action: '내 가문·친척 한 사람을 위해 사랑을 실천한다.', prayer: '종족메시아의 사명을 살게 하소서.' },
  { day: 17, title: '말의 온도', action: '오늘 하루 부드럽고 따뜻한 말만 쓴다.', prayer: '제 말이 사람을 살리게 하소서.' },
  { day: 18, title: '초종교의 마음', action: '다른 신앙·배경의 사람을 편견 없이 존중한다.', prayer: '국경과 종교를 넘는 사랑을 품게 하소서.' },
  { day: 19, title: '희생의 기쁨', action: '나의 편안함을 한 번 양보한다.', prayer: '희생이 곧 사랑임을 알게 하소서.' },
  { day: 20, title: '사랑의 편지', action: '소중한 사람에게 짧은 손편지를 쓴다.', prayer: '마음을 전하는 용기를 주소서.' },
  { day: 21, title: '참사랑의 실체로', action: '앞으로도 참사랑을 실천하겠다는 결단을 봉헌한다.', prayer: '참사랑의 실체가 되게 하소서.' },
];

// ─── 4. 효정 21일 (참부모신학·이상가정) ─────────────────────────────────
const hyojeongDays: ChallengeDay[] = [
  { day: 1,  title: '효정의 시작', action: '하늘부모님을 부모로 모시는 마음으로 하루를 연다.', prayer: '효정의 자녀로 살게 하소서.' },
  { day: 2,  title: '부모님께 안부', action: '육신의 부모님(또는 어른)께 안부를 전한다.', prayer: '효의 정성을 회복하게 하소서.' },
  { day: 3,  title: '하늘을 기쁘게', action: '오늘 하늘부모님을 기쁘게 할 한 가지를 행한다.', prayer: '당신의 기쁨이 제 기쁨 되게 하소서.' },
  { day: 4,  title: '참부모님 기억', action: '참부모님의 사랑을 떠올리며 감사의 시간을 갖는다.', prayer: '그 사랑의 빚을 기억하게 하소서.' },
  { day: 5,  title: '부부의 효정', action: '배우자(또는 가족)에게 사랑을 한 번 더 표현한다.', prayer: '가정에서 효정을 실천하게 하소서.' },
  { day: 6,  title: '순결한 마음', action: '마음과 시선을 정결히 지키기로 결단한다.', prayer: '순결로 하늘 앞에 서게 하소서.' },
  { day: 7,  title: '가정의 제단', action: '가족과 함께 짧은 경배·기도의 시간을 갖는다.', prayer: '우리 가정이 천국의 기초가 되게 하소서.' },
  { day: 8,  title: '효의 실천', action: '부모·어른을 위해 구체적 섬김 하나를 행한다.', prayer: '섬김으로 효를 완성하게 하소서.' },
  { day: 9,  title: '심정의 상속', action: '하늘부모님의 심정을 닮으려 오늘 한 번 인내한다.', prayer: '심정을 상속받는 자녀 되게 하소서.' },
  { day: 10, title: '자녀를 축복', action: '자녀(또는 다음 세대)를 위해 축복 기도를 드린다.', prayer: '삼대가 함께 하늘을 모시게 하소서.' },
  { day: 11, title: '화목한 형제', action: '형제자매(또는 식구)와의 관계를 따뜻하게 한다.', prayer: '형제가 하나 되는 가정 되게 하소서.' },
  { day: 12, title: '참된 효자녀', action: '내가 하늘의 효자녀로서 할 일을 하나 정해 실천한다.', prayer: '효정으로 보답하게 하소서.' },
  { day: 13, title: '가정의 비전', action: '우리 가정이 나아갈 신앙의 비전을 함께 나눈다.', prayer: '이상가정의 꿈을 품게 하소서.' },
  { day: 14, title: '두 주의 효정', action: '14일간 가정에 일어난 변화를 적는다.', prayer: '가정의 회복을 감사드립니다.' },
  { day: 15, title: '조상을 기억', action: '조상·믿음의 선배를 기억하며 감사한다.', prayer: '받은 은혜의 뿌리를 기억하게 하소서.' },
  { day: 16, title: '공적 사명', action: '내 가정의 공적 사명을 위해 한 걸음 행한다.', prayer: '가정이 세상을 위해 살게 하소서.' },
  { day: 17, title: '효정의 언어', action: '가족에게 비난 대신 격려의 말을 건넨다.', prayer: '말로 가정을 세우게 하소서.' },
  { day: 18, title: '참가정의 모범', action: '이웃에게 본이 되는 가정의 모습 하나를 실천한다.', prayer: '우리 가정이 빛이 되게 하소서.' },
  { day: 19, title: '하늘의 자녀', action: '나는 하늘부모님의 자녀임을 선포하며 당당히 산다.', prayer: '자녀의 권위와 사랑을 회복하게 하소서.' },
  { day: 20, title: '가정 봉헌', action: '우리 가정을 하늘 앞에 다시 봉헌하는 기도를 드린다.', prayer: '우리 가정을 받아 주소서.' },
  { day: 21, title: '효정의 사람으로', action: '효정의 삶을 이어가겠다는 결단을 봉헌한다.', prayer: '효정으로 천국을 이루게 하소서.' },
];

export const CHALLENGES: ChallengeCourse[] = [
  {
    id: 'prayer-21',
    title: '기도 21일 여정',
    emoji: '🙏',
    theme: '기도',
    axis: '심정영성',
    duration: 21,
    summary: '매일 하늘부모님과 만나는 기도의 습관을 21일에 걸쳐 세웁니다.',
    forPersona: '하늘과 더 깊이 연결되고 싶은 분, 내향 묵상형',
    days: prayerDays,
  },
  {
    id: 'hoondok-21',
    title: '훈독 21일 여정',
    emoji: '📖',
    theme: '말씀체휼',
    axis: '말씀체휼',
    duration: 21,
    summary: '말씀을 읽는 것을 넘어 삶으로 체휼하는 21일 훈독 습관.',
    forPersona: '말씀을 삶으로 녹여내고 싶은 분, 원리·논리형',
    days: hoondokDays,
  },
  {
    id: 'love-21',
    title: '참사랑 실천 21일',
    emoji: '💝',
    theme: '참사랑',
    axis: '실천자유',
    duration: 21,
    summary: '위하여 사는 참사랑을 매일 한 걸음씩 실천하는 21일.',
    forPersona: '신앙을 세상 속 실천으로 잇고 싶은 분, 세상 참여형',
    days: loveDays,
  },
  {
    id: 'hyojeong-21',
    title: '효정 21일 여정',
    emoji: '🏡',
    theme: '효정',
    axis: '이상가정',
    duration: 21,
    summary: '하늘부모님과 가정을 향한 효정을 회복하는 21일.',
    forPersona: '가정과 참부모신학을 중심에 두는 분, 관계 교제형',
    days: hyojeongDays,
  },
];

export const getChallengeById = (id: string): ChallengeCourse | undefined =>
  CHALLENGES.find(c => c.id === id);

/** 진단 결과(평균 점수/축 성향)에 맞춰 챌린지를 추천 */
export const recommendChallenge = (surveyId?: string): ChallengeCourse => {
  const map: Record<string, string> = {
    'survey-spirituality': 'prayer-21',
    'survey-word': 'hoondok-21',
    'survey-theology': 'hyojeong-21',
    'survey-family': 'hyojeong-21',
    'survey-freedom': 'love-21',
    'survey-peace': 'love-21',
    'survey-salvation': 'hoondok-21',
  };
  const id = (surveyId && map[surveyId]) || 'prayer-21';
  return getChallengeById(id) ?? CHALLENGES[0];
};

// ─── 챌린지 진행 상태 (localStorage) ────────────────────────────────────
export interface ChallengeProgress {
  challengeId: string;
  startedAt: number;
  completedDays: number[];   // 완료한 day 번호(1-based)
  lastCompletedDate?: string;
}

const CHALLENGE_KEY = 'sinang_inside_challenge';

export const getActiveChallenge = (): ChallengeProgress | null => {
  try {
    const raw = localStorage.getItem(CHALLENGE_KEY);
    return raw ? (JSON.parse(raw) as ChallengeProgress) : null;
  } catch {
    return null;
  }
};

export const startChallenge = (challengeId: string): ChallengeProgress => {
  const progress: ChallengeProgress = { challengeId, startedAt: Date.now(), completedDays: [] };
  localStorage.setItem(CHALLENGE_KEY, JSON.stringify(progress));
  return progress;
};

/** 다음 미완료 day 번호 (없으면 0 = 완주) */
export const getCurrentDay = (progress: ChallengeProgress, total: number): number => {
  for (let d = 1; d <= total; d++) {
    if (!progress.completedDays.includes(d)) return d;
  }
  return 0;
};

export const completeChallengeDay = (day: number): ChallengeProgress | null => {
  const progress = getActiveChallenge();
  if (!progress) return null;
  if (!progress.completedDays.includes(day)) {
    progress.completedDays = [...progress.completedDays, day].sort((a, b) => a - b);
  }
  progress.lastCompletedDate = dateKey();
  localStorage.setItem(CHALLENGE_KEY, JSON.stringify(progress));
  return progress;
};

// dateKey 재사용 (practiceStorage와 동일 규칙)
const dateKey = (d: Date = new Date()): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
