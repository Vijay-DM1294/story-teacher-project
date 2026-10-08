import React from 'react';
import { Compass, BookText, HelpCircle, BarChart3 } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  hasStory: boolean;
  quizSubmitted: boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onSelectStep,
  hasStory,
  quizSubmitted,
}) => {
  const steps = [
    { number: 1, label: '1. Craft Adventure', icon: Compass, enabled: true },
    { number: 2, label: '2. Read Story', icon: BookText, enabled: hasStory },
    { number: 3, label: '3. Comprehension Quest', icon: HelpCircle, enabled: hasStory },
    { number: 4, label: '4. Diagnostic Report', icon: BarChart3, enabled: hasStory },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
      {steps.map((step) => {
        const Icon = step.icon;
        const isActive = currentStep === step.number;
        const isDisabled = !step.enabled;

        return (
          <button
            key={step.number}
            onClick={() => !isDisabled && onSelectStep(step.number)}
            disabled={isDisabled}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all border ${
              isActive
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm ring-2 ring-indigo-500/20'
                : isDisabled
                ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : isDisabled ? 'text-slate-400' : 'text-slate-500'}`} />
            <span>{step.label}</span>
          </button>
        );
      })}
    </div>
  );
};
