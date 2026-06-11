import { useState } from 'react';
import { UserInfo } from '../types';
import { ArrowLeft, UserCircle, MapPin, Briefcase, Calendar, CheckCircle, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { getLabel, SupportedLang } from '../i18n/theologyDictionary';

interface HRIntakeFormProps {
  onBack: () => void;
  onSubmit: (userInfo: UserInfo) => void;
}

export const HRIntakeForm = ({ onBack, onSubmit }: HRIntakeFormProps) => {
  const [lang, setLang] = useState<SupportedLang>('ko');
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    region: '',
    position: '',
    generation: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserInfo, boolean>>>({});

  const langCycles: SupportedLang[] = ['ko', 'en', 'ja'];
  const langLabels: Record<SupportedLang, string> = { ko: '🇰🇷 한국어', en: '🇺🇸 English', ja: '🇯🇵 日本語' };
  const toggleLang = () => {
    const idx = langCycles.indexOf(lang);
    setLang(langCycles[(idx + 1) % langCycles.length]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserInfo]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof UserInfo, boolean>> = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.region) newErrors.region = true;
    if (!formData.position) newErrors.position = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (navigator.vibrate) navigator.vibrate([20, 20, 20]);
      return;
    }

    if (navigator.vibrate) navigator.vibrate(20);
    onSubmit(formData);
  };

  const regions = [
    '제1지구 (서울/인천)', '제2지구 (경기/강원)', '제3지구 (충청)', 
    '제4지구 (호남)', '제5지구 (영남)', 'HJ천주천보수련원', 
    '선문대학교/선학UP', '기타 공직기관', '해외 선교지'
  ];

  const positions = [
    '목회자 (교구장/교회장)', '부목회자/전도사', '기관 공직자', 
    '청년 학생 리더', '축복가정 (일반 식구)', '신종족메시아', '기타'
  ];

  return (
    <div className="bg-[#0b130f] min-h-[100dvh] flex flex-col font-sans text-slate-100 relative selection:bg-[#b8860b] selection:text-white">
      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-40 bg-[#0d5c3a]/80 backdrop-blur-xl border-b border-[#b8860b]/20 px-6 py-4 shadow-lg flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-extrabold text-white flex items-center gap-2 text-sm sm:text-base tracking-wider">
          <UserCircle size={18} className="text-[#b8860b]" /> {lang === 'ko' ? '공식 인사기록 제출' : lang === 'en' ? 'Official HR Record Submission' : '公式人事記録提出'}
        </span>
        <button onClick={toggleLang} className="flex items-center gap-1 text-xs font-bold text-[#b8860b] hover:text-white transition-colors bg-[#b8860b]/10 px-3 py-1.5 rounded-full border border-[#b8860b]/30 cursor-pointer">
          <Globe size={14} /> {langLabels[lang]}
        </button>
      </header>

      {/* ── 메인 폼 ── */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 sm:px-6 py-12 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111e17] rounded-3xl p-6 sm:p-8 border border-[#0d5c3a]/30 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#b8860b]/10 rounded-full blur-[60px] pointer-events-none"></div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white mb-2">{getLabel('hrIntakeTitle', lang)}</h2>
            <p className="text-sm text-slate-400 word-keep leading-relaxed">
              {lang === 'ko' ? '본 진단은 가정연합 공식 인사기록 및 영성 평가 리포트로 활용됩니다. 정확한 분석을 위해 소속과 성함을 입력해 주세요.' : lang === 'en' ? 'This assessment is used as an official FFWPU HR and spirituality evaluation report. Please enter your affiliation and name for accurate analysis.' : '本診断は家庭連合の公式人事記録および霊性評価レポートとして活用されます。正確な分析のため、所属とお名前をご入力ください。'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 이름 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                <UserCircle size={16} className="text-[#b8860b]" /> {getLabel('name', lang)} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={lang === 'ko' ? '실명을 입력하세요' : lang === 'en' ? 'Enter your full name' : '本名をご入力ください'}
                className={`w-full bg-[#0b130f] border ${errors.name ? 'border-rose-500/50' : 'border-[#0d5c3a]/30 focus:border-[#b8860b]'} rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-colors`}
              />
              {errors.name && <p className="text-xs text-rose-400 font-bold">{lang === 'ko' ? '성명을 입력해주세요.' : lang === 'en' ? 'Please enter your name.' : 'お名前をご入力ください。'}</p>}
            </div>

            {/* 교구/소속 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                <MapPin size={16} className="text-[#b8860b]" /> {getLabel('region', lang)} <span className="text-rose-400">*</span>
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={`w-full bg-[#0b130f] border ${errors.region ? 'border-rose-500/50' : 'border-[#0d5c3a]/30 focus:border-[#b8860b]'} rounded-xl px-4 py-3 text-white outline-none transition-colors appearance-none`}
              >
                <option value="" disabled>선택해주세요</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.region && <p className="text-xs text-rose-400 font-bold">소속을 선택해주세요.</p>}
            </div>

            {/* 직책 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                <Briefcase size={16} className="text-[#b8860b]" /> {getLabel('position', lang)} <span className="text-rose-400">*</span>
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={`w-full bg-[#0b130f] border ${errors.position ? 'border-rose-500/50' : 'border-[#0d5c3a]/30 focus:border-[#b8860b]'} rounded-xl px-4 py-3 text-white outline-none transition-colors appearance-none`}
              >
                <option value="" disabled>선택해주세요</option>
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.position && <p className="text-xs text-rose-400 font-bold">직책을 선택해주세요.</p>}
            </div>

            {/* 축복 기수 (선택) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar size={16} className="text-[#b8860b]" /> {getLabel('blessingGeneration', lang)} <span className="text-slate-500 text-xs font-normal">({lang === 'ko' ? '선택' : lang === 'en' ? 'Optional' : '任意'})</span>
              </label>
              <input
                type="text"
                name="generation"
                value={formData.generation || ''}
                onChange={handleChange}
                placeholder={lang === 'ko' ? '예: 430가정, 3만가정, 2세 400가정' : lang === 'en' ? 'e.g. 430 Couple Blessing, 30,000 Couple Blessing' : '例: 430家庭, 3万家庭, 2世 400家庭'}
                className="w-full bg-[#0b130f] border border-[#0d5c3a]/30 focus:border-[#b8860b] rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-colors"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#0d5c3a] to-[#b8860b] hover:from-[#0f764a] hover:to-[#d97706] text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle size={20} /> {getLabel('submitAndStartDiagnosis', lang)}
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-500 mt-2">
              {lang === 'ko' ? '입력하신 정보는 진단 결과 리포트 출력용으로만 안전하게 사용됩니다.' : lang === 'en' ? 'Your information is used safely for report generation only.' : '入力情報は診断レポート出力のみに安全に使用されます。'}
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
};
