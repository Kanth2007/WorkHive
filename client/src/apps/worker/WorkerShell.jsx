import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import {
  Home,
  Briefcase,
  Wallet,
  HeartHandshake,
  UserCheck,
  Vote,
  ShieldCheck,
  Power,
  LogOut,
  Sparkles,
  MapPin
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import BottomTabBar from '../../components/BottomTabBar';
import Badge from '../../components/Badge';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useWorker } from './context/WorkerContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI } from '../../services/api';

// Worker Views
import WorkerDashboard from './pages/WorkerDashboard';
import WorkerJobs from './pages/WorkerJobs';
import WorkerEarnings from './pages/WorkerEarnings';
import WorkerWelfare from './pages/WorkerWelfare';
import CooperativeVoting from './pages/CooperativeVoting';
import SkillProfile from './pages/SkillProfile';

export const WorkerShell = ({ children, title = 'Worker Partner' }) => {
  const { worker, toggleAvailability } = useWorker();
  const { currentUser, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    const p = location.pathname.toLowerCase();
    if (p.includes('/jobs') || p.includes('/job-request') || p.includes('/job-management')) return 'jobs';
    if (p.includes('/earnings')) return 'earnings';
    if (p.includes('/welfare') || p.includes('/cooperative')) return 'welfare';
    if (p.includes('/voting')) return 'voting';
    if (p.includes('/profile') || p.includes('/verification')) return 'profile';
    return 'home';
  };

  const activeTab = getActiveTab();

  const [navStats, setNavStats] = useState({ pendingJobs: 0, earnings: 0 });

  useEffect(() => {
    const activeWorkerId = worker.workerId || currentUser?.userId;
    if (!activeWorkerId) return;

    bookingsAPI.getAll({ workerId: activeWorkerId }).then(res => {
      if (res.success && Array.isArray(res.data)) {
        const pending = res.data.filter(b => ['pending', 'accepted', 'in_progress'].includes(b.status)).length;
        const completed = res.data.filter(b => ['completed', 'paid', 'rated'].includes(b.status));
        const earned = Math.round(completed.reduce((sum, b) => sum + (Number(b.amount) || 0), 0) * 0.9);
        setNavStats({ pendingJobs: pending, earnings: earned });
      }
    }).catch(() => {});
  }, [worker.workerId, currentUser?.userId]);

  // Desktop Sidebar Navigation Items
  const workerNav = [
    { id: 'home', label: 'Dashboard & Online', icon: Home, path: '/worker/dashboard' },
    {
      id: 'jobs',
      label: 'Active Jobs & Dispatch',
      icon: Briefcase,
      badge: navStats.pendingJobs > 0 ? `${navStats.pendingJobs} New` : undefined,
      path: '/worker/jobs'
    },
    {
      id: 'earnings',
      label: 'Earnings & UPI Ledger',
      icon: Wallet,
      badge: navStats.earnings > 0 ? `₹${navStats.earnings.toLocaleString()}` : undefined,
      path: '/worker/earnings'
    },
    { id: 'welfare', label: 'Cooperative Welfare', icon: HeartHandshake, path: '/worker/welfare' },
    { id: 'voting', label: '🗳️ Member Voting', icon: Vote, path: '/worker/voting' },
    { id: 'profile', label: 'Skill Profile & Schedule', icon: UserCheck, path: '/worker/profile' }
  ];

  // Mobile Bottom Tab Bar Items
  const workerMobileTabs = [
    { id: 'home', label: t('home', 'Home'), icon: Home },
    { id: 'jobs', label: t('jobs', 'Jobs'), icon: Briefcase },
    { id: 'earnings', label: t('earnings', 'Earnings'), icon: Wallet },
    { id: 'welfare', label: t('welfare', 'Welfare'), icon: HeartHandshake },
    { id: 'profile', label: t('profile', 'Profile'), icon: UserCheck }
  ];

  const handleSelectNav = (tabId) => {
    const item = workerNav.find((n) => n.id === tabId);
    if (item) navigate(item.path);
  };

  const handleMobileTabChange = (tabId) => {
    if (tabId === 'home') navigate('/worker/dashboard');
    if (tabId === 'jobs') navigate('/worker/jobs');
    if (tabId === 'earnings') navigate('/worker/earnings');
    if (tabId === 'welfare') navigate('/worker/welfare');
    if (tabId === 'voting') navigate('/worker/voting');
    if (tabId === 'profile') navigate('/worker/profile');
  };

  const renderContent = () => {
    if (children) return children;
    switch (activeTab) {
      case 'jobs':
        return <WorkerJobs />;
      case 'earnings':
        return <WorkerEarnings />;
      case 'welfare':
        return <WorkerWelfare />;
      case 'voting':
        return <CooperativeVoting />;
      case 'profile':
        return <SkillProfile />;
      case 'home':
      default:
        return <WorkerDashboard />;
    }
  };

  const displayName = currentUser?.name || worker.name || 'Worker Member';
  const displaySkill = currentUser?.skill || worker.skill || worker.skills?.[0] || 'General Services';

  return (
    <div className="ss-app-shell">
      
      {/* 1. DESKTOP SIDEBAR (Matches Admin Reference) */}
      <Sidebar
        brandName="Sahakari Seva"
        brandSub="Worker Partner Portal"
        navItems={workerNav}
        activeItem={activeTab}
        onSelect={handleSelectNav}
        footerContent={
          <div>
            {/* Online / Offline Quick Toggle */}
            <button
              type="button"
              onClick={toggleAvailability}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                border: `1.5px solid ${worker.isOnline ? '#22C55E' : 'var(--color-border)'}`,
                background: worker.isOnline ? '#F0FDF4' : 'var(--color-bg)',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 'bold', color: worker.isOnline ? '#15803D' : 'var(--color-text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: worker.isOnline ? '#22C55E' : '#9E9E9E' }} />
                <span>{worker.isOnline ? 'Online (Ready)' : 'Offline (Paused)'}</span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-accent)' }}>Toggle</span>
            </button>

            <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-black)' }}>
              {displayName}
            </div>
            <div className="text-secondary" style={{ fontSize: '11px' }}>
              {displaySkill} • Ward 4 (#CLC-EL-402)
            </div>

            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link
                to="/login?role=worker"
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
                onClick={() => { logout(); navigate('/login?role=worker'); }}
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
          title="Worker Member Partner Portal"
          subtitle={`${displayName} • ${displaySkill} • Chennai Labour Cooperative Society`}
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <LanguageSwitcher />

              {/* Online / Offline Status Badge Button */}
              <button
                type="button"
                onClick={toggleAvailability}
                style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                title="Click to toggle availability"
              >
                <Badge variant={worker.isOnline ? 'success' : 'danger'}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: worker.isOnline ? '#22C55E' : '#EF4444' }} />
                    {worker.isOnline ? 'Online (Ready)' : 'Offline'}
                  </span>
                </Badge>
              </button>

              {/* Worker Avatar Badge */}
              <Link to="/worker/profile" style={{ textDecoration: 'none' }}>
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
                    background: 'var(--color-black)',
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
                    <div className="text-secondary" style={{ fontSize: '10px' }}>{displaySkill}</div>
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
          tabs={workerMobileTabs}
          activeTab={activeTab}
          onChange={handleMobileTabChange}
        />

      </div>
    </div>
  );
};

export default WorkerShell;
