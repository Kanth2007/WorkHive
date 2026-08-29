import React, { useState, useEffect } from 'react';
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
  Star,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useCustomer } from '../context/CustomerContext';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { servicesAPI, workersAPI } from '../../../services/api';

const categoryIconMap = {
  plumber: Wrench,
  electrician: Zap,
  cleaning: Sparkles,
  carpenter: Hammer,
  painter: Paintbrush,
  caregiver: HeartPulse,
  gardener: Sprout,
  technician: Cpu,
  driver: Car,
  helper: Home
};

const categoryEmojiMap = {
  plumber: '🔧',
  electrician: '⚡',
  cleaning: '✨',
  carpenter: '🪚',
  painter: '🎨',
  caregiver: '🩺',
  gardener: '🌱',
  technician: '⚙️',
  driver: '🚗',
  helper: '🏠'
};

export const CustomerHome = () => {
  const { user, updateUser, bookings } = useCustomer();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const displayName = currentUser?.name || user.name || 'Member';
  const displayLocation = currentUser?.locality || user.location || 'Ward 4, Chennai';

  // Fetch live services and live workers count from MongoDB
  useEffect(() => {
    const loadServicesAndCounts = async () => {
      try {
        setLoadingServices(true);
        const [servicesRes, workersRes] = await Promise.allSettled([
          servicesAPI.getAll(),
          workersAPI.getAll()
        ]);

        const allWorkers = workersRes.status === 'fulfilled' && workersRes.value.success ? workersRes.value.data : [];

        if (servicesRes.status === 'fulfilled' && servicesRes.value.success && Array.isArray(servicesRes.value.data)) {
          const mapped = servicesRes.value.data.map(s => {
            const count = allWorkers.filter(w =>
              (w.skill && w.skill.toLowerCase().includes(s.title.toLowerCase().split(' ')[0])) ||
              (w.skills && w.skills.some(sk => sk.toLowerCase().includes(s.title.toLowerCase().split(' ')[0])))
            ).length;

            return {
              id: s.serviceId || s._id,
              name: s.title,
              desc: s.description,
              baseRate: s.baseRate,
              emoji: s.emoji || categoryEmojiMap[s.serviceId] || '🔧',
              Icon: categoryIconMap[s.serviceId] || Wrench,
              count: count > 0 ? `${count} Available` : 'Available on Demand'
            };
          });
          setServices(mapped);
        }
      } catch (err) {
        console.warn('Error fetching live services from MongoDB:', err);
      } finally {
        setLoadingServices(false);
      }
    };

    loadServicesAndCounts();
  }, []);

  const popularLocations = [
    'Ward 4, Adyar, Chennai',
    'Besant Nagar, Chennai',
    'Kasturba Nagar, Chennai',
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
            Find trusted, background-cleared cooperative workers in {displayLocation}
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

      {/* LOCATION SELECTOR MODAL */}
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
                  placeholder="e.g. Ward 4, Adyar, T. Nagar"
                  value={newLocationInput}
                  onChange={(e) => setNewLocationInput(e.target.value)}
                />
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => handleSaveLocation(newLocationInput.trim() || 'Ward 4, Chennai')}
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

      {/* 2. EMERGENCY SOS DISPATCH BANNER */}
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
          boxShadow: '0 4px 12px rgba(255, 77, 79, 0.15)'
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
            flexShrink: 0
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

      {/* 3. COOPERATIVE SERVICES CATALOG (LIVE FROM MONGODB) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-xs)' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold' }}>All Cooperative Services</h2>
          <span className="text-secondary" style={{ fontSize: '12px' }}>Live MongoDB Catalog</span>
        </div>

        {loadingServices ? (
          <div style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
            <Loader2 size={24} className="ss-spinner" style={{ animation: 'spin 1s linear infinite' }} />
            <p className="text-secondary" style={{ fontSize: '13px', marginTop: 8 }}>Loading live catalog...</p>
          </div>
        ) : (
          <div className="ss-category-grid">
            {services.map((category) => (
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
        )}
      </div>

      {/* 4. RECENT SERVICE ACTIVITY */}
      {bookings && bookings.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-xs)' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 'bold' }}>My Recent Bookings</h2>
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
