import React from 'react';
import { useLocation, Link, Outlet, Routes, Route, Navigate } from 'react-router-dom';
import { Calendar, CheckCircle2, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import { SlotPicker } from '../components/booking/SlotPicker';
import { BookingCheckout } from '../components/booking/BookingCheckout';
import { BookingConfirmation } from '../components/booking/BookingConfirmation';
import { useBooking } from '../context/BookingContext';

export const CourtBookingPage: React.FC = () => {
  const location = useLocation();
  const { selectedSlots, isDurationValid, activeBooking } = useBooking();

  const steps = [
    {
      step: 1,
      label: 'Chọn ngày & ca sân',
      path: '/court-booking/slots',
      icon: Calendar,
      isCompleted: selectedSlots.length > 0 && isDurationValid,
      isActive: location.pathname.includes('/slots') || location.pathname === '/court-booking',
    },
    {
      step: 2,
      label: 'Dịch vụ & Người đặt',
      path: '/court-booking/checkout',
      icon: CreditCard,
      isCompleted: Boolean(activeBooking),
      isActive: location.pathname.includes('/checkout'),
    },
    {
      step: 3,
      label: 'Thanh toán VietQR & Vé',
      path: '/court-booking/confirmation',
      icon: CheckCircle2,
      isCompleted: false,
      isActive: location.pathname.includes('/confirmation'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ĐẶT SÂN THI ĐẤU TRONG NHÀ CHUẨN FIVB</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Lịch Sân Trống & Đặt Ca Thi Đấu
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Giá tiêu chuẩn: <strong className="text-white">550.000₫ / giờ</strong> (Tối thiểu 1.5 giờ)
          • <span className="text-emerald-400 font-medium">Tặng miễn phí 01 bóng Mikasa V200W</span>
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2 rounded-2xl bg-slate-900 border border-slate-800">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-all ${
                  s.isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : s.isCompleted
                    ? 'text-emerald-400 bg-slate-950/60'
                    : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    s.isActive
                      ? 'bg-slate-950 text-amber-400'
                      : s.isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {s.isCompleted ? '✓' : s.step}
                </div>
                <div className="min-w-0">
                  <span className="hidden sm:block text-[10px] uppercase tracking-wider opacity-75">
                    Bước {s.step}
                  </span>
                  <span className="text-xs font-bold truncate block">{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nested Route Outlet / Content */}
      <Routes>
        <Route index element={<Navigate to="slots" replace />} />
        <Route path="slots" element={<SlotPicker />} />
        <Route path="checkout" element={<BookingCheckout />} />
        <Route path="confirmation" element={<BookingConfirmation />} />
        <Route path="*" element={<Navigate to="slots" replace />} />
      </Routes>
    </div>
  );
};
