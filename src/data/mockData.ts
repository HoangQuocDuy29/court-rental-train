import { AddonOption, BankConfig, ContactInfo, TimeSlot, TrainingPackage } from '../types';

export const BASE_PRICE_PER_HOUR = 550000;
export const MIN_DURATION_HOURS = 1.5;
export const DEFAULT_FREE_BONUS = 'Tặng miễn phí 01 bóng thi đấu Mikasa V200W chuẩn FIVB trong suốt ca chơi';

// Cấu hình Logo và Thương hiệu
export const BRAND_CONFIG = {
  brandName: 'DVA VOLLEYBALL',
  subTitle: 'Sân Thảm & Scrimmage Chuyên Nghiệp',
  logoUrl: '/logom.png', // Đường dẫn file logo trong thư mục public/ (ví dụ '/logo.png') hoặc link ảnh online https://...
  showVolleyballText: true, // true: hiển thị chữ "VOLLEYBALL" bên cạnh logo; false: chỉ hiển thị mỗi ảnh logo
};

export const DVA_CONTACT_INFO: ContactInfo = {
  phone: '0768299329',
  zalo: 'https://zalo.me/84768299329',
  whatsapp: 'https://wa.me/84768299329',
  instagram: 'https://www.instagram.com/_nathan.hq_/',
  address: '155 Trường Chinh',
  hours: '06:00 - 21:30 (Mở cửa tất cả các ngày trong tuần)',
  mapsUrl: 'https://maps.app.goo.gl/6Z89UgVcD1jApFxG7',
};

export const COURT_PHOTOS = [
  {
    id: 'photo-center-court',
    title: 'Toàn cảnh Sân thi đấu chính (Center Court)',
    category: 'Mặt sân thi đấu',
    imageUrl: '/1.jpg',
    description: 'Thảm Gerflor Taraflex Sport M Plus 7.0mm chuẩn FIVB, trần cao 10.5m thông thoáng.',
  },
  {
    id: 'photo-net-lighting',
    title: 'Hệ thống Lưới Vifa Sport',
    category: 'Ánh sáng & Thiết bị',
    imageUrl: '/4.jpg',
    description: 'Đèn trần Philips Sport 850 Lux chiếu tỏa đa hướng, không gây chói khi nhìn bóng trên không.',
  },
  {
    id: 'photo-mikasa-balls',
    title: 'Bóng thi đấu Mikasa V200W chính hãng',
    category: 'Trang thiết bị',
    imageUrl: '/5.jpeg',
    description: 'Mỗi ca chơi được miễn phí 01 bóng thi đấu cao cấp 18 múi xoáy đã đo áp suất chuẩn.',
  },
  {
    id: 'photo-training-court',
    title: 'Sân số 2 - Khu vực Scrimmage & Tập luyện',
    category: 'Sân tập luyện',
    imageUrl: '/3.jpg',
    description: 'Không gian tập luyện nhóm, sửa kỹ thuật 1-1 và đấu tập cọ xát đối kháng liên tục.',
  },
  {
    id: 'photo-court-surface',
    title: 'Cận cảnh thảm giảm chấn 45% chống chấn thương',
    category: 'Mặt sàn Taraflex',
    imageUrl: '/2.jpg',
    description: 'Bảo vệ đầu gối và mắt cá chân khi tiếp đất sau những cú nhảy đập cắm bóng căng.',
  },
  {
    id: 'photo-bench-locker',
    title: 'Feedback từ khách hàng về trải nghiệm sân',
    category: 'Tiện ích sân',
    imageUrl: '6.jpg',
    description: 'Hệ thống quạt đối lưu mát mẻ, bàn ghi điểm điện tử và ghế chờ cho các đội giao lưu.',
  },
];

export const INITIAL_BANK_CONFIG: BankConfig = {
  bankId: 'MB', // Vietcombank
  bankName: 'Ngân hàng Thương mại Cổ phần Quân Đội (MB)',
  accountNo: '0002090671521',
  accountName: 'HOANG QUOC DUY',
  template: 'compact2',
  customQrImageUrl: '',
};

export const COURTS = [
  {
    id: 'court-1',
    name: 'Sân A ',
    flooring: 'Thảm Gerflor Taraflex Sport M Plus 7.0mm',
    ceilingHeight: '10.5 mét chuẩn thi đấu quốc tế',
    lighting: 'LED Philips Sport 850 Lux chống chói',
    netSystem: 'Cột & Lưới Senoh tiêu chuẩn Olympic',
    capacity: 'Sức chứa 50 người',
    tag: 'Sân Thi Đấu & Scrimmage',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    id: 'court-2',
    name: 'Sân B',
    flooring: 'Thảm Taraflex cao su đệm kép giảm tải chấn khớp gối',
    ceilingHeight: '10.0 mét không cản gió',
    lighting: 'Hệ thống đèn đối xứng không đổ bóng',
    netSystem: 'Hệ thống lưới điều chỉnh linh hoạt Nam (2.43m) & Nữ (2.24m)',
    capacity: 'Khu vực bench khởi động & đo sức bật VertMax',
    tag: 'Sân Đào Tạo Kỹ Năng & 1-1',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  },
];

export const ADDON_OPTIONS: AddonOption[] = [
  {
    id: 'pocari-single',
    name: 'Nước bù khoáng Pocari Sweat (Chai 500ml)',
    category: 'beverage',
    description: 'Bù nước và 5 ion thiết yếu cấp tốc, tăng độ bền cơ bắp',
    unit: 'chai',
    unitPrice: 20000,
    iconName: 'Zap',
    popular: true,
  },
  {
    id: 'pocari-crate',
    name: 'Thùng Pocari Sweat 500ml (24 chai)',
    category: 'beverage',
    description: 'Tiết kiệm cho cả đội 12-14 thành viên, ướp đá sẵn trong sân',
    unit: 'thùng',
    unitPrice: 420000,
    iconName: 'Package',
    popular: true,
  },
  {
    id: 'water-crate',
    name: 'Thùng nước khoáng đóng chai (24 chai x 500ml)',
    category: 'beverage',
    description: 'Nước tinh khiết ướp lạnh trong thùng đá giữ nhiệt 24h',
    unit: 'thùng',
    unitPrice: 180000,
    iconName: 'Droplets',
  },
  {
    id: 'revive-single',
    name: 'Nước bù khoáng Revive Chanh muối (Chai 500ml)',
    category: 'beverage',
    description: 'Giải khát tức thì hương vị chanh muối truyền thống',
    unit: 'chai',
    unitPrice: 15000,
    iconName: 'Flame',
  },
  {
    id: 'extra-mikasa-ball',
    name: 'Thuê thêm bóng Mikasa V200W dự phòng (Bộ 3 quả)',
    category: 'equipment',
    description: 'Đã bơm chuẩn áp suất thi đấu (0.30 - 0.325 kgf/cm²)',
    unit: 'bộ/ca',
    unitPrice: 80000,
    iconName: 'CircleDot',
    popular: true,
  },
  {
    id: 'referee-service',
    name: 'Dịch vụ Trọng tài bắt trận chuẩn Liên đoàn VFV',
    category: 'service',
    description: 'Trọng tài điều khiển trận đấu công tâm, tính điểm & phổ biến luật',
    unit: 'trọng tài/ca',
    unitPrice: 200000,
    iconName: 'ShieldAlert',
  },
  {
    id: 'ball-retriever',
    name: 'Nhân sự Nhặt bóng & Lau sàn chuyên trách',
    category: 'service',
    description: 'Đội ngũ hỗ trợ nhặt bóng liên tục, lau sàn khô ráo chống trơn trượt',
    unit: 'người/ca',
    unitPrice: 120000,
    iconName: 'UserCheck',
  },
];

export const DVA_PACKAGES: TrainingPackage[] = [
  {
    id: 'pkg-scrimmage-individual',
    title: 'Chỉ chơi Scrimmage cùng team',
    category: 'scrimmage_individual',
    targetAudience: 'VĐV phong trào muốn cọ xát trận đấu thực tế',
    badge: 'Phổ biến nhất',
    unitPrice: 70000,
    unitLabel: 'người / buổi',
    popular: true,
    description: 'Tham gia ghép đội thi đấu Scrimmage đối kháng tính điểm, đổi sân luân phiên trên sân thảm Taraflex đạt chuẩn.',
    features: [
      'Giao lưu cọ xát thực chiến 2 - 3 tiếng',
      'Được bốc thăm ghép đội ngẫu nhiên cân bằng trình độ',
      'Quay video trận đấu',
    ],
    schedule: 'Các buổi tối Thứ 2 - 4 - 6 & Chủ Nhật (18:30 - 21:30)',
  },
  {
    id: 'pkg-scrimmage-position',
    title: 'Chơi Scrimmage + Được chọn Position',
    category: 'scrimmage_individual',
    targetAudience: 'VĐV muốn cố định vị trí sở trường (OH, OP, S, MB, Libero)',
    badge: 'Được ưa chuộng',
    unitPrice: 150000,
    unitLabel: 'người / buổi',
    popular: true,
    description: 'Được cố định chính xác vị trí thi đấu yêu thích trong đội hình (Chủ công OH, Đối chuyền OP, Chuyền hai Setter, Phụ công MB, hoặc Libero).',
    features: [
      'Được ưu tiên chọn và giữ vị trí sở trường suốt buổi chơi',
      'Đội hình xếp khoa học theo sơ đồ chiến thuật 5-1 / 6-2',
      'Chuyền hai phân phối đều đường bóng cho từng tay đập',
      'Khởi động đập bóng chuyên biệt theo vị trí trước trận',
    ],
    schedule: 'Các buổi tối Thứ 2 - 4 - 6 - 7 (19:00 - 21:30) & Chủ Nhật (14:00 - 16:30)',
  },
  {
    id: 'pkg-scrimmage-position-care',
    title: 'Chơi Scrimmage + Được chọn Position + Care',
    category: 'scrimmage_individual',
    targetAudience: 'Vừa thi đấu vừa có HLV theo sát chỉnh sửa lỗi ngay trong trận',
    badge: 'VIP Nâng Trình',
    unitPrice: 250000,
    unitLabel: 'người / buổi',
    popular: true,
    description: 'Gói trải nghiệm hoàn hảo: Vừa được cố định vị trí, vừa có HLV đứng bên ngoài sân quan sát, bắt lỗi động tác, nhắc bài chiến thuật và feedback trực tiếp giữa các set.',
    features: [
      'Cố định vị trí thi đấu mong muốn (OH / OP / S / MB / L)',
      'HLV chuyên nghiệp theo sát "Care" 100% thời gian thi đấu',
      'Nhắc nhịp đà, góc gập cổ tay, vị trí bọc lót và bắt bước 1',
      'Đánh giá điểm mạnh/yếu cá nhân và bài tập cải thiện sau buổi',
    ],
    schedule: 'Các buổi tối Thứ 2 - 4 - 6 - 7 (19:00 - 21:30) & Chủ Nhật (14:00 - 16:30)',
  },
  {
    id: 'pkg-scrimmage-team',
    title: 'Đăng ký 1 Team đến chơi Scrimmage',
    category: 'scrimmage_team',
    targetAudience: 'Đội bóng sẵn có (6 - 10 người) cần tìm đối thủ xứng tầm',
    badge: 'Gói Đội Tuyển',
    unitPrice: 600000,
    unitLabel: 'team / buổi (6-10 người)',
    popular: false,
    description: 'Dành cho nguyên 1 team hoàn chỉnh đăng ký đến thi đấu giao hữu với các team khác của DVA Volleyball dưới sự điều phối của trọng tài.',
    features: [
      'Chi phí trọn gói cực tốt cho cả đội 6-10 thành viên',
      'Được sắp xếp đối thủ có trình độ tương đương để cọ xát căng thẳng',
    ],
    schedule: 'Các buổi tối Thứ 2 - 4 - 6 - 7 (19:00 - 21:30) & Chủ Nhật (14:00 - 16:30)',
  },
  {
    id: 'pkg-group-custom',
    title: 'Học nhóm theo yêu cầu (3 - 5 người / session)',
    category: 'coaching_group',
    targetAudience: 'Nhóm bạn thân, đồng nghiệp muốn cùng nâng cao kỹ năng',
    badge: 'Đào Tạo Nhóm',
    unitPrice: 2500000,
    unitLabel: 'nhóm (3-5 người) / session 120p',
    popular: false,
    description: 'Giáo trình thiết kế riêng 100% theo mục tiêu của nhóm: tập phối hợp bước 1 - chuyền 2, chiến thuật hàng chắn, đập bóng phối hợp nhanh lao - nhú.',
    features: [
      'Nhóm riêng biệt 3 - 5 người, không ghép người lạ',
      'HLV trực tiếp huấn luyện trọn vẹn 120 phút',
      'Sử dụng dàn bóng tập Mikasa và máy bắn bóng tự động',
      'Linh hoạt chọn chủ đề: Bước 1, Đập bóng, Sức bật, Chuyền hai',
    ],
    schedule: 'Linh hoạt theo lịch hẹn giữa nhóm và HLV',
  },
  {
    id: 'pkg-coaching-1on1',
    title: 'Học 1-1 Sửa lỗi cá nhân nâng cao',
    category: 'coaching_1on1',
    targetAudience: 'VĐV muốn đột phá kỹ thuật cá nhân cấp tốc',
    badge: 'Chuyên Sâu 1 Kèm 1',
    unitPrice: 2000000,
    unitLabel: 'người / session 120p',
    popular: true,
    description: 'Chế độ 1 thầy 1 trò chuyên sâu nhất: Phân tích video chuyển động quay chậm 120fps, bẻ khớp tay sửa đà 3 bước, sửa dáng phát bóng và bạt bóng cắm sân.',
    features: [
      'Tập trung 100% thời lượng của HLV chỉ cho riêng bạn',
      'Đo lường sức bật nhảy dọc bằng thiết bị điện tử chuyên dụng',
      'Khắc phục triệt để thói quen xấu gây đau vai, đau cổ tay',
      'Cam kết cải thiện rõ rệt độ chuẩn xác và uy lực ngay sau 1 buổi',
    ],
    schedule: 'Xếp lịch riêng theo khung giờ mong muốn của học viên',
  },
];

export const SLOT_TIME_WINDOWS = [
  { start: '06:00', end: '08:00', duration: 2, peak: false },
  { start: '08:00', end: '10:00', duration: 2, peak: false },
  { start: '10:00', end: '12:00', duration: 2, peak: false },
  { start: '12:00', end: '14:00', duration: 2, peak: false },
  { start: '14:00', end: '17:00', duration: 3, peak: false },
  { start: '17:00', end: '19:00', duration: 2, peak: false },
  { start: '19:00', end: '21:30', duration: 2.5, peak: true },
];

/**
 * Generate slots for any requested date string (YYYY-MM-DD)
 * Takes admin locked slots and booked slots from persistent storage
 */
export function generateSlotsForDate(
  dateStr: string,
  lockedSlotIds: string[] = []
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  COURTS.forEach((court) => {
    SLOT_TIME_WINDOWS.forEach((template) => {
      const slotId = `${court.id}_${dateStr}_${template.start.replace(':', '')}`;
      const isManuallyLocked = lockedSlotIds.includes(slotId);

      slots.push({
        id: slotId,
        courtId: court.id,
        courtName: court.name,
        date: dateStr,
        startTime: template.start,
        endTime: template.end,
        durationHours: template.duration,
        pricePerHour: BASE_PRICE_PER_HOUR,
        status: isManuallyLocked ? 'booked' : 'available',
        isPeakHour: template.peak,
        manualLockedByAdmin: isManuallyLocked,
      });
    });
  });

  return slots;
}

export const AMENITIES = [
  {
    icon: 'Layers',
    title: 'Thảm Taraflex 7.0mm Chuẩn FIVB',
    desc: 'Độ nảy và giảm chấn 45%, bảo vệ tối đa khớp gối và cổ chân khi tiếp đất sau cú bật đập căng.',
  },
  {
    icon: 'SunDim',
    title: 'Hệ Thống Đèn LED Chống Chói',
    desc: 'Hệ thống đèn trần 850 Lux chiếu tỏa đa hướng, không gây chói mắt khi nhìn bóng trên không.',
  },
  {
    icon: 'Wind',
    title: 'Hệ Thống Làm Mát & Quạt Công Nghiệp',
    desc: 'Không khí đối lưu thoáng khí, điều hòa khu vực nghỉ và quạt phản lực đảm bảo nhiệt độ dễ chịu.',
  },
  {
    icon: 'Sparkles',
    title: 'Bóng Mikasa V200W Chính Hãng',
    desc: 'Mỗi ca đặt sân được cấp 01 bóng thi đấu cao cấp miễn phí, luôn được đo áp suất chuẩn xác.',
  },
  {
    icon: 'ShowerHead',
    title: 'Phòng Thay Đồ & Tắm Nóng Lạnh',
    desc: 'Phòng thay đồ riêng nam/nữ, locker khóa từ an toàn, vòi sen nước nóng thư giãn sau buổi tập.',
  },
  {
    icon: 'Car',
    title: 'Bãi Giữ Xe Rộng Rãi',
    desc: 'Bãi đỗ xe có mái che, bảo vệ camera giám sát 24/7, đỗ được cả ô tô cho các đoàn giao hữu.',
  },
];

export const FAQS = [
  {
    question: 'Quy định tối thiểu về thời gian đặt sân là bao lâu?',
    answer: 'Thời gian tối thiểu cho mỗi ca đặt sân là 1.5 giờ (90 phút) để đảm bảo các đội có đủ thời gian khởi động, chia set thi đấu và đạt chất lượng thể lực tốt nhất.',
  },
  {
    question: 'Chính sách tặng bóng thi đấu Mikasa V200W như thế nào?',
    answer: 'Mỗi lượt đặt sân hợp lệ đều được mượn miễn phí 01 quả bóng Mikasa V200W chính hãng chuẩn FIVB trong suốt thời gian chơi. Nếu đội bạn muốn thuê thêm bóng để khởi động hoặc đập nhiều bóng, có thể chọn add-on gói bóng dự phòng.',
  },
  {
    question: 'Sau khi chuyển khoản, tôi cần làm gì để xác nhận?',
    answer: 'Sau khi chuyển khoản theo đúng cú pháp (VD: DVA 16/10 18h-19h30 S1 0988776655), quý khách bấm nút "Xác nhận đã chuyển khoản". Ban quản lý DVA sẽ kiểm tra số dư thực tế và gửi phản hồi qua email/SĐT trong 5-15 phút. Nếu cần gấp, quý khách có thể gọi trực tiếp Hotline hoặc nhắn Zalo!',
  },
  {
    question: 'Quy định về giày khi vào sân thảm thi đấu?',
    answer: 'Để bảo vệ mặt thảm Taraflex đạt chuẩn tốt nhất, quý khách vui lòng mang giày thể thao đế non-marking hoặc giày chuyên dụng bóng chuyền sạch đáy. Trung tâm có sẵn khăn lau đế giày trước khi bước vào sân.',
  },
  {
    question: 'Chính sách hủy sân hoặc dời lịch thi đấu?',
    answer: 'Quý khách vui lòng thông báo trước ít nhất 12 tiếng để được hỗ trợ dời lịch miễn phí sang khung giờ còn trống khác trong vòng 14 ngày. Hủy trong vòng 4 tiếng trước giờ bóng lăn sẽ không được hoàn cọc.',
  },
];
