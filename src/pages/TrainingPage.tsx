import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Award,
  Sparkles,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { DVA_PACKAGES, DVA_CONTACT_INFO } from '../../src/data/mockData';
import { CourseCard } from '../components/training/CourseCard';
import { TrainingRegistrationModal } from '../components/training/TrainingRegistrationModal';
import { TrainingPackage } from '../types';

export const TrainingPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'scrimmage_individual' | 'scrimmage_team' | 'coaching'>('all');
  const [selectedPackage, setSelectedPackage] = useState<TrainingPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRegister = (pkg: TrainingPackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const filteredPackages = DVA_PACKAGES.filter((pkg) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'scrimmage_individual') return pkg.category === 'scrimmage_individual';
    if (selectedFilter === 'scrimmage_team') return pkg.category === 'scrimmage_team';
    if (selectedFilter === 'coaching') return pkg.category === 'coaching_group' || pkg.category === 'coaching_1on1';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <GraduationCap className="w-4 h-4" />
          <span>DVA VOLLEYBALL • SCRIMMAGE & TRAINING</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-display">
          Giao Lưu Scrimmage & Khóa Huấn Luyện
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Đầy đủ các gói từ cọ xát tự do, chọn vị trí chuyên biệt đến huấn luyện viên theo sát (care) và đào tạo 1 kèm 1 theo yêu cầu.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Tất cả các gói ({DVA_PACKAGES.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('scrimmage_individual')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedFilter === 'scrimmage_individual'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Scrimmage Cá nhân (70k - 250k)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('scrimmage_team')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedFilter === 'scrimmage_team'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Đăng ký 1 Team (600k)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('coaching')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedFilter === 'coaching'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Học Nhóm & 1-1 Nâng Cao
          </button>
        </div>

        {/* Quick Contact Hotline */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${DVA_CONTACT_INFO.phone}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-amber-400 font-bold transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Gọi hotline tư vấn: {DVA_CONTACT_INFO.phone}</span>
          </a>
        </div>
      </div>

      {/* Grid of the 6 Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPackages.map((pkg) => (
          <CourseCard
            key={pkg.id}
            pkg={pkg}
            onRegister={handleRegister}
          />
        ))}
      </div>

      {/* Extra Service Callout Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1">Mặt thảm Taraflex 7.0mm</h4>
            <p className="text-slate-400">Giảm tải xung chấn khi tiếp đất, bảo vệ đầu gối và cổ chân tối đa.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center flex-shrink-0 font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1">Bóng Mikasa V200W</h4>
            <p className="text-slate-400">Tất cả các ca chơi và khóa học đều sử dụng bóng thi đấu chuẩn FIVB.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1">Cộng đồng DVA Volleyball</h4>
            <p className="text-slate-400">Dễ dàng ghép đội, giao lưu lành mạnh cùng các bạn bè đam mê bóng chuyền.</p>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <TrainingRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetPackage={selectedPackage}
      />
    </div>
  );
};
