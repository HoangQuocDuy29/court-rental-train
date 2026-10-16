import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Users,
  FileText,
  Gift,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useBooking, formatDateVietnamese } from '../../context/BookingContext';
import { AddonSelector } from './AddonSelector';

export const BookingCheckout: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedSlots,
    selectedDate,
    selectedCourtId,
    totalDurationHours,
    isDurationValid,
    courtSubtotal,
    selectedAddons,
    addonsSubtotal,
    grandTotal,
    freeBonus,
    customerInfo,
    setCustomerInfo,
    submitBooking,
    isSubmitting,
  } = useBooking();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // If user navigated directly here without valid slots, prompt to select
  if (selectedSlots.length === 0 || !isDurationValid) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Chưa chọn khung giờ thi đấu</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Vui lòng chọn ít nhất 1.5 giờ (90 phút) để tiếp tục quy trình đặt sân và nhận ưu đãi bóng thi đấu Mikasa V200W.
        </p>
        <button
          onClick={() => navigate('/court-booking/slots')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại chọn khung giờ
        </button>
      </div>
    );
  }

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!customerInfo.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên';
    }
    if (!customerInfo.phoneNumber.trim()) {
      errors.phoneNumber = 'Vui lòng nhập số điện thoại liên hệ';
    } else if (!/^[0-9]{9,11}$/.test(customerInfo.phoneNumber.replace(/[\s.-]/g, ''))) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ (9-11 chữ số)';
    }

    // Customer Gmail is explicitly required for ticket confirmation
    if (!customerInfo.email.trim()) {
      errors.email = 'Vui lòng nhập Gmail để nhận vé điện tử và xác nhận ca đặt';
    } else if (!customerInfo.email.includes('@')) {
      errors.email = 'Địa chỉ email không hợp lệ';
    }

    // Instagram handle or 'Không có'
    if (!customerInfo.instagram || !customerInfo.instagram.trim()) {
      errors.instagram = 'Vui lòng nhập tài khoản Instagram hoặc bấm "Tôi không có IG"';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await submitBooking();
    if (result) {
      navigate('/court-booking/confirmation');
    }
  };

  const sortedSlots = [...selectedSlots].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const startTime = sortedSlots[0]?.startTime;
  const endTime = sortedSlots[sortedSlots.length - 1]?.endTime;
  const courtName = sortedSlots[0]?.courtName;

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb / Stepper */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          type="button"
          onClick={() => navigate('/court-booking/slots')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại chọn giờ khác</span>
        </button>
        <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
          <span>Bước 2 / 3: Dịch vụ & Thông tin người đặt</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Add-ons */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Customer Contact Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              Thông tin người đại diện đặt sân
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Vé điện tử và mã QR check-in vào sân sẽ được gửi ngay qua số điện thoại và Gmail của bạn.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Họ và tên <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={customerInfo.fullName}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      className={`w-full px-4 py-3 rounded-xl bg-slate-800/80 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                        formErrors.fullName
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-slate-700 focus:border-amber-400 focus:ring-amber-400/20'
                      }`}
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Số điện thoại (Zalo) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="0988 776 655"
                      value={customerInfo.phoneNumber}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, phoneNumber: e.target.value }))
                      }
                      className={`w-full px-4 py-3 rounded-xl bg-slate-800/80 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                        formErrors.phoneNumber
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-slate-700 focus:border-amber-400 focus:ring-amber-400/20'
                      }`}
                    />
                  </div>
                  {formErrors.phoneNumber && (
                    <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gmail (Required) */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Customer Gmail <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className={`w-full px-4 py-3 rounded-xl bg-slate-800/80 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                        formErrors.email
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-slate-700 focus:border-amber-400 focus:ring-amber-400/20'
                      }`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Instagram Handle with quick 'Không có' button */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-300">
                      Tài khoản Instagram <span className="text-amber-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          instagram: prev.instagram === 'Không có' ? '' : 'Không có',
                        }))
                      }
                      className="text-[11px] font-semibold text-amber-400 hover:underline"
                    >
                      {customerInfo.instagram === 'Không có' ? 'Nhập lại IG' : 'Tôi không có IG'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ví dụ: @dvavolleyball hoặc điền 'Không có'"
                      value={customerInfo.instagram}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, instagram: e.target.value }))
                      }
                      className={`w-full px-4 py-3 rounded-xl bg-slate-800/80 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                        formErrors.instagram
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-slate-700 focus:border-amber-400 focus:ring-amber-400/20'
                      }`}
                    />
                  </div>
                  {formErrors.instagram && (
                    <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.instagram}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500 mt-1">
                    * Giúp DVA tag clip highlight, gửi thông báo DM hoặc kết nối giao lưu nhanh.
                  </p>
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-300">
                  Kênh bạn muốn DVA liên hệ phản hồi xác nhận ca nhanh nhất:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'zalo', label: 'Zalo (Ưu tiên)' },
                    { id: 'phone', label: 'Gọi điện thoại' },
                    { id: 'email', label: 'Email' },
                    { id: 'instagram', label: 'Instagram DM' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          preferredContactMethod: method.id as any,
                        }))
                      }
                      className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                        customerInfo.preferredContactMethod === method.id
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Information & Court Preparation Setup */}
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                  Thông tin chuẩn bị sân trước giờ đấu:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Team / Club Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Tên CLB / Đội bóng (Hiển thị bảng điểm)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Saigon Spikers Team"
                      value={customerInfo.clubTeamName || ''}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, clubTeamName: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Estimated players count */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Số lượng người dự kiến tham gia
                    </label>
                    <select
                      value={customerInfo.estimatedPlayers || '10 - 14 người'}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, estimatedPlayers: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="Dưới 8 người">Dưới 8 người</option>
                      <option value="8 - 12 người">8 - 12 người</option>
                      <option value="12 - 16 người">12 - 16 người (2 team tiêu chuẩn)</option>
                      <option value="Trên 16 người">Trên 16 người (Giao lưu nhiều đội)</option>
                    </select>
                  </div>
                </div>

                {/* Net Height Requirement (Crucial for volleyball!) */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Chiều cao lưới yêu cầu căn chỉnh sẵn:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'nam_2.43m', label: 'Lưới Nam (2.43m chuẩn FIVB)' },
                      { id: 'nu_2.24m', label: 'Lưới Nữ (2.24m chuẩn FIVB)' },
                      { id: 'hon_hop_2.35m', label: 'Nam Nữ phối hợp (2.35m)' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            netHeightRequirement: opt.id as any,
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          customerInfo.netHeightRequirement === opt.id
                            ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Special Note */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Ghi chú & Yêu cầu riêng
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Hạ chiều cao lưới 2.24m cho giải nữ, cần bật quạt công nghiệp trước 15 phút, mượn còi bấm..."
                  value={customerInfo.note || ''}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({ ...prev, note: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 resize-none"
                />
              </div>
            </form>
          </div>

          {/* Section 2: Add-on Services (Upsell Options) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-sky-400" />
                  Dịch vụ gia tăng & Đồ uống ướp lạnh
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Chuẩn bị sẵn sàng trong sân trước giờ bóng lăn để đội bạn chỉ việc thi đấu.
                </p>
              </div>
            </div>

            <AddonSelector />
          </div>
        </div>

        {/* Right Column: Live Order Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-28 p-6 sm:p-7 rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                Tóm tắt đơn đặt sân
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">Chi tiết thanh toán</h3>
            </div>

            {/* Session Info */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Ngày thi đấu:
                </span>
                <strong className="text-white font-semibold">
                  {formatDateVietnamese(selectedDate)}
                </strong>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-4 h-4 text-sky-400" />
                  Khung giờ:
                </span>
                <strong className="text-white font-bold text-sm">
                  {startTime} - {endTime} ({totalDurationHours} giờ)
                </strong>
              </div>

              <div className="flex items-start justify-between text-slate-300 pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">Sân chọn:</span>
                <span className="text-right font-medium text-slate-200">{courtName}</span>
              </div>
            </div>

            {/* Included Bonus Free Ball Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Gift className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-emerald-400 block mb-0.5">Quà tặng đi kèm ca chơi:</span>
                <p className="text-slate-300 leading-relaxed">{freeBonus}</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>
                  Tiền thuê sân ({totalDurationHours} giờ x 550.000₫):
                </span>
                <span className="font-bold text-white text-sm">
                  {courtSubtotal.toLocaleString('vi-VN')}₫
                </span>
              </div>

              {/* Selected Add-ons List */}
              {selectedAddons.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <span className="text-slate-400 font-semibold block">Dịch vụ đi kèm:</span>
                  {selectedAddons.map((addon) => (
                    <div
                      key={addon.addonId}
                      className="flex items-center justify-between text-slate-400 pl-2"
                    >
                      <span className="truncate pr-2">
                        • {addon.name} <strong className="text-slate-300">x{addon.quantity}</strong>
                      </span>
                      <span className="text-slate-200 font-medium whitespace-nowrap">
                        {(addon.quantity * addon.unitPrice).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-slate-300 pt-1 font-semibold">
                    <span>Tổng tiền dịch vụ:</span>
                    <span>{addonsSubtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              )}

              {/* Grand Total */}
              <div className="pt-4 border-t-2 border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                    Tổng thanh toán:
                  </span>
                  <p className="text-[11px] text-emerald-400">Chuyển khoản VietQR hoặc tại quầy</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400">
                    {grandTotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang xử lý & Tạo mã VietQR...</span>
                </>
              ) : (
                <>
                  <span>Xác nhận & Mở mã thanh toán VietQR</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Hệ thống tự động đồng bộ Google Sheets & Giữ sân 15 phút</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
