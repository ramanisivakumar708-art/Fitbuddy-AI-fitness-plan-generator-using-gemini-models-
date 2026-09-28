import React from 'react';
import { Sparkles, Activity, Target, Zap, ShieldCheck } from 'lucide-react';
import { STARTER_PRESETS } from '../data/starterTemplates';
import { UserProfile } from '../types/fitness';

interface HeroBannerProps {
  onOpenGenerator: () => void;
  onSelectPreset: (profile: UserProfile, title: string) => void;
  planTitle?: string;
  splitType?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenGenerator,
  onSelectPreset,
  planTitle,
  splitType,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 mb-8">
      {/* Background image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_fitness_studio_1790575695048.jpg"
          alt="Modern minimalist fitness studio"
          className="w-full h-full object-cover object-center opacity-25 filter brightness-75 contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-4xl">
        {/* Anti-slop metadata line */}
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-3 tracking-wide">
          <Activity className="w-3.5 h-3.5" />
          <span>Biomechanical Periodization</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Gemini 3.8 Intelligence</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Hypertrophy & Macro Science</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mb-4">
          Personalized Fitness Architecture, Engineered for You.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-6">
          Generate custom workout splits, progressive overload protocols, exercise video cues,
          and macro-balanced nutrition tailored to your equipment, schedule, and biomechanics.
        </p>

        {/* Primary CTA and quick action */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Custom Plan</span>
          </button>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Adapts for joint limits, schedule & diet</span>
          </div>
        </div>

        {/* Quick starter presets */}
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick Start Evidence-Based Blueprints
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STARTER_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPreset(preset.profile, preset.title)}
                className="text-left p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all group"
              >
                <div className="text-[11px] font-semibold text-emerald-400 mb-1 flex items-center justify-between">
                  <span>{preset.badge}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{preset.profile.daysPerWeek}d/wk</span>
                </div>
                <div className="text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-1 mb-1">
                  {preset.title}
                </div>
                <div className="text-xs text-slate-400 line-clamp-2 leading-snug">
                  {preset.tagline}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
