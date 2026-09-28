import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const fitnessPlanResponseSchema = {
  type: Type.OBJECT,
  properties: {
    planTitle: {
      type: Type.STRING,
      description: 'Engaging, inspiring name for this personalized fitness plan',
    },
    programSummary: {
      type: Type.STRING,
      description: 'Comprehensive 2-3 sentence summary of the training philosophy, stimulus, and target outcomes.',
    },
    difficulty: {
      type: Type.STRING,
      description: 'Beginner, Intermediate, or Advanced',
    },
    splitType: {
      type: Type.STRING,
      description: 'e.g. Upper / Lower, Push / Pull / Legs, Full Body, Conditioning',
    },
    weeklySchedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          dayName: { type: Type.STRING, description: 'e.g. Day 1: Push & Chest Hypertrophy' },
          focus: { type: Type.STRING, description: 'Primary stimulus focus' },
          estimatedMinutes: { type: Type.INTEGER, description: 'Duration in minutes' },
          isRestDay: { type: Type.BOOLEAN },
          restDayActivity: { type: Type.STRING, description: 'Suggested light movement or mobility if rest day' },
          recoveryGuidance: {
            type: Type.OBJECT,
            properties: {
              activeRecoveryCardio: { type: Type.STRING, description: 'e.g. 30-min brisk zone-2 walk, light cycling, or gentle swim' },
              hydrationAndNutritionTip: { type: Type.STRING, description: 'Refuel and electrolyte replenishment guidance' },
              sleepAndCNSGuidance: { type: Type.STRING, description: 'Sleep target and parasympathetic decompression protocol' },
              mobilityDrills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                  },
                  required: ['name', 'duration', 'purpose'],
                },
              },
            },
            required: ['activeRecoveryCardio', 'hydrationAndNutritionTip', 'sleepAndCNSGuidance', 'mobilityDrills'],
          },
          warmup: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                durationOrReps: { type: Type.STRING },
                notes: { type: Type.STRING },
              },
              required: ['name', 'durationOrReps'],
            },
          },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                targetMuscle: { type: Type.STRING },
                secondaryMuscles: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                equipment: { type: Type.STRING },
                sets: { type: Type.INTEGER },
                reps: { type: Type.STRING, description: 'e.g. 8-10, 12-15, AMRAP' },
                restSeconds: { type: Type.INTEGER },
                rpe: { type: Type.NUMBER, description: 'Rate of Perceived Exertion (6-10)' },
                tempo: { type: Type.STRING, description: 'Eccentric-Pause-Concentric-Pause, e.g. 3-0-1-0' },
                formCues: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                mistakesToAvoid: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                substitutionAlternative: { type: Type.STRING },
              },
              required: ['id', 'name', 'targetMuscle', 'equipment', 'sets', 'reps', 'restSeconds', 'rpe', 'formCues', 'mistakesToAvoid'],
            },
          },
          cooldown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                durationOrReps: { type: Type.STRING },
                notes: { type: Type.STRING },
              },
              required: ['name', 'durationOrReps'],
            },
          },
        },
        required: ['dayNumber', 'dayName', 'focus', 'estimatedMinutes', 'isRestDay', 'warmup', 'exercises', 'cooldown'],
      },
    },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        targetDailyCalories: { type: Type.INTEGER },
        proteinGrams: { type: Type.INTEGER },
        carbsGrams: { type: Type.INTEGER },
        fatGrams: { type: Type.INTEGER },
        waterLiters: { type: Type.NUMBER },
        dietarySummary: { type: Type.STRING },
        sampleMeals: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              mealName: { type: Type.STRING },
              timeOfDay: { type: Type.STRING },
              calories: { type: Type.INTEGER },
              proteinG: { type: Type.INTEGER },
              carbsG: { type: Type.INTEGER },
              fatG: { type: Type.INTEGER },
              foods: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              cookingTip: { type: Type.STRING },
            },
            required: ['mealName', 'timeOfDay', 'calories', 'proteinG', 'carbsG', 'fatG', 'foods'],
          },
        },
        keyNutrientFocus: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        supplementRecommendations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              dosage: { type: Type.STRING },
              timing: { type: Type.STRING },
              purpose: { type: Type.STRING },
            },
            required: ['name', 'dosage', 'timing', 'purpose'],
          },
        },
      },
      required: ['targetDailyCalories', 'proteinGrams', 'carbsGrams', 'fatGrams', 'waterLiters', 'dietarySummary', 'sampleMeals', 'keyNutrientFocus', 'supplementRecommendations'],
    },
    progressionStrategy: {
      type: Type.OBJECT,
      properties: {
        weeklyOverloadTip: { type: Type.STRING },
        deloadCadenceWeeks: { type: Type.INTEGER },
        cardioRecommendation: { type: Type.STRING },
      },
      required: ['weeklyOverloadTip', 'deloadCadenceWeeks', 'cardioRecommendation'],
    },
    coachAdvice: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    feedbackApplied: {
      type: Type.STRING,
      description: 'Clear, concise 1-line summary of what user feedback was integrated (e.g. Added 2 cardio intervals & converted Thursday to active recovery)',
    },
  },
  required: ['planTitle', 'programSummary', 'difficulty', 'splitType', 'weeklySchedule', 'nutrition', 'progressionStrategy', 'coachAdvice'],
};

// API: Generate Fitness Plan
app.post('/api/generate-plan', async (req, res) => {
  try {
    const profile = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'Missing user profile data' });
    }

    const prompt = `You are Fitbuddy, an elite sports scientist, strength & conditioning specialist (CSCS), and certified sports nutritionist.
Create an evidence-based, highly customized weekly workout and nutrition plan tailored specifically to this person:

USER METRICS & PROFILE:
- Fitness Goal: ${profile.fitnessGoal}
- Experience Level: ${profile.experienceLevel}
- Available Days/Week: ${profile.daysPerWeek} days
- Target Session Duration: ${profile.sessionDuration} minutes
- Equipment Available: ${profile.equipment}
- Target Muscle Focus Areas: ${(profile.targetFocus || []).join(', ') || 'Balanced full body'}
- Physical Restrictions / Injuries: ${profile.injuriesRestrictions || 'None'}
- Age: ${profile.age || 28}, Gender: ${profile.gender || 'unspecified'}
- Bodyweight: ${profile.weightKg || 72} kg, Height: ${profile.heightCm || 175} cm
- Daily Activity Level: ${profile.activityLevel || 'moderately_active'}
- Dietary Preference: ${profile.dietaryPreference || 'balanced_omnivore'}
- Additional Notes / Preferences: ${profile.customNotes || 'None'}

REQUIREMENTS:
1. Schedule exactly 7 days in weeklySchedule (Day 1 through Day 7). All 7 days must be fully populated with specific focus and structure.
2. For Training Days:
   - Dynamic Warm-up: 3+ specific dynamic drills with duration/reps and neuromuscular activation notes.
   - Main Exercises: 4-6 compound and targeted isolation exercises calibrated to finish within ${profile.sessionDuration} minutes. Every exercise must specify exact sets, rep range, rest interval (seconds), target RPE, eccentric-concentric tempo, target muscle, equipment, 3+ kinematic form cues, and common mistakes to avoid.
   - Post-Workout Cool-down: 2-3 static stretches or myofascial decompression drills with hold durations.
   - Recovery Guidance: immediate post-workout rehydration and nutrient refuel protocol.
3. For Rest & Recovery Days (isRestDay: true):
   - Set exercises to an empty array.
   - Provide complete, structured Recovery Guidance:
     * Active recovery cardio (e.g. 30-min zone-2 brisk incline walk, light cycling, or recovery swim).
     * 3 specific mobility & joint decompression drills (with name, duration, and purpose).
     * Hydration & nutrition recovery strategy (electrolyte replenishment, protein synthesis timing).
     * Sleep & CNS decompression protocol (parasympathetic breathwork, sleep hygiene, tissue recovery).
4. Strictly respect available equipment (${profile.equipment}) and any physical injuries/restrictions (${profile.injuriesRestrictions}).
5. Provide scientific nutrition targets: calculate realistic daily calories & macro distribution for their goal (${profile.fitnessGoal}), 4 structured delicious sample meals fitting their diet (${profile.dietaryPreference}), and evidence-based supplements (creatine, whey, omega 3, etc.).
6. Provide actionable progressive overload protocols and deload guidelines.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are Fitbuddy, a world-class certified fitness trainer and nutrition scientist. You produce structured, safe, science-backed workout and nutrition plans.',
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: fitnessPlanResponseSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response received from Gemini model');
    }

    const parsedPlan = JSON.parse(responseText);
    const planWithMetadata = {
      ...parsedPlan,
      id: 'plan_' + Date.now(),
      createdAt: new Date().toISOString(),
      userProfile: profile,
    };

    return res.json(planWithMetadata);
  } catch (error: any) {
    console.error('Error generating fitness plan:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate fitness plan. Please try again.',
    });
  }
});

// API: Modify Plan with User Feedback
app.post('/api/modify-plan', async (req, res) => {
  try {
    const { originalPlan, feedback, quickOptions } = req.body;
    if (!originalPlan || !feedback) {
      return res.status(400).json({ error: 'Original plan and user feedback are required' });
    }

    const currentScheduleSummary = originalPlan.weeklySchedule
      .map(
        (d: any) =>
          `Day ${d.dayNumber} [${d.isRestDay ? 'REST/RECOVERY' : 'WORKOUT'}]: ${d.dayName} - Focus: ${d.focus} (${d.isRestDay ? 'Active rest' : d.exercises.length + ' exercises, ~' + d.estimatedMinutes + ' min'})`
      )
      .join('\n');

    const prompt = `You are Fitbuddy, an elite sports scientist and strength coach.
The user wants to refine and update their current 7-day fitness plan based on specific feedback.

CURRENT PLAN:
- Plan Title: "${originalPlan.planTitle}"
- Difficulty / Split: ${originalPlan.difficulty} / ${originalPlan.splitType}
- Goal: ${originalPlan.userProfile?.fitnessGoal || 'General Hypertrophy'}
- Equipment: ${originalPlan.userProfile?.equipment || 'Standard'}
- Current Schedule:
${currentScheduleSummary}

USER'S FEEDBACK & REQUESTED CHANGES:
"${feedback}"
${quickOptions ? `Active options: ${JSON.stringify(quickOptions)}` : ''}

INSTRUCTIONS FOR THE UPDATED PLAN:
1. Update the 7-day schedule to directly implement the user's feedback:
   - If they requested MORE CARDIO: Add high-intensity interval training (HIIT) finishers (e.g. assault bike, rower, or kettlebell intervals) or dedicated Zone-2 cardiovascular sessions / active recovery walks.
   - If they requested ADDITIONAL REST DAYS: Convert one or more training days into structured active recovery & mobility days (isRestDay: true) with active recovery cardio and mobility drills.
   - If they requested SHORTER WORKOUTS: Streamline exercises to 3-4 dense compound supersets and reduce session duration.
   - If they requested LESS JOINT STRESS / SORENESS FIXES: Substitute shearing movements (e.g. heavy barbell squats or behind-the-neck presses) with joint-friendly alternatives (e.g. goblet squats, chest-supported rows, cables).
   - If they requested MORE CORE / ABS / SPECIFIC MUSCLE: Add dedicated abdominal and core stabilization movements.
2. Retain the successful baseline of the original plan while re-balancing weekly training volume and fatigue.
3. Every training day must have complete warmups, exercises (with sets, reps, rest seconds, RPE, tempo, form cues, mistakes to avoid), and cooldowns.
4. Every rest/recovery day must have a complete recoveryGuidance object (activeRecoveryCardio, mobilityDrills, hydrationAndNutritionTip, sleepAndCNSGuidance).
5. In 'feedbackApplied', summarize the exact modifications in 1 clear sentence (e.g., "Added 15-minute Zone-2 cardio finishers to Day 1 & 4 and converted Day 5 into a restorative mobility rest day.").
6. In 'coachAdvice', provide 2-3 specific coaching tips regarding their adjustments.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are Fitbuddy, an elite sports scientist and strength & conditioning coach. You modify existing fitness plans based on user feedback while ensuring safe, evidence-based periodization.',
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: fitnessPlanResponseSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response received from Gemini model');
    }

    const parsedPlan = JSON.parse(responseText);
    const updatedPlan = {
      ...parsedPlan,
      id: 'plan_' + Date.now(),
      createdAt: new Date().toISOString(),
      parentPlanId: originalPlan.id,
      version: (originalPlan.version || 1) + 1,
      userProfile: originalPlan.userProfile,
      feedbackApplied: parsedPlan.feedbackApplied || feedback,
    };

    return res.json(updatedPlan);
  } catch (error: any) {
    console.error('Error modifying plan with feedback:', error);
    return res.status(500).json({
      error: error.message || 'Failed to update plan with feedback. Please try again.',
    });
  }
});

// API: Substitute Exercise
app.post('/api/substitute-exercise', async (req, res) => {
  try {
    const { exercise, reason, equipmentAvailable } = req.body;
    if (!exercise) {
      return res.status(400).json({ error: 'Exercise data is required' });
    }

    const prompt = `The user needs an immediate alternative for this exercise in their workout:
Exercise: ${JSON.stringify(exercise)}
Reason for substitution: ${reason || 'Equipment occupied or personal preference'}
Available Equipment: ${equipmentAvailable || 'Standard gym or dumbbells'}

Provide an equivalent, biomechanically sound substitute that targets the exact same primary muscle (${exercise.targetMuscle}) without exacerbating any joint stress.
Return ONLY valid JSON matching this structure:
{
  "id": "${exercise.id}_sub",
  "name": "Alternative Exercise Name",
  "targetMuscle": "${exercise.targetMuscle}",
  "secondaryMuscles": ["..."],
  "equipment": "...",
  "sets": ${exercise.sets},
  "reps": "${exercise.reps}",
  "restSeconds": ${exercise.restSeconds},
  "rpe": ${exercise.rpe},
  "tempo": "${exercise.tempo || '2-0-1-0'}",
  "formCues": ["cue 1", "cue 2"],
  "mistakesToAvoid": ["mistake 1", "mistake 2"],
  "substitutionAlternative": "${exercise.name}",
  "reasonForSelection": "Why this works as a direct replacement"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert exercise kinesiologist and trainer.',
        responseMimeType: 'application/json',
      },
    });

    const substituted = JSON.parse(response.text || '{}');
    return res.json(substituted);
  } catch (error: any) {
    console.error('Error substituting exercise:', error);
    return res.status(500).json({ error: error.message || 'Failed to substitute exercise' });
  }
});

// API: Ask Fitbuddy Coach
app.post('/api/ask-coach', async (req, res) => {
  try {
    const { message, plan, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const planSummary = plan
      ? `Active Plan: "${plan.planTitle}" (${plan.difficulty}, ${plan.splitType}). Goal: ${plan.userProfile?.fitnessGoal || 'General'}. Equipment: ${plan.userProfile?.equipment || 'Any'}. Restrictions: ${plan.userProfile?.injuriesRestrictions || 'None'}. Daily Calories: ${plan.nutrition?.targetDailyCalories} kcal.`
      : 'No active plan loaded yet.';

    const systemInstruction = `You are Coach Buddy, the resident AI strength coach and sports nutritionist for Fitbuddy.
Context:
${planSummary}

Guidelines:
1. Deliver concise, actionable, evidence-based training and nutrition advice.
2. Keep answers motivating, friendly, and practical (avoid excessive jargon, but cite proper biomechanics).
3. If they ask about changing workouts, modifying rest periods, warm-ups, or nutrition tweaks, give specific recommendations tailored to their active plan.
4. Keep answers under 250 words unless in-depth breakdown is explicitly asked.`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `User Question: ${message}` }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in coach chat:', error);
    return res.status(500).json({ error: error.message || 'Failed to answer question' });
  }
});

// Server configuration & static serving
const PORT = process.env.PORT || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Fitbuddy server running on port ${PORT}`);
  });
}

startServer();
