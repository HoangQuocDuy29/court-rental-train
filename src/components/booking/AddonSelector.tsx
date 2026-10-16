import React, { useState } from 'react';
import {
  Zap,
  Package,
  Droplets,
  Flame,
  CircleDot,
  ShieldAlert,
  UserCheck,
  Sparkles,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { ADDON_OPTIONS } from '../../data/mockData';
import { AddonOption } from '../../types';
import { useBooking } from '../../context/BookingContext';

export const AddonSelector: React.FC = () => {
  const { selectedAddons, handleAddonQuantity, removeAddon } = useBooking();
  const [activeCategory, setActiveCategory] = useState<'all' | 'beverage' | 'equipment' | 'service'>('all');

  const getAddonQuantity = (addonId: string) => {
    const item = selectedAddons.find((a) => a.addonId === addonId);
    return item ? item.quantity : 0;
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Package':
        return <Package className="w-5 h-5 text-sky-400" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'CircleDot':
        return <CircleDot className="w-5 h-5 text-amber-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-emerald-400" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-purple-400" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  const filteredAddons = ADDON_OPTIONS.filter((addon) => {
    if (activeCategory === 'all') return true;
    return addon.category === activeCategory;
  });

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeCategory === 'all'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Tất cả dịch vụ ({ADDON_OPTIONS.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('beverage')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeCategory === 'beverage'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Nước khoáng & Bù ion
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('equipment')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeCategory === 'equipment'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Bóng & Dụng cụ thi đấu
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('service')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeCategory === 'service'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Trọng tài & Hỗ trợ sân
        </button>
      </div>

      {/* Add-ons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAddons.map((addon) => {
          const qty = getAddonQuantity(addon.id);
          const isSelected = qty > 0;

          return (
            <div
              key={addon.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900/90 border-amber-500/80 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(addon.iconName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white truncate">{addon.name}</h4>
                    {addon.popular && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                        Phổ biến
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {addon.description}
                  </p>
                </div>
              </div>

              {/* Price & Quantity Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="text-xs">
                  <span className="text-sm font-extrabold text-amber-400">
                    {addon.unitPrice.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-slate-500 ml-1">/ {addon.unit}</span>
                </div>

                <div className="flex items-center gap-2">
                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => handleAddonQuantity(addon, 1)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-amber-500/50">
                      <button
                        type="button"
                        onClick={() => handleAddonQuantity(addon, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
                        aria-label="Giảm"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-extrabold text-xs text-amber-400">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddonQuantity(addon, 1)}
                        className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-colors"
                        aria-label="Tăng"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
