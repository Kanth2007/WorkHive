import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Sparkles,
  HeartPulse,
  Car,
  Sprout,
  Home,
  Cpu,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Search,
  Flame,
  Star
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useCustomer } from '../context/CustomerContext';
import { useLanguage } from '../../../context/LanguageContext';

export const CustomerHome = () => {
  const { user, updateUser, bookings } = useCustomer();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const displayName = user.name || 'Friend';
  const displayLocation = user.location || 'Adyar, Chennai';

  // 10 Service Categories
  const categories = [
    {
      id: 'electrician',
      name: 'Electrician',
      icon: Zap,
      emoji: '⚡',
      count: '14 Available',
      desc: 'Wiring, fan fitting, MCB switches',
      accentColor: '#FF6A00'
    },
    {
      id: 'plumber',
      name: 'Plumber',
      icon: Wrench,
      emoji: '🔧',
      count: '9 Available',
      desc: 'Taps, leakages, tank pipeline',
      accentColor: '#0284C7'
    },
    {
      id: 'carpenter',
      name: 'Carpenter',
      icon: Hammer,
      emoji: '🪚',
      count: '7 Available',
      desc: 'Furniture, lock, wooden doors',
      accentColor: '#B45309'
    },
    {
      id: 'painter',
      name: 'Painter',
      icon: Paintbrush,
      emoji: '🎨',
      count: '11 Available',
      desc: 'Wall touch-up, full painting',
      accentColor: '#7C3AED'
    },
    {
      id: 'cleaner',
      name: 'Cleaner',
      icon: Sparkles,
      emoji: '🧹',
      count: '18 Available',
      desc: 'Deep cleaning, floor & bathroom',
      accentColor: '#059669'
    },
    {
      id: 'caregiver',
      name: 'Caregiver',
      icon: HeartPulse,
      emoji: '👩‍⚕️',
      count: '6 Available',
      desc: 'Elder daytime care, medicine',
      accentColor: '#DB2777'
    },
    {
      id: 'driver',
      name: 'Driver',
      icon: Car,
      emoji: '🚗',
      count: '12 Available',
      desc: 'Daily commute, airport, outstation',
      accentColor: '#2563EB'
    },
    {
      id: 'gardener',
      name: 'Gardener',
      icon: Sprout,
      emoji: '🌱',
      count: '5 Available',
      desc: 'Lawn care, pruning, soil fertilizing',
      accentColor: '#16A34A'
    },
    {
      id: 'helper',
      name: 'Domestic Helper',
      icon: Home,
      emoji: '🏠',
      count: '15 Available',
      desc: 'Kitchen help, household chores',
      accentColor: '#D97706'
    },
    {
      id: 'technician',
      name: 'Technician',
      icon: Cpu,
      emoji: '🔧',
      count: '8 Available',
      desc: 'AC gas, fridge, microwave, RO',
      accentColor: '#4F46E5'
    }
  ];

  const popularLocations = [
    'Adyar, Chennai',
    'Besant Nagar, Chennai',
    'T. Nagar, Chennai',
    'Anna Nagar, Chennai',
    'Velachery, Chennai',
    'Mylapore, Chennai'
  ];

  const handleSelectCategory = (categoryId) => {
    navigate(`/customer/search?category=${encodeURIComponent(categoryId)}`);
  };

  const handleEmergencyClick = () => {
    navigate('/customer/emergency');
  };

  const handleSaveLocation = (loc) => {
    updateUser({ location: loc });
    setIsChangingLocation(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/customer/search?category=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/customer/search');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-lg)' }}>
      
      {/* 1. HERO GREETING & SEARCH BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #111111 0%, #1F1F1F 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
      }}>
        {/* Subtle Ambient Accent Glow */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-20%',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 106, 0, 0.35) 0%, rgba(255, 106, 0, 0) 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
              Chennai Labour Cooperative Society
            </span>
            <span style={{ background: 'rgba(255,255,255,0.12)', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
              {user.userCategory === 'institution' ? 'Institution' : 'Household Member'}
            </span>
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', margin: '4px 0 2px', letterSpacing: '-0.01em' }}>
            Namaste, {displayName}!
          </h1>

          <p style={{ fontSize: '13px', color: '#D4D4D4', margin: '0 0 var(--space-md)' }}>
            Find trusted, background-cleared workers in Ward 4
          </p>

          {/* Tappable Location Pill */}
          <button
            type="button"
            onClick={() => setIsChangingLocation(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              color: 'white',
              marginBottom: 'var(--space-md)'
            }}
            title="Click to change service neighborhood"
          >
            <MapPin size={13} color="var(--color-accent)" />
            <span>{displayLocation}</span>
            <span style={{ opacity: 0.7, fontSize: '10px' }}>(Change)</span>
          </button>

          {/* 1-Tap Quick Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              className="ss-input"
              style={{
                background: 'white',
                color: 'var(--color-black)',
                paddingLeft: '38px',
                paddingRight: '38px',
                minHeight: '44px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px'
              }}
              placeholder="Search electrician, plumber, cleaner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 12, top: 14 }} />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: 8,
                top: 8,
                background: 'var(--color-black)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* LOCATION SELECTOR MODAL / SHEET */}
      {isChangingLocation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--color-white)',
            width: '100%',
            maxWidth: '440px',
            borderRadius: '16px 16px 0 0',
            padding: 'var(--space-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 -8px 24px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Change Service Neighborhood</h3>
              <button
                type="button"
                onClick={() => setIsChangingLocation(false)}
                style={{ padding: 4, cursor: 'pointer', background: 'none', border: 'none' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="ss-form-group" style={{ marginBottom: 0 }}>
              <label className="ss-label">Enter area or neighborhood:</label>
              <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                <input
                  type="text"
                  className="ss-input"
                  placeholder="e.g. Adyar, T. Nagar"
                  value={newLocationInput}
                  onChange={(e) => setNewLocationInput(e.target.value)}
                />
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => handleSaveLocation(newLocationInput.trim() || 'Adyar, Chennai')}
                >
                  Save
                </Button>
              </div>
            </div>

            <div>
              <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 700, marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>
                Popular Service Wards:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                {popularLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleSaveLocation(loc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px var(--space-md)',
                      background: loc === displayLocation ? 'var(--color-accent-subtle)' : 'var(--color-bg)',
                      border: `1px solid ${loc === displayLocation ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{loc}</span>
                    {loc === displayLocation && <Check size={16} color="var(--color-accent)" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROMINENT EMERGENCY SOS DISPATCH BANNER */}
      <button
        type="button"
        onClick={handleEmergencyClick}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #FFF1F0 0%, #FFE4E2 100%)',
          border: '1.5px solid #FF4D4F',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 'var(--space-md)',
          boxShadow: '0 4px 12px rgba(255, 77, 79, 0.15)',
          transition: 'transform 0.15s ease'
        }}
        aria-label="Request Emergency Urgent Service"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            background: '#D93025',
            color: 'var(--color-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(217, 48, 37, 0.3)'
          }}>
            🚨
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#D93025' }}>
                {t('emergency', 'Emergency SOS Dispatch')}
              </span>
              <span style={{
                background: '#D93025',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                padding: '1px 6px',
                borderRadius: '4px'
              }}>
                12-MIN ETA
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#666666', marginTop: 2 }}>
              Immediate response for pipe burst, power outage, sparks, or lockout
            </div>
          </div>
        </div>

        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'rgba(217, 48, 37, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D93025',
          flexShrink: 0
        }}>
          <ArrowRight size={18} strokeWidth={2.5} />
        </div>
      </button>

      {/* 3. 10 SERVICE CATEGORIES GRID */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-xs)' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold' }}>All Cooperative Services</h2>
          <span className="text-secondary" style={{ fontSize: '12px' }}>Tap to browse verified helpers</span>
        </div>

        <div className="ss-category-grid">

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleSelectCategory(category.id)}
              style={{
                background: 'var(--color-white)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                cursor: 'pointer',
                minHeight: '105px',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease'
              }}
              className="ss-category-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px'
                }}>
                  <span>{category.emoji}</span>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  {category.count}
                </span>
              </div>

              <div style={{ marginTop: 'var(--space-xs)', width: '100%' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-black)', lineHeight: 1.2 }}>
                  {category.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {category.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. RECENT SERVICE HISTORY */}
      {bookings && bookings.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-xs)' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 'bold' }}>Recent Service Activity</h2>
            <button
              type="button"
              onClick={() => navigate('/customer/bookings')}
              style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View All ({bookings.length}) →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {bookings.slice(0, 2).map((b) => (
              <Card
                key={b.id}
                padding="sm"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/customer/bookings')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{b.service}</span>
                      <Badge variant={b.status === 'in-progress' ? 'active' : 'success'} style={{ fontSize: '10px' }}>
                        {b.statusLabel || 'Completed'}
                      </Badge>
                    </div>
                    <div className="text-secondary" style={{ fontSize: '12px', marginTop: 2 }}>
                      {b.worker} • {b.date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{b.fee}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 600 }}>
                      Verified ✓
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 5. COOPERATIVE TRANSPARENCY ASSURANCE */}
      <div style={{
        background: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)'
      }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: 'var(--color-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldCheck size={20} color="var(--color-success)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Cooperative Direct Fair Rates</div>
          <div className="text-secondary" style={{ fontSize: '12px' }}>
            100% direct payment to verified workers with zero corporate commission extraction.
          </div>
        </div>
      </div>

    </div>
  );
};

export default CustomerHome;
