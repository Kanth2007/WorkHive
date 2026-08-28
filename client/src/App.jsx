import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StyleGuidePage from './pages/StyleGuidePage';
import AuthPortal from './pages/AuthPortal';
import RegisterPortal from './pages/RegisterPortal';
import CustomerShell from './apps/customer/CustomerShell';
import CustomerHome from './apps/customer/pages/CustomerHome';
import OnboardingFlow from './apps/customer/pages/onboarding/OnboardingFlow';
import { CustomerProvider, useCustomer } from './apps/customer/context/CustomerContext';
import { LanguageProvider } from './context/LanguageContext';
import { DemoStoreProvider } from './context/DemoStoreContext';
import { AuthProvider } from './context/AuthContext';

// Worker App Imports
import { WorkerProvider } from './apps/worker/context/WorkerContext';
import WorkerShell from './apps/worker/WorkerShell';
import WorkerDashboard from './apps/worker/pages/WorkerDashboard';
import WorkerJobs from './apps/worker/pages/WorkerJobs';
import WorkerEarnings from './apps/worker/pages/WorkerEarnings';
import WorkerWelfare from './apps/worker/pages/WorkerWelfare';
import SkillProfile from './apps/worker/pages/SkillProfile';
import WorkerRegistrationFlow from './apps/worker/pages/registration/WorkerRegistrationFlow';
import VerificationStatus from './apps/worker/pages/VerificationStatus';
import JobRequestDetail from './apps/worker/pages/JobRequestDetail';
import JobRequestScreen from './apps/worker/pages/JobRequestScreen';
import JobManagement from './apps/worker/pages/JobManagement';
import WorkerCooperativeEconomics from './apps/worker/pages/WorkerCooperativeEconomics';
import CooperativeVoting from './apps/worker/pages/CooperativeVoting';

// Admin Shell & Pages
import AdminShell from './apps/admin/AdminShell';
import AdminLogin from './apps/admin/pages/AdminLogin';
import AdminDashboard from './apps/admin/pages/AdminDashboard';
import WorkerManagement from './apps/admin/pages/WorkerManagement';
import AdminServicesScreen from './apps/admin/pages/AdminServicesScreen';
import AllBookings from './apps/admin/pages/AllBookings';
import ComplaintsScreen from './apps/admin/pages/ComplaintsScreen';
import DemandForecast from './apps/admin/pages/DemandForecast';
import AdminMapScreen from './apps/admin/pages/AdminMapScreen';
import CooperativeEconomics from './apps/admin/pages/CooperativeEconomics';
import AdminSettings from './apps/admin/pages/AdminSettings';


// Customer Flow Pages
import ServiceSearch from './apps/customer/pages/ServiceSearch';
import SmartMatchResults from './apps/customer/pages/SmartMatchResults';
import WorkerProfileView from './apps/customer/pages/WorkerProfileView';
import BookingFlow from './apps/customer/pages/BookingFlow';
import BookingTracking from './apps/customer/pages/BookingTracking';
import EmergencyService from './apps/customer/pages/EmergencyService';
import MyBookings from './apps/customer/pages/MyBookings';
import CustomerPayments from './apps/customer/pages/CustomerPayments';
import PaymentCheckout from './apps/customer/pages/PaymentCheckout';
import RatingFeedback from './apps/customer/pages/RatingFeedback';
import CustomerProfile from './apps/customer/pages/CustomerProfile';

// Component to handle default /customer root redirect
const CustomerIndexRedirect = () => {
  const { user } = useCustomer();
  return user.isOnboarded ? <Navigate to="/customer/home" replace /> : <Navigate to="/customer/onboarding" replace />;
};

export function App() {
  return (
    <LanguageProvider>
      <DemoStoreProvider>
        <AuthProvider>
          <CustomerProvider>
            <WorkerProvider>
              <BrowserRouter>

          <Routes>
            {/* Main Style Guide & Prototype Hub */}
            <Route path="/" element={<StyleGuidePage />} />
            <Route path="/styleguide" element={<StyleGuidePage />} />

            {/* Universal Multi-Role Authentication & Registration Routes */}
            <Route path="/login" element={<AuthPortal />} />
            <Route path="/register" element={<RegisterPortal />} />
            <Route path="/signup" element={<RegisterPortal />} />

            {/* Role-Specific Login & Signup Aliases */}
            <Route path="/customer/login" element={<AuthPortal />} />
            <Route path="/customer/register" element={<RegisterPortal />} />
            <Route path="/customer/signup" element={<RegisterPortal />} />

            <Route path="/worker/login" element={<AuthPortal />} />
            <Route path="/worker/signup" element={<WorkerRegistrationFlow />} />

            <Route path="/admin/signup" element={<RegisterPortal />} />
            <Route path="/admin/register" element={<RegisterPortal />} />

            {/* Customer App Routes */}
            <Route path="/customer" element={<CustomerIndexRedirect />} />
            <Route path="/customer/onboarding" element={<OnboardingFlow />} />

            <Route
              path="/customer/home"
              element={
                <CustomerShell>
                  <CustomerHome />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/search"
              element={
                <CustomerShell>
                  <ServiceSearch />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/matching"
              element={
                <CustomerShell>
                  <SmartMatchResults />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/smart-match"
              element={
                <CustomerShell>
                  <SmartMatchResults />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/worker/:workerId"
              element={
                <CustomerShell>
                  <WorkerProfileView />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/book/:workerId"
              element={
                <CustomerShell>
                  <BookingFlow />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/booking"
              element={
                <CustomerShell>
                  <BookingFlow />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/tracking/:bookingId"
              element={
                <CustomerShell>
                  <BookingTracking />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/tracking"
              element={
                <CustomerShell>
                  <BookingTracking />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/payment-checkout/:bookingId"
              element={
                <CustomerShell>
                  <PaymentCheckout />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/payment-checkout"
              element={
                <CustomerShell>
                  <PaymentCheckout />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/rating/:bookingId"
              element={
                <CustomerShell>
                  <RatingFeedback />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/rating"
              element={
                <CustomerShell>
                  <RatingFeedback />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/emergency"
              element={
                <CustomerShell>
                  <EmergencyService />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/bookings"
              element={
                <CustomerShell>
                  <MyBookings />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/payments"
              element={
                <CustomerShell>
                  <CustomerPayments />
                </CustomerShell>
              }
            />
            <Route
              path="/customer/profile"
              element={
                <CustomerShell>
                  <CustomerProfile />
                </CustomerShell>
              }
            />

            {/* Worker App Routes */}
            <Route path="/worker/register" element={<WorkerRegistrationFlow />} />
            <Route path="/worker/onboarding" element={<WorkerRegistrationFlow />} />
            <Route
              path="/worker/job-request/:jobId"
              element={
                <WorkerShell>
                  <JobRequestScreen />
                </WorkerShell>
              }
            />
            <Route
              path="/worker/job-request"
              element={
                <WorkerShell>
                  <JobRequestScreen />
                </WorkerShell>
              }
            />
            <Route
              path="/worker/job-management/:jobId"
              element={
                <WorkerShell>
                  <JobManagement />
                </WorkerShell>
              }
            />
            <Route
              path="/worker/job-management"
              element={
                <WorkerShell>
                  <JobManagement />
                </WorkerShell>
              }
            />
            <Route
              path="/worker/verification"
              element={
                <WorkerShell>
                  <VerificationStatus />
                </WorkerShell>
              }
            />
            <Route
              path="/worker/dashboard"
              element={
                <WorkerShell>
                  <WorkerDashboard />
                </WorkerShell>
              }
            />
            <Route
              path="/worker/jobs"
              element={
                <WorkerShell>
                  <WorkerJobs />
                </WorkerShell>
              }
            />
            <Route
              path="/worker/earnings"
              element={
                <WorkerShell>
                  <WorkerEarnings />
                </WorkerShell>
              }
            />
            <Route
              path="/worker/earningss"
              element={
                <WorkerShell>
                  <WorkerEarnings />
                </WorkerShell>
              }
            />
            <Route
              path="/worker/welfare"
              element={
                <WorkerShell>
                  <WorkerWelfare />
                </WorkerShell>
              }
            />
            <Route
              path="/worker/cooperative"
              element={
                <WorkerShell>
                  <WorkerCooperativeEconomics />
                </WorkerShell>
              }
            />
            <Route
              path="/worker/voting"
              element={
                <WorkerShell>
                  <CooperativeVoting />
                </WorkerShell>
              }
            />
            <Route
              path="/worker/profile"
              element={
                <WorkerShell>
                  <SkillProfile />
                </WorkerShell>
              }
            />
            <Route path="/worker/*" element={<WorkerShell />} />
            <Route path="/worker" element={<WorkerShell />} />

            {/* Case-Insensitive & Typo Aliases for Customer and Worker */}
            <Route path="/customer/emergency" element={<CustomerShell><EmergencyService /></CustomerShell>} />
            <Route path="/Customer/emergency" element={<CustomerShell><EmergencyService /></CustomerShell>} />
            <Route path="/Cutomer/emergency" element={<CustomerShell><EmergencyService /></CustomerShell>} />
            <Route path="/cutomer/emergency" element={<CustomerShell><EmergencyService /></CustomerShell>} />
            <Route path="/emergency" element={<CustomerShell><EmergencyService /></CustomerShell>} />

            <Route path="/Customer/home" element={<CustomerShell><CustomerHome /></CustomerShell>} />
            <Route path="/Cutomer/home" element={<CustomerShell><CustomerHome /></CustomerShell>} />
            <Route path="/Customer/bookings" element={<CustomerShell><MyBookings /></CustomerShell>} />
            <Route path="/Customer/payments" element={<CustomerShell><CustomerPayments /></CustomerShell>} />
            <Route path="/Customer/profile" element={<CustomerShell><CustomerProfile /></CustomerShell>} />
            <Route path="/Customer/*" element={<CustomerShell />} />
            <Route path="/Cutomer/*" element={<CustomerShell />} />

            <Route path="/Worker/dashboard" element={<WorkerShell><WorkerDashboard /></WorkerShell>} />
            <Route path="/Worker/jobs" element={<WorkerShell><WorkerJobs /></WorkerShell>} />
            <Route path="/Worker/earnings" element={<WorkerShell><WorkerEarnings /></WorkerShell>} />
            <Route path="/Worker/earningss" element={<WorkerShell><WorkerEarnings /></WorkerShell>} />
            <Route path="/Worker/welfare" element={<WorkerShell><WorkerWelfare /></WorkerShell>} />
            <Route path="/Worker/profile" element={<WorkerShell><SkillProfile /></WorkerShell>} />
            <Route path="/Worker/voting" element={<WorkerShell><CooperativeVoting /></WorkerShell>} />
            <Route path="/Worker/*" element={<WorkerShell />} />
            <Route path="/Worker" element={<WorkerShell />} />

            {/* Admin Web Dashboard */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/Admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminShell initialTab="dashboard">
                  <AdminDashboard />
                </AdminShell>
              }
            />
            <Route
              path="/admin/workers"
              element={
                <AdminShell initialTab="workers">
                  <WorkerManagement />
                </AdminShell>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <AdminShell initialTab="workers">
                  <WorkerManagement />
                </AdminShell>
              }
            />
            <Route
              path="/admin/services"
              element={
                <AdminShell initialTab="services">
                  <AdminServicesScreen />
                </AdminShell>
              }
            />
            <Route
              path="/Admin/services"
              element={
                <AdminShell initialTab="services">
                  <AdminServicesScreen />
                </AdminShell>
              }
            />
            <Route
              path="/Admin/workers"
              element={
                <AdminShell initialTab="workers">
                  <WorkerManagement />
                </AdminShell>
              }
            />
            <Route
              path="/Admin/dashboard"
              element={
                <AdminShell initialTab="dashboard">
                  <AdminDashboard />
                </AdminShell>
              }
            />

            <Route
              path="/admin/bookings"
              element={
                <AdminShell initialTab="bookings">
                  <AllBookings />
                </AdminShell>
              }
            />
            <Route
              path="/admin/complaints"
              element={
                <AdminShell initialTab="complaints">
                  <ComplaintsScreen />
                </AdminShell>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <AdminShell initialTab="reports">
                  <DemandForecast />
                </AdminShell>
              }
            />
            <Route
              path="/admin/forecast"
              element={
                <AdminShell initialTab="reports">
                  <DemandForecast />
                </AdminShell>
              }
            />
            <Route
              path="/admin/map"
              element={
                <AdminShell initialTab="map">
                  <AdminMapScreen />
                </AdminShell>
              }
            />
            <Route
              path="/admin/cooperative"
              element={
                <AdminShell initialTab="cooperative">
                  <CooperativeEconomics />
                </AdminShell>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminShell initialTab="settings">
                  <AdminSettings />
                </AdminShell>
              }
            />
            <Route path="/admin/*" element={<AdminShell />} />
            <Route path="/admin" element={<AdminShell />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </WorkerProvider>
    </CustomerProvider>
    </AuthProvider>
    </DemoStoreProvider>
    </LanguageProvider>
  );
}

export default App;
