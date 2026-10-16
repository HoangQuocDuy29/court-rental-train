import React from 'react';
import {
  Star,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';
import { Coach } from '../../types';

interface CoachCardProps {
  coach: Coach;
  onBookCoach: (coach: Coach) => void;
}

export const CoachCard: React.FC<CoachCardProps> = ({ coach, onBookCoach }) => {
  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl p-6 sm:p-7 flex flex-col justify-between transition-all group">
      <div className="space-y-5">
        {/* Coach Header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={coach.avatar}
              alt={coach.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/50 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span>{coach.rating}</span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold text-lg text-white group-hover:text-amber-400 transition-colors">
              {coach.name}
            </h3>
            <p className="text-xs text-amber-400/90 font-medium">{coach.title}</p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <span>{coach.experienceYears} năm kinh nghiệm</span>
              <span>•</span>
              <span>{coach.reviewCount} lượt đánh giá 5★</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {coach.bio}
        </p>

        {/* Specialties */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
            Thế mạnh đào tạo:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {coach.specialties.map((spec) => (
              <span
                key={spec}
                className="text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-lg"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Achievements list */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-400" />
            Thành tích & Bằng cấp:
          </span>
          {coach.achievements.map((ach, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
              <span className="text-amber-400 font-bold">•</span>
              <span>{ach}</span>
            </div>
          ))}
        </div>

        {/* Available Schedule tags */}
        <div className="text-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Lịch huấn luyện định kỳ:
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>{coach.availableDays.join(', ')}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-300">
            <Clock className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <span>{coach.availableTimeSlots.slice(0, 2).join(' | ')}</span>
          </div>
        </div>
      </div>

      {/* Pricing & Booking action */}
      <div className="pt-5 border-t border-slate-800 mt-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">
              1 kèm 1: <strong className="text-amber-400 text-sm">{(coach.hourlyRate1on1 * 1.5).toLocaleString('vi-VN')}₫</strong> / 90p
            </div>
            <div className="text-[10px] text-slate-500">
              Nhóm 2-4: {((coach.hourlyRateGroup * 1.5) / 2).toLocaleString('vi-VN')}₫ / người
            </div>
          </div>

          <button
            type="button"
            onClick={() => onBookCoach(coach)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-100 transition-all"
          >
            <span>Đặt lịch HLV</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
