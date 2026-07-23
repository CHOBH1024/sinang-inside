import { UserInfo } from '../types';

export interface SurveyHistoryRecord {
  id: string; // unique id for the record
  surveyId: string;
  surveyTitle: string;
  personaName: string;
  emoji: string;
  timestamp: number;
  userInfo?: UserInfo;
}

const STORAGE_KEY = 'sinang_inside_history';

export const getHistory = (): SurveyHistoryRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as SurveyHistoryRecord[];
    }
  } catch (e) {
    console.error('Failed to read history from local storage', e);
  }
  return [];
};

export const saveHistory = (record: Omit<SurveyHistoryRecord, 'id' | 'timestamp'>) => {
  try {
    const history = getHistory();
    const newRecord: SurveyHistoryRecord = {
      ...record,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    // 가장 최근 기록이 맨 앞에 오도록 추가하고 최대 5개까지만 유지
    const updatedHistory = [newRecord, ...history].slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error('Failed to save history to local storage', e);
  }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear history from local storage', e);
  }
};
