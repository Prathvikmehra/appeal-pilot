import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onStartOver?: () => void;
  showStartOver?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onStartOver, showStartOver }) => {
  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onStartOver}>
          <div className="h-9 w-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex items-center">
            <span className="font-bold text-lg tracking-tight text-slate-900 whitespace-nowrap">Appeal Pilot</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 whitespace-nowrap flex-shrink-0">
              Health Advocacy
            </span>
          </div>
        </div>

        {showStartOver && (
          <button
            onClick={onStartOver}
            className="inline-flex items-center text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Start over
          </button>
        )}
      </div>
    </header>
  );
};
