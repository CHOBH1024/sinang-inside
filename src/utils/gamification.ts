import { getHistory } from './historyStorage';
import { getJournal } from './journalStorage';

export interface UserLevelInfo {
  level: number;
  title: string;
  points: number;
  nextLevelPoints: number;
  progressPct: number;
  badges: string[];
}

const LEVEL_THRESHOLDS = [
  { level: 1, points: 0, title: '갓 입문한 식구' },
  { level: 2, points: 15, title: '호기심 많은 청년' },
  { level: 3, points: 40, title: '원리를 탐구하는 자' },
  { level: 4, points: 80, title: '효정을 품은 자' },
  { level: 5, points: 150, title: '섭리의 용사' },
  { level: 6, points: 250, title: '심정의 상속자' },
  { level: 7, points: 400, title: '축복의 등불' },
  { level: 8, points: 600, title: '평화의 사도' },
  { level: 9, points: 850, title: '천일국의 주역' },
  { level: 10, points: 1200, title: '참사랑의 실체' },
];

export const calculateUserLevel = (): UserLevelInfo => {
  const history = getHistory();
  const journal = getJournal();

  // 점수 계산 (진단 1회당 10점, 묵상 1회당 15점)
  const points = (history.length * 10) + (journal.length * 15);

  let currentLevel = LEVEL_THRESHOLDS[0];
  let nextLevel = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i].points) {
      currentLevel = LEVEL_THRESHOLDS[i];
      nextLevel = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i];
    }
  }

  const progressPct = currentLevel.level === 10 
    ? 100 
    : Math.min(100, Math.max(0, ((points - currentLevel.points) / (nextLevel.points - currentLevel.points)) * 100));

  // 뱃지 부여 로직
  const badges: string[] = [];
  if (history.length >= 1) badges.push('🌱 첫 걸음');
  if (history.length >= 5) badges.push('🔍 자기성찰');
  if (history.length >= 15) badges.push('🏆 진단 마스터');
  
  if (journal.length >= 1) badges.push('✍️ 첫 묵상');
  if (journal.length >= 7) badges.push('📖 말씀 체휼자');
  if (journal.length >= 21) badges.push('✨ 심정의 등대');

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    points,
    nextLevelPoints: nextLevel.points,
    progressPct,
    badges
  };
};
