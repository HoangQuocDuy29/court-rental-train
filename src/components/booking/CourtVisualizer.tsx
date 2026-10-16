import React from 'react';
import { ShieldCheck, Sparkles, Award } from 'lucide-react';

export const CourtVisualizer: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Sơ đồ mặt bằng thi đấu
          </span>
          <h4 className="text-base font-bold text-white">Sân Chuẩn Thi Đấu FIVB (18m x 9m)</h4>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Taraflex Sport M 7mm</span>
        </div>
      </div>

      {/* SVG Volleyball Court */}
      <div className="relative w-full aspect-[2/1] bg-gradient-to-r from-orange-600/90 via-amber-600/90 to-orange-600/90 rounded-2xl p-4 shadow-inner flex items-center justify-center overflow-hidden border-2 border-orange-400/30">
        {/* Surrounding free zone */}
        <div className="absolute inset-2 border-2 border-dashed border-amber-300/40 rounded-xl pointer-events-none" />

        {/* The 18m x 9m Court */}
        <div className="relative w-4/5 h-4/5 bg-amber-500/90 rounded-lg border-2 border-white shadow-2xl flex">
          {/* Left Team Half (9m x 9m) */}
          <div className="relative w-1/2 h-full border-r-2 border-white flex items-center justify-center">
            {/* 3m Attack Line (Vạch 3m) */}
            <div className="absolute right-1/3 top-0 bottom-0 w-0.5 border-r border-dashed border-white" />
            <span className="absolute left-3 top-3 text-[10px] font-bold text-slate-900 bg-white/70 px-1.5 rounded">
              Khu Hàng Sau (Back-row)
            </span>
            <span className="text-[11px] font-extrabold text-slate-950 uppercase tracking-wider opacity-80">
              Đội Nhà (Team A)
            </span>
            <span className="absolute right-3 bottom-3 text-[10px] font-bold text-slate-900 bg-white/70 px-1.5 rounded">
              Vạch 3m Tấn Công
            </span>
          </div>

          {/* Center Net (Lưới & Cột Anten) */}
          <div className="absolute left-1/2 -top-3 -bottom-3 -translate-x-1/2 w-1.5 bg-slate-950 shadow-lg flex flex-col justify-between items-center z-10">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-md ring-2 ring-white" title="Anten Lưới" />
            <div className="w-0.5 h-full bg-slate-200 border-x border-slate-900" />
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-md ring-2 ring-white" title="Anten Lưới" />
          </div>

          {/* Right Team Half (9m x 9m) */}
          <div className="relative w-1/2 h-full flex items-center justify-center">
            {/* 3m Attack Line (Vạch 3m) */}
            <div className="absolute left-1/3 top-0 bottom-0 w-0.5 border-r border-dashed border-white" />
            <span className="text-[11px] font-extrabold text-slate-950 uppercase tracking-wider opacity-80">
              Đội Khách (Team B)
            </span>
            <span className="absolute left-3 top-3 text-[10px] font-bold text-slate-900 bg-white/70 px-1.5 rounded">
              Vạch 3m Tấn Công
            </span>
            <span className="absolute right-3 bottom-3 text-[10px] font-bold text-slate-900 bg-white/70 px-1.5 rounded">
              Khu Phát Bóng
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-400 pt-1">
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-white font-bold block text-sm">2.43m / 2.24m</span>
          <span>Chiều cao lưới Nam / Nữ</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-amber-400 font-bold block text-sm">10.5m</span>
          <span>Độ cao trần thông thủy</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-sky-400 font-bold block text-sm">850 Lux</span>
          <span>Ánh sáng chuẩn phát sóng</span>
        </div>
      </div>
    </div>
  );
};
