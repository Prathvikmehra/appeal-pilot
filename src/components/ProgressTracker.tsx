import React from 'react';
import { Check, Loader2, Sparkles } from 'lucide-react';

interface ProgressTrackerProps {
  currentStep: number; // 1 to 4
  isComplete: boolean;
  collapsed?: boolean;
}

const STEPS = [
  { id: 1, label: 'Reading your letter' },
  { id: 2, label: 'Finding the denial reason, amount, and deadline' },
  { id: 3, label: 'Translating it into plain English' },
  { id: 4, label: 'Building your action kit' },
];

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep, isComplete, collapsed }) => {
  if (isComplete && collapsed) {
    return (
      <div className="w-full bg-teal-50 border border-teal-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-teal-800 shadow-xs mb-4 animate-fadeIn">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 rounded-full bg-teal-600 text-white flex items-center justify-center">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="font-semibold">Analysis complete — Action Kit ready</span>
        </div>
        <span className="text-teal-600 font-medium text-[11px] flex items-center">
          <Sparkles className="w-3 h-3 mr-1" />
          4 stages verified
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
          Analyzing Document
        </h3>
        <span className="text-xs font-medium text-teal-700">
          {isComplete ? 'Complete' : `Step ${Math.min(currentStep, 4)} of 4`}
        </span>
      </div>

      <div className="space-y-3">
        {STEPS.map((step) => {
          const isDone = isComplete || currentStep > step.id;
          const isActive = !isComplete && currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 transition-colors ${
                isDone
                  ? 'text-slate-900'
                  : isActive
                  ? 'text-teal-900 font-medium'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                  isDone
                    ? 'bg-teal-600 text-white shadow-xs'
                    : isActive
                    ? 'bg-teal-100 text-teal-800 ring-2 ring-teal-500/30'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isActive ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className="text-xs sm:text-sm">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
