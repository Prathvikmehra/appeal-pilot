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
    <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs space-y-6 p-6 sm:p-7">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center">
          <span>Your 3-Piece Action Kit</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Everything you need to fight the denial: dispute letter, phone rebuttals, and deadline alarms.
        </p>

        {/* Tab Headers */}
        <div className="flex flex-wrap gap-2 mt-4" role="tablist" aria-label="Action Kit Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-normal px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-teal-700 text-teal-100' : 'bg-slate-200/70 text-slate-600'
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
      <div className="pt-1">
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
