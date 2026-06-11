import React, { useRef, useState } from 'react';
import { Download, Instagram, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';

interface InstaShareCardProps {
  personaName: string;
  emoji: string;
  surveyTitle: string;
  topTraits: { label: string; value: number }[];
  color: string;
}

export const InstaShareCard = ({ personaName, emoji, surveyTitle, topTraits, color }: InstaShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      // html2canvas 옵션 최적화
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // 고해상도
        useCORS: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `sinang_inside_persona_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
    } catch (err) {
      console.error('Image generation failed', err);
      alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full mt-3 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-extrabold rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
      >
        {isGenerating ? (
          <span className="animate-pulse">포토 카드 굽는 중... ✨</span>
        ) : (
          <>
            <Instagram size={20} /> 인스타/카톡 공유용 포토카드 저장
          </>
        )}
      </button>

      {/* 숨겨진 렌더링 영역 (인스타그램 스토리 9:16 비율, 실제 1080x1920 기준 축소형) */}
      <div className="absolute -left-[9999px] top-0 pointer-events-none">
        <div 
          ref={cardRef} 
          className="relative overflow-hidden flex flex-col items-center justify-center p-10 bg-[#0b130f]"
          style={{ width: '540px', height: '960px' }} // 9:16 ratio
        >
          {/* 동적 배경 효과 */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px]" style={{ backgroundColor: color, transform: 'translate(-30%, -30%)' }} />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#b8860b] rounded-full blur-[120px]" style={{ transform: 'translate(20%, 20%)' }} />
          </div>
          
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>

          <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center">
            
            <div className="flex items-center justify-center gap-2 mb-8 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
              <Sparkles size={16} className="text-[#b8860b]" />
              <span className="text-white font-black tracking-widest text-sm">{surveyTitle}</span>
            </div>

            <div className="text-[120px] leading-none mb-6 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]">
              {emoji}
            </div>
            
            <p className="text-xl font-bold text-[#b8860b] tracking-widest uppercase mb-2">My Faith Persona</p>
            <h1 className="text-5xl font-black text-white text-center leading-tight mb-12 word-keep drop-shadow-xl">
              {personaName}
            </h1>

            <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-white font-bold text-lg mb-6 text-center">나의 핵심 신앙 코드 TOP 3</h3>
              <div className="space-y-5 w-full">
                {topTraits.map((trait, idx) => (
                  <div key={idx} className="w-full">
                    <div className="flex justify-between text-base font-bold text-white mb-2">
                      <span>{trait.label}</span>
                      <span className="text-[#b8860b]">{Math.round(trait.value)}%</span>
                    </div>
                    <div className="h-3 bg-black/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-[#b8860b] to-yellow-300"
                        style={{ width: `${trait.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-0 w-full text-center z-10">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
              <span className="text-2xl">🛐</span>
              <div className="text-left">
                <p className="text-white font-black text-sm leading-tight">신앙인사이드 (Sinang Inside)</p>
                <p className="text-slate-400 text-[10px]">sinang-inside.vercel.app</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};
