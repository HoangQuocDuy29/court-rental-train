import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Lock,
  Unlock,
  Check,
  ShieldCheck,
  LogOut,
  KeyRound,
} from 'lucide-react';
import { useBooking, getTodayDateString, formatDateVietnamese } from '../../context/BookingContext';
import { BASE_PRICE_PER_HOUR, COURTS, MIN_DURATION_HOURS } from '../../data/mockData';

export const SlotPicker: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedDate,
    setSelectedDate,
    getDynamicDays,
    selectedCourtId,
    setSelectedCourtId,
    allSlots,
    selectedSlots,
    toggleSlotSelection,
    clearSelectedSlots,
    totalDurationHours,
    isDurationValid,
    courtSubtotal,
    freeBonus,
    isAdminAuthenticated,
    isAdminMode,
    setIsAdminMode,
    toggleAdminLockSlot,
    setIsAuthModalOpen,
    logoutAdmin,
  } = useBooking();

  const dynamicDays = getDynamicDays();
  const todayStr = getTodayDateString();

  // Filter slots for the active court
  const courtSlots = allSlots.filter((s) => s.courtId === selectedCourtId);
  const activeCourt = COURTS.find((c) => c.id === selectedCourtId) || COURTS[0];

  return (
    <div className="space-y-8">
      {/* 
        ADMIN CONTROL BAR:
        STRICTLY VISIBLE ONLY WHEN OWNER HAS AUTHENTICATED VIA PIN!
        Regular customers will NEVER see this bar or be able to toggle court states.
      */}
      {isAdminAuthenticated && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-500/60 shadow-xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-amber-400 uppercase tracking-wider text-xs">
                  BẢNG ĐIỀU KHIỂN CHỦ SÂN DVA
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  Đã xác thực bảo mật
                </span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Nhấp chuột vào bất kỳ ca nào bên dưới để chuyển đổi ngay lập tức giữa{' '}
                <strong className="text-white">"Còn trống"</strong> và{' '}
                <strong className="text-amber-400">"Đã khóa / Đã đặt"</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-2 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Đổi mã PIN</span>
            </button>

            <button
              type="button"
              onClick={logoutAdmin}
              className="px-3.5 py-2 rounded-xl font-bold bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất Admin</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. Date & Court Control Panel */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          {/* Dynamic 7-day selector starting strictly from today */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-400" />
                1. Chọn ngày thi đấu:
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {dynamicDays.map((item) => (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedDate === item.dateStr
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700'
                  }`}
                >
                  <span className="block font-bold">{item.label}</span>
                  <span className="block text-[10px] opacity-80 font-normal">
                    {item.dayOfWeek}
                  </span>
                </button>
              ))}

              {/* Custom Date Input for dates further ahead */}
              <div className="relative flex items-center">
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  title="Chọn ngày khác trong tương lai"
                />
              </div>
            </div>
          </div>

          {/* Pricing Highlight */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-lg">
              DVA
            </div>
            <div>
              <p className="text-xs text-slate-400">Giá thuê tiêu chuẩn</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-white">550.000₫</span>
                <span className="text-xs text-slate-400 font-normal">/ 1 giờ</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">
                Tối thiểu 1.5 giờ • Tặng kèm 1 bóng Mikasa V200W
              </p>
            </div>
          </div>
        </div>

        {/* 2. Court Selector Tabs */}
        <div className="pt-6 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            2. Chọn sân thi đấu:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COURTS.map((court) => {
              const isSelected = selectedCourtId === court.id;
              return (
                <button
                  key={court.id}
                  type="button"
                  onClick={() => setSelectedCourtId(court.id)}
                  className={`p-4 rounded-2xl text-left transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-br from-slate-900 to-slate-800/90 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20'
                      : 'bg-slate-950/50 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-base text-white">{court.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${court.badgeColor}`}
                    >
                      {court.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {court.flooring}
                  </p>
                  <p className="text-xs text-slate-500">
                    Trần cao {court.ceilingHeight} • {court.lighting}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Slot Status Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-800 border border-slate-700 inline-block" />
            <span>Trống (Có thể đặt)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-500 text-slate-950 inline-flex items-center justify-center font-bold text-[9px]">
              ✓
            </span>
            <span className="text-amber-400 font-medium">Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-900 border border-red-950/80 text-red-400 inline-block opacity-60" />
            <span className="text-slate-500 line-through">Đã có người đặt (Đã chốt)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
          <Flame className="w-3.5 h-3.5" />
          <span>Giờ cao điểm buổi tối</span>
        </div>
      </div>

      {/* 4. Interactive Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {courtSlots.map((slot) => {
          const isSelected = selectedSlots.some((s) => s.id === slot.id);
          const isBooked = slot.status === 'booked';
          const slotPrice = (slot.durationHours * BASE_PRICE_PER_HOUR).toLocaleString('vi-VN');

          return (
            <div
              key={slot.id}
              onClick={() => toggleSlotSelection(slot)}
              className={`relative p-5 rounded-2xl transition-all select-none ${
                isAdminAuthenticated
                  ? isBooked
                    ? 'bg-red-950/25 border-2 border-red-500/70 cursor-pointer hover:bg-red-900/30'
                    : 'bg-slate-900/90 border-2 border-emerald-500/50 cursor-pointer hover:bg-emerald-950/20'
                  : isBooked
                  ? 'bg-slate-900/40 border border-slate-800/40 opacity-50 cursor-not-allowed'
                  : isSelected
                  ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/10 border-2 border-amber-400 shadow-lg shadow-amber-500/15 cursor-pointer -translate-y-0.5'
                  : 'bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 cursor-pointer shadow-md'
              }`}
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950'
                        : isBooked
                        ? 'bg-slate-800 text-slate-500'
                        : 'bg-slate-800 text-sky-400'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {slot.durationHours === 1.5 ? 'Ca 90 phút' : `${slot.durationHours} giờ`}
                  </span>
                </div>

                {slot.isPeakHour && (
                  <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Hot
                  </span>
                )}
              </div>

              {/* Time Range */}
              <div className="mb-3">
                <div className="text-xl font-black text-white tracking-tight">
                  {slot.startTime} - {slot.endTime}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {slot.courtName.split(' - ')[0]}
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div>
                  <span className="text-sm font-bold text-amber-400">{slotPrice}₫</span>
                </div>

                {/* Only Authenticated Owner sees Lock/Unlock controls */}
                {isAdminAuthenticated ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAdminLockSlot(slot.id);
                    }}
                    className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                      isBooked
                        ? 'bg-red-500 hover:bg-red-400 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    }`}
                  >
                    {isBooked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{isBooked ? 'Đã khóa (Mở lại)' : 'Đang mở (Khóa ca)'}</span>
                  </button>
                ) : isBooked ? (
                  <span className="text-xs font-semibold text-slate-500 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                    Đã đặt
                  </span>
                ) : isSelected ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-bold bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Đang chọn
                  </button>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 px-3 py-1.5 rounded-lg transition-colors border border-slate-700 hover:border-transparent"
                  >
                    Đặt sân
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Sticky Bottom Control Bar when slots are selected (for customers) */}
      {selectedSlots.length > 0 && !isAdminAuthenticated && (
        <div className="sticky bottom-4 z-30 p-5 rounded-3xl bg-slate-950/95 border-2 border-amber-500/80 shadow-2xl backdrop-blur-2xl transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  Đã chọn {selectedSlots.length} ca thi đấu:
                </span>
                <span className="text-sm font-extrabold text-white">
                  {selectedSlots.map((s) => `${s.startTime}-${s.endTime}`).join(', ')}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span>
                  Tổng thời lượng:{' '}
                  <strong className={isDurationValid ? 'text-emerald-400' : 'text-amber-400'}>
                    {totalDurationHours} giờ
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Tiền sân: <strong className="text-white text-sm">{courtSubtotal.toLocaleString('vi-VN')}₫</strong>
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {freeBonus}
                </span>
              </div>

              {/* Minimum 1.5h validation warning */}
              {!isDurationValid && (
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 mt-1">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Quy định DVA Volleyball: Thời gian đặt sân tối thiểu là {MIN_DURATION_HOURS} giờ (90 phút).
                    Vui lòng chọn thêm khung giờ liền kề.
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearSelectedSlots}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800"
              >
                Hủy chọn
              </button>

              <button
                type="button"
                disabled={!isDurationValid}
                onClick={() => navigate('/court-booking/checkout')}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-xl transition-all ${
                  isDurationValid
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:from-amber-300 hover:to-orange-400 shadow-amber-500/20 hover:scale-[1.02]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <span>Tiếp tục chọn dịch vụ & Thanh toán</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discreet link for owner to authenticate if not yet logged in */}
      {!isAdminAuthenticated && (
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
          >
            <Lock className="w-3 h-3" />
            <span>Khu vực Ban Quản Lý Sân</span>
          </button>
        </div>
      )}
    </div>
  );
};
