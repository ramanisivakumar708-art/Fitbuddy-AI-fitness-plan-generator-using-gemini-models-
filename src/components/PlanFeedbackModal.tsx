import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Heart,
  Flame,
  Clock,
  ShieldCheck,
  Dumbbell,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Send,
} from 'lucide-react';
import { FitnessPlan } from '../types/fitness';

interface PlanFeedbackModalProps {
  currentPlan: FitnessPlan;
  isOpen: boolean;
  onClose: () => void;
  onPlanUpdated: (updatedPlan: FitnessPlan) => void;
}

export const PlanFeedbackModal: React.FC<PlanFeedbackModalProps> = ({
  currentPlan,
  isOpen,
  onClose,
  onPlanUpdated,
}) => {
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessageIndex, setStatusMessageIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const presetFeedbackOptions = [
    {
      id: 'more_cardio',
      label: 'More Cardio / HIIT',
      prompt: 'Add 15-20 minutes of Zone-2 cardio or high-intensity interval (HIIT) finishers to the training days.',
      icon: Flame,
    },
    {
      id: 'extra_rest_day',
      label: 'Additional Rest / Recovery Day',
      prompt: 'Convert one of the training days into an active recovery & mobility day to manage systemic fatigue.',
      icon: Heart,
    },
    {
      id: 'shorter_sessions',
      label: 'Shorter Workouts (30-35 min)',
      prompt: 'Streamline the workouts to finish in 30-35 minutes using antagonistic supersets and denser rest intervals.',
      icon: Clock,
    },
    {
      id: 'joint_friendly',
      label: 'Joint-Friendly / Less Spinal Loading',
      prompt: 'Substitute heavy spinal-compressing lifts (barbell squats/deadlifts) with knee and lower-back friendly alternatives (dumbbell Romanian deadlifts, goblet squats, machine presses).',
      icon: ShieldCheck,
    },
    {
      id: 'more_core',
      label: 'More Core & Abs Volume',
      prompt: 'Add dedicated rotational, anti-extension, and oblique abdominal training at the end of workouts.',
      icon: Dumbbell,
    },
  ];

  React.useEffect(() => {
    if (!isLoading) return;
    const messages = [
      'Reading your current 7-day program architecture...',
      'Synthesizing your feedback & requested volume adjustments...',
      'Re-balancing cardiovascular intervals & active recovery days...',
      'Formulating updated exercise selections, sets & rest periods...',
      'Finalizing your customized updated fitness architecture...',
    ];
    const interval = setInterval(() => {
      setStatusMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isOpen) return null;

  const togglePreset = (preset: typeof presetFeedbackOptions[0]) => {
    if (selectedPresets.includes(preset.id)) {
      setSelectedPresets((prev) => prev.filter((id) => id !== preset.id));
    } else {
      setSelectedPresets((prev) => [...prev, preset.id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Combine preset prompts and custom feedback
    const activePresetPrompts = presetFeedbackOptions
      .filter((p) => selectedPresets.includes(p.id))
      .map((p) => p.prompt);

    const combinedFeedback = [
      ...activePresetPrompts,
      feedbackText.trim(),
    ]
      .filter(Boolean)
      .join('\n\n');

    if (!combinedFeedback) {
      setError('Please select an adjustment preset or type your feedback.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/modify-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPlan: currentPlan,
          feedback: combinedFeedback,
          quickOptions: {
            selectedPresetIds: selectedPresets,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update plan with feedback');
      }

      const updatedPlan: FitnessPlan = await res.json();
      onPlanUpdated(updatedPlan);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Interactive Plan Feedback
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Submit Feedback & Refine Plan
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="p-10 text-center space-y-4">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-2">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping"></div>
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-7 h-7 animate-spin" />
              </div>
            </div>

            <h4 className="text-xl font-bold text-white">
              AI Is Adapting Your 7-Day Plan
            </h4>

            <p className="text-xs sm:text-sm font-medium text-emerald-400 min-h-[36px] max-w-md mx-auto transition-all">
              {
                [
                  'Reading your current 7-day program architecture...',
                  'Synthesizing your feedback & requested volume adjustments...',
                  'Re-balancing cardiovascular intervals & active recovery days...',
                  'Formulating updated exercise selections, sets & rest periods...',
                  'Finalizing your customized updated fitness architecture...',
                ][statusMessageIndex]
              }
            </p>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-400 text-left max-w-md mx-auto space-y-1">
              <div className="font-semibold text-slate-200">Refining Plan:</div>
              <div className="text-slate-300 truncate font-mono">{currentPlan.planTitle}</div>
              <div className="text-slate-500 text-[11px] pt-1">
                Your feedback will preserve what works while updating exercises, cardio, or recovery days.
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            {/* Active Plan Context Pill */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Current Plan: </span>
                <strong className="text-slate-200">{currentPlan.planTitle}</strong>
              </div>
              <span className="font-mono text-emerald-400 text-[11px]">
                {currentPlan.weeklySchedule.filter((d) => !d.isRestDay).length} Workout Days ·{' '}
                {currentPlan.weeklySchedule.filter((d) => d.isRestDay).length} Recovery Days
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Adjustment Options */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                Common Adjustments (Click to apply)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {presetFeedbackOptions.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = selectedPresets.includes(preset.id);
                  return (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => togglePreset(preset)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/15 text-white'
                          : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-white">
                          {preset.label}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                          {preset.prompt}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Free-form feedback text */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Specific Feedback / Custom Requests
              </label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="e.g. Add 15 mins of stairmaster on leg days, convert Day 3 into a complete rest day, or swap barbell squats for hack squats..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                Gemini will re-periodize your entire 7-day schedule, retaining what you love while applying these adjustments.
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading || (!feedbackText.trim() && selectedPresets.length === 0)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-[1.02] disabled:opacity-40 disabled:pointer-events-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Updated Plan with AI</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
