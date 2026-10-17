import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { CourtBookingPayload } from '../types';

export const FIREBASE_CONFIG = {
  projectId: "encoded-armor-n5wls",
  appId: "1:201938561323:web:f6d237c67d7d9f050dfd6e",
  apiKey: "AIzaSyBXCvFrTt9_fmbijGrha1RppNVUdHiYvf4",
  authDomain: "encoded-armor-n5wls.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-dvavolleyballboo-ef6c9e1a-0f0a-4d9a-b53f-57209f9473f9",
  storageBucket: "encoded-armor-n5wls.firebasestorage.app",
  messagingSenderId: "201938561323",
};

// Khởi tạo Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);

// Khởi tạo Firestore Database
export const db = FIREBASE_CONFIG.firestoreDatabaseId
  ? getFirestore(app, FIREBASE_CONFIG.firestoreDatabaseId)
  : getFirestore(app);

const LOCKED_SLOTS_COLLECTION = 'locked_slots';
const BOOKINGS_COLLECTION = 'court_bookings';

/**
 * Lắng nghe thay đổi thời gian thực các ca đã bị khóa từ Firebase Firestore.
 * Bất kỳ ai khóa ca -> tất cả thiết bị khác tự động cập nhật ngay lập tức.
 */
export function subscribeToLockedSlots(onUpdate: (lockedIds: string[]) => void): () => void {
  try {
    const colRef = collection(db, LOCKED_SLOTS_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const lockedIds: string[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.isLocked !== false) {
            lockedIds.push(docSnap.id);
          }
        });
        onUpdate(lockedIds);
      },
      (error) => {
        console.error("Lỗi đồng bộ Firebase:", error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error("Không thể kết nối Firebase Realtime:", err);
    return () => {};
  }
}

/**
 * Khóa hoặc Mở khóa một ca trên Firebase Firestore
 */
export async function toggleSlotLockFirebase(
  slotId: string,
  shouldLock: boolean,
  meta?: { courtId?: string; date?: string; startTime?: string; endTime?: string }
): Promise<void> {
  try {
    const slotDocRef = doc(db, LOCKED_SLOTS_COLLECTION, slotId);
    if (shouldLock) {
      await setDoc(slotDocRef, {
        slotId,
        courtId: meta?.courtId || '',
        date: meta?.date || '',
        startTime: meta?.startTime || '',
        endTime: meta?.endTime || '',
        isLocked: true,
        lockedBy: 'admin',
        updatedAt: new Date().toISOString(),
      });
    } else {
      await deleteDoc(slotDocRef);
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái khóa ca lên Firebase:", error);
    throw error;
  }
}

/**
 * Lưu đơn đặt sân và tự động khóa các ca đặt trên Firebase
 */
export async function saveBookingToFirebase(booking: CourtBookingPayload): Promise<void> {
  try {
    const bookingDocRef = doc(db, BOOKINGS_COLLECTION, booking.bookingCode);
    await setDoc(bookingDocRef, {
      ...booking,
      createdAt: booking.createdAt || new Date().toISOString(),
    });

    if (booking.slotIds && booking.slotIds.length > 0) {
      for (const slotId of booking.slotIds) {
        const slotDocRef = doc(db, LOCKED_SLOTS_COLLECTION, slotId);
        await setDoc(slotDocRef, {
          slotId,
          courtId: booking.courtId,
          courtName: booking.courtName,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          isLocked: true,
          lockedBy: 'customer_booking',
          bookingCode: booking.bookingCode,
          customerName: booking.customer.fullName,
          customerPhone: booking.customer.phoneNumber,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    console.error("Lỗi khi lưu đơn vào Firebase:", error);
  }
}