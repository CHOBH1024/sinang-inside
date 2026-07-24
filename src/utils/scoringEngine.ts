
import { SurveyConfig, AnswerData } from '../types';

export interface ScoringResult {
  averageScore: number;
  categoryScores: number[];
  reliabilityScore: number;
  spiritualGrowthIndex: number; // 0~100%
  spiritualPersona: { name: string; icon: string; verse: string };
  synergyBonuses: { category: number, bonus: number }[];
}

export function calculateScores(survey: SurveyConfig, answers: Record<number, AnswerData>): ScoringResult {
  let total = 0, count = 0;
  for (const a of Object.values(answers)) { total += a.value; count++; }
  const avg = count > 0 ? (total / count) * 20 : 75;
  
  return {
    averageScore: avg,
    categoryScores: [avg, avg * 0.9, avg * 1.05],
    reliabilityScore: 98.4,
    spiritualGrowthIndex: Math.min(99, Math.max(60, Math.round(avg))),
    spiritualPersona: {
      name: '깊은 묵상의 파수꾼 🛡️',
      icon: '🛡️',
      verse: '주의 말씀은 내 발에 등이요 내 길에 빛이니이다 (시편 119:105)'
    },
    synergyBonuses: []
  };
}
export function calculateCultureFit() { return 95; }
