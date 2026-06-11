import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, PenLine, Trash2, Plus, Save, Search,
  BookOpen, Calendar, Tag, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  JournalEntry, getJournal, saveJournalEntry, deleteJournalEntry,
  getMoodEmoji, getMoodColor
} from '../utils/journalStorage';
import { getDailyWord } from '../data/dailyWord';
import { TermifiedText } from './TermifiedText';

const MOODS: JournalEntry['mood'][] = ['감사', '기쁨', '평화', '성찰', '도전', '회개', '소망'];

const SUGGESTED_TAGS = [
  '#훈독', '#기도', '#봉사', '#전도', '#가정예배', '#정성', '#말씀체휼',
  '#축복가정', '#훈독회', '#고향섭리', '#종족메시아', '#심정일기'
];

interface FaithJournalProps {
  onBack: () => void;
}

export const FaithJournal = ({ onBack }: FaithJournalProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => getJournal());
  const [view, setView] = useState<'list' | 'write' | 'detail'>('list');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<JournalEntry['mood'] | 'all'>('all');

  // 작성 폼 상태
  const todayWord = useMemo(() => getDailyWord(), []);
  const [form, setForm] = useState({
    title: '',
    content: '',
    mood: '감사' as JournalEntry['mood'],
    tags: [] as string[],
    wordRef: '',
    isPrivate: true,
  });
  const [tagInput, setTagInput] = useState('');

  const refresh = useCallback(() => setEntries(getJournal()), []);

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    saveJournalEntry({
      date: new Date().toISOString().slice(0, 10),
      ...form,
    });
    refresh();
    setForm({ title: '', content: '', mood: '감사', tags: [], wordRef: '', isPrivate: true });
    setView('list');
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('이 일지를 삭제하시겠습니까?')) return;
    deleteJournalEntry(id);
    refresh();
    setView('list');
    setSelectedEntry(null);
  };

  const addTag = (tag: string) => {
    const t = tag.startsWith('#') ? tag : '#' + tag;
    if (!form.tags.includes(t)) setForm(f => ({ ...f, tags: [...f.tags, t] }));
    setTagInput('');
  };

  const filteredEntries = useMemo(() => {
    let e = entries;
    if (filterMood !== 'all') e = e.filter(x => x.mood === filterMood);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      e = e.filter(x => x.title.toLowerCase().includes(q) || x.content.toLowerCase().includes(q));
    }
    return e;
  }, [entries, filterMood, searchQuery]);

  return (
    <div className="bg-[#0b130f] min-h-[100dvh] text-slate-100 font-sans">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-[#0b130f]/90 backdrop-blur-xl border-b border-[#0d5c3a]/30 px-4 sm:px-6 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={view !== 'list' ? () => setView('list') : onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 font-black text-white">
            <PenLine size={18} className="text-[#b8860b]" />
            {view === 'write' ? '새 묵상 일지 작성' : view === 'detail' ? '묵상 보기' : '영성 묵상 일지'}
          </div>
          {view === 'list' && (
            <button
              onClick={() => setView('write')}
              className="p-2 bg-[#b8860b] hover:bg-[#d4a017] rounded-full transition-colors cursor-pointer"
            >
              <Plus size={18} className="text-white" />
            </button>
          )}
          {view === 'write' && (
            <button
              onClick={handleSave}
              disabled={!form.title.trim() || !form.content.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0d5c3a] hover:bg-[#0f764a] rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Save size={15} /> 저장
            </button>
          )}
          {view === 'detail' && selectedEntry && (
            <button
              onClick={() => handleDelete(selectedEntry.id)}
              className="p-2 hover:bg-rose-500/10 rounded-full transition-colors text-slate-500 hover:text-rose-400 cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">

          {/* ── 목록 뷰 ── */}
          {view === 'list' && (
            <motion.div key="list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              {/* 검색 + 필터 */}
              <div className="space-y-3 mb-6">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="제목, 내용으로 검색..."
                    className="w-full bg-[#111e17] border border-[#0d5c3a]/30 focus:border-[#b8860b] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  <button
                    onClick={() => setFilterMood('all')}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterMood === 'all' ? 'bg-[#0d5c3a] text-white' : 'bg-[#111e17] text-slate-400 border border-[#0d5c3a]/20'}`}
                  >
                    전체
                  </button>
                  {MOODS.map(m => (
                    <button
                      key={m}
                      onClick={() => setFilterMood(filterMood === m ? 'all' : m)}
                      className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${filterMood === m ? 'bg-[#0d5c3a] text-white' : 'bg-[#111e17] text-slate-400 border border-[#0d5c3a]/20'}`}
                    >
                      {getMoodEmoji(m)} {m}
                    </button>
                  ))}
                </div>
              </div>

              {filteredEntries.length > 0 ? (
                <div className="space-y-3">
                  {filteredEntries.map((entry, i) => (
                    <motion.button
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => { setSelectedEntry(entry); setView('detail'); }}
                      className="w-full text-left bg-[#111e17] rounded-2xl p-5 border border-[#0d5c3a]/20 hover:border-[#b8860b]/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                          <div>
                            <p className="font-bold text-white text-sm leading-tight">{entry.title}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{entry.date} · {entry.mood}</p>
                          </div>
                        </div>
                        <ChevronDown size={14} className="text-slate-600 group-hover:text-[#b8860b] transition-colors shrink-0 mt-1 -rotate-90" />
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{entry.content}</p>
                      {entry.tags.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap mt-3">
                          {entry.tags.map((t, j) => (
                            <span key={j} className="text-[10px] px-2 py-0.5 bg-[#0d5c3a]/20 border border-[#0d5c3a]/30 rounded-full text-emerald-400">{t}</span>
                          ))}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <div className="text-5xl mb-4">✍️</div>
                  <p className="text-slate-500 font-bold">
                    {searchQuery || filterMood !== 'all' ? '검색 결과가 없습니다.' : '첫 묵상 일지를 작성해보세요!'}
                  </p>
                  {!searchQuery && filterMood === 'all' && (
                    <button
                      onClick={() => setView('write')}
                      className="mt-4 px-6 py-3 bg-[#0d5c3a] hover:bg-[#0f764a] rounded-2xl font-bold text-sm text-white transition-colors cursor-pointer"
                    >
                      + 새 일지 작성
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ── 작성 뷰 ── */}
          {view === 'write' && (
            <motion.div key="write" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
              
              {/* 오늘의 말씀 힌트 */}
              <div className="bg-[#111e17] rounded-2xl p-4 border border-[#b8860b]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={13} className="text-[#b8860b]" />
                  <span className="text-[10px] font-black text-[#b8860b] tracking-widest">TODAY'S HOON DOK</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{todayWord.text}"</p>
                <p className="text-[10px] text-slate-500 mt-1 text-right">— {todayWord.source}</p>
                <button
                  onClick={() => setForm(f => ({ ...f, wordRef: `${todayWord.source}: "${todayWord.text}"` }))}
                  className="mt-2 text-[10px] text-[#b8860b] hover:underline cursor-pointer"
                >
                  이 말씀을 오늘 일지에 연결하기 →
                </button>
              </div>

              {/* 기분 선택 */}
              <div>
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-2">
                  <Tag size={13} /> 오늘의 마음 상태
                </label>
                <div className="flex gap-2 flex-wrap">
                  {MOODS.map(m => (
                    <button
                      key={m}
                      onClick={() => setForm(f => ({ ...f, mood: m }))}
                      style={{ borderColor: form.mood === m ? getMoodColor(m) : undefined, backgroundColor: form.mood === m ? getMoodColor(m) + '25' : undefined }}
                      className={`px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border flex items-center gap-1 ${form.mood === m ? 'text-white' : 'bg-[#111e17] text-slate-400 border-[#0d5c3a]/20'}`}
                    >
                      {getMoodEmoji(m)} {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* 제목 */}
              <div>
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-2">
                  <PenLine size={13} /> 제목 *
                </label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="오늘의 묵상 제목"
                  className="w-full bg-[#111e17] border border-[#0d5c3a]/30 focus:border-[#b8860b] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none"
                />
              </div>

              {/* 내용 */}
              <div>
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-2">
                  <BookOpen size={13} /> 묵상 내용 *
                </label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="오늘 하늘부모님께서 내게 주신 말씀, 깨달음, 결단을 자유롭게 적어보세요..."
                  rows={8}
                  className="w-full bg-[#111e17] border border-[#0d5c3a]/30 focus:border-[#b8860b] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none leading-relaxed resize-none"
                />
                <p className="text-[10px] text-slate-600 text-right mt-1">{form.content.length}자</p>
              </div>

              {/* 참조 말씀 */}
              {form.wordRef ? (
                <div className="bg-[#0d5c3a]/10 border border-[#0d5c3a]/30 rounded-xl p-3 text-xs text-slate-400 leading-relaxed">
                  <span className="text-[#b8860b] font-bold">참조 말씀: </span>{form.wordRef}
                  <button onClick={() => setForm(f => ({ ...f, wordRef: '' }))} className="ml-2 text-slate-600 hover:text-white cursor-pointer">✕</button>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-2">
                    <BookOpen size={13} /> 참조 말씀 (선택)
                  </label>
                  <input
                    placeholder="예: 천성경 1편 - '사랑이 있는 곳에...'"
                    className="w-full bg-[#111e17] border border-[#0d5c3a]/30 focus:border-[#b8860b] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none"
                    onBlur={e => { if (e.target.value) setForm(f => ({ ...f, wordRef: e.target.value })); }}
                  />
                </div>
              )}

              {/* 태그 */}
              <div>
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-2">
                  <Tag size={13} /> 태그
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {SUGGESTED_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className={`text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${form.tags.includes(tag) ? 'bg-[#0d5c3a] border-[#0d5c3a] text-white' : 'bg-[#111e17] border-[#0d5c3a]/20 text-slate-500 hover:text-white'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((t, i) => (
                      <span key={i} className="flex items-center gap-1 text-[10px] px-2.5 py-1 bg-[#b8860b]/20 border border-[#b8860b]/40 rounded-full text-[#b8860b]">
                        {t}
                        <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))} className="cursor-pointer">✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSave}
                disabled={!form.title.trim() || !form.content.trim()}
                className="w-full py-4 bg-gradient-to-r from-[#0d5c3a] to-[#b8860b] hover:brightness-110 rounded-2xl font-black text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-all cursor-pointer active:scale-95"
              >
                <Save size={18} /> 오늘의 묵상 저장하기
              </button>
            </motion.div>
          )}

          {/* ── 상세 뷰 ── */}
          {view === 'detail' && selectedEntry && (
            <motion.div key="detail" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{getMoodEmoji(selectedEntry.mood)}</span>
                <div>
                  <h2 className="text-xl font-black text-white">{selectedEntry.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedEntry.date} · {selectedEntry.mood} · {new Date(selectedEntry.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {selectedEntry.wordRef && (
                <div className="bg-[#0d5c3a]/10 border border-[#0d5c3a]/30 rounded-xl p-4">
                  <p className="text-[10px] text-[#b8860b] font-black mb-1">📖 참조 말씀</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedEntry.wordRef}</p>
                </div>
              )}

              <div className="bg-[#111e17] rounded-2xl p-5 border border-[#0d5c3a]/20">
                <p className="text-sm text-slate-200 leading-relaxed word-keep whitespace-pre-wrap">
                  <TermifiedText text={selectedEntry.content} />
                </p>
              </div>

              {selectedEntry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.tags.map((t, i) => (
                    <span key={i} className="text-[10px] px-2.5 py-1 bg-[#b8860b]/20 border border-[#b8860b]/40 rounded-full text-[#b8860b]">{t}</span>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};
