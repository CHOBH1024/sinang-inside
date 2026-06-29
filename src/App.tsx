import { useState, useEffect, Suspense, lazy } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { SurveyIntro } from './components/SurveyIntro';
import { SurveyEngine } from './components/SurveyEngine';
import { AnalyzingScreen } from './components/AnalyzingScreen';
import { SurveyConfig, AnswerData, UserInfo, SurveyMode } from './types';
import { surveys } from './data/surveys';

const SurveyResults = lazy(() => import('./components/SurveyResults').then(module => ({ default: module.SurveyResults })));
const TeamSynergyDashboard = lazy(() => import('./components/TeamSynergyDashboard').then(module => ({ default: module.TeamSynergyDashboard })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(module => ({ default: module.AdminPanel })));
const ColumnLounge = lazy(() => import('./components/ColumnLounge').then(module => ({ default: module.ColumnLounge })));
const BalanceGame = lazy(() => import('./components/BalanceGame').then(module => ({ default: module.BalanceGame })));
const PersonaMatcher = lazy(() => import('./components/PersonaMatcher').then(module => ({ default: module.PersonaMatcher })));
const HRIntakeForm = lazy(() => import('./components/HRIntakeForm').then(module => ({ default: module.HRIntakeForm })));
const FaithJournal = lazy(() => import('./components/FaithJournal').then(module => ({ default: module.FaithJournal })));

import { AdsensePassSection } from './components/AdsensePassSection';

// Simple state machine for routing
type AppState = 'dashboard' | 'intro' | 'hr-intake' | 'engine' | 'analyzing' | 'results' | 'team' | 'admin' | 'columns' | 'balanceGame' | 'matcher' | 'journal';

export default function App() {
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [activeSurvey, setActiveSurvey] = useState<SurveyConfig | null>(surveys[0]);
  const [surveyMode, setSurveyMode] = useState<SurveyMode>('general');
  const [answers, setAnswers] = useState<Record<number, AnswerData>>({});
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // URL 쿼리 파라미터 (?persona=...) 감지 및 결과 페이지 즉시 라우팅
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const personaParam = params.get('persona');
    if (personaParam) {
      import('./data/surveys').then(({ surveys }) => {
        const survey = surveys[0];
        if (survey) {
          // 해당 페르소나 이름에 매핑되는 점수 역산 (100점부터 0점까지 하향 탐색)
          let targetAvg = 50; 
          for (let score = 100; score >= 0; score -= 2) {
            try {
              const res = survey.getResultContent(score, Array(survey.categories.length).fill(score));
              const cleanResPersona = res.persona.replace(/\s+/g, '_');
              const cleanParamPersona = personaParam.replace(/\s+/g, '_');
              if (cleanResPersona === cleanParamPersona || res.persona === personaParam) {
                targetAvg = score;
                break;
              }
            } catch (e) {
              // ignore
            }
          }
          
          // targetAvg 점수에 맞추어 mock answers 생성 (1~5점 척도 변환)
          // averageScore = (avgVal - 1) * 25 => avgVal = (targetAvg / 25) + 1
          const mockVal = (targetAvg / 25) + 1;
          const mockAnswers: Record<number, AnswerData> = {};
          survey.questions.forEach((_, idx) => {
            mockAnswers[idx] = { value: Math.max(1, Math.min(5, Math.round(mockVal))), latencyMs: 1200 };
          });

          setActiveSurvey(survey);
          setAnswers(mockAnswers);
          setSurveyMode('general');
          setAppState('results');
        }
      }).catch(err => {
        console.error('Failed to route to dynamic persona', err);
      });
    }
  }, []);

  const handleSelectSurvey = (config: SurveyConfig) => {
    setAnswers({});
    setUserInfo(null);
    setAppState('intro');
  };

  const handleStartSurvey = (mode: SurveyMode) => {
    setSurveyMode(mode);
    setAppState('hr-intake');
  };

  const handleIntakeSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setAppState('engine');
  };

  const handleCompleteSurvey = (finalAnswers: Record<number, AnswerData>) => {
    setAnswers(finalAnswers);
    setAppState('analyzing');
  };

  const handleRestart = () => {
    setAnswers({});
    setAppState('intro');
  };

  const handleHome = () => {
    setActiveSurvey(surveys[0]);
    setAnswers({});
    setAppState('dashboard');
  };

  return (
    <div className="min-h-screen">

      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-500 font-semibold tracking-widest animate-pulse">LOADING...</div>}>
        {appState === 'dashboard' && (
          <>
            <Dashboard 
              onSelectSurvey={handleSelectSurvey} 
              onNavigate={(route) => setAppState(route)} 
            />
            <AdsensePassSection />
          </>
        )}
        
        {appState === 'team' && <TeamSynergyDashboard onBack={handleHome} />}
        {appState === 'admin' && <AdminPanel onBack={handleHome} />}
        {appState === 'columns' && <ColumnLounge onBack={handleHome} />}
        {appState === 'balanceGame' && <BalanceGame onBack={handleHome} />}
        {appState === 'matcher' && <PersonaMatcher onBack={handleHome} />}
        {appState === 'journal' && <FaithJournal onBack={handleHome} />}
        
        {appState === 'intro' && activeSurvey && (
          <SurveyIntro 
            survey={activeSurvey} 
            onBack={handleHome} 
            onStart={handleStartSurvey} 
          />
        )}

        {appState === 'hr-intake' && (
          <HRIntakeForm 
            onBack={() => setAppState('intro')}
            onSubmit={handleIntakeSubmit}
          />
        )}
        
        {appState === 'engine' && activeSurvey && (
          <SurveyEngine
            survey={activeSurvey}
            mode={surveyMode}
            onComplete={handleCompleteSurvey}
          />
        )}

        {appState === 'analyzing' && activeSurvey && (
          <AnalyzingScreen color={activeSurvey.color} onComplete={() => setAppState('results')} />
        )}
        
        {appState === 'results' && activeSurvey && (
          <SurveyResults
            survey={activeSurvey}
            answers={answers}
            mode={surveyMode}
            userInfo={userInfo}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}
      </Suspense>
    </div>
  );
}
