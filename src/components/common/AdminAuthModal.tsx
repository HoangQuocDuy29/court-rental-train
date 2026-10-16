import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Settings,
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const AdminAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    updateAdminPin,
  } = useBooking();

  const [inputPin, setInputPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPin, setShowPin] = useState(false);
  
  // Change PIN tab/state
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [changeSuccessNotice, setChangeSuccessNotice] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const success = loginAdmin(inputPin);
    if (success) {
      setInputPin('');
      setIsAuthModalOpen(false);
    } else {
      setErrorMessage('Mã PIN không đúng! Vui lòng thử lại.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setErrorMessage('Mã PIN mới phải từ 4 ký tự trở lên.');
      return;
    }
    if (newPin !== confirmNewPin) {
      setErrorMessage('Mã PIN xác nhận không trùng khớp.');
      return;
    }

    updateAdminPin(newPin);
    setChangeSuccessNotice(true);
    setNewPin('');
    setConfirmNewPin('');
    setTimeout(() => {
      setChangeSuccessNotice(false);
      setIsChangingPin(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-slate-200">
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setErrorMessage('');
            setIsChangingPin(false);
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Xác Thực Chủ Sân DVA</h3>
            <p className="text-xs text-slate-400">
              Khu vực bảo mật chỉ dành cho Ban Quản Lý DVA Volleyball.
            </p>
          </div>
        </div>

        {/* If already authenticated, show options to log out or change PIN */}
        {isAdminAuthenticated ? (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <span className="font-bold block">Bạn đang đăng nhập với tư cách Chủ sân DVA</span>
                <span className="text-[11px] text-slate-300">
                  Bạn có toàn quyền Khóa/Mở ca sân trực tiếp trên lịch thi đấu.
                </span>
              </div>
            </div>

            {!isChangingPin ? (
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(true)}
                  className="w-full py-3 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Đổi mã PIN bảo mật mới</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logoutAdmin();
                    setIsAuthModalOpen(false);
                  }}
                  className="w-full py-3 rounded-xl font-bold bg-red-950/40 hover:bg-red-900/60 text-red-300 flex items-center justify-center gap-2 transition-colors border border-red-800/40"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Đăng xuất quyền Chủ sân</span>
                </button>
              </div>
            ) : (
              /* Change PIN Form */
              <form onSubmit={handleChangePin} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Nhập mã PIN mới (tối thiểu 4 số):
                  </label>
                  <input
                    type="password"
                    required
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Mã PIN mới..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Xác nhận mã PIN mới:
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPin}
                    onChange={(e) => setConfirmNewPin(e.target.value)}
                    placeholder="Nhập lại mã PIN mới..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                {errorMessage && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorMessage}
                  </p>
                )}

                {changeSuccessNotice && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã cập nhật mã PIN mới thành công!
                  </p>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPin(false);
                      setErrorMessage('');
                    }}
                    className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                  >
                    Lưu PIN mới
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Nhập mã PIN bảo mật của Chủ sân:
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  autoFocus
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  placeholder="Nhập mã PIN..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-base text-white font-mono tracking-widest focus:outline-none focus:border-amber-400 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                * Khu vực bảo mật dành riêng cho Ban Quản Lý DVA Volleyball. Vui lòng giữ bí mật mã PIN của bạn.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Đăng nhập mở khóa Quản lý sân</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
