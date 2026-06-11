import { useState, useMemo } from 'react';
import { ArrowLeft, HeartHandshake, Sparkles, AlertTriangle, ShieldCheck, RefreshCcw } from 'lucide-react';
import { personaDirectoryData, PersonaListItem } from '../data/personaData';
import { motion, AnimatePresence } from 'motion/react';

interface PersonaMatcherProps {
  onBack: () => void;
}

export const PersonaMatcher = ({ onBack }: PersonaMatcherProps) => {
  const [selectedP1, setSelectedP1] = useState<PersonaListItem | null>(null);
  const [selectedP2, setSelectedP2] = useState<PersonaListItem | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // 모든 63개 페르소나 리스트 1차원으로 병합
  const allPersonas = useMemo(() => {
    return Object.values(personaDirectoryData).flat();
  }, []);

  const handleSelect = (p: PersonaListItem, slot: 1 | 2) => {
    if (slot === 1) setSelectedP1(p);
    else setSelectedP2(p);
    setShowResult(false);
  };

  const calculateMatch = () => {
    if (!selectedP1 || !selectedP2) return null;
    
    // 단순 해시 함수로 일관된 점수 생성
    const combinedStr = [selectedP1.name, selectedP2.name].sort().join('-');
    let hash = 0;
    for (let i = 0; i < combinedStr.length; i++) {
      hash = ((hash << 5) - hash) + combinedStr.charCodeAt(i);
      hash = hash & hash;
    }
    
    // 50 ~ 99 사이의 점수
    const score = 50 + (Math.abs(hash) % 50);
    
    let grade = '';
    let emoji = '';
    let description = '';
    let synergy = '';
    let conflict = '';

    if (score >= 90) {
      grade = '천일국 영혼의 단짝';
      emoji = '💖';
      description = `두 분은 서로의 부족함을 완벽히 채워주는 최고의 영적 파트너입니다. ${selectedP1.name}의 강점과 ${selectedP2.name}의 강점이 만나면 세상에 큰 빛을 발할 수 있습니다.`;
      synergy = '서로 눈빛만 봐도 통하는 깊은 심정적 교류';
      conflict = '서로 너무 의지하다가 공동체의 다른 이들을 놓칠 수 있으니 주의하세요.';
    } else if (score >= 75) {
      grade = '환상의 시너지 파트너';
      emoji = '✨';
      description = `상당히 좋은 궁합입니다! 서로 다른 신앙적 관점을 존중하며 함께할 때 섭리적 시너지가 폭발합니다. ${selectedP1.tags[0]}와 ${selectedP2.tags[0]}의 결합이 훌륭합니다.`;
      synergy = '각자의 강점이 부딪히지 않고 상호 보완적인 톱니바퀴처럼 굴러갑니다.';
      conflict = '목표가 다를 때는 이견이 발생할 수 있으니 충분한 훈독과 대화가 필요합니다.';
    } else if (score >= 60) {
      grade = '상호 보완적 성장 관계';
      emoji = '🌱';
      description = `서로의 차이점이 오히려 큰 배움의 기회가 되는 관계입니다. ${selectedP1.name}의 방식이 ${selectedP2.name}에게 신선한 충격을 줄 수 있습니다.`;
      synergy = '나에게 없는 섭리적 통찰을 상대방을 통해 배울 수 있습니다.';
      conflict = '때로는 서로의 접근 방식(수직vs수평) 차이로 인해 서운함을 느낄 수 있습니다.';
    } else {
      grade = '십자가를 함께 지는 동지';
      emoji = '⚔️';
      description = `서로의 신앙 스펙트럼이 매우 다릅니다. 하지만 다름을 인정하고 품어낼 때, 그 어느 관계보다 단단한 참사랑의 열매를 맺을 수 있습니다.`;
      synergy = '양극단의 시각이 합쳐져 가장 완벽한 중용의 길을 찾을 수 있습니다.';
      conflict = '초기에는 소통의 언어가 달라 잦은 충돌과 오해가 생길 수 있으니 인내가 필수입니다.';
    }

    return { score, grade, emoji, description, synergy, conflict };
  };

  const handleMatchStart = () => {
    if (!selectedP1 || !selectedP2) return;
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      setShowResult(true);
    }, 2000);
  };

  const result = calculateMatch();

  return (
    <div className="bg-[#0b130f] min-h-[100dvh] pb-24 font-sans text-slate-100">
      <header className="sticky top-0 z-40 bg-[#0d5c3a]/80 backdrop-blur-xl border-b border-[#b8860b]/20 px-6 py-4 flex items-center justify-between shadow-lg">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <span className="font-extrabold text-white flex items-center gap-2">
          <HeartHandshake size={18} className="text-[#b8860b]" /> 신앙 페르소나 궁합
        </span>
        <div className="w-10"></div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">식구 간 영성 시너지 매칭</h1>
          <p className="text-slate-400 text-sm">63가지 신앙 페르소나 중 2개를 선택하여 섭리적 호환성과 궁합을 확인해보세요.</p>
        </div>

        {/* ── 선택 영역 ── */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
          {/* Slot 1 */}
          <div className="w-full md:w-1/2 bg-[#111e17] rounded-[2rem] p-6 border border-[#0d5c3a]/30 shadow-lg text-center relative overflow-hidden">
            <h3 className="text-[#b8860b] font-bold text-sm mb-4">나의 페르소나</h3>
            {selectedP1 ? (
              <div className="space-y-2">
                <div className="text-5xl mb-2">{selectedP1.emoji}</div>
                <p className="text-xl font-bold text-white">{selectedP1.name}</p>
                <button onClick={() => { setSelectedP1(null); setShowResult(false); }} className="text-xs text-slate-400 underline mt-2">변경하기</button>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-2 text-left">
                {allPersonas.map((p, i) => (
                  <button key={i} onClick={() => handleSelect(p, 1)} className="w-full bg-[#0b130f] hover:bg-[#0d5c3a]/20 border border-[#0d5c3a]/20 p-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer">
                    <span className="text-xl">{p.emoji}</span>
                    <span className="text-sm font-bold text-slate-200 truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-3xl text-[#b8860b]">
            <HeartHandshake className="animate-pulse" />
          </div>

          {/* Slot 2 */}
          <div className="w-full md:w-1/2 bg-[#111e17] rounded-[2rem] p-6 border border-[#0d5c3a]/30 shadow-lg text-center relative overflow-hidden">
            <h3 className="text-[#b8860b] font-bold text-sm mb-4">상대방 페르소나</h3>
            {selectedP2 ? (
              <div className="space-y-2">
                <div className="text-5xl mb-2">{selectedP2.emoji}</div>
                <p className="text-xl font-bold text-white">{selectedP2.name}</p>
                <button onClick={() => { setSelectedP2(null); setShowResult(false); }} className="text-xs text-slate-400 underline mt-2">변경하기</button>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-2 text-left">
                {allPersonas.map((p, i) => (
                  <button key={i} onClick={() => handleSelect(p, 2)} className="w-full bg-[#0b130f] hover:bg-[#0d5c3a]/20 border border-[#0d5c3a]/20 p-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer">
                    <span className="text-xl">{p.emoji}</span>
                    <span className="text-sm font-bold text-slate-200 truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 분석 버튼 ── */}
        {!showResult && selectedP1 && selectedP2 && (
          <div className="text-center">
            <button
              onClick={handleMatchStart}
              disabled={isMatching}
              className="px-8 py-4 bg-gradient-to-r from-[#0d5c3a] to-[#b8860b] text-white font-extrabold rounded-2xl text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              {isMatching ? (
                <><RefreshCcw className="animate-spin" /> 신앙 스펙트럼 분석 중...</>
              ) : (
                <><Sparkles /> 두 페르소나 궁합 보기</>
              )}
            </button>
          </div>
        )}

        {/* ── 결과 영역 ── */}
        <AnimatePresence>
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111e17] rounded-[2.5rem] p-8 sm:p-12 border border-[#b8860b]/40 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#b8860b]/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="text-center border-b border-[#0d5c3a]/30 pb-8 mb-8">
                <span className="text-[100px] leading-none mb-4 block">{result.emoji}</span>
                <h2 className="text-3xl font-black text-white mb-2">{result.grade}</h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-sm font-bold text-slate-400">궁합 지수</span>
                  <span className="text-3xl font-black text-[#b8860b]">{result.score}%</span>
                </div>
                <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto word-keep leading-relaxed">
                  {result.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#0b130f] p-6 rounded-3xl border border-emerald-900/40">
                  <h3 className="flex items-center gap-2 text-emerald-400 font-bold mb-3">
                    <ShieldCheck size={20} /> 시너지 포인트
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed word-keep">{result.synergy}</p>
                </div>
                <div className="bg-[#0b130f] p-6 rounded-3xl border border-rose-900/40">
                  <h3 className="flex items-center gap-2 text-rose-400 font-bold mb-3">
                    <AlertTriangle size={20} /> 주의 및 갈등 요소
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed word-keep">{result.conflict}</p>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};
