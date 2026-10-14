import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  onStartOver?: () => void;
  showStartOver?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onStartOver, showStartOver }) => {
  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={onStartOver}
          className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 rounded-lg p-1 -m-1 transition-opacity hover:opacity-90 cursor-pointer"
          aria-label="Appeal Pilot Home"
        >
          <Logo size="md" showBadge={true} />
        </button>

        {showStartOver && (
          <button
            onClick={onStartOver}
            className="inline-flex items-center text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 flex-shrink-0" />
            Start over
          </button>
        )}
      </div>
    </header>
  );
};
