import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, BookOpen, HandHeart, PenLine, CheckCircle2, Circle, Trophy, ChevronRight, Target } from 'lucide-react';
import { getDailyWord } from '../data/dailyWord';
import {
  getTodayPractice, setPractice, getStreakInfo,
  DailyPracticeRecord, StreakInfo,
} from '../utils/practiceStorage';
import {
  CHALLENGES, getChallengeById, getActiveChallenge, startChallenge,
  getCurrentDay, completeChallengeDay, ChallengeProgress,
} from '../data/challenges';

/**
 * 데일리 실천 허브 — "스스로 실천하는 신앙"의 심장.
 * 오늘의 훈독·기도·결심 체크인 + 연속 실천일(스트릭) + 진행 중인 21일 챌린지의 오늘 한 걸음.
 */
export const DailyPracticeHub = () => {
  const [today, setToday] = useState<DailyPracticeRecord | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [progress, setProgress] = useState<ChallengeProgress | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const word = getDailyWord();

  useEffect(() => {
    setToday(getTodayPractice());
    setStreak(getStreakInfo());
    setProgress(getActiveChallenge());
  }, []);

  const haptic = (n: number) => { if (navigator.vibrate) navigator.vibrate(n); };

  const toggle = (kind: keyof Omit<DailyPracticeRecord, 'date'>) => {
    if (!today) return;
    const next = !today[kind];
    const info = setPractice(kind, next);
    setToday({ ...today, [kind]: next });
    setStreak(info);
    haptic(next ? 25 : 10);
  };

  const handleStart = (id: string) => {
    setProgress(startChallenge(id));
    setShowPicker(false);
    haptic(30);
  };

  if (!today || !streak) return null;

  const checks: { key: keyof Omit<DailyPracticeRecord, 'date'>; icon: typeof BookOpen; label: string; hint: string }[] = [
    { key: 'hoondok',   icon: BookOpen,  label: '오늘의 훈독', hint: '말씀 한 구절 읽기' },
    { key: 'prayer',    icon: HandHeart, label: '오늘의 기도', hint: '하늘부모님과 만나기' },
    { key: 'reflected', icon: PenLine,   label: '오늘의 결심', hint: '감사·결심 한 줄' },
  ];
  const doneCount = checks.filter(c => today[c.key]).length;
  const allDone = doneCount === 3;

  // 진행 중 챌린지
  const course = progress ? getChallengeById(progress.challengeId) : undefined;
  const curDay = course && progress ? getCurrentDay(progress, course.duration) : 0;
  const todayStep = course && curDay > 0 ? course.days[curDay - 1] : null;
  const stepDoneToday = !!(progress?.lastCompletedDate === today.date);

  const handleCompleteStep = () => {
    if (!todayStep || stepDoneToday) return;
    const p = completeChallengeDay(todayStep.day);
    setProgress(p);
    if (!today.reflected) toggle('reflected'); else { setStreak(getStreakInfo()); }
    haptic(40);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#0d5c3a]/30 via-[#111e17] to-[#0b130f] rounded-[2rem] p-6 sm:p-8 border border-[#b8860b]/25 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-56 h-56 bg-[#b8860b]/8 rounded-full blur-[80px] pointer-events-none" />
      <div className="relative z-10">

        {/* ── 헤더 + 스트릭 ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-black text-[#b8860b] tracking-widest uppercase flex items-center gap-1.5 mb-1">
              <Target size={13} /> Daily Practice
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-white">오늘의 신앙 실천</h2>
          </div>
          <div className="flex flex-col items-center bg-[#0b130f]/70 border border-[#b8860b]/30 rounded-2xl px-4 py-2.5 shadow-lg">
            <div className="flex items-center gap-1.5">
              <Flame size={20} className={streak.current > 0 ? 'text-[#f59e0b]' : 'text-slate-600'} fill={streak.current > 0 ? '#f59e0b' : 'none'} />
              <span className="text-2xl font-black text-white">{streak.current}</span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 tracking-wider">연속 실천일</span>
          </div>
        </div>

        {/* ── 오늘의 말씀 (간략) ── */}
        <div className="bg-[#0b130f]/60 border border-[#0d5c3a]/30 rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-[#b8860b] tracking-widest uppercase">오늘의 훈독 말씀</span>
            <span className="text-[10px] px-2 py-0.5 bg-[#0d5c3a]/30 rounded-full text-emerald-400 font-bold">#{word.theme}</span>
          </div>
          <blockquote className="text-sm text-slate-200 leading-relaxed font-medium word-keep border-l-2 border-[#b8860b] pl-3">
            "{word.text}"
          </blockquote>
          <p className="text-[10px] text-slate-500 text-right mt-1.5">— {word.source}</p>
        </div>

        {/* ── 3대 데일리 체크인 ── */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
          {checks.map(({ key, icon: Icon, label, hint }) => {
            const done = today[key];
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
                  done
                    ? 'bg-[#0d5c3a]/40 border-[#b8860b]/50 shadow-lg shadow-[#0d5c3a]/20'
                    : 'bg-[#0b130f]/60 border-[#0d5c3a]/20 hover:border-[#b8860b]/30'
                }`}
              >
                <div className="relative">
                  <Icon size={22} className={done ? 'text-[#b8860b]' : 'text-slate-500'} />
                  <span className="absolute -top-2 -right-2">
                    {done
                      ? <CheckCircle2 size={14} className="text-emerald-400" fill="#0b130f" />
                      : <Circle size={14} className="text-slate-700" />}
                  </span>
                </div>
                <span className={`text-[11px] font-bold ${done ? 'text-white' : 'text-slate-400'}`}>{label}</span>
                <span className="text-[9px] text-slate-500 leading-tight text-center">{hint}</span>
              </button>
            );
          })}
        </div>

        {/* 완료 격려 */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div className="bg-[#b8860b]/15 border border-[#b8860b]/40 rounded-2xl px-4 py-3 text-center">
                <p className="text-sm font-bold text-[#fcd34d]">🎉 오늘의 실천 완료! 하늘이 기뻐하십니다.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 진행 중 챌린지 / 시작 ── */}
        {course && todayStep ? (
          <div className="bg-[#0b130f]/70 border border-[#0d5c3a]/30 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-[#b8860b] tracking-widest uppercase flex items-center gap-1.5">
                {course.emoji} {course.title}
              </span>
              <span className="text-[10px] font-bold text-slate-400">Day {todayStep.day} / {course.duration}</span>
            </div>
            {/* 진행 바 */}
            <div className="h-1.5 bg-[#0b130f] rounded-full overflow-hidden border border-white/5 mb-4">
              <div className="h-full bg-gradient-to-r from-[#0d5c3a] to-[#b8860b] rounded-full transition-all"
                   style={{ width: `${((progress!.completedDays.length) / course.duration) * 100}%` }} />
            </div>
            <h4 className="text-base font-bold text-white mb-1">{todayStep.title}</h4>
            <p className="text-sm text-slate-300 leading-relaxed word-keep mb-2">🎯 {todayStep.action}</p>
            <p className="text-xs text-slate-400 leading-relaxed word-keep mb-4 italic">🙏 {todayStep.prayer}</p>
            <button
              onClick={handleCompleteStep}
              disabled={stepDoneToday}
              className={`w-full py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
                stepDoneToday
                  ? 'bg-[#0d5c3a]/30 text-emerald-400 cursor-default'
                  : 'bg-[#b8860b] hover:bg-[#d4a017] text-white shadow-lg active:scale-95 cursor-pointer'
              }`}
            >
              {stepDoneToday
                ? <><CheckCircle2 size={16} /> 오늘 실천 완료 — 내일 또 만나요</>
                : <>오늘의 실천 완료하기 <ChevronRight size={16} /></>}
            </button>
          </div>
        ) : course && curDay === 0 ? (
          <div className="bg-[#b8860b]/10 border border-[#b8860b]/40 rounded-2xl p-5 text-center">
            <Trophy size={28} className="text-[#b8860b] mx-auto mb-2" />
            <p className="text-sm font-bold text-white mb-1">{course.title} 완주! 🏆</p>
            <p className="text-xs text-slate-400 mb-3">21일의 정성, 하늘이 기억하십니다.</p>
            <button onClick={() => setShowPicker(true)}
              className="text-xs font-bold text-[#b8860b] hover:underline cursor-pointer">
              새로운 챌린지 시작하기 →
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPicker(true)}
            className="w-full bg-[#0b130f]/70 border border-dashed border-[#b8860b]/40 hover:border-[#b8860b]/70 rounded-2xl p-5 text-center transition-all cursor-pointer group"
          >
            <Target size={24} className="text-[#b8860b] mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-bold text-white mb-0.5">21일 신앙 실천 챌린지 시작하기</p>
            <p className="text-xs text-slate-400">매일 한 걸음씩, 스스로 실천하는 신앙으로</p>
          </button>
        )}

        {/* 하단 통계 */}
        <div className="flex justify-around mt-5 pt-4 border-t border-[#0d5c3a]/20 text-center">
          <div><p className="text-lg font-black text-white">{streak.current}</p><p className="text-[9px] text-slate-500 font-bold">현재 연속</p></div>
          <div><p className="text-lg font-black text-white">{streak.longest}</p><p className="text-[9px] text-slate-500 font-bold">최장 연속</p></div>
          <div><p className="text-lg font-black text-white">{streak.totalDays}</p><p className="text-[9px] text-slate-500 font-bold">누적 실천일</p></div>
        </div>
      </div>

      {/* ── 챌린지 선택 모달 ── */}
      <AnimatePresence>
        {showPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPicker(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-[#111e17] rounded-3xl border border-[#b8860b]/40 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10"
            >
              <div className="bg-gradient-to-r from-[#0d5c3a] to-[#0b130f] p-5 border-b border-[#b8860b]/20">
                <h3 className="text-lg font-black text-white">나에게 맞는 21일 챌린지</h3>
                <p className="text-xs text-slate-400 mt-0.5">하나를 골라 오늘 첫 걸음을 떼어보세요.</p>
              </div>
              <div className="p-4 overflow-y-auto space-y-3">
                {CHALLENGES.map(c => (
                  <button key={c.id} onClick={() => handleStart(c.id)}
                    className="w-full text-left bg-[#0b130f] border border-[#0d5c3a]/30 hover:border-[#b8860b]/50 rounded-2xl p-4 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-2xl">{c.emoji}</span>
                      <div className="flex-grow">
                        <h4 className="text-sm font-bold text-white group-hover:text-[#b8860b] transition-colors">{c.title}</h4>
                        <span className="text-[10px] text-[#b8860b] font-bold">#{c.axis} · {c.duration}일</span>
                      </div>
                      <ChevronRight size={16} className="text-[#b8860b] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed word-keep">{c.summary}</p>
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-[#0d5c3a]/20 flex justify-end">
                <button onClick={() => setShowPicker(false)}
                  className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2 cursor-pointer">닫기</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
