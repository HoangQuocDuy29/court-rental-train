import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Maximize2,
  X,
  Sparkles,
  Camera,
  Upload,
  Check,
} from 'lucide-react';
import { COURT_PHOTOS } from '../../data/mockData';
import { CourtPhoto } from '../../types';
import { useBooking } from '../../context/BookingContext';

export const CourtGallery: React.FC = () => {
  const { isAdminAuthenticated } = useBooking();
  const [photos, setPhotos] = useState<CourtPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('dva_custom_court_photos');
      return saved ? JSON.parse(saved) : COURT_PHOTOS;
    } catch {
      return COURT_PHOTOS;
    }
  });

  const [selectedPhoto, setSelectedPhoto] = useState<CourtPhoto | null>(null);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState('');

  const handleSavePhotoUrl = (photoId: string) => {
    if (!tempImageUrl.trim()) return;
    const updated = photos.map((p) =>
      p.id === photoId ? { ...p, imageUrl: tempImageUrl.trim() } : p
    );
    setPhotos(updated);
    try {
      localStorage.setItem('dva_custom_court_photos', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setEditingPhotoId(null);
    setTempImageUrl('');
  };

  const handleFileUpload = (photoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const updated = photos.map((p) =>
            p.id === photoId ? { ...p, imageUrl: reader.result as string } : p
          );
          setPhotos(updated);
          try {
            localStorage.setItem('dva_custom_court_photos', JSON.stringify(updated));
          } catch (err) {
            console.warn(err);
          }
          setEditingPhotoId(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>HÌNH ẢNH THỰC TẾ DVA VOLLEYBALL</span>
          </div>
          <h2 className="text-3xl font-black text-white font-display">
            Không Gian Sân Bóng Chuyền Indoor
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mặt thảm Gerflor Taraflex 7.0mm, không khí đối lưu thoáng mát và hệ thống chiếu sáng chuẩn Olympic.
          </p>
        </div>

        {isAdminAuthenticated && (
          <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
            Admin: Bấm vào ảnh để thay đổi ảnh thực tế của sân
          </span>
        )}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl transition-all flex flex-col justify-between"
          >
            {/* Image Box */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-800 cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Tag Pill */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                  {photo.category}
                </span>
              </div>

              {/* Zoom Icon */}
              <button
                type="button"
                className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/70 text-slate-300 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                title="Phóng to ảnh"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Info */}
            <div className="p-5 space-y-1.5">
              <h4 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                {photo.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {photo.description}
              </p>

              {/* Owner Edit Image Action */}
              {isAdminAuthenticated && (
                <div className="pt-2 border-t border-slate-800/80 mt-2">
                  {editingPhotoId === photo.id ? (
                    <div className="space-y-2 pt-1 text-xs">
                      <input
                        type="url"
                        placeholder="Dán link ảnh (https://...)"
                        value={tempImageUrl}
                        onChange={(e) => setTempImageUrl(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-center text-[11px] text-slate-300 cursor-pointer border border-slate-700">
                          <Upload className="w-3 h-3 inline mr-1" />
                          Tải ảnh từ máy
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(photo.id, e)}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSavePhotoUrl(photo.id)}
                          className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                        >
                          Lưu
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPhotoId(null)}
                          className="px-2 py-1 text-xs text-slate-400"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPhotoId(photo.id);
                        setTempImageUrl(photo.imageUrl);
                      }}
                      className="text-[11px] text-amber-400 hover:underline font-semibold"
                    >
                      Thay đổi ảnh này
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2.5 rounded-2xl bg-slate-950/70 text-slate-300 hover:text-white backdrop-blur-md z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] bg-slate-950">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  {selectedPhoto.category}
                </span>
                <h3 className="text-xl font-black text-white mt-1">{selectedPhoto.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedPhoto.description}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Địa chỉ sân</span>
                <span className="text-sm font-bold text-white">155 Trường Chinh</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
