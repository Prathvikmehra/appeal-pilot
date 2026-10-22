import React from 'react';
import { ShieldCheck, RotateCcw } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onStartOver?: () => void;
  showStartOver?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onStartOver, showStartOver }) => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white/70 backdrop-blur-xs py-10 mt-16 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-4 text-center">
        {/* Brand Logo in Footer */}
        <div className="flex items-center justify-center">
          <Logo size="sm" />
        </div>

        {showStartOver && (
          <button
            onClick={onStartOver}
            className="inline-flex items-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors shadow-2xs whitespace-nowrap flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-500 flex-shrink-0" />
            Analyze another letter (Start over)
          </button>
        )}

        <div className="max-w-2xl bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-[11px] leading-relaxed text-slate-500 text-left sm:text-center flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-teal-700 flex-shrink-0 hidden sm:block" />
          <p className="text-pretty">
            <strong>Privacy & Legal Notice: </strong>
            We don&apos;t store your uploads. Letters are sent to an AI service for analysis, so please don&apos;t upload real personal or medical information in this demo. Appeal Pilot provides guidance and templates, not legal or medical advice.
          </p>
        </div>

        <p className="text-slate-400 text-[11px] text-balance">
          Appeal Pilot • Built for Devpost Build With AI: Basics • Synthetic test letters for demonstration
        </p>
      </div>
    </footer>
  );
};
