// 진단 진행 모드
// - general: 일반 진단 (Likert) — 레거시 6문항 / 재설계 30문항
// - academic: 레거시 학술 연구자 12문항 (Likert)
// - professional: 재설계 전문 진단 (강제선택 Forced Choice 40문항)
export type SurveyMode = 'general' | 'academic' | 'professional';

export interface UserInfo {
  name: string;
  region: string; // 교구 또는 소속
  position: string; // 직책 (예: 목회자, 공직자, 축복가정 등)
  generation?: string; // 축복 기수 (선택)
}

export interface SurveyQuestion {
  c: number; // Category index (1-6)
  t: 'L' | 'R' | 'V'; // Question type
  q: string; // Question text
  left?: string; // Dilemma left
  right?: string; // Dilemma right
  descL?: string; // Dilemma desc left
  descR?: string; // Dilemma desc right
  isCrossValidation?: boolean;
  crossValidationTargetIndex?: number;
}

export interface AnswerData {
  value: number;
  latencyMs: number;
}

export interface PersonaMatch {
  type: string;
  emoji: string;
  description: string;
}

export interface SurveyResultContent {
  persona: string;
  emoji: string;
  hashtags: string[];
  headline: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  advice: string;
  workManual: string[];
  worstMatch: {
    type: string;
    description: string;
    handling: string;
  };
  bestMatch: {
    type: string;
    emoji: string;
    description: string;
  };
  leadershipFit: {
    role: string;
    score: number;
    risk: string;
  }[];
}

export interface SurveySection {
  emoji: string;
  title: string;
  intro: string;
  questionRange: [number, number]; // inclusive [start, end]
  reactions: {
    low: string;   // avg <= 2.5
    mid: string;   // 2.5 < avg <= 3.5
    high: string;  // avg > 3.5
  };
}

export interface SurveyConfig {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: string;
  keyPoints?: { icon: string; title: string; description: string }[];
  categories: string[];
  questions: SurveyQuestion[];
  sections?: SurveySection[];
  // 전문 진단(강제선택 40문항) — 존재하면 인트로에 전문 모드 버튼 노출
  professionalQuestions?: SurveyQuestion[];
  professionalSections?: SurveySection[];
  getResultContent: (averageScore: number, categoryScores: number[], answers?: Record<number, AnswerData>) => SurveyResultContent;
}

export interface PersonaDetail {
  id: string;
  surveyId: string;
  name: string;
  emoji: string;
  shortDesc: string;
  longDescription: string;
}

export interface BlogPost {
  surveyId: string;
  title: string;
  subtitle: string;
  emoji: string;
  readTime: string;
  sections: BlogSection[];
  relatedPersonas: string[];
}

export interface BlogSection {
  heading: string;
  emoji: string;
  body: string;
  highlight?: string; // pull-quote
}

export interface BalanceOption {
  text: string;
  type: 'V' | 'H' | 'T' | 'M'; // V=Vertical (수직), H=Horizontal (수평), T=Traditional (전통), M=Modern (현대)
  desc: string;
}

export interface BalanceQuestion {
  id: number;
  question: string;
  emoji: string;
  options: BalanceOption[];
  reflection: string;
}
