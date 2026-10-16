export type SlotStatus = 'available' | 'booked' | 'selected' | 'maintenance';

export interface TimeSlot {
  id: string;
  courtId: string;
  courtName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationHours: number;
  pricePerHour: number;
  status: SlotStatus;
  isPeakHour?: boolean;
  bookedBy?: string;
  manualLockedByAdmin?: boolean;
}

export interface AddonOption {
  id: string;
  name: string;
  category: 'beverage' | 'equipment' | 'service';
  description: string;
  unit: string;
  unitPrice: number;
  iconName: string;
  popular?: boolean;
}

export interface SelectedAddon {
  addonId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface CustomerInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  instagram: string; // e.g. @username or 'Không có'
  preferredContactMethod: 'zalo' | 'phone' | 'email' | 'instagram';
  clubTeamName?: string;
  estimatedPlayers?: string; // e.g. '8 - 12 người'
  netHeightRequirement?: 'nam_2.43m' | 'nu_2.24m' | 'hon_hop_2.35m';
  note?: string;
}

export interface CourtBookingPayload {
  bookingCode: string;
  transferSyntax: string;
  courtId: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  slotIds: string[];
  basePricePerHour: number;
  courtSubtotal: number;
  freeBonus: string;
  addons: SelectedAddon[];
  addonsSubtotal: number;
  grandTotal: number;
  customer: CustomerInfo;
  paymentMethod: 'vietqr' | 'bank_transfer';
  paymentStatus: 'pending_verification' | 'verified_by_admin' | 'rejected';
  userConfirmedTransfer: boolean;
  createdAt: string;
}

export interface Coach {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  hourlyRate1on1: number;
  hourlyRateGroup: number;
  rating: number;
  reviewCount: number;
  avatar: string;
  bio: string;
  achievements: string[];
  specialties: string[];
  availableDays: string[];
  availableTimeSlots: string[];
}

export interface TrainingPackage {
  id: string;
  title: string;
  category: 'scrimmage_individual' | 'scrimmage_team' | 'coaching_group' | 'coaching_1on1';
  targetAudience: string;
  badge?: string;
  unitPrice: number;
  unitLabel: string; // 'người/buổi', 'team/buổi', 'nhóm 3-5 người/buổi'
  popular?: boolean;
  description: string;
  features: string[];
  schedule: string;
}

export interface TrainingRegistrationPayload {
  registrationCode: string;
  transferSyntax: string;
  packageId: string;
  packageName: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  instagram: string; // @username or 'Không có'
  preferredContactMethod: 'zalo' | 'phone' | 'email' | 'instagram';
  birthYear?: string;
  height?: string;
  dominantHand?: 'Phải' | 'Trái' | 'Cả hai tay';
  preferredPosition?: string;
  currentLevel: string;
  trainingGoal?: string;
  sessionDate?: string;
  notes?: string;
  totalFee: number;
  paymentStatus: 'pending_verification' | 'verified_by_admin';
  createdAt: string;
}

export interface BankConfig {
  bankId: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  template: string;
  customQrImageUrl?: string; // Optional custom owner QR code image
}

export interface ContactInfo {
  phone: string;
  zalo: string;
  whatsapp: string;
  instagram: string;
  address: string;
  hours: string;
  mapsUrl: string;
}

export interface CourtPhoto {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}
