import fs from 'fs';

const s = fs.readFileSync('src/data/surveys.ts', 'utf8');
const p = fs.readFileSync('src/data/personaData.ts', 'utf8');
const scoring = fs.readFileSync('src/utils/scoringEngine.ts', 'utf8');

const ids = [...s.matchAll(/id:\s*"(survey-[^"]+)"/g)].map((m) => m[1]);
const cats = [...s.matchAll(/categories:\s*\[([^\]]+)\]/g)].map(
  (m) => m[1].split(',').filter((x) => x.trim()).length
);
const getResultParams = [...s.matchAll(/getResultContent:\s*\(([^)]*)\)/g)].map(
  (m) => m[1].trim()
);
const personaKeys = [...p.matchAll(/'(survey-[^']+)':/g)].map((m) => m[1]);
const personaNames = (p.match(/name:\s*"/g) || []).length;
const crossVal = (s.match(/isCrossValidation/g) || []).length;
const axesHardcoded = scoring.includes('[1, 2, 3, 4, 5, 6]');

// scoring formulas from source
function scoreOne(t, value) {
  if (t === 'V') return value === 1 ? 0 : 100;
  if (t === 'R') return ((5 - value) / 4) * 100;
  return ((value - 1) / 4) * 100;
}
function personaIdx(avg) {
  return Math.min(8, Math.max(0, Math.floor(avg / 11.12)));
}

const extremes = {
  L: [1, 5, 0, 6].map((v) => ({ v, score: scoreOne('L', v) })),
  R: [1, 5, 0, 6].map((v) => ({ v, score: scoreOne('R', v) })),
  V: [1, 5, 0, 2].map((v) => ({ v, score: scoreOne('V', v) })),
};
const buckets = [0, 11.11, 11.12, 50, 88.96, 100, 111, -5, NaN].map((avg) => ({
  avg,
  idx: personaIdx(avg),
}));

console.log(
  JSON.stringify(
    {
      structure: {
        surveyCount: ids.length,
        ids,
        catsPerSurvey: cats,
        getResultParams,
        personaKeys,
        personaNameCount: personaNames,
        expectedPersonasIf9each: ids.length * 9,
        isCrossValidationMentions: crossVal,
        axesHardcoded6: axesHardcoded,
      },
      extremes,
      buckets,
      notes: {
        categoryScoresIgnoredByGetResult: getResultParams.every(
          (p) => p === 'avg' || !p.includes('category')
        ),
        synergyDefinedNotAppliedToTotals: scoring.includes('synergyBonuses') && !scoring.includes('categoryScores[0] +='),
      },
    },
    null,
    2
  )
);
