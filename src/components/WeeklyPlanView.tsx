import React, { useState } from 'react';
import {
  Play,
  Sparkles,
  Clock,
  Dumbbell,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Calendar,
  Heart,
  Droplet,
  Moon,
  Activity,
  Layers,
  ArrowRight,
  Sliders,
  MessageSquarePlus,
} from 'lucide-react';
import { FitnessPlan, WorkoutDay, Exercise } from '../types/fitness';
import { ExerciseSwapModal } from './ExerciseSwapModal';
import { PlanFeedbackModal } from './PlanFeedbackModal';

interface WeeklyPlanViewProps {
  plan: FitnessPlan;
  onStartWorkout: (day: WorkoutDay) => void;
  onUpdateExercise: (dayNumber: number, oldExerciseId: string, newExercise: Exercise) => void;
  onOpenCoachWithQuestion?: (question: string) => void;
  onPlanUpdated: (updatedPlan: FitnessPlan) => void;
}

export const WeeklyPlanView: React.FC<WeeklyPlanViewProps> = ({
  plan,
  onStartWorkout,
  onUpdateExercise,
  onOpenCoachWithQuestion,
  onPlanUpdated,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [swappingExercise, setSwappingExercise] = useState<Exercise | null>(null);
  const [expandedExerciseIds, setExpandedExerciseIds] = useState<{ [id: string]: boolean }>({});
  const [viewMode, setViewMode] = useState<'day' | 'week_overview'>('day');
  const [completedMobilityDrills, setCompletedMobilityDrills] = useState<{ [key: string]: boolean }>({});
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);

  const activeDay =
    plan.weeklySchedule.find((d) => d.dayNumber === selectedDayNumber) ||
    plan.weeklySchedule[0];

  const toggleExpand = (id: string) => {
    setExpandedExerciseIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleMobilityCheck = (drillName: string) => {
    setCompletedMobilityDrills((prev) => ({
      ...prev,
      [drillName]: !prev[drillName],
    }));
  };

  const handleConfirmSwap = (oldId: string, newEx: Exercise) => {
    onUpdateExercise(selectedDayNumber, oldId, newEx);
    setSwappingExercise(null);
  };

  return (
    <div className="space-y-6">
      {/* Program Header Overview Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <span>{plan.splitType}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{plan.difficulty}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono">7-Day Periodized Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {plan.planTitle}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {plan.programSummary}
            </p>

            {/* Feedback Applied Changelog Notice */}
            {plan.feedbackApplied && (
              <div className="mt-3.5 p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-start sm:items-center gap-2 text-emerald-200">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                  <span>
                    <strong className="text-emerald-300 font-semibold">AI Feedback Integrated:</strong>{' '}
                    {plan.feedbackApplied}
                  </span>
                </div>
                {plan.version && plan.version > 1 && (
                  <span className="font-mono text-[10px] text-emerald-300 bg-slate-950 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                    Iteration v{plan.version}.0
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Submit Feedback Button */}
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs font-semibold text-slate-200 hover:text-white hover:border-emerald-500/60 hover:bg-slate-900 transition-all shadow-sm"
              title="Request changes like more cardio or extra rest days"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Refine with Feedback</span>
            </button>

            {/* View mode toggle */}
            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'day'
                    ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Day Detail
              </button>
              <button
                onClick={() => setViewMode('week_overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'week_overview'
                    ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                7-Day Matrix
              </button>
            </div>

            {activeDay && !activeDay.isRestDay && (
              <button
                onClick={() => onStartWorkout(activeDay)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Day {activeDay.dayNumber}</span>
              </button>
            )}
          </div>
        </div>

        {/* 7-Day Navigation Tabs */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            <span>7-Day Program Navigation</span>
            <span className="text-[11px] font-mono text-emerald-400 font-normal">
              {plan.weeklySchedule.filter((d) => !d.isRestDay).length} Workout Days · {plan.weeklySchedule.filter((d) => d.isRestDay).length} Recovery Days
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {plan.weeklySchedule.map((day) => {
              const isSelected = day.dayNumber === selectedDayNumber;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => {
                    setSelectedDayNumber(day.dayNumber);
                    setViewMode('day');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-sm ring-1 ring-emerald-500/50'
                      : day.isRestDay
                      ? 'border-slate-800/80 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                      : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                    <span className={isSelected ? 'text-emerald-400' : 'text-slate-400'}>
                      Day {day.dayNumber}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {day.isRestDay ? 'Recovery' : `${day.estimatedMinutes}m`}
                    </span>
                  </div>
                  <div className="text-xs font-bold truncate">
                    {day.focus}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 truncate">
                    {day.isRestDay
                      ? 'Mobility & Active Rest'
                      : `${day.exercises.length} Exercises`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7-DAY MATRIX / FULL WEEK AT A GLANCE OVERVIEW */}
      {viewMode === 'week_overview' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white">
                Complete 7-Day Architecture at a Glance
              </h3>
              <p className="text-xs text-slate-400">
                Periodized stimulus, warm-ups, working volume, and tissue restoration schedule across the week.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {plan.weeklySchedule.map((day) => (
              <div
                key={day.dayNumber}
                onClick={() => {
                  setSelectedDayNumber(day.dayNumber);
                  setViewMode('day');
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  day.dayNumber === selectedDayNumber
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-1">
                    <span>Day {day.dayNumber}</span>
                    <span>{day.isRestDay ? 'Rest' : `${day.estimatedMinutes}m`}</span>
                  </div>
                  <h4 className="font-bold text-white text-xs mb-2 line-clamp-1">
                    {day.dayName}
                  </h4>

                  {!day.isRestDay ? (
                    <div className="space-y-2 text-[11px]">
                      <div className="text-slate-400">
                        <strong className="text-slate-300">Warmup: </strong>
                        {day.warmup?.length || 3} dynamic drills
                      </div>
                      <div className="text-slate-400">
                        <strong className="text-slate-300">Exercises: </strong>
                        <ul className="text-slate-300 space-y-0.5 mt-1">
                          {day.exercises.slice(0, 3).map((ex, i) => (
                            <li key={i} className="truncate">• {ex.name}</li>
                          ))}
                          {day.exercises.length > 3 && (
                            <li className="text-slate-500">+{day.exercises.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                      <div className="text-slate-400">
                        <strong className="text-slate-300">Cooldown: </strong>
                        {day.cooldown?.length || 2} stretches
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-[11px] text-slate-400">
                      <div className="text-emerald-400/90 font-medium">
                        Recovery Focus:
                      </div>
                      <p className="line-clamp-3 text-slate-300 text-[10px] leading-relaxed">
                        {day.recoveryGuidance?.activeRecoveryCardio || day.restDayActivity || 'Mobility & rest.'}
                      </p>
                      <div className="text-[10px] text-slate-500">
                        {day.recoveryGuidance?.mobilityDrills?.length || 2} Mobility Drills
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                  {!day.isRestDay && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartWorkout(day);
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500/30"
                    >
                      Start
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DAY DETAIL VIEW */}
      {viewMode === 'day' && activeDay && (
        <div className="space-y-6">
          {/* Day Title and Quick Stats Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <div>
              <div className="text-xs font-mono font-semibold text-emerald-400 mb-1 flex items-center gap-2">
                <span>Day {activeDay.dayNumber} of 7</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="capitalize">{activeDay.isRestDay ? 'Active Recovery & Restoration' : 'Training Session'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {activeDay.dayName}
              </h3>
              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2.5">
                <span>Focus: <strong className="text-slate-200">{activeDay.focus}</strong></span>
                {!activeDay.isRestDay ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Duration: <strong className="text-slate-200 font-mono">{activeDay.estimatedMinutes} mins</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Working Volume: <strong className="text-slate-200 font-mono">{activeDay.exercises.reduce((acc, curr) => acc + curr.sets, 0)} total sets</strong></span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Target: <strong className="text-slate-200">Parasympathetic Tone & Soft Tissue Restoration</strong></span>
                  </>
                )}
              </div>
            </div>

            {!activeDay.isRestDay && (
              <button
                onClick={() => onStartWorkout(activeDay)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-[1.02] shrink-0"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Live Session</span>
              </button>
            )}
          </div>

          {/* REST & RECOVERY DAY SECTION */}
          {activeDay.isRestDay ? (
            <div className="space-y-6">
              {/* Comprehensive Recovery Protocol Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      Day {activeDay.dayNumber} Recovery Architecture
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-white">
                      Active Recovery & Central Nervous System Restoration
                    </h4>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {activeDay.restDayActivity ||
                    'Active recovery promotes blood flow to damaged muscle fibers, clears accumulated metabolic byproducts, and stimulates parasympathetic recovery without inducing additional mechanical microtrauma.'}
                </p>

                {/* 4 Pillars of Recovery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pillar 1: Active Recovery Cardio */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      <Activity className="w-4 h-4" />
                      <span>1. Active Cardiovascular Flush</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {activeDay.recoveryGuidance?.activeRecoveryCardio ||
                        '30-40 minute outdoor brisk walk, gentle spin on stationary bike, or low-impact swimming (Zone-2: HR 110-125 bpm).'}
                    </p>
                    <div className="text-[11px] text-slate-400">
                      Goal: Elevate capillary blood flow without elevating cortisol or creating lactic acid.
                    </div>
                  </div>

                  {/* Pillar 2: Nutrition & Hydration Refuel */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                      <Droplet className="w-4 h-4" />
                      <span>2. Hydration & Protein Synthesis</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {activeDay.recoveryGuidance?.hydrationAndNutritionTip ||
                        'Maintain standard protein target (1.8-2.2g/kg) and consume 3+ liters of water with electrolyte minerals to accelerate muscular repair.'}
                    </p>
                    <div className="text-[11px] text-slate-400">
                      Even on rest days, Muscle Protein Synthesis (MPS) remains elevated for 24-48 hours.
                    </div>
                  </div>

                  {/* Pillar 3: Sleep & CNS Reset */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider">
                      <Moon className="w-4 h-4" />
                      <span>3. CNS Reset & Sleep Hygiene</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {activeDay.recoveryGuidance?.sleepAndCNSGuidance ||
                        'Prioritize 8+ hours of sleep in a cool, pitch-dark room. Perform 5 minutes of 4-7-8 box breathing to down-regulate sympathetic drive.'}
                    </p>
                    <div className="text-[11px] text-slate-400">
                      Growth hormone secretion peaks during stage 3 & 4 deep slow-wave sleep.
                    </div>
                  </div>

                  {/* Pillar 4: Contrast / Tissue Care */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>4. Thermotherapy / Tissue Care</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Epsom salt warm soak (magnesium sulfate) or contrast shower (30s cool / 90s warm x 3 rounds) to relieve joint compression.
                    </p>
                    <div className="text-[11px] text-slate-400">
                      Enhances peripheral vascular dilation and soothes delayed onset muscle soreness (DOMS).
                    </div>
                  </div>
                </div>

                {/* Interactive Mobility Drills Routine */}
                {activeDay.recoveryGuidance?.mobilityDrills && activeDay.recoveryGuidance.mobilityDrills.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Prescribed Rest Day Mobility Flow (Complete All)</span>
                      <span className="font-mono text-emerald-400 text-[11px]">
                        {Object.values(completedMobilityDrills).filter(Boolean).length} / {activeDay.recoveryGuidance.mobilityDrills.length} Completed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {activeDay.recoveryGuidance.mobilityDrills.map((drill, idx) => {
                        const isDone = !!completedMobilityDrills[drill.name];
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleMobilityCheck(drill.name)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                              isDone
                                ? 'border-emerald-500/50 bg-emerald-500/10'
                                : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                                {drill.duration}
                              </span>
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                                  isDone
                                    ? 'bg-emerald-400 text-slate-950'
                                    : 'border border-slate-700 bg-slate-900'
                                }`}
                              >
                                {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </div>
                            <div className="text-xs font-bold text-white mb-1">
                              {drill.name}
                            </div>
                            <div className="text-[11px] text-slate-400 leading-snug">
                              {drill.purpose}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* TRAINING WORKOUT DAY SECTION */
            <div className="space-y-6">
              {/* 1. Dynamic Warm-up Routine */}
              {activeDay.warmup && activeDay.warmup.length > 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      <Clock className="w-4 h-4" />
                      <span>Phase 1: Dynamic Warm-up & Neuromuscular Priming (~5-8 mins)</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {activeDay.warmup.length} Movements
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Gradually raise core body temperature, lubricate synovial joint capsules, and prime motor unit recruitment prior to heavy loading.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeDay.warmup.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/70 text-xs"
                      >
                        <div className="font-bold text-slate-200 mb-0.5">
                          {item.name}
                        </div>
                        <div className="font-mono text-emerald-400 text-[11px] mb-1">
                          {item.durationOrReps}
                        </div>
                        {item.notes && (
                          <div className="text-slate-400 text-[11px] leading-tight">
                            {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Main Prescribed Exercises */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-emerald-400" />
                    <span>Phase 2: Working Sets & Overload ({activeDay.exercises.length} Exercises)</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Click any movement to view biomechanics & swap alternatives
                  </div>
                </div>

                <div className="space-y-3">
                  {activeDay.exercises.map((exercise, index) => {
                    const isExpanded = !!expandedExerciseIds[exercise.id];
                    return (
                      <div
                        key={exercise.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all overflow-hidden"
                      >
                        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <span className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h4 className="text-base sm:text-lg font-bold text-white">
                                  {exercise.name}
                                </h4>
                                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                                  {exercise.targetMuscle}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                                <span>Equipment: <strong className="text-slate-300">{exercise.equipment}</strong></span>
                                <span aria-hidden="true" className="text-slate-600">·</span>
                                <span>RPE: <strong className="text-slate-300 font-mono">{exercise.rpe}/10</strong></span>
                                {exercise.tempo && (
                                  <>
                                    <span aria-hidden="true" className="text-slate-600">·</span>
                                    <span>Tempo: <strong className="text-slate-300 font-mono">{exercise.tempo}</strong></span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Exercise prescription pill metrics */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="text-base font-extrabold text-emerald-400 font-mono">
                                {exercise.sets} × {exercise.reps}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">
                                {exercise.restSeconds}s rest
                              </div>
                            </div>

                            <button
                              onClick={() => setSwappingExercise(exercise)}
                              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white hover:border-emerald-500/50 transition-colors"
                              title="Substitute this exercise"
                            >
                              Swap
                            </button>

                            <button
                              onClick={() => toggleExpand(exercise.id)}
                              className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Cues and Biomechanics */}
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in slide-in-from-top-2">
                            {/* Execution Cues */}
                            <div className="space-y-1.5">
                              <div className="font-semibold text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Kinematic Form Cues</span>
                              </div>
                              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                                {exercise.formCues?.map((cue, i) => (
                                  <li key={i}>{cue}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Common Mistakes */}
                            <div className="space-y-1.5">
                              <div className="font-semibold text-amber-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Critical Form Errors to Avoid</span>
                              </div>
                              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                                {exercise.mistakesToAvoid?.map((mistake, i) => (
                                  <li key={i}>{mistake}</li>
                                ))}
                              </ul>
                            </div>

                            {exercise.substitutionAlternative && (
                              <div className="md:col-span-2 pt-2 border-t border-slate-800/60 text-slate-400 text-[11px]">
                                <span className="font-semibold text-slate-300">Alternative: </span>
                                <span>{exercise.substitutionAlternative}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Post-Workout Cool-Down */}
              {activeDay.cooldown && activeDay.cooldown.length > 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Phase 3: Static Decompression & Cool-down (~3-5 mins)
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {activeDay.cooldown.length} Stretches
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeDay.cooldown.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-200">{item.name}</span>
                        <span className="font-mono text-emerald-400 text-[11px]">
                          {item.durationOrReps}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Session Post-Workout Recovery Protocol */}
              {activeDay.recoveryGuidance && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    <Heart className="w-4 h-4" />
                    <span>Phase 4: Immediate Post-Session Recovery Guidance</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/70">
                      <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Active Flush:</span>
                      </div>
                      <p className="text-slate-400 leading-snug">
                        {activeDay.recoveryGuidance.activeRecoveryCardio}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/70">
                      <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-blue-400" />
                        <span>Nutrient Timing:</span>
                      </div>
                      <p className="text-slate-400 leading-snug">
                        {activeDay.recoveryGuidance.hydrationAndNutritionTip}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/70">
                      <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-amber-300" />
                        <span>Autonomic Reset:</span>
                      </div>
                      <p className="text-slate-400 leading-snug">
                        {activeDay.recoveryGuidance.sleepAndCNSGuidance}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Program Overload & Coaching Principles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Progression Protocol</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {plan.progressionStrategy.weeklyOverloadTip}
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                Recommended deload frequency: every{' '}
                <strong className="text-slate-200">{plan.progressionStrategy.deloadCadenceWeeks} weeks</strong>.
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>Coach Guidance</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {plan.coachAdvice?.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Swap Modal */}
      {swappingExercise && (
        <ExerciseSwapModal
          exercise={swappingExercise}
          isOpen={true}
          onClose={() => setSwappingExercise(null)}
          onConfirmSwap={handleConfirmSwap}
        />
      )}

      {/* Feedback & Refinement Modal */}
      {isFeedbackModalOpen && (
        <PlanFeedbackModal
          currentPlan={plan}
          isOpen={true}
          onClose={() => setIsFeedbackModalOpen(false)}
          onPlanUpdated={(updated) => {
            onPlanUpdated(updated);
            setIsFeedbackModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
