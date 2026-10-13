'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { SampleSelector } from '@/components/SampleSelector';
import { FileUploader } from '@/components/FileUploader';
import { LetterPreview } from '@/components/LetterPreview';
import { ProgressTracker } from '@/components/ProgressTracker';
import { SampleCase } from '@/lib/sample-data';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function Home() {
  const [selectedSample, setSelectedSample] = useState<SampleCase | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [isPdf, setIsPdf] = useState(false);

  // Analysis simulation state for Slice 3a
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const startAnalysis = (title: string, url: string, pdf = false, sample?: SampleCase) => {
    setDocumentTitle(title);
    setPreviewUrl(url);
    setIsPdf(pdf);
    if (sample) setSelectedSample(sample);
    setIsAnalyzing(true);
    setCurrentStep(1);
    setIsComplete(false);

    // Simulate progress through the 4 steps for Slice 3a UI verification
    setTimeout(() => setCurrentStep(2), 500);
    setTimeout(() => setCurrentStep(3), 1100);
    setTimeout(() => setCurrentStep(4), 1700);
    setTimeout(() => {
      setIsComplete(true);
    }, 2300);
  };

  const handleSelectSample = (sample: SampleCase) => {
    startAnalysis(sample.title, sample.imagePath, false, sample);
  };

  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setUploadedFile(file);
    const pdf = file.type === 'application/pdf';
    startAnalysis(file.name, url, pdf);
  };

  const handleStartOver = () => {
    if (previewUrl && uploadedFile) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedSample(null);
    setUploadedFile(null);
    setPreviewUrl(null);
    setDocumentTitle('');
    setIsPdf(false);
    setIsAnalyzing(false);
    setCurrentStep(1);
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header onStartOver={handleStartOver} showStartOver={isAnalyzing} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12">
        {!isAnalyzing ? (
          /* Landing View */
          <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
            {/* Hero Section */}
            <div className="text-center space-y-3 pt-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950">
                Got a confusing health insurance denial?{' '}
                <span className="text-teal-700 block sm:inline">Let&apos;s turn it into a plan.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
                Pick a sample letter or upload your own. You&apos;ll get a plain-English explanation, an appeal letter, a phone script, and a calendar reminder for your deadline.
              </p>
            </div>

            {/* Primary Action: Sample Cards */}
            <SampleSelector onSelectSample={handleSelectSample} />

            {/* Divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative bg-slate-50 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                or
              </div>
            </div>

            {/* Secondary Action: File Upload */}
            <div className="max-w-2xl mx-auto">
              <FileUploader onFileUpload={handleFileUpload} />
            </div>

            {/* Privacy & Legal Notice */}
            <div className="max-w-3xl mx-auto pt-6 text-center">
              <div className="inline-flex items-center text-xs text-slate-500 bg-white/70 border border-slate-200/80 rounded-lg px-4 py-3 shadow-2xs space-x-2 text-left">
                <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p>
                  We don&apos;t store your uploads. Letters are sent to an AI service for analysis, so please don&apos;t upload real personal or medical information in this demo. Appeal Pilot provides guidance and templates, not legal or medical advice.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Analysis View (Slice 3a layout) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            {/* Left Column: Sticky Letter Preview */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              {previewUrl && (
                <LetterPreview
                  previewUrl={previewUrl}
                  title={documentTitle}
                  isPdf={isPdf}
                />
              )}
            </div>

            {/* Right Column: Progress Tracker and upcoming Results */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <ProgressTracker
                currentStep={currentStep}
                isComplete={isComplete}
                collapsed={false}
              />

              {isComplete && (
                <div className="bg-white border border-teal-200 rounded-xl p-6 shadow-xs text-center space-y-3 animate-fadeIn">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 text-teal-700">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Document Extracted & Parsed!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Slice 3a verification complete: Document viewer, progress tracker, and sample intake are operational.
                  </p>
                  <p className="text-xs text-teal-700 font-medium">
                    Ready for Slice 3b (Plain-English card, facts row, and Action Kit tabs).
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white/50 py-6 mt-12 text-center text-xs text-slate-400">
        <p>© 2026 Appeal Pilot • Synthetic health insurance appeal assistant</p>
      </footer>
    </div>
  );
}
