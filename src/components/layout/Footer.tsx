import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Instagram,
  PhoneCall,
  Send,
  Lock,
} from 'lucide-react';
import { DVA_CONTACT_INFO, BRAND_CONFIG } from '../../data/mockData';
import { useBooking } from '../../context/BookingContext';

export const Footer: React.FC = () => {
  const { isAdminAuthenticated, setIsAuthModalOpen } = useBooking();
  const [logoError, setLogoError] = useState(false);
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Urgent Direct Contact Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 font-extrabold text-sm uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Cần giữ sân khẩn cấp hoặc không muốn chờ duyệt email?</span>
            </div>
            <p className="text-xs text-slate-300">
              Hãy liên hệ trực tiếp cho chủ sân DVA qua Hotline, Zalo hoặc WhatsApp để được chốt ca ngay lập tức!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Phone */}
            <a
              href={`tel:${DVA_CONTACT_INFO.phone}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi {DVA_CONTACT_INFO.phone}</span>
            </a>

            {/* Zalo */}
            <a
              href={DVA_CONTACT_INFO.zalo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Zalo</span>
            </a>

            {/* WhatsApp */}
            <a
              href={DVA_CONTACT_INFO.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            {/* Instagram */}
            <a
              href={DVA_CONTACT_INFO.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transition-all shadow-md"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram</span>
            </a>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {!logoError && BRAND_CONFIG.logoUrl ? (
                <img
                  src={BRAND_CONFIG.logoUrl}
                  alt={BRAND_CONFIG.brandName}
                  className="h-10 w-auto max-w-[140px] object-contain drop-shadow"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <span className="text-xs font-black">DVA</span>
                </div>
              )}
              <span className="text-xl font-black text-white flex items-center gap-1.5">
                {/* Nếu logo không tải được thì hiện chữ DVA; khi có ảnh logo thì ảnh thay thế chữ DVA */}
                {logoError && <span>DVA</span>}
                {BRAND_CONFIG.showVolleyballText && (
                  <span className="text-amber-400">VOLLEYBALL</span>
                )}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Sân bóng chuyền trong nhà chuyên nghiệp chuẩn VFV tại Hà Nội. Thảm Gerflor Taraflex 7mm, bóng thi đấu Mikasa V200W, cọ xát Scrimmage và các khóa đào tạo kỹ năng chuyên sâu.
            </p>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-amber-400 font-medium">
              <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Thảm thi đấu Taraflex & Bóng Mikasa V200W</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Dịch vụ & Scrimmage
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/court-booking/slots" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Đặt sân thi đấu theo ca (550k/h)
                </Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Chỉ chơi scrimmage cùng team (70k)
                </Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Scrimmage + Chọn position (150k)
                </Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Scrimmage + Chọn position + Care (250k)
                </Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Đăng ký 1 team đến chơi (600k)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Specifications */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Tiêu chuẩn kỹ thuật
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Thảm Taraflex Sport M:</strong> Đệm giảm chấn 45% tránh tổn thương khớp.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Chiều cao trần 10.5m:</strong> Không cản trở đường bóng bổng và phát bóng.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Bóng thi đấu Mikasa V200W:</strong> Đo chuẩn áp suất trước mỗi ca.
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Channels */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Thông tin liên hệ DVA
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-1" />
                <span>{DVA_CONTACT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <div>
                  <a href={`tel:${DVA_CONTACT_INFO.phone}`} className="hover:text-amber-400 font-bold text-white">
                    {DVA_CONTACT_INFO.phone}
                  </a>{' '}
                  (Hotline / Zalo)
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{DVA_CONTACT_INFO.hours}</span>
              </div>
            </div>

            {/* Quick Map Link */}
            <div className="mt-4">
              <a
                href={DVA_CONTACT_INFO.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 transition-colors"
              >
                <span>Xem vị trí Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Discreet Owner Login */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} DVA Volleyball Arena. Tất cả quyền được bảo lưu.</p>
          <div className="flex flex-wrap items-center gap-6">
            <span>Giá sân: 550,000 VND / giờ</span>
            <span>Tối thiểu 1.5 giờ / ca</span>
            <span className="text-amber-400 font-medium">Free 1 bóng Mikasa V200W</span>
            
            {/* Discreet Admin Login trigger for the Owner */}
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-amber-400 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>{isAdminAuthenticated ? 'Đang bật Quản lý' : 'Chủ sân'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
