import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Target,
  Clock,
  Sparkles,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Loader2,
  Calendar,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';
import { TrainingPackage, TrainingRegistrationPayload } from '../../types';
import { DVA_CONTACT_INFO } from '../../data/mockData';
import { useBooking, getTodayDateString, formatDateVietnamese } from '../../context/BookingContext';
import { submitTrainingRegistration } from '../../services/googleSheetService';

interface TrainingRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPackage?: TrainingPackage | null;
}

export const TrainingRegistrationModal: React.FC<TrainingRegistrationModalProps> = ({
  isOpen,
  onClose,
  targetPackage,
}) => {
  const { bankConfig, getVietQrUrl } = useBooking();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'zalo' | 'phone' | 'email' | 'instagram'>('zalo');
  const [birthYear, setBirthYear] = useState('');
  const [height, setHeight] = useState('');
  const [dominantHand, setDominantHand] = useState<'Phải' | 'Trái' | 'Cả hai tay'>('Phải');
  const [preferredPosition, setPreferredPosition] = useState('Chủ công (Outside Hitter - OH)');
  const [currentLevel, setCurrentLevel] = useState('Đã chơi phong trào thường xuyên');
  const [trainingGoal, setTrainingGoal] = useState('Cải thiện bước đà và sức bật cắm bóng');
  const [sessionDate, setSessionDate] = useState(getTodayDateString());
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredPayload, setRegisteredPayload] = useState<TrainingRegistrationPayload | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [hasConfirmedTransfer, setHasConfirmedTransfer] = useState(false);

  if (!isOpen || !targetPackage) return null;

  const requiresPosition =
    targetPackage.id === 'pkg-scrimmage-position' ||
    targetPackage.id === 'pkg-scrimmage-position-care';

  const isTeamBooking = targetPackage.id === 'pkg-scrimmage-team';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !email) return;

    setIsSubmitting(true);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const registrationCode = `DVA-SCRIM-${randomSuffix}`;

    // Generate clear transfer syntax for owner's bank notification
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    const shortPkg = targetPackage.title.slice(0, 15).replace(/\s+/g, '');
    const transferSyntax = `DVA ${shortPkg} ${cleanPhone}`;

    const payload: TrainingRegistrationPayload = {
      registrationCode,
      transferSyntax,
      packageId: targetPackage.id,
      packageName: targetPackage.title,
      fullName,
      phoneNumber,
      email,
      instagram: instagram.trim() || 'Không có',
      preferredContactMethod,
      birthYear: birthYear || undefined,
      height: height || undefined,
      dominantHand,
      preferredPosition: requiresPosition ? preferredPosition : undefined,
      currentLevel,
      trainingGoal,
      sessionDate,
      notes,
      totalFee: targetPackage.unitPrice,
      paymentStatus: 'pending_verification',
      createdAt: new Date().toISOString(),
    };

    try {
      await submitTrainingRegistration(payload);
      setRegisteredPayload(payload);
    } catch (err) {
      console.error(err);
      setRegisteredPayload(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const transferContent = registeredPayload ? registeredPayload.transferSyntax : '';
  const qrUrl = registeredPayload
    ? getVietQrUrl(registeredPayload.totalFee, transferContent)
    : '';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!registeredPayload ? (
          <div>
            <div className="mb-6">
              <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider">
                Đăng ký tham gia DVA Volleyball
              </span>
              <h3 className="text-xl font-black text-white mt-1 pr-6">{targetPackage.title}</h3>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                <span className="text-amber-400 font-bold text-base">
                  {targetPackage.unitPrice.toLocaleString('vi-VN')}₫
                </span>
                <span>/ {targetPackage.unitLabel}</span>
                <span>•</span>
                <span className="text-slate-300">{targetPackage.schedule}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    {isTeamBooking ? 'Họ tên Đội trưởng / Đại diện' : 'Họ và tên'} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Số điện thoại liên hệ <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0988 776 655"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gmail (Required) */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Customer Gmail nhận xác nhận <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Instagram Handle with quick button */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase text-slate-300">
                      Tài khoản Instagram
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setInstagram(instagram === 'Không có' ? '' : 'Không có')
                      }
                      className="text-[11px] font-semibold text-amber-400 hover:underline"
                    >
                      {instagram === 'Không có' ? 'Nhập lại IG' : 'Tôi không dùng IG'}
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Ví dụ: @username hoặc điền 'Không có'"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Preferred Contact Channel */}
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <label className="block text-[11px] font-bold uppercase text-slate-400">
                  Kênh muốn DVA liên hệ phản hồi nhanh nhất:
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'zalo', label: 'Zalo' },
                    { id: 'phone', label: 'Gọi điện' },
                    { id: 'email', label: 'Gmail' },
                    { id: 'instagram', label: 'Instagram' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPreferredContactMethod(item.id as any)}
                      className={`py-1.5 px-2 rounded-xl border text-center font-semibold transition-all ${
                        preferredContactMethod === item.id
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical & Skills Profile Group */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                  Thông tin thể hình & Kỹ năng (Giúp DVA xếp đội & phân bổ giáo trình):
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Năm sinh / Tuổi
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 2002"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Chiều cao
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 1m78"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Tay thuận
                    </label>
                    <select
                      value={dominantHand}
                      onChange={(e) => setDominantHand(e.target.value as any)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="Phải">Tay Phải</option>
                      <option value="Trái">Tay Trái</option>
                      <option value="Cả hai tay">Cả hai tay</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Trình độ hiện tại
                    </label>
                    <select
                      value={currentLevel}
                      onChange={(e) => setCurrentLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="Chưa có căn bản (Mới tập)">Chưa có căn bản (Mới tập)</option>
                      <option value="Đã chơi phong trào 1 - 2 năm">Đã chơi phong trào 1 - 2 năm</option>
                      <option value="Đã chơi phong trào thường xuyên (Trên 2 năm)">Chơi thường xuyên (Trên 2 năm)</option>
                      <option value="Bán chuyên / Hay đánh giải">Bán chuyên / Hay đánh giải</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Ngày dự kiến tham gia
                    </label>
                    <input
                      type="date"
                      min={getTodayDateString()}
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Conditional Position Selector if package allows choosing position */}
              {requiresPosition && (
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-2">
                  <label className="block text-xs font-bold uppercase text-amber-400">
                    Vị trí thi đấu mong muốn (Được cố định theo gói của bạn)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { code: 'OH', label: 'Chủ công (Outside Hitter)' },
                      { code: 'OP', label: 'Đối chuyền (Opposite)' },
                      { code: 'S', label: 'Chuyền hai (Setter)' },
                      { code: 'MB', label: 'Phụ công (Middle Blocker)' },
                      { code: 'L', label: 'Libero (Phòng thủ)' },
                    ].map((pos) => (
                      <button
                        key={pos.code}
                        type="button"
                        onClick={() => setPreferredPosition(pos.label)}
                        className={`p-2 rounded-xl border text-left transition-colors ${
                          preferredPosition === pos.label
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      >
                        <span className="font-bold">{pos.code}</span> - {pos.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Training Goal / Objective */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Mục tiêu trọng tâm muốn rèn luyện
                </label>
                <input
                  type="text"
                  placeholder="VD: Tập bật đà cắm bóng, luyện bắt bước 1 bóng xoáy, nhãn quan chuyền 2..."
                  value={trainingGoal}
                  onChange={(e) => setTrainingGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Ghi chú riêng cho HLV / Ban tổ chức DVA
                </label>
                <input
                  type="text"
                  placeholder="VD: Cần ghép đội cùng bạn đi chung, cần mượn giày hoặc băng bảo vệ gối..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu thông tin đăng ký...</span>
                    </>
                  ) : (
                    <span>Tiếp tục đến bước chuyển khoản ({targetPackage.unitPrice.toLocaleString('vi-VN')}₫)</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Step 2: Payment & Waiting Status */
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 mx-auto flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-sky-400">
                {hasConfirmedTransfer
                  ? 'Đã ghi nhận - DVA đang kiểm tra số dư'
                  : 'Mã hồ sơ: #' + registeredPayload.registrationCode}
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                {hasConfirmedTransfer
                  ? 'Yêu cầu của bạn đã được chuyển đến DVA Volleyball'
                  : 'Quét mã VietQR chuyển khoản'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Gói: <strong className="text-white">{registeredPayload.packageName}</strong> (
                {registeredPayload.totalFee.toLocaleString('vi-VN')}₫)
              </p>
            </div>

            {/* QR Box */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-sm mx-auto space-y-3">
              <div className="p-2 bg-white rounded-xl inline-block shadow">
                <img
                  src={qrUrl}
                  alt="DVA QR"
                  className="w-52 h-52 object-contain"
                />
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <div>
                  Số tiền:{' '}
                  <strong className="text-amber-400 text-sm">
                    {registeredPayload.totalFee.toLocaleString('vi-VN')}₫
                  </strong>
                </div>
                <div>
                  Nội dung chuyển khoản:{' '}
                  <span className="font-mono text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {transferContent}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => copyToClipboard(transferContent, 'content')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1"
                >
                  {copiedContent ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Chép nội dung</span>
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bankConfig.accountNo, 'account')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Chép STK ({bankConfig.accountNo})</span>
                </button>
              </div>
            </div>

            {/* Confirmation Button */}
            {!hasConfirmedTransfer ? (
              <button
                type="button"
                onClick={() => setHasConfirmedTransfer(true)}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-lg shadow-amber-500/20"
              >
                Xác nhận đã chuyển khoản - DVA sẽ kiểm tra và phản hồi qua email/SĐT sớm nhất có thể
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-sky-950/60 border border-sky-500/40 text-xs text-slate-200 text-left space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>DVA đang kiểm tra sao kê thực tế</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Hệ thống không tự động duyệt tiền mà sẽ đối soát biến động số dư thực tế tại ngân hàng. Ban quản lý DVA sẽ gửi email & liên hệ xác nhận đến{' '}
                  <strong className="text-amber-400">{registeredPayload.email}</strong> sớm nhất có thể.
                </p>
                <p className="text-slate-400 text-[10px]">
                  Cần xác nhận ngay lập tức? Gọi Hotline:{' '}
                  <a href={`tel:${DVA_CONTACT_INFO.phone}`} className="text-amber-400 font-bold underline">
                    {DVA_CONTACT_INFO.phone}
                  </a>
                </p>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
