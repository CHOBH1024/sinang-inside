import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface Column {
  title: string;
  category: string;
  content: string;
}

const columnsData: Column[] = [
  {
    title: "공생공영의 평화 혁신가 유형의 성공 패턴 — 교리적 장벽을 넘어 보편적 참사랑과 공생공영의 사회적 실천을 지향하는 평화의 개척자",
    category: "트렌드 분석",
    content: "당신은 전통적인 제도나 형식에 얽매이지 않고, 양심의 자유와 주체적 실천을 중시하는 현대적 신앙인입니다. 타 종교나 일반 사회와의 열린 소통을 선호하며, 하나님의 참사랑을 세상 속에 구체적인 평화 운동으로 실현하는 데 관심이 큽니다. 수평적 실천이 열매를 맺기 위해서는 수직적 영성 및 원리의 근본 뼈대와 결합할 때 더욱 강력해집니다. 이 유형의 대표 강점은 보편적이고 열린 세계관, 창의적이고 주체적인 실천력, 뛰어난 타 교파 및 사회 소통력이며, 개인의 자율성을 존중해 주세요 초종교적인 가치와 비전을 제시하세요"
  },
  {
    title: "현대적 섭리 협력가 유형의 성공 패턴 — 살아있는 참어머니 계시와 은혜를 중심 삼고, 주체적으로 섭리에 동참하는 협력자",
    category: "전문가 칼럼",
    content: "당신은 참부모님의 승리와 축복의 은사에 대한 깊은 감사와 믿음을 기반으로, 현시대의 섭리에 유연하고 주체적으로 발맞추어 나가는 신앙인입니다. 탕감과 고난의 시기를 넘어 천일국 안착의 은혜를 실감하며 섭리적 확장을 도모합니다. 현대적인 섭리 적응 속에서도 원리의 학술적이고 논리적인 뼈대를 학습하여 이론적 깊이를 채워 나가세요. 이 유형의 대표 강점은 현재 섭리 방향에 대한 민첩한 적응력, 은혜와 해원 중심의 긍정적 태도, 조직 내 유연한 소통이며, 현재 섭리의 핵심 가치와 비전을 공유해 주세요 행복하고 은혜로운 소통 방식을 선호합니다"
  },
  {
    title: "심정적 조화의 동반자 유형의 성공 패턴 — 하늘부모님과의 수직적 심정과 이웃과의 수평적 참사랑을 조화롭게 일치시키는 신앙의 기둥",
    category: "심층 리포트",
    content: "당신은 수직적 믿음과 수평적 실천, 전통적 원리 고수와 현대적 말씀의 발전 사이에서 균형을 잡으려고 노력하는 지혜로운 신앙인입니다. 참가정의 삼대권 완성을 추구하는 동시에 공적 사명의 가치도 잊지 않으며, 신앙 공동체의 가장 안정적인 기둥 역할을 수행합니다. 때로는 갈등을 회피하기보다 확고한 신학적 신념을 명확히 밝히고 방향을 이끄는 결단력이 필요합니다. 이 유형의 대표 강점은 탁월한 중심 잡기와 균형 감각, 안정적이고 성실한 신앙 태도, 가정과 공직의 조화력이며, 수직적 명분과 수평적 명분을 골고루 제시해 주세요 안정적이고 신뢰할 수 있는 소통을 원합니다"
  },
  {
    title: "정통적 말씀 수호자 유형의 성공 패턴 — 원리강론의 절대성과 참아버님의 역사적 말씀 유산을 철저히 수호하는 신앙의 수문장",
    category: "자기계발",
    content: "당신은 원리강론과 문선명 총재 생전의 말씀선집의 근본적 가치를 깊이 사랑하며, 타락한 세상 속에서 순수한 수직적 심정 관계와 원리를 변함없이 보존하려는 굳건한 신앙의 수호자입니다. 교단 고유의 신앙 정체성과 전통을 수호하는 뼈대 역할을 담당합니다. 원리의 절대적 가치를 수호하되, 세상과 이웃이 이해할 수 있는 보편적 사랑의 언어로 번역해 소통하는 훈련이 가치를 배가시킵니다. 이 유형의 대표 강점은 타합 없는 확고한 원리 신앙, 역사적 유산과 전통 보존력, 깊은 내적 수직적 기도와 영성이며, 원리와 말씀의 근거를 정확히 제시해 주세요 전통과 예식의 엄밀성을 존중해 주세요"
  },
  {
    title: "고난 극복의 탕감 수련생 유형의 성공 패턴 — 개인의 책임분담과 고난의 극복을 통해 참부모님께 절대 귀일하려는 신앙의 실천 전사",
    category: "조직 인사이트",
    content: "당신은 인간 책임분담 5% 완수와 고난을 통한 성화를 중심 삼는 엄격하고 진지한 신앙인입니다. 세상적 편안함을 철저히 경계하고 공적 생애와 제물의 길을 자처하며, 하늘의 아픈 심정을 스스로 상속받아 풀어드리기 위해 탕감 조건의 길을 자박자박 걸어갑니다. 탕감과 조건도 중요하지만, 참부모님께서 다 이루어 놓으신 안착의 은사와 하늘부모님의 무한한 은혜 안에서 자유함과 기쁨을 누리는 훈련도 필요합니다. 이 유형의 대표 강점은 탁월한 위기 돌파력과 정신력, 희생적인 헌신과 제물적 신앙 태도, 개인 성화와 개성완성 의지이며, 명확한 섭리적 명분과 미션을 제안해 주세요 진지하고 엄숙한 태도로 대화해 주세요"
  }
];

export const AdsensePassSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-6 py-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <BookOpen className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-bold text-white tracking-wide">
          Knowledge Hub &amp; 전문가 칼럼
        </h2>
      </div>
      
      <p className="text-sm text-gray-400 mb-6 leading-relaxed">
        본 진단 시스템은 신앙인사이드 - 나의 신앙 성향 및 심정 스펙트럼 진단 (Sinang Radar) 기반 다차원 역량 분석을 제공하며,
        아래 칼럼 섹션은 신앙진단, 가정연합, 통일교, 참부모신학, 통일신학, 심리테스트, 성향진단 트렌드 파악 및 자기 계발을 위해 정기적으로 업데이트되는 지식 아카이브입니다.
      </p>

      <div className="space-y-4">
        {columnsData.map((column, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className="rounded-xl border border-white/5 bg-white/5 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left transition-colors duration-200 hover:bg-white/5"
              >
                <div className="flex-1">
                  <span className="inline-block px-2 py-0.5 mb-1.5 text-xs font-semibold rounded bg-indigo-500/20 text-indigo-300">
                    {column.category}
                  </span>
                  <h3 className="text-base font-semibold text-white leading-snug">
                    {column.title}
                  </h3>
                </div>
                <div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[800px] border-t border-white/5 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <div className="p-5 text-sm text-gray-300 leading-relaxed font-light whitespace-pre-line">
                  {column.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
