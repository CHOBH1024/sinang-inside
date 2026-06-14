/**
 * 데일리 신앙 실천 저장소 (localStorage 기반)
 * "스스로 실천하는 신앙" 엔진의 심장 — 매일의 훈독·기도 체크인과 연속 실천일(스트릭)을 관리한다.
 * 추후 Supabase 연동 시 이 파일의 함수만 교체.
 */

export interface DailyPracticeRecord {
  date: string;       // 로컬 기준 YYYY-MM-DD
  hoondok: boolean;   // 오늘의 말씀 훈독 완료
  prayer: boolean;    // 기도 완료
  reflected: boolean; // 한 줄 결심/감사 작성 완료
}

export interface StreakInfo {
  current: number;    // 현재 연속 실천일
  longest: number;    // 최장 연속 실천일
  totalDays: number;  // 누적 실천일
  practicedToday: boolean;
}

const PRACTICE_KEY = 'sinang_inside_practice';

/** 로컬 타임존 기준 YYYY-MM-DD */
export const dateKey = (d: Date = new Date()): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const getPracticeLog = (): Record<string, DailyPracticeRecord> => {
  try {
    const raw = localStorage.getItem(PRACTICE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, DailyPracticeRecord>) : {};
  } catch {
    return {};
  }
};

const writeLog = (log: Record<string, DailyPracticeRecord>) => {
  try {
    localStorage.setItem(PRACTICE_KEY, JSON.stringify(log));
  } catch (e) {
    console.error('Failed to save practice log', e);
  }
};

export const getTodayPractice = (): DailyPracticeRecord => {
  const key = dateKey();
  const log = getPracticeLog();
  return log[key] ?? { date: key, hoondok: false, prayer: false, reflected: false };
};

/** 하루의 실천이 "성립"하는 기준: 셋 중 하나라도 완료 */
const isPracticed = (r?: DailyPracticeRecord): boolean =>
  !!r && (r.hoondok || r.prayer || r.reflected);

/** 특정 실천 항목 토글/세팅 후, 최신 스트릭 정보를 반환 */
export const setPractice = (
  kind: keyof Omit<DailyPracticeRecord, 'date'>,
  value: boolean
): StreakInfo => {
  const key = dateKey();
  const log = getPracticeLog();
  const today = log[key] ?? { date: key, hoondok: false, prayer: false, reflected: false };
  log[key] = { ...today, [kind]: value };
  writeLog(log);
  return getStreakInfo();
};

export const getStreakInfo = (): StreakInfo => {
  const log = getPracticeLog();
  const days = Object.values(log).filter(isPracticed).map(r => r.date).sort();
  const totalDays = days.length;
  const daySet = new Set(days);

  // 현재 연속일: 오늘(또는 어제)부터 거꾸로 세기
  let current = 0;
  const cursor = new Date();
  if (!daySet.has(dateKey(cursor))) {
    // 오늘 아직 안 했으면 어제까지의 연속이 유지된 것으로 본다
    cursor.setDate(cursor.getDate() - 1);
  }
  while (daySet.has(dateKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // 최장 연속일
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const ds of days) {
    const d = new Date(ds + 'T00:00:00');
    if (prev) {
      const diff = Math.round((d.getTime() - prev.getTime()) / 86400000);
      run = diff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = d;
  }

  return { current, longest, totalDays, practicedToday: daySet.has(dateKey()) };
};
