import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Award,
  Download,
  Copy,
  Check,
  Printer,
  History,
  Trash2,
  ExternalLink,
  Dumbbell,
  Sparkles,
} from 'lucide-react';
import { FitnessPlan, WorkoutSessionLog } from '../types/fitness';

interface HistoryAndExportViewProps {
  currentPlan: FitnessPlan;
  savedPlans: FitnessPlan[];
  sessionLogs: WorkoutSessionLog[];
  onSelectPlan: (plan: FitnessPlan) => void;
  onClearLogs?: () => void;
}

export const HistoryAndExportView: React.FC<HistoryAndExportViewProps> = ({
  currentPlan,
  savedPlans,
  sessionLogs,
  onSelectPlan,
  onClearLogs,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPlanText = () => {
    let text = `# Fitbuddy Plan: ${currentPlan.planTitle}\n`;
    text += `Split: ${currentPlan.splitType} | Level: ${currentPlan.difficulty}\n`;
    text += `Summary: ${currentPlan.programSummary}\n\n`;

    text += `## DAILY NUTRITION TARGETS\n`;
    text += `Calories: ${currentPlan.nutrition.targetDailyCalories} kcal\n`;
    text += `Protein: ${currentPlan.nutrition.proteinGrams}g | Carbs: ${currentPlan.nutrition.carbsGrams}g | Fat: ${currentPlan.nutrition.fatGrams}g | Water: ${currentPlan.nutrition.waterLiters}L\n\n`;

    text += `## 7-DAY WEEKLY SCHEDULE\n`;
    currentPlan.weeklySchedule.forEach((day) => {
      text += `\n==================================================\n`;
      text += `Day ${day.dayNumber}: ${day.dayName}\n`;
      text += `Focus: ${day.focus} | Est. Duration: ${day.isRestDay ? 'Rest / Active Recovery' : day.estimatedMinutes + ' mins'}\n`;

      if (day.isRestDay) {
        text += `\nRECOVERY PROTOCOL:\n`;
        text += `• Active Recovery Cardio: ${day.recoveryGuidance?.activeRecoveryCardio || day.restDayActivity || 'Active recovery'}\n`;
        if (day.recoveryGuidance?.mobilityDrills?.length) {
          text += `• Mobility Drills:\n`;
          day.recoveryGuidance.mobilityDrills.forEach((d) => {
            text += `   - ${d.name} (${d.duration}): ${d.purpose}\n`;
          });
        }
        if (day.recoveryGuidance?.hydrationAndNutritionTip) {
          text += `• Nutrition & Hydration: ${day.recoveryGuidance.hydrationAndNutritionTip}\n`;
        }
        if (day.recoveryGuidance?.sleepAndCNSGuidance) {
          text += `• Sleep & CNS Reset: ${day.recoveryGuidance.sleepAndCNSGuidance}\n`;
        }
      } else {
        if (day.warmup?.length) {
          text += `\nWARM-UP ROUTINE:\n`;
          day.warmup.forEach((w) => {
            text += `• ${w.name} - ${w.durationOrReps} ${w.notes ? '(' + w.notes + ')' : ''}\n`;
          });
        }

        text += `\nPRESCRIBED EXERCISES:\n`;
        day.exercises.forEach((ex, idx) => {
          text += `${idx + 1}. ${ex.name} [${ex.targetMuscle}]\n`;
          text += `   Prescription: ${ex.sets} sets × ${ex.reps} reps | Rest: ${ex.restSeconds}s | RPE: ${ex.rpe}/10 | Tempo: ${ex.tempo || 'Controlled'}\n`;
          text += `   Equipment: ${ex.equipment}\n`;
          if (ex.formCues?.length) {
            text += `   Key Cues: ${ex.formCues.join(' · ')}\n`;
          }
          if (ex.mistakesToAvoid?.length) {
            text += `   Avoid: ${ex.mistakesToAvoid.join(' · ')}\n`;
          }
        });

        if (day.cooldown?.length) {
          text += `\nCOOL-DOWN ROUTINE:\n`;
          day.cooldown.forEach((c) => {
            text += `• ${c.name} - ${c.durationOrReps}\n`;
          });
        }

        if (day.recoveryGuidance) {
          text += `\nSESSION RECOVERY:\n`;
          text += `• Active Flush: ${day.recoveryGuidance.activeRecoveryCardio}\n`;
          text += `• Refuel: ${day.recoveryGuidance.hydrationAndNutritionTip}\n`;
        }
      }
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Export & Print Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Export & Portability
          </div>
          <h3 className="text-xl font-bold text-white">
            Export Active Training Plan
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Download or copy your complete workout schedule and nutrition guide.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyPlanText}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-semibold text-slate-200 hover:text-white hover:border-emerald-500/50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Completed Workout Session Logs */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              Progress & Consistency
            </div>
            <h3 className="text-lg font-bold text-white">
              Completed Session Logs ({sessionLogs.length})
            </h3>
          </div>

          {sessionLogs.length > 0 && onClearLogs && (
            <button
              onClick={onClearLogs}
              className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {sessionLogs.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">
              No completed sessions recorded yet.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Start Day 1 in the Workouts tab to record your sets and weights live!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessionLogs.map((log) => {
              const minutes = Math.round(log.durationSeconds / 60);
              const totalSetsCompleted = log.exercises.reduce(
                (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
                0
              );

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/70 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white">
                        {log.dayName}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Rating: {log.feelingScore}/5
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-3">
                      <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{minutes} mins</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{totalSetsCompleted} sets logged</span>
                    </div>

                    {log.notes && (
                      <div className="text-xs text-slate-300 italic mt-2">
                        "{log.notes}"
                      </div>
                    )}
                  </div>

                  <div className="text-right text-xs font-mono text-slate-400">
                    <div>{log.exercises.length} Exercises</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Saved / Past Plans */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="border-b border-slate-800 pb-4 mb-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Library
          </div>
          <h3 className="text-lg font-bold text-white">
            Saved Training Architectures ({savedPlans.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {savedPlans.map((p) => {
            const isCurrent = p.id === currentPlan.id;
            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-emerald-500/60 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-emerald-400">{p.splitType}</span>
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">
                    {p.planTitle}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                    {p.programSummary}
                  </p>
                  {p.feedbackApplied && (
                    <div className="mb-2 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="line-clamp-1">{p.feedbackApplied}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-mono text-slate-500">
                    {p.weeklySchedule.filter((d) => !d.isRestDay).length} sessions/wk
                  </span>
                  {isCurrent ? (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active Plan</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectPlan(p)}
                      className="text-xs font-semibold text-slate-300 hover:text-white hover:underline flex items-center gap-1"
                    >
                      <span>Load Plan</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
