import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Link as LinkIcon,
  Copy,
  Check,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code,
  Layers,
} from 'lucide-react';
import {
  getGoogleScriptUrl,
  setGoogleScriptUrl,
  SAMPLE_GOOGLE_APPS_SCRIPT_CODE,
  getLocalBookings,
  getLocalTrainings,
} from '../../services/googleSheetService';
import { CourtBookingPayload, TrainingRegistrationPayload } from '../../types';

interface GoogleSheetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetConfigModal: React.FC<GoogleSheetConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [url, setUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'bookings' | 'trainings' | 'gas_code'>('config');
  const [localBookings, setLocalBookings] = useState<CourtBookingPayload[]>([]);
  const [localTrainings, setLocalTrainings] = useState<TrainingRegistrationPayload[]>([]);

  useEffect(() => {
    if (isOpen) {
      setUrl(getGoogleScriptUrl());
      setLocalBookings(getLocalBookings());
      setLocalTrainings(getLocalTrainings());
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleScriptUrl(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(SAMPLE_GOOGLE_APPS_SCRIPT_CODE.trim());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Google Sheets Web API Sync</h3>
            <p className="text-xs text-slate-400">
              Kết nối Google Apps Script để tự động ghi log đặt sân và đăng ký học viên.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'config'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cấu hình Web App URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'bookings'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dữ liệu đặt sân ({localBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trainings')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'trainings'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng ký khóa học ({localTrainings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gas_code')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'gas_code'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mã Apps Script (doPost)
          </button>
        </div>

        {/* Tab 1: Config Form */}
        {activeTab === 'config' && (
          <div className="space-y-6 text-xs">
            <form onSubmit={handleSaveUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Google Apps Script Web App Deployment URL:
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  * Khi để trống, hệ thống sẽ lưu offline trong localStorage để người dùng vẫn trải nghiệm và thanh toán mượt mà.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md"
                >
                  Lưu cấu hình
                </button>
                {saved && (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã lưu URL thành công!
                  </span>
                )}
              </div>
            </form>

            {/* Quick 3-step Instructions */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 block text-xs">
                3 Bước kết nối Google Sheet tự động:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                <li>Tạo một Google Sheet mới (Đặt tên: <code>SpikeZone_Database</code>).</li>
                <li>Vào menu <strong>Tiện ích mở rộng (Extensions)</strong> &gt; <strong>Apps Script</strong>, dán đoạn mã tại tab "Mã Apps Script (doPost)".</li>
                <li>Bấm <strong>Triển khai (Deploy)</strong> &gt; <strong>Tùy chọn triển khai mới (New deployment)</strong> &gt; Chọn loại <em>Web app</em>, cấu hình <em>"Ai cũng có quyền truy cập" (Anyone)</em>, sau đó sao chép link dán vào ô trên.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 2: Bookings List */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {localBookings.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">
                Chưa có đơn đặt sân nào được ghi nhận. Hãy thử đặt sân tại module đặt sân!
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {localBookings.map((b) => (
                  <div
                    key={b.bookingCode}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-amber-400 font-mono">#{b.bookingCode}</strong>
                        <span className="text-white font-semibold">{b.customer.fullName}</span>
                        <span className="text-slate-400 text-[11px]">({b.customer.phoneNumber})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {b.date} • {b.startTime}-{b.endTime} • {b.courtName.split(' - ')[0]}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white block">
                        {b.grandTotal.toLocaleString('vi-VN')}₫
                      </span>
                      <span className="text-[10px] text-emerald-400 uppercase font-bold">
                        {b.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Trainings List */}
        {activeTab === 'trainings' && (
          <div className="space-y-3">
            {localTrainings.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">
                Chưa có học viên đăng ký khóa tập.
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {localTrainings.map((t) => (
                  <div
                    key={t.registrationCode}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sky-400 font-mono">#{t.registrationCode}</strong>
                        <span className="text-white font-semibold">{t.fullName}</span>
                        <span className="text-slate-400 text-[11px]">({t.phoneNumber})</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5 font-medium">
                        {t.packageName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {t.email} • {t.currentLevel}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-amber-400 block">
                        {t.totalFee.toLocaleString('vi-VN')}₫
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {t.createdAt.slice(0, 10)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Google Apps Script Source Code */}
        {activeTab === 'gas_code' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Sao chép mã này vào Google Apps Script để nhận webhook POST:
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Đã sao chép' : 'Sao chép mã nguồn'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] max-h-72 overflow-y-auto leading-relaxed select-all">
              {SAMPLE_GOOGLE_APPS_SCRIPT_CODE.trim()}
            </pre>
          </div>
        )}

        <div className="pt-6 border-t border-slate-800 mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
