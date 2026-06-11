import { Users, ArrowLeft, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export const TeamSynergyDashboard = ({ onBack }: { onBack: () => void }) => {
  const teamData = [
    { subject: '심정영성', TeamAverage: 85, Ideal: 90 },
    { subject: '말씀체휼', TeamAverage: 65, Ideal: 80 },
    { subject: '참부모신학', TeamAverage: 90, Ideal: 85 },
    { subject: '구원섭리', TeamAverage: 55, Ideal: 75 },
    { subject: '실천자유', TeamAverage: 70, Ideal: 80 },
    { subject: '초종교평화', TeamAverage: 75, Ideal: 85 },
    { subject: '이상가정', TeamAverage: 88, Ideal: 85 },
  ];

  return (
    <div className="bg-[#0b130f] min-h-[100dvh] pb-24 text-slate-100 font-sans selection:bg-[#b8860b] selection:text-white">
      {/* 상단 바 */}
      <header className="sticky top-0 z-40 bg-[#0d5c3a]/80 backdrop-blur-xl border-b border-[#b8860b]/20 px-6 py-4 shadow-lg shadow-black/20 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <span className="font-extrabold text-white flex items-center gap-2 text-sm sm:text-base tracking-wider">
          <Users size={18} className="text-[#b8860b]" /> 우리 교회 팀 시너지 맵
        </span>
      </header>

      <main className="max-w-6xl mx-auto py-8 md:py-12 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 md:mb-12">
          <div className="p-3 md:p-4 bg-[#0d5c3a]/20 text-[#b8860b] rounded-xl md:rounded-2xl border border-[#0d5c3a]/30">
            <Users size={28} className="md:w-8 md:h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">교회 팀 시너지 맵</h1>
            <p className="text-sm md:text-base text-slate-400">우리 공동체 구성원 5명의 7대 영성 종합 역량 분석 대시보드</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 bg-[#111e17] p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-[#0d5c3a]/30 shadow-xl">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white flex items-center gap-2">
              <Sparkles size={18} className="text-[#b8860b]" /> 공동체 7대 영성 밸런스
            </h2>
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={teamData}>
                  <PolarGrid stroke="#0d5c3a" strokeOpacity={0.5} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#b8860b', fontSize: 12, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="팀 평균" dataKey="TeamAverage" stroke="#0d5c3a" fill="#0d5c3a" fillOpacity={0.5} strokeWidth={3} />
                  <Radar name="이상적 균형" dataKey="Ideal" stroke="#b8860b" fill="transparent" strokeDasharray="5 5" strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 justify-center mt-4 text-xs font-bold text-slate-400">
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#0d5c3a] rounded-sm"></div> 우리 팀 평균</div>
              <div className="flex items-center gap-2"><div className="w-4 h-0 border-t-2 border-dashed border-[#b8860b]"></div> 이상적 균형선</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0d5c3a]/20 p-6 rounded-3xl border border-[#0d5c3a]/30">
              <h3 className="font-black text-emerald-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck size={16} /> 공동체 강점
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed word-keep">
                우리 팀은 <strong className="text-[#b8860b]">참부모신학 이해도</strong>와 <strong className="text-[#b8860b]">이상가정 의지</strong>가 매우 뛰어납니다. 섭리적 목표가 주어지면 강력한 신앙적 추진력으로 돌파합니다.
              </p>
            </div>
            
            <div className="bg-rose-950/20 p-6 rounded-3xl border border-rose-900/30">
              <h3 className="font-black text-rose-400 mb-2 flex items-center gap-1.5">
                <Heart size={16} /> 보완이 필요한 영역
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed word-keep">
                <strong className="text-rose-400">구원섭리 균형</strong>과 <strong className="text-rose-400">말씀체휼 유연성</strong> 영역이 이상적 균형선보다 낮습니다. 탕감과 은사 사이의 균형 워크샵이 필요합니다.
              </p>
            </div>

            <div className="bg-[#111e17] p-6 rounded-3xl border border-[#0d5c3a]/30 shadow-md">
              <h3 className="font-bold text-white mb-4 text-sm">공동체 구성원 (5인)</h3>
              <ul className="space-y-3">
                {[
                  { name: '김 목회자', type: '🕊️ 심정 수도자', color: '#0d5c3a' },
                  { name: '이 집사', type: '📖 말씀 수호자', color: '#b8860b' },
                  { name: '박 권사', type: '👑 참부모 일체론자', color: '#0d5c3a' },
                  { name: '최 전도사', type: '⛪ 초종교 평화인', color: '#b8860b' },
                  { name: '정 청년', type: '🏠 이상가정 실천가', color: '#0d5c3a' },
                ].map((member, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border border-[#0d5c3a]/30" style={{ backgroundColor: `${member.color}20` }}>
                      {member.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">{member.name}</p>
                      <p className="text-[10px] text-[#b8860b]">{member.type}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
