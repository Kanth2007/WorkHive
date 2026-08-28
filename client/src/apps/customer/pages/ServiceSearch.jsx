import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  MapPin,
  Calendar,
  Clock,
  User,
  Users,
  Search,
  Sparkles,
  ShieldCheck,
  X,
  Check,
  ChevronRight,
  Sliders
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useCustomer } from '../context/CustomerContext';

const allCategories = [
  { id: 'electrician', name: 'Electrician', emoji: '⚡', defaultFee: '₹250 fixed visit fee', desc: 'Wiring, switches, fuse, appliances' },
  { id: 'plumber', name: 'Plumber', emoji: '🔧', defaultFee: '₹300 fixed visit fee', desc: 'Taps, leakages, pipeline, tank' },
  { id: 'carpenter', name: 'Carpenter', emoji: '🪚', defaultFee: '₹300 fixed visit fee', desc: 'Furniture, lock fitting, wooden doors' },
  { id: 'painter', name: 'Painter', emoji: '🎨', defaultFee: '₹400 / room', desc: 'Wall touch-up, waterproofing, painting' },
  { id: 'cleaner', name: 'Cleaner', emoji: '🧹', defaultFee: '₹350 / session', desc: 'Deep house cleaning, kitchen & bath' },
  { id: 'caregiver', name: 'Caregiver', emoji: '👩‍⚕️', defaultFee: '₹450 / day', desc: 'Elder daytime care, walking, medicine' },
  { id: 'driver', name: 'Driver', emoji: '🚗', defaultFee: '₹350 / 4 hrs', desc: 'City driving, airport, outstation' },
  { id: 'gardener', name: 'Gardener', emoji: '🌱', defaultFee: '₹280 / session', desc: 'Lawn trimming, soil preparation, watering' },
  { id: 'helper', name: 'Domestic Helper', emoji: '🏠', defaultFee: '₹300 / day', desc: 'Kitchen assist, dusting, household help' },
  { id: 'technician', name: 'Technician', emoji: '🔧', defaultFee: '₹350 fixed visit fee', desc: 'AC, refrigerator, microwave, RO repair' }
];

export const ServiceSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useCustomer();

  // Selected Category
  const paramCategory = searchParams.get('category') || 'electrician';
  const [selectedCategory, setSelectedCategory] = useState(paramCategory);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Filter States
  const [locationName, setLocationName] = useState(user.location || 'Adyar, Chennai');
  const [radiusKm, setRadiusKm] = useState(5);
  const [selectedDate, setSelectedDate] = useState('Today'); // 'Today' | 'Tomorrow' | custom string
  const [selectedTime, setSelectedTime] = useState('Now'); // 'Now' | '9 AM – 12 PM' | '12 PM – 3 PM' | '3 PM – 6 PM' | '6 PM – 9 PM'
  const [genderPreference, setGenderPreference] = useState('any'); // 'any' | 'male' | 'female'

  // Bottom Sheet Modal Control ('location' | 'date' | 'time' | null)
  const [activeSheet, setActiveSheet] = useState(null);

  const currentCategoryData = allCategories.find((c) => c.id === selectedCategory) || allCategories[0];

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSearchParams({ category: catId });
    setIsCategoryOpen(false);
  };

  const handleFindWorkers = () => {
    const params = new URLSearchParams({
      category: selectedCategory,
      location: locationName,
      radius: radiusKm.toString(),
      date: selectedDate,
      time: selectedTime,
      gender: genderPreference
    });
    navigate(`/customer/matching?${params.toString()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP BAR NAVIGATION */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <button
          type="button"
          onClick={() => navigate('/customer/home')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-white)',
            cursor: 'pointer'
          }}
          aria-label="Back to Home"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Find Service Worker</h1>
          <p className="text-secondary" style={{ fontSize: '12px' }}>
            Society verified helpers in {locationName}
          </p>
        </div>
      </div>

      {/* 2. EDITABLE SERVICE CATEGORY DROPDOWN */}
      <div style={{ position: 'relative' }}>
        <label className="ss-label" style={{ marginBottom: '6px', display: 'block' }}>
          Service Category
        </label>
        <button
          type="button"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          style={{
            width: '100%',
            background: 'var(--color-white)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: '24px' }}>{currentCategoryData.emoji}</span>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 'bold', color: 'var(--color-black)' }}>
                {currentCategoryData.name}
              </div>
              <div className="text-secondary" style={{ fontSize: '12px' }}>
                {currentCategoryData.defaultFee} • {currentCategoryData.desc}
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--color-accent)',
            fontSize: '13px',
            fontWeight: 600
          }}>
            <span>Change</span>
            <ChevronDown size={18} />
          </div>
        </button>

        {/* Dropdown Menu (All 10 Categories) */}
        {isCategoryOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '6px',
            background: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            zIndex: 100,
            maxHeight: '340px',
            overflowY: 'auto'
          }}>
            {allCategories.map((cat) => {
              const isSelected = cat.id === selectedCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  style={{
                    width: '100%',
                    padding: '12px var(--space-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isSelected ? 'var(--color-accent-subtle)' : 'var(--color-white)',
                    borderBottom: '1px solid var(--color-border)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <span style={{ fontSize: '20px' }}>{cat.emoji}</span>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 'bold', color: isSelected ? 'var(--color-accent)' : 'var(--color-black)' }}>
                        {cat.name}
                      </div>
                      <div className="text-secondary" style={{ fontSize: '12px' }}>{cat.defaultFee}</div>
                    </div>
                  </div>
                  {isSelected && <Check size={18} color="var(--color-accent)" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. THREE SIMPLE SELECTORS (ONE PER ROW) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <label className="ss-label" style={{ margin: '4px 0 0' }}>
          Booking Details
        </label>

        {/* Row 1: Location & Search Radius */}
        <button
          type="button"
          onClick={() => setActiveSheet('location')}
          style={{
            width: '100%',
            background: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-black)'
            }}>
              <MapPin size={20} color="var(--color-accent)" />
            </div>
            <div>
              <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>
                SERVICE LOCATION & RADIUS
              </div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--color-black)' }}>
                {locationName}
              </div>
              <div className="text-secondary" style={{ fontSize: '12px' }}>
                Search radius: Within {radiusKm} km
              </div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--color-text-secondary)" />
        </button>

        {/* Row 2: Service Date */}
        <button
          type="button"
          onClick={() => setActiveSheet('date')}
          style={{
            width: '100%',
            background: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-black)'
            }}>
              <Calendar size={20} />
            </div>
            <div>
              <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>
                DATE OF SERVICE
              </div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--color-black)' }}>
                {selectedDate === 'Today' ? 'Today (Fastest response)' : selectedDate === 'Tomorrow' ? 'Tomorrow' : selectedDate}
              </div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--color-text-secondary)" />
        </button>

        {/* Row 3: Time Slot */}
        <button
          type="button"
          onClick={() => setActiveSheet('time')}
          style={{
            width: '100%',
            background: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-black)'
            }}>
              <Clock size={20} />
            </div>
            <div>
              <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>
                TIME SLOT
              </div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--color-black)' }}>
                {selectedTime === 'Now' ? 'Now (Within 45 mins)' : selectedTime}
              </div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--color-text-secondary)" />
        </button>
      </div>

      {/* 4. OPTIONAL GENDER PREFERENCE TOGGLE */}
      <div style={{
        background: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
          <label className="ss-label" style={{ margin: 0 }}>
            Worker Preference (Optional)
          </label>
          <span className="text-secondary" style={{ fontSize: '12px' }}>
            Useful for caregiving & cleaning
          </span>
        </div>

        <div className="ss-toggle-group" style={{ marginTop: 'var(--space-xs)' }}>
          <button
            type="button"
            className={`ss-toggle-btn ${genderPreference === 'any' ? 'active' : ''}`}
            onClick={() => setGenderPreference('any')}
          >
            <Users size={16} />
            <span>Any Helper</span>
          </button>
          <button
            type="button"
            className={`ss-toggle-btn ${genderPreference === 'female' ? 'active' : ''}`}
            onClick={() => setGenderPreference('female')}
          >
            <User size={16} />
            <span>Female Helper</span>
          </button>
          <button
            type="button"
            className={`ss-toggle-btn ${genderPreference === 'male' ? 'active' : ''}`}
            onClick={() => setGenderPreference('male')}
          >
            <User size={16} />
            <span>Male Helper</span>
          </button>
        </div>
      </div>

      {/* 5. PRICE TRANSPARENCY BANNER */}
      <div style={{
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)'
      }}>
        <ShieldCheck size={22} color="var(--color-success)" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Cooperative Fixed Rate Guarantee</div>
          <div className="text-secondary" style={{ fontSize: '12px' }}>
            Fixed standard society rate: <strong>{currentCategoryData.defaultFee}</strong>. Pay after job is completed.
          </div>
        </div>
      </div>

      {/* 6. BIG "FIND WORKERS" PRIMARY BUTTON */}
      <div style={{ marginTop: 'var(--space-sm)' }}>
        <Button
          variant="primary"
          size="large"
          icon={Sparkles}
          iconPosition="left"
          fullWidth
          onClick={handleFindWorkers}
        >
          Find Available Workers
        </Button>
      </div>

      {/* ====================================================================
          BOTTOM SHEETS FOR EACH SELECTOR
          ==================================================================== */}

      {/* Bottom Sheet: Location & Radius */}
      {activeSheet === 'location' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.45)',
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
            gap: 'var(--space-md)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px' }}>Location & Search Radius</h3>
              <button
                type="button"
                onClick={() => setActiveSheet(null)}
                style={{ padding: 4, cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Neighborhood / Area</label>
              <input
                type="text"
                className="ss-input"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Adyar, Chennai"
              />
            </div>

            <div>
              <label className="ss-label" style={{ display: 'block', marginBottom: '8px' }}>
                Search Radius: {radiusKm} km
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                {[2, 5, 10, 15].map((km) => (
                  <button
                    key={km}
                    type="button"
                    onClick={() => setRadiusKm(km)}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      borderRadius: 'var(--radius-md)',
                      background: radiusKm === km ? 'var(--color-black)' : 'var(--color-bg)',
                      color: radiusKm === km ? 'var(--color-white)' : 'var(--color-black)',
                      border: `1px solid ${radiusKm === km ? 'var(--color-black)' : 'var(--color-border)'}`,
                      fontWeight: 'bold',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    {km} km
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={() => setActiveSheet(null)}
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Sheet: Date Selection */}
      {activeSheet === 'date' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.45)',
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
            gap: 'var(--space-md)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px' }}>Select Date</h3>
              <button
                type="button"
                onClick={() => setActiveSheet(null)}
                style={{ padding: 4, cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {[
                { id: 'Today', label: 'Today', sub: 'Fastest availability' },
                { id: 'Tomorrow', label: 'Tomorrow', sub: 'Scheduled advance booking' },
                { id: 'This Weekend (Saturday)', label: 'This Saturday', sub: 'Weekend slot' },
                { id: 'This Weekend (Sunday)', label: 'This Sunday', sub: 'Weekend slot' }
              ].map((d) => {
                const isSelected = selectedDate === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d.id);
                      setActiveSheet(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--color-accent-subtle)' : 'var(--color-bg)',
                      border: `1.5px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '15px', color: isSelected ? 'var(--color-accent)' : 'var(--color-black)' }}>
                        {d.label}
                      </div>
                      <div className="text-secondary" style={{ fontSize: '12px' }}>{d.sub}</div>
                    </div>
                    {isSelected && <Check size={18} color="var(--color-accent)" strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet: Time Slot Selection */}
      {activeSheet === 'time' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.45)',
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
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px' }}>Select Preferred Time</h3>
              <button
                type="button"
                onClick={() => setActiveSheet(null)}
                style={{ padding: 4, cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {[
                { id: 'Now', label: 'Now / ASAP', sub: 'Worker arrives within 30-45 minutes' },
                { id: '9:00 AM – 12:00 PM', label: 'Morning (9:00 AM – 12:00 PM)', sub: 'Best for cleaning & plumbing' },
                { id: '12:00 PM – 3:00 PM', label: 'Afternoon (12:00 PM – 3:00 PM)', sub: 'Standard daytime slot' },
                { id: '3:00 PM – 6:00 PM', label: 'Late Afternoon (3:00 PM – 6:00 PM)', sub: 'Popular post-lunch slot' },
                { id: '6:00 PM – 9:00 PM', label: 'Evening (6:00 PM – 9:00 PM)', sub: 'After-work repair slot' }
              ].map((t) => {
                const isSelected = selectedTime === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTime(t.id);
                      setActiveSheet(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--color-accent-subtle)' : 'var(--color-bg)',
                      border: `1.5px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '15px', color: isSelected ? 'var(--color-accent)' : 'var(--color-black)' }}>
                        {t.label}
                      </div>
                      <div className="text-secondary" style={{ fontSize: '12px' }}>{t.sub}</div>
                    </div>
                    {isSelected && <Check size={18} color="var(--color-accent)" strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ServiceSearch;
