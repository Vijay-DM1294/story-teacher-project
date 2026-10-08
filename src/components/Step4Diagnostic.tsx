import React from 'react';
import { Download, RotateCcw, Sparkles, CheckCircle2, Clock, AlertTriangle, MessageSquare, BookOpen } from 'lucide-react';
import { StoryTeacherResponse } from '../types';

interface Step4DiagnosticProps {
  storyData: StoryTeacherResponse;
  topic: string;
  ageBracket: string;
  protagonist: string;
  score: number;
  totalQuestions: number;
  userAnswers: Record<number, number>;
  onRetakeQuiz: () => void;
  onNewAdventure: () => void;
}

export const Step4Diagnostic: React.FC<Step4DiagnosticProps> = ({
  storyData,
  topic,
  ageBracket,
  protagonist,
  score,
  totalQuestions,
  userAnswers,
  onRetakeQuiz,
  onNewAdventure,
}) => {
  const total = totalQuestions > 0 ? totalQuestions : 3;
  const masteryPct = Math.round((score / total) * 100);

  let badge = '🌱 Budding Inquirer';
  let badgeDesc = 'Initial exposure gained; guided re-reading recommended.';
  if (masteryPct === 100) {
    badge = '🏆 Concept Champion';
    badgeDesc = 'Flawless conceptual retention and real-world application reasoning!';
  } else if (masteryPct >= 66) {
    badge = '🌟 Skilled Explorer';
    badgeDesc = 'Solid foundational grasp; minor review recommended for transfer tasks.';
  } else if (masteryPct >= 33) {
    badge = '💡 Apprentice Thinker';
    badgeDesc = 'Developing intuition; needs reinforced narrative metaphors.';
  }

  const milestones = [
    {
      title: 'Foundational Recall',
      desc: 'Identifies the core scientific or mathematical definition from memory.',
    },
    {
      title: 'In-Story Reasoning',
      desc: 'Understands how the concept was applied to solve the narrative problem.',
    },
    {
      title: 'Real-World Transfer',
      desc: 'Applies the concept to novel everyday scenarios outside the story.',
    },
  ];

  const handleDownloadReport = () => {
    const reportMd = `# StoryTeacher AI - Learning Diagnostic Report
**Student / Hero:** ${protagonist}  
**Topic:** ${topic}  
**Target Age:** ${ageBracket}  
**Concept Mastery Score:** ${masteryPct}% (${score}/${total} Questions Correct)  
**Achievement Badge:** ${badge}  

---

## 1. Story Adventure Summary
- **Title:** ${storyData.title}
- **The Mission:** ${storyData.mission_hook}
- **Secret Academic Takeaway:** ${storyData.science_takeaway}

---

## 2. Comprehension Quiz Breakdown
${storyData.quiz
  .map(
    (q, i) =>
      `- **Q${i + 1}:** ${q.question} (${q.milestone}) - ${
        userAnswers[i] === q.correct_index ? 'CORRECT' : 'REVIEW NEEDED'
      }`
  )
  .join('\n')}

---

## 3. Pedagogical Observations
- **Diagnostic Summary:** ${storyData.diagnostic_summary}
- **Common Misconceptions Alert:** ${storyData.common_misconceptions}

---

## 4. Family Dinner-Table Discussion Prompt
> "${storyData.dinner_table_question}"

*Report generated automatically by StoryTeacher AI powered by Google Gemini.*
`;

    const blob = new Blob([reportMd], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StoryTeacher_Report_${topic.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            Learning Analytics & Insights
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">
            Step 4: Parent & Educator Diagnostic Lab
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Diagnostic assessment of student comprehension, milestone progression, and actionable conversation prompts.
          </p>
        </div>

        {/* Diagnostic Hero Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 p-6 md:p-8 text-white shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-indigo-200 font-semibold opacity-90">
                Student Concept Mastery
              </span>
              <div className="text-4xl md:text-5xl font-black mt-1 mb-2 text-white">
                {masteryPct}% Mastery
              </div>
              <p className="text-indigo-200 text-sm">
                Score: <strong className="text-white">{score} / {total}</strong> Questions Correct
              </p>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-4 md:p-5 max-w-xs">
              <div className="text-lg md:text-xl font-extrabold text-white mb-1">{badge}</div>
              <p className="text-xs text-indigo-100/90 leading-relaxed">{badgeDesc}</p>
            </div>
          </div>
        </div>

        {/* Learning Milestones Met Breakdown */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Learning Milestones Met</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {milestones.map((m, mIdx) => {
              const quizQ = storyData.quiz[mIdx];
              const isMet = quizQ ? userAnswers[mIdx] === quizQ.correct_index : false;

              return (
                <div
                  key={mIdx}
                  className={`rounded-xl p-5 border flex flex-col justify-between ${
                    isMet
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-800 text-sm mb-1">{m.title}</div>
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-2">
                      {isMet ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">✅ MET</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span className="text-amber-700">⏳ REVIEW NEEDED</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-2 mt-2">
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pedagogical Observations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl bg-blue-50/60 border border-blue-200 p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>🔬 Diagnostic Summary</span>
            </h4>
            <p className="text-xs md:text-sm text-blue-950 leading-relaxed">
              {storyData.diagnostic_summary}
            </p>
          </div>

          <div className="rounded-xl bg-amber-50/60 border border-amber-200 p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>⚠️ Common Misconceptions Alert</span>
            </h4>
            <p className="text-xs md:text-sm text-amber-950 leading-relaxed">
              {storyData.common_misconceptions}
            </p>
          </div>
        </div>

        {/* Dinner-Table Discussion Question Card */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/60 border-2 border-dashed border-orange-300 p-6 mb-8">
          <div className="text-sm font-extrabold uppercase tracking-wider text-orange-900 mb-1 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            <span>🍽️ Family Dinner-Table Discussion Prompt</span>
          </div>
          <p className="text-xs text-orange-800/80 mb-3">
            Ask your child or student this question casually over dinner or circle time to reinforce everyday learning:
          </p>
          <div className="text-base md:text-lg font-bold italic text-orange-950 leading-relaxed">
            "{storyData.dinner_table_question}"
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleDownloadReport}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>📥 Download Diagnostic Report (.md)</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onRetakeQuiz}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={onNewAdventure}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              🚀 Start New Adventure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
