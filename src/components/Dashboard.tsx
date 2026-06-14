import { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, Clock, Compass, Users, Sparkles, Star, Brain, 
  Crown, Zap, Shield, Heart, CheckCircle, ChevronRight, 
  FileText, BarChart3, Search, BookOpen, X, Info 
} from 'lucide-react';
import { SurveyConfig } from '../types';
import { surveys } from '../data/surveys';
import { seoBio, mirrorIntros } from '../data/seoContent';
import { motion, AnimatePresence } from 'motion/react';
import { personaDirectoryData, PersonaListItem } from '../data/personaData';
import { getHistory, SurveyHistoryRecord } from '../utils/historyStorage';
import { DailyWordCard } from './DailyWordCard';
import { FaithCalendar } from './FaithCalendar';
import { UserLevelCard } from './UserLevelCard';
import { DailyPracticeHub } from './DailyPracticeHub';

interface DashboardProps {
  onSelectSurvey: (config: SurveyConfig) => void;
  onNavigate?: (route: 'team' | 'admin' | 'columns' | 'balanceGame' | 'matcher' | 'journal') => void;
}

const tabKeywords: Record<string, string[]> = {
  'survey-spirituality': ['#수직영성', '#심정공명', '#기도정성', '#참사랑실천', '#공동체나눔'],
  'survey-word': ['#원리보존', '#경전훈독', '#시대적해석', '#삶의말씀화', '#창의적소통'],
  'survey-theology': ['#참아버님정통', '#성혼섭리관', '#독생녀신학', '#천일국안착', '#효정정신'],
  'survey-salvation': ['#5퍼센트책임', '#탕감조건', '#혈통전환', '#안착의은사', '#해원상생'],
  'survey-freedom': ['#절대신앙', '#귀일정신', '#양심의자유', '#자유의지', '#창의적실천'],
  'survey-peace': ['#교단정체성', '#원리전도', '#초종교연대', '#평화대사', '#보편적인류애'],
  'survey-family': ['#삼대권완성', '#순결축복', '#가정교회', '#공적사명', '#제물생애'],
};

export const Dashboard = ({ onSelectSurvey, onNavigate }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<string>('survey-spirituality');
  const [selectedPersona, setSelectedPersona] = useState<PersonaListItem | null>(null);
  const [history, setHistory] = useState<SurveyHistoryRecord[]>([]);
  const directoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const triggerHaptic = (pattern: number | number[]) => {
    if (navigator.vibrate) navigator.vibrate(pattern);
  };

  const handleSelectSurvey = (id: string) => {
    triggerHaptic(20);
    const survey = surveys.find(s => s.id === id);
    if (survey) {
      onSelectSurvey(survey);
    }
  };

  const handleBrowsePersona = (id: string) => {
    triggerHaptic(15);
    setActiveTab(id);
    if (directoryRef.current) {
      directoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#0b130f] min-h-[100dvh] pb-20 font-sans text-slate-100 selection:bg-[#b8860b] selection:text-white">
      
      {/* ── 상단 네비게이션 ── */}
      <header className="sticky top-0 z-40 bg-[#0d5c3a]/80 backdrop-blur-xl border-b border-[#b8860b]/20 px-6 py-4 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm font-bold">
          <span className="text-white flex items-center gap-2 text-base md:text-lg tracking-wider font-extrabold uppercase">
            <span className="text-[#b8860b] text-xl">🛐</span> 신앙인사이드 <span className="text-xs bg-[#b8860b]/20 text-[#b8860b] px-2 py-0.5 rounded border border-[#b8860b]/40 font-mono">SINANG INSIDE</span>
          </span>
          <div className="flex gap-3 sm:gap-6 text-[#b8860b] hover:text-[#fbbf24] transition-colors">
            <button 
              onClick={() => onNavigate && onNavigate('journal')}
              className="hover:underline flex items-center gap-1 text-sm font-bold"
            >
              ✍️ 묵상 일지
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('columns')}
              className="hover:underline flex items-center gap-1 text-sm font-bold"
            >
              <BookOpen size={16} /> 신학 칼럼
            </button>
          </div>
        </div>
      </header>

      {/* 전체 메인 레이아웃 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 sm:space-y-24">
        
        {/* ── 0. 신앙 레벨 카드 (게이미피케이션) ── */}
        <UserLevelCard />

        {/* ── 0.5. 데일리 실천 허브 (스스로 실천하는 신앙 엔진) ── */}
        <DailyPracticeHub />

        {/* ── 1. Hero Section (전체 설명) ── */}
        <section className="text-center space-y-6 pt-8 pb-12 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#0d5c3a]/20 via-transparent to-transparent p-6 sm:p-10 border border-[#0d5c3a]/10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0d5c3a]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white flex flex-col items-center justify-center gap-2">
              <span className="text-[#b8860b] text-3xl font-bold tracking-[0.2em] uppercase mb-2">Theological Diagnostics</span>
              <span>신앙 성향 진단 허브</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto word-keep font-medium pt-2">
              {seoBio}
            </p>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <button
                onClick={() => onNavigate && onNavigate('balanceGame')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#b8860b] to-[#fbbf24] text-[#0b130f] hover:brightness-110 active:scale-95 transition-all font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-[#b8860b]/20 cursor-pointer"
              >
                ⚖️ 신앙 밸런스 게임 30선 시작하기
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* ── 1.5. 오늘의 훈독 말씀 카드 ── */}
        <DailyWordCard compact />

        {/* ── 2. 7 Diagnostics Grid (진단 도구 창) ── */}
        <section className="space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white inline-block relative tracking-wide">
              7대 독립적 신앙 진단 도구
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#b8860b] rounded-full"></div>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <button 
              onClick={() => onNavigate?.('matcher')}
              className="bg-[#111e17] rounded-3xl p-6 md:p-8 shadow-xl border border-[#0d5c3a]/20 hover:border-[#b8860b]/40 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#b8860b]/20 text-[#b8860b] rounded-xl flex items-center justify-center">
                  <Heart size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">페르소나 궁합 분석</h3>
                  <p className="text-sm text-slate-400">식구 간 섭리적 시너지 매칭</p>
                </div>
              </div>
              <ChevronRight className="text-[#b8860b] group-hover:translate-x-1 transition-transform" />
            </button>

            {mirrorIntros.map((mirror, index) => (
              <article 
                key={mirror.id} 
                className="bg-[#111e17] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#0d5c3a]/30 hover:border-[#b8860b]/50 hover:shadow-[#0d5c3a]/10 transition-all duration-300 flex flex-col h-full group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl bg-[#0d5c3a]/20 p-3.5 rounded-2xl border border-[#0d5c3a]/30 shadow-inner group-hover:scale-110 transition-transform">{mirror.emoji}</span>
                  <div className="text-left">
                    <span className="text-[10px] text-[#b8860b] font-bold tracking-widest uppercase">Survey 0{index + 1}</span>
                    <h3 className="text-xl font-bold text-white tracking-tight leading-snug">{mirror.title.split(' (')[0]}</h3>
                  </div>
                </div>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 flex-grow word-keep text-left">
                  {mirror.desc}
                </p>

                <div className="bg-[#0b130f] rounded-2xl p-4 mb-6 border border-[#0d5c3a]/20 text-left">
                  <p className="text-[11px] text-[#b8860b] font-bold mb-2.5 flex items-center gap-1.5"><Info size={12} /> 주요 측정 카테고리</p>
                  <ul className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-medium list-none">
                    {mirror.bullets?.slice(0, 4).map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 truncate">
                        <span className="text-[#b8860b] text-xs">·</span>
                        <span>{bullet.split(' 및 ')[0].split(' 지수')[0]}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {mirror.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-[#b8860b] bg-[#b8860b]/10 px-2.5 py-1 rounded-full border border-[#b8860b]/20">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => handleSelectSurvey(mirror.id)}
                    className="bg-gradient-to-r from-[#0d5c3a] to-[#2a6f97] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:brightness-110 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    진단 시작 <Zap size={14} />
                  </button>
                  <button 
                    onClick={() => handleBrowsePersona(mirror.id)}
                    className="bg-[#111e17] text-[#b8860b] font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-[#b8860b]/30 hover:bg-[#b8860b]/10 transition-colors cursor-pointer"
                  >
                    유형 칼럼 <BookOpen size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 3. 63 Persona Directory 탭 ── */}
        <section ref={directoryRef} className="bg-[#111e17] rounded-[2.5rem] p-6 lg:p-10 shadow-xl border border-[#0d5c3a]/20 scroll-mt-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">63 Persona Directory</h2>
            <p className="text-slate-400 text-sm">7가지 진단 도구별로 도출되는 63가지 신앙 성향 페르소나와 삶의 지침 칼럼을 탐색해보세요.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* 탭 네비게이션 (모바일: 가로 스크롤, PC: 세로) */}
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 hide-scrollbar lg:w-60 shrink-0 border-b lg:border-b-0 lg:border-r border-[#0d5c3a]/25 pr-0 lg:pr-6">
              {mirrorIntros.map((mirror) => (
                <button
                  key={mirror.id}
                  onClick={() => {
                    triggerHaptic(10);
                    setActiveTab(mirror.id);
                  }}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left whitespace-nowrap lg:whitespace-normal font-bold transition-all text-xs sm:text-sm cursor-pointer ${
                    activeTab === mirror.id 
                      ? 'bg-[#0d5c3a] text-white shadow-md border border-[#b8860b]/40' 
                      : 'bg-[#0b130f] text-slate-400 hover:bg-[#0d5c3a]/10 hover:text-white border border-[#0d5c3a]/10'
                  }`}
                >
                  <span className="text-lg">{mirror.emoji}</span>
                  <span>{mirror.title.split(' (')[0]}</span>
                </button>
              ))}
            </div>

            {/* 탭 콘텐츠 영역 */}
            <div className="flex-grow min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  <div className="bg-[#0b130f] border border-[#0d5c3a]/30 rounded-2xl p-5 text-left">
                    <p className="text-xs font-bold text-[#b8860b] mb-3.5 flex items-center gap-1.5">
                      <Sparkles size={14} /> 이 영역의 주요 신앙 키워드
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tabKeywords[activeTab]?.map((kw, i) => (
                        <span key={i} className="text-[11px] font-bold text-slate-300 bg-[#0d5c3a]/20 border border-[#0d5c3a]/40 px-3 py-1.5 rounded-lg shadow-sm">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personaDirectoryData[activeTab]?.map((persona, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => {
                          triggerHaptic(15);
                          setSelectedPersona(persona);
                        }}
                        className="bg-[#0b130f] border border-[#0d5c3a]/20 rounded-2xl p-5 hover:border-[#b8860b]/50 hover:shadow-lg hover:shadow-[#0d5c3a]/5 transition-all cursor-pointer text-left group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-base font-bold text-white group-hover:text-[#b8860b] transition-colors flex items-center gap-2">
                              <span>{persona.emoji}</span>
                              <span>{persona.name}</span>
                            </h4>
                            <span className="text-[10px] text-slate-500 font-mono">Level {idx + 1}</span>
                          </div>
                          <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed word-keep">
                            {persona.desc}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#0d5c3a]/10">
                          <div className="flex flex-wrap gap-1.5">
                            {persona.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] font-bold text-slate-400">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-[#b8860b] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                            칼럼 읽기 <ChevronRight size={12} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ── 4. 나의 최근 진단 기록 ── */}
        <section className="bg-[#111e17] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#0d5c3a]/20 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-14 h-14 bg-[#0d5c3a]/20 border border-[#0d5c3a]/30 rounded-2xl flex items-center justify-center text-3xl">🕒</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">최근 진단 기록</h3>
              <p className="text-slate-400 text-xs sm:text-sm">단말기에 저장된 최근의 신앙 진단 결과를 확인하세요.</p>
            </div>
          </div>
          <div className="w-full flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x">
            {history.length > 0 ? (
              history.map((record) => (
                <div 
                  key={record.id}
                  className="bg-[#0b130f] border border-[#0d5c3a]/30 rounded-2xl p-4 flex items-center justify-between min-w-[260px] max-w-[320px] shrink-0 snap-start"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{record.emoji}</span>
                    <div>
                      <p className="text-[10px] font-bold text-[#b8860b] mb-0.5">{record.surveyTitle}</p>
                      <p className="font-bold text-white text-sm truncate max-w-[150px]">{record.personaName}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{new Date(record.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#0b130f] border border-[#0d5c3a]/30 rounded-2xl p-4 flex items-center justify-center min-w-[260px] text-slate-500 text-sm italic">
                아직 진단 기록이 없습니다.
              </div>
            )}
          </div>
        </section>

        {/* ── 4.5. 신앙 정성 히트맵 ── */}
        <FaithCalendar />

        {/* ── 5. The Science Behind Sinang Inside (AdSense 학술 세팅) ── */}
        <section className="pb-10">
          <div className="bg-[#111e17] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#0d5c3a]/20 relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0d5c3a]/15 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-center">
                The Science Behind Sinang Inside
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm text-center max-w-3xl mx-auto word-keep leading-relaxed pb-6">
                본 진단은 세계평화통일가정연합의 참부모신학과 통일사상을 기반으로 선문대학교 및 선학UP대학원대학교의 학술 논문 분석 기법을 현대 종교사회학의 심계측학(Psychometrics) 프레임워크에 융합하여 정밀하게 성찰하도록 설계되었습니다.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4">
                <div className="space-y-2.5">
                  <h4 className="font-bold text-base flex items-center gap-2 text-[#b8860b]"><Crown size={16} /> 심정 신학적 6축 척도</h4>
                  <p className="text-slate-400 text-xs leading-relaxed word-keep">
                    개인의 심정 상태를 경전 훈독, 심정 공명, 탕감 조건, 독생녀 섭리관, 자율 양심, 초종교 평화 연대 등 6대 영역으로 계측합니다. 이를 통해 지엽적인 종교 행위를 넘어 근본적인 영성 궤도를 투사합니다.
                  </p>
                </div>
                <div className="space-y-2.5">
                  <h4 className="font-bold text-base flex items-center gap-2 text-[#b8860b]"><Brain size={16} /> 베이지안 일관성 필터</h4>
                  <p className="text-slate-400 text-xs leading-relaxed word-keep">
                    응답자가 기계적으로 답변하거나 사회적으로 좋아 보이는 가치를 임의 선택하는 왜곡 편향을 감지하기 위해 교차 질문 로직을 탑재했습니다. 답변 일관성에 기반해 63개의 성향 중 가장 적합한 페르소나를 매핑합니다.
                  </p>
                </div>
                <div className="space-y-2.5">
                  <h4 className="font-bold text-base flex items-center gap-2 text-[#b8860b]"><ShieldCheck size={16} /> 목회 행정적 혁신 피드백</h4>
                  <p className="text-slate-400 text-xs leading-relaxed word-keep">
                    진단 결과로 제공되는 강점, 약점, 성화 조언, 협력 가이드는 인사 개혁과 신앙 성장을 목표로 30년 이상의 목회 리더십 및 행정 경험이 축적된 실질적 피드백 시스템입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. 푸터 ── */}
        <footer className="pt-16 pb-8 text-center border-t border-[#0d5c3a]/20">
          <p className="text-xs text-slate-500 leading-relaxed max-w-xl mx-auto pb-4 word-keep">
            본 사이트의 모든 진단 분석 및 유형 칼럼은 참부모신학과 통일사상 연구의 대중적 성찰을 돕기 위한 보조 도구입니다. 개인의 삶을 참사랑의 지상 천국으로 복귀하고자 하는 모든 축복 식구들의 영성을 수호합니다.
          </p>
          <p className="text-[10px] text-slate-600">
            © 2026 Sinang Inside System. All rights reserved.
          </p>
        </footer>

      </main>

      {/* ── 9. Persona Detail Modal ── */}
      <AnimatePresence>
        {selectedPersona && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 배경 흐림 */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPersona(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* 모달 박스 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-2xl bg-[#111e17] rounded-3xl border border-[#b8860b]/40 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10"
            >
              {/* 상단 띠와 헤더 */}
              <div className="bg-gradient-to-r from-[#0d5c3a] to-[#0b130f] p-6 border-b border-[#b8860b]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedPersona.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedPersona.name}</h3>
                    <div className="flex gap-2 mt-1">
                      {selectedPersona.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-[#b8860b] bg-[#b8860b]/10 px-2 py-0.5 rounded border border-[#b8860b]/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPersona(null)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 스크롤 가능한 본문 */}
              <div className="p-6 overflow-y-auto space-y-6 text-left text-slate-200">
                <div className="bg-[#0b130f] p-4 rounded-xl border border-[#0d5c3a]/20">
                  <p className="text-xs font-bold text-[#b8860b] mb-1">한줄 정의</p>
                  <p className="font-bold text-white text-sm tracking-wide leading-relaxed word-keep">"{selectedPersona.headline}"</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-[#b8860b]">심층 분석 및 성화 칼럼 (500자 이상)</p>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-300 whitespace-pre-wrap word-keep">{selectedPersona.desc}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#0b130f]/60 p-4 rounded-xl border border-[#0d5c3a]/10">
                    <p className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1">✔ 핵심 강점</p>
                    <ul className="space-y-1.5 list-none pl-0 text-xs text-slate-300">
                      {selectedPersona.strengths?.map((str, i) => (
                        <li key={i} className="flex gap-1.5 items-start">
                          <span className="text-emerald-400">·</span>
                          <span className="leading-snug">{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#0b130f]/60 p-4 rounded-xl border border-[#0d5c3a]/10">
                    <p className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1">⚠ 취약한 한계점</p>
                    <ul className="space-y-1.5 list-none pl-0 text-xs text-slate-300">
                      {selectedPersona.weaknesses?.map((weak, i) => (
                        <li key={i} className="flex gap-1.5 items-start">
                          <span className="text-rose-400">·</span>
                          <span className="leading-snug">{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-[#b8860b]/10 p-5 rounded-2xl border border-[#b8860b]/30">
                  <p className="text-xs font-bold text-[#b8860b] mb-2 flex items-center gap-1.5">
                    💡 삶을 바꿀 영성 조언 (목회 행정 가이드)
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#fcd34d] font-medium word-keep">
                    {selectedPersona.advice}
                  </p>
                </div>
              </div>

              {/* 하단 단추 */}
              <div className="bg-[#0b130f] p-4 border-t border-[#0d5c3a]/20 flex justify-end">
                <button 
                  onClick={() => setSelectedPersona(null)}
                  className="bg-gradient-to-r from-[#0d5c3a] to-[#2a6f97] text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:brightness-110 transition-all cursor-pointer shadow-md"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
};
