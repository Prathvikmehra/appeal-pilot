import React, { useState, useRef } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Unsupported file format. Please upload a PNG, JPG, or single-page PDF.');
      return;
    }

    const maxSizeBytes = 3 * 1024 * 1024; // 3 MB
    if (file.size > maxSizeBytes) {
      setErrorMessage('File size exceeds 3 MB limit. Please upload a single-page document under 3 MB.');
      return;
    }

    onFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-teal-500 bg-teal-50/50'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-1">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Upload a single-page letter <span className="font-normal text-slate-500">(PNG, JPG, or PDF)</span>
          </p>
          <p className="text-xs text-slate-400">
            Drag & drop or click to browse • Max 3 MB • Ephemeral (no uploads stored)
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-start space-x-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
