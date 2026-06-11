import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Flame, TrendingUp, Award } from 'lucide-react';
import { getHistory, SurveyHistoryRecord } from '../utils/historyStorage';

interface FaithCalendarProps {
  compact?: boolean;
}

const WEEKS_TO_SHOW = 15; // 약 3.5개월
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const FaithCalendar = ({ compact = false }: FaithCalendarProps) => {
  const history = useMemo(() => getHistory(), []);

  // 날짜별 진단 횟수 맵 생성
  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};
    history.forEach(r => {
      const date = new Date(r.timestamp).toLocaleDateString('ko-KR');
      map[date] = (map[date] || 0) + 1;
    });
    return map;
  }, [history]);

  // 오늘부터 역산하여 WEEKS_TO_SHOW주 분량의 날짜 배열 생성
  const calendarGrid = useMemo(() => {
    const today = new Date();
    const totalDays = WEEKS_TO_SHOW * 7;
    const days: { date: Date; count: number; label: string }[] = [];

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const label = d.toLocaleDateString('ko-KR');
      days.push({ date: d, count: activityMap[label] || 0, label });
    }
    return days;
  }, [activityMap]);

  // 주별로 묶기
  const weeks = useMemo(() => {
    const result: typeof calendarGrid[] = [];
    for (let i = 0; i < calendarGrid.length; i += 7) {
      result.push(calendarGrid.slice(i, i + 7));
    }
    return result;
  }, [calendarGrid]);

  // 통계
  const stats = useMemo(() => {
    const total = history.length;
    const uniqueDays = Object.keys(activityMap).length;
    
    // 연속 정성 계산
    let streak = 0;
    const today = new Date();
    for (let i = 0; i <= 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const label = d.toLocaleDateString('ko-KR');
      if (activityMap[label]) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return { total, uniqueDays, streak };
  }, [history, activityMap]);

  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-[#0b130f] border border-[#0d5c3a]/10';
    if (count === 1) return 'bg-[#0d5c3a]/40 border border-[#0d5c3a]/40';
    if (count === 2) return 'bg-[#0d5c3a]/70 border border-[#0d5c3a]/60';
    return 'bg-[#0d5c3a] border border-[#b8860b]/30 shadow-sm shadow-[#b8860b]/10';
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-[#111e17] rounded-3xl p-5 sm:p-6 border border-[#0d5c3a]/30 shadow-lg">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0d5c3a]/40 rounded-lg flex items-center justify-center">
            <Calendar size={14} className="text-[#b8860b]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#b8860b] tracking-widest uppercase">Faith Discipline</p>
            <p className="text-[10px] text-slate-600">신앙 정성 히트맵</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {stats.streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/30 rounded-full px-2.5 py-1">
              <Flame size={11} className="text-orange-400" />
              <span className="text-[10px] font-black text-orange-400">{stats.streak}일 연속</span>
            </div>
          )}
        </div>
      </div>

      {/* 통계 3개 */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: '총 진단', value: stats.total, icon: TrendingUp, unit: '회' },
          { label: '활동 일수', value: stats.uniqueDays, icon: Calendar, unit: '일' },
          { label: '최장 연속', value: stats.streak, icon: Award, unit: '일' },
        ].map((s, i) => (
          <div key={i} className="bg-[#0b130f] rounded-2xl p-3 text-center border border-[#0d5c3a]/20">
            <s.icon size={14} className="text-[#b8860b] mx-auto mb-1" />
            <p className="text-xl font-black text-white">{s.value}<span className="text-xs text-slate-500 ml-0.5">{s.unit}</span></p>
            <p className="text-[10px] text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      {history.length > 0 ? (
        <div>
          {/* 요일 레이블 */}
          <div className="flex gap-1 mb-1.5 ml-0">
            {DAYS.map(d => (
              <div key={d} className="w-[14px] text-center text-[8px] text-slate-700 font-bold flex-shrink-0">{d}</div>
            ))}
          </div>
          
          {/* 주별 셀 */}
          <div className="flex gap-1 overflow-x-auto hide-scrollbar pb-2">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1 flex-shrink-0">
                {week.map((day, di) => (
                  <motion.div
                    key={di}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (wi * 7 + di) * 0.003 }}
                    title={`${day.date.toLocaleDateString('ko-KR')} — ${day.count > 0 ? day.count + '회 진단' : '미진단'}`}
                    className={`w-[14px] h-[14px] rounded-[3px] transition-all cursor-pointer hover:scale-125 relative ${getCellColor(day.count)} ${isToday(day.date) ? 'ring-1 ring-[#b8860b]' : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* 범례 */}
          <div className="flex items-center justify-end gap-2 mt-3">
            <span className="text-[9px] text-slate-600">적음</span>
            {[0, 1, 2, 3].map(n => (
              <div key={n} className={`w-3 h-3 rounded-[2px] ${getCellColor(n)}`} />
            ))}
            <span className="text-[9px] text-slate-600">많음</span>
          </div>
        </div>
      ) : (
        <div className="py-10 text-center">
          <div className="text-4xl mb-3">🌱</div>
          <p className="text-slate-500 text-sm font-bold">아직 진단 기록이 없습니다</p>
          <p className="text-slate-600 text-xs mt-1">첫 진단을 완료하면 나만의 신앙 정성 잔디가 자라납니다!</p>
        </div>
      )}
    </div>
  );
};
