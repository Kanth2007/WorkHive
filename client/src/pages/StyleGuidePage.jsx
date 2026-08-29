import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wrench,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Plus,
  ArrowRight,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Monitor,
  HardHat,
  Info,
  Calendar,
  DollarSign,
  User,
  Building2,
  Scale,
  Zap,
  TrendingUp,
  MapPin,
  Lock,
  LogOut,
  Vote,
  Layers,
  Flame,
  Check,
  ChevronDown
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  StarRating,
  EmptyState,
  LoadingState,
  TopBar,
  BottomTabBar,
  Sidebar
} from '../components';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useAuth } from '../context/AuthContext';

export const StyleGuidePage = () => {
  const navigate = useNavigate();
  const { isSessionValid, currentUser, activeRole, logout, getRoleSession } = useAuth();
  const [interactiveRating, setInteractiveRating] = useState(5);
  const [clickedCount, setClickedCount] = useState(0);

  // Protected navigation handler: redirect to login if session missing or expired
  const handleProtectedNavigate = (e, targetPath, requiredRole) => {
    if (e) e.preventDefault();
    if (isSessionValid(requiredRole)) {
      navigate(targetPath);
    } else {
      const rawSession = getRoleSession(requiredRole, false);
      const isExpired = rawSession && rawSession.expiresAt && Date.now() > rawSession.expiresAt;
      const target = encodeURIComponent(targetPath);
      navigate(`/login?role=${requiredRole}&redirect=${target}${isExpired ? '&expired=true' : ''}`);
    }
  };

  const stats = [
    { label: 'Direct Worker Take-Home', value: '₹28.46 Lakhs', change: '100% directly to workers', icon: DollarSign, color: '#16A34A' },
    { label: 'Verified Cooperative Members', value: '1,248', change: 'Ward 4 & Greater Chennai', icon: HardHat, color: 'var(--color-accent)' },
    { label: 'Private Intermediary Cut', value: '0.0%', change: 'Zero VC / investor extraction', icon: Scale, color: '#0284C7' },
    { label: 'Customer Satisfaction', value: '4.85 ★', change: 'Over 14,200 verified reviews', icon: StarRating, color: '#EAB308' }
  ];

  const appCards = [
    {
      id: 'customer',
      role: 'Customer Experience',
      icon: User,
      title: 'Find & Hire Verified Local Helpers',
      desc: 'Smart AI matching, real-time vector GPS tracking, fixed transparent pricing, and instant UPI checkout.',
      badge: 'Customer App',
      badgeVariant: 'active',
      accentColor: 'var(--color-accent)',
      demoPath: '/customer/home',
      features: ['AI Smart Match Ranking', 'Live Vector GPS Tracking', 'Emergency SOS Dispatch (12 min)', 'Cashless UPI Invoicing']
    },
    {
      id: 'worker',
      role: 'Worker / Member Experience',
      icon: HardHat,
      title: 'Direct Earnings & Democratic Welfare',
      desc: 'Instant job dispatch, location sharing toggle, daily ledger breakdown, and 1-worker 1-vote democratic governance.',
      badge: 'Worker App',
      badgeVariant: 'success',
      accentColor: '#16A34A',
      demoPath: '/worker/dashboard',
      features: ['Instant Job Accept Banner', 'Live Transit Stepper', 'Cooperative Welfare & Insurance', '🗳️ Member Voting Rights']
    },
    {
      id: 'admin',
      role: 'Cooperative Admin Experience',
      icon: Building2,
      title: 'Ward Operations & Society Governance',
      desc: 'Ward node telemetry, fleet map, AI demand curves, worker suspensions, and audited statutory ledgers.',
      badge: 'Admin Console',
      badgeVariant: 'neutral',
      accentColor: '#0284C7',
      demoPath: '/admin/dashboard',
      features: ['Fleet Geolocation Map', 'AI 7-Day Demand Curves', 'Grievance Resolution Desk', 'Audited Society Ledger']
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP CLEAN & MODERN PRODUCTION NAVIGATION BAR */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '14px var(--space-xl)',
        position: 'sticky',
        top: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-md)'
      }}>
        {/* Brand Logo & Details */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            background: 'white',
            border: '1.5px solid var(--color-border)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <img src="/logo.png" alt="WorkHive Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '19px', fontWeight: 'bold', margin: 0, lineHeight: 1.2, color: 'var(--color-black)', letterSpacing: '-0.01em' }}>
                WorkHive
              </span>
              <span style={{
                background: '#F0FDF4',
                color: '#15803D',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #BBF7D0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E' }} />
                Ward 4 Node
              </span>
            </div>
            <p className="text-secondary" style={{ fontSize: '11px', margin: 0, fontWeight: 500 }}>
              Chennai Labour Cooperative Society • TN-CHE-2024
            </p>
          </div>
        </Link>

        {/* Clean Center Navigation Links with Login Protection */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
          <a
            href="/customer/home"
            onClick={(e) => handleProtectedNavigate(e, '/customer/home', 'customer')}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-black)',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.15s ease'
            }}
          >
            Find Services
          </a>

          <a
            href="/worker/dashboard"
            onClick={(e) => handleProtectedNavigate(e, '/worker/dashboard', 'worker')}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.15s ease'
            }}
          >
            For Workers
          </a>

          <a
            href="/admin/dashboard"
            onClick={(e) => handleProtectedNavigate(e, '/admin/dashboard', 'admin')}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.15s ease'
            }}
          >
            Ward Admin
          </a>

          <a
            href="/worker/voting"
            onClick={(e) => handleProtectedNavigate(e, '/worker/voting', 'worker')}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.15s ease'
            }}
          >
            Cooperative Voting
          </a>
        </nav>

        {/* Right-Aligned Clean Action Buttons & Auth State */}
        <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
          <LanguageSwitcher />

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: '#F5F5F5',
                border: '1px solid var(--color-border)',
                fontSize: '12px',
                fontWeight: 600
              }}>
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'var(--color-black)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {currentUser.avatar || currentUser.name?.charAt(0) || 'U'}
                </span>
                <span>{currentUser.name}</span>
                <span style={{ fontSize: '10px', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                  ({currentUser.role})
                </span>
                <span style={{
                  fontSize: '9px',
                  background: '#DCFCE7',
                  color: '#166534',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700
                }}>
                  7d Active
                </span>
              </div>

              <Button
                variant="outline"
                size="small"
                icon={LogOut}
                onClick={() => logout(currentUser.role)}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outline"
                  size="small"
                  icon={Lock}
                >
                  Sign In
                </Button>
              </Link>

              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button
                  variant="primary"
                  size="small"
                  icon={Plus}
                >
                  Join Cooperative
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* 2. LANDING / HERO CONTENT */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: 'var(--space-xl) var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xxl)' }}>
        
        {/* HERO BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #111111 0%, #1A1A1A 50%, #241A14 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-xxl) var(--space-xl)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
        }}>
          {/* Ambient Background Glow */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 106, 0, 0.25) 0%, rgba(255, 106, 0, 0) 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '780px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 106, 0, 0.15)', border: '1px solid rgba(255, 106, 0, 0.4)', borderRadius: 'var(--radius-full)', padding: '4px 12px', marginBottom: 'var(--space-md)' }}>
              <Scale size={14} color="var(--color-accent)" />
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                Worker-Owned Alternative to Private Gig Monopolies
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 'bold', color: 'white', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 var(--space-md)' }}>
              Direct Fair Labour Marketplace for Chennai.
            </h1>

            <p style={{ fontSize: '18px', color: '#D4D4D4', lineHeight: 1.6, margin: '0 0 var(--space-xl)', maxWidth: '640px' }}>
              Connecting households with verified plumbers, electricians, and tradespeople. Workers receive 90% direct take-home pay, 10% welfare insurance, and 0% corporate broker margin.
            </p>

            {/* Quick Launch CTA Buttons with Login Protection */}
            <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                size="large"
                icon={ArrowRight}
                iconPosition="right"
                onClick={(e) => handleProtectedNavigate(e, '/customer/home', 'customer')}
              >
                Explore as Customer
              </Button>

              <Button
                variant="outline"
                size="large"
                icon={HardHat}
                style={{ background: 'rgba(255,255,255,0.08)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
                onClick={(e) => handleProtectedNavigate(e, '/worker/dashboard', 'worker')}
              >
                Worker Dashboard
              </Button>

              <Button
                variant="outline"
                size="large"
                icon={Building2}
                style={{ background: 'rgba(255,255,255,0.08)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
                onClick={(e) => handleProtectedNavigate(e, '/admin/dashboard', 'admin')}
              >
                Admin Console
              </Button>
            </div>
          </div>
        </div>

        {/* STATS STRIP */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-md)'
        }}>
          {stats.map((s, idx) => (
            <Card key={idx} padding="lg" style={{ border: '1px solid var(--color-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {s.label}
                </span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-black)', margin: '4px 0 2px' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '12px', color: s.color, fontWeight: 600 }}>
                {s.change}
              </div>
            </Card>
          ))}
        </div>

        {/* 3 APP EXPERIENCE SHOWCASE */}
        <div>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto var(--space-xl)' }}>
            <Badge variant="active" style={{ marginBottom: 6 }}>All 3 Integrated Roles</Badge>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px' }}>
              Three Synchronized Interfaces
            </h2>
            <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>
              A complete closed-loop ecosystem tested with real-time MongoDB data persistence.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-lg)'
          }}>
            {appCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.id}
                  padding="lg"
                  style={{
                    border: '1.5px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: card.accentColor
                      }}>
                        <Icon size={22} />
                      </div>
                      <Badge variant={card.badgeVariant}>
                        {card.badge}
                      </Badge>
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: 2 }}>
                      {card.role}
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 var(--space-xs)' }}>
                      {card.title}
                    </h3>
                    <p className="text-secondary" style={{ fontSize: '13px', lineHeight: 1.5, margin: '0 0 var(--space-md)' }}>
                      {card.desc}
                    </p>

                    {/* Feature Bullet Points */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 'var(--space-lg)' }}>
                      {card.features.map((feat, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 600 }}>
                          <Check size={14} color="#16A34A" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={(e) => handleProtectedNavigate(e, card.demoPath, card.id)}
                  >
                    Launch {card.role.split(' ')[0]} Flow
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 14-STEP JUDGE DEMO STORYBOARD RUNNER */}
        <Card padding="lg" style={{ border: '2px solid var(--color-black)', background: '#FAFAFA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <div>
              <Badge variant="active" style={{ marginBottom: 4 }}>Judge-Ready Presentation</Badge>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                14-Step Complete Demo Storyline
              </h3>
              <p className="text-secondary" style={{ fontSize: '13px', margin: '2px 0 0' }}>
                Walk through the complete lifecycle across Customer, Worker, and Admin views
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
              <Button
                variant="primary"
                size="small"
                icon={ArrowRight}
                iconPosition="right"
                onClick={(e) => handleProtectedNavigate(e, '/customer/search?category=plumber', 'customer')}
              >
                Start Step 1 (Book Plumber)
              </Button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-sm)',
            fontSize: '12px'
          }}>
            {[
              { step: '1', title: 'Customer Home', desc: 'Selects Plumbing service', role: 'customer', path: '/customer/home' },
              { step: '2', title: 'Service Search', desc: 'Types "Kitchen pipe leakage"', role: 'customer', path: '/customer/search?category=plumber' },
              { step: '3', title: 'Smart Match AI', desc: 'Ravi Kumar — 96% Match', role: 'customer', path: '/customer/matching' },
              { step: '4', title: 'Booking Confirmed', desc: 'Generates real MongoDB booking', role: 'customer', path: '/customer/bookings' },
              { step: '5', title: 'Worker Alert', desc: 'Job banner appears on dashboard', role: 'worker', path: '/worker/dashboard' },
              { step: '6', title: 'Location Sharing', desc: 'Taps "Start Sharing Location"', role: 'worker', path: '/worker/jobs' },
              { step: '7', title: 'Live GPS Tracking', desc: 'Customer sees moving dot on map', role: 'customer', path: '/customer/tracking' },
              { step: '8', title: 'Job Stepper', desc: 'Arrived → Working → Completed', role: 'worker', path: '/worker/job-management' },
              { step: '9', title: 'Payment & Invoice', desc: 'Pays ₹450 with zero margin', role: 'customer', path: '/customer/payments' },
              { step: '10', title: '5-Star Feedback', desc: 'Review saved in database', role: 'customer', path: '/customer/rating' },
              { step: '11', title: 'Worker Earnings', desc: '+₹450 added to worker balance', role: 'worker', path: '/worker/earnings' },
              { step: '12', title: 'Admin Bookings', desc: 'Table records full timeline', role: 'admin', path: '/admin/bookings' },
              { step: '13', title: 'Welfare & Voting', desc: 'Casts vote on 5% surplus proposal', role: 'worker', path: '/worker/voting' },
              { step: '14', title: 'Language Switch', desc: 'Instant toggle: EN / தமிழ் / हिन्दी', role: 'customer', path: '/customer/home' }
            ].map((item) => (
              <div
                key={item.step}
                onClick={(e) => handleProtectedNavigate(e, item.path, item.role)}
                style={{
                  background: 'white',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <div style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>Step {item.step}: {item.title}</div>
                <div className="text-secondary" style={{ fontSize: '11px', marginTop: 2 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* FOOTER */}
      <footer style={{
        marginTop: 'auto',
        background: 'white',
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-lg) var(--space-xl)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-black)' }}>
          WorkHive • Chennai Labour Cooperative Society
        </div>
        <div className="text-secondary" style={{ fontSize: '12px', marginTop: 2 }}>
          Audited Statutory Platform • Registered under Tamil Nadu Cooperative Societies Act
        </div>
      </footer>

    </div>
  );
};

export default StyleGuidePage;
