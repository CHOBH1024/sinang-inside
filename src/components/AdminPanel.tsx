import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Activity, BarChart3, Users, Shield,
  TrendingUp, FileText, RefreshCcw, Download, Trash2,
  ChevronRight, Globe, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAdminStats, AdminStats } from '../utils/adminStats';
import { getHistory, clearHistory, SurveyHistoryRecord } from '../utils/historyStorage';

const COLORS = [
  '#0d5c3a', '#b8860b', '#6366f1', '#f43f5e', '#10b981',
  '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

export const AdminPanel = ({ onBack }: { onBack: () => void }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'region' | 'persona'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClearing, setIsClearing] = useState(false);

  const refresh = () => {
    setStats(getAdminStats());
  };

  useEffect(() => {
    refresh();
  }, []);

  const allRecords = useMemo(() => getHistory(), [stats]);
  
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return allRecords;
    const q = searchQuery.toLowerCase();
    return allRecords.filter(r =>
      r.personaName.toLowerCase().includes(q) ||
      (r.userInfo?.name?.toLowerCase().includes(q)) ||
      (r.userInfo?.region?.toLowerCase().includes(q)) ||
      (r.userInfo?.position?.toLowerCase().includes(q))
    );
  }, [allRecords, searchQuery]);

  const handleClearAll = () => {
    if (!window.confirm('모든 진단 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    setIsClearing(true);
    setTimeout(() => {
      clearHistory();
      refresh();
      setIsClearing(false);
    }, 500);
  };

  const exportToCSV = () => {
    const headers = ['성명', '소속 교구', '직책', '축복 기수', '진단 도구', '페르소나', '일시'];
    const rows = allRecords.map(r => [
      r.userInfo?.name ?? '-',
      r.userInfo?.region ?? '-',
      r.userInfo?.position ?? '-',
      r.userInfo?.generation ?? '-',
      r.surveyTitle,
      r.personaName,
      new Date(r.timestamp).toLocaleString()
    ]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sinang_inside_인사기록_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const tabs = [
    { id: 'overview' as const, label: '통계 개요', icon: Activity },
    { id: 'records' as const, label: '진단 기록', icon: FileText },
    { id: 'region' as const, label: '교구별 현황', icon: Globe },
    { id: 'persona' as const, label: '페르소나 분포', icon: Users },
  ];

  return (
    <div className="bg-[#0b130f] min-h-[100dvh] text-slate-100 font-sans pb-24">
      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-40 bg-[#0b130f]/90 backdrop-blur-xl border-b border-[#b8860b]/20 px-4 sm:px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-black text-white flex items-center gap-2 text-base sm:text-xl">
                <Shield size={20} className="text-[#b8860b]" /> 가정연합 인사기록 Admin
              </h1>
              <p className="text-[10px] text-slate-500 mt-0.5">HR 담당자 전용 · 영성 진단 종합 통계 패널</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refresh} className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-white">
              <RefreshCcw size={16} />
            </button>
            <button 
              onClick={exportToCSV}
              disabled={allRecords.length === 0}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#0d5c3a]/60 border border-[#0d5c3a]/40 hover:border-[#b8860b]/50 rounded-xl text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-40"
            >
              <Download size={16} /> CSV 내보내기
            </button>
            <button
              onClick={handleClearAll}
              disabled={allRecords.length === 0 || isClearing}
              className="p-2 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer text-slate-500 hover:text-rose-400 disabled:opacity-30"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── 요약 카드 3개 ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: '총 진단 완료', value: stats?.totalRecords ?? 0, unit: '건', icon: Activity, color: '#0d5c3a' },
            { label: '참여 진단 도구', value: stats?.totalBySurvey.length ?? 0, unit: '종', icon: BarChart3, color: '#b8860b' },
            { label: '참여 교구/기관', value: stats?.totalByRegion.length ?? 0, unit: '곳', icon: Globe, color: '#6366f1' },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#111e17] rounded-2xl p-5 border border-[#0d5c3a]/20 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.color + '30' }}>
                  <card.icon size={18} style={{ color: card.color }} />
                </div>
                <span className="text-xs text-slate-500 font-bold">{card.label}</span>
              </div>
              <p className="text-3xl font-black text-white">
                {card.value}<span className="text-base text-slate-400 ml-1">{card.unit}</span>
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── 탭 ── */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0d5c3a] text-white shadow-lg'
                  : 'bg-[#111e17] text-slate-400 hover:text-white border border-[#0d5c3a]/20'
              }`}
            >
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        {/* ── 탭 콘텐츠 ── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>

            {/* 통계 개요 */}
            {activeTab === 'overview' && stats && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* 진단 도구별 완료율 */}
                <div className="bg-[#111e17] rounded-3xl p-6 border border-[#0d5c3a]/20">
                  <h2 className="font-bold text-white flex items-center gap-2 mb-6">
                    <BarChart3 size={18} className="text-[#b8860b]" /> 진단 도구별 완료 현황
                  </h2>
                  {stats.completionRates.length > 0 ? (
                    <div className="space-y-4">
                      {stats.completionRates.map((s, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-300 font-bold truncate max-w-[200px]">{s.surveyTitle}</span>
                            <span className="text-[#b8860b] font-bold ml-2">{s.count}건 ({s.pct}%)</span>
                          </div>
                          <div className="h-2.5 bg-[#0b130f] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${s.pct}%` }}
                              transition={{ duration: 0.6, delay: i * 0.1 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: COLORS[i % COLORS.length] }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState />
                  )}
                </div>

                {/* 직책별 분포 */}
                <div className="bg-[#111e17] rounded-3xl p-6 border border-[#0d5c3a]/20">
                  <h2 className="font-bold text-white flex items-center gap-2 mb-6">
                    <TrendingUp size={18} className="text-[#b8860b]" /> 직책별 참여 분포
                  </h2>
                  {stats.totalByPosition.length > 0 ? (
                    <div className="space-y-3">
                      {stats.totalByPosition.slice(0, 7).map((p, i) => (
                        <div key={i} className="flex items-center justify-between gap-3">
                          <span className="text-slate-300 text-sm truncate max-w-[200px]">{p.position}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="h-2 rounded-full" style={{ width: `${Math.max(20, p.count * 20)}px`, backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-xs font-bold text-slate-400">{p.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </div>
            )}

            {/* 진단 기록 목록 */}
            {activeTab === 'records' && (
              <div className="bg-[#111e17] rounded-3xl p-6 border border-[#0d5c3a]/20">
                <div className="flex items-center justify-between mb-4 gap-3">
                  <h2 className="font-bold text-white flex items-center gap-2">
                    <FileText size={18} className="text-[#b8860b]" /> 인사 진단 기록
                  </h2>
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="이름, 교구, 직책 검색..."
                    className="w-48 sm:w-64 bg-[#0b130f] border border-[#0d5c3a]/30 focus:border-[#b8860b] rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 outline-none"
                  />
                </div>
                {filteredRecords.length > 0 ? (
                  <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredRecords.map((record, i) => (
                      <RecordCard key={record.id ?? i} record={record} />
                    ))}
                  </div>
                ) : (
                  <EmptyState msg={searchQuery ? '검색 결과가 없습니다.' : undefined} />
                )}
              </div>
            )}

            {/* 교구별 현황 */}
            {activeTab === 'region' && stats && (
              <div className="bg-[#111e17] rounded-3xl p-6 border border-[#0d5c3a]/20">
                <h2 className="font-bold text-white flex items-center gap-2 mb-6">
                  <Globe size={18} className="text-[#b8860b]" /> 교구 / 기관별 진단 현황
                </h2>
                {stats.totalByRegion.length > 0 ? (
                  <div className="space-y-4">
                    {stats.totalByRegion.map((r, i) => (
                      <div key={i} className="bg-[#0b130f] rounded-2xl p-4 border border-[#0d5c3a]/20">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-white">{r.region}</span>
                          <span className="text-[#b8860b] font-black text-lg">{r.count}<span className="text-xs text-slate-500 ml-1">건</span></span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set(r.personas)).slice(0, 5).map((p, j) => (
                            <span key={j} className="text-[10px] px-2 py-1 bg-[#0d5c3a]/20 border border-[#0d5c3a]/30 rounded-full text-slate-300">{p}</span>
                          ))}
                          {r.personas.length > 5 && <span className="text-[10px] text-slate-500">+{r.personas.length - 5}개</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>
            )}

            {/* 페르소나 분포 */}
            {activeTab === 'persona' && stats && (
              <div className="bg-[#111e17] rounded-3xl p-6 border border-[#0d5c3a]/20">
                <h2 className="font-bold text-white flex items-center gap-2 mb-6">
                  <Users size={18} className="text-[#b8860b]" /> 페르소나 빈도 분포 TOP 10
                </h2>
                {stats.mostCommonPersonas.length > 0 ? (
                  <div className="space-y-3">
                    {stats.mostCommonPersonas.map((p, i) => (
                      <div key={i} className="flex items-center gap-4 bg-[#0b130f] rounded-2xl p-4 border border-[#0d5c3a]/20">
                        <span className="text-3xl">{p.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm truncate">{p.personaName}</p>
                          <div className="mt-1.5 h-1.5 bg-[#111e17] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, p.count * 10)}%` }}
                              transition={{ duration: 0.5, delay: i * 0.05 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: COLORS[i % COLORS.length] }}
                            />
                          </div>
                        </div>
                        <span className="text-[#b8860b] font-black text-lg shrink-0">{p.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Supabase 안내 배너 */}
        <div className="mt-8 bg-[#111e17] rounded-2xl p-4 border border-[#6366f1]/20 flex items-start gap-3">
          <AlertTriangle size={18} className="text-[#6366f1] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#6366f1]">Phase 3: Supabase 클라우드 DB 연동 대기 중</p>
            <p className="text-xs text-slate-500 mt-1 word-keep">현재 데이터는 이 브라우저의 로컬 저장소에만 보관됩니다. Supabase URL/KEY를 <code className="text-slate-300">src/utils/supabaseClient.ts</code>에 입력하면 전국 통계를 중앙 DB로 수집할 수 있습니다.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// ── 서브 컴포넌트 ──────────────────────────────────────────────
const RecordCard = ({ record }: { record: SurveyHistoryRecord }) => (
  <div className="flex items-center gap-3 bg-[#0b130f] rounded-2xl p-4 border border-[#0d5c3a]/20">
    <span className="text-3xl shrink-0">{record.emoji}</span>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="font-bold text-white text-sm truncate">{record.personaName}</p>
        <span className="text-[10px] text-slate-500 shrink-0">{new Date(record.timestamp).toLocaleDateString()}</span>
      </div>
      <p className="text-[11px] text-[#b8860b] font-bold mt-0.5">{record.surveyTitle}</p>
      {record.userInfo && (
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
          {record.userInfo.name && <span className="text-[10px] text-slate-400">{record.userInfo.name}</span>}
          {record.userInfo.region && <span className="text-[10px] text-slate-500">{record.userInfo.region}</span>}
          {record.userInfo.position && <span className="text-[10px] text-slate-500">{record.userInfo.position}</span>}
        </div>
      )}
    </div>
    <ChevronRight size={14} className="text-slate-600 shrink-0" />
  </div>
);

const EmptyState = ({ msg }: { msg?: string }) => (
  <div className="py-16 text-center">
    <div className="text-5xl mb-4">📋</div>
    <p className="text-slate-500 font-bold">{msg ?? '아직 수집된 데이터가 없습니다.'}</p>
    <p className="text-slate-600 text-xs mt-2">진단을 완료하면 이 화면에 인사 기록이 쌓입니다.</p>
  </div>
);
