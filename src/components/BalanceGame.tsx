import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RefreshCcw, Share2, Sparkles, ChevronRight, Timer, Shuffle, Bookmark, HelpCircle, CheckCircle } from 'lucide-react';
import { balanceGameQuestions, balanceCategoryLabels, BalanceCategory, CategorizedBalanceQuestion } from '../data/balanceGameData';
import { motion, AnimatePresence } from 'motion/react';

interface BalanceGameProps {
  onBack: () => void;
}

interface UserChoice {
  questionId: number;
  selectedType: 'V' | 'H' | 'T' | 'M';
  text: string;
}

type GameMode = 'all-random' | 'category';

// ── Fisher-Yates 셔플 ──
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ── 대화 타이머 훅 ──
function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setElapsed(0);
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    setElapsed(0);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return { elapsed, formatTime: () => formatTime(elapsed), start, reset, stop, isRunning };
}

export const BalanceGame = ({ onBack }: BalanceGameProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [choices, setChoices] = useState<UserChoice[]>([]);
  const [showReflection, setShowReflection] = useState(false);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [gamePhase, setGamePhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [gameMode, setGameMode] = useState<GameMode>('all-random');
  const [selectedCategory, setSelectedCategory] = useState<BalanceCategory | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<CategorizedBalanceQuestion[]>([]);
  const [totalGameTime, setTotalGameTime] = useState(0);

  const timer = useTimer();

  const triggerHaptic = (pattern: number | number[]) => {
    if (navigator.vibrate) navigator.vibrate(pattern);
  };

  const handleStart = (mode: GameMode, category?: BalanceCategory) => {
    triggerHaptic([20, 40]);
    setGameMode(mode);
    setSelectedCategory(category || null);

    let questions: CategorizedBalanceQuestion[];
    if (mode === 'category' && category) {
      questions = shuffleArray(balanceGameQuestions.filter(q => q.category === category));
    } else {
      questions = shuffleArray(balanceGameQuestions);
    }

    setActiveQuestions(questions);
    setChoices([]);
    setCurrentIdx(0);
    setShowReflection(false);
    setSelectedOptionIdx(null);
    setGamePhase('play');
    setTotalGameTime(0);
    timer.start();
  };

  const handleSelectOption = (optIdx: number, type: 'V' | 'H' | 'T' | 'M', text: string) => {
    if (showReflection) return;
    triggerHaptic(20);
    setSelectedOptionIdx(optIdx);

    setChoices(prev => [
      ...prev.filter(c => c.questionId !== activeQuestions[currentIdx].id),
      { questionId: activeQuestions[currentIdx].id, selectedType: type, text }
    ]);

    setShowReflection(true);
  };

  const handleNext = () => {
    triggerHaptic(15);
    setShowReflection(false);
    setSelectedOptionIdx(null);
    timer.reset();

    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setTotalGameTime(timer.elapsed);
      timer.stop();
      setGamePhase('result');
    }
  };

  // ── 결과 계산 (9개 프로필 완전 매핑) ──
  const calculateResult = () => {
    const vCount = choices.filter(c => c.selectedType === 'V').length;
    const hCount = choices.filter(c => c.selectedType === 'H').length;
    const tCount = choices.filter(c => c.selectedType === 'T').length;
    const mCount = choices.filter(c => c.selectedType === 'M').length;

    const totalVH = vCount + hCount || 1;
    const totalTM = tCount + mCount || 1;

    const vPercent = Math.round((vCount / totalVH) * 100);
    const hPercent = 100 - vPercent;
    const tPercent = Math.round((tCount / totalTM) * 100);
    const mPercent = 100 - tPercent;

    // 9개 프로필 완전 매핑
    let profileName = "천일국 조화의 등대";
    let profileEmoji = "⚖️";
    let profileHeadline = "수직과 수평, 전통과 현대의 균형을 완성하는 지혜로운 신앙인";
    let profileDesc = "당신은 신앙에 있어서 특정한 가치에 치우치지 않는 온전한 중용과 참사랑의 실현을 지향합니다. 기도로 시작하여 봉사로 완성하고, 원리를 지키면서도 세상을 넓게 품어내는 태도는 공동체의 든든한 균형추입니다.";
    let profileStrengths = ["뛰어난 중재력과 조화로운 시각", "안정적이고 건강한 신앙 패턴 유지", "상황에 맞는 유연한 실천력"];
    let profileAdvice = "두 가지 방향을 다 챙기려다 에너지가 너무 분산될 수 있으니, 섭리적 결단이 시급한 시기에는 명확한 깃발을 꽂는 용기를 발휘해 보세요.";

    if (vPercent >= 70 && tPercent >= 70) {
      profileName = "고결한 정통 탕감 수호자";
      profileEmoji = "⚔️";
      profileHeadline = "원리의 절대성과 역사적 탕감 조건을 신앙의 뼈대로 삼는 정통파";
      profileDesc = "당신은 타협 없는 원리강론 자구 보존과, 뼈를 깎는 기도 정성 조건을 가장 소중히 여기는 진지한 구도자입니다. 참아버님의 탕감 승리 노정을 상속받아 살아가며 세속주의에 맞서는 방파제 역할을 합니다.";
      profileStrengths = ["타협 없는 교리적 순수성", "강인한 인내와 높은 조건정성 이행력", "강한 섭리 오너십"];
      profileAdvice = "엄격함이 타인을 정죄하는 율법주의로 흐르지 않도록, '무조건적인 참사랑과 용서'의 살을 뼈대 위에 따뜻하게 덧입히십시오.";
    } else if (vPercent >= 70 && mPercent >= 70) {
      profileName = "점진적 계시의 영적 사색가";
      profileEmoji = "🧘";
      profileHeadline = "수직적 기도 관계 속에서 살아있는 계시의 변화를 감지하는 사색가";
      profileDesc = "당신은 기도를 통한 종적인 영적 일체를 중시하면서도, 독생녀 신학이나 천일국 안착의 유연한 변화를 열린 마음으로 사색합니다. 매일의 묵상 속에서 큰 섭리의 방향을 체율합니다.";
      profileStrengths = ["깊은 명상적 영성과 1:1 관계성", "섭리 진전에 대한 높은 지적 적응력", "도덕적 차분함"];
      profileAdvice = "사색에만 머물지 마시고, 깨달은 비전을 이웃을 돕는 실질적인 활동으로 손발로 연계해 나가세요.";
    } else if (hPercent >= 70 && tPercent >= 70) {
      profileName = "가문 구원의 종족 전도사";
      profileEmoji = "🏠";
      profileHeadline = "일가친척을 축복으로 인도하여 가문의 주권을 복귀하려는 목회자";
      profileDesc = "당신은 축복의 가치와 순결 혈통의 중요성을 깊이 인식하며, 이를 가족과 친지들에게 직접 전파하여 신종족메시아 사명을 실현하는 데 온 삶을 던집니다.";
      profileStrengths = ["강력한 전도력과 가문에 대한 책임감", "배려 깊은 목회적 돌봄", "가정의 삼대권 가치 보존"];
      profileAdvice = "거대한 공적 섭리 전략과 초종교 평화 연대의 비전도 가문 복귀와 닿아 있음을 묵상하고 스케일을 넓히십시오.";
    } else if (hPercent >= 70 && mPercent >= 70) {
      profileName = "공생공영의 사회 혁신가";
      profileEmoji = "🌱";
      profileHeadline = "종교적 울타리를 허물고 참사랑으로 사회 정의를 구현하는 혁신가";
      profileDesc = "당신은 교리 암기를 거부하고, 참부모님이 선포하신 공생공영공의 이상을 사회 봉사, 환경 운동, 초종교 평화 활동을 통해 세상에 실체화하는 데 헌신합니다.";
      profileStrengths = ["압도적인 현장 실천성과 대외 소통력", "약자를 돕는 공평한 참사랑주의", "트렌디한 사역 기획"];
      profileAdvice = "사회 혁신이 세속 봉사 단체처럼 희석되지 않도록, 매주 훈독회를 통해 영적 정체성을 재충전하십시오.";
    } else if (vPercent >= 60 && tPercent >= 60) {
      profileName = "개척 정성의 기도 전사";
      profileEmoji = "🛐";
      profileHeadline = "고요한 골방의 기도와 전통 보존이 삶의 축인 신앙 수호자";
      profileDesc = "당신은 새벽 기도, 금식, 정성 조건을 통한 수직적 영성 강화와 원리의 원형을 지키는 것을 동시에 추구합니다. 흔들리지 않는 영적 근간을 제공합니다.";
      profileStrengths = ["탁월한 기도 인내력", "말씀 자구에 대한 높은 충성도", "공적 질서 의식"];
      profileAdvice = "골방의 기도가 세상을 품는 수평적 시야로 확장될 때, 진정으로 하늘의 기쁨이 완성됩니다.";
    } else if (vPercent >= 60 && mPercent >= 60) {
      profileName = "영적 혁신의 내면 탐험가";
      profileEmoji = "🔮";
      profileHeadline = "기도를 통해 새로운 섭리적 비전을 열어가는 내면 혁신가";
      profileDesc = "당신은 깊은 기도 생활을 유지하면서도 기존 제도나 해석에 안주하지 않고, 영적 감각을 통해 새로운 시대의 섭리적 방향을 모색합니다.";
      profileStrengths = ["높은 영적 감수성", "새로운 섭리관에 대한 개방성", "자기주도적 성찰력"];
      profileAdvice = "개인적 비전이 공동체의 공적 합의와 동떨어지지 않도록, 함께 기도하고 대화하는 시간을 늘리세요.";
    } else if (hPercent >= 60 && tPercent >= 60) {
      profileName = "전통 봉사의 목양 수호자";
      profileEmoji = "🐑";
      profileHeadline = "전통적 원리와 이웃 섬김을 양립하는 충직한 목양 신앙인";
      profileDesc = "당신은 원리의 전통적 해석을 굳건히 지키면서도 식구들의 아픔을 직접 현장에서 달래주는 따뜻한 목양의 마음을 지녔습니다.";
      profileStrengths = ["높은 공동체 신뢰도", "전통과 현장 봉사의 양립", "안정감 있는 리더십"];
      profileAdvice = "세상이 빠르게 변하는 시대에 젊은 세대와의 소통 언어도 함께 업데이트해 보세요.";
    } else if (hPercent >= 60 && mPercent >= 60) {
      profileName = "참사랑 문화의 트렌드세터";
      profileEmoji = "✨";
      profileHeadline = "현대적 감각으로 참사랑을 세상에 전파하는 문화 혁신가";
      profileDesc = "당신은 교리적 형식보다 삶 속에서 참사랑이 자연스럽게 흘러넘치는 것을 중시하며, SNS, 문화 콘텐츠, 청년 모임 등을 통해 신앙의 새로운 접점을 창조합니다.";
      profileStrengths = ["탁월한 문화적 감수성", "젊은 세대와의 소통력", "창의적 사역 기획력"];
      profileAdvice = "트렌디한 접근이 말씀의 깊은 뿌리와 단절되지 않도록, 정기적으로 원리강론을 정독하는 시간을 사수하세요.";
    }

    return { name: profileName, emoji: profileEmoji, headline: profileHeadline, desc: profileDesc, strengths: profileStrengths, advice: profileAdvice, vPercent, hPercent, tPercent, mPercent };
  };

  const res = calculateResult();
  const curQ = activeQuestions[currentIdx];

  const handleShare = () => {
    const text = `🛐 [신앙인사이드 밸런스게임] 완료!\n나의 신앙 밸런스 프로필은: "${res.name}" ${res.emoji}\n\n- 수직 영성: ${res.vPercent}%\n- 수평 실천: ${res.hPercent}%\n- 전통 보존: ${res.tPercent}%\n- 현대 안착: ${res.mPercent}%\n\n지금 테스트하러 가기 👉 https://sinang-inside.vercel.app`;
    if (navigator.share) {
      navigator.share({ title: `신앙 밸런스 게임 결과: ${res.name}`, text, url: 'https://sinang-inside.vercel.app' });
    } else {
      navigator.clipboard.writeText(text);
      alert('✨ 결과 분석 문구가 복사되었습니다! 카톡이나 SNS에 공유해보세요.');
    }
  };

  const categories = Object.entries(balanceCategoryLabels) as [BalanceCategory, typeof balanceCategoryLabels[BalanceCategory]][];

  return (
    <div className="bg-[#0b130f] min-h-[100dvh] pb-24 text-slate-100 flex flex-col font-sans selection:bg-[#b8860b] selection:text-white relative">
      
      {/* ── 상단 바 ── */}
      <header className="sticky top-0 z-40 bg-[#0d5c3a]/90 backdrop-blur-xl border-b border-[#b8860b]/20 px-6 py-4 flex items-center justify-between shadow-md">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-extrabold text-white flex items-center gap-1.5 text-sm sm:text-base tracking-wider">
          ⚖️ 신앙 밸런스 게임
        </span>
        {gamePhase === 'play' && (
          <div className="flex items-center gap-1.5 bg-[#b8860b]/20 px-3 py-1.5 rounded-full border border-[#b8860b]/30">
            <Timer size={14} className="text-[#b8860b]" />
            <span className="text-[#fbbf24] font-mono text-xs font-bold">{timer.formatTime()}</span>
          </div>
        )}
        {gamePhase !== 'play' && <div className="w-10"></div>}
      </header>

      {/* ── 메인 콘텐츠 ── */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-8 flex flex-col justify-center">
        
        {/* 1. INTRO PHASE */}
        {gamePhase === 'intro' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 py-6"
          >
            {/* 히어로 */}
            <div className="text-center space-y-4">
              <div className="text-7xl sm:text-8xl">⚖️</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight word-keep">
                나의 영성 밸런스는?<br />
                <span className="text-[#b8860b]">신앙 밸런스 게임</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed word-keep max-w-md mx-auto">
                30가지 신앙적 딜레마를 통해 나의 참부모 신학 지향성과 실천 스펙트럼의 진짜 모습을 탐험하세요. 매번 랜덤으로 섞여서 새로운 경험!
              </p>
            </div>

            {/* 게임 규칙 */}
            <div className="bg-[#111e17] border border-[#0d5c3a]/40 p-5 rounded-2xl text-left space-y-3 max-w-md mx-auto">
              <p className="text-xs font-bold text-[#b8860b] flex items-center gap-1.5"><Bookmark size={14} /> 게임 규칙</p>
              <ul className="text-xs text-slate-300 space-y-1.5 list-none pl-0">
                <li className="flex gap-2"><span>🎲</span> 카드가 매번 랜덤으로 셔플됩니다 — 매회 다른 순서!</li>
                <li className="flex gap-2"><span>⏱️</span> 카드별 대화 타이머가 표시됩니다. 가족·동지와 토론해보세요.</li>
                <li className="flex gap-2"><span>💡</span> 선택 후 신학적 성찰 코멘트가 즉시 노출됩니다.</li>
              </ul>
            </div>

            {/* 모드 선택 */}
            <div className="space-y-4 max-w-md mx-auto">
              {/* 완전 랜덤 */}
              <button
                onClick={() => handleStart('all-random')}
                className="w-full py-4 bg-gradient-to-r from-[#0d5c3a] to-[#b8860b] text-white font-extrabold text-base rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Shuffle size={18} /> 완전 랜덤 30문항 시작
              </button>

              {/* 분야별 선택 */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#b8860b] text-center flex items-center justify-center gap-1.5">
                  <Sparkles size={14} /> 또는 분야별 카드 선택
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {categories.map(([key, cat]) => {
                    const count = balanceGameQuestions.filter(q => q.category === key).length;
                    return (
                      <button
                        key={key}
                        onClick={() => handleStart('category', key)}
                        className="bg-[#111e17] border border-[#0d5c3a]/30 hover:border-[#b8860b]/50 rounded-xl p-3.5 text-left transition-all hover:bg-[#0d5c3a]/10 cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{cat.emoji}</span>
                          <span className="text-xs font-bold text-white group-hover:text-[#b8860b] transition-colors">{cat.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">{cat.desc}</p>
                        <span className="text-[10px] text-[#b8860b] font-bold mt-1 inline-block">{count}문항</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. PLAY PHASE */}
        {gamePhase === 'play' && curQ && (
          <div className="space-y-6 py-4">
            {/* 진행률 + 카테고리 뱃지 */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <span>Card {currentIdx + 1} / {activeQuestions.length}</span>
                  <span className="text-[10px] bg-[#0d5c3a]/30 text-[#b8860b] px-2 py-0.5 rounded-full border border-[#0d5c3a]/40">
                    {balanceCategoryLabels[curQ.category].emoji} {balanceCategoryLabels[curQ.category].name}
                  </span>
                </div>
                <span className="text-[#b8860b]">{Math.round(((currentIdx) / activeQuestions.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-[#0b130f] rounded-full border border-[#0d5c3a]/20 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0d5c3a] to-[#b8860b] transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* 대화 타이머 힌트 */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <Timer size={12} />
              <span>이 카드에서 <strong className="text-[#b8860b]">{timer.formatTime()}</strong> 대화 중</span>
              {timer.elapsed >= 120 && <span className="text-emerald-400 font-bold">🔥 깊은 토론!</span>}
              {timer.elapsed >= 60 && timer.elapsed < 120 && <span className="text-[#fbbf24] font-bold">💬 좋은 대화!</span>}
            </div>

            {/* 카드 질문 영역 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 50, rotate: 1 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: -50, rotate: -1 }}
                transition={{ duration: 0.3 }}
                className="bg-[#111e17] rounded-[2rem] p-6 sm:p-8 border border-[#0d5c3a]/30 shadow-xl space-y-6 flex flex-col items-center"
              >
                <div className="text-5xl bg-[#0d5c3a]/20 p-4 rounded-3xl border border-[#0d5c3a]/30 shadow-inner">
                  {curQ.emoji}
                </div>
                
                <h3 className="text-lg sm:text-xl font-extrabold text-white text-center leading-snug tracking-tight word-keep min-h-[50px] flex items-center">
                  "{curQ.question}"
                </h3>

                {/* 선택 옵션 박스 */}
                <div className="w-full flex flex-col gap-4">
                  {curQ.options.map((opt, oIdx) => {
                    const isSelected = selectedOptionIdx === oIdx;
                    const hasSelected = selectedOptionIdx !== null;
                    
                    let borderClass = "border-[#0d5c3a]/30 hover:border-[#b8860b]/40";
                    let bgClass = "bg-[#0b130f]/60 hover:bg-[#0d5c3a]/15";
                    
                    if (hasSelected) {
                      if (isSelected) {
                        borderClass = "border-[#b8860b] scale-[1.01] shadow-lg shadow-[#b8860b]/5";
                        bgClass = "bg-[#b8860b]/10 text-white";
                      } else {
                        borderClass = "border-[#0d5c3a]/10 opacity-40";
                        bgClass = "bg-transparent";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={hasSelected}
                        onClick={() => handleSelectOption(oIdx, opt.type, opt.text)}
                        className={`w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${borderClass} ${bgClass} cursor-pointer flex flex-col gap-2`}
                      >
                        <div className="flex items-start gap-3 justify-between">
                          <span className="font-extrabold text-[#b8860b] text-base leading-snug">Choice 0{oIdx + 1}</span>
                          {isSelected && <span className="text-[#b8860b] text-xs font-bold bg-[#b8860b]/10 border border-[#b8860b]/30 px-2 py-0.5 rounded-full">나의 응답</span>}
                        </div>
                        <p className="font-bold text-white text-base sm:text-lg leading-relaxed word-keep">{opt.text}</p>
                        {hasSelected && (
                          <p className={`text-xs mt-1.5 leading-relaxed word-keep transition-opacity duration-500 ${isSelected ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>
                            ↳ {opt.desc}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 한줄 성찰 (선택 후) */}
                <AnimatePresence>
                  {showReflection && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full bg-[#0b130f] border border-[#b8860b]/20 p-5 rounded-2xl space-y-4 text-left"
                    >
                      <p className="text-xs font-black text-[#b8860b] flex items-center gap-1.5">
                        <Sparkles size={14} /> 영성 성찰 가이드
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed word-keep">
                        {curQ.reflection}
                      </p>
                      <button
                        onClick={handleNext}
                        className="w-full py-3 bg-[#b8860b] hover:bg-[#d97706] text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                      >
                        {currentIdx === activeQuestions.length - 1 ? '최종 결과 분석하기' : '다음 카드 열기'} 
                        <ChevronRight size={16} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* 3. RESULT PHASE */}
        {gamePhase === 'result' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 py-4 text-left"
          >
            {/* 결과 메인 카드 */}
            <div className="bg-[#111e17] rounded-[2.5rem] p-6 sm:p-8 border border-[#b8860b]/40 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#0d5c3a]/15 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="text-center space-y-3 border-b border-[#0d5c3a]/20 pb-6">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="text-xs bg-[#b8860b]/20 text-[#b8860b] px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-[#b8860b]/30">
                    신앙 밸런스 프로필
                  </span>
                  {gameMode === 'category' && selectedCategory && (
                    <span className="text-xs bg-[#0d5c3a]/20 text-emerald-400 px-3 py-1 rounded-full font-bold border border-[#0d5c3a]/30">
                      {balanceCategoryLabels[selectedCategory].emoji} {balanceCategoryLabels[selectedCategory].name} 특화
                    </span>
                  )}
                </div>
                <div className="text-6xl pt-2">{res.emoji}</div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">{res.name}</h3>
                <p className="text-xs sm:text-sm text-[#b8860b] font-extrabold word-keep max-w-md mx-auto">
                  "{res.headline}"
                </p>
              </div>

              {/* 지표 분석 */}
              <div className="space-y-5 bg-[#0b130f] p-5 rounded-2xl border border-[#0d5c3a]/25">
                <p className="text-xs font-bold text-[#b8860b] flex items-center gap-1.5"><HelpCircle size={14} /> 4대 영성 스펙트럼 지표</p>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-300 font-mono">
                    <span>🙏 수직적 기도 ({res.vPercent}%)</span>
                    <span>🤝 수평적 실천 ({res.hPercent}%)</span>
                  </div>
                  <div className="w-full h-3 bg-[#111e17] rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#0d5c3a] transition-all" style={{ width: `${res.vPercent}%` }}></div>
                    <div className="h-full bg-[#2a6f97] transition-all" style={{ width: `${res.hPercent}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-300 font-mono">
                    <span>📜 전통 수호 ({res.tPercent}%)</span>
                    <span>🚀 현대 안착 ({res.mPercent}%)</span>
                  </div>
                  <div className="w-full h-3 bg-[#111e17] rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#b8860b] transition-all" style={{ width: `${res.tPercent}%` }}></div>
                    <div className="h-full bg-[#fbbf24] transition-all" style={{ width: `${res.mPercent}%` }}></div>
                  </div>
                </div>
              </div>

              {/* 상세 해설 */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#b8860b]">심층 해석 칼럼</h4>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300 word-keep">{res.desc}</p>
              </div>

              {/* 강점 & 조언 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#0b130f]/60 p-4 rounded-xl border border-[#0d5c3a]/15 text-left">
                  <p className="text-xs font-bold text-emerald-400 mb-2">✔ 핵심 강점</p>
                  <ul className="space-y-1.5 list-none pl-0 text-[11px] sm:text-xs text-slate-300">
                    {res.strengths.map((str, i) => (
                      <li key={i} className="flex gap-1 items-start leading-snug">
                        <span className="text-emerald-400">·</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#b8860b]/10 p-4 rounded-xl border border-[#b8860b]/20 text-left flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#b8860b] mb-1.5">💡 삶을 바꿀 영성 조언</p>
                    <p className="text-[11px] sm:text-xs leading-relaxed text-[#fcd34d] font-medium word-keep">{res.advice}</p>
                  </div>
                </div>
              </div>

              {/* 게임 통계 */}
              <div className="bg-[#0b130f] p-4 rounded-xl border border-[#0d5c3a]/20 flex items-center justify-around text-center">
                <div>
                  <p className="text-[10px] text-slate-500">응답 문항</p>
                  <p className="text-lg font-black text-white">{choices.length}<span className="text-xs text-slate-500">개</span></p>
                </div>
                <div className="w-px h-8 bg-[#0d5c3a]/30"></div>
                <div>
                  <p className="text-[10px] text-slate-500">게임 모드</p>
                  <p className="text-xs font-bold text-[#b8860b]">{gameMode === 'all-random' ? '🎲 완전 랜덤' : `📂 ${balanceCategoryLabels[selectedCategory!]?.name}`}</p>
                </div>
                <div className="w-px h-8 bg-[#0d5c3a]/30"></div>
                <div>
                  <p className="text-[10px] text-slate-500">셔플 순서</p>
                  <p className="text-xs font-bold text-emerald-400">✓ 랜덤</p>
                </div>
              </div>
            </div>

            {/* 제어 단추 */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleShare}
                className="flex-1 py-4 bg-gradient-to-r from-[#0d5c3a] to-[#2a6f97] text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all cursor-pointer"
              >
                결과 공유하기 <Share2 size={16} />
              </button>
              <button
                onClick={() => setGamePhase('intro')}
                className="py-4 px-6 bg-[#111e17] text-[#b8860b] border border-[#b8860b]/30 hover:bg-[#b8860b]/10 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                다시 플레이 <RefreshCcw size={16} />
              </button>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
};
