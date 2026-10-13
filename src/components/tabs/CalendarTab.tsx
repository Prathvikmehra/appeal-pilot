import React, { useState } from 'react';
import { ComputedDeadline, GeneratedKit } from '@/types/appeal';
import { formatDisplayDate } from '@/lib/date-calculator';
import { generateIcsString, downloadIcsFile } from '@/lib/ics-generator';
import { Calendar, Download, Check, Bell, AlertCircle } from 'lucide-react';

interface CalendarTabProps {
  deadline: ComputedDeadline;
  kit: GeneratedKit;
  claimNumber: string;
  onSetDate: (newDate: string) => void;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  deadline,
  kit,
  claimNumber,
  onSetDate,
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [manualInput, setManualInput] = useState('');

  const handleDownload = () => {
    if (!deadline.targetDate) return;

    const icsContent = generateIcsString({
      title: kit.calendarEvent.title || `Appeal Deadline - Claim ${claimNumber}`,
      description: kit.calendarEvent.description,
      targetDate: deadline.targetDate,
      isEstimated: deadline.isEstimated,
      alarmDaysPrior: deadline.alarmDaysPrior,
    });

    downloadIcsFile(`appeal-deadline-${claimNumber || 'claim'}`, icsContent);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput) {
      onSetDate(manualInput);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Never miss a deadline: </span>
          Download an `.ics` file that works natively with Google Calendar, Apple Calendar, and Outlook.
        </p>

        {deadline.targetDate && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-2xs transition-colors self-end sm:self-auto flex-shrink-0"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Add to Calendar (.ics)
              </>
            )}
          </button>
        )}
      </div>

      {!deadline.targetDate ? (
        /* Missing Deadline State: Prompt Date Selection */
        <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-6 text-center space-y-4">
          <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-950">Select a Date to Enable Calendar Reminder</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              No deadline date was detected in your letter. Enter a target date to generate your calendar alarm reminder.
            </p>
          </div>

          <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-sm mx-auto">
            <input
              type="date"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              required
              className="px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!manualInput}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              Set Date
            </button>
          </form>
        </div>
      ) : (
        /* Active Deadline Event Card */
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 inline-block mb-1.5">
                {deadline.isEstimated ? 'Estimated All-Day Event' : 'All-Day Calendar Event'}
              </span>
              <h3 className="text-base font-bold text-slate-900">{kit.calendarEvent.title}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-semibold text-slate-500">Event Date</span>
              <p className="text-sm font-bold text-slate-900">{formatDisplayDate(deadline.targetDate)}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Event Description:</span>
            <p className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 text-slate-600">
              {deadline.isEstimated && (
                <span className="block font-semibold text-amber-800 mb-1">
                  ⚠️ Estimated deadline, confirm with your insurer.
                </span>
              )}
              {kit.calendarEvent.description}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center">
              <Bell className="w-3.5 h-3.5 mr-1 text-teal-600" />
              Automated Alarms Included in File
            </h4>
            <div className="flex flex-wrap gap-2">
              {deadline.alarmDaysPrior.map((days, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200"
                >
                  <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                  {days} days before ({days}d reminder alarm)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
