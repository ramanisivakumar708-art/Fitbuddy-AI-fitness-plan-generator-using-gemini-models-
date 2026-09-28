export type FitnessGoal =
  | 'hypertrophy'
  | 'fat_loss'
  | 'strength'
  | 'endurance'
  | 'mobility_longevity'
  | 'general_health';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type EquipmentLevel =
  | 'commercial_gym'
  | 'home_gym'
  | 'dumbbells_bands'
  | 'bodyweight';

export type DietaryPreference =
  | 'balanced_omnivore'
  | 'high_protein'
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'keto_lowcarb'
  | 'mediterranean';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active';

export interface UserProfile {
  fitnessGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  daysPerWeek: number;
  sessionDuration: number;
  equipment: EquipmentLevel;
  targetFocus: string[];
  injuriesRestrictions: string;
  dietaryPreference: DietaryPreference;
  age: number;
  gender: 'male' | 'female' | 'non_binary' | 'other';
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  customNotes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  secondaryMuscles?: string[];
  equipment: string;
  sets: number;
  reps: string;
  restSeconds: number;
  rpe: number;
  tempo?: string;
  formCues: string[];
  mistakesToAvoid: string[];
  substitutionAlternative?: string;
}

export interface WarmupCooldownItem {
  name: string;
  durationOrReps: string;
  notes?: string;
}

export interface RecoveryProtocol {
  activeRecoveryCardio: string;
  mobilityDrills: { name: string; duration: string; purpose: string }[];
  hydrationAndNutritionTip: string;
  sleepAndCNSGuidance: string;
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string;
  focus: string;
  estimatedMinutes: number;
  isRestDay: boolean;
  restDayActivity?: string;
  recoveryGuidance?: RecoveryProtocol;
  warmup: WarmupCooldownItem[];
  exercises: Exercise[];
  cooldown: WarmupCooldownItem[];
}

export interface SampleMeal {
  mealName: string;
  timeOfDay: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  foods: string[];
  cookingTip?: string;
}

export interface Supplement {
  name: string;
  dosage: string;
  timing: string;
  purpose: string;
}

export interface NutritionPlan {
  targetDailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  waterLiters: number;
  dietarySummary: string;
  sampleMeals: SampleMeal[];
  keyNutrientFocus: string[];
  supplementRecommendations: Supplement[];
}

export interface ProgressionStrategy {
  weeklyOverloadTip: string;
  deloadCadenceWeeks: number;
  cardioRecommendation: string;
}

export interface FitnessPlan {
  id: string;
  createdAt: string;
  planTitle: string;
  programSummary: string;
  difficulty: string;
  splitType: string;
  weeklySchedule: WorkoutDay[];
  nutrition: NutritionPlan;
  progressionStrategy: ProgressionStrategy;
  coachAdvice: string[];
  userProfile?: UserProfile;
}

export interface LoggedSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface CompletedExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: LoggedSet[];
}

export interface WorkoutSessionLog {
  id: string;
  planId: string;
  planTitle: string;
  dayNumber: number;
  dayName: string;
  timestamp: string;
  durationSeconds: number;
  exercises: CompletedExerciseLog[];
  feelingScore: number; // 1-5
  notes?: string;
}
