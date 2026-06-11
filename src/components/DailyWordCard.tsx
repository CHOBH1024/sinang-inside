import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, RefreshCcw, Share2, Sparkles } from 'lucide-react';
import { getDailyWord, getRandomWord, DailyWord } from '../data/dailyWord';

interface DailyWordCardProps {
  compact?: boolean; // 대시보드 삽입용 컴팩트 모드
}

export const DailyWordCard = ({ compact = false }: DailyWordCardProps) => {
  const [word, setWord] = useState<DailyWord>(getDailyWord());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setWord(getRandomWord());
      setIsRefreshing(false);
      if (navigator.vibrate) navigator.vibrate(15);
    }, 400);
  }, []);

  const handleShare = useCallback(async () => {
    const text = `📖 오늘의 훈독 말씀\n\n"${word.text}"\n\n— ${word.source}\n\n신앙인사이드 sinang-inside.vercel.app`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
      if (navigator.vibrate) navigator.vibrate(20);
    } catch (e) {
      // ignore
    }
  }, [word]);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111e17] rounded-3xl p-5 sm:p-6 border border-[#0d5c3a]/30 shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#b8860b]/5 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#b8860b]/20 rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-[#b8860b]" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#b8860b] tracking-widest uppercase">Today's Hoon Dok</span>
              <p className="text-[10px] text-slate-600">{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}</p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 bg-[#0d5c3a]/20 border border-[#0d5c3a]/30 rounded-full text-emerald-400 font-bold">
            #{word.theme}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={word.text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <blockquote className="text-sm text-slate-200 leading-relaxed font-medium word-keep mb-3 border-l-2 border-[#b8860b] pl-3">
              "{word.text}"
            </blockquote>
            <p className="text-[10px] text-slate-500 text-right">— {word.source}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleRefresh}
            className="flex-1 py-2 bg-[#0b130f] border border-[#0d5c3a]/30 hover:border-[#b8860b]/40 rounded-xl text-[11px] font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCcw size={11} className={isRefreshing ? 'animate-spin' : ''} />
            다른 말씀
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-2 bg-[#b8860b]/10 border border-[#b8860b]/30 hover:border-[#b8860b]/60 rounded-xl text-[11px] font-bold text-[#b8860b] hover:text-[#d4a017] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 size={11} />
            {copied ? '복사됨 ✓' : '공유하기'}
          </button>
        </div>
      </motion.div>
    );
  }

  // 전체 화면 모드
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-[#0d5c3a] via-[#0b130f] to-[#111e17] rounded-[2.5rem] p-8 sm:p-12 border border-[#b8860b]/20 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#b8860b]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0d5c3a]/30 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#b8860b]/20 rounded-2xl flex items-center justify-center">
              <BookOpen size={22} className="text-[#b8860b]" />
            </div>
            <div>
              <h2 className="font-black text-white text-lg">오늘의 훈독 말씀</h2>
              <p className="text-[11px] text-slate-400">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-[#b8860b]/20 border border-[#b8860b]/30 rounded-full text-[11px] font-black text-[#b8860b] flex items-center gap-1">
            <Sparkles size={10} /> #{word.theme}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.blockquote
            key={word.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl font-bold text-white leading-relaxed word-keep mb-6 border-l-4 border-[#b8860b] pl-6 py-2"
          >
            "{word.text}"
          </motion.blockquote>
        </AnimatePresence>

        <p className="text-slate-400 text-sm text-right mb-8">— {word.source}</p>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="flex-1 py-3 bg-white/5 border border-white/10 hover:border-[#b8860b]/40 rounded-2xl text-sm font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCcw size={15} className={isRefreshing ? 'animate-spin' : ''} /> 다른 말씀 보기
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-3 bg-[#b8860b] hover:bg-[#d4a017] rounded-2xl text-sm font-black text-white transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95"
          >
            <Share2 size={15} /> {copied ? '복사됨 ✓' : '말씀 나누기'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
