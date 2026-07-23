import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSwipeable } from 'react-swipeable';
import { SurveyConfig, SurveySection, SurveyQuestion, AnswerData, SurveyMode } from '../types';
import { themeMap } from '../theme';
import { playPopSound } from '../utils/audioEngine';
import { ArrowLeft } from 'lucide-react';
import { TermifiedText } from './TermifiedText';

type Phase = 'section-intro' | 'question' | 'section-reaction' | 'done';

interface SurveyEngineProps {
  survey: SurveyConfig;
  mode: SurveyMode;
  onComplete: (answers: Record<number, AnswerData>) => void;
}

function fallbackSections(questions: SurveyQuestion[], categories: string[]): SurveySection[] {
  const total = questions.length;
  const per = Math.max(1, Math.ceil(total / 3));
  return Array.from({ length: 3 }, (_, i) => ({
    emoji: ['🌱', '✨', '🌟'][i],
    title: `섹션 ${i + 1}`,
    intro: `${categories.slice(i * per, (i + 1) * per).join(', ')}\n에 대해 물어볼게요.`,
    questionRange: [i * per, Math.min((i + 1) * per - 1, total - 1)] as [number, number],
    reactions: {
      low:  '흥미로운 신앙의 모습이네요!',
      mid:  '균형잡힌 신앙관이시네요!',
      high: '깊은 신앙의 뿌리가 느껴져요!',
    },
  }));
}

// 모드별로 사용할 문항/섹션 세트를 결정한다.
// - 재설계 진단(professionalQuestions 보유): general=questions/sections(전체), professional=FC 세트
// - 레거시 진단: general=앞 3섹션(6문항), academic=전체 6섹션(12문항)
function getModeData(survey: SurveyConfig, mode: SurveyMode): { questions: SurveyQuestion[]; sections: SurveySection[] } {
  const isRedesigned = !!(survey.professionalQuestions && survey.professionalQuestions.length);

  let questions: SurveyQuestion[];
  let sectionsRaw: SurveySection[];

  if (mode === 'professional' && isRedesigned) {
    questions = survey.professionalQuestions!;
    sectionsRaw = survey.professionalSections ?? [];
  } else if (mode === 'general' && !isRedesigned) {
    // 레거시 일반: 앞 3섹션(질문 0~5)만 사용
    questions = survey.questions;
    sectionsRaw = (survey.sections ?? []).slice(0, 3);
  } else {
    // 재설계 일반 / 레거시 학술: 해당 questions + 전체 sections
    questions = survey.questions;
    sectionsRaw = survey.sections ?? [];
  }

  const sections = sectionsRaw.length ? sectionsRaw : fallbackSections(questions, survey.categories);
  const maxEnd = sections.reduce((m, s) => Math.max(m, s.questionRange[1]), 0);
  const activeQuestions = questions.slice(0, Math.min(questions.length, maxEnd + 1));
  return { questions: activeQuestions, sections };
}

function getSectionAvg(answers: Record<number, AnswerData>, range: [number, number]): number {
  const vals: number[] = [];
  for (let i = range[0]; i <= range[1]; i++) {
    if (answers[i]) vals.push(answers[i].value);
  }
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
}

function getReaction(section: SurveySection, avg: number): string {
  if (avg <= 2.5) return section.reactions.low;
  if (avg <= 3.5) return section.reactions.mid;
  return section.reactions.high;
}

function getReactionEmoji(avg: number): string {
  if (avg <= 2) return '💬';
  if (avg <= 3) return '⚖️';
  if (avg <= 4) return '🌟';
  return '🔥';
}

// Slide-in animation variants
const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.94,
    filter: 'blur(8px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 300, damping: 26, mass: 0.8 },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.94,
    filter: 'blur(8px)',
    transition: { type: 'spring' as const, stiffness: 300, damping: 26, mass: 0.8 },
  }),
};

export const SurveyEngine = ({ survey, mode, onComplete }: SurveyEngineProps) => {
  const [phase, setPhase] = useState<Phase>('section-intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerData>>({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [direction, setDirection] = useState(1);

  const t = themeMap[survey.color] || themeMap['blue'];
  const isForcedChoice = mode === 'professional';
  const { questions: activeQuestions, sections } = useMemo(
    () => getModeData(survey, mode),
    [survey, mode]
  );

  useEffect(() => {
    if (phase === 'question') setQuestionStartTime(Date.now());
  }, [currentIdx, phase]);

  const triggerHaptic = (pattern: number | number[]) => {
    if (navigator.vibrate) navigator.vibrate(pattern);
  };

  const handleStartSection = () => {
    setDirection(1);
    setPhase('question');
  };

  const submitAnswer = (val: number) => {
    playPopSound();
    triggerHaptic([20]);
    const latencyMs = Date.now() - questionStartTime;
    const newAnswers = { ...answers, [currentIdx]: { value: val, latencyMs } };
    setAnswers(newAnswers);

    const section = sections[currentSectionIdx];
    const isLastInSection = currentIdx >= section.questionRange[1];
    const isLastSection = currentSectionIdx >= sections.length - 1;

    setTimeout(() => {
      if (!isLastInSection) {
        setDirection(1);
        setCurrentIdx(prev => prev + 1);
      } else if (!isLastSection) {
        setPhase('section-reaction');
      } else {
        triggerHaptic([30, 50, 30, 50, 50]);
        setPhase('done');
      }
    }, 250);
  };

  const handleNextSection = () => {
    const next = currentSectionIdx + 1;
    setCurrentSectionIdx(next);
    setCurrentIdx(sections[next].questionRange[0]);
    setDirection(1);
    setPhase('section-intro');
  };

  const goToPrev = () => {
    if (currentIdx <= 0) return;
    setDirection(-1);
    const section = sections[currentSectionIdx];
    if (currentIdx <= section.questionRange[0] && currentSectionIdx > 0) {
      setCurrentSectionIdx(prev => prev - 1);
    }
    setCurrentIdx(prev => prev - 1);
    triggerHaptic([10, 30, 10]);
  };

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => phase === 'question' && goToPrev(),
    trackMouse: true,
  });

  const currentSection = sections[currentSectionIdx];
  const sectionAvg = getSectionAvg(answers, currentSection.questionRange);

  /* ─── SECTION INTRO ───────────────────────────────────── */
  const renderSectionIntro = () => (
    <motion.div
      key={`intro-${currentSectionIdx}`}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex-1 flex flex-col items-center justify-center text-center px-6"
    >
      <motion.p
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-white/35 text-[11px] font-black tracking-[0.22em] uppercase mb-7"
      >
        SECTION {currentSectionIdx + 1} / {sections.length}
      </motion.p>

      <motion.div
        initial={{ scale: 0, rotate: -18 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 240, delay: 0.2 }}
        className="text-[72px] mb-6 leading-none"
      >
        {currentSection.emoji}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-white text-2xl font-black mb-4 tracking-tight"
      >
        {currentSection.title}
      </motion.h2>

      {/* Movie subtitle lines — each word/line fades in staggered */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.62 }}
        className="text-white/65 text-base leading-[2] whitespace-pre-line mb-10 font-medium"
      >
        {currentSection.intro}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.88 }}
        className="flex items-center gap-3 text-white/35 text-[11px] font-bold mb-10 bg-white/5 px-5 py-2.5 rounded-full border border-white/10"
      >
        {isForcedChoice ? (
          <span>A · B 중 더 끌리는 쪽을 선택하세요</span>
        ) : (
          <>
            <span>1 = 전혀 아니다</span>
            <span className="text-white/15">|</span>
            <span>5 = 매우 그렇다</span>
          </>
        )}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStartSection}
        className="px-10 py-4 bg-white text-black font-black text-[17px] rounded-2xl tracking-tight shadow-[0_0_40px_rgba(255,255,255,0.22)] hover:shadow-[0_0_60px_rgba(255,255,255,0.38)] transition-shadow"
      >
        시작합니다 ▶
      </motion.button>
    </motion.div>
  );

  /* ─── SECTION REACTION ────────────────────────────────── */
  const renderSectionReaction = () => {
    const reactionText = getReaction(currentSection, sectionAvg);
    const emoji = getReactionEmoji(sectionAvg);
    return (
      <motion.div
        key={`reaction-${currentSectionIdx}`}
        custom={1}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        className="flex-1 flex flex-col items-center justify-center text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/30 text-[11px] font-black tracking-[0.22em] uppercase mb-6"
        >
          체크포인트 ✦
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 270, delay: 0.25 }}
          className="text-[64px] mb-6 leading-none"
        >
          {emoji}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white text-[22px] font-black leading-relaxed whitespace-pre-line mb-2"
        >
          "{reactionText}"
        </motion.p>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="inline-block mt-3 mb-10 px-4 py-1.5 rounded-full text-[11px] font-bold border border-white/10 bg-white/5 text-white/40"
        >
          {isForcedChoice
            ? (sectionAvg > 3.5 ? '한쪽 성향이 뚜렷해요' : sectionAvg < 2.5 ? '한쪽 성향이 뚜렷해요' : '균형 잡힌 선택이에요')
            : `이 섹션 평균 ${sectionAvg.toFixed(1)}점`}
        </motion.span>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextSection}
          className="px-10 py-4 bg-white/10 border border-white/20 backdrop-blur-xl text-white font-black text-base rounded-2xl hover:bg-white/18 transition-all tracking-tight"
        >
          다음 섹션으로 ──▶
        </motion.button>
      </motion.div>
    );
  };

  /* ─── DONE / LOADING ──────────────────────────────────── */
  const renderDone = () => (
    <motion.div
      key="done"
      custom={1}
      variants={variants}
      initial="enter"
      animate="center"
      className="flex-1 flex flex-col items-center justify-center text-center px-6"
    >
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 210 }}
        className="text-[72px] mb-6 leading-none"
      >
        🙏
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-white text-[32px] font-black mb-3 tracking-tight"
      >
        수고하셨습니다!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-white/45 text-sm mb-12 leading-relaxed"
      >
        당신의 신앙 DNA를<br />분석하고 있어요...
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="w-56 h-[3px] bg-white/12 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-white rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.2 }}
          onAnimationComplete={() => onComplete(answers)}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ delay: 1.6, duration: 1.8, repeat: Infinity }}
        className="text-white/25 text-[10px] mt-4 tracking-[0.3em]"
      >
        ANALYZING...
      </motion.p>
    </motion.div>
  );

  /* ─── QUESTION ────────────────────────────────────────── */
  const renderQuestion = () => {
    if (!activeQuestions[currentIdx]) return null;
    const question = activeQuestions[currentIdx];
    const isDilemma = question.t === 'V';

    return (
      <motion.div
        key={currentIdx}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        className="flex-1 flex flex-col justify-center w-full h-full"
      >
        <div className="w-full flex-1 max-h-[70vh] rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[50%] ${t.bgBg} opacity-20 blur-[80px] rounded-full pointer-events-none`} />

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-block mb-8 text-[11px] font-black tracking-[0.2em] uppercase py-1.5 px-4 rounded-full border border-white/10 text-white/80 bg-black/20"
          >
            Q {currentIdx + 1}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl md:text-4xl font-black text-white leading-snug mb-12 word-keep drop-shadow-lg"
          >
            <TermifiedText text={question.q} />
          </motion.h2>

          {isDilemma ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full flex flex-col gap-4"
            >
              <button
                onClick={() => submitAnswer(1)}
                className="group relative w-full p-6 rounded-[2rem] bg-white/5 hover:bg-white/15 border border-white/10 backdrop-blur-lg transition-all text-center flex flex-col items-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="block text-white font-black text-xl mb-1">{question.left}</span>
                <span className="text-white/60 text-xs font-bold">{question.descL}</span>
              </button>
              <button
                onClick={() => submitAnswer(5)}
                className="group relative w-full p-6 rounded-[2rem] bg-white/5 hover:bg-white/15 border border-white/10 backdrop-blur-lg transition-all text-center flex flex-col items-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="block text-white font-black text-xl mb-1">{question.right}</span>
                <span className="text-white/60 text-xs font-bold">{question.descR}</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full mt-auto"
            >
              <div className="flex justify-between text-[10px] font-black text-white/40 px-2 uppercase tracking-[0.2em] mb-4">
                <span>전혀 아니다</span>
                <span>매우 그렇다</span>
              </div>
              <div className="flex gap-2 md:gap-3">
                {[1, 2, 3, 4, 5].map(val => (
                  <motion.button
                    key={val}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => submitAnswer(val)}
                    className="flex-1 h-14 md:h-16 flex items-center justify-center bg-white/5 hover:bg-white/90 border border-white/10 rounded-2xl font-black text-xl md:text-2xl text-white hover:text-black transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity" />
                    {val}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  /* ─── ROOT RENDER ─────────────────────────────────────── */
  return (
    <div
      {...(phase === 'question' ? swipeHandlers : {})}
      className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-black touch-none select-none"
    >
      {/* Background tint */}
      <div className={`absolute inset-0 ${t.bg} opacity-20`} />
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ repeat: Infinity, duration: 10, repeatType: 'reverse' }}
      />

      {/* Progress bar (questions only) */}
      {phase === 'question' && (
        <div className="absolute top-0 left-0 right-0 px-3 pt-5 flex gap-1 z-50">
          {activeQuestions.map((_, idx) => {
            const state = idx < currentIdx ? 'seen' : idx === currentIdx ? 'active' : 'unseen';
            return (
              <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
                {state === 'seen' && (
                  <div className="w-full h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] rounded-full" />
                )}
                {state === 'active' && (
                  <motion.div
                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: answers[idx] ? 1 : 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Header (questions only) */}
      {phase === 'question' && (
        <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-50">
          <div className="flex items-center gap-2">
            {currentIdx > 0 ? (
              <button
                onClick={goToPrev}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className={`w-10 h-10 rounded-full ${t.bgBg} border border-white/30 flex items-center justify-center text-xs shadow-[0_0_15px_rgba(255,255,255,0.3)]`}>
                {survey.name[0]}
              </div>
            )}
            <span className="text-white font-bold text-sm drop-shadow-md ml-1">{survey.name}</span>
          </div>
          <span className="text-white/50 text-xs font-semibold">
            {currentIdx + 1} / {activeQuestions.length}
          </span>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col relative z-10 pt-20 pb-12 px-5" style={{ perspective: 1200 }}>
        <AnimatePresence mode="popLayout" custom={direction}>
          {phase === 'section-intro' && renderSectionIntro()}
          {phase === 'question' && renderQuestion()}
          {phase === 'section-reaction' && renderSectionReaction()}
          {phase === 'done' && renderDone()}
        </AnimatePresence>
      </div>

      {/* Left tap zone (go back) */}
      {phase === 'question' && (
        <div
          className="absolute inset-y-0 left-0 w-1/4 z-20 cursor-pointer"
          onClick={goToPrev}
        />
      )}
    </div>
  );
};
