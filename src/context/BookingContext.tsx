import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { AddonOption, BankConfig, CourtBookingPayload, CustomerInfo, SelectedAddon, TimeSlot } from '../types';
import {
  BASE_PRICE_PER_HOUR,
  COURTS,
  DEFAULT_FREE_BONUS,
  MIN_DURATION_HOURS,
  INITIAL_BANK_CONFIG,
  generateSlotsForDate,
} from '../data/mockData';
import { submitCourtBooking } from '../services/googleSheetService';
import {
  subscribeToLockedSlots,
  toggleSlotLockFirebase,
  saveBookingToFirebase,
} from '../services/firebase';

const STORAGE_KEY_LOCKED_SLOTS = 'dva_volleyball_locked_slots';
const STORAGE_KEY_BANK_CONFIG = 'dva_volleyball_bank_config';

interface BookingContextType {
  // Date & Day selection
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  getDynamicDays: () => { label: string; dateStr: string; dayOfWeek: string; isToday: boolean }[];
  
  // Court & Slots
  selectedCourtId: string;
  setSelectedCourtId: (courtId: string) => void;
  allSlots: TimeSlot[];
  selectedSlots: TimeSlot[];
  toggleSlotSelection: (slot: TimeSlot) => void;
  clearSelectedSlots: () => void;
  totalDurationHours: number;
  isDurationValid: boolean;
  courtSubtotal: number;
  
  // Admin Slot Management (Owner locks/unlocks slots)
  isAdminAuthenticated: boolean;
  isAdminMode: boolean;
  setIsAdminMode: (active: boolean) => void;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  updateAdminPin: (newPin: string) => void;
  toggleAdminLockSlot: (slotId: string) => void;
  lockedSlotIds: string[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Addons
  selectedAddons: SelectedAddon[];
  handleAddonQuantity: (addon: AddonOption, delta: number) => void;
  removeAddon: (addonId: string) => void;
  addonsSubtotal: number;

  // Customer
  customerInfo: CustomerInfo;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;

  // Totals & Bonus
  freeBonus: string;
  grandTotal: number;

  // Transfer syntax generator: DVA [dd/MM] [time] [court] [phone]
  generateTransferSyntax: (customPhone?: string) => string;

  // Bank & QR Config
  bankConfig: BankConfig;
  setBankConfig: (cfg: BankConfig) => void;
  getVietQrUrl: (amount: number, transferContent: string) => string;

  // Booking Confirmation
  activeBooking: CourtBookingPayload | null;
  isSubmitting: boolean;
  submitBooking: () => Promise<CourtBookingPayload | null>;
  confirmUserHasTransferred: () => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Helper to get local date ISO string YYYY-MM-DD
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateVietnamese(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export function formatShortDay(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  return `${parts[2]}/${parts[1]}`;
}

const STORAGE_KEY_ADMIN_PIN = 'dva_admin_pin';
const STORAGE_KEY_ADMIN_AUTH = 'dva_admin_authenticated';

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedCourtId, setSelectedCourtId] = useState<string>('court-1');
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  
  // Admin Authentication State
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ADMIN_PIN) || '8888';
    } catch {
      return '8888';
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminMode, setIsAdminModeState] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const setIsAdminMode = (active: boolean) => {
    if (active && !isAdminAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsAdminModeState(active);
  };

  const loginAdmin = (inputPin: string): boolean => {
    if (inputPin.trim() === adminPin.trim()) {
      setIsAdminAuthenticated(true);
      setIsAdminModeState(true);
      try {
        sessionStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      } catch (err) {
        console.warn(err);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setIsAdminModeState(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    } catch (err) {
      console.warn(err);
    }
  };

  const updateAdminPin = (newPin: string) => {
    const cleanPin = newPin.trim();
    if (cleanPin.length >= 4) {
      setAdminPin(cleanPin);
      try {
        localStorage.setItem(STORAGE_KEY_ADMIN_PIN, cleanPin);
      } catch (err) {
        console.warn(err);
      }
    }
  };
  
  // Persistent locked slots managed by owner
  const [lockedSlotIds, setLockedSlotIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOCKED_SLOTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Real-time synchronization of locked slots across all devices via Firebase
  useEffect(() => {
    const unsubscribe = subscribeToLockedSlots((firebaseLockedIds) => {
      if (Array.isArray(firebaseLockedIds)) {
        setLockedSlotIds(firebaseLockedIds);
        try {
          localStorage.setItem(STORAGE_KEY_LOCKED_SLOTS, JSON.stringify(firebaseLockedIds));
        } catch (err) {
          console.warn(err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Persistent Bank config (allows owner to set personal account or custom QR image)
  const [bankConfig, setBankConfigState] = useState<BankConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BANK_CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_BANK_CONFIG;
    } catch {
      return INITIAL_BANK_CONFIG;
    }
  });

  const setBankConfig = (cfg: BankConfig) => {
    setBankConfigState(cfg);
    try {
      localStorage.setItem(STORAGE_KEY_BANK_CONFIG, JSON.stringify(cfg));
    } catch (e) {
      console.warn(e);
    }
  };

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phoneNumber: '',
    email: '',
    instagram: '',
    preferredContactMethod: 'zalo',
    clubTeamName: '',
    estimatedPlayers: '10 - 14 người',
    netHeightRequirement: 'nam_2.43m',
    note: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBooking, setActiveBooking] = useState<CourtBookingPayload | null>(null);

  // Dynamic 7-day generator starting from today
  const getDynamicDays = () => {
    const days = [];
    const todayObj = new Date();
    const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    for (let i = 0; i < 7; i++) {
      const target = new Date(todayObj);
      target.setDate(todayObj.getDate() + i);

      const y = target.getFullYear();
      const m = String(target.getMonth() + 1).padStart(2, '0');
      const d = String(target.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;

      let label = `${d}/${m}`;
      if (i === 0) label = 'Hôm nay';
      else if (i === 1) label = 'Ngày mai';

      days.push({
        label,
        dateStr,
        dayOfWeek: dayNames[target.getDay()],
        isToday: i === 0,
      });
    }
    return days;
  };

  // Toggle admin lock on a slot with instant local update and cloud Firestore sync
  const toggleAdminLockSlot = async (slotId: string) => {
    const isCurrentlyLocked = lockedSlotIds.includes(slotId);
    const shouldLock = !isCurrentlyLocked;

    // 1. Cập nhật tức thì trên máy hiện tại (Optimistic UI)
    setLockedSlotIds((prev) => {
      const next = shouldLock
        ? [...prev, slotId]
        : prev.filter((id) => id !== slotId);
      try {
        localStorage.setItem(STORAGE_KEY_LOCKED_SLOTS, JSON.stringify(next));
      } catch (err) {
        console.warn(err);
      }
      return next;
    });

    // 2. Đồng bộ lên Firebase Firestore đám mây cho toàn bộ khách hàng trên thiết bị khác
    try {
      const slotObj = allSlots.find((s) => s.id === slotId);
      await toggleSlotLockFirebase(slotId, shouldLock, {
        courtId: slotObj?.courtId || selectedCourtId,
        date: slotObj?.date || selectedDate,
        startTime: slotObj?.startTime,
        endTime: slotObj?.endTime,
      });
    } catch (err) {
      console.error("Firebase sync error:", err);
    }
  };

  // Generate slots for active date including owner's locked slots
  const allSlots = useMemo(() => {
    return generateSlotsForDate(selectedDate, lockedSlotIds);
  }, [selectedDate, lockedSlotIds]);

  // Filter selected slot objects
  const selectedSlots = useMemo(() => {
    return allSlots.filter((slot) => selectedSlotIds.includes(slot.id));
  }, [allSlots, selectedSlotIds]);

  // Reset selected slots when date or court changes
  useEffect(() => {
    setSelectedSlotIds([]);
  }, [selectedDate, selectedCourtId]);

  // Toggle customer selection
  const toggleSlotSelection = (slot: TimeSlot) => {
    // If in admin mode, do not select as customer, let admin toggle lock
    if (isAdminMode) {
      toggleAdminLockSlot(slot.id);
      return;
    }

    if (slot.status === 'booked' || slot.status === 'maintenance') return;

    if (slot.courtId !== selectedCourtId) {
      setSelectedCourtId(slot.courtId);
      setSelectedSlotIds([slot.id]);
      return;
    }

    setSelectedSlotIds((prev) => {
      if (prev.includes(slot.id)) {
        return prev.filter((id) => id !== slot.id);
      } else {
        return [...prev, slot.id];
      }
    });
  };

  const clearSelectedSlots = () => {
    setSelectedSlotIds([]);
  };

  const totalDurationHours = useMemo(() => {
    return selectedSlots.reduce((sum, s) => sum + s.durationHours, 0);
  }, [selectedSlots]);

  const isDurationValid = totalDurationHours >= MIN_DURATION_HOURS;

  const courtSubtotal = useMemo(() => {
    return selectedSlots.reduce((sum, s) => sum + s.durationHours * s.pricePerHour, 0);
  }, [selectedSlots]);

  // Add-ons
  const handleAddonQuantity = (addon: AddonOption, delta: number) => {
    setSelectedAddons((prev) => {
      const existing = prev.find((item) => item.addonId === addon.id);
      if (existing) {
        const nextQty = existing.quantity + delta;
        if (nextQty <= 0) {
          return prev.filter((item) => item.addonId !== addon.id);
        }
        return prev.map((item) =>
          item.addonId === addon.id ? { ...item, quantity: nextQty } : item
        );
      } else if (delta > 0) {
        return [
          ...prev,
          {
            addonId: addon.id,
            name: addon.name,
            quantity: delta,
            unitPrice: addon.unitPrice,
          },
        ];
      }
      return prev;
    });
  };

  const removeAddon = (addonId: string) => {
    setSelectedAddons((prev) => prev.filter((a) => a.addonId !== addonId));
  };

  const addonsSubtotal = useMemo(() => {
    return selectedAddons.reduce((sum, a) => sum + a.quantity * a.unitPrice, 0);
  }, [selectedAddons]);

  const grandTotal = courtSubtotal + addonsSubtotal;

  /**
   * Precise transfer content requested by owner:
   * e.g.: DVA 16/10 18h-19h30 S1 0988776655
   */
  const generateTransferSyntax = (customPhone?: string): string => {
    const phone = (customPhone || customerInfo.phoneNumber || 'SDT').replace(/\s+/g, '');
    const dateFormatted = formatShortDay(selectedDate);
    const sorted = [...selectedSlots].sort((a, b) => a.startTime.localeCompare(b.startTime));
    const start = sorted[0]?.startTime.replace(':', 'h') || '00h';
    const end = sorted[sorted.length - 1]?.endTime.replace(':', 'h') || '00h';
    const courtShort = selectedCourtId === 'court-1' ? 'S1' : 'S2';

    return `DVA ${dateFormatted} ${start}-${end} ${courtShort} ${phone}`;
  };

  const getVietQrUrl = (amount: number, transferContent: string) => {
    // If owner specified a custom uploaded QR image, use that
    if (bankConfig.customQrImageUrl && bankConfig.customQrImageUrl.trim().length > 5) {
      return bankConfig.customQrImageUrl.trim();
    }
    const bankId = bankConfig.bankId;
    const accountNo = bankConfig.accountNo;
    const template = bankConfig.template || 'compact2';
    const desc = encodeURIComponent(transferContent);
    const name = encodeURIComponent(bankConfig.accountName);
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${desc}&accountName=${name}`;
  };

  // Submit Booking
  const submitBooking = async (): Promise<CourtBookingPayload | null> => {
    if (!isDurationValid || selectedSlots.length === 0) return null;
    if (!customerInfo.fullName || !customerInfo.phoneNumber || !customerInfo.email) return null;

    setIsSubmitting(true);

    const sortedSlots = [...selectedSlots].sort((a, b) => a.startTime.localeCompare(b.startTime));
    const startTime = sortedSlots[0].startTime;
    const endTime = sortedSlots[sortedSlots.length - 1].endTime;
    const courtObj = COURTS.find((c) => c.id === selectedCourtId) || COURTS[0];

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateFormatted = selectedDate.replace(/-/g, '').slice(2);
    const bookingCode = `DVA-${dateFormatted}-${randomSuffix}`;
    const transferSyntax = generateTransferSyntax(customerInfo.phoneNumber);

    const payload: CourtBookingPayload = {
      bookingCode,
      transferSyntax,
      courtId: selectedCourtId,
      courtName: courtObj.name,
      date: selectedDate,
      startTime,
      endTime,
      durationHours: totalDurationHours,
      slotIds: selectedSlotIds,
      basePricePerHour: BASE_PRICE_PER_HOUR,
      courtSubtotal,
      freeBonus: DEFAULT_FREE_BONUS,
      addons: selectedAddons,
      addonsSubtotal,
      grandTotal,
      customer: { ...customerInfo },
      paymentMethod: 'vietqr',
      paymentStatus: 'pending_verification', // Strictly pending manual review by DVA admin
      userConfirmedTransfer: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await submitCourtBooking(payload);
      // Lưu vào Firebase và tự động khóa ca trên đám mây cho mọi thiết bị
      await saveBookingToFirebase(payload);
      setActiveBooking(payload);
      return payload;
    } catch (err) {
      console.error('Submit booking error:', err);
      try {
        await saveBookingToFirebase(payload);
      } catch (fbErr) {
        console.error('Firebase save booking fallback error:', fbErr);
      }
      setActiveBooking(payload);
      return payload;
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmUserHasTransferred = () => {
    if (activeBooking) {
      setActiveBooking({
        ...activeBooking,
        userConfirmedTransfer: true,
      });
    }
  };

  const resetBooking = () => {
    setSelectedSlotIds([]);
    setSelectedAddons([]);
    setCustomerInfo({
      fullName: '',
      phoneNumber: '',
      email: '',
      instagram: '',
      preferredContactMethod: 'zalo',
      clubTeamName: '',
      estimatedPlayers: '10 - 14 người',
      netHeightRequirement: 'nam_2.43m',
      note: '',
    });
    setActiveBooking(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        getDynamicDays,
        selectedCourtId,
        setSelectedCourtId,
        allSlots,
        selectedSlots,
        toggleSlotSelection,
        clearSelectedSlots,
        totalDurationHours,
        isDurationValid,
        courtSubtotal,
        isAdminAuthenticated,
        isAdminMode,
        setIsAdminMode,
        loginAdmin,
        logoutAdmin,
        updateAdminPin,
        isAuthModalOpen,
        setIsAuthModalOpen,
        toggleAdminLockSlot,
        lockedSlotIds,
        selectedAddons,
        handleAddonQuantity,
        removeAddon,
        addonsSubtotal,
        customerInfo,
        setCustomerInfo,
        freeBonus: DEFAULT_FREE_BONUS,
        grandTotal,
        generateTransferSyntax,
        bankConfig,
        setBankConfig,
        getVietQrUrl,
        activeBooking,
        isSubmitting,
        submitBooking,
        confirmUserHasTransferred,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
