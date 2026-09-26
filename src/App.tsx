import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/layout/MobileFrame';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { DoctorList } from './components/doctors/DoctorList';
import { SpecialtyGrid } from './components/doctors/SpecialtyGrid';
import { DoctorProfileModal } from './components/doctors/DoctorProfileModal';
import { SymptomAnalyzer } from './components/ai/SymptomAnalyzer';
import { ReportAnalyzer } from './components/ai/ReportAnalyzer';
import { AiBookingChat } from './components/ai/AiBookingChat';
import { MyAppointments } from './components/appointments/MyAppointments';
import { BookingModal } from './components/appointments/BookingModal';
import { BookingSuccessModal } from './components/appointments/BookingSuccessModal';
import { TelehealthVideoModal } from './components/appointments/TelehealthVideoModal';
import { DoctorWorkspace } from './components/workspace/DoctorWorkspace';
import { Appointment } from './types';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    selectedDoctor, 
    setSelectedDoctor,
    bookingDoctor,
    setBookingDoctor,
    preselectedDate,
    setPreselectedDate,
    preselectedSlot,
    setPreselectedSlot,
    activeVideoCall,
    setActiveVideoCall
  } = useApp();

  const [confirmedPass, setConfirmedPass] = useState<Appointment | null>(null);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'doctors':
        return <DoctorList />;
      case 'specialties':
        return <SpecialtyGrid />;
      case 'symptom-ai':
        return <SymptomAnalyzer />;
      case 'report-ai':
        return <ReportAnalyzer />;
      case 'chat-assistant':
        return <AiBookingChat />;
      case 'appointments':
        return <MyAppointments />;
      case 'clinician-view':
        return <DoctorWorkspace />;
      default:
        return <DoctorList />;
    }
  };

  return (
    <MobileFrame>
      <div className="flex flex-col min-h-full bg-[#0F1117]">
        {/* Navigation Bar */}
        <Navbar />

        {/* Dynamic View Component */}
        <main className="flex-1 pb-16">
          {renderActiveView()}
        </main>

        {/* Bottom Bar for quick thumb navigation */}
        <BottomNav />
      </div>

      {/* Doctor Profile with Booking Slots Modal */}
      {selectedDoctor && (
        <DoctorProfileModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onBook={(doc, date, slot) => {
            setSelectedDoctor(null);
            setBookingDoctor(doc);
            setPreselectedDate(date);
            setPreselectedSlot(slot);
          }}
        />
      )}

      {/* Appointment Checkout Modal */}
      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          initialDate={preselectedDate}
          initialSlot={preselectedSlot}
          onClose={() => setBookingDoctor(null)}
          onSuccess={(newApt) => {
            setBookingDoctor(null);
            setConfirmedPass(newApt);
          }}
        />
      )}

      {/* Booking Confirmed Digital Pass Modal */}
      {confirmedPass && (
        <BookingSuccessModal
          appointment={confirmedPass}
          onClose={() => setConfirmedPass(null)}
        />
      )}

      {/* Simulated Telehealth Video Call Consultation Room */}
      {activeVideoCall && (
        <TelehealthVideoModal
          appointment={activeVideoCall}
          onClose={() => setActiveVideoCall(null)}
        />
      )}
    </MobileFrame>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
