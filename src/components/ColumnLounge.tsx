import { ArrowLeft, BookOpen, Search, Sparkles, Crown, ShieldCheck } from 'lucide-react';
import { seoPosts, diagnosticDeepDives } from '../data/seoContent';
import { motion } from 'motion/react';

interface ColumnLoungeProps {
  onBack: () => void;
}

export const ColumnLounge = ({ onBack }: ColumnLoungeProps) => {
  return (
    <div className="bg-[#0b130f] min-h-[100dvh] pb-24 font-sans text-slate-100 selection:bg-[#b8860b] selection:text-white">
      
      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-50 bg-[#0d5c3a]/80 backdrop-blur-xl border-b border-[#b8860b]/20 px-6 py-4 shadow-lg shadow-black/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="font-extrabold text-white flex items-center gap-2 text-sm sm:text-base tracking-wider">
            <BookOpen size={18} className="text-[#b8860b]" /> 신학 학술 칼럼 라운지
          </span>
        </div>
        <div className="flex gap-4 text-sm font-bold text-[#b8860b]">
          <a href="#columns" className="hover:text-[#fbbf24] transition-colors hidden sm:block">신학 칼럼</a>
          <a href="#deepdives" className="hover:text-[#fbbf24] transition-colors hidden sm:block">진단 심층 분석</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-24">
        
        {/* ── 히어로 섹션 ── */}
        <section className="text-center pt-8 pb-4 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0d5c3a]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              참부모 신학의 깊은 통찰,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8860b] to-[#fbbf24]">Sinang Inside Column Lounge</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto word-keep leading-relaxed">
              심정신학, 통일사상, 그리고 참부모 섭리가 결합된 전문적인 영적 통찰을 제공합니다.
              7대 진단 도구의 신학적 배경과 63가지 페르소나의 영적 의미를 탐구하세요.
            </p>
          </motion.div>
        </section>

        {/* ── 1. 신학 칼럼 ── */}
        <section id="columns" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-10 border-b border-[#0d5c3a]/30 pb-4">
            <Crown className="text-[#b8860b]" size={24} />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              신학 칼럼 시리즈
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {seoPosts.map((post) => (
              <article key={post.id} className="bg-[#111e17] rounded-3xl p-8 shadow-xl border border-[#0d5c3a]/30 hover:border-[#b8860b]/50 hover:shadow-[#0d5c3a]/10 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] bg-[#b8860b]/20 text-[#b8860b] px-2.5 py-1 rounded-full font-bold border border-[#b8860b]/30">{post.id.toUpperCase().replace('-','.')}</span>
                  {post.tags?.map((tag: string) => (
                    <span key={tag} className="text-[10px] text-slate-400 font-bold">{tag}</span>
                  ))}
                </div>
                <h3 className="text-xl font-black text-[#b8860b] mb-6 leading-tight">{post.title}</h3>
                <div className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap word-keep">
                  {post.content}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 2. 진단 심층 분석 ── */}
        <section id="deepdives" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-10 border-b border-[#0d5c3a]/30 pb-4">
            <ShieldCheck className="text-[#b8860b]" size={24} />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              7대 진단 심층 분석 (Deep-Dives)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagnosticDeepDives.map((deepdive, idx) => (
              <article key={idx} className="bg-[#111e17] rounded-3xl p-8 border border-[#0d5c3a]/30 hover:border-[#b8860b]/40 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] bg-[#0d5c3a]/30 text-[#b8860b] px-2.5 py-1 rounded-full font-bold border border-[#0d5c3a]/40">DEEP DIVE 0{idx + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-4 leading-snug">{deepdive.title}</h3>
                <div className="text-slate-400 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap word-keep">
                  {deepdive.content}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 푸터 ── */}
        <footer className="pt-8 text-center border-t border-[#0d5c3a]/20">
          <p className="text-[10px] text-slate-600">
            © 2026 Sinang Inside System. All rights reserved.
          </p>
        </footer>

      </main>
    </div>
  );
};
