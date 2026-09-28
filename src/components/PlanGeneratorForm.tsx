import React, { useState } from 'react';
import {
  Sparkles,
  Dumbbell,
  Flame,
  Zap,
  Heart,
  ShieldAlert,
  Clock,
  Calendar,
  Utensils,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { UserProfile, FitnessGoal, ExperienceLevel, EquipmentLevel, DietaryPreference, ActivityLevel } from '../types/fitness';

interface PlanGeneratorFormProps {
  initialProfile?: UserProfile;
  onSubmit: (profile: UserProfile) => Promise<void>;
  isLoading: boolean;
  onCancel?: () => void;
}

export const PlanGeneratorForm: React.FC<PlanGeneratorFormProps> = ({
  initialProfile,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      fitnessGoal: 'hypertrophy',
      experienceLevel: 'intermediate',
      daysPerWeek: 4,
      sessionDuration: 50,
      equipment: 'commercial_gym',
      targetFocus: ['chest_arms', 'back_posture', 'legs_glutes'],
      injuriesRestrictions: 'none',
      dietaryPreference: 'high_protein',
      age: 28,
      gender: 'male',
      weightKg: 75,
      heightCm: 178,
      activityLevel: 'moderately_active',
      customNotes: '',
    }
  );

  const [statusMessageIndex, setStatusMessageIndex] = useState(0);

  // Rotating status messages during generation
  React.useEffect(() => {
    if (!isLoading) return;
    const messages = [
      'Synthesizing biomechanical parameters & joint angles...',
      'Calibrating weekly training volume & muscle recovery windows...',
      'Selecting optimal compound & isolation movement pairings...',
      'Formulating precision macronutrient & caloric balance...',
      'Finalizing eccentric tempo guidelines and coaching cues...',
    ];
    const interval = setInterval(() => {
      setStatusMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const goals: { id: FitnessGoal; label: string; desc: string; icon: any }[] = [
    {
      id: 'hypertrophy',
      label: 'Muscle Hypertrophy',
      desc: 'Maximize lean muscle mass via progressive tension & volume.',
      icon: Dumbbell,
    },
    {
      id: 'fat_loss',
      label: 'Fat Loss & Definition',
      desc: 'Maintain muscle while shedding body fat via metabolic conditioning.',
      icon: Flame,
    },
    {
      id: 'strength',
      label: 'Pure Strength & Power',
      desc: 'Prioritize neuromuscular recruitment on main compound lifts.',
      icon: Zap,
    },
    {
      id: 'mobility_longevity',
      label: 'Mobility & Longevity',
      desc: 'Fix posture, joint aches, flexibility, and sustainable functional strength.',
      icon: Heart,
    },
  ];

  const equipmentOptions: { id: EquipmentLevel; label: string; desc: string }[] = [
    {
      id: 'commercial_gym',
      label: 'Commercial Gym',
      desc: 'Full access to barbells, racks, cables, and machines.',
    },
    {
      id: 'home_gym',
      label: 'Home Gym (Barbell & Bench)',
      desc: 'Squat rack, barbell, plates, bench, pull-up bar.',
    },
    {
      id: 'dumbbells_bands',
      label: 'Dumbbells & Resistance Bands',
      desc: 'Adjustable dumbbells, resistance bands, yoga mat.',
    },
    {
      id: 'bodyweight',
      label: 'Bodyweight / Calisthenics',
      desc: 'Zero equipment needed or standard pull-up bar only.',
    },
  ];

  const focusAreas = [
    { id: 'chest_arms', label: 'Chest & Arms' },
    { id: 'back_posture', label: 'Back & Posture' },
    { id: 'legs_glutes', label: 'Legs & Glutes' },
    { id: 'core_abs', label: 'Core & Abs' },
    { id: 'full_compound', label: 'Full Body Compounds' },
    { id: 'conditioning', label: 'Cardio & Conditioning' },
  ];

  const toggleFocus = (id: string) => {
    setProfile((prev) => {
      const exists = prev.targetFocus.includes(id);
      if (exists) {
        return { ...prev, targetFocus: prev.targetFocus.filter((f) => f !== id) };
      } else {
        return { ...prev, targetFocus: [...prev.targetFocus, id] };
      }
    });
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(profile);
  };

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl">
      {isLoading ? (
        <div className="py-16 px-4 text-center">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping"></div>
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            Architecting Your Plan with Gemini
          </h2>

          <p className="text-sm font-medium text-emerald-400 max-w-md mx-auto min-h-[40px] transition-all">
            {
              [
                'Synthesizing biomechanical parameters & joint angles...',
                'Calibrating weekly training volume & muscle recovery windows...',
                'Selecting optimal compound & isolation movement pairings...',
                'Formulating precision macronutrient & caloric balance...',
                'Finalizing eccentric tempo guidelines and coaching cues...',
              ][statusMessageIndex]
            }
          </p>

          <div className="mt-8 max-w-md mx-auto bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-400 text-left space-y-1.5">
            <div className="flex items-center gap-2 text-slate-300 font-semibold mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Target Parameters Locked</span>
            </div>
            <div>Goal: <span className="text-slate-200 capitalize">{profile.fitnessGoal.replace('_', ' ')}</span></div>
            <div>Cadence: <span className="text-slate-200">{profile.daysPerWeek} days / week ({profile.sessionDuration} min sessions)</span></div>
            <div>Equipment: <span className="text-slate-200 capitalize">{profile.equipment.replace('_', ' ')}</span></div>
            <div>Safeguards: <span className="text-slate-200 capitalize">{profile.injuriesRestrictions.replace('_', ' ')}</span></div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Header & Step Tracker */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                Step {step} of {totalSteps}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {step === 1 && 'Primary Goal & Experience'}
                {step === 2 && 'Training Cadence & Equipment'}
                {step === 3 && 'Biometrics & Nutrition Targets'}
                {step === 4 && 'Joint Safeguards & Preferences'}
              </h2>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    s === step
                      ? 'bg-emerald-400 w-6'
                      : s < step
                      ? 'bg-emerald-600'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: Goal & Experience */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">
                  Select Your Main Objective
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {goals.map((g) => {
                    const Icon = g.icon;
                    const isSelected = profile.fitnessGoal === g.id;
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => setProfile({ ...profile, fitnessGoal: g.id })}
                        className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-sm'
                            : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`p-2.5 rounded-lg shrink-0 ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm mb-0.5 text-white">
                            {g.label}
                          </div>
                          <div className="text-xs text-slate-400 leading-relaxed">
                            {g.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['beginner', 'intermediate', 'advanced'] as ExperienceLevel[]).map(
                    (level) => (
                      <button
                        type="button"
                        key={level}
                        onClick={() => setProfile({ ...profile, experienceLevel: level })}
                        className={`py-3 px-4 rounded-xl border text-center font-medium text-xs capitalize transition-all ${
                          profile.experienceLevel === level
                            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {level}
                        <div className="text-[10px] text-slate-500 mt-0.5 font-normal">
                          {level === 'beginner' && '< 1 year'}
                          {level === 'intermediate' && '1 - 3 years'}
                          {level === 'advanced' && '3+ years'}
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Cadence & Equipment */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-200">
                    Training Frequency
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {profile.daysPerWeek} days / week
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[2, 3, 4, 5, 6].map((days) => (
                    <button
                      type="button"
                      key={days}
                      onClick={() => setProfile({ ...profile, daysPerWeek: days })}
                      className={`py-3 rounded-xl border font-mono text-sm font-bold transition-all ${
                        profile.daysPerWeek === days
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-200">
                    Target Session Duration
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {profile.sessionDuration} minutes
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[20, 30, 45, 60, 75].map((mins) => (
                    <button
                      type="button"
                      key={mins}
                      onClick={() => setProfile({ ...profile, sessionDuration: mins })}
                      className={`py-3 rounded-xl border font-mono text-xs font-bold transition-all ${
                        profile.sessionDuration === mins
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">
                  Available Equipment
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {equipmentOptions.map((eq) => {
                    const isSelected = profile.equipment === eq.id;
                    return (
                      <button
                        type="button"
                        key={eq.id}
                        onClick={() => setProfile({ ...profile, equipment: eq.id })}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/10 text-white'
                            : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-sm mb-1 text-white">
                          {eq.label}
                        </div>
                        <div className="text-xs text-slate-400 leading-snug">
                          {eq.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Biometrics & Nutrition */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    min={14}
                    max={95}
                    value={profile.age}
                    onChange={(e) =>
                      setProfile({ ...profile, age: parseInt(e.target.value) || 25 })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Gender
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) =>
                      setProfile({ ...profile, gender: e.target.value as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non_binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min={35}
                    max={250}
                    value={profile.weightKg}
                    onChange={(e) =>
                      setProfile({ ...profile, weightKg: parseFloat(e.target.value) || 70 })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min={120}
                    max={230}
                    value={profile.heightCm}
                    onChange={(e) =>
                      setProfile({ ...profile, heightCm: parseInt(e.target.value) || 175 })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">
                  Dietary Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      ['high_protein', 'High Protein (Omnivore)'],
                      ['balanced_omnivore', 'Balanced Whole Foods'],
                      ['mediterranean', 'Mediterranean Diet'],
                      ['vegetarian', 'Vegetarian'],
                      ['vegan', 'Plant-Based Vegan'],
                      ['pescatarian', 'Pescatarian'],
                      ['keto_lowcarb', 'Keto / Low-Carb'],
                    ] as [DietaryPreference, string][]
                  ).map(([id, label]) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setProfile({ ...profile, dietaryPreference: id })}
                      className={`p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                        profile.dietaryPreference === id
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Daily Baseline Activity Level (outside workouts)
                </label>
                <select
                  value={profile.activityLevel}
                  onChange={(e) =>
                    setProfile({ ...profile, activityLevel: e.target.value as ActivityLevel })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="sedentary">Sedentary (Desk job, &lt; 5k steps/day)</option>
                  <option value="lightly_active">Lightly Active (Walking, light tasks, 5-8k steps)</option>
                  <option value="moderately_active">Moderately Active (Active on feet, 8-12k steps)</option>
                  <option value="very_active">Very Active (Physical labor or high daily movement)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: Safeguards & Muscle Focus */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">
                  Priority Muscle Focus Areas (Choose up to 3)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {focusAreas.map((area) => {
                    const isSelected = profile.targetFocus.includes(area.id);
                    return (
                      <button
                        type="button"
                        key={area.id}
                        onClick={() => toggleFocus(area.id)}
                        className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {area.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Joint Limitations or Injury Restrictions
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  Gemini will avoid movements that shear or compress these joints, selecting safer biomechanical substitutes.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    ['none', 'None (Healthy)'],
                    ['lower_back', 'Lower Back'],
                    ['knees', 'Knees'],
                    ['shoulders', 'Shoulders'],
                    ['wrists', 'Wrists / Forearms'],
                  ].map(([val, label]) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setProfile({ ...profile, injuriesRestrictions: val })}
                      className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                        profile.injuriesRestrictions === val
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                  Custom Preferences or Specific Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  value={profile.customNotes || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, customNotes: e.target.value })
                  }
                  placeholder="e.g., Include kettlebell swings, prioritize pull-up progression, prefer supersets for faster workouts..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-5 mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            ) : (
              <div></div>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Fitness Architecture</span>
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
