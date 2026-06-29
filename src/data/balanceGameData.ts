import { BalanceQuestion } from '../types';

// ── 카테고리 정의 ──
// 밸런스 게임은 7개 진단 주제를 2개 메타축으로 모아 본다.
//  · 축1 (V↔H): 내면 지향(V) ↔ 관계·실천 지향(H)  — 심정영성·참부모신학·초종교평화
//  · 축2 (T↔M): 원칙·규율(T) ↔ 자유·직관(M)        — 말씀체휼·구원섭리·실천자유·이상가정
// 옳고 그름이 아니라 '나다운 신앙의 결'을 비추는 게임이다.
export type BalanceCategory = 'spirituality' | 'word' | 'theology' | 'salvation' | 'freedom' | 'peace' | 'family';

export const balanceCategoryLabels: Record<BalanceCategory, { emoji: string; name: string; desc: string }> = {
  spirituality: { emoji: '🕊️', name: '심정영성', desc: '내향 묵상 vs 외향 표현' },
  word: { emoji: '📖', name: '말씀체휼', desc: '원리·논리 vs 경험·직관' },
  theology: { emoji: '👑', name: '참부모신학', desc: '개인 수련 vs 관계 교제' },
  salvation: { emoji: '⚔️', name: '구원섭리', desc: '구조·규율 vs 자유·창의' },
  freedom: { emoji: '🛡️', name: '실천자유', desc: '질서 순응 vs 자율 주체' },
  peace: { emoji: '⛪', name: '초종교평화', desc: '내부 집중 vs 세상 참여' },
  family: { emoji: '🏠', name: '이상가정', desc: '규칙·확신 vs 포용·통합' },
};

export interface CategorizedBalanceQuestion extends BalanceQuestion {
  category: BalanceCategory;
}

export const balanceGameQuestions: CategorizedBalanceQuestion[] = [
  // ── 심정영성 (4문항) · 내면 묵상(V) ↔ 외향 표현(H) ──
  {
    id: 1, category: 'spirituality',
    question: "아침에 눈 뜨고 신앙적으로 먼저 향하고 싶은 곳은?",
    emoji: "🙏",
    options: [
      { text: "혼자 조용히 드리는 묵상 기도", type: "V", desc: "고요 속에서 하늘과 독대하는 내향형" },
      { text: "식구들과 함께 드리는 합심 기도", type: "H", desc: "함께 타오르는 데서 힘을 얻는 외향형" }
    ],
    reflection: "골방의 고요도, 함께의 뜨거움도 모두 하늘을 만나는 귀한 길입니다. 당신은 어느 쪽에서 더 살아나나요?"
  },
  {
    id: 2, category: 'spirituality',
    question: "예배의 은혜가 가장 크게 차오르는 순간은?",
    emoji: "✨",
    options: [
      { text: "고요한 침묵 속 깊은 묵상", type: "V", desc: "내면의 정적에서 깊어지는 묵상형" },
      { text: "다 함께 마음껏 찬양하며 표현", type: "H", desc: "표현 속에서 살아나는 표현형" }
    ],
    reflection: "침묵의 깊이와 표현의 생생함은 서로 다른 은혜의 빛깔일 뿐, 우열이 없습니다."
  },
  {
    id: 3, category: 'spirituality',
    question: "신앙적으로 지쳤을 때 나를 회복시키는 것은?",
    emoji: "🩹",
    options: [
      { text: "혼자만의 조용한 충전 시간", type: "V", desc: "홀로 머무는 시간에 회복되는 내향형" },
      { text: "식구들과의 따뜻한 만남과 교제", type: "H", desc: "사람들과의 만남에서 회복되는 외향형" }
    ],
    reflection: "고독으로 채워지는 사람도, 관계로 채워지는 사람도 있습니다. 내 회복의 샘은 어디인가요?"
  },
  {
    id: 4, category: 'spirituality',
    question: "큰 은혜를 받았을 때 내 마음의 첫 반응은?",
    emoji: "💜",
    options: [
      { text: "마음 깊이 조용히 새긴다", type: "V", desc: "안으로 깊이 간직하는 내향형" },
      { text: "곧장 사람들에게 이야기한다", type: "H", desc: "밖으로 곧장 나누는 표현형" }
    ],
    reflection: "안에 새기는 것도, 밖으로 나누는 것도 은혜를 사랑하는 각자의 방식입니다."
  },

  // ── 말씀체휼 (4문항) · 원리·논리(T) ↔ 경험·직관(M) ──
  {
    id: 5, category: 'word',
    question: "난해한 말씀 구절을 만났을 때 나의 방식은?",
    emoji: "📖",
    options: [
      { text: "논리와 구조로 차근차근 분석한다", type: "T", desc: "정합성으로 파고드는 원리·논리형" },
      { text: "마음에 와닿는 느낌으로 받아들인다", type: "M", desc: "감동으로 체휼하는 경험·직관형" }
    ],
    reflection: "분석의 정밀함도, 체휼의 따뜻함도 말씀을 깊이 만나는 두 갈래 길입니다."
  },
  {
    id: 6, category: 'word',
    question: "내가 더 은혜로운 훈독 방식은?",
    emoji: "📚",
    options: [
      { text: "순서대로 체계적으로 정독한다", type: "T", desc: "틀을 따라 다지는 원리·논리형" },
      { text: "그날 끌리는 구절을 자유롭게 편다", type: "M", desc: "영감을 따르는 경험·직관형" }
    ],
    reflection: "체계의 꾸준함과 영감의 신선함은 각자의 훈독을 살아있게 합니다."
  },
  {
    id: 7, category: 'word',
    question: "진리가 참이라고 가장 확신되는 순간은?",
    emoji: "🌟",
    options: [
      { text: "논리적으로 정확히 증명될 때", type: "T", desc: "논증으로 확신하는 원리·논리형" },
      { text: "내 삶에서 직접 체험되었을 때", type: "M", desc: "경험으로 확신하는 경험·직관형" }
    ],
    reflection: "머리로 증명된 진리와 삶으로 체험된 진리는 결국 같은 빛의 두 얼굴입니다."
  },
  {
    id: 8, category: 'word',
    question: "누군가에게 말씀을 전할 때 나의 방식은?",
    emoji: "💬",
    options: [
      { text: "체계적으로 논리정연하게 설명한다", type: "T", desc: "설명으로 전하는 원리·논리형" },
      { text: "내 간증과 이야기로 전한다", type: "M", desc: "이야기로 전하는 경험·직관형" }
    ],
    reflection: "명료한 설명도, 마음을 울리는 간증도 진리를 전하는 귀한 그릇입니다."
  },

  // ── 참부모신학 (4문항) · 개인 수련(V) ↔ 관계 교제(H) ──
  {
    id: 9, category: 'theology',
    question: "참부모님을 모실 때 신앙이 더 깊어지는 자리는?",
    emoji: "🙇",
    options: [
      { text: "홀로 정성을 쌓는 수련의 시간", type: "V", desc: "혼자 정성으로 모시는 개인 수련형" },
      { text: "식구들과 함께 모시는 교제의 자리", type: "H", desc: "함께 나누며 모시는 관계 교제형" }
    ],
    reflection: "홀로의 정성도, 함께의 교제도 참부모님을 향한 진실한 사랑입니다."
  },
  {
    id: 10, category: 'theology',
    question: "참부모님의 심정이 더 깊이 와닿는 통로는?",
    emoji: "💞",
    options: [
      { text: "혼자만의 깊은 묵상", type: "V", desc: "묵상으로 체휼하는 개인 수련형" },
      { text: "사람들과 나누는 간증과 대화", type: "H", desc: "나눔으로 체휼하는 관계 교제형" }
    ],
    reflection: "묵상의 깊이와 나눔의 온기는 같은 심정을 향한 서로 다른 문입니다."
  },
  {
    id: 11, category: 'theology',
    question: "내 신앙이 가장 잘 자라는 배움의 길은?",
    emoji: "📘",
    options: [
      { text: "혼자 책으로 깊이 연구한다", type: "V", desc: "홀로 탐구하는 개인 수련형" },
      { text: "멘토·선배와의 관계에서 배운다", type: "H", desc: "관계로 배우는 관계 교제형" }
    ],
    reflection: "혼자 파고드는 깊이와 함께 배우는 넓이는 모두 신앙을 키웁니다."
  },
  {
    id: 12, category: 'theology',
    question: "힘들 때 나를 다시 세우는 위로는?",
    emoji: "🫂",
    options: [
      { text: "하늘과 홀로 독대하는 기도", type: "V", desc: "독대로 회복하는 개인 수련형" },
      { text: "식구들의 따뜻한 위로와 함께함", type: "H", desc: "교제로 회복하는 관계 교제형" }
    ],
    reflection: "홀로 하늘 앞에 서는 힘도, 함께 어깨를 거는 힘도 우리를 일으킵니다."
  },

  // ── 구원섭리 (4문항) · 구조·규율(T) ↔ 자유·창의(M) ──
  {
    id: 13, category: 'salvation',
    question: "내가 느끼는 구원의 본질에 더 가까운 것은?",
    emoji: "⚖️",
    options: [
      { text: "조건과 정성을 쌓아가는 책임", type: "T", desc: "규율로 정진하는 구조·규율형" },
      { text: "거저 주신 은혜를 누리는 감사", type: "M", desc: "은혜를 누리는 자유·창의형" }
    ],
    reflection: "땀 흘린 정성도, 거저 받은 은혜도 모두 구원으로 이어지는 길입니다."
  },
  {
    id: 14, category: 'salvation',
    question: "내게 더 편안한 신앙의 태도는?",
    emoji: "🧘",
    options: [
      { text: "흐트러짐 없는 엄격한 자기 관리", type: "T", desc: "절제로 단련하는 구조·규율형" },
      { text: "하늘께 편안히 맡기는 내어맡김", type: "M", desc: "신뢰로 맡기는 자유·창의형" }
    ],
    reflection: "단련의 단단함과 내어맡김의 평안함은 각자의 신앙을 지탱하는 힘입니다."
  },
  {
    id: 15, category: 'salvation',
    question: "고난이 닥쳤을 때 나의 마음가짐은?",
    emoji: "🌅",
    options: [
      { text: "탕감으로 여기고 묵묵히 감내한다", type: "T", desc: "감내하는 구조·규율형" },
      { text: "기쁨으로 가볍게 승화시킨다", type: "M", desc: "승화하는 자유·창의형" }
    ],
    reflection: "묵묵히 견디는 힘도, 기쁘게 넘어서는 힘도 고난을 이기는 신앙입니다."
  },
  {
    id: 16, category: 'salvation',
    question: "내게 더 은혜로운 예배의 결은?",
    emoji: "🎨",
    options: [
      { text: "전통 격식이 주는 경건함", type: "T", desc: "격식을 지키는 구조·규율형" },
      { text: "창의적이고 새로운 시도", type: "M", desc: "새로움을 즐기는 자유·창의형" }
    ],
    reflection: "경건한 격식도, 신선한 창의도 하늘을 향한 진실한 예배입니다."
  },

  // ── 실천자유 (5문항) · 질서 순응(T) ↔ 자율 주체(M) ──
  {
    id: 17, category: 'freedom',
    question: "신앙 공동체에서 내가 더 중요하게 여기는 가치는?",
    emoji: "🛡️",
    options: [
      { text: "공적 질서에 대한 순응", type: "T", desc: "질서를 존중하는 질서 순응형" },
      { text: "개인 양심의 자율", type: "M", desc: "양심을 따르는 자율 주체형" }
    ],
    reflection: "질서가 주는 안정도, 자율이 주는 생기도 공동체를 살리는 두 기둥입니다."
  },
  {
    id: 18, category: 'freedom',
    question: "결정의 순간 내가 더 의지하는 것은?",
    emoji: "⚖️",
    options: [
      { text: "정해진 지침과 방향을 따른다", type: "T", desc: "지침을 따르는 질서 순응형" },
      { text: "스스로 판단해 길을 정한다", type: "M", desc: "스스로 정하는 자율 주체형" }
    ],
    reflection: "따를 줄 아는 겸손과 정할 줄 아는 주체성은 모두 성숙한 신앙의 모습입니다."
  },
  {
    id: 19, category: 'freedom',
    question: "일을 대하는 내가 더 편한 자세는?",
    emoji: "🎯",
    options: [
      { text: "맡겨진 임무를 충실히 완수한다", type: "T", desc: "충실히 수행하는 질서 순응형" },
      { text: "스스로 일을 기획해 추진한다", type: "M", desc: "스스로 기획하는 자율 주체형" }
    ],
    reflection: "맡은 일을 다하는 신뢰도, 일을 만들어내는 추진력도 귀한 강점입니다."
  },
  {
    id: 20, category: 'freedom',
    question: "변화의 갈림길에서 나의 선택은?",
    emoji: "🦋",
    options: [
      { text: "검증된 기존 방식을 지킨다", type: "T", desc: "안정을 지키는 질서 순응형" },
      { text: "새로운 길을 과감히 연다", type: "M", desc: "변화를 만드는 자율 주체형" }
    ],
    reflection: "지킬 것을 지키는 신중함과 새 길을 여는 용기는 함께 갈 때 빛납니다."
  },
  {
    id: 21, category: 'freedom',
    question: "자녀에게 신앙을 전할 때 더 중요시하는 것은?",
    emoji: "🌱",
    options: [
      { text: "분명한 규율로 바르게 가르침", type: "T", desc: "기준으로 가르치는 질서 순응형" },
      { text: "스스로 양심 따라 자라게 이끔", type: "M", desc: "자율로 이끄는 자율 주체형" }
    ],
    reflection: "분명한 기준이 주는 안전과 자율이 주는 숨결은 둘 다 자녀를 살립니다."
  },

  // ── 초종교평화 (5문항) · 내부 집중(V) ↔ 세상 참여(H) ──
  {
    id: 22, category: 'peace',
    question: "지금 더 마음이 끌리는 사명은?",
    emoji: "⛪",
    options: [
      { text: "우리 고유의 정체성을 다지는 일", type: "V", desc: "안을 다지는 내부 집중형" },
      { text: "세상과 연대하는 평화 운동", type: "H", desc: "밖으로 나아가는 세상 참여형" }
    ],
    reflection: "뿌리를 깊게 내리는 일도, 가지를 넓게 뻗는 일도 한 나무를 키웁니다."
  },
  {
    id: 23, category: 'peace',
    question: "다른 신앙을 가진 사람을 볼 때 나의 시각은?",
    emoji: "🤝",
    options: [
      { text: "우리 진리로 인도할 전도의 대상", type: "V", desc: "정체성을 지키는 내부 집중형" },
      { text: "함께 손잡을 대화의 동반자", type: "H", desc: "세상과 연대하는 세상 참여형" }
    ],
    reflection: "진리를 지키는 마음과 다름을 품는 마음은 모두 사랑에서 나옵니다."
  },
  {
    id: 24, category: 'peace',
    question: "평소 내 마음이 더 자주 향하는 곳은?",
    emoji: "🌍",
    options: [
      { text: "교단 내부의 일과 식구들", type: "V", desc: "안에 집중하는 내부 집중형" },
      { text: "세상과 사회의 문제들", type: "H", desc: "밖을 향하는 세상 참여형" }
    ],
    reflection: "안을 살피는 따뜻함도, 밖을 품는 너름도 모두 신앙의 시선입니다."
  },
  {
    id: 25, category: 'peace',
    question: "내 신앙이 가장 살아나는 무대는?",
    emoji: "🌱",
    options: [
      { text: "교회 안의 모임과 수련", type: "V", desc: "공동체에서 다지는 내부 집중형" },
      { text: "세상 속 현장의 실천", type: "H", desc: "현장에서 빛나는 세상 참여형" }
    ],
    reflection: "안에서 충전하는 힘과 밖에서 실천하는 힘이 만날 때 신앙이 굴러갑니다."
  },
  {
    id: 26, category: 'peace',
    question: "내 재능과 시간을 더 쓰고 싶은 곳은?",
    emoji: "💡",
    options: [
      { text: "교단 공동체를 세우는 사역", type: "V", desc: "내부를 세우는 내부 집중형" },
      { text: "사회 공익을 위한 활동", type: "H", desc: "세상에 기여하는 세상 참여형" }
    ],
    reflection: "공동체를 든든히 하는 헌신도, 세상을 밝히는 헌신도 모두 귀합니다."
  },

  // ── 이상가정 (4문항) · 규칙·확신(T) ↔ 포용·통합(M) ──
  {
    id: 27, category: 'family',
    question: "가정을 이끄는 나의 방식에 더 가까운 것은?",
    emoji: "🏠",
    options: [
      { text: "분명한 규칙과 질서로 세운다", type: "T", desc: "기준으로 세우는 규칙·확신형" },
      { text: "유연하게 품으며 이끈다", type: "M", desc: "마음으로 품는 포용·통합형" }
    ],
    reflection: "분명한 질서가 주는 안정도, 너른 포용이 주는 따뜻함도 가정을 세웁니다."
  },
  {
    id: 28, category: 'family',
    question: "자녀를 대할 때 내가 먼저 하는 것은?",
    emoji: "🧸",
    options: [
      { text: "확실한 기준과 가치를 제시한다", type: "T", desc: "기준을 세우는 규칙·확신형" },
      { text: "자녀의 마음을 먼저 헤아린다", type: "M", desc: "마음을 헤아리는 포용·통합형" }
    ],
    reflection: "바른 기준을 세우는 사랑도, 마음을 먼저 안는 사랑도 자녀를 자라게 합니다."
  },
  {
    id: 29, category: 'family',
    question: "가정에 갈등이 생겼을 때 나의 방식은?",
    emoji: "🤲",
    options: [
      { text: "원칙으로 분명하게 정리한다", type: "T", desc: "원칙으로 푸는 규칙·확신형" },
      { text: "관계와 마음으로 풀어간다", type: "M", desc: "관계로 푸는 포용·통합형" }
    ],
    reflection: "분명히 짚는 지혜와 따뜻이 끌어안는 지혜는 함께할 때 가정을 회복합니다."
  },
  {
    id: 30, category: 'family',
    question: "옳고 그름을 마주할 때 나의 시선은?",
    emoji: "🌷",
    options: [
      { text: "분명하게 선을 그어 가른다", type: "T", desc: "명확히 분별하는 규칙·확신형" },
      { text: "사람마다의 맥락을 함께 본다", type: "M", desc: "맥락을 품는 포용·통합형" }
    ],
    reflection: "분명한 분별도, 너른 이해도 모두 사람을 사랑하는 한 마음입니다."
  }
];
