import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Award,
  Timer,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { WorkoutDay, Exercise, WorkoutSessionLog, LoggedSet } from '../types/fitness';
import { playChime } from '../utils/audio';

interface ActiveWorkoutModalProps {
  workoutDay: WorkoutDay;
  planId: string;
  planTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSaveSession: (session: WorkoutSessionLog) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  workoutDay,
  planId,
  planTitle,
  isOpen,
  onClose,
  onSaveSession,
}) => {
  if (!isOpen) return null;

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(true);

  // Rest Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState<number>(0);
  const [isRestActive, setIsRestActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Logged sets state mapped by exerciseId -> LoggedSet[]
  const [exerciseLogs, setExerciseLogs] = useState<{
    [exerciseId: string]: LoggedSet[];
  }>({});

  // Summary finish modal state
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [feelingScore, setFeelingScore] = useState<number>(4);
  const [sessionNotes, setSessionNotes] = useState<string>('');

  const currentExercise: Exercise | undefined =
    workoutDay.exercises[currentExerciseIndex];

  // Initialize exercise logs
  useEffect(() => {
    const initialLogs: { [id: string]: LoggedSet[] } = {};
    workoutDay.exercises.forEach((ex) => {
      initialLogs[ex.id] = Array.from({ length: ex.sets }).map((_, idx) => ({
        setNumber: idx + 1,
        weightKg: 0,
        reps: parseInt(ex.reps.split('-')[0]) || 10,
        completed: false,
      }));
    });
    setExerciseLogs(initialLogs);
  }, [workoutDay]);

  // Workout Session Stop Watch
  useEffect(() => {
    let interval: any;
    if (isWorkoutActive && !isFinished) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, isFinished]);

  // Rest Countdown Timer
  useEffect(() => {
    let restInterval: any;
    if (isRestActive && restSecondsLeft > 0) {
      restInterval = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            if (soundEnabled) playChime('rest');
            setIsRestActive(false);
            return 0;
          }
          if (prev <= 4 && soundEnabled) {
            playChime('beep');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [isRestActive, restSecondsLeft, soundEnabled]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleSetComplete = (setIndex: number) => {
    if (!currentExercise) return;
    const currentSets = [...(exerciseLogs[currentExercise.id] || [])];
    const targetSet = currentSets[setIndex];
    if (!targetSet) return;

    const willBeCompleted = !targetSet.completed;
    targetSet.completed = willBeCompleted;

    setExerciseLogs({
      ...exerciseLogs,
      [currentExercise.id]: currentSets,
    });

    // If marked complete, automatically trigger the exercise rest timer
    if (willBeCompleted) {
      setRestSecondsLeft(currentExercise.restSeconds || 90);
      setIsRestActive(true);
      if (soundEnabled) playChime('beep');
    }
  };

  const handleUpdateSet = (
    setIndex: number,
    field: 'weightKg' | 'reps',
    value: number
  ) => {
    if (!currentExercise) return;
    const currentSets = [...(exerciseLogs[currentExercise.id] || [])];
    if (currentSets[setIndex]) {
      currentSets[setIndex][field] = value;
      setExerciseLogs({
        ...exerciseLogs,
        [currentExercise.id]: currentSets,
      });
    }
  };

  const handleAdjustRest = (delta: number) => {
    setRestSecondsLeft((prev) => Math.max(0, prev + delta));
  };

  const handleCompleteWorkout = () => {
    if (soundEnabled) playChime('success');
    setIsFinished(true);
  };

  const handleSaveAndExit = () => {
    const sessionLog: WorkoutSessionLog = {
      id: 'session_' + Date.now(),
      planId,
      planTitle,
      dayNumber: workoutDay.dayNumber,
      dayName: workoutDay.dayName,
      timestamp: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      exercises: workoutDay.exercises.map((ex) => ({
        exerciseId: ex.id,
        exerciseName: ex.name,
        sets: exerciseLogs[ex.id] || [],
      })),
      feelingScore,
      notes: sessionNotes,
    };
    onSaveSession(sessionLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header bar */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Live Workout Player
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-[280px] sm:max-w-md">
                {workoutDay.dayName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Stopwatch */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-emerald-400">
              <Timer className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Toggle timer audio chime"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Finished Dialog */}
        {isFinished ? (
          <div className="p-8 text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              Workout Crushed!
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Total duration: {formatTime(elapsedSeconds)} · {workoutDay.exercises.length} Exercises Complete
            </p>

            <div className="max-w-md mx-auto space-y-4 text-left mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  How did this session feel? (RPE / Energy)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setFeelingScore(score)}
                      className={`py-2 rounded-xl border text-xs font-bold font-mono transition-all ${
                        feelingScore === score
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {score === 1 && 'Exhausted'}
                      {score === 2 && 'Tough'}
                      {score === 3 && 'Solid'}
                      {score === 4 && 'Great'}
                      {score === 5 && 'Peak'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Workout Notes / Personal Records (Optional)
                </label>
                <textarea
                  rows={2}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="e.g., Felt strong on squats, increased bench press weight by 2.5kg..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleSaveAndExit}
              className="py-3 px-8 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm shadow-md transition-all"
            >
              Save to Training History & Exit
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Rest Timer Floating Banner if Active */}
            {isRestActive && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3.5 flex items-center justify-between animate-in slide-in-from-top">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center font-mono font-bold text-emerald-400 text-sm">
                    {restSecondsLeft}s
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-300">
                      Rest Interval Running
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Take deep breaths, hydrate, and prepare for next set
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAdjustRest(-15)}
                    className="px-2 py-1 rounded bg-slate-800 text-[11px] font-mono text-slate-300 hover:bg-slate-700"
                  >
                    -15s
                  </button>
                  <button
                    onClick={() => handleAdjustRest(30)}
                    className="px-2 py-1 rounded bg-slate-800 text-[11px] font-mono text-slate-300 hover:bg-slate-700"
                  >
                    +30s
                  </button>
                  <button
                    onClick={() => setIsRestActive(false)}
                    className="px-2.5 py-1 rounded bg-emerald-500 text-[11px] font-semibold text-slate-950 hover:bg-emerald-400"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            {/* Exercise Carousel Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {workoutDay.exercises.map((ex, idx) => {
                const logs = exerciseLogs[ex.id] || [];
                const allDone = logs.length > 0 && logs.every((s) => s.completed);
                const isCurrent = idx === currentExerciseIndex;
                return (
                  <button
                    key={ex.id}
                    onClick={() => setCurrentExerciseIndex(idx)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold'
                        : allDone
                        ? 'border-slate-800 bg-emerald-950/30 text-emerald-400'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {allDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                    )}
                    <span className="truncate max-w-[120px]">{ex.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Current Exercise Detail Card */}
            {currentExercise && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-mono font-medium text-emerald-400 mb-1">
                      Exercise {currentExerciseIndex + 1} of {workoutDay.exercises.length} · {currentExercise.targetMuscle}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-1">
                      {currentExercise.name}
                    </h4>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>Equipment: <strong className="text-slate-200">{currentExercise.equipment}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Target RPE: <strong className="text-slate-200">{currentExercise.rpe}</strong></span>
                      {currentExercise.tempo && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Tempo: <strong className="text-slate-200 font-mono">{currentExercise.tempo}</strong></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Cues Quick Accordion */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-300">
                  <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Form Cues:</span>
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-slate-400 text-[11px]">
                    {currentExercise.formCues?.slice(0, 3).map((cue, i) => (
                      <li key={i}>{cue}</li>
                    ))}
                  </ul>
                </div>

                {/* Sets Table */}
                <div>
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    <div className="col-span-2">Set</div>
                    <div className="col-span-4">Load (kg)</div>
                    <div className="col-span-4">Reps Done</div>
                    <div className="col-span-2 text-right">Done</div>
                  </div>

                  <div className="space-y-2">
                    {(exerciseLogs[currentExercise.id] || []).map((setLog, sIdx) => (
                      <div
                        key={sIdx}
                        className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl border transition-all ${
                          setLog.completed
                            ? 'border-emerald-500/40 bg-emerald-500/10'
                            : 'border-slate-800 bg-slate-900'
                        }`}
                      >
                        <div className="col-span-2 font-mono font-bold text-xs text-slate-300 pl-2">
                          #{setLog.setNumber}
                        </div>

                        <div className="col-span-4">
                          <input
                            type="number"
                            step="0.5"
                            placeholder="kg"
                            value={setLog.weightKg === 0 ? '' : setLog.weightKg}
                            onChange={(e) =>
                              handleUpdateSet(
                                sIdx,
                                'weightKg',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="col-span-4">
                          <input
                            type="number"
                            placeholder={currentExercise.reps}
                            value={setLog.reps}
                            onChange={(e) =>
                              handleUpdateSet(
                                sIdx,
                                'reps',
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="col-span-2 flex justify-end pr-2">
                          <button
                            type="button"
                            onClick={() => handleToggleSetComplete(sIdx)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                              setLog.completed
                                ? 'bg-emerald-400 text-slate-950 shadow-sm'
                                : 'border border-slate-700 bg-slate-950 text-transparent hover:border-emerald-500'
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions footer */}
        {!isFinished && (
          <div className="border-t border-slate-800 px-5 py-3.5 bg-slate-950 flex items-center justify-between">
            <button
              onClick={() =>
                setCurrentExerciseIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentExerciseIndex === 0}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            {currentExerciseIndex < workoutDay.exercises.length - 1 ? (
              <button
                onClick={() => setCurrentExerciseIndex((prev) => prev + 1)}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
              >
                <span>Next Exercise</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCompleteWorkout}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-xs font-bold text-slate-950 shadow-md transition-all hover:scale-[1.02]"
              >
                <Award className="w-4 h-4" />
                <span>Finish Workout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
