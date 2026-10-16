import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  Copy,
  Check,
  QrCode,
  Calendar,
  User,
  Phone,
  Mail,
  Gift,
  Home,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { useBooking, formatDateVietnamese } from '../../context/BookingContext';
import { DVA_CONTACT_INFO } from '../../data/mockData';

export const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeBooking,
    getVietQrUrl,
    bankConfig,
    confirmUserHasTransferred,
    resetBooking,
  } = useBooking();

  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [isSubmittedNotice, setIsSubmittedNotice] = useState(false);

  // If no active booking in context, redirect to slots
  if (!activeBooking) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
          <QrCode className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Chưa có thông tin đơn đặt sân</h2>
        <p className="text-sm text-slate-400">
          Bạn chưa chọn ca sân hoặc phiên làm việc đã kết thúc.
        </p>
        <button
          onClick={() => navigate('/court-booking/slots')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
        >
          Đặt sân ngay bây giờ
        </button>
      </div>
    );
  }

  const transferContent = activeBooking.transferSyntax;
  const qrUrl = getVietQrUrl(activeBooking.grandTotal, transferContent);

  const copyToClipboard = (text: string, type: 'account' | 'content') => {
    navigator.clipboard.writeText(text);
    if (type === 'account') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    }
  };

  const handleUserConfirmTransfer = () => {
    confirmUserHasTransferred();
    setIsSubmittedNotice(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner Status: Reflects true pending verification state */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl backdrop-blur-md transition-all ${
          isSubmittedNotice
            ? 'bg-sky-950/40 border-sky-500/60'
            : 'bg-slate-900/90 border-amber-500/50'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isSubmittedNotice
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}
            >
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
                  Mã đặt sân: #{activeBooking.bookingCode}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    isSubmittedNotice
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {isSubmittedNotice
                    ? 'Đang chờ DVA đối soát số dư'
                    : 'Chờ khách chuyển khoản'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {isSubmittedNotice
                  ? 'Yêu cầu của bạn đã được chuyển đến DVA Volleyball'
                  : 'Thanh toán chuyển khoản giữ ca thi đấu'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Email nhận phản hồi xác nhận:{' '}
                <strong className="text-slate-200">{activeBooking.customer.email}</strong>
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
            <span className="text-xs text-slate-400 block">Số tiền thanh toán</span>
            <span className="text-2xl font-black text-amber-400">
              {activeBooking.grandTotal.toLocaleString('vi-VN')}₫
            </span>
          </div>
        </div>

        {/* Detailed notice box after customer clicks confirm */}
        {isSubmittedNotice && (
          <div className="mt-6 p-4 rounded-2xl bg-sky-950/60 border border-sky-500/30 text-xs text-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sky-400 text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Đã tiếp nhận yêu cầu chuyển khoản</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              Vì hệ thống cần đối soát sao kê tài khoản ngân hàng thực tế, ban quản lý{' '}
              <strong className="text-white">DVA Volleyball</strong> sẽ kiểm tra biến động số dư và gửi email xác nhận chính thức kèm vé vào sân đến{' '}
              <strong className="text-amber-400">{activeBooking.customer.email}</strong> và số điện thoại{' '}
              <strong className="text-amber-400">{activeBooking.customer.phoneNumber}</strong> trong vòng 5 - 15 phút.
            </p>
            <p className="text-[11px] text-amber-300 pt-1">
              * Nếu bạn cần vào sân gấp hoặc muốn giữ chỗ ngay tức thì mà không muốn chờ phản hồi, vui lòng gọi điện hoặc nhắn tin Zalo trực tiếp cho chủ sân qua nút bên dưới!
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* VietQR Box Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase text-slate-400">
              <QrCode className="w-4 h-4 text-sky-400" />
              <span>Mã QR Chuyển Khoản DVA</span>
            </div>

            {/* Dynamic VietQR Container */}
            <div className="p-3 bg-white rounded-2xl max-w-[280px] mx-auto shadow-inner">
              <img
                src={qrUrl}
                alt="DVA Volleyball QR Code"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">
                Tự động điền số tiền & nội dung theo ca đặt
              </p>
              <p className="text-[11px] text-slate-500">
                (Quét bằng mọi ứng dụng Ngân Hàng, MoMo, ZaloPay 24/7)
              </p>
            </div>

            {/* Confirmation Button requested by user */}
            {!isSubmittedNotice ? (
              <button
                type="button"
                onClick={handleUserConfirmTransfer}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all text-center leading-tight"
              >
                <span>Xác nhận đã chuyển khoản - DVA sẽ kiểm tra và phản hồi qua email sớm nhất có thể</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/40 text-sky-400 text-xs font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Đã ghi nhận yêu cầu • DVA đang kiểm tra số dư</span>
              </div>
            )}
          </div>

          {/* Quick Direct Hotline / Zalo Callout for Instant Confirmation */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <PhoneCall className="w-4 h-4" />
              <span>Cần xác nhận sân gấp không muốn chờ?</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Bạn có thể liên hệ trực tiếp chủ sân DVA qua Hotline hoặc Zalo để được duyệt ca ngay trong 30 giây:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${DVA_CONTACT_INFO.phone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>Gọi Hotline</span>
              </a>
              <a
                href={DVA_CONTACT_INFO.zalo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat Zalo</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bank & Ticket Detail Column */}
        <div className="md:col-span-7 space-y-6">
          {/* Manual Transfer Information Box */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Thông tin tài khoản nhận chuyển khoản
            </h3>

            <div className="space-y-3 text-xs">
              {/* Bank Name */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Ngân hàng thụ hưởng:</span>
                <strong className="text-white font-bold">{bankConfig.bankName}</strong>
              </div>

              {/* Account Number */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Số tài khoản:</span>
                  <strong className="text-white font-mono text-base font-bold">
                    {bankConfig.accountNo}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bankConfig.accountNo, 'account')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold transition-colors"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAccount ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              {/* Account Holder */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Chủ tài khoản:</span>
                <strong className="text-white font-bold">{bankConfig.accountName}</strong>
              </div>

              {/* Transfer Content: EXACTLY formatted with date, time, court, phone */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 text-[11px] font-bold">
                    Nội dung chuyển khoản (Đã tự động tạo theo ca đặt của bạn):
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(transferContent, 'content')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    {copiedContent ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedContent ? 'Đã chép' : 'Sao chép nội dung'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-sm font-black text-white tracking-wide border border-slate-800">
                  {transferContent}
                </div>
                <p className="text-[10px] text-slate-400">
                  * Khi bạn chuyển khoản với nội dung này, thông báo ngân hàng của chủ sân sẽ hiển thị đúng ngày, giờ, sân và SĐT để đối chiếu lập tức!
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Information Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Chi tiết ca đặt sân</span>
              <span className="text-sky-400 text-xs font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Đang chờ đối soát sao kê
              </span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Sân thi đấu:</span>
                <span className="font-bold text-white text-sm">{activeBooking.courtName.split(' - ')[0]}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Ngày & Giờ:</span>
                <span className="font-bold text-amber-400 text-sm">
                  {formatDateVietnamese(activeBooking.date)} ({activeBooking.startTime} - {activeBooking.endTime})
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Người đặt sân:</span>
                <span className="font-semibold text-white">{activeBooking.customer.fullName}</span>
                <span className="text-slate-400 block">{activeBooking.customer.phoneNumber}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Tài khoản Instagram:</span>
                <span className="font-bold text-amber-400">{activeBooking.customer.instagram || 'Không có'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Kênh ưu tiên phản hồi:</span>
                <span className="font-bold text-emerald-400 uppercase">
                  {activeBooking.customer.preferredContactMethod || 'Zalo'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Lưới chuẩn bị trước:</span>
                <span className="font-semibold text-white">
                  {activeBooking.customer.netHeightRequirement === 'nu_2.24m'
                    ? 'Lưới Nữ (2.24m)'
                    : activeBooking.customer.netHeightRequirement === 'hon_hop_2.35m'
                    ? 'Nam Nữ (2.35m)'
                    : 'Lưới Nam (2.43m)'}
                </span>
              </div>
            </div>

            {/* Free Bonus Indicator */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <Gift className="w-4 h-4 flex-shrink-0" />
              <span>{activeBooking.freeBonus}</span>
            </div>

            {/* Add-ons list if any */}
            {activeBooking.addons.length > 0 && (
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span className="font-semibold text-slate-300">Dịch vụ bổ sung đã chọn: </span>
                {activeBooking.addons.map((a) => `${a.name} (x${a.quantity})`).join(', ')}
              </div>
            )}
          </div>

          {/* Quick Navigation Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/"
              onClick={resetBooking}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Về trang chủ</span>
            </Link>

            <Link
              to="/court-booking/slots"
              onClick={resetBooking}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors ml-auto"
            >
              <Calendar className="w-4 h-4" />
              <span>Đặt thêm ca khác</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
