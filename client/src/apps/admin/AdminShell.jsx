import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Wrench,
  Calendar,
  AlertTriangle,
  Building2,
  TrendingUp,
  Settings,
  ShieldCheck,
  Bell,
  LogOut,
  MapPin
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import Badge from '../../components/Badge';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';

// Admin Page Views
import AdminDashboard from './pages/AdminDashboard';
import WorkerManagement from './pages/WorkerManagement';
import AllBookings from './pages/AllBookings';
import ComplaintsScreen from './pages/ComplaintsScreen';
import DemandForecast from './pages/DemandForecast';
import AdminMapScreen from './pages/AdminMapScreen';
import CooperativeEconomics from './pages/CooperativeEconomics';
import AdminSettings from './pages/AdminSettings';
import AdminServicesScreen from './pages/AdminServicesScreen';

export const AdminShell = ({ children, initialTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { currentUser, logout } = useAuth();
  const [adminStats, setAdminStats] = useState({
    totalWorkers: 0,
    totalServices: 0,
    todayJobs: 0,
    totalComplaints: 0
  });

  useEffect(() => {
    adminAPI.getStats().then(res => {
      if (res.success && res.data) {
        setAdminStats(res.data);
      }
    }).catch(err => console.warn('AdminShell stats load warning:', err.message));
  }, [location.pathname]);

  // Determine active item based on current URL path
  const getActiveItem = () => {
    const p = location.pathname.toLowerCase();
    if (p.includes('/admin/map')) return 'map';
    if (p.includes('/admin/workers') || p.includes('/admin/jobs')) return 'workers';
    if (p.includes('/admin/services')) return 'services';
    if (p.includes('/admin/bookings')) return 'bookings';
    if (p.includes('/admin/complaints')) return 'complaints';
    if (p.includes('/admin/cooperative')) return 'cooperative';
    if (p.includes('/admin/reports') || p.includes('/admin/forecast') || p.includes('/admin/forcas')) return 'reports';
    if (p.includes('/admin/settings')) return 'settings';
    return initialTab || 'dashboard';
  };

  const activeItem = getActiveItem();

  // Sidebar navigation items (Live Badges from MongoDB)
  const adminNav = [
    { id: 'dashboard', label: t('dashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'map', label: 'Fleet Map', icon: MapPin, badge: 'Live' },
    {
      id: 'workers',
      label: 'Workers',
      icon: Users,
      badge: adminStats.totalWorkers > 0 ? adminStats.totalWorkers.toString() : undefined
    },
    {
      id: 'services',
      label: 'Services Catalog',
      icon: Wrench,
      badge: adminStats.totalServices > 0 ? adminStats.totalServices.toString() : '8'
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      badge: adminStats.todayJobs > 0 ? adminStats.todayJobs.toString() : undefined
    },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: AlertTriangle,
      badge: adminStats.totalComplaints > 0 ? `${adminStats.totalComplaints} Open` : undefined
    },
    { id: 'cooperative', label: t('cooperative', 'Cooperative'), icon: Building2 },
    { id: 'reports', label: 'Reports / Forecast', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Route handlers for sidebar clicks
  const handleSelectNav = (id) => {
    switch (id) {
      case 'map':
        navigate('/admin/map');
        break;
      case 'workers':
        navigate('/admin/workers');
        break;
      case 'services':
        navigate('/admin/services');
        break;
      case 'bookings':
        navigate('/admin/bookings');
        break;
      case 'complaints':
        navigate('/admin/complaints');
        break;
      case 'cooperative':
        navigate('/admin/cooperative');
        break;
      case 'reports':
        navigate('/admin/forecast');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      case 'dashboard':
      default:
        navigate('/admin/dashboard');
        break;
    }
  };

  const renderContent = () => {
    if (children) return children;
    switch (activeItem) {
      case 'map':
        return <AdminMapScreen />;
      case 'workers':
        return <WorkerManagement />;
      case 'services':
        return <AdminServicesScreen />;
      case 'bookings':
        return <AllBookings />;
      case 'complaints':
        return <ComplaintsScreen />;
      case 'cooperative':
        return <CooperativeEconomics />;
      case 'reports':
        return <DemandForecast />;
      case 'settings':
        return <AdminSettings />;
      case 'dashboard':
      default:
        return <AdminDashboard />;
    }
  };

  const adminName = currentUser?.name || 'Administrator';
  const adminEmail = currentUser?.email || 'admin@chennailabour.coop';

  return (
    <div className="ss-app-shell">
      
      {/* 1. DESKTOP SIDEBAR */}
      <Sidebar
        brandName="Sahakari Seva"
        brandSub="Admin Control Tower"
        navItems={adminNav}
        activeItem={activeItem}
        onSelect={handleSelectNav}
        footerContent={
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-black)' }}>
              {adminName}
            </div>
            <div className="text-secondary" style={{ fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {adminEmail}
            </div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link
                to="/login?role=admin"
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
                onClick={() => {
                  logout();
                  navigate('/login?role=admin');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: '11px',
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  background: 'none',
                  border: 'none',
                  padding: 0
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
        
        {/* TOP BAR */}
        <TopBar
          title="Sahakari Seva Admin Tower"
          subtitle="Chennai Central District • Live MongoDB Telemetry"
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <LanguageSwitcher />

              {/* Status Indicator */}
              <Badge variant="success">
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                  Database Live
                </span>
              </Badge>

              {/* User Avatar */}
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-black)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 'bold'
              }}>
                {adminName.slice(0, 2).toUpperCase()}
              </div>
            </div>
          }
        />

        {/* PAGE CONTENT CONTAINER */}
        <main className="ss-content">
          {renderContent()}
        </main>
      </div>

    </div>
  );
};

export default AdminShell;
