import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { PlanGeneratorForm } from './components/PlanGeneratorForm';
import { WeeklyPlanView } from './components/WeeklyPlanView';
import { NutritionView } from './components/NutritionView';
import { CoachPanel } from './components/CoachPanel';
import { HistoryAndExportView } from './components/HistoryAndExportView';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { DEFAULT_FITNESS_PLAN, STARTER_PRESETS } from './data/starterTemplates';
import { FitnessPlan, UserProfile, WorkoutDay, WorkoutSessionLog, Exercise } from './types/fitness';
import { CheckCircle2, AlertCircle, Dumbbell } from 'lucide-react';

const STORAGE_KEY_PLAN = 'fitbuddy_active_plan_v1';
const STORAGE_KEY_SAVED_PLANS = 'fitbuddy_saved_plans_v1';
const STORAGE_KEY_LOGS = 'fitbuddy_session_logs_v1';

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<FitnessPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAN);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_FITNESS_PLAN;
  });

  const [savedPlans, setSavedPlans] = useState<FitnessPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_PLANS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [DEFAULT_FITNESS_PLAN];
  });

  const [sessionLogs, setSessionLogs] = useState<WorkoutSessionLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [currentTab, setCurrentTab] = useState<'plan' | 'nutrition' | 'coach' | 'history' | 'generator'>('plan');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeSessionDay, setActiveSessionDay] = useState<WorkoutDay | null>(null);
  const [coachQuestion, setCoachQuestion] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(currentPlan));
    } catch (e) {
      console.error(e);
    }
  }, [currentPlan]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_PLANS, JSON.stringify(savedPlans));
    } catch (e) {
      console.error(e);
    }
  }, [savedPlans]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(sessionLogs));
    } catch (e) {
      console.error(e);
    }
  }, [sessionLogs]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleGeneratePlan = async (profile: UserProfile) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate fitness plan');
      }

      const newPlan: FitnessPlan = await res.json();
      setCurrentPlan(newPlan);
      setSavedPlans((prev) => [newPlan, ...prev.filter((p) => p.id !== newPlan.id)]);
      setCurrentTab('plan');
      showNotification(`"${newPlan.planTitle}" generated successfully!`, 'success');
    } catch (err: any) {
      console.error('Generation error:', err);
      showNotification(err.message || 'Generation error. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPreset = async (profile: UserProfile, title: string) => {
    await handleGeneratePlan(profile);
  };

  const handleUpdateExercise = (
    dayNumber: number,
    oldExerciseId: string,
    newExercise: Exercise
  ) => {
    const updatedSchedule = currentPlan.weeklySchedule.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          exercises: day.exercises.map((ex) =>
            ex.id === oldExerciseId ? newExercise : ex
          ),
        };
      }
      return day;
    });

    const updatedPlan: FitnessPlan = {
      ...currentPlan,
      weeklySchedule: updatedSchedule,
    };

    setCurrentPlan(updatedPlan);
    setSavedPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
    showNotification(`Swapped for ${newExercise.name}`, 'success');
  };

  const handleSaveWorkoutSession = (session: WorkoutSessionLog) => {
    setSessionLogs((prev) => [session, ...prev]);
    showNotification(`Day ${session.dayNumber} workout logged! Great work!`, 'success');
  };

  const handleOpenCoachWithQuestion = (q: string) => {
    setCoachQuestion(q);
    setCurrentTab('coach');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeSessionDayNumber={activeSessionDay ? activeSessionDay.dayNumber : null}
        onOpenActiveSession={() => activeSessionDay && setActiveSessionDay(activeSessionDay)}
      />

      {/* Floating Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-6 z-50 p-3.5 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-3 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* If in generator tab: show generator form */}
        {currentTab === 'generator' && (
          <div className="py-4">
            <PlanGeneratorForm
              initialProfile={currentPlan.userProfile}
              onSubmit={handleGeneratePlan}
              isLoading={isGenerating}
              onCancel={() => setCurrentTab('plan')}
            />
          </div>
        )}

        {/* If in Workouts tab */}
        {currentTab === 'plan' && (
          <div>
            <HeroBanner
              onOpenGenerator={() => setCurrentTab('generator')}
              onSelectPreset={handleSelectPreset}
              planTitle={currentPlan.planTitle}
              splitType={currentPlan.splitType}
            />

            <WeeklyPlanView
              plan={currentPlan}
              onStartWorkout={(day) => setActiveSessionDay(day)}
              onUpdateExercise={handleUpdateExercise}
              onOpenCoachWithQuestion={handleOpenCoachWithQuestion}
            />
          </div>
        )}

        {/* Nutrition Tab */}
        {currentTab === 'nutrition' && (
          <NutritionView nutrition={currentPlan.nutrition} />
        )}

        {/* AI Coach Tab */}
        {currentTab === 'coach' && (
          <CoachPanel
            plan={currentPlan}
            initialQuestion={coachQuestion}
          />
        )}

        {/* History & Export Tab */}
        {currentTab === 'history' && (
          <HistoryAndExportView
            currentPlan={currentPlan}
            savedPlans={savedPlans}
            sessionLogs={sessionLogs}
            onSelectPlan={(p) => {
              setCurrentPlan(p);
              setCurrentTab('plan');
              showNotification(`Switched to "${p.planTitle}"`, 'success');
            }}
            onClearLogs={() => {
              setSessionLogs([]);
              showNotification('Session logs cleared', 'success');
            }}
          />
        )}
      </main>

      {/* Live Active Workout Player Modal */}
      {activeSessionDay && (
        <ActiveWorkoutModal
          workoutDay={activeSessionDay}
          planId={currentPlan.id}
          planTitle={currentPlan.planTitle}
          isOpen={true}
          onClose={() => setActiveSessionDay(null)}
          onSaveSession={handleSaveWorkoutSession}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded bg-emerald-500/10 text-emerald-400">
              <Dumbbell className="w-3 h-3" />
            </span>
            <span className="font-semibold text-slate-300">Fitbuddy</span>
            <span className="text-slate-600">·</span>
            <span>AI Fitness & Nutrition Architecture</span>
          </div>
          <div className="text-slate-500">
            Powered by Gemini Models · Evidence-Based Progressive Overload & Sports Nutrition
          </div>
        </div>
      </footer>
    </div>
  );
}
