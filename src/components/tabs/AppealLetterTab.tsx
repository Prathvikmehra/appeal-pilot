import React, { useState, useMemo } from 'react';
import { ExtractedFacts } from '@/types/appeal';
import { formatDisplayDate } from '@/lib/date-calculator';
import { Copy, Check, Download, FileText } from 'lucide-react';

interface AppealLetterTabProps {
  template: string;
  facts: ExtractedFacts;
  deadlineDate: string | null;
}

export const AppealLetterTab: React.FC<AppealLetterTabProps> = ({
  template,
  facts,
  deadlineDate,
}) => {
  const [copied, setCopied] = useState(false);

  // Real-time token interpolation from live facts state
  const interpolatedText = useMemo(() => {
    return template
      .replace(/\{\{INSURER\}\}/g, facts.insurer || 'Insurer')
      .replace(/\{\{CLAIM_NUMBER\}\}/g, facts.claimNumber || 'Unspecified Claim')
      .replace(/\{\{DISPUTED_AMOUNT\}\}/g, facts.disputedAmount || '$0.00')
      .replace(/\{\{DEADLINE_DATE\}\}/g, formatDisplayDate(deadlineDate));
  }, [template, facts.insurer, facts.claimNumber, facts.disputedAmount, deadlineDate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(interpolatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([interpolatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appeal-letter-${facts.claimNumber || 'claim'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render text with styled placeholder chips for [Placeholder] tokens
  const renderStyledLetter = () => {
    const lines = interpolatedText.split('\n');
    return lines.map((line, lineIdx) => {
      // Regex to detect [Placeholder]
      const parts = line.split(/(\[[^\]]+\])/g);
      return (
        <div key={lineIdx} className="min-h-[1.4em]">
          {parts.map((part, partIdx) => {
            if (part.startsWith('[') && part.endsWith(']')) {
              return (
                <span
                  key={partIdx}
                  className="bg-amber-100 text-amber-900 border border-amber-300 font-semibold px-1.5 py-0.5 rounded text-[11px] mx-0.5"
                  title="Fill in your personal information here"
                >
                  {part}
                </span>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3 sm:px-4">
        <div className="text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Ready to send: </span>
          Facts are pre-filled. Complete the{' '}
          <span className="bg-amber-100 text-amber-900 font-semibold px-1 rounded text-[11px]">
            [highlighted]
          </span>{' '}
          placeholders before mailing.
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={handleCopy}
            className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-teal-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Copy Letter
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Download .txt
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 font-mono text-xs sm:text-[13px] text-slate-800 leading-relaxed shadow-2xs overflow-x-auto whitespace-pre-wrap max-h-[600px] overflow-y-auto">
        <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-100 text-slate-400 font-sans text-xs">
          <FileText className="w-4 h-4 text-teal-600" />
          <span>Formal Appeal Document Preview</span>
        </div>
        {renderStyledLetter()}
      </div>
    </div>
  );
};
