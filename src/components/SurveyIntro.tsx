import { SurveyConfig } from '../types';
import { ArrowLeft, Clock, BookOpen, Tag, ChevronRight } from 'lucide-react';
import { themeMap } from '../theme';
import { blogPosts } from '../data/blogPosts';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface SurveyIntroProps {
  survey: SurveyConfig;
  onBack: () => void;
  onStart: (mode: number) => void;
}

export const SurveyIntro = ({ survey, onBack, onStart }: SurveyIntroProps) => {
  const t = themeMap[survey.color] || themeMap['blue'];
  const post = blogPosts[survey.id];
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const triggerHaptic = (pattern: number | number[]) => {
    if (navigator.vibrate) navigator.vibrate(pattern);
  };

  const handleStart = (mode: number) => {
    triggerHaptic([20, 40]);
    onStart(mode);
  };

  return (
    <article ref={containerRef} className="min-h-[100dvh] bg-slate-50 dark:bg-[#0a0a0c] flex flex-col relative">
      {/* Floating Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 z-30 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center border border-white/10"
      >
        <ArrowLeft size={18} />
      </button>

      {/* ── Apple-style Parallax Hero Header ── */}
      <motion.header 
        style={{ y: headerY, opacity: headerOpacity }}
        className="relative overflow-hidden pt-20 pb-12 px-6 bg-white dark:bg-black rounded-b-[3rem] shadow-sm z-10"
      >
        <div className={`absolute inset-0 ${t.bgBg} opacity-10`} />
        
        <div className="relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-5 ${t.bgBg} ${t.text} border ${t.border}`}
          >
            {survey.name}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight word-keep tracking-tight"
          >
            {survey.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed word-keep font-medium"
          >
            {survey.subtitle}
          </motion.p>
        </div>
      </motion.header>

      {/* ── Google Material You Smart Buttons ── */}
      <div className="px-5 -mt-6 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800 rounded-[2rem] p-3 shadow-2xl"
        >
          <div className="space-y-2">
            {/* 일반 진단 버튼 */}
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => handleStart(6)}
              className="w-full relative overflow-hidden flex items-center justify-between px-6 py-5 rounded-[1.5rem] bg-gradient-to-r from-[#0d5c3a] to-[#2a6f97] text-white transition-all shadow-lg hover:shadow-[#0d5c3a]/20 cursor-pointer"
            >
              <div className="text-left relative z-10">
                <p className="text-white font-black text-lg flex items-center gap-2">
                  일반 진단 <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-bold">6문항</span>
                </p>
                <p className="text-white/80 text-[11px] font-bold mt-1">신앙 성향 & 심정 스펙트럼 · 약 1분 소요</p>
              </div>
              <ChevronRight size={20} className="text-white/80 relative z-10" />
            </motion.button>

            {/* 학술 연구자 진단 버튼 */}
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => handleStart(12)}
              className="w-full relative overflow-hidden flex items-center justify-between px-6 py-5 rounded-[1.5rem] bg-slate-900 dark:bg-slate-800 border border-slate-700 text-white transition-all cursor-pointer group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem]" />
              <div className="text-left relative z-10">
                <p className="text-white font-black text-lg flex items-center gap-2">
                  🔬 학술 연구자 버전
                  <span className="text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full font-bold tracking-wide">12문항</span>
                </p>
                <p className="text-slate-400 text-[11px] font-bold mt-1">올포트 · 프랭클 · 융 · 매슬로 · 로어 · 가드너 학술 지표 포함 · 약 3분</p>
              </div>
              <ChevronRight size={20} className="text-slate-500 group-hover:text-white transition-colors relative z-10" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── Magazine Style Blog Content (SEO / AdSense) ── */}
      {post && (
        <div className="flex-1 px-6 py-12 relative z-0">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-10 pb-5 border-b border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
            <span className="flex items-center gap-1.5"><BookOpen size={12} /> 신앙인사이드 학술 칼럼</span>
          </div>

          <div className="space-y-16">
            {post.sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, rotateX: 25, y: 40 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
                style={{ transformOrigin: 'top center' }}
              >
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-5 leading-snug word-keep flex flex-col gap-3">
                  <span className="text-4xl">{section.emoji}</span>
                  {section.heading}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-[1.8] word-keep font-medium">
                  {section.body}
                </p>
                {section.highlight && (
                  <motion.blockquote 
                    whileHover={{ scale: 1.02, x: 10 }}
                    className={`mt-6 p-5 rounded-2xl bg-white dark:bg-slate-900 border-l-4 ${t.border} shadow-sm`}
                  >
                    <p className={`font-black text-[15px] italic leading-relaxed word-keep ${t.text}`}>
                      "{section.highlight}"
                    </p>
                  </motion.blockquote>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
              <Tag size={12} /> 발견할 수 있는 페르소나
            </div>
            <div className="flex flex-wrap gap-2">
              {post.relatedPersonas.map((persona, idx) => (
                <span key={idx} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                  {persona}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
