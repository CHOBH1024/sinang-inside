/**
 * 가정연합 공식 신학 용어 사전 (Theology Dictionary)
 *
 * ⚠️  번역 원칙:
 * - 가정연합 공식 영문 헌장 및 말씀선집 번역 표준을 엄격히 따릅니다.
 * - 일반 번역기(Google Translate, DeepL 등) 결과를 절대 사용하지 않습니다.
 * - 고유명사/신학 용어는 음역(Romanization) 또는 공식 영어 표현을 사용합니다.
 * - 출처: 세계평화통일가정연합 공식 홈페이지, 원리강론(Exposition of the Divine Principle),
 *          말씀선집(Cheon Seong Gyeong), 천일국헌법(Cheon Il Guk Constitution)
 *
 * 일본어 원칙:
 * - 일본어 교단 공식 교재 및 가정연합 일본어 사이트 기준 용어 사용.
 */

export type SupportedLang = 'ko' | 'en' | 'ja';

export interface TermEntry {
  en: string; // Official English translation
  ja: string; // Official Japanese translation
  note?: string; // 비고 (번역 근거 또는 주의사항)
}

// ================================================================
// 핵심 신학 고유명사 / 교리 용어
// ================================================================
export const theologyDictionary: Record<string, TermEntry> = {
  // ── 하늘부모님 / 참부모님 ──────────────────────────────────────
  '하늘부모님': {
    en: 'Heavenly Parent',
    ja: '天の父母様',
    note: '가정연합 공식 용어. Heavenly Father/Mother의 통합 표현으로 2012년 이후 공식화.',
  },
  '참부모님': {
    en: 'True Parents',
    ja: '真の父母様',
    note: '세계평화통일가정연합 창시자 문선명·한학자 총재 내외분을 지칭하는 공식 호칭.',
  },
  '참아버님': {
    en: 'True Father',
    ja: '真のお父様',
  },
  '참어머님': {
    en: 'True Mother',
    ja: '真のお母様',
  },
  '효정': {
    en: 'Hyojeong (Filial Heart)',
    ja: '孝情',
    note: '효정(孝情): 하늘부모님과 참부모님을 향한 절대적 효심과 사랑. 직역 불가 → 음역 + 설명 병기.',
  },

  // ── 섭리 / 구원론 ─────────────────────────────────────────────
  '탕감복귀': {
    en: 'Restoration through Indemnity',
    ja: '蕩減復帰',
    note: '원리강론 공식 번역. "Indemnity"는 교단 공식 영어 표현. "Atonement"는 사용 금지.',
  },
  '탕감': {
    en: 'Indemnity',
    ja: '蕩減',
  },
  '섭리': {
    en: 'Providence (of God)',
    ja: '摂理',
    note: '문맥에 따라 Divine Providence.',
  },
  '실체기대': {
    en: 'Foundation of Substance',
    ja: '実体基台',
    note: '원리강론 공식 번역. "Substantial Foundation"은 비공식.',
  },
  '믿음의 기대': {
    en: 'Foundation of Faith',
    ja: '信仰基台',
  },
  '복귀': {
    en: 'Restoration',
    ja: '復帰',
  },
  '타락': {
    en: 'The Fall',
    ja: '堕落',
  },

  // ── 심정 / 사랑 ───────────────────────────────────────────────
  '심정': {
    en: 'Shimjeong (Heart)',
    ja: '心情',
    note: '심정(心情): 가장 번역하기 어려운 핵심 개념. 공식적으로 음역 사용. Heart로만 번역 시 의미 축소 우려.',
  },
  '참사랑': {
    en: "True Love",
    ja: '真の愛',
  },
  '사랑': {
    en: 'Love',
    ja: '愛',
  },

  // ── 천일국 / 이상가정 ─────────────────────────────────────────
  '천일국': {
    en: 'Cheon Il Guk',
    ja: '天一国',
    note: '한자 天一國 (하나 된 하늘의 나라). Kingdom of Heaven으로 번역하지 않음. 음역 사용이 공식 방침.',
  },
  '이상가정': {
    en: 'Ideal Family',
    ja: '理想家庭',
  },
  '참가정': {
    en: 'True Family',
    ja: '真の家庭',
  },
  '가정연합': {
    en: 'Family Federation for World Peace and Unification (FFWPU)',
    ja: '家庭連合',
    note: '정식 명칭: Family Federation for World Peace and Unification. 약칭: FFWPU 또는 Family Federation.',
  },

  // ── 말씀 / 경전 ───────────────────────────────────────────────
  '원리강론': {
    en: 'Exposition of the Divine Principle',
    ja: '原理講論',
    note: '"Divine Principle"은 원리 사상의 영문 공식 명칭.',
  },
  '천성경': {
    en: 'Cheon Seong Gyeong',
    ja: '天聖経',
    note: '음역 사용. "Holy Bible of Heavenly Kingdom" 등의 번역은 비공식.',
  },
  '참부모경': {
    en: 'Cham Bumo Gyeong',
    ja: '真の父母経',
  },
  '평화경': {
    en: 'Pyeong Hwa Gyeong',
    ja: '平和経',
  },
  '말씀': {
    en: 'Word (of God)',
    ja: '御言葉',
  },
  '훈독': {
    en: 'Hoon Dok (Devotional Reading)',
    ja: '訓読',
    note: '訓読회(훈독회)는 Hoon Dok Hae (Family Scripture Reading Session).',
  },
  '훈독회': {
    en: 'Hoon Dok Hae',
    ja: '訓読会',
  },

  // ── 의식 / 제도 ───────────────────────────────────────────────
  '축복': {
    en: 'Holy Blessing (Marriage Blessing)',
    ja: '祝福',
    note: '결혼 축복 문맥: Holy Blessing Ceremony. 단독 사용 시: Blessing.',
  },
  '성주식': {
    en: 'Holy Wine Ceremony',
    ja: '聖酒式',
  },
  '축복가정': {
    en: 'Blessed Family',
    ja: '祝福家庭',
  },
  '신종족메시아': {
    en: 'Tribal Messiah',
    ja: '氏族メシア',
  },
  '고향섭리': {
    en: 'Hometown Providence',
    ja: '故郷摂理',
  },

  // ── 조직/직책 ─────────────────────────────────────────────────
  '교구장': {
    en: 'Regional Director',
    ja: '教区長',
  },
  '교회장': {
    en: 'Church Leader',
    ja: '教会長',
  },
  '식구': {
    en: 'Member (Family Member)',
    ja: '食口',
    note: '食口: 문자 그대로 "입으로 먹는 가족". 교단 내에서는 "member"로 번역하되, 심층 문맥에서는 "Family Member" 사용.',
  },

  // ── 영성 지표 (진단 도구용) ────────────────────────────────────
  '심정영성': {
    en: 'Heart-Centered Spirituality (Shimjeong Spirituality)',
    ja: '心情霊性',
  },
  '말씀체휼': {
    en: 'Embodiment of the Word',
    ja: '御言葉体恤',
    note: '體恤(체휼): 몸으로 직접 경험하고 체득함. Embodying/Living the Word.',
  },
  '공생공영공의주의': {
    en: 'Interdependence, Mutual Prosperity and Universal Values',
    ja: '共生共栄共義主義',
    note: '가정연합 사회사상의 핵심. 약칭: 三大主義.',
  },
  '실체말씀': {
    en: 'Embodied Word',
    ja: '実体御言葉',
  },
};

// ================================================================
// 번역 함수
// ================================================================

/**
 * 주어진 한국어 키를 대상 언어로 번역합니다.
 * 사전에 없는 단어는 원문(한국어)을 그대로 반환합니다.
 */
export const translate = (key: string, lang: SupportedLang): string => {
  if (lang === 'ko') return key;
  const entry = theologyDictionary[key];
  if (!entry) {
    console.warn(`[Theology Dictionary] No entry found for: "${key}"`);
    return key; // fallback to Korean
  }
  return entry[lang];
};

/**
 * 주어진 텍스트 내에서 사전 키를 찾아 번역된 텍스트로 대체합니다.
 * 단순 치환이므로, 정확한 매칭에만 작동합니다.
 */
export const translateText = (text: string, lang: SupportedLang): string => {
  if (lang === 'ko') return text;
  let result = text;
  // 긴 키 먼저 처리 (부분 매칭 오류 방지)
  const sortedKeys = Object.keys(theologyDictionary).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    const entry = theologyDictionary[key];
    if (result.includes(key)) {
      result = result.replaceAll(key, entry[lang]);
    }
  }
  return result;
};

// ================================================================
// UI 레이블 번역 (진단 도구 공통 UI 텍스트)
// ================================================================
export const UI_LABELS: Record<string, Record<SupportedLang, string>> = {
  startDiagnosis: {
    ko: '진단 시작',
    en: 'Start Assessment',
    ja: '診断開始',
  },
  myResults: {
    ko: '나의 진단 결과',
    en: 'My Assessment Results',
    ja: '診断結果',
  },
  shareResults: {
    ko: '결과 공유하기',
    en: 'Share Results',
    ja: '結果をシェア',
  },
  downloadReport: {
    ko: '공식 인사 리포트 (PDF) 다운로드',
    en: 'Download Official HR Report (PDF)',
    ja: '公式人事レポート (PDF) ダウンロード',
  },
  hrIntakeTitle: {
    ko: '기본 인적사항 입력',
    en: 'Personal Information Entry',
    ja: '基本情報入力',
  },
  name: {
    ko: '성명',
    en: 'Full Name',
    ja: 'お名前',
  },
  region: {
    ko: '소속 교구 / 기관',
    en: 'Region / Organization',
    ja: '所属教区・機関',
  },
  position: {
    ko: '공적 직책',
    en: 'Official Position',
    ja: '公的職責',
  },
  blessingGeneration: {
    ko: '축복 기수',
    en: 'Blessing Generation',
    ja: '祝福期数',
  },
  submitAndStartDiagnosis: {
    ko: '인사기록 저장 및 진단 시작',
    en: 'Save HR Record & Start Assessment',
    ja: '人事記録保存・診断開始',
  },
  strengths: {
    ko: '주요 강점',
    en: 'Key Strengths',
    ja: '主な強み',
  },
  challenges: {
    ko: '주의 및 보완점',
    en: 'Challenges & Areas for Growth',
    ja: '注意点・補完点',
  },
  hrComment: {
    ko: '인사처 통합 코멘트',
    en: 'HR Department Integrated Comment',
    ja: '人事部統合コメント',
  },
  reportGeneratedBy: {
    ko: '본 리포트는 신앙인사이드(Sinang Inside) 평가 알고리즘에 의해 자동 생성되었습니다.',
    en: 'This report was automatically generated by the Sinang Inside assessment algorithm.',
    ja: '本レポートはSinang Inside評価アルゴリズムにより自動生成されました。',
  },
};

/**
 * UI 레이블을 대상 언어로 가져옵니다.
 */
export const getLabel = (key: keyof typeof UI_LABELS, lang: SupportedLang): string => {
  return UI_LABELS[key]?.[lang] ?? UI_LABELS[key]?.ko ?? key;
};
