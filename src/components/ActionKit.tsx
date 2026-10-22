import React, { useState } from 'react';
import { ExtractedFacts, ComputedDeadline, GeneratedKit } from '@/types/appeal';
import { AppealLetterTab } from './tabs/AppealLetterTab';
import { PhoneScriptTab } from './tabs/PhoneScriptTab';
import { CalendarTab } from './tabs/CalendarTab';
import { FileText, PhoneCall, Calendar } from 'lucide-react';

interface ActionKitProps {
  facts: ExtractedFacts;
  deadline: ComputedDeadline;
  kit: GeneratedKit;
  onSetDate: (newDate: string) => void;
}

export const ActionKit: React.FC<ActionKitProps> = ({
  facts,
  deadline,
  kit,
  onSetDate,
}) => {
  const [activeTab, setActiveTab] = useState<'letter' | 'phone' | 'calendar'>('letter');

  const tabs = [
    {
      id: 'letter' as const,
      label: 'Appeal Letter',
      icon: FileText,
      badge: 'Ready to send',
    },
    {
      id: 'phone' as const,
      label: 'Phone Script',
      icon: PhoneCall,
      badge: 'Dialogue guide',
    },
    {
      id: 'calendar' as const,
      label: 'Calendar Reminder',
      icon: Calendar,
      badge: deadline.targetDate ? 'Alarm set' : 'Date needed',
    },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs space-y-6 p-5 sm:p-7 min-w-0">
      <div className="border-b border-slate-200 pb-4 min-w-0">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center whitespace-nowrap">
          <span>Your 3-Piece Action Kit</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 text-pretty">
          Everything you need to fight the denial: dispute letter, phone rebuttals, and deadline alarms.
        </p>

        {/* Tab Headers */}
        <div className="flex flex-wrap gap-2.5 mt-4 min-w-0" role="tablist" aria-label="Action Kit Tabs">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
              let targetIdx = idx;
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                targetIdx = (idx + 1) % tabs.length;
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                targetIdx = (idx - 1 + tabs.length) % tabs.length;
              } else if (e.key === 'Home') {
                e.preventDefault();
                targetIdx = 0;
              } else if (e.key === 'End') {
                e.preventDefault();
                targetIdx = tabs.length - 1;
              }

              if (targetIdx !== idx) {
                const targetTab = tabs[targetIdx];
                setActiveTab(targetTab.id);
                document.getElementById(`tab-${targetTab.id}`)?.focus();
              }
            };

            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={handleTabKeyDown}
                className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
                <span
                  className={`text-[10px] font-normal px-1.5 py-0.5 rounded-md whitespace-nowrap flex-shrink-0 ${
                    isActive ? 'bg-teal-800 text-teal-100' : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="pt-1 focus:outline-none"
        tabIndex={0}
      >
        {activeTab === 'letter' && (
          <AppealLetterTab
            template={kit.appealLetterTemplate}
            facts={facts}
            deadlineDate={deadline.targetDate}
          />
        )}

        {activeTab === 'phone' && (
          <PhoneScriptTab phoneScript={kit.phoneScript} />
        )}

        {activeTab === 'calendar' && (
          <CalendarTab
            deadline={deadline}
            kit={kit}
            claimNumber={facts.claimNumber}
            onSetDate={onSetDate}
          />
        )}
      </div>
    </div>
  );
};
