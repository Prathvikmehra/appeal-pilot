'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { SampleSelector } from '@/components/SampleSelector';
import { FileUploader } from '@/components/FileUploader';
import { LetterPreview } from '@/components/LetterPreview';
import { ProgressTracker } from '@/components/ProgressTracker';
import { ExplanationCard } from '@/components/ExplanationCard';
import { ActionKit } from '@/components/ActionKit';
import { Footer } from '@/components/Footer';
import { SampleCase, SAMPLES } from '@/lib/sample-data';
import { ExtractedFacts, ComputedDeadline, GeneratedKit } from '@/types/appeal';
import { calculateDeadline, createManualDeadline } from '@/lib/date-calculator';
import { ShieldAlert } from 'lucide-react';

export default function Home() {
  const [selectedSample, setSelectedSample] = useState<SampleCase | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [isPdf, setIsPdf] = useState(false);

  // Analysis simulation state for Slice 3b (golden data flow)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  // Active results state
  const [facts, setFacts] = useState<ExtractedFacts | null>(null);
  const [deadline, setDeadline] = useState<ComputedDeadline | null>(null);
  const [kit, setKit] = useState<GeneratedKit | null>(null);

  const startAnalysisWithGoldenData = (sample: SampleCase) => {
    setSelectedSample(sample);
    setDocumentTitle(sample.title);
    setPreviewUrl(sample.imagePath);
    setIsPdf(false);
    setIsAnalyzing(true);
    setCurrentStep(1);
    setIsComplete(false);

    // Initial facts and computed deadline from golden sample
    setFacts({ ...sample.facts });
    const computed = calculateDeadline({
      deadlineType: sample.facts.deadlineType,
      explicitDate: sample.facts.explicitDate,
      relativeDays: sample.facts.relativeDays,
      letterDate: sample.facts.letterDate,
    });
    setDeadline(computed);
    setKit({ ...sample.kit });

    // Step-by-step progress simulation for Slice 3b
    setTimeout(() => setCurrentStep(2), 400);
    setTimeout(() => setCurrentStep(3), 900);
    setTimeout(() => setCurrentStep(4), 1400);
    setTimeout(() => {
      setIsComplete(true);
    }, 1900);
  };

  const handleSelectSample = (sample: SampleCase) => {
    startAnalysisWithGoldenData(sample);
  };

  const handleFileUpload = (file: File) => {
    // For Slice 3b UI testing, use Sample 1 as mock target until Slice 4 connects live Gemini API
    const url = URL.createObjectURL(file);
    setUploadedFile(file);
    const pdf = file.type === 'application/pdf';
    setDocumentTitle(file.name);
    setPreviewUrl(url);
    setIsPdf(pdf);
    setIsAnalyzing(true);
    setCurrentStep(1);
    setIsComplete(false);

    // Default mock data for file upload in Slice 3b UI mode
    const fallbackSample = SAMPLES[0];
    setFacts({ ...fallbackSample.facts });
    const computed = calculateDeadline({
      deadlineType: fallbackSample.facts.deadlineType,
      explicitDate: fallbackSample.facts.explicitDate,
      relativeDays: fallbackSample.facts.relativeDays,
      letterDate: fallbackSample.facts.letterDate,
    });
    setDeadline(computed);
    setKit({ ...fallbackSample.kit });

    setTimeout(() => setCurrentStep(2), 400);
    setTimeout(() => setCurrentStep(3), 900);
    setTimeout(() => setCurrentStep(4), 1400);
    setTimeout(() => {
      setIsComplete(true);
    }, 1900);
  };

  // Real-time fact editing in facts row (propagates instantly to letter)
  const handleUpdateFact = (field: keyof ExtractedFacts, value: string) => {
    if (!facts) return;
    const updatedFacts = { ...facts, [field]: value };
    setFacts(updatedFacts);

    // If letterDate changed and deadline is relative, recalculate deadline
    if (field === 'letterDate' && facts.deadlineType === 'relative') {
      const recalculated = calculateDeadline({
        deadlineType: 'relative',
        explicitDate: facts.explicitDate,
        relativeDays: facts.relativeDays,
        letterDate: value,
      });
      setDeadline(recalculated);
    }
  };

  // Real-time deadline override via "Change date" modal
  const handleUpdateDeadline = (newDateStr: string) => {
    const updatedDeadline = createManualDeadline(newDateStr);
    setDeadline(updatedDeadline);
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
    setFacts(null);
    setDeadline(null);
    setKit(null);
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
          /* Analysis & Results View (Slice 3b complete flow) */
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

            {/* Right Column: Progress Tracker, Explanation Card, Action Kit */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <ProgressTracker
                currentStep={currentStep}
                isComplete={isComplete}
                collapsed={isComplete}
              />

              {isComplete && facts && deadline && kit && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Plain-English Explanation Card */}
                  <ExplanationCard
                    facts={facts}
                    deadline={deadline}
                    kit={kit}
                    onUpdateFact={handleUpdateFact}
                    onUpdateDeadline={handleUpdateDeadline}
                  />

                  {/* 3-Piece Action Kit */}
                  <ActionKit
                    facts={facts}
                    deadline={deadline}
                    kit={kit}
                    onSetDate={handleUpdateDeadline}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer onStartOver={handleStartOver} showStartOver={isAnalyzing} />
    </div>
  );
}
