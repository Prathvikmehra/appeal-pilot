import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

interface LetterPreviewProps {
  previewUrl: string;
  title: string;
  isPdf?: boolean;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({ previewUrl, title, isPdf }) => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-full max-h-[85vh] sticky top-20">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center space-x-2 truncate min-w-0">
          <FileText className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-slate-700 truncate min-w-0">{title}</span>
        </div>
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-teal-600 hover:text-teal-700 flex items-center space-x-1 whitespace-nowrap flex-shrink-0 focus:outline-none focus:ring-1 focus:ring-teal-500 rounded px-1"
          title="Open in new tab"
        >
          <span className="hidden sm:inline">Open full</span>
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
        </a>
      </div>

      <div className="p-2 sm:p-3 overflow-y-auto flex-1 bg-slate-100 flex items-center justify-center min-h-[300px]">
        {isPdf ? (
          <iframe
            src={previewUrl}
            title="Document PDF Preview"
            className="w-full h-full min-h-[480px] rounded border border-slate-200"
          />
        ) : (
          <div className="relative w-full h-auto flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={title}
              className="max-w-full h-auto max-h-[75vh] object-contain rounded shadow-sm border border-slate-200"
            />
          </div>
        )}
      </div>

      <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
        <p className="text-[11px] text-slate-500">
          Cross-reference this original notice with the generated action plan.
        </p>
      </div>
    </div>
  );
};
