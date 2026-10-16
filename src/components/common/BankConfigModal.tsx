import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  Save,
  HelpCircle,
  Building,
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { BankConfig } from '../../types';

interface BankConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BankConfigModal: React.FC<BankConfigModalProps> = ({ isOpen, onClose }) => {
  const { bankConfig, setBankConfig } = useBooking();
  const [bankId, setBankId] = useState(bankConfig.bankId);
  const [bankName, setBankName] = useState(bankConfig.bankName);
  const [accountNo, setAccountNo] = useState(bankConfig.accountNo);
  const [accountName, setAccountName] = useState(bankConfig.accountName);
  const [customQrImageUrl, setCustomQrImageUrl] = useState(bankConfig.customQrImageUrl || '');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBankId(bankConfig.bankId);
      setBankName(bankConfig.bankName);
      setAccountNo(bankConfig.accountNo);
      setAccountName(bankConfig.accountName);
      setCustomQrImageUrl(bankConfig.customQrImageUrl || '');
      setSavedNotice(false);
    }
  }, [isOpen, bankConfig]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BankConfig = {
      bankId: bankId.trim(),
      bankName: bankName.trim(),
      accountNo: accountNo.trim().replace(/\s+/g, ''),
      accountName: accountName.trim().toUpperCase(),
      template: 'compact2',
      customQrImageUrl: customQrImageUrl.trim(),
    };
    setBankConfig(updated);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomQrImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Cài Đặt Tài Khoản & Mã QR DVA</h3>
            <p className="text-xs text-slate-400">
              Cập nhật số tài khoản nhận tiền và ảnh mã QR cá nhân của bạn.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Mã Ngân Hàng (Bank ID VietQR)
            </label>
            <select
              value={bankId}
              onChange={(e) => {
                setBankId(e.target.value);
                const selectedText = e.target.options[e.target.selectedIndex].text;
                setBankName(selectedText);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="MB">MBBank - Ngân hàng Quân Đội</option>
              <option value="VCB">Vietcombank - Ngân hàng Ngoại Thương</option>
              <option value="TCB">Techcombank - Kỹ Thương Việt Nam</option>
              <option value="ACB">ACB - Ngân hàng Á Châu</option>
              <option value="BIDV">BIDV - Ngân hàng Đầu tư và Phát triển</option>
              <option value="VPB">VPBank - Việt Nam Thịnh Vượng</option>
              <option value="TPB">TPBank - Tiên Phong</option>
              <option value="STB">Sacombank - Sài Gòn Thương Tín</option>
              <option value="VIB">VIB - Quốc Tế</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Số Tài Khoản Nhận Tiền
            </label>
            <input
              type="text"
              required
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              placeholder="Ví dụ: 0988776655 hoặc 8866228888"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Tên Chủ Tài Khoản (In hoa không dấu)
            </label>
            <input
              type="text"
              required
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="NGUYEN VAN A HOAC DVA VOLLEYBALL"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white font-mono uppercase focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase text-slate-300">
                Tải Lên Ảnh Mã QR Cá Nhân (Tùy chọn)
              </label>
              <span className="text-[10px] text-amber-400">Nếu có ảnh in sẵn</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 cursor-pointer"
            />
            {customQrImageUrl && (
              <div className="mt-2 p-2 bg-white rounded-xl inline-block">
                <img src={customQrImageUrl} alt="QR Preview" className="w-24 h-24 object-contain" />
              </div>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              * Nếu để trống, hệ thống sẽ tự động tạo mã VietQR chuẩn ngân hàng với số tiền và nội dung theo ca đặt!
            </p>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
            >
              {savedNotice ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedNotice ? 'Đã lưu thành công!' : 'Lưu thông tin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
