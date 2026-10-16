import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { CourtBookingPage } from './pages/CourtBookingPage';
import { TrainingPage } from './pages/TrainingPage';
import { BookingProvider } from './context/BookingContext';
import { GoogleSheetConfigModal } from './components/common/GoogleSheetConfigModal';
import { BankConfigModal } from './components/common/BankConfigModal';
import { AdminAuthModal } from './components/common/AdminAuthModal';

export default function App() {
  const [sheetConfigOpen, setSheetConfigOpen] = useState(false);
  const [bankConfigOpen, setBankConfigOpen] = useState(false);

  return (
    <BrowserRouter>
      <BookingProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
          {/* Top Sticky Navigation */}
          <Navbar
            onOpenSheetConfig={() => setSheetConfigOpen(true)}
            onOpenBankConfig={() => setBankConfigOpen(true)}
          />

          {/* Main App Content Area */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/court-booking/*" element={<CourtBookingPage />} />
              <Route path="/training/*" element={<TrainingPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Google Sheets Sync & Debug Modal */}
          <GoogleSheetConfigModal
            isOpen={sheetConfigOpen}
            onClose={() => setSheetConfigOpen(false)}
          />

          {/* Personal Bank & QR Image Settings Modal */}
          <BankConfigModal
            isOpen={bankConfigOpen}
            onClose={() => setBankConfigOpen(false)}
          />

          {/* Admin PIN Authentication Modal */}
          <AdminAuthModal />
        </div>
      </BookingProvider>
    </BrowserRouter>
  );
}
