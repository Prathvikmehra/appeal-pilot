import React, { useState } from 'react';
import { PhoneScriptData } from '@/types/appeal';
import { Copy, Check, PhoneCall, ListChecks, MessageSquare, ShieldAlert, ArrowRight } from 'lucide-react';

interface PhoneScriptTabProps {
  phoneScript: PhoneScriptData;
}

export const PhoneScriptTab: React.FC<PhoneScriptTabProps> = ({ phoneScript }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const fullText = [
      '--- BEFORE YOU CALL ---',
      ...phoneScript.beforeYouCall.map((item) => `• ${item}`),
      '',
      '--- WHAT TO SAY (OPENING) ---',
      phoneScript.whatToSay,
      '',
      '--- IF THEY SAY... (OBJECTION HANDLING) ---',
      ...phoneScript.ifTheySay.map((item) => `Q: "${item.objection}"\nA: "${item.response}"\n`),
      '--- BEFORE YOU HANG UP ---',
      ...phoneScript.beforeYouHangUp.map((item) => `• ${item}`),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3 sm:px-4 min-w-0">
        <p className="text-xs text-slate-600 min-w-0 text-pretty">
          <span className="font-semibold text-slate-800 whitespace-nowrap">Phone guidance: </span>
          Follow this word-for-word conversation guide when speaking with the representative.
        </p>

        <button
          onClick={handleCopy}
          className="whitespace-nowrap flex-shrink-0 inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1 text-teal-700 flex-shrink-0" />
              Copied Script
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1 text-slate-500 flex-shrink-0" />
              Copy Script
            </>
          )}
        </button>
      </div>

      <div className="space-y-5 min-w-0">
        {/* 1. Before you call */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 min-w-0">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center whitespace-nowrap">
            <ListChecks className="w-4 h-4 mr-1.5 text-teal-700 flex-shrink-0" />
            1. Before You Call — Have These Ready
          </h3>
          <ul className="space-y-2.5">
            {phoneScript.beforeYouCall.map((item, idx) => (
              <li key={idx} className="flex items-start text-xs sm:text-sm text-slate-700 min-w-0">
                <span className="h-4 w-4 rounded border border-slate-300 bg-slate-50 flex items-center justify-center mr-2.5 mt-0.5 text-teal-700 flex-shrink-0">
                  ✓
                </span>
                <span className="text-pretty break-words min-w-0 flex-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. What to say (Opening) */}
        <div className="bg-teal-50/60 border border-teal-200/90 rounded-xl p-5 shadow-2xs space-y-2 min-w-0">
          <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center whitespace-nowrap">
            <MessageSquare className="w-4 h-4 mr-1.5 text-teal-700 flex-shrink-0" />
            2. What To Say — Word-For-Word Opening
          </h3>
          <div className="bg-white border border-teal-200 rounded-lg p-4 text-xs sm:text-sm font-medium text-slate-900 leading-relaxed shadow-xs text-pretty break-words max-w-[75ch]">
            &ldquo;{phoneScript.whatToSay}&rdquo;
          </div>
        </div>

        {/* 3. If they say... (Objection Handling) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 min-w-0">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center whitespace-nowrap">
            <ShieldAlert className="w-4 h-4 mr-1.5 text-amber-600 flex-shrink-0" />
            3. If They Say... — Rebuttal Points
          </h3>
          <div className="space-y-3 min-w-0">
            {phoneScript.ifTheySay.map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 space-y-2 min-w-0">
                <p className="text-xs font-semibold text-rose-800 flex items-start text-pretty break-words">
                  <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[10px] mr-2 whitespace-nowrap flex-shrink-0 mt-0.5">REP</span>
                  <span className="min-w-0 flex-1">&ldquo;{item.objection}&rdquo;</span>
                </p>
                <div className="pl-6 text-xs sm:text-sm text-teal-900 font-medium flex items-start min-w-0">
                  <ArrowRight className="w-3.5 h-3.5 mr-1.5 text-teal-700 flex-shrink-0 mt-0.5" />
                  <span className="text-pretty break-words min-w-0 flex-1">
                    <strong>Say: </strong>&ldquo;{item.response}&rdquo;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Before you hang up */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 min-w-0">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center whitespace-nowrap">
            <PhoneCall className="w-4 h-4 mr-1.5 text-teal-700 flex-shrink-0" />
            4. Before You Hang Up — Essential Checklist
          </h3>
          <ul className="space-y-2.5">
            {phoneScript.beforeYouHangUp.map((item, idx) => (
              <li key={idx} className="flex items-start text-xs sm:text-sm text-slate-700 min-w-0">
                <span className="h-4 w-4 rounded border border-slate-300 bg-slate-50 flex items-center justify-center mr-2.5 mt-0.5 text-teal-700 flex-shrink-0">
                  ✓
                </span>
                <span className="text-pretty break-words min-w-0 flex-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
