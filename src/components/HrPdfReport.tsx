import React, { useRef, useState } from 'react';
import { UserInfo, SurveyConfig, AnswerData } from '../types';
import { calculateScores } from '../utils/scoringEngine';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { RadarChart3D } from './RadarChart3D';
import { getLabel, SupportedLang } from '../i18n/theologyDictionary';

interface HrPdfReportProps {
  survey: SurveyConfig;
  answers: Record<number, AnswerData>;
  userInfo: UserInfo | null;
  resultData: any;
  lang?: SupportedLang;
}

export const HrPdfReport = ({ survey, answers, userInfo, resultData, lang = 'ko' }: HrPdfReportProps) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const scores = calculateScores(survey, answers);
  const radarData = survey.categories.map((catName, index) => ({
    subject: catName,
    A: Math.round(scores.categoryScores[index] || 0),
    fullMark: 100,
  }));

  const handleDownloadPDF = async () => {
    if (!reportRef.current || !userInfo) return;
    setIsGenerating(true);
    
    try {
      // 강제로 숨겨진 리포트를 보이게 처리 후 캡처 (position absolute로 레이아웃 파괴 방지)
      const element = reportRef.current;
      element.style.display = 'block';
      
      const canvas = await html2canvas(element, {
        scale: 2, // 고화질
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      element.style.display = 'none';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`인사기록_${userInfo.name}_${survey.title}.pdf`);
      
      if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!userInfo) return null;

  return (
    <>
      <button
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        className="w-full mt-4 py-4 bg-white text-[#0d5c3a] font-extrabold rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors disabled:opacity-50"
      >
        {isGenerating ? <span className="animate-pulse">{getLabel('downloadReport', lang).split('(')[0]}...</span> : <><Download size={20} /> {getLabel('downloadReport', lang)}</>}
      </button>

      {/* 숨겨진 렌더링 영역: A4 사이즈에 최적화된 백색 바탕의 공식 포맷 */}
      <div 
        ref={reportRef} 
        style={{ 
          display: 'none', 
          width: '800px', // 고정 픽셀 렌더링 후 A4 비율로 리사이즈
          padding: '40px',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          position: 'absolute',
          left: '-9999px',
          top: 0
        }}
        className="font-sans"
      >
        {/* 헤더 */}
        <div style={{ borderBottom: '3px solid #0d5c3a', paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0d5c3a', margin: 0 }}>
            {lang === 'ko' ? '가정연합 인사/영성 평가 리포트' : lang === 'en' ? 'FFWPU HR & Spirituality Evaluation Report' : '家庭連合 人事・霊性評価レポート'}
          </h1>
          <p style={{ color: '#666', marginTop: '10px', fontSize: '14px' }}>{lang === 'ko' ? '진단 항목' : lang === 'en' ? 'Assessment' : '診断項目'}: {survey.title}</p>
        </div>

        {/* 인적 사항 표 */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <tbody>
            <tr>
              <th style={{ backgroundColor: '#f1f5f9', padding: '12px', border: '1px solid #cbd5e1', width: '20%', textAlign: 'left' }}>성명</th>
              <td style={{ padding: '12px', border: '1px solid #cbd5e1', width: '30%', fontWeight: 'bold' }}>{userInfo.name}</td>
              <th style={{ backgroundColor: '#f1f5f9', padding: '12px', border: '1px solid #cbd5e1', width: '20%', textAlign: 'left' }}>소속 교구/기관</th>
              <td style={{ padding: '12px', border: '1px solid #cbd5e1', width: '30%' }}>{userInfo.region}</td>
            </tr>
            <tr>
              <th style={{ backgroundColor: '#f1f5f9', padding: '12px', border: '1px solid #cbd5e1', textAlign: 'left' }}>직책</th>
              <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>{userInfo.position}</td>
              <th style={{ backgroundColor: '#f1f5f9', padding: '12px', border: '1px solid #cbd5e1', textAlign: 'left' }}>축복 기수</th>
              <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>{userInfo.generation || '-'}</td>
            </tr>
          </tbody>
        </table>

        {/* 진단 결과 핵심 */}
        <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
          <div style={{ flex: '1', backgroundColor: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '16px', color: '#0d5c3a', marginBottom: '10px' }}>분석된 영성/직무 페르소나</h2>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>{resultData.emoji}</div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 10px 0' }}>{resultData.persona}</h3>
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{resultData.desc}</p>
          </div>
          <div style={{ width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
             {/* PDF 렌더링용 간소화된 3D 차트 대체 또는 기존 컴포넌트 캡처 */}
             <RadarChart3D data={radarData} name="radar" strokeColor="#0d5c3a" />
          </div>
        </div>

        {/* 상세 분석 표 */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>{getLabel('strengths', lang) + ' & ' + getLabel('challenges', lang)}</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#059669', marginBottom: '8px' }}>{getLabel('strengths', lang)}</h3>
            <ul style={{ paddingLeft: '20px', margin: 0, color: '#334155' }}>
              {resultData.strengths.map((s: string, idx: number) => (
                <li key={idx} style={{ marginBottom: '8px', lineHeight: '1.5' }}>{s}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#e11d48', marginBottom: '8px' }}>{getLabel('challenges', lang)}</h3>
            <ul style={{ paddingLeft: '20px', margin: 0, color: '#334155' }}>
              {resultData.weaknesses.map((w: string, idx: number) => (
                <li key={idx} style={{ marginBottom: '8px', lineHeight: '1.5' }}>{w}</li>
              ))}
            </ul>
          </div>

          <div style={{ backgroundColor: '#fffbeb', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
            <h3 style={{ fontSize: '16px', color: '#b45309', margin: '0 0 8px 0' }}>{getLabel('hrComment', lang)}</h3>
            <p style={{ margin: 0, color: '#78350f', lineHeight: '1.6' }}>{resultData.advice}</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '20px', color: '#94a3b8', fontSize: '12px' }}>
          <p>{getLabel('reportGeneratedBy', lang)}</p>
          <p>{lang === 'ko' ? '출력 일자' : lang === 'en' ? 'Generated' : '出실日時'}: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </>
  );
};
