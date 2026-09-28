import React from 'react';
import { Dumbbell, Sparkles, Utensils, Bot, History, PlusCircle } from 'lucide-react';

interface NavbarProps {
  currentTab: 'plan' | 'nutrition' | 'coach' | 'history' | 'generator';
  onSelectTab: (tab: 'plan' | 'nutrition' | 'coach' | 'history' | 'generator') => void;
  activeSessionDayNumber?: number | null;
  onOpenActiveSession?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeSessionDayNumber,
  onOpenActiveSession,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('plan')}
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Dumbbell className="w-4 h-4" />
            </span>
            <span>Fitbuddy</span>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('plan')}
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${
              currentTab === 'plan' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Workouts</span>
          </button>

          <button
            onClick={() => onSelectTab('nutrition')}
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${
              currentTab === 'nutrition' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Nutrition</span>
          </button>

          <button
            onClick={() => onSelectTab('coach')}
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${
              currentTab === 'coach' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Coach</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${
              currentTab === 'history' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            <History className="w-4 h-4" />
            <span>Logs & Plans</span>
          </button>

          <button
            onClick={() => onSelectTab('generator')}
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${
              currentTab === 'generator' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Plan</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary actions */}
        <div className="flex items-center gap-3">
          {activeSessionDayNumber && onOpenActiveSession ? (
            <button
              onClick={onOpenActiveSession}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all whitespace-nowrap animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Resume Day {activeSessionDayNumber}</span>
            </button>
          ) : null}

          <button
            onClick={() => onSelectTab('generator')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New AI Plan</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-900 bg-slate-950/95 py-2 px-1 text-xs">
        <button
          onClick={() => onSelectTab('plan')}
          className={`p-2 flex flex-col items-center gap-1 ${
            currentTab === 'plan' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Workouts</span>
        </button>
        <button
          onClick={() => onSelectTab('nutrition')}
          className={`p-2 flex flex-col items-center gap-1 ${
            currentTab === 'nutrition' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Nutrition</span>
        </button>
        <button
          onClick={() => onSelectTab('coach')}
          className={`p-2 flex flex-col items-center gap-1 ${
            currentTab === 'coach' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Coach</span>
        </button>
        <button
          onClick={() => onSelectTab('history')}
          className={`p-2 flex flex-col items-center gap-1 ${
            currentTab === 'history' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Logs</span>
        </button>
        <button
          onClick={() => onSelectTab('generator')}
          className={`p-2 flex flex-col items-center gap-1 ${
            currentTab === 'generator' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Build</span>
        </button>
      </div>
    </header>
  );
};
