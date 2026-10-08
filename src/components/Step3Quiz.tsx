import React from 'react';
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';

interface Step3QuizProps {
  quizQuestions: QuizQuestion[];
  topic: string;
  userAnswers: Record<number, number>;
  onSelectAnswer: (qIndex: number, optionIndex: number) => void;
  isSubmitted: boolean;
  score: number;
  onSubmit: () => void;
  onRetake: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const Step3Quiz: React.FC<Step3QuizProps> = ({
  quizQuestions,
  topic,
  userAnswers,
  onSelectAnswer,
  isSubmitted,
  score,
  onSubmit,
  onRetake,
  onPrevStep,
  onNextStep,
}) => {
  const allAnswered =
    quizQuestions.length > 0 &&
    quizQuestions.every((_, idx) => userAnswers[idx] !== undefined && userAnswers[idx] !== -1);

  const handleSubmit = () => {
    onSubmit();
    // Calculate if perfect score for celebration
    let currentScore = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_index) {
        currentScore++;
      }
    });

    if (currentScore === quizQuestions.length) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if confetti fails
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            Formative Assessment
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">
            Step 3: Interactive Comprehension Quest
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Test your mastery of <strong className="text-slate-800">{topic}</strong>! Answer all 3 questions below.
          </p>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-sm">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Score: {score} / {quizQuestions.length} Correct</span>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-6 mb-8">
        {quizQuestions.map((q, qIdx) => {
          const selectedOption = userAnswers[qIdx];
          const isCorrect = isSubmitted && selectedOption === q.correct_index;
          const isWrong = isSubmitted && selectedOption !== q.correct_index;

          return (
            <div
              key={qIdx}
              className={`rounded-2xl border p-5 md:p-6 transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-red-200 bg-red-50/20'
                  : 'border-slate-200 bg-slate-50/40'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="uppercase tracking-wider text-indigo-600">
                  Question {qIdx + 1} of {quizQuestions.length}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {q.milestone}
                </span>
              </div>

              <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">
                {q.question}
              </h3>

              {/* Multiple Choice Options */}
              <div className="space-y-2 mb-4">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  const isThisCorrect = isSubmitted && optIdx === q.correct_index;

                  let optionStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';

                  if (isSubmitted) {
                    if (isThisCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium ring-1 ring-emerald-500';
                    } else if (isThisSelected && !isThisCorrect) {
                      optionStyle = 'border-red-400 bg-red-50 text-red-900 line-through';
                    } else {
                      optionStyle = 'border-slate-200 bg-slate-100/60 text-slate-400 opacity-70';
                    }
                  } else if (isThisSelected) {
                    optionStyle = 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-medium ring-2 ring-indigo-500/20';
                  }

                  return (
                    <label
                      key={optIdx}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm cursor-pointer transition-all ${optionStyle} ${
                        isSubmitted ? 'cursor-default' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`quiz_q_${qIdx}`}
                        checked={isThisSelected}
                        onChange={() => !isSubmitted && onSelectAnswer(qIdx, optIdx)}
                        disabled={isSubmitted}
                        className="mt-0.5 accent-indigo-600 w-4 h-4 cursor-pointer disabled:cursor-default"
                      />
                      <span className="flex-1 leading-snug">{opt}</span>
                    </label>
                  );
                })}
              </div>

              {/* Explanation Badge after submission */}
              {isSubmitted && (
                <div
                  className={`rounded-xl p-3.5 text-xs md:text-sm border ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Spot on! You got it right!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>
                          Nice try! Correct answer: <strong>{q.options[q.correct_index]}</strong>
                        </span>
                      </>
                    )}
                  </div>
                  <p className="opacity-90 leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onPrevStep}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>📖 Read Story Again (Step 2)</span>
          </button>

          {isSubmitted && (
            <button
              onClick={onRetake}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          )}
        </div>

        <div>
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              🎯 Submit My Answers
            </button>
          ) : (
            <button
              onClick={onNextStep}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>View Diagnostic Report (Step 4)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
