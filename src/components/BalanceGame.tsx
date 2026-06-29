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

    // 9개 프로필 완전 매핑 (내면↔관계 × 원칙↔자유)
    let profileName = "조화로운 균형가";
    let profileEmoji = "⚖️";
    let profileHeadline = "내면과 관계, 원칙과 자유의 균형을 갖춘 유연한 신앙인";
    let profileDesc = "당신은 어느 한쪽에 치우치지 않고 상황에 맞게 오가는 균형의 사람입니다. 혼자도 함께도 편안하고, 원칙을 지키면서도 자유를 누릴 줄 압니다. 공동체에서 자연스러운 다리 역할을 하는 든든한 균형추입니다.";
    let profileStrengths = ["치우치지 않는 유연한 시각", "사람을 잇는 조화로운 중재력", "상황에 맞는 균형 감각"];
    let profileAdvice = "모든 결을 다 품으려다 색이 흐려질 수 있어요. 정말 중요한 순간엔 '나는 이쪽'이라고 분명히 깃발을 꽂아 보세요.";

    if (vPercent >= 70 && tPercent >= 70) {
      profileName = "고요한 원칙의 수도자";
      profileEmoji = "🧘";
      profileHeadline = "홀로의 깊은 묵상과 분명한 원칙을 신앙의 중심에 둔 단단한 수도자";
      profileDesc = "당신은 혼자만의 고요 속에서 가장 깊어지고, 분명한 원칙과 규율 위에서 안정감을 느낍니다. 흔들리지 않는 내면과 단단한 기준이 당신의 큰 힘입니다.";
      profileStrengths = ["깊은 내적 묵상력", "흔들리지 않는 원칙", "단단한 자기 관리"];
      profileAdvice = "그 깊은 은혜를 가끔은 사람들과 나누고, 원칙 너머의 자유로움도 한 번 누려 보세요. 더 넓어집니다.";
    } else if (vPercent >= 70 && mPercent >= 70) {
      profileName = "사색하는 자유 영혼";
      profileEmoji = "🌌";
      profileHeadline = "홀로의 묵상 속에서 자유롭고 직관적으로 신앙을 빚어가는 사색가";
      profileDesc = "당신은 혼자만의 시간에 깊어지면서도 정해진 틀보다 직관과 영감을 따르는 자유로운 영혼입니다. 사색과 창의가 어우러진 신선한 신앙을 지녔습니다.";
      profileStrengths = ["깊은 사색과 영적 감수성", "자유로운 직관과 창의", "열린 내면"];
      profileAdvice = "사색과 영감에만 머물지 말고, 가끔 사람들과 나누고 작은 틀도 세워 보세요. 자유에 뿌리가 더해집니다.";
    } else if (hPercent >= 70 && tPercent >= 70) {
      profileName = "원칙 있는 실천 리더";
      profileEmoji = "🛡️";
      profileHeadline = "사람들과 함께하는 실천을 분명한 원칙 위에서 이끄는 든든한 리더";
      profileDesc = "당신은 관계와 실천 속에서 살아나면서도 분명한 기준과 질서를 소중히 여깁니다. 함께 가되 중심을 잃지 않는 신뢰감 있는 리더십이 강점입니다.";
      profileStrengths = ["관계 속 실천력", "분명한 원칙과 책임감", "신뢰받는 리더십"];
      profileAdvice = "원칙을 지키되 사람마다의 사정도 헤아리고, 가끔 새로운 시도에도 마음을 열어 보세요. 더 유연해집니다.";
    } else if (hPercent >= 70 && mPercent >= 70) {
      profileName = "자유로운 관계 활동가";
      profileEmoji = "🌈";
      profileHeadline = "사람들과 어울리며 자유롭고 창의롭게 신앙을 펼치는 활동가";
      profileDesc = "당신은 사람들과의 관계와 실천에서 살아나고, 정해진 틀보다 새롭고 자유로운 방식을 즐깁니다. 그 활기와 창의가 공동체에 신선함을 불어넣습니다.";
      profileStrengths = ["뛰어난 관계와 소통력", "자유롭고 창의적인 실천", "공동체에 주는 활기"];
      profileAdvice = "활기와 자유 곁에 홀로 충전하는 시간과 작은 원칙 하나를 더해 보세요. 더 오래갑니다.";
    } else if (vPercent >= 60 && tPercent >= 60) {
      profileName = "차분한 정진가";
      profileEmoji = "🕯️";
      profileHeadline = "고요한 내면과 성실한 원칙으로 꾸준히 정진하는 차분한 신앙인";
      profileDesc = "당신은 혼자만의 시간에 차분히 머물며 정해진 원칙을 성실히 지켜 갑니다. 그 조용한 꾸준함이 신앙의 안정된 뿌리가 됩니다.";
      profileStrengths = ["차분한 묵상과 성실함", "안정적인 자기 관리", "신뢰감 있는 꾸준함"];
      profileAdvice = "가끔은 사람들과 어울리고 자유로운 시도도 해보세요. 정진에 생기가 더해집니다.";
    } else if (vPercent >= 60 && mPercent >= 60) {
      profileName = "내면의 탐험가";
      profileEmoji = "🔮";
      profileHeadline = "혼자만의 묵상 속에서 자유롭게 새로운 길을 모색하는 내면의 탐험가";
      profileDesc = "당신은 깊은 내면을 유지하면서도 기존 틀에 안주하지 않고 새로운 방향을 직관적으로 모색합니다. 사색과 자유가 어우러진 사람입니다.";
      profileStrengths = ["깊은 영적 감수성", "새로움에 대한 개방성", "자기주도적 성찰력"];
      profileAdvice = "내면의 발견을 사람들과 나누고 함께 호흡해 보세요. 혼자만의 길이 함께의 길로 넓어집니다.";
    } else if (hPercent >= 60 && tPercent >= 60) {
      profileName = "신뢰의 동행가";
      profileEmoji = "🤝";
      profileHeadline = "사람들과 함께하는 실천을 원칙 위에서 든든히 받쳐주는 동행가";
      profileDesc = "당신은 사람들과 함께 걸으면서도 분명한 기준을 지키는 신뢰의 사람입니다. 관계의 따뜻함과 원칙의 단단함을 함께 지녔습니다.";
      profileStrengths = ["따뜻한 동행과 신뢰", "원칙 있는 안정감", "공동체의 버팀목"];
      profileAdvice = "변화하는 시대의 새로운 언어와 자유로운 시도에도 마음을 열어 보세요. 더 넓게 품게 됩니다.";
    } else if (hPercent >= 60 && mPercent >= 60) {
      profileName = "활기찬 어울림가";
      profileEmoji = "✨";
      profileHeadline = "사람들과 자유롭게 어울리며 신앙에 생기를 더하는 활기찬 신앙인";
      profileDesc = "당신은 사람들과의 어울림 속에서 살아나고 자유로운 방식을 즐기는 활기찬 사람입니다. 그 밝은 에너지가 공동체에 온기를 더합니다.";
      profileStrengths = ["밝은 관계와 소통력", "자유롭고 유연한 태도", "공동체에 주는 생기"];
      profileAdvice = "활기 곁에 홀로 깊어지는 시간과 작은 기준 하나를 더하면, 그 빛이 흔들리지 않습니다.";
    }

    return { name: profileName, emoji: profileEmoji, headline: profileHeadline, desc: profileDesc, strengths: profileStrengths, advice: profileAdvice, vPercent, hPercent, tPercent, mPercent };
  };

  const res = calculateResult();
  const curQ = activeQuestions[currentIdx];

  const handleShare = () => {
    const text = `🛐 [신앙인사이드 밸런스게임] 완료!\n나의 신앙 성향 프로필은: "${res.name}" ${res.emoji}\n\n- 내면 지향: ${res.vPercent}%\n- 관계·실천 지향: ${res.hPercent}%\n- 원칙·규율: ${res.tPercent}%\n- 자유·직관: ${res.mPercent}%\n\n지금 테스트하러 가기 👉 https://sinang-inside.vercel.app`;
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
                30가지 신앙 딜레마로 나의 신앙 성향 밸런스 — 내면↔관계, 원칙↔자유 두 축의 진짜 결을 탐험하세요. 정답은 없어요. 매번 랜덤으로 섞여 새로운 경험!
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
                <p className="text-xs font-bold text-[#b8860b] flex items-center gap-1.5"><HelpCircle size={14} /> 두 축으로 보는 나의 신앙 성향</p>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-300 font-mono">
                    <span>🧘 내면 지향 ({res.vPercent}%)</span>
                    <span>🤝 관계·실천 지향 ({res.hPercent}%)</span>
                  </div>
                  <div className="w-full h-3 bg-[#111e17] rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#0d5c3a] transition-all" style={{ width: `${res.vPercent}%` }}></div>
                    <div className="h-full bg-[#2a6f97] transition-all" style={{ width: `${res.hPercent}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-300 font-mono">
                    <span>📜 원칙·규율 ({res.tPercent}%)</span>
                    <span>🌈 자유·직관 ({res.mPercent}%)</span>
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
