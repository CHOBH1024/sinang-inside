import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Award, Zap, Star } from 'lucide-react';
import { calculateUserLevel, UserLevelInfo } from '../utils/gamification';

export const UserLevelCard = () => {
  const [levelInfo, setLevelInfo] = useState<UserLevelInfo | null>(null);

  useEffect(() => {
    setLevelInfo(calculateUserLevel());
  }, []);

  if (!levelInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#111e17] to-[#0b130f] rounded-3xl p-6 sm:p-8 border border-[#0d5c3a]/30 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#b8860b]/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0d5c3a]/10 rounded-full blur-[40px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* 좌측: 레벨 및 타이틀 */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0d5c3a] to-[#10b981] rounded-2xl rotate-3 shadow-[0_0_20px_rgba(13,92,58,0.4)] flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-black text-white transform -rotate-3">Lv.{levelInfo.level}</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#b8860b] rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Star size={12} className="text-white" fill="white" />
            </div>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-black text-[#b8860b] tracking-widest uppercase flex items-center gap-1.5 mb-1">
              <Award size={13} /> Faith Level
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-white">{levelInfo.title}</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">총 {levelInfo.points.toLocaleString()} XP 누적</p>
          </div>
        </div>

        {/* 우측: 프로그레스 바 및 뱃지 */}
        <div className="w-full md:w-[40%] space-y-4">
          <div>
            <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-400 mb-2">
              <span>현재 경험치 {levelInfo.points}</span>
              {levelInfo.level < 10 ? (
                <span>다음 레벨까지 {levelInfo.nextLevelPoints - levelInfo.points} XP</span>
              ) : (
                <span className="text-[#b8860b]">최고 레벨 도달!</span>
              )}
            </div>
            <div className="h-2.5 bg-[#0b130f] rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progressPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#0d5c3a] to-[#b8860b] rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>
          </div>
          
          {levelInfo.badges.length > 0 && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {levelInfo.badges.map((badge, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="shrink-0 px-2.5 py-1 text-[10px] sm:text-xs font-bold bg-[#b8860b]/10 border border-[#b8860b]/30 rounded-full text-[#b8860b] flex items-center gap-1"
                >
                  {badge}
                </motion.span>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </motion.div>
  );
};
