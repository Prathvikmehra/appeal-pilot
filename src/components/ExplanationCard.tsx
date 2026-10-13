import React, { useState } from 'react';
import { ExtractedFacts, ComputedDeadline, GeneratedKit } from '@/types/appeal';
import { formatDisplayDate } from '@/lib/date-calculator';
import { DatePickerModal } from './modals/DatePickerModal';
import {
  Clock,
  AlertTriangle,
  Info,
  Calendar,
  ExternalLink,
  Edit2,
  DollarSign,
  FileCheck,
  Building2,
  HelpCircle,
} from 'lucide-react';

interface ExplanationCardProps {
  facts: ExtractedFacts;
  deadline: ComputedDeadline;
  kit: GeneratedKit;
  onUpdateFact: (field: keyof ExtractedFacts, value: string) => void;
  onUpdateDeadline: (newDate: string) => void;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  facts,
  deadline,
  kit,
  onUpdateFact,
  onUpdateDeadline,
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs space-y-6 p-6 sm:p-7">
      {/* 1. Deadline Banner */}
      <div
        className={`rounded-xl p-4 sm:p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
          deadline.isUrgent
            ? 'bg-amber-50/80 border-amber-300/80 text-amber-950'
            : deadline.targetDate
            ? 'bg-teal-50/80 border-teal-200/80 text-teal-950'
            : 'bg-slate-100 border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-start space-x-3.5">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              deadline.isUrgent
                ? 'bg-amber-200 text-amber-800'
                : deadline.targetDate
                ? 'bg-teal-200 text-teal-800'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {deadline.isUrgent ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Clock className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-sm sm:text-base">
                {deadline.targetDate
                  ? `Appeal by ${formatDisplayDate(deadline.targetDate)}`
                  : 'Deadline Not Found in Letter'}
              </span>

              {deadline.isEstimated && (
                <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  Estimated
                </span>
              )}

              {deadline.daysRemaining !== null && (
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    deadline.isUrgent
                      ? 'bg-amber-500 text-white'
                      : 'bg-teal-600 text-white'
                  }`}
                >
                  {deadline.daysRemaining < 0
                    ? 'Expired'
                    : deadline.daysRemaining === 0
                    ? 'Due Today'
                    : `${deadline.daysRemaining} days left`}
                </span>
              )}
            </div>

            <p className="text-xs mt-1 text-slate-600">
              {deadline.calculationMath ? (
                <span>
                  Based on: {deadline.calculationMath}. <em>Confirm with your insurer.</em>
                </span>
              ) : deadline.targetDate ? (
                'Formal statutory appeal deadline stated in notice.'
              ) : (
                'Many insurers allow roughly 180 days, but verify your policy or call your insurer.'
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDatePickerOpen(true)}
          className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors self-end sm:self-center"
        >
          <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          Change date
        </button>
      </div>

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        currentDate={deadline.targetDate}
        onSaveDate={onUpdateDeadline}
      />

      {/* 2. Plain-English Summary */}
      <div className="space-y-1.5 border-b border-slate-100 pb-5">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center">
          <Info className="w-3.5 h-3.5 mr-1 text-teal-600" />
          Plain-English Translation
        </h2>
        <p className="text-base sm:text-lg font-medium text-slate-900 leading-snug">
          {kit.plainEnglishSummary}
        </p>
      </div>

      {/* 3. Interactive Facts Row */}
      <div className="space-y-2 border-b border-slate-100 pb-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Verified Case Facts <span className="text-[11px] font-normal text-slate-400">(Edits update letter instantly)</span>
          </h3>
          <span className="text-[11px] text-slate-400 flex items-center">
            <Edit2 className="w-3 h-3 mr-1" />
            Editable
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all">
            <label className="block text-[10px] font-bold text-slate-500 uppercase flex items-center mb-1">
              <Building2 className="w-3 h-3 mr-1 text-slate-400" />
              Insurer
            </label>
            <input
              type="text"
              value={facts.insurer}
              onChange={(e) => onUpdateFact('insurer', e.target.value)}
              className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all">
            <label className="block text-[10px] font-bold text-slate-500 uppercase flex items-center mb-1">
              <FileCheck className="w-3 h-3 mr-1 text-slate-400" />
              Claim / Ref #
            </label>
            <input
              type="text"
              value={facts.claimNumber}
              onChange={(e) => onUpdateFact('claimNumber', e.target.value)}
              className="w-full text-xs font-mono font-semibold text-slate-900 bg-transparent focus:outline-none"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all">
            <label className="block text-[10px] font-bold text-slate-500 uppercase flex items-center mb-1">
              <DollarSign className="w-3 h-3 mr-1 text-slate-400" />
              Disputed Amount
            </label>
            <input
              type="text"
              value={facts.disputedAmount}
              onChange={(e) => onUpdateFact('disputedAmount', e.target.value)}
              className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all">
            <label className="block text-[10px] font-bold text-slate-500 uppercase flex items-center mb-1">
              <Calendar className="w-3 h-3 mr-1 text-slate-400" />
              Letter Date
            </label>
            <input
              type="text"
              value={facts.letterDate || ''}
              onChange={(e) => onUpdateFact('letterDate', e.target.value)}
              placeholder="YYYY-MM-DD"
              className="w-full text-xs font-mono font-semibold text-slate-900 bg-transparent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Why They Denied It & Jargon Tags */}
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center">
          <HelpCircle className="w-3.5 h-3.5 mr-1 text-teal-600" />
          Why They Denied It & Translated Jargon
        </h3>

        <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200/70 p-3 rounded-xl italic">
          &ldquo;{facts.denialReasonRaw}&rdquo;
        </p>

        {facts.denialCodes.length > 0 && (
          <div className="space-y-2 pt-1">
            {facts.denialCodes.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3 text-xs bg-white border border-slate-200 rounded-lg p-2.5"
              >
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="font-mono font-bold text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                    {item.code}
                  </span>
                  <span className="font-semibold text-slate-800">{item.term}</span>
                </div>
                <span className="text-slate-600">→ {item.plainMeaning}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. What This Means For You */}
      <div className="space-y-2 border-b border-slate-100 pb-5">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          What This Means For You
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {kit.whatThisMeans}
        </p>
      </div>

      {/* 6. Good to Know Note (Static Sourced KFF Statistic) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-600">
        <div className="h-6 w-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="font-semibold text-slate-800">Good to know: </span>
          In Medicare Advantage, only about 11.5% of denials were appealed in 2024, yet about 80% of those appeals were overturned (
          <a
            href="https://www.kff.org/medicare/issue-brief/overturned-denials-in-medicare-advantage/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 underline font-medium inline-flex items-center hover:text-teal-800"
          >
            KFF, 2024
            <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
          </a>
          ). Appeals are often worth trying, though this figure covers Medicare Advantage and offers no guarantee for your specific case.
        </div>
      </div>
    </div>
  );
};
