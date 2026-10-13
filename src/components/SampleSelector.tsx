import React from 'react';
import { SAMPLES, SampleCase } from '@/lib/sample-data';
import { FileText, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface SampleSelectorProps {
  onSelectSample: (sample: SampleCase) => void;
  disabled?: boolean;
}

export const SampleSelector: React.FC<SampleSelectorProps> = ({ onSelectSample, disabled }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center">
          <FileText className="w-4 h-4 mr-1.5 text-teal-600" />
          Try a sample case (One-click)
        </h2>
        <span className="text-xs text-slate-400">Realistic synthetic letters</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SAMPLES.map((sample) => (
          <button
            key={sample.id}
            disabled={disabled}
            onClick={() => onSelectSample(sample)}
            className="group relative flex flex-col text-left bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:border-teal-500 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Mini letter preview header */}
            <div className="relative h-32 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
              <Image
                src={sample.imagePath}
                alt={sample.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
              <div className="absolute top-2.5 left-2.5">
                <span className="inline-block text-[11px] font-semibold tracking-wide bg-white/95 text-slate-800 px-2.5 py-0.5 rounded-full shadow-xs">
                  {sample.badge}
                </span>
              </div>
              <div className="absolute bottom-2 left-3 right-3 text-white">
                <p className="text-xs font-medium opacity-90 truncate">{sample.facts.insurer}</p>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                  {sample.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">{sample.subtitle}</p>
                <div className="mt-3 flex items-center text-[11px] text-slate-500 space-x-2">
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                    {sample.facts.claimNumber}
                  </span>
                  <span>•</span>
                  <span>Date: {sample.facts.letterDate}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600 group-hover:text-teal-700">
                <span>Load & Analyze</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
