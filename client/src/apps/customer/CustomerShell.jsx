import React from 'react';
import { useLocation, useNavigate, Link, Outlet } from 'react-router-dom';
import {
  Home,
  Search,
  CalendarCheck,
  Wallet,
  User,
  AlertTriangle,
  MapPin,
  Sparkles,
  ShieldCheck,
  LogOut,
  Building2,
  PhoneCall
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import BottomTabBar from '../../components/BottomTabBar';
import Badge from '../../components/Badge';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useCustomer } from './context/CustomerContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

// Customer Page Views
import CustomerHome from './pages/CustomerHome';
import ServiceSearch from './pages/ServiceSearch';
import MyBookings from './pages/MyBookings';
import EmergencyService from './pages/EmergencyService';
import CustomerPayments from './pages/CustomerPayments';
import CustomerProfile from './pages/CustomerProfile';

export const CustomerShell = ({ children }) => {
  const { user } = useCustomer();
  const { currentUser, getRoleSession, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    const p = location.pathname.toLowerCase();
    if (p.includes('/search') || p.includes('/smart-match') || p.includes('/matching')) return 'search';
    if (p.includes('/bookings') || p.includes('/tracking') || p.includes('/book')) return 'bookings';
    if (p.includes('/emergency')) return 'emergency';
    if (p.includes('/payments') || p.includes('/payment-checkout')) return 'payments';
    if (p.includes('/profile')) return 'profile';
    return 'home';
  };

  const activeTab = getActiveTab();

  // Desktop Sidebar Navigation Items
  const customerNav = [
    { id: 'home', label: 'Services & Home', icon: Home, path: '/customer/home' },
    { id: 'search', label: 'Smart Match & Search', icon: Sparkles, path: '/customer/search' },
    { id: 'bookings', label: 'My Bookings', icon: CalendarCheck, badge: 'Live Tracking', path: '/customer/bookings' },
    { id: 'emergency', label: 'Emergency SOS', icon: AlertTriangle, badge: '12-min', path: '/customer/emergency' },
    { id: 'payments', label: 'Payments & History', icon: Wallet, path: '/customer/payments' },
    { id: 'profile', label: 'My Account', icon: User, path: '/customer/profile' }
  ];

  // Mobile Bottom Tab Bar Items
  const customerMobileTabs = [
    { id: 'home', label: t('home', 'Home'), icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'bookings', label: t('jobs', 'Bookings'), icon: CalendarCheck },
    { id: 'payments', label: t('pay', 'Payments'), icon: Wallet },
    { id: 'profile', label: t('profile', 'Account'), icon: User }
  ];

  const handleSelectNav = (tabId) => {
    const item = customerNav.find((n) => n.id === tabId);
    if (item) navigate(item.path);
  };

  const handleMobileTabChange = (tabId) => {
    if (tabId === 'home') navigate('/customer/home');
    if (tabId === 'search') navigate('/customer/search');
    if (tabId === 'bookings') navigate('/customer/bookings');
    if (tabId === 'payments') navigate('/customer/payments');
    if (tabId === 'profile') navigate('/customer/profile');
  };

  const renderContent = () => {
    if (children) return children;
    switch (activeTab) {
      case 'search':
        return <ServiceSearch />;
      case 'bookings':
        return <MyBookings />;
      case 'emergency':
        return <EmergencyService />;
      case 'payments':
        return <CustomerPayments />;
      case 'profile':
        return <CustomerProfile />;
      case 'home':
      default:
        return <CustomerHome />;
    }
  };

  const customerSession = (getRoleSession && getRoleSession('customer')) || (currentUser?.role === 'customer' ? currentUser : null);
  const displayName = customerSession?.name || currentUser?.name || user?.name || 'Customer';
  const displayLocation = customerSession?.locality || currentUser?.locality || user?.location || 'Ward 4, Adyar, Chennai';

  return (
    <div className="ss-app-shell">
      
      {/* 1. DESKTOP SIDEBAR (Matches Admin Reference) */}
      <Sidebar
        brandName="WorkHive"
        brandSub="Customer Member Portal"
        navItems={customerNav}
        activeItem={activeTab}
        onSelect={handleSelectNav}
        footerContent={
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-black)' }}>
              {displayName}
            </div>
            <div className="text-secondary" style={{ fontSize: '11px' }}>
              {displayLocation}
            </div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link
                to="/login?role=customer"
                style={{
                  fontSize: '11px',
                  color: 'var(--color-accent)',
                  fontWeight: 'bold',
                  textDecoration: 'none'
                }}
              >
                Switch User
              </Link>
              <span className="text-secondary" style={{ fontSize: '11px' }}>•</span>
              <button
                type="button"
                onClick={() => { logout(); navigate('/login?role=customer'); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: '11px',
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <LogOut size={12} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        }
      />

      {/* 2. MAIN RESPONSIVE CONTENT AREA */}
      <div className="ss-main-area">
        
        {/* TOP BAR (Full Width across Content) */}
        <TopBar
          title="WorkHive — Household & Community Portal"
          subtitle="Direct Fair Labour Marketplace • Ward 4 Node"
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <LanguageSwitcher />

              {/* Locality Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                fontSize: '12px',
                fontWeight: 600
              }}>
                <MapPin size={13} color="var(--color-accent)" />
                <span>{displayLocation.split(',')[0]}</span>
              </div>

              {/* User Avatar Badge */}
              <Link to="/customer/profile" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-black)' }}>{displayName.split(' ')[0]}</div>
                    <div className="text-secondary" style={{ fontSize: '10px' }}>Member</div>
                  </div>
                </div>
              </Link>
            </div>
          }
        />

        {/* PAGE CONTENT CONTAINER */}
        <main className="ss-content-container">
          {renderContent()}
        </main>

        {/* MOBILE BOTTOM TAB BAR (Visible only on <768px screens) */}
        <BottomTabBar
          tabs={customerMobileTabs}
          activeTab={activeTab}
          onChange={handleMobileTabChange}
        />

      </div>
    </div>
  );
};

export default CustomerShell;
