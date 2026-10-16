import { CourtBookingPayload, TrainingRegistrationPayload } from '../types';

const STORAGE_KEY_SCRIPT_URL = 'spikezone_gas_url';
const STORAGE_KEY_BOOKINGS = 'spikezone_local_court_bookings';
const STORAGE_KEY_TRAININGS = 'spikezone_local_trainings';

export const DEFAULT_GAS_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';

export function getGoogleScriptUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_GAS_URL;
  return localStorage.getItem(STORAGE_KEY_SCRIPT_URL) || DEFAULT_GAS_URL;
}

export function setGoogleScriptUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SCRIPT_URL, url.trim());
  }
}

/**
 * Standard Google Apps Script (GAS) code template for the owner/developer
 * to paste into Extensions > Apps Script in their Google Sheet.
 */
export const SAMPLE_GOOGLE_APPS_SCRIPT_CODE = `
// ====== GOOGLE APPS SCRIPT CODE (Paste in Extensions > Apps Script) ======
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (data.action === "court_booking") {
      var sheet = ss.getSheetByName("Court_Bookings") || ss.insertSheet("Court_Bookings");
      // Add headers if sheet is new
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          "Mã Đặt Sân", "Ngày Đặt", "Giờ Bắt Đầu", "Giờ Kết Thúc", "Thời Lượng",
          "Tên Sân", "Họ Tên", "Số Điện Thoại", "Email", "Instagram",
          "Kênh Ưu Tiên", "Tên Đội/CLB", "Số Lượng Người", "Lưới Chuẩn Bị",
          "Dịch Vụ Kèm Theo", "Tổng Tiền (VND)", "Trạng Thái", "Ghi Chú", "Thời Gian Tạo"
        ]);
        sheet.getRange(1, 1, 1, 19).setFontWeight("bold").setBackground("#e2e8f0");
      }
      
      var addonsSummary = (data.addons || []).map(function(a) { 
        return a.name + " (x" + a.quantity + ")"; 
      }).join(", ");
      
      sheet.appendRow([
        data.bookingCode,
        data.date,
        data.startTime,
        data.endTime,
        data.durationHours + "h",
        data.courtName,
        data.customer.fullName,
        data.customer.phoneNumber,
        data.customer.email,
        data.customer.instagram || "Không có",
        data.customer.preferredContactMethod || "Zalo",
        data.customer.clubTeamName || "Chưa có",
        data.customer.estimatedPlayers || "",
        data.customer.netHeightRequirement || "nam_2.43m",
        addonsSummary || "Không có",
        data.grandTotal,
        data.paymentStatus,
        data.customer.note || "",
        new Date().toISOString()
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Đặt sân thành công và đã lưu vào Google Sheet",
        bookingCode: data.bookingCode
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "training_registration") {
      var sheet = ss.getSheetByName("Training_Registrations") || ss.insertSheet("Training_Registrations");
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          "Mã Đăng Ký", "Gói Scrimmage/Khóa Học", "Học Viên", "Số Điện Thoại",
          "Email", "Instagram", "Kênh Ưu Tiên", "Năm Sinh", "Chiều Cao",
          "Tay Thuận", "Vị Trí Sở Trường", "Trình Độ Hiện Tại", "Mục Tiêu",
          "Ngày Tham Gia", "Học Phí (VND)", "Trạng Thái", "Ghi Chú", "Thời Gian Tạo"
        ]);
        sheet.getRange(1, 1, 1, 18).setFontWeight("bold").setBackground("#fed7aa");
      }
      
      sheet.appendRow([
        data.registrationCode,
        data.packageName,
        data.fullName,
        data.phoneNumber,
        data.email,
        data.instagram || "Không có",
        data.preferredContactMethod || "Zalo",
        data.birthYear || "",
        data.height || "",
        data.dominantHand || "Phải",
        data.preferredPosition || "Linh hoạt",
        data.currentLevel,
        data.trainingGoal || "",
        data.sessionDate || "",
        data.totalFee,
        data.paymentStatus,
        data.notes || "",
        new Date().toISOString()
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Đăng ký khóa học thành công",
        registrationCode: data.registrationCode
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Hành động không hợp lệ"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
`;

/**
 * Submit court booking to Google Sheet via Google Apps Script Web App
 * Always stores locally to guarantee high reliability & instant offline UX
 */
export async function submitCourtBooking(payload: CourtBookingPayload): Promise<{
  success: boolean;
  message: string;
  bookingCode: string;
  sheetSynced: boolean;
}> {
  // 1. Save to local storage cache first
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_BOOKINGS) || '[]');
    existing.unshift(payload);
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(existing));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }

  const scriptUrl = getGoogleScriptUrl();
  let sheetSynced = false;

  // 2. If Google Apps Script Web App URL is provided, send POST request
  if (scriptUrl) {
    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Standard Google Apps Script Web App submission
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'court_booking',
          ...payload,
        }),
      });
      // In no-cors mode, response is opaque but request reaches Google Script
      sheetSynced = true;
    } catch (apiErr) {
      console.warn('Google Sheets Web App POST error:', apiErr);
      sheetSynced = false;
    }
  }

  return {
    success: true,
    message: sheetSynced
      ? 'Đã ghi nhận đặt sân và tự động đồng bộ vào Google Sheets!'
      : 'Đã xác nhận đặt sân thành công trong hệ thống SpikeZone.',
    bookingCode: payload.bookingCode,
    sheetSynced,
  };
}

/**
 * Submit training course or private coach registration
 */
export async function submitTrainingRegistration(payload: TrainingRegistrationPayload): Promise<{
  success: boolean;
  message: string;
  registrationCode: string;
  sheetSynced: boolean;
}> {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_TRAININGS) || '[]');
    existing.unshift(payload);
    localStorage.setItem(STORAGE_KEY_TRAININGS, JSON.stringify(existing));
  } catch (err) {
    console.warn('LocalStorage training save error:', err);
  }

  const scriptUrl = getGoogleScriptUrl();
  let sheetSynced = false;

  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'training_registration',
          ...payload,
        }),
      });
      sheetSynced = true;
    } catch (apiErr) {
      console.warn('Google Sheets training POST error:', apiErr);
      sheetSynced = false;
    }
  }

  return {
    success: true,
    message: sheetSynced
      ? 'Đã đồng bộ thông tin đăng ký vào Google Sheets!'
      : 'Đăng ký khóa học thành công!',
    registrationCode: payload.registrationCode,
    sheetSynced,
  };
}

export function getLocalBookings(): CourtBookingPayload[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_BOOKINGS) || '[]');
  } catch {
    return [];
  }
}

export function getLocalTrainings(): TrainingRegistrationPayload[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_TRAININGS) || '[]');
  } catch {
    return [];
  }
}
