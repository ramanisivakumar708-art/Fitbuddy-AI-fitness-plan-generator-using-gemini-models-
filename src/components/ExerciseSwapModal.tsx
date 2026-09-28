import React, { useState } from 'react';
import { X, RefreshCw, Sparkles, Check, AlertCircle, HelpCircle } from 'lucide-react';
import { Exercise } from '../types/fitness';

interface ExerciseSwapModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSwap: (oldExerciseId: string, newExercise: Exercise) => void;
}

export const ExerciseSwapModal: React.FC<ExerciseSwapModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onConfirmSwap,
}) => {
  const [reason, setReason] = useState<string>('equipment_busy');
  const [customReason, setCustomReason] = useState<string>('');
  const [equipmentType, setEquipmentType] = useState<string>('dumbbells');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestedExercise, setSuggestedExercise] = useState<Exercise | null>(null);
  const [selectionReason, setSelectionReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchAlternative = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const reasonText =
        reason === 'custom'
          ? customReason || 'Personal preference'
          : reason === 'equipment_busy'
          ? 'Machine / barbell station is currently busy'
          : reason === 'joint_discomfort'
          ? 'Mild joint discomfort or stiffness with this movement'
          : 'Looking for a fresh variation';

      const res = await fetch('/api/substitute-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise,
          reason: reasonText,
          equipmentAvailable: equipmentType,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get exercise substitution');
      }

      const data = await res.json();
      setSuggestedExercise(data);
      if (data.reasonForSelection) {
        setSelectionReason(data.reasonForSelection);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not fetch alternative exercise. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestedExercise) {
      onConfirmSwap(exercise.id, suggestedExercise);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-0.5">
              Smart Exercise Swap
            </div>
            <h3 className="text-lg font-bold text-white">
              Substitute "{exercise.name}"
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!suggestedExercise ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Why do you want to substitute this exercise?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['equipment_busy', 'Equipment Is Taken'],
                  ['joint_discomfort', 'Joint Discomfort'],
                  ['too_hard', 'Difficulty Level'],
                  ['custom', 'Other Preference'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setReason(id)}
                    className={`p-2.5 rounded-xl border text-xs text-left font-medium transition-all ${
                      reason === id
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {reason === 'custom' && (
              <div>
                <input
                  type="text"
                  placeholder="Specify reason (e.g. want dumbbell variation only)..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Equipment You Have Available Right Now
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['dumbbells', 'Dumbbells'],
                  ['cables', 'Cables / Pulley'],
                  ['bodyweight', 'Bodyweight'],
                  ['barbell', 'Barbell'],
                  ['machine', 'Machine'],
                  ['bands', 'Resistance Bands'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setEquipmentType(id)}
                    className={`p-2 rounded-xl border text-xs text-center font-medium capitalize transition-all ${
                      equipmentType === id
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Default alternative hint if available in plan */}
            {exercise.substitutionAlternative && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Quick recommendation: </span>
                <span>{exercise.substitutionAlternative}</span>
              </div>
            )}

            <button
              onClick={handleFetchAlternative}
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Consulting Gemini for Alternative...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Biomechanical Replacement</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10">
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                Gemini Recommends
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                {suggestedExercise.name}
              </h4>
              <div className="text-xs text-slate-300 mb-2 font-mono">
                {suggestedExercise.sets} sets × {suggestedExercise.reps} reps · {suggestedExercise.restSeconds}s rest
              </div>
              {selectionReason && (
                <p className="text-xs text-emerald-300/90 italic mb-3">
                  "{selectionReason}"
                </p>
              )}

              <div className="border-t border-emerald-500/20 pt-2.5 mt-2">
                <div className="text-[11px] font-semibold text-slate-200 mb-1">Key Form Cues:</div>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {suggestedExercise.formCues?.slice(0, 3).map((cue, i) => (
                    <li key={i}>{cue}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSuggestedExercise(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Try Another
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Replace in Plan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
