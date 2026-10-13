import React, { useState } from 'react';
import { Calendar, X, Check } from 'lucide-react';
import { formatDisplayDate } from '@/lib/date-calculator';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: string | null; // ISO YYYY-MM-DD
  onSaveDate: (newDate: string) => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  currentDate,
  onSaveDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(currentDate || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      onSaveDate(selectedDate);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 text-balance">Change Appeal Deadline</h3>
            <p className="text-xs text-slate-500 text-pretty">Update the target deadline across your action kit</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="deadline-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 whitespace-nowrap">
              Target Deadline Date
            </label>
            <input
              id="deadline-input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
            />
            {selectedDate && (
              <p className="text-xs text-slate-500 mt-1.5">
                Will be displayed as: <span className="font-semibold text-slate-700 whitespace-nowrap">{formatDisplayDate(selectedDate)}</span>
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedDate}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors disabled:opacity-50 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <Check className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              Update Deadline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
