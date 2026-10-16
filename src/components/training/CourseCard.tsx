import React from 'react';
import {
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Target,
  ShieldCheck,
} from 'lucide-react';
import { TrainingPackage } from '../../types';

interface CourseCardProps {
  pkg: TrainingPackage;
  onRegister: (pkg: TrainingPackage) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ pkg, onRegister }) => {
  return (
    <div
      className={`rounded-3xl border flex flex-col justify-between transition-all group overflow-hidden ${
        pkg.popular
          ? 'bg-gradient-to-b from-slate-900 to-slate-900/90 border-amber-500/50 shadow-xl shadow-amber-500/10'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-lg'
      }`}
    >
      <div className="p-6 sm:p-7 space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          {pkg.badge && (
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {pkg.badge}
            </span>
          )}
          <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>{pkg.targetAudience}</span>
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-extrabold text-xl text-white group-hover:text-amber-400 transition-colors leading-snug">
            {pkg.title}
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {pkg.description}
          </p>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Quyền lợi bao gồm:
          </span>
          {pkg.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Schedule */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-[11px]">{pkg.schedule}</span>
        </div>
      </div>

      {/* Card Footer with Price and Register Button */}
      <div className="p-6 sm:p-7 pt-0 border-t border-slate-800 mt-4">
        <div className="flex items-baseline justify-between py-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Mức phí:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-amber-400">
                {pkg.unitPrice.toLocaleString('vi-VN')}₫
              </span>
              <span className="text-xs text-slate-400">/ {pkg.unitLabel}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRegister(pkg)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-100 transition-all"
          >
            <span>Đăng ký</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
