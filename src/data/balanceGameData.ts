import { BalanceQuestion } from '../types';

// ── 카테고리 정의 ──
export type BalanceCategory = 'spirituality' | 'word' | 'theology' | 'salvation' | 'freedom' | 'peace' | 'family';

export const balanceCategoryLabels: Record<BalanceCategory, { emoji: string; name: string; desc: string }> = {
  spirituality: { emoji: '🕊️', name: '심정영성', desc: '수직 기도 vs 수평 실천' },
  word: { emoji: '📖', name: '말씀체휼', desc: '자구 보존 vs 시대 해석' },
  theology: { emoji: '👑', name: '참부모신학', desc: '아버님 정통 vs 어머니 안착' },
  salvation: { emoji: '⚔️', name: '구원섭리', desc: '탕감 조건 vs 은사 안착' },
  freedom: { emoji: '🛡️', name: '실천자유', desc: '공적 귀일 vs 양심 자율' },
  peace: { emoji: '⛪', name: '초종교평화', desc: '교단 정체성 vs 보편 연대' },
  family: { emoji: '🏠', name: '이상가정', desc: '가정 안착 vs 공적 헌신' },
};

export interface CategorizedBalanceQuestion extends BalanceQuestion {
  category: BalanceCategory;
}

export const balanceGameQuestions: CategorizedBalanceQuestion[] = [
  // ── 심정영성 (4문항) ──
  {
    id: 1, category: 'spirituality',
    question: "매일 아침 눈 뜨자마자 내가 먼저 향해야 하는 본질적인 곳은?",
    emoji: "🙏",
    options: [
      { text: "말씀 훈독과 조용한 명상 기도 정성", type: "V", desc: "하늘과의 1:1 수직적 심정 관계 정렬" },
      { text: "이웃에게 미소 지으며 봉사하는 현장", type: "H", desc: "세상 속 수평적 참사랑의 실체화" }
    ],
    reflection: "골방의 훈독은 내면의 등대를 켜고, 광장의 실천은 어둠 속 세상을 밝힙니다. 기도가 손발이 될 때 진정한 성화가 시작됩니다."
  },
  {
    id: 2, category: 'spirituality',
    question: "신앙인의 도덕적 정결함(성화)을 기르는 최적의 훈련은?",
    emoji: "🧘",
    options: [
      { text: "경배, 금식, 조용히 내 몸을 치는 고행 조건", type: "V", desc: "스스로를 정화하기 위한 탕감 훈련" },
      { text: "원수 같은 이웃의 발을 씻기고 용서하는 실천", type: "H", desc: "관계 속에서 뒹굴며 체휼하는 참사랑" }
    ],
    reflection: "나를 쳐서 복종시키는 탕감과, 타인을 살리는 참사랑의 만남이 성화의 지름길입니다."
  },
  {
    id: 3, category: 'spirituality',
    question: "신앙생활 중 깊은 번아웃에 빠졌을 때 나를 세우는 해법은?",
    emoji: "🩹",
    options: [
      { text: "금식과 경배 등 정성 조건을 더 엄격히 세운다", type: "V", desc: "탕감 조건으로 나태한 근성을 부수는 돌파" },
      { text: "참부모님 사랑의 찬송을 부르며 조용히 쉰다", type: "M", desc: "죄책감을 내려놓고 하늘의 자비에 안착" }
    ],
    reflection: "때로는 매서운 회개의 채찍이, 때로는 거저 주시는 위로의 품이 마음의 상처를 치유합니다."
  },
  {
    id: 4, category: 'spirituality',
    question: "하늘부모님의 가슴 아픈 눈물을 묵상할 때 더 공명되는 것은?",
    emoji: "💜",
    options: [
      { text: "타락한 인간을 보며 참아오신 아버지의 슬픈 역사", type: "V", desc: "역사적 탕감복귀의 비장한 심정 체휼" },
      { text: "자식을 품어주며 아픔을 삭이는 어머니의 자비", type: "M", desc: "무조건적 사랑으로 눈물 흘리는 어머니 심정" }
    ],
    reflection: "공의의 아픔과 자비의 아픔은 모두 하나님의 한없는 눈물이며, 우리는 둘 다 위로해 드려야 합니다."
  },

  // ── 말씀체휼 (4문항) ──
  {
    id: 5, category: 'word',
    question: "경전과 말씀선집의 난해한 구절을 대하는 나의 태도는?",
    emoji: "📖",
    options: [
      { text: "단어 하나 글자 그대로 원형대로 보존해야 한다", type: "T", desc: "타협 없는 오리지널 자구 절대 수호" },
      { text: "시대 맥락에 맞춰 창의적으로 재해석해야 한다", type: "M", desc: "점진적 계시와 상황적 유연한 번역" }
    ],
    reflection: "문자를 지키는 것은 진리의 순수성을 보존하고, 시대에 맞게 번역하는 것은 말씀의 보편적 생명력을 살립니다."
  },
  {
    id: 6, category: 'word',
    question: "원리강론 훈독 시 내 가슴을 더 뛰게 만드는 장은?",
    emoji: "📖",
    options: [
      { text: "창조원리, 타락론 등 본질과 기준을 다루는 장", type: "T", desc: "법도와 진리의 절대성을 공부하는 기쁨" },
      { text: "복귀섭리역사, 재림론 등 변화와 시대를 다루는 장", type: "M", desc: "역사의 발전과 시대적 흐름을 깨닫는 기쁨" }
    ],
    reflection: "창조원리는 흔들리지 않는 뿌리이고, 복귀역사는 거센 폭풍 속에서도 전진하는 줄기입니다."
  },
  {
    id: 7, category: 'word',
    question: "예배 후 식구 모임에서 내가 더 편안하게 느끼는 소통은?",
    emoji: "💬",
    options: [
      { text: "말씀을 훈독하고 공식 목회 지침을 함께 공부함", type: "V", desc: "수직적이고 깊이 있는 영적 교육" },
      { text: "각자의 일상 삶의 애환과 눈물을 터놓고 나눔", type: "H", desc: "수평적이고 따뜻한 심정적 위로와 공감" }
    ],
    reflection: "지식의 교육은 우리를 단단히 다지고, 심정의 나눔은 우리의 꽁꽁 얼어붙은 영혼을 따뜻하게 녹여 줍니다."
  },
  {
    id: 8, category: 'word',
    question: "인간 성화(신앙 완성)의 가장 정확한 증거는 무엇인가?",
    emoji: "🌟",
    options: [
      { text: "어떠한 부정함도 내면에 허용하지 않는 엄격한 정결", type: "V", desc: "규율과 말씀에 완벽히 귀일된 상태" },
      { text: "원수까지도 진심으로 용서하고 안아주는 온화한 인격", type: "H", desc: "성품과 태도에서 참사랑이 뿜어져 나오는 상태" }
    ],
    reflection: "정결함은 진리의 뼈대를 지키고, 사랑의 성품은 그 위에 은혜의 살을 입힙니다."
  },

  // ── 참부모신학 (4문항) ──
  {
    id: 9, category: 'theology',
    question: "참부모신학의 전개에서 나에게 더 크게 울림을 주는 것은?",
    emoji: "👑",
    options: [
      { text: "참아버님의 역사적 개척 말씀과 8대 교본", type: "T", desc: "탕감복귀의 투쟁적인 정통 신학 보존" },
      { text: "참어머니의 독생녀 계시와 천일국 평화 선포", type: "M", desc: "하늘어머니 중심의 자비와 평화 사상" }
    ],
    reflection: "아버님의 노정은 엄격한 공의의 뼈대이고, 어머니의 선포는 온화한 자비의 살입니다. 둘이 모여 참부모가 됩니다."
  },
  {
    id: 10, category: 'theology',
    question: "참아버님 생전 말씀과 참어머니의 현 지침이 외견상 다르게 보일 때 나의 판단은?",
    emoji: "👑",
    options: [
      { text: "과거에 선포된 말씀선집의 오리지널 자구 보존이 우선", type: "T", desc: "역사적 정통성을 결코 바꿀 수 없다는 보수적 귀일" },
      { text: "현재 천일국을 안착시키는 참어머니의 영적 선포가 우선", type: "M", desc: "섭리의 진전에 따른 점진적 말씀 발전의 수용" }
    ],
    reflection: "아버님의 성업은 불변하는 주춧돌이고, 어머니의 선포는 그 위에 세워지는 성전의 지붕입니다."
  },
  {
    id: 11, category: 'theology',
    question: "하늘부모님의 가장 원초적인 성품을 묘사하는 문구는?",
    emoji: "💜",
    options: [
      { text: "공의의 법도와 원칙을 철저히 집행하시는 아버지 하나님", type: "T", desc: "한 치의 타협도 허용하지 않는 절대적 기강" },
      { text: "무조건적인 용서와 참사랑을 주시는 자애로운 어머니 하나님", type: "M", desc: "아픈 자녀를 끌어안아 해원하시는 따뜻한 용서" }
    ],
    reflection: "공의는 섭리의 기둥을 세우고, 자비는 섭리를 따뜻한 가정으로 완성시킵니다."
  },
  {
    id: 12, category: 'theology',
    question: "인간이 신앙적으로 거듭나는 결정적 순간은?",
    emoji: "🌟",
    options: [
      { text: "참부모님의 혈통 전환 성성한 축복 결혼을 상속받을 때", type: "T", desc: "축복 예식이 주는 절대적 영적 신분 전환" },
      { text: "매 순간 내 양심에 어긋나지 않게 원수를 용서하고 사랑할 때", type: "M", desc: "일상의 참사랑 행위가 주는 점진적 인격 성화" }
    ],
    reflection: "축복식은 하늘의 무원죄 혈통을 상속받는 씨앗이고, 일상의 사랑은 그 씨앗을 나무로 키우는 햇살입니다."
  },

  // ── 구원섭리 (4문항) ──
  {
    id: 13, category: 'salvation',
    question: "인간 구원의 결정적 원동력은 무엇인가?",
    emoji: "⛪",
    options: [
      { text: "인간 스스로 감당해야 할 5%의 책임분담", type: "V", desc: "나의 땀과 탕감 조건으로 이루는 구원" },
      { text: "참부모님이 깔아놓으신 95%의 축복과 은혜", type: "M", desc: "은혜와 안착을 거저 받아들이는 감사" }
    ],
    reflection: "책임분담은 우리의 주체성을 세우고, 은혜는 우리에게 무한한 해원과 자유를 선사합니다. 당신의 구원관은 어느 쪽에 더 가깝나요?"
  },
  {
    id: 14, category: 'salvation',
    question: "내면의 타락성(교만, 분노 등)을 극복하는 나의 주된 방식은?",
    emoji: "⚔️",
    options: [
      { text: "침묵, 성전 경배, 골방에서 스스로를 성찰하고 회개", type: "V", desc: "하늘부모님과의 1:1 종적 동기 정화" },
      { text: "나를 미워하는 원수의 발을 씻기고 선대하는 실천", type: "H", desc: "수평적 현장에서 참사랑으로 탕감 복귀" }
    ],
    reflection: "내적 성찰은 영적 어둠을 발견하게 하고, 외적 실체 행동은 그 어둠을 완전히 몰아냅니다."
  },
  {
    id: 15, category: 'salvation',
    question: "신앙을 잃고 헤매는 청년들을 볼 때 나의 마음속 진단은?",
    emoji: "🌱",
    options: [
      { text: "말씀 훈독과 조건 정성이 약해져 세속에 오염된 것", type: "V", desc: "개인의 정성과 탕감 조건 부족" },
      { text: "교회의 경직된 율법과 소통 부족으로 숨이 막힌 것", type: "M", desc: "제도와 환경의 경직성 및 소통 부재" }
    ],
    reflection: "개인의 나태함을 일깨우는 호통도, 제도의 경직성을 혁신하는 제도 개선도 청년 구원에 모두 필요합니다."
  },
  {
    id: 16, category: 'salvation',
    question: "교회 헌금이나 뜻의 자원을 다루는 올바른 철학은?",
    emoji: "💰",
    options: [
      { text: "공적인 법도에 따라 무조건적으로 바치고 순종", type: "T", desc: "나를 비우고 주권을 환원시키는 귀일" },
      { text: "투명한 예산 집행과 복지적 목적의 자율적 사용", type: "M", desc: "공생공영공의에 기반한 도덕적 자원 공유" }
    ],
    reflection: "물질의 주인을 바꾸는 절대 귀일과, 물질로 이웃을 살리는 사회적 공의는 둘 다 물질복귀의 아름다운 열매입니다."
  },

  // ── 실천자유 (5문항) ──
  {
    id: 17, category: 'freedom',
    question: "예배와 신앙 공동체에서 더 중요한 우선 가치는?",
    emoji: "🛡️",
    options: [
      { text: "공직자와 제도의 공적 질서에 대한 순응", type: "T", desc: "섭리를 일사불란하게 이끄는 절대 귀일" },
      { text: "식구 개개인의 자율성과 양심의 자유", type: "M", desc: "자유의지에 기초한 창의적 은사 발현" }
    ],
    reflection: "질서는 공동체의 안전한 울타리가 되고, 자율은 식구들의 마음에 자발적인 헌신의 꽃을 피웁니다."
  },
  {
    id: 18, category: 'freedom',
    question: "의사결정 상황에서 공동체 내 갈등을 해결하는 나의 방식은?",
    emoji: "⚖️",
    options: [
      { text: "공직자와 교단이 정해놓은 명령과 질서에 따름", type: "T", desc: "혼란을 즉시 봉합하는 절대신앙적 귀일" },
      { text: "양측의 양심적 대화와 수평적 타협에 따름", type: "M", desc: "주체성을 보장하는 수평적 합의와 소통" }
    ],
    reflection: "질서는 혼란으로부터 섭리를 방어하고, 수평적 대화는 구성원들의 마음에 진정한 감동과 화합을 줍니다."
  },
  {
    id: 19, category: 'freedom',
    question: "교회 예배에서 내가 더 영적으로 몰입되는 스타일은?",
    emoji: "⛪",
    options: [
      { text: "전통 경배, 엄숙한 의식, 조용히 머리 숙이는 기도", type: "T", desc: "역사적 법도가 주는 경건함과 영성" },
      { text: "뜨거운 찬양, 세련된 무대, 식구 간의 눈빛 교감", type: "M", desc: "현대적 감각과 문화적 소통의 기쁨" }
    ],
    reflection: "경건한 의식은 우리의 옷깃을 여미게 하고, 자유로운 문화 찬양은 우리 마음의 빗장을 엽니다."
  },
  {
    id: 20, category: 'freedom',
    question: "자녀에게 신앙을 전수할 때 더 중요시하는 훈육은?",
    emoji: "🌱",
    options: [
      { text: "훈독회와 예배 의무를 철저히 지키는 규율 교육", type: "T", desc: "세속 타락으로부터 청정하게 혈통 보존" },
      { text: "스스로 양심에 따라 행동하게 이끄는 자율 교육", type: "M", desc: "강압 없는 인격적 소통과 현대적 양육" }
    ],
    reflection: "엄격한 율법은 아이들에게 안전한 가이드라인이 되고, 따뜻한 자율은 아이들이 신앙에 숨 쉴 수 있는 산소를 줍니다."
  },
  {
    id: 21, category: 'freedom',
    question: "나에게 헌금(봉헌)이란 궁극적으로 무엇인가?",
    emoji: "💰",
    options: [
      { text: "하늘 주권을 인정하고 나의 탕감 조건을 세우는 예식", type: "T", desc: "절대신앙적 헌신과 공적 의무" },
      { text: "이웃을 살리고 공동체를 돌보는 자발적인 참사랑 자산", type: "M", desc: "공생공영에 기초한 복지와 나눔" }
    ],
    reflection: "탕감 조건으로 바치는 헌금은 영혼을 정화하고, 참사랑으로 나누는 자산은 세상을 정화합니다."
  },

  // ── 초종교평화 (5문항) ──
  {
    id: 22, category: 'peace',
    question: "교단의 두 가지 사명 중 현재 더 시급한 것은?",
    emoji: "⛪",
    options: [
      { text: "고유 원리를 선포하여 식구로 입덕시키는 전도", type: "T", desc: "가정연합의 고유 정체성 및 교단 수호" },
      { text: "타종단 및 사회와 연대하는 초종교 평화 운동", type: "M", desc: "One Family Under God 보편 가치 실현" }
    ],
    reflection: "정체성은 우리의 뿌리를 깊게 내리게 하고, 초종교 연대는 우리의 가지를 세상 끝까지 넓게 뻗게 만듭니다."
  },
  {
    id: 23, category: 'peace',
    question: "타종교(불교, 개신교 등)의 수행자들을 마주하는 나의 시각은?",
    emoji: "🤝",
    options: [
      { text: "절대적 원리가 없으므로 개종시켜야 할 전도 대상", type: "T", desc: "진리의 고유 장벽을 명확히 지키는 자세" },
      { text: "하늘부모님 아래 한 가족으로 연대할 평화의 동반자", type: "M", desc: "교리를 넘어 보편적 평화 가치를 나누는 자세" }
    ],
    reflection: "독선에 빠지지 않는 정체성 수호와, 정체성을 잃지 않는 보편적 소통이 초종교 운동의 핵심입니다."
  },
  {
    id: 24, category: 'peace',
    question: "세상을 구원하기 위해 우리가 당장 투입해야 할 중심 영역은?",
    emoji: "🌍",
    options: [
      { text: "정치, 교계 지도층을 움직이는 거시적 국가 섭리", type: "V", desc: "거시적 구조와 주권 복귀 정렬" },
      { text: "마을 골목길 소외된 이들을 직접 구하는 미시적 전도", type: "H", desc: "미시적 삶의 치유와 참사랑 정착" }
    ],
    reflection: "거시 서밋은 국가의 운명을 돌려놓고, 미시 봉사는 사람들의 가슴속에 참사랑의 영토를 닦습니다."
  },
  {
    id: 25, category: 'peace',
    question: "지역 교회 선교 사역 중 더 집중해야 할 부분은?",
    emoji: "🌱",
    options: [
      { text: "식구들이 모여 훈독하고 영성을 다지는 수련회", type: "V", desc: "수직적 신앙 고도화와 내적 뼈대" },
      { text: "지역 이웃들을 돕는 자선 바자회와 문화 축제", type: "H", desc: "수평적 관계망 형성 및 지역 친화" }
    ],
    reflection: "수련은 영적 충전소이고, 봉사는 실천적 발전기입니다. 안에서 충전하고 밖에서 발전시켜야 섭리가 굴러갑니다."
  },
  {
    id: 26, category: 'peace',
    question: "섭리적 비즈니스(만물복귀) 현장에서 우선시하는 태도는?",
    emoji: "💰",
    options: [
      { text: "목표 경제적 자원을 복귀하기 위해 몸 던져 투입", type: "V", desc: "고난과 시련을 극복하는 제물적 개척력" },
      { text: "공정하고 도덕적인 윤리를 지켜 식구들의 신뢰 획득", type: "H", desc: "공생공영공의 사상의 기업적 정렬" }
    ],
    reflection: "돌파력 있는 개척은 물질의 장벽을 부수고, 도덕적 윤리는 뜻의 영속적 토대를 마련합니다."
  },

  // ── 이상가정 (4문항) ──
  {
    id: 27, category: 'family',
    question: "배우자/자녀의 필요와 공적 선교 임무가 충돌할 때 나의 선택은?",
    emoji: "🏠",
    options: [
      { text: "가정의 삼대권 안착과 행복을 우선 돌봄", type: "H", desc: "이상가정의 성공이 뜻의 기둥이라는 스탠스" },
      { text: "가정을 뒤로하고 공적 섭리 최전선에 투입", type: "V", desc: "국가와 세계 복귀를 향한 제물 노정" }
    ],
    reflection: "아버님이 걸으신 개척 제물의 길과 어머니가 선포하신 가정 천국 안착의 길은 섭리적으로 이어지는 십자가의 조화입니다."
  },
  {
    id: 28, category: 'family',
    question: "신종족메시아 사역의 우선순위는 어디인가?",
    emoji: "🗺️",
    options: [
      { text: "내 가문과 일가친척을 축복으로 인도하기", type: "T", desc: "가문의 영적 맥을 바꾸는 종족 메시아" },
      { text: "지역 사회 취약 계층의 어두운 곳을 치유하기", type: "M", desc: "마을 속에 공생공영공의 참사랑 안착" }
    ],
    reflection: "친척을 구하는 것은 가문의 복귀이고, 이웃을 구하는 것은 사회의 복귀입니다. 둘 다 축복의 손길이 필요합니다."
  },
  {
    id: 29, category: 'family',
    question: "축복 가정으로서 부부 관계의 평화를 지탱하는 핵심 비결은?",
    emoji: "🏠",
    options: [
      { text: "하늘이 성혼해주신 섭리적 의무와 절대 정결 의식", type: "T", desc: "의무와 책임, 그리고 탕감 조건 준수" },
      { text: "개개인의 양심과 개성을 존중하는 동반자적 대화", type: "M", desc: "강압 없는 소통과 현대적 상호 자율" }
    ],
    reflection: "섭리적 책임은 가정의 뼈대를 단단히 하고, 상호 자율은 부부의 마음에 참사랑의 꽃을 피웁니다."
  },
  {
    id: 30, category: 'family',
    question: "최종적으로 도래할 천일국은 어떤 이상적인 사회인가?",
    emoji: "🕊️",
    options: [
      { text: "참사랑과 말씀의 질서 아래 일사불란한 공의의 사회", type: "T", desc: "절대신앙과 절대 복종의 완성적 평화" },
      { text: "모든 인류가 양심의 자유 속에 주체적으로 조화된 사회", type: "M", desc: "자유의지와 자율로 피어나는 공생공영공의" }
    ],
    reflection: "절대적 질서는 천일국을 굳건히 보호하고, 자율과 자유는 천일국에 살고 있는 시민들을 행복하게 만듭니다."
  }
];
