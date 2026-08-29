import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import StyleGuidePage from './pages/StyleGuidePage';
import AuthPortal from './pages/AuthPortal';
import RegisterPortal from './pages/RegisterPortal';
import CustomerShell from './apps/customer/CustomerShell';
import CustomerHome from './apps/customer/pages/CustomerHome';
import OnboardingFlow from './apps/customer/pages/onboarding/OnboardingFlow';
import { CustomerProvider, useCustomer } from './apps/customer/context/CustomerContext';
import { LanguageProvider } from './context/LanguageContext';
import { DemoStoreProvider } from './context/DemoStoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';

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

// Protected Route Guard with 7-Day Session Expiration Check
const ProtectedRoute = ({ children, requiredRole = 'customer' }) => {
  const { isSessionValid, getRoleSession } = useAuth();
  const location = useLocation();

  const hasValidSession = isSessionValid(requiredRole);

  if (!hasValidSession) {
    // Check if user had an expired session to show custom message
    const rawSession = getRoleSession(requiredRole, false);
    const isExpired = rawSession && rawSession.expiresAt && Date.now() > rawSession.expiresAt;
    const targetPath = encodeURIComponent(location.pathname + location.search);

    return (
      <Navigate
        to={`/login?role=${requiredRole}&redirect=${targetPath}${isExpired ? '&expired=true' : ''}`}
        replace
      />
    );
  }

  return children;
};

// Component to handle default /customer root redirect
const CustomerIndexRedirect = () => {
  const { user } = useCustomer();
  return user?.isOnboarded ? <Navigate to="/customer/home" replace /> : <Navigate to="/customer/onboarding" replace />;
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
                  <Route path="/worker/register" element={<WorkerRegistrationFlow />} />
                  <Route path="/worker/signup" element={<WorkerRegistrationFlow />} />
                  <Route path="/worker/onboarding" element={<WorkerRegistrationFlow />} />

                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/Admin/login" element={<AdminLogin />} />
                  <Route path="/admin/signup" element={<RegisterPortal />} />
                  <Route path="/admin/register" element={<RegisterPortal />} />

                  {/* ========================================================= */}
                  {/* PROTECTED CUSTOMER APP ROUTES (7-Day Customer Session)    */}
                  {/* ========================================================= */}
                  <Route
                    path="/customer"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerIndexRedirect />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/onboarding"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <OnboardingFlow />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/home"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <CustomerHome />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/search"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <ServiceSearch />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/matching"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <SmartMatchResults />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/smart-match"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <SmartMatchResults />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/worker/:workerId"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <WorkerProfileView />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/book/:workerId"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <BookingFlow />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/booking"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <BookingFlow />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/tracking/:bookingId"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <BookingTracking />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/tracking"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <BookingTracking />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/payment-checkout/:bookingId"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <PaymentCheckout />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/payment-checkout"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <PaymentCheckout />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/rating/:bookingId"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <RatingFeedback />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/rating"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <RatingFeedback />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/emergency"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <EmergencyService />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/bookings"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <MyBookings />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/payments"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <CustomerPayments />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/profile"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerShell>
                          <CustomerProfile />
                        </CustomerShell>
                      </ProtectedRoute>
                    }
                  />

                  {/* Case-Insensitive Customer Aliases */}
                  <Route path="/Customer/home" element={<ProtectedRoute requiredRole="customer"><CustomerShell><CustomerHome /></CustomerShell></ProtectedRoute>} />
                  <Route path="/Cutomer/home" element={<ProtectedRoute requiredRole="customer"><CustomerShell><CustomerHome /></CustomerShell></ProtectedRoute>} />
                  <Route path="/Customer/bookings" element={<ProtectedRoute requiredRole="customer"><CustomerShell><MyBookings /></CustomerShell></ProtectedRoute>} />
                  <Route path="/Customer/payments" element={<ProtectedRoute requiredRole="customer"><CustomerShell><CustomerPayments /></CustomerShell></ProtectedRoute>} />
                  <Route path="/Customer/profile" element={<ProtectedRoute requiredRole="customer"><CustomerShell><CustomerProfile /></CustomerShell></ProtectedRoute>} />
                  <Route path="/Customer/emergency" element={<ProtectedRoute requiredRole="customer"><CustomerShell><EmergencyService /></CustomerShell></ProtectedRoute>} />
                  <Route path="/emergency" element={<ProtectedRoute requiredRole="customer"><CustomerShell><EmergencyService /></CustomerShell></ProtectedRoute>} />
                  <Route path="/customer/*" element={<ProtectedRoute requiredRole="customer"><CustomerShell /></ProtectedRoute>} />

                  {/* ========================================================= */}
                  {/* PROTECTED WORKER APP ROUTES (7-Day Worker Session)        */}
                  {/* ========================================================= */}
                  <Route
                    path="/worker/job-request/:jobId"
                    element={
                      <ProtectedRoute requiredRole="worker">
                        <WorkerShell>
                          <JobRequestScreen />
                        </WorkerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/job-request"
                    element={
                      <ProtectedRoute requiredRole="worker">
                        <WorkerShell>
                          <JobRequestScreen />
                        </WorkerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/job-management/:jobId"
                    element={
                      <ProtectedRoute requiredRole="worker">
                        <WorkerShell>
                          <JobManagement />
                        </WorkerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/job-management"
                    element={
                      <ProtectedRoute requiredRole="worker">
                        <WorkerShell>
                          <JobManagement />
                        </WorkerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/verification"
                    element={
                      <ProtectedRoute requiredRole="worker">
                        <WorkerShell>
                          <VerificationStatus />
                        </WorkerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/dashboard"
                    element={
                      <ProtectedRoute requiredRole="worker">
                        <WorkerShell>
                          <WorkerDashboard />
                        </WorkerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/jobs"
                    element={
                      <ProtectedRoute requiredRole="worker">
                        <WorkerShell>
                          <WorkerJobs />
                        </WorkerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/earnings"
                    element={
                      <ProtectedRoute requiredRole="worker">
                        <WorkerShell>
                          <WorkerEarnings />
                        </WorkerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/earningss"
                    element={
                      <ProtectedRoute requiredRole="worker">
                        <WorkerShell>
                          <WorkerEarnings />
                        </WorkerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/welfare"
                    element={
                      <ProtectedRoute requiredRole="worker">
                        <WorkerShell>
                          <WorkerWelfare />
                        </WorkerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/cooperative"
                    element={
                      <ProtectedRoute requiredRole="worker">
                        <WorkerShell>
                          <WorkerCooperativeEconomics />
                        </WorkerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/voting"
                    element={
                      <ProtectedRoute requiredRole="worker">
                        <WorkerShell>
                          <CooperativeVoting />
                        </WorkerShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/profile"
                    element={
                      <ProtectedRoute requiredRole="worker">
                        <WorkerShell>
                          <SkillProfile />
                        </WorkerShell>
                      </ProtectedRoute>
                    }
                  />

                  {/* Plural and Case-Insensitive Worker Aliases */}
                  <Route path="/Worker/dashboard" element={<ProtectedRoute requiredRole="worker"><WorkerShell><WorkerDashboard /></WorkerShell></ProtectedRoute>} />
                  <Route path="/workers/dashboard" element={<ProtectedRoute requiredRole="worker"><WorkerShell><WorkerDashboard /></WorkerShell></ProtectedRoute>} />
                  <Route path="/Workers/dashboard" element={<ProtectedRoute requiredRole="worker"><WorkerShell><WorkerDashboard /></WorkerShell></ProtectedRoute>} />
                  <Route path="/Worker/jobs" element={<ProtectedRoute requiredRole="worker"><WorkerShell><WorkerJobs /></WorkerShell></ProtectedRoute>} />
                  <Route path="/workers/jobs" element={<ProtectedRoute requiredRole="worker"><WorkerShell><WorkerJobs /></WorkerShell></ProtectedRoute>} />
                  <Route path="/Worker/earnings" element={<ProtectedRoute requiredRole="worker"><WorkerShell><WorkerEarnings /></WorkerShell></ProtectedRoute>} />
                  <Route path="/workers/earnings" element={<ProtectedRoute requiredRole="worker"><WorkerShell><WorkerEarnings /></WorkerShell></ProtectedRoute>} />
                  <Route path="/Worker/welfare" element={<ProtectedRoute requiredRole="worker"><WorkerShell><WorkerWelfare /></WorkerShell></ProtectedRoute>} />
                  <Route path="/workers/welfare" element={<ProtectedRoute requiredRole="worker"><WorkerShell><WorkerWelfare /></WorkerShell></ProtectedRoute>} />
                  <Route path="/Worker/profile" element={<ProtectedRoute requiredRole="worker"><WorkerShell><SkillProfile /></WorkerShell></ProtectedRoute>} />
                  <Route path="/workers/profile" element={<ProtectedRoute requiredRole="worker"><WorkerShell><SkillProfile /></WorkerShell></ProtectedRoute>} />
                  <Route path="/Worker/voting" element={<ProtectedRoute requiredRole="worker"><WorkerShell><CooperativeVoting /></WorkerShell></ProtectedRoute>} />
                  <Route path="/workers/voting" element={<ProtectedRoute requiredRole="worker"><WorkerShell><CooperativeVoting /></WorkerShell></ProtectedRoute>} />
                  <Route path="/workers/cooperative" element={<ProtectedRoute requiredRole="worker"><WorkerShell><WorkerCooperativeEconomics /></WorkerShell></ProtectedRoute>} />
                  <Route path="/worker/*" element={<ProtectedRoute requiredRole="worker"><WorkerShell /></ProtectedRoute>} />
                  <Route path="/worker" element={<ProtectedRoute requiredRole="worker"><WorkerShell /></ProtectedRoute>} />
                  <Route path="/workers/*" element={<ProtectedRoute requiredRole="worker"><WorkerShell /></ProtectedRoute>} />
                  <Route path="/workers" element={<ProtectedRoute requiredRole="worker"><WorkerShell /></ProtectedRoute>} />
                  <Route path="/worker/home" element={<ProtectedRoute requiredRole="worker"><WorkerShell><WorkerDashboard /></WorkerShell></ProtectedRoute>} />
                  <Route path="/workers/home" element={<ProtectedRoute requiredRole="worker"><WorkerShell><WorkerDashboard /></WorkerShell></ProtectedRoute>} />

                  {/* ========================================================= */}
                  {/* PROTECTED ADMIN APP ROUTES (7-Day Admin Session)          */}
                  {/* ========================================================= */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminShell initialTab="dashboard">
                          <AdminDashboard />
                        </AdminShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/workers"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminShell initialTab="workers">
                          <WorkerManagement />
                        </AdminShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/jobs"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminShell initialTab="workers">
                          <WorkerManagement />
                        </AdminShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/services"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminShell initialTab="services">
                          <AdminServicesScreen />
                        </AdminShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/bookings"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminShell initialTab="bookings">
                          <AllBookings />
                        </AdminShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/complaints"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminShell initialTab="complaints">
                          <ComplaintsScreen />
                        </AdminShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/reports"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminShell initialTab="reports">
                          <DemandForecast />
                        </AdminShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/forecast"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminShell initialTab="reports">
                          <DemandForecast />
                        </AdminShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/map"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminShell initialTab="map">
                          <AdminMapScreen />
                        </AdminShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/cooperative"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminShell initialTab="cooperative">
                          <CooperativeEconomics />
                        </AdminShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminShell initialTab="settings">
                          <AdminSettings />
                        </AdminShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/Admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminShell initialTab="dashboard"><AdminDashboard /></AdminShell></ProtectedRoute>} />
                  <Route path="/Admin/services" element={<ProtectedRoute requiredRole="admin"><AdminShell initialTab="services"><AdminServicesScreen /></AdminShell></ProtectedRoute>} />
                  <Route path="/Admin/workers" element={<ProtectedRoute requiredRole="admin"><AdminShell initialTab="workers"><WorkerManagement /></AdminShell></ProtectedRoute>} />
                  <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminShell /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminShell /></ProtectedRoute>} />

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
