/**
 * 영성 묵상 일지 저장소 (localStorage 기반)
 * 추후 Supabase 연동 시 이 파일의 스토리지 함수만 교체
 */

export interface JournalEntry {
  id: string;
  date: string;        // ISO 날짜 (YYYY-MM-DD)
  timestamp: number;
  title: string;
  content: string;
  mood: '감사' | '기쁨' | '평화' | '성찰' | '도전' | '회개' | '소망';
  tags: string[];
  wordRef?: string;    // 참조 말씀 (선택)
  isPrivate: boolean;
}

const JOURNAL_KEY = 'sinang_inside_journal';

export const getMoodEmoji = (mood: JournalEntry['mood']): string => ({
  '감사': '🙏', '기쁨': '😊', '평화': '☮️',
  '성찰': '🪞', '도전': '⚔️', '회개': '💧', '소망': '🌟'
})[mood] ?? '📖';

export const getMoodColor = (mood: JournalEntry['mood']): string => ({
  '감사': '#b8860b', '기쁨': '#f59e0b', '평화': '#06b6d4',
  '성찰': '#6366f1', '도전': '#f43f5e', '회개': '#10b981', '소망': '#8b5cf6'
})[mood] ?? '#0d5c3a';

export const getJournal = (): JournalEntry[] => {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveJournalEntry = (entry: Omit<JournalEntry, 'id' | 'timestamp'>): JournalEntry => {
  const journal = getJournal();
  const newEntry: JournalEntry = {
    ...entry,
    id: Math.random().toString(36).slice(2, 9),
    timestamp: Date.now(),
  };
  const updated = [newEntry, ...journal].slice(0, 100); // 최대 100건
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
  return newEntry;
};

export const deleteJournalEntry = (id: string): void => {
  const journal = getJournal().filter(e => e.id !== id);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
};

export const updateJournalEntry = (id: string, updates: Partial<JournalEntry>): void => {
  const journal = getJournal().map(e => e.id === id ? { ...e, ...updates } : e);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
};
