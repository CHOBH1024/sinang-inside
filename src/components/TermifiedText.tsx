import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X } from 'lucide-react';
import { theologyDictionary } from '../i18n/theologyDictionary';

/**
 * 텍스트 내에 신학 용어를 자동 감지하여 클릭 가능한 툴팁 링크로 변환합니다.
 */

interface TermTooltipProps {
  text: string;
  className?: string;
}

// 사전에서 감지할 용어 목록 (길이 순 내림차순 → 더 긴 용어 먼저 매칭)
const TOOLTIP_TERMS = Object.keys(theologyDictionary).sort((a, b) => b.length - a.length);

// 텍스트를 파싱하여 용어와 일반 텍스트 세그먼트로 분리
const parseTerms = (text: string): { content: string; isTerm: boolean }[] => {
  const segments: { content: string; isTerm: boolean }[] = [];
  let remaining = text;
  
  while (remaining.length > 0) {
    let found = false;
    for (const term of TOOLTIP_TERMS) {
      const idx = remaining.indexOf(term);
      if (idx === 0) {
        segments.push({ content: term, isTerm: true });
        remaining = remaining.slice(term.length);
        found = true;
        break;
      } else if (idx > 0) {
        segments.push({ content: remaining.slice(0, idx), isTerm: false });
        segments.push({ content: term, isTerm: true });
        remaining = remaining.slice(idx + term.length);
        found = true;
        break;
      }
    }
    if (!found) {
      segments.push({ content: remaining, isTerm: false });
      break;
    }
  }
  return segments;
};

const TermTooltip = ({ term }: { term: string }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const entry = theologyDictionary[term];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!entry) return <span>{term}</span>;

  return (
    <span ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className="text-[#b8860b] underline decoration-dashed underline-offset-2 decoration-[#b8860b]/50 hover:decoration-[#b8860b] transition-colors cursor-pointer font-bold"
      >
        {term}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-64 sm:w-80"
          >
            <div className="bg-[#111e17] border border-[#b8860b]/30 rounded-2xl shadow-2xl p-4 text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen size={13} className="text-[#b8860b]" />
                  <span className="text-[10px] font-black text-[#b8860b] tracking-widest uppercase">용어 해설</span>
                </div>
                <button onClick={() => setOpen(false)} className="text-slate-600 hover:text-white transition-colors cursor-pointer">
                  <X size={14} />
                </button>
              </div>
              <p className="font-black text-white text-base mb-1">{term}</p>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] text-slate-600 w-6">EN</span>
                  <span className="text-sm text-emerald-300 font-bold">{entry.en}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] text-slate-600 w-6">JA</span>
                  <span className="text-sm text-sky-300 font-bold">{entry.ja}</span>
                </div>
              </div>
              {entry.note && (
                <p className="text-[10px] text-slate-400 leading-relaxed border-t border-white/5 pt-2">{entry.note}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

/**
 * 텍스트 내 신학 용어를 자동으로 툴팁 링크로 변환하는 컴포넌트
 * @example <TermifiedText text="탕감복귀의 원리에 따라..." />
 */
export const TermifiedText = ({ text, className }: TermTooltipProps) => {
  const segments = parseTerms(text);
  
  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.isTerm ? (
          <TermTooltip key={i} term={seg.content} />
        ) : (
          <span key={i}>{seg.content}</span>
        )
      )}
    </span>
  );
};
