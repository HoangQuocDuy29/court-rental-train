import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  Award,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Flame,
  PhoneCall,
  MessageCircle,
  Instagram,
  Send,
  Users,
} from 'lucide-react';
import { AMENITIES, BASE_PRICE_PER_HOUR, COURTS, FAQS, DVA_PACKAGES, DVA_CONTACT_INFO } from '../data/mockData';
import { CourtVisualizer } from '../components/booking/CourtVisualizer';
import { CourseCard } from '../components/training/CourseCard';
import { CourtGallery } from '../components/home/CourtGallery';
import { TrainingRegistrationModal } from '../components/training/TrainingRegistrationModal';
import { TrainingPackage } from '../types';
import { MapPin } from 'lucide-react';

export const Home: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedPackage, setSelectedPackage] = useState<TrainingPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRegister = (pkg: TrainingPackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-24 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-sky-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-lg shadow-amber-500/10">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>HỆ THỐNG SÂN BÓNG CHUYỀN INDOOR DVA VOLLEYBALL</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] font-display">
                Đỉnh Cao Trải Nghiệm{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                  DVA Volleyball
                </span>{' '}
                Sân Thảm & Scrimmage.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Sân bóng chuyền trong nhà thảm Gerflor Taraflex giảm chấn 45%, trần cao 10.5 mét không cản đường bóng, giao lưu Scrimmage liên tục và{' '}
                <strong className="text-amber-400 font-bold">
                  tặng miễn phí bóng thi đấu Mikasa V200W
                </strong>{' '}
                trong mỗi ca chơi.
              </p>

              {/* Pricing & Bonus Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 max-w-xl mx-auto lg:mx-0">
                <div>
                  <span className="text-xs uppercase font-extrabold text-slate-400 block">
                    Giá thuê tiêu chuẩn
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-white">550.000₫</span>
                    <span className="text-xs text-slate-400">/ giờ (Tối thiểu 1.5h)</span>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl text-left">
                  <span className="text-[11px] font-bold text-amber-400 block uppercase">
                    Quà tặng đặc quyền:
                  </span>
                  <span className="text-xs text-slate-200 font-semibold">
                    Free 01 bóng Mikasa V200W chính hãng
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/court-booking/slots"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <Calendar className="w-5 h-5 text-slate-950" />
                  <span>Đặt sân trực tuyến ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/training"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-base text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>Gói Scrimmage & Khóa học</span>
                </Link>
              </div>

              {/* Direct Urgent Contacts */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs">
                <span className="text-slate-400">Chốt ca nhanh qua:</span>
                <a
                  href={`tel:${DVA_CONTACT_INFO.phone}`}
                  className="flex items-center gap-1.5 text-white font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span>{DVA_CONTACT_INFO.phone}</span>
                </a>
                <a
                  href={DVA_CONTACT_INFO.zalo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sky-400 font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Zalo</span>
                </a>
                <a
                  href={DVA_CONTACT_INFO.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-emerald-400 font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Interactive Court Visualizer Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative">
                <CourtVisualizer />
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Mở cửa 06:00 - 21:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COURT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
            Hạ tầng cơ sở vật chất DVA
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-display">
            Hai Sân Thi Đấu & Scrimmage Tiêu Chuẩn
          </h2>
          <p className="text-sm text-slate-400">
            Mặt thảm Taraflex dày 7.0mm chuẩn Olympic, bảo vệ khớp gối và cổ chân của vận động viên.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {COURTS.map((court) => (
            <div
              key={court.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl overflow-hidden flex flex-col justify-between transition-all group"
            >
              <div className="p-7 space-y-5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${court.badgeColor}`}>
                    {court.tag}
                  </span>
                  <span className="text-xs font-extrabold text-amber-400">550.000₫ / giờ</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                    {court.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{court.flooring}</p>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>Trần thông thủy:</strong> {court.ceilingHeight}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>Hệ thống chiếu sáng:</strong> {court.lighting}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>Trụ & Lưới:</strong> {court.netSystem}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>Khu vực vận động viên:</strong> {court.capacity}</span>
                  </div>
                </div>
              </div>

              <div className="p-7 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-semibold">Tặng kèm bóng Mikasa V200W</span>
                <Link
                  to="/court-booking/slots"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
                >
                  <span>Xem lịch trống</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2.5 PHOTO GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CourtGallery />
      </section>

      {/* 3. SCRIMMAGE & TRAINING PACKAGES OVERVIEW (THE 6 PACKAGES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 block mb-1">
              DVA Volleyball Scrimmage & Coaching
            </span>
            <h2 className="text-3xl font-black text-white font-display">
              Các Gói Tham Gia Scrimmage & Khóa Học
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Lựa chọn hình thức phù hợp từ ghép đội giao lưu đến cố định vị trí, có HLV theo sát (care) và đào tạo 1-1.
            </p>
          </div>

          <Link
            to="/training"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>Xem đầy đủ bảng giá chi tiết</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DVA_PACKAGES.map((pkg) => (
            <CourseCard
              key={pkg.id}
              pkg={pkg}
              onRegister={handleRegister}
            />
          ))}
        </div>
      </section>

      {/* 3.5 LOCATION & GOOGLE MAPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>ĐỊA CHỈ & VỊ TRÍ SÂN DVA VOLLEYBALL</span>
              </div>

              <h2 className="text-3xl font-black text-white font-display">
                155 Trường Chinh, Hà Nội
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Vị trí đắc địa, giao thông thông thoáng, bãi đỗ xe máy & ô tô rộng rãi có bảo vệ giám sát 24/7. Sân cách mặt đường chính vài bước chân, thuận tiện cho các đoàn VĐV thi đấu giao lưu.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center gap-3 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span><strong>Giờ hoạt động:</strong> {DVA_CONTACT_INFO.hours}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                  <span><strong>Hotline hỗ trợ:</strong> {DVA_CONTACT_INFO.phone} (Gọi điện/Zalo giữ ca khẩn)</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <a
                  href={DVA_CONTACT_INFO.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 transition-all shadow-lg shadow-amber-500/20"
                >
                  <MapPin className="w-4 h-4 text-slate-950" />
                  <span>Mở chỉ đường Google Maps</span>
                </a>

                <a
                  href={DVA_CONTACT_INFO.zalo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Nhắn Zalo</span>
                </a>
              </div>
            </div>

            {/* Visual Map Representation Card */}
            <div className="lg:col-span-6">
              <a
                href={DVA_CONTACT_INFO.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="block relative rounded-2xl overflow-hidden border border-slate-700 group shadow-xl bg-slate-950 aspect-[16/10]"
              >
                {/* Stylized Map Backdrop */}
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-8 h-8 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">Sân Bóng Chuyền DVA Volleyball</h4>
                    <p className="text-xs text-amber-400 font-semibold mt-1">155 Trường Chinh</p>
                    <p className="text-[11px] text-slate-400 mt-2">Bấm để xem định vị và lộ trình chính xác trên Google Maps</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 group-hover:bg-amber-300 px-4 py-2 rounded-xl transition-colors">
                    <span>Xem vị trí trực tiếp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RULES & FAQ SECTION */}
      <section id="rules" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Chính sách minh bạch</span>
          </div>
          <h2 className="text-3xl font-black text-white font-display">
            Quy Định Đặt Sân & Câu Hỏi Thường Gặp
          </h2>
          <p className="text-xs text-slate-400">
            Quy trình chuyển khoản và đối soát chính xác giúp giữ sân công bằng cho mọi đội bóng.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-amber-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Registration Modal */}
      <TrainingRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetPackage={selectedPackage}
      />
    </div>
  );
};
