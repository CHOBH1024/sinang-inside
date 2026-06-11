/**
 * 가정연합 인사기록 Admin 패널 전용 데이터 집계 유틸
 * historyStorage의 localStorage 데이터를 읽어 통계를 생성합니다.
 * Phase 3에서 Supabase 연동 시 이 파일의 getHistory()를 DB 쿼리로 교체합니다.
 */

import { SurveyHistoryRecord, getHistory } from './historyStorage';

export interface RegionStats {
  region: string;
  count: number;
  avgScore?: number;
  personas: string[];
}

export interface PersonaFrequency {
  personaName: string;
  emoji: string;
  count: number;
  surveyId: string;
}

export interface AdminStats {
  totalRecords: number;
  totalByRegion: RegionStats[];
  totalByPosition: { position: string; count: number }[];
  totalBySurvey: { surveyTitle: string; count: number }[];
  mostCommonPersonas: PersonaFrequency[];
  recentRecords: SurveyHistoryRecord[];
  completionRates: { surveyTitle: string; count: number; pct: number }[];
}

export const getAdminStats = (): AdminStats => {
  const all = getHistory();
  const total = all.length;

  // 교구별 집계
  const regionMap: Record<string, { count: number; personas: string[] }> = {};
  all.forEach(r => {
    const region = r.userInfo?.region ?? '미입력';
    if (!regionMap[region]) regionMap[region] = { count: 0, personas: [] };
    regionMap[region].count++;
    regionMap[region].personas.push(r.personaName);
  });
  const totalByRegion: RegionStats[] = Object.entries(regionMap)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([region, data]) => ({ region, count: data.count, personas: data.personas }));

  // 직책별 집계
  const positionMap: Record<string, number> = {};
  all.forEach(r => {
    const pos = r.userInfo?.position ?? '미입력';
    positionMap[pos] = (positionMap[pos] || 0) + 1;
  });
  const totalByPosition = Object.entries(positionMap)
    .sort((a, b) => b[1] - a[1])
    .map(([position, count]) => ({ position, count }));

  // 진단 도구별 집계
  const surveyMap: Record<string, number> = {};
  all.forEach(r => {
    surveyMap[r.surveyTitle] = (surveyMap[r.surveyTitle] || 0) + 1;
  });
  const totalBySurvey = Object.entries(surveyMap)
    .sort((a, b) => b[1] - a[1])
    .map(([surveyTitle, count]) => ({ surveyTitle, count }));

  // 완료율 (전체 대비 각 도구 비율)
  const completionRates = totalBySurvey.map(s => ({
    ...s,
    pct: total > 0 ? Math.round((s.count / total) * 100) : 0,
  }));

  // 페르소나 빈도
  const personaMap: Record<string, { count: number; emoji: string; surveyId: string }> = {};
  all.forEach(r => {
    if (!personaMap[r.personaName]) {
      personaMap[r.personaName] = { count: 0, emoji: r.emoji, surveyId: r.surveyId };
    }
    personaMap[r.personaName].count++;
  });
  const mostCommonPersonas: PersonaFrequency[] = Object.entries(personaMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([personaName, data]) => ({ personaName, emoji: data.emoji, count: data.count, surveyId: data.surveyId }));

  return {
    totalRecords: total,
    totalByRegion,
    totalByPosition,
    totalBySurvey,
    mostCommonPersonas,
    recentRecords: all.slice(0, 10),
    completionRates,
  };
};
