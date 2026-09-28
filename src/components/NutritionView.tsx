import React, { useState } from 'react';
import {
  Utensils,
  Droplet,
  Flame,
  Dumbbell,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { NutritionPlan, SampleMeal, Supplement } from '../types/fitness';

interface NutritionViewProps {
  nutrition: NutritionPlan;
}

export const NutritionView: React.FC<NutritionViewProps> = ({ nutrition }) => {
  const [calorieMultiplier, setCalorieMultiplier] = useState<'normal' | 'deficit' | 'surplus'>('normal');

  const baseCalories = nutrition.targetDailyCalories;
  const currentCalories =
    calorieMultiplier === 'deficit'
      ? Math.round(baseCalories * 0.82)
      : calorieMultiplier === 'surplus'
      ? Math.round(baseCalories * 1.1)
      : baseCalories;

  const proteinCals = nutrition.proteinGrams * 4;
  const carbsCals = nutrition.carbsGrams * 4;
  const fatCals = nutrition.fatGrams * 9;
  const totalMacroCals = proteinCals + carbsCals + fatCals || baseCalories;

  const proteinPct = Math.round((proteinCals / totalMacroCals) * 100);
  const carbsPct = Math.round((carbsCals / totalMacroCals) * 100);
  const fatPct = Math.round((fatCals / totalMacroCals) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner with High Fidelity Image */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/nutrition_meal_prep_1790575709257.jpg"
            alt="Healthy high protein culinary meal prep"
            className="w-full h-full object-cover object-center opacity-30 filter brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-8 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            <Utensils className="w-4 h-4" />
            <span>Precision Sports Nutrition Architecture</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Nutritional Fuel Calibrated for Muscular Recovery
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {nutrition.dietarySummary}
          </p>

          {/* Quick macro selector */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-medium">Energy Strategy:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-950/90 rounded-lg border border-slate-800">
              <button
                onClick={() => setCalorieMultiplier('deficit')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  calorieMultiplier === 'deficit'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Fat Cut (-18%)
              </button>
              <button
                onClick={() => setCalorieMultiplier('normal')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  calorieMultiplier === 'normal'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Plan Target
              </button>
              <button
                onClick={() => setCalorieMultiplier('surplus')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  calorieMultiplier === 'surplus'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hypertrophy (+10%)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Grid Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-left">
          <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
            <span>Daily Calories</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white tabular-nums">
            {currentCalories}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">kcal / day</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-left">
          <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
            <span>Protein</span>
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
            {nutrition.proteinGrams}g
          </div>
          <div className="text-[11px] text-slate-500 font-mono">{proteinPct}% of calories</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-left">
          <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
            <span>Carbohydrates</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-400 tabular-nums">
            {nutrition.carbsGrams}g
          </div>
          <div className="text-[11px] text-slate-500 font-mono">{carbsPct}% of calories</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-left">
          <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
            <span>Healthy Fats</span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-300 tabular-nums">
            {nutrition.fatGrams}g
          </div>
          <div className="text-[11px] text-slate-500 font-mono">{fatPct}% of calories</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-left col-span-2 sm:col-span-1">
          <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
            <span>Daily Water</span>
            <Droplet className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400 tabular-nums">
            {nutrition.waterLiters}L
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Hydration target</div>
        </div>
      </div>

      {/* Visual Macro Balance Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
          <span>Macronutrient Ratio Breakdown</span>
          <span className="font-mono text-slate-400 text-[11px]">
            {proteinPct}% Protein · {carbsPct}% Carbs · {fatPct}% Fat
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
          <div
            style={{ width: `${proteinPct}%` }}
            className="bg-emerald-400 h-full"
            title={`Protein: ${proteinPct}%`}
          />
          <div
            style={{ width: `${carbsPct}%` }}
            className="bg-blue-400 h-full"
            title={`Carbs: ${carbsPct}%`}
          />
          <div
            style={{ width: `${fatPct}%` }}
            className="bg-amber-300 h-full"
            title={`Fat: ${fatPct}%`}
          />
        </div>
      </div>

      {/* Sample Daily Meal Plan Cards */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Structured Daily Meal Schedule
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nutrition.sampleMeals?.map((meal, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-medium text-emerald-400">
                    {meal.timeOfDay}
                  </span>
                  <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                    {meal.calories} kcal
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mb-2">
                  {meal.mealName}
                </h4>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-3 border-b border-slate-800/80 pb-2">
                  <span>P: <strong className="text-emerald-400">{meal.proteinG}g</strong></span>
                  <span>C: <strong className="text-blue-400">{meal.carbsG}g</strong></span>
                  <span>F: <strong className="text-amber-300">{meal.fatG}g</strong></span>
                </div>

                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside mb-3">
                  {meal.foods?.map((food, fIdx) => (
                    <li key={fIdx}>{food}</li>
                  ))}
                </ul>
              </div>

              {meal.cookingTip && (
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 italic">
                  Tip: {meal.cookingTip}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Nutrient Focus & Supplements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Nutrient Guidelines */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Nutrient Timing & Hydration Rules</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {nutrition.keyNutrientFocus?.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Evidence-Based Supplements */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Evidence-Based Supplement Protocols</span>
          </div>

          <div className="space-y-2.5">
            {nutrition.supplementRecommendations?.map((supp, sIdx) => (
              <div
                key={sIdx}
                className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/70 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-white mb-0.5">
                  <span>{supp.name}</span>
                  <span className="text-emerald-400 font-mono text-[11px]">{supp.dosage}</span>
                </div>
                <div className="text-[11px] text-slate-400 mb-1">
                  Timing: <strong className="text-slate-300">{supp.timing}</strong>
                </div>
                <div className="text-[11px] text-slate-400">
                  {supp.purpose}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
