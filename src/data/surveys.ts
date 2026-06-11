import { SurveyConfig, SurveyResultContent, AnswerData } from '../types';
import { personaDirectoryData } from './personaData';

function getResultForSurvey(surveyId: string, avg: number): SurveyResultContent {
  const list = personaDirectoryData[surveyId];
  if (!list || list.length === 0) {
    throw new Error(`No personas found for survey ${surveyId}`);
  }

  // 0% (완전 좌측/전통) ~ 100% (완전 우측/현대)를 9등분 매핑 (인덱스 0 ~ 8)
  const idx = Math.min(8, Math.max(0, Math.floor(avg / 11.12)));
  const item = list[idx] || list[list.length - 1];

  // 대립 관계에 있는 반대성향의 유형을 Worst Match로 선정
  const worstIdx = 8 - idx;
  const worstItem = list[worstIdx];

  // 중간(균형) 성향 혹은 보완적 성향을 Best Match로 선정
  const bestIdx = idx === 4 ? 3 : 4;
  const bestItem = list[bestIdx];

  return {
    persona: item.name,
    emoji: item.emoji,
    hashtags: item.tags,
    headline: item.headline,
    description: item.desc,
    strengths: item.strengths,
    weaknesses: item.weaknesses,
    advice: item.advice,
    workManual: [
      "자율성과 영적 주체성을 존중해 주세요.",
      "수직적 말씀 보존과 수평적 참사랑 실천의 균형을 이끌어 줍니다."
    ],
    worstMatch: {
      type: worstItem ? worstItem.name : "보완적 신앙인",
      description: "나와 상반된 가치에 치우친 신앙을 가지고 있어 갈등이 생길 수 있습니다.",
      handling: "그가 중요시하는 신앙의 전통 혹은 실천의 가치를 먼저 깊이 인정해 주세요."
    },
    bestMatch: {
      type: bestItem ? bestItem.name : "심정적 동반자",
      emoji: bestItem ? bestItem.emoji : "🤝",
      description: "서로의 부족한 영성과 실천력을 채워주는 뜻의 동반자입니다."
    },
    leadershipFit: []
  };
}

export const surveys: SurveyConfig[] = [
  {
    id: "survey-spirituality",
    name: "심정영성 진단",
    title: "심정영성 진단 (Shimjeong & Spirituality)",
    subtitle: "내적 기도 정성과 수평적 참사랑 실천 사이의 심정적 조화 진단",
    description: "하늘부모님과의 수직적 기도와 개인적 영성을 중시하는지, 혹은 이웃과 사회를 향한 수평적 나눔과 봉사활동을 신앙의 본질로 여기는지 진단합니다.",
    color: "#0d5c3a",
    icon: "🕊️",
    categories: ["기도생활", "예배체휼", "심정공명", "개인수련", "공동체나눔", "참사랑실천"],
    questions: [
      { c: 1, t: 'L', q: "나는 개인적인 기도로 하늘의 아픈 심정을 체휼하기 위해 눈물 흘려 깊이 기도하는 시간이 무엇보다 중요하다." },
      { c: 2, t: 'L', q: "예배에서 공적인 세련됨이나 친교 활동보다, 내면의 종적인 심정적 공명이 더 본질적이다." },
      { c: 3, t: 'L', q: "내 신앙생활의 동력은 교단 행사 참여보다는 하늘부모님의 임재를 가슴으로 실감할 때 온다." },
      { c: 4, t: 'L', q: "나의 영적 성장은 공동체 모임이나 대외 활동보다 홀로 조용히 훈독하고 기도할 때 주로 이루어진다." },
      { c: 5, t: 'L', q: "참사랑은 골방의 조용한 기도보다 식구들과의 수평적 나눔과 교제 속에서 더 생생하게 실체화된다." },
      { c: 6, t: 'L', q: "하늘부모님을 사랑하는 증거는 보이지 않는 기도보다 세상 속에서 참사랑을 실천하는 구체적 행동에 있다." }
    ],
    getResultContent: (avg) => getResultForSurvey("survey-spirituality", avg)
  },
  {
    id: "survey-word",
    name: "말씀체휼 진단",
    title: "말씀체휼 진단 (Word Interpretation)",
    subtitle: "경전 말씀의 오리지널 자구수호와 시대 맥락적 유연한 해석의 조화 진단",
    description: "원리강론과 말씀선집의 자구적 보존과 원칙을 철저히 지키려 하는지, 혹은 시대 변화에 맞춰 창의적이고 실천적으로 해석하려 하는지 진단합니다.",
    color: "amber",
    icon: "📖",
    categories: ["자구수호", "경전주의", "전통훈독", "시대맥락", "창의해석", "삶의체휼"],
    questions: [
      { c: 1, t: 'L', q: "원리강론과 참부모님 말씀선집의 단어 하나하나에는 하늘의 신성한 계시가 담겨 있으므로 자구 그대로 지켜야 한다." },
      { c: 2, t: 'L', q: "진리의 절대성은 시대가 변해도 타협될 수 없으며, 경전의 근본 원칙을 굳게 수호하는 것이 가장 중요하다." },
      { c: 3, t: 'L', q: "매일 아침 전통적인 법도에 따라 말씀경전을 훈독하는 예식 자체가 내 영성을 보존하는 핵심 기반이다." },
      { c: 4, t: 'L', q: "참부모님의 가르침은 고정된 문자가 아니며, 현시대의 과학적 사실과 인문학적 맥락에 맞춰 해석되어야 한다." },
      { c: 5, t: 'L', q: "경전의 본질적 심정을 상속하되, 오늘날 청년들이 공감할 수 있는 새로운 시대적 언어로 재해석해야 한다." },
      { c: 6, t: 'L', q: "말씀을 머리로 암기하고 교리를 논박하는 것보다, 삶 속에서 사랑의 실체로 체휼하는 것이 훨씬 본질적이다." }
    ],
    getResultContent: (avg) => getResultForSurvey("survey-word", avg)
  },
  {
    id: "survey-theology",
    name: "참부모신학 진단",
    title: "참부모신학 진단 (True Parents & Daughterology)",
    subtitle: "아버님 중심의 역사적 전통 노정과 어머니 중심의 점진적 계시 섭리관 진단",
    description: "참아버님 중심의 역사적 전통 보존에 신앙의 뼈대를 두는지, 혹은 살아계신 참어머니 한학자 총재 중심의 독생녀 계시와 천일국 신학에 무게를 두는지 진단합니다.",
    color: "blue",
    icon: "👑",
    categories: ["아버님전통", "성혼섭리관", "동반자위상", "독생녀계시", "참어머니권능", "천일국신학"],
    questions: [
      { c: 1, t: 'L', q: "가정연합 섭리의 역사적 정통성과 근본 뼈대는 참아버님의 구국구세 사상과 생전 가르침에 전적으로 기초한다." },
      { c: 2, t: 'L', q: "참부모님의 위상은 역사적 탕감복귀 과정을 거쳐 참아버님과 참어머니가 일체화되어 완성된 동반자 메시아이다." },
      { c: 3, t: 'L', q: "섭리 역사의 전개에서 아버님과 어머니의 성혼을 통한 참가정의 안착과 3대권의 상속이 신학의 기본이다." },
      { c: 4, t: 'L', q: "참어머니는 아버님의 협력자를 넘어, 무원죄의 독생녀로서 독자적인 영적 권능과 섭리적 계시를 지니고 계신다." },
      { c: 5, t: 'L', q: "현재와 미래의 천일국 안착 섭리는 살아계신 참어머니의 새로운 인도와 선포에 전적으로 발맞춰 나아가야 한다." },
      { c: 6, t: 'L', q: "참부모신학은 과거 신학을 넘어, 참어머니가 밝혀주시는 어머니 하나님(하늘어머니) 중심의 새로운 평화 신학으로 확장되어야 한다." }
    ],
    getResultContent: (avg) => getResultForSurvey("survey-theology", avg)
  },
  {
    id: "survey-salvation",
    name: "구원섭리 진단",
    title: "구원섭리 진단 (Indemnity vs Grace)",
    subtitle: "개인의 5% 책임분담/탕감조건과 참부모님의 축복/안착의 은사 밸런스 진단",
    description: "인간 책임분담과 고난을 통한 탕감 조건을 중시하는지, 혹은 참부모님이 승리해주신 천일국 시대의 축복과 은혜 중심의 안착 신앙을 지향하는지 진단합니다.",
    color: "violet",
    icon: "⚔️",
    categories: ["탕감조건", "책임분담", "개성완성", "혈통전환", "안착의은사", "해원상생"],
    questions: [
      { c: 1, t: 'L', q: "인간은 타락성을 벗고 구원에 이르기 위해 엄격한 정성과 고행, 제물적 탕감조건을 반드시 세워야 한다." },
      { c: 2, t: 'L', q: "하늘부모님이 다 해주시는 은혜보다, 인간 스스로 감당해야 할 5%의 책임분담을 철저히 완수하는 것이 구원의 핵심이다." },
      { c: 3, t: 'L', q: "고난과 시련을 기쁨으로 극복하며 개성을 완성해 나가는 개척자적 노력이 신앙의 본질이다." },
      { c: 4, t: 'L', q: "참부모님이 세워주신 축복결혼과 혈통전환의 은사는 인간의 조건보다 더 원천적인 구원의 동력이다." },
      { c: 5, t: 'L', q: "과거 탕감 시대의 고난 신앙보다는, 참부모님 승리로 도래한 천일국 시대의 은혜와 안착을 누리는 축제 신앙이 더 중요하다." },
      { c: 6, t: 'L', q: "우리는 정성과 의무감보다 참사랑의 은혜 안에서 마음의 원한을 풀고(해원) 기쁨과 자유를 누려야 한다." }
    ],
    getResultContent: (avg) => getResultForSurvey("survey-salvation", avg)
  },
  {
    id: "survey-freedom",
    name: "실천자유 진단",
    title: "실천자유 진단 (Authority & Liberty)",
    subtitle: "교회 질서/공직 지시 순응성과 개인 양심/자유의지의 분별 밸런스 진단",
    description: "공직의 질서와 지시에 절대 귀일하는 질서 지향형인지, 혹은 양심의 자유와 주체적인 자유의지로 창의적인 참사랑 실천을 선호하는지 진단합니다.",
    color: "emerald",
    icon: "🛡️",
    categories: ["절대복종", "귀일정신", "제도적법도", "양심의자유", "자유의지", "창의실천"],
    questions: [
      { c: 1, t: 'L', q: "지도층이나 교단의 결정은 하늘의 섭리적 명령이므로 주관적 생각 없이 순종(절대신앙)하는 것이 원칙이다." },
      { c: 2, t: 'L', q: "신앙 공동체의 질서와 통일성을 수호하기 위해, 사적인 자유보다 공적 중심에 완전히 귀일해야 한다." },
      { c: 3, t: 'L', q: "전통적인 제례 의식과 헌금, 공적 의무를 철저히 지키는 행위가 신앙생활의 가장 안전한 뼈대이다." },
      { c: 4, t: 'L', q: "신앙인은 맹목적인 복종보다 하늘이 주신 개개인의 양심과 도덕적 분별력을 우선시해야 한다." },
      { c: 5, t: 'L', q: "공직자나 리더의 지시보다 주체적인 자유의지와 분별을 통해 스스로 신앙적 실천을 결정하는 것이 본질이다." },
      { c: 6, t: 'L', q: "형식적인 예배와 전통 의식에 얽매이기보다, 개인의 은사와 시대 상황에 맞는 창의적인 실천 방식을 선호한다." }
    ],
    getResultContent: (avg) => getResultForSurvey("survey-freedom", avg)
  },
  {
    id: "survey-peace",
    name: "초종교평화 진단",
    title: "초종교평화 진단 (Solidarity & Interfaith)",
    subtitle: "교단 고유 정체성 수호/전도 지향성과 대외 초종교 평화 연대 밸런스 진단",
    description: "교단 고유의 교리와 원리 전도(복귀)에 전념하는지, 혹은 이웃 종단 및 사회 단체와 초종교적으로 연대하여 보편적 평화 운동에 집중하는지 진단합니다.",
    color: "rose",
    icon: "⛪",
    categories: ["교단우선", "정체성수호", "전도복귀", "타종교대화", "초종교연대", "평화운동"],
    questions: [
      { c: 1, t: 'L', q: "우리 교단 고유의 교리와 정체성은 다른 어떤 종교나 이념과도 구별되는 절대적 진리이므로 철저히 선을 그어야 한다." },
      { c: 2, t: 'L', q: "초종교적인 평화 운동보다 우리 고유의 원리와 사상을 강조하고 교단의 위상을 세우는 일이 먼저이다." },
      { c: 3, t: 'L', q: "신앙의 최고 미션은 기독교 신자나 타 종교인들을 설득하여 우리 교단으로 전도(복귀)시키는 것이다." },
      { c: 4, t: 'L', q: "타 종교나 기독교를 개종 대상으로만 보기보다, 그들이 가진 영적 가치를 존중하며 보편적으로 소통해야 한다." },
      { c: 5, t: 'L', q: "교리적 장벽을 넘어 타 교파 및 사회 단체와 초종교적으로 적극 연대하여 세상의 평화를 만드는 것이 섭리적으로 더 가치 있다." },
      { c: 6, t: 'L', q: "우리만의 폐쇄적인 신앙 공동체 구축보다, 세상을 하늘부모님 아래 하나의 대가족(One Family under God)으로 만드는 보편적 평화 운동에 집중해야 한다." }
    ],
    getResultContent: (avg) => getResultForSurvey("survey-peace", avg)
  },
  {
    id: "survey-family",
    name: "이상가정 진단",
    title: "이상가정 진단 (Family vs Providential Sacrifice)",
    subtitle: "3대권 참가정 이상 실현과 세계 섭리를 위한 공적 희생 제물 노정 진단",
    description: "내 가정의 3대권 완성(조부모-부모-자녀)과 청정한 순결 축복 상속을 중시하는지, 혹은 세계 복귀를 위해 가정을 넘어 공적 사명과 제물 생애에 헌신하는지 진단합니다.",
    color: "orange",
    icon: "🏠",
    categories: ["삼대권완성", "순결축복", "가정섭리", "공적생애", "제물적헌신", "섭리적희생"],
    questions: [
      { c: 1, t: 'L', q: "신앙의 제1 목표는 참가정을 모델 삼아 나의 3대권 가정(조부모-부모-자녀)의 참사랑과 이상을 완성하는 가정 중심 신앙이다." },
      { c: 2, t: 'L', q: "자녀들에게 참가정 순결 가치관을 교육하고 대대로 축복의 혈통을 계승하는 것이 가장 가치 있는 뜻의 성사이다." },
      { c: 3, t: 'L', q: "부부의 조화와 참가정적 사랑의 실체가 무너지면 공적인 선교와 섭리적 성과도 아무런 의미가 없다." },
      { c: 4, t: 'L', q: "하늘의 뜻을 위해 필요하다면 개인 가정의 편안함을 희생하고 공적 생애와 제물의 길을 걷는 것이 참된 신자이다." },
      { c: 5, t: 'L', q: "섭리적 긴급성이나 총동원 명령이 있을 때는 자녀 양육이나 가정사보다 공적인 미션을 성사시키는 데 먼저 투입되어야 한다." },
      { c: 6, t: 'L', q: "국가와 세계 섭리의 승리를 위해서라면, 조상들이 개척 시기에 보여준 희생적 헌신의 전통을 우리 가정도 계승해야 한다." }
    ],
    getResultContent: (avg) => getResultForSurvey("survey-family", avg)
  }
];
