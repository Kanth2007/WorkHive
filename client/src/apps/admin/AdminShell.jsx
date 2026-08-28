import React from 'react';
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
import { useDemoStore } from '../../context/DemoStoreContext';
import { useAuth } from '../../context/AuthContext';

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
  const { resetDemoData } = useDemoStore();
  const { currentUser, logout } = useAuth();

  // Determine active item based on current URL path
  const getActiveItem = () => {
    const p = location.pathname;
    if (p.includes('/admin/map')) return 'map';
    if (p.includes('/admin/workers') || p.includes('/admin/jobs')) return 'workers';
    if (p.includes('/admin/services')) return 'services';
    if (p.includes('/admin/bookings')) return 'bookings';
    if (p.includes('/admin/complaints')) return 'complaints';
    if (p.includes('/admin/cooperative')) return 'cooperative';
    if (p.includes('/admin/reports') || p.includes('/admin/forecast')) return 'reports';
    if (p.includes('/admin/settings')) return 'settings';
    return initialTab || 'dashboard';
  };

  const activeItem = getActiveItem();

  // Sidebar navigation items
  const adminNav = [
    { id: 'dashboard', label: t('dashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'map', label: 'Fleet Map', icon: MapPin, badge: 'Live' },
    { id: 'workers', label: 'Workers', icon: Users, badge: '1,248' },
    { id: 'services', label: 'Services Catalog', icon: Wrench, badge: '10' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, badge: '428' },
    { id: 'complaints', label: 'Complaints', icon: AlertTriangle, badge: '2 Open' },
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
      case 'reports':
        return <DemandForecast />;
      case 'cooperative':
        return <CooperativeEconomics />;
      case 'settings':
        return <AdminSettings />;
      case 'dashboard':
      default:
        return <AdminDashboard />;
    }
  };


  const officerName = currentUser?.name || 'Meenakshi S.';
  const initials = officerName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'MS';

  return (
    <div className="ss-app-shell">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar
        brandName="Sahakari Seva"
        brandSub="Cooperative Admin Console"
        navItems={adminNav}
        activeItem={activeItem}
        onSelect={handleSelectNav}
        footerContent={
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-black)' }}>
              Chennai Labour Society
            </div>
            <div className="text-secondary" style={{ fontSize: '11px' }}>
              Ward 4 Node (#TN-CHE-2024)
            </div>
            
            {/* Quick Reset Demo Tool & Sign Out in Footer */}
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  alert('✓ Demo Data Reset! All live bookings and worker metrics restored to initial state.');
                }}
                style={{
                  fontSize: '11px',
                  color: 'var(--color-accent)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  padding: 0
                }}
                title="Reset live demo data for fresh judge run"
              >
                🔄 Reset Data
              </button>
              <span className="text-secondary" style={{ fontSize: '11px' }}>•</span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login?role=admin');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '11px',
                  color: 'var(--color-danger)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
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

      {/* 2. MAIN DESKTOP CONTENT AREA */}
      <div className="ss-main-area">
        
        {/* TOP BAR SHOWING ADMIN'S COOPERATIVE NAME */}
        <TopBar
          title="Chennai Central Labour Cooperative Society"
          subtitle="Ward 4 Operations Desk • Registered under Tamil Nadu Cooperative Societies Act"
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <LanguageSwitcher />

              <Badge variant="success">
                <ShieldCheck size={14} style={{ marginRight: 4 }} />
                <span>Node 4 Active</span>
              </Badge>

              <Link to="/admin/settings" style={{ textDecoration: 'none' }}>
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
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--color-black)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-black)' }}>{officerName}</div>
                    <div className="text-secondary" style={{ fontSize: '10px' }}>Ward Officer</div>
                  </div>
                </div>
              </Link>
            </div>
          }
        />

        <main className="ss-content-container">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
