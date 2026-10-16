import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Calendar,
  Sparkles,
  PhoneCall,
  Database,
  ShieldCheck,
  Settings,
  Lock,
  Unlock,
  LogOut,
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { DVA_CONTACT_INFO } from '../../data/mockData';

interface NavbarProps {
  onOpenSheetConfig?: () => void;
  onOpenBankConfig?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSheetConfig, onOpenBankConfig }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const {
    selectedSlots,
    isAdminAuthenticated,
    setIsAuthModalOpen,
    logoutAdmin,
  } = useBooking();

  const navLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Đặt sân thi đấu', path: '/court-booking/slots' },
    { label: 'Scrimmage & Khóa tập', path: '/training' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleBankConfigClick = () => {
    if (!isAdminAuthenticated) {
      setIsAuthModalOpen(true);
    } else if (onOpenBankConfig) {
      onOpenBankConfig();
    }
  };

  const handleSheetConfigClick = () => {
    if (!isAdminAuthenticated) {
      setIsAuthModalOpen(true);
    } else if (onOpenSheetConfig) {
      onOpenSheetConfig();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 transition-all">
      {/* Top micro-announcement bar */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-slate-950 font-bold text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>DVA VOLLEYBALL: Miễn phí 01 bóng thi đấu Mikasa V200W cho mọi ca đặt sân từ 1.5 giờ!</span>
        <span className="hidden sm:inline-block bg-slate-950 text-amber-400 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ml-2">
          Chuẩn FIVB
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo: DVA Volleyball */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="text-sm font-black tracking-tighter">DVA</span>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" title="Sân mở cửa 06:00 - 23:30" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white font-display">
                  DVA <span className="text-amber-400">VOLLEYBALL</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  INDOOR
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Sân Thảm & Scrimmage Chuyên Nghiệp</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Authenticated Admin Controls */}
            {isAdminAuthenticated ? (
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <button
                  type="button"
                  onClick={handleBankConfigClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"
                  title="Cài đặt STK & QR ngân hàng"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>STK & QR</span>
                </button>

                <button
                  type="button"
                  onClick={handleSheetConfigClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  title="Cấu hình Google Sheets Sync"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Sheets</span>
                </button>

                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="p-1.5 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                  title="Đăng xuất Chủ sân"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Subtle discreet button for Owner login */
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="p-2 rounded-xl text-slate-600 hover:text-amber-400 hover:bg-slate-900 transition-colors"
                title="Đăng nhập Chủ sân DVA"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Direct Call Hotline */}
            <a
              href={`tel:${DVA_CONTACT_INFO.phone}`}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400">Hotline DVA</p>
                <p className="text-xs font-bold text-amber-400">{DVA_CONTACT_INFO.phone}</p>
              </div>
            </a>

            {/* Primary Booking CTA */}
            <Link
              to="/court-booking/slots"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Đặt sân ngay</span>
              {selectedSlots.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 bg-slate-950 text-amber-400 text-xs rounded-full font-bold">
                  {selectedSlots.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 md:hidden">
            {selectedSlots.length > 0 && (
              <Link
                to="/court-booking/checkout"
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1"
              >
                <span>Đang chọn ({selectedSlots.length})</span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold ${
                    active
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-3">
            <Link
              to="/court-booking/slots"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20"
            >
              <Calendar className="w-5 h-5" />
              <span>Đặt sân thi đấu ngay</span>
            </Link>

            <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                DVA Volleyball • Thảm Taraflex 7mm
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="text-amber-400 underline font-medium flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>{isAdminAuthenticated ? 'Khu vực Chủ sân' : 'Đăng nhập Chủ sân'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
